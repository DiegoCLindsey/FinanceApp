var FinanceAppBundle=function(wt){"use strict";var Id=Object.defineProperty;var Ad=(wt,V,G)=>V in wt?Id(wt,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):wt[V]=G;var Un=(wt,V,G)=>Ad(wt,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function J(){return V(new Date)}function He(t,e){return new Date(t,e+1,0).getDate()}function Na(t,e,a){return V(new Date(t,e,Math.min(a,He(t,e))))}function Se(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return Na(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function Ra(t,e){if(!e)return t;const a=G(t);return Se(a.getFullYear(),a.getMonth(),e)??t}const Yn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Jn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ge(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${Jn[a]||a+"º"} ${Yn[o]} del mes`}return t}function se(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function mt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function X(t){return t/100}function W(t){return X(mt(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Oa(t){return(t||0).toFixed(2)+"%"}function Ht(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function qa(t,e,a,o=0){const n=Ht(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,f=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),c=i-u/f;if(Math.abs(c-i)<1e-10){i=c;break}i=c}return(Math.pow(1+i,12)-1)*100}function La(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),f=e/100/12;let c=a,p=Ht(l,e,c);const v=[...s].sort((I,C)=>I.fecha.localeCompare(C.fecha));let b=0;for(let I=1;I<=a*2&&l>.01;I++){const C=new Date(u);u.setMonth(u.getMonth()+1);const x=Ra(V(C),i.diaPago||"");for(;b<v.length&&v[b].fecha<=x;){const $=v[b],m=$.cantidad*(n/100);if(l-=$.cantidad,l=Math.max(0,l),$.tipo==="plazo"?c=Math.ceil(-Math.log(1-l*f/p)/Math.log(1+f)):(c=a-I+1,p=Ht(l,e,c)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:m,capitalPendiente:l,esAmortizacion:!0,simulacion:$.simulacion||!1}),b++,l<.01)break}if(l<.01)break;const g=l*f,h=Math.min(p-g,l);if(l-=h,l<.01&&(l=0),r.push({mes:I,fecha:x,cuota:p,interes:g,amortizacion:h,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),c--,c<=0||l<.01)break}return r}const ka=new Map;function at(t){var C;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((x,g)=>`${x.fecha}|${x.cantidad}|${x.tipo||""}`.localeCompare(`${g.fecha}|${g.cantidad}|${g.tipo||""}`)).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).join(";")}`,o=ka.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,f=La(n,s,i,r,l||0,e,t),c=f.reduce((x,g)=>x+g.interes,0),p=f.reduce((x,g)=>x+g.comisionAmort,0),v=n*((u||0)/100),b=f.filter(x=>!x.esAmortizacion),I={cuota:Ht(n,s,i),totalIntereses:c,tae:qa(n,s,i,u||0),costoTotal:c+p+v,comAp:v,totalComAm:p,fechaFin:((C=b.slice(-1)[0])==null?void 0:C.fecha)||"",mesesReales:b.length,tabla:f};return ka.set(a,I),I}function Ba(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function ft(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter(I=>I.year<=l),f=u.length>0?u[u.length-1]:s[0],c=(f?f.tasa:0)/100,p=new Date(l+1,0,1),v=p<n?p:n,b=se(r,v);i*=Math.pow(1+c,b/365.25),r=v}return i}function Ha(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=se(n,s),r=t?[...t].sort((f,c)=>f.year-c.year):[];let l=0,u=new Date(n);for(;u<s;){const f=u.getFullYear(),c=new Date(f+1,0,1),p=c<s?c:s,v=se(u,p),b=r.filter(x=>x.year<=f),I=b.length>0?b[b.length-1]:null,C=I!==null?I.tasa:o;l+=C*v,u=p}return i>0?l/i:o}function Ga(t,e){return((1+t/100)/(1+e/100)-1)*100}function Wn(t,e,a,o){const n=ft(e,a,o);return n>0?t/n:t}function Kn(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:f=0,gastosBasicos:c=0,gastosOtros:p=0,amortizaciones:v=0}=t,b=l-u-v-c-p,I=b,C=l>0?I/l*100:null,x=r?u-f:u,g=l>0?x/l*100:null,h=l>0?u/l*100:null,$=l>0?(c+u+v)/l*100:null,m=l>0?p/l*100:null,y=(w,_,E)=>w===null?"neutral":w>=_?"verde":w>=E?"amarillo":"rojo",A=(w,_,E)=>w===null?"neutral":w<=_?"verde":w<=E?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:f,gastosBasicos:c,gastosOtros:p,amortizaciones:v,ahorroBruto:b,ahorroReal:I,tasaAhorro:C,dti:g,dtiTotal:h,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:m,semAhorro:y(C,a,o),semDTI:A(g,n,s),semNecesidades:A($,i[0],i[0]+15),semDeseos:A(m,i[1],i[1]+10),semAhorroRegla:y(C,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function vt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function ie(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function Ve(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Va(t,e,a=0){const o=Ve(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Qn(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Ve(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),f=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,c=V(new Date(u.getFullYear(),u.getMonth()+1,0));let p=0;for(const b of r){for(;b.cursor<b.eventos.length&&b.eventos[b.cursor].fecha<=c;)b.saldo=b.eventos[b.cursor].saldoAcum??b.saldo,b.cursor++;p+=b.saldo}const v=i?a.colchonEnFecha(c):0;if(p-v>=t.targetAmount)return f}return null}function Ua(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Ya(t,e){const a=o=>Ua(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ue=t=>t.slice(0,7);function Xn(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function Ye(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Ue(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Ue(e||n.fecha),r=Ue(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=Xn(u)){const f=o.get(u);f!==void 0&&(s=f);const[c,p]=u.split("-").map(Number);l.push({x:G(V(new Date(c,p-1,15))).getTime(),mes:u,y:s})}return l}function Je(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function Zn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ts(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}function Ce(t){var e,a;return((e=t.find(o=>o.esPorDefecto))==null?void 0:e._id)??((a=t[0])==null?void 0:a._id)??"default"}function es(t,e){if(e<=0)return[];const a=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/e),s=o-n*e;return Array.from({length:e},(i,r)=>a*(n+(r<s?1:0)))}function as(t,e,a,o){if(a===0)return{ids:t,cts:e};const n=t.indexOf(o);if(n>=0){const s=[...e];return s[n]+=a,{ids:t,cts:s}}return{ids:[...t,o],cts:[...e,a]}}function Gt(t,e,a){const o=mt(t);if(!e||e.participantes.length===0)return[{personaId:a,importe:X(o)}];const n=e.participantes.map(c=>c.personaId);if(e.modo==="partesIguales"){const c=es(o,n.length);return n.map((p,v)=>({personaId:p,importe:X(c[v])}))}const s=e.participantes.map(c=>{const p=Math.max(0,c.valor??0);return e.modo==="porcentaje"?Math.round(o*p/100):mt(p)}),i=s.reduce((c,p)=>c+p,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const c=o/i,p=s.map(b=>Math.round(b*c)),v=p.reduce((b,I)=>b+I,0);return p.length>0&&(p[0]+=o-v),n.map((b,I)=>({personaId:b,importe:X(p[I])}))}const l=o-i,{ids:u,cts:f}=as(n,s,l,a);return u.map((c,p)=>({personaId:c,importe:X(f[p])}))}function We(t,e){return t.find(a=>a._id===e||e.startsWith(`${a._id}_`))}function os(t,e,a){const o=Ce(a),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of a)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const l=We(e.expenses,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const l=We(e.loans,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const l=We(e.nominas,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function Ke(t,e,a){const o=n=>!n||n.participantes.length===0?[a]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(e)])}const ht=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Qe(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function Mt(t,e){return Qe(t,e).baseImponible}function Ja(t,e){return ut(t,e)/12}const zt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Xe(t,e){if(!t||t<=0)return 0;const a=e||zt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Vt(t,e){if(vt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Xe(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function Me(t,e=new Date){var p;if(vt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((v,b)=>v.fecha.localeCompare(b.fecha));let i=0;const r=s.reduce((v,b)=>v+b.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,f=Math.min(o,i+l*u),c=Math.max(0,o-f);return{saldo:o,disponible:f,bloqueado:c,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((p=s.find(v=>v.fecha>n))==null?void 0:p.fecha)||null}}function Wa(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(vt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,f)=>u+f.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function Ze(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,f)=>u+(f.bruto||0)*(f.nPagas||12),0),i=[...a||[]].sort((u,f)=>u[0]-f[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,f]of i)if(s>=u)r=f;else break;return r}const ta=6.35;function Ft(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Ka(t){return Math.max(0,(t.bruto||0)-Ft(t))}function ns(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function ss(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Ft(r),0),o=Math.max(0,e-a),n=Mt(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Ka(i)/o):0);return s}function ea(t,e,a){if(t.irpfModo==="manual")return Ka(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(Mt(t.bruto||0,Ft(t)),a);const o=ns(e.filter(i=>i.irpfModo!=="manual")),n=ss(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(Mt(t.bruto||0,Ft(t)),a)}function is(t,e){return t.reduce((a,o)=>a+ea(o,t,e),0)}function rs(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Qa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Ft(s),0);return rs(Mt(a,o),e)}function aa(t,e,a){const o=t.bruto||0,n=Ft(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??ta,l=s*(r/100),u=ea(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function ls(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Dt=1500;function Xa(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const re=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function cs(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function Za(t,e){return t.reduce((a,o)=>a+ea(o,cs(o,t),e),0)}function to(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((w,_)=>w+(_.bruto||0),0),i=e.reduce((w,_)=>w+Ft(_),0),r=Qe(s,i),l=t.aportacionesPension,u=Dt,f=Math.min(l,u),c=Math.max(0,r.RNT-r.reducArt20-f),p=re(n.capInmobiliario),v=re(n.capMobiliario),b=re(n.gananciasFondos),I=re(n.otrasCorto),C=re(n.retCapital),x=Math.max(0,c+t.otrosIngresos+p+I),g=Math.max(0,v+b),h=ut(x,a),$=ut(g,o),m=h+$,y=Za(e,a),A=y+C;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:f,RNTred:c,otrosIngresos:t.otrosIngresos,capInmobiliario:p,capMobiliario:v,gananciasFondos:b,otrasCorto:I,baseGeneral:x,baseAhorro:g,cuotaGen:h,cuotaAho:$,cuotaIntegra:m,retNomina:y,retCapital:C,totalRet:A,resultado:m-A}}const ds=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Dt,TRAMOS_AHORRO_DEFAULT:zt,TRAMOS_IRPF_DEFAULT:ht,agregarPorPersona:os,ajustarFechaPago:Ra,ajustarPrecioReal:Wn,calcBaseImponibleTrabajo:Mt,calcFactorInflacion:ft,calcFondoInversion:Vt,calcFondosPension:Me,calcGananciasCapital:Xe,calcIRPF:ut,calcImpuestoPension:Wa,calcInflacionMediaAnual:Ha,calcSaludFinanciera:Kn,calcTAE:qa,calcTipoMarginalPension:Ze,calcTipoRealFisher:Ga,calcularDeclaracion:to,calcularReparto:Gt,clampedDate:Na,cuentasDelObjetivo:Ve,cuotaMensual:Ht,desgloseBaseTrabajo:Qe,diasEntre:se,filtrarPorEscenario:Ya,formatEUR:j,formatLocalDate:V,formatPct:Oa,fromCents:X,haySimulaciones:ts,idPersonaPorDefecto:Ce,ingresoAnual:Xa,labelDiaPago:Ge,lastDayOfMonth:He,modeloFondoDe:vt,parseLocalDate:G,personasImplicadas:Ke,proyectarFechaCumplimiento:Qn,resolverDiaEfectivo:Se,resumenPrestamo:at,resumenPrestamoConAhorro:Ba,retencionMensual:Ja,retencionesNomina:Za,roundMoney:W,saldoEnFecha:ie,saldoEnFechaExtracto:Je,saldoParaObjetivo:Va,saldoRealCuenta:rt,serieMensual:Ye,sinSimulaciones:Zn,tablaAmortizacion:La,toCents:mt,todayISO:J,visibleEnEscenario:Ua},Symbol.toStringTag,{value:"Module"}));function le(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,f=c=>o.push({fecha:c,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&f(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const c=Math.max(1,i.frecuencia||1);let p=r.getFullYear(),v=r.getMonth();const b=Math.ceil(240/c)+2;for(let I=0;I<b;I++){const C=Se(p,v,i.diaPago||"")||(()=>{const g=r.getDate(),h=new Date(p,v+1,0).getDate();return V(new Date(p,v,Math.min(g,h)))})(),x=G(C);if(x>s||x>l)break;x>=n&&x>=r&&f(C),v+=c,v>=12&&(p+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const c=Math.max(1,i.frecuencia||1)*864e5;let p=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/c);p=new Date(r.getTime()+v*c)}for(;p<=s&&p<=l;)f(V(p)),p=new Date(p.getTime()+c)}}return o}function eo(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ao(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>ht),f=o.resolverTramosGanancias||(()=>zt),c=p=>{var v;return((v=r.find(b=>b._id===p))==null?void 0:v.nombre)??p};for(const p of t){if(!p.activo||p.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(p.cuenta||"default")||a.includes(p.cuentaDestino||"default")))continue;const v=G(p.fechaInicio||e.start),b=p.fechaFin?G(p.fechaFin):i,I=C=>{const x=r.find(P=>P._id===(p.cuenta||"default")),g=r.find(P=>P._id===(p.cuentaDestino||"default")),h=vt(x),$=vt(g),m=h==="inversion"&&$==="inversion"||h==="pension"&&$==="pension",y=["transferencia",...m?["traspaso"]:[],...p.tags||[]],A=m?"traspaso-out":"transfer-out",w=m?"traspaso-in":"transfer-in",_=!a||a.length===0||a.includes(p.cuenta||"default"),E=!a||a.length===0||a.includes(p.cuentaDestino||"default");if(_&&n.push({fecha:C,concepto:`Transf. → ${c(p.cuentaDestino||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"gasto",tags:y,cuenta:p.cuenta||"default",sourceId:p._id,sourceType:A}),E&&n.push({fecha:C,concepto:`Transf. ← ${c(p.cuenta||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"ingreso",tags:y,cuenta:p.cuentaDestino||"default",sourceId:p._id,sourceType:w}),_&&!m&&x){if(h==="inversion"){const P=parseInt(C.slice(0,4)),M=Vt(x,f(P));if(M&&M.saldo>0&&M.plusvalia>0){const S=Math.min(1,p.cuantia/M.saldo),z=M.plusvalia*S*.19;z>.01&&n.push({fecha:C,concepto:`Retención IRPF reembolso ${x.nombre} (19% s/plusvalía)`,cuantia:z,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"investment-tax"})}}else if(h==="pension"){const P=u(parseInt(C.slice(0,4))),M=Ze(x,l,P),S=Wa(x,p.cuantia,M||void 0);if(S>0){const F=x.grupoNomina?`IRPF rescate ${x.nombre} (tipo marginal grupo "${x.grupoNomina}": ${M}%)`:`Retención rescate ${x.nombre} (${x.impuestoRetirada}% s/beneficio)`;n.push({fecha:C,concepto:F,cuantia:S,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"pension-tax"})}}}};if(p.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=b&&I(p.fechaInicio);else if(p.tipoFrecuencia==="mensual"){const C=Math.max(1,p.frecuencia||1);let x=v.getFullYear(),g=v.getMonth();const h=Math.ceil(240/C)+2;for(let $=0;$<h;$++){const m=Se(x,g,p.diaPago||"")||(()=>{const A=v.getDate(),w=new Date(x,g+1,0).getDate();return V(new Date(x,g,Math.min(A,w)))})(),y=G(m);if(y>i||y>b)break;y>=s&&y>=v&&I(m),g+=C,g>=12&&(x+=Math.floor(g/12),g=g%12)}}else if(p.tipoFrecuencia==="diaria"){const C=Math.max(1,p.frecuencia||1)*864e5;let x=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const g=Math.ceil((s.getTime()-v.getTime())/C);x=new Date(v.getTime()+g*C)}for(;x<=i&&x<=b;)I(V(x)),x=new Date(x.getTime()+C)}}return n}function oo(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=vt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const f=G(u.fechaInicio||e.start),c=u.fechaFin?G(u.fechaFin):s,p=u.cuentaOrigen||"default",v=!a||!a.length||a.includes(p),b=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",C=m=>{v&&o.push({fecha:m,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:p,sourceId:u._id,sourceType:"aportacion-out"}),b&&o.push({fecha:m,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},x={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let g=f.getFullYear(),h=f.getMonth();const $=Math.ceil(240/x)+2;for(let m=0;m<$;m++){const y=new Date(g,h+1,0).getDate(),A=V(new Date(g,h,Math.min(f.getDate(),y))),w=G(A);if(w>s||w>c)break;w>=n&&w>=f&&C(A),h+=x,h>=12&&(g+=Math.floor(h/12),h=h%12)}}}return o}function no(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",f=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,c=u?1/12:f/(365.25*864e5);let p=ie(s,e.start);const v=o.filter(C=>C.cuenta===s._id).map(C=>({fecha:C.fecha,delta:C.tipo==="ingreso"?Math.abs(C.cuantia):-Math.abs(C.cuantia)})).sort((C,x)=>C.fecha.localeCompare(x.fecha));let b=0,I=new Date(i);for(;I<=r;){const C=u?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+f),x=new Date(Math.min(C.getTime(),r.getTime()+1)),g=V(x);let h=0;for(;b<v.length&&v[b].fecha<g;)h+=v[b].delta,b++;const $=p,m=p+h,y=Math.max(0,($+m)/2);p=m;const A=u?c:(x.getTime()-I.getTime())/(365.25*864e5),w=y*(Math.pow(1+s.interes/100,A)-1);w>.001&&n.push({fecha:V(I),concepto:`Interés ${s.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),I=C}}return n}function so(t,e,a,o=null){const n=[],s=e||ht;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=Ja(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...le([u],a,o))}return n}const us=[5,11,2,8],ps={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function io(t,e,a=null,o=[],n=()=>ht){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const p of t){const v=p.grupoNomina||"";u[v]||(u[v]=[]),u[v].push(p)}for(const p of Object.keys(u))u[p].sort((v,b)=>(b.bruto||0)-(v.bruto||0));function f(p,v){if(!l||!p.mesActualizacionIPC)return p.bruto||0;const b=p.fechaInicio||e.start,I=G(b),C=G(v);let x=0;for(let h=I.getFullYear();h<=C.getFullYear();h++){const $=new Date(h,p.mesActualizacionIPC-1,1);$>I&&$<=C&&x++}if(x===0)return p.bruto||0;const g=V(new Date(I.getFullYear()+x,0,1));return(p.bruto||0)*ft(o,b,g)}function c(p,v){const b=f(p,v),I=(p.retribucionFlexible||[]).reduce((P,M)=>P+(M.importe||0)*12,0),C=Math.max(0,b-I);if(p.irpfModo==="manual")return C*((p.irpfPct||0)/100);const x=n(parseInt(v.slice(0,4))),g=p.grupoNomina||"";if(!g)return ut(Mt(b,I),x);const h=u[g].filter(P=>P.activo),$=h.reduce((P,M)=>P+f(M,v),0),m=h.reduce((P,M)=>P+(M.retribucionFlexible||[]).reduce((S,F)=>S+(F.importe||0)*12,0),0),y=Math.max(0,$-m),A=Mt($,m),w=Math.max(0,b-I),_=y>0?A*(w/y):0,E=h.filter(P=>P._id!==p._id&&(P.bruto||0)>(p.bruto||0)).reduce((P,M)=>{const S=(M.retribucionFlexible||[]).reduce((z,T)=>z+(T.importe||0)*12,0),F=Math.max(0,f(M,v)-S);return P+(y>0?A*(F/y):0)},0);return ut(E+_,x)-ut(E,x)}for(const p of t){if(!p.activo)continue;const v=p.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const b=Math.max(1,p.nPagas||12),I=G(p.fechaInicio||e.start),C=p.fechaFin?G(p.fechaFin):r,x=g=>{const h=f(p,g),$=c(p,g),m=(p.retribucionFlexible||[]).reduce((S,F)=>S+(F.importe||0)*12,0),y=Math.max(0,h-m),A=(p.ssPct??6.35)/100,w=y*A,_=y/b,E=$/b,P=w/b,M=p.representacion==="simplificado"?_-P-E:_;s.push({fecha:g,concepto:p.nombre,cuantia:M,tipo:"ingreso",cuenta:v,tags:p.tags||[],sourceId:p._id,sourceType:"nomina"}),p.representacion==="detallado"&&(P>0&&s.push({fecha:g,concepto:`SS ${p.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:p._id+"_ss",sourceType:"nomina"}),E>0&&s.push({fecha:g,concepto:`IRPF ${p.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:p._id+"_irpf",sourceType:"nomina"}));for(const S of p.retribucionFlexible||[])!S.cuenta||!(S.importe>0)||a&&a.length>0&&!a.includes(S.cuenta)||s.push({fecha:g,concepto:`${p.nombre} — ${ps[S.tipo]||S.tipo}`,cuantia:S.importe,tipo:"ingreso",cuenta:S.cuenta,tags:["retribucion-flexible",S.tipo],sourceId:`${p._id}_flex_${S._id||S.tipo}`,sourceType:"nomina"})};if(b<=12){const g=b===12?1:Math.round(12/b),h=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let y=0;y<300;y++){const A=new Date($,m+1,0).getDate(),w=new Date($,m,Math.min(h,A));if(w>r||w>C)break;w>=i&&w>=I&&x(V(w)),m+=g,m>=12&&($+=Math.floor(m/12),m=m%12)}}else{const g=b-12,h=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let w=0;w<300;w++){const _=new Date($,m+1,0).getDate(),E=new Date($,m,Math.min(h,_));if(E>r||E>C)break;E>=i&&E>=I&&x(V(E)),m++,m>=12&&($++,m=0)}const y=Math.max(I.getFullYear(),i.getFullYear()),A=Math.min((p.fechaFin?C:r).getFullYear(),r.getFullYear());for(let w=y;w<=A;w++)for(const _ of us.slice(0,g)){const E=new Date(w,_,15);E>=i&&E<=r&&E>=I&&E<=C&&x(V(E))}}}return s}function ro(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=J(),u=t.filter(c=>c.activo&&c.tipo==="gasto"&&c.tipoFrecuencia==="mensual");let f=new Date(i.getFullYear(),i.getMonth(),1);for(;f<=r;){const c=f.getFullYear(),p=f.getMonth(),v=c+"-"+String(p+1).padStart(2,"0"),b=v+"-01",I=V(new Date(c,p+1,0)),C=V(new Date(c,p,15));let x=0;for(const g of u){if(o&&o.length>0&&!o.includes(g.cuenta||"default")||g.fechaInicio&&g.fechaInicio>I||g.fechaFin&&g.fechaFin<b)continue;const h=g.fechaInicio||l,$=ft(e,h,C);if($<=1)continue;const m=Math.max(1,g.frecuencia||1);x+=g.cuantia*($-1)/m}x>.01&&s.push({fecha:C,concepto:"Incremento coste de vida",cuantia:x,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),f=new Date(c,p+1,1)}return s}function lo(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,f)=>u.year-f.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),f=l.getMonth(),c=u+"-"+String(f+1).padStart(2,"0"),p=V(new Date(u,f,15)),v=r.filter(g=>g.year<=u),b=v.length>0?v[v.length-1]:r[0],I=b?b.tasa/100:0,C=Math.pow(1+I,1/12)-1,x=t*C;x>.01&&n.push({fecha:p,concepto:"Pérdida ahorro por inflación",cuantia:x,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+c,sourceType:"inflacion"}),l=new Date(u,f+1,1)}return n}function co(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((c,p)=>c+ie(p,n),0),i=t.filter(c=>c.fecha<n),r=t.filter(c=>c.fecha>=n),l=[];let u=s;for(const c of[...i].reverse()){const p=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);l.unshift({...c,delta:p,saldoAcum:u}),u-=p}const f=[];u=s;for(const c of r){const p=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);u+=p,f.push({...c,delta:p,saldoAcum:u})}return[...l,...f]}function ms(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return co([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function ce(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter(I=>I.tipo!=="transferencia"),f=a.filter(I=>I.tipo==="transferencia"),c={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let p=[];p=p.concat(le(u,l,s)),p=p.concat(eo(e,l,s)),p=p.concat(ao(f,l,s,c)),p=p.concat(oo(o,l,s));const v=no(o,l,s,p);if(p=p.concat(v),p=p.concat(so(a,n.tramos_irpf,l,s)),p=p.concat(io(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const I=(o.find(g=>g.activo&&g.esCuentaPrincipal)||o.find(g=>g.activo)||{_id:"default"})._id;p=p.concat(ro(u,r,l,s,I));const x=o.filter(g=>g.activo&&(!s||s.length===0||s.includes(g._id))).reduce((g,h)=>g+ie(h,n.dashboardStart),0);p=p.concat(lo(x,r,l,I))}p.sort((I,C)=>I.fecha.localeCompare(C.fecha));const b=o.filter(I=>I.activo&&(!s||s.length===0||s.includes(I._id)));return co(p,b,n)}function fs(t,e,a=null){const o=J(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function uo(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function vs(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${j(i)})`})))}return a}function gs(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function bs(t,e,a=J()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const f of r.historicoSaldos||[])f.fecha<=a&&(!l||f.fecha>=l)&&(u[f.fecha]=f.saldo);return Object.keys(u).forEach(f=>o.add(f)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const f=Object.entries(n[u]).filter(([c])=>c<=r);f.length>0?(f.sort(([c],[p])=>p.localeCompare(c)),l+=f[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[f])=>u.localeCompare(f))){const u=t.filter(v=>v.fecha<=r),f=u.length>0?u[u.length-1].saldoAcum:null;if(f===null)continue;const c=l-f,p=f!==0?c/Math.abs(f)*100:0;i.push({cuenta:"Total",fecha:r,estimado:f,real:l,desv:c,pct:p})}return i}const hs=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:bs,detectarPuntosCriticos:vs,mediaMensualGastos:gs},Symbol.toStringTag,{value:"Module"}));function de(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return le(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function oa(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Ht(a.capital,a.tin,a.meses),0)}function po(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(de(t,o)+oa(a))*(e.colchonMeses||6)}function mo(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(de(t,n)+oa(a))*(i.meses||6):po(t,e,a,n)}function Ee(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((f,c)=>f.fecha.localeCompare(c.fecha)),l=r.filter(f=>f.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(de(e,i)+oa(o))*(l.meses||1):0}function ys(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function xs(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=ys(o)),{fecha:o.fecha,saldos:{...a}}))}function $s(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let f=0;f<e.length;f++){const c=e[f],p=Ee(l,o,n,s,c.fecha,!1,i);if(p<=0){u=!1;continue}const v=!l.cuentas||l.cuentas.length===0?c.saldoAcum:l.cuentas.reduce((b,I)=>{var C,x;return b+(((x=(C=a[f])==null?void 0:C.saldos)==null?void 0:x[I])||0)},0);v<p&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:c.fecha,saldo:v,target:p,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(v)} < ${j(p)} desde ${c.fecha}`})):v>=p&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:c.fecha,saldo:v,target:p,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${c.fecha}`}))}}return r}const Is=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:po,calcColchonEnFecha:mo,calcGastoBasicoMensual:de,calcMargenEnFecha:Ee,detectarCrucesMargenes:$s,saldosPorCuentaEnExtracto:xs},Symbol.toStringTag,{value:"Module"}));function As(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function fo(t,e){return se(G(t),G(e))}const ws=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function vo(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${ws[o-1]}${s?"":` de ${a}`}`}function go(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Ss(t,e={}){const{hoy:a=J(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const c of t.puntosCriticos??[])c.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:p=>p?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:p=>`El ${p} el saldo proyectado baja a ${j(c.saldo)}.`}):c.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:p=>p?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:p=>`El ${p} el saldo queda en ${j(c.saldo)}, por debajo del colchón.`});for(const c of t.crucesMargenes??[])c.tipo==="bajo_margen"&&r.push({id:`margen:${c.nombre}`,gravedad:"aviso",fecha:c.fecha,distancia:Math.max(0,c.target-c.saldo),titulo:p=>p?`Podrías bajar de «${c.nombre}»`:`Bajas de «${c.nombre}»`,detalle:p=>`El ${p} tendrías ${j(c.saldo)}, y el margen pide ${j(c.target)}.`});const l=new Map;for(const c of r){const p=l.get(c.id);(!p||c.fecha<p.fecha)&&l.set(c.id,c)}const u=[];for(const c of l.values()){const p=fo(a,c.fecha);if(p<0||p>(c.gravedad==="critico"?o:n))continue;const v=i?i(p):0,b=v>0&&c.distancia<v;u.push({id:c.id,gravedad:c.gravedad,fecha:c.fecha,dias:p,plazo:go(p),titulo:c.titulo(b),detalle:c.detalle(vo(c.fecha,a)),incierto:b})}const f={critico:0,aviso:1};return u.sort((c,p)=>c.fecha.localeCompare(p.fecha)||f[c.gravedad]-f[p.gravedad]),u.slice(0,s)}const Cs=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:As,construirAvisos:Ss,describirPlazo:go,diasEntreISO:fo,fechaEnPalabras:vo},Symbol.toStringTag,{value:"Module"}));class Ms extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Un(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let ue=null;function Es(t){const e=ue;return ue=t,()=>{ue=e}}function bo(t){return ue?ue(t):!0}function ho(t,e){if(!bo(t))throw new Ms(t,e)}const yo=[];function na(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const f=a++;return e.set(l,f),f},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),f=t.get(u);if(f)return n++,f;o++;const c=ce(l);return t.set(u,c),c}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function sa(t,e,a,o,n={},s=na()){ho("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:f=null,loanIds:c=null,nominas:p=yo,sourceAccountId:v=null,selectedMarginIds:b=null,hoy:I=new Date}=n,C=V(I),x=Math.min(120,Math.max(1,r)),g=a.filter(q=>q.activo),h=g.map(q=>q._id),$=g.find(q=>q.esCuentaPrincipal)||g[0],m=v&&h.includes(v)?g.find(q=>q._id===v):$,y=m==null?void 0:m._id,A=t.filter(q=>q.activo&&!q.simulacion&&(!c||c.includes(q._id))).sort((q,H)=>H.tin-q.tin),w=!!b&&b.length>0,_=(o.margenesSeguridad||[]).filter(q=>q.activo!==!1).filter(q=>!q.cuentas||q.cuentas.length===0||q.cuentas.includes(y)).filter(q=>!w||b.includes(q._id));if(A.length===0)return{plan:[],margenesAplicados:_.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const E={};for(const q of A)E[q._id]=[];const P=[];function M(q){const H=new Date(I.getFullYear(),I.getMonth()+q,1),Y=H.getFullYear(),K=H.getMonth(),Q=`${Y}-${String(K+1).padStart(2,"0")}`,nt=V(new Date(Y,K,Math.min(15,new Date(Y,K+1,0).getDate())));return{label:Q,dia15:nt}}function S(q,H){const Y=[...q.amortizaciones||[],...E[q._id]],{tabla:K}=at({...q,amortizaciones:Y}),Q=K.filter(st=>st.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const nt=Y.filter(st=>st.fecha<=H).reduce((st,bt)=>st+bt.cantidad,0);return Math.max(0,q.capital-nt)}function F(q){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],...E[it._id]||[]]})),Y={...o,dashboardStart:C,dashboardEnd:q},K=s.statement({loans:H,expenses:e,accounts:a,config:Y,filtroAccounts:null,nominas:p}),Q=g.reduce((it,ne)=>it+rt(ne),0),nt=m?rt(m):0,st=Q>0?nt/Q:1;let bt=nt,Ae=Q;for(const it of K){const ne=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===y?bt+=ne:h.includes(it.cuenta)||(bt+=ne*st),Ae=it.saldoAcum}return{source:bt,total:Ae}}function z(q){const{source:H}=F(q);if(H<=0)return H;let Y=0;for(const K of _){const Q=Ee(K,e,o,t,q,!0,I);Q>Y&&(Y=Q)}return H-Y}const T=2;let R=0;if(f){for(let q=0;q<x;q++)if(M(q).dia15>=f){R=q;break}}for(let q=0;q<x;q++){if((q-R)%i!==0||q<R)continue;const{label:H,dia15:Y}=M(q);if(Y<C)continue;const K=z(Y)-T;if(K<l)continue;let Q=K,nt=0;for(const st of A){if(Q<l)break;const bt=S(st,Y);if(bt<1)continue;const Ae=st.comisionAmort||0,it=1+Ae/100,ne=Math.floor(Q/it),Gn=Math.min(ne,bt);if(Gn<l)continue;const we=Math.min(Math.floor(Gn),Math.floor(bt)),Vn=+(we*Ae/100).toFixed(2),Ta=we+Vn;Ta>Q||(E[st._id].push({_id:`opt_${H}_${st._id}`,fecha:Y,cantidad:we,tipo:u,simulacion:!0}),nt+=Ta,P.push({mes:H,fechaAmort:Y,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:bt,cantidadAmort:we,comision:Vn,capitalDespues:Math.max(0,bt-we),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-nt,tipoAmort:u}),Q-=Ta)}}const D=P.reduce((q,H)=>q+H.cantidadAmort,0),O=P.reduce((q,H)=>q+H.comision,0),k=A.map(q=>{const H=E[q._id];if(!H.length)return null;const Y=at(q),K=at({...q,amortizaciones:[...q.amortizaciones||[],...H]});return{loanId:q._id,nombre:q.nombre,tin:q.tin,fechaFinSin:Y.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:Y.mesesReales-K.mesesReales,interesesSin:Y.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:Y.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,nt)=>Q+nt.cantidad,0)}}).filter(q=>q!==null),B=k.reduce((q,H)=>q+H.ahorroIntereses,0);return{plan:P,margenesAplicados:_.length,totalAmortizado:D,totalComisiones:O,totalAhorroIntereses:B,resumenPorLoan:k}}function xo(t,e,a,o,n={},s){ho("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:f=[1,2,3,6,12],fechaPrimeraAmort:c=null,loanIds:p=null,nominas:v=yo,sourceAccountId:b=null,selectedMarginIds:I=null,hoy:C=new Date}=n,x=s??na(),g=V(C),h=u||V(new Date(C.getFullYear(),C.getMonth()+i,1));function $(A){const w=t.map(M=>({...M,amortizaciones:[...M.amortizaciones||[],...A[M._id]||[]]})),_={...o,dashboardStart:g,dashboardEnd:h},E=x.statement({loans:w,expenses:e,accounts:a,config:_,filtroAccounts:null,nominas:v});if(E.length===0)return a.filter(M=>M.activo).reduce((M,S)=>M+rt(S),0);const P=E.filter(M=>M.fecha<=h);return P.length>0?P[P.length-1].saldoAcum:E[0].saldoAcum}const m=$({}),y=f.map(A=>{const w=sa(t,e,a,o,{frecuencia:A,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:c,loanIds:p,nominas:v,sourceAccountId:b,selectedMarginIds:I,hoy:C},x),_={};for(const P of t)_[P._id]=[];for(const P of w.plan)_[P.loanId].push({_id:P.mes+"_"+P.loanId,fecha:P.fechaAmort,cantidad:P.cantidadAmort,tipo:l,simulacion:!0});const E=$(_);return{frecuencia:A,label:A===1?"Mensual":`Cada ${A} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:E,gananciaSaldo:E-m,valorTotal:w.totalAhorroIntereses+(E-m),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(A=>A.numAmortizaciones>0);if(y.length>0){const A=Math.max(...y.map(E=>E.ahorroIntereses)),w=Math.max(...y.map(E=>E.saldoObjetivo)),_=Math.max(...y.map(E=>E.valorTotal));y.forEach(E=>{E.esMejorIntereses=E.ahorroIntereses===A,E.esMejorSaldo=E.saldoObjetivo===w,E.esMejorValor=E.valorTotal===_})}return{resultados:y,saldoBase:m,fechaObjetivo:h}}const _s=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:xo,createStatementMemo:na,defaultHoyISO:J,optimizarAmortizaciones:sa},Symbol.toStringTag,{value:"Module"})),js=30.44*864e5;function $o(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,He(e,a)))}}function Io(t){const[e,a]=t.split("-").map(Number);return $o(new Date(e,a-1,1))}function Ps(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/js)}const zs=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Et=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Fs(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Ds(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=p=>p.sourceType==="loan"&&p.tipo==="gasto",n=e.loanIdsIniciados,s=Et(t.filter(p=>p.tipo==="ingreso")),i=Et(t.filter(p=>o(p)&&(!n||n.has(p.sourceId??"")))),r=Et(t.filter(p=>o(p)&&e.hipotecaIds.has(p.sourceId??""))),l=Et(t.filter(p=>p.sourceType==="loan-amort")),u=Et(t.filter(p=>p.sourceType==="account-interest")),{basicos:f,deseo:c}=Fs(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:f/a,gastosDeseo:c/a,gastosTotales:(i+f+c)/a,intereses:u/a}}function Ao(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Ts(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,f)=>{if((f.amortizaciones||[]).filter(b=>b.fecha>=e&&b.fecha<=a).length===0)return u;const p=at(f).totalIntereses,v=at({...f,amortizaciones:(f.amortizaciones||[]).filter(b=>b.fecha<e||b.fecha>a)}).totalIntereses;return u+Math.max(0,v-p)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>at(u).tabla),l=u=>{const{desde:f,hasta:c}=Io(u);return r.reduce((p,v)=>{const b=v.find(I=>!I.esAmortizacion&&I.fecha>=f&&I.fecha<=c);return p+(b?b.cuota:0)},0)};return{deudaInicio:Ao(n,e),deudaFin:Ao(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Ns(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Et(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function wo(t,e=new Set,a="desglosado"){if(e.size===0)return uo(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function Rs(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...wo(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Os(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Et(t.filter(o=>o.tipo==="gasto")),totalIngresos:Et(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function qs(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Ls(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ks(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Bs(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const f=a(u.fecha),c=u.saldoAcum??i;(!l||l.periodo!==f)&&(l&&(i=l.cierre),l={periodo:f,inicio:o(f),apertura:i,cierre:c,maximo:Math.max(i,c),minimo:Math.min(i,c),eventos:0},r.push(l)),l.cierre=c,c>l.maximo&&(l.maximo=c),c<l.minimo&&(l.minimo=c),l.eventos+=1}return r}const Hs=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Bs,cuentasVisibles:qs,gastoPorTagOrdenado:Rs,idsHipoteca:Ls,idsPrestamosIniciados:ks,interesesPorCuenta:Ns,mesesDelPeriodo:Ps,metricasFlujo:Ds,rangoMes:Io,rangoMesDe:$o,resumenPrestamosPeriodo:Ts,sinTransferencias:zs,sumarGastosPorTag:wo,totalesPeriodo:Os},Symbol.toStringTag,{value:"Module"}));function Gs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function yt(t,e){return a=>Gs(t,e,a)}const pe=9,So=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Co=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ia(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}const Mo="default";function Eo(){return{_id:Mo,nombre:"Yo",esPorDefecto:!0,activo:!0}}function _o(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:So,tramosGananciasCapital:Co,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function jo(t,e){return{loans:[],expenses:[],accounts:[ia(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],personas:[Eo()],config:_o(t,e)}}const xt=t=>Array.isArray(t)?t:[],Vs=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function me(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Po(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function ra(t){const{varianza:e,inflacion:a,...o}=t;return o}function Us(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Vs(t.config),r={..._o(a,o)};for(const[f,c]of Object.entries(s))c!=null&&(r[f]=c);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=So),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Co),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=xt(t.accounts).map(f=>{const c={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...f};return c.modeloFondo||(c.modeloFondo=c.esFondoPension?"pension":"cuenta"),delete c.esFondoPension,Array.isArray(c.historicoSaldos)||(c.historicoSaldos=[]),me(c)});l.length===0&&(l=[ia(a)]);const u=l.filter(f=>f.esCuentaPrincipal);if(u.length===0){const f=l.find(c=>c._id==="default")||l[0];l=l.map(c=>({...c,esCuentaPrincipal:c._id===f._id}))}else if(u.length>1){let f=!1;l=l.map(c=>c.esCuentaPrincipal?f?{...c,esCuentaPrincipal:!1}:(f=!0,c):c)}return n.accounts=l,n.expenses=xt(t.expenses).map(f=>{const c={basico:!1,activo:!0,tags:[],historialPrecios:[],...f};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.historialPrecios)||(c.historialPrecios=[]),c.diaPago=Po(c.diaPago),ra(me(c))}),n.loans=xt(t.loans).map(f=>{const c={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...f};return Array.isArray(c.tags)||(c.tags=[]),c.diaPago=Po(c.diaPago),c.amortizaciones=xt(c.amortizaciones).map(p=>me(p)),ra(me(c))}),n.nominas=xt(t.nominas).map(f=>{const c={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...f};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.retribucionFlexible)||(c.retribucionFlexible=[]),ra(me(c))}),n.goals=xt(t.goals).map((f,c)=>{const p=Array.isArray(f.cuentaIds)?f.cuentaIds:f.cuentaId?[f.cuentaId]:[],{cuentaId:v,...b}=f;return{prioridad:c+1,completado:!1,usarColchon:!0,targetAmount:0,...b,cuentaIds:p}}),n.inflacion=xt(t.inflacion),n.tramosIRPFHistorico=xt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=xt(t.tramosGananciasCapitalHistorico),n.escenarios=xt(t.escenarios).map(({inversiones:f,...c})=>c),n}const Ut=t=>Array.isArray(t)?t:[];let la=0;function Ys(t){return la+=1,`${t}_${la.toString(36)}`}const Js=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ws=t=>typeof t=="number"&&Number.isFinite(t);function Ks(t,e){const a={...t};la=0;const o=Ut(t.transacciones),n=Ut(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,f,c,p)=>{if(!Js(f)||!Ws(c))return;const v=`${u}|${f}`;i.has(v)||(i.add(v),s.push({_id:Ys("pc"),fecha:f,cuentaId:u,saldoCts:mt(c),...typeof p=="string"&&p?{nota:p}:{}}))};for(const u of Ut(t.accounts)){const f=typeof u._id=="string"?u._id:null;if(f)for(const c of Ut(u.historicoSaldos))r(f,c.fecha,c.saldo,c.nota)}const l=Ut(t.history);if(l.length>0){const u=Ut(t.accounts),f=u.find(p=>p.esCuentaPrincipal)||u.find(p=>p.activo)||u[0],c=typeof(f==null?void 0:f._id)=="string"?f._id:"default";for(const p of l){const v=typeof p.cuenta=="string"?p.cuenta:typeof p.cuentaId=="string"?p.cuentaId:c;r(v,p.fecha,p.saldo,p.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,f)=>String(u.fecha).localeCompare(String(f.fecha))),a}const ca=t=>Array.isArray(t)?t:[],Qs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xs=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let da=0;function Zs(){return da+=1,`tx_hp_${da.toString(36)}`}function ti(t,e){const a={...t};da=0;const o=[...ca(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=ca(t.expenses).map(i=>{const r=ca(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",f=i.tipo==="ingreso"?"ingreso":"gasto",c=Array.isArray(i.tags)?i.tags.filter(b=>typeof b=="string"):[];if(l)for(const b of r){if(!b||!Qs(b.fecha)||!Xs(b.cuantia))continue;const I=f==="ingreso"?mt(b.cuantia):-mt(b.cuantia),C=`${l}|${b.fecha}|${I}`;n.has(C)||(n.add(C),o.push({_id:Zs(),fecha:b.fecha,cuentaId:u,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:c,estimacionId:l,tipo:f,origen:"importado",nota:typeof b.nota=="string"&&b.nota?b.nota:"Importado del historial de precios"}))}const{historialPrecios:p,...v}=i;return v});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const zo=t=>Array.isArray(t)?t:[],_t=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Yt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,ei=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function ai(t,e){var f;const a={...t};if(Array.isArray(a.planes))return a;const o=zo(a.goals),n=zo(a.accounts),s=n.map(c=>{const p=Yt(c.bloqueoMeses,0);return{_id:`veh_${_t(c._id,"x")}`,nombre:_t(c.nombre,"Cuenta"),rentabilidadRealAnual:Yt(c.interes,0)/100,liquidez:c.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":p>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Yt(c.impuestoRetirada,0)/100,topeAportacionAnual:c.modeloFondo==="pension"?mt(1500):null,riesgo:c.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:_t(c._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Yt(c.interes,0)>0}}),i=new Map(n.map((c,p)=>[_t(c._id,""),s[p]._id])),r=((f=s[0])==null?void 0:f._id)??"",l=o.map((c,p)=>{const v=Array.isArray(c.cuentaIds)?c.cuentaIds.map(I=>_t(I,"")):[],b=ei(c.targetDate);return{_id:_t(c._id,`obj_mig_${p}`),nombre:_t(c.nombre,`Objetivo ${p+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:mt(Yt(c.targetAmount,0)),fechaLimite:b,prioridad:Yt(c.prioridad,p+1),modoAsignacion:b?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:c.completado===!0?"COMPLETADO":"PENDIENTE",notas:_t(c.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}function oi(t,e){const a={...t},o=Array.isArray(a.personas)?a.personas:[];return o.some(n=>(n==null?void 0:n._id)===Mo)||(a.personas=[Eo(),...o]),a}const ni=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Us},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Ks},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ti},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:ai},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:oi}],si=["history"];function Fo(t,e,a){let o=t;const n=[];for(const s of[...ni].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const jt="state_",_e="state__schemaVersion",Jt="financeapp_",ua="state__modificadoEn";function Do(t=localStorage,e=Jt){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==ua&&t.setItem(a(ua),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function ii(t=localStorage,e=Jt){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(jt)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function ri({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const li={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function ci(t,e){const a=li[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function di(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function ui({adapter:t,hoy:e=new Date}){const a=V(e),o=di(e);let n=jo(a,o);const s=new Set;let i=[];const r=ri();function l(M){for(const S of s)S(M)}function u(M){t.set(`${jt}${M}`,n[M])}function f(){const M={};for(const T of Object.keys(n)){const R=t.get(`${jt}${T}`);R!==null&&(M[T]=R)}for(const T of si){const R=t.get(`${jt}${T}`);R!==null&&(M[T]=R)}const S=t.get(_e),{state:F,applied:z}=Fo(M,S,{hoyISO:a,finISO:o});if(n=F,c(),z.length>0){for(const T of Object.keys(n))u(T);t.set(_e,pe)}return i=z,{applied:z}}function c(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[ia(a)],u("accounts");return}const M=n.accounts.filter(S=>S.esCuentaPrincipal);if(M.length===0)n.accounts=n.accounts.map((S,F)=>F===0?{...S,esCuentaPrincipal:!0}:S),u("accounts");else if(M.length>1){let S=!1;n.accounts=n.accounts.map(F=>F.esCuentaPrincipal?S?{...F,esCuentaPrincipal:!1}:(S=!0,F):F),u("accounts")}}function p(M){return n[M]}function v(M,S){n[M]=S,u(M),l(M)}function b(M){v("config",{...n.config,...M})}function I(M){return s.add(M),()=>s.delete(M)}function C(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function x(M,S){const F=[...n[M]],z={...S,_id:C()};return F.push(z),v(M,F),z}function g(M,S,F){const z=n[M].map(T=>T._id===S?{...T,...F}:T);v(M,z)}function h(M,S){const F=n[M],z=F.findIndex(T=>T._id===S);z<0||(r.registrar({col:M,item:F[z],indice:z}),v(M,F.filter((T,R)=>R!==z)))}function $(){const M=r.tomar();if(!M)return null;const S=[...n[M.col]];return S.splice(Math.min(M.indice,S.length),0,M.item),v(M.col,S),M}function m(){return r.pendiente()}function y(){const M=n.accounts||[],S=M.find(F=>F.esCuentaPrincipal&&F.activo)||M.find(F=>F.activo);return S?S._id:"default"}function A(M){var S;return((S=n.accounts.find(F=>F._id===M))==null?void 0:S.nombre)??M}function w(){return yt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function _(){return yt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function E(){return structuredClone(n)}function P(M,S=null){const{state:F,applied:z}=Fo(M,S,{hoyISO:a,finISO:o});n=F,c();for(const T of Object.keys(n))u(T);t.set(_e,pe);for(const T of Object.keys(n))l(T);return{applied:z}}return{load:f,get:p,set:v,patchConfig:b,subscribe:I,addItem:x,updateItem:g,removeItem:h,deshacerBorrado:$,borradoPendiente:m,getPrincipalAccountId:y,accountName:A,resolverTramosIRPF:w,resolverTramosGanancias:_,snapshot:E,replaceAll:P,get schemaVersion(){return pe},get migrationsApplied(){return[...i]},get today(){return a||J()}}}function pi(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const Tt=Object.keys(jo("1970-01-01","1970-01-01"));function To(t){const e={};for(const a of Tt){const o=t.get(`${jt}${a}`);o!=null&&(e[a]=o)}return e}function mi(t,e){const a=[];for(const o of Tt){const n=e[o];n!=null&&(t(`${jt}${o}`,n),a.push(o))}return a}function fi(t){return Tt.filter(e=>t[e]===void 0||t[e]===null)}function vi(t){var l,u,f;const e=c=>{const p=t[c];return Array.isArray(p)?p:[]};if(!Tt.filter(c=>c!=="config"&&c!=="accounts"&&c!=="planes"&&c!=="personas").every(c=>e(c).length===0))return!1;const o=e("planes");if(!(o.length===0||o.length===1&&((l=o[0])==null?void 0:l._id)==="plan_base"&&!(Array.isArray((u=o[0])==null?void 0:u.objetivos)&&o[0].objetivos.length>0)))return!1;const s=e("personas");return s.length===0||s.length===1&&((f=s[0])==null?void 0:f._id)==="default"?e("accounts").every(c=>c._id==="default"&&!(typeof c.saldoInicial=="number"&&c.saldoInicial!==0)&&!(Array.isArray(c.historicoSaldos)&&c.historicoSaldos.length>0)):!1}const No=`${Jt}meta_proyectos`,Ro=`${Jt}meta_proyectoActivo`,Nt="default",gi="Mis finanzas";function pa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function fe(t){return t===Nt?Jt:`${Jt}p_${t}_`}function Oo(){return[...Tt.map(t=>`${jt}${t}`),_e,ua]}function bi(t=localStorage){function e(){try{const f=t.getItem(No);if(!f)return[];const c=JSON.parse(f);return Array.isArray(c)?c:[]}catch{return[]}}function a(f){t.setItem(No,JSON.stringify(f))}function o(){const f=e();if(f.some(v=>v._id===Nt))return f;const c=Date.now(),p=[{_id:Nt,nombre:gi,creadoEn:c,actualizadoEn:c},...f];return a(p),p}function n(){try{const f=t.getItem(Ro);if(!f)return Nt;const c=JSON.parse(f);return typeof c=="string"&&c?c:Nt}catch{return Nt}}function s(f){t.setItem(Ro,JSON.stringify(f))}function i(f){const c=f.trim()||"Proyecto sin nombre",p=Date.now(),v={_id:pa(),nombre:c,creadoEn:p,actualizadoEn:p};return a([...o(),v]),v}function r(f,c){const p=c.trim();p&&a(o().map(v=>v._id===f?{...v,nombre:p,actualizadoEn:Date.now()}:v))}function l(f,c){const p=o().find(C=>C._id===f);if(!p)throw new Error("Proyecto no encontrado.");const v=fe(f),b={_id:pa(),nombre:(c==null?void 0:c.trim())||`${p.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},I=fe(b._id);for(const C of Oo()){const x=t.getItem(`${v}${C}`);x!==null&&t.setItem(`${I}${C}`,x)}return a([...o(),b]),b}function u(f){if(f===Nt)throw new Error("No se puede eliminar el proyecto original.");if(f===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const c=o();if(!c.some(v=>v._id===f))return;const p=fe(f);for(const v of Oo())t.removeItem(`${p}${v}`);a(c.filter(v=>v._id!==f))}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:l,eliminar:u}}function hi(t,e,a){const o=Do(t,fe(e)),n={};for(const s of a){const i=o.get(`${jt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function yi(t){const e=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!e.has(i)&&e.set(i,pa())}function a(n){if(typeof n=="string")return e.get(n)??n;if(Array.isArray(n))return n.map(a);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=a(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(a);return o}const Z={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Pt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:Z.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:Z.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:Z.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:Z.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:Z.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:Z.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:Z.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:Z.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:Z.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:Z.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:Z.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:Z.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:Z.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:Z.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:Z.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:Z.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:Z.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:Z.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:Z.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:Z.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:Z.datos,porDefecto:!1,dependencias:["sync-nube"]}],xi=new Map(Pt.map(t=>[t.id,t]));function ve(t){return xi.get(t)}function qo(t){return Pt.filter(e=>(e.dependencias||[]).includes(t))}function ma(){const t={};for(const e of Pt)t[e.id]=e.porDefecto;return t}function Lo(){const t=[],e=new Map;for(const a of Pt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function $i(t){function e(){return{...ma(),...t.get("config").features||{}}}function a(c){t.patchConfig({features:c})}function o(c,p=e(),v=new Set){const b=ve(c);if(!b)return!1;if(b.nucleo)return!0;if(p[c]===!1)return!1;if(v.has(c))return!0;v.add(c);for(const I of b.dependencias||[])if(!o(I,p,v))return!1;return!0}function n(c,p=e()){const v=ve(c);return v?(v.dependencias||[]).filter(b=>!o(b,p)):[]}function s(c,p){var h;const v=ve(c);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const b=e(),I=new Map(Pt.map($=>[$.id,o($.id,b)])),C={...b,[c]:p};let x;if(p){const $=[...v.dependencias||[]];for(;$.length;){const m=$.pop();C[m]===!1&&(C[m]=!0,x="dependencias-activadas"),$.push(...((h=ve(m))==null?void 0:h.dependencias)||[])}}else{const $=qo(c).map(m=>m.id);for(;$.length;){const m=$.pop();C[m]!==!1&&(C[m]=!1,x="cascada-apagado"),$.push(...qo(m).map(y=>y.id))}}return a(C),{cambiadas:Pt.filter($=>o($.id,C)!==I.get($.id)).map($=>$.id),motivo:x}}function i(){const c=e();return Pt.map(p=>{const v=n(p.id,c);return{...p,activa:o(p.id,c),...v.length>0&&c[p.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const c=e();return Lo().map(({grupo:p,features:v})=>({grupo:p,features:v.map(b=>{const I=n(b.id,c);return{...b,activa:o(b.id,c),...I.length>0&&c[b.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(ma())}function u(c){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...c?{nombre:c}:{},features:e()}}function f(c){const p=c,v=p&&typeof p=="object"&&p.features&&typeof p.features=="object"?p.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const b=ma(),I=[],C=[];for(const[x,g]of Object.entries(v)){if(!ve(x)){C.push(x);continue}if(typeof g!="boolean"){C.push(x);continue}b[x]=g,I.push(x)}return a(b),{aplicadas:I,ignoradas:C}}return{isEnabled:c=>o(c),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:f,bloqueadaPor:c=>n(c)}}const ge=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Wt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Ii(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(ge).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${ge(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${ge(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${ge(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function Ai(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${ge(o)}</div>
        ${n.map(Ii).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function wi(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Si(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Ai(a)}`,n(i)}function n(i){var l,u,f;i.querySelectorAll("[data-feature-toggle]").forEach(c=>{c.addEventListener("change",()=>{var b;const p=c.dataset.featureToggle,v=a.setEnabled(p,c.checked);v.motivo==="dependencias-activadas"&&Wt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Wt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(b=t.onChange)==null||b.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const c=a.exportProfile(),p=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),v=URL.createObjectURL(p),b=e.createElement("a");b.href=v,b.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,b.click(),URL.revokeObjectURL(v),Wt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var p,v;const c=(p=r.files)==null?void 0:p[0];if(c)try{const{aplicadas:b,ignoradas:I}=a.importProfile(JSON.parse(await c.text()));Wt(t,I.length>0?`Perfil cargado (${b.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${b.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,b),o(i)}catch(b){Wt(t,"No se pudo cargar el perfil: "+b.message,"err")}finally{r.value=""}}),(f=i.querySelector('[data-feature-action="reset"]'))==null||f.addEventListener("click",()=>{var c;a.reset(),Wt(t,"Funcionalidades restablecidas"),(c=t.onChange)==null||c.call(t,[]),o(i)})}function s(){const i=wi(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const $t=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ci={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",goals:"Objetivos (antiguo)",planes:"Planes (objetivos financieros)",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",escenarios:"Supuestos"};function ko(t){return Ci[t]??t}function St(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Bo(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Mi(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Ei(){var e,a,o,n;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function _i(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function ji(t,e){const a=t._id===e,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${$t(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${$t(t.nombre)}
        </div>
        ${a?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${a?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${$t(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${$t(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${$t(t._id)}">Duplicar</button>
        ${o||a?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${$t(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Pi(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const n=o.map(i=>`<option value="${$t(i._id)}">${$t(i.nombre)}</option>`).join(""),s=a.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${$t(i)}"/> ${$t(ko(i))}
      </label>`).join("");return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Importar de otro proyecto</span></div>
      <div style="font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:10px">
        Trae colecciones de otro proyecto al activo, con ids nuevos — se añaden a
        lo que ya hay, no lo sustituyen. Si importas gastos o préstamos que
        dependen de una cuenta, importa también esa cuenta para que la
        referencia no se quede suelta.
      </div>
      <label class="form-label" style="font-size:11px">Desde</label>
      <select id="proyecto-import-origen" class="auth-input" style="margin:4px 0 10px">${n}</select>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--hairline-soft);border-radius:8px;padding:6px 10px;margin-bottom:10px">
        ${s}
      </div>
      <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-import-btn">Importar</button>
    </div>`}function zi(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Fi(t){const e=t.document??document,{proyectos:a}=t;function o(){const r=a.listar(),l=a.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>ji(u,l)).join("")}
      </div>
      ${zi()}
      ${Pi(r,l,a.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var l,u;r.querySelectorAll("[data-proyecto-accion]").forEach(f=>{f.addEventListener("click",()=>{const c=f.dataset.proyectoId,p=f.dataset.proyectoAccion,v=a.listar().find(b=>b._id===c);if(v){if(p==="cambiar"){if(!Bo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;a.cambiarA(c),Mi(t);return}if(p==="renombrar"){const b=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!b||!b.trim())return;a.renombrar(c,b.trim()),St(t,"Proyecto renombrado"),n(r);return}if(p==="duplicar"){const b=`${v.nombre} (copia)`,I=typeof prompt=="function"?prompt("Nombre de la copia",b):b;if(I===null)return;const C=a.duplicar(c,I.trim()||b);St(t,`"${C.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(p==="eliminar"){if(!Bo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(c),St(t,`"${v.nombre}" eliminado`),n(r)}catch(b){St(t,b.message,"err")}}}})}),(l=r.querySelector("#proyecto-nuevo-btn"))==null||l.addEventListener("click",()=>{const f=r.querySelector("#proyecto-nuevo-nombre"),c=f==null?void 0:f.value.trim();if(!c){St(t,"Ponle un nombre al proyecto","warn");return}const p=a.crear(c);St(t,`"${p.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var v;const f=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!f)return;const c=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(b=>b.dataset.proyectoImportCol);if(c.length===0){St(t,"Elige al menos una colección para importar","warn");return}const{importadas:p}=a.importarDesde(f,c);if(p.length===0){St(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}St(t,`Importado: ${p.map(ko).join(", ")} ✓`),Ei(),n(r)})}function i(){const r=_i(e);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const je=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Rt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Kt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Di(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Ti(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Ni(t){const e=t.color||je[0];return`
    <div class="dm-section" data-persona-fila="${Rt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Rt(e)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Rt(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${Rt(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${Rt(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${Rt(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${Rt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ri(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${je.map((t,e)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${e===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${je[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Oi(t){const e=t.document??document,{store:a}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${a.get("personas").map(Ni).join("")}
      </div>
      ${Ri()}`}function n(l){l.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(l)}function s(){var l;(l=t.onDatosCambiados)==null||l.call(t)}function i(l){var f;l.querySelectorAll("[data-persona-accion]").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.personaId,v=c.dataset.personaAccion,b=a.get("personas"),I=b.find(C=>C._id===p);if(I){if(v==="renombrar"){const C=typeof prompt=="function"?prompt("Nuevo nombre",I.nombre):null;if(!C||!C.trim())return;a.updateItem("personas",p,{nombre:C.trim()}),Kt(t,"Persona renombrada"),s(),n(l);return}if(v==="defecto"){a.set("personas",b.map(C=>({...C,esPorDefecto:C._id===p}))),Kt(t,`"${I.nombre}" es ahora la persona por defecto`),s(),n(l);return}if(v==="activo"){a.updateItem("personas",p,{activo:!I.activo}),s(),n(l);return}if(v==="eliminar"){if(b.length<=1){Kt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Di(t,`¿Eliminar "${I.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;a.removeItem("personas",p),Kt(t,`"${I.nombre}" eliminada`),s(),n(l)}}})});const u=l.querySelector("#persona-nuevo-color");l.querySelectorAll("[data-persona-color]").forEach(c=>{c.addEventListener("click",()=>{const p=c.getAttribute("data-persona-color");u&&(u.value=p),l.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===p?"2px solid white":"2px solid transparent"})})}),(f=l.querySelector("#persona-nuevo-btn"))==null||f.addEventListener("click",()=>{const c=l.querySelector("#persona-nuevo-nombre"),p=c==null?void 0:c.value.trim();if(!p){Kt(t,"Ponle un nombre a la persona","warn");return}const v=(u==null?void 0:u.value)||je[0],b=a.addItem("personas",{nombre:p,color:v,esPorDefecto:!1,activo:!0});Kt(t,`"${b.nombre}" creada ✓`),s(),n(l)})}function r(){const l=Ti(e);n(l.content),l.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const Ho={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Go(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function qi({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,f])=>[f,u]);for(const[u,f]of[...Object.entries(Ho),...l]){const c=t.isEnabled(u),p=e.querySelector(`.nav-btn[data-view="${f}"]`);p&&(p.style.display=c?"":"none"),!c&&n()===f&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const f=[...u.querySelectorAll(".nav-btn[data-view]")];if(f.length===0)return;const c=f.some(p=>p.style.display!=="none");u.style.display=c?"":"none"}),Go(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{Go(e,f=>t.isEnabled(f))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>Ho[r]}}const Li="toast toast-deshacer";function ki(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(c){const p=n();if(!p)return;l();const v=document.createElement("div");v.className=Li,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const b=document.createElement("span");b.textContent=`${ci(c.col,c.item)} se ha eliminado.`,b.style.flex="1";const I=document.createElement("button");I.type="button",I.className="btn-secondary btn-sm",I.textContent="Deshacer",I.style.flexShrink="0",I.addEventListener("click",()=>{const C=e.deshacerBorrado();if(l(),!C)return;const x=n();if(x){const g=document.createElement("div");g.className="toast toast-ok",g.textContent="Deshecho.",x.appendChild(g),setTimeout(()=>g.remove(),2500)}a==null||a()}),v.appendChild(b),v.appendChild(I),p.appendChild(v),s=v,i=setTimeout(l,o)}const f=e.subscribe(()=>{const c=e.borradoPendiente();if(!c){r=null,l();return}c!==r&&(r=c,u(c))});return()=>{f(),l()}}function Pe(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Vo(t,e){const a=Pe(t),o=Pe(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const Ot=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Bi(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Ot(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Ot(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Ot(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Ot(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const n of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:n._id,titulo:n.nombre,detalle:[n.importeObjetivo!==null?Ot(n.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:Ot(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Ot(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function Hi(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=Pe(e);if(s.length<2)return[];const i=l=>n===null||n.includes(l),r=[];for(const l of Bi(t)){if(!i(l.ruta))continue;const u=Vo(l.titulo,s),f=u>=0?-1:Math.min(Vo(l.extra??"",s),2);if(u<0&&f<0)continue;const c=u>=0?u:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:c*1e3+Math.min(999,Pe(l.titulo).length)})}return r.sort((l,u)=>l.peso-u.peso||l.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Gi="buscador-overlay",Uo="btn-buscador";function Vi(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function l(){const $=e.createElement("div");$.id=Gi,$.className="modal-overlay",$.style.alignItems="flex-start",$.style.paddingTop="10vh";const m=e.createElement("div");m.className="modal-box",m.style.maxWidth="560px",m.style.padding="14px";const y=e.createElement("input");y.type="search",y.className="form-input",y.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",y.setAttribute("aria-label","Buscar en toda la aplicación"),y.autocomplete="off";const A=e.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",m.appendChild(y),m.appendChild(A),$.appendChild(m),e.body.appendChild($),$.addEventListener("click",w=>{w.target===$&&I()}),y.addEventListener("input",()=>{r=0,f()}),y.addEventListener("keydown",v),o=$,n=y,s=A,$}function u(){if(s){if(s.textContent="",i.length===0){const $=e.createElement("div");$.style.padding="14px 4px",$.style.fontSize="13px",$.style.color="var(--text3)";const m=(n==null?void 0:n.value.trim())??"";$.textContent=m.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild($);return}i.forEach(($,m)=>{const y=e.createElement("button");y.type="button",y.className="buscador-fila",y.dataset.indice=String(m),m===r&&y.classList.add("activa");const A=e.createElement("div");A.style.minWidth="0";const w=e.createElement("div");w.textContent=$.titulo,w.style.fontSize="13px",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap";const _=e.createElement("div");_.textContent=$.detalle,_.style.fontSize="11px",_.style.color="var(--text3)",_.style.overflow="hidden",_.style.textOverflow="ellipsis",_.style.whiteSpace="nowrap",A.appendChild(w),$.detalle&&A.appendChild(_);const E=e.createElement("span");E.className="tag",E.textContent=$.etiqueta,E.style.flexShrink="0",y.appendChild(A),y.appendChild(E),y.addEventListener("click",()=>p(m)),s.appendChild(y)})}}function f(){const $=(n==null?void 0:n.value)??"";i=Hi(t.estado(),$,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function c($){var m,y;i.length!==0&&(r=(r+$+i.length)%i.length,u(),(y=(m=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:m.scrollIntoView)==null||y.call(m,{block:"nearest"}))}function p($){const m=i[$];m&&(I(),t.navegar(m.ruta))}function v($){$.key==="Escape"?($.preventDefault(),I()):$.key==="ArrowDown"?($.preventDefault(),c(1)):$.key==="ArrowUp"?($.preventDefault(),c(-1)):$.key==="Enter"&&($.preventDefault(),p(r))}function b(){const $=o??l();$.classList.remove("hidden"),$.style.display="",r=0,n&&(n.value="",n.focus()),f()}function I(){o&&(o.style.display="none",i=[])}function C(){return!!o&&o.style.display!=="none"}function x($){($.ctrlKey||$.metaKey)&&($.key==="k"||$.key==="K")&&($.preventDefault(),C()?I():b())}e.addEventListener("keydown",x);let g=null;function h(){const $=e.getElementById("period-bar");if(!$||e.getElementById(Uo))return;const m=e.createElement("button");m.id=Uo,m.type="button",m.className="btn-secondary",m.title="Buscar en toda la aplicación (Ctrl+K)",m.setAttribute("aria-label","Buscar"),m.textContent="🔍 Buscar",m.style.marginLeft="auto",m.addEventListener("click",b),$.appendChild(m),g=m}return h(),()=>{e.removeEventListener("keydown",x),g==null||g.remove(),o==null||o.remove(),o=null,n=null,s=null}}const fa="aviso-guardado";function Ui(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,l=null;function u(){var b;r&&clearTimeout(r),r=null,(b=e.getElementById(fa))==null||b.remove()}function f(){if(s==="oculto")return u();const b=a();if(!b)return;let I=e.getElementById(fa);I||(I=e.createElement("div"),I.id=fa,b.appendChild(I)),I.className=`toast toast-guardado toast-guardado--${s}`,I.style.display="flex",I.style.alignItems="center",I.style.gap="12px",I.textContent="";const C=e.createElement("span");if(C.style.flex="1",I.appendChild(C),s==="pendiente")C.textContent="Tienes cambios sin guardar.",I.appendChild(c("Guardar ahora","btn-primary btn-sm",()=>void p())),I.appendChild(c("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",f()}));else if(s==="subiendo"){C.textContent="Subiendo…";const x=e.createElement("span");x.className="guardado-giro",x.setAttribute("aria-hidden","true"),I.appendChild(x)}else s==="guardado"?C.textContent="¡Guardado!":s==="error"&&(C.textContent="No se ha podido guardar.",I.appendChild(c("Reintentar","btn-primary btn-sm",()=>void p())))}function c(b,I,C){const x=e.createElement("button");return x.type="button",x.className=I,x.textContent=b,x.style.flexShrink="0",x.addEventListener("click",C),x}async function p(){if(l)return l;r&&clearTimeout(r);const b=t.cambios.revision();return s="subiendo",f(),l=(async()=>{try{await t.guardar(),n.alDia(b),s="guardado",f(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),f()},o)}catch(I){console.error("[guardado] no se ha podido subir la copia:",I),s="error",f()}finally{l=null}})(),l}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",f()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:p,detener(){v(),u()}}}function Yi({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(b){return`view-${b}`}function s(b){const I=t.getElementById(n(b.route));if(I)return I;const C=t.querySelector(".view-container");if(!C)return null;const x=t.createElement("div");return x.id=n(b.route),x.className="view hidden",C.appendChild(x),x}function i(b){if(t.querySelector(`.nav-btn[data-view="${b.route}"]`))return;const I=t.querySelectorAll(".nav-section"),C=I[b.seccion??Math.max(0,I.length-1)];if(!C)return;const x=t.createElement("button");x.className="nav-btn",x.dataset.view=b.route,x.innerHTML=`${b.iconoPath?`<svg viewBox="0 0 24 24"><path d="${b.iconoPath}"/></svg>`:""}<span>${b.nombre}</span>`,C.appendChild(x),x.addEventListener("click",()=>{const g=globalThis.Router;g==null||g.navigate(b.route)})}function r(b){a.set(b.route,b),s(b),i(b)}function l(){return[...a.keys()].filter(b=>{const I=a.get(b);return!e||e(I.flagId??I.id)})}function u(b){return l().includes(b)}function f(b){const I=a.get(b);if(!I||e&&!e(I.flagId??I.id))return!1;const C=s(I);if(!C)return!1;if(o&&o!==b){const x=a.get(o),g=t.getElementById(n(o));x!=null&&x.unmount&&g&&x.unmount(g)}return I.mount(C),o=b,!0}function c(){o&&f(o)}function p(){const b={};for(const[I,C]of a)b[I]=C.flagId??C.id;return b}function v(){for(const b of a.values())s(b),i(b)}return{register:r,routes:l,has:u,mount:f,rerender:c,flagPorRuta:p,attachToShell:v,get activa(){return o}}}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${d(j(t))}</span>`}function Yo(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Jo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${d(e)}</span>`).join(" ")}const Ji=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function va(t){const[e,a]=t.split("-").map(Number);return`${Ji[a-1]} ${e}`}function L(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function tt(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function N(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function U(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function gt(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function Wo(t,e){const a=parseFloat(gt(t,e));return Number.isFinite(a)?a:0}function Wi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ki(t,e){const{ledger:a}=t,o=(t.hoy??J)(),n=t.accounts().filter(g=>g.activo),{desde:s,hasta:i}=Wi(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(g=>g.tipo!=="transferencia"),f=l.filter(g=>g.importeCts<0).reduce((g,h)=>g+h.importeCts,0),c=l.filter(g=>g.importeCts>0).reduce((g,h)=>g+h.importeCts,0),p=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),v=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),b=n.map(g=>`<option value="${d(g._id)}"${g._id===e.cuentaId?" selected":""}>${d(g.nombre)}</option>`).join(""),I=g=>'<option value="">— sin asignar —</option>'+u.map(h=>`<option value="${d(h._id)}"${h._id===g?" selected":""}>${d(h.concepto)} (${d(j(h.cuantia))})</option>`).join(""),C=l.map(g=>{var h;return`
      <tr data-tx="${d(g._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${d(g.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${d(g.concepto)}</td>
        <td style="padding:7px 8px">${Jo(g.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${d(((h=t.accounts().find($=>$._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${d(g._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I(g.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${qt(X(g.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${d(g._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${d(g._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),x=v.slice().reverse().slice(0,8).map(g=>{var h;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${d(g.fecha)}</span>
        <span style="color:var(--text3)">${d(((h=t.accounts().find($=>$._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${d(j(X(g.saldoCts)))}</span>
        ${g.nota?`<span style="color:var(--text3)">${d(g.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${d(g._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${b}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${d(e.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${d(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${qt(X(f))}</span>
          <span>Ingresos: ${qt(X(c))}</span>
          <span>Neto: ${qt(X(c+f))}</span>
          <span style="margin-left:auto">Saldo a ${d(i)}: <strong>${d(j(p))}</strong></span>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg3)">
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${C||'<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${d(o)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Concepto</label><input class="form-input" type="text" id="nt-concepto" placeholder="Compra supermercado"/></div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="nt-importe" step="0.01" min="0" placeholder="0,00"/></div>
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${b}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(g=>`<option value="${d(g)}"></option>`).join("")}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${I(null)}</select>
            <div class="text-sm mt-4" style="color:var(--text3)">Si la dejas sin asignar, se relaciona por etiqueta.</div>
          </div>
          <button class="btn-primary full-width" id="nt-guardar">Registrar</button>
        </div>

        <div class="card">
          <div class="card-title">Saldo real conocido</div>
          <div class="text-sm mb-8" style="color:var(--text2)">
            Ancla el histórico: el saldo de cualquier fecha se calcula desde el último punto
            de control más los movimientos posteriores. Si el banco dice otra cosa, manda el punto.
          </div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${d(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${b}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${x?`<div class="mt-12">${x}</div>`:""}
        </div>
      </div>
    </div>`}function Qi(t,e,a,o){const{ledger:n}=e;U(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),U(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),N(t,"#nt-guardar",()=>{const i=gt(t,"#nt-concepto").trim(),r=Wo(t,"#nt-importe");if(!i)return L("Indica un concepto","err");if(!(r>0))return L("Indica un importe mayor que cero","err");const l=gt(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:gt(t,"#nt-fecha")||(e.hoy??J)(),cuentaId:gt(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:gt(t,"#nt-tipo"),estimacionId:gt(t,"#nt-estimacion")||null}),L("Movimiento registrado"),e.onDatosCambiados(),o()}),N(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;tt("¿Eliminar este movimiento?")&&(n.eliminar(r),L("Movimiento eliminado"),e.onDatosCambiados(),o())}),N(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(c=>c._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(X(l.importeCts))));if(u===null)return;const f=parseFloat(u.replace(",","."));if(!Number.isFinite(f)||f<=0)return L("Importe no válido","err");n.actualizar(r,{importe:f}),L("Movimiento actualizado"),e.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),L("Asignación actualizada"),e.onDatosCambiados()}),N(t,"#pc-guardar",()=>{if(gt(t,"#pc-saldo").trim()==="")return L("Indica el saldo","err");const r=Wo(t,"#pc-saldo");n.registrarPuntoControl(gt(t,"#pc-cuenta"),gt(t,"#pc-fecha")||(e.hoy??J)(),r,gt(t,"#pc-nota").trim()||void 0),L("Saldo real registrado"),e.onDatosCambiados(),o()}),N(t,"[data-pc-borrar]",i=>{tt("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),L("Punto de control eliminado"),e.onDatosCambiados(),o())})}function ga(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function Xi(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??J(),u=t.get("expenses"),f=u.find(b=>b._id===s);if(!f)throw new Error(`La estimación ${s} no existe`);const c={...f,fechaFin:l},p={...f,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:f.fechaFin??null,ajustadaDesdeId:f._id,ajustadaEn:l},v=u.map(b=>b._id===s?c:b);return v.push(p),t.set("expenses",v),{estimacionCerrada:c,estimacionNueva:p}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(f){l.push({estimacionId:u.estimacionId,error:f.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(s);if(!l)return[];const u=[];let f=l;const c=new Set;for(;f!=null&&f.ajustadaDesdeId&&!c.has(f._id);){c.add(f._id);const I=r.get(f.ajustadaDesdeId);if(!I)break;u.unshift(I),f=I}const p=[];let v=l;const b=new Set([l._id]);for(;;){const I=i.find(C=>C.ajustadaDesdeId===v._id&&!b.has(C._id));if(!I)break;b.add(I._id),p.push(I),v=I}return[...u,l,...p]}return{aplicar:a,aplicarTodas:o,cadena:n}}function ba(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:ga(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function Zi(t){const e=ba(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:f})=>{const c=l.meses.slice(-6).map(p=>`${va(p.mes)}: ${j(p.estimado)} → ${j(p.real)} (${p.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${d(u.concepto)}</div>
          <div style="margin-top:3px">${Jo(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${d(c)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${d(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${d(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${qt(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Yo(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${f?`<button class="btn-secondary" data-sugerir="${d(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${d(f.motivo)}">Sugerir ajuste → ${d(j(f.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${d(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${qt(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Yo(l.precision)}</td>
      </tr>`).join(""),r=(l,u="left")=>`<th style="padding:7px 8px;text-align:${u};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${l}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Precisión de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm mb-10" style="color:var(--text2);line-height:1.6">
        Se comparan solo los meses ya cerrados que tengan movimientos reales. Al ajustar, la
        estimación actual se cierra hoy y se crea su continuación con el importe corregido:
        el pasado se mantiene tal como lo estimaste.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${r("Estimación")}${r("Estimado","right")}${r("Real","right")}${r("Desviación","right")}${r("Precisión","right")}${r("","right")}
          </tr></thead>
          <tbody>${s}</tbody>
        </table>
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${r("Etiqueta")}${r("Estimaciones","right")}${r("Estimado","right")}${r("Real","right")}${r("Desviación","right")}${r("Precisión","right")}
          </tr></thead>
          <tbody>${i||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function tr(t,e,a){N(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=ba(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;tt(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),L(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),N(t,"#ajustar-todas",()=>{const o=ba(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!tt(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});L(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const er=[";",",","	","|"],ar={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function ze(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function Fe(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function or(t){let e=";",a=-1;for(const o of er){const n=t.slice(0,20).map(l=>Fe(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function be(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const f=s===","?o:n;i=e.slice(0,f).replace(/[.,]/g,""),r=e.slice(f+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function ha(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return Ko(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),Ko(o,Number(a[2]),Number(a[1]))}return null}function Ko(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Qo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ha(a)!==null).length/e.length}function Xo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>be(a)!==null).length/e.length}function nr(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=ze(t[i]);if(r&&ar[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&ze(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=Qo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||ze(t[r]).includes("saldo"))continue;const l=Xo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(Xo(l)>.5||Qo(l)>.5)continue;const u=l.reduce((f,c)=>f+c.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function sr(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(f=>f.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=or(e),o=e.map(f=>Fe(f,a).length),n=Math.max(...o);let s=o.findIndex(f=>f===n);s<0&&(s=0);const i=Fe(e[s],a);let r=e.slice(s+1).map(f=>Fe(f,a));const l=ha(i[0]??"")!==null||i.some(f=>be(f)!==null&&/\d/.test(f));l&&(r=[i,...r]);const u=nr(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((f,c)=>`Columna ${c+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function Zo(t,e,a){return`${t}|${e}|${ze(a).replace(/\s+/g," ")}`}function ir(t,e,a=[]){const o=new Set(a.map(s=>Zo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?ha(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=be(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const p=e.debe>=0?be(s[e.debe]??""):null,v=e.haber>=0?be(s[e.haber]??""):null;p===null&&v===null?r.push("sin importe en Debe ni en Haber"):p!==null&&p!==0?u=-Math.abs(p):v!==null&&v!==0?u=Math.abs(v):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const f=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let c=!1;if(l&&u!==null){const p=Zo(l,u,f);c=o.has(p)||n.has(p),n.add(p)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:f,importeCts:u,errores:r,duplicada:c}})}function rr(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function De(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const lr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ya(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=ir(e.analisis,e.mapeo,a)}function cr(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
        </div>
      </div>`;const o=a.map(n=>`<option value="${d(n._id)}"${n._id===e.cuentaId?" selected":""}>${d(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${e.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${d(e.error)}</div></div>`:""}

      <div class="form-row mb-12">
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-cuenta">Cuenta de destino</label>
          <select class="form-select" id="imp-cuenta">
            <option value="">— elige una cuenta —</option>
            ${o}
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-fichero">Fichero CSV</label>
          <input class="form-input" type="file" id="imp-fichero" accept=".csv,.txt,text/csv" />
        </div>
      </div>

      ${e.analisis&&e.mapeo?ur(e,e.analisis,e.mapeo):dr()}
    </div>`}function dr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function ur(t,e,a){const o=rr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${d(l||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${d(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${d(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${lr.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${d(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${n(a[r.clave])}</select>
        </div>`).join("")}
    </div>
    <div class="text-sm mb-12" style="color:var(--text3)">
      Usa <em>Importe</em> si tu banco da una sola columna con signo, o <em>Debe</em> y <em>Haber</em> si las separa.
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px">
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Se importarán</div>
        <div class="stat-value" style="font-size:1.15rem">${o.importables}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Neto</div>
        <div class="stat-value" style="font-size:1.15rem">${qt(X(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${d(o.desde)} → ${d(o.hasta??"")}`:"—"}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Repetidos</div>
        <div class="stat-value" style="font-size:1.15rem;color:${o.duplicadas>0?"var(--yellow)":"var(--text)"}">${o.duplicadas}</div>
      </div>
    </div>

    ${o.duplicadas>0?`<label class="flex items-center gap-8 mb-12" style="font-size:13px;cursor:pointer">
             <input type="checkbox" id="imp-duplicadas"${t.incluirDuplicadas?" checked":""} />
             Importar también los ${o.duplicadas} repetido${o.duplicadas!==1?"s":""}
             <span style="color:var(--text3);font-size:12px">(ya hay un movimiento igual en fecha, importe y concepto)</span>
           </label>`:""}

    ${s.length>0?`<div class="alert-card alert-warning mb-12">
             <div class="alert-icon">⚠️</div>
             <div class="alert-body">
               <div class="alert-title">${s.length} línea${s.length!==1?"s":""} no se puede${s.length!==1?"n":""} importar</div>
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${d(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
             </div>
           </div>`:""}

    <div class="card-title mb-8">Previsualización</div>
    <div class="table-wrap mb-12">
      <table style="min-width:420px">
        <thead><tr>
          <th style="cursor:default">Fecha</th>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Importe</th>
          <th style="cursor:default">Estado</th>
        </tr></thead>
        <tbody>
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",f=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${d(r.fecha??"—")}</td>
                <td style="font-size:12px">${d(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":d(j(X(r.importeCts)))}</td>
                <td style="font-size:11px;color:${f}">${d(u)}</td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${t.filas.length>i.length?`<div class="text-sm mb-12" style="color:var(--text3)">…y ${t.filas.length-i.length} más.</div>`:""}

    <div class="flex gap-8" style="justify-content:flex-end;flex-wrap:wrap">
      <button class="btn-secondary" data-imp-cerrar>Cancelar</button>
      <button class="btn-primary" data-imp-confirmar${o.importables===0||!t.cuentaId?" disabled":""}>
        Importar ${o.importables} movimiento${o.importables!==1?"s":""}
      </button>
    </div>
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function pr(t,e,a,o){N(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,De(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),N(t,"[data-imp-cerrar]",()=>{Object.assign(a,De()),o()}),U(t,"#imp-cuenta",s=>{a.cuentaId=s.value,ya(e,a),o()}),U(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),ya(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&mr(s).then(r=>{const l=sr(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},ya(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),N(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(X(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});L(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,De()),e.onDatosCambiados(),o()}})}function mr(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function fr(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function vr(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function gr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function tn(t,e){const{inicio:a,fin:o}=gr(e);return le([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function br(t){function e(n,s={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=J()}=s,u=t.transacciones({estimacionId:n._id}),c=u.length===0&&((($=n.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:n.tags}):u,p=new Map;for(const m of c){const y=m.fecha.slice(0,7);p.set(y,(p.get(y)??0)+Math.abs(m.importeCts)/100)}const v=[];for(const m of vr(l,i)){const y=p.get(m);if(y===void 0)continue;const A=W(tn(n,m));v.push({mes:m,estimado:A,real:W(y),desviacion:W(y-A),precision:fr(A,y)})}const b=W(v.reduce((m,y)=>m+y.estimado,0)),I=W(v.reduce((m,y)=>m+y.real,0)),C=v.reduce((m,y)=>m+Math.abs(y.estimado),0),x=v.length===0?null:C>0?v.reduce((m,y)=>m+y.precision*Math.abs(y.estimado),0)/C:v.reduce((m,y)=>m+y.precision,0)/v.length,g=v.slice(-r),h=g.length>0?W(g.reduce((m,y)=>m+y.real,0)/g.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:v,estimadoTotal:b,realTotal:I,desviacionTotal:W(I-b),precision:x,mediaRealReciente:h,infraestimada:I>b}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function hr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function yr(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function xr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function $r(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const u=(l.tags??[]).filter(f=>s.tags.includes(f)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(s)}return o}function Ir(t,e,a,o={}){const{desde:n,hasta:s}=hr(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(h=>h.importeCts<0),l=i.filter(h=>h.importeCts>0),u=e.filter(h=>h.tipo==="gasto"&&h.activo!==!1),f=new Map((o.analisis??[]).map(h=>[h.estimacionId,h])),c=new Set(u.filter(h=>t.transacciones({estimacionId:h._id}).length>0).map(h=>h._id)),p=$r(r,u,h=>c.has(h)),v=new Set,b=u.map(h=>{const $=p.get(h._id)??[];for(const w of $)v.add(w._id);const m=W($.reduce((w,_)=>w+Math.abs(_.importeCts)/100,0)),y=W(tn(h,a)),A=f.get(h._id);return{estimacionId:h._id,concepto:h.concepto,tags:h.tags??[],estimado:y,real:m,desviacion:W(m-y),sinMovimiento:$.length===0,sugerencia:A?ga(A,h.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const h of r){if(v.has(h._id))continue;const $=xr(h.concepto),m=I.get($)??{concepto:h.concepto,total:0,movimientos:0};m.total=W(m.total+Math.abs(h.importeCts)/100),m.movimientos+=1,I.set($,m)}const C=[...I.values()].sort((h,$)=>$.total-h.total),x=W(b.reduce((h,$)=>h+$.estimado,0)),g=W(r.reduce((h,$)=>h+Math.abs($.importeCts)/100,0));return{mes:a,estimado:x,real:g,desviacion:W(g-x),ingresosReales:W(l.reduce((h,$)=>h+$.importeCts/100,0)),filas:b.sort((h,$)=>Math.abs($.desviacion)-Math.abs(h.desviacion)),sinEstimacion:C,totalSinEstimacion:W(C.reduce((h,$)=>h+$.total,0)),vacio:i.length===0}}function en(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function Ar(){return{mes:""}}function xa(t,e){if(e.mes)return e.mes;const a=en(t.ledger),o=yr((t.hoy??J)());return a.includes(o)?o:a[0]??o}function $a(t,e){const a=(t.hoy??J)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return Ir(t.ledger,o,e,{analisis:n,hoy:a})}function wr(t,e){const a=xa(t,e),o=en(t.ledger);o.includes(a)||o.unshift(a);const n=$a(t,a),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${d(l)}"${l===a?" selected":""}>${d(va(l))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${d(va(a))}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué se desvió el mes respecto a lo que habías previsto.
        </div>
      </div>`;const i=l=>l>0?"+":"",r=n.desviacion>0?"var(--red)":n.desviacion<0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Cierre de mes</div>
        ${s}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${d(j(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${d(j(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${d(j(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${d(j(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Sr(n)}
      ${Cr(n)}
    </div>`}function Sr(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
    <div class="card-title mb-8">Dónde te desviaste</div>
    <div class="table-wrap mb-12">
      <table style="min-width:460px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Previsto</th>
          <th style="cursor:default;text-align:right">Real</th>
          <th style="cursor:default;text-align:right">Desviación</th>
          <th style="cursor:default"></th>
        </tr></thead>
        <tbody>
          ${e.map(o=>{const n=o.desviacion>0?"var(--red)":o.desviacion<0?"var(--accent)":"var(--text2)",s=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${d(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${d(j(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${d(o.estimacionId)}"
                           title="Pasar la estimación de ${d(j(s.cuantiaActual))} a ${d(j(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${d(j(s.cuantiaSugerida))}</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${a.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${a.length} estimación${a.length!==1?"es":""} se desvía${a.length!==1?"n":""}
               de forma sistemática. Ajustarla cierra la estimación de hoy y abre una nueva con el importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function Cr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto del mes estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`:`
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna estimación. Si alguno se repite mes a mes, merece una estimación propia.
    </div>
    <div class="table-wrap">
      <table style="min-width:320px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Movimientos</th>
          <th style="cursor:default;text-align:right">Total</th>
        </tr></thead>
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>`<tr>
                <td style="font-size:12px">${d(e.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${e.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${d(j(e.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Mr(t,e,a,o){U(t,"#cie-mes",n=>{a.mes=n.value,o()}),N(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=$a(e,xa(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??J)()}),L(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),N(t,"[data-cie-ajustar-todas]",()=>{const s=$a(e,xa(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??J)()});L(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const Er="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function _r(t){const e={cuentaId:"",mes:(t.hoy??J)().slice(0,7),filtroTexto:""},a=De(),o=Ar(),n=()=>{var c;return(c=t.onDatosCambiados)==null?void 0:c.call(t)},s=t.hoy??J,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function f(c){const p=t.ledger.saldoTotal(s()),v=t.ledger.ultimaFecha(),b=t.ledger.transacciones().length;c.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Contabilidad <span>real</span></h1>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--accent)">
        📒 Lo que registras aquí es el <strong>histórico real</strong>: manda sobre las
        estimaciones para el pasado. Las estimaciones siguen proyectando el futuro, y con
        estos datos puedes medir su acierto y ajustarlas.
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Saldo real hoy</div>
          <div class="stat-value" style="font-size:1.3rem">${d(j(p))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${b}</div>
          <div style="font-size:11px;color:var(--text3)">${v?`último: ${d(v)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=c.querySelector("#acc-importar"),C=c.querySelector("#acc-cierre"),x=c.querySelector("#acc-transacciones"),g=c.querySelector("#acc-precision");I.innerHTML=cr(r,a),C.innerHTML=wr(l,o),x.innerHTML=Ki(i,e),g.innerHTML=Zi(u);const h=()=>f(c);pr(I,r,a,h),Mr(C,l,o,h),Qi(x,i,e,h),tr(g,u,h)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Er,mount:f}}const jr="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ia(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Pr(t){const{store:e}=t,a=t.hoy??J,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(v){var b;e.patchConfig({margenesSeguridad:v}),(b=t.onDatosCambiados)==null||b.call(t)}function i(v,b){const I=n().map(x=>({...x,puntos:(x.puntos??[]).map(g=>({...g}))})),C=I.find(x=>x._id===v);C&&(b(C),s(I))}function r(v){const b=e.get("config"),I=Ee(v,e.get("expenses"),b,e.get("loans"),a(),!1,o());return j(I)}function l(v,b,I){const C=b.tipo==="fijo",x=C?"":`<span class="text-sm" style="color:var(--text3)">${d(j((b.meses??0)*I))}</span>`;return`
      <tr data-punto="${d(b._id)}" data-margen="${d(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${d(b.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${C?" selected":""}>Fijo €</option>
            <option value="meses"${C?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${C?`<input type="number" class="form-input" style="width:90px" value="${b.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${C?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${b.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${x}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(v,b,I){const C=v.cuentas&&v.cuentas.length>0?v.cuentas.map($=>{var m;return((m=b.find(y=>y._id===$))==null?void 0:m.nombre)??$}).join(", "):"Todas las cuentas activas",g=[...v.puntos??[]].sort(($,m)=>$.fecha.localeCompare(m.fecha)).map($=>l(v,$,I)).join(""),h=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${d(C)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${d(r(v))}</strong>
      </div>
      <div class="mt-8" style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="color:var(--text3);text-align:left;border-bottom:1px solid var(--border)">
              <th style="padding:4px 6px;font-weight:500">Fecha</th>
              <th style="padding:4px 6px;font-weight:500">Tipo</th>
              <th style="padding:4px 6px;font-weight:500">Importe €</th>
              <th style="padding:4px 6px;font-weight:500">Meses</th>
              <th style="padding:4px 6px;font-weight:500">Equiv. €</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${g||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${d(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${d(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${d(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${d(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${d(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${h}
      </div>`}function f(v,b){const I=b?n().find(h=>h._id===b):null,C=e.get("accounts").filter(h=>h.activo),x=new Set((I==null?void 0:I.cuentas)??[]),g=C.map(h=>`
        <label class="tag" data-chip="${d(h._id)}" style="cursor:pointer;${x.has(h._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${d(h._id)}" ${x.has(h._id)?"checked":""} style="display:none"/>
          ${d(h.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${b?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${d((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${g||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${I?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${d(J())}"/></div>
          <div class="form-group"><label class="form-label">Tipo</label>
            <select class="form-input" id="mg-p-tipo">
              <option value="fijo">Fijo €</option>
              <option value="meses">Meses de gastos básicos</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="mg-p-importe-wrap"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="mg-p-importe" value="0" min="0"/></div>
        <div class="form-group" id="mg-p-meses-wrap" style="display:none"><label class="form-label">Nº meses</label><input class="form-input" type="number" id="mg-p-meses" value="1" min="0" step="0.5"/></div>
      </div>`}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar-form>Cancelar</button>
        <button class="btn-primary" data-guardar-margen="${d(b??"")}">Guardar</button>
      </div>`}function c(v,b){const I=document.getElementById("modal-overlay"),C=document.getElementById("modal-content");!I||!C||(f(C,v),I.classList.remove("hidden"),U(C,".mg-acc-chip",x=>{const g=x,h=C.querySelector(`[data-chip="${g.value}"]`);h&&(h.style.cssText=`cursor:pointer;${g.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(C,"#mg-p-tipo",x=>{const g=x.value==="fijo",h=C.querySelector("#mg-p-importe-wrap"),$=C.querySelector("#mg-p-meses-wrap");h&&(h.style.display=g?"":"none"),$&&($.style.display=g?"none":"")}),N(C,"[data-cerrar-form]",()=>I.classList.add("hidden")),N(C,"[data-guardar-margen]",x=>{var y,A,w,_,E;const g=x.getAttribute("data-guardar-margen")||"",h=((y=C.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!h)return L("El nombre es obligatorio","err");const $=[...C.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),m=n().map(P=>({...P}));if(g){const P=m.findIndex(M=>M._id===g);if(P===-1)return L("Margen no encontrado","err");m[P]={...m[P],nombre:h,cuentas:$}}else{const P=((A=C.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",M={_id:Ia(),fecha:((w=C.querySelector("#mg-p-fecha"))==null?void 0:w.value)||J(),tipo:P,importe:parseFloat(((_=C.querySelector("#mg-p-importe"))==null?void 0:_.value)??"0")||0,meses:parseFloat(((E=C.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};m.push({_id:Ia(),nombre:h,activo:!0,cuentas:$,puntos:[M]})}s(m),L(g?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),b()}))}function p(v){const b=n(),I=e.get("accounts"),C=de(e.get("expenses"),o());v.innerHTML=`
      <div class="page-header">
        <div>
          <h1 class="page-title">Márgenes de <span>seguridad</span></h1>
          <p class="text-sm" style="color:var(--text3);margin:4px 0 0">
            Umbrales de saldo mínimo por cuenta o grupo de cuentas. El dashboard avisa cuando la
            proyección los cruza, y el optimizador de amortizaciones los respeta.
          </p>
        </div>
        <button class="btn-primary" data-nuevo-margen>+ Añadir margen</button>
      </div>
      ${b.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:b.map(g=>u(g,I,C)).join("")}`;const x=()=>p(v);N(v,"[data-nuevo-margen]",()=>c(null,x)),N(v,"[data-editar-margen]",g=>c(g.getAttribute("data-editar-margen"),x)),N(v,"[data-borrar-margen]",g=>{tt("¿Eliminar este margen de seguridad?")&&(s(n().filter(h=>h._id!==g.getAttribute("data-borrar-margen"))),L("Margen eliminado"),x())}),U(v,"[data-toggle-margen]",g=>{const h=g.getAttribute("data-toggle-margen");i(h,$=>{$.activo=g.checked}),x()}),N(v,"[data-add-punto]",g=>{const h=g.getAttribute("data-add-punto");i(h,$=>{$.puntos=[...$.puntos??[],{_id:Ia(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),x()}),N(v,"[data-borrar-punto]",g=>{const h=g.closest("[data-punto]");if(!h)return;const $=h.dataset.margen,m=h.dataset.punto;i($,y=>{y.puntos=(y.puntos??[]).filter(A=>A._id!==m)}),x()}),U(v,"[data-campo]",g=>{const h=g.closest("[data-punto]");if(!h)return;const $=g.getAttribute("data-campo"),m=g.value;i(h.dataset.margen,y=>{const A=(y.puntos??[]).find(w=>w._id===h.dataset.punto);A&&($==="fecha"?A.fecha=m:$==="tipo"?A.tipo=m:$==="importe"?A.importe=parseFloat(m)||0:A.meses=parseFloat(m)||0)}),x()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:jr,mount:p}}const zr="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function Fr(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Dr({fetchImpl:t,url:e=zr}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=Fr(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const Tr="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Nr(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Rr(t){const{store:e}=t,a=t.ipc??Dr(),o=()=>e.get("inflacion")??[];function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function s(c,p){if(!c||c.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const v=new Set(o().map(g=>g.year)),b=c.filter(g=>g.year>=p).reverse(),I=b.filter(g=>!v.has(g.year)).length,C=[...new Set(c.map(g=>g.year))].sort((g,h)=>g-h),x=b.map(g=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${g.year}" data-tasa="${g.tasa}" ${v.has(g.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${g.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Nr(g.tasa)}">${g.tasa.toFixed(2)}%</span>
          ${v.has(g.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${C.map(g=>`<option value="${g}"${g===p?" selected":""}>${g}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${c[0].year}–${c[c.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${x}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${I} periodo${I!==1?"s":""} nuevo${I!==1?"s":""} disponible${I!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${I===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(c){return!c||c.length===0?2e3:Math.max(c[0].year,new Date().getFullYear()-25)}async function r(c){const p=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!p||!v)return;v.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,p.classList.remove("hidden");const b=(C,x)=>{const g=document.getElementById("ipc-body");g&&(g.innerHTML=s(C,x))},I=await a.obtener();b(I,i(I)),N(v,"[data-ipc-cerrar]",()=>p.classList.add("hidden")),U(v,"#ipc-desde",C=>{b(a.enCache,parseInt(C.value))}),N(v,"[data-ipc-recargar]",()=>{a.invalidar();const C=document.getElementById("ipc-body");C&&(C.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(x=>b(x,i(x)))}),N(v,"[data-ipc-importar]",()=>{const C=[...v.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(C.length===0)return L("Nada seleccionado","err");const x=new Set(o().map(h=>h.year));let g=0;for(const h of C){const $=parseInt(h.dataset.year??""),m=parseFloat(h.dataset.tasa??"");!Number.isFinite($)||!Number.isFinite(m)||x.has($)||(e.addItem("inflacion",{year:$,tasa:m}),x.add($),g++)}p.classList.add("hidden"),L(`${g} periodo${g!==1?"s":""} importado${g!==1?"s":""} correctamente`),n(),c()})}function l(c,p){var x;const v=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");if(!v||!b)return;const I=c?o().find(g=>g._id===c):null;b.innerHTML=`
      <div class="modal-title">${c?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${(I==null?void 0:I.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${(I==null?void 0:I.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${d(c??"")}">Guardar</button>
      </div>`,v.classList.remove("hidden");const C=()=>{var y;const g=parseFloat(((y=b.querySelector("#inf-tasa"))==null?void 0:y.value)??""),h=b.querySelector("#inf-preview");if(!h)return;if(!Number.isFinite(g)||g<=0){h.innerHTML="";return}const $=(Math.pow(1+g/100,1/12)-1)*100,m=Math.pow(1+g/100,5);h.innerHTML=`Con un ${g}% anual: <strong>${$.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${m.toFixed(3)}</strong> (+${((m-1)*100).toFixed(1)}%)`};(x=b.querySelector("#inf-tasa"))==null||x.addEventListener("input",C),C(),N(b,"[data-inf-cerrar]",()=>v.classList.add("hidden")),N(b,"[data-inf-guardar]",g=>{const h=g.getAttribute("data-inf-guardar")||"",$=parseInt(b.querySelector("#inf-year").value),m=parseFloat(b.querySelector("#inf-tasa").value);if(!Number.isFinite($)||$<1900||$>2200)return L("Año inválido","err");if(!Number.isFinite(m)||m<0||m>100)return L("Tasa inválida (0–100%)","err");if(o().filter(A=>A._id!==h).some(A=>A.year===$))return L("Ya existe un periodo para ese año","err");h?(e.updateItem("inflacion",h,{year:$,tasa:m}),L("Periodo actualizado")):(e.addItem("inflacion",{year:$,tasa:m}),L("Periodo añadido")),v.classList.add("hidden"),n(),p()})}function u(c,p){const v=(Math.pow(1+c.tasa/100,.08333333333333333)-1)*100,b=`${c.year}-12-31`,I=b>p?ft([c],p,b):null;return`
      <div class="exp-table-row" data-periodo="${d(c._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${c.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${c.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${v.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${d(c._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${d(c._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function f(c){const p=o(),v=e.get("config").usarInflacion||!1,b=[...p].sort((y,A)=>A.year-y.year),I=J(),C=new Date().getFullYear(),x=V(new Date(C+5,0,1)),g=V(new Date(C+10,0,1)),h=v&&p.length>0?ft(p,I,x):null,$=v&&p.length>0?ft(p,I,g):null;c.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!v&&p.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
        <div style="font-weight:600;font-size:14px;margin-bottom:6px">Módulo opcional</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Registra la tasa de inflación estimada de cada año y las proyecciones mostrarán el coste
          en <strong>euros de hoy</strong>. Útil para comparar el coste real de un préstamo largo o
          ver cómo se erosiona el ahorro. Para un uso básico puedes ignorarlo.
        </div>
      </div>`:""}

      <div class="card mb-14" style="padding:16px 20px">
        <div class="flex gap-16 items-center" style="flex-wrap:wrap;justify-content:space-between">
          <div>
            <div style="font-weight:600;font-size:15px">Usar estimaciones de inflación</div>
            <div class="text-sm" style="color:var(--text3);margin-top:4px">
              Aplica la inflación acumulada año a año a las proyecciones.
            </div>
          </div>
          <label class="toggle" style="flex-shrink:0">
            <input type="checkbox" data-toggle-inflacion ${v?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${h!==null&&$!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${h.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((h-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${$.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${(($-1)*100).toFixed(1)}%)</span></div>
          </div>
        </div>`:""}
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          <span class="exp-col-head">Año</span>
          <span class="exp-col-head">Tasa anual (%)</span>
          <span class="exp-col-head">Equivalente mensual</span>
          <span class="exp-col-head">Factor acumulado desde hoy</span>
          <span></span>
        </div>
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':b.map(y=>u(y,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const m=()=>f(c);U(c,"[data-toggle-inflacion]",y=>{const A=y.checked;e.patchConfig({usarInflacion:A}),L(A?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),m()}),N(c,"[data-nuevo-periodo]",()=>l(null,m)),N(c,"[data-editar-periodo]",y=>l(y.getAttribute("data-editar-periodo"),m)),N(c,"[data-importar-ipc]",()=>void r(m)),N(c,"[data-borrar-periodo]",y=>{tt("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",y.getAttribute("data-borrar-periodo")),L("Periodo eliminado"),n(),m())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:Tr,mount:f}}const Or=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],qr=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Lr=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function kr(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Aa=(t,e)=>t.map(([a,o])=>`<option value="${d(a)}"${a===e?" selected":""}>${d(o)}</option>`).join("");function an(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=kr(t),i=Aa(Or.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${d(e)}">
    <label class="form-label">Día efectivo</label>
    <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
      <select class="form-select" data-dp-modo style="width:auto;min-width:145px">
        <option value="none"${a==="none"?" selected":""}>Sin ajuste</option>
        <option value="dia"${a==="dia"?" selected":""}>Día del mes</option>
        <option value="nthweekday"${a==="nthweekday"?" selected":""}>Día de la semana</option>
      </select>
      <span data-dp-dia class="flex gap-8 items-center"${a!=="dia"?' style="display:none"':""}>
        el día <select class="form-select" data-dp-dnum style="width:auto;min-width:80px">${i}</select>
      </span>
      <span data-dp-nth class="flex gap-8 items-center"${a!=="nthweekday"?' style="display:none"':""}>
        el
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Aa(qr,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Aa(Lr,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function on(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function nn(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Br={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Hr(t,e){const a=new Set(((e==null?void 0:e.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||a.has(o._id))}function Qt(t,e,a,o){if(a.filter(l=>l.activo).length<2)return"";const n=(e==null?void 0:e.modo)??"",s=new Map(((e==null?void 0:e.participantes)??[]).map(l=>[l.personaId,l.valor])),i=n==="porcentaje"||n==="importe",r=l=>{const u=s.has(l._id),f=s.get(l._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${d(o)}" value="${d(l._id)}"${u?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d(l.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${d(o)}" data-persona="${d(l._id)}"
             value="${f??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${d(o)}">
    <label class="form-label">${d(t)}</label>
    <select class="form-select" data-reparto-modo="${d(o)}">
      <option value=""${n?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${n==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${n==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${n==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${d(o)}" style="margin-top:6px;${n?"":"display:none"}">
      ${Hr(a,e).map(r).join("")}
    </div>
  </div>`}function Xt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"",n=a.querySelector(`[data-reparto-participantes="${e}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";a.querySelectorAll(`[data-reparto-valor="${e}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Zt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...a.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const l=r.value,u=a.querySelector(`[data-reparto-valor="${e}"][data-persona="${l}"]`),f=u?parseFloat(u.value):NaN;return Number.isFinite(f)?{personaId:l,valor:f}:{personaId:l}});return{modo:o,participantes:s}}function sn(t,e){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=e.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Br[t.modo]})`}function wa(t,e,a){const o=sn(t,a),n=sn(e,a);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Gr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Vr=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ur(t){const e=t.hoy??J,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},n=()=>t.store.get("accounts"),s=x=>{var g;return((g=n().find(h=>h._id===(x||"default")))==null?void 0:g.nombre)??(x||"default")};function i(){const x=e();let g=[...t.store.get("expenses")];if(a.mostrarExpirados||(g=g.filter(h=>!h.fechaFin||h.fechaFin>=x)),a.tipo&&(g=g.filter(h=>h.tipo===a.tipo)),a.cuenta&&(g=g.filter(h=>(h.cuenta||"default")===a.cuenta)),a.desde&&(g=g.filter(h=>(h.fechaInicio??"")>=a.desde)),a.hasta&&(g=g.filter(h=>(h.fechaInicio??"")<=a.hasta)),a.busqueda){const h=a.busqueda.toLowerCase();g=g.filter($=>$.concepto.toLowerCase().includes(h))}return a.tags.size>0&&(g=g.filter(h=>(h.tags||[]).some($=>a.tags.has($)))),g.sort((h,$)=>{const m=h[a.orden]??"",y=$[a.orden]??"";return typeof m=="number"&&typeof y=="number"?(m-y)*a.sentido:String(m).localeCompare(String(y))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(x=>x.tags||[]))].filter(Boolean).sort()}function l(x,g){const h=a.orden===x?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${x}">${d(g)} <span class="sort-arrow">${h}</span></span>`}function u(x,g=!1){return(g?'<option value="">Todas las cuentas</option>':"")+n().filter($=>$.activo!==!1).map($=>`<option value="${d($._id)}"${$._id===x?" selected":""}>${d($.nombre)}</option>`).join("")}function f(x){const g=x.tipo==="transferencia",h=wa(x.repartoConsumo,x.repartoPago,t.store.get("personas")),$=Ge(x.diaPago??""),m=x.tipoFrecuencia==="extraordinario"?"Único":`Cada ${x.frecuencia??1} ${x.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${$?` · ${$}`:""}`,y=!!x.fechaFin&&x.fechaFin<e(),A=g?'<span class="badge badge-purple">⇄ transf.</span>':x.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=g?`${d(s(x.cuenta))} → ${d(s(x.cuentaDestino))}`:d(s(x.cuenta)),_=(x.tags||[]).map(E=>`<span class="tag${a.tags.has(E)?" active":""}" data-tag="${d(E)}" title="Filtrar por ${d(E)}">${d(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(x.concepto)}</div>
        <div class="tag-list mt-4">${_}</div>
      </div>
      <div>${A}</div>
      <div class="num ${x.tipo==="ingreso"?"pos":g?"":"neg"}">${g?"⇄ ":""}${d(j(x.cuantia))}</div>
      <div class="text-sm">${d(m)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${d(x._id)}"${x.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${x.tipo==="gasto"&&x.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${x.tipo==="gasto"&&x.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${x.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${x.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${d(x.ajustadaEn??"")}">ajustada</span>`:""}
        ${h?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(h)}">👥 reparto</span>`:""}
        ${y?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${d(x._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${d(x._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${d(x._id)}">✕</button>
      </div>
    </div>`}function c(x){const g=i(),h=r();x.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" data-expirados${a.mostrarExpirados?" checked":""}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" data-nuevo>+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${d(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${u(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${d(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${d(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${h.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${h.map($=>`<span class="tag${a.tags.has($)?" active":""}" data-tag="${d($)}">${d($)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':g.map(f).join("")}
      </div>`}function p(x){const g=(x==null?void 0:x.tipo)==="transferencia",h=t.store.get("escenarios"),$=t.store.get("personas"),m=(x==null?void 0:x.escenarioIds)||[],y=(A,w,_,E,P="")=>`<div class="form-group"><label class="form-label">${d(w)}</label>
       <input class="form-input" type="${_}" id="${A}" value="${d(E)}" placeholder="${d(P)}"/></div>`;return`
      <div class="grid-2">
        ${y("ef-concepto","Concepto","text",(x==null?void 0:x.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(x==null?void 0:x.tipo)==="gasto"||!(x!=null&&x.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(x==null?void 0:x.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${g?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${y("ef-cuantia","Cuantía (€)","number",(x==null?void 0:x.cuantia)??"","500")}
        ${y("ef-frecuencia","Frecuencia","number",(x==null?void 0:x.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Vr.map(([A,w])=>`<option value="${A}"${((x==null?void 0:x.tipoFrecuencia)??"mensual")===A?" selected":""}>${d(w)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${y("ef-fecha-ini","Fecha inicio","date",(x==null?void 0:x.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((x==null?void 0:x.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${g?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((x==null?void 0:x.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(x==null?void 0:x.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${x!=null&&x._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${y("ef-fecha-fin","Fecha fin (opcional)","date",(x==null?void 0:x.fechaFin)??"")}</div>
          <div class="mt-8">${an(x==null?void 0:x.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${g?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(x==null?void 0:x.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((x==null?void 0:x.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(x==null?void 0:x.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(x==null?void 0:x.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${d(((x==null?void 0:x.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${x!=null&&x.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(x==null?void 0:x.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${x!=null&&x.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${h.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${h.map(A=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${m.includes(A._id)?d(A.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${d(A._id)}"${m.includes(A._id)?" checked":""}/>
                          ${d(A.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
          ${g?"":`${Qt("Reparto de consumo",x==null?void 0:x.repartoConsumo,$,"consumo")}
                 ${Qt("Reparto de pago",x==null?void 0:x.repartoPago,$,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${d((x==null?void 0:x._id)??"")}">Guardar</button>
      </div>`}function v(x){var $;const g=(($=x.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",h=(m,y)=>{const A=x.querySelector(m);A&&(A.style.display=y?"":"none")};h("#ef-destino-wrap",g==="transferencia"),h("#ef-basico-wrap",g!=="transferencia"),h("#ef-irpf-wrap",g==="ingreso"),h("#ef-clasificacion-wrap",g==="gasto")}function b(x,g,h){const $=document.getElementById("modal-overlay"),m=document.getElementById("modal-content");!$||!m||(m.innerHTML=`<div class="modal-title">${d(g)}</div>${p(x)}`,$.classList.remove("hidden"),U(m,"#ef-tipo",()=>v(m)),U(m,"[data-dp-modo]",()=>on(m)),U(m,'[data-reparto-modo="consumo"]',()=>Xt(m,"consumo")),U(m,'[data-reparto-modo="pago"]',()=>Xt(m,"pago")),N(m,"[data-cancelar]",()=>$.classList.add("hidden")),N(m,"[data-guardar]",y=>{I(m,y.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),h())}))}function I(x,g){const h=P=>{var M;return((M=x.querySelector(P))==null?void 0:M.value)??""},$=P=>{var M;return!!((M=x.querySelector(P))!=null&&M.checked)},m=h("#ef-tipo")||"gasto",y=m==="transferencia",A=h("#ef-concepto").trim(),w=parseFloat(h("#ef-cuantia"));if(!A||!Number.isFinite(w))return L("Concepto y cuantía obligatorios","err"),!1;const _=h("#ef-clasificacion"),E={concepto:A,tipo:m,cuantia:w,frecuencia:parseInt(h("#ef-frecuencia"),10)||1,tipoFrecuencia:h("#ef-tipo-frec")||"mensual",fechaInicio:h("#ef-fecha-ini"),fechaFin:h("#ef-fecha-fin")||null,diaPago:nn(x),cuenta:h("#ef-cuenta"),cuentaDestino:y?h("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!y&&$("#ef-basico"),sujetoIRPF:!y&&$("#ef-sujetoIRPF"),clasificacion:m==="gasto"?_||null:void 0,tags:y?["transferencia"]:h("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...x.querySelectorAll(".ef-escenario:checked")].map(P=>P.value),repartoConsumo:y?void 0:Zt(x,"consumo"),repartoPago:y?void 0:Zt(x,"pago")};return g?(t.store.updateItem("expenses",g,E),L("Actualizado")):(t.store.addItem("expenses",E),L("Creado")),o(),!0}function C(x,g){const h=x.querySelector("[data-busqueda]");let $;h==null||h.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{a.busqueda=h.value,g();const m=x.querySelector("[data-busqueda]");m==null||m.focus(),m==null||m.setSelectionRange(m.value.length,m.value.length)},250)}),U(x,"[data-expirados]",m=>{a.mostrarExpirados=m.checked,g()}),U(x,"[data-f-tipo]",m=>{a.tipo=m.value,g()}),U(x,"[data-f-cuenta]",m=>{a.cuenta=m.value,g()}),U(x,"[data-f-desde]",m=>{a.desde=m.value,g()}),U(x,"[data-f-hasta]",m=>{a.hasta=m.value,g()}),N(x,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,g()}),N(x,"[data-limpiar-tags]",()=>{a.tags=new Set,g()}),N(x,"[data-tag]",m=>{const y=m.getAttribute("data-tag");a.tags.has(y)?a.tags.delete(y):a.tags.add(y),g()}),N(x,"[data-orden]",m=>{const y=m.getAttribute("data-orden");a.orden===y?a.sentido=a.sentido===1?-1:1:(a.orden=y,a.sentido=1),g()}),N(x,"[data-nuevo]",()=>b(null,"Nuevo gasto/ingreso",g)),N(x,"[data-editar]",m=>{const y=t.store.get("expenses").find(A=>A._id===m.getAttribute("data-editar"));y&&b(y,"Editar",g)}),N(x,"[data-duplicar]",m=>{const y=t.store.get("expenses").find(_=>_._id===m.getAttribute("data-duplicar"));if(!y)return;const{_id:A,...w}=y;b({...w,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",g)}),N(x,"[data-borrar]",m=>{tt("¿Eliminar?")&&(t.store.removeItem("expenses",m.getAttribute("data-borrar")),L("Eliminado"),o(),g())}),U(x,"[data-activo]",m=>{const y=m;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),g()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Gr,mount(x){const g=()=>c(x);c(x),x.dataset.wired!=="1"&&(C(x,g),x.dataset.wired="1")}}}function Te(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=ft(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function rn(t,e,a,o){return t.reduce((n,s)=>{const i=ft(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Yr(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:Te(i.tabla,e,a)-Te(r.tabla,e,a)}})}const Sa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${d(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Jr(t,e){const a=Ba(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?Ha(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?Ga(t.tin||0,i):null,l=o&&n?Yr(t,e.periodos,e.hoy):[],u=l.length?Te(a.sinAmort.tabla,e.periodos,e.hoy)-Te(a.tabla,e.periodos,e.hoy):null,f=u===null?null:u-a.costeTotalAmort,c=s?rn(a.tabla,e.periodos,e.hoy,a.comAp):null,p=s&&o?rn(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${d(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${d(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=wa(t.repartoConsumo,t.repartoPago,e.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${d(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${d(t.tin)}%</span>
        <span class="text-sm">${d(j(t.capital))}</span>
        <span class="text-sm">${d(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${d(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${d(t._id)}">

      <div class="grid-4 mb-12">
        ${Sa("Cuota mensual",d(j(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${d(j(e.cuotaMes))}</div>`:"")}
        ${Sa("Total intereses",d(j(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${d(j(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${d(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${d(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Sa("Total pagado",d(j(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${d(j(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${d(Oa(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${d(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${d(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${d(j(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${d(j(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${d(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${d(Ge(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${d(t._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar data-feature="optimizador">✨ Optimizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${d(j(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${d(j(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${d(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${d(j(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(f??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${d(j(f??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${d(j(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${d(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${d(j(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${c!==null?Wr(t,a.totalPagado,c,p):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>Kr(v,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,b)=>Qr(t._id,v,l[b]??null,e)).join("")}`:""}
    </div>
  </div>`}function Wr(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${d(j(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${d(j(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${d(j(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${d(j(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${d(j(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${d(j(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Kr(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=ft(a.periodos,a.hoy,t.fecha);o=d(j(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":d(t.mes)}</td>
    <td class="num">${d(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":d(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${d(j(t.interes))}</td>
    <td class="num">${d(j(t.amortizacion))}</td>
    <td class="num">${d(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Qr(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${d(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${d(e.fecha)}</span>
    <span class="num">${d(j(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${n}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${d(j(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${d(j(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${d(t)}|${d(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${d(t)}|${d(e._id)}">✕</button>
  </div>`}const et=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,te=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${d(n)}"${n===o?" selected":""}>${d(s)}</option>`).join("")}
   </select></div>`,he=(t,e,a,o="")=>`<label class="form-label">${d(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${d(o)}</span>`:""}`;function ye(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?d(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${d(a)}" value="${d(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${d(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Xr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${d(a._id)}"${a._id===e?" selected":""}>${d(a.nombre)}</option>`).join("");function Zr(t,e,a,o,n=J()){return`
    <div class="grid-2">
      ${et("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${et("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${et("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${et("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${et("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??n)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Xr(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${an(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${te("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${et("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${et("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${d(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${he("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${ye(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        ${Qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,o,"consumo")}
        ${Qt("Reparto de pago",t==null?void 0:t.repartoPago,o,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${he("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${he("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${he("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function tl(t,e,a,o=J()){return`
    <div class="grid-2">
      ${et("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${et("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${te("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${ye(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${he("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${d(t)}|${d((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const ln="opt_",cn=t=>String(t).startsWith(ln);function el(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(h,$){const m=o(),y=n();return!m||!y?null:(y.innerHTML=`<div class="modal-title">${d(h)}</div>${$}`,m.classList.remove("hidden"),y)}const i=()=>{var h;return(h=o())==null?void 0:h.classList.add("hidden")};function r(){let h=!1;for(const $ of t.loans()){const m=($.amortizaciones||[]).filter(y=>!cn(y._id));m.length!==($.amortizaciones||[]).length&&(t.guardarAmortizaciones($._id,m),h=!0)}return h}function l(h){try{return h()}catch($){return L($ instanceof Error?$.message:"No se ha podido completar el cálculo","err"),null}}function u(){var _,E;if(!bo("optimizador")){L("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const h=t.loans().filter(P=>P.activo&&!P.simulacion);if(h.length===0){L("No hay préstamos activos para optimizar","err");return}const $=t.config(),m=t.accounts().filter(P=>P.activo&&!P.simulacion),y=((_=m.find(P=>P.esCuentaPrincipal))==null?void 0:_._id)??((E=m[0])==null?void 0:E._id)??"",A=$.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${m.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${d(P._id)}"${P._id===y?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(P.nombre)}${P._id===y?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${d(j(rt(P)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${h.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${d(P._id)}"${P.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${d(P.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${d(P.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${et("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${et("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${et("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${te("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${et("opt-fecha-primera","Fecha primera amortización","date","")}
        ${et("opt-fecha-obj","Fecha objetivo para comparar saldo","date",A)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(f(w),U(w,".opt-acc-radio",()=>f(w)),N(w,"[data-opt-todos]",()=>{const P=[...w.querySelectorAll(".opt-loan-check")],M=P.every(S=>S.checked);P.forEach(S=>S.checked=!M)}),N(w,"[data-cancelar]",i),N(w,"[data-opt-calcular]",()=>b(w)),N(w,"[data-opt-comparar]",()=>I(w)))}function f(h){var w;const $=(w=h.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,y=(t.config().margenesSeguridad||[]).filter(_=>_.activo!==!1).filter(_=>!_.cuentas||_.cuentas.length===0||$&&_.cuentas.includes($)),A=h.querySelector("#opt-margenes-wrap");A&&(A.innerHTML=y.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':y.map(_=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${d(_._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(_.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!_.cuentas||_.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function c(h){var A,w,_,E;const $=(P,M,S=0)=>{var z;const F=parseFloat(((z=h.querySelector(P))==null?void 0:z.value)??"");return Number.isFinite(F)?Math.max(S,F):M},m=[...h.querySelectorAll(".opt-loan-check")],y=m.filter(P=>P.checked).map(P=>P.value);return{horizonte:Math.round($("#opt-horizonte",60,1)),frecuencia:Math.round($("#opt-frecuencia",1,1)),minAmortizable:$("#opt-min",500),tipoAmort:((A=h.querySelector("#opt-tipo"))==null?void 0:A.value)||"plazo",fechaObjetivo:((w=h.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((_=h.querySelector("#opt-fecha-primera"))==null?void 0:_.value)||null,loanIds:m.length===0||y.length===m.length?null:y,sourceAccountId:((E=h.querySelector(".opt-acc-radio:checked"))==null?void 0:E.value)??null,selectedMarginIds:[...h.querySelectorAll(".opt-margin-check:checked")].map(P=>P.value)}}const p=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function v(h,$=""){const m=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${d(h)}</div>
        ${$?`<div class="text-sm mt-8" style="color:var(--text3)">${d($)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);m&&(N(m,"[data-opt-volver]",u),N(m,"[data-cancelar]",i))}function b(h){const $=c(h);r()&&L("Plan anterior eliminado, recalculando…");const{loans:m,expenses:y,accounts:A,config:w,nominas:_}=p(),E=l(()=>sa(m,y,A,w,{frecuencia:$.frecuencia,mesesHorizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:_,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!E)return;if(E.plan.length===0){v(`No hay excedente suficiente respetando los ${E.margenesAplicados} márgenes de seguridad activos en los próximos ${$.horizonte} meses para generar amortizaciones por encima del mínimo de ${j($.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:E.plan,tipoAmort:$.tipoAmort};const P=`✨ Plan de optimización · ${$.frecuencia===1?"Mensual":`Cada ${$.frecuencia} meses`} · ${$.horizonte}m`,M=s(P,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j(E.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${d(j(E.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${d(j(E.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${E.margenesAplicados}</div></div>
      </div>
      ${E.resumenPorLoan.map(un).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${E.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${E.plan.map(S=>dn(S,!0)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">
        Las amortizaciones se añaden como <strong>simulaciones</strong> y no afectan tus datos reales
        hasta que las conviertas en reales manualmente desde cada préstamo.
      </div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Descartar</button>
        <button class="btn-primary" data-opt-aplicar>Aplicar plan como simulación</button>
      </div>`);M&&(N(M,"[data-opt-volver]",u),N(M,"[data-cancelar]",i),N(M,"[data-opt-aplicar]",()=>{a&&x(a.plan,a.tipoAmort)}))}function I(h){const $=c(h);r();const{loans:m,expenses:y,accounts:A,config:w,nominas:_}=p(),E=l(()=>xo(m,y,A,w,{horizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaObjetivo:$.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:_,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!E)return;if(E.resultados.length===0){v("No hay excedente suficiente en ninguna frecuencia.");return}e=E;const{resultados:P,saldoBase:M,fechaObjetivo:S}=E,F=P.map(T=>{const R=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${d(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${d(j(T.totalAmortizado))}</td>
          <td class="num pos">${d(j(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=M?"pos":"neg"}">${d(j(T.saldoObjetivo))}</td>
          <td class="num pos">${d(j(T.valorTotal))}</td>
          <td style="font-size:11px">${R}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),z=s(`📊 Comparativa de frecuencias · hasta ${S}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${d(S)}: <strong>${d(j(M))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${d(S.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${F}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);z&&(N(z,"[data-opt-volver]",u),N(z,"[data-cancelar]",i),N(z,"[data-opt-usar]",T=>C(Number(T.getAttribute("data-opt-usar")))))}function C(h){var m;const $=e==null?void 0:e.resultados.find(y=>y.frecuencia===h);$&&(r(),x($.plan,((m=$.plan[0])==null?void 0:m.tipoAmort)||"plazo",{titulo:`✨ Plan ${$.label} · aplicado`,resumen:$,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function x(h,$,m){if(h.length===0)return;const y=new Map;for(const w of h){const _=y.get(w.loanId)??[];_.push({_id:`${ln}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:$,simulacion:!0}),y.set(w.loanId,_)}let A=0;for(const w of t.loans()){const _=y.get(w._id);if(!_)continue;const E=(w.amortizaciones||[]).filter(P=>!cn(P._id));t.guardarAmortizaciones(w._id,[...E,..._]),A+=1}L(`Plan aplicado: ${h.length} amortizaciones en ${A} préstamo${A!==1?"s":""} (simulación)`),m?g(m):i(),t.refrescar([...y.keys()])}function g({titulo:h,resumen:$,fechaObjetivo:m}){const y=s(h,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j($.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${d(j($.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${d((m==null?void 0:m.slice(0,7))??"")}</div><div class="stat-value pos">${d(j($.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${d(j($.totalComisiones))}</div></div>
      </div>
      ${$.resumenPorLoan.map(un).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${$.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${$.plan.map(A=>dn(A,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);y&&N(y,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function dn(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${d(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${d(t.mes)}</td>
    <td>${d(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${d(j(t.capitalAntes))}</td>
    <td class="num neg">${d(j(t.cantidadAmort))}${a}</td>
    <td class="num">${d(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${d(j(t.saldoDisponible))} → ${d(j(t.saldoDespues))}</td>`:""}
  </tr>`}function un(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${d(t.nombre)}</span>
      <span class="badge badge-yellow">${d(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${d(t.fechaFinSin)}</div>
        <div class="num pos">${d(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${d(j(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${d(j(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const al="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ol(t){const e=t.hoy??J;let a=!1;const o=new Set;let n=null,s=null;const i=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)},r=()=>t.store.get("escenarios"),l=A=>{var w;return((w=r().find(_=>_._id===A))==null?void 0:w.nombre)??A};function u(A){const w=A.filter(E=>E.activo);if(w.length<2)return"";const _=(E,P)=>`<button class="btn-secondary btn-sm" data-persona-tab="${E===null?"":d(E)}"
               style="${s===E?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${d(P)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${_(null,"Todas")}
      ${w.map(E=>_(E._id,E.nombre)).join("")}
    </div>`}function f(A){if(!A.activo||A.simulacion)return!1;const w=at(A).tabla.filter(_=>!_.esAmortizacion);return w.length===0?!0:w[w.length-1].fecha<e()}function c(A,w){const _=e(),E=_.slice(0,7),P=new Map;let M=0;for(const S of A){if(!S.activo||S.simulacion||w.has(S._id)||(S.fechaInicio||"")>_)continue;const F=at(S).tabla.filter(T=>!T.esAmortizacion&&T.fecha.startsWith(E)),z=F.length>0?F[0].cuota:0;P.set(S._id,z),M+=z}return{porLoan:P,total:M,activos:[...P.values()].filter(S=>S>0).length}}function p(A){const w=t.store.get("config"),_=w.dashboardStart,E=w.dashboardEnd,P=Math.max(1,(G(E).getTime()-G(_).getTime())/(30.44*864e5));let M=0;for(const S of A)!S.activo||S.simulacion||(M+=at(S).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=_&&F.fecha<=E).reduce((F,z)=>F+z.cuota,0));return{media:M/P,desde:_,hasta:E}}function v(A){const w=t.store.get("personas"),_=Ce(w),E=[...t.store.get("loans")].sort((O,k)=>k.tin-O.tin),P=s?E.filter(O=>Ke(O.repartoConsumo,O.repartoPago,_).has(s)):E,M=new Set(P.filter(f).map(O=>O._id)),S=a?P:P.filter(O=>!M.has(O._id)),F=c(E,new Set(E.filter(f).map(O=>O._id))),z=p(E),T=t.store.get("config"),R=t.store.get("inflacion"),D=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${M.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${M.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${u(w)}
      ${F.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${d(D)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${d(j(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${d(j(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${d(z.desde)} → ${d(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(O=>Jr(O,{periodos:R,usarInflacion:!!T.usarInflacion,hoy:e(),cuotaMes:F.porLoan.get(O._id)??0,completado:M.has(O._id),nombreEscenario:l,personas:w})).join("")}
      </div>`;for(const O of A.querySelectorAll("[data-body-loan]"))o.has(O.dataset.bodyLoan??"")&&O.classList.add("open")}const b=()=>document.getElementById("modal-overlay"),I=()=>document.getElementById("modal-content"),C=()=>{var A;return(A=b())==null?void 0:A.classList.add("hidden")};function x(A,w){const _=b(),E=I();return!_||!E?null:(E.innerHTML=`<div class="modal-title">${d(A)}</div>${w}`,_.classList.remove("hidden"),N(E,"[data-cancelar]",C),E)}function g(A,w){const _=A?t.store.get("loans").find(P=>P._id===A)??null:null,E=x(A?"Editar préstamo":"Nuevo préstamo",Zr(_,t.store.get("accounts"),r(),t.store.get("personas"),e()));E&&(E.addEventListener("change",P=>{const M=P.target;M!=null&&M.matches("[data-dp-modo]")&&on(E),M!=null&&M.matches('[data-reparto-modo="consumo"]')&&Xt(E,"consumo"),M!=null&&M.matches('[data-reparto-modo="pago"]')&&Xt(E,"pago")}),N(E,"[data-guardar-loan]",P=>{h(E,P.getAttribute("data-guardar-loan")||"")&&(C(),w())}))}function h(A,w){const _=T=>{var R;return((R=A.querySelector(T))==null?void 0:R.value)??""},E=T=>{var R;return!!((R=A.querySelector(T))!=null&&R.checked)},P=_("#f-nombre").trim(),M=parseFloat(_("#f-capital")),S=parseFloat(_("#f-tin")),F=parseInt(_("#f-meses"),10);if(!P||!Number.isFinite(M)||!Number.isFinite(S)||!Number.isFinite(F))return L("Completa los campos obligatorios","err"),!1;const z={nombre:P,capital:M,tin:S,meses:F,fechaInicio:_("#f-fecha"),comisionApertura:parseFloat(_("#f-com-ap"))||0,comisionAmort:parseFloat(_("#f-com-am"))||0,diaPago:nn(A),cuenta:_("#f-cuenta"),simulacion:E("#f-sim"),activo:E("#f-activo"),mostrarFechaFinEnDashboard:E("#f-mostrar-fin"),tipoTasa:_("#f-tipo-tasa"),basico:E("#f-basico"),tags:_("#f-tags").split(",").map(T=>T.trim()).filter(Boolean),escenarioIds:[...A.querySelectorAll(".loan-escenario:checked")].map(T=>T.value),repartoConsumo:Zt(A,"consumo"),repartoPago:Zt(A,"pago")};return w?(t.store.updateItem("loans",w,z),L("Préstamo actualizado")):(t.store.addItem("loans",{...z,amortizaciones:[]}),L("Préstamo creado")),i(),!0}function $(A,w,_){const E=t.store.get("loans").find(S=>S._id===A);if(!E)return;const P=w?(E.amortizaciones||[]).find(S=>S._id===w)??null:null,M=x(w?"Editar amortización":"Añadir amortización",tl(A,P,r(),e()));M&&N(M,"[data-guardar-amort]",S=>{const[F,z]=(S.getAttribute("data-guardar-amort")||"").split("|");m(M,F,z)&&(C(),_([F]))})}function m(A,w,_){var R;const E=D=>{var O;return((O=A.querySelector(D))==null?void 0:O.value)??""},P=E("#am-fecha"),M=parseFloat(E("#am-cant"));if(!P||!Number.isFinite(M)||M<=0)return L("Fecha y cantidad requeridas","err"),!1;const S=t.store.get("loans").find(D=>D._id===w);if(!S)return!1;const F={fecha:P,cantidad:M,tipo:E("#am-tipo"),simulacion:!!((R=A.querySelector("#am-sim"))!=null&&R.checked),escenarioIds:[...A.querySelectorAll(".amort-escenario:checked")].map(D=>D.value)},z=S.amortizaciones||[],T=_?z.map(D=>D._id===_?{...D,...F}:D):[...z,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",w,{amortizaciones:T}),L(_?"Amortización actualizada":"Amortización añadida"),i(),!0}function y(A,w,_){N(A,"[data-toggle-finalizados]",()=>{a=!a,w()}),N(A,"[data-persona-tab]",E=>{s=E.getAttribute("data-persona-tab")||null,w()}),N(A,"[data-nuevo-loan]",()=>g(null,w)),N(A,"[data-optimizar]",()=>_.abrir()),N(A,"[data-toggle-loan]",(E,P)=>{var z;if((z=P.target)!=null&&z.closest("button"))return;const M=E.getAttribute("data-toggle-loan"),S=[...A.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===M);(S==null?void 0:S.classList.toggle("open"))?o.add(M):o.delete(M)}),N(A,"[data-editar-loan]",E=>g(E.getAttribute("data-editar-loan"),w)),N(A,"[data-borrar-loan]",E=>{if(!tt("¿Eliminar préstamo?"))return;const P=E.getAttribute("data-borrar-loan");t.store.removeItem("loans",P),o.delete(P),L("Eliminado"),i(),w()}),N(A,"[data-amort-loan]",E=>{const P=E.getAttribute("data-amort-loan");o.add(P),$(P,null,w)}),N(A,"[data-editar-amort]",E=>{const[P,M]=(E.getAttribute("data-editar-amort")||"").split("|");o.add(P),$(P,M,w)}),N(A,"[data-borrar-amort]",E=>{const[P,M]=(E.getAttribute("data-borrar-amort")||"").split("|"),S=t.store.get("loans").find(F=>F._id===P);S&&(t.store.updateItem("loans",P,{amortizaciones:(S.amortizaciones||[]).filter(F=>F._id!==M)}),L("Amortización eliminada"),i(),w([P]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:al,mount(A){const w=(_=[])=>{for(const E of _)o.add(E);v(A)};n??(n=el({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(_,E)=>{t.store.updateItem("loans",_,{amortizaciones:E}),i()},hoy:e,refrescar:w})),v(A),A.dataset.wired!=="1"&&(y(A,w,n),A.dataset.wired="1")}}}const nl={transporte:125,restaurante:220,otros:null},sl={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},il=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],ee=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,rl=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${d(a._id)}"${a._id===e?" selected":""}>${d(a.nombre)}</option>`).join("");function ll(t,e){const a=t.map((s,i)=>{const r=e.find(f=>f._id===s.cuenta),l=nl[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${d(sl[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${d(j(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${d(j(l))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?d(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=e.filter(s=>(s.modeloFondo||"cuenta")!=="pension"&&s.activo!==!1),n=o.filter(s=>(s.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${a||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(s=>`<option value="${d(s._id)}">${d(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function cl(t,e){const a=e.hoy??J(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${ee("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${ee("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${rl(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${ee("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${ee("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${ee("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${il.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${d(s)} (${i+1})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2 mt-8">
          <div class="form-group" id="nf-custom-pagas-wrap"${n?' style="display:none"':""}>
            <label class="form-label">Nº pagas (personalizado)</label>
            <input class="form-input" type="number" id="nf-npagas-custom" min="1" max="24" value="${o}"/>
          </div>
          <div class="form-group"><label class="form-label">Modo IRPF</label>
            <select class="form-select" id="nf-irpfmodo">
              <option value="auto"${((t==null?void 0:t.irpfModo)??"auto")==="auto"?" selected":""}>Auto (tramos)</option>
              <option value="manual"${(t==null?void 0:t.irpfModo)==="manual"?" selected":""}>Manual (%)</option>
            </select>
          </div>
        </div>
        <div id="nf-irpfpct-wrap" class="mt-8"${(t==null?void 0:t.irpfModo)==="manual"?"":' style="display:none"'}>
          ${ee("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??ta).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
            <div class="text-sm mt-4" style="color:var(--text3)">CC 4,70 + Desempleo 1,55 + FP 0,10 + MEI 0,13</div>
          </div>
        </div>
        <div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px">Retribución flexible
            <span style="font-weight:400;color:var(--text3);font-size:11px">(art. 42 LIRPF — exento IRPF y SS)</span></div>
          <div class="auth-hint mb-8" style="border-color:var(--accent)">
            Los importes mensuales reducen la base IRPF. Límites orientativos:
            <strong>transporte €125/mes</strong> (€1.500/año) · <strong>restaurante €220/mes</strong> (~€11/día × 20 días).
          </div>
          <div id="flex-comp-container"></div>
        </div>
        ${ye(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
        ${Qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e.personas,"consumo")}
        ${Qt("Reparto de pago",t==null?void 0:t.repartoPago,e.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function pn(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ta),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e,repartoConsumo:Zt(t,"consumo"),repartoPago:Zt(t,"pago")}}function dl(t,e,a,o){const n=pn(t,e),s=e.reduce((x,g)=>x+(g.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(Mt(n.bruto,s),a.tramos),u=i-r-l,f=i/n.nPagas,c=r/n.nPagas,p=l/n.nPagas,v=f-c-p,b=n.grupoNomina?a.nominas.filter(x=>x.grupoNomina===n.grupoNomina&&x._id!==o):[],I=b.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${d(n.grupoNomina)}" con ${d(b.map(x=>x.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",C=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${d(j(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${d(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${d(j(n.bruto))}</span>
      ${C}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${d(j(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${d(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${d(j(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${d(j(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${d(j(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${d(j(v))}/paga`:`ingreso ${d(j(f))} − SS ${d(j(c))} − IRPF ${d(j(p))}`}${s>0?" + recargas flex":""}</span>
    </div>${I}`}function ul(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=ll(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=dl(t,e,a,o))},i=()=>{var l,u;const r=(f,c)=>{const p=t.querySelector(f);p&&(p.style.display=c?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Xt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Xt(t,"pago")),N(t,"[data-flex-anadir]",()=>{var u,f,c;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((f=t.querySelector("#fc-importe"))==null?void 0:f.value)??"")||0;if(!l)return L("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((c=t.querySelector("#fc-cuenta"))==null?void 0:c.value)||""}),n(),s()}),N(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const mn=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function pl(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ht;function r(p,v){const b=o(),I=n();return!b||!I?null:(I.innerHTML=`<div class="modal-title">${d(p)}</div>${v}`,b.classList.remove("hidden"),N(I,"[data-cerrar]",s),I)}function l(){e=null;const p=[...t.store.get("tramosIRPFHistorico")].sort((I,C)=>I.año-C.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",b=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${v}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${d(mn(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${d(mn(I.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${I.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${I.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);b&&(N(b,"[data-editar-tabla]",I=>{const C=I.getAttribute("data-editar-tabla");c(C==="default"?"default":Number(C))}),N(b,"[data-borrar-tabla]",I=>{const C=Number(I.getAttribute("data-borrar-tabla"));tt(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(x=>x.año!==C)),L(`Tabla ${C} eliminada`),t.onDatosCambiados(),l())}),N(b,"[data-anadir-anyo]",()=>{var x;const I=parseInt(((x=b.querySelector("#irpf-new-year"))==null?void 0:x.value)??"",10);if(!I||I<2e3||I>2100)return L("Año inválido","err");const C=t.store.get("tramosIRPFHistorico");if(C.some(g=>g.año===I))return L("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...C,{_id:Date.now().toString(36),año:I,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([p,v],b)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${b}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${b}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${b}">✕</button>
          </div>
        </div>`).join("")}function f(p){a=[...p.querySelectorAll("[data-tr-min]")].map((b,I)=>{const C=p.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(b.value)||0,parseFloat((C==null?void 0:C.value)??"")||0]})}function c(p){var g;e=p;const v=t.store.get("tramosIRPFHistorico");a=(p==="default"?i():((g=v.find(h=>h.año===p))==null?void 0:g.tramos)??i()).map(h=>[...h]);const I=p==="default"?"tabla por defecto":`ejercicio ${p}`,C=r(`Tramos IRPF — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${d(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!C)return;const x=()=>{const h=C.querySelector("#irpf-tramos-rows");h&&(h.innerHTML=u())};N(C,"[data-volver]",l),N(C,"[data-tr-anadir]",()=>{f(C),a.push([0,0]),x()}),N(C,"[data-tr-borrar]",h=>{f(C),a.splice(Number(h.getAttribute("data-tr-borrar")),1),x()}),N(C,"[data-tr-guardar]",()=>{f(C);const h=[...a].sort(($,m)=>$[0]-m[0]);if(h.length===0)return L("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:h}),L("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===e?{...$,tramos:h}:$)),L(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const fn=1500,Lt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,ml=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${d(n)}"${n===o?" selected":""}>${d(s)}</option>`).join("")}
   </select></div>`,fl=t=>(t.modeloFondo||"cuenta")==="pension";function vl(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>gl(n,e,a,o)).join("")}</div>`}function gl(t,e,a,o){const n=Me(t);if(!n)return"";const s=Ze(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,f)=>u+f.cantidad,0),l=Math.min(r,fn)*(s/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${d(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${d(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${d(j(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${d(j(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${d(j(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${d(j(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${d(j(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${d(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>fn?"neg":""}">${d(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${d(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${d(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${d(n.proxDesbloqueo)}</div>`:""}
  </div>`}function bl(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${d(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${d(j(a.importe))} / ${d(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${d(a.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="paport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([a,o])=>`<option value="${a}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="paport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function hl(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Lt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Lt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Lt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Lt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Lt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${ml("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Lt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${Lt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${n.map(i=>`<option value="${d(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${d(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${d((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    ${ye(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function yl(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=bl(e))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return L("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function xl(t,e,a,o){var C;const n=x=>{var g;return((g=t.querySelector(x))==null?void 0:g.value)??""},s=(x,g=0)=>{const h=parseFloat(n(x));return Number.isFinite(h)?h:g},i=x=>{var g;return!!((g=t.querySelector(x))!=null&&g.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),f={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(x=>x.value)},c=[...(a==null?void 0:a.historicoSaldos)??[]],p=[...(a==null?void 0:a.aportaciones)??[]],b=((C=[...c].sort((x,g)=>g.fecha.localeCompare(x.fecha))[0])==null?void 0:C.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(b===null||Math.abs(l-b)>.005)&&(c.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(b??0)&&p.push({_id:`${I}a`,fecha:o,cantidad:l-(b??0)})):l>0&&(c.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),p.push({_id:`${I}a`,fecha:f.fechaInicialSaldo??o,cantidad:l})),{datos:{...f,historicoSaldos:c,aportaciones:p}}}const $l="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Il(t){const e=t.hoy??J,a=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)};let o=null;function n(g){const h=g.filter(m=>m.activo);if(h.length<2)return"";const $=(m,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${m===null?"":d(m)}"
               style="${o===m?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${d(y)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${$(null,"Todas")}
      ${h.map(m=>$(m._id,m.nombre)).join("")}
    </div>`}function s(){const g=t.store.get("config");return yt(t.store.get("tramosIRPFHistorico"),g.tramos_irpf??ht)(Number(e().slice(0,4)))}function i(g,h,$){const m=aa(g,h,$),y=!!h&&g.irpfModo!=="manual",A=wa(g.repartoConsumo,g.repartoPago,t.store.get("personas")),w=[g.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${g.mesActualizacionIPC}">IPC m${g.mesActualizacionIPC}</span>`:"",m.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${d(j(m.flexAnual))}/año</span>`:"",Math.abs(m.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${m.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(g.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${w}</div>
      </div>
      <div class="num">${d(j(m.brutoAnual))}
        ${m.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${d(j(m.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${d(j(m.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${m.nPagas} pagas</div>
      <div class="text-sm ${y?"neg":""}">${g.irpfModo==="manual"?`${d(g.irpfPct??0)}% (manual)`:`${m.irpfPct.toFixed(1)}% (auto)`}${y?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${g.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${d(r(g.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${d(g._id)}"${g.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${d(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${d(g._id)}">✕</button>
      </div>
    </div>`}const r=g=>{var h;return((h=t.store.get("accounts").find($=>$._id===(g||"default")))==null?void 0:h.nombre)??(g||"default")};function l(g,h,$){const m=h.reduce((w,_)=>w+(_.bruto||0),0),y=is(h,$),A=m>0?y/m*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${d(g)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${d(j(m))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${d(j(y))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${h.map(w=>i(w,h,$)).join("")}
      </div>
    </div>`}function u(g){const h=s(),$=t.store.get("personas"),m=Ce($),y=[...t.store.get("nominas")].sort((M,S)=>(S.bruto||0)-(M.bruto||0)),A=o?y.filter(M=>Ke(M.repartoConsumo,M.repartoPago,m).has(o)):y,{grupos:w,sueltas:_}=ls(A),E=t.store.get("accounts").filter(fl),P=y.filter(M=>M.activo!==!1);g.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n($)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${A.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...w.entries()].map(([M,S])=>l(M,S,h)).join("")}
      ${_.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${_.map(M=>i(M,null,h)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${vl(E,P,h,e())}</div>`}const f=()=>document.getElementById("modal-overlay"),c=()=>document.getElementById("modal-content"),p=()=>{var g;return(g=f())==null?void 0:g.classList.add("hidden")};function v(g,h){const $=f(),m=c();return!$||!m?null:(m.innerHTML=`<div class="modal-title">${d(g)}</div>${h}`,$.classList.remove("hidden"),N(m,"[data-cancelar]",p),m)}function b(g,h){const $=g?t.store.get("nominas").find(w=>w._id===g)??null:null,m=[...($==null?void 0:$.retribucionFlexible)??[]].map(w=>({...w})),y={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:e()},A=v(g?"Editar nómina":"Nueva nómina",cl($,y));A&&(ul(A,m,y,g??""),N(A,"[data-guardar-nomina]",w=>{const _=pn(A,m);if(!_.nombre||_.bruto<=0)return L("Nombre y bruto anual son obligatorios","err");const E=w.getAttribute("data-guardar-nomina")||"",P={..._,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,P),L("Nómina actualizada")):(t.store.addItem("nominas",P),L("Nómina creada")),a(),p(),h()}))}function I(g,h){const $=g?t.store.get("accounts").find(A=>A._id===g)??null:null,m=[...($==null?void 0:$.planAportaciones)??[]].map(A=>({...A})),y=v(g?"Editar plan de pensiones":"Nuevo plan de pensiones",hl($,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));y&&(yl(y,m,e()),N(y,"[data-guardar-pension]",A=>{const{datos:w,error:_}=xl(y,m,$,e());if(_)return L(_,"err");const E=A.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,w),L("Plan actualizado")):(t.store.addItem("accounts",w),L("Plan creado")),a(),p(),h()}))}function C(g,h,$){N(g,"[data-persona-tab]",m=>{o=m.getAttribute("data-persona-tab")||null,h()}),N(g,"[data-nueva-nomina]",()=>b(null,h)),N(g,"[data-editar-nom]",m=>b(m.getAttribute("data-editar-nom"),h)),N(g,"[data-borrar-nom]",m=>{tt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",m.getAttribute("data-borrar-nom")),L("Eliminada"),a(),h())}),U(g,"[data-activo-nom]",m=>{const y=m;t.store.updateItem("nominas",y.getAttribute("data-activo-nom"),{activo:y.checked}),a(),h()}),N(g,"[data-tramos]",()=>$.abrir()),N(g,"[data-nueva-pension]",()=>I(null,h)),N(g,"[data-editar-pension]",m=>I(m.getAttribute("data-editar-pension"),h)),N(g,"[data-borrar-pension]",m=>{tt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",m.getAttribute("data-borrar-pension")),L("Plan eliminado"),a(),h())})}let x=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:$l,mount(g){const h=()=>u(g);x??(x=pl({store:t.store,onDatosCambiados:()=>{a(),h()},año:()=>Number(e().slice(0,4))})),u(g),g.dataset.wired!=="1"&&(C(g,h,x),g.dataset.wired="1")}}}const Al="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",wl="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",vn={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Sl={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Cl(t,e){const a=t.filter(l=>l.activo&&vt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Vt(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${d(j(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${d(j(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${d(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${d(j(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${d(j(i))}</div><div class="stat-sub">Neto: ${d(j(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Ml(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=ie(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(ft(e.inflacion,a,o)-1),u=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${d(j(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${d(j(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${d(a.slice(0,7))} → ${d(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${d(j(i))}</span>
    </div>${r}
  </div>`}function El(t,e){const a=vn[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(b=>b.cuenta===t._id).map(b=>({nomina:v,importe:b.importe}))),s=n.reduce((v,b)=>v+b.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),f=Qa(u,e.tramosIRPF),c=l*f/100,p=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${f}%`:`tipo marginal ${f}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${d(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${d(j(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${d(j(i))}/año${r?` ⚠ excede límite ${d(j(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${d(j(o))}/año</span></div>`:""}
    ${c>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${d(p)}">≈ ${d(j(c))}/año <span style="font-size:10px;color:var(--text3)">(${d(f)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${d(v.nomina.nombre)}: ${d(j(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function _l(t){const e=Me(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${d(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${d(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${d(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${d(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${d(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${d(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function jl(t,e){const a=Vt(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,f=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),c=a.costBase+n.totalAportaciones,p=Math.max(0,f-c),v=Xe(p,e.tramosGanancias),b=p>0?(v/p*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",C=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",x=(A,w,_)=>A.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${d(E.contraparte)}: ${d(E.concepto)}</span>
          <span class="num ${_}">${d(j(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),h=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${d(o.dashboardStart.slice(0,7))} → ${d(o.dashboardEnd.slice(0,7))})</div>
         ${x(n.entradas,"↓","pos")}
         ${x(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${d(j(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${d(j(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${d(j(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=e.invModo(t._id),m=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${d(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${d(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${d(j(a.neto))}</div><div class="stat-sub">${d(C)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${d(j(c))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${d(j(f))}</div><div class="stat-sub">${d(I)} · ${d(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${d(j(f-v))}</div><div class="stat-sub">${d(b)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${d(t._id)}|real" style="${m($==="real")}">Real</button>
          <button data-inv-modo="${d(t._id)}|proyeccion" style="${m($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${h}
    </div>`}function Pl(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=vt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${d((vn[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${d(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${d(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${d(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${d(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${wl}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Al}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${d(j(t.saldoInicial||0))}</div><div class="stat-sub">${d(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${d(j(n))}</div>${o?`<div class="stat-sub">Registro: ${d(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${d(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${d(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ml(t,e)}
    ${s==="beneficio"?El(t,e):""}
    ${s==="pension"?_l(t):""}
    ${s==="inversion"?jl(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${d(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${d(t.descripcion)}</div>`:""}
  </div>`}const zl=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Fl(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${d(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${d(j(a.importe))} / ${d(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${d(a.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="aport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([a,o])=>`<option value="${a}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="aport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Dl(t,e){const a=t?vt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${et("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${te("ac-modelo","Tipo",zl,a)}
    </div>
    <div class="grid-2 mt-8">
      ${et("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${et("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${et("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${et("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${te("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
        </div>
        <div id="ac-inversion-hint"${n(a==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${n(a==="beneficio")}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${te("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(s=>`<option value="${d(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${d(s)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${d((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
        ${ye(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Tl(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Fl(e))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return L("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Nl(t,e,a,o,n){const s=b=>{var I;return((I=t.querySelector(b))==null?void 0:I.value)??""},i=(b,I=0)=>{const C=parseFloat(s(b));return Number.isFinite(C)?C:I},r=b=>{var I;return!!((I=t.querySelector(b))!=null&&I.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",f=u==="beneficio",c=i("#ac-saldo"),p={nombre:l,saldo:c,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(b=>b.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:f?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:f?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&c<=0)return{datos:p};if(!(o===null||Math.abs(c-o)>.005))return{datos:p};if(u==="inversion"&&c>(o??0)){const b=Date.now().toString(36);p.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${b}a`,fecha:a?n:p.fechaInicialSaldo??n,cantidad:c-(o??0)}]}return{datos:p,punto:{fecha:n,saldo:c,nota:a?"Actualización manual":"Saldo inicial"}}}function Ca(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:X(e.saldoCts),nota:e.nota}))}function Rl(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${d(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${d(j(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${d(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${d(e)}|${d(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${d(e)}|${d(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${d(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${d(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${d(e)}">Añadir</button>
    </div>`}const gn=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Ol(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??zt;function r(p,v){const b=o(),I=n();return!b||!I?null:(I.innerHTML=`<div class="modal-title">${d(p)}</div>${v}`,b.classList.remove("hidden"),N(I,"[data-cerrar]",s),I)}function l(){e=null;const p=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,C)=>I.año-C.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",b=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${v}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${d(gn(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${d(gn(I.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${I.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${I.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);b&&(N(b,"[data-editar-tg]",I=>{const C=I.getAttribute("data-editar-tg");c(C==="default"?"default":Number(C))}),N(b,"[data-borrar-tg]",I=>{const C=Number(I.getAttribute("data-borrar-tg"));tt(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(x=>x.año!==C)),L(`Tabla ${C} eliminada`),t.onDatosCambiados(),l())}),N(b,"[data-anadir-anyo-tg]",()=>{var x;const I=parseInt(((x=b.querySelector("#tg-new-year"))==null?void 0:x.value)??"",10);if(!I||I<2e3||I>2100)return L("Año inválido","err");const C=t.store.get("tramosGananciasCapitalHistorico");if(C.some(g=>g.año===I))return L("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...C,{_id:Date.now().toString(36),año:I,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([p,v],b)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${b}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${b}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${b}">✕</button>
          </div>
        </div>`).join("")}function f(p){a=[...p.querySelectorAll("[data-tg-min]")].map((v,b)=>{const I=p.querySelector(`[data-tg-pct="${b}"]`);return[parseFloat(v.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function c(p){var x;e=p;const v=t.store.get("tramosGananciasCapitalHistorico");a=(p==="default"?i():((x=v.find(g=>g.año===p))==null?void 0:x.tramos)??i()).map(g=>[...g]);const I=r(`Ganancias de capital — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const C=()=>{const g=I.querySelector("#tg-rows");g&&(g.innerHTML=u())};N(I,"[data-volver-tg]",l),N(I,"[data-tg-anadir]",()=>{f(I),a.push([0,0]),C()}),N(I,"[data-tg-borrar]",g=>{f(I),a.splice(Number(g.getAttribute("data-tg-borrar")),1),C()}),N(I,"[data-tg-guardar]",()=>{f(I);const g=[...a].sort((h,$)=>h[0]-$[0]);if(g.length===0)return L("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:g}),L("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(h=>h.año===e?{...h,tramos:g}:h)),L(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function ql(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=Va(s,i,r),u=s.targetAmount||0,f=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${d(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${d(j(l))} / ${d(j(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${f}%;background:${d(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((f,c)=>(f.prioridad||99)-(c.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(f=>a(f,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){N(s,"[data-ir-planner]",()=>e()),N(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(tt(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);L("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const Ll="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",kl=120;function Bl(t){const e=t.hoy??J,a=()=>{var M;return(M=t.onDatosCambiados)==null?void 0:M.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=M=>{var S;return((S=i().find(F=>F._id===M))==null?void 0:S.nombre)??M},l=M=>{var S;return((S=t.store.get("accounts").find(F=>F._id===M))==null?void 0:S.nombre)??M},u=()=>yt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??ht)(Number(e().slice(0,4))),f=()=>yt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??zt),c=()=>f()(Number(e().slice(0,4))),p=M=>mo(t.store.get("expenses"),s(),t.store.get("loans"),M);function v(){const M=s(),S=t.store.get("accounts"),F=ce({loans:[],expenses:t.store.get("expenses").filter(O=>O.tipo==="transferencia"),accounts:S,config:{dashboardStart:M.dashboardStart,dashboardEnd:M.dashboardEnd,fechaReferencia:M.dashboardStart},nominas:[],resolverTramosGanancias:f()}),z=new Map,T=O=>{let k=z.get(O);return k||(k={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},z.set(O,k)),k},R=(O,k)=>{const B=`${k.sourceId}`,q=O.find(Y=>Y.concepto===B),H=q??{concepto:B,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(k.cuantia),H.ocurrencias+=1,q||O.push(H)};for(const O of F){if(!O.cuenta)continue;const k=T(O.cuenta);O.sourceType==="transfer-in"||O.sourceType==="traspaso-in"?(k.totalAportaciones+=Math.abs(O.cuantia),R(k.entradas,O)):O.sourceType==="transfer-out"||O.sourceType==="traspaso-out"?(k.totalReembolsos+=Math.abs(O.cuantia),R(k.salidas,O)):O.sourceType==="investment-tax"&&(k.retencion+=Math.abs(O.cuantia))}const D=t.store.get("expenses");for(const O of z.values())for(const[k,B]of[[O.entradas,"cuenta"],[O.salidas,"cuentaDestino"]])for(const q of k){const H=D.find(Y=>Y._id===q.concepto);q.contraparte=l((H==null?void 0:H[B])??"default"),q.concepto=(H==null?void 0:H.concepto)||(B==="cuenta"?"Aportación":"Reembolso")}return z}function b(){const M=new Map,S=s(),F=e(),z=new Date(Number(F.slice(0,4)),Number(F.slice(5,7))-1+kl+1,0),T=`${z.getFullYear()}-${String(z.getMonth()+1).padStart(2,"0")}-${String(z.getDate()).padStart(2,"0")}`;return R=>{const D=M.get(R._id);if(D)return D;const O=ce({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...S,dashboardStart:F,dashboardEnd:T,fechaReferencia:F},filtroAccounts:[R._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:yt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??ht),resolverTramosGanancias:f()}).map(k=>({fecha:k.fecha,saldoAcum:k.saldoAcum}));return M.set(R._id,O),O}}const I=ql({store:t.store,colchonEnFecha:p,extractoCuenta:M=>C(M),hoy:e,onDatosCambiados:a});let C=b();function x(M){C=b();const F=t.store.get("accounts").filter(D=>vt(D)!=="pension"),z=v(),T={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:c(),nombreEscenario:r,flujos:D=>z.get(D)??Sl,invModo:D=>n.get(D)??"proyeccion"};M.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Cl(F,T.tramosGanancias)}
      <div class="grid-3">${F.map(D=>Pl(D,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const R=M.querySelector("#goals-section");R&&I.render(R)}const g=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),$=()=>{var M;return(M=g())==null?void 0:M.classList.add("hidden")};function m(M,S){const F=g(),z=h();return!F||!z?null:(z.innerHTML=M?`<div class="modal-title">${d(M)}</div>${S}`:S,F.classList.remove("hidden"),N(z,"[data-cancelar]",$),z)}function y(M,S){const F=M?t.store.get("accounts").find(D=>D._id===M)??null:null,z=[...(F==null?void 0:F.planAportaciones)??[]].map(D=>({...D})),T=F?A(F):null,R=m(M?"Editar cuenta / fondo":"Nueva cuenta / fondo",Dl(F,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));R&&(Tl(R,z,e()),N(R,"[data-guardar-acc]",D=>{const O=D.getAttribute("data-guardar-acc")||"",{datos:k,punto:B,error:q}=Nl(R,z,F,T,e());if(q)return L(q,"err");let H=O;O?t.store.updateItem("accounts",O,k):H=t.store.addItem("accounts",k)._id,B&&t.ledger.registrarPuntoControl(H,B.fecha,B.saldo,B.nota),L(O?"Actualizada":"Cuenta / fondo creado"),a(),$(),S()}))}function A(M){const S=t.ledger.puntosControl(M._id);return S.length>0?Ca(S)[0].saldo:M.saldo??null}function w(M,S){const F=t.store.get("accounts").find(R=>R._id===M);if(!F)return;const z=m("Histórico de saldos",Rl(F.nombre,M,Ca(t.ledger.puntosControl(M)),F.saldoInicial||0,e()));if(!z)return;const T=()=>{S(),w(M,S)};N(z,"[data-hist-anadir]",()=>{var k,B,q;const R=((k=z.querySelector("#hi-fecha"))==null?void 0:k.value)??"",D=parseFloat(((B=z.querySelector("#hi-saldo"))==null?void 0:B.value)??""),O=((q=z.querySelector("#hi-nota"))==null?void 0:q.value.trim())??"";if(!R||!Number.isFinite(D))return L("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(M,R,D,O||void 0),L("Punto añadido"),a(),T()}),N(z,"[data-hist-borrar]",R=>{const[,D]=(R.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(D),L("Eliminado"),a(),T()}),N(z,"[data-hist-inicial]",R=>{const[D,O]=(R.getAttribute("data-hist-inicial")||"").split("|"),k=t.ledger.puntosControl(D).find(q=>q._id===O);if(!k)return;const B=Ca([k])[0].saldo;t.store.updateItem("accounts",D,{saldoInicial:B,fechaInicialSaldo:k.fecha}),L(`Punto inicial → ${k.fecha} (${j(B)})`),a(),T()})}function _(M){const S=t.store.get("accounts").filter(T=>T.activo);if(S.length===0)return L("No hay cuentas activas","err");const F=e(),z=S.map(T=>`• ${T.nombre}: ${j(A(T)??T.saldoInicial??0)}`).join(`
`);if(tt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${F})?

${z}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of S)t.store.updateItem("accounts",T._id,{saldoInicial:A(T)??T.saldoInicial??0,fechaInicialSaldo:F});L("Saldo base actualizado"),a(),M()}}function E(M,S,F){N(M,"[data-nueva-acc]",()=>y(null,S)),N(M,"[data-editar-acc]",z=>y(z.getAttribute("data-editar-acc"),S)),N(M,"[data-tramos-ganancias]",()=>F.abrir()),N(M,"[data-reset-base]",()=>_(S)),N(M,"[data-hist-acc]",z=>w(z.getAttribute("data-hist-acc"),S)),N(M,"[data-principal-acc]",z=>{const T=z.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(R=>({...R,esCuentaPrincipal:R._id===T}))),L("Cuenta marcada como principal"),a(),S()}),N(M,"[data-borrar-acc]",z=>{const T=z.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return L("Debe existir al menos una cuenta","err");if(!tt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const D=t.store.get("accounts");D.length>0&&!D.some(O=>O.esCuentaPrincipal)&&t.store.set("accounts",D.map((O,k)=>k===0?{...O,esCuentaPrincipal:!0}:O)),L("Cuenta eliminada"),a(),S()}),N(M,"[data-inv-modo]",z=>{const[T,R]=(z.getAttribute("data-inv-modo")||"").split("|");n.set(T,R==="real"?"real":"proyeccion"),S()}),I.wire(M,S)}let P=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Ll,mount(M){const S=()=>x(M);P??(P=Ol({store:t.store,onDatosCambiados:()=>{a(),S()},año:()=>Number(e().slice(0,4))})),x(M),M.dataset.wired!=="1"&&(E(M,S,P),M.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${d(j(e))}</td>
  </tr>`,Ma=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${d(t)}</td></tr>`;function bn(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",n=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${Ma("RENDIMIENTOS DEL TRABAJO")}
      ${ot("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?ot("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?ot("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${ot("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${ot("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${ot("= Rendimiento neto trabajo",t.RNT)}
      ${ot("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?ot(`− Aportaciones a planes de pensiones (${d(j(t.aportPP))}, límite ${d(j(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?ot("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?ot("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?ot("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${d(j(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${d(j(t.cuotaGen))}</td>
      </tr>

      ${Ma("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${d(j(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${d(j(t.cuotaAho))}</td>
      </tr>

      ${Ma("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${n}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${d(j(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const xe=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${d(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${d(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${d(o)}</div>`:""}
  </div>`;function Hl(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
           ⚠️ No tienes nóminas configuradas. Ve a <strong>Nóminas</strong> para añadir tus ingresos del trabajo.
         </div>`:"";return`
    <div class="auth-hint mb-12" style="border-color:var(--accent)">
      📋 Estimación orientativa de tu declaración de la renta <strong>${t.año}</strong> con los datos de la aplicación.
      Los rendimientos del trabajo se detectan automáticamente; introduce a mano lo que la aplicación no conoce.
      <strong>No sustituye el asesoramiento fiscal profesional.</strong>
    </div>
    ${a}

    <div class="grid-2" style="gap:16px;align-items:start">
      <div>
        <div class="card" style="padding:16px;margin-bottom:12px">
          <div class="card-title mb-12">Datos adicionales</div>
          <div class="text-sm mb-8" style="color:var(--text2)">Importes anuales que la aplicación no calcula sola.</div>
          ${xe("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${xe("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${xe("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${xe("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${xe("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${d(o.nombre)}: ${d(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${d(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${bn(t.declaracion)}</div>
      </div>
    </div>`}function hn(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${d(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${d(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Gl=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${d(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${d(t)}</div><div class="stat-value ${a}">${d(e)}</div></div>`,It=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${d(t)}</span><span class="num ${a}">${d(e)}</span></div>`;function Vl(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Gl("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Vt(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const f=u.costBase>0?u.plusvalia/u.costBase*100:0,c=(l.escenarioIds||[]).map(p=>`<span class="badge badge-yellow">🔭 ${d(a(p))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${d(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${c}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",j(u.saldo))}
            ${ct("Coste base (aportado)",j(u.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${f>=0?"+":""}${f.toFixed(1)}%)`,j(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",j(u.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${d(j(u.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${ct("Valor total de la cartera",j(n))}
        ${ct("Total aportado (coste base)",j(s))}
        ${ct("Plusvalía latente total",j(n-s),n-s>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",j(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",j(n-i),"pos")}
      </div>
    </div>

    ${r}

    <div class="card mt-16">
      <div class="card-title mb-12">Marco fiscal — Fondos de inversión</div>
      <div class="grid-2" style="gap:16px;margin-bottom:16px">
        <div style="padding:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:#10b981">✓ Traspaso (fondo → fondo)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            <strong>Sin tributación</strong> (art. 94 LIRPF). Diferimiento fiscal total: la plusvalía latente queda acumulada
            y la base de coste se traslada al nuevo fondo.
          </div>
        </div>
        <div style="padding:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:var(--red)">€ Reembolso (fondo → cuenta corriente)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            Tributa como <strong>ganancia patrimonial</strong> en la base del ahorro, con retención del <strong>19 %</strong>
            sobre la plusvalía proporcional al importe retirado.
          </div>
        </div>
      </div>
      <div style="margin-bottom:4px;font-size:12px;font-weight:600;color:var(--text2)">Tramos de ganancias patrimoniales (base del ahorro)</div>
      ${hn(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Ul(t){const{nominas:e,planes:a,tramos:o}=t,n=v=>v.grupoNomina?e.filter(b=>(b.grupoNomina||"")===v.grupoNomina):null,s=e.map(v=>({n:v,d:aa(v,n(v),o)})),i=s.reduce((v,b)=>v+b.d.brutoAnual,0),r=s.reduce((v,b)=>v+b.d.irpfAnual,0),l=s.reduce((v,b)=>v+b.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:v,d:b})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${d(v.nombre)}</div>
          ${It("Bruto anual",j(b.brutoAnual))}
          ${b.flexAnual>0?It("− Retribución flexible exenta",j(-b.flexAnual),"pos"):""}
          ${It("− Cotización SS",j(-b.ssAnual),"neg")}
          ${It(`− IRPF estimado (${b.irpfPct.toFixed(1)} %)`,j(-b.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${d(j(b.baseDineraria-b.ssAnual-b.irpfAnual))}</span>
          </div>
        </div>`).join(""),f=Qa(e,o),c=`${t.hoy.slice(0,4)}-01-01`,p=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(v=>{const b=Me(v);if(!b)return"";const I=(v.aportaciones||[]).filter(h=>h.fecha>=c).reduce((h,$)=>h+$.cantidad,0),x=Math.min(I,Dt)*f/100,g=I>Dt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${d(v.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${It("Valor actual",j(b.saldo))}
          ${It("Coste base (total aportado)",j(b.costBase))}
          ${It("Revalorización",j(b.beneficio),b.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${d(t.hoy.slice(0,4))}</div>
            ${It("Aportado",`${j(I)}${g?" ⚠":""}`,g?"neg":"")}
            ${It("Límite deducible",j(Dt))}
            ${It(`Ahorro IRPF est. (marginal ${f} %)`,j(x),"pos")}
            ${g?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${d(j(Dt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${b.proxDesbloqueo?`· Próx. desbloqueo: ${d(b.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${ct("Bruto anual total",j(i))}
        ${ct("Cotización SS anual",j(l),"neg")}
        ${ct("IRPF estimado anual",j(r),"neg")}
        ${ct("Neto anual",j(i-l-r),"pos")}
      </div>
      <div class="grid-3">${u}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${d(j(Dt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${p}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${hn(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const Ne=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${d(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${d(e)}</div>
  </div>`;function Yl(){return`
    <div class="card" style="text-align:center;padding:56px 32px;border:2px dashed var(--border)">
      <div style="font-size:44px;margin-bottom:16px">🏠</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">Capital Inmobiliario</div>
      <span class="badge" style="margin-bottom:20px;font-size:12px;padding:5px 14px;background:rgba(99,102,241,0.12);color:var(--accent)">En construcción</span>
      <div class="text-sm" style="color:var(--text2);max-width:480px;margin:0 auto 28px;line-height:1.6">
        Aquí podrás gestionar <strong>ingresos por alquiler</strong>, aplicar la reducción del 60 % para arrendamiento de
        vivienda habitual y deducir los gastos correspondientes. Mientras tanto, introduce el rendimiento neto a mano en
        la pestaña <strong>Declaración Renta</strong>.
      </div>
      <div class="grid-2" style="max-width:480px;margin:0 auto;gap:12px;text-align:left">
        ${Ne("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${Ne("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${Ne("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${Ne("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const yn=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Jl="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Wl(t){const e=t.hoy??J;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(g=>g.activo),r=()=>t.store.get("accounts").filter(g=>(g.modeloFondo||"cuenta")==="pension"),l=g=>{var h;return((h=t.store.get("escenarios").find($=>$._id===g))==null?void 0:h.nombre)??g},u=()=>yt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??ht)(s()),f=()=>yt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??zt)(s());function c(){const g=`${s()}-01-01`,h=t.store.get("nominas").filter(y=>y.activo&&!y.simulacion),$=r().reduce((y,A)=>y+(A.aportaciones||[]).filter(w=>w.fecha>=g).reduce((w,_)=>w+_.cantidad,0),0),m=t.store.get("expenses").filter(y=>y.activo&&y.sujetoIRPF&&y.tipo==="ingreso").reduce((y,A)=>y+Xa(A),0);return to({nominas:h,aportacionesPension:$,otrosIngresos:m,extras:o,tramosGeneral:u(),tramosAhorro:f()})}function p(){const g=u(),h=i(),$=S=>S.grupoNomina?h.filter(F=>(F.grupoNomina||"")===S.grupoNomina):null,m=h.map(S=>aa(S,$(S),g)),y=m.reduce((S,F)=>S+F.brutoAnual,0),A=m.reduce((S,F)=>S+F.irpfAnual,0),w=m.reduce((S,F)=>S+F.ssAnual,0),_=t.store.get("accounts").filter(S=>(S.modeloFondo||"cuenta")==="inversion");let E=0,P=0;for(const S of _){const F=Vt(S,f());F&&(E+=F.plusvalia,P+=F.impuesto)}if(y<=0&&_.length===0)return"";const M=(S,F,z)=>`<div class="exec-item"><div class="exec-item-label">${d(S)}</div><div class="exec-item-val ${z}">${d(F)}</div></div>`;return`<div class="exec-summary mb-14">
      ${y>0?M("IRPF trabajo",`${j(A)}/año`,"neg"):""}
      ${y>0?M("Neto trabajo",`${j(y-w-A)}/año`,"pos"):""}
      ${_.length>0?M("Plusvalía latente",j(E),E>=0?"pos":"neg"):""}
      ${_.length>0?M("Imp. potencial (inversión)",j(P),"neg"):""}
    </div>`}function v(){return a==="mobiliario"?Vl(t.store.get("accounts"),f(),l):a==="trabajo"?Ul({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?Yl():Hl({año:s(),extras:o,declaracion:c(),nominas:i().map(g=>({nombre:g.nombre,bruto:g.bruto||0})),planes:r().map(g=>g.nombre)})}function b(g,h){const $=a===g;return`<button data-tab-fisc="${g}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${$?"600":"400"};
      color:${$?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${$?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${d(h)}</button>`}function I(g){const h=g.querySelector("#fisc-tabs"),$=g.querySelector("#fisc-tab-content");h&&(h.innerHTML=yn.map(([m,y])=>b(m,y)).join("")),$&&($.innerHTML=v())}function C(g){g.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${p()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${yn.map(([h,$])=>b(h,$)).join("")}
      </div>
      <div id="fisc-tab-content">${v()}</div>`}function x(g){N(g,"[data-tab-fisc]",h=>{a=h.getAttribute("data-tab-fisc")||"declaracion",I(g)}),g.addEventListener("input",h=>{var A;if(!((A=h.target)==null?void 0:A.closest("[data-rex]")))return;const m=w=>{var _;return((_=g.querySelector(`#${w}`))==null?void 0:_.value)??"0"};o={capInmobiliario:parseFloat(m("rex-inmobiliario"))||0,capMobiliario:parseFloat(m("rex-mobiliario"))||0,gananciasFondos:parseFloat(m("rex-ganancias"))||0,otrasCorto:parseFloat(m("rex-otras"))||0,retCapital:parseFloat(m("rex-ret-cap"))||0};const y=g.querySelector("#renta-cuadro");y&&(y.innerHTML=bn(c()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Jl,mount(g){C(g),g.dataset.wired!=="1"&&(x(g),g.dataset.wired="1")}}}const xn=()=>globalThis.Chart??null;function Kl(t,e){const a=xn();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${j(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>j(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Ql=()=>xn()!==null,kt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Xl="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Zl(t){const e=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=y=>{var A;return y?((A=s().find(w=>w._id===y))==null?void 0:A.nombre)??y:"Base"};function r(y){const A=n(),w=Ya({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(y==null?void 0:y._id)??null),_=a.size>0?w.accounts.filter(S=>!a.has(S._id)):w.accounts,E=a.size>0?_.map(S=>S._id):null,P=y!=null&&y.fechaFin&&y.fechaFin>A.dashboardEnd?y.fechaFin:A.dashboardEnd;return{eventos:ce({loans:w.loans,expenses:w.expenses,accounts:_,config:{...A,dashboardEnd:P},filtroAccounts:E,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:yt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??ht),resolverTramosGanancias:yt(t.store.get("tramosGananciasCapitalHistorico"),A.tramosGananciasCapital??zt)}),horizonte:P}}function l(y){const A=t.store.get("loans"),w=M=>(M.escenarioIds||[]).includes(y),_=[[A.filter(w).length,"préstamo","préstamos"],[A.flatMap(M=>M.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],E=_.reduce((M,[S])=>M+S,0),P=_.filter(([M])=>M>0).map(([M,S,F])=>`${M} ${M===1?S:F}`).join(" · ");return{total:E,texto:P}}function u(y,A){const w=A===y._id,_=y.color||kt[0],{total:E,texto:P}=l(y._id);return`<div class="card mb-12" style="border-left:3px solid ${d(_)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${d(_)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${d(y.nombre)}</span>
        ${w?'<span class="badge badge-yellow">● Activo</span>':""}
        ${y.fechaFin?`<span class="badge badge-inactive">📅 ${d(y.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${w?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${d(y._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${d(y._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${d(y._id)}">✕</button>
        </div>
      </div>
      ${y.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${d(y.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${E===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${d(P)}</span>`}
      </div>
    </div>`}function f(y){const A=n().dashboardEnd,w=Je(r(null).eventos,A);return`
      <div class="card-title" style="margin-bottom:10px">Saldo en la fecha objetivo, frente a la base</div>
      <table style="width:100%;font-size:13px;border-collapse:collapse">
        <thead>
          <tr style="color:var(--text2);border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:6px 10px">Escenario</th>
            <th style="text-align:right;padding:6px 10px">Fecha objetivo</th>
            <th style="text-align:right;padding:6px 10px">Saldo estimado</th>
            <th style="text-align:right;padding:6px 10px">vs Base</th>
          </tr>
        </thead>
        <tbody>${y.map(E=>{const{eventos:P}=r(E),M=E.fechaFin||A,S=Je(P,M),F=S!==null&&w!==null?S-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d(E.color||kt[0])};margin-right:6px"></span>
            ${d(E.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${d(M)}</td>
          <td class="num" style="padding:6px 10px">${S!==null?d(j(S)):"—"}</td>
          <td class="num ${F===null?"":F>=0?"pos":"neg"}" style="padding:6px 10px">
            ${F===null?"—":`${F>=0?"+":""}${d(j(F))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function c(){const y=t.store.get("accounts");return y.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${y.map(w=>{const _=a.has(w._id);return`<button data-toggle-cuenta="${d(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${_?"var(--border)":"var(--accent)"};
          background:${_?"transparent":"rgba(99,102,241,0.1)"};
          color:${_?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${_?"text-decoration:line-through;":""}">${d(w.nombre)}</button>`}).join("")}
    </div>`}function p(){if(o){try{o.destroy()}catch{}o=null}}function v(y){const A=n(),w=r(null),_=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:Ye(w.eventos,A.dashboardStart,A.dashboardEnd)}];return y.forEach((E,P)=>{const{eventos:M,horizonte:S}=r(E);_.push({label:E.nombre,color:E.color||kt[P%kt.length],puntos:Ye(M,A.dashboardStart,S)})}),_}function b(y,A){p();const w=y.querySelector("#chart-comparacion");w&&(o=Kl(w,v(A)))}function I(y){p();const A=new Set(t.store.get("accounts").map(E=>E._id));for(const E of[...a])A.has(E)||a.delete(E);const w=s(),_=n().escenarioActivo||null;y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${_?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${d(i(_))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este supuesto</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${w.length===0?`<div class="card mb-14" style="padding:20px 24px">
               <div style="font-weight:600;font-size:14px;margin-bottom:8px">¿Qué son los supuestos?</div>
               <div class="text-sm" style="color:var(--text2);line-height:1.7;margin-bottom:12px">
                 Los supuestos sirven para probar <strong>situaciones hipotéticas</strong> sin tocar tu plan base:
                 ¿qué pasaría si amortizas la hipoteca de forma agresiva?, ¿si cambias de trabajo y sube el sueldo?,
                 ¿si abres una inversión nueva?<br><br>
                 <strong>Cómo funciona:</strong>
                 <ol style="margin:8px 0 0 16px;padding:0">
                   <li>Crea un supuesto con un nombre descriptivo.</li>
                   <li>En Préstamos, Gastos, Cuentas o Nóminas, asigna los elementos que pertenecen a él.</li>
                   <li>Actívalo para ver cómo cambia la proyección del Dashboard.</li>
                 </ol>
               </div>
               <button class="btn-primary btn-sm" data-nuevo-esc>+ Crear mi primer supuesto</button>
             </div>
             <div class="card" style="text-align:center;padding:32px;color:var(--text3)">
               <div style="font-size:13px">Una vez creado, asígnale préstamos, gastos o cuentas desde sus secciones, con el selector de «Supuestos» del formulario.</div>
             </div>`:`<div>${w.map(E=>u(E,_)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${c()}</div>
               ${Ql()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${f(w)}</div>`}`,w.length>0&&b(y,w)}const C=()=>document.getElementById("modal-overlay"),x=()=>document.getElementById("modal-content"),g=()=>{var y;return(y=C())==null?void 0:y.classList.add("hidden")};function h(y,A){const w=y?s().find(M=>M._id===y)??null:null,_=C(),E=x();if(!_||!E)return;const P=(w==null?void 0:w.color)||kt[0];E.innerHTML=`
      <div class="modal-title">${y?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${d((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${d((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${kt.map(M=>`<div data-color-esc="${M}" style="width:26px;height:26px;border-radius:50%;background:${M};cursor:pointer;
              border:2px solid ${M===P?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${d(P)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${d((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${d(y??"")}">${y?"Guardar cambios":"Crear escenario"}</button>
      </div>`,_.classList.remove("hidden"),N(E,"[data-cancelar]",g),N(E,"[data-color-esc]",M=>{const S=M.getAttribute("data-color-esc");E.querySelector("#esc-color").value=S;for(const F of E.querySelectorAll("[data-color-esc]"))F.style.border=F.getAttribute("data-color-esc")===S?"2px solid white":"2px solid transparent"}),N(E,"[data-guardar-esc]",M=>{const S=E.querySelector("#esc-nombre").value.trim();if(!S)return L("El nombre es obligatorio","err");const F={nombre:S,fechaFin:E.querySelector("#esc-fecha-fin").value||null,color:E.querySelector("#esc-color").value||kt[0],descripcion:E.querySelector("#esc-desc").value.trim()},z=M.getAttribute("data-guardar-esc")||"";z?(t.store.updateItem("escenarios",z,F),L("Escenario actualizado")):(t.store.addItem("escenarios",F),L("Escenario creado")),e(),g(),A()})}function $(y,A){if(!tt("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=_=>_.map(E=>({...E,escenarioIds:(E.escenarioIds||[]).filter(P=>P!==y)}));t.store.set("loans",w(t.store.get("loans")).map(_=>({..._,amortizaciones:w(_.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),n().escenarioActivo===y&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",y),L("Escenario eliminado"),e(),A()}function m(y,A){N(y,"[data-nuevo-esc]",()=>h(null,A)),N(y,"[data-editar-esc]",w=>h(w.getAttribute("data-editar-esc"),A)),N(y,"[data-borrar-esc]",w=>$(w.getAttribute("data-borrar-esc"),A)),N(y,"[data-activar-esc]",w=>{const _=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:_}),L(`Escenario "${i(_)}" activado`),e(),A()}),N(y,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),L("Volviendo a la realidad base"),e(),A()}),N(y,"[data-toggle-cuenta]",w=>{const _=w.getAttribute("data-toggle-cuenta");a.has(_)?a.delete(_):a.add(_);const E=y.querySelector("#esc-pastillas");E&&(E.innerHTML=c());const P=s(),M=y.querySelector("#esc-comparativa");M&&(M.innerHTML=f(P)),b(y,P)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Xl,mount(y){const A=()=>I(y);I(y),y.dataset.wired!=="1"&&(m(y,A),y.dataset.wired="1")},unmount(){p()}}}const tc=1e-12,$n=t=>Math.abs(t)<tc,In=t=>t/12;function ec(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=In(o);if($n(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function ac(t,e){const a=In(e);return $n(a)?0:Math.round(t*a)}function An({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function wn(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function Ea(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const Sn=t=>Number(t.slice(0,4));function Re(t){return t.rentaDeseada?An(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const oc={_id:"__sin_vehiculo__"};function Oe(t){var g,h,$;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(m=>[m._id,m])),o=[...t.objetivos].sort((m,y)=>m.prioridad-y.prioridad).map(m=>({def:m,objetivo:Re(m),saldo:m.saldoActual,estado:Re(m)>0&&m.saldoActual>=Re(m)&&m.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(m.vehiculoId),aportadoEnAño:0,añoEnCurso:Sn(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const m of t.eventos){const y=n.get(m.fecha)??[];y.push(m),n.set(m.fecha,y)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,f=0,c=0;const p=[];for(let m=0;m<e;m++){const y=wn(t.fechaInicio,m),A=Sn(y);for(const D of n.get(y)??[])if(D.tipo==="CAMBIO_INGRESOS")l=D.importe;else if(D.tipo==="CAMBIO_GASTOS_FIJOS")u=D.importe;else if(D.tipo==="NUEVA_DEUDA")u+=D.importe;else if(D.tipo==="INYECCION_CAPITAL"){const O=D.objetivoDestinoId?o.find(k=>k.def._id===D.objetivoDestinoId):void 0;O?O.saldo+=D.importe:l+=D.importe}for(const D of o)D.añoEnCurso!==A&&(D.añoEnCurso=A,D.aportadoEnAño=0);const w=Math.max(0,l-u),_=Math.round(w*nc(t.pctDisfrute));let E=w-_;const P=E,M=o.filter(D=>D.estado!=="COMPLETADO"),S=[];let F=0;const z=M.filter(D=>D.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=M.filter(D=>D.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const D of T){const O=sc(D,y,m,t);D.ultimaSolicitud=O,O>0&&(D.solicitadoAcumulado+=O,D.mesesReclamando+=1),(D.def.modoAsignacion==="CUOTA_POR_FECHA"||D.def.modoAsignacion==="FIJO")&&(F+=O);const k=Math.max(0,Math.min(O,E));E-=k,D.saldo+=k,D.aportadoEnAño+=k,f+=k,k>0&&D.estado==="PENDIENTE"&&(D.estado="EN_CURSO"),S.push({objetivoId:D.def._id,asignado:k,solicitado:O,saldoTrasMes:D.saldo})}if(z.length>0&&E>0){const D=z.map(B=>Math.max(0,B.def.pesoResidual??1)),O=D.reduce((B,q)=>B+q,0)||z.length;let k=0;z.forEach((B,q)=>{const H=q===z.length-1?E-k:Math.floor(E*D[q]/O);k+=H,B.saldo+=H,B.aportadoEnAño+=H,f+=H,H>0&&B.estado==="PENDIENTE"&&(B.estado="EN_CURSO"),S.push({objetivoId:B.def._id,asignado:H,solicitado:0,saldoTrasMes:B.saldo})}),E-=k}else for(const D of z)S.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});F>P&&p.push({mes:y,deficit:F-P});for(const D of o)D.saldo<=0||(D.saldo+=ac(D.saldo,((g=D.vehiculo)==null?void 0:g.rentabilidadRealAnual)??0));for(const D of o)D.estado!=="COMPLETADO"&&(D.def.modoAsignacion==="ABSORBE_RESIDUAL"&&D.objetivo<=0||D.objetivo>0&&D.saldo>=D.objetivo&&(D.estado="COMPLETADO",i.push({objetivoId:D.def._id,nombre:D.def.nombre,mes:y,indice:m,importeFinal:D.saldo,cuotaLiberada:D.ultimaSolicitud})));for(const D of o)S.some(O=>O.objetivoId===D.def._id)||S.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});const R=o.reduce((D,O)=>D+O.saldo,0);if(c+=_,s.push({indice:m,mes:y,netoMensual:l,gastosFijos:u,sobrante:w,disfrute:_,disponible:P,sinAsignar:E,asignaciones:S.sort((D,O)=>Cn(o,D.objetivoId)-Cn(o,O.objetivoId)),patrimonioTotal:R}),o.length>0&&o.every(D=>D.estado==="COMPLETADO"))break}const v=[];if(p.length>0){const m=Math.round(p.reduce((y,A)=>y+A.deficit,0)/p.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${p.length} mes${p.length!==1?"es":""} (desde ${p[0].mes}). Déficit medio: ${(m/100).toFixed(2)} €/mes.`,mes:p[0].mes,deficitMensual:m});for(const y of o)y.estado!=="COMPLETADO"&&y.def.fechaLimite&&y.def.modoAsignacion==="CUOTA_POR_FECHA"&&(y.estado="INVIABLE");v.push(...rc(o,t,m))}for(const m of o){const y=(h=m.vehiculo)==null?void 0:h.topeAportacionAnual;y&&m.def.modoAsignacion==="FIJO"&&(m.def.importeFijoMensual??0)*12>y&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» pide ${((m.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(y/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const m of o)m.estado!=="COMPLETADO"&&m.objetivo>0&&m.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const b=o.find(m=>m.def.tipo==="INVERSION_PERPETUA"),I=b?i.find(m=>m.objetivoId===b.def._id):void 0,C={};for(const m of o){const y=(($=m.vehiculo)==null?void 0:$._id)??oc._id;C[y]=(C[y]??0)+m.saldo}const x={};for(const m of o)x[m.def._id]=m.estado;return{viable:p.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:ic(s,i),avisos:r,propuestas:v,estadoFinal:x,resumen:{patrimonioFinal:o.reduce((m,y)=>m+y.saldo,0),patrimonioPorVehiculo:C,totalAportado:f,totalDisfrute:c,mesIndependencia:(I==null?void 0:I.mes)??null}}}const nc=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Cn=(t,e)=>t.findIndex(a=>a.def._id===e);function sc(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),f=Math.min(r,u);return t.objetivo>0?Math.min(f,n):f}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?Ea(e,t.def.fechaLimite):o.horizonteMeses-a;return ec(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function ic(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const f of t[u].asignaciones)f.asignado>0&&l.add(f.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function rc(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),f=Math.max(1,Ea(e.fechaInicio,r.def.fechaLimite)),c=Math.max(1,u-a),p=Math.ceil(l/c),v=Math.max(1,p-f);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:v,mensaje:`Retrasar «${r.def.nombre}» ${v} mes${v!==1?"es":""}, hasta ${wn(r.def.fechaLimite,v)}, baja su cuota a lo que cabe en el flujo.`});const b=Math.min(Math.round(a*f),Math.max(0,r.objetivo-1));b>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:b,mensaje:`O reducir «${r.def.nombre}» en ${(b/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-b)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const lc=()=>globalThis.Chart??null,qe=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],Mn=new WeakMap;function cc(t,e,a){const o=lc();if(!o)return null;const n=Mn.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(v=>[v._id,v.vehiculoId])),r=new Set(e.objetivos.map(v=>v.vehiculoId));for(const v of r)s.set(v,[]);for(const v of a.serieMensual){const b=new Map;for(const I of v.asignaciones){const C=i.get(I.objetivoId);C&&b.set(C,(b.get(C)??0)+I.saldoTrasMes)}for(const I of r)s.get(I).push((b.get(I)??0)/100)}const l=v=>{var b;return((b=e.vehiculos.find(I=>I._id===v))==null?void 0:b.nombre)??"Sin vehículo"},u=[...r],f=u.map((v,b)=>a.serieMensual.map((I,C)=>u.slice(0,b+1).reduce((x,g)=>x+(s.get(g)[C]??0),0))),c=u.map((v,b)=>({label:l(v),data:f[b],borderColor:qe[b%qe.length],backgroundColor:`${qe[b%qe.length]}33`,fill:b===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),p=new o(t,{type:"line",data:{labels:a.serieMensual.map(v=>v.mes),datasets:c},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:v=>{const b=v.datasetIndex>0?v.chart.data.datasets[v.datasetIndex-1].data[v.dataIndex]??0:0;return` ${v.dataset.label}: ${j(v.parsed.y-b)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:v=>j(v)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return Mn.set(t,p),p}const _a=t=>j(t/100),dc={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},uc={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},En={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function pc(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
      <div style="font-size:26px;margin-bottom:10px">🎯</div>
      <div class="card-title" style="margin-bottom:6px">Todavía no hay objetivos</div>
      <div class="text-sm" style="color:var(--text2);max-width:52ch;margin:0 auto;line-height:1.7">
        Un objetivo es algo a lo que quieres llegar —amortizar el coche, la entrada de un piso, un colchón—
        con un importe y, si la tiene, una fecha. Compiten por el mismo dinero cada mes, y cuando uno se
        completa su cuota pasa sola al siguiente.
      </div>
    </div>`;const a=[...t.objetivos].sort((s,i)=>s.prioridad-i.prioridad),o=e.serieMensual[0],n=s=>t.vehiculos.find(i=>i._id===s);return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      El orden es la <strong>prioridad</strong>: el de arriba se sirve primero y los de abajo reciben lo que quede.
      La columna «pide ahora» es lo que cada objetivo está reclamando este mes.
      <br>Arrastra las tarjetas para reordenarlas.
    </div>
    ${a.map(s=>{var i;return mc(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function mc(t,e,a,o){const n=Re(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(c=>c.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(c=>c.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,f=e.avisos.filter(c=>c.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${d(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${En[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${d(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${d(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${d(dc[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${d(uc[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${d(n>0?_a(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${d(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${d(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${En[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${d(_a(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${d(_a(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${d(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${d(l.mes)}</strong></div>`:""}
      </div>

      ${f.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${f.map(c=>`⚠ ${d(c.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${d(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),_n=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],fc=t=>_n.find(e=>e.id===t);function vc(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function gc(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function bc(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const hc=t=>j(t/100),yc={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function xc(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${_n.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${d(o.id)}"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px">
            <span style="font-size:14px">${o.icono}</span>
            <span style="font-size:12px">${d(o.nombre)}</span>
          </button>`).join("")}
      </div>
    </div>

    ${e.length===0?`<div class="card" style="text-align:center;padding:30px 20px">
             <div style="font-size:24px;margin-bottom:8px">📅</div>
             <div class="text-sm" style="color:var(--text2);max-width:50ch;margin:0 auto;line-height:1.7">
               Todavía no hay eventos. Sin ellos el plan asume que tus ingresos y tus gastos se quedan como están
               durante todo el horizonte, cosa que no pasa nunca.
             </div>
           </div>`:`<div class="card">
             <div class="card-title mb-12">Línea temporal (${e.length})</div>
             ${e.map(o=>$c(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function $c(t,e,a){const o=Ea(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${yc[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${d(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${d(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${d(vc(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${d(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${d(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function Ic(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
        <label class="form-label" for="ev-${d(i.id)}">${d(i.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${d(i.id)}" value="${r!==void 0?(r/100).toFixed(2):""}">
        ${i.ayuda?`<div class="text-sm mt-4" style="color:var(--text3)">${d(i.ayuda)}</div>`:""}
      </div>`}).join(""),s=[["","— al reparto general —"],...a.objetivos.map(i=>[i._id,i.nombre])];return`
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${t.icono} ${d(t.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${d((e==null?void 0:e.fecha)??a.fechaInicio)}">
    </div>

    ${n}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${t.tipo==="INYECCION_CAPITAL"?`<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${s.map(([i,r])=>`<option value="${d(i)}"${i===((e==null?void 0:e.objetivoDestinoId)??"")?" selected":""}>${d(r)}</option>`).join("")}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`:""}

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${e?'<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>':""}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${e?"Guardar":"Añadir evento"}</button>
    </div>`}function jn(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const Ac=(t,e)=>hc(t.calcular(e)),wc=[-2,-1,0,1,2],Sc=[-10,0,10],Cc=[-20,0,20];function Pn(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Mc(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=Pn(o),r=n?Pn(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function Ec(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const _c=t=>t>0?`+${t}`:String(t);function ja(t,e,a,o,n,s){const i=Oe(t),r=n.map(l=>Mc(l===0?"Plan actual":`${_c(l)} ${s}`,l,l===0,l===0?i:Oe(Ec(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function jc(t){return[ja(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",wc,"puntos"),ja(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",Sc,"puntos"),ja(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Cc,"%")]}function Pc(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const zn=t=>j(t/100);function zc(t,e,a){return`
    ${Fc(t,e)}
    ${t.length>1?Dc(t):""}
    ${Tc(a)}`}function Fc(t,e){return`<div class="card mb-14">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Planes (${t.length})</span>
      <div class="flex gap-8 flex-wrap">
        <button class="btn-secondary btn-sm" data-pl-duplicar>Duplicar el activo</button>
        <button class="btn-secondary btn-sm" data-pl-exportar>Exportar JSON</button>
        <button class="btn-secondary btn-sm" data-pl-importar>Importar JSON</button>
      </div>
    </div>

    ${t.map(a=>{const o=a._id===e;return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:13px">${d(a.nombre)}</span>
            ${o?'<span class="badge badge-green" style="font-size:10px">activo</span>':""}
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">
            ${a.objetivos.length} objetivo${a.objetivos.length!==1?"s":""} ·
            ${a.eventos.length} evento${a.eventos.length!==1?"s":""} ·
            desde ${d(a.fechaInicio)}${a.creadoEn?` · creado ${d(a.creadoEn)}`:""}
          </div>
        </div>
        <div class="flex gap-5 flex-wrap">
          ${o?"":`<button class="btn-secondary btn-sm" data-pl-activar="${d(a._id)}" style="font-size:11px;padding:2px 9px">Usar este</button>`}
          <button class="btn-secondary btn-sm" data-pl-renombrar="${d(a._id)}" style="font-size:11px;padding:2px 9px">Renombrar</button>
          ${t.length>1?`<button class="btn-secondary btn-sm" data-pl-borrar-plan="${d(a._id)}" style="font-size:11px;padding:2px 9px;color:var(--red)">Borrar</button>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function Dc(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:Oe(r)})),o=bc(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${d(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${d(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const f=r.diferencias[u],c=f===null||f===0?"var(--text2)":f<0?"var(--accent)":"var(--red)",p=u===0||f===null||f===0?"":`<div style="font-size:10px;color:${c}">${f>0?"+":""}${f} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${c}">
            ${d(l??"no llega")}${p}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${d(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${d(zn(l.resumen.patrimonioFinal))}</div>
      <div style="font-size:10px;color:${l.viable?"var(--accent)":"var(--red)"}">${l.viable?"viable":"no cabe en el flujo"}</div>
    </div>`).join("")}</div>
    ${o.length===0?'<div class="text-sm" style="color:var(--text3)">Ninguno de los planes completa objetivos dentro de su horizonte.</div>':`<div style="overflow-x:auto">
             <table style="width:100%;border-collapse:collapse">
               <thead><tr style="border-bottom:1px solid var(--border2)">${n}</tr></thead>
               <tbody>${s}</tbody>
             </table>
           </div>
           <div class="text-sm mt-8" style="color:var(--text3)">
             Los hitos se emparejan por nombre. La diferencia es respecto al primer plan de la tabla.
           </div>`}
  </div>`}function Tc(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(Nc).join("")}
    <div class="text-sm mt-8" style="color:var(--text3);line-height:1.6">
      El desplazamiento es sobre el <strong>último hito</strong> del plan: cuándo terminarías de cumplirlo todo.
    </div>
  </div>`:`<div class="card">
      <div class="card-title mb-8">Análisis de sensibilidad</div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.7">
        Vuelve a simular moviendo una palanca cada vez y te dice cuánto adelanta o retrasa el plan.
        Son diez simulaciones, así que se calcula solo cuando lo pides.
      </div>
      <button class="btn-primary" data-pl-sensibilidad>Calcular</button>
    </div>`}function Nc(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${d(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${d(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${d(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${d(Pc(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${d(zn(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const Ct=t=>j(t/100);function Rc(t,e,a=0){return`
    ${Oc(e)}
    ${qc(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Lc(e)}
    ${kc(t,e)}
    ${Bc(t,e,a)}`}function Oc(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${e[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${d(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${d(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",n=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${n}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${a}${o}
  </div>`}function qc(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${d(n)}</div>
      <div class="stat-value" style="font-size:18px">${d(s)}</div>
      ${i?`<div class="stat-sub">${d(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",Ct(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",Ct(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",Ct(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Lc(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(e=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${d(e.mes)}</span>
          <span style="font-weight:600">${d(e.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${d(Ct(e.importeFinal))}</div>
          ${e.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${d(Ct(e.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function kc(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${d(o.desde)} → ${d(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${d(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const $e=60;function Bc(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((f,c)=>f.prioridad-c.prioridad),n=Math.ceil(e.serieMensual.length/$e),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*$e,(s+1)*$e),r=["Mes","Disponible",...o.map(f=>f.nombre),"Sin asignar","Patrimonio"].map(f=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${d(f)}</th>`).join(""),l=i.map(f=>{const c=o.map(p=>{const v=f.asignaciones.find(I=>I.objetivoId===p._id),b=(v==null?void 0:v.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${b>0?"var(--text)":"var(--text3)"}">${d(b>0?Ct(b):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${d(f.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${d(Ct(f.disponible))}</td>
        ${c}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${d(f.sinAsignar>0?Ct(f.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${d(Ct(f.patrimonioTotal))}</td>
      </tr>`}).join(""),u=n>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${s-1}"${s===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${s*$e+1}–${Math.min((s+1)*$e,e.serieMensual.length)} de ${e.serieMensual.length}
           </span>
           <button class="btn-secondary btn-sm" data-pl-pagina="${s+1}"${s>=n-1?" disabled":""}>Siguientes →</button>
         </div>`:"";return`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Mes a mes</span>
      <button class="btn-secondary btn-sm" data-pl-csv>Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr style="border-bottom:1px solid var(--border2)">${r}</tr></thead>
        <tbody>${l}</tbody>
      </table>
    </div>
    ${u}
  </div>`}function Hc(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const ae=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Ie=t=>(t/100).toFixed(2),Fn=t=>(t*100).toFixed(2),oe=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},Gc=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Vc=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],Uc=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Yc=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],Dn={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${d(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Bt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${d(s)}"${s===o?" selected":""}>${d(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function Jc(t,e,a){var l,u,f;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??Dn[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(c=>[c._id,c.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Bt("ob-tipo","Tipo",Gc,n)}
      ${Bt("ob-modo","Cómo pide dinero",Vc,s)}
    </div>
    <div class="text-sm mb-12" id="ob-modo-ayuda" style="color:var(--text3);line-height:1.6"></div>

    <!-- Independencia económica: capital o renta (§2.6) -->
    <div id="ob-bloque-perpetua" style="display:${n==="INVERSION_PERPETUA"?"block":"none"}">
      <div class="card mb-12" style="background:var(--bg3);padding:12px">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="capital"${i?"":" checked"} style="accent-color:var(--accent)">
            Defino el capital
          </label>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="renta"${i?" checked":""} style="accent-color:var(--accent)">
            Defino la renta que quiero
          </label>
        </div>
        <div id="ob-renta-campos" style="display:${i?"block":"none"}">
          <div class="grid-2" style="gap:10px">
            ${lt("ob-renta","Renta neta mensual (€)","number",Ie(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((u=t==null?void 0:t.rentaDeseada)==null?void 0:u.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((f=t==null?void 0:t.rentaDeseada)==null?void 0:f.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
          <div class="text-sm mt-8" style="color:var(--yellow);line-height:1.6">
            Capital necesario: <strong id="ob-capital-derivado" style="font-family:var(--font-mono)">—</strong>
          </div>
          <div class="text-sm mt-6" style="color:var(--text3);line-height:1.6">
            Un 4 % está calibrado para que la cartera aguante <strong>unos 30 años</strong> con alta probabilidad,
            <strong>no</strong> para que el capital no baje nunca. Si no quieres tocar el principal —por ejemplo
            porque haya herencia prevista— lo prudente es 3–3,5 %.
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-importe" style="display:${i?"none":"block"}">
        ${lt("ob-importe","Importe objetivo (€)","number",Ie((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",Ie((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Bt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${s==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",Ie((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${s==="ABSORBE_RESIDUAL"?"block":"none"}">
        ${lt("ob-peso","Peso del residual","number",(t==null?void 0:t.pesoResidual)??1,"Si hay varios, reparte en proporción",'min="0" step="0.5"')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="ob-notas">Notas</label>
      <textarea class="form-input" id="ob-notas" rows="2" style="resize:vertical;font-family:var(--font-sans)">${d((t==null?void 0:t.notas)??"")}</textarea>
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ob-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ob-cancelar>Cancelar</button>
      <button class="btn-primary" data-ob-guardar>${o?"Crear objetivo":"Guardar"}</button>
    </div>`}function Wc(t,e,a){var u;const o=f=>{var c;return((c=t.querySelector(`#${f}`))==null?void 0:c.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:ae(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:ae(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:ae(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:ae(o("ob-renta")),tasaRetiroSeguro:oe(o("ob-swr")),tipoFiscalEfectivo:oe(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Kc(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=An({rentaNetaMensual:ae(e("ob-renta")),tasaRetiroSeguro:oe(e("ob-swr")),tipoFiscalEfectivo:oe(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Qc(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
    <div class="card mb-12" style="background:rgba(46,230,168,0.05);border-color:rgba(46,230,168,0.22);padding:12px">
      <div class="text-sm" style="color:var(--text2);line-height:1.7">
        <strong>Amortizar deuda también rinde.</strong> El interés que dejas de pagar es un retorno
        <strong>garantizado</strong>: un préstamo al 9 % «renta» más, y sin riesgo, que un fondo al 5 %. Por eso
        suele encabezar la prioridad, aunque cueste verlo como una inversión.
      </div>
    </div>

    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:13px;cursor:pointer">
      <input type="checkbox" id="ve-deuda"${n?" checked":""} style="accent-color:var(--accent)">
      Este vehículo amortiza un préstamo
    </label>

    <div id="ve-bloque-prestamo" style="display:${n?"block":"none"}">
      ${Bt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",Fn((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",Fn((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Bt("ve-liquidez","Liquidez",Uc,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Bt("ve-riesgo","Riesgo",Yc,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?Ie(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Bt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Xc(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:oe(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:oe(a("ve-fiscal")),topeAportacionAnual:s?ae(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const Zc={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},td="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Tn=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Le=t=>(t/100).toFixed(2);function ed(t){const e=t.hoy??J;let a="config",o=null,n=0,s=null;function i(){const S=t.store.get("planes");return S.find(F=>F.activo)??S[0]??null}function r(){const S=i();return S||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(S){var z;const F=i();F&&(t.store.updateItem("planes",F._id,S),s=null,o=null,(z=t.onDatosCambiados)==null||z.call(t))}function u(){const F=t.store.get("nominas").filter(R=>R.activo).reduce((R,D)=>R+(D.bruto||0),0),z=Math.round(F*.75/12),T=t.store.get("expenses").filter(R=>R.activo&&R.basico&&R.tipo==="gasto").reduce((R,D)=>R+(D.cuantia||0),0);return{neto:Math.round(z*100),gastos:Math.round(T*100)}}function f(S){return s||(s=Oe(S)),s}function c(S){const F=u(),z=Math.max(0,S.perfil.netoMensual-S.perfil.gastosFijosMensuales),T=Math.round(S.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${d(Le(S.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${d(j(F.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${d(Le(S.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${d(j(F.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${T} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${T}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${d(j(Math.max(0,S.perfil.netoMensual-S.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${d(j(z*(1-S.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${d(S.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${d(S.horizonteMeses)}">
          </div>
        </div>

        <div class="flex gap-8 mt-12">
          <button class="btn-primary" data-pl-guardar>Guardar</button>
        </div>
      </div>

      <div class="card mb-14" style="background:rgba(77,159,255,0.05);border-color:rgba(77,159,255,0.25)">
        <div class="card-title mb-8">Todo en euros de hoy</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          Este módulo trabaja en <strong>términos reales</strong>: no modela la inflación, asume que tu sueldo y tus
          objetivos crecen con ella. Por eso las rentabilidades que introduzcas tienen que ser
          <strong>reales</strong> (la nominal menos la inflación esperada). Si pones el 7 % nominal de un fondo sin
          descontar un ~2 % de inflación, la simulación te dirá que llegas años antes de lo que llegarás.
          <br><br>
          Y es un <strong>simulador, no un asesor</strong>: supone una rentabilidad constante, y la realidad no es
          lineal. Sirve para comparar decisiones entre sí, no para dar fechas exactas.
        </div>
      </div>

      ${p(S)}`}function p(S){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${d(S.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const v=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),I=()=>{var S;return(S=v())==null?void 0:S.classList.add("hidden")};function C(S,F){const z=v(),T=b();return!z||!T?null:(T.innerHTML=`<div class="modal-title">${d(S)}</div>${F}`,z.classList.remove("hidden"),T)}function x(S){l({objetivos:S})}function g(S,F){const z=i();if(!z)return;const T=F?z.objetivos.find(B=>B._id===F)??null:null,R=z.objetivos.reduce((B,q)=>Math.max(B,q.prioridad),0)+1,D=C(T?`Editar «${T.nombre}»`:"Nuevo objetivo",Jc(T,z.vehiculos,R));if(!D)return;const O=()=>{var Y;const B=(Y=D.querySelector("#ob-modo"))==null?void 0:Y.value,q=D.querySelector("#ob-modo-ayuda");q&&B&&(q.textContent=Zc[B]);const H=(K,Q)=>{const nt=D.querySelector(K);nt&&(nt.style.display=Q?"block":"none")};H("#ob-bloque-fijo",B==="FIJO"),H("#ob-bloque-residual",B==="ABSORBE_RESIDUAL")};O();const k=()=>{const B=D.querySelector("#ob-capital-derivado");B&&(B.textContent=Kc(D))};k(),U(D,"#ob-modo",O),U(D,"#ob-tipo",()=>{const B=D.querySelector("#ob-tipo").value,q=D.querySelector("#ob-modo");q&&(q.value=Dn[B]);const H=D.querySelector("#ob-bloque-perpetua");H&&(H.style.display=B==="INVERSION_PERPETUA"?"block":"none"),O()}),U(D,'input[name="ob-derivar"]',()=>{var Y;const B=((Y=D.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:Y.value)==="renta",q=D.querySelector("#ob-renta-campos"),H=D.querySelector("#ob-bloque-importe");q&&(q.style.display=B?"block":"none"),H&&(H.style.display=B?"none":"block"),k()}),U(D,"#ob-renta, #ob-swr, #ob-fiscal",k),N(D,"[data-ob-cancelar]",I),N(D,"[data-ob-guardar]",()=>{const B=Wc(D,T,R);if(!B){L("El objetivo necesita un nombre","err");return}if(!B.vehiculoId){L("Crea antes un vehículo donde meter el dinero","err");return}const q=z.objetivos.filter(H=>H._id!==B._id);x([...q,B]),I(),L(T?"Objetivo actualizado":`Objetivo «${B.nombre}» creado`),P(S)}),N(D,"[data-ob-borrar]",()=>{T&&tt(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(x(z.objetivos.filter(B=>B._id!==T._id)),I(),L("Objetivo borrado"),P(S))})}function h(S,F){const z=i();if(!z)return;const T=F?z.vehiculos.find(k=>k._id===F)??null:null,R=t.store.get("accounts").filter(k=>k.activo).map(k=>({_id:k._id,nombre:k.nombre})),D=t.store.get("loans").filter(k=>k.activo&&!k.simulacion).map(k=>({_id:k._id,nombre:k.nombre,tin:k.tin})),O=C(T?`Editar «${T.nombre}»`:"Nuevo vehículo",Qc(T,R,D));O&&(U(O,"#ve-deuda",()=>{const k=O.querySelector("#ve-deuda").checked,B=O.querySelector("#ve-bloque-prestamo");B&&(B.style.display=k?"block":"none")}),U(O,"#ve-prestamo",()=>{const k=O.querySelector("#ve-prestamo").value,B=D.find(Y=>Y._id===k);if(!B)return;const q=O.querySelector("#ve-rent"),H=O.querySelector("#ve-nombre");q&&(q.value=String(B.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${B.nombre}`)}),N(O,"[data-ve-cancelar]",I),N(O,"[data-ve-guardar]",()=>{const k=Xc(O,T);if(!k){L("El vehículo necesita un nombre","err");return}const B=z.vehiculos.filter(q=>q._id!==k._id);l({vehiculos:[...B,k]}),I(),L(T?"Vehículo actualizado":`Vehículo «${k.nombre}» creado`),P(S)}),N(O,"[data-ve-borrar]",()=>{if(!T)return;const k=z.objetivos.filter(B=>B.vehiculoId===T._id);if(k.length>0){L(`No se puede borrar: lo usan ${k.length} objetivo${k.length!==1?"s":""}`,"err");return}tt(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:z.vehiculos.filter(B=>B._id!==T._id)}),I(),L("Vehículo borrado"),P(S))}))}function $(S,F,z){const T=i();if(!T||F===z)return;const R=[...T.objetivos].sort((B,q)=>B.prioridad-q.prioridad),D=R.findIndex(B=>B._id===F),O=R.findIndex(B=>B._id===z);if(D<0||O<0)return;const[k]=R.splice(D,1);R.splice(O,0,k),x(R.map((B,q)=>({...B,prioridad:q+1}))),P(S)}function m(S){return S.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${S.vehiculos.map(F=>{const z=S.objetivos.filter(T=>T.vehiculoId===F._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${d(F._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${F.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${d(F.nombre)}${F.esDeuda?" 🔒":""}${F.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${d((F.rentabilidadRealAnual*100).toFixed(2))} % real · ${z} objetivo${z!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${S.vehiculos.some(F=>F.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function y(S,F,z){const T=i(),R=fc(F);if(!T||!R)return;const D=z?T.eventos.find(q=>q._id===z)??null:null,O={};R.id==="hijo"&&(O.actuales=T.perfil.gastosFijosMensuales),R.id==="subida-sueldo"&&(O.actual=T.perfil.netoMensual);const k=C(D?`Editar evento · ${R.nombre}`:R.nombre,Ic(R,D,T,O));if(!k)return;const B=()=>{const q=k.querySelector("#ev-resultado");q&&(q.textContent=Ac(R,jn(k,R)))};B();for(const q of R.campos)U(k,`#ev-${q.id}`,B);N(k,"[data-ev-cancelar]",I),N(k,"[data-ev-guardar]",()=>{var K,Q;const q=((K=k.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!q){L("El evento necesita un mes","err");return}const H=jn(k,R),Y={_id:(D==null?void 0:D._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:q,tipo:R.tipo,importe:R.calcular(H),objetivoDestinoId:((Q=k.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:R.resumir(H)};l({eventos:[...T.eventos.filter(nt=>nt._id!==Y._id),Y]}),I(),L(D?"Evento actualizado":"Evento añadido"),P(S)}),N(k,"[data-ev-borrar]",()=>{!D||!tt("¿Borrar este evento?")||(l({eventos:T.eventos.filter(q=>q._id!==D._id)}),I(),L("Evento borrado"),P(S))})}function A(S){var F;switch(S.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(F=S.notas)!=null&&F.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function w(){const S=i();if(!S)return;const F=new Blob([JSON.stringify(S,null,2)],{type:"application/json"}),z=URL.createObjectURL(F),T=document.createElement("a");T.href=z,T.download=`plan-${S.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(z),L("Plan exportado")}function _(S){const F=document.createElement("input");F.type="file",F.accept="application/json,.json",F.addEventListener("change",async()=>{var T,R;const z=(T=F.files)==null?void 0:T[0];if(z)try{const D=JSON.parse(await z.text());if(!D||!Array.isArray(D.objetivos)||!Array.isArray(D.vehiculos)||!D.perfil){L("Ese fichero no es un plan de objetivos","err");return}const O=`${D.nombre??"Importado"} (importado)`,k=t.store.addItem("planes",{...D,nombre:O,activo:!1,creadoEn:e()});s=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),L(`Plan «${k.nombre}» importado`),P(S)}catch(D){console.error("[Planner] Importación fallida:",D),L("No se ha podido leer el fichero","err")}}),F.click()}function E(S,F){switch(a){case"config":return c(S);case"objetivos":return pc(S,F);case"simulacion":return Rc(S,F,n);case"eventos":return xc(S);case"escenarios":return zc(t.store.get("planes"),S._id,o)}}function P(S){const F=r(),z=f(F),T=(D,O)=>`<button class="period-btn ${a===D?"active":""}" data-pl-tab="${D}">${O}</button>`,R=z.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(S.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${R}</div>
      </div>

      <div class="period-selector mb-14">
        ${T("config","Plan")}
        ${T("objetivos",`Objetivos (${F.objetivos.length})`)}
        ${T("simulacion","Simulación")}
        ${T("eventos",`Eventos (${F.eventos.length})`)}
        ${T("escenarios","Comparar planes")}
      </div>

      ${a==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${m(F)}`:""}

      <div id="pl-cuerpo">${E(F,z)}</div>`,a==="simulacion"){const D=S.querySelector("#pl-chart");D&&cc(D,F,z)}M(S)}function M(S){N(S,"[data-pl-tab]",z=>{a=z.dataset.plTab,P(S)}),U(S,"#pl-disfrute",z=>{const T=Number(z.value)/100,R=S.querySelector("#pl-pct-val");R&&(R.textContent=`${Math.round(T*100)} %`);const D=i();if(!D)return;const O=Math.max(0,D.perfil.netoMensual-D.perfil.gastosFijosMensuales)*(1-T),k=S.querySelector("#pl-disponible");k&&(k.textContent=j(O/100))}),N(S,"[data-pl-usar-sugerido]",()=>{const z=u(),T=S.querySelector("#pl-neto"),R=S.querySelector("#pl-gastos");T&&(T.value=Le(z.neto)),R&&(R.value=Le(z.gastos))}),N(S,"[data-pl-guardar]",()=>{const z=T=>{var R;return((R=S.querySelector(T))==null?void 0:R.value)??""};l({perfil:{netoMensual:Tn(z("#pl-neto")),gastosFijosMensuales:Tn(z("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(z("#pl-disfrute"))/100)),fechaInicio:z("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(z("#pl-horizonte"))||480))}),L("Plan guardado"),P(S)}),N(S,"[data-pl-plantilla]",z=>y(S,z.dataset.plPlantilla??"",null)),N(S,"[data-pl-editar-evento]",z=>{var D;const T=z.dataset.plEditarEvento??"",R=(D=i())==null?void 0:D.eventos.find(O=>O._id===T);R&&y(S,A(R),T)}),N(S,"[data-pl-duplicar]",()=>{var D;const z=i();if(!z)return;const T=window.prompt("Nombre del plan nuevo:",`${z.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const R=gc(z,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",R),(D=t.onDatosCambiados)==null||D.call(t),L(`Plan «${R.nombre}» creado. Actívalo para editarlo.`),P(S)}),N(S,"[data-pl-activar]",z=>{var R;const T=z.dataset.plActivar;if(T){for(const D of t.store.get("planes"))t.store.updateItem("planes",D._id,{activo:D._id===T});s=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),L("Plan activo cambiado"),P(S)}}),N(S,"[data-pl-renombrar]",z=>{var O;const T=z.dataset.plRenombrar,R=t.store.get("planes").find(k=>k._id===T);if(!R)return;const D=window.prompt("Nuevo nombre:",R.nombre);D!=null&&D.trim()&&(t.store.updateItem("planes",R._id,{nombre:D.trim()}),(O=t.onDatosCambiados)==null||O.call(t),P(S))}),N(S,"[data-pl-borrar-plan]",z=>{var O;const T=z.dataset.plBorrarPlan,R=t.store.get("planes").find(k=>k._id===T);if(!R||!tt(`¿Borrar el plan «${R.nombre}» con sus ${R.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",R._id);const D=t.store.get("planes");R.activo&&D.length>0&&t.store.updateItem("planes",D[0]._id,{activo:!0}),s=null,o=null,(O=t.onDatosCambiados)==null||O.call(t),L("Plan borrado"),P(S)}),N(S,"[data-pl-sensibilidad]",()=>{const z=i();z&&(o=jc(z),P(S))}),N(S,"[data-pl-pagina]",z=>{n=Number(z.dataset.plPagina)||0,P(S)}),N(S,"[data-pl-exportar]",w),N(S,"[data-pl-importar]",()=>_(S)),N(S,"[data-pl-nuevo-objetivo]",()=>g(S,null)),N(S,"[data-pl-nuevo-vehiculo]",()=>h(S,null)),N(S,"[data-pl-editar-vehiculo]",z=>h(S,z.dataset.plEditarVehiculo??null)),N(S,"[data-pl-editar-objetivo]",z=>g(S,z.dataset.plEditarObjetivo??null));let F=null;S.querySelectorAll("[data-pl-objetivo]").forEach(z=>{z.addEventListener("dragstart",()=>{F=z.dataset.plObjetivo??null,z.style.opacity="0.45"}),z.addEventListener("dragend",()=>{z.style.opacity="",S.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),z.addEventListener("dragover",T=>{T.preventDefault(),F&&z.dataset.plObjetivo!==F&&(z.style.borderTop="2px solid var(--accent)")}),z.addEventListener("dragleave",()=>{z.style.borderTop=""}),z.addEventListener("drop",T=>{T.preventDefault(),z.style.borderTop="";const R=z.dataset.plObjetivo;F&&R&&$(S,F,R),F=null})}),N(S,"[data-pl-csv]",()=>{const z=i();if(!z||!s)return;const T=new Blob(["\uFEFF"+Hc(z,s)],{type:"text/csv;charset=utf-8"}),R=URL.createObjectURL(T),D=document.createElement("a");D.href=R,D.download=`plan-${z.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,D.click(),URL.revokeObjectURL(R),L(`CSV exportado (${s.serieMensual.length} meses)`)}),N(S,"[data-pl-guardar-notas]",()=>{var z;l({notas:((z=S.querySelector("#pl-notas"))==null?void 0:z.value)??""}),L("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:td,mount:P}}function Nn(t,e,a=!1){const o=Math.abs(mt(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function ad(t){function e(h){return`${h}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(h={}){var m;const $=(m=h.texto)==null?void 0:m.trim().toLowerCase();return t.get("transacciones").filter(y=>!(h.cuentaId&&y.cuentaId!==h.cuentaId||h.desde&&y.fecha<h.desde||h.hasta&&y.fecha>h.hasta||h.tipo&&y.tipo!==h.tipo||h.estimacionId&&y.estimacionId!==h.estimacionId||h.tags&&h.tags.length>0&&!h.tags.some(A=>y.tags.includes(A))||$&&!y.concepto.toLowerCase().includes($))).sort((y,A)=>y.fecha.localeCompare(A.fecha)||y._id.localeCompare(A._id))}function o(h){const $={_id:e("tx"),fecha:h.fecha,cuentaId:h.cuentaId,importeCts:Nn(h.tipo,h.importe,h.negativo),concepto:h.concepto,tags:h.tags??[],estimacionId:h.estimacionId??null,tipo:h.tipo,origen:h.origen??"manual",...h.nota?{nota:h.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),$]),$}function n(h,$){t.set("transacciones",t.get("transacciones").map(m=>{if(m._id!==h)return m;const{importe:y,...A}=$,w={...m,...A};return y!==void 0&&(w.importeCts=Nn(w.tipo,y,w.importeCts<0)),w}))}function s(h){t.set("transacciones",t.get("transacciones").filter($=>$._id!==h))}function i(h,$){n(h,{estimacionId:$})}function r(h){return t.get("puntosControl").filter($=>!h||$.cuentaId===h).sort(($,m)=>$.fecha.localeCompare(m.fecha))}function l(h,$,m,y){const A={_id:e("pc"),fecha:$,cuentaId:h,saldoCts:mt(m),...y?{nota:y}:{}},w=t.get("puntosControl").filter(_=>!(_.cuentaId===h&&_.fecha===$));return t.set("puntosControl",[...w,A].sort((_,E)=>_.fecha.localeCompare(E.fecha))),f(h),A}function u(h){const $=t.get("puntosControl").find(m=>m._id===h);t.set("puntosControl",t.get("puntosControl").filter(m=>m._id!==h)),$&&f($.cuentaId)}function f(h){const $=r(h),m=t.get("accounts");m.some(y=>y._id===h)&&t.set("accounts",m.map(y=>y._id===h?{...y,historicoSaldos:$.map(A=>({_id:A._id,fecha:A.fecha,saldo:X(A.saldoCts),...A.nota?{nota:A.nota}:{}}))}:y))}function c(h,$=J()){const m=r(h).filter(_=>_.fecha<=$).pop(),y=m==null?void 0:m.fecha,A=(m==null?void 0:m.saldoCts)??0;return t.get("transacciones").filter(_=>_.cuentaId===h&&_.fecha<=$&&(y===void 0||_.fecha>y)).reduce((_,E)=>_+E.importeCts,A)}function p(h,$){return X(c(h,$))}function v(h=J(),$){const m=$??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return X(m.reduce((y,A)=>y+c(A,h),0))}function b(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const h=[...t.get("transacciones").map($=>$.fecha),...t.get("puntosControl").map($=>$.fecha)];return h.length>0?h.sort().pop()??null:null}function C(h={}){return X(a(h).reduce(($,m)=>$+m.importeCts,0))}function x(h={}){const $=new Map;for(const m of a(h)){const y=m.fecha.slice(0,7);$.set(y,($.get(y)??0)+m.importeCts)}return new Map([...$.entries()].sort(([m],[y])=>m.localeCompare(y)).map(([m,y])=>[m,X(y)]))}function g(h={}){const $=new Map;for(const m of a(h))for(const y of m.tags.length>0?m.tags:["sin_tag"])$.set(y,($.get(y)??0)+m.importeCts);return new Map([...$.entries()].map(([m,y])=>[m,X(y)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:p,saldoCuentaCts:c,saldoTotal:v,tieneDatos:b,ultimaFecha:I,total:C,totalPorMes:x,totalPorTag:g}}function At(t){return t.trim().toLowerCase()}function od(t){function e(){const u=new Map,f=(c,p)=>{const v=At(c);if(!v)return;const b=u.get(v)??{tag:v,estimaciones:0,reales:0,total:0};b[p]+=1,b.total+=1,u.set(v,b)};for(const c of t.get("expenses"))for(const p of c.tags??[])f(p,"estimaciones");for(const c of t.get("transacciones"))for(const p of c.tags??[])f(p,"reales");return[...u.values()].sort((c,p)=>p.total-c.total||c.tag.localeCompare(p.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(f=>u==="estimaciones"?f.reales===0:f.estimaciones===0).map(f=>f.tag)}function n(u,f,c){const p=At(f),v=(u??[]).map(At);if(!v.includes(p))return u??[];const b=v.filter(I=>I!==p);return c===null?[...new Set(b)]:[...new Set([...b,At(c)])]}function s(u,f){const c=At(f);if(!c)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,c)}function i(u,f){let c=0;for(const p of u)At(p)!==At(f)&&(c+=l(p,At(f)).cambiados);return{cambiados:c}}function r(u){return l(u,null)}function l(u,f){let c=0;const p=t.get("expenses").map(A=>{const w=n(A.tags,u,f);return w!==A.tags&&(c+=1),w===A.tags?A:{...A,tags:w}});t.set("expenses",p);const v=t.get("transacciones").map(A=>{const w=n(A.tags,u,f);return w!==A.tags&&(c+=1),w===A.tags?A:{...A,tags:w}});t.set("transacciones",v);const b=t.get("loans").map(A=>{const w=n(A.tags,u,f);return w!==A.tags&&(c+=1),w===A.tags?A:{...A,tags:w}});t.set("loans",b);const I=t.get("nominas").map(A=>{const w=n(A.tags,u,f);return w!==A.tags&&(c+=1),w===A.tags?A:{...A,tags:w}});t.set("nominas",I);const C=t.get("config"),x=At(u),g=A=>{const w=(A??[]).map(At);if(!w.includes(x))return A??[];const _=w.filter(E=>E!==x);return f===null?[...new Set(_)]:[...new Set([..._,f])]},h={},$=g(C.activeTagsFilter),m=g(C.tagCategorias),y=g(C.tagGrupos);return $!==C.activeTagsFilter&&(h.activeTagsFilter=$),m!==C.tagCategorias&&(h.tagCategorias=m),y!==C.tagGrupos&&(h.tagGrupos=y),Object.keys(h).length>0&&t.patchConfig(h),{cambiados:c}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const nd=3;function Rn(t){return t<.005?0:t}function sd(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function id(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<nd)continue;const r=sd(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Rn(n),sigmaDeriva:Rn(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function On(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function rd(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),f=Math.max(0,(l-s)*12+(u-i)),c=On(e.sigmaMensual,f,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+c),abajo:W(r.saldoAcum-c)}})}function ld(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Pa="financeapp_session",cd=["local","dropbox","firebase"];function dd(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!cd.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function ud({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const b=n();if(b)try{v?b.setItem(Pa,JSON.stringify(v)):b.removeItem(Pa)}catch{}}function i(){const v=n();if(!v)return null;try{return dd(v.getItem(Pa))}catch{return null}}function r(){const v=i();return v?(a()-v.ultimoUso)/6e4:null}function l(){const v=e();if(!Number.isFinite(v)||v<=0||o())return!1;const b=r();return b!==null&&b>=v}function u(){const v=i();return v?l()?(s(null),null):v:null}function f(v){const b=a(),I={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:b,ultimoUso:b};return s(I),I}function c(){const v=i();v&&s({...v,ultimoUso:a()})}function p(){s(null)}return{abrir:f,leer:u,tocar:c,cerrar:p,caducada:l,inactividadMinutos:r,get activa(){return u()!==null}}}const qn=["pointerdown","keydown","visibilitychange"];function pd({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const f of qn)s==null||s.addEventListener(f,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const f of qn)s==null||s.removeEventListener(f,r)}}return u}const md=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],fd="FinanceApp",vd=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Ln(t){return new Uint8Array(new ArrayBuffer(t))}const za="financeapp_bio_credencial",Fa="financeapp_bio_secreto",Da="financeapp_bio_ultimo_desbloqueo",kn="financeapp_bio_gracia_min",gd=5;function bd(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function ke(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function Be(t){const e=atob(t),a=Ln(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function hd(t){return ke(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function yd(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Be(e)}function Bn(t){return t.getClientExtensionResults()}function xd(t={}){const e=t.webauthn??bd(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(m=>crypto.getRandomValues(Ln(m)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function l(){const m=o==null?void 0:o.getItem(za);if(!m)return null;try{const y=JSON.parse(m);return typeof y.credencialId!="string"||typeof y.salt!="string"?null:y}catch{return null}}function u(){return l()!==null}async function f(m){const y=await a.importKey("raw",m,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:vd},y,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function c(m,y){const A=s(12),w=await a.encrypt({name:"AES-GCM",iv:A},m,new TextEncoder().encode(y));return`${ke(A)}:${ke(w)}`}async function p(m,y){const[A,w]=y.split(":"),_=Be(A),E=Be(w),P=await a.decrypt({name:"AES-GCM",iv:_},m,E);return new TextDecoder().decode(P)}async function v(m,y){var R,D;if(!m)throw new Error("No hay clave de cifrado que envolver.");const A=s(32),w=s(32),_=s(16),E=await e.create({publicKey:{challenge:w,rp:{name:fd},user:{id:_,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const P=Bn(E);if(!((R=P.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((D=P.prf.results)==null?void 0:D.first)??null;if(M||(M=await b(E.rawId,A)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const S=await f(M),F=await c(S,m),z={credencialId:hd(E.rawId),salt:ke(A),modo:y,creadaEn:n()},T=i();T.setItem(za,JSON.stringify(z)),T.setItem(Fa,F)}async function b(m,y){var w,_;const A=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:m,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:y}}},timeout:6e4}});return A?((_=(w=Bn(A).prf)==null?void 0:w.results)==null?void 0:_.first)??null:null}async function I(){const m=l();if(!m)throw new Error("No hay huella configurada en este dispositivo.");const y=o==null?void 0:o.getItem(Fa);if(!y)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await b(yd(m.credencialId).buffer,Be(m.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const w=await f(A),_=await p(w,y);return x(),_}function C(){o==null||o.removeItem(za),o==null||o.removeItem(Fa),o==null||o.removeItem(Da)}function x(){o==null||o.setItem(Da,String(n()))}function g(){const m=o==null?void 0:o.getItem(kn);if(m==null)return gd;const y=Number(m);return Number.isFinite(y)&&y>0?y:0}function h(m){o==null||o.setItem(kn,String(Math.max(0,Math.floor(m)||0)))}function $(){if(!u())return!1;const m=g();if(m<=0)return!1;const y=o==null?void 0:o.getItem(Da),A=y?Number(y):NaN;return Number.isFinite(A)?n()-A<m*6e4:!1}return{disponible:r,registrada:u,leerCredencial:l,registrar:v,desbloquear:I,olvidar:C,marcarDesbloqueo:x,dentroDeGracia:$,graciaMinutos:g,configurarGracia:h}}function Hn(){if(typeof localStorage<"u"){const m=ii();m.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${m.join(", ")}`)}const t=bi(),e=t.activo(),a=fe(e),o=Do(localStorage,a),n=ui({adapter:o}),s=pi(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${pe})`),n.subscribe(m=>s.marcar(m));const r={listar:()=>t.listar(),activo:()=>t.listar().find(m=>m._id===e)??t.listar()[0],colecciones:Tt.filter(m=>m!=="config"),crear:m=>t.crear(m),renombrar:(m,y)=>t.renombrar(m,y),duplicar:(m,y)=>t.duplicar(m,y),eliminar:m=>t.eliminar(m),cambiarA:m=>t.establecerActivo(m),importarDesde:(m,y)=>{const A=hi(localStorage,m,y),w=yi(A),_=[];for(const E of y){const P=w[E];if(!Array.isArray(P)||P.length===0)continue;const M=n.get(E);n.set(E,[...M,...P]),_.push(E)}return _.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:_}}},l=$i(n);Es(m=>l.isEnabled(m));const u=xd(),f=ud({autoLogoutMinutos:()=>{var y,A;const m=(A=(y=globalThis.State)==null?void 0:y.get)==null?void 0:A.call(y,"config");return Number((m==null?void 0:m.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>u.dentroDeGracia()}),c=ad(n),p=od(n),v=br(c),b=Xi(n),I=Yi({isEnabled:m=>l.isEnabled(m)}),C=qi({flags:l,rutasExtra:()=>I.flagPorRuta()}),x=Si({flags:l,onChange:()=>{var m,y;I.attachToShell(),C.apply(),(y=(m=globalThis.Router)==null?void 0:m.rerender)==null||y.call(m)}}),g=Fi({proyectos:r}),h=()=>{var y,A,w,_,E,P;const m=globalThis;if((A=(y=m.State)==null?void 0:y.load)==null||A.call(y),((_=(w=m.Router)==null?void 0:w.current)==null?void 0:_.call(w))==="dashboard")try{(P=(E=m.DashboardModule)==null?void 0:E.render)==null||P.call(E)}catch(M){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",M)}},$=Oi({store:n,onDatosCambiados:h});return I.register(Ur({store:n,onDatosCambiados:h})),I.register(ol({store:n,onDatosCambiados:h})),I.register(Il({store:n,onDatosCambiados:h})),I.register(Bl({store:n,ledger:c,mostrarObjetivos:()=>l.isEnabled("goals"),onDatosCambiados:h})),I.register(_r({ledger:c,tags:p,precision:v,adjuster:b,accounts:()=>n.get("accounts"),estimaciones:()=>n.get("expenses"),onDatosCambiados:h})),I.register(ed({store:n,onDatosCambiados:h})),I.register(Zl({store:n,onDatosCambiados:h})),I.register(Rr({store:n,onDatosCambiados:h})),I.register(Wl({store:n})),I.register(Pr({store:n,onDatosCambiados:h})),{version:pe,core:ds,engine:{generarExtracto:ce,recomputarSaldoAcum:ms,saldoHoy:fs,sumarPorTags:uo,providers:{proyectarGastos:le,proyectarPrestamos:eo,proyectarTransferencias:ao,proyectarNominas:io,proyectarInteresesCuentas:no,proyectarAportaciones:oo,proyectarRetencionesFiscales:so,proyectarInflacionGastos:ro,proyectarPerdidaAhorro:lo},analysis:hs,margins:Is,avisos:Cs,optimizer:_s,dashboard:Hs},store:n,flags:l,featureRegistry:{all:Pt,porGrupo:Lo},ui:{openFeatures:x.open,openProyectos:g.open,openPersonas:$.open,applyGating:C.apply,watchGating:()=>C.observar(),instalarDeshacer:()=>ki({store:n,rerender:()=>{var y,A,w,_;const m=globalThis;(A=(y=m.State)==null?void 0:y.load)==null||A.call(y),(_=(w=m.Router)==null?void 0:w.rerender)==null||_.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Vi({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),escenarios:n.get("escenarios"),planes:n.get("planes"),goals:n.get("goals"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>I.routes(),navegar:m=>{var y,A;return(A=(y=globalThis.Router)==null?void 0:y.navigate)==null?void 0:A.call(y,m)}})},app:I,session:Object.assign(f,{vigilar:m=>pd({sesion:f,onCaducada:m}),opciones:md}),biometria:u,cambios:s,datos:{colecciones:Tt,snapshot:()=>To(o),aplicar:(m,{sellar:y=!0}={})=>{const w=mi(y?(_,E)=>o.set(_,E):(_,E)=>{const P=globalThis.StorageAdapter;P!=null&&P.setRestaurando?P.setRestaurando(_,E):o.set(_,E)},m);return n.load(),s.marcar("copia-restaurada"),w},faltantes:m=>fi(m),esVacioOPorDefecto:()=>vi(To(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:r,accounting:{ledger:c,tags:p,precision:v,adjuster:b,sugerirAjuste:ga,medirVariabilidad:id,bandaDeConfianza:rd,bandaAcumulada:On,describirBanda:ld}}}function $d(){try{const t=Hn();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const pt=typeof window<"u"?$d():null;if(pt){let t=!1;const e=()=>{var a,o;if(pt.app.attachToShell(),pt.ui.applyGating(),!t){t=!0,pt.ui.watchGating(),pt.ui.instalarDeshacer(),pt.ui.instalarBuscador();const n=globalThis,s=()=>{var l,u,f,c;return(u=(l=n.FirebaseService)==null?void 0:l.isConnected)!=null&&u.call(l)?n.FirebaseService:(c=(f=n.DropboxService)==null?void 0:f.isConnected)!=null&&c.call(f)?n.DropboxService:null};pt.ui.avisoGuardado=Ui({cambios:pt.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const l=s();if(!(l!=null&&l.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await l.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=pt.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>pt.ui.openProyectos())),(a=document.getElementById("btn-proyectos"))==null||a.addEventListener("click",()=>pt.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>pt.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return wt.bootstrap=Hn,Object.defineProperty(wt,Symbol.toStringTag,{value:"Module"}),wt}({});
//# sourceMappingURL=financeapp-core.js.map
