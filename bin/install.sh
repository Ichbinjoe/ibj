#!/bin/bash
if [ ! -w /etc/init.d ]; then
    echo 'Not enough privileges to install.'
    exit 1
fi

ROOTDIR=/etc/ibjio

if ! id -u ibjio &> /dev/null; then
    echo "Adding user \'ibjio\' to system"
    adduser --system --quiet --no-create-home ibjio
fi

if [ ! -d /var/log/ibjio ]; then
    echo "Creating log directory"
    mkdir /var/log/ibjio
    chmod -R 744 /var/log/ibjio
    chown -R ibjio /var/log/ibjio
fi

if [ ! -d ${ROOTDIR} ]; then
    echo "Cloning git from https://github.com/Ichbinjoe/ibj.git"
    git clone https://github.com/Ichbinjoe/ibj.git ${ROOTDIR}

    echo "Installing node dependencies"
    cd ${ROOTDIR}

    echo "Chown/chmod on /etc/ibjio"
    chown -R ibjio ./
    chmod -R 744 ./

    npm install



    if [ ! -f /etc/init.d/ibjio ]; then
    echo "Creating service link"
    ln bin/daemon.sh /etc/init.d/ibjio
    update-rc.d ibjio defaults
    fi

    echo "Starting service..."
    service ibjio start
else
    echo "Service already installed, simply running update"
    service ibjio update
fi