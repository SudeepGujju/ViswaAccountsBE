const { spawn } = require('child_process');

/*
const bat = spawn('cmd.exe', ['/c', 'run.bat']);

bat.stdout.on('data', (data)=>{
	console.log(data.toString());
});

bat.stderr.on('data', (data)=>{
	console.error(data.toString());
});

bat.on('exit', (code)=>{
	console.log(`Child Exited with code ${code}`);
})
*/

/*
exec('cd D://Progs//DATABASE && "mongo replication.bat"', (err, stdout, stderr) => {
	if(err){
		console.log(err);
		return;		
	}
	console.log(stdout);
});
*/

/*
const bat = spawn('"mongo replication.bat"', [], {shell: true, detached: true, cwd: 'D://Progs//DATABASE'});
bat.unref();


bat.stdout.on('data', (data)=>{
	console.log( data.toString() );
});

bat.stderr.on('data', (data)=>{
	console.error(data.toString());
});

bat.on('exit', (code)=>{
	console.log(`Child Exited with code ${code}`);
})
*/

//const dir = spawn('cmd.exe', ['/c dir /s'], {shell: true, detached: false, cwd: 'D://Progs//'});
/*
const dir = exec('dir', (err, stdout, stderr) => {
	if(err){
		console.log(err);
		return;		
	}
	console.log(stdout);
});
*/
//console.log(dir)
/*
let i=0;
dir.stdout.on('data', (data)=>{
	i++;
	console.log( i, data.toString() );
});

dir.stderr.on('data', (data)=>{
	console.error(data.toString());
});

dir.on('exit', (code)=>{
	console.log(`Child Exited with code ${code}`);
})
*/

const mongoStart = spawn('cmd.exe', ['/c', '"mongo replication.bat"'], {
  shell: true,
  detached: true,
  cwd: 'D://Progs//DATABASE',
  stdio: 'ignore',
});
mongoStart.unref();

//const appStart = spawn('cmd.exe', ['/c', 'node index.js'], {shell: true, detached: true, cwd: 'D://Progs//ViswaAccountsBE', stdio: 'ignore'});

//appStart.unref();
