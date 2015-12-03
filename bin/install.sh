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
    chmod -R 777 ./ #Temporary all write access for npm install
    #We have to do this because node-sass seems to fail if not everyone has full permissions.
    #I don't feel like fucking around trying to find why this is, but here is the cheat.

    npm install

    chmod -R 744 ./ #Restrict back down
    chown -R ibjio ./

else
    echo "Nothing to install"
fi