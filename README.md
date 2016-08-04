# QuickFinanc
在线记账网站

## 网站结构
前后端分离设计。前端基于reactjs 15.3.0、typescript 1.8.9、dojo 1.10.4实现，后端基于python django 1.9框架、postgre数据库。

## 目标功能实现
1.用户注册登录退出（包括邮箱验证激活功能）。  
2.基本账务管理。  
3.统计、分析。  
4.……  

## 如何启动项目
1.下载项目到本地。  
2.安装项目依赖的组件：python3、django、psycopg2（访问postgre数据库用到的python数据库接口）、nodejs、typescript、gulp、postgre数据库。  
3.配置数据库：新建用户django并设置好密码（密码要与django的quickfinance app的setting文件里的数据库密码一致）、新建数据库quickfinance（ower为django）。  
4.cd到QuickFinance_frontEnd目录，运行npm install命令（安装前端开发需要的包）、运行gulp copytodjango命令（将前端文件复制到django app的static文件夹下）。  
5.cd到QuickFinance目录，运行python manage.py makemigrations quick命令后再运行python manage.py migrate命令（创建项目需要的数据表）、运行python manage.py loaddata  defaultDbData.json命令（插入默认数据到数据库）。  
6.运行python manage.py runserver命令启动项目。  

## 注意事项
1.记得修改seting文件里设置的数据库密码和secret key，文件路径是QuickFinance/QuickFinance/settings.py。  
2.在windows上开发可以用visual studio 2015 community，安装好python ide插件，就可以非常方便的开发和调试python程序了，另外它对typescript和react支持非常友好。 
3.QuickFinance是后端子项目、QuickFinance_frontEnd是前端子项目，可以分开用各ide打开。QuickFinance用python ide打开开发，QuickFinance_frontEnd是前端项目，一般vs code打开开发（在windows上也可以visual studio 2015 community）。  
4.开发前端子项目时，在前端子项目的文件夹下开命令行运行gulp命令后，gulp就会监视文件变化，并把用到的前端文件复制到django app里，不用手动复制和重启，省去一些麻烦的工作。  

## 关于
本项目出于学习研究目的,欢迎大家讨论。代码如有错误，还请不吝指教
