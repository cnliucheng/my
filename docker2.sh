#!/bin/bash

# 定义版本号
DOCKER_COMPOSE_VERSION=2.24.6

function docker_install()
{
    echo "检测Docker是否安装..."
    docker -v 
    if [ $? -ne 0 ]; then
        read -p "检测到Docker未安装, 是否安装？[y/n]: " anzhuang
        if [ "$anzhuang" == "N" ] || [ "$anzhuang" == "n" ]; then
           exit
        fi    
        echo " ***** 开始安装 docker ***** "
        echo "添加docker软件源"
        echo ""
        curl -o /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo
        echo "安装docker软件包"
        echo ""
        yum -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
        echo "启动docker 并设置开机自启"
        echo ""
        systemctl --now enable docker > /dev/null 2>&1
        echo "查看docker版本信息"
        docker version
        echo "docker安装完毕!"
    else
        read -p "检测到 Docker 已安装,是否卸载Docker?(y/n): " xiezai
        if [ "$xiezai" == "Y" ] || [ "$xiezai" == "y" ]; then
           # 停止Docker服务
           sudo systemctl stop docker
           # 移除Docker软件包
           sudo yum remove docker-ce docker-ce-cli containerd.io
           # 删除Docker数据目录
           sudo rm -rf /var/lib/docker
           # 删除Docker配置文件
           sudo rm -rf /etc/docker
           echo "卸载成功,请重新运行脚本进行安装: ./docker2.sh"
           exit
        else   
           echo "docker 已安装!"
        fi  
    fi
}

function docker_compose_install()
{
    docker-compose  version > /dev/null 2>&1
    if [ $? -ne 0 ]; then 
        read -p "检测到docker-compose未安装, 选择官方源0，国内加速源1: " yuan
        if [ $yuan == '0' ]; then
           curl -L https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        else
           curl -L https://mirror.ghproxy.com/https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        fi
        chmod +x /usr/local/bin/docker-compose
        echo "查看docker-compose版本"
        docker-compose version
        echo "docker-compose ${DOCKER_COMPOSE_VERSION} 安装完毕!"
    else
        echo "docker-compose ${DOCKER_COMPOSE_VERSION} 已安装!"
    fi
}

function docker_image_acceleration()
{
    read -p "是否配置docker阿里云镜像加速？[y/n]: " jiasu
    if [ $jiasu == "Y" ] || [ $jiasu == "y" ]; then
    mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
    {
      "registry-mirrors": ["https://tuv7rqqq.mirror.aliyuncs.com"]
    }
EOF
    fi
    systemctl daemon-reload
    systemctl restart docker
}

docker_install
docker_compose_install
docker_image_acceleration