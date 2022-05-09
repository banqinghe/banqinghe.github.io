# 将 hexo 博客部署至 VPS

前几天买一个VPS的初衷只是想要一个聪明一点的搜索引擎和更好的git体验，结果发现如果只是达成这样的效果，我这一月5刀花的确实不是很值，毕竟VPS虽然1G1核，但性能还是有很大溢出。所以我想把自己之前挂载在Github Page上的hexo博客放在VPS上试试。倒也不是为了性能等诸多方面的考虑，只是想试验一下，当做一次对服务器操作的小小入门。

## 已有的条件

1. 本地已经有一个在使用中的hexo博客目录
2. 一个在Vultr上的1G1核20G SSD的VPS，系统为Ubuntu 18.04
3. 域名已经解析至VPS的IP



---



## 在Server上的准备工作

安装git、nodejs、nginx，为了省事，都是直接用apt-get安装的，所以版本一般较为落后，但是不耽误后面的工作和正常的使用。

```shell
apt-get install git nodejs nginx
```

```shell 查看版本
git --version
# git version 2.17.1
node --version
# v8.10.0
nginx -v
# nginx version: nginx/1.14.0 (Ubuntu)
```



## 创建git仓库

原本hexo挂在github上的时候，我们使用git将网站内容push到github的仓库中，现在我们需要做相似的事情，在VPS上建立一个git仓库，允许我们从本地将网站内容push到VPS上的git仓库中。



首先需要添加一个用来管理git事务的用户`git`，此用户为博客在server上的管理者。

```shell
adduser git
```

然后需要赋予该用户可以使用sudo的权限，修改`/etc/sudoers`文件，由于此目录默认只读，所以修改之前需要事先修改权限，让该文件可写，但是最好在修改任务结束之后将权限修改回只读状态。

```shell
vim /etc/sudoers
```

然后在找到`root All=(ALL:ALL) ALL`，在下面一行添加：

```shell
git ALL=(ALL:ALL) ALL
# 如果想达到git用户免密使用sudo的目的，可以在%sudo ...下面一行添加：
git ALL=(ALL) NOPASSWD:ALL
```

现在切换到git用户，并在其主目录下创建git仓库：

```shell
su git
mkdir ~/hexo.git
cd ~/hexo.git
git init --bare
```

