var FinanceAppBundle=function(ye){"use strict";function W(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function O(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function K(){return W(new Date)}function $e(t,a){return new Date(t,a+1,0).getDate()}function sa(t,a,e){return W(new Date(t,a,Math.min(e,$e(t,a))))}function se(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return W(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return sa(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),W(i)}return null}function ia(t,a){if(!a)return t;const e=O(t);return se(e.getFullYear(),e.getMonth(),a)??t}const Go=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Vo={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function xe(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${Vo[e]||e+"º"} ${Go[o]} del mes`}return t}function kt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Ot(t){const a=O(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),W(a)}function ra(t,a){const e=O(t);return e.setDate(e.getDate()+a),W(e)}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function V(t){return J(it(t))}function _(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ca(t){return(t||0).toFixed(2)+"%"}function wt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function la(t,a,e,o=0){const n=wt(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const d=n*(1-Math.pow(1+i,-e))/i-s,p=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),l=i-d/p;if(Math.abs(l-i)<1e-10){i=l;break}i=l}return(Math.pow(1+i,12)-1)*100}function da(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const d=O(o),p=a/100/12;let l=e,u=wt(c,a,l);const v=[...s].sort((b,x)=>b.fecha.localeCompare(x.fecha));let g=0;for(let b=1;b<=e*2&&c>.01;b++){const x=new Date(d);d.setMonth(d.getMonth()+1);const f=ia(W(x),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const A=v[g],I=A.cantidad*(n/100);if(c-=A.cantidad,c=Math.max(0,c),A.tipo==="plazo"?l=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(l=e-b+1,u=wt(c,a,l)),r.push({mes:"AMORT",fecha:A.fecha,cuota:0,interes:0,amortizacion:A.cantidad,comisionAmort:I,capitalPendiente:c,esAmortizacion:!0,simulacion:A.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*p,M=Math.min(u-h,c);if(c-=M,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:h,amortizacion:M,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),l--,l<=0||c<.01)break}return r}const ua=new Map;function X(t){var x;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=ua.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:d}=t,p=da(n,s,i,r,c||0,a,t),l=p.reduce((f,h)=>f+h.interes,0),u=p.reduce((f,h)=>f+h.comisionAmort,0),v=n*((d||0)/100),g=p.filter(f=>!f.esAmortizacion),b={cuota:wt(n,s,i),totalIntereses:l,tae:la(n,s,i,d||0),costoTotal:l+u+v,comAp:v,totalComAm:u,fechaFin:((x=g.slice(-1)[0])==null?void 0:x.fecha)||"",mesesReales:g.length,tabla:p};return ua.set(e,b),b}function pa(t){const a=X(t),e=X({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function gt(t,a,e){if(!t||t.length===0)return 1;const o=O(a),n=O(e);if(n<=o)return 1;const s=[...t].sort((c,d)=>c.year-d.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),d=s.filter(b=>b.year<=c),p=d.length>0?d[d.length-1]:s[0],l=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,g=kt(r,v);i*=Math.pow(1+l,g/365.25),r=v}return i}function ma(t,a,e,o=0){const n=O(a),s=O(e);if(s<=n)return o;const i=kt(n,s),r=t?[...t].sort((p,l)=>p.year-l.year):[];let c=0,d=new Date(n);for(;d<s;){const p=d.getFullYear(),l=new Date(p+1,0,1),u=l<s?l:s,v=kt(d,u),g=r.filter(f=>f.year<=p),b=g.length>0?g[g.length-1]:null,x=b!==null?b.tasa:o;c+=x*v,d=u}return i>0?c/i:o}function fa(t,a){return((1+t/100)/(1+a/100)-1)*100}function Uo(t,a,e,o){const n=gt(a,e,o);return n>0?t/n:t}function Yo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:d=0,cuotasHipoteca:p=0,gastosBasicos:l=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-d-v-l-u,b=g,x=c>0?b/c*100:null,f=r?d-p:d,h=c>0?f/c*100:null,M=c>0?d/c*100:null,A=c>0?(l+d+v)/c*100:null,I=c>0?u/c*100:null,$=(P,w,y)=>P===null?"neutral":P>=w?"verde":P>=y?"amarillo":"rojo",E=(P,w,y)=>P===null?"neutral":P<=w?"verde":P<=y?"amarillo":"rojo";return{ingresos:c,cuotas:d,cuotasHipoteca:p,gastosBasicos:l,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:x,dti:h,dtiTotal:M,excluyeHipoteca:r,pctNecesidades:A,pctDeseos:I,semAhorro:$(x,e,o),semDTI:E(h,n,s),semNecesidades:E(A,i[0],i[0]+15),semDeseos:E(I,i[1],i[1]+10),semAhorroRegla:$(x,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function vt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Bt(t,a){const e=we(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function we(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=e&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a)??null}function ga(t,a){let e="";for(const o of t){const n=we(o,a);n&&n.fecha>e&&(e=n.fecha)}return e}function Wo(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Ko(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function ie(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Jo(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function Qo(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Et(t,a,e){const o=it(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:J(o)}];const n=a.participantes.map(l=>l.personaId);if(a.modo==="partesIguales"){const l=Jo(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(l[v])}))}const s=a.participantes.map(l=>{const u=Math.max(0,l.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((l,u)=>l+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const l=o/i,u=s.map(g=>Math.round(g*l)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),n.map((g,b)=>({personaId:g,importe:J(u[b])}))}const c=o-i,{ids:d,cts:p}=Qo(n,s,c,e);return d.map((l,u)=>({personaId:l,importe:J(p[u])}))}function Ie(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Xo(t,a,e){const o=ie(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Ie(a.expenses,i.sourceId);for(const d of Et(r,c==null?void 0:c.repartoPago,o))s(d.personaId).pago+=d.importe;for(const d of Et(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).consumo+=d.importe}else if(i.sourceType==="loan"){const c=Ie(a.loans,i.sourceId);for(const d of Et(r,c==null?void 0:c.repartoPago,o))s(d.personaId).pago+=d.importe;for(const d of Et(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).consumo+=d.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Ie(a.nominas,i.sourceId);for(const d of Et(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).ingresos+=d.importe}}}return[...n.values()]}function Ce(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const It=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function va(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function bt(t,a){return va(t,a).baseImponible}function ba(t,a){return lt(t,a)/12}const Ht=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Se(t,a){if(!t||t<=0)return 0;const e=a||Ht;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,d=Math.min(n,c-i);if(!(d<=0)&&(o+=d*(r/100),n-=d,n<=0))break}return o}function re(t,a){if(rt(t)!=="inversion")return null;const e=vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=Se(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function Ae(t,a=new Date){var u;if(rt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=vt(t),n=W(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=s.reduce((v,g)=>v+g.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),d=r>0?i/r:0,p=Math.min(o,i+c*d),l=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:l,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function ha(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=vt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((d,p)=>d+p.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function Me(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(d=>(d.grupoNomina||"")===o&&d.activo!==!1).reduce((d,p)=>d+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((d,p)=>d[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[d,p]of i)if(s>=d)r=p;else break;return r}const Zo=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Ht,TRAMOS_IRPF_DEFAULT:It,agregarPorPersona:Xo,ajustarFechaPago:ia,ajustarPrecioReal:Uo,calcBaseImponibleTrabajo:bt,calcFactorInflacion:gt,calcFondoInversion:re,calcFondosPension:Ae,calcGananciasCapital:Se,calcIRPF:lt,calcImpuestoPension:ha,calcInflacionMediaAnual:ma,calcSaludFinanciera:Yo,calcTAE:la,calcTipoMarginalPension:Me,calcTipoRealFisher:fa,calcularReparto:Et,clampedDate:sa,cuotaMensual:wt,desgloseBaseTrabajo:va,diasEntre:kt,entradaSaldo:we,fechaUltimoSaldoConocido:ga,finDeSemana:Ot,formatEUR:_,formatLocalDate:W,formatPct:ca,fromCents:J,haySimulaciones:Ko,idPersonaPorDefecto:ie,labelDiaPago:xe,lastDayOfMonth:$e,modeloFondoDe:rt,parseLocalDate:O,personasImplicadas:Ce,resolverDiaEfectivo:se,resumenPrestamo:X,resumenPrestamoConAhorro:pa,retencionMensual:ba,roundMoney:V,saldoEnFecha:Bt,saldoRealCuenta:vt,sinSimulaciones:Wo,sumarDias:ra,tablaAmortizacion:da,toCents:it,todayISO:K},Symbol.toStringTag,{value:"Module"}));function Gt(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=O(i.fechaInicio||a.start),c=i.fechaFin?O(i.fechaFin):s,d=i.cuantia,p=l=>o.push({fecha:l,concepto:i.concepto,cuantia:d,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const l=Math.max(1,i.frecuencia||1);let u=r.getFullYear(),v=r.getMonth();const g=Math.ceil(240/l)+2;for(let b=0;b<g;b++){const x=se(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),M=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,M)))})(),f=O(x);if(f>s||f>c)break;f>=n&&f>=r&&p(x),v+=l,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const l=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/l);u=new Date(r.getTime()+v*l)}for(;u<=s&&u<=c;)p(W(u)),u=new Date(u.getTime()+l)}}return o}function ya(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function $a(t,a,e=null,o={accounts:[]}){const n=[],s=O(a.start),i=O(a.end),r=o.accounts||[],c=o.nominas||[],d=o.resolverTramosIRPF||(()=>It),p=o.resolverTramosGanancias||(()=>Ht),l=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=O(u.fechaInicio||a.start),g=u.fechaFin?O(u.fechaFin):i,b=x=>{const f=r.find(C=>C._id===(u.cuenta||"default")),h=r.find(C=>C._id===(u.cuentaDestino||"default")),M=rt(f),A=rt(h),I=M==="inversion"&&A==="inversion"||M==="pension"&&A==="pension",$=["transferencia",...I?["traspaso"]:[],...u.tags||[]],E=I?"traspaso-out":"transfer-out",P=I?"traspaso-in":"transfer-in",w=!e||e.length===0||e.includes(u.cuenta||"default"),y=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(w&&n.push({fecha:x,concepto:`Transf. → ${l(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:$,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:E}),y&&n.push({fecha:x,concepto:`Transf. ← ${l(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:$,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:P}),w&&!I&&f){if(M==="inversion"){const C=parseInt(x.slice(0,4)),S=re(f,p(C));if(S&&S.saldo>0&&S.plusvalia>0){const F=Math.min(1,u.cuantia/S.saldo),j=S.plusvalia*F*.19;j>.01&&n.push({fecha:x,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:j,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(M==="pension"){const C=d(parseInt(x.slice(0,4))),S=Me(f,c,C),F=ha(f,u.cuantia,S||void 0);if(F>0){const D=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${S}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:x,concepto:D,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const x=Math.max(1,u.frecuencia||1);let f=v.getFullYear(),h=v.getMonth();const M=Math.ceil(240/x)+2;for(let A=0;A<M;A++){const I=se(f,h,u.diaPago||"")||(()=>{const E=v.getDate(),P=new Date(f,h+1,0).getDate();return W(new Date(f,h,Math.min(E,P)))})(),$=O(I);if($>i||$>g)break;$>=s&&$>=v&&b(I),h+=x,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const x=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/x);f=new Date(v.getTime()+h*x)}for(;f<=i&&f<=g;)b(W(f)),f=new Date(f.getTime()+x)}}return n}function xa(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const d of c){if(!d.importe||d.importe<=0)continue;const p=O(d.fechaInicio||a.start),l=d.fechaFin?O(d.fechaFin):s,u=d.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),g=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",x=I=>{v&&o.push({fecha:I,concepto:`Aportación → ${i.nombre}`,cuantia:d.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:d._id,sourceType:"aportacion-out"}),g&&o.push({fecha:I,concepto:`Aportación ${i.nombre} (${d.periodicidad||"mensual"})`,cuantia:d.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:d._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[d.periodicidad||"mensual"]||1;let h=p.getFullYear(),M=p.getMonth();const A=Math.ceil(240/f)+2;for(let I=0;I<A;I++){const $=new Date(h,M+1,0).getDate(),E=W(new Date(h,M,Math.min(p.getDate(),$))),P=O(E);if(P>s||P>l)break;P>=n&&P>=p&&x(E),M+=f,M>=12&&(h+=Math.floor(M/12),M=M%12)}}}return o}function wa(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=O(a.start),r=O(a.end),c=s.periodoCobro||"mensual",d=c==="mensual",p=d?null:{diario:864e5,semanal:7*864e5}[c]||864e5,l=d?1/12:p/(365.25*864e5);let u=Bt(s,a.start);const v=o.filter(x=>x.cuenta===s._id).map(x=>({fecha:x.fecha,delta:x.tipo==="ingreso"?Math.abs(x.cuantia):-Math.abs(x.cuantia)})).sort((x,f)=>x.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const x=d?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),f=new Date(Math.min(x.getTime(),r.getTime()+1)),h=W(f);let M=0;for(;g<v.length&&v[g].fecha<h;)M+=v[g].delta,g++;const A=u,I=u+M,$=Math.max(0,(A+I)/2);u=I;const E=d?l:(f.getTime()-b.getTime())/(365.25*864e5),P=$*(Math.pow(1+s.interes/100,E)-1);P>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:P,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=x}}return n}function Ia(t,a,e,o=null){const n=[],s=a||It;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=ba(r,s),d={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Gt([d],e,o))}return n}const tn=[5,11,2,8],en={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ca(t,a,e=null,o=[],n=()=>It){const s=[],i=O(a.start),r=O(a.end),c=o.length>0,d={};for(const u of t){const v=u.grupoNomina||"";d[v]||(d[v]=[]),d[v].push(u)}for(const u of Object.keys(d))d[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||a.start,b=O(g),x=O(v);let f=0;for(let M=b.getFullYear();M<=x.getFullYear();M++){const A=new Date(M,u.mesActualizacionIPC-1,1);A>b&&A<=x&&f++}if(f===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*gt(o,g,h)}function l(u,v){const g=p(u,v),b=(u.retribucionFlexible||[]).reduce((C,S)=>C+(S.importe||0)*12,0),x=Math.max(0,g-b);if(u.irpfModo==="manual")return x*((u.irpfPct||0)/100);const f=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return lt(bt(g,b),f);const M=d[h].filter(C=>C.activo),A=M.reduce((C,S)=>C+p(S,v),0),I=M.reduce((C,S)=>C+(S.retribucionFlexible||[]).reduce((F,D)=>F+(D.importe||0)*12,0),0),$=Math.max(0,A-I),E=bt(A,I),P=Math.max(0,g-b),w=$>0?E*(P/$):0,y=M.filter(C=>C._id!==u._id&&(C.bruto||0)>(u.bruto||0)).reduce((C,S)=>{const F=(S.retribucionFlexible||[]).reduce((j,T)=>j+(T.importe||0)*12,0),D=Math.max(0,p(S,v)-F);return C+($>0?E*(D/$):0)},0);return lt(y+w,f)-lt(y,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=O(u.fechaInicio||a.start),x=u.fechaFin?O(u.fechaFin):r,f=h=>{const M=p(u,h),A=l(u,h),I=(u.retribucionFlexible||[]).reduce((F,D)=>F+(D.importe||0)*12,0),$=Math.max(0,M-I),E=(u.ssPct??6.35)/100,P=$*E,w=$/g,y=A/g,C=P/g,S=u.representacion==="simplificado"?w-C-y:w;s.push({fecha:h,concepto:u.nombre,cuantia:S,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(C>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:C,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),y>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:y,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const F of u.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${en[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${u._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),M=b.getDate();let A=b.getFullYear(),I=b.getMonth();for(let $=0;$<300;$++){const E=new Date(A,I+1,0).getDate(),P=new Date(A,I,Math.min(M,E));if(P>r||P>x)break;P>=i&&P>=b&&f(W(P)),I+=h,I>=12&&(A+=Math.floor(I/12),I=I%12)}}else{const h=g-12,M=b.getDate();let A=b.getFullYear(),I=b.getMonth();for(let P=0;P<300;P++){const w=new Date(A,I+1,0).getDate(),y=new Date(A,I,Math.min(M,w));if(y>r||y>x)break;y>=i&&y>=b&&f(W(y)),I++,I>=12&&(A++,I=0)}const $=Math.max(b.getFullYear(),i.getFullYear()),E=Math.min((u.fechaFin?x:r).getFullYear(),r.getFullYear());for(let P=$;P<=E;P++)for(const w of tn.slice(0,h)){const y=new Date(P,w,15);y>=i&&y<=r&&y>=b&&y<=x&&f(W(y))}}}return s}function Sa(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=O(e.start),r=O(e.end),c=K(),d=t.filter(l=>l.activo&&l.tipo==="gasto"&&l.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const l=p.getFullYear(),u=p.getMonth(),v=l+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=W(new Date(l,u+1,0)),x=W(new Date(l,u,15));let f=0;for(const h of d){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const M=h.fechaInicio||c,A=gt(a,M,x);if(A<=1)continue;const I=Math.max(1,h.frecuencia||1);f+=h.cuantia*(A-1)/I}f>.01&&s.push({fecha:x,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(l,u+1,1)}return s}function Aa(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=O(e.start),i=O(e.end),r=[...a].sort((d,p)=>d.year-p.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const d=c.getFullYear(),p=c.getMonth(),l=d+"-"+String(p+1).padStart(2,"0"),u=W(new Date(d,p,15)),v=r.filter(h=>h.year<=d),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,x=Math.pow(1+b,1/12)-1,f=t*x;f>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+l,sourceType:"inflacion"}),c=new Date(d,p+1,1)}return n}function Ma(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,n=t.reduce((i,r)=>i+Bt(r,o),0),s=ga(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function Ea(t,a,e){const{fecha:o,saldo:n}=Ma(a,e),s=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=n;for(const p of[...s].reverse()){const l=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:l,saldoAcum:c}),c-=l}const d=[];c=n;for(const p of i){const l=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=l,d.push({...p,delta:l,saldoAcum:c})}return[...r,...d]}function an(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ea([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Pa(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(x=>x.activo&&(!s||s.length===0||s.includes(x._id))),d=Ma(c,n),p={start:d.fecha<n.dashboardStart?d.fecha:n.dashboardStart,end:n.dashboardEnd},l=e.filter(x=>x.tipo!=="transferencia"),u=e.filter(x=>x.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Gt(l,p,s)),g=g.concat(ya(a,p,s)),g=g.concat($a(u,p,s,v)),g=g.concat(xa(o,p,s));const b=wa(o,p,s,g);if(g=g.concat(b),g=g.concat(Ia(e,n.tramos_irpf,p,s)),g=g.concat(Ca(i,p,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const x=(o.find(M=>M.activo&&M.esCuentaPrincipal)||o.find(M=>M.activo)||{_id:"default"})._id;g=g.concat(Sa(l,r,p,s,x));const h=o.filter(M=>M.activo&&(!s||s.length===0||s.includes(M._id))).reduce((M,A)=>M+Bt(A,n.dashboardStart),0);g=g.concat(Aa(h,r,p,x))}return g.sort((x,f)=>x.fecha.localeCompare(f.fecha)),Ea(g,c,n).filter(x=>x.fecha>=n.dashboardStart)}function on(t,a,e=null){const o=K(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function _a(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function nn(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${_(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${_(i)} < ${_(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${_(i)})`})))}return e}function sn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=O(a.dashboardStart),n=O(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function rn(t,a,e=K()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",d={};c&&c<=e&&(d[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(d[p.fecha]=p.saldo);return Object.keys(d).forEach(p=>o.add(p)),d}),s={};for(const r of[...o].sort()){let c=0;for(let d=0;d<a.length;d++){const p=Object.entries(n[d]).filter(([l])=>l<=r);p.length>0?(p.sort(([l],[u])=>u.localeCompare(l)),c+=p[0][1]):c+=a[d].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([d],[p])=>d.localeCompare(p))){const d=t.filter(v=>v.fecha<=r),p=d.length>0?d[d.length-1].saldoAcum:null;if(p===null)continue;const l=c-p,u=p!==0?l/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:l,pct:u})}return i}const cn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:rn,detectarPuntosCriticos:nn,mediaMensualGastos:sn},Symbol.toStringTag,{value:"Module"}));function Vt(t,a=new Date){const e=W(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Gt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function ln(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+wt(e.capital,e.tin,e.meses),0)}function dn(t,a){return X(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Fa(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+wt(n.capital,n.tin,n.meses)*Math.min(a,dn(n,e)),0)}function Da(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Vt(t,o),s=a.colchonMeses||6;return n*s+Fa(e,s,W(o))}function un(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((d,p)=>d.fecha.localeCompare(p.fecha)).filter(d=>d.fecha<=o).pop();if(!i)return Da(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Vt(t,n),c=i.meses||6;return r*c+Fa(e,c,o)}function Ee(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((p,l)=>p.fecha.localeCompare(l.fecha)),c=r.filter(p=>p.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Vt(a,i)+ln(o))*(c.meses||1):0}function pn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function mn(t,a){const e={};for(const o of a)e[o._id]=vt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=pn(o)),{fecha:o.fecha,saldos:{...e}}))}function fn(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(d=>d.activo!==!1)){let d=!1;for(let p=0;p<a.length;p++){const l=a[p],u=Ee(c,o,n,s,l.fecha,!1,i);if(u<=0){d=!1;continue}const v=!c.cuentas||c.cuentas.length===0?l.saldoAcum:c.cuentas.reduce((g,b)=>{var x,f;return g+(((f=(x=e[p])==null?void 0:x.saldos)==null?void 0:f[b])||0)},0);v<u&&!d?(d=!0,r.push({tipo:"bajo_margen",fecha:l.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${_(v)} < ${_(u)} desde ${l.fecha}`})):v>=u&&d&&(d=!1,r.push({tipo:"recuperacion_margen",fecha:l.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${l.fecha}`}))}}return r}const gn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Da,calcColchonEnFecha:un,calcGastoBasicoMensual:Vt,calcMargenEnFecha:Ee,detectarCrucesMargenes:fn,saldosPorCuentaEnExtracto:mn},Symbol.toStringTag,{value:"Module"}));function vn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Ta(t,a){return kt(O(t),O(a))}const bn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function za(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${bn[o-1]}${s?"":` de ${e}`}`}function ja(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function hn(t,a={}){const{hoy:e=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const l of t.puntosCriticos??[])l.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${_(l.saldo)}.`}):l.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${_(l.saldo)}, por debajo del colchón.`});for(const l of t.crucesMargenes??[])l.tipo==="bajo_margen"&&r.push({id:`margen:${l.nombre}`,gravedad:"aviso",fecha:l.fecha,distancia:Math.max(0,l.target-l.saldo),titulo:u=>u?`Podrías bajar de «${l.nombre}»`:`Bajas de «${l.nombre}»`,detalle:u=>`El ${u} tendrías ${_(l.saldo)}, y el margen pide ${_(l.target)}.`});const c=new Map;for(const l of r){const u=c.get(l.id);(!u||l.fecha<u.fecha)&&c.set(l.id,l)}const d=[];for(const l of c.values()){const u=Ta(e,l.fecha);if(u<0||u>(l.gravedad==="critico"?o:n))continue;const v=i?i(u):0,g=v>0&&l.distancia<v;d.push({id:l.id,gravedad:l.gravedad,fecha:l.fecha,dias:u,plazo:ja(u),titulo:l.titulo(g),detalle:l.detalle(za(l.fecha,e)),incierto:g})}const p={critico:0,aviso:1};return d.sort((l,u)=>l.fecha.localeCompare(u.fecha)||p[l.gravedad]-p[u.gravedad]),d.slice(0,s)}const yn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:vn,construirAvisos:hn,describirPlazo:ja,diasEntreISO:Ta,fechaEnPalabras:za},Symbol.toStringTag,{value:"Module"})),$n=30.44*864e5;function qa(t){const a=t.getFullYear(),e=t.getMonth();return{desde:W(new Date(a,e,1)),hasta:W(new Date(a,e,$e(a,e)))}}function Na(t){const[a,e]=t.split("-").map(Number);return qa(new Date(a,e-1,1))}function xn(t,a){return Math.max(1,(O(a).getTime()-O(t).getTime())/$n)}const wn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),ht=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function In(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Cn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=a.loanIdsIniciados,s=ht(t.filter(u=>u.tipo==="ingreso")),i=ht(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=ht(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=ht(t.filter(u=>u.sourceType==="loan-amort")),d=ht(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:l}=In(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:l/e,gastosTotales:(i+p+l)/e,intereses:d/e}}function Ra(t,a){return t.reduce((e,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Sn(t,a,e,o){const n=t.filter(d=>d.activo&&!d.simulacion&&(d.fechaInicio||"")<=e),s=n.reduce((d,p)=>{if((p.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return d;const u=X(p).totalIntereses,v=X({...p,amortizaciones:(p.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return d+Math.max(0,v-u)},0),i=n.filter(d=>d.mostrarFechaFinEnDashboard!==!1).map(d=>({loan:d,fechaFin:X(d).fechaFin})).filter(d=>!!d.fechaFin&&d.fechaFin>=a&&d.fechaFin<=e),r=n.map(d=>X(d).tabla),c=d=>{const{desde:p,hasta:l}=Na(d);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=l);return u+(g?g.cuota:0)},0)};return{deudaInicio:Ra(n,a),deudaFin:Ra(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function An(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:ht(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function La(t,a=new Set,e="desglosado"){if(a.size===0)return _a(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(d=>a.has(d)),r=s.filter(d=>!a.has(d)),c=e==="porgrupos"&&i.length>0?i:r;for(const d of c)o.set(d,(o.get(d)||0)+Math.abs(n.cuantia))}return o}function Mn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...La(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function En(t,a){const e=a.reduce((o,n)=>o+vt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:ht(t.filter(o=>o.tipo==="gasto")),totalIngresos:ht(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Pn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function _n(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function Fn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function Dn(t,a){if(t.length===0)return[];const e=d=>a==="mes"?d.slice(0,7):d.slice(0,4),o=d=>a==="mes"?`${d}-01`:`${d}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const d of t){const p=e(d.fecha),l=d.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:l,maximo:Math.max(i,l),minimo:Math.min(i,l),eventos:0},r.push(c)),c.cierre=l,l>c.maximo&&(c.maximo=l),l<c.minimo&&(c.minimo=l),c.eventos+=1}return r}const Tn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Dn,cuentasVisibles:Pn,gastoPorTagOrdenado:Mn,idsHipoteca:_n,idsPrestamosIniciados:Fn,interesesPorCuenta:An,mesesDelPeriodo:xn,metricasFlujo:Cn,rangoMes:Na,rangoMesDe:qa,resumenPrestamosPeriodo:Sn,sinTransferencias:wn,sumarGastosPorTag:La,totalesPeriodo:En},Symbol.toStringTag,{value:"Module"}));function zn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Ut(t,a){return e=>zn(t,a,e)}const Yt=10,ka=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Oa=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Pe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ba="default";function Ha(){return{_id:Ba,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Ga(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:ka,tramosGananciasCapital:Oa,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Va(t,a){return{loans:[],expenses:[],accounts:[Pe(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Ha()],config:Ga(t,a)}}const dt=t=>Array.isArray(t)?t:[],jn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Wt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ua(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function _e(t){const{varianza:a,inflacion:e,...o}=t;return o}function qn(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=jn(t.config),r={...Ga(e,o)};for(const[p,l]of Object.entries(s))l!=null&&(r[p]=l);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=ka),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Oa),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(p=>{const l={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return l.modeloFondo||(l.modeloFondo=l.esFondoPension?"pension":"cuenta"),delete l.esFondoPension,Array.isArray(l.historicoSaldos)||(l.historicoSaldos=[]),Wt(l)});c.length===0&&(c=[Pe(e)]);const d=c.filter(p=>p.esCuentaPrincipal);if(d.length===0){const p=c.find(l=>l._id==="default")||c[0];c=c.map(l=>({...l,esCuentaPrincipal:l._id===p._id}))}else if(d.length>1){let p=!1;c=c.map(l=>l.esCuentaPrincipal?p?{...l,esCuentaPrincipal:!1}:(p=!0,l):l)}return n.accounts=c,n.expenses=dt(t.expenses).map(p=>{const l={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.historialPrecios)||(l.historialPrecios=[]),l.diaPago=Ua(l.diaPago),_e(Wt(l))}),n.loans=dt(t.loans).map(p=>{const l={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(l.tags)||(l.tags=[]),l.diaPago=Ua(l.diaPago),l.amortizaciones=dt(l.amortizaciones).map(u=>Wt(u)),_e(Wt(l))}),n.nominas=dt(t.nominas).map(p=>{const l={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.retribucionFlexible)||(l.retribucionFlexible=[]),_e(Wt(l))}),n.goals=dt(t.goals).map((p,l)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...g}=p;return{prioridad:l+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:p,...l})=>l),n}const Pt=t=>Array.isArray(t)?t:[];let Fe=0;function Nn(t){return Fe+=1,`${t}_${Fe.toString(36)}`}const Rn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ln=t=>typeof t=="number"&&Number.isFinite(t);function kn(t,a){const e={...t};Fe=0;const o=Pt(t.transacciones),n=Pt(t.puntosControl),s=[...n],i=new Set(n.map(d=>`${d.cuentaId}|${d.fecha}`)),r=(d,p,l,u)=>{if(!Rn(p)||!Ln(l))return;const v=`${d}|${p}`;i.has(v)||(i.add(v),s.push({_id:Nn("pc"),fecha:p,cuentaId:d,saldoCts:it(l),...typeof u=="string"&&u?{nota:u}:{}}))};for(const d of Pt(t.accounts)){const p=typeof d._id=="string"?d._id:null;if(p)for(const l of Pt(d.historicoSaldos))r(p,l.fecha,l.saldo,l.nota)}const c=Pt(t.history);if(c.length>0){const d=Pt(t.accounts),p=d.find(u=>u.esCuentaPrincipal)||d.find(u=>u.activo)||d[0],l=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:l;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((d,p)=>String(d.fecha).localeCompare(String(p.fecha))),e}const De=t=>Array.isArray(t)?t:[],On=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Bn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Te=0;function Hn(){return Te+=1,`tx_hp_${Te.toString(36)}`}function Gn(t,a){const e={...t};Te=0;const o=[...De(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=De(t.expenses).map(i=>{const r=De(i.historialPrecios),c=typeof i._id=="string"?i._id:null,d=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",l=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!On(g.fecha)||!Bn(g.cuantia))continue;const b=p==="ingreso"?it(g.cuantia):-it(g.cuantia),x=`${c}|${g.fecha}|${b}`;n.has(x)||(n.add(x),o.push({_id:Hn(),fecha:g.fecha,cuentaId:d,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:l,estimacionId:c,tipo:p,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Ya=t=>Array.isArray(t)?t:[],yt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,_t=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,Vn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Un(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=Ya(e.goals),n=Ya(e.accounts),s=n.map(l=>{const u=_t(l.bloqueoMeses,0);return{_id:`veh_${yt(l._id,"x")}`,nombre:yt(l.nombre,"Cuenta"),rentabilidadRealAnual:_t(l.interes,0)/100,liquidez:l.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:_t(l.impuestoRetirada,0)/100,topeAportacionAnual:l.modeloFondo==="pension"?it(1500):null,riesgo:l.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:yt(l._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:_t(l.interes,0)>0}}),i=new Map(n.map((l,u)=>[yt(l._id,""),s[u]._id])),r=((p=s[0])==null?void 0:p._id)??"",c=o.map((l,u)=>{const v=Array.isArray(l.cuentaIds)?l.cuentaIds.map(b=>yt(b,"")):[],g=Vn(l.targetDate);return{_id:yt(l._id,`obj_mig_${u}`),nombre:yt(l.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(_t(l.targetAmount,0)),fechaLimite:g,prioridad:_t(l.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:l.completado===!0?"COMPLETADO":"PENDIENTE",notas:yt(l.notas,"")}}),d={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[d],e}function Yn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ba)||(e.personas=[Ha(),...o]),e}const Kt=t=>Array.isArray(t)?t:[];function ce(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function Wn(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function Kn(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Kt(e.loans).map(ce),e.expenses=Kt(e.expenses).map(ce),e.nominas=Kt(e.nominas).map(ce),e.accounts=Kt(e.accounts).map(ce),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Kt(e.planes).filter(Wn);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const Jn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:qn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:kn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Gn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Un},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:Yn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:Kn}],Qn=["history"];function Wa(t,a,e){let o=t;const n=[];for(const s of[...Jn].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const $t="state_",le="state__schemaVersion",Ft="financeapp_",ze="state__modificadoEn";function Ka(t=localStorage,a=Ft){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==ze&&t.setItem(e(ze),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function Xn(t=localStorage,a=Ft){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith($t)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Zn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const ts={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function es(t,a){const e=ts[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function as(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function os({adapter:t,hoy:a=new Date}){const e=W(a),o=as(a);let n=Va(e,o);const s=new Set;let i=[];const r=Zn();function c(S){for(const F of s)F(S)}function d(S){t.set(`${$t}${S}`,n[S])}function p(){const S={};for(const T of Object.keys(n)){const R=t.get(`${$t}${T}`);R!==null&&(S[T]=R)}for(const T of Qn){const R=t.get(`${$t}${T}`);R!==null&&(S[T]=R)}const F=t.get(le),{state:D,applied:j}=Wa(S,F,{hoyISO:e,finISO:o});if(n=D,l(),j.length>0){for(const T of Object.keys(n))d(T);t.set(le,Yt)}return i=j,{applied:j}}function l(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Pe(e)],d("accounts");return}const S=n.accounts.filter(F=>F.esCuentaPrincipal);if(S.length===0)n.accounts=n.accounts.map((F,D)=>D===0?{...F,esCuentaPrincipal:!0}:F),d("accounts");else if(S.length>1){let F=!1;n.accounts=n.accounts.map(D=>D.esCuentaPrincipal?F?{...D,esCuentaPrincipal:!1}:(F=!0,D):D),d("accounts")}}function u(S){return n[S]}function v(S,F){n[S]=F,d(S),c(S)}function g(S){v("config",{...n.config,...S})}function b(S){return s.add(S),()=>s.delete(S)}function x(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(S,F){const D=[...n[S]],j={...F,_id:x()};return D.push(j),v(S,D),j}function h(S,F,D){const j=n[S].map(T=>T._id===F?{...T,...D}:T);v(S,j)}function M(S,F){const D=n[S],j=D.findIndex(T=>T._id===F);j<0||(r.registrar({col:S,item:D[j],indice:j}),v(S,D.filter((T,R)=>R!==j)))}function A(){const S=r.tomar();if(!S)return null;const F=[...n[S.col]];return F.splice(Math.min(S.indice,F.length),0,S.item),v(S.col,F),S}function I(){return r.pendiente()}function $(){const S=n.accounts||[],F=S.find(D=>D.esCuentaPrincipal&&D.activo)||S.find(D=>D.activo);return F?F._id:"default"}function E(S){var F;return((F=n.accounts.find(D=>D._id===S))==null?void 0:F.nombre)??S}function P(){return Ut(n.tramosIRPFHistorico,n.config.tramos_irpf)}function w(){return Ut(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function y(){return structuredClone(n)}function C(S,F=null){const{state:D,applied:j}=Wa(S,F,{hoyISO:e,finISO:o});n=D,l();for(const T of Object.keys(n))d(T);t.set(le,Yt);for(const T of Object.keys(n))c(T);return{applied:j}}return{load:p,get:u,set:v,patchConfig:g,subscribe:b,addItem:f,updateItem:h,removeItem:M,deshacerBorrado:A,borradoPendiente:I,getPrincipalAccountId:$,accountName:E,resolverTramosIRPF:P,resolverTramosGanancias:w,snapshot:y,replaceAll:C,get schemaVersion(){return Yt},get migrationsApplied(){return[...i]},get today(){return e||K()}}}function ns(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const Ct=Object.keys(Va("1970-01-01","1970-01-01"));function Ja(t){const a={};for(const e of Ct){const o=t.get(`${$t}${e}`);o!=null&&(a[e]=o)}return a}function ss(t,a){const e=[];for(const o of Ct){const n=a[o];n!=null&&(t(`${$t}${o}`,n),e.push(o))}return e}function is(t){return Ct.filter(a=>t[a]===void 0||t[a]===null)}function rs(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!Ct.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Qa=`${Ft}meta_proyectos`,Xa=`${Ft}meta_proyectoActivo`,St="default",cs="Mis finanzas";function je(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Jt(t){return t===St?Ft:`${Ft}p_${t}_`}function Za(){return[...Ct.map(t=>`${$t}${t}`),le,ze]}function ls(t=localStorage){function a(){try{const l=t.getItem(Qa);if(!l)return[];const u=JSON.parse(l);return Array.isArray(u)?u:[]}catch{return[]}}function e(l){t.setItem(Qa,JSON.stringify(l))}function o(){const l=a();if(l.some(g=>g._id===St))return l;const u=Date.now(),v=[{_id:St,nombre:cs,creadoEn:u,actualizadoEn:u},...l];return e(v),v}function n(){try{const l=t.getItem(Xa);if(!l)return St;const u=JSON.parse(l);return typeof u=="string"&&u?u:St}catch{return St}}function s(l){t.setItem(Xa,JSON.stringify(l))}function i(l){const u=l.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:je(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),g]),g}function r(l,u){const v=u.trim();v&&e(o().map(g=>g._id===l?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(l,u){const v=o().find(f=>f._id===l);if(!v)throw new Error("Proyecto no encontrado.");const g=Jt(l),b={_id:je(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},x=Jt(b._id);for(const f of Za()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${x}${f}`,h)}return e([...o(),b]),b}function d(l){if(l===St)throw new Error("No se puede eliminar el proyecto original.");if(l===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===l))return;const v=Jt(l);for(const g of Za())t.removeItem(`${v}${g}`);e(u.filter(g=>g._id!==l))}function p(l){const u=new Map(o().map(g=>[g._id,g]));for(const g of l){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return e(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:d,fusionarRemotos:p}}function ds(t,a,e){const o=Ka(t,Jt(a)),n={};for(const s of e){const i=o.get(`${$t}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function us(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,je())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const at={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},xt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:at.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:at.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:at.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:at.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:at.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:at.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:at.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:at.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:at.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:at.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:at.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:at.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:at.datos,porDefecto:!1,dependencias:["sync-nube"]}],ps=new Map(xt.map(t=>[t.id,t]));function Qt(t){return ps.get(t)}function to(t){return xt.filter(a=>(a.dependencias||[]).includes(t))}function qe(){const t={};for(const a of xt)t[a.id]=a.porDefecto;return t}function eo(){const t=[],a=new Map;for(const e of xt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function ms(t){function a(){return{...qe(),...t.get("config").features||{}}}function e(l){t.patchConfig({features:l})}function o(l,u=a(),v=new Set){const g=Qt(l);if(!g)return!1;if(g.nucleo)return!0;if(u[l]===!1)return!1;if(v.has(l))return!0;v.add(l);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(l,u=a()){const v=Qt(l);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function s(l,u){var M;const v=Qt(l);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),b=new Map(xt.map(A=>[A.id,o(A.id,g)])),x={...g,[l]:u};let f;if(u){const A=[...v.dependencias||[]];for(;A.length;){const I=A.pop();x[I]===!1&&(x[I]=!0,f="dependencias-activadas"),A.push(...((M=Qt(I))==null?void 0:M.dependencias)||[])}}else{const A=to(l).map(I=>I.id);for(;A.length;){const I=A.pop();x[I]!==!1&&(x[I]=!1,f="cascada-apagado"),A.push(...to(I).map($=>$.id))}}return e(x),{cambiadas:xt.filter(A=>o(A.id,x)!==b.get(A.id)).map(A=>A.id),motivo:f}}function i(){const l=a();return xt.map(u=>{const v=n(u.id,l);return{...u,activa:o(u.id,l),...v.length>0&&l[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const l=a();return eo().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=n(g.id,l);return{...g,activa:o(g.id,l),...b.length>0&&l[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(qe())}function d(l){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...l?{nombre:l}:{},features:a()}}function p(l){const u=l,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=qe(),b=[],x=[];for(const[f,h]of Object.entries(v)){if(!Qt(f)){x.push(f);continue}if(typeof h!="boolean"){x.push(f);continue}g[f]=h,b.push(f)}return e(g),{aplicadas:b,ignoradas:x}}return{isEnabled:l=>o(l),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:d,importProfile:p,bloqueadaPor:l=>n(l)}}const Xt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Dt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function fs(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Xt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Xt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Xt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Xt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function gs(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Xt(o)}</div>
        ${n.map(fs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function vs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function bs(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${gs(e)}`,n(i)}function n(i){var c,d,p;i.querySelectorAll("[data-feature-toggle]").forEach(l=>{l.addEventListener("change",()=>{var g;const u=l.dataset.featureToggle,v=e.setEnabled(u,l.checked);v.motivo==="dependencias-activadas"&&Dt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Dt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const l=e.exportProfile(),u=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=a.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(v),Dt(t,"Perfil de funcionalidades guardado")}),(d=i.querySelector('[data-feature-action="import"]'))==null||d.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const l=(u=r.files)==null?void 0:u[0];if(l)try{const{aplicadas:g,ignoradas:b}=e.importProfile(JSON.parse(await l.text()));Dt(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){Dt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var l;e.reset(),Dt(t,"Funcionalidades restablecidas"),(l=t.onChange)==null||l.call(t,[]),o(i)})}function s(){const i=vs(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),hs={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function ao(t){return hs[t]??t}function mt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function oo(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function ys(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function $s(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function xs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function ws(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${ut(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${ut(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${ut(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${ut(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${ut(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${ut(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Is(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(ao(i))}
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
    </div>`}function Cs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Ss(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(d=>ws(d,c)).join("")}
      </div>
      ${Cs()}
      ${Is(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,d;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const l=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(g=>g._id===l);if(v){if(u==="cambiar"){if(!oo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(l),ys(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;e.renombrar(l,g.trim()),mt(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const x=e.duplicar(l,b.trim()||g);mt(t,`"${x.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!oo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(l),mt(t,`"${v.nombre}" eliminado`),n(r)}catch(g){mt(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),l=p==null?void 0:p.value.trim();if(!l){mt(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(l);mt(t,`"${u.nombre}" creado ✓`),n(r)}),(d=r.querySelector("#proyecto-import-btn"))==null||d.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const l=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(l.length===0){mt(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,l);if(u.length===0){mt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}mt(t,`Importado: ${u.map(ao).join(", ")} ✓`),$s(),n(r)})}function i(){const r=xs(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const de=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],At=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Tt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function As(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Ms(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Es(t){const a=t.color||de[0];return`
    <div class="dm-section" data-persona-fila="${At(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${At(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${At(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${At(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${At(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${At(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${At(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ps(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${de.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${de[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function _s(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Es).join("")}
      </div>
      ${Ps()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.personaId,v=l.dataset.personaAccion,g=e.get("personas"),b=g.find(x=>x._id===u);if(b){if(v==="renombrar"){const x=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!x||!x.trim())return;e.updateItem("personas",u,{nombre:x.trim()}),Tt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){e.set("personas",g.map(x=>({...x,esPorDefecto:x._id===u}))),Tt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(g.length<=1){Tt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!As(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),Tt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const d=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(l=>{l.addEventListener("click",()=>{const u=l.getAttribute("data-persona-color");d&&(d.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const l=c.querySelector("#persona-nuevo-nombre"),u=l==null?void 0:l.value.trim();if(!u){Tt(t,"Ponle un nombre a la persona","warn");return}const v=(d==null?void 0:d.value)||de[0],g=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});Tt(t,`"${g.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Ms(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const no={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function so(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Fs({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([d,p])=>[p,d]);for(const[d,p]of[...Object.entries(no),...c]){const l=t.isEnabled(d),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=l?"":"none"),!l&&n()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(d=>{const p=[...d.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const l=p.some(u=>u.style.display!=="none");d.style.display=l?"":"none"}),so(a,d=>t.isEnabled(d)),r){const d=e??globalThis.Router;d==null||d.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const d=new MutationObserver(()=>{if(!c){c=!0;try{so(a,p=>t.isEnabled(p))}finally{c=!1}}});return d.observe(r,{childList:!0,subtree:!0}),()=>d.disconnect()}return{apply:s,observar:i,vistaPara:r=>no[r]}}const Ds="toast toast-deshacer";function Ts(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function d(l){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=Ds,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${es(l.col,l.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const x=a.deshacerBorrado();if(c(),!x)return;const f=n();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const l=a.borradoPendiente();if(!l){r=null,c();return}l!==r&&(r=l,d(l))});return()=>{p(),c()}}function ue(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function io(t,a){const e=ue(t),o=ue(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Zt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function zs(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Zt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Zt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Zt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Zt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Zt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function js(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=ue(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of zs(t)){if(!i(c.ruta))continue;const d=io(c.titulo,s),p=d>=0?-1:Math.min(io(c.extra??"",s),2);if(d<0&&p<0)continue;const l=d>=0?d:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:l*1e3+Math.min(999,ue(c.titulo).length)})}return r.sort((c,d)=>c.peso-d.peso||c.titulo.localeCompare(d.titulo,"es")),r.slice(0,o)}const qs="buscador-overlay",ro="btn-buscador";function Ns(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const A=a.createElement("div");A.id=qs,A.className="modal-overlay",A.style.alignItems="flex-start",A.style.paddingTop="10vh";const I=a.createElement("div");I.className="modal-box",I.style.maxWidth="560px",I.style.padding="14px";const $=a.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const E=a.createElement("div");return E.style.marginTop="10px",E.style.maxHeight="52vh",E.style.overflowY="auto",I.appendChild($),I.appendChild(E),A.appendChild(I),a.body.appendChild(A),A.addEventListener("click",P=>{P.target===A&&b()}),$.addEventListener("input",()=>{r=0,p()}),$.addEventListener("keydown",v),o=A,n=$,s=E,A}function d(){if(s){if(s.textContent="",i.length===0){const A=a.createElement("div");A.style.padding="14px 4px",A.style.fontSize="13px",A.style.color="var(--text3)";const I=(n==null?void 0:n.value.trim())??"";A.textContent=I.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(A);return}i.forEach((A,I)=>{const $=a.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(I),I===r&&$.classList.add("activa");const E=a.createElement("div");E.style.minWidth="0";const P=a.createElement("div");P.textContent=A.titulo,P.style.fontSize="13px",P.style.overflow="hidden",P.style.textOverflow="ellipsis",P.style.whiteSpace="nowrap";const w=a.createElement("div");w.textContent=A.detalle,w.style.fontSize="11px",w.style.color="var(--text3)",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap",E.appendChild(P),A.detalle&&E.appendChild(w);const y=a.createElement("span");y.className="tag",y.textContent=A.etiqueta,y.style.flexShrink="0",$.appendChild(E),$.appendChild(y),$.addEventListener("click",()=>u(I)),s.appendChild($)})}}function p(){const A=(n==null?void 0:n.value)??"";i=js(t.estado(),A,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),d()}function l(A){var I,$;i.length!==0&&(r=(r+A+i.length)%i.length,d(),($=(I=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:I.scrollIntoView)==null||$.call(I,{block:"nearest"}))}function u(A){const I=i[A];I&&(b(),t.navegar(I.ruta))}function v(A){A.key==="Escape"?(A.preventDefault(),b()):A.key==="ArrowDown"?(A.preventDefault(),l(1)):A.key==="ArrowUp"?(A.preventDefault(),l(-1)):A.key==="Enter"&&(A.preventDefault(),u(r))}function g(){const A=o??c();A.classList.remove("hidden"),A.style.display="",r=0,n&&(n.value="",n.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function x(){return!!o&&o.style.display!=="none"}function f(A){(A.ctrlKey||A.metaKey)&&(A.key==="k"||A.key==="K")&&(A.preventDefault(),x()?b():g())}a.addEventListener("keydown",f);let h=null;function M(){const A=a.getElementById("period-bar");if(!A||a.getElementById(ro))return;const I=a.createElement("button");I.id=ro,I.type="button",I.className="btn-secondary",I.title="Buscar en toda la aplicación (Ctrl+K)",I.setAttribute("aria-label","Buscar"),I.textContent="🔍 Buscar",I.style.marginLeft="auto",I.addEventListener("click",g),A.appendChild(I),h=I}return M(),()=>{a.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Ne="aviso-guardado";function Rs(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function d(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(Ne))==null||g.remove()}function p(){if(s==="oculto")return d();const g=e();if(!g)return;let b=a.getElementById(Ne);b||(b=a.createElement("div"),b.id=Ne,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const x=a.createElement("span");if(x.style.flex="1",b.appendChild(x),s==="pendiente")x.textContent="Tienes cambios sin guardar.",b.appendChild(l("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(l("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",p()}));else if(s==="subiendo"){x.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else s==="guardado"?x.textContent="¡Guardado!":s==="error"&&(x.textContent="No se ha podido guardar.",b.appendChild(l("Reintentar","btn-primary btn-sm",()=>void u())))}function l(g,b,x){const f=a.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",x),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return s="subiendo",p(),c=(async()=>{try{await t.guardar(),n.alDia(g),s="guardado",p(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",p()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,detener(){v(),d()}}}function Ls({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(g){return`view-${g}`}function s(g){const b=t.getElementById(n(g.route));if(b)return b;const x=t.querySelector(".view-container");if(!x)return null;const f=t.createElement("div");return f.id=n(g.route),f.className="view hidden",x.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),x=b[g.seccion??Math.max(0,b.length-1)];if(!x)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,x.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){e.set(g.route,g),s(g),i(g)}function c(){return[...e.keys()].filter(g=>{const b=e.get(g);return!a||a(b.flagId??b.id)})}function d(g){return c().includes(g)}function p(g){const b=e.get(g);if(!b||a&&!a(b.flagId??b.id))return!1;const x=s(b);if(!x)return!1;if(o&&o!==g){const f=e.get(o),h=t.getElementById(n(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount(x),o=g,!0}function l(){o&&p(o)}function u(){const g={};for(const[b,x]of e)g[b]=x.flagId??x.id;return g}function v(){for(const g of e.values())s(g),i(g)}return{register:r,routes:c,has:d,mount:p,rerender:l,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ft(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(_(t))}</span>`}function co(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Re(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const ks=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function te(t){const[a,e]=t.split("-").map(Number);return`${ks[e-1]} ${a}`}function q(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function ot(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function z(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function U(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function ct(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function lo(t,a){const e=parseFloat(ct(t,a));return Number.isFinite(e)?e:0}const Os="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Le(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Bs(t){const{store:a}=t,e=t.hoy??K,o=()=>O(e()),n=()=>a.get("config").margenesSeguridad??[];function s(v){var g;a.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=n().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),x=b.find(f=>f._id===v);x&&(g(x),s(b))}function r(v){const g=a.get("config"),b=Ee(v,a.get("expenses"),g,a.get("loans"),e(),!1,o());return _(b)}function c(v,g,b){const x=g.tipo==="fijo",f=x?"":`<span class="text-sm" style="color:var(--text3)">${m(_((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${x?" selected":""}>Fijo €</option>
            <option value="meses"${x?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${x?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${x?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function d(v,g,b){const x=v.cuentas&&v.cuentas.length>0?v.cuentas.map(A=>{var I;return((I=g.find($=>$._id===A))==null?void 0:I.nombre)??A}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((A,I)=>A.fecha.localeCompare(I.fecha)).map(A=>c(v,A,b)).join(""),M=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(x)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${m(r(v))}</strong>
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
            ${h||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${m(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${m(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${m(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${m(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${m(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${M}
      </div>`}function p(v,g){const b=g?n().find(M=>M._id===g):null,x=a.get("accounts").filter(M=>M.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=x.map(M=>`
        <label class="tag" data-chip="${m(M._id)}" style="cursor:pointer;${f.has(M._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(M._id)}" ${f.has(M._id)?"checked":""} style="display:none"/>
          ${m(M.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m((b==null?void 0:b.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${h||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${b?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(K())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${m(g??"")}">Guardar</button>
      </div>`}function l(v,g){const b=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");!b||!x||(p(x,v),b.classList.remove("hidden"),U(x,".mg-acc-chip",f=>{const h=f,M=x.querySelector(`[data-chip="${h.value}"]`);M&&(M.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(x,"#mg-p-tipo",f=>{const h=f.value==="fijo",M=x.querySelector("#mg-p-importe-wrap"),A=x.querySelector("#mg-p-meses-wrap");M&&(M.style.display=h?"":"none"),A&&(A.style.display=h?"none":"")}),z(x,"[data-cerrar-form]",()=>b.classList.add("hidden")),z(x,"[data-guardar-margen]",f=>{var $,E,P,w,y;const h=f.getAttribute("data-guardar-margen")||"",M=(($=x.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!M)return q("El nombre es obligatorio","err");const A=[...x.querySelectorAll(".mg-acc-chip:checked")].map(C=>C.value),I=n().map(C=>({...C}));if(h){const C=I.findIndex(S=>S._id===h);if(C===-1)return q("Margen no encontrado","err");I[C]={...I[C],nombre:M,cuentas:A}}else{const C=((E=x.querySelector("#mg-p-tipo"))==null?void 0:E.value)??"fijo",S={_id:Le(),fecha:((P=x.querySelector("#mg-p-fecha"))==null?void 0:P.value)||K(),tipo:C,importe:parseFloat(((w=x.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((y=x.querySelector("#mg-p-meses"))==null?void 0:y.value)??"1")||1};I.push({_id:Le(),nombre:M,activo:!0,cuentas:A,puntos:[S]})}s(I),q(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=n(),b=a.get("accounts"),x=Vt(a.get("expenses"),o());v.innerHTML=`
      <div class="page-header">
        <div>
          <h1 class="page-title">Márgenes de <span>seguridad</span></h1>
          <p class="text-sm" style="color:var(--text3);margin:4px 0 0">
            Umbrales de saldo mínimo por cuenta o grupo de cuentas. El dashboard avisa cuando la
            proyección los cruza.
          </p>
        </div>
        <button class="btn-primary" data-nuevo-margen>+ Añadir margen</button>
      </div>
      ${g.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:g.map(h=>d(h,b,x)).join("")}`;const f=()=>u(v);z(v,"[data-nuevo-margen]",()=>l(null,f)),z(v,"[data-editar-margen]",h=>l(h.getAttribute("data-editar-margen"),f)),z(v,"[data-borrar-margen]",h=>{ot("¿Eliminar este margen de seguridad?")&&(s(n().filter(M=>M._id!==h.getAttribute("data-borrar-margen"))),q("Margen eliminado"),f())}),U(v,"[data-toggle-margen]",h=>{const M=h.getAttribute("data-toggle-margen");i(M,A=>{A.activo=h.checked}),f()}),z(v,"[data-add-punto]",h=>{const M=h.getAttribute("data-add-punto");i(M,A=>{A.puntos=[...A.puntos??[],{_id:Le(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),f()}),z(v,"[data-borrar-punto]",h=>{const M=h.closest("[data-punto]");if(!M)return;const A=M.dataset.margen,I=M.dataset.punto;i(A,$=>{$.puntos=($.puntos??[]).filter(E=>E._id!==I)}),f()}),U(v,"[data-campo]",h=>{const M=h.closest("[data-punto]");if(!M)return;const A=h.getAttribute("data-campo"),I=h.value;i(M.dataset.margen,$=>{const E=($.puntos??[]).find(P=>P._id===M.dataset.punto);E&&(A==="fecha"?E.fecha=I:A==="tipo"?E.tipo=I:A==="importe"?E.importe=parseFloat(I)||0:E.meses=parseFloat(I)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Os,mount:u}}const Hs=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],Gs=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Vs=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Us(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ke=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function uo(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=Us(t),i=ke(Hs.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
    <label class="form-label">Día efectivo</label>
    <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
      <select class="form-select" data-dp-modo style="width:auto;min-width:145px">
        <option value="none"${e==="none"?" selected":""}>Sin ajuste</option>
        <option value="dia"${e==="dia"?" selected":""}>Día del mes</option>
        <option value="nthweekday"${e==="nthweekday"?" selected":""}>Día de la semana</option>
      </select>
      <span data-dp-dia class="flex gap-8 items-center"${e!=="dia"?' style="display:none"':""}>
        el día <select class="form-select" data-dp-dnum style="width:auto;min-width:80px">${i}</select>
      </span>
      <span data-dp-nth class="flex gap-8 items-center"${e!=="nthweekday"?' style="display:none"':""}>
        el
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ke(Gs,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ke(Vs,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function po(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function mo(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const Ys={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Ws(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function zt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const d=s.has(c._id),p=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${d?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${m(o)}" data-persona="${m(c._id)}"
             value="${p??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${m(o)}">
    <label class="form-label">${m(t)}</label>
    <select class="form-select" data-reparto-modo="${m(o)}">
      <option value=""${n?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${n==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${n==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${n==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${m(o)}" style="margin-top:6px;${n?"":"display:none"}">
      ${Ws(e,a).map(r).join("")}
    </div>
  </div>`}function jt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function qt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,d=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=d?parseFloat(d.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:s}}function fo(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Ys[t.modo]})`}function Oe(t,a,e){const o=fo(t,e),n=fo(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Ks="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Js=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Qs(t){const a=t.hoy??K,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var h;return((h=n().find(M=>M._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(M=>!M.fechaFin||M.fechaFin>=f)),e.tipo&&(h=h.filter(M=>M.tipo===e.tipo)),e.cuenta&&(h=h.filter(M=>(M.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(M=>(M.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(M=>(M.fechaInicio??"")<=e.hasta)),e.busqueda){const M=e.busqueda.toLowerCase();h=h.filter(A=>A.concepto.toLowerCase().includes(M))}return e.tags.size>0&&(h=h.filter(M=>(M.tags||[]).some(A=>e.tags.has(A)))),h.sort((M,A)=>{const I=M[e.orden]??"",$=A[e.orden]??"";return typeof I=="number"&&typeof $=="number"?(I-$)*e.sentido:String(I).localeCompare(String($))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const M=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(h)} <span class="sort-arrow">${M}</span></span>`}function d(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(A=>A.activo!==!1).map(A=>`<option value="${m(A._id)}"${A._id===f?" selected":""}>${m(A.nombre)}</option>`).join("")}function p(f){const h=f.tipo==="transferencia",M=Oe(f.repartoConsumo,f.repartoPago,t.store.get("personas")),A=xe(f.diaPago??""),I=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${A?` · ${A}`:""}`,$=!!f.fechaFin&&f.fechaFin<a(),E=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',P=h?`${m(s(f.cuenta))} → ${m(s(f.cuentaDestino))}`:m(s(f.cuenta)),w=(f.tags||[]).map(y=>`<span class="tag${e.tags.has(y)?" active":""}" data-tag="${m(y)}" title="Filtrar por ${m(y)}">${m(y)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${E}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(_(f.cuantia))}</div>
      <div class="text-sm">${m(I)}</div>
      <div class="text-sm exp-col-hide">${P}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(M)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function l(f){const h=i(),M=r();f.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" data-expirados${e.mostrarExpirados?" checked":""}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" data-nuevo>+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${m(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${d(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${m(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${m(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${M.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${M.map(A=>`<span class="tag${e.tags.has(A)?" active":""}" data-tag="${m(A)}">${m(A)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(p).join("")}
      </div>`}function u(f){const h=(f==null?void 0:f.tipo)==="transferencia",M=t.store.get("personas"),A=(I,$,E,P,w="")=>`<div class="form-group"><label class="form-label">${m($)}</label>
       <input class="form-input" type="${E}" id="${I}" value="${m(P)}" placeholder="${m(w)}"/></div>`;return`
      <div class="grid-2">
        ${A("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${A("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${A("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Js.map(([I,$])=>`<option value="${I}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===I?" selected":""}>${m($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${A("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${d((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${d((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${A("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${uo(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${h?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((f==null?void 0:f.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(f==null?void 0:f.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(f==null?void 0:f.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${m(((f==null?void 0:f.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${f!=null&&f.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(f==null?void 0:f.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${f!=null&&f.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${h?"":`${zt("Reparto de consumo",f==null?void 0:f.repartoConsumo,M,"consumo")}
                 ${zt("Reparto de pago",f==null?void 0:f.repartoPago,M,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var A;const h=((A=f.querySelector("#ef-tipo"))==null?void 0:A.value)??"gasto",M=(I,$)=>{const E=f.querySelector(I);E&&(E.style.display=$?"":"none")};M("#ef-destino-wrap",h==="transferencia"),M("#ef-basico-wrap",h!=="transferencia"),M("#ef-irpf-wrap",h==="ingreso"),M("#ef-clasificacion-wrap",h==="gasto")}function g(f,h,M){const A=document.getElementById("modal-overlay"),I=document.getElementById("modal-content");!A||!I||(I.innerHTML=`<div class="modal-title">${m(h)}</div>${u(f)}`,A.classList.remove("hidden"),U(I,"#ef-tipo",()=>v(I)),U(I,"[data-dp-modo]",()=>po(I)),U(I,'[data-reparto-modo="consumo"]',()=>jt(I,"consumo")),U(I,'[data-reparto-modo="pago"]',()=>jt(I,"pago")),z(I,"[data-cancelar]",()=>A.classList.add("hidden")),z(I,"[data-guardar]",$=>{b(I,$.getAttribute("data-guardar")||"")&&(A.classList.add("hidden"),M())}))}function b(f,h){const M=C=>{var S;return((S=f.querySelector(C))==null?void 0:S.value)??""},A=C=>{var S;return!!((S=f.querySelector(C))!=null&&S.checked)},I=M("#ef-tipo")||"gasto",$=I==="transferencia",E=M("#ef-concepto").trim(),P=parseFloat(M("#ef-cuantia"));if(!E||!Number.isFinite(P))return q("Concepto y cuantía obligatorios","err"),!1;const w=M("#ef-clasificacion"),y={concepto:E,tipo:I,cuantia:P,frecuencia:parseInt(M("#ef-frecuencia"),10)||1,tipoFrecuencia:M("#ef-tipo-frec")||"mensual",fechaInicio:M("#ef-fecha-ini"),fechaFin:M("#ef-fecha-fin")||null,diaPago:mo(f),cuenta:M("#ef-cuenta"),cuentaDestino:$?M("#ef-cuenta-dest")||"default":void 0,activo:A("#ef-activo"),basico:!$&&A("#ef-basico"),sujetoIRPF:!$&&A("#ef-sujetoIRPF"),clasificacion:I==="gasto"?w||null:void 0,tags:$?["transferencia"]:M("#ef-tags").split(",").map(C=>C.trim()).filter(Boolean),repartoConsumo:$?void 0:qt(f,"consumo"),repartoPago:$?void 0:qt(f,"pago")};return h?(t.store.updateItem("expenses",h,y),q("Actualizado")):(t.store.addItem("expenses",y),q("Creado")),o(),!0}function x(f,h){const M=f.querySelector("[data-busqueda]");let A;M==null||M.addEventListener("input",()=>{clearTimeout(A),A=setTimeout(()=>{e.busqueda=M.value,h();const I=f.querySelector("[data-busqueda]");I==null||I.focus(),I==null||I.setSelectionRange(I.value.length,I.value.length)},250)}),U(f,"[data-expirados]",I=>{e.mostrarExpirados=I.checked,h()}),U(f,"[data-f-tipo]",I=>{e.tipo=I.value,h()}),U(f,"[data-f-cuenta]",I=>{e.cuenta=I.value,h()}),U(f,"[data-f-desde]",I=>{e.desde=I.value,h()}),U(f,"[data-f-hasta]",I=>{e.hasta=I.value,h()}),z(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),z(f,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),z(f,"[data-tag]",I=>{const $=I.getAttribute("data-tag");e.tags.has($)?e.tags.delete($):e.tags.add($),h()}),z(f,"[data-orden]",I=>{const $=I.getAttribute("data-orden");e.orden===$?e.sentido=e.sentido===1?-1:1:(e.orden=$,e.sentido=1),h()}),z(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),z(f,"[data-editar]",I=>{const $=t.store.get("expenses").find(E=>E._id===I.getAttribute("data-editar"));$&&g($,"Editar",h)}),z(f,"[data-duplicar]",I=>{const $=t.store.get("expenses").find(w=>w._id===I.getAttribute("data-duplicar"));if(!$)return;const{_id:E,...P}=$;g({...P,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",h)}),z(f,"[data-borrar]",I=>{ot("¿Eliminar?")&&(t.store.removeItem("expenses",I.getAttribute("data-borrar")),q("Eliminado"),o(),h())}),U(f,"[data-activo]",I=>{const $=I;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ks,mount(f){const h=()=>l(f);l(f),f.dataset.wired!=="1"&&(x(f,h),f.dataset.wired="1")}}}function pe(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=gt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function go(t,a,e,o){return t.reduce((n,s)=>{const i=gt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Xs(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:pe(i.tabla,a,e)-pe(r.tabla,a,e)}})}const Be=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Zs(t,a){const e=pa(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?ma(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?fa(t.tin||0,i):null,c=o&&n?Xs(t,a.periodos,a.hoy):[],d=c.length?pe(e.sinAmort.tabla,a.periodos,a.hoy)-pe(e.tabla,a.periodos,a.hoy):null,p=d===null?null:d-e.costeTotalAmort,l=s?go(e.tabla,a.periodos,a.hoy,e.comAp):null,u=s&&o?go(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Oe(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${m(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(_(e.cuota))}/mes</span>
        <span class="text-sm">${m(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${Be("Cuota mensual",m(_(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(_(a.cuotaMes))}</div>`:"")}
        ${Be("Total intereses",m(_(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(_(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Be("Total pagado",m(_(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(_(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(ca(e.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${m(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${m(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(_(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(_(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(xe(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${m(t._id)}">+ Amortizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${d!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(_(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(_(d))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(_(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(_(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(p??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(_(p??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(_(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(_(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(_(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${l!==null?ti(t,e.totalPagado,l,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>ei(v,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>ai(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function ti(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(_(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(_(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(_(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(_(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(_(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(_(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function ei(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=gt(e.periodos,e.hoy,t.fecha);o=m(_(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(_(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(_(t.interes))}</td>
    <td class="num">${m(_(t.amortizacion))}</td>
    <td class="num">${m(_(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function ai(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(a.fecha)}</span>
    <span class="num">${m(_(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(_(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(_(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(a._id)}">✕</button>
  </div>`}const tt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ee=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,ae=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,oi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function ni(t,a,e,o=K()){return`
    <div class="grid-2">
      ${tt("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${tt("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${tt("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${tt("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${tt("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${oi(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${uo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${ee("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${tt("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${tt("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${ae("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${zt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${zt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ae("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ae("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ae("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function si(t,a,e=K()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${tt("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${ee("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${ae("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const ii="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ri(t){const a=t.hoy??K;let e=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const E=$.filter(w=>w.activo);if(E.length<2)return"";const P=(w,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":m(w)}"
               style="${n===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(y)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${P(null,"Todas")}
      ${E.map(w=>P(w._id,w.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const E=X($).tabla.filter(P=>!P.esAmortizacion);return E.length===0?!0:E[E.length-1].fecha<a()}function c($,E){const P=a(),w=P.slice(0,7),y=new Map;let C=0;for(const S of $){if(!S.activo||S.simulacion||E.has(S._id)||(S.fechaInicio||"")>P)continue;const F=X(S).tabla.filter(j=>!j.esAmortizacion&&j.fecha.startsWith(w)),D=F.length>0?F[0].cuota:0;y.set(S._id,D),C+=D}return{porLoan:y,total:C,activos:[...y.values()].filter(S=>S>0).length}}function d($){const E=a().slice(0,7),P=[];for(const w of $){if(!w.activo||w.simulacion)continue;const y=X(w).tabla.filter(S=>!S.esAmortizacion),C=y[y.length-1];C&&C.fecha.slice(0,7)===E&&P.push({loan:w,cuota:C.cuota})}return P}function p($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function l($){const E=t.store.get("config"),P=E.dashboardStart,w=E.dashboardEnd,y=Math.max(1,(O(w).getTime()-O(P).getTime())/(30.44*864e5));let C=0;for(const S of $)!S.activo||S.simulacion||(C+=X(S).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=P&&F.fecha<=w).reduce((F,D)=>F+D.cuota,0));return{media:C/y,desde:P,hasta:w}}function u($){const E=t.store.get("personas"),P=ie(E),w=[...t.store.get("loans")].sort((N,H)=>H.tin-N.tin),y=n?w.filter(N=>Ce(N.repartoConsumo,N.repartoPago,P).has(n)):w,C=new Set(y.filter(r).map(N=>N._id)),S=e?y:y.filter(N=>!C.has(N._id)),F=c(w,new Set(w.filter(r).map(N=>N._id))),D=l(w),j=d(w),T=t.store.get("config"),R=t.store.get("inflacion"),B=new Date(O(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${C.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${C.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(E)}
      ${j.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${j.length===1?"acaba":"acaban"} ${m(p(j.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(_(j.reduce((N,H)=>N+H.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||D.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(B)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(_(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${D.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(_(D.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(D.desde)} → ${m(D.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(N=>Zs(N,{periodos:R,usarInflacion:!!T.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:C.has(N._id),personas:E})).join("")}
      </div>`;for(const N of $.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),b=()=>{var $;return($=v())==null?void 0:$.classList.add("hidden")};function x($,E){const P=v(),w=g();return!P||!w?null:(w.innerHTML=`<div class="modal-title">${m($)}</div>${E}`,P.classList.remove("hidden"),z(w,"[data-cancelar]",b),w)}function f($,E){const P=$?t.store.get("loans").find(y=>y._id===$)??null:null,w=x($?"Editar préstamo":"Nuevo préstamo",ni(P,t.store.get("accounts"),t.store.get("personas"),a()));w&&(w.addEventListener("change",y=>{const C=y.target;C!=null&&C.matches("[data-dp-modo]")&&po(w),C!=null&&C.matches('[data-reparto-modo="consumo"]')&&jt(w,"consumo"),C!=null&&C.matches('[data-reparto-modo="pago"]')&&jt(w,"pago")}),z(w,"[data-guardar-loan]",y=>{h(w,y.getAttribute("data-guardar-loan")||"")&&(b(),E())}))}function h($,E){const P=j=>{var T;return((T=$.querySelector(j))==null?void 0:T.value)??""},w=j=>{var T;return!!((T=$.querySelector(j))!=null&&T.checked)},y=P("#f-nombre").trim(),C=parseFloat(P("#f-capital")),S=parseFloat(P("#f-tin")),F=parseInt(P("#f-meses"),10);if(!y||!Number.isFinite(C)||!Number.isFinite(S)||!Number.isFinite(F))return q("Completa los campos obligatorios","err"),!1;const D={nombre:y,capital:C,tin:S,meses:F,fechaInicio:P("#f-fecha"),comisionApertura:parseFloat(P("#f-com-ap"))||0,comisionAmort:parseFloat(P("#f-com-am"))||0,diaPago:mo($),cuenta:P("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:P("#f-tipo-tasa"),basico:w("#f-basico"),tags:P("#f-tags").split(",").map(j=>j.trim()).filter(Boolean),repartoConsumo:qt($,"consumo"),repartoPago:qt($,"pago")};return E?(t.store.updateItem("loans",E,D),q("Préstamo actualizado")):(t.store.addItem("loans",{...D,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function M($,E,P){const w=t.store.get("loans").find(S=>S._id===$);if(!w)return;const y=E?(w.amortizaciones||[]).find(S=>S._id===E)??null:null,C=x(E?"Editar amortización":"Añadir amortización",si($,y,a()));C&&z(C,"[data-guardar-amort]",S=>{const[F,D]=(S.getAttribute("data-guardar-amort")||"").split("|");A(C,F,D)&&(b(),P([F]))})}function A($,E,P){var T;const w=R=>{var B;return((B=$.querySelector(R))==null?void 0:B.value)??""},y=w("#am-fecha"),C=parseFloat(w("#am-cant"));if(!y||!Number.isFinite(C)||C<=0)return q("Fecha y cantidad requeridas","err"),!1;const S=t.store.get("loans").find(R=>R._id===E);if(!S)return!1;const F={fecha:y,cantidad:C,tipo:w("#am-tipo"),simulacion:!!((T=$.querySelector("#am-sim"))!=null&&T.checked)},D=S.amortizaciones||[],j=P?D.map(R=>R._id===P?{...R,...F}:R):[...D,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",E,{amortizaciones:j}),q(P?"Amortización actualizada":"Amortización añadida"),s(),!0}function I($,E){z($,"[data-toggle-finalizados]",()=>{e=!e,E()}),z($,"[data-persona-tab]",P=>{n=P.getAttribute("data-persona-tab")||null,E()}),z($,"[data-nuevo-loan]",()=>f(null,E)),z($,"[data-toggle-loan]",(P,w)=>{var F;if((F=w.target)!=null&&F.closest("button"))return;const y=P.getAttribute("data-toggle-loan"),C=[...$.querySelectorAll("[data-body-loan]")].find(D=>D.dataset.bodyLoan===y);(C==null?void 0:C.classList.toggle("open"))?o.add(y):o.delete(y)}),z($,"[data-editar-loan]",P=>f(P.getAttribute("data-editar-loan"),E)),z($,"[data-borrar-loan]",P=>{if(!ot("¿Eliminar préstamo?"))return;const w=P.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),q("Eliminado"),s(),E()}),z($,"[data-amort-loan]",P=>{const w=P.getAttribute("data-amort-loan");o.add(w),M(w,null,E)}),z($,"[data-editar-amort]",P=>{const[w,y]=(P.getAttribute("data-editar-amort")||"").split("|");o.add(w),M(w,y,E)}),z($,"[data-borrar-amort]",P=>{const[w,y]=(P.getAttribute("data-borrar-amort")||"").split("|"),C=t.store.get("loans").find(S=>S._id===w);C&&(t.store.updateItem("loans",w,{amortizaciones:(C.amortizaciones||[]).filter(S=>S._id!==y)}),q("Amortización eliminada"),s(),E([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:ii,mount($){const E=(P=[])=>{for(const w of P)o.add(w);u($)};u($),$.dataset.wired!=="1"&&(I($,E),$.dataset.wired="1")}}}const He=6.35;function Nt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function vo(t){return Math.max(0,(t.bruto||0)-Nt(t))}function ci(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function li(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Nt(r),0),o=Math.max(0,a-e),n=bt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(vo(i)/o):0);return s}function bo(t,a,e){if(t.irpfModo==="manual")return vo(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return lt(bt(t.bruto||0,Nt(t)),e);const o=ci(a.filter(i=>i.irpfModo!=="manual")),n=li(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,e)-lt(s,e);s+=r}return lt(bt(t.bruto||0,Nt(t)),e)}function di(t,a){return t.reduce((e,o)=>e+bo(o,t,a),0)}function ui(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function pi(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Nt(s),0);return ui(bt(e,o),a)}function mi(t,a,e){const o=t.bruto||0,n=Nt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??He,c=s*(r/100),d=bo(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:d,irpfPct:s>0?d/s*100:0,netoPorPaga:(s-c-d)/i}}function fi(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const gi={transporte:125,restaurante:220,otros:null},vi={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},bi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Rt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,hi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function yi(t,a){const e=t.map((s,i)=>{const r=a.find(p=>p._id===s.cuenta),c=gi[s.tipo],d=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(vi[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(_(s.importe))}/mes${d?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(_(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?m(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=a.filter(s=>(s.modeloFondo||"cuenta")!=="pension"&&s.activo!==!1),n=o.filter(s=>(s.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${e||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(s=>`<option value="${m(s._id)}">${m(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function $i(t,a){const e=a.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Rt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Rt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${hi(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Rt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Rt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Rt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${bi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
          ${Rt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??He).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${zt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${zt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ho(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",He),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:qt(t,"consumo"),repartoPago:qt(t,"pago")}}function xi(t,a,e,o){const n=ho(t,a),s=a.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(bt(n.bruto,s),e.tramos),d=i-r-c,p=i/n.nPagas,l=r/n.nPagas,u=c/n.nPagas,v=p-l-u,g=n.grupoNomina?e.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",x=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(_(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(_(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(_(n.bruto))}</span>
      ${x}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(_(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(_(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(_(d))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(_(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(_(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(_(v))}/paga`:`ingreso ${m(_(p))} − SS ${m(_(l))} − IRPF ${m(_(u))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function wi(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=yi(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=xi(t,a,e,o))},i=()=>{var c,d;const r=(p,l)=>{const u=t.querySelector(p);u&&(u.style.display=l?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((d=t.querySelector("#nf-irpfmodo"))==null?void 0:d.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>jt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>jt(t,"pago")),z(t,"[data-flex-anadir]",()=>{var d,p,l;const r=((d=t.querySelector("#fc-tipo"))==null?void 0:d.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((l=t.querySelector("#fc-cuenta"))==null?void 0:l.value)||""}),n(),s()}),z(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const yo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ii(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??It;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),z(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,x)=>b.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(yo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(yo(b.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${b.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${b.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(z(g,"[data-editar-tabla]",b=>{const x=b.getAttribute("data-editar-tabla");l(x==="default"?"default":Number(x))}),z(g,"[data-borrar-tabla]",b=>{const x=Number(b.getAttribute("data-borrar-tabla"));ot(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==x)),q(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),z(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return q("Año inválido","err");const x=t.store.get("tramosIRPFHistorico");if(x.some(h=>h.año===b))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...x,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),l(b)}))}function d(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const x=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat((x==null?void 0:x.value)??"")||0]})}function l(u){var h;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((h=v.find(M=>M.año===u))==null?void 0:h.tramos)??i()).map(M=>[...M]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,x=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${d()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!x)return;const f=()=>{const M=x.querySelector("#irpf-tramos-rows");M&&(M.innerHTML=d())};z(x,"[data-volver]",c),z(x,"[data-tr-anadir]",()=>{p(x),e.push([0,0]),f()}),z(x,"[data-tr-borrar]",M=>{p(x),e.splice(Number(M.getAttribute("data-tr-borrar")),1),f()}),z(x,"[data-tr-guardar]",()=>{p(x);const M=[...e].sort((A,I)=>A[0]-I[0]);if(M.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:M}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(A=>A.año===a?{...A,tramos:M}:A)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const $o=1500,Mt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Ci=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,Si=t=>(t.modeloFondo||"cuenta")==="pension";function Ai(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Mi(n,a,e,o)).join("")}</div>`}function Mi(t,a,e,o){const n=Ae(t);if(!n)return"";const s=Me(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(d=>d.fecha>=`${i}-01-01`).reduce((d,p)=>d+p.cantidad,0),c=Math.min(r,$o)*(s/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${m(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(_(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(_(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${m(_(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(_(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(_(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>$o?"neg":""}">${m(_(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(_(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Ei(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(_(e.importe))} / ${m(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(e.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="paport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([e,o])=>`<option value="${e}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="paport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Pi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Mt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Mt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Mt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Mt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Mt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Ci("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Mt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${Mt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${n.map(i=>`<option value="${m(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${m(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${m((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function _i(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Ei(a))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),z(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),z(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Fi(t,a,e,o){var x;const n=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},s=(f,h=0)=>{const M=parseFloat(n(f));return Number.isFinite(M)?M:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),d=n("#pen-grupo"),p={nombre:r,grupoNomina:d,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:d?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},l=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],g=((x=[...l].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:x.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(l.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(l.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:l,aportaciones:u}}}const Di="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Ti(t){const a=t.hoy??K,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const M=h.filter(I=>I.activo);if(M.length<2)return"";const A=(I,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${o===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${A(null,"Todas")}
      ${M.map(I=>A(I._id,I.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Ut(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??It)(Number(a().slice(0,4)))}function i(h,M,A){const I=mi(h,M,A),$=!!M&&h.irpfModo!=="manual",E=Oe(h.repartoConsumo,h.repartoPago,t.store.get("personas")),P=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",I.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(_(I.flexAnual))}/año</span>`:"",Math.abs(I.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${I.ssPct.toFixed(2)}%</span>`:"",E?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(E)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${P}</div>
      </div>
      <div class="num">${m(_(I.brutoAnual))}
        ${I.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(_(I.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(_(I.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${I.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${h.irpfModo==="manual"?`${m(h.irpfPct??0)}% (manual)`:`${I.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var M;return((M=t.store.get("accounts").find(A=>A._id===(h||"default")))==null?void 0:M.nombre)??(h||"default")};function c(h,M,A){const I=M.reduce((P,w)=>P+(w.bruto||0),0),$=di(M,A),E=I>0?$/I*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(_(I))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${E.toFixed(1)}%</strong> (${m(_($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${M.map(P=>i(P,M,A)).join("")}
      </div>
    </div>`}function d(h){const M=s(),A=t.store.get("personas"),I=ie(A),$=[...t.store.get("nominas")].sort((S,F)=>(F.bruto||0)-(S.bruto||0)),E=o?$.filter(S=>Ce(S.repartoConsumo,S.repartoPago,I).has(o)):$,{grupos:P,sueltas:w}=fi(E),y=t.store.get("accounts").filter(Si),C=$.filter(S=>S.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n(A)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${E.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...P.entries()].map(([S,F])=>c(S,F,M)).join("")}
      ${w.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${w.map(S=>i(S,null,M)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Ai(y,C,M,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),l=()=>document.getElementById("modal-content"),u=()=>{var h;return(h=p())==null?void 0:h.classList.add("hidden")};function v(h,M){const A=p(),I=l();return!A||!I?null:(I.innerHTML=`<div class="modal-title">${m(h)}</div>${M}`,A.classList.remove("hidden"),z(I,"[data-cancelar]",u),I)}function g(h,M){const A=h?t.store.get("nominas").find(P=>P._id===h)??null:null,I=[...(A==null?void 0:A.retribucionFlexible)??[]].map(P=>({...P})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},E=v(h?"Editar nómina":"Nueva nómina",$i(A,$));E&&(wi(E,I,$,h??""),z(E,"[data-guardar-nomina]",P=>{const w=ho(E,I);if(!w.nombre||w.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const y=P.getAttribute("data-guardar-nomina")||"",C={...w,activo:!0,tags:["nomina"]};y?(t.store.updateItem("nominas",y,C),q("Nómina actualizada")):(t.store.addItem("nominas",C),q("Nómina creada")),e(),u(),M()}))}function b(h,M){const A=h?t.store.get("accounts").find(E=>E._id===h)??null:null,I=[...(A==null?void 0:A.planAportaciones)??[]].map(E=>({...E})),$=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Pi(A,{nominas:t.store.get("nominas"),hoy:a()}));$&&(_i($,I,a()),z($,"[data-guardar-pension]",E=>{const{datos:P,error:w}=Fi($,I,A,a());if(w)return q(w,"err");const y=E.getAttribute("data-guardar-pension")||"";y?(t.store.updateItem("accounts",y,P),q("Plan actualizado")):(t.store.addItem("accounts",P),q("Plan creado")),e(),u(),M()}))}function x(h,M,A){z(h,"[data-persona-tab]",I=>{o=I.getAttribute("data-persona-tab")||null,M()}),z(h,"[data-nueva-nomina]",()=>g(null,M)),z(h,"[data-editar-nom]",I=>g(I.getAttribute("data-editar-nom"),M)),z(h,"[data-borrar-nom]",I=>{ot("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",I.getAttribute("data-borrar-nom")),q("Eliminada"),e(),M())}),U(h,"[data-activo-nom]",I=>{const $=I;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),e(),M()}),z(h,"[data-tramos]",()=>A.abrir()),z(h,"[data-nueva-pension]",()=>b(null,M)),z(h,"[data-editar-pension]",I=>b(I.getAttribute("data-editar-pension"),M)),z(h,"[data-borrar-pension]",I=>{ot("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",I.getAttribute("data-borrar-pension")),q("Plan eliminado"),e(),M())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Di,mount(h){const M=()=>d(h);f??(f=Ii({store:t.store,onDatosCambiados:()=>{e(),M()},año:()=>Number(a().slice(0,4))})),d(h),h.dataset.wired!=="1"&&(x(h,M,f),h.dataset.wired="1")}}}const zi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",ji="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",xo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},qi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Ni(t,a){const e=t.filter(c=>c.activo&&rt(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const d=re(c,a);d&&(o+=d.saldo,n+=d.costBase,s+=d.plusvalia,i+=d.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(_(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(_(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${m(_(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(_(i))}</div><div class="stat-sub">Neto: ${m(_(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Ri(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(O(o).getTime()-O(e).getTime())/(30.44*864e5)),s=Bt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(gt(a.inflacion,e,o)-1),d=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(_(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${d>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(_(d))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(_(i))}</span>
    </div>${r}
  </div>`}function Li(t,a){const e=xo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),s=n.reduce((v,g)=>v+g.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,d=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),p=pi(d,a.tramosIRPF),l=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(_(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(_(i))}/año${r?` ⚠ excede límite ${m(_(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(_(o))}/año</span></div>`:""}
    ${l>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(_(l))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(_(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ki(t){const a=Ae(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(_(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(_(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(_(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(_(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function Oi(t,a){const e=re(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=O(o.dashboardStart),i=O(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,d=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+d,r)):Math.max(0,c),l=e.costBase+n.totalAportaciones,u=Math.max(0,p-l),v=Se(u,a.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",x=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(E,P,w)=>E.map(y=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${P} ${m(y.contraparte)}: ${m(y.concepto)}</span>
          <span class="num ${w}">${m(_(y.total))} · ${y.ocurrencias} mov.</span>
        </div>`).join(""),M=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(_(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(_(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(_(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',A=a.invModo(t._id),I=E=>`padding:3px 10px;border-radius:20px;border:1px solid ${E?"var(--accent)":"var(--border)"};background:${E?"var(--accent-dim)":"transparent"};color:${E?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=A==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(_(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(_(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(_(e.neto))}</div><div class="stat-sub">${m(x)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(_(l))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(_(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(_(p-v))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${I(A==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${I(A==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${M}
    </div>`}function Bi(t,a){const e=[...t.historicoSaldos||[]].sort((c,d)=>d.fecha.localeCompare(c.fecha)),o=e[0],n=vt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((xo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${ji}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${zi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(_(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(_(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ri(t,a)}
    ${s==="beneficio"?Li(t,a):""}
    ${s==="pension"?ki(t):""}
    ${s==="inversion"?Oi(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const Hi=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Gi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(_(e.importe))} / ${m(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(e.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="aport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([e,o])=>`<option value="${e}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="aport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Vi(t,a){const e=t?rt(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ee("ac-modelo","Tipo",Hi,e)}
    </div>
    <div class="grid-2 mt-8">
      ${tt("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${tt("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${tt("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${tt("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${ee("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
        </div>
        <div id="ac-inversion-hint"${n(e==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${n(e==="beneficio")}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${ee("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(s=>`<option value="${m(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${m(s)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${m((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ui(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Gi(a))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const d=t.querySelector(r);d&&(d.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),z(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),z(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Yi(t,a,e,o,n){const s=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const x=parseFloat(s(g));return Number.isFinite(x)?x:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const d=s("#ac-modelo")||"cuenta",p=d==="beneficio",l=i("#ac-saldo"),u={nombre:c,saldo:l,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:d,planAportaciones:a,tipoBeneficio:p?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&l<=0)return{datos:u};if(!(o===null||Math.abs(l-o)>.005))return{datos:u};if(d==="inversion"&&l>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?n:u.fechaInicialSaldo??n,cantidad:l-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:l,nota:e?"Actualización manual":"Saldo inicial"}}}function Ge(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:J(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function Wi(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(_(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':m(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${m(a)}|${m(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${m(a)}|${m(r._id)}">✕</button>
      </div>`).join(""),i=e.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${m(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${m(a)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos. Si el arranque de la cuenta es posterior al primer movimiento, lo retrasa hasta él para que no tape la curva.">↻ Recalcular semanal</button>
    </div>
    <div class="text-sm mt-4 mb-8" style="color:var(--text3)">
      ${i>0?`${i} de los puntos son semanales calculados del ledger; el resto los has registrado tú y mandan sobre el saldo.`:"Los puntos que registras aquí anclan el saldo. «Recalcular semanal» añade además un punto por semana con lo que dicen los movimientos."}
    </div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${m(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${m(a)}">Añadir</button>
    </div>`}const wo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ki(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ht;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),z(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,x)=>b.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(wo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(wo(b.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${b.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${b.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(z(g,"[data-editar-tg]",b=>{const x=b.getAttribute("data-editar-tg");l(x==="default"?"default":Number(x))}),z(g,"[data-borrar-tg]",b=>{const x=Number(b.getAttribute("data-borrar-tg"));ot(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==x)),q(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),z(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return q("Año inválido","err");const x=t.store.get("tramosGananciasCapitalHistorico");if(x.some(h=>h.año===b))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...x,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),l(b)}))}function d(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function l(u){var f;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((f=v.find(h=>h.año===u))==null?void 0:f.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${d()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const x=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=d())};z(b,"[data-volver-tg]",c),z(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),x()}),z(b,"[data-tg-borrar]",h=>{p(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),x()}),z(b,"[data-tg-guardar]",()=>{p(b);const h=[...e].sort((M,A)=>M[0]-A[0]);if(h.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(M=>M.año===a?{...M,tramos:h}:M)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Ji=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Qi(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Ji.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Xi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Io(t,a){const e=O(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Zi(t,a,e){const o=Io(e,1)[0],n=a.slice(0,7)<o?a.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function Co(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function tr(t,a){const{inicio:e,fin:o}=Co(a);return Ve(t,e,o)}function Ve(t,a,e){return Gt([t],{start:a,end:e}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function er(t){function a(n,s={}){var P;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:d,hasta:p}=s,l=t.transacciones({estimacionId:n._id}),v=l.length===0&&(((P=n.tags)==null?void 0:P.length)??0)>0?t.transacciones({tags:n.tags}):l,g=d&&p?Zi(d,p,c):Io(c,i),b=new Map(g.map(w=>{const{inicio:y,fin:C}=Co(w);return[w,{inicio:d&&d>y?d:y,fin:p&&p<C?p:C}]})),x=new Map;for(const w of v){const y=b.get(w.fecha.slice(0,7));if(!y||w.fecha<y.inicio||w.fecha>y.fin)continue;const C=w.fecha.slice(0,7);x.set(C,(x.get(C)??0)+Math.abs(w.importeCts)/100)}const f=[];for(const w of g){const y=x.get(w);if(y===void 0)continue;const C=b.get(w),S=V(Ve(n,C.inicio,C.fin));f.push({mes:w,estimado:S,real:V(y),desviacion:V(y-S),precision:Xi(S,y)})}const h=V(f.reduce((w,y)=>w+y.estimado,0)),M=V(f.reduce((w,y)=>w+y.real,0)),A=f.reduce((w,y)=>w+Math.abs(y.estimado),0),I=f.length===0?null:A>0?f.reduce((w,y)=>w+y.precision*Math.abs(y.estimado),0)/A:f.reduce((w,y)=>w+y.precision,0)/f.length,$=f.slice(-r),E=$.length>0?V($.reduce((w,y)=>w+y.real,0)/$.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:h,realTotal:M,desviacionTotal:V(M-h),precision:I,mediaRealReciente:E,infraestimada:M>h}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:V(r.estimado),realTotal:V(r.real),desviacionTotal:V(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function ar(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function or(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function nr(t,a,e,o){const n=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return or(e,o).map(r=>{const c={desde:`${r}-01`,hasta:ar(r)},d=b=>V(t.transacciones({...c,tipo:b}).reduce((x,f)=>x+Math.abs(f.importeCts)/100,0)),p=b=>V(b.reduce((x,f)=>x+tr(f,r),0)),l=p(s),u=d("gasto"),v=p(i),g=d("ingreso");return{mes:r,estimado:l,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:V(v-l),netoReal:V(g-u)}})}const me=640,Lt=200,Q={top:14,right:16,bottom:26,left:54};function sr(t){return te(t).slice(0,3)}const ir={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function rr(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=ir[a],o=t.flatMap(x=>[e(x).estimado,e(x).real]),n=me-Q.left-Q.right,s=Lt-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,d=x=>Q.left+(t.length===1?n/2:x/(t.length-1)*n),p=x=>Q.top+s-(x-r)/c*s,l=t.map((x,f)=>`${d(f)},${p(e(x).estimado)}`).join(" "),u=t.map((x,f)=>`${d(f)},${p(e(x).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${p(0).toFixed(1)}" x2="${me-Q.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((x,f)=>`<circle cx="${d(f).toFixed(1)}" cy="${p(e(x).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(te(x.mes))}: ${m(_(e(x).real))}</title></circle>`).join(""),b=t.map((x,f)=>`<text x="${d(f).toFixed(1)}" y="${Lt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(sr(x.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${me} ${Lt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${Lt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${Lt-Q.bottom}" x2="${me-Q.right}" y2="${Lt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Q.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(_(i))}</text>
      ${v}
      <polyline points="${l}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const So={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function cr(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Ao(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:oe(Ao(t,5)).desde,intervaloHasta:oe(t).hasta,comparativa:"neto"}}function Ue(t,a,e,o){const n=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function oe(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ao(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Ye(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:oe(e).desde,hasta:oe(o).hasta}}function lr(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function We(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function dr(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function ur(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(_(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(_(J(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(_(J(t.diferenciaCts)))}</strong></span>
    </div>`}function pr(t,a){const{ledger:e}=t,o=(t.hoy??K)(),n=t.accounts().filter(y=>y.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?Ye(a.periodoDesde,a.periodoHasta):i?lr(a.intervaloDesde,a.intervaloHasta):oe(a.mes),d={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(d),l=t.estimaciones().filter(y=>y.tipo!=="transferencia"),u=[...l.map(y=>({_id:y._id,etiqueta:`${m(y.concepto)} (${m(_(y.cuantia))})`})),...t.loans().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Préstamo: ${m(y.nombre)}`})),...t.nominas().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Nómina: ${m(y.nombre)}`}))],v=p.filter(y=>y.tipo!=="transferencia"&&y.importeCts<0).reduce((y,C)=>y+C.importeCts,0),g=p.filter(y=>y.tipo!=="transferencia"&&y.importeCts>0).reduce((y,C)=>y+C.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),x=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=n.map(y=>`<option value="${m(y._id)}"${y._id===a.cuentaId?" selected":""}>${m(y.nombre)}</option>`).join(""),h=y=>'<option value="">— sin asignar —</option>'+u.map(C=>`<option value="${m(C._id)}"${C._id===y?" selected":""}>${C.etiqueta}</option>`).join(""),M=y=>Object.keys(So).map(C=>`<option value="${C}"${C===y?" selected":""}>${So[C]}</option>`).join(""),A=p.map(y=>{var C;return`
      <tr data-tx="${m(y._id)}" style="border-bottom:1px solid var(--border)${y.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(y.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(y.concepto)}</td>
        <td style="padding:7px 8px">${Re(y.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(((C=t.accounts().find(S=>S._id===y.cuentaId))==null?void 0:C.nombre)??y.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(y._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${M(y.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(y._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(y.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${ft(J(y.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(y._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(y._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),I=i?nr(e,l,r,c):[],$=s?e.transacciones({desde:r,hasta:c}):[],P=(s?We(p):[]).map(y=>{const C=a.detalleAbierto.has(y.concepto),S=C?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${Re(y.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(y.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(y.concepto)}">Asignar</button>
               </div>
               ${ur(dr(y,$))}
             </td>
           </tr>`:"",F=C?y.movimientos.map(D=>{var j;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(D.fecha)}</span> · ${m(((j=t.accounts().find(T=>T._id===D.cuentaId))==null?void 0:j.nombre)??D.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(D._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(D.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${ft(J(D.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(y.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(y.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${C?"▾":"▸"}</button>
          <span style="font-size:13px">${m(y.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${y.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(y.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${y.movimientos.length} movimientos del grupo de golpe">${h(y.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${ft(J(y.total))}</td>
        <td></td>
      </tr>${S}${F}`}).join(""),w=x.slice().reverse().slice(0,8).map(y=>{var C;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(y.fecha)}</span>
        <span style="color:var(--text3)">${m(((C=t.accounts().find(S=>S._id===y.cuentaId))==null?void 0:C.nombre)??y.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(_(J(y.saldoCts)))}</span>
        ${y.nota?`<span style="color:var(--text3)">${m(y.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(y._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${a.vista==="mensual"?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">Mes</button>
            <button class="btn-secondary btn-sm" data-acc-vista="intervalo" style="${i?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Elige un rango de fechas concreto, aunque cruce varios meses">Intervalo</button>
            <button class="btn-secondary btn-sm" data-acc-vista="agrupado" style="${s?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Agrupa los gastos que se repiten con el mismo concepto en un periodo, para asignarles la estimación de golpe">Agrupar por concepto</button>
          </div>
        </div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${f}</select>
          </div>
          ${s?`<div class="form-group" style="margin:0">
                   <label class="form-label">Desde</label>
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${m(a.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${m(a.periodoHasta)}" style="width:140px"/>
                 </div>`:i?`<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${m(a.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${m(a.intervaloHasta)}" style="width:150px"/>
                   </div>`:`<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${m(a.mes)}" style="width:140px"/>
                   </div>`}
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${m(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${ft(J(v))}</span>
          <span>Ingresos: ${ft(J(g))}</span>
          <span>Neto: ${ft(J(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(_(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               <div style="overflow-x:auto">
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Repeticiones</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Total</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${P||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>`:`<div style="overflow-x:auto">
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Tipo</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${A||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${Ue("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${Ue("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${Ue("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${rr(I,a.comparativa)}`:""}`}
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${m(o)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
                <option value="transferencia">Transferencia entre mis cuentas</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Concepto</label><input class="form-input" type="text" id="nt-concepto" placeholder="Compra supermercado"/></div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="nt-importe" step="0.01" min="0" placeholder="0,00"/></div>
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${f}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(y=>`<option value="${m(y)}"></option>`).join("")}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${h(null)}</select>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${m(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${f}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${w?`<div class="mt-12">${w}</div>`:""}
        </div>
      </div>
    </div>`}function mr(t,a,e,o){const{ledger:n}=a;U(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),U(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()}),z(t,"[data-acc-vista]",i=>{e.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),U(t,"#acc-periodo-desde",i=>{e.periodoDesde=i.value||e.periodoDesde,o()}),U(t,"#acc-periodo-hasta",i=>{e.periodoHasta=i.value||e.periodoHasta,o()}),z(t,"[data-acc-comparativa]",i=>{e.comparativa=i.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",i=>{e.intervaloDesde=i.value||e.intervaloDesde,o()}),U(t,"#acc-intervalo-hasta",i=>{e.intervaloHasta=i.value||e.intervaloHasta,o()}),z(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");e.detalleAbierto.has(r)?e.detalleAbierto.delete(r):e.detalleAbierto.add(r),o()}),U(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:d,hasta:p}=Ye(e.periodoDesde,e.periodoHasta),l=n.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:p,texto:e.filtroTexto||void 0}),u=We(l).find(v=>v.concepto===r);if(u){for(const v of u.movimientos)n.asignarEstimacion(v._id,c);q(`Estimación asignada a ${u.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),z(t,"[data-grp-tags-asignar]",i=>{var g;const r=i.getAttribute("data-grp-tags-asignar"),c=((g=i.closest("tr"))==null?void 0:g.querySelector("[data-grp-tags]"))??null,d=((c==null?void 0:c.value)??"").split(",").map(b=>b.trim().toLowerCase()).filter(Boolean);if(d.length===0)return q("Escribe al menos una etiqueta","err");const{desde:p,hasta:l}=Ye(e.periodoDesde,e.periodoHasta),u=n.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:l,texto:e.filtroTexto||void 0}),v=We(u).find(b=>b.concepto===r);if(v){for(const b of v.movimientos)n.actualizar(b._id,{tags:[...new Set([...b.tags,...d])]});q(`Etiquetas añadidas a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),z(t,"#nt-guardar",()=>{const i=ct(t,"#nt-concepto").trim(),r=lo(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const c=ct(t,"#nt-tags").split(",").map(d=>d.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(a.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),q("Movimiento registrado"),a.onDatosCambiados(),o()}),z(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;ot("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),a.onDatosCambiados(),o())}),z(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(l=>l._id===r);if(!c)return;const d=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(J(c.importeCts))));if(d===null)return;const p=parseFloat(d.replace(",","."));if(!Number.isFinite(p)||p<=0)return q("Importe no válido","err");n.actualizar(r,{importe:p}),q("Movimiento actualizado"),a.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),a.onDatosCambiados()}),U(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),q("Tipo actualizado"),a.onDatosCambiados(),o()}),z(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=lo(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(a.hoy??K)(),r,ct(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),a.onDatosCambiados(),o()}),z(t,"[data-pc-borrar]",i=>{ot("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ke(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=V(t.mediaRealReciente),i=V(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:V(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function fr(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??K(),d=t.get("expenses"),p=d.find(g=>g._id===s);if(!p)throw new Error(`La estimación ${s} no existe`);const l={...p,fechaFin:c},u={...p,_id:a(),cuantia:V(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=d.map(g=>g._id===s?l:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:l,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const d of s)try{r.push(e(d.estimacionId,d.cuantiaSugerida,i))}catch(p){c.push({estimacionId:d.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const d=[];let p=c;const l=new Set;for(;p!=null&&p.ajustadaDesdeId&&!l.has(p._id);){l.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;d.unshift(b),p=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find(x=>x.ajustadaDesdeId===v._id&&!g.has(x._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...d,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Je(t){var n;const a=t.estimaciones(),e=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(a.map(s=>[s._id,s]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:Ke(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function gr(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function vr(t){var c;const a=Je(t),e=a.filter(d=>d.analisis.precision!==null),o=a.filter(d=>d.sugerencia!==null),n=t.precision.analizarPorTag(a.map(d=>d.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(c=t.rango)!=null&&c.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:d,estimacion:p,sugerencia:l})=>{const u=d.meses.slice(-6).map(v=>`${te(v.mes)}: ${_(v.estimado)} → ${_(v.real)} (${v.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${m(p.concepto)}</div>
          <div style="margin-top:3px">${Re(d.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${m(u)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(_(d.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(_(d.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${ft(d.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${co(d.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${l?`<button class="btn-secondary" data-sugerir="${m(d.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${m(l.motivo)}">Sugerir ajuste → ${m(_(l.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(d=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(d.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${d.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(d.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(d.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${ft(d.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${co(d.precision)}</td>
      </tr>`).join(""),r=(d,p="left")=>`<th style="padding:7px 8px;text-align:${p};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${d}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Precisión de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm mb-10" style="color:var(--text2);line-height:1.6">
        ${gr(t)} Al ajustar, la
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
    </div>`}function br(t,a,e){z(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Je(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${_(i.cuantiaActual)}
Nueva estimación: ${_(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;ot(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),q(`Estimación ajustada a ${_(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),z(t,"#ajustar-todas",()=>{const o=Je(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${_(r.cuantiaActual)} → ${_(r.cuantiaSugerida)}`).join(`
`);if(!ot(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const hr=[";",",","	","|"],yr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function fe(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ge(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function $r(t){let a=";",e=-1;for(const o of hr){const n=t.slice(0,20).map(c=>ge(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function ne(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const p=s===","?o:n;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),d=Number(i||"0")*100+Number(c);return Number.isFinite(d)?e?-d:d:null}function Qe(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return Mo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),Mo(o,Number(e[2]),Number(e[1]))}return null}function Mo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Eo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Qe(e)!==null).length/a.length}function Po(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ne(e)!==null).length/a.length}function xr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=fe(t[i]);if(r&&yr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&fe(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Eo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||fe(t[r]).includes("saldo"))continue;const c=Po(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(Po(c)>.5||Eo(c)>.5)continue;const d=c.reduce((p,l)=>p+l.length,0)/Math.max(1,c.length);d>i&&(i=d,s=r)}s>=0&&(e.concepto=s)}return e}function wr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=$r(a),o=a.map(p=>ge(p,e).length),n=Math.max(...o);let s=o.findIndex(p=>p===n);s<0&&(s=0);const i=ge(a[s],e);let r=a.slice(s+1).map(p=>ge(p,e));const c=Qe(i[0]??"")!==null||i.some(p=>ne(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const d=xr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,l)=>`Columna ${l+1}`):i,filas:r,lineaCabecera:s+1,mapeo:d}}function _o(t,a,e){return`${t}|${a}|${fe(e).replace(/\s+/g," ")}`}function Ir(t,a,e=[]){const o=new Set(e.map(s=>_o(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?Qe(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let d=null;if(a.importe>=0)d=ne(s[a.importe]??""),d===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?ne(s[a.debe]??""):null,v=a.haber>=0?ne(s[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?d=-Math.abs(u):v!==null&&v!==0?d=Math.abs(v):d=0}else r.push("sin columna de importe");d===0&&r.push("importe cero");const p=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let l=!1;if(c&&d!==null){const u=_o(c,d,p);l=o.has(u)||n.has(u),n.add(u)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:d,errores:r,duplicada:l}})}function Cr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ve(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Sr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Xe(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Ir(a.analisis,a.mapeo,e)}function Ar(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <div class="flex gap-8">
            <button class="btn-secondary btn-sm" data-imp-sincronizar title="Vuelve a borrar los históricos manuales dentro del rango ya importado de cada cuenta, sin subir nada nuevo">↻ Sincronizar históricos</button>
            <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
          </div>
        </div>
      </div>`;const o=e.map(n=>`<option value="${m(n._id)}"${n._id===a.cuentaId?" selected":""}>${m(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${a.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${m(a.error)}</div></div>`:""}

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

      ${a.analisis&&a.mapeo?Er(a,a.analisis,a.mapeo):Mr()}
    </div>`}function Mr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Er(t,a,e){const o=Cr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,d)=>`<option value="${d}"${d===r?" selected":""}>${m(c||`Columna ${d+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Sr.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${m(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${n(e[r.clave])}</select>
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
        <div class="stat-value" style="font-size:1.15rem">${ft(J(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${m(o.desde)} → ${m(o.hasta??"")}`:"—"}</div>
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
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${m(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,d=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(_(J(r.importeCts)))}</td>
                <td style="font-size:11px;color:${p}">${m(d)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Pr(t,a,e,o){z(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return q("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var l;return((l=a.accounts().find(u=>u._id===p))==null?void 0:l.nombre)??p},r=s.reduce((p,l)=>p+l.eliminados,0),c=s.reduce((p,l)=>p+l.semanales,0),d=s.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");q(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${d}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),z(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,ve(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),z(t,"[data-imp-cerrar]",()=>{Object.assign(e,ve()),o()}),U(t,"#imp-cuenta",s=>{e.cuentaId=s.value,Xe(a,e),o()}),U(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),Xe(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&_r(s).then(r=>{const c=wr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},Xe(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),z(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(d=>d.errores.length===0&&(e.incluirDuplicadas||!d.duplicada));if(s.length===0)return;for(const d of s)a.ledger.registrar({fecha:d.fecha,cuentaId:e.cuentaId,importe:Math.abs(J(d.importeCts)),tipo:d.importeCts<0?"gasto":"ingreso",concepto:d.concepto,origen:"importado"});const i=s.map(d=>d.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,ve()),a.onDatosCambiados(),o()})}function _r(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function Fr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Dr(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function Tr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Fo(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const d=(c.tags??[]).filter(p=>s.tags.includes(p)).length;d!==0&&(d>r||d===r&&i&&c._id<i._id)&&(i=c,r=d)}i&&o.get(i._id).push(s)}return o}function zr(t,a,e,o={}){const{desde:n,hasta:s}=Fr(e);return{...Do(t,a,n,s,o),mes:e}}function Do(t,a,e,o,n={}){const s=t.transacciones({desde:e,hasta:o}),i=s.filter(C=>C.tipo!=="transferencia"&&C.importeCts<0),r=s.filter(C=>C.tipo!=="transferencia"&&C.importeCts>0),c=new Map((n.analisis??[]).map(C=>[C.estimacionId,C])),d=C=>a.filter(S=>S.tipo===C&&S.activo!==!1),p=C=>new Set(C.filter(S=>t.transacciones({estimacionId:S._id}).length>0).map(S=>S._id)),l=d("gasto"),u=d("ingreso"),v=Fo(i,l,C=>p(l).has(C)),g=Fo(r,u,C=>p(u).has(C)),b=new Set,x=new Set,f=(C,S,F,D)=>{for(const B of F)D.add(B._id);const j=V(F.reduce((B,N)=>B+Math.abs(N.importeCts)/100,0)),T=V(Ve(C,e,o)),R=c.get(C._id);return{estimacionId:C._id,concepto:C.concepto,tipo:S,tags:C.tags??[],estimado:T,real:j,desviacion:V(j-T),sinMovimiento:F.length===0,sugerencia:R?Ke(R,C.cuantia,{hoy:n.hoy}):null}},h=l.map(C=>f(C,"gasto",v.get(C._id)??[],b)),M=u.map(C=>f(C,"ingreso",g.get(C._id)??[],x)),A=(C,S)=>{const F=new Map;for(const D of C){if(S.has(D._id))continue;const j=Tr(D.concepto),T=F.get(j)??{concepto:D.concepto,total:0,movimientos:0};T.total=V(T.total+Math.abs(D.importeCts)/100),T.movimientos+=1,F.set(j,T)}return[...F.values()].sort((D,j)=>j.total-D.total)},I=A(i,b),$=A(r,x),E=V(h.reduce((C,S)=>C+S.estimado,0)),P=V(i.reduce((C,S)=>C+Math.abs(S.importeCts)/100,0)),w=V(M.reduce((C,S)=>C+S.estimado,0)),y=V(r.reduce((C,S)=>C+S.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:E,real:P,desviacion:V(P-E),ingresosEstimados:w,ingresosReales:y,desviacionIngresos:V(y-w),netoEstimado:V(w-E),netoReal:V(y-P),desviacionNeta:V(y-P-(w-E)),filas:[...h,...M].sort((C,S)=>Math.abs(S.desviacion)-Math.abs(C.desviacion)),sinEstimacion:I,totalSinEstimacion:V(I.reduce((C,S)=>C+S.total,0)),ingresosSinPrever:$,totalIngresosSinPrever:V($.reduce((C,S)=>C+S.total,0)),vacio:s.length===0}}function To(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function jr(){return{mes:"",modo:"mes"}}function zo(t,a){if(a.mes)return a.mes;const e=To(t.ledger),o=Dr((t.hoy??K)());return e.includes(o)?o:e[0]??o}function Ze(t,a){const e=(t.hoy??K)(),o=t.estimaciones();if(a.modo==="periodo"){const{desde:s,hasta:i}=t.periodo(),r=t.precision.analizarTodas(o,{hoy:e,desde:s,hasta:i});return Do(t.ledger,o,s,i,{analisis:r,hoy:e})}const n=t.precision.analizarTodas(o,{hoy:e});return zr(t.ledger,o,zo(t,a),{analisis:n,hoy:e})}function jo(t,a,e,o){const n=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function qr(t,a){const e=a.modo==="periodo",o=zo(t,a),n=To(t.ledger);n.includes(o)||n.unshift(o);const s=Ze(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(s.desde)} al ${m(s.hasta)}`:m(te(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${jo("mes",!e,"Mes","Cierra un mes natural completo")}
      ${jo("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(s.desde)} → ${m(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(l=>`<option value="${m(l)}"${l===o?" selected":""}>${m(te(l))}</option>`).join("")}
             </select>`}
    </div>`;if(s.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${i}</div>
          ${c}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${e?"":"en "}${r}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;const d=l=>l>0?"+":"",p=s.desviacionNeta<0?"var(--red)":s.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(_(s.real))}</div>
          <div class="stat-sub">previsto ${m(_(s.estimado))} · ${d(s.desviacion)}${m(_(s.desviacion))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(_(s.ingresosReales))}</div>
          <div class="stat-sub">previsto ${m(_(s.ingresosEstimados))} · ${d(s.desviacionIngresos)}${m(_(s.desviacionIngresos))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${d(s.desviacionNeta)}${m(_(s.desviacionNeta))}</div>
          <div class="stat-sub">neto real ${m(_(s.netoReal))} · previsto ${m(_(s.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(_(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""} de gasto${s.totalIngresosSinPrever>0?` · ${m(_(s.totalIngresosSinPrever))} de ingreso`:""}</div>
        </div>
      </div>

      ${Nr(s)}
      ${Rr(s)}
      ${Lr(s)}
    </div>`}function Nr(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
    <div class="card-title mb-8">Dónde te desviaste (gastos e ingresos)</div>
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
          ${a.map(o=>{const n=o.tipo==="gasto"?o.desviacion>0:o.desviacion<0,s=o.desviacion===0?"var(--text2)":n?"var(--red)":"var(--accent)",i=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${m(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
                  ${o.desviacion>0?"+":""}${m(_(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar la estimación de ${m(_(i.cuantiaActual))} a ${m(_(i.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${m(_(i.cuantiaSugerida))}</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${e.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${e.length} estimación${e.length!==1?"es":""} se desvía${e.length!==1?"n":""}
               de forma sistemática. Ajustarla cierra la estimación de hoy y abre una nueva con el importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function Rr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto estaba previsto</div>
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
          ${t.sinEstimacion.slice(0,10).map(a=>`<tr>
                <td style="font-size:12px">${m(a.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${a.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${m(_(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Lr(t){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:320px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Movimientos</th>
          <th style="cursor:default;text-align:right">Total</th>
        </tr></thead>
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(a=>`<tr>
                <td style="font-size:12px">${m(a.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${a.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--accent)">${m(_(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function kr(t,a,e,o){U(t,"#cie-mes",n=>{e.mes=n.value,o()}),z(t,"[data-cie-modo]",n=>{e.modo=n.getAttribute("data-cie-modo")||"mes",o()}),z(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Ze(a,e).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??K)()}),q(`«${r.concepto}» ajustada a ${_(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),z(t,"[data-cie-ajustar-todas]",()=>{const s=Ze(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??K)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const Or="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Br(t){const a=t.hoy??K,e=()=>{var T;return(T=t.onDatosCambiados)==null?void 0:T.call(t)},o=new Map;let n="cuentas";const s=cr(a().slice(0,7)),i=ve(),r=jr(),c=()=>t.store.get("expenses"),d=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:d,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},l={ledger:t.ledger,accounts:d,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},x=T=>{var R;return((R=t.store.get("accounts").find(B=>B._id===T))==null?void 0:R.nombre)??T},f=()=>Ut(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??It)(Number(a().slice(0,4))),h=()=>Ut(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Ht),M=()=>h()(Number(a().slice(0,4)));function A(){const T=u(),R=t.store.get("accounts"),B=Pa({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:R,config:{dashboardStart:T.dashboardStart,dashboardEnd:T.dashboardEnd,fechaReferencia:T.dashboardStart},nominas:[],resolverTramosGanancias:h()}),N=new Map,H=k=>{let G=N.get(k);return G||(G={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},N.set(k,G)),G},L=(k,G)=>{const Z=`${G.sourceId}`,et=k.find(na=>na.concepto===Z),nt=et??{concepto:Z,contraparte:"",total:0,ocurrencias:0};nt.total+=Math.abs(G.cuantia),nt.ocurrencias+=1,et||k.push(nt)};for(const k of B){if(!k.cuenta)continue;const G=H(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(G.totalAportaciones+=Math.abs(k.cuantia),L(G.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(G.totalReembolsos+=Math.abs(k.cuantia),L(G.salidas,k)):k.sourceType==="investment-tax"&&(G.retencion+=Math.abs(k.cuantia))}const Y=t.store.get("expenses");for(const k of N.values())for(const[G,Z]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const et of G){const nt=Y.find(na=>na._id===et.concepto);et.contraparte=x((nt==null?void 0:nt[Z])??"default"),et.concepto=(nt==null?void 0:nt.concepto)||(Z==="cuenta"?"Aportación":"Reembolso")}return N}function I(T){const R=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let B;if(n==="cuentas"){const L=t.store.get("accounts").filter(G=>rt(G)!=="pension"),Y=A(),k={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:M(),flujos:G=>Y.get(G)??qi,invModo:G=>o.get(G)??"proyeccion"};B=`${Ni(L,k.tramosGanancias)}<div class="grid-3">${L.map(G=>Bi(G,k)).join("")}</div>`}else n==="movimientos"?B='<div id="acc-tx"></div>':n==="importar"?B='<div id="acc-import"></div>':B='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';T.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${R}
      </div>
      ${Qi(n)}
      ${B}`;const N=()=>I(T);if(n==="movimientos"){const H=T.querySelector("#acc-tx");H.innerHTML=pr(p,s),mr(H,p,s,N)}else if(n==="importar"){const H=T.querySelector("#acc-import");H.innerHTML=Ar(l,i),Pr(H,l,i,N)}else if(n==="cierre"){const H=T.querySelector("#acc-cierre"),L=T.querySelector("#acc-precision");H.innerHTML=qr(g,r),L.innerHTML=vr(b),kr(H,g,r,N),br(L,b,N)}}const $=()=>document.getElementById("modal-overlay"),E=()=>document.getElementById("modal-content"),P=()=>{var T;return(T=$())==null?void 0:T.classList.add("hidden")};function w(T,R){const B=$(),N=E();return!B||!N?null:(N.innerHTML=T?`<div class="modal-title">${m(T)}</div>${R}`:R,B.classList.remove("hidden"),z(N,"[data-cancelar]",P),N)}function y(T,R){const B=T?t.store.get("accounts").find(Y=>Y._id===T)??null:null,N=[...(B==null?void 0:B.planAportaciones)??[]].map(Y=>({...Y})),H=B?C(B):null,L=w(T?"Editar cuenta / fondo":"Nueva cuenta / fondo",Vi(B,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:H??0}));L&&(Ui(L,N,a()),z(L,"[data-guardar-acc]",Y=>{const k=Y.getAttribute("data-guardar-acc")||"",{datos:G,punto:Z,error:et}=Yi(L,N,B,H,a());if(et)return q(et,"err");let nt=k;k?t.store.updateItem("accounts",k,G):nt=t.store.addItem("accounts",G)._id,Z&&t.ledger.registrarPuntoControl(nt,Z.fecha,Z.saldo,Z.nota),q(k?"Actualizada":"Cuenta / fondo creado"),e(),P(),R()}))}function C(T){const R=t.ledger.puntosControl(T._id);return R.length>0?Ge(R)[0].saldo:T.saldo??null}function S(T,R){const B=t.store.get("accounts").find(L=>L._id===T);if(!B)return;const N=w("Histórico de saldos",Wi(B.nombre,T,Ge(t.ledger.puntosControl(T)),B.saldoInicial||0,a()));if(!N)return;const H=()=>{R(),S(T,R)};z(N,"[data-hist-anadir]",()=>{var G,Z,et;const L=((G=N.querySelector("#hi-fecha"))==null?void 0:G.value)??"",Y=parseFloat(((Z=N.querySelector("#hi-saldo"))==null?void 0:Z.value)??""),k=((et=N.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!L||!Number.isFinite(Y))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(T,L,Y,k||void 0),q("Punto añadido"),e(),H()}),z(N,"[data-hist-borrar]",L=>{const[,Y]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),q("Eliminado"),e(),H()}),z(N,"[data-hist-semanal]",L=>{const Y=L.getAttribute("data-hist-semanal"),k=t.ledger.generarPuntosSemanales(Y);q(k>0?`Histórico con ${k} punto${k!==1?"s":""} semanal${k!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),H()}),z(N,"[data-hist-inicial]",L=>{const[Y,k]=(L.getAttribute("data-hist-inicial")||"").split("|"),G=t.ledger.puntosControl(Y).find(et=>et._id===k);if(!G)return;const Z=Ge([G])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:Z,fechaInicialSaldo:G.fecha}),q(`Punto inicial → ${G.fecha} (${_(Z)})`),e(),H()})}function F(T){const R=t.store.get("accounts").filter(H=>H.activo);if(R.length===0)return q("No hay cuentas activas","err");const B=a(),N=R.map(H=>`• ${H.nombre}: ${_(C(H)??H.saldoInicial??0)}`).join(`
`);if(ot(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${B})?

${N}

Esto recalibra el punto de arranque del dashboard.`)){for(const H of R)t.store.updateItem("accounts",H._id,{saldoInicial:C(H)??H.saldoInicial??0,fechaInicialSaldo:B});q("Saldo base actualizado"),e(),T()}}function D(T,R,B){z(T,"[data-cuentas-tab]",N=>{n=N.getAttribute("data-cuentas-tab")||"cuentas",R()}),z(T,"[data-nueva-acc]",()=>y(null,R)),z(T,"[data-editar-acc]",N=>y(N.getAttribute("data-editar-acc"),R)),z(T,"[data-tramos-ganancias]",()=>B.abrir()),z(T,"[data-reset-base]",()=>F(R)),z(T,"[data-hist-acc]",N=>S(N.getAttribute("data-hist-acc"),R)),z(T,"[data-principal-acc]",N=>{const H=N.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===H}))),q("Cuenta marcada como principal"),e(),R()}),z(T,"[data-borrar-acc]",N=>{const H=N.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!ot("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",H);const Y=t.store.get("accounts");Y.length>0&&!Y.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",Y.map((k,G)=>G===0?{...k,esCuentaPrincipal:!0}:k)),q("Cuenta eliminada"),e(),R()}),z(T,"[data-inv-modo]",N=>{const[H,L]=(N.getAttribute("data-inv-modo")||"").split("|");o.set(H,L==="real"?"real":"proyeccion"),R()})}let j=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:Or,mount(T){const R=()=>I(T);j??(j=Ki({store:t.store,onDatosCambiados:()=>{e(),R()},año:()=>Number(a().slice(0,4))})),I(T),T.dataset.wired!=="1"&&(D(T,R,j),T.dataset.wired="1")}}}function qo(t,a,e=!1){const o=Math.abs(it(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function Hr(t){function a(w){return`${w}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(w={}){var C;const y=(C=w.texto)==null?void 0:C.trim().toLowerCase();return t.get("transacciones").filter(S=>!(w.cuentaId&&S.cuentaId!==w.cuentaId||w.desde&&S.fecha<w.desde||w.hasta&&S.fecha>w.hasta||w.tipo&&S.tipo!==w.tipo||w.estimacionId&&S.estimacionId!==w.estimacionId||w.tags&&w.tags.length>0&&!w.tags.some(F=>S.tags.includes(F))||y&&!S.concepto.toLowerCase().includes(y))).sort((S,F)=>S.fecha.localeCompare(F.fecha)||S._id.localeCompare(F._id))}function o(w){const y={_id:a("tx"),fecha:w.fecha,cuentaId:w.cuentaId,importeCts:qo(w.tipo,w.importe,w.negativo),concepto:w.concepto,tags:w.tags??[],estimacionId:w.estimacionId??null,tipo:w.tipo,origen:w.origen??"manual",...w.nota?{nota:w.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),y]),y}function n(w,y){t.set("transacciones",t.get("transacciones").map(C=>{if(C._id!==w)return C;const{importe:S,...F}=y,D={...C,...F};return S!==void 0&&(D.importeCts=qo(D.tipo,S,D.importeCts<0)),D}))}function s(w){t.set("transacciones",t.get("transacciones").filter(y=>y._id!==w))}function i(w,y){n(w,{estimacionId:y})}function r(w){return t.get("puntosControl").filter(y=>!w||y.cuentaId===w).sort((y,C)=>y.fecha.localeCompare(C.fecha))}function c(w){return r(w).filter(y=>y.origen!=="derivado")}function d(w,y,C,S){const F={_id:a("pc"),fecha:y,cuentaId:w,saldoCts:it(C),...S?{nota:S}:{}},D=t.get("puntosControl").filter(j=>!(j.cuentaId===w&&j.fecha===y));return t.set("puntosControl",[...D,F].sort((j,T)=>j.fecha.localeCompare(T.fecha))),u(w),F}function p(w){const y=t.get("puntosControl").find(C=>C._id===w);t.set("puntosControl",t.get("puntosControl").filter(C=>C._id!==w)),y&&(y.origen==="derivado"?x(y.cuentaId):u(y.cuentaId))}function l(w,y,C){const S=D=>D.cuentaId===w&&D.origen!=="derivado"&&D.fecha>=y&&D.fecha<=C,F=t.get("puntosControl").filter(S).length;return F===0?0:(t.set("puntosControl",t.get("puntosControl").filter(D=>!S(D))),x(w),F)}function u(w){var N,H;const y=c(w),C=t.get("transacciones").filter(L=>L.cuentaId===w).sort((L,Y)=>L.fecha.localeCompare(Y.fecha)),S=(N=C[0])==null?void 0:N.fecha,F=(H=C[C.length-1])==null?void 0:H.fecha,D=t.get("puntosControl").filter(L=>!(L.cuentaId===w&&L.origen==="derivado"));if(!S)return t.set("puntosControl",D),x(w),0;const j=[];for(let L=Ot(S);L<=F;L=Ot(ra(L,1)))j.push(L);j[j.length-1]!==F&&j.push(F);const T=new Set(y.map(L=>Ot(L.fecha))),R=L=>{const Y=y.filter(k=>k.fecha<=L).pop();return C.filter(k=>k.fecha<=L&&(!Y||k.fecha>Y.fecha)).reduce((k,G)=>k+G.importeCts,(Y==null?void 0:Y.saldoCts)??0)},B=j.filter(L=>!T.has(Ot(L))).map(L=>({_id:a("pcd"),fecha:L,cuentaId:w,saldoCts:R(L),origen:"derivado"}));return t.set("puntosControl",[...D,...B].sort((L,Y)=>L.fecha.localeCompare(Y.fecha))),v(w,S,R(S)),x(w),B.length}function v(w,y,C){const S=t.get("accounts"),F=S.find(D=>D._id===w);!F||F.fechaInicialSaldo&&F.fechaInicialSaldo<=y||t.set("accounts",S.map(D=>D._id===w?{...D,saldoInicial:J(C),fechaInicialSaldo:y}:D))}function g(w){return(w??[...new Set(t.get("transacciones").map(C=>C.cuentaId))]).reduce((C,S)=>C+u(S),0)}function b(w){const y=t.get("transacciones").filter(F=>F.origen==="importado"&&(!w||F.cuentaId===w)),C=new Map;for(const F of y){const D=C.get(F.cuentaId);D?D.push(F.fecha):C.set(F.cuentaId,[F.fecha])}const S=[];for(const[F,D]of C){D.sort();const j=l(F,D[0],D[D.length-1]);S.push({cuentaId:F,eliminados:j,semanales:u(F)})}return S}function x(w){const y=r(w),C=t.get("accounts");C.some(S=>S._id===w)&&t.set("accounts",C.map(S=>S._id===w?{...S,historicoSaldos:y.map(F=>({_id:F._id,fecha:F.fecha,saldo:J(F.saldoCts),...F.nota?{nota:F.nota}:{}}))}:S))}function f(w,y=K()){const C=c(w).filter(j=>j.fecha<=y).pop(),S=C==null?void 0:C.fecha,F=(C==null?void 0:C.saldoCts)??0;return t.get("transacciones").filter(j=>j.cuentaId===w&&j.fecha<=y&&(S===void 0||j.fecha>S)).reduce((j,T)=>j+T.importeCts,F)}function h(w,y){return J(f(w,y))}function M(w=K(),y){const C=y??t.get("accounts").filter(S=>S.activo).map(S=>S._id);return J(C.reduce((S,F)=>S+f(F,w),0))}function A(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const w=[...t.get("transacciones").map(y=>y.fecha),...t.get("puntosControl").map(y=>y.fecha)];return w.length>0?w.sort().pop()??null:null}function $(w={}){return J(e(w).reduce((y,C)=>y+C.importeCts,0))}function E(w={}){const y=new Map;for(const C of e(w)){const S=C.fecha.slice(0,7);y.set(S,(y.get(S)??0)+C.importeCts)}return new Map([...y.entries()].sort(([C],[S])=>C.localeCompare(S)).map(([C,S])=>[C,J(S)]))}function P(w={}){const y=new Map;for(const C of e(w))for(const S of C.tags.length>0?C.tags:["sin_tag"])y.set(S,(y.get(S)??0)+C.importeCts);return new Map([...y.entries()].map(([C,S])=>[C,J(S)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:d,eliminarPuntoControl:p,eliminarPuntosControlEnRango:l,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:M,tieneDatos:A,ultimaFecha:I,total:$,totalPorMes:E,totalPorTag:P}}function pt(t){return t.trim().toLowerCase()}function Gr(t){function a(){const d=new Map,p=(l,u)=>{const v=pt(l);if(!v)return;const g=d.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,d.set(v,g)};for(const l of t.get("expenses"))for(const u of l.tags??[])p(u,"estimaciones");for(const l of t.get("transacciones"))for(const u of l.tags??[])p(u,"reales");return[...d.values()].sort((l,u)=>u.total-l.total||l.tag.localeCompare(u.tag))}function e(){return a().map(d=>d.tag)}function o(d){return a().filter(p=>d==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function n(d,p,l){const u=pt(p),v=(d??[]).map(pt);if(!v.includes(u))return d??[];const g=v.filter(b=>b!==u);return l===null?[...new Set(g)]:[...new Set([...g,pt(l)])]}function s(d,p){const l=pt(p);if(!l)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(d,l)}function i(d,p){let l=0;for(const u of d)pt(u)!==pt(p)&&(l+=c(u,pt(p)).cambiados);return{cambiados:l}}function r(d){return c(d,null)}function c(d,p){let l=0;const u=t.get("expenses").map(E=>{const P=n(E.tags,d,p);return P!==E.tags&&(l+=1),P===E.tags?E:{...E,tags:P}});t.set("expenses",u);const v=t.get("transacciones").map(E=>{const P=n(E.tags,d,p);return P!==E.tags&&(l+=1),P===E.tags?E:{...E,tags:P}});t.set("transacciones",v);const g=t.get("loans").map(E=>{const P=n(E.tags,d,p);return P!==E.tags&&(l+=1),P===E.tags?E:{...E,tags:P}});t.set("loans",g);const b=t.get("nominas").map(E=>{const P=n(E.tags,d,p);return P!==E.tags&&(l+=1),P===E.tags?E:{...E,tags:P}});t.set("nominas",b);const x=t.get("config"),f=pt(d),h=E=>{const P=(E??[]).map(pt);if(!P.includes(f))return E??[];const w=P.filter(y=>y!==f);return p===null?[...new Set(w)]:[...new Set([...w,p])]},M={},A=h(x.activeTagsFilter),I=h(x.tagCategorias),$=h(x.tagGrupos);return A!==x.activeTagsFilter&&(M.activeTagsFilter=A),I!==x.tagCategorias&&(M.tagCategorias=I),$!==x.tagGrupos&&(M.tagGrupos=$),Object.keys(M).length>0&&t.patchConfig(M),{cambiados:l}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Vr=3;function No(t){return t<.005?0:t}function Ur(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function Yr(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<Vr)continue;const r=Ur(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:No(n),sigmaDeriva:No(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Ro(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:V(e*Math.hypot(n,s))}function Wr(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,d]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-s)*12+(d-i)),l=Ro(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:V(r.saldoAcum+l),abajo:V(r.saldoAcum-l)}})}function Kr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ta="financeapp_session",Jr=["local","dropbox","firebase"];function Qr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Jr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Xr({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const g=n();if(g)try{v?g.setItem(ta,JSON.stringify(v)):g.removeItem(ta)}catch{}}function i(){const v=n();if(!v)return null;try{return Qr(v.getItem(ta))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function d(){const v=i();return v?c()?(s(null),null):v:null}function p(v){const g=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return s(b),b}function l(){const v=i();v&&s({...v,ultimoUso:e()})}function u(){s(null)}return{abrir:p,leer:d,tocar:l,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return d()!==null}}}const Lo=["pointerdown","keydown","visibilitychange"];function Zr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of Lo)s==null||s.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(d(),t.cerrar(),a())},e);function d(){if(i){i=!1,n(c);for(const p of Lo)s==null||s.removeEventListener(p,r)}}return d}const tc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],ec="FinanceApp",ac=new TextEncoder().encode("financeapp-bio-passphrase-v1");function ko(t){return new Uint8Array(new ArrayBuffer(t))}const ea="financeapp_bio_credencial",aa="financeapp_bio_secreto",oa="financeapp_bio_ultimo_desbloqueo",Oo="financeapp_bio_gracia_min",oc=5;function nc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function be(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function he(t){const a=atob(t),e=ko(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function sc(t){return be(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function ic(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return he(a)}function Bo(t){return t.getClientExtensionResults()}function rc(t={}){const a=t.webauthn??nc(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(I=>crypto.getRandomValues(ko(I)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const I=o==null?void 0:o.getItem(ea);if(!I)return null;try{const $=JSON.parse(I);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function d(){return c()!==null}async function p(I){const $=await e.importKey("raw",I,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:ac},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function l(I,$){const E=s(12),P=await e.encrypt({name:"AES-GCM",iv:E},I,new TextEncoder().encode($));return`${be(E)}:${be(P)}`}async function u(I,$){const[E,P]=$.split(":"),w=he(E),y=he(P),C=await e.decrypt({name:"AES-GCM",iv:w},I,y);return new TextDecoder().decode(C)}async function v(I,$){var R,B;if(!I)throw new Error("No hay clave de cifrado que envolver.");const E=s(32),P=s(32),w=s(16),y=await a.create({publicKey:{challenge:P,rp:{name:ec},user:{id:w,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:E}}},timeout:6e4}});if(!y)throw new Error("No se ha podido crear la credencial biométrica.");const C=Bo(y);if(!((R=C.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let S=((B=C.prf.results)==null?void 0:B.first)??null;if(S||(S=await g(y.rawId,E)),!S)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await p(S),D=await l(F,I),j={credencialId:sc(y.rawId),salt:be(E),modo:$,creadaEn:n()},T=i();T.setItem(ea,JSON.stringify(j)),T.setItem(aa,D)}async function g(I,$){var P,w;const E=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:I,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return E?((w=(P=Bo(E).prf)==null?void 0:P.results)==null?void 0:w.first)??null:null}async function b(){const I=c();if(!I)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(aa);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const E=await g(ic(I.credencialId).buffer,he(I.salt));if(!E)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const P=await p(E),w=await u(P,$);return f(),w}function x(){o==null||o.removeItem(ea),o==null||o.removeItem(aa),o==null||o.removeItem(oa)}function f(){o==null||o.setItem(oa,String(n()))}function h(){const I=o==null?void 0:o.getItem(Oo);if(I==null)return oc;const $=Number(I);return Number.isFinite($)&&$>0?$:0}function M(I){o==null||o.setItem(Oo,String(Math.max(0,Math.floor(I)||0)))}function A(){if(!d())return!1;const I=h();if(I<=0)return!1;const $=o==null?void 0:o.getItem(oa),E=$?Number($):NaN;return Number.isFinite(E)?n()-E<I*6e4:!1}return{disponible:r,registrada:d,leerCredencial:c,registrar:v,desbloquear:b,olvidar:x,marcarDesbloqueo:f,dentroDeGracia:A,graciaMinutos:h,configurarGracia:M}}function Ho(){if(typeof localStorage<"u"){const $=Xn();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=ls(),a=t.activo(),e=Jt(a),o=Ka(localStorage,e),n=os({adapter:o}),s=ns(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Yt})`),n.subscribe($=>s.marcar($));function r(){var E,P,w,y,C;const $=globalThis;(P=(E=$.FirebaseService)==null?void 0:E.isConnected)!=null&&P.call(E)&&((C=(y=(w=$.FirebaseService).uploadRegistroProyectos)==null?void 0:y.call(w))==null||C.catch(S=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",S instanceof Error?S.message:S)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===a)??t.listar()[0],colecciones:Ct.filter($=>$!=="config"),crear:$=>{const E=t.crear($);return r(),E},renombrar:($,E)=>{t.renombrar($,E),r()},duplicar:($,E)=>{const P=t.duplicar($,E);return r(),P},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,E)=>{const P=ds(localStorage,$,E),w=us(P),y=[];for(const C of E){const S=w[C];if(!Array.isArray(S)||S.length===0)continue;const F=n.get(C);n.set(C,[...F,...S]),y.push(C)}return y.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:y}}},d=ms(n),p=rc(),l=Xr({autoLogoutMinutos:()=>{var E,P;const $=(P=(E=globalThis.State)==null?void 0:E.get)==null?void 0:P.call(E,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=Hr(n),v=Gr(n),g=er(u),b=fr(n),x=Ls({isEnabled:$=>d.isEnabled($)}),f=Fs({flags:d,rutasExtra:()=>x.flagPorRuta()}),h=bs({flags:d,onChange:()=>{var $,E;x.attachToShell(),f.apply(),(E=($=globalThis.Router)==null?void 0:$.rerender)==null||E.call($)}}),M=Ss({proyectos:c}),A=()=>{var E,P,w,y,C,S;const $=globalThis;if((P=(E=$.State)==null?void 0:E.load)==null||P.call(E),((y=(w=$.Router)==null?void 0:w.current)==null?void 0:y.call(w))==="dashboard")try{(S=(C=$.DashboardModule)==null?void 0:C.render)==null||S.call(C)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},I=_s({store:n,onDatosCambiados:A});return x.register(Qs({store:n,onDatosCambiados:A})),x.register(ri({store:n,onDatosCambiados:A})),x.register(Ti({store:n,onDatosCambiados:A})),x.register(Br({store:n,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:A})),x.register(Bs({store:n,onDatosCambiados:A})),{version:Yt,core:Zo,engine:{generarExtracto:Pa,recomputarSaldoAcum:an,saldoHoy:on,sumarPorTags:_a,providers:{proyectarGastos:Gt,proyectarPrestamos:ya,proyectarTransferencias:$a,proyectarNominas:Ca,proyectarInteresesCuentas:wa,proyectarAportaciones:xa,proyectarRetencionesFiscales:Ia,proyectarInflacionGastos:Sa,proyectarPerdidaAhorro:Aa},analysis:cn,margins:gn,avisos:yn,dashboard:Tn},store:n,flags:d,featureRegistry:{all:xt,porGrupo:eo},ui:{openFeatures:h.open,openProyectos:M.open,openPersonas:I.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Ts({store:n,rerender:()=>{var E,P,w,y;const $=globalThis;(P=(E=$.State)==null?void 0:E.load)==null||P.call(E),(y=(w=$.Router)==null?void 0:w.rerender)==null||y.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Ns({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>x.routes(),navegar:$=>{var E,P;return(P=(E=globalThis.Router)==null?void 0:E.navigate)==null?void 0:P.call(E,$)}})},app:x,session:Object.assign(l,{vigilar:$=>Zr({sesion:l,onCaducada:$}),opciones:tc}),biometria:p,cambios:s,datos:{colecciones:Ct,snapshot:()=>Ja(o),aplicar:($,{sellar:E=!0}={})=>{const w=ss(E?(y,C)=>o.set(y,C):(y,C)=>{const S=globalThis.StorageAdapter;S!=null&&S.setRestaurando?S.setRestaurando(y,C):o.set(y,C)},$);return n.load(),s.marcar("copia-restaurada"),w},faltantes:$=>is($),esVacioOPorDefecto:()=>rs(Ja(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:Ke,medirVariabilidad:Yr,bandaDeConfianza:Wr,bandaAcumulada:Ro,describirBanda:Kr}}}function cc(){try{const t=Ho();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const st=typeof window<"u"?cc():null;if(st){let t=!1;const a=()=>{var e,o;if(st.app.attachToShell(),st.ui.applyGating(),!t){t=!0,st.ui.watchGating(),st.ui.instalarDeshacer(),st.ui.instalarBuscador();const n=globalThis,s=()=>{var c,d,p,l;return(d=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&d.call(c)?n.FirebaseService:(l=(p=n.DropboxService)==null?void 0:p.isConnected)!=null&&l.call(p)?n.DropboxService:null};st.ui.avisoGuardado=Rs({cambios:st.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=st.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>st.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>st.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>st.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return ye.bootstrap=Ho,Object.defineProperty(ye,Symbol.toStringTag,{value:"Module"}),ye}({});
//# sourceMappingURL=financeapp-core.js.map
