const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.addInitScript(()=>{localStorage.setItem('agenda-template',JSON.stringify('caligrafia'));});
await p.goto('http://localhost:4173/preview?printing=true');await p.waitForTimeout(5000);
await p.emulateMedia({media:'print'});await p.pdf({path:'/tmp/claude-0/-home-claude/a7f3dbb1-c14d-59ea-bc06-b316880ac361/scratchpad/cal.pdf',preferCSSPageSize:true});await b.close()})()