这里的`--bare`选项是一定要加的，不加的话创建的是一个普通库（用于在本地使用），加上之后创建的才是我们需要的共享库（其中只有一个`.git`目录），二者的区别可以参照这篇[博客](https://segmentfault.com/q/1010000004683286)。

之后进入hooks目录并写入部署网站的脚本：

```shell
cd ~/hexo.git/hooks
vim post-receive
```

脚本内容如下，作用是将git仓库中的内容部署网站目录（创建目录在第5节）

```shell /home/git/hexo.git/hooks/post-receive
#!/bin/bash
GIT_REPO=/home/git/hexo.git
TMP_GIT_CLONE=/tmp/hexo
PUBLIC_WWW=/var/www/hexo
rm -rf ${TMP_GIT_CLONE}
git clone $GIT_REPO $TMP_GIT_CLONE
rm -rf ${PUBLIC_WWW}/*
cp -rf ${TMP_GIT_CLONE}/* ${PUBLIC_WWW}
```

赋予脚本执行权限

```shell
chmod +x post-receive
```



## 配置ssh

ssh公匙允许我们从本地免密登录和push内容至server，本地用户的ssh公匙在位于`~/.ssh/is_rsa.pub`。

切换至VPS的git用户

```shell
cd ~/.ssh
vim authorized_keys  # 内容为本地主机~/.ssh/is_rsa.pub中的内容
```

修改完毕之后我们就可以尝试在本地登录server上的git用户了：

```shell
ssh git@server的ip
```

如果登录成功则代表这一步完成。



## 创建网站目录

```shell
mkdir /var/www/hexo
```

我们需要确保git用户拥有对上面目录的拥有权：

```shell
chown git:git -R /home/git/hexo.git  # 如果该目录是git创建的，拥有者应该已经是git了
chown git:git -R /var/www/hexo
```



## 配置Nginx

Nginx是一个轻型的Web服务器，和Apache类似。可能是由于版本或系统的差异，我找了很多篇博客才找到符合我的配置。

我Server上的配置文件为`/etc/nginx/sites-available/default`，网上所说的配置文件位置五花八门，在这里耽误了很久时间。

```shell
cd /etc/nginx/sites-available/default
cp default default.bk  # 备份配置文件
vim default
```

将其中server{...}的内容修改如下：

```shell /etc/nginx/sites-available/default
server {
    listen       80 default_server;  #  默认监听80端口
    listen       [::]:80 default_server;
    root /var/www/hexo;   # 换为自己刚刚创建的网站目录
    server_name banqinghe.com www.banqinghe.com;  # 修改为自己的域名
    access_log  /var/log/nginx/hexo_access.log;
    error_log   /var/log/nginx/hexo_error.log;
    error_page 404 =  /404.html;

    location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ {
        root /var/www/hexo;
        access_log   off;
        expires      1d;
    }

    location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
        root /var/www/hexo;
        access_log   off;
        expires      10m;
    }

    location / {
        root /var/www/hexo;
        if (-f $request_filename) {
        rewrite ^/(.*)$  /$1 break;
        }
    }

    location /nginx_status {
        stub_status on;
        access_log off;
    }
}
```

然后重启nginx服务：

```shell
service nginx restart
```

但是我这里没有重启成功，查看信息：

```shell
service nginx status
... nginx: [emerg] bind() to [::]:80 failed...
...
```

可以观察到是80端口无法绑定，显示的是被占用了。原因是时间事件下了一个apache，但是从来没有用过，现在它占着80端口，卸载就可以解决问题了：

```shell
apt-get remove apache2
```



## 本地配置

上面已经完成了server上所需的全部工作，下面需要在本机修改配置文件，修改hexo博客目录的配置文件`_config.yml`，找到如下的部分进行修改：

```yml _config.yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: 
      vultr: git@VPS的IP:hexo.git 
      github: git@github.com:banqinghe/banqinghe.github.io.git
  branch: master
```

使用两个仓库进行了双线部署，毕竟不知道VPS什么时候就挂掉了，备份一个存在github中。

部署博客：

```shell
hexo clean
hexo g
hexo d
```

完成之后就可以输入域名进入网站了。



## SSL证书

没有SSL证书的网站无法通过`https`协议访问，用`http`访问的时候总是会被浏览器打上一个“不安全”的标签。个人博客嘛，本来就没有什么值得多加保护的数据，但是没有`https`看起来不太舒服。网上有多种免费SSL证书的获取途径，因为我半道退了vultr的款，换成了阿里云，所以就直接用了阿里云平台上提供的免费证书，下载下来之后是两个文件：

![SSL证书](https://gitee.com/banqinghe/blog-images/raw/master/%E5%B0%86hexo%E5%8D%9A%E5%AE%A2%E9%83%A8%E7%BD%B2%E8%87%B3VPS/SSL.png)

在服务器上的`/etc/nginx`下创建`cert`目录，把本地的`key`文件和`pem`文件上传至服务器端：

```shell
scp ./* root@ip地址:/etc/nginx/cert/
```

此时就可以开始使用SSL证书，开启443端口。再来修改`/etc/nginx/sites-available/default`文件，在原本server{...}下面添加以下内容（其实就是对前一个server内容进行了以下修改）：

```shell  /etc/nginx/sites-available/default
# HTTPS server
server {
    listen 443  ssl;
    server_name banqinghe.com;
    root        /var/www/hexo;
    ssl_certificate cert/3648701_banqinghe.com.pem;
    ssl_certificate_key cert/3648701_banqinghe.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
    ssl_prefer_server_ciphers on;
    access_log  /var/log/nginx/hexo_access.log;
    error_log   /var/log/nginx/hexo_error.log;
    error_page 404 =  /404.html;

    location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ {
        root /var/www/hexo;
        access_log   off;
        expires      1d;
    }

    location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
        root /var/www/hexo;
        access_log   off;
        expires      10m;
    }

    location / {
        root /var/www/hexo;
        if (-f $request_filename) {
        rewrite ^/(.*)$  /$1 break;
        }
    }

    location /nginx_status {
        stub_status on;
        access_log off;
    }

}
```

之后再重启一下nginx就完成了。



## 总结

这是一篇用于记录过程的博客，适用于我自己，目的是熟悉过程，并且让下次做起来不会那么费力。

~~其实部署完毕之后速度依然一般，但是会显得有趣一些。在上面的部署过程并没有实现SSL证书的获取，所以网站只能通过http访问，而不能使用https，这样不能让对于安全性较为重视的用户满意，我打算在后续的时间里再完善这一工作。~~

原本使用vultr的VPS，但是ping的延迟一直都是300ms左右，在服务器上操作更是慢到让人不能忍，所以我气急败坏地退款了。但是对云服务器的摸索并没有到此为止，我发现阿里云学生机一年114，而且还有个20块钱的优惠券，就买下来了。原本还想着试试不太熟悉的CentOS，然后发现前面记录好的配置过程根本就不适用了，然后就又换成了Ubuntu，SSL证书也顺利地搞起来了。

备案时候的网站名被要求改来改去确实烦人，但是让我有点惊喜的是管局审核只用了三四天，还挺开心的。

希望能写出来一些属于自己的干货吧（😉）

