#!/bin/sh
# kFreeBSD do not accept scripts as interpreters, using #!/bin/sh and sourcing.
if [ true != "$INIT_D_SCRIPT_SOURCED" ] ; then
    set "$0" "$@"; INIT_D_SCRIPT_SOURCED=true . /lib/init/init-d-script
fi
### BEGIN INIT INFO
# Provides:          ibjio
# Required-Start:    $remote_fs $network nginx
# Required-Stop:     $remote_fs $network nginx
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Description:       Starts the ibj.io backend.
### END INIT INFO

# Author: Joseph Hirschfeld <joe@ibj.io>

DIRECTORY=/etc/ibjio

START="npm start"
USER=ibjio

PIDFILE=/var/run/ibjio.pid

start() {
        if [ -f ${PIDFILE} ] && kill -0 $(cat ${PIDFILE}); then
                echo 'Service already running!'>&2
                return 1
        fi
        echo 'Starting service...'>&2
        cd ${DIRECTORY}
        sudo -u ${USER} "${START}" > ${PIDFILE}
        echo 'Service started.'>&2
}

update() {
        if [ -f ${PIDFILE} ] && kill -0 $(cat ${PIDFILE}); then
                echo 'Service already running! Cannot update while running.'>&2
                return 1
        fi
        cd ${DIRECTORY}
        git fetch
        git reset --hard origin/master
        npm install
        chown -R ibjio node_modules/
}
stop() {
        if [ ! -f ${PIDFILE} ] || ! kill -0 $(cat ${PIDFILE}); then
                echo 'Service is not running'>&2
                return 1
        fi
        echo "Stopping Service...">&2
        kill -15 $(cat ${PIDFILE}) && rm -f "$PIDFILE"
        echo "Service stopped.">&2
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        start
        ;;
    update)
        stop
        update
        start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|update}"
esac
