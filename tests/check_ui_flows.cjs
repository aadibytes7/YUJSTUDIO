/* No-browser smoke test for DEMO workflows. It does not test browser layout. */
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const src=fs.readFileSync(__dirname+'/../app.js','utf8');
const elements=new Map();
function node(id){if(!elements.has(id))elements.set(id,{id,style:{},dataset:{},value:'',innerHTML:'',textContent:'',attributes:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},focus(){},blur(){},addEventListener(){},setAttribute(){},removeAttribute(){},querySelectorAll(){return []},querySelector(){return node('child')},prepend(){},remove(){}});return elements.get(id)}
class FakeFormData{constructor(form){this.map=new Map(Object.entries(form.fields||{}));}entries(){return this.map.entries();}get(name){const x=this.map.get(name);return Array.isArray(x)?x[0]:x}getAll(name){const x=this.map.get(name);return Array.isArray(x)?x:x?[x]:[]}has(name){return this.map.has(name)}}
const local=new Map();
const context={console,Date,Intl,crypto,URL,URLSearchParams,Promise,Map,Set,Array,Number,JSON,String,Object,RegExp,Math,Error,Boolean,FormData:FakeFormData,
 document:{title:'',activeElement:node('active'),getElementById:node,addEventListener(){},querySelectorAll(){return []},createElement(){return node('dynamic-'+Math.random())}},
 window:{scrollTo(){},prompt(){return null}},location:{protocol:'file:'},
 localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v),removeItem:k=>local.delete(k)},setTimeout(){},clearTimeout(){},confirm(){return true},
 fetch:async()=>{throw Error('DEMO SHOULD NEVER CONTACT LIVE API')}
};context.globalThis=context;vm.createContext(context);
vm.runInContext(src+'\nglobalThis.testAPI={state,handleForm,handleAction,render,loadDemo};',context);
async function run(){await new Promise(r=>setTimeout(r,100));const {state,handleForm,handleAction}=context.testAPI;
 const start=state.campaigns.length;
 await handleForm({id:'campaignForm',fields:{name:'New YUJ Awareness Drive',objective:'awareness',brands:['yuj-foundation']}});
 if(state.campaigns.length!==start+1)throw Error('Campaign creation failed');
 const draft=state.content.find(x=>x.status==='draft');
 await handleAction({dataset:{action:'approve',id:draft.id}});
 if(state.content.find(x=>x.id===draft.id).status!=='approved')throw Error('Approval simulation failed');
 const numJobs=state.jobs.length;
 const when=new Date(Date.now()+172800000).toISOString().slice(0,16);
 await handleForm({id:'scheduleForm',dataset:{id:draft.id},fields:{account_ids:['ig-foundation-demo'],scheduled_at:when}});
 if(state.jobs.length!==numJobs+1)throw Error('Scheduling simulation failed');
 if(state.jobs[0].status!=='scheduled')throw Error('Scheduled state incorrect');
 console.log('PASS: create campaign → approve a draft → schedule a post, in DEMO mode only.');
}
run().catch(e=>{console.error(e);process.exit(1)});
