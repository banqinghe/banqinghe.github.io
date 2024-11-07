---
title: "使用 Pratt Parser 解析表达式"
date: "2024-11-08 00:16:42"
---

最近在读《用 Go 语言自制解释器》这本书，书中的目标是用 Go 来实现一个名为 [Monkey](https://monkeylang.org/)  的编程语言的解释器。我用自己更熟悉的 TypeScript 跟着写了[一个版本](https://github.com/banqinghe/monkey-interpreter-ts)，目前已经实现了 Lexer 和 Parser，能够将 Monkey 代码转化为指定的 AST。

书中介绍的 Parser 几乎全篇都是围绕着 Pratt Parser 这一算法来实现的，核心代码不长，但不好理解。在阅读了作者推荐的 [Pratt Parsers: Expression Parsing Made Easy](https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/) 这篇文章并且自己领悟了一段时间之后，我觉得自己能够理解 Pratt Parser 的逻辑了。上面这篇文章的作者说 Pratt Parser 和快排算法类似，代码实现相当简单，但是理解起来有些弯弯绕绕。

无论如何，开始从头试试理解它。

## 从 LetStatement 开始

Monkey 中的表达式有很多种，包括字面量（`true` ，`false` ，`10` ，`foo`，etc.）、if、算术表达式、函数声明，这种广泛的表达式类型让整个语言语法变得相当灵活：

```
let a = 10;
let b = if (a < 5) { 1; } else { 2; };
let c = -a * (b + 6);
let d = fn(input) {
    return input + 10;
}
```

上面的语句都是 LetStatement，LetStatement 的解析十分简单，直接从左向右解析就行了：

```typescript
// 忽略错误处理
parseLetStatement(): Statement {
    const letToken = this.curToken;
    const name = new Identifier({
        token: this.curToken,
        value: this.curToken.literal,
    });

    this.nextToken();

    const value = // TODO: parseExpression

    if (this.peekTokenIs(Token.SEMICOLON)) {
        this.nextToken();
    }

    return new LetStatement({
        token: letToken,
        name,
        value,
    });
}
```

LetStatement 由三部分组成，token、name 和 value。拿 `let c = -a * (b + 6);` 来举例，token 和 name 很好理解，分别对应 `let` 关键字和标识符 `c`，value，也就是等号之后、分号之前的这段表达式如何解析就没有那么容易了。

## Step 1: 区分前缀和中缀

这里我们来到了 Pratt Parser 的**第一个核心处理逻辑：把所有需要处理的 token 分为前缀和中缀两种，针对每个 token 都声明一个处理它的 parse 函数**。前缀 token 有 `!`、`+`、`-`、`fn`、`if`、`(`、数字|布尔|标识符字面量，中缀 token 则有 `+`、`-`、`*`、`/`、`(` 等。注意有些 token 既可以做前缀，也可以做中缀，最典型的就是加号和减号，`+a` 和 `a + b` 都是合法的表达式。

为了简化复杂度，这里我们只针对含有整数（`Token.INT`）的四则运算表达式来实现 Pratt Parser，四种运算符 token 都可以做中缀，其中 `+-` 两种 token 又可以做前缀。

第一步，针对每种 token 声明对应的处理函数，我们使用 Map 来存储 TokenType → parse function 的映射关系：

```typescript
class Parser {
    // 前缀 token -> parseFn
    prefixParseFns: Map<TokenType, prefixParseFn>;
    // 中缀 token -> parseFn
    infixParseFns: Map<TokenType, infixParseFn>;

    constructor(lexer: Lexer) {
        // ...
        this.prefixParseFns = new Map([
            [Token.INT, this.parseIntegerLiteral.bind(this)],
            [Token.PLUS, this.parsePrefixExpression.bind(this)],
            [Token.MINUS, this.parsePrefixExpression.bind(this)],
        ]);
        this.infixParseFns = new Map([
            [Token.PLUS, this.parseInfixExpression.bind(this)],
            [Token.MINUS, this.parseInfixExpression.bind(this)],
            [Token.SLASH, this.parseInfixExpression.bind(this)],
            [Token.ASTERISK, this.parseInfixExpression.bind(this)],
        ]);
    }
}
```

在前缀处理中，加号和减号生成的都是 PrefixExpression 实例，只有 operator 字段不同，共用一个处理函数即可；中缀处理中四个运算符也是同理，生成的都是 InfixExpression，也可以共享一个处理函数。

PrefixExpression 由 token、operator、right 三部分组成，InfixExpression 则在此基础上多了一个 left 字段，用来表示中缀 token 左侧的表达式。

```typescript
export class PrefixExpression implements Expression {
    token: Token;
    operator: string;
    right: Expression;
}

export class InfixExpression implements Expression {
    token: Token;
    left: Expression;
    operator: string;
    right: Expression;
}
```

有了前缀和中缀对应的 parseFn map，我们现在可以开始写出一个 `parseExpression` 函数的雏形了：

```typescript
parseExpression(): Expression {
    const prefix = this.prefixParseFns.get(this.curToken.type);
    if (!prefix) {
        this.noPrefixParseFnError(this.curToken.type);
        throw new Error(`parseExpression: no prefixFn for token ${this.curToken.type}`);
    }
    const leftExp = prefix();

    const infix = this.infixParseFns.get(this.peekToken.type);
    if (!infix) {
        return leftExp;
    }
    this.nextToken();

    return infix(leftExp);
}
```

捋一下它的逻辑：

1. 先针对当前 token 寻找对应的 prefix parseFn，执行得到 PrefixExpresson
2. 如果下一个 token 存在对应的 infix parseFn，将 PrefixExpression 作为 infix parseFn 的参数，执行得到 InfixExpression

`parseIntegerLiteral` 函数不用多说，它只是直接生成一个 `IntegerLiteral` 对象，仅此而已。

`parsePrefixExpression` 也同样简单，只是声明了一个 PrefixExpression 对象：

```typescript
parsePrefixExpression(): Expression {
    const prefixToken = this.curToken;
    this.nextToken();
    return new PrefixExpression({
        token: prefixToken,
        operator: prefixToken.literal,
        right: this.parseExpression(),
    });
}
```

比较特别的是 PrefixExpression 的 right 字段递归调用了 parseExpression 函数。

`parseInfixExpression` 和 `parsePrefixExpression` 类似，只是添加了对 left 参数的处理：

```typescript
parseInfixExpression(left: Expression): Expression {
    const token = this.curToken;
    this.nextToken();
    return new InfixExpression({
        token,
        left,
        operator: token.literal,
        right: this.parseExpression(),
    });
}
```

现在函数们都准备齐全了，我们来尝试处理 `1 + 2 - 3` 这个表达式，执行 `parseExpression`：

* 1：前缀，执行 `parseIntegerLiteral`，得到 `Integer(1)`
* +：中缀，执行 `parseInfixExpression`，  left 为 `Integer(1)`，operator 为 `+`，right 继续执行 `parseExpression`
  * 2：前缀，执行 `parseIntegerLiteral`，得到 `Integer(2)`
  * -：中缀，执行 `parseInfixExpression`，left 为 `Integer(2)`，operator 为 `-`，right 继续执行 `parseExpression`
    * 3：前缀，执行执行 `parseIntegerLiteral`，得到 `Integer(3)`
    * 没有后续 token，返回 `Integer(3)`
  * 没有后续 token，返回 `InfixExpression {left: 2, operator: -, right: 3}`
* 没有后续 token，返回 `InfixExpression {left: 1, operator: +, right: InfixExpression {left: 2, operator: -, right: 3}}`


可以看到，最终返回了一个合法的 InfixExpression，结构为：

```
InfixExpression {
  left: 1,
  operator: +,
  right: InfixExpression {
    left: 2,
    operator: -,
    right: 3
  }
}
```

观察一下这个结构，可以发现我们的 `parseExpression` 构建出的表达式是**右连接**的。如果表达式是 `1 + 2 + 3 + 4 + 5`，最终应该会得到一个 `(1 + (2 + (3 + (4 + 5))))` 结构的表达式。

这么做有两个问题:

1. 算术表达式从左向右运算更符合直觉，所以 `parseExpression` 构建出的表达式最好是左连接的
2. 我们并没有考虑到运算符的优先级关系，如果使用上面的算法，`1 + 2 * 3 + 4` 会得到 `(1 + (2 * (3 + 4)))`，而我们期待得到的是 `((1 + (2 * 3)) + 4)`，仅仅把表达式从右连接改成左连接并不能符合我们的预期。

## Step 2: 优先级机制

引入优先级机制可以完美地解决之前处理方式的遗留问题，对之前的代码做三步修改就可以了：

1. 为每个运算符定义一个优先级值
   ```typescript
   const LOWEST = 0;
   const SUM = 1; // +
   const PRODUCT = 2; // *

   const precedences = new Map<TokenType, number>([
       [Token.PLUS, SUM],
       [Token.MINUS, SUM],
       [Token.SLASH, PRODUCT],
       [Token.ASTERISK, PRODUCT],
   ]);
   ```
2. 调用 parseExpression 时传入**当前**的优先级
   ```typescript
   // a. 在初始调用时传入最低优先级, 这里以 parseLetStatement 为例
   parseLetStatement(): Statement {
       // ...
       const value = this.parseExpression(LOWEST);
       // ...
   }

   // b. 在 prefix 和 infix parser function 中传入当前运算符对应的优先级
   parsePrefixExpression(): Expression {
       const prefixToken = this.curToken;
       this.nextToken();
       return new PrefixExpression({
           token: prefixToken,
           operator: prefixToken.literal,
           // + - 作为前缀时优先级为 PREFIX (5)
           right: this.parseExpression(PREFIX),
       });
   }
   parseInfixExpression(left: Expression): Expression {
       const token = this.curToken;
       // + - 作为中缀时优先级为 SUM (3)
       // * / 作为中缀时优先级为 PRODUCT (4)
       const precedence = precedences.get(this.curToken.type) || LOWEST;
       this.nextToken();
       return new InfixExpression({
           token,
           left,
           operator: token.literal,
           right: this.parseExpression(precedence),
       });
   }
   ```
3. 在 `parseExpression` 中添加对优先级值的判断，决定是否继续执行 infix parseFn
   ```typescript
   + peekPrecedence() {
   +     return precedences.get(this.peekToken.type) || LOWEST;
   + }

   - parseExpression(): Expression {
   + parseExpression(precedence: number): Expression {
       const prefix = this.prefixParseFns.get(this.curToken.type);
       if (!prefix) {
           this.noPrefixParseFnError(this.curToken.type);
           throw new Error(`parseExpression: no prefixFn for token ${this.curToken.type}`);
       }
       let leftExp = prefix();

   +   while (precedence < this.peekPrecedence()) {
           const infix = this.infixParseFns.get(this.peekToken.type);
           if (!infix) {
               return leftExp;
           }
           this.nextToken();

   +       leftExp = infix(leftExp);
   +   }

       return leftExp;
   }
   ```

第三步添加的 while 循环是算法中很核心的部分，通过比较当前上下文中所处的 precedence 和下一个遇到中缀运算符的 precedence，决定是否要执行 infix parse function。

原本先 prefix fn 再直接 infix fn 的执行流程会导致程序不断陷入 infix fn 中 parseExpression 的递归当中，表达式会不停地向右连接。而添加了此处的 while 之后，执行流程就具有了**选择性**。每次执行到 while 这里，都有两种选择：

1. 直接返回当前 leftExp
2. 对下一个运算符执行对应 infix parse function

也就是说，**执行到任何一个中缀运算符，这里的判断都可以决定是进行左连接还是右连接。**

每次对 `precedence < this.peekPrecedence()` 的判断确保了如果两个相邻的中缀运算符优先级一致，总是不会进入 while 循环，所以式子**默认以左连接的形式解析**。即 `1 + 2 - 3 + 4` -> `(((1 + 2) - 3) + 4)` 。

如果**下一个中缀运算符优先级更大，则会导致右连接**，下面以 `1 + 2 * 3` 为例，完整过一下执行逻辑：

1. 执行 `parseExpression(LOWEST)`
2. 当前优先级为 `LOWEST`
3. `1`：前缀 -> `Integer(1)`
4. 当前优先级 `LOWEST` < 下一个 token `+` 的优先级 `SUM`，进入循环体
5. `+`：中缀，执行 `parseInfixExpression`，left 为 `Integer(1)`，operator 为 `+`，right 执行 `parseExpression(SUM)`
   1. 当前优先级为 `SUM`
   2. `2`：前缀 -> `Integer(2)`
   3. 当前优先级 `SUM` < 下一个 token `*` 的优先级 `PRODUCT`，进入循环体
   4. `*`：中缀，执行 `parseInfixExpression`，left 为 `Integer(2)`，operator 为 `*`，right 执行 `parseExpression(PRODUCT)`
      1. 当前优先级 `PRODUCT`
      2. 3：前缀 -> `Integer(3)`
      3. 当前优先级 `PRODUCT` > 下个 token（分号、关键字、EOF 等）的优先级 `LOWEST`，不进入优先级
      4. 返回 `Ingeter(3)`
   5. 当前优先级 `SUM` > 下个 token（分号、关键字、EOF 等）的优先级 `LOWEST`，退出循环体
   6. 返回 `infixExpression{2 * 3}`
6. 当前优先级 `LOWEST` = 下个 token（分号、关键字、EOF 等）的优先级 `LOWEST`，退出循环体
7. 返回 `infixExpression{1 + infixExpression{2 * 3}}`

这里也可以看出表达式是如何退出的，Monkey 语言把分号 `;` 作为表达式的结尾，分号不在 `precedences` 表中，所以 `peekPrecedence` 得到的值为最小的 `LOWEST`，所有递归的 `parseExpression` 读到这里也就依次返回，最终最外层的 `parseExpression` 返回，得到完整的表达式结果。

这也是在某些情况下不加分号也能正常解析表达式的原因，例如：

```typescript
let a = 1 // -> 下一个 token 为 let, 对应优先级为 LOWEST, 解析结束
let b = a + 1 // -> 下一个 token 为 EOF, 对应优先级为 LOWEST, 解析结束
```

## 针对括号的处理

之前只讨论了只有 `+-*/` 四种运算符的情况，现在讨论有括号 `()` 的情况，其中 `(` 是 prefix，`)` 在这里作为括号表达式的结束符，既不是 prefix 也不是 infix。括号理论上比其他所有运算符的优先级都要高，但是在我们的算法里无需为它定义优先级值，就能实现改变连接性的操作。

先把对左括号 的处理写进 prefix parse fn 的 map 里：

```typescript
this.prefixParseFns = new Map([
    [Token.INT, this.parseIntegerLiteral.bind(this)],
    [Token.PLUS, this.parsePrefixExpression.bind(this)],
    [Token.MINUS, this.parsePrefixExpression.bind(this)],
    [Token.LPAREN, this.parseGroupedExpression.bind(this)],
]);
```

> `(` 在作为函数调用一部分的时候是作为 infix 的，本文没有叙述这种情况，这时候就要为左括号添加优先级了。

这里的 `parseGroupedExpression` 出乎意料的简单：

```typescript
 parseGroupedExpression(): Expression {
    this.nextToken();

    const expression = this.parseExpression(LOWEST);

    // expectPeek 中如果下个 token 是指定值, 则会后移一个 token
    if (!this.expectPeek(Token.RPAREN)) {
        this.peekError(Token.RPAREN);
    }

    return expression;
}
```

只是跳到下一个 token，调用 `parseExpression`，然后就完了？

来试试 `1 + (2 + 3) + 4` 这个式子，看看这对括号是如何影响表达式的连接的

1. **precedence: LOWEST**
2. 1：Ingeter(1)
3. LOWEST < SUM，进入循环体
4. +：parseInfixExpression，left = Ingeter(1)，operator = +，right = parseExpression(SUM)
   1. **precedence：SUM**
   2. (：执行 parseGroupedExpression -> parseExpression(LOWEST)
      1. **precedence：LOWEST**
      2. 2：Integer(2)
      3. +：parseInfixExpression，left = Integer(1)，operator = +，right = parseExpression(SUM)
         1. **precedence：SUM**
         2. 3：Integer(3)
         3. ) 的优先级未定义，所以为 LOWEST，SUM > LOWEST，不进入循环体
         4. return Ingeter(3)
      4. return InfixExpression{2 + 3}
   3. 下个 token 为 )，return InfixExpression{2 + 3}
