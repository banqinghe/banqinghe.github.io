---
title: "Ubuntu 18.04的美化和配置"
date: "2019-08-01 18:08:26"
---

本文的目的是我记录使用Ubuntu18.04的历程，包括基础的美化和一些配置，以及一些问题的解决方法，主要还是写给自己看。应该会随着我自己对Ubuntu的使用逐渐更新。内容本身算不上原创，毕竟都是我 ~~到处抄写~~ 借鉴各位大佬的博客得到的。

---

## 对主题、图标和登录界面的设置

如果安装ubuntu18.04时选择的是最小安装，则默认不会安装`tweaks`工具（中文名称为“优化”），需要我们手动安装它。该软件允许我们很方便地配置系统的外观。

可以选择用命令行安装：

```shell
sudo apt install gnome-tweak-tool 
```

也可以在软件商店中直接搜索GNOME Tweaks安装

以下是我自己的外观配置：

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/Ubuntu18-04的美化和配置/1.png)

对于主题，我选择的是`Vimix`，图标选择为`Papirus`，shell主题选择的是`Tango暗色`，感觉动画开起来怪怪的，关闭了看起来舒服点。

### 下载并应用主题

https://www.gnome-look.org/   有海量的主题可供选择 。

我之前也是看别人使用`Vimix`，开始真的觉得有点惊为天人的感觉（比默认主题好看不要太多！）。下载在[这里](https://www.gnome-look.org/p/1013698/)    ，解压之后里面有八个主题文件夹，把我只装了`Vimix`一个，直接把它移到 `/usr/share/themes`目录下

```shell
mv /home/<username>/下载/vimix-color/vimix /usr/share/themes
```

然后就可以在tweaks的选项中看到了。

### 图标的下载和安装

Papirus的安装和使用，先添加软件源，再下载安装，接着就可以在`tweaks`中选择使用了

（因为有源的存在，所以图标的内容也是会更新的）

```shell
sudo add-apt-repository ppa:papirus/papirus
sudo apt install papirus-icon-theme
```

系统的图标是存放在` /usr/share/icon`中的各个文件夹中的，可以创建一个文件夹专门用来存储自己从网上下载的图标。如果你想改变软件的图标，可以配置`/usr/share/applications`目录下的各个desktop文件，将其中icon的指向换成你图标的路径就可以了（root用户操作）。

### 美化登录界面

我大概有点强迫症……锁屏有了壁纸，可是一登录输入密码的时候屏幕又变的黑黑的，蛮是不爽。于是就查资料把登录界面和锁屏界面换成了一张图，登录的过程就显得连贯多了。

ubuntu18.04登录背景相关的配置是用css的：`/etc/alternatives/gdm3.css`

修改一下这个文件

```shell
sudo gedit /etc/alternatives/gdm3.css
```

我的默认配置如下（这个最好找地方备份一下）：

```css
#lockDialogGroup {
  background: #2c001e url(resource:///org/gnome/shell/theme/noise-texture.png);
  background-repeat: repeat; 
}
```

把background的图片路径改成你选择的图片的路径，变成这样：

```css
#lockDialogGroup {
  background: #2c001e url(file:///usr/share/backgrounds/mypicture.jpg);         
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center; 
}
```

之后再重启应该就可以成功了，不过我这样改之后有时候开机界面会卡住……不知道是不是因为这个的原因。



---

<br>

## 安装以deepin-wine为环境的软件（QQ、微信、迅雷……）

deepin真的是超级良心！我对这些软件的安装经验基本都是来自https://blog.csdn.net/qq_25987491/article/details/81364461 （ 这位大佬也是学习的别人\_(:зゝ∠)_ ），摸索一下自己慢慢也就知道过程了。

------

**1. 安装deepin-wine环境：**上https://gitee.com/wszqkzqk/deepin-wine-for-ubuntu 页面下载zip包（或用git方式克隆），解压到本地文件夹，在文件夹中打开终端，输入`sudo sh ./install.sh`一键安装。



**2. 安装deepin.com应用容器：**在http://mirrors.aliyun.com/deepin/pool/non-free/d/ 中下载想要的容器，点击deb安装即可。以下为推荐容器:

- QQ：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.qq.im/
- TIM：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.qq.office/
- QQ轻聊版：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.qq.im.light/
- 微信：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.wechat/
- Foxmail：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.foxmail/
- 百度网盘：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.baidu.pan/  （百度网盘已经出了linux版，这个差不多用不到了吧。）
- 360压缩：http://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.cn.360.yasuo/

起初我的疑惑是为什么进去的网站都怪怪的，看起来像被黑客攻击了一样……不过简单明了也挺好的。



**3. Ubuntu 18.04 Gnome桌面显示传统托盘图标：**安装TopIconPlus的gnome-shell扩展，命令：`sudo apt-get install gnome-shell-extension-top-icons-plus gnome-tweaks`，然后用gnome-tweaks开启这个扩展。（这个扩展真的好！）

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/Ubuntu18-04的美化和配置/2.png)





