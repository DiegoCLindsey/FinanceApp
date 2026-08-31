var FinanceAppBundle=function(wt){"use strict";var Id=Object.defineProperty;var Ad=(wt,V,G)=>V in wt?Id(wt,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):wt[V]=G;var Un=(wt,V,G)=>Ad(wt,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function J(){return V(new Date)}function He(t,e){return new Date(t,e+1,0).getDate()}function Ra(t,e,a){return V(new Date(t,e,Math.min(a,He(t,e))))}function Se(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return Ra(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function Na(t,e){if(!e)return t;const a=G(t);return Se(a.getFullYear(),a.getMonth(),e)??t}const Yn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Jn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ge(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${Jn[a]||a+"º"} ${Yn[o]} del mes`}return t}function se(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function mt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function X(t){return t/100}function W(t){return X(mt(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Oa(t){return(t||0).toFixed(2)+"%"}function Ht(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function qa(t,e,a,o=0){const n=Ht(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,g=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),c=i-u/g;if(Math.abs(c-i)<1e-10){i=c;break}i=c}return(Math.pow(1+i,12)-1)*100}function La(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),g=e/100/12;let c=a,p=Ht(l,e,c);const f=[...s].sort((I,C)=>I.fecha.localeCompare(C.fecha));let m=0;for(let I=1;I<=a*2&&l>.01;I++){const C=new Date(u);u.setMonth(u.getMonth()+1);const x=Na(V(C),i.diaPago||"");for(;m<f.length&&f[m].fecha<=x;){const $=f[m],b=$.cantidad*(n/100);if(l-=$.cantidad,l=Math.max(0,l),$.tipo==="plazo"?c=Math.ceil(-Math.log(1-l*g/p)/Math.log(1+g)):(c=a-I+1,p=Ht(l,e,c)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:b,capitalPendiente:l,esAmortizacion:!0,simulacion:$.simulacion||!1}),m++,l<.01)break}if(l<.01)break;const v=l*g,y=Math.min(p-v,l);if(l-=y,l<.01&&(l=0),r.push({mes:I,fecha:x,cuota:p,interes:v,amortizacion:y,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),c--,c<=0||l<.01)break}return r}const ka=new Map;function at(t){var C;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((x,v)=>`${x.fecha}|${x.cantidad}|${x.tipo||""}`.localeCompare(`${v.fecha}|${v.cantidad}|${v.tipo||""}`)).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).join(";")}`,o=ka.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,g=La(n,s,i,r,l||0,e,t),c=g.reduce((x,v)=>x+v.interes,0),p=g.reduce((x,v)=>x+v.comisionAmort,0),f=n*((u||0)/100),m=g.filter(x=>!x.esAmortizacion),I={cuota:Ht(n,s,i),totalIntereses:c,tae:qa(n,s,i,u||0),costoTotal:c+p+f,comAp:f,totalComAm:p,fechaFin:((C=m.slice(-1)[0])==null?void 0:C.fecha)||"",mesesReales:m.length,tabla:g};return ka.set(a,I),I}function Ba(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function ft(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter(I=>I.year<=l),g=u.length>0?u[u.length-1]:s[0],c=(g?g.tasa:0)/100,p=new Date(l+1,0,1),f=p<n?p:n,m=se(r,f);i*=Math.pow(1+c,m/365.25),r=f}return i}function Ha(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=se(n,s),r=t?[...t].sort((g,c)=>g.year-c.year):[];let l=0,u=new Date(n);for(;u<s;){const g=u.getFullYear(),c=new Date(g+1,0,1),p=c<s?c:s,f=se(u,p),m=r.filter(x=>x.year<=g),I=m.length>0?m[m.length-1]:null,C=I!==null?I.tasa:o;l+=C*f,u=p}return i>0?l/i:o}function Ga(t,e){return((1+t/100)/(1+e/100)-1)*100}function Wn(t,e,a,o){const n=ft(e,a,o);return n>0?t/n:t}function Kn(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:g=0,gastosBasicos:c=0,gastosOtros:p=0,amortizaciones:f=0}=t,m=l-u-f-c-p,I=m,C=l>0?I/l*100:null,x=r?u-g:u,v=l>0?x/l*100:null,y=l>0?u/l*100:null,$=l>0?(c+u+f)/l*100:null,b=l>0?p/l*100:null,h=(M,E,_)=>M===null?"neutral":M>=E?"verde":M>=_?"amarillo":"rojo",w=(M,E,_)=>M===null?"neutral":M<=E?"verde":M<=_?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:g,gastosBasicos:c,gastosOtros:p,amortizaciones:f,ahorroBruto:m,ahorroReal:I,tasaAhorro:C,dti:v,dtiTotal:y,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:b,semAhorro:h(C,a,o),semDTI:w(v,n,s),semNecesidades:w($,i[0],i[0]+15),semDeseos:w(b,i[1],i[1]+10),semAhorroRegla:h(C,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function vt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function ie(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function Ve(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Va(t,e,a=0){const o=Ve(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Qn(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Ve(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),g=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,c=V(new Date(u.getFullYear(),u.getMonth()+1,0));let p=0;for(const m of r){for(;m.cursor<m.eventos.length&&m.eventos[m.cursor].fecha<=c;)m.saldo=m.eventos[m.cursor].saldoAcum??m.saldo,m.cursor++;p+=m.saldo}const f=i?a.colchonEnFecha(c):0;if(p-f>=t.targetAmount)return g}return null}function Ua(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Ya(t,e){const a=o=>Ua(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ue=t=>t.slice(0,7);function Xn(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function Ye(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Ue(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Ue(e||n.fecha),r=Ue(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=Xn(u)){const g=o.get(u);g!==void 0&&(s=g);const[c,p]=u.split("-").map(Number);l.push({x:G(V(new Date(c,p-1,15))).getTime(),mes:u,y:s})}return l}function Je(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function Zn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ts(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}function Ce(t){var e,a;return((e=t.find(o=>o.esPorDefecto))==null?void 0:e._id)??((a=t[0])==null?void 0:a._id)??"default"}function es(t,e){if(e<=0)return[];const a=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/e),s=o-n*e;return Array.from({length:e},(i,r)=>a*(n+(r<s?1:0)))}function as(t,e,a,o){if(a===0)return{ids:t,cts:e};const n=t.indexOf(o);if(n>=0){const s=[...e];return s[n]+=a,{ids:t,cts:s}}return{ids:[...t,o],cts:[...e,a]}}function Gt(t,e,a){const o=mt(t);if(!e||e.participantes.length===0)return[{personaId:a,importe:X(o)}];const n=e.participantes.map(c=>c.personaId);if(e.modo==="partesIguales"){const c=es(o,n.length);return n.map((p,f)=>({personaId:p,importe:X(c[f])}))}const s=e.participantes.map(c=>{const p=Math.max(0,c.valor??0);return e.modo==="porcentaje"?Math.round(o*p/100):mt(p)}),i=s.reduce((c,p)=>c+p,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const c=o/i,p=s.map(m=>Math.round(m*c)),f=p.reduce((m,I)=>m+I,0);return p.length>0&&(p[0]+=o-f),n.map((m,I)=>({personaId:m,importe:X(p[I])}))}const l=o-i,{ids:u,cts:g}=as(n,s,l,a);return u.map((c,p)=>({personaId:c,importe:X(g[p])}))}function We(t,e){return t.find(a=>a._id===e||e.startsWith(`${a._id}_`))}function os(t,e,a){const o=Ce(a),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of a)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const l=We(e.expenses,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const l=We(e.loans,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const l=We(e.nominas,i.sourceId);for(const u of Gt(r,l==null?void 0:l.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function Ke(t,e,a){const o=n=>!n||n.participantes.length===0?[a]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(e)])}const ht=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Qe(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function Mt(t,e){return Qe(t,e).baseImponible}function Ja(t,e){return ut(t,e)/12}const Pt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Xe(t,e){if(!t||t<=0)return 0;const a=e||Pt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Vt(t,e){if(vt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Xe(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function Me(t,e=new Date){var p;if(vt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((f,m)=>f.fecha.localeCompare(m.fecha));let i=0;const r=s.reduce((f,m)=>f+m.cantidad,0);for(const f of s)f.fecha<=n&&(i+=f.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,g=Math.min(o,i+l*u),c=Math.max(0,o-g);return{saldo:o,disponible:g,bloqueado:c,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((p=s.find(f=>f.fecha>n))==null?void 0:p.fecha)||null}}function Wa(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(vt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,g)=>u+g.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function Ze(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,g)=>u+(g.bruto||0)*(g.nPagas||12),0),i=[...a||[]].sort((u,g)=>u[0]-g[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,g]of i)if(s>=u)r=g;else break;return r}const ta=6.35;function Ft(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Ka(t){return Math.max(0,(t.bruto||0)-Ft(t))}function ns(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function ss(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Ft(r),0),o=Math.max(0,e-a),n=Mt(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Ka(i)/o):0);return s}function ea(t,e,a){if(t.irpfModo==="manual")return Ka(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(Mt(t.bruto||0,Ft(t)),a);const o=ns(e.filter(i=>i.irpfModo!=="manual")),n=ss(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(Mt(t.bruto||0,Ft(t)),a)}function is(t,e){return t.reduce((a,o)=>a+ea(o,t,e),0)}function rs(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Qa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Ft(s),0);return rs(Mt(a,o),e)}function aa(t,e,a){const o=t.bruto||0,n=Ft(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??ta,l=s*(r/100),u=ea(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function ls(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Dt=1500;function Xa(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const re=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function cs(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function Za(t,e){return t.reduce((a,o)=>a+ea(o,cs(o,t),e),0)}function to(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((M,E)=>M+(E.bruto||0),0),i=e.reduce((M,E)=>M+Ft(E),0),r=Qe(s,i),l=t.aportacionesPension,u=Dt,g=Math.min(l,u),c=Math.max(0,r.RNT-r.reducArt20-g),p=re(n.capInmobiliario),f=re(n.capMobiliario),m=re(n.gananciasFondos),I=re(n.otrasCorto),C=re(n.retCapital),x=Math.max(0,c+t.otrosIngresos+p+I),v=Math.max(0,f+m),y=ut(x,a),$=ut(v,o),b=y+$,h=Za(e,a),w=h+C;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:g,RNTred:c,otrosIngresos:t.otrosIngresos,capInmobiliario:p,capMobiliario:f,gananciasFondos:m,otrasCorto:I,baseGeneral:x,baseAhorro:v,cuotaGen:y,cuotaAho:$,cuotaIntegra:b,retNomina:h,retCapital:C,totalRet:w,resultado:b-w}}const ds=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Dt,TRAMOS_AHORRO_DEFAULT:Pt,TRAMOS_IRPF_DEFAULT:ht,agregarPorPersona:os,ajustarFechaPago:Na,ajustarPrecioReal:Wn,calcBaseImponibleTrabajo:Mt,calcFactorInflacion:ft,calcFondoInversion:Vt,calcFondosPension:Me,calcGananciasCapital:Xe,calcIRPF:ut,calcImpuestoPension:Wa,calcInflacionMediaAnual:Ha,calcSaludFinanciera:Kn,calcTAE:qa,calcTipoMarginalPension:Ze,calcTipoRealFisher:Ga,calcularDeclaracion:to,calcularReparto:Gt,clampedDate:Ra,cuentasDelObjetivo:Ve,cuotaMensual:Ht,desgloseBaseTrabajo:Qe,diasEntre:se,filtrarPorEscenario:Ya,formatEUR:j,formatLocalDate:V,formatPct:Oa,fromCents:X,haySimulaciones:ts,idPersonaPorDefecto:Ce,ingresoAnual:Xa,labelDiaPago:Ge,lastDayOfMonth:He,modeloFondoDe:vt,parseLocalDate:G,personasImplicadas:Ke,proyectarFechaCumplimiento:Qn,resolverDiaEfectivo:Se,resumenPrestamo:at,resumenPrestamoConAhorro:Ba,retencionMensual:Ja,retencionesNomina:Za,roundMoney:W,saldoEnFecha:ie,saldoEnFechaExtracto:Je,saldoParaObjetivo:Va,saldoRealCuenta:rt,serieMensual:Ye,sinSimulaciones:Zn,tablaAmortizacion:La,toCents:mt,todayISO:J,visibleEnEscenario:Ua},Symbol.toStringTag,{value:"Module"}));function le(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,g=c=>o.push({fecha:c,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&g(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const c=Math.max(1,i.frecuencia||1);let p=r.getFullYear(),f=r.getMonth();const m=Math.ceil(240/c)+2;for(let I=0;I<m;I++){const C=Se(p,f,i.diaPago||"")||(()=>{const v=r.getDate(),y=new Date(p,f+1,0).getDate();return V(new Date(p,f,Math.min(v,y)))})(),x=G(C);if(x>s||x>l)break;x>=n&&x>=r&&g(C),f+=c,f>=12&&(p+=Math.floor(f/12),f=f%12)}}else if(i.tipoFrecuencia==="diaria"){const c=Math.max(1,i.frecuencia||1)*864e5;let p=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const f=Math.ceil((n.getTime()-r.getTime())/c);p=new Date(r.getTime()+f*c)}for(;p<=s&&p<=l;)g(V(p)),p=new Date(p.getTime()+c)}}return o}function eo(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ao(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>ht),g=o.resolverTramosGanancias||(()=>Pt),c=p=>{var f;return((f=r.find(m=>m._id===p))==null?void 0:f.nombre)??p};for(const p of t){if(!p.activo||p.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(p.cuenta||"default")||a.includes(p.cuentaDestino||"default")))continue;const f=G(p.fechaInicio||e.start),m=p.fechaFin?G(p.fechaFin):i,I=C=>{const x=r.find(z=>z._id===(p.cuenta||"default")),v=r.find(z=>z._id===(p.cuentaDestino||"default")),y=vt(x),$=vt(v),b=y==="inversion"&&$==="inversion"||y==="pension"&&$==="pension",h=["transferencia",...b?["traspaso"]:[],...p.tags||[]],w=b?"traspaso-out":"transfer-out",M=b?"traspaso-in":"transfer-in",E=!a||a.length===0||a.includes(p.cuenta||"default"),_=!a||a.length===0||a.includes(p.cuentaDestino||"default");if(E&&n.push({fecha:C,concepto:`Transf. → ${c(p.cuentaDestino||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"gasto",tags:h,cuenta:p.cuenta||"default",sourceId:p._id,sourceType:w}),_&&n.push({fecha:C,concepto:`Transf. ← ${c(p.cuenta||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"ingreso",tags:h,cuenta:p.cuentaDestino||"default",sourceId:p._id,sourceType:M}),E&&!b&&x){if(y==="inversion"){const z=parseInt(C.slice(0,4)),S=Vt(x,g(z));if(S&&S.saldo>0&&S.plusvalia>0){const A=Math.min(1,p.cuantia/S.saldo),P=S.plusvalia*A*.19;P>.01&&n.push({fecha:C,concepto:`Retención IRPF reembolso ${x.nombre} (19% s/plusvalía)`,cuantia:P,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"investment-tax"})}}else if(y==="pension"){const z=u(parseInt(C.slice(0,4))),S=Ze(x,l,z),A=Wa(x,p.cuantia,S||void 0);if(A>0){const F=x.grupoNomina?`IRPF rescate ${x.nombre} (tipo marginal grupo "${x.grupoNomina}": ${S}%)`:`Retención rescate ${x.nombre} (${x.impuestoRetirada}% s/beneficio)`;n.push({fecha:C,concepto:F,cuantia:A,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"pension-tax"})}}}};if(p.tipoFrecuencia==="extraordinario")f>=s&&f<=i&&f<=m&&I(p.fechaInicio);else if(p.tipoFrecuencia==="mensual"){const C=Math.max(1,p.frecuencia||1);let x=f.getFullYear(),v=f.getMonth();const y=Math.ceil(240/C)+2;for(let $=0;$<y;$++){const b=Se(x,v,p.diaPago||"")||(()=>{const w=f.getDate(),M=new Date(x,v+1,0).getDate();return V(new Date(x,v,Math.min(w,M)))})(),h=G(b);if(h>i||h>m)break;h>=s&&h>=f&&I(b),v+=C,v>=12&&(x+=Math.floor(v/12),v=v%12)}}else if(p.tipoFrecuencia==="diaria"){const C=Math.max(1,p.frecuencia||1)*864e5;let x=new Date(Math.max(f.getTime(),s.getTime()));if(f<s){const v=Math.ceil((s.getTime()-f.getTime())/C);x=new Date(f.getTime()+v*C)}for(;x<=i&&x<=m;)I(V(x)),x=new Date(x.getTime()+C)}}return n}function oo(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=vt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const g=G(u.fechaInicio||e.start),c=u.fechaFin?G(u.fechaFin):s,p=u.cuentaOrigen||"default",f=!a||!a.length||a.includes(p),m=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",C=b=>{f&&o.push({fecha:b,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:p,sourceId:u._id,sourceType:"aportacion-out"}),m&&o.push({fecha:b,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},x={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let v=g.getFullYear(),y=g.getMonth();const $=Math.ceil(240/x)+2;for(let b=0;b<$;b++){const h=new Date(v,y+1,0).getDate(),w=V(new Date(v,y,Math.min(g.getDate(),h))),M=G(w);if(M>s||M>c)break;M>=n&&M>=g&&C(w),y+=x,y>=12&&(v+=Math.floor(y/12),y=y%12)}}}return o}function no(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",g=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,c=u?1/12:g/(365.25*864e5);let p=ie(s,e.start);const f=o.filter(C=>C.cuenta===s._id).map(C=>({fecha:C.fecha,delta:C.tipo==="ingreso"?Math.abs(C.cuantia):-Math.abs(C.cuantia)})).sort((C,x)=>C.fecha.localeCompare(x.fecha));let m=0,I=new Date(i);for(;I<=r;){const C=u?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+g),x=new Date(Math.min(C.getTime(),r.getTime()+1)),v=V(x);let y=0;for(;m<f.length&&f[m].fecha<v;)y+=f[m].delta,m++;const $=p,b=p+y,h=Math.max(0,($+b)/2);p=b;const w=u?c:(x.getTime()-I.getTime())/(365.25*864e5),M=h*(Math.pow(1+s.interes/100,w)-1);M>.001&&n.push({fecha:V(I),concepto:`Interés ${s.nombre}`,cuantia:M,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),I=C}}return n}function so(t,e,a,o=null){const n=[],s=e||ht;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=Ja(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...le([u],a,o))}return n}const us=[5,11,2,8],ps={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function io(t,e,a=null,o=[],n=()=>ht){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const p of t){const f=p.grupoNomina||"";u[f]||(u[f]=[]),u[f].push(p)}for(const p of Object.keys(u))u[p].sort((f,m)=>(m.bruto||0)-(f.bruto||0));function g(p,f){if(!l||!p.mesActualizacionIPC)return p.bruto||0;const m=p.fechaInicio||e.start,I=G(m),C=G(f);let x=0;for(let y=I.getFullYear();y<=C.getFullYear();y++){const $=new Date(y,p.mesActualizacionIPC-1,1);$>I&&$<=C&&x++}if(x===0)return p.bruto||0;const v=V(new Date(I.getFullYear()+x,0,1));return(p.bruto||0)*ft(o,m,v)}function c(p,f){const m=g(p,f),I=(p.retribucionFlexible||[]).reduce((z,S)=>z+(S.importe||0)*12,0),C=Math.max(0,m-I);if(p.irpfModo==="manual")return C*((p.irpfPct||0)/100);const x=n(parseInt(f.slice(0,4))),v=p.grupoNomina||"";if(!v)return ut(Mt(m,I),x);const y=u[v].filter(z=>z.activo),$=y.reduce((z,S)=>z+g(S,f),0),b=y.reduce((z,S)=>z+(S.retribucionFlexible||[]).reduce((A,F)=>A+(F.importe||0)*12,0),0),h=Math.max(0,$-b),w=Mt($,b),M=Math.max(0,m-I),E=h>0?w*(M/h):0,_=y.filter(z=>z._id!==p._id&&(z.bruto||0)>(p.bruto||0)).reduce((z,S)=>{const A=(S.retribucionFlexible||[]).reduce((P,T)=>P+(T.importe||0)*12,0),F=Math.max(0,g(S,f)-A);return z+(h>0?w*(F/h):0)},0);return ut(_+E,x)-ut(_,x)}for(const p of t){if(!p.activo)continue;const f=p.cuenta||"default";if(a&&a.length>0&&!a.includes(f))continue;const m=Math.max(1,p.nPagas||12),I=G(p.fechaInicio||e.start),C=p.fechaFin?G(p.fechaFin):r,x=v=>{const y=g(p,v),$=c(p,v),b=(p.retribucionFlexible||[]).reduce((A,F)=>A+(F.importe||0)*12,0),h=Math.max(0,y-b),w=(p.ssPct??6.35)/100,M=h*w,E=h/m,_=$/m,z=M/m,S=p.representacion==="simplificado"?E-z-_:E;s.push({fecha:v,concepto:p.nombre,cuantia:S,tipo:"ingreso",cuenta:f,tags:p.tags||[],sourceId:p._id,sourceType:"nomina"}),p.representacion==="detallado"&&(z>0&&s.push({fecha:v,concepto:`SS ${p.nombre}`,cuantia:z,tipo:"gasto",cuenta:f,tags:["seguridad-social","fiscal"],sourceId:p._id+"_ss",sourceType:"nomina"}),_>0&&s.push({fecha:v,concepto:`IRPF ${p.nombre}`,cuantia:_,tipo:"gasto",cuenta:f,tags:["irpf","fiscal"],sourceId:p._id+"_irpf",sourceType:"nomina"}));for(const A of p.retribucionFlexible||[])!A.cuenta||!(A.importe>0)||a&&a.length>0&&!a.includes(A.cuenta)||s.push({fecha:v,concepto:`${p.nombre} — ${ps[A.tipo]||A.tipo}`,cuantia:A.importe,tipo:"ingreso",cuenta:A.cuenta,tags:["retribucion-flexible",A.tipo],sourceId:`${p._id}_flex_${A._id||A.tipo}`,sourceType:"nomina"})};if(m<=12){const v=m===12?1:Math.round(12/m),y=I.getDate();let $=I.getFullYear(),b=I.getMonth();for(let h=0;h<300;h++){const w=new Date($,b+1,0).getDate(),M=new Date($,b,Math.min(y,w));if(M>r||M>C)break;M>=i&&M>=I&&x(V(M)),b+=v,b>=12&&($+=Math.floor(b/12),b=b%12)}}else{const v=m-12,y=I.getDate();let $=I.getFullYear(),b=I.getMonth();for(let M=0;M<300;M++){const E=new Date($,b+1,0).getDate(),_=new Date($,b,Math.min(y,E));if(_>r||_>C)break;_>=i&&_>=I&&x(V(_)),b++,b>=12&&($++,b=0)}const h=Math.max(I.getFullYear(),i.getFullYear()),w=Math.min((p.fechaFin?C:r).getFullYear(),r.getFullYear());for(let M=h;M<=w;M++)for(const E of us.slice(0,v)){const _=new Date(M,E,15);_>=i&&_<=r&&_>=I&&_<=C&&x(V(_))}}}return s}function ro(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=J(),u=t.filter(c=>c.activo&&c.tipo==="gasto"&&c.tipoFrecuencia==="mensual");let g=new Date(i.getFullYear(),i.getMonth(),1);for(;g<=r;){const c=g.getFullYear(),p=g.getMonth(),f=c+"-"+String(p+1).padStart(2,"0"),m=f+"-01",I=V(new Date(c,p+1,0)),C=V(new Date(c,p,15));let x=0;for(const v of u){if(o&&o.length>0&&!o.includes(v.cuenta||"default")||v.fechaInicio&&v.fechaInicio>I||v.fechaFin&&v.fechaFin<m)continue;const y=v.fechaInicio||l,$=ft(e,y,C);if($<=1)continue;const b=Math.max(1,v.frecuencia||1);x+=v.cuantia*($-1)/b}x>.01&&s.push({fecha:C,concepto:"Incremento coste de vida",cuantia:x,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+f,sourceType:"inflacion"}),g=new Date(c,p+1,1)}return s}function lo(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,g)=>u.year-g.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),g=l.getMonth(),c=u+"-"+String(g+1).padStart(2,"0"),p=V(new Date(u,g,15)),f=r.filter(v=>v.year<=u),m=f.length>0?f[f.length-1]:r[0],I=m?m.tasa/100:0,C=Math.pow(1+I,1/12)-1,x=t*C;x>.01&&n.push({fecha:p,concepto:"Pérdida ahorro por inflación",cuantia:x,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+c,sourceType:"inflacion"}),l=new Date(u,g+1,1)}return n}function co(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((c,p)=>c+ie(p,n),0),i=t.filter(c=>c.fecha<n),r=t.filter(c=>c.fecha>=n),l=[];let u=s;for(const c of[...i].reverse()){const p=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);l.unshift({...c,delta:p,saldoAcum:u}),u-=p}const g=[];u=s;for(const c of r){const p=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);u+=p,g.push({...c,delta:p,saldoAcum:u})}return[...l,...g]}function ms(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return co([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function ce(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter(I=>I.tipo!=="transferencia"),g=a.filter(I=>I.tipo==="transferencia"),c={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let p=[];p=p.concat(le(u,l,s)),p=p.concat(eo(e,l,s)),p=p.concat(ao(g,l,s,c)),p=p.concat(oo(o,l,s));const f=no(o,l,s,p);if(p=p.concat(f),p=p.concat(so(a,n.tramos_irpf,l,s)),p=p.concat(io(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const I=(o.find(v=>v.activo&&v.esCuentaPrincipal)||o.find(v=>v.activo)||{_id:"default"})._id;p=p.concat(ro(u,r,l,s,I));const x=o.filter(v=>v.activo&&(!s||s.length===0||s.includes(v._id))).reduce((v,y)=>v+ie(y,n.dashboardStart),0);p=p.concat(lo(x,r,l,I))}p.sort((I,C)=>I.fecha.localeCompare(C.fecha));const m=o.filter(I=>I.activo&&(!s||s.length===0||s.includes(I._id)));return co(p,m,n)}function fs(t,e,a=null){const o=J(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function uo(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function vs(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${j(i)})`})))}return a}function gs(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function bs(t,e,a=J()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const g of r.historicoSaldos||[])g.fecha<=a&&(!l||g.fecha>=l)&&(u[g.fecha]=g.saldo);return Object.keys(u).forEach(g=>o.add(g)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const g=Object.entries(n[u]).filter(([c])=>c<=r);g.length>0?(g.sort(([c],[p])=>p.localeCompare(c)),l+=g[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[g])=>u.localeCompare(g))){const u=t.filter(f=>f.fecha<=r),g=u.length>0?u[u.length-1].saldoAcum:null;if(g===null)continue;const c=l-g,p=g!==0?c/Math.abs(g)*100:0;i.push({cuenta:"Total",fecha:r,estimado:g,real:l,desv:c,pct:p})}return i}const hs=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:bs,detectarPuntosCriticos:vs,mediaMensualGastos:gs},Symbol.toStringTag,{value:"Module"}));function de(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return le(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function oa(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Ht(a.capital,a.tin,a.meses),0)}function po(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(de(t,o)+oa(a))*(e.colchonMeses||6)}function mo(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(de(t,n)+oa(a))*(i.meses||6):po(t,e,a,n)}function Ee(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((g,c)=>g.fecha.localeCompare(c.fecha)),l=r.filter(g=>g.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(de(e,i)+oa(o))*(l.meses||1):0}function ys(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function xs(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=ys(o)),{fecha:o.fecha,saldos:{...a}}))}function $s(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let g=0;g<e.length;g++){const c=e[g],p=Ee(l,o,n,s,c.fecha,!1,i);if(p<=0){u=!1;continue}const f=!l.cuentas||l.cuentas.length===0?c.saldoAcum:l.cuentas.reduce((m,I)=>{var C,x;return m+(((x=(C=a[g])==null?void 0:C.saldos)==null?void 0:x[I])||0)},0);f<p&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:c.fecha,saldo:f,target:p,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(f)} < ${j(p)} desde ${c.fecha}`})):f>=p&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:c.fecha,saldo:f,target:p,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${c.fecha}`}))}}return r}const Is=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:po,calcColchonEnFecha:mo,calcGastoBasicoMensual:de,calcMargenEnFecha:Ee,detectarCrucesMargenes:$s,saldosPorCuentaEnExtracto:xs},Symbol.toStringTag,{value:"Module"}));function As(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function fo(t,e){return se(G(t),G(e))}const ws=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function vo(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${ws[o-1]}${s?"":` de ${a}`}`}function go(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Ss(t,e={}){const{hoy:a=J(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const c of t.puntosCriticos??[])c.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:p=>p?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:p=>`El ${p} el saldo proyectado baja a ${j(c.saldo)}.`}):c.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:p=>p?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:p=>`El ${p} el saldo queda en ${j(c.saldo)}, por debajo del colchón.`});for(const c of t.crucesMargenes??[])c.tipo==="bajo_margen"&&r.push({id:`margen:${c.nombre}`,gravedad:"aviso",fecha:c.fecha,distancia:Math.max(0,c.target-c.saldo),titulo:p=>p?`Podrías bajar de «${c.nombre}»`:`Bajas de «${c.nombre}»`,detalle:p=>`El ${p} tendrías ${j(c.saldo)}, y el margen pide ${j(c.target)}.`});const l=new Map;for(const c of r){const p=l.get(c.id);(!p||c.fecha<p.fecha)&&l.set(c.id,c)}const u=[];for(const c of l.values()){const p=fo(a,c.fecha);if(p<0||p>(c.gravedad==="critico"?o:n))continue;const f=i?i(p):0,m=f>0&&c.distancia<f;u.push({id:c.id,gravedad:c.gravedad,fecha:c.fecha,dias:p,plazo:go(p),titulo:c.titulo(m),detalle:c.detalle(vo(c.fecha,a)),incierto:m})}const g={critico:0,aviso:1};return u.sort((c,p)=>c.fecha.localeCompare(p.fecha)||g[c.gravedad]-g[p.gravedad]),u.slice(0,s)}const Cs=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:As,construirAvisos:Ss,describirPlazo:go,diasEntreISO:fo,fechaEnPalabras:vo},Symbol.toStringTag,{value:"Module"}));class Ms extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Un(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let ue=null;function Es(t){const e=ue;return ue=t,()=>{ue=e}}function bo(t){return ue?ue(t):!0}function ho(t,e){if(!bo(t))throw new Ms(t,e)}const yo=[];function na(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const g=a++;return e.set(l,g),g},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),g=t.get(u);if(g)return n++,g;o++;const c=ce(l);return t.set(u,c),c}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function sa(t,e,a,o,n={},s=na()){ho("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:g=null,loanIds:c=null,nominas:p=yo,sourceAccountId:f=null,selectedMarginIds:m=null,hoy:I=new Date}=n,C=V(I),x=Math.min(120,Math.max(1,r)),v=a.filter(O=>O.activo),y=v.map(O=>O._id),$=v.find(O=>O.esCuentaPrincipal)||v[0],b=f&&y.includes(f)?v.find(O=>O._id===f):$,h=b==null?void 0:b._id,w=t.filter(O=>O.activo&&!O.simulacion&&(!c||c.includes(O._id))).sort((O,H)=>H.tin-O.tin),M=!!m&&m.length>0,E=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(h)).filter(O=>!M||m.includes(O._id));if(w.length===0)return{plan:[],margenesAplicados:E.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const O of w)_[O._id]=[];const z=[];function S(O){const H=new Date(I.getFullYear(),I.getMonth()+O,1),Y=H.getFullYear(),K=H.getMonth(),Q=`${Y}-${String(K+1).padStart(2,"0")}`,nt=V(new Date(Y,K,Math.min(15,new Date(Y,K+1,0).getDate())));return{label:Q,dia15:nt}}function A(O,H){const Y=[...O.amortizaciones||[],..._[O._id]],{tabla:K}=at({...O,amortizaciones:Y}),Q=K.filter(st=>st.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const nt=Y.filter(st=>st.fecha<=H).reduce((st,bt)=>st+bt.cantidad,0);return Math.max(0,O.capital-nt)}function F(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),Y={...o,dashboardStart:C,dashboardEnd:O},K=s.statement({loans:H,expenses:e,accounts:a,config:Y,filtroAccounts:null,nominas:p}),Q=v.reduce((it,ne)=>it+rt(ne),0),nt=b?rt(b):0,st=Q>0?nt/Q:1;let bt=nt,Ae=Q;for(const it of K){const ne=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===h?bt+=ne:y.includes(it.cuenta)||(bt+=ne*st),Ae=it.saldoAcum}return{source:bt,total:Ae}}function P(O){const{source:H}=F(O);if(H<=0)return H;let Y=0;for(const K of E){const Q=Ee(K,e,o,t,O,!0,I);Q>Y&&(Y=Q)}return H-Y}const T=2;let N=0;if(g){for(let O=0;O<x;O++)if(S(O).dia15>=g){N=O;break}}for(let O=0;O<x;O++){if((O-N)%i!==0||O<N)continue;const{label:H,dia15:Y}=S(O);if(Y<C)continue;const K=P(Y)-T;if(K<l)continue;let Q=K,nt=0;for(const st of w){if(Q<l)break;const bt=A(st,Y);if(bt<1)continue;const Ae=st.comisionAmort||0,it=1+Ae/100,ne=Math.floor(Q/it),Gn=Math.min(ne,bt);if(Gn<l)continue;const we=Math.min(Math.floor(Gn),Math.floor(bt)),Vn=+(we*Ae/100).toFixed(2),Ta=we+Vn;Ta>Q||(_[st._id].push({_id:`opt_${H}_${st._id}`,fecha:Y,cantidad:we,tipo:u,simulacion:!0}),nt+=Ta,z.push({mes:H,fechaAmort:Y,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:bt,cantidadAmort:we,comision:Vn,capitalDespues:Math.max(0,bt-we),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-nt,tipoAmort:u}),Q-=Ta)}}const D=z.reduce((O,H)=>O+H.cantidadAmort,0),L=z.reduce((O,H)=>O+H.comision,0),q=w.map(O=>{const H=_[O._id];if(!H.length)return null;const Y=at(O),K=at({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:Y.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:Y.mesesReales-K.mesesReales,interesesSin:Y.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:Y.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,nt)=>Q+nt.cantidad,0)}}).filter(O=>O!==null),B=q.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:z,margenesAplicados:E.length,totalAmortizado:D,totalComisiones:L,totalAhorroIntereses:B,resumenPorLoan:q}}function xo(t,e,a,o,n={},s){ho("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:g=[1,2,3,6,12],fechaPrimeraAmort:c=null,loanIds:p=null,nominas:f=yo,sourceAccountId:m=null,selectedMarginIds:I=null,hoy:C=new Date}=n,x=s??na(),v=V(C),y=u||V(new Date(C.getFullYear(),C.getMonth()+i,1));function $(w){const M=t.map(S=>({...S,amortizaciones:[...S.amortizaciones||[],...w[S._id]||[]]})),E={...o,dashboardStart:v,dashboardEnd:y},_=x.statement({loans:M,expenses:e,accounts:a,config:E,filtroAccounts:null,nominas:f});if(_.length===0)return a.filter(S=>S.activo).reduce((S,A)=>S+rt(A),0);const z=_.filter(S=>S.fecha<=y);return z.length>0?z[z.length-1].saldoAcum:_[0].saldoAcum}const b=$({}),h=g.map(w=>{const M=sa(t,e,a,o,{frecuencia:w,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:c,loanIds:p,nominas:f,sourceAccountId:m,selectedMarginIds:I,hoy:C},x),E={};for(const z of t)E[z._id]=[];for(const z of M.plan)E[z.loanId].push({_id:z.mes+"_"+z.loanId,fecha:z.fechaAmort,cantidad:z.cantidadAmort,tipo:l,simulacion:!0});const _=$(E);return{frecuencia:w,label:w===1?"Mensual":`Cada ${w} meses`,numAmortizaciones:M.plan.length,totalAmortizado:M.totalAmortizado,totalComisiones:M.totalComisiones,ahorroIntereses:M.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-b,valorTotal:M.totalAhorroIntereses+(_-b),plan:M.plan,resumenPorLoan:M.resumenPorLoan}}).filter(w=>w.numAmortizaciones>0);if(h.length>0){const w=Math.max(...h.map(_=>_.ahorroIntereses)),M=Math.max(...h.map(_=>_.saldoObjetivo)),E=Math.max(...h.map(_=>_.valorTotal));h.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===w,_.esMejorSaldo=_.saldoObjetivo===M,_.esMejorValor=_.valorTotal===E})}return{resultados:h,saldoBase:b,fechaObjetivo:y}}const _s=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:xo,createStatementMemo:na,defaultHoyISO:J,optimizarAmortizaciones:sa},Symbol.toStringTag,{value:"Module"})),js=30.44*864e5;function $o(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,He(e,a)))}}function Io(t){const[e,a]=t.split("-").map(Number);return $o(new Date(e,a-1,1))}function zs(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/js)}const Ps=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Et=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Fs(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Ds(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=p=>p.sourceType==="loan"&&p.tipo==="gasto",n=e.loanIdsIniciados,s=Et(t.filter(p=>p.tipo==="ingreso")),i=Et(t.filter(p=>o(p)&&(!n||n.has(p.sourceId??"")))),r=Et(t.filter(p=>o(p)&&e.hipotecaIds.has(p.sourceId??""))),l=Et(t.filter(p=>p.sourceType==="loan-amort")),u=Et(t.filter(p=>p.sourceType==="account-interest")),{basicos:g,deseo:c}=Fs(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:g/a,gastosDeseo:c/a,gastosTotales:(i+g+c)/a,intereses:u/a}}function Ao(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Ts(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,g)=>{if((g.amortizaciones||[]).filter(m=>m.fecha>=e&&m.fecha<=a).length===0)return u;const p=at(g).totalIntereses,f=at({...g,amortizaciones:(g.amortizaciones||[]).filter(m=>m.fecha<e||m.fecha>a)}).totalIntereses;return u+Math.max(0,f-p)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>at(u).tabla),l=u=>{const{desde:g,hasta:c}=Io(u);return r.reduce((p,f)=>{const m=f.find(I=>!I.esAmortizacion&&I.fecha>=g&&I.fecha<=c);return p+(m?m.cuota:0)},0)};return{deudaInicio:Ao(n,e),deudaFin:Ao(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Rs(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Et(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function wo(t,e=new Set,a="desglosado"){if(e.size===0)return uo(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function Ns(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...wo(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Os(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Et(t.filter(o=>o.tipo==="gasto")),totalIngresos:Et(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function qs(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Ls(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ks(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Bs(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const g=a(u.fecha),c=u.saldoAcum??i;(!l||l.periodo!==g)&&(l&&(i=l.cierre),l={periodo:g,inicio:o(g),apertura:i,cierre:c,maximo:Math.max(i,c),minimo:Math.min(i,c),eventos:0},r.push(l)),l.cierre=c,c>l.maximo&&(l.maximo=c),c<l.minimo&&(l.minimo=c),l.eventos+=1}return r}const Hs=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Bs,cuentasVisibles:qs,gastoPorTagOrdenado:Ns,idsHipoteca:Ls,idsPrestamosIniciados:ks,interesesPorCuenta:Rs,mesesDelPeriodo:zs,metricasFlujo:Ds,rangoMes:Io,rangoMesDe:$o,resumenPrestamosPeriodo:Ts,sinTransferencias:Ps,sumarGastosPorTag:wo,totalesPeriodo:Os},Symbol.toStringTag,{value:"Module"}));function Gs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function yt(t,e){return a=>Gs(t,e,a)}const pe=9,So=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Co=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ia(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}const Mo="default";function Eo(){return{_id:Mo,nombre:"Yo",esPorDefecto:!0,activo:!0}}function _o(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:So,tramosGananciasCapital:Co,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function jo(t,e){return{loans:[],expenses:[],accounts:[ia(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],personas:[Eo()],config:_o(t,e)}}const xt=t=>Array.isArray(t)?t:[],Vs=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function me(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function zo(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function ra(t){const{varianza:e,inflacion:a,...o}=t;return o}function Us(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Vs(t.config),r={..._o(a,o)};for(const[g,c]of Object.entries(s))c!=null&&(r[g]=c);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=So),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Co),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=xt(t.accounts).map(g=>{const c={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...g};return c.modeloFondo||(c.modeloFondo=c.esFondoPension?"pension":"cuenta"),delete c.esFondoPension,Array.isArray(c.historicoSaldos)||(c.historicoSaldos=[]),me(c)});l.length===0&&(l=[ia(a)]);const u=l.filter(g=>g.esCuentaPrincipal);if(u.length===0){const g=l.find(c=>c._id==="default")||l[0];l=l.map(c=>({...c,esCuentaPrincipal:c._id===g._id}))}else if(u.length>1){let g=!1;l=l.map(c=>c.esCuentaPrincipal?g?{...c,esCuentaPrincipal:!1}:(g=!0,c):c)}return n.accounts=l,n.expenses=xt(t.expenses).map(g=>{const c={basico:!1,activo:!0,tags:[],historialPrecios:[],...g};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.historialPrecios)||(c.historialPrecios=[]),c.diaPago=zo(c.diaPago),ra(me(c))}),n.loans=xt(t.loans).map(g=>{const c={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...g};return Array.isArray(c.tags)||(c.tags=[]),c.diaPago=zo(c.diaPago),c.amortizaciones=xt(c.amortizaciones).map(p=>me(p)),ra(me(c))}),n.nominas=xt(t.nominas).map(g=>{const c={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...g};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.retribucionFlexible)||(c.retribucionFlexible=[]),ra(me(c))}),n.goals=xt(t.goals).map((g,c)=>{const p=Array.isArray(g.cuentaIds)?g.cuentaIds:g.cuentaId?[g.cuentaId]:[],{cuentaId:f,...m}=g;return{prioridad:c+1,completado:!1,usarColchon:!0,targetAmount:0,...m,cuentaIds:p}}),n.inflacion=xt(t.inflacion),n.tramosIRPFHistorico=xt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=xt(t.tramosGananciasCapitalHistorico),n.escenarios=xt(t.escenarios).map(({inversiones:g,...c})=>c),n}const Ut=t=>Array.isArray(t)?t:[];let la=0;function Ys(t){return la+=1,`${t}_${la.toString(36)}`}const Js=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ws=t=>typeof t=="number"&&Number.isFinite(t);function Ks(t,e){const a={...t};la=0;const o=Ut(t.transacciones),n=Ut(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,g,c,p)=>{if(!Js(g)||!Ws(c))return;const f=`${u}|${g}`;i.has(f)||(i.add(f),s.push({_id:Ys("pc"),fecha:g,cuentaId:u,saldoCts:mt(c),...typeof p=="string"&&p?{nota:p}:{}}))};for(const u of Ut(t.accounts)){const g=typeof u._id=="string"?u._id:null;if(g)for(const c of Ut(u.historicoSaldos))r(g,c.fecha,c.saldo,c.nota)}const l=Ut(t.history);if(l.length>0){const u=Ut(t.accounts),g=u.find(p=>p.esCuentaPrincipal)||u.find(p=>p.activo)||u[0],c=typeof(g==null?void 0:g._id)=="string"?g._id:"default";for(const p of l){const f=typeof p.cuenta=="string"?p.cuenta:typeof p.cuentaId=="string"?p.cuentaId:c;r(f,p.fecha,p.saldo,p.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,g)=>String(u.fecha).localeCompare(String(g.fecha))),a}const ca=t=>Array.isArray(t)?t:[],Qs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xs=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let da=0;function Zs(){return da+=1,`tx_hp_${da.toString(36)}`}function ti(t,e){const a={...t};da=0;const o=[...ca(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=ca(t.expenses).map(i=>{const r=ca(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",g=i.tipo==="ingreso"?"ingreso":"gasto",c=Array.isArray(i.tags)?i.tags.filter(m=>typeof m=="string"):[];if(l)for(const m of r){if(!m||!Qs(m.fecha)||!Xs(m.cuantia))continue;const I=g==="ingreso"?mt(m.cuantia):-mt(m.cuantia),C=`${l}|${m.fecha}|${I}`;n.has(C)||(n.add(C),o.push({_id:Zs(),fecha:m.fecha,cuentaId:u,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:c,estimacionId:l,tipo:g,origen:"importado",nota:typeof m.nota=="string"&&m.nota?m.nota:"Importado del historial de precios"}))}const{historialPrecios:p,...f}=i;return f});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const Po=t=>Array.isArray(t)?t:[],_t=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Yt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,ei=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function ai(t,e){var g;const a={...t};if(Array.isArray(a.planes))return a;const o=Po(a.goals),n=Po(a.accounts),s=n.map(c=>{const p=Yt(c.bloqueoMeses,0);return{_id:`veh_${_t(c._id,"x")}`,nombre:_t(c.nombre,"Cuenta"),rentabilidadRealAnual:Yt(c.interes,0)/100,liquidez:c.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":p>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Yt(c.impuestoRetirada,0)/100,topeAportacionAnual:c.modeloFondo==="pension"?mt(1500):null,riesgo:c.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:_t(c._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Yt(c.interes,0)>0}}),i=new Map(n.map((c,p)=>[_t(c._id,""),s[p]._id])),r=((g=s[0])==null?void 0:g._id)??"",l=o.map((c,p)=>{const f=Array.isArray(c.cuentaIds)?c.cuentaIds.map(I=>_t(I,"")):[],m=ei(c.targetDate);return{_id:_t(c._id,`obj_mig_${p}`),nombre:_t(c.nombre,`Objetivo ${p+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:mt(Yt(c.targetAmount,0)),fechaLimite:m,prioridad:Yt(c.prioridad,p+1),modoAsignacion:m?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(f[0])??r,saldoActual:0,estado:c.completado===!0?"COMPLETADO":"PENDIENTE",notas:_t(c.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}function oi(t,e){const a={...t},o=Array.isArray(a.personas)?a.personas:[];return o.some(n=>(n==null?void 0:n._id)===Mo)||(a.personas=[Eo(),...o]),a}const ni=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Us},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Ks},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ti},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:ai},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:oi}],si=["history"];function Fo(t,e,a){let o=t;const n=[];for(const s of[...ni].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const jt="state_",_e="state__schemaVersion",Jt="financeapp_",ua="state__modificadoEn";function Do(t=localStorage,e=Jt){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==ua&&t.setItem(a(ua),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function ii(t=localStorage,e=Jt){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(jt)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function ri({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const li={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function ci(t,e){const a=li[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function di(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function ui({adapter:t,hoy:e=new Date}){const a=V(e),o=di(e);let n=jo(a,o);const s=new Set;let i=[];const r=ri();function l(S){for(const A of s)A(S)}function u(S){t.set(`${jt}${S}`,n[S])}function g(){const S={};for(const T of Object.keys(n)){const N=t.get(`${jt}${T}`);N!==null&&(S[T]=N)}for(const T of si){const N=t.get(`${jt}${T}`);N!==null&&(S[T]=N)}const A=t.get(_e),{state:F,applied:P}=Fo(S,A,{hoyISO:a,finISO:o});if(n=F,c(),P.length>0){for(const T of Object.keys(n))u(T);t.set(_e,pe)}return i=P,{applied:P}}function c(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[ia(a)],u("accounts");return}const S=n.accounts.filter(A=>A.esCuentaPrincipal);if(S.length===0)n.accounts=n.accounts.map((A,F)=>F===0?{...A,esCuentaPrincipal:!0}:A),u("accounts");else if(S.length>1){let A=!1;n.accounts=n.accounts.map(F=>F.esCuentaPrincipal?A?{...F,esCuentaPrincipal:!1}:(A=!0,F):F),u("accounts")}}function p(S){return n[S]}function f(S,A){n[S]=A,u(S),l(S)}function m(S){f("config",{...n.config,...S})}function I(S){return s.add(S),()=>s.delete(S)}function C(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function x(S,A){const F=[...n[S]],P={...A,_id:C()};return F.push(P),f(S,F),P}function v(S,A,F){const P=n[S].map(T=>T._id===A?{...T,...F}:T);f(S,P)}function y(S,A){const F=n[S],P=F.findIndex(T=>T._id===A);P<0||(r.registrar({col:S,item:F[P],indice:P}),f(S,F.filter((T,N)=>N!==P)))}function $(){const S=r.tomar();if(!S)return null;const A=[...n[S.col]];return A.splice(Math.min(S.indice,A.length),0,S.item),f(S.col,A),S}function b(){return r.pendiente()}function h(){const S=n.accounts||[],A=S.find(F=>F.esCuentaPrincipal&&F.activo)||S.find(F=>F.activo);return A?A._id:"default"}function w(S){var A;return((A=n.accounts.find(F=>F._id===S))==null?void 0:A.nombre)??S}function M(){return yt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function E(){return yt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function z(S,A=null){const{state:F,applied:P}=Fo(S,A,{hoyISO:a,finISO:o});n=F,c();for(const T of Object.keys(n))u(T);t.set(_e,pe);for(const T of Object.keys(n))l(T);return{applied:P}}return{load:g,get:p,set:f,patchConfig:m,subscribe:I,addItem:x,updateItem:v,removeItem:y,deshacerBorrado:$,borradoPendiente:b,getPrincipalAccountId:h,accountName:w,resolverTramosIRPF:M,resolverTramosGanancias:E,snapshot:_,replaceAll:z,get schemaVersion(){return pe},get migrationsApplied(){return[...i]},get today(){return a||J()}}}function pi(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const Tt=Object.keys(jo("1970-01-01","1970-01-01"));function To(t){const e={};for(const a of Tt){const o=t.get(`${jt}${a}`);o!=null&&(e[a]=o)}return e}function mi(t,e){const a=[];for(const o of Tt){const n=e[o];n!=null&&(t(`${jt}${o}`,n),a.push(o))}return a}function fi(t){return Tt.filter(e=>t[e]===void 0||t[e]===null)}function vi(t){var l,u,g;const e=c=>{const p=t[c];return Array.isArray(p)?p:[]};if(!Tt.filter(c=>c!=="config"&&c!=="accounts"&&c!=="planes"&&c!=="personas").every(c=>e(c).length===0))return!1;const o=e("planes");if(!(o.length===0||o.length===1&&((l=o[0])==null?void 0:l._id)==="plan_base"&&!(Array.isArray((u=o[0])==null?void 0:u.objetivos)&&o[0].objetivos.length>0)))return!1;const s=e("personas");return s.length===0||s.length===1&&((g=s[0])==null?void 0:g._id)==="default"?e("accounts").every(c=>c._id==="default"&&!(typeof c.saldoInicial=="number"&&c.saldoInicial!==0)&&!(Array.isArray(c.historicoSaldos)&&c.historicoSaldos.length>0)):!1}const Ro=`${Jt}meta_proyectos`,No=`${Jt}meta_proyectoActivo`,Rt="default",gi="Mis finanzas";function pa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function fe(t){return t===Rt?Jt:`${Jt}p_${t}_`}function Oo(){return[...Tt.map(t=>`${jt}${t}`),_e,ua]}function bi(t=localStorage){function e(){try{const c=t.getItem(Ro);if(!c)return[];const p=JSON.parse(c);return Array.isArray(p)?p:[]}catch{return[]}}function a(c){t.setItem(Ro,JSON.stringify(c))}function o(){const c=e();if(c.some(m=>m._id===Rt))return c;const p=Date.now(),f=[{_id:Rt,nombre:gi,creadoEn:p,actualizadoEn:p},...c];return a(f),f}function n(){try{const c=t.getItem(No);if(!c)return Rt;const p=JSON.parse(c);return typeof p=="string"&&p?p:Rt}catch{return Rt}}function s(c){t.setItem(No,JSON.stringify(c))}function i(c){const p=c.trim()||"Proyecto sin nombre",f=Date.now(),m={_id:pa(),nombre:p,creadoEn:f,actualizadoEn:f};return a([...o(),m]),m}function r(c,p){const f=p.trim();f&&a(o().map(m=>m._id===c?{...m,nombre:f,actualizadoEn:Date.now()}:m))}function l(c,p){const f=o().find(x=>x._id===c);if(!f)throw new Error("Proyecto no encontrado.");const m=fe(c),I={_id:pa(),nombre:(p==null?void 0:p.trim())||`${f.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},C=fe(I._id);for(const x of Oo()){const v=t.getItem(`${m}${x}`);v!==null&&t.setItem(`${C}${x}`,v)}return a([...o(),I]),I}function u(c){if(c===Rt)throw new Error("No se puede eliminar el proyecto original.");if(c===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const p=o();if(!p.some(m=>m._id===c))return;const f=fe(c);for(const m of Oo())t.removeItem(`${f}${m}`);a(p.filter(m=>m._id!==c))}function g(c){const p=new Map(o().map(m=>[m._id,m]));for(const m of c){if(!m||typeof m._id!="string")continue;const I=p.get(m._id);(!I||(m.actualizadoEn??0)>I.actualizadoEn)&&p.set(m._id,m)}const f=[...p.values()];return a(f),f}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:l,eliminar:u,fusionarRemotos:g}}function hi(t,e,a){const o=Do(t,fe(e)),n={};for(const s of a){const i=o.get(`${jt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function yi(t){const e=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!e.has(i)&&e.set(i,pa())}function a(n){if(typeof n=="string")return e.get(n)??n;if(Array.isArray(n))return n.map(a);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=a(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(a);return o}const Z={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},zt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:Z.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:Z.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:Z.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:Z.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:Z.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:Z.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:Z.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:Z.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:Z.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:Z.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:Z.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:Z.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:Z.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:Z.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:Z.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:Z.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:Z.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:Z.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:Z.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:Z.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:Z.datos,porDefecto:!1,dependencias:["sync-nube"]}],xi=new Map(zt.map(t=>[t.id,t]));function ve(t){return xi.get(t)}function qo(t){return zt.filter(e=>(e.dependencias||[]).includes(t))}function ma(){const t={};for(const e of zt)t[e.id]=e.porDefecto;return t}function Lo(){const t=[],e=new Map;for(const a of zt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function $i(t){function e(){return{...ma(),...t.get("config").features||{}}}function a(c){t.patchConfig({features:c})}function o(c,p=e(),f=new Set){const m=ve(c);if(!m)return!1;if(m.nucleo)return!0;if(p[c]===!1)return!1;if(f.has(c))return!0;f.add(c);for(const I of m.dependencias||[])if(!o(I,p,f))return!1;return!0}function n(c,p=e()){const f=ve(c);return f?(f.dependencias||[]).filter(m=>!o(m,p)):[]}function s(c,p){var y;const f=ve(c);if(!f)return{cambiadas:[]};if(f.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const m=e(),I=new Map(zt.map($=>[$.id,o($.id,m)])),C={...m,[c]:p};let x;if(p){const $=[...f.dependencias||[]];for(;$.length;){const b=$.pop();C[b]===!1&&(C[b]=!0,x="dependencias-activadas"),$.push(...((y=ve(b))==null?void 0:y.dependencias)||[])}}else{const $=qo(c).map(b=>b.id);for(;$.length;){const b=$.pop();C[b]!==!1&&(C[b]=!1,x="cascada-apagado"),$.push(...qo(b).map(h=>h.id))}}return a(C),{cambiadas:zt.filter($=>o($.id,C)!==I.get($.id)).map($=>$.id),motivo:x}}function i(){const c=e();return zt.map(p=>{const f=n(p.id,c);return{...p,activa:o(p.id,c),...f.length>0&&c[p.id]!==!1?{bloqueadaPor:f}:{}}})}function r(){const c=e();return Lo().map(({grupo:p,features:f})=>({grupo:p,features:f.map(m=>{const I=n(m.id,c);return{...m,activa:o(m.id,c),...I.length>0&&c[m.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(ma())}function u(c){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...c?{nombre:c}:{},features:e()}}function g(c){const p=c,f=p&&typeof p=="object"&&p.features&&typeof p.features=="object"?p.features:null;if(!f)throw new Error('El perfil no tiene una sección "features" válida');const m=ma(),I=[],C=[];for(const[x,v]of Object.entries(f)){if(!ve(x)){C.push(x);continue}if(typeof v!="boolean"){C.push(x);continue}m[x]=v,I.push(x)}return a(m),{aplicadas:I,ignoradas:C}}return{isEnabled:c=>o(c),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:g,bloqueadaPor:c=>n(c)}}const ge=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Wt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Ii(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(ge).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function wi(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Si(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Ai(a)}`,n(i)}function n(i){var l,u,g;i.querySelectorAll("[data-feature-toggle]").forEach(c=>{c.addEventListener("change",()=>{var m;const p=c.dataset.featureToggle,f=a.setEnabled(p,c.checked);f.motivo==="dependencias-activadas"&&Wt(t,"Se han activado también las funcionalidades necesarias"),f.motivo==="cascada-apagado"&&Wt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(m=t.onChange)==null||m.call(t,f.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const c=a.exportProfile(),p=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),f=URL.createObjectURL(p),m=e.createElement("a");m.href=f,m.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,m.click(),URL.revokeObjectURL(f),Wt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var p,f;const c=(p=r.files)==null?void 0:p[0];if(c)try{const{aplicadas:m,ignoradas:I}=a.importProfile(JSON.parse(await c.text()));Wt(t,I.length>0?`Perfil cargado (${m.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${m.length} funcionalidades)`),(f=t.onChange)==null||f.call(t,m),o(i)}catch(m){Wt(t,"No se pudo cargar el perfil: "+m.message,"err")}finally{r.value=""}}),(g=i.querySelector('[data-feature-action="reset"]'))==null||g.addEventListener("click",()=>{var c;a.reset(),Wt(t,"Funcionalidades restablecidas"),(c=t.onChange)==null||c.call(t,[]),o(i)})}function s(){const i=wi(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const $t=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ci={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",goals:"Objetivos (antiguo)",planes:"Planes (objetivos financieros)",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",escenarios:"Supuestos",personas:"Personas"};function ko(t){return Ci[t]??t}function St(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Bo(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Mi(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Ei(){var e,a,o,n;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function _i(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function ji(t,e){const a=t._id===e,o=t._id==="default";return`
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
    </div>`}function zi(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const n=o.map(i=>`<option value="${$t(i._id)}">${$t(i.nombre)}</option>`).join(""),s=a.map(i=>`
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
    </div>`}function Pi(){return`
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
      ${Pi()}
      ${zi(r,l,a.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var l,u;r.querySelectorAll("[data-proyecto-accion]").forEach(g=>{g.addEventListener("click",()=>{const c=g.dataset.proyectoId,p=g.dataset.proyectoAccion,f=a.listar().find(m=>m._id===c);if(f){if(p==="cambiar"){if(!Bo(t,`¿Cambiar a "${f.nombre}"? Se recargará la página.`))return;a.cambiarA(c),Mi(t);return}if(p==="renombrar"){const m=typeof prompt=="function"?prompt("Nuevo nombre",f.nombre):null;if(!m||!m.trim())return;a.renombrar(c,m.trim()),St(t,"Proyecto renombrado"),n(r);return}if(p==="duplicar"){const m=`${f.nombre} (copia)`,I=typeof prompt=="function"?prompt("Nombre de la copia",m):m;if(I===null)return;const C=a.duplicar(c,I.trim()||m);St(t,`"${C.nombre}" creado como copia de "${f.nombre}" ✓`),n(r);return}if(p==="eliminar"){if(!Bo(t,`¿Eliminar "${f.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(c),St(t,`"${f.nombre}" eliminado`),n(r)}catch(m){St(t,m.message,"err")}}}})}),(l=r.querySelector("#proyecto-nuevo-btn"))==null||l.addEventListener("click",()=>{const g=r.querySelector("#proyecto-nuevo-nombre"),c=g==null?void 0:g.value.trim();if(!c){St(t,"Ponle un nombre al proyecto","warn");return}const p=a.crear(c);St(t,`"${p.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var f;const g=(f=r.querySelector("#proyecto-import-origen"))==null?void 0:f.value;if(!g)return;const c=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(m=>m.dataset.proyectoImportCol);if(c.length===0){St(t,"Elige al menos una colección para importar","warn");return}const{importadas:p}=a.importarDesde(g,c);if(p.length===0){St(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}St(t,`Importado: ${p.map(ko).join(", ")} ✓`),Ei(),n(r)})}function i(){const r=_i(e);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const je=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Nt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Kt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Di(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Ti(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Ri(t){const e=t.color||je[0];return`
    <div class="dm-section" data-persona-fila="${Nt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Nt(e)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Nt(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${Nt(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${Nt(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${Nt(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${Nt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ni(){return`
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
        ${a.get("personas").map(Ri).join("")}
      </div>
      ${Ni()}`}function n(l){l.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(l)}function s(){var l;(l=t.onDatosCambiados)==null||l.call(t)}function i(l){var g;l.querySelectorAll("[data-persona-accion]").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.personaId,f=c.dataset.personaAccion,m=a.get("personas"),I=m.find(C=>C._id===p);if(I){if(f==="renombrar"){const C=typeof prompt=="function"?prompt("Nuevo nombre",I.nombre):null;if(!C||!C.trim())return;a.updateItem("personas",p,{nombre:C.trim()}),Kt(t,"Persona renombrada"),s(),n(l);return}if(f==="defecto"){a.set("personas",m.map(C=>({...C,esPorDefecto:C._id===p}))),Kt(t,`"${I.nombre}" es ahora la persona por defecto`),s(),n(l);return}if(f==="activo"){a.updateItem("personas",p,{activo:!I.activo}),s(),n(l);return}if(f==="eliminar"){if(m.length<=1){Kt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Di(t,`¿Eliminar "${I.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;a.removeItem("personas",p),Kt(t,`"${I.nombre}" eliminada`),s(),n(l)}}})});const u=l.querySelector("#persona-nuevo-color");l.querySelectorAll("[data-persona-color]").forEach(c=>{c.addEventListener("click",()=>{const p=c.getAttribute("data-persona-color");u&&(u.value=p),l.querySelectorAll("[data-persona-color]").forEach(f=>{f.style.border=f.getAttribute("data-persona-color")===p?"2px solid white":"2px solid transparent"})})}),(g=l.querySelector("#persona-nuevo-btn"))==null||g.addEventListener("click",()=>{const c=l.querySelector("#persona-nuevo-nombre"),p=c==null?void 0:c.value.trim();if(!p){Kt(t,"Ponle un nombre a la persona","warn");return}const f=(u==null?void 0:u.value)||je[0],m=a.addItem("personas",{nombre:p,color:f,esPorDefecto:!1,activo:!0});Kt(t,`"${m.nombre}" creada ✓`),s(),n(l)})}function r(){const l=Ti(e);n(l.content),l.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const Ho={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Go(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function qi({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,g])=>[g,u]);for(const[u,g]of[...Object.entries(Ho),...l]){const c=t.isEnabled(u),p=e.querySelector(`.nav-btn[data-view="${g}"]`);p&&(p.style.display=c?"":"none"),!c&&n()===g&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const g=[...u.querySelectorAll(".nav-btn[data-view]")];if(g.length===0)return;const c=g.some(p=>p.style.display!=="none");u.style.display=c?"":"none"}),Go(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{Go(e,g=>t.isEnabled(g))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>Ho[r]}}const Li="toast toast-deshacer";function ki(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(c){const p=n();if(!p)return;l();const f=document.createElement("div");f.className=Li,f.style.display="flex",f.style.alignItems="center",f.style.gap="12px";const m=document.createElement("span");m.textContent=`${ci(c.col,c.item)} se ha eliminado.`,m.style.flex="1";const I=document.createElement("button");I.type="button",I.className="btn-secondary btn-sm",I.textContent="Deshacer",I.style.flexShrink="0",I.addEventListener("click",()=>{const C=e.deshacerBorrado();if(l(),!C)return;const x=n();if(x){const v=document.createElement("div");v.className="toast toast-ok",v.textContent="Deshecho.",x.appendChild(v),setTimeout(()=>v.remove(),2500)}a==null||a()}),f.appendChild(m),f.appendChild(I),p.appendChild(f),s=f,i=setTimeout(l,o)}const g=e.subscribe(()=>{const c=e.borradoPendiente();if(!c){r=null,l();return}c!==r&&(r=c,u(c))});return()=>{g(),l()}}function ze(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Vo(t,e){const a=ze(t),o=ze(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const Ot=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Bi(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Ot(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Ot(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Ot(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Ot(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const n of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:n._id,titulo:n.nombre,detalle:[n.importeObjetivo!==null?Ot(n.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:Ot(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Ot(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function Hi(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=ze(e);if(s.length<2)return[];const i=l=>n===null||n.includes(l),r=[];for(const l of Bi(t)){if(!i(l.ruta))continue;const u=Vo(l.titulo,s),g=u>=0?-1:Math.min(Vo(l.extra??"",s),2);if(u<0&&g<0)continue;const c=u>=0?u:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:c*1e3+Math.min(999,ze(l.titulo).length)})}return r.sort((l,u)=>l.peso-u.peso||l.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Gi="buscador-overlay",Uo="btn-buscador";function Vi(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function l(){const $=e.createElement("div");$.id=Gi,$.className="modal-overlay",$.style.alignItems="flex-start",$.style.paddingTop="10vh";const b=e.createElement("div");b.className="modal-box",b.style.maxWidth="560px",b.style.padding="14px";const h=e.createElement("input");h.type="search",h.className="form-input",h.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",h.setAttribute("aria-label","Buscar en toda la aplicación"),h.autocomplete="off";const w=e.createElement("div");return w.style.marginTop="10px",w.style.maxHeight="52vh",w.style.overflowY="auto",b.appendChild(h),b.appendChild(w),$.appendChild(b),e.body.appendChild($),$.addEventListener("click",M=>{M.target===$&&I()}),h.addEventListener("input",()=>{r=0,g()}),h.addEventListener("keydown",f),o=$,n=h,s=w,$}function u(){if(s){if(s.textContent="",i.length===0){const $=e.createElement("div");$.style.padding="14px 4px",$.style.fontSize="13px",$.style.color="var(--text3)";const b=(n==null?void 0:n.value.trim())??"";$.textContent=b.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild($);return}i.forEach(($,b)=>{const h=e.createElement("button");h.type="button",h.className="buscador-fila",h.dataset.indice=String(b),b===r&&h.classList.add("activa");const w=e.createElement("div");w.style.minWidth="0";const M=e.createElement("div");M.textContent=$.titulo,M.style.fontSize="13px",M.style.overflow="hidden",M.style.textOverflow="ellipsis",M.style.whiteSpace="nowrap";const E=e.createElement("div");E.textContent=$.detalle,E.style.fontSize="11px",E.style.color="var(--text3)",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap",w.appendChild(M),$.detalle&&w.appendChild(E);const _=e.createElement("span");_.className="tag",_.textContent=$.etiqueta,_.style.flexShrink="0",h.appendChild(w),h.appendChild(_),h.addEventListener("click",()=>p(b)),s.appendChild(h)})}}function g(){const $=(n==null?void 0:n.value)??"";i=Hi(t.estado(),$,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function c($){var b,h;i.length!==0&&(r=(r+$+i.length)%i.length,u(),(h=(b=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:b.scrollIntoView)==null||h.call(b,{block:"nearest"}))}function p($){const b=i[$];b&&(I(),t.navegar(b.ruta))}function f($){$.key==="Escape"?($.preventDefault(),I()):$.key==="ArrowDown"?($.preventDefault(),c(1)):$.key==="ArrowUp"?($.preventDefault(),c(-1)):$.key==="Enter"&&($.preventDefault(),p(r))}function m(){const $=o??l();$.classList.remove("hidden"),$.style.display="",r=0,n&&(n.value="",n.focus()),g()}function I(){o&&(o.style.display="none",i=[])}function C(){return!!o&&o.style.display!=="none"}function x($){($.ctrlKey||$.metaKey)&&($.key==="k"||$.key==="K")&&($.preventDefault(),C()?I():m())}e.addEventListener("keydown",x);let v=null;function y(){const $=e.getElementById("period-bar");if(!$||e.getElementById(Uo))return;const b=e.createElement("button");b.id=Uo,b.type="button",b.className="btn-secondary",b.title="Buscar en toda la aplicación (Ctrl+K)",b.setAttribute("aria-label","Buscar"),b.textContent="🔍 Buscar",b.style.marginLeft="auto",b.addEventListener("click",m),$.appendChild(b),v=b}return y(),()=>{e.removeEventListener("keydown",x),v==null||v.remove(),o==null||o.remove(),o=null,n=null,s=null}}const fa="aviso-guardado";function Ui(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,l=null;function u(){var m;r&&clearTimeout(r),r=null,(m=e.getElementById(fa))==null||m.remove()}function g(){if(s==="oculto")return u();const m=a();if(!m)return;let I=e.getElementById(fa);I||(I=e.createElement("div"),I.id=fa,m.appendChild(I)),I.className=`toast toast-guardado toast-guardado--${s}`,I.style.display="flex",I.style.alignItems="center",I.style.gap="12px",I.textContent="";const C=e.createElement("span");if(C.style.flex="1",I.appendChild(C),s==="pendiente")C.textContent="Tienes cambios sin guardar.",I.appendChild(c("Guardar ahora","btn-primary btn-sm",()=>void p())),I.appendChild(c("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",g()}));else if(s==="subiendo"){C.textContent="Subiendo…";const x=e.createElement("span");x.className="guardado-giro",x.setAttribute("aria-hidden","true"),I.appendChild(x)}else s==="guardado"?C.textContent="¡Guardado!":s==="error"&&(C.textContent="No se ha podido guardar.",I.appendChild(c("Reintentar","btn-primary btn-sm",()=>void p())))}function c(m,I,C){const x=e.createElement("button");return x.type="button",x.className=I,x.textContent=m,x.style.flexShrink="0",x.addEventListener("click",C),x}async function p(){if(l)return l;r&&clearTimeout(r);const m=t.cambios.revision();return s="subiendo",g(),l=(async()=>{try{await t.guardar(),n.alDia(m),s="guardado",g(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),g()},o)}catch(I){console.error("[guardado] no se ha podido subir la copia:",I),s="error",g()}finally{l=null}})(),l}const f=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",g()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:p,detener(){f(),u()}}}function Yi({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(m){return`view-${m}`}function s(m){const I=t.getElementById(n(m.route));if(I)return I;const C=t.querySelector(".view-container");if(!C)return null;const x=t.createElement("div");return x.id=n(m.route),x.className="view hidden",C.appendChild(x),x}function i(m){if(t.querySelector(`.nav-btn[data-view="${m.route}"]`))return;const I=t.querySelectorAll(".nav-section"),C=I[m.seccion??Math.max(0,I.length-1)];if(!C)return;const x=t.createElement("button");x.className="nav-btn",x.dataset.view=m.route,x.innerHTML=`${m.iconoPath?`<svg viewBox="0 0 24 24"><path d="${m.iconoPath}"/></svg>`:""}<span>${m.nombre}</span>`,C.appendChild(x),x.addEventListener("click",()=>{const v=globalThis.Router;v==null||v.navigate(m.route)})}function r(m){a.set(m.route,m),s(m),i(m)}function l(){return[...a.keys()].filter(m=>{const I=a.get(m);return!e||e(I.flagId??I.id)})}function u(m){return l().includes(m)}function g(m){const I=a.get(m);if(!I||e&&!e(I.flagId??I.id))return!1;const C=s(I);if(!C)return!1;if(o&&o!==m){const x=a.get(o),v=t.getElementById(n(o));x!=null&&x.unmount&&v&&x.unmount(v)}return I.mount(C),o=m,!0}function c(){o&&g(o)}function p(){const m={};for(const[I,C]of a)m[I]=C.flagId??C.id;return m}function f(){for(const m of a.values())s(m),i(m)}return{register:r,routes:l,has:u,mount:g,rerender:c,flagPorRuta:p,attachToShell:f,get activa(){return o}}}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${d(j(t))}</span>`}function Yo(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Jo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${d(e)}</span>`).join(" ")}const Ji=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function va(t){const[e,a]=t.split("-").map(Number);return`${Ji[a-1]} ${e}`}function k(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function tt(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function R(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function U(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function gt(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function Wo(t,e){const a=parseFloat(gt(t,e));return Number.isFinite(a)?a:0}function Wi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ki(t,e){const{ledger:a}=t,o=(t.hoy??J)(),n=t.accounts().filter(v=>v.activo),{desde:s,hasta:i}=Wi(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(v=>v.tipo!=="transferencia"),g=l.filter(v=>v.importeCts<0).reduce((v,y)=>v+y.importeCts,0),c=l.filter(v=>v.importeCts>0).reduce((v,y)=>v+y.importeCts,0),p=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),f=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),m=n.map(v=>`<option value="${d(v._id)}"${v._id===e.cuentaId?" selected":""}>${d(v.nombre)}</option>`).join(""),I=v=>'<option value="">— sin asignar —</option>'+u.map(y=>`<option value="${d(y._id)}"${y._id===v?" selected":""}>${d(y.concepto)} (${d(j(y.cuantia))})</option>`).join(""),C=l.map(v=>{var y;return`
      <tr data-tx="${d(v._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${d(v.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${d(v.concepto)}</td>
        <td style="padding:7px 8px">${Jo(v.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${d(((y=t.accounts().find($=>$._id===v.cuentaId))==null?void 0:y.nombre)??v.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${d(v._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I(v.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${qt(X(v.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${d(v._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${d(v._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),x=f.slice().reverse().slice(0,8).map(v=>{var y;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${d(v.fecha)}</span>
        <span style="color:var(--text3)">${d(((y=t.accounts().find($=>$._id===v.cuentaId))==null?void 0:y.nombre)??v.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${d(j(X(v.saldoCts)))}</span>
        ${v.nota?`<span style="color:var(--text3)">${d(v.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${d(v._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${m}</select>
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
          <span>Gastos: ${qt(X(g))}</span>
          <span>Ingresos: ${qt(X(c))}</span>
          <span>Neto: ${qt(X(c+g))}</span>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${m}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(v=>`<option value="${d(v)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${m}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${x?`<div class="mt-12">${x}</div>`:""}
        </div>
      </div>
    </div>`}function Qi(t,e,a,o){const{ledger:n}=e;U(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),U(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),R(t,"#nt-guardar",()=>{const i=gt(t,"#nt-concepto").trim(),r=Wo(t,"#nt-importe");if(!i)return k("Indica un concepto","err");if(!(r>0))return k("Indica un importe mayor que cero","err");const l=gt(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:gt(t,"#nt-fecha")||(e.hoy??J)(),cuentaId:gt(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:gt(t,"#nt-tipo"),estimacionId:gt(t,"#nt-estimacion")||null}),k("Movimiento registrado"),e.onDatosCambiados(),o()}),R(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;tt("¿Eliminar este movimiento?")&&(n.eliminar(r),k("Movimiento eliminado"),e.onDatosCambiados(),o())}),R(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(c=>c._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(X(l.importeCts))));if(u===null)return;const g=parseFloat(u.replace(",","."));if(!Number.isFinite(g)||g<=0)return k("Importe no válido","err");n.actualizar(r,{importe:g}),k("Movimiento actualizado"),e.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),k("Asignación actualizada"),e.onDatosCambiados()}),R(t,"#pc-guardar",()=>{if(gt(t,"#pc-saldo").trim()==="")return k("Indica el saldo","err");const r=Wo(t,"#pc-saldo");n.registrarPuntoControl(gt(t,"#pc-cuenta"),gt(t,"#pc-fecha")||(e.hoy??J)(),r,gt(t,"#pc-nota").trim()||void 0),k("Saldo real registrado"),e.onDatosCambiados(),o()}),R(t,"[data-pc-borrar]",i=>{tt("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),k("Punto de control eliminado"),e.onDatosCambiados(),o())})}function ga(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function Xi(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??J(),u=t.get("expenses"),g=u.find(m=>m._id===s);if(!g)throw new Error(`La estimación ${s} no existe`);const c={...g,fechaFin:l},p={...g,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:g.fechaFin??null,ajustadaDesdeId:g._id,ajustadaEn:l},f=u.map(m=>m._id===s?c:m);return f.push(p),t.set("expenses",f),{estimacionCerrada:c,estimacionNueva:p}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(g){l.push({estimacionId:u.estimacionId,error:g.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(s);if(!l)return[];const u=[];let g=l;const c=new Set;for(;g!=null&&g.ajustadaDesdeId&&!c.has(g._id);){c.add(g._id);const I=r.get(g.ajustadaDesdeId);if(!I)break;u.unshift(I),g=I}const p=[];let f=l;const m=new Set([l._id]);for(;;){const I=i.find(C=>C.ajustadaDesdeId===f._id&&!m.has(C._id));if(!I)break;m.add(I._id),p.push(I),f=I}return[...u,l,...p]}return{aplicar:a,aplicarTodas:o,cadena:n}}function ba(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:ga(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function Zi(t){const e=ba(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:g})=>{const c=l.meses.slice(-6).map(p=>`${va(p.mes)}: ${j(p.estimado)} → ${j(p.real)} (${p.precision.toFixed(0)}%)`).join(" · ");return`
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
          ${g?`<button class="btn-secondary" data-sugerir="${d(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${d(g.motivo)}">Sugerir ajuste → ${d(j(g.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
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
    </div>`}function tr(t,e,a){R(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=ba(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;tt(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),k(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),R(t,"#ajustar-todas",()=>{const o=ba(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!tt(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});k(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const er=[";",",","	","|"],ar={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function Pe(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function Fe(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function or(t){let e=";",a=-1;for(const o of er){const n=t.slice(0,20).map(l=>Fe(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function be(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const g=s===","?o:n;i=e.slice(0,g).replace(/[.,]/g,""),r=e.slice(g+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function ha(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return Ko(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),Ko(o,Number(a[2]),Number(a[1]))}return null}function Ko(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Qo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ha(a)!==null).length/e.length}function Xo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>be(a)!==null).length/e.length}function nr(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=Pe(t[i]);if(r&&ar[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&Pe(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=Qo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||Pe(t[r]).includes("saldo"))continue;const l=Xo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(Xo(l)>.5||Qo(l)>.5)continue;const u=l.reduce((g,c)=>g+c.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function sr(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(g=>g.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=or(e),o=e.map(g=>Fe(g,a).length),n=Math.max(...o);let s=o.findIndex(g=>g===n);s<0&&(s=0);const i=Fe(e[s],a);let r=e.slice(s+1).map(g=>Fe(g,a));const l=ha(i[0]??"")!==null||i.some(g=>be(g)!==null&&/\d/.test(g));l&&(r=[i,...r]);const u=nr(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((g,c)=>`Columna ${c+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function Zo(t,e,a){return`${t}|${e}|${Pe(a).replace(/\s+/g," ")}`}function ir(t,e,a=[]){const o=new Set(a.map(s=>Zo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?ha(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=be(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const p=e.debe>=0?be(s[e.debe]??""):null,f=e.haber>=0?be(s[e.haber]??""):null;p===null&&f===null?r.push("sin importe en Debe ni en Haber"):p!==null&&p!==0?u=-Math.abs(p):f!==null&&f!==0?u=Math.abs(f):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const g=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let c=!1;if(l&&u!==null){const p=Zo(l,u,g);c=o.has(p)||n.has(p),n.add(p)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:g,importeCts:u,errores:r,duplicada:c}})}function rr(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function De(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const lr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ya(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=ir(e.analisis,e.mapeo,a)}function cr(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",g=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${d(r.fecha??"—")}</td>
                <td style="font-size:12px">${d(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":d(j(X(r.importeCts)))}</td>
                <td style="font-size:11px;color:${g}">${d(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function pr(t,e,a,o){R(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,De(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),R(t,"[data-imp-cerrar]",()=>{Object.assign(a,De()),o()}),U(t,"#imp-cuenta",s=>{a.cuentaId=s.value,ya(e,a),o()}),U(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),ya(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&mr(s).then(r=>{const l=sr(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},ya(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),R(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(X(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});k(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,De()),e.onDatosCambiados(),o()}})}function mr(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function fr(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function vr(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function gr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function tn(t,e){const{inicio:a,fin:o}=gr(e);return le([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function br(t){function e(n,s={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=J()}=s,u=t.transacciones({estimacionId:n._id}),c=u.length===0&&((($=n.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:n.tags}):u,p=new Map;for(const b of c){const h=b.fecha.slice(0,7);p.set(h,(p.get(h)??0)+Math.abs(b.importeCts)/100)}const f=[];for(const b of vr(l,i)){const h=p.get(b);if(h===void 0)continue;const w=W(tn(n,b));f.push({mes:b,estimado:w,real:W(h),desviacion:W(h-w),precision:fr(w,h)})}const m=W(f.reduce((b,h)=>b+h.estimado,0)),I=W(f.reduce((b,h)=>b+h.real,0)),C=f.reduce((b,h)=>b+Math.abs(h.estimado),0),x=f.length===0?null:C>0?f.reduce((b,h)=>b+h.precision*Math.abs(h.estimado),0)/C:f.reduce((b,h)=>b+h.precision,0)/f.length,v=f.slice(-r),y=v.length>0?W(v.reduce((b,h)=>b+h.real,0)/v.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:m,realTotal:I,desviacionTotal:W(I-m),precision:x,mediaRealReciente:y,infraestimada:I>m}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function hr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function yr(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function xr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function $r(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const u=(l.tags??[]).filter(g=>s.tags.includes(g)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(s)}return o}function Ir(t,e,a,o={}){const{desde:n,hasta:s}=hr(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(y=>y.importeCts<0),l=i.filter(y=>y.importeCts>0),u=e.filter(y=>y.tipo==="gasto"&&y.activo!==!1),g=new Map((o.analisis??[]).map(y=>[y.estimacionId,y])),c=new Set(u.filter(y=>t.transacciones({estimacionId:y._id}).length>0).map(y=>y._id)),p=$r(r,u,y=>c.has(y)),f=new Set,m=u.map(y=>{const $=p.get(y._id)??[];for(const M of $)f.add(M._id);const b=W($.reduce((M,E)=>M+Math.abs(E.importeCts)/100,0)),h=W(tn(y,a)),w=g.get(y._id);return{estimacionId:y._id,concepto:y.concepto,tags:y.tags??[],estimado:h,real:b,desviacion:W(b-h),sinMovimiento:$.length===0,sugerencia:w?ga(w,y.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const y of r){if(f.has(y._id))continue;const $=xr(y.concepto),b=I.get($)??{concepto:y.concepto,total:0,movimientos:0};b.total=W(b.total+Math.abs(y.importeCts)/100),b.movimientos+=1,I.set($,b)}const C=[...I.values()].sort((y,$)=>$.total-y.total),x=W(m.reduce((y,$)=>y+$.estimado,0)),v=W(r.reduce((y,$)=>y+Math.abs($.importeCts)/100,0));return{mes:a,estimado:x,real:v,desviacion:W(v-x),ingresosReales:W(l.reduce((y,$)=>y+$.importeCts/100,0)),filas:m.sort((y,$)=>Math.abs($.desviacion)-Math.abs(y.desviacion)),sinEstimacion:C,totalSinEstimacion:W(C.reduce((y,$)=>y+$.total,0)),vacio:i.length===0}}function en(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function Ar(){return{mes:""}}function xa(t,e){if(e.mes)return e.mes;const a=en(t.ledger),o=yr((t.hoy??J)());return a.includes(o)?o:a[0]??o}function $a(t,e){const a=(t.hoy??J)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return Ir(t.ledger,o,e,{analisis:n,hoy:a})}function wr(t,e){const a=xa(t,e),o=en(t.ledger);o.includes(a)||o.unshift(a);const n=$a(t,a),s=`
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
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Mr(t,e,a,o){U(t,"#cie-mes",n=>{a.mes=n.value,o()}),R(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=$a(e,xa(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??J)()}),k(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),R(t,"[data-cie-ajustar-todas]",()=>{const s=$a(e,xa(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??J)()});k(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const Er="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function _r(t){const e={cuentaId:"",mes:(t.hoy??J)().slice(0,7),filtroTexto:""},a=De(),o=Ar(),n=()=>{var c;return(c=t.onDatosCambiados)==null?void 0:c.call(t)},s=t.hoy??J,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function g(c){const p=t.ledger.saldoTotal(s()),f=t.ledger.ultimaFecha(),m=t.ledger.transacciones().length;c.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${m}</div>
          <div style="font-size:11px;color:var(--text3)">${f?`último: ${d(f)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=c.querySelector("#acc-importar"),C=c.querySelector("#acc-cierre"),x=c.querySelector("#acc-transacciones"),v=c.querySelector("#acc-precision");I.innerHTML=cr(r,a),C.innerHTML=wr(l,o),x.innerHTML=Ki(i,e),v.innerHTML=Zi(u);const y=()=>g(c);pr(I,r,a,y),Mr(C,l,o,y),Qi(x,i,e,y),tr(v,u,y)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Er,mount:g}}const jr="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ia(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function zr(t){const{store:e}=t,a=t.hoy??J,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(f){var m;e.patchConfig({margenesSeguridad:f}),(m=t.onDatosCambiados)==null||m.call(t)}function i(f,m){const I=n().map(x=>({...x,puntos:(x.puntos??[]).map(v=>({...v}))})),C=I.find(x=>x._id===f);C&&(m(C),s(I))}function r(f){const m=e.get("config"),I=Ee(f,e.get("expenses"),m,e.get("loans"),a(),!1,o());return j(I)}function l(f,m,I){const C=m.tipo==="fijo",x=C?"":`<span class="text-sm" style="color:var(--text3)">${d(j((m.meses??0)*I))}</span>`;return`
      <tr data-punto="${d(m._id)}" data-margen="${d(f._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${d(m.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${C?" selected":""}>Fijo €</option>
            <option value="meses"${C?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${C?`<input type="number" class="form-input" style="width:90px" value="${m.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${C?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${m.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${x}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(f,m,I){const C=f.cuentas&&f.cuentas.length>0?f.cuentas.map($=>{var b;return((b=m.find(h=>h._id===$))==null?void 0:b.nombre)??$}).join(", "):"Todas las cuentas activas",v=[...f.puntos??[]].sort(($,b)=>$.fecha.localeCompare(b.fecha)).map($=>l(f,$,I)).join(""),y=f.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${d(C)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${d(r(f))}</strong>
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
            ${v||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${d(f._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${d(f.nombre)}</span>
            <span class="badge ${f.activo?"badge-active":"badge-inactive"}">${f.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${f.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${f.activo?"checked":""} data-toggle-margen="${d(f._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${d(f._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${d(f._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${y}
      </div>`}function g(f,m){const I=m?n().find(y=>y._id===m):null,C=e.get("accounts").filter(y=>y.activo),x=new Set((I==null?void 0:I.cuentas)??[]),v=C.map(y=>`
        <label class="tag" data-chip="${d(y._id)}" style="cursor:pointer;${x.has(y._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${d(y._id)}" ${x.has(y._id)?"checked":""} style="display:none"/>
          ${d(y.nombre)}
        </label>`).join(" ");f.innerHTML=`
      <div class="modal-title">${m?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${d((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${v||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
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
        <button class="btn-primary" data-guardar-margen="${d(m??"")}">Guardar</button>
      </div>`}function c(f,m){const I=document.getElementById("modal-overlay"),C=document.getElementById("modal-content");!I||!C||(g(C,f),I.classList.remove("hidden"),U(C,".mg-acc-chip",x=>{const v=x,y=C.querySelector(`[data-chip="${v.value}"]`);y&&(y.style.cssText=`cursor:pointer;${v.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(C,"#mg-p-tipo",x=>{const v=x.value==="fijo",y=C.querySelector("#mg-p-importe-wrap"),$=C.querySelector("#mg-p-meses-wrap");y&&(y.style.display=v?"":"none"),$&&($.style.display=v?"none":"")}),R(C,"[data-cerrar-form]",()=>I.classList.add("hidden")),R(C,"[data-guardar-margen]",x=>{var h,w,M,E,_;const v=x.getAttribute("data-guardar-margen")||"",y=((h=C.querySelector("#mg-nombre"))==null?void 0:h.value.trim())??"";if(!y)return k("El nombre es obligatorio","err");const $=[...C.querySelectorAll(".mg-acc-chip:checked")].map(z=>z.value),b=n().map(z=>({...z}));if(v){const z=b.findIndex(S=>S._id===v);if(z===-1)return k("Margen no encontrado","err");b[z]={...b[z],nombre:y,cuentas:$}}else{const z=((w=C.querySelector("#mg-p-tipo"))==null?void 0:w.value)??"fijo",S={_id:Ia(),fecha:((M=C.querySelector("#mg-p-fecha"))==null?void 0:M.value)||J(),tipo:z,importe:parseFloat(((E=C.querySelector("#mg-p-importe"))==null?void 0:E.value)??"0")||0,meses:parseFloat(((_=C.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};b.push({_id:Ia(),nombre:y,activo:!0,cuentas:$,puntos:[S]})}s(b),k(v?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),m()}))}function p(f){const m=n(),I=e.get("accounts"),C=de(e.get("expenses"),o());f.innerHTML=`
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
      ${m.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:m.map(v=>u(v,I,C)).join("")}`;const x=()=>p(f);R(f,"[data-nuevo-margen]",()=>c(null,x)),R(f,"[data-editar-margen]",v=>c(v.getAttribute("data-editar-margen"),x)),R(f,"[data-borrar-margen]",v=>{tt("¿Eliminar este margen de seguridad?")&&(s(n().filter(y=>y._id!==v.getAttribute("data-borrar-margen"))),k("Margen eliminado"),x())}),U(f,"[data-toggle-margen]",v=>{const y=v.getAttribute("data-toggle-margen");i(y,$=>{$.activo=v.checked}),x()}),R(f,"[data-add-punto]",v=>{const y=v.getAttribute("data-add-punto");i(y,$=>{$.puntos=[...$.puntos??[],{_id:Ia(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),x()}),R(f,"[data-borrar-punto]",v=>{const y=v.closest("[data-punto]");if(!y)return;const $=y.dataset.margen,b=y.dataset.punto;i($,h=>{h.puntos=(h.puntos??[]).filter(w=>w._id!==b)}),x()}),U(f,"[data-campo]",v=>{const y=v.closest("[data-punto]");if(!y)return;const $=v.getAttribute("data-campo"),b=v.value;i(y.dataset.margen,h=>{const w=(h.puntos??[]).find(M=>M._id===y.dataset.punto);w&&($==="fecha"?w.fecha=b:$==="tipo"?w.tipo=b:$==="importe"?w.importe=parseFloat(b)||0:w.meses=parseFloat(b)||0)}),x()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:jr,mount:p}}const Pr="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function Fr(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Dr({fetchImpl:t,url:e=Pr}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=Fr(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const Tr="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Rr(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Nr(t){const{store:e}=t,a=t.ipc??Dr(),o=()=>e.get("inflacion")??[];function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function s(c,p){if(!c||c.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const f=new Set(o().map(v=>v.year)),m=c.filter(v=>v.year>=p).reverse(),I=m.filter(v=>!f.has(v.year)).length,C=[...new Set(c.map(v=>v.year))].sort((v,y)=>v-y),x=m.map(v=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${v.year}" data-tasa="${v.tasa}" ${f.has(v.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${v.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Rr(v.tasa)}">${v.tasa.toFixed(2)}%</span>
          ${f.has(v.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${C.map(v=>`<option value="${v}"${v===p?" selected":""}>${v}</option>`).join("")}
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
      </div>`}function i(c){return!c||c.length===0?2e3:Math.max(c[0].year,new Date().getFullYear()-25)}async function r(c){const p=document.getElementById("modal-overlay"),f=document.getElementById("modal-content");if(!p||!f)return;f.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,p.classList.remove("hidden");const m=(C,x)=>{const v=document.getElementById("ipc-body");v&&(v.innerHTML=s(C,x))},I=await a.obtener();m(I,i(I)),R(f,"[data-ipc-cerrar]",()=>p.classList.add("hidden")),U(f,"#ipc-desde",C=>{m(a.enCache,parseInt(C.value))}),R(f,"[data-ipc-recargar]",()=>{a.invalidar();const C=document.getElementById("ipc-body");C&&(C.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(x=>m(x,i(x)))}),R(f,"[data-ipc-importar]",()=>{const C=[...f.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(C.length===0)return k("Nada seleccionado","err");const x=new Set(o().map(y=>y.year));let v=0;for(const y of C){const $=parseInt(y.dataset.year??""),b=parseFloat(y.dataset.tasa??"");!Number.isFinite($)||!Number.isFinite(b)||x.has($)||(e.addItem("inflacion",{year:$,tasa:b}),x.add($),v++)}p.classList.add("hidden"),k(`${v} periodo${v!==1?"s":""} importado${v!==1?"s":""} correctamente`),n(),c()})}function l(c,p){var x;const f=document.getElementById("modal-overlay"),m=document.getElementById("modal-content");if(!f||!m)return;const I=c?o().find(v=>v._id===c):null;m.innerHTML=`
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
      </div>`,f.classList.remove("hidden");const C=()=>{var h;const v=parseFloat(((h=m.querySelector("#inf-tasa"))==null?void 0:h.value)??""),y=m.querySelector("#inf-preview");if(!y)return;if(!Number.isFinite(v)||v<=0){y.innerHTML="";return}const $=(Math.pow(1+v/100,1/12)-1)*100,b=Math.pow(1+v/100,5);y.innerHTML=`Con un ${v}% anual: <strong>${$.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${b.toFixed(3)}</strong> (+${((b-1)*100).toFixed(1)}%)`};(x=m.querySelector("#inf-tasa"))==null||x.addEventListener("input",C),C(),R(m,"[data-inf-cerrar]",()=>f.classList.add("hidden")),R(m,"[data-inf-guardar]",v=>{const y=v.getAttribute("data-inf-guardar")||"",$=parseInt(m.querySelector("#inf-year").value),b=parseFloat(m.querySelector("#inf-tasa").value);if(!Number.isFinite($)||$<1900||$>2200)return k("Año inválido","err");if(!Number.isFinite(b)||b<0||b>100)return k("Tasa inválida (0–100%)","err");if(o().filter(w=>w._id!==y).some(w=>w.year===$))return k("Ya existe un periodo para ese año","err");y?(e.updateItem("inflacion",y,{year:$,tasa:b}),k("Periodo actualizado")):(e.addItem("inflacion",{year:$,tasa:b}),k("Periodo añadido")),f.classList.add("hidden"),n(),p()})}function u(c,p){const f=(Math.pow(1+c.tasa/100,.08333333333333333)-1)*100,m=`${c.year}-12-31`,I=m>p?ft([c],p,m):null;return`
      <div class="exp-table-row" data-periodo="${d(c._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${c.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${c.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${f.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${d(c._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${d(c._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function g(c){const p=o(),f=e.get("config").usarInflacion||!1,m=[...p].sort((h,w)=>w.year-h.year),I=J(),C=new Date().getFullYear(),x=V(new Date(C+5,0,1)),v=V(new Date(C+10,0,1)),y=f&&p.length>0?ft(p,I,x):null,$=f&&p.length>0?ft(p,I,v):null;c.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!f&&p.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${f?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${y!==null&&$!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${y.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((y-1)*100).toFixed(1)}%)</span></div>
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
        ${m.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':m.map(h=>u(h,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const b=()=>g(c);U(c,"[data-toggle-inflacion]",h=>{const w=h.checked;e.patchConfig({usarInflacion:w}),k(w?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),b()}),R(c,"[data-nuevo-periodo]",()=>l(null,b)),R(c,"[data-editar-periodo]",h=>l(h.getAttribute("data-editar-periodo"),b)),R(c,"[data-importar-ipc]",()=>void r(b)),R(c,"[data-borrar-periodo]",h=>{tt("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",h.getAttribute("data-borrar-periodo")),k("Periodo eliminado"),n(),b())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:Tr,mount:g}}const Or=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],qr=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Lr=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function kr(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Aa=(t,e)=>t.map(([a,o])=>`<option value="${d(a)}"${a===e?" selected":""}>${d(o)}</option>`).join("");function an(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=kr(t),i=Aa(Or.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${d(e)}">
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
  </div>`}function on(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function nn(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Br={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Hr(t,e){const a=new Set(((e==null?void 0:e.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||a.has(o._id))}function Qt(t,e,a,o){if(a.filter(l=>l.activo).length<2)return"";const n=(e==null?void 0:e.modo)??"",s=new Map(((e==null?void 0:e.participantes)??[]).map(l=>[l.personaId,l.valor])),i=n==="porcentaje"||n==="importe",r=l=>{const u=s.has(l._id),g=s.get(l._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${d(o)}" value="${d(l._id)}"${u?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d(l.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${d(o)}" data-persona="${d(l._id)}"
             value="${g??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
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
  </div>`}function Xt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"",n=a.querySelector(`[data-reparto-participantes="${e}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";a.querySelectorAll(`[data-reparto-valor="${e}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Zt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...a.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const l=r.value,u=a.querySelector(`[data-reparto-valor="${e}"][data-persona="${l}"]`),g=u?parseFloat(u.value):NaN;return Number.isFinite(g)?{personaId:l,valor:g}:{personaId:l}});return{modo:o,participantes:s}}function sn(t,e){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=e.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Br[t.modo]})`}function wa(t,e,a){const o=sn(t,a),n=sn(e,a);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Gr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Vr=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ur(t){const e=t.hoy??J,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},n=()=>t.store.get("accounts"),s=x=>{var v;return((v=n().find(y=>y._id===(x||"default")))==null?void 0:v.nombre)??(x||"default")};function i(){const x=e();let v=[...t.store.get("expenses")];if(a.mostrarExpirados||(v=v.filter(y=>!y.fechaFin||y.fechaFin>=x)),a.tipo&&(v=v.filter(y=>y.tipo===a.tipo)),a.cuenta&&(v=v.filter(y=>(y.cuenta||"default")===a.cuenta)),a.desde&&(v=v.filter(y=>(y.fechaInicio??"")>=a.desde)),a.hasta&&(v=v.filter(y=>(y.fechaInicio??"")<=a.hasta)),a.busqueda){const y=a.busqueda.toLowerCase();v=v.filter($=>$.concepto.toLowerCase().includes(y))}return a.tags.size>0&&(v=v.filter(y=>(y.tags||[]).some($=>a.tags.has($)))),v.sort((y,$)=>{const b=y[a.orden]??"",h=$[a.orden]??"";return typeof b=="number"&&typeof h=="number"?(b-h)*a.sentido:String(b).localeCompare(String(h))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(x=>x.tags||[]))].filter(Boolean).sort()}function l(x,v){const y=a.orden===x?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${x}">${d(v)} <span class="sort-arrow">${y}</span></span>`}function u(x,v=!1){return(v?'<option value="">Todas las cuentas</option>':"")+n().filter($=>$.activo!==!1).map($=>`<option value="${d($._id)}"${$._id===x?" selected":""}>${d($.nombre)}</option>`).join("")}function g(x){const v=x.tipo==="transferencia",y=wa(x.repartoConsumo,x.repartoPago,t.store.get("personas")),$=Ge(x.diaPago??""),b=x.tipoFrecuencia==="extraordinario"?"Único":`Cada ${x.frecuencia??1} ${x.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${$?` · ${$}`:""}`,h=!!x.fechaFin&&x.fechaFin<e(),w=v?'<span class="badge badge-purple">⇄ transf.</span>':x.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',M=v?`${d(s(x.cuenta))} → ${d(s(x.cuentaDestino))}`:d(s(x.cuenta)),E=(x.tags||[]).map(_=>`<span class="tag${a.tags.has(_)?" active":""}" data-tag="${d(_)}" title="Filtrar por ${d(_)}">${d(_)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(x.concepto)}</div>
        <div class="tag-list mt-4">${E}</div>
      </div>
      <div>${w}</div>
      <div class="num ${x.tipo==="ingreso"?"pos":v?"":"neg"}">${v?"⇄ ":""}${d(j(x.cuantia))}</div>
      <div class="text-sm">${d(b)}</div>
      <div class="text-sm exp-col-hide">${M}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${d(x._id)}"${x.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${x.tipo==="gasto"&&x.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${x.tipo==="gasto"&&x.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${x.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${x.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${d(x.ajustadaEn??"")}">ajustada</span>`:""}
        ${y?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(y)}">👥 reparto</span>`:""}
        ${h?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${d(x._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${d(x._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${d(x._id)}">✕</button>
      </div>
    </div>`}function c(x){const v=i(),y=r();x.innerHTML=`
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
      ${y.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${y.map($=>`<span class="tag${a.tags.has($)?" active":""}" data-tag="${d($)}">${d($)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${v.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':v.map(g).join("")}
      </div>`}function p(x){const v=(x==null?void 0:x.tipo)==="transferencia",y=t.store.get("escenarios"),$=t.store.get("personas"),b=(x==null?void 0:x.escenarioIds)||[],h=(w,M,E,_,z="")=>`<div class="form-group"><label class="form-label">${d(M)}</label>
       <input class="form-input" type="${E}" id="${w}" value="${d(_)}" placeholder="${d(z)}"/></div>`;return`
      <div class="grid-2">
        ${h("ef-concepto","Concepto","text",(x==null?void 0:x.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(x==null?void 0:x.tipo)==="gasto"||!(x!=null&&x.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(x==null?void 0:x.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${v?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${h("ef-cuantia","Cuantía (€)","number",(x==null?void 0:x.cuantia)??"","500")}
        ${h("ef-frecuencia","Frecuencia","number",(x==null?void 0:x.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Vr.map(([w,M])=>`<option value="${w}"${((x==null?void 0:x.tipoFrecuencia)??"mensual")===w?" selected":""}>${d(M)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${h("ef-fecha-ini","Fecha inicio","date",(x==null?void 0:x.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((x==null?void 0:x.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${v?"":' style="display:none"'}>
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
          <div class="mt-8">${h("ef-fecha-fin","Fecha fin (opcional)","date",(x==null?void 0:x.fechaFin)??"")}</div>
          <div class="mt-8">${an(x==null?void 0:x.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${v?' style="display:none"':""}>
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
          ${y.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${y.map(w=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${b.includes(w._id)?d(w.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${d(w._id)}"${b.includes(w._id)?" checked":""}/>
                          ${d(w.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
          ${v?"":`${Qt("Reparto de consumo",x==null?void 0:x.repartoConsumo,$,"consumo")}
                 ${Qt("Reparto de pago",x==null?void 0:x.repartoPago,$,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${d((x==null?void 0:x._id)??"")}">Guardar</button>
      </div>`}function f(x){var $;const v=(($=x.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",y=(b,h)=>{const w=x.querySelector(b);w&&(w.style.display=h?"":"none")};y("#ef-destino-wrap",v==="transferencia"),y("#ef-basico-wrap",v!=="transferencia"),y("#ef-irpf-wrap",v==="ingreso"),y("#ef-clasificacion-wrap",v==="gasto")}function m(x,v,y){const $=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");!$||!b||(b.innerHTML=`<div class="modal-title">${d(v)}</div>${p(x)}`,$.classList.remove("hidden"),U(b,"#ef-tipo",()=>f(b)),U(b,"[data-dp-modo]",()=>on(b)),U(b,'[data-reparto-modo="consumo"]',()=>Xt(b,"consumo")),U(b,'[data-reparto-modo="pago"]',()=>Xt(b,"pago")),R(b,"[data-cancelar]",()=>$.classList.add("hidden")),R(b,"[data-guardar]",h=>{I(b,h.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),y())}))}function I(x,v){const y=z=>{var S;return((S=x.querySelector(z))==null?void 0:S.value)??""},$=z=>{var S;return!!((S=x.querySelector(z))!=null&&S.checked)},b=y("#ef-tipo")||"gasto",h=b==="transferencia",w=y("#ef-concepto").trim(),M=parseFloat(y("#ef-cuantia"));if(!w||!Number.isFinite(M))return k("Concepto y cuantía obligatorios","err"),!1;const E=y("#ef-clasificacion"),_={concepto:w,tipo:b,cuantia:M,frecuencia:parseInt(y("#ef-frecuencia"),10)||1,tipoFrecuencia:y("#ef-tipo-frec")||"mensual",fechaInicio:y("#ef-fecha-ini"),fechaFin:y("#ef-fecha-fin")||null,diaPago:nn(x),cuenta:y("#ef-cuenta"),cuentaDestino:h?y("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!h&&$("#ef-basico"),sujetoIRPF:!h&&$("#ef-sujetoIRPF"),clasificacion:b==="gasto"?E||null:void 0,tags:h?["transferencia"]:y("#ef-tags").split(",").map(z=>z.trim()).filter(Boolean),escenarioIds:[...x.querySelectorAll(".ef-escenario:checked")].map(z=>z.value),repartoConsumo:h?void 0:Zt(x,"consumo"),repartoPago:h?void 0:Zt(x,"pago")};return v?(t.store.updateItem("expenses",v,_),k("Actualizado")):(t.store.addItem("expenses",_),k("Creado")),o(),!0}function C(x,v){const y=x.querySelector("[data-busqueda]");let $;y==null||y.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{a.busqueda=y.value,v();const b=x.querySelector("[data-busqueda]");b==null||b.focus(),b==null||b.setSelectionRange(b.value.length,b.value.length)},250)}),U(x,"[data-expirados]",b=>{a.mostrarExpirados=b.checked,v()}),U(x,"[data-f-tipo]",b=>{a.tipo=b.value,v()}),U(x,"[data-f-cuenta]",b=>{a.cuenta=b.value,v()}),U(x,"[data-f-desde]",b=>{a.desde=b.value,v()}),U(x,"[data-f-hasta]",b=>{a.hasta=b.value,v()}),R(x,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,v()}),R(x,"[data-limpiar-tags]",()=>{a.tags=new Set,v()}),R(x,"[data-tag]",b=>{const h=b.getAttribute("data-tag");a.tags.has(h)?a.tags.delete(h):a.tags.add(h),v()}),R(x,"[data-orden]",b=>{const h=b.getAttribute("data-orden");a.orden===h?a.sentido=a.sentido===1?-1:1:(a.orden=h,a.sentido=1),v()}),R(x,"[data-nuevo]",()=>m(null,"Nuevo gasto/ingreso",v)),R(x,"[data-editar]",b=>{const h=t.store.get("expenses").find(w=>w._id===b.getAttribute("data-editar"));h&&m(h,"Editar",v)}),R(x,"[data-duplicar]",b=>{const h=t.store.get("expenses").find(E=>E._id===b.getAttribute("data-duplicar"));if(!h)return;const{_id:w,...M}=h;m({...M,concepto:`${h.concepto} (copia)`},"Duplicar movimiento",v)}),R(x,"[data-borrar]",b=>{tt("¿Eliminar?")&&(t.store.removeItem("expenses",b.getAttribute("data-borrar")),k("Eliminado"),o(),v())}),U(x,"[data-activo]",b=>{const h=b;t.store.updateItem("expenses",h.getAttribute("data-activo"),{activo:h.checked}),o(),v()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Gr,mount(x){const v=()=>c(x);c(x),x.dataset.wired!=="1"&&(C(x,v),x.dataset.wired="1")}}}function Te(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=ft(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function rn(t,e,a,o){return t.reduce((n,s)=>{const i=ft(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Yr(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:Te(i.tabla,e,a)-Te(r.tabla,e,a)}})}const Sa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${d(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Jr(t,e){const a=Ba(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?Ha(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?Ga(t.tin||0,i):null,l=o&&n?Yr(t,e.periodos,e.hoy):[],u=l.length?Te(a.sinAmort.tabla,e.periodos,e.hoy)-Te(a.tabla,e.periodos,e.hoy):null,g=u===null?null:u-a.costeTotalAmort,c=s?rn(a.tabla,e.periodos,e.hoy,a.comAp):null,p=s&&o?rn(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${d(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${d(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const f=wa(t.repartoConsumo,t.repartoPago,e.personas);return f?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(f)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(f=>`<span class="tag">${d(f)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${d(t.tin)}%</span>
        <span class="text-sm">${d(j(a.cuota))}/mes</span>
        <span class="text-sm">${d(a.fechaFin||"—")}</span>
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
                          <div class="num ${(g??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${d(j(g??0))}</div>
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
        <tbody>${a.tabla.map(f=>Kr(f,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((f,m)=>Qr(t._id,f,l[m]??null,e)).join("")}`:""}
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
    </div>`}const ln="opt_",cn=t=>String(t).startsWith(ln);function el(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(y,$){const b=o(),h=n();return!b||!h?null:(h.innerHTML=`<div class="modal-title">${d(y)}</div>${$}`,b.classList.remove("hidden"),h)}const i=()=>{var y;return(y=o())==null?void 0:y.classList.add("hidden")};function r(){let y=!1;for(const $ of t.loans()){const b=($.amortizaciones||[]).filter(h=>!cn(h._id));b.length!==($.amortizaciones||[]).length&&(t.guardarAmortizaciones($._id,b),y=!0)}return y}function l(y){try{return y()}catch($){return k($ instanceof Error?$.message:"No se ha podido completar el cálculo","err"),null}}function u(){var E,_;if(!bo("optimizador")){k("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const y=t.loans().filter(z=>z.activo&&!z.simulacion);if(y.length===0){k("No hay préstamos activos para optimizar","err");return}const $=t.config(),b=t.accounts().filter(z=>z.activo&&!z.simulacion),h=((E=b.find(z=>z.esCuentaPrincipal))==null?void 0:E._id)??((_=b[0])==null?void 0:_._id)??"",w=$.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,M=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${b.map(z=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${d(z._id)}"${z._id===h?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(z.nombre)}${z._id===h?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${d(j(rt(z)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${y.map(z=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${d(z._id)}"${z.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${d(z.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${d(z.tin)}% TIN</span>
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
        ${et("opt-fecha-obj","Fecha objetivo para comparar saldo","date",w)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);M&&(g(M),U(M,".opt-acc-radio",()=>g(M)),R(M,"[data-opt-todos]",()=>{const z=[...M.querySelectorAll(".opt-loan-check")],S=z.every(A=>A.checked);z.forEach(A=>A.checked=!S)}),R(M,"[data-cancelar]",i),R(M,"[data-opt-calcular]",()=>m(M)),R(M,"[data-opt-comparar]",()=>I(M)))}function g(y){var M;const $=(M=y.querySelector(".opt-acc-radio:checked"))==null?void 0:M.value,h=(t.config().margenesSeguridad||[]).filter(E=>E.activo!==!1).filter(E=>!E.cuentas||E.cuentas.length===0||$&&E.cuentas.includes($)),w=y.querySelector("#opt-margenes-wrap");w&&(w.innerHTML=h.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':h.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${d(E._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(E.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!E.cuentas||E.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function c(y){var w,M,E,_;const $=(z,S,A=0)=>{var P;const F=parseFloat(((P=y.querySelector(z))==null?void 0:P.value)??"");return Number.isFinite(F)?Math.max(A,F):S},b=[...y.querySelectorAll(".opt-loan-check")],h=b.filter(z=>z.checked).map(z=>z.value);return{horizonte:Math.round($("#opt-horizonte",60,1)),frecuencia:Math.round($("#opt-frecuencia",1,1)),minAmortizable:$("#opt-min",500),tipoAmort:((w=y.querySelector("#opt-tipo"))==null?void 0:w.value)||"plazo",fechaObjetivo:((M=y.querySelector("#opt-fecha-obj"))==null?void 0:M.value)||null,fechaPrimeraAmort:((E=y.querySelector("#opt-fecha-primera"))==null?void 0:E.value)||null,loanIds:b.length===0||h.length===b.length?null:h,sourceAccountId:((_=y.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...y.querySelectorAll(".opt-margin-check:checked")].map(z=>z.value)}}const p=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function f(y,$=""){const b=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${d(y)}</div>
        ${$?`<div class="text-sm mt-8" style="color:var(--text3)">${d($)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);b&&(R(b,"[data-opt-volver]",u),R(b,"[data-cancelar]",i))}function m(y){const $=c(y);r()&&k("Plan anterior eliminado, recalculando…");const{loans:b,expenses:h,accounts:w,config:M,nominas:E}=p(),_=l(()=>sa(b,h,w,M,{frecuencia:$.frecuencia,mesesHorizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.plan.length===0){f(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${$.horizonte} meses para generar amortizaciones por encima del mínimo de ${j($.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:$.tipoAmort};const z=`✨ Plan de optimización · ${$.frecuencia===1?"Mensual":`Cada ${$.frecuencia} meses`} · ${$.horizonte}m`,S=s(z,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${d(j(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${d(j(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(un).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(A=>dn(A,!0)).join("")}</tbody>
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
      </div>`);S&&(R(S,"[data-opt-volver]",u),R(S,"[data-cancelar]",i),R(S,"[data-opt-aplicar]",()=>{a&&x(a.plan,a.tipoAmort)}))}function I(y){const $=c(y);r();const{loans:b,expenses:h,accounts:w,config:M,nominas:E}=p(),_=l(()=>xo(b,h,w,M,{horizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaObjetivo:$.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){f("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:z,saldoBase:S,fechaObjetivo:A}=_,F=z.map(T=>{const N=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${d(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${d(j(T.totalAmortizado))}</td>
          <td class="num pos">${d(j(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=S?"pos":"neg"}">${d(j(T.saldoObjetivo))}</td>
          <td class="num pos">${d(j(T.valorTotal))}</td>
          <td style="font-size:11px">${N}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),P=s(`📊 Comparativa de frecuencias · hasta ${A}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${d(A)}: <strong>${d(j(S))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${d(A.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${F}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);P&&(R(P,"[data-opt-volver]",u),R(P,"[data-cancelar]",i),R(P,"[data-opt-usar]",T=>C(Number(T.getAttribute("data-opt-usar")))))}function C(y){var b;const $=e==null?void 0:e.resultados.find(h=>h.frecuencia===y);$&&(r(),x($.plan,((b=$.plan[0])==null?void 0:b.tipoAmort)||"plazo",{titulo:`✨ Plan ${$.label} · aplicado`,resumen:$,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function x(y,$,b){if(y.length===0)return;const h=new Map;for(const M of y){const E=h.get(M.loanId)??[];E.push({_id:`${ln}${M.mes}_${M.loanId}`,fecha:M.fechaAmort,cantidad:M.cantidadAmort,tipo:$,simulacion:!0}),h.set(M.loanId,E)}let w=0;for(const M of t.loans()){const E=h.get(M._id);if(!E)continue;const _=(M.amortizaciones||[]).filter(z=>!cn(z._id));t.guardarAmortizaciones(M._id,[..._,...E]),w+=1}k(`Plan aplicado: ${y.length} amortizaciones en ${w} préstamo${w!==1?"s":""} (simulación)`),b?v(b):i(),t.refrescar([...h.keys()])}function v({titulo:y,resumen:$,fechaObjetivo:b}){const h=s(y,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j($.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${d(j($.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${d((b==null?void 0:b.slice(0,7))??"")}</div><div class="stat-value pos">${d(j($.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${d(j($.totalComisiones))}</div></div>
      </div>
      ${$.resumenPorLoan.map(un).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${$.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${$.plan.map(w=>dn(w,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);h&&R(h,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function dn(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${d(j(t.comision))} com.</span>`:"";return`<tr>
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
  </div>`}const al="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ol(t){const e=t.hoy??J;let a=!1;const o=new Set;let n=null,s=null;const i=()=>{var E;return(E=t.onDatosCambiados)==null?void 0:E.call(t)},r=()=>t.store.get("escenarios"),l=E=>{var _;return((_=r().find(z=>z._id===E))==null?void 0:_.nombre)??E};function u(E){const _=E.filter(S=>S.activo);if(_.length<2)return"";const z=(S,A)=>`<button class="btn-secondary btn-sm" data-persona-tab="${S===null?"":d(S)}"
               style="${s===S?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${d(A)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${z(null,"Todas")}
      ${_.map(S=>z(S._id,S.nombre)).join("")}
    </div>`}function g(E){if(!E.activo||E.simulacion)return!1;const _=at(E).tabla.filter(z=>!z.esAmortizacion);return _.length===0?!0:_[_.length-1].fecha<e()}function c(E,_){const z=e(),S=z.slice(0,7),A=new Map;let F=0;for(const P of E){if(!P.activo||P.simulacion||_.has(P._id)||(P.fechaInicio||"")>z)continue;const T=at(P).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(S)),N=T.length>0?T[0].cuota:0;A.set(P._id,N),F+=N}return{porLoan:A,total:F,activos:[...A.values()].filter(P=>P>0).length}}function p(E){const _=e().slice(0,7),z=[];for(const S of E){if(!S.activo||S.simulacion)continue;const A=at(S).tabla.filter(P=>!P.esAmortizacion),F=A[A.length-1];F&&F.fecha.slice(0,7)===_&&z.push({loan:S,cuota:F.cuota})}return z}function f(E){return E.length<=1?E[0]??"":`${E.slice(0,-1).join(", ")} y ${E[E.length-1]}`}function m(E){const _=t.store.get("config"),z=_.dashboardStart,S=_.dashboardEnd,A=Math.max(1,(G(S).getTime()-G(z).getTime())/(30.44*864e5));let F=0;for(const P of E)!P.activo||P.simulacion||(F+=at(P).tabla.filter(T=>!T.esAmortizacion&&T.fecha>=z&&T.fecha<=S).reduce((T,N)=>T+N.cuota,0));return{media:F/A,desde:z,hasta:S}}function I(E){const _=t.store.get("personas"),z=Ce(_),S=[...t.store.get("loans")].sort((O,H)=>H.tin-O.tin),A=s?S.filter(O=>Ke(O.repartoConsumo,O.repartoPago,z).has(s)):S,F=new Set(A.filter(g).map(O=>O._id)),P=a?A:A.filter(O=>!F.has(O._id)),T=c(S,new Set(S.filter(g).map(O=>O._id))),N=m(S),D=p(S),L=t.store.get("config"),q=t.store.get("inflacion"),B=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});E.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${F.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${F.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${u(_)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${d(f(D.map(O=>O.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${d(j(D.reduce((O,H)=>O+H.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${T.total>0||N.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${T.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${d(B)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${d(j(T.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${T.activos} préstamo${T.activos!==1?"s":""} activo${T.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${N.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${d(j(N.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${d(N.desde)} → ${d(N.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${P.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':P.map(O=>Jr(O,{periodos:q,usarInflacion:!!L.usarInflacion,hoy:e(),cuotaMes:T.porLoan.get(O._id)??0,completado:F.has(O._id),nombreEscenario:l,personas:_})).join("")}
      </div>`;for(const O of E.querySelectorAll("[data-body-loan]"))o.has(O.dataset.bodyLoan??"")&&O.classList.add("open")}const C=()=>document.getElementById("modal-overlay"),x=()=>document.getElementById("modal-content"),v=()=>{var E;return(E=C())==null?void 0:E.classList.add("hidden")};function y(E,_){const z=C(),S=x();return!z||!S?null:(S.innerHTML=`<div class="modal-title">${d(E)}</div>${_}`,z.classList.remove("hidden"),R(S,"[data-cancelar]",v),S)}function $(E,_){const z=E?t.store.get("loans").find(A=>A._id===E)??null:null,S=y(E?"Editar préstamo":"Nuevo préstamo",Zr(z,t.store.get("accounts"),r(),t.store.get("personas"),e()));S&&(S.addEventListener("change",A=>{const F=A.target;F!=null&&F.matches("[data-dp-modo]")&&on(S),F!=null&&F.matches('[data-reparto-modo="consumo"]')&&Xt(S,"consumo"),F!=null&&F.matches('[data-reparto-modo="pago"]')&&Xt(S,"pago")}),R(S,"[data-guardar-loan]",A=>{b(S,A.getAttribute("data-guardar-loan")||"")&&(v(),_())}))}function b(E,_){const z=D=>{var L;return((L=E.querySelector(D))==null?void 0:L.value)??""},S=D=>{var L;return!!((L=E.querySelector(D))!=null&&L.checked)},A=z("#f-nombre").trim(),F=parseFloat(z("#f-capital")),P=parseFloat(z("#f-tin")),T=parseInt(z("#f-meses"),10);if(!A||!Number.isFinite(F)||!Number.isFinite(P)||!Number.isFinite(T))return k("Completa los campos obligatorios","err"),!1;const N={nombre:A,capital:F,tin:P,meses:T,fechaInicio:z("#f-fecha"),comisionApertura:parseFloat(z("#f-com-ap"))||0,comisionAmort:parseFloat(z("#f-com-am"))||0,diaPago:nn(E),cuenta:z("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:z("#f-tipo-tasa"),basico:S("#f-basico"),tags:z("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),escenarioIds:[...E.querySelectorAll(".loan-escenario:checked")].map(D=>D.value),repartoConsumo:Zt(E,"consumo"),repartoPago:Zt(E,"pago")};return _?(t.store.updateItem("loans",_,N),k("Préstamo actualizado")):(t.store.addItem("loans",{...N,amortizaciones:[]}),k("Préstamo creado")),i(),!0}function h(E,_,z){const S=t.store.get("loans").find(P=>P._id===E);if(!S)return;const A=_?(S.amortizaciones||[]).find(P=>P._id===_)??null:null,F=y(_?"Editar amortización":"Añadir amortización",tl(E,A,r(),e()));F&&R(F,"[data-guardar-amort]",P=>{const[T,N]=(P.getAttribute("data-guardar-amort")||"").split("|");w(F,T,N)&&(v(),z([T]))})}function w(E,_,z){var L;const S=q=>{var B;return((B=E.querySelector(q))==null?void 0:B.value)??""},A=S("#am-fecha"),F=parseFloat(S("#am-cant"));if(!A||!Number.isFinite(F)||F<=0)return k("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(q=>q._id===_);if(!P)return!1;const T={fecha:A,cantidad:F,tipo:S("#am-tipo"),simulacion:!!((L=E.querySelector("#am-sim"))!=null&&L.checked),escenarioIds:[...E.querySelectorAll(".amort-escenario:checked")].map(q=>q.value)},N=P.amortizaciones||[],D=z?N.map(q=>q._id===z?{...q,...T}:q):[...N,{_id:Date.now().toString(36),...T}];return t.store.updateItem("loans",_,{amortizaciones:D}),k(z?"Amortización actualizada":"Amortización añadida"),i(),!0}function M(E,_,z){R(E,"[data-toggle-finalizados]",()=>{a=!a,_()}),R(E,"[data-persona-tab]",S=>{s=S.getAttribute("data-persona-tab")||null,_()}),R(E,"[data-nuevo-loan]",()=>$(null,_)),R(E,"[data-optimizar]",()=>z.abrir()),R(E,"[data-toggle-loan]",(S,A)=>{var N;if((N=A.target)!=null&&N.closest("button"))return;const F=S.getAttribute("data-toggle-loan"),P=[...E.querySelectorAll("[data-body-loan]")].find(D=>D.dataset.bodyLoan===F);(P==null?void 0:P.classList.toggle("open"))?o.add(F):o.delete(F)}),R(E,"[data-editar-loan]",S=>$(S.getAttribute("data-editar-loan"),_)),R(E,"[data-borrar-loan]",S=>{if(!tt("¿Eliminar préstamo?"))return;const A=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",A),o.delete(A),k("Eliminado"),i(),_()}),R(E,"[data-amort-loan]",S=>{const A=S.getAttribute("data-amort-loan");o.add(A),h(A,null,_)}),R(E,"[data-editar-amort]",S=>{const[A,F]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(A),h(A,F,_)}),R(E,"[data-borrar-amort]",S=>{const[A,F]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(T=>T._id===A);P&&(t.store.updateItem("loans",A,{amortizaciones:(P.amortizaciones||[]).filter(T=>T._id!==F)}),k("Amortización eliminada"),i(),_([A]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:al,mount(E){const _=(z=[])=>{for(const S of z)o.add(S);I(E)};n??(n=el({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(z,S)=>{t.store.updateItem("loans",z,{amortizaciones:S}),i()},hoy:e,refrescar:_})),I(E),E.dataset.wired!=="1"&&(M(E,_,n),E.dataset.wired="1")}}}const nl={transporte:125,restaurante:220,otros:null},sl={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},il=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],ee=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,rl=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${d(a._id)}"${a._id===e?" selected":""}>${d(a.nombre)}</option>`).join("");function ll(t,e){const a=t.map((s,i)=>{const r=e.find(g=>g._id===s.cuenta),l=nl[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
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
    </div>`}function pn(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ta),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e,repartoConsumo:Zt(t,"consumo"),repartoPago:Zt(t,"pago")}}function dl(t,e,a,o){const n=pn(t,e),s=e.reduce((x,v)=>x+(v.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(Mt(n.bruto,s),a.tramos),u=i-r-l,g=i/n.nPagas,c=r/n.nPagas,p=l/n.nPagas,f=g-c-p,m=n.grupoNomina?a.nominas.filter(x=>x.grupoNomina===n.grupoNomina&&x._id!==o):[],I=m.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${d(n.grupoNomina)}" con ${d(m.map(x=>x.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",C=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${d(j(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${d(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${d(j(n.bruto))}</span>
      ${C}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${d(j(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${d(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${d(j(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${d(j(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${d(j(f))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${d(j(f))}/paga`:`ingreso ${d(j(g))} − SS ${d(j(c))} − IRPF ${d(j(p))}`}${s>0?" + recargas flex":""}</span>
    </div>${I}`}function ul(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=ll(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=dl(t,e,a,o))},i=()=>{var l,u;const r=(g,c)=>{const p=t.querySelector(g);p&&(p.style.display=c?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Xt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Xt(t,"pago")),R(t,"[data-flex-anadir]",()=>{var u,g,c;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((g=t.querySelector("#fc-importe"))==null?void 0:g.value)??"")||0;if(!l)return k("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((c=t.querySelector("#fc-cuenta"))==null?void 0:c.value)||""}),n(),s()}),R(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const mn=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function pl(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ht;function r(p,f){const m=o(),I=n();return!m||!I?null:(I.innerHTML=`<div class="modal-title">${d(p)}</div>${f}`,m.classList.remove("hidden"),R(I,"[data-cerrar]",s),I)}function l(){e=null;const p=[...t.store.get("tramosIRPFHistorico")].sort((I,C)=>I.año-C.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",m=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${f}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${d(mn(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${f}">
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
      </div>`);m&&(R(m,"[data-editar-tabla]",I=>{const C=I.getAttribute("data-editar-tabla");c(C==="default"?"default":Number(C))}),R(m,"[data-borrar-tabla]",I=>{const C=Number(I.getAttribute("data-borrar-tabla"));tt(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(x=>x.año!==C)),k(`Tabla ${C} eliminada`),t.onDatosCambiados(),l())}),R(m,"[data-anadir-anyo]",()=>{var x;const I=parseInt(((x=m.querySelector("#irpf-new-year"))==null?void 0:x.value)??"",10);if(!I||I<2e3||I>2100)return k("Año inválido","err");const C=t.store.get("tramosIRPFHistorico");if(C.some(v=>v.año===I))return k("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...C,{_id:Date.now().toString(36),año:I,tramos:i().map(v=>[...v])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([p,f],m)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${m}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${m}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${m}">✕</button>
          </div>
        </div>`).join("")}function g(p){a=[...p.querySelectorAll("[data-tr-min]")].map((m,I)=>{const C=p.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(m.value)||0,parseFloat((C==null?void 0:C.value)??"")||0]})}function c(p){var v;e=p;const f=t.store.get("tramosIRPFHistorico");a=(p==="default"?i():((v=f.find(y=>y.año===p))==null?void 0:v.tramos)??i()).map(y=>[...y]);const I=p==="default"?"tabla por defecto":`ejercicio ${p}`,C=r(`Tramos IRPF — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${d(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!C)return;const x=()=>{const y=C.querySelector("#irpf-tramos-rows");y&&(y.innerHTML=u())};R(C,"[data-volver]",l),R(C,"[data-tr-anadir]",()=>{g(C),a.push([0,0]),x()}),R(C,"[data-tr-borrar]",y=>{g(C),a.splice(Number(y.getAttribute("data-tr-borrar")),1),x()}),R(C,"[data-tr-guardar]",()=>{g(C);const y=[...a].sort(($,b)=>$[0]-b[0]);if(y.length===0)return k("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:y}),k("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===e?{...$,tramos:y}:$)),k(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const fn=1500,Lt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,ml=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${d(n)}"${n===o?" selected":""}>${d(s)}</option>`).join("")}
   </select></div>`,fl=t=>(t.modeloFondo||"cuenta")==="pension";function vl(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>gl(n,e,a,o)).join("")}</div>`}function gl(t,e,a,o){const n=Me(t);if(!n)return"";const s=Ze(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,g)=>u+g.cantidad,0),l=Math.min(r,fn)*(s/100);return`<div class="card">
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
    </div>`}function yl(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=bl(e))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return k("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function xl(t,e,a,o){var C;const n=x=>{var v;return((v=t.querySelector(x))==null?void 0:v.value)??""},s=(x,v=0)=>{const y=parseFloat(n(x));return Number.isFinite(y)?y:v},i=x=>{var v;return!!((v=t.querySelector(x))!=null&&v.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),g={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(x=>x.value)},c=[...(a==null?void 0:a.historicoSaldos)??[]],p=[...(a==null?void 0:a.aportaciones)??[]],m=((C=[...c].sort((x,v)=>v.fecha.localeCompare(x.fecha))[0])==null?void 0:C.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(m===null||Math.abs(l-m)>.005)&&(c.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(m??0)&&p.push({_id:`${I}a`,fecha:o,cantidad:l-(m??0)})):l>0&&(c.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),p.push({_id:`${I}a`,fecha:g.fechaInicialSaldo??o,cantidad:l})),{datos:{...g,historicoSaldos:c,aportaciones:p}}}const $l="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Il(t){const e=t.hoy??J,a=()=>{var v;return(v=t.onDatosCambiados)==null?void 0:v.call(t)};let o=null;function n(v){const y=v.filter(b=>b.activo);if(y.length<2)return"";const $=(b,h)=>`<button class="btn-secondary btn-sm" data-persona-tab="${b===null?"":d(b)}"
               style="${o===b?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${d(h)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${$(null,"Todas")}
      ${y.map(b=>$(b._id,b.nombre)).join("")}
    </div>`}function s(){const v=t.store.get("config");return yt(t.store.get("tramosIRPFHistorico"),v.tramos_irpf??ht)(Number(e().slice(0,4)))}function i(v,y,$){const b=aa(v,y,$),h=!!y&&v.irpfModo!=="manual",w=wa(v.repartoConsumo,v.repartoPago,t.store.get("personas")),M=[v.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${v.mesActualizacionIPC}">IPC m${v.mesActualizacionIPC}</span>`:"",b.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${d(j(b.flexAnual))}/año</span>`:"",Math.abs(b.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${b.ssPct.toFixed(2)}%</span>`:"",w?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${d(w)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(v.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${M}</div>
      </div>
      <div class="num">${d(j(b.brutoAnual))}
        ${b.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${d(j(b.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${d(j(b.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${b.nPagas} pagas</div>
      <div class="text-sm ${h?"neg":""}">${v.irpfModo==="manual"?`${d(v.irpfPct??0)}% (manual)`:`${b.irpfPct.toFixed(1)}% (auto)`}${h?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${v.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${d(r(v.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${d(v._id)}"${v.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${d(v._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${d(v._id)}">✕</button>
      </div>
    </div>`}const r=v=>{var y;return((y=t.store.get("accounts").find($=>$._id===(v||"default")))==null?void 0:y.nombre)??(v||"default")};function l(v,y,$){const b=y.reduce((M,E)=>M+(E.bruto||0),0),h=is(y,$),w=b>0?h/b*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${d(v)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${d(j(b))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${w.toFixed(1)}%</strong> (${d(j(h))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${y.map(M=>i(M,y,$)).join("")}
      </div>
    </div>`}function u(v){const y=s(),$=t.store.get("personas"),b=Ce($),h=[...t.store.get("nominas")].sort((S,A)=>(A.bruto||0)-(S.bruto||0)),w=o?h.filter(S=>Ke(S.repartoConsumo,S.repartoPago,b).has(o)):h,{grupos:M,sueltas:E}=ls(w),_=t.store.get("accounts").filter(fl),z=h.filter(S=>S.activo!==!1);v.innerHTML=`
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
      ${w.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...M.entries()].map(([S,A])=>l(S,A,y)).join("")}
      ${E.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${E.map(S=>i(S,null,y)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${vl(_,z,y,e())}</div>`}const g=()=>document.getElementById("modal-overlay"),c=()=>document.getElementById("modal-content"),p=()=>{var v;return(v=g())==null?void 0:v.classList.add("hidden")};function f(v,y){const $=g(),b=c();return!$||!b?null:(b.innerHTML=`<div class="modal-title">${d(v)}</div>${y}`,$.classList.remove("hidden"),R(b,"[data-cancelar]",p),b)}function m(v,y){const $=v?t.store.get("nominas").find(M=>M._id===v)??null:null,b=[...($==null?void 0:$.retribucionFlexible)??[]].map(M=>({...M})),h={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:e()},w=f(v?"Editar nómina":"Nueva nómina",cl($,h));w&&(ul(w,b,h,v??""),R(w,"[data-guardar-nomina]",M=>{const E=pn(w,b);if(!E.nombre||E.bruto<=0)return k("Nombre y bruto anual son obligatorios","err");const _=M.getAttribute("data-guardar-nomina")||"",z={...E,activo:!0,tags:["nomina"]};_?(t.store.updateItem("nominas",_,z),k("Nómina actualizada")):(t.store.addItem("nominas",z),k("Nómina creada")),a(),p(),y()}))}function I(v,y){const $=v?t.store.get("accounts").find(w=>w._id===v)??null:null,b=[...($==null?void 0:$.planAportaciones)??[]].map(w=>({...w})),h=f(v?"Editar plan de pensiones":"Nuevo plan de pensiones",hl($,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));h&&(yl(h,b,e()),R(h,"[data-guardar-pension]",w=>{const{datos:M,error:E}=xl(h,b,$,e());if(E)return k(E,"err");const _=w.getAttribute("data-guardar-pension")||"";_?(t.store.updateItem("accounts",_,M),k("Plan actualizado")):(t.store.addItem("accounts",M),k("Plan creado")),a(),p(),y()}))}function C(v,y,$){R(v,"[data-persona-tab]",b=>{o=b.getAttribute("data-persona-tab")||null,y()}),R(v,"[data-nueva-nomina]",()=>m(null,y)),R(v,"[data-editar-nom]",b=>m(b.getAttribute("data-editar-nom"),y)),R(v,"[data-borrar-nom]",b=>{tt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",b.getAttribute("data-borrar-nom")),k("Eliminada"),a(),y())}),U(v,"[data-activo-nom]",b=>{const h=b;t.store.updateItem("nominas",h.getAttribute("data-activo-nom"),{activo:h.checked}),a(),y()}),R(v,"[data-tramos]",()=>$.abrir()),R(v,"[data-nueva-pension]",()=>I(null,y)),R(v,"[data-editar-pension]",b=>I(b.getAttribute("data-editar-pension"),y)),R(v,"[data-borrar-pension]",b=>{tt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",b.getAttribute("data-borrar-pension")),k("Plan eliminado"),a(),y())})}let x=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:$l,mount(v){const y=()=>u(v);x??(x=pl({store:t.store,onDatosCambiados:()=>{a(),y()},año:()=>Number(e().slice(0,4))})),u(v),v.dataset.wired!=="1"&&(C(v,y,x),v.dataset.wired="1")}}}const Al="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",wl="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",vn={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Sl={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Cl(t,e){const a=t.filter(l=>l.activo&&vt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Vt(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
  </div>`}function El(t,e){const a=vn[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(f=>(f.retribucionFlexible??[]).filter(m=>m.cuenta===t._id).map(m=>({nomina:f,importe:m.importe}))),s=n.reduce((f,m)=>f+m.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(f=>(f.grupoNomina||"")===t.grupoNomina&&f.activo!==!1):n.slice(0,1).map(f=>f.nomina),g=Qa(u,e.tramosIRPF),c=l*g/100,p=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${g}%`:`tipo marginal ${g}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
             <span class="num pos" title="Importe exento × ${d(p)}">≈ ${d(j(c))}/año <span style="font-size:10px;color:var(--text3)">(${d(g)}%)</span></span></div>`:""}
    ${n.length>0?n.map(f=>`<div style="font-size:11px;color:var(--text3)">↩ ${d(f.nomina.nombre)}: ${d(j(f.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
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
  </div>`:""}function jl(t,e){const a=Vt(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,g=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),c=a.costBase+n.totalAportaciones,p=Math.max(0,g-c),f=Xe(p,e.tramosGanancias),m=p>0?(f/p*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",C=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",x=(w,M,E)=>w.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${M} ${d(_.contraparte)}: ${d(_.concepto)}</span>
          <span class="num ${E}">${d(j(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),y=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${d(o.dashboardStart.slice(0,7))} → ${d(o.dashboardEnd.slice(0,7))})</div>
         ${x(n.entradas,"↓","pos")}
         ${x(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${d(j(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${d(j(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${d(j(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=e.invModo(t._id),b=w=>`padding:3px 10px;border-radius:20px;border:1px solid ${w?"var(--accent)":"var(--border)"};background:${w?"var(--accent-dim)":"transparent"};color:${w?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,h=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${d(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${d(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${d(j(a.neto))}</div><div class="stat-sub">${d(C)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${d(j(c))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${d(j(g))}</div><div class="stat-sub">${d(I)} · ${d(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${d(j(g-f))}</div><div class="stat-sub">${d(m)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${d(t._id)}|real" style="${b($==="real")}">Real</button>
          <button data-inv-modo="${d(t._id)}|proyeccion" style="${b($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${h}
      ${y}
    </div>`}function zl(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=vt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${d((vn[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${d(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
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
  </div>`}const Pl=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Fl(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
      ${te("ac-modelo","Tipo",Pl,a)}
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
    </div>`}function Tl(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Fl(e))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return k("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Rl(t,e,a,o,n){const s=m=>{var I;return((I=t.querySelector(m))==null?void 0:I.value)??""},i=(m,I=0)=>{const C=parseFloat(s(m));return Number.isFinite(C)?C:I},r=m=>{var I;return!!((I=t.querySelector(m))!=null&&I.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",g=u==="beneficio",c=i("#ac-saldo"),p={nombre:l,saldo:c,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(m=>m.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:g?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:g?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&c<=0)return{datos:p};if(!(o===null||Math.abs(c-o)>.005))return{datos:p};if(u==="inversion"&&c>(o??0)){const m=Date.now().toString(36);p.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${m}a`,fecha:a?n:p.fechaInicialSaldo??n,cantidad:c-(o??0)}]}return{datos:p,punto:{fecha:n,saldo:c,nota:a?"Actualización manual":"Saldo inicial"}}}function Ca(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:X(e.saldoCts),nota:e.nota}))}function Nl(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
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
    </div>`}const gn=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Ol(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Pt;function r(p,f){const m=o(),I=n();return!m||!I?null:(I.innerHTML=`<div class="modal-title">${d(p)}</div>${f}`,m.classList.remove("hidden"),R(I,"[data-cerrar]",s),I)}function l(){e=null;const p=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,C)=>I.año-C.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",m=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${f}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${d(gn(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${f}">
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
      </div>`);m&&(R(m,"[data-editar-tg]",I=>{const C=I.getAttribute("data-editar-tg");c(C==="default"?"default":Number(C))}),R(m,"[data-borrar-tg]",I=>{const C=Number(I.getAttribute("data-borrar-tg"));tt(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(x=>x.año!==C)),k(`Tabla ${C} eliminada`),t.onDatosCambiados(),l())}),R(m,"[data-anadir-anyo-tg]",()=>{var x;const I=parseInt(((x=m.querySelector("#tg-new-year"))==null?void 0:x.value)??"",10);if(!I||I<2e3||I>2100)return k("Año inválido","err");const C=t.store.get("tramosGananciasCapitalHistorico");if(C.some(v=>v.año===I))return k("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...C,{_id:Date.now().toString(36),año:I,tramos:i().map(v=>[...v])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([p,f],m)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${m}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${m}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${m}">✕</button>
          </div>
        </div>`).join("")}function g(p){a=[...p.querySelectorAll("[data-tg-min]")].map((f,m)=>{const I=p.querySelector(`[data-tg-pct="${m}"]`);return[parseFloat(f.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function c(p){var x;e=p;const f=t.store.get("tramosGananciasCapitalHistorico");a=(p==="default"?i():((x=f.find(v=>v.año===p))==null?void 0:x.tramos)??i()).map(v=>[...v]);const I=r(`Ganancias de capital — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const C=()=>{const v=I.querySelector("#tg-rows");v&&(v.innerHTML=u())};R(I,"[data-volver-tg]",l),R(I,"[data-tg-anadir]",()=>{g(I),a.push([0,0]),C()}),R(I,"[data-tg-borrar]",v=>{g(I),a.splice(Number(v.getAttribute("data-tg-borrar")),1),C()}),R(I,"[data-tg-guardar]",()=>{g(I);const v=[...a].sort((y,$)=>y[0]-$[0]);if(v.length===0)return k("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:v}),k("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(y=>y.año===e?{...y,tramos:v}:y)),k(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function ql(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=Va(s,i,r),u=s.targetAmount||0,g=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${d(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${d(j(l))} / ${d(j(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${g}%;background:${d(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((g,c)=>(g.prioridad||99)-(c.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(g=>a(g,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){R(s,"[data-ir-planner]",()=>e()),R(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(tt(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);k("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const Ll="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",kl=120;function Bl(t){const e=t.hoy??J,a=()=>{var S;return(S=t.onDatosCambiados)==null?void 0:S.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=S=>{var A;return((A=i().find(F=>F._id===S))==null?void 0:A.nombre)??S},l=S=>{var A;return((A=t.store.get("accounts").find(F=>F._id===S))==null?void 0:A.nombre)??S},u=()=>yt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??ht)(Number(e().slice(0,4))),g=()=>yt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??Pt),c=()=>g()(Number(e().slice(0,4))),p=S=>mo(t.store.get("expenses"),s(),t.store.get("loans"),S);function f(){const S=s(),A=t.store.get("accounts"),F=ce({loans:[],expenses:t.store.get("expenses").filter(L=>L.tipo==="transferencia"),accounts:A,config:{dashboardStart:S.dashboardStart,dashboardEnd:S.dashboardEnd,fechaReferencia:S.dashboardStart},nominas:[],resolverTramosGanancias:g()}),P=new Map,T=L=>{let q=P.get(L);return q||(q={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},P.set(L,q)),q},N=(L,q)=>{const B=`${q.sourceId}`,O=L.find(Y=>Y.concepto===B),H=O??{concepto:B,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(q.cuantia),H.ocurrencias+=1,O||L.push(H)};for(const L of F){if(!L.cuenta)continue;const q=T(L.cuenta);L.sourceType==="transfer-in"||L.sourceType==="traspaso-in"?(q.totalAportaciones+=Math.abs(L.cuantia),N(q.entradas,L)):L.sourceType==="transfer-out"||L.sourceType==="traspaso-out"?(q.totalReembolsos+=Math.abs(L.cuantia),N(q.salidas,L)):L.sourceType==="investment-tax"&&(q.retencion+=Math.abs(L.cuantia))}const D=t.store.get("expenses");for(const L of P.values())for(const[q,B]of[[L.entradas,"cuenta"],[L.salidas,"cuentaDestino"]])for(const O of q){const H=D.find(Y=>Y._id===O.concepto);O.contraparte=l((H==null?void 0:H[B])??"default"),O.concepto=(H==null?void 0:H.concepto)||(B==="cuenta"?"Aportación":"Reembolso")}return P}function m(){const S=new Map,A=s(),F=e(),P=new Date(Number(F.slice(0,4)),Number(F.slice(5,7))-1+kl+1,0),T=`${P.getFullYear()}-${String(P.getMonth()+1).padStart(2,"0")}-${String(P.getDate()).padStart(2,"0")}`;return N=>{const D=S.get(N._id);if(D)return D;const L=ce({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...A,dashboardStart:F,dashboardEnd:T,fechaReferencia:F},filtroAccounts:[N._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:yt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??ht),resolverTramosGanancias:g()}).map(q=>({fecha:q.fecha,saldoAcum:q.saldoAcum}));return S.set(N._id,L),L}}const I=ql({store:t.store,colchonEnFecha:p,extractoCuenta:S=>C(S),hoy:e,onDatosCambiados:a});let C=m();function x(S){C=m();const F=t.store.get("accounts").filter(D=>vt(D)!=="pension"),P=f(),T={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:c(),nombreEscenario:r,flujos:D=>P.get(D)??Sl,invModo:D=>n.get(D)??"proyeccion"};S.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Cl(F,T.tramosGanancias)}
      <div class="grid-3">${F.map(D=>zl(D,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const N=S.querySelector("#goals-section");N&&I.render(N)}const v=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),$=()=>{var S;return(S=v())==null?void 0:S.classList.add("hidden")};function b(S,A){const F=v(),P=y();return!F||!P?null:(P.innerHTML=S?`<div class="modal-title">${d(S)}</div>${A}`:A,F.classList.remove("hidden"),R(P,"[data-cancelar]",$),P)}function h(S,A){const F=S?t.store.get("accounts").find(D=>D._id===S)??null:null,P=[...(F==null?void 0:F.planAportaciones)??[]].map(D=>({...D})),T=F?w(F):null,N=b(S?"Editar cuenta / fondo":"Nueva cuenta / fondo",Dl(F,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));N&&(Tl(N,P,e()),R(N,"[data-guardar-acc]",D=>{const L=D.getAttribute("data-guardar-acc")||"",{datos:q,punto:B,error:O}=Rl(N,P,F,T,e());if(O)return k(O,"err");let H=L;L?t.store.updateItem("accounts",L,q):H=t.store.addItem("accounts",q)._id,B&&t.ledger.registrarPuntoControl(H,B.fecha,B.saldo,B.nota),k(L?"Actualizada":"Cuenta / fondo creado"),a(),$(),A()}))}function w(S){const A=t.ledger.puntosControl(S._id);return A.length>0?Ca(A)[0].saldo:S.saldo??null}function M(S,A){const F=t.store.get("accounts").find(N=>N._id===S);if(!F)return;const P=b("Histórico de saldos",Nl(F.nombre,S,Ca(t.ledger.puntosControl(S)),F.saldoInicial||0,e()));if(!P)return;const T=()=>{A(),M(S,A)};R(P,"[data-hist-anadir]",()=>{var q,B,O;const N=((q=P.querySelector("#hi-fecha"))==null?void 0:q.value)??"",D=parseFloat(((B=P.querySelector("#hi-saldo"))==null?void 0:B.value)??""),L=((O=P.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!N||!Number.isFinite(D))return k("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(S,N,D,L||void 0),k("Punto añadido"),a(),T()}),R(P,"[data-hist-borrar]",N=>{const[,D]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(D),k("Eliminado"),a(),T()}),R(P,"[data-hist-inicial]",N=>{const[D,L]=(N.getAttribute("data-hist-inicial")||"").split("|"),q=t.ledger.puntosControl(D).find(O=>O._id===L);if(!q)return;const B=Ca([q])[0].saldo;t.store.updateItem("accounts",D,{saldoInicial:B,fechaInicialSaldo:q.fecha}),k(`Punto inicial → ${q.fecha} (${j(B)})`),a(),T()})}function E(S){const A=t.store.get("accounts").filter(T=>T.activo);if(A.length===0)return k("No hay cuentas activas","err");const F=e(),P=A.map(T=>`• ${T.nombre}: ${j(w(T)??T.saldoInicial??0)}`).join(`
`);if(tt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${F})?

${P}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of A)t.store.updateItem("accounts",T._id,{saldoInicial:w(T)??T.saldoInicial??0,fechaInicialSaldo:F});k("Saldo base actualizado"),a(),S()}}function _(S,A,F){R(S,"[data-nueva-acc]",()=>h(null,A)),R(S,"[data-editar-acc]",P=>h(P.getAttribute("data-editar-acc"),A)),R(S,"[data-tramos-ganancias]",()=>F.abrir()),R(S,"[data-reset-base]",()=>E(A)),R(S,"[data-hist-acc]",P=>M(P.getAttribute("data-hist-acc"),A)),R(S,"[data-principal-acc]",P=>{const T=P.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===T}))),k("Cuenta marcada como principal"),a(),A()}),R(S,"[data-borrar-acc]",P=>{const T=P.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return k("Debe existir al menos una cuenta","err");if(!tt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const D=t.store.get("accounts");D.length>0&&!D.some(L=>L.esCuentaPrincipal)&&t.store.set("accounts",D.map((L,q)=>q===0?{...L,esCuentaPrincipal:!0}:L)),k("Cuenta eliminada"),a(),A()}),R(S,"[data-inv-modo]",P=>{const[T,N]=(P.getAttribute("data-inv-modo")||"").split("|");n.set(T,N==="real"?"real":"proyeccion"),A()}),I.wire(S,A)}let z=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Ll,mount(S){const A=()=>x(S);z??(z=Ol({store:t.store,onDatosCambiados:()=>{a(),A()},año:()=>Number(e().slice(0,4))})),x(S),S.dataset.wired!=="1"&&(_(S,A,z),S.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
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
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${d(t)}</div><div class="stat-value ${a}">${d(e)}</div></div>`,It=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${d(t)}</span><span class="num ${a}">${d(e)}</span></div>`;function Vl(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Gl("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Vt(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const g=u.costBase>0?u.plusvalia/u.costBase*100:0,c=(l.escenarioIds||[]).map(p=>`<span class="badge badge-yellow">🔭 ${d(a(p))}</span>`).join("");return`
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
            ${ct(`Plusvalía latente (${g>=0?"+":""}${g.toFixed(1)}%)`,j(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
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
    </div>`}function Ul(t){const{nominas:e,planes:a,tramos:o}=t,n=f=>f.grupoNomina?e.filter(m=>(m.grupoNomina||"")===f.grupoNomina):null,s=e.map(f=>({n:f,d:aa(f,n(f),o)})),i=s.reduce((f,m)=>f+m.d.brutoAnual,0),r=s.reduce((f,m)=>f+m.d.irpfAnual,0),l=s.reduce((f,m)=>f+m.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:f,d:m})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${d(f.nombre)}</div>
          ${It("Bruto anual",j(m.brutoAnual))}
          ${m.flexAnual>0?It("− Retribución flexible exenta",j(-m.flexAnual),"pos"):""}
          ${It("− Cotización SS",j(-m.ssAnual),"neg")}
          ${It(`− IRPF estimado (${m.irpfPct.toFixed(1)} %)`,j(-m.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${d(j(m.baseDineraria-m.ssAnual-m.irpfAnual))}</span>
          </div>
        </div>`).join(""),g=Qa(e,o),c=`${t.hoy.slice(0,4)}-01-01`,p=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(f=>{const m=Me(f);if(!m)return"";const I=(f.aportaciones||[]).filter(y=>y.fecha>=c).reduce((y,$)=>y+$.cantidad,0),x=Math.min(I,Dt)*g/100,v=I>Dt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${d(f.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${It("Valor actual",j(m.saldo))}
          ${It("Coste base (total aportado)",j(m.costBase))}
          ${It("Revalorización",j(m.beneficio),m.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${d(t.hoy.slice(0,4))}</div>
            ${It("Aportado",`${j(I)}${v?" ⚠":""}`,v?"neg":"")}
            ${It("Límite deducible",j(Dt))}
            ${It(`Ahorro IRPF est. (marginal ${g} %)`,j(x),"pos")}
            ${v?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${d(j(Dt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${m.proxDesbloqueo?`· Próx. desbloqueo: ${d(m.proxDesbloqueo)}`:""}
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
    </div>`}const Re=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
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
        ${Re("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${Re("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${Re("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${Re("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const yn=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Jl="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Wl(t){const e=t.hoy??J;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(v=>v.activo),r=()=>t.store.get("accounts").filter(v=>(v.modeloFondo||"cuenta")==="pension"),l=v=>{var y;return((y=t.store.get("escenarios").find($=>$._id===v))==null?void 0:y.nombre)??v},u=()=>yt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??ht)(s()),g=()=>yt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??Pt)(s());function c(){const v=`${s()}-01-01`,y=t.store.get("nominas").filter(h=>h.activo&&!h.simulacion),$=r().reduce((h,w)=>h+(w.aportaciones||[]).filter(M=>M.fecha>=v).reduce((M,E)=>M+E.cantidad,0),0),b=t.store.get("expenses").filter(h=>h.activo&&h.sujetoIRPF&&h.tipo==="ingreso").reduce((h,w)=>h+Xa(w),0);return to({nominas:y,aportacionesPension:$,otrosIngresos:b,extras:o,tramosGeneral:u(),tramosAhorro:g()})}function p(){const v=u(),y=i(),$=A=>A.grupoNomina?y.filter(F=>(F.grupoNomina||"")===A.grupoNomina):null,b=y.map(A=>aa(A,$(A),v)),h=b.reduce((A,F)=>A+F.brutoAnual,0),w=b.reduce((A,F)=>A+F.irpfAnual,0),M=b.reduce((A,F)=>A+F.ssAnual,0),E=t.store.get("accounts").filter(A=>(A.modeloFondo||"cuenta")==="inversion");let _=0,z=0;for(const A of E){const F=Vt(A,g());F&&(_+=F.plusvalia,z+=F.impuesto)}if(h<=0&&E.length===0)return"";const S=(A,F,P)=>`<div class="exec-item"><div class="exec-item-label">${d(A)}</div><div class="exec-item-val ${P}">${d(F)}</div></div>`;return`<div class="exec-summary mb-14">
      ${h>0?S("IRPF trabajo",`${j(w)}/año`,"neg"):""}
      ${h>0?S("Neto trabajo",`${j(h-M-w)}/año`,"pos"):""}
      ${E.length>0?S("Plusvalía latente",j(_),_>=0?"pos":"neg"):""}
      ${E.length>0?S("Imp. potencial (inversión)",j(z),"neg"):""}
    </div>`}function f(){return a==="mobiliario"?Vl(t.store.get("accounts"),g(),l):a==="trabajo"?Ul({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?Yl():Hl({año:s(),extras:o,declaracion:c(),nominas:i().map(v=>({nombre:v.nombre,bruto:v.bruto||0})),planes:r().map(v=>v.nombre)})}function m(v,y){const $=a===v;return`<button data-tab-fisc="${v}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${$?"600":"400"};
      color:${$?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${$?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${d(y)}</button>`}function I(v){const y=v.querySelector("#fisc-tabs"),$=v.querySelector("#fisc-tab-content");y&&(y.innerHTML=yn.map(([b,h])=>m(b,h)).join("")),$&&($.innerHTML=f())}function C(v){v.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${p()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${yn.map(([y,$])=>m(y,$)).join("")}
      </div>
      <div id="fisc-tab-content">${f()}</div>`}function x(v){R(v,"[data-tab-fisc]",y=>{a=y.getAttribute("data-tab-fisc")||"declaracion",I(v)}),v.addEventListener("input",y=>{var w;if(!((w=y.target)==null?void 0:w.closest("[data-rex]")))return;const b=M=>{var E;return((E=v.querySelector(`#${M}`))==null?void 0:E.value)??"0"};o={capInmobiliario:parseFloat(b("rex-inmobiliario"))||0,capMobiliario:parseFloat(b("rex-mobiliario"))||0,gananciasFondos:parseFloat(b("rex-ganancias"))||0,otrasCorto:parseFloat(b("rex-otras"))||0,retCapital:parseFloat(b("rex-ret-cap"))||0};const h=v.querySelector("#renta-cuadro");h&&(h.innerHTML=bn(c()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Jl,mount(v){C(v),v.dataset.wired!=="1"&&(x(v),v.dataset.wired="1")}}}const xn=()=>globalThis.Chart??null;function Kl(t,e){const a=xn();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${j(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>j(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Ql=()=>xn()!==null,kt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Xl="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Zl(t){const e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=h=>{var w;return h?((w=s().find(M=>M._id===h))==null?void 0:w.nombre)??h:"Base"};function r(h){const w=n(),M=Ya({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(h==null?void 0:h._id)??null),E=a.size>0?M.accounts.filter(A=>!a.has(A._id)):M.accounts,_=a.size>0?E.map(A=>A._id):null,z=h!=null&&h.fechaFin&&h.fechaFin>w.dashboardEnd?h.fechaFin:w.dashboardEnd;return{eventos:ce({loans:M.loans,expenses:M.expenses,accounts:E,config:{...w,dashboardEnd:z},filtroAccounts:_,nominas:M.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:yt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??ht),resolverTramosGanancias:yt(t.store.get("tramosGananciasCapitalHistorico"),w.tramosGananciasCapital??Pt)}),horizonte:z}}function l(h){const w=t.store.get("loans"),M=S=>(S.escenarioIds||[]).includes(h),E=[[w.filter(M).length,"préstamo","préstamos"],[w.flatMap(S=>S.amortizaciones||[]).filter(M).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(M).length,"gasto","gastos"],[t.store.get("accounts").filter(M).length,"cuenta","cuentas"],[t.store.get("nominas").filter(M).length,"nómina","nóminas"]],_=E.reduce((S,[A])=>S+A,0),z=E.filter(([S])=>S>0).map(([S,A,F])=>`${S} ${S===1?A:F}`).join(" · ");return{total:_,texto:z}}function u(h,w){const M=w===h._id,E=h.color||kt[0],{total:_,texto:z}=l(h._id);return`<div class="card mb-12" style="border-left:3px solid ${d(E)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${d(E)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${d(h.nombre)}</span>
        ${M?'<span class="badge badge-yellow">● Activo</span>':""}
        ${h.fechaFin?`<span class="badge badge-inactive">📅 ${d(h.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${M?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${d(h._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${d(h._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${d(h._id)}">✕</button>
        </div>
      </div>
      ${h.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${d(h.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${_===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${d(z)}</span>`}
      </div>
    </div>`}function g(h){const w=n().dashboardEnd,M=Je(r(null).eventos,w);return`
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
        <tbody>${h.map(_=>{const{eventos:z}=r(_),S=_.fechaFin||w,A=Je(z,S),F=A!==null&&M!==null?A-M:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d(_.color||kt[0])};margin-right:6px"></span>
            ${d(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${d(S)}</td>
          <td class="num" style="padding:6px 10px">${A!==null?d(j(A)):"—"}</td>
          <td class="num ${F===null?"":F>=0?"pos":"neg"}" style="padding:6px 10px">
            ${F===null?"—":`${F>=0?"+":""}${d(j(F))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function c(){const h=t.store.get("accounts");return h.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${h.map(M=>{const E=a.has(M._id);return`<button data-toggle-cuenta="${d(M._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${E?"var(--border)":"var(--accent)"};
          background:${E?"transparent":"rgba(99,102,241,0.1)"};
          color:${E?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${E?"text-decoration:line-through;":""}">${d(M.nombre)}</button>`}).join("")}
    </div>`}function p(){if(o){try{o.destroy()}catch{}o=null}}function f(h){const w=n(),M=r(null),E=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:Ye(M.eventos,w.dashboardStart,w.dashboardEnd)}];return h.forEach((_,z)=>{const{eventos:S,horizonte:A}=r(_);E.push({label:_.nombre,color:_.color||kt[z%kt.length],puntos:Ye(S,w.dashboardStart,A)})}),E}function m(h,w){p();const M=h.querySelector("#chart-comparacion");M&&(o=Kl(M,f(w)))}function I(h){p();const w=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])w.has(_)||a.delete(_);const M=s(),E=n().escenarioActivo||null;h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${E?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${d(i(E))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este supuesto</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${M.length===0?`<div class="card mb-14" style="padding:20px 24px">
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
             </div>`:`<div>${M.map(_=>u(_,E)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${c()}</div>
               ${Ql()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${g(M)}</div>`}`,M.length>0&&m(h,M)}const C=()=>document.getElementById("modal-overlay"),x=()=>document.getElementById("modal-content"),v=()=>{var h;return(h=C())==null?void 0:h.classList.add("hidden")};function y(h,w){const M=h?s().find(S=>S._id===h)??null:null,E=C(),_=x();if(!E||!_)return;const z=(M==null?void 0:M.color)||kt[0];_.innerHTML=`
      <div class="modal-title">${h?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${d((M==null?void 0:M.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${d((M==null?void 0:M.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${kt.map(S=>`<div data-color-esc="${S}" style="width:26px;height:26px;border-radius:50%;background:${S};cursor:pointer;
              border:2px solid ${S===z?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${d(z)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${d((M==null?void 0:M.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${d(h??"")}">${h?"Guardar cambios":"Crear escenario"}</button>
      </div>`,E.classList.remove("hidden"),R(_,"[data-cancelar]",v),R(_,"[data-color-esc]",S=>{const A=S.getAttribute("data-color-esc");_.querySelector("#esc-color").value=A;for(const F of _.querySelectorAll("[data-color-esc]"))F.style.border=F.getAttribute("data-color-esc")===A?"2px solid white":"2px solid transparent"}),R(_,"[data-guardar-esc]",S=>{const A=_.querySelector("#esc-nombre").value.trim();if(!A)return k("El nombre es obligatorio","err");const F={nombre:A,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||kt[0],descripcion:_.querySelector("#esc-desc").value.trim()},P=S.getAttribute("data-guardar-esc")||"";P?(t.store.updateItem("escenarios",P,F),k("Escenario actualizado")):(t.store.addItem("escenarios",F),k("Escenario creado")),e(),v(),w()})}function $(h,w){if(!tt("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const M=E=>E.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(z=>z!==h)}));t.store.set("loans",M(t.store.get("loans")).map(E=>({...E,amortizaciones:M(E.amortizaciones||[])}))),t.store.set("expenses",M(t.store.get("expenses"))),t.store.set("nominas",M(t.store.get("nominas"))),t.store.set("accounts",M(t.store.get("accounts"))),n().escenarioActivo===h&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",h),k("Escenario eliminado"),e(),w()}function b(h,w){R(h,"[data-nuevo-esc]",()=>y(null,w)),R(h,"[data-editar-esc]",M=>y(M.getAttribute("data-editar-esc"),w)),R(h,"[data-borrar-esc]",M=>$(M.getAttribute("data-borrar-esc"),w)),R(h,"[data-activar-esc]",M=>{const E=M.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:E}),k(`Escenario "${i(E)}" activado`),e(),w()}),R(h,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),k("Volviendo a la realidad base"),e(),w()}),R(h,"[data-toggle-cuenta]",M=>{const E=M.getAttribute("data-toggle-cuenta");a.has(E)?a.delete(E):a.add(E);const _=h.querySelector("#esc-pastillas");_&&(_.innerHTML=c());const z=s(),S=h.querySelector("#esc-comparativa");S&&(S.innerHTML=g(z)),m(h,z)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Xl,mount(h){const w=()=>I(h);I(h),h.dataset.wired!=="1"&&(b(h,w),h.dataset.wired="1")},unmount(){p()}}}const tc=1e-12,$n=t=>Math.abs(t)<tc,In=t=>t/12;function ec(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=In(o);if($n(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function ac(t,e){const a=In(e);return $n(a)?0:Math.round(t*a)}function An({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function wn(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function Ea(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const Sn=t=>Number(t.slice(0,4));function Ne(t){return t.rentaDeseada?An(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const oc={_id:"__sin_vehiculo__"};function Oe(t){var v,y,$;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(b=>[b._id,b])),o=[...t.objetivos].sort((b,h)=>b.prioridad-h.prioridad).map(b=>({def:b,objetivo:Ne(b),saldo:b.saldoActual,estado:Ne(b)>0&&b.saldoActual>=Ne(b)&&b.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(b.vehiculoId),aportadoEnAño:0,añoEnCurso:Sn(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const b of t.eventos){const h=n.get(b.fecha)??[];h.push(b),n.set(b.fecha,h)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,g=0,c=0;const p=[];for(let b=0;b<e;b++){const h=wn(t.fechaInicio,b),w=Sn(h);for(const D of n.get(h)??[])if(D.tipo==="CAMBIO_INGRESOS")l=D.importe;else if(D.tipo==="CAMBIO_GASTOS_FIJOS")u=D.importe;else if(D.tipo==="NUEVA_DEUDA")u+=D.importe;else if(D.tipo==="INYECCION_CAPITAL"){const L=D.objetivoDestinoId?o.find(q=>q.def._id===D.objetivoDestinoId):void 0;L?L.saldo+=D.importe:l+=D.importe}for(const D of o)D.añoEnCurso!==w&&(D.añoEnCurso=w,D.aportadoEnAño=0);const M=Math.max(0,l-u),E=Math.round(M*nc(t.pctDisfrute));let _=M-E;const z=_,S=o.filter(D=>D.estado!=="COMPLETADO"),A=[];let F=0;const P=S.filter(D=>D.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=S.filter(D=>D.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const D of T){const L=sc(D,h,b,t);D.ultimaSolicitud=L,L>0&&(D.solicitadoAcumulado+=L,D.mesesReclamando+=1),(D.def.modoAsignacion==="CUOTA_POR_FECHA"||D.def.modoAsignacion==="FIJO")&&(F+=L);const q=Math.max(0,Math.min(L,_));_-=q,D.saldo+=q,D.aportadoEnAño+=q,g+=q,q>0&&D.estado==="PENDIENTE"&&(D.estado="EN_CURSO"),A.push({objetivoId:D.def._id,asignado:q,solicitado:L,saldoTrasMes:D.saldo})}if(P.length>0&&_>0){const D=P.map(B=>Math.max(0,B.def.pesoResidual??1)),L=D.reduce((B,O)=>B+O,0)||P.length;let q=0;P.forEach((B,O)=>{const H=O===P.length-1?_-q:Math.floor(_*D[O]/L);q+=H,B.saldo+=H,B.aportadoEnAño+=H,g+=H,H>0&&B.estado==="PENDIENTE"&&(B.estado="EN_CURSO"),A.push({objetivoId:B.def._id,asignado:H,solicitado:0,saldoTrasMes:B.saldo})}),_-=q}else for(const D of P)A.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});F>z&&p.push({mes:h,deficit:F-z});for(const D of o)D.saldo<=0||(D.saldo+=ac(D.saldo,((v=D.vehiculo)==null?void 0:v.rentabilidadRealAnual)??0));for(const D of o)D.estado!=="COMPLETADO"&&(D.def.modoAsignacion==="ABSORBE_RESIDUAL"&&D.objetivo<=0||D.objetivo>0&&D.saldo>=D.objetivo&&(D.estado="COMPLETADO",i.push({objetivoId:D.def._id,nombre:D.def.nombre,mes:h,indice:b,importeFinal:D.saldo,cuotaLiberada:D.ultimaSolicitud})));for(const D of o)A.some(L=>L.objetivoId===D.def._id)||A.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});const N=o.reduce((D,L)=>D+L.saldo,0);if(c+=E,s.push({indice:b,mes:h,netoMensual:l,gastosFijos:u,sobrante:M,disfrute:E,disponible:z,sinAsignar:_,asignaciones:A.sort((D,L)=>Cn(o,D.objetivoId)-Cn(o,L.objetivoId)),patrimonioTotal:N}),o.length>0&&o.every(D=>D.estado==="COMPLETADO"))break}const f=[];if(p.length>0){const b=Math.round(p.reduce((h,w)=>h+w.deficit,0)/p.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${p.length} mes${p.length!==1?"es":""} (desde ${p[0].mes}). Déficit medio: ${(b/100).toFixed(2)} €/mes.`,mes:p[0].mes,deficitMensual:b});for(const h of o)h.estado!=="COMPLETADO"&&h.def.fechaLimite&&h.def.modoAsignacion==="CUOTA_POR_FECHA"&&(h.estado="INVIABLE");f.push(...rc(o,t,b))}for(const b of o){const h=(y=b.vehiculo)==null?void 0:y.topeAportacionAnual;h&&b.def.modoAsignacion==="FIJO"&&(b.def.importeFijoMensual??0)*12>h&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» pide ${((b.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(h/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const b of o)b.estado!=="COMPLETADO"&&b.objetivo>0&&b.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const m=o.find(b=>b.def.tipo==="INVERSION_PERPETUA"),I=m?i.find(b=>b.objetivoId===m.def._id):void 0,C={};for(const b of o){const h=(($=b.vehiculo)==null?void 0:$._id)??oc._id;C[h]=(C[h]??0)+b.saldo}const x={};for(const b of o)x[b.def._id]=b.estado;return{viable:p.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:ic(s,i),avisos:r,propuestas:f,estadoFinal:x,resumen:{patrimonioFinal:o.reduce((b,h)=>b+h.saldo,0),patrimonioPorVehiculo:C,totalAportado:g,totalDisfrute:c,mesIndependencia:(I==null?void 0:I.mes)??null}}}const nc=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Cn=(t,e)=>t.findIndex(a=>a.def._id===e);function sc(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),g=Math.min(r,u);return t.objetivo>0?Math.min(g,n):g}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?Ea(e,t.def.fechaLimite):o.horizonteMeses-a;return ec(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function ic(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const g of t[u].asignaciones)g.asignado>0&&l.add(g.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function rc(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),g=Math.max(1,Ea(e.fechaInicio,r.def.fechaLimite)),c=Math.max(1,u-a),p=Math.ceil(l/c),f=Math.max(1,p-g);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:f,mensaje:`Retrasar «${r.def.nombre}» ${f} mes${f!==1?"es":""}, hasta ${wn(r.def.fechaLimite,f)}, baja su cuota a lo que cabe en el flujo.`});const m=Math.min(Math.round(a*g),Math.max(0,r.objetivo-1));m>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:m,mensaje:`O reducir «${r.def.nombre}» en ${(m/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-m)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const lc=()=>globalThis.Chart??null,qe=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],Mn=new WeakMap;function cc(t,e,a){const o=lc();if(!o)return null;const n=Mn.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(f=>[f._id,f.vehiculoId])),r=new Set(e.objetivos.map(f=>f.vehiculoId));for(const f of r)s.set(f,[]);for(const f of a.serieMensual){const m=new Map;for(const I of f.asignaciones){const C=i.get(I.objetivoId);C&&m.set(C,(m.get(C)??0)+I.saldoTrasMes)}for(const I of r)s.get(I).push((m.get(I)??0)/100)}const l=f=>{var m;return((m=e.vehiculos.find(I=>I._id===f))==null?void 0:m.nombre)??"Sin vehículo"},u=[...r],g=u.map((f,m)=>a.serieMensual.map((I,C)=>u.slice(0,m+1).reduce((x,v)=>x+(s.get(v)[C]??0),0))),c=u.map((f,m)=>({label:l(f),data:g[m],borderColor:qe[m%qe.length],backgroundColor:`${qe[m%qe.length]}33`,fill:m===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),p=new o(t,{type:"line",data:{labels:a.serieMensual.map(f=>f.mes),datasets:c},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:f=>{const m=f.datasetIndex>0?f.chart.data.datasets[f.datasetIndex-1].data[f.dataIndex]??0:0;return` ${f.dataset.label}: ${j(f.parsed.y-m)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:f=>j(f)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return Mn.set(t,p),p}const _a=t=>j(t/100),dc={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},uc={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},En={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function pc(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(s=>{var i;return mc(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function mc(t,e,a,o){const n=Ne(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(c=>c.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(c=>c.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,g=e.avisos.filter(c=>c.objetivoId===t._id);return`
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

      ${g.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${g.map(c=>`⚠ ${d(c.mensaje)}`).join("<br>")}
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
    </div>`}function jn(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const Ac=(t,e)=>hc(t.calcular(e)),wc=[-2,-1,0,1,2],Sc=[-10,0,10],Cc=[-20,0,20];function zn(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Mc(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=zn(o),r=n?zn(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function Ec(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const _c=t=>t>0?`+${t}`:String(t);function ja(t,e,a,o,n,s){const i=Oe(t),r=n.map(l=>Mc(l===0?"Plan actual":`${_c(l)} ${s}`,l,l===0,l===0?i:Oe(Ec(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function jc(t){return[ja(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",wc,"puntos"),ja(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",Sc,"puntos"),ja(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Cc,"%")]}function zc(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const Pn=t=>j(t/100);function Pc(t,e,a){return`
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
      ${r.meses.map((l,u)=>{const g=r.diferencias[u],c=g===null||g===0?"var(--text2)":g<0?"var(--accent)":"var(--red)",p=u===0||g===null||g===0?"":`<div style="font-size:10px;color:${c}">${g>0?"+":""}${g} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${c}">
            ${d(l??"no llega")}${p}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${d(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${d(Pn(l.resumen.patrimonioFinal))}</div>
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
    ${t.map(Rc).join("")}
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
    </div>`}function Rc(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${d(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${d(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${d(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${d(zc(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${d(Pn(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const Ct=t=>j(t/100);function Nc(t,e,a=0){return`
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
  </div>`}const $e=60;function Bc(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((g,c)=>g.prioridad-c.prioridad),n=Math.ceil(e.serieMensual.length/$e),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*$e,(s+1)*$e),r=["Mes","Disponible",...o.map(g=>g.nombre),"Sin asignar","Patrimonio"].map(g=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${d(g)}</th>`).join(""),l=i.map(g=>{const c=o.map(p=>{const f=g.asignaciones.find(I=>I.objetivoId===p._id),m=(f==null?void 0:f.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${m>0?"var(--text)":"var(--text3)"}">${d(m>0?Ct(m):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${d(g.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${d(Ct(g.disponible))}</td>
        ${c}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${d(g.sinAsignar>0?Ct(g.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${d(Ct(g.patrimonioTotal))}</td>
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
  </div>`;function Jc(t,e,a){var l,u,g;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??Dn[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(c=>[c._id,c.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
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
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((g=t==null?void 0:t.rentaDeseada)==null?void 0:g.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
    </div>`}function Wc(t,e,a){var u;const o=g=>{var c;return((c=t.querySelector(`#${g}`))==null?void 0:c.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:ae(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:ae(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:ae(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:ae(o("ob-renta")),tasaRetiroSeguro:oe(o("ob-swr")),tipoFiscalEfectivo:oe(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Kc(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=An({rentaNetaMensual:ae(e("ob-renta")),tasaRetiroSeguro:oe(e("ob-swr")),tipoFiscalEfectivo:oe(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Qc(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
    </div>`}function Xc(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:oe(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:oe(a("ve-fiscal")),topeAportacionAnual:s?ae(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const Zc={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},td="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Tn=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Le=t=>(t/100).toFixed(2);function ed(t){const e=t.hoy??J;let a="config",o=null,n=0,s=null;function i(){const A=t.store.get("planes");return A.find(F=>F.activo)??A[0]??null}function r(){const A=i();return A||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(A){var P;const F=i();F&&(t.store.updateItem("planes",F._id,A),s=null,o=null,(P=t.onDatosCambiados)==null||P.call(t))}function u(){const F=t.store.get("nominas").filter(N=>N.activo).reduce((N,D)=>N+(D.bruto||0),0),P=Math.round(F*.75/12),T=t.store.get("expenses").filter(N=>N.activo&&N.basico&&N.tipo==="gasto").reduce((N,D)=>N+(D.cuantia||0),0);return{neto:Math.round(P*100),gastos:Math.round(T*100)}}function g(A){return s||(s=Oe(A)),s}function c(A){const F=u(),P=Math.max(0,A.perfil.netoMensual-A.perfil.gastosFijosMensuales),T=Math.round(A.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${d(Le(A.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${d(j(F.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${d(Le(A.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${d(j(F.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${T} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${T}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${d(j(Math.max(0,A.perfil.netoMensual-A.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${d(j(P*(1-A.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${d(A.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${d(A.horizonteMeses)}">
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

      ${p(A)}`}function p(A){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${d(A.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const f=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),I=()=>{var A;return(A=f())==null?void 0:A.classList.add("hidden")};function C(A,F){const P=f(),T=m();return!P||!T?null:(T.innerHTML=`<div class="modal-title">${d(A)}</div>${F}`,P.classList.remove("hidden"),T)}function x(A){l({objetivos:A})}function v(A,F){const P=i();if(!P)return;const T=F?P.objetivos.find(B=>B._id===F)??null:null,N=P.objetivos.reduce((B,O)=>Math.max(B,O.prioridad),0)+1,D=C(T?`Editar «${T.nombre}»`:"Nuevo objetivo",Jc(T,P.vehiculos,N));if(!D)return;const L=()=>{var Y;const B=(Y=D.querySelector("#ob-modo"))==null?void 0:Y.value,O=D.querySelector("#ob-modo-ayuda");O&&B&&(O.textContent=Zc[B]);const H=(K,Q)=>{const nt=D.querySelector(K);nt&&(nt.style.display=Q?"block":"none")};H("#ob-bloque-fijo",B==="FIJO"),H("#ob-bloque-residual",B==="ABSORBE_RESIDUAL")};L();const q=()=>{const B=D.querySelector("#ob-capital-derivado");B&&(B.textContent=Kc(D))};q(),U(D,"#ob-modo",L),U(D,"#ob-tipo",()=>{const B=D.querySelector("#ob-tipo").value,O=D.querySelector("#ob-modo");O&&(O.value=Dn[B]);const H=D.querySelector("#ob-bloque-perpetua");H&&(H.style.display=B==="INVERSION_PERPETUA"?"block":"none"),L()}),U(D,'input[name="ob-derivar"]',()=>{var Y;const B=((Y=D.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:Y.value)==="renta",O=D.querySelector("#ob-renta-campos"),H=D.querySelector("#ob-bloque-importe");O&&(O.style.display=B?"block":"none"),H&&(H.style.display=B?"none":"block"),q()}),U(D,"#ob-renta, #ob-swr, #ob-fiscal",q),R(D,"[data-ob-cancelar]",I),R(D,"[data-ob-guardar]",()=>{const B=Wc(D,T,N);if(!B){k("El objetivo necesita un nombre","err");return}if(!B.vehiculoId){k("Crea antes un vehículo donde meter el dinero","err");return}const O=P.objetivos.filter(H=>H._id!==B._id);x([...O,B]),I(),k(T?"Objetivo actualizado":`Objetivo «${B.nombre}» creado`),z(A)}),R(D,"[data-ob-borrar]",()=>{T&&tt(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(x(P.objetivos.filter(B=>B._id!==T._id)),I(),k("Objetivo borrado"),z(A))})}function y(A,F){const P=i();if(!P)return;const T=F?P.vehiculos.find(q=>q._id===F)??null:null,N=t.store.get("accounts").filter(q=>q.activo).map(q=>({_id:q._id,nombre:q.nombre})),D=t.store.get("loans").filter(q=>q.activo&&!q.simulacion).map(q=>({_id:q._id,nombre:q.nombre,tin:q.tin})),L=C(T?`Editar «${T.nombre}»`:"Nuevo vehículo",Qc(T,N,D));L&&(U(L,"#ve-deuda",()=>{const q=L.querySelector("#ve-deuda").checked,B=L.querySelector("#ve-bloque-prestamo");B&&(B.style.display=q?"block":"none")}),U(L,"#ve-prestamo",()=>{const q=L.querySelector("#ve-prestamo").value,B=D.find(Y=>Y._id===q);if(!B)return;const O=L.querySelector("#ve-rent"),H=L.querySelector("#ve-nombre");O&&(O.value=String(B.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${B.nombre}`)}),R(L,"[data-ve-cancelar]",I),R(L,"[data-ve-guardar]",()=>{const q=Xc(L,T);if(!q){k("El vehículo necesita un nombre","err");return}const B=P.vehiculos.filter(O=>O._id!==q._id);l({vehiculos:[...B,q]}),I(),k(T?"Vehículo actualizado":`Vehículo «${q.nombre}» creado`),z(A)}),R(L,"[data-ve-borrar]",()=>{if(!T)return;const q=P.objetivos.filter(B=>B.vehiculoId===T._id);if(q.length>0){k(`No se puede borrar: lo usan ${q.length} objetivo${q.length!==1?"s":""}`,"err");return}tt(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:P.vehiculos.filter(B=>B._id!==T._id)}),I(),k("Vehículo borrado"),z(A))}))}function $(A,F,P){const T=i();if(!T||F===P)return;const N=[...T.objetivos].sort((B,O)=>B.prioridad-O.prioridad),D=N.findIndex(B=>B._id===F),L=N.findIndex(B=>B._id===P);if(D<0||L<0)return;const[q]=N.splice(D,1);N.splice(L,0,q),x(N.map((B,O)=>({...B,prioridad:O+1}))),z(A)}function b(A){return A.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${A.vehiculos.map(F=>{const P=A.objetivos.filter(T=>T.vehiculoId===F._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${d(F._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${F.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${d(F.nombre)}${F.esDeuda?" 🔒":""}${F.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${d((F.rentabilidadRealAnual*100).toFixed(2))} % real · ${P} objetivo${P!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${A.vehiculos.some(F=>F.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function h(A,F,P){const T=i(),N=fc(F);if(!T||!N)return;const D=P?T.eventos.find(O=>O._id===P)??null:null,L={};N.id==="hijo"&&(L.actuales=T.perfil.gastosFijosMensuales),N.id==="subida-sueldo"&&(L.actual=T.perfil.netoMensual);const q=C(D?`Editar evento · ${N.nombre}`:N.nombre,Ic(N,D,T,L));if(!q)return;const B=()=>{const O=q.querySelector("#ev-resultado");O&&(O.textContent=Ac(N,jn(q,N)))};B();for(const O of N.campos)U(q,`#ev-${O.id}`,B);R(q,"[data-ev-cancelar]",I),R(q,"[data-ev-guardar]",()=>{var K,Q;const O=((K=q.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!O){k("El evento necesita un mes","err");return}const H=jn(q,N),Y={_id:(D==null?void 0:D._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:N.tipo,importe:N.calcular(H),objetivoDestinoId:((Q=q.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:N.resumir(H)};l({eventos:[...T.eventos.filter(nt=>nt._id!==Y._id),Y]}),I(),k(D?"Evento actualizado":"Evento añadido"),z(A)}),R(q,"[data-ev-borrar]",()=>{!D||!tt("¿Borrar este evento?")||(l({eventos:T.eventos.filter(O=>O._id!==D._id)}),I(),k("Evento borrado"),z(A))})}function w(A){var F;switch(A.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(F=A.notas)!=null&&F.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function M(){const A=i();if(!A)return;const F=new Blob([JSON.stringify(A,null,2)],{type:"application/json"}),P=URL.createObjectURL(F),T=document.createElement("a");T.href=P,T.download=`plan-${A.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(P),k("Plan exportado")}function E(A){const F=document.createElement("input");F.type="file",F.accept="application/json,.json",F.addEventListener("change",async()=>{var T,N;const P=(T=F.files)==null?void 0:T[0];if(P)try{const D=JSON.parse(await P.text());if(!D||!Array.isArray(D.objetivos)||!Array.isArray(D.vehiculos)||!D.perfil){k("Ese fichero no es un plan de objetivos","err");return}const L=`${D.nombre??"Importado"} (importado)`,q=t.store.addItem("planes",{...D,nombre:L,activo:!1,creadoEn:e()});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),k(`Plan «${q.nombre}» importado`),z(A)}catch(D){console.error("[Planner] Importación fallida:",D),k("No se ha podido leer el fichero","err")}}),F.click()}function _(A,F){switch(a){case"config":return c(A);case"objetivos":return pc(A,F);case"simulacion":return Nc(A,F,n);case"eventos":return xc(A);case"escenarios":return Pc(t.store.get("planes"),A._id,o)}}function z(A){const F=r(),P=g(F),T=(D,L)=>`<button class="period-btn ${a===D?"active":""}" data-pl-tab="${D}">${L}</button>`,N=P.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${N}</div>
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
             ${b(F)}`:""}

      <div id="pl-cuerpo">${_(F,P)}</div>`,a==="simulacion"){const D=A.querySelector("#pl-chart");D&&cc(D,F,P)}S(A)}function S(A){R(A,"[data-pl-tab]",P=>{a=P.dataset.plTab,z(A)}),U(A,"#pl-disfrute",P=>{const T=Number(P.value)/100,N=A.querySelector("#pl-pct-val");N&&(N.textContent=`${Math.round(T*100)} %`);const D=i();if(!D)return;const L=Math.max(0,D.perfil.netoMensual-D.perfil.gastosFijosMensuales)*(1-T),q=A.querySelector("#pl-disponible");q&&(q.textContent=j(L/100))}),R(A,"[data-pl-usar-sugerido]",()=>{const P=u(),T=A.querySelector("#pl-neto"),N=A.querySelector("#pl-gastos");T&&(T.value=Le(P.neto)),N&&(N.value=Le(P.gastos))}),R(A,"[data-pl-guardar]",()=>{const P=T=>{var N;return((N=A.querySelector(T))==null?void 0:N.value)??""};l({perfil:{netoMensual:Tn(P("#pl-neto")),gastosFijosMensuales:Tn(P("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(P("#pl-disfrute"))/100)),fechaInicio:P("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(P("#pl-horizonte"))||480))}),k("Plan guardado"),z(A)}),R(A,"[data-pl-plantilla]",P=>h(A,P.dataset.plPlantilla??"",null)),R(A,"[data-pl-editar-evento]",P=>{var D;const T=P.dataset.plEditarEvento??"",N=(D=i())==null?void 0:D.eventos.find(L=>L._id===T);N&&h(A,w(N),T)}),R(A,"[data-pl-duplicar]",()=>{var D;const P=i();if(!P)return;const T=window.prompt("Nombre del plan nuevo:",`${P.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const N=gc(P,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",N),(D=t.onDatosCambiados)==null||D.call(t),k(`Plan «${N.nombre}» creado. Actívalo para editarlo.`),z(A)}),R(A,"[data-pl-activar]",P=>{var N;const T=P.dataset.plActivar;if(T){for(const D of t.store.get("planes"))t.store.updateItem("planes",D._id,{activo:D._id===T});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),k("Plan activo cambiado"),z(A)}}),R(A,"[data-pl-renombrar]",P=>{var L;const T=P.dataset.plRenombrar,N=t.store.get("planes").find(q=>q._id===T);if(!N)return;const D=window.prompt("Nuevo nombre:",N.nombre);D!=null&&D.trim()&&(t.store.updateItem("planes",N._id,{nombre:D.trim()}),(L=t.onDatosCambiados)==null||L.call(t),z(A))}),R(A,"[data-pl-borrar-plan]",P=>{var L;const T=P.dataset.plBorrarPlan,N=t.store.get("planes").find(q=>q._id===T);if(!N||!tt(`¿Borrar el plan «${N.nombre}» con sus ${N.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",N._id);const D=t.store.get("planes");N.activo&&D.length>0&&t.store.updateItem("planes",D[0]._id,{activo:!0}),s=null,o=null,(L=t.onDatosCambiados)==null||L.call(t),k("Plan borrado"),z(A)}),R(A,"[data-pl-sensibilidad]",()=>{const P=i();P&&(o=jc(P),z(A))}),R(A,"[data-pl-pagina]",P=>{n=Number(P.dataset.plPagina)||0,z(A)}),R(A,"[data-pl-exportar]",M),R(A,"[data-pl-importar]",()=>E(A)),R(A,"[data-pl-nuevo-objetivo]",()=>v(A,null)),R(A,"[data-pl-nuevo-vehiculo]",()=>y(A,null)),R(A,"[data-pl-editar-vehiculo]",P=>y(A,P.dataset.plEditarVehiculo??null)),R(A,"[data-pl-editar-objetivo]",P=>v(A,P.dataset.plEditarObjetivo??null));let F=null;A.querySelectorAll("[data-pl-objetivo]").forEach(P=>{P.addEventListener("dragstart",()=>{F=P.dataset.plObjetivo??null,P.style.opacity="0.45"}),P.addEventListener("dragend",()=>{P.style.opacity="",A.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),P.addEventListener("dragover",T=>{T.preventDefault(),F&&P.dataset.plObjetivo!==F&&(P.style.borderTop="2px solid var(--accent)")}),P.addEventListener("dragleave",()=>{P.style.borderTop=""}),P.addEventListener("drop",T=>{T.preventDefault(),P.style.borderTop="";const N=P.dataset.plObjetivo;F&&N&&$(A,F,N),F=null})}),R(A,"[data-pl-csv]",()=>{const P=i();if(!P||!s)return;const T=new Blob(["\uFEFF"+Hc(P,s)],{type:"text/csv;charset=utf-8"}),N=URL.createObjectURL(T),D=document.createElement("a");D.href=N,D.download=`plan-${P.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,D.click(),URL.revokeObjectURL(N),k(`CSV exportado (${s.serieMensual.length} meses)`)}),R(A,"[data-pl-guardar-notas]",()=>{var P;l({notas:((P=A.querySelector("#pl-notas"))==null?void 0:P.value)??""}),k("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:td,mount:z}}function Rn(t,e,a=!1){const o=Math.abs(mt(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function ad(t){function e(y){return`${y}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(y={}){var b;const $=(b=y.texto)==null?void 0:b.trim().toLowerCase();return t.get("transacciones").filter(h=>!(y.cuentaId&&h.cuentaId!==y.cuentaId||y.desde&&h.fecha<y.desde||y.hasta&&h.fecha>y.hasta||y.tipo&&h.tipo!==y.tipo||y.estimacionId&&h.estimacionId!==y.estimacionId||y.tags&&y.tags.length>0&&!y.tags.some(w=>h.tags.includes(w))||$&&!h.concepto.toLowerCase().includes($))).sort((h,w)=>h.fecha.localeCompare(w.fecha)||h._id.localeCompare(w._id))}function o(y){const $={_id:e("tx"),fecha:y.fecha,cuentaId:y.cuentaId,importeCts:Rn(y.tipo,y.importe,y.negativo),concepto:y.concepto,tags:y.tags??[],estimacionId:y.estimacionId??null,tipo:y.tipo,origen:y.origen??"manual",...y.nota?{nota:y.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),$]),$}function n(y,$){t.set("transacciones",t.get("transacciones").map(b=>{if(b._id!==y)return b;const{importe:h,...w}=$,M={...b,...w};return h!==void 0&&(M.importeCts=Rn(M.tipo,h,M.importeCts<0)),M}))}function s(y){t.set("transacciones",t.get("transacciones").filter($=>$._id!==y))}function i(y,$){n(y,{estimacionId:$})}function r(y){return t.get("puntosControl").filter($=>!y||$.cuentaId===y).sort(($,b)=>$.fecha.localeCompare(b.fecha))}function l(y,$,b,h){const w={_id:e("pc"),fecha:$,cuentaId:y,saldoCts:mt(b),...h?{nota:h}:{}},M=t.get("puntosControl").filter(E=>!(E.cuentaId===y&&E.fecha===$));return t.set("puntosControl",[...M,w].sort((E,_)=>E.fecha.localeCompare(_.fecha))),g(y),w}function u(y){const $=t.get("puntosControl").find(b=>b._id===y);t.set("puntosControl",t.get("puntosControl").filter(b=>b._id!==y)),$&&g($.cuentaId)}function g(y){const $=r(y),b=t.get("accounts");b.some(h=>h._id===y)&&t.set("accounts",b.map(h=>h._id===y?{...h,historicoSaldos:$.map(w=>({_id:w._id,fecha:w.fecha,saldo:X(w.saldoCts),...w.nota?{nota:w.nota}:{}}))}:h))}function c(y,$=J()){const b=r(y).filter(E=>E.fecha<=$).pop(),h=b==null?void 0:b.fecha,w=(b==null?void 0:b.saldoCts)??0;return t.get("transacciones").filter(E=>E.cuentaId===y&&E.fecha<=$&&(h===void 0||E.fecha>h)).reduce((E,_)=>E+_.importeCts,w)}function p(y,$){return X(c(y,$))}function f(y=J(),$){const b=$??t.get("accounts").filter(h=>h.activo).map(h=>h._id);return X(b.reduce((h,w)=>h+c(w,y),0))}function m(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const y=[...t.get("transacciones").map($=>$.fecha),...t.get("puntosControl").map($=>$.fecha)];return y.length>0?y.sort().pop()??null:null}function C(y={}){return X(a(y).reduce(($,b)=>$+b.importeCts,0))}function x(y={}){const $=new Map;for(const b of a(y)){const h=b.fecha.slice(0,7);$.set(h,($.get(h)??0)+b.importeCts)}return new Map([...$.entries()].sort(([b],[h])=>b.localeCompare(h)).map(([b,h])=>[b,X(h)]))}function v(y={}){const $=new Map;for(const b of a(y))for(const h of b.tags.length>0?b.tags:["sin_tag"])$.set(h,($.get(h)??0)+b.importeCts);return new Map([...$.entries()].map(([b,h])=>[b,X(h)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:p,saldoCuentaCts:c,saldoTotal:f,tieneDatos:m,ultimaFecha:I,total:C,totalPorMes:x,totalPorTag:v}}function At(t){return t.trim().toLowerCase()}function od(t){function e(){const u=new Map,g=(c,p)=>{const f=At(c);if(!f)return;const m=u.get(f)??{tag:f,estimaciones:0,reales:0,total:0};m[p]+=1,m.total+=1,u.set(f,m)};for(const c of t.get("expenses"))for(const p of c.tags??[])g(p,"estimaciones");for(const c of t.get("transacciones"))for(const p of c.tags??[])g(p,"reales");return[...u.values()].sort((c,p)=>p.total-c.total||c.tag.localeCompare(p.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(g=>u==="estimaciones"?g.reales===0:g.estimaciones===0).map(g=>g.tag)}function n(u,g,c){const p=At(g),f=(u??[]).map(At);if(!f.includes(p))return u??[];const m=f.filter(I=>I!==p);return c===null?[...new Set(m)]:[...new Set([...m,At(c)])]}function s(u,g){const c=At(g);if(!c)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,c)}function i(u,g){let c=0;for(const p of u)At(p)!==At(g)&&(c+=l(p,At(g)).cambiados);return{cambiados:c}}function r(u){return l(u,null)}function l(u,g){let c=0;const p=t.get("expenses").map(w=>{const M=n(w.tags,u,g);return M!==w.tags&&(c+=1),M===w.tags?w:{...w,tags:M}});t.set("expenses",p);const f=t.get("transacciones").map(w=>{const M=n(w.tags,u,g);return M!==w.tags&&(c+=1),M===w.tags?w:{...w,tags:M}});t.set("transacciones",f);const m=t.get("loans").map(w=>{const M=n(w.tags,u,g);return M!==w.tags&&(c+=1),M===w.tags?w:{...w,tags:M}});t.set("loans",m);const I=t.get("nominas").map(w=>{const M=n(w.tags,u,g);return M!==w.tags&&(c+=1),M===w.tags?w:{...w,tags:M}});t.set("nominas",I);const C=t.get("config"),x=At(u),v=w=>{const M=(w??[]).map(At);if(!M.includes(x))return w??[];const E=M.filter(_=>_!==x);return g===null?[...new Set(E)]:[...new Set([...E,g])]},y={},$=v(C.activeTagsFilter),b=v(C.tagCategorias),h=v(C.tagGrupos);return $!==C.activeTagsFilter&&(y.activeTagsFilter=$),b!==C.tagCategorias&&(y.tagCategorias=b),h!==C.tagGrupos&&(y.tagGrupos=h),Object.keys(y).length>0&&t.patchConfig(y),{cambiados:c}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const nd=3;function Nn(t){return t<.005?0:t}function sd(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function id(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<nd)continue;const r=sd(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Nn(n),sigmaDeriva:Nn(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function On(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function rd(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),g=Math.max(0,(l-s)*12+(u-i)),c=On(e.sigmaMensual,g,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+c),abajo:W(r.saldoAcum-c)}})}function ld(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const za="financeapp_session",cd=["local","dropbox","firebase"];function dd(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!cd.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function ud({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(f){const m=n();if(m)try{f?m.setItem(za,JSON.stringify(f)):m.removeItem(za)}catch{}}function i(){const f=n();if(!f)return null;try{return dd(f.getItem(za))}catch{return null}}function r(){const f=i();return f?(a()-f.ultimoUso)/6e4:null}function l(){const f=e();if(!Number.isFinite(f)||f<=0||o())return!1;const m=r();return m!==null&&m>=f}function u(){const f=i();return f?l()?(s(null),null):f:null}function g(f){const m=a(),I={modo:f.modo,...f.email?{email:f.email}:{},...f.passphrase?{passphrase:f.passphrase}:{},creadaEn:m,ultimoUso:m};return s(I),I}function c(){const f=i();f&&s({...f,ultimoUso:a()})}function p(){s(null)}return{abrir:g,leer:u,tocar:c,cerrar:p,caducada:l,inactividadMinutos:r,get activa(){return u()!==null}}}const qn=["pointerdown","keydown","visibilitychange"];function pd({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const g of qn)s==null||s.addEventListener(g,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const g of qn)s==null||s.removeEventListener(g,r)}}return u}const md=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],fd="FinanceApp",vd=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Ln(t){return new Uint8Array(new ArrayBuffer(t))}const Pa="financeapp_bio_credencial",Fa="financeapp_bio_secreto",Da="financeapp_bio_ultimo_desbloqueo",kn="financeapp_bio_gracia_min",gd=5;function bd(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function ke(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function Be(t){const e=atob(t),a=Ln(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function hd(t){return ke(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function yd(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Be(e)}function Bn(t){return t.getClientExtensionResults()}function xd(t={}){const e=t.webauthn??bd(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(b=>crypto.getRandomValues(Ln(b)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function l(){const b=o==null?void 0:o.getItem(Pa);if(!b)return null;try{const h=JSON.parse(b);return typeof h.credencialId!="string"||typeof h.salt!="string"?null:h}catch{return null}}function u(){return l()!==null}async function g(b){const h=await a.importKey("raw",b,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:vd},h,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function c(b,h){const w=s(12),M=await a.encrypt({name:"AES-GCM",iv:w},b,new TextEncoder().encode(h));return`${ke(w)}:${ke(M)}`}async function p(b,h){const[w,M]=h.split(":"),E=Be(w),_=Be(M),z=await a.decrypt({name:"AES-GCM",iv:E},b,_);return new TextDecoder().decode(z)}async function f(b,h){var N,D;if(!b)throw new Error("No hay clave de cifrado que envolver.");const w=s(32),M=s(32),E=s(16),_=await e.create({publicKey:{challenge:M,rp:{name:fd},user:{id:E,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:w}}},timeout:6e4}});if(!_)throw new Error("No se ha podido crear la credencial biométrica.");const z=Bn(_);if(!((N=z.prf)!=null&&N.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let S=((D=z.prf.results)==null?void 0:D.first)??null;if(S||(S=await m(_.rawId,w)),!S)throw new Error("El sensor no ha devuelto material de cifrado.");const A=await g(S),F=await c(A,b),P={credencialId:hd(_.rawId),salt:ke(w),modo:h,creadaEn:n()},T=i();T.setItem(Pa,JSON.stringify(P)),T.setItem(Fa,F)}async function m(b,h){var M,E;const w=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:b,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:h}}},timeout:6e4}});return w?((E=(M=Bn(w).prf)==null?void 0:M.results)==null?void 0:E.first)??null:null}async function I(){const b=l();if(!b)throw new Error("No hay huella configurada en este dispositivo.");const h=o==null?void 0:o.getItem(Fa);if(!h)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const w=await m(yd(b.credencialId).buffer,Be(b.salt));if(!w)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const M=await g(w),E=await p(M,h);return x(),E}function C(){o==null||o.removeItem(Pa),o==null||o.removeItem(Fa),o==null||o.removeItem(Da)}function x(){o==null||o.setItem(Da,String(n()))}function v(){const b=o==null?void 0:o.getItem(kn);if(b==null)return gd;const h=Number(b);return Number.isFinite(h)&&h>0?h:0}function y(b){o==null||o.setItem(kn,String(Math.max(0,Math.floor(b)||0)))}function $(){if(!u())return!1;const b=v();if(b<=0)return!1;const h=o==null?void 0:o.getItem(Da),w=h?Number(h):NaN;return Number.isFinite(w)?n()-w<b*6e4:!1}return{disponible:r,registrada:u,leerCredencial:l,registrar:f,desbloquear:I,olvidar:C,marcarDesbloqueo:x,dentroDeGracia:$,graciaMinutos:v,configurarGracia:y}}function Hn(){if(typeof localStorage<"u"){const h=ii();h.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${h.join(", ")}`)}const t=bi(),e=t.activo(),a=fe(e),o=Do(localStorage,a),n=ui({adapter:o}),s=pi(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${pe})`),n.subscribe(h=>s.marcar(h));function r(){var w,M,E,_,z;const h=globalThis;(M=(w=h.FirebaseService)==null?void 0:w.isConnected)!=null&&M.call(w)&&((z=(_=(E=h.FirebaseService).uploadRegistroProyectos)==null?void 0:_.call(E))==null||z.catch(S=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",S instanceof Error?S.message:S)))}const l={listar:()=>t.listar(),activo:()=>t.listar().find(h=>h._id===e)??t.listar()[0],colecciones:Tt.filter(h=>h!=="config"),crear:h=>{const w=t.crear(h);return r(),w},renombrar:(h,w)=>{t.renombrar(h,w),r()},duplicar:(h,w)=>{const M=t.duplicar(h,w);return r(),M},eliminar:h=>{t.eliminar(h),r()},cambiarA:h=>t.establecerActivo(h),fusionarRemotos:h=>t.fusionarRemotos(h),importarDesde:(h,w)=>{const M=hi(localStorage,h,w),E=yi(M),_=[];for(const z of w){const S=E[z];if(!Array.isArray(S)||S.length===0)continue;const A=n.get(z);n.set(z,[...A,...S]),_.push(z)}return _.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:_}}},u=$i(n);Es(h=>u.isEnabled(h));const g=xd(),c=ud({autoLogoutMinutos:()=>{var w,M;const h=(M=(w=globalThis.State)==null?void 0:w.get)==null?void 0:M.call(w,"config");return Number((h==null?void 0:h.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>g.dentroDeGracia()}),p=ad(n),f=od(n),m=br(p),I=Xi(n),C=Yi({isEnabled:h=>u.isEnabled(h)}),x=qi({flags:u,rutasExtra:()=>C.flagPorRuta()}),v=Si({flags:u,onChange:()=>{var h,w;C.attachToShell(),x.apply(),(w=(h=globalThis.Router)==null?void 0:h.rerender)==null||w.call(h)}}),y=Fi({proyectos:l}),$=()=>{var w,M,E,_,z,S;const h=globalThis;if((M=(w=h.State)==null?void 0:w.load)==null||M.call(w),((_=(E=h.Router)==null?void 0:E.current)==null?void 0:_.call(E))==="dashboard")try{(S=(z=h.DashboardModule)==null?void 0:z.render)==null||S.call(z)}catch(A){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",A)}},b=Oi({store:n,onDatosCambiados:$});return C.register(Ur({store:n,onDatosCambiados:$})),C.register(ol({store:n,onDatosCambiados:$})),C.register(Il({store:n,onDatosCambiados:$})),C.register(Bl({store:n,ledger:p,mostrarObjetivos:()=>u.isEnabled("goals"),onDatosCambiados:$})),C.register(_r({ledger:p,tags:f,precision:m,adjuster:I,accounts:()=>n.get("accounts"),estimaciones:()=>n.get("expenses"),onDatosCambiados:$})),C.register(ed({store:n,onDatosCambiados:$})),C.register(Zl({store:n,onDatosCambiados:$})),C.register(Nr({store:n,onDatosCambiados:$})),C.register(Wl({store:n})),C.register(zr({store:n,onDatosCambiados:$})),{version:pe,core:ds,engine:{generarExtracto:ce,recomputarSaldoAcum:ms,saldoHoy:fs,sumarPorTags:uo,providers:{proyectarGastos:le,proyectarPrestamos:eo,proyectarTransferencias:ao,proyectarNominas:io,proyectarInteresesCuentas:no,proyectarAportaciones:oo,proyectarRetencionesFiscales:so,proyectarInflacionGastos:ro,proyectarPerdidaAhorro:lo},analysis:hs,margins:Is,avisos:Cs,optimizer:_s,dashboard:Hs},store:n,flags:u,featureRegistry:{all:zt,porGrupo:Lo},ui:{openFeatures:v.open,openProyectos:y.open,openPersonas:b.open,applyGating:x.apply,watchGating:()=>x.observar(),instalarDeshacer:()=>ki({store:n,rerender:()=>{var w,M,E,_;const h=globalThis;(M=(w=h.State)==null?void 0:w.load)==null||M.call(w),(_=(E=h.Router)==null?void 0:E.rerender)==null||_.call(E)}}),avisoGuardado:null,instalarBuscador:()=>Vi({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),escenarios:n.get("escenarios"),planes:n.get("planes"),goals:n.get("goals"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>C.routes(),navegar:h=>{var w,M;return(M=(w=globalThis.Router)==null?void 0:w.navigate)==null?void 0:M.call(w,h)}})},app:C,session:Object.assign(c,{vigilar:h=>pd({sesion:c,onCaducada:h}),opciones:md}),biometria:g,cambios:s,datos:{colecciones:Tt,snapshot:()=>To(o),aplicar:(h,{sellar:w=!0}={})=>{const E=mi(w?(_,z)=>o.set(_,z):(_,z)=>{const S=globalThis.StorageAdapter;S!=null&&S.setRestaurando?S.setRestaurando(_,z):o.set(_,z)},h);return n.load(),s.marcar("copia-restaurada"),E},faltantes:h=>fi(h),esVacioOPorDefecto:()=>vi(To(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:l,accounting:{ledger:p,tags:f,precision:m,adjuster:I,sugerirAjuste:ga,medirVariabilidad:id,bandaDeConfianza:rd,bandaAcumulada:On,describirBanda:ld}}}function $d(){try{const t=Hn();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const pt=typeof window<"u"?$d():null;if(pt){let t=!1;const e=()=>{var a,o;if(pt.app.attachToShell(),pt.ui.applyGating(),!t){t=!0,pt.ui.watchGating(),pt.ui.instalarDeshacer(),pt.ui.instalarBuscador();const n=globalThis,s=()=>{var l,u,g,c;return(u=(l=n.FirebaseService)==null?void 0:l.isConnected)!=null&&u.call(l)?n.FirebaseService:(c=(g=n.DropboxService)==null?void 0:g.isConnected)!=null&&c.call(g)?n.DropboxService:null};pt.ui.avisoGuardado=Ui({cambios:pt.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const l=s();if(!(l!=null&&l.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await l.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=pt.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>pt.ui.openProyectos())),(a=document.getElementById("btn-proyectos"))==null||a.addEventListener("click",()=>pt.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>pt.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return wt.bootstrap=Hn,Object.defineProperty(wt,Symbol.toStringTag,{value:"Module"}),wt}({});
//# sourceMappingURL=financeapp-core.js.map