5. left = InfixExpression{1 + InfixExpression{2 + 3}}
6. LOWEST < SUM，进入循环体
7. +：parseInfixExpression，left = InfixExpression{1 + InfixExpression{2 + 3}}，operator = +，right = parseExpression(SUM)
   1. **precedence：SUM**
   2. 4：Integer(4)
   3. 下一个 token 为 EOF，优先级为 LOWEST，SUM > LOWEST，不进入循环
   4. return Integer(4)
8. return InfixExpression{InfixExpression{1 + InfixExpression{2 + 3}} + 4}

完美得到了 `((1 + (2 + 3)) + 4)` 的结果。

奥妙就在 `parseGroupedExpression` 中调用了一次参数为 `LOWEST` 的 `parseExpression` ，这就开辟了一个全新的上下文，而这个上下文会因为遇到优先级为 LOWEST 的右括号而结束，从而巧妙地把括号内的内容当成了一个独立的表达式来解析。

解析 if 表达式时（`if (condition) {} else {}`）对括号内 condition 的解析、解析函数调用时（`let a = foo(x + y, 123)`）对括号内每个参数的解析，都也是调用 `parseExpression(LOWEST)` 来做到的。这种开辟新的上下文的方式十分实用。

***

理解算法的最好方法果然还是跟着逻辑流走一遍，文章里写了基础完整的执行流程，帮助我自己很好地理解了 Pratt Parser 的过程。

Monkey 语言中还有函数声明等表达式需要解析，在 https://github.com/banqinghe/monkey-interpreter-ts/blob/main/src/parser.ts 有完整的实现。

