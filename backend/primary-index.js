const cluster=require('cluster');
const os=require('os');


const cpuCount =os.cpus().length;

console.log('total num of cpuCount is' + cpuCount);

console.log(`primary id is ${process.pid}`);
cluster.setupPrimary({
    exec: __dirname+ '/index.js'
});

for(let i=0; i<cpuCount;i++){
    cluster.fork();
}

cluster.on('exit',(worker,code,signal)=>{
    console.log(`worker ${worker.process.pid} has been killed`);
    console.log('Starting new worker');
    cluster.fork()
})