我自己使用过程中的bug：

**QQ**：别人打过来语音电话的时候会闪退，系统设置打不开。

**微信**：经常性出现黑色正方形，也没法关掉……

不过主要还是用来简单的通讯和文件的传输，用起来体验还是很可以的，而且QQ的远程控制功能都可以用诶！隔空演示有点意思的。



---




## 缺少字体的解决方法

使用WPS的时候经常会出现各种缺少字体的情况，宋体黑体、微软雅黑统统没有，解决方法来自https://blog.csdn.net/Box_clf/article/details/85224413

字体的来源最方便的肯定是windows了，在C:\Windows\Fonts里直接拷贝就好了，为了便于查找，中文字体的英文名可以在这里找到https://www.zhangxinxu.com/study/201703/font-family-chinese-english.html

**把已有字体加载进系统的步骤**

1.切换到指定目录：`cd /usr/share/fonts/`

2.创建文件夹：`mkdir chinese`

3.将上面准备好的字体文件拷贝到创建的`chinese`文件夹下

4.修改权限：`chmod -R 755 /usr/share/fonts/chinese`

5.修改配置文件：`vim /etc/fonts/fonts.conf`

在末尾处添加进`chinese`文件夹：

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/Ubuntu18-04的美化和配置/3.png)



6.清除缓存：`fc-cache`



windows中的字体巨多，个人觉得没必要安装这么多，只需要放进去常用的那些就够了。



---



## 先安装ubuntu后安装windows后出现的ubuntu无法进入的问题

主要的原因差不多是windows的启动引导覆盖了原本的ubuntu启动引导，所以安装双系统还是先安装windows是最优解。如果出现了后安装windows后ubuntu无法进入的问题，可以参照https://www.cnblogs.com/lymboy/p/7783756.html

里面需要“删掉的东东”我没有找太清……而且即使修复了需要进入ubuntu还是要进BIOS设置才可以，很麻烦事。所以不如原本就先安装windows再安装ubuntu，省事多了。



---




## 添加GBK编码

windows的GBK编码和ubuntu默认的UTF-8编码不一样，在很多时候是真的烦人，别人给你一些在windows上写的源代码文件，结果你发现里面的中文注释全变成了乱码，真的很影响使用。所以还是安装好GBK编码，以备不时之需比较好。

以root用户的身份`vim /var/lib/locales/supported.d/zh-hans`，我自己是这样，也有博客说是`vim /var/lib/locales/supported.d/local`，总之大差不差。原本里面只有上两行，添加进后三行。

```
zh_CN.UTF-8 UTF-8
zh_SG.UTF-8 UTF-8
zh_CN.GBK GBK
zh_CN.GB2312 GB2312
zh_CN.GB18030 GB18030
```

然后更新编码即可

```shell
dpkg-reconfigure --force locales
```



> 在eclipse中，依次找到：Windows->Preference->General->Workspace，在Text file encoding中选择GBK（没有的话可以强制输入GBK），那么GBK的中文就正常显示了。
>
> 但如果本来就有用UTF_8编码的工程的话，UTF_8的中文编码就会出现问题。（GBK和UTF_8关于中文的编码是不一样的），上面的eclipse的设置方法针对全局，如果只是想修改一两个GBK编码的文件，可以这样做：打开GBK显示乱码的文件，在Edit->Set Encoding，选择other，输入GBK(或GB18030)，done！



## 添加Dash to Panel扩展



这个扩展可以让任务栏变得像windows一样，如果不习惯ubuntu的任务栏和在屏幕正上方显示时间，可以安装这个扩展试试，会有惊喜。
扩展在这里下载： https://extensions.gnome.org/extension/1160/dash-to-panel/
我一开始用chrome打开，结果总是出现上面一行字

>We cannot detect a running copy of GNOME on this system, so some parts of the interface may be disabled. See our troubleshooting entry for more information.

应该是因为要安装扩展，需要安装一个组件，可是chrome的插件就是装不上去（不是很好解决的样子），听网上大佬的建议换成Firefox，这个问题就没了……
点击右上角的开关，一键完成
![](https://raw.githubusercontent.com/banqinghe/blog/main/images/Ubuntu18-04%E7%9A%84%E7%BE%8E%E5%8C%96%E5%92%8C%E9%85%8D%E7%BD%AE/4.png)
再搞一张小米的壁纸，就是这个样子😋

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/Ubuntu18-04%E7%9A%84%E7%BE%8E%E5%8C%96%E5%92%8C%E9%85%8D%E7%BD%AE/5.png)

ps：扩展的开启关闭可以在tweaks中选择

