var FinanceAppBundle=function(He){"use strict";function W(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function H(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function J(){return W(new Date)}function Ge(t,a){return new Date(t,a+1,0).getDate()}function Na(t,a,e){return W(new Date(t,a,Math.min(e,Ge(t,a))))}function Ie(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return W(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return Na(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),W(i)}return null}function Ra(t,a){if(!a)return t;const e=H(t);return Ie(e.getFullYear(),e.getMonth(),a)??t}const Ls=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],ks={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ve(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${ks[e]||e+"º"} ${Ls[o]} del mes`}return t}function oe(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function se(t){const a=H(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),W(a)}function La(t,a){const e=H(t);return e.setDate(e.getDate()+a),W(e)}function Lt(t,a,e){const o=Math.max(1,e),s=t.getFullYear(),n=t.getMonth(),i=(a.getFullYear()-s)*12+(a.getMonth()-n);if(i<=0)return{year:s,month:n};const r=n+Math.floor(i/o)*o;return{year:s+Math.floor(r/12),month:r%12}}function we(t,a,e,o){return!(t&&t>o||a&&a<e)}function ka(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function ut(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function Q(t){return t/100}function V(t){return Q(ut(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Oa(t){return(t||0).toFixed(2)+"%"}function Tt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function Ba(t,a,e,o=0){const s=Tt(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=s*(1-Math.pow(1+i,-e))/i-n,p=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-l/p;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function Ha(t,a,e,o,s=0,n=[],i={}){const r=[];let c=t;const l=H(o),p=a/100/12;let d=e,u=Tt(c,a,d);const v=[...n].sort((b,$)=>b.fecha.localeCompare($.fecha));let g=0;for(let b=1;b<=e*2&&c>.01;b++){const $=new Date(l);l.setMonth(l.getMonth()+1);const f=Ra(W($),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const S=v[g],w=S.cantidad*(s/100);if(c-=S.cantidad,c=Math.max(0,c),S.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(d=e-b+1,u=Tt(c,a,d)),r.push({mes:"AMORT",fecha:S.fecha,cuota:0,interes:0,amortizacion:S.cantidad,comisionAmort:w,capitalPendiente:c,esAmortizacion:!0,simulacion:S.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const y=c*p,M=Math.min(u-y,c);if(c-=M,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:y,amortizacion:M,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const Ga=new Map;function ot(t){var $;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,y)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${y.fecha}|${y.cantidad}|${y.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=Ga.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,p=Ha(s,n,i,r,c||0,a,t),d=p.reduce((f,y)=>f+y.interes,0),u=p.reduce((f,y)=>f+y.comisionAmort,0),v=s*((l||0)/100),g=p.filter(f=>!f.esAmortizacion),b={cuota:Tt(s,n,i),totalIntereses:d,tae:Ba(s,n,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:(($=g.slice(-1)[0])==null?void 0:$.fecha)||"",mesesReales:g.length,tabla:p};return Ga.set(e,b),b}function Va(t){const a=ot(t),e=ot({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function It(t,a,e){if(!t||t.length===0)return 1;const o=H(a),s=H(e);if(s<=o)return 1;const n=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<s;){const c=r.getFullYear(),l=n.filter(b=>b.year<=c),p=l.length>0?l[l.length-1]:n[0],d=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<s?u:s,g=oe(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function Ua(t,a,e,o=0){const s=H(a),n=H(e);if(n<=s)return o;const i=oe(s,n),r=t?[...t].sort((p,d)=>p.year-d.year):[];let c=0,l=new Date(s);for(;l<n;){const p=l.getFullYear(),d=new Date(p+1,0,1),u=d<n?d:n,v=oe(l,u),g=r.filter(f=>f.year<=p),b=g.length>0?g[g.length-1]:null,$=b!==null?b.tasa:o;c+=$*v,l=u}return i>0?c/i:o}function Ya(t,a){return((1+t/100)/(1+a/100)-1)*100}function Os(t,a,e,o){const s=It(a,e,o);return s>0?t/s:t}function Bs(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:p=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,b=g,$=c>0?b/c*100:null,f=r?l-p:l,y=c>0?f/c*100:null,M=c>0?l/c*100:null,S=c>0?(d+l+v)/c*100:null,w=c>0?u/c*100:null,x=(P,I,E)=>P===null?"neutral":P>=I?"verde":P>=E?"amarillo":"rojo",A=(P,I,E)=>P===null?"neutral":P<=I?"verde":P<=E?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:p,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:$,dti:y,dtiTotal:M,excluyeHipoteca:r,pctNecesidades:S,pctDeseos:w,semAhorro:x($,e,o),semDTI:A(y,s,n),semNecesidades:A(S,i[0],i[0]+15),semDeseos:A(w,i[1],i[1]+10),semAhorroRegla:x($,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function pt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function wt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function ne(t,a){const e=Ue(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Ue(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,n)=>{s.fecha>=e&&o.push({...s,prioridad:n})}),o.sort((s,n)=>n.fecha.localeCompare(s.fecha)||n.prioridad-s.prioridad),o.find(s=>s.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((s,n)=>n.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a)??null}function Wa(t,a){let e="";for(const o of t){const s=Ue(o,a);s&&s.fecha>e&&(e=s.fecha)}return e}function Hs(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Gs(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function Ce(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Vs(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),s=Math.floor(o/a),n=o-s*a;return Array.from({length:a},(i,r)=>e*(s+(r<n?1:0)))}function Us(t,a,e,o){if(e===0)return{ids:t,cts:a};const s=t.indexOf(o);if(s>=0){const n=[...a];return n[s]+=e,{ids:t,cts:n}}return{ids:[...t,o],cts:[...a,e]}}function kt(t,a,e){const o=ut(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:Q(o)}];const s=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Vs(o,s.length);return s.map((u,v)=>({personaId:u,importe:Q(d[v])}))}const n=a.participantes.map(d=>{const u=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):ut(u)}),i=n.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=n.map(g=>Math.round(g*d)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),s.map((g,b)=>({personaId:g,importe:Q(u[b])}))}const c=o-i,{ids:l,cts:p}=Us(s,n,c,e);return l.map((d,u)=>({personaId:d,importe:Q(p[u])}))}function Ye(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Ys(t,a,e){const o=Ce(e),s=new Map,n=i=>{let r=s.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},s.set(i,r)),r};for(const i of e)n(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Ye(a.expenses,i.sourceId);for(const l of kt(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of kt(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Ye(a.loans,i.sourceId);for(const l of kt(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of kt(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Ye(a.nominas,i.sourceId);for(const l of kt(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).ingresos+=l.importe}}}return[...s.values()]}function We(t,a,e){const o=s=>!s||s.participantes.length===0?[e]:s.participantes.map(n=>n.personaId);return new Set([...o(t),...o(a)])}const Ct=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function vt(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,r]=e[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Ka(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function St(t,a){return Ka(t,a).baseImponible}function Ja(t,a){return vt(t,a)/12}const ie=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ke(t,a){if(!t||t<=0)return 0;const e=a||ie;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,r]=e[n],c=n<e.length-1?e[n+1][0]:1/0,l=Math.min(s,c-i);if(!(l<=0)&&(o+=l*(r/100),s-=l,s<=0))break}return o}function Se(t,a){if(pt(t)!=="inversion")return null;const e=wt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=Ke(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function Je(t,a=new Date){var u;if(pt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=wt(t),s=W(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=n.reduce((v,g)=>v+g.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,p=Math.min(o,i+c*l),d=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:d,costBase:r,beneficio:c,numAportaciones:n.length,proxDesbloqueo:((u=n.find(v=>v.fecha>s))==null?void 0:u.fecha)||null}}function Qa(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(pt(t)!=="pension"||!o)return 0;const s=wt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,p)=>l+p.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(a*r*o/100).toFixed(2)}function Qe(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,p)=>l+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((l,p)=>l[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,p]of i)if(n>=l)r=p;else break;return r}const Ws=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:ie,TRAMOS_IRPF_DEFAULT:Ct,agregarPorPersona:Ys,ajustarFechaPago:Ra,ajustarPrecioReal:Os,arranqueMensual:Lt,calcBaseImponibleTrabajo:St,calcFactorInflacion:It,calcFondoInversion:Se,calcFondosPension:Je,calcGananciasCapital:Ke,calcIRPF:vt,calcImpuestoPension:Qa,calcInflacionMediaAnual:Ua,calcSaludFinanciera:Bs,calcTAE:Ba,calcTipoMarginalPension:Qe,calcTipoRealFisher:Ya,calcularReparto:kt,clampedDate:Na,cuotaMensual:Tt,desgloseBaseTrabajo:Ka,diasEntre:oe,entradaSaldo:Ue,etiquetaPeriodicidad:ka,fechaUltimoSaldoConocido:Wa,finDeSemana:se,formatEUR:F,formatLocalDate:W,formatPct:Oa,fromCents:Q,haySimulaciones:Gs,idPersonaPorDefecto:Ce,labelDiaPago:Ve,lastDayOfMonth:Ge,modeloFondoDe:pt,parseLocalDate:H,personasImplicadas:We,resolverDiaEfectivo:Ie,resumenPrestamo:ot,resumenPrestamoConAhorro:Va,retencionMensual:Ja,roundMoney:V,saldoEnFecha:ne,saldoRealCuenta:wt,sinSimulaciones:Hs,sumarDias:La,tablaAmortizacion:Ha,toCents:ut,todayISO:J,vigenteEnRango:we},Symbol.toStringTag,{value:"Module"}));function re(t,a,e=null){const o=[],s=H(a.start),n=H(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=H(i.fechaInicio||a.start),c=i.fechaFin?H(i.fechaFin):n,l=i.cuantia,p=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=Lt(r,s,d);const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const $=Ie(u,v,i.diaPago||"")||(()=>{const y=r.getDate(),M=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(y,M)))})(),f=H($);if(f>n||f>c)break;f>=s&&f>=r&&p($),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=n&&u<=c;)p(W(u)),u=new Date(u.getTime()+d)}}return o}function Xe(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=ot(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function Xa(t,a,e=null,o={accounts:[]}){const s=[],n=H(a.start),i=H(a.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>Ct),p=o.resolverTramosGanancias||(()=>ie),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=H(u.fechaInicio||a.start),g=u.fechaFin?H(u.fechaFin):i,b=$=>{const f=r.find(D=>D._id===(u.cuenta||"default")),y=r.find(D=>D._id===(u.cuentaDestino||"default")),M=pt(f),S=pt(y),w=M==="inversion"&&S==="inversion"||M==="pension"&&S==="pension",x=["transferencia",...w?["traspaso"]:[],...u.tags||[]],A=w?"traspaso-out":"transfer-out",P=w?"traspaso-in":"transfer-in",I=!e||e.length===0||e.includes(u.cuenta||"default"),E=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(I&&s.push({fecha:$,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:x,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:A}),E&&s.push({fecha:$,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:x,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:P}),I&&!w&&f){if(M==="inversion"){const D=parseInt($.slice(0,4)),C=Se(f,p(D));if(C&&C.saldo>0&&C.plusvalia>0){const h=Math.min(1,u.cuantia/C.saldo),_=C.plusvalia*h*.19;_>.01&&s.push({fecha:$,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:_,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(M==="pension"){const D=l(parseInt($.slice(0,4))),C=Qe(f,c,D),h=Qa(f,u.cuantia,C||void 0);if(h>0){const T=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${C}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:$,concepto:T,cuantia:h,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const $=Math.max(1,u.frecuencia||1);let{year:f,month:y}=Lt(v,n,$);const M=Math.ceil(240/$)+2;for(let S=0;S<M;S++){const w=Ie(f,y,u.diaPago||"")||(()=>{const A=v.getDate(),P=new Date(f,y+1,0).getDate();return W(new Date(f,y,Math.min(A,P)))})(),x=H(w);if(x>i||x>g)break;x>=n&&x>=v&&b(w),y+=$,y>=12&&(f+=Math.floor(y/12),y=y%12)}}else if(u.tipoFrecuencia==="diaria"){const $=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const y=Math.ceil((n.getTime()-v.getTime())/$);f=new Date(v.getTime()+y*$)}for(;f<=i&&f<=g;)b(W(f)),f=new Date(f.getTime()+$)}}return s}function Za(t,a,e=null){const o=[],s=H(a.start),n=H(a.end);for(const i of t){const r=pt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const p=H(l.fechaInicio||a.start),d=l.fechaFin?H(l.fechaFin):n,u=l.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),g=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",$=w=>{v&&o.push({fecha:w,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:w,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:y,month:M}=Lt(p,s,f);const S=Math.ceil(240/f)+2;for(let w=0;w<S;w++){const x=new Date(y,M+1,0).getDate(),A=W(new Date(y,M,Math.min(p.getDate(),x))),P=H(A);if(P>n||P>d)break;P>=s&&P>=p&&$(A),M+=f,M>=12&&(y+=Math.floor(M/12),M=M%12)}}}return o}function to(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=H(a.start),r=H(a.end),c=n.periodoCobro||"mensual",l=c==="mensual",p=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:p/(365.25*864e5);let u=ne(n,a.start);const v=o.filter($=>$.cuenta===n._id).map($=>({fecha:$.fecha,delta:$.tipo==="ingreso"?Math.abs($.cuantia):-Math.abs($.cuantia)})).sort(($,f)=>$.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const $=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),f=new Date(Math.min($.getTime(),r.getTime()+1)),y=W(f);let M=0;for(;g<v.length&&v[g].fecha<y;)M+=v[g].delta,g++;const S=u,w=u+M,x=Math.max(0,(S+w)/2);u=w;const A=l?d:(f.getTime()-b.getTime())/(365.25*864e5),P=x*(Math.pow(1+n.interes/100,A)-1);P>.001&&s.push({fecha:W(b),concepto:`Interés ${n.nombre}`,cuantia:P,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),b=$}}return s}function eo(t,a,e,o=null){const s=[],n=a||Ct;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Ja(r,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};s.push(...re([l],e,o))}return s}const Ks=[5,11,2,8],Js={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ze(t,a,e=null,o=[],s=()=>Ct){const n=[],i=H(a.start),r=H(a.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||a.start,b=H(g),$=H(v);let f=0;for(let M=b.getFullYear();M<=$.getFullYear();M++){const S=new Date(M,u.mesActualizacionIPC-1,1);S>b&&S<=$&&f++}if(f===0)return u.bruto||0;const y=W(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*It(o,g,y)}function d(u,v){const g=p(u,v),b=(u.retribucionFlexible||[]).reduce((D,C)=>D+(C.importe||0)*12,0),$=Math.max(0,g-b);if(u.irpfModo==="manual")return $*((u.irpfPct||0)/100);const f=s(parseInt(v.slice(0,4))),y=u.grupoNomina||"";if(!y)return vt(St(g,b),f);const M=l[y].filter(D=>D.activo),S=M.reduce((D,C)=>D+p(C,v),0),w=M.reduce((D,C)=>D+(C.retribucionFlexible||[]).reduce((h,T)=>h+(T.importe||0)*12,0),0),x=Math.max(0,S-w),A=St(S,w),P=Math.max(0,g-b),I=x>0?A*(P/x):0,E=M.filter(D=>D._id!==u._id&&(D.bruto||0)>(u.bruto||0)).reduce((D,C)=>{const h=(C.retribucionFlexible||[]).reduce((_,z)=>_+(z.importe||0)*12,0),T=Math.max(0,p(C,v)-h);return D+(x>0?A*(T/x):0)},0);return vt(E+I,f)-vt(E,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=H(u.fechaInicio||a.start),$=u.fechaFin?H(u.fechaFin):r,f=y=>{const M=p(u,y),S=d(u,y),w=(u.retribucionFlexible||[]).reduce((h,T)=>h+(T.importe||0)*12,0),x=Math.max(0,M-w),A=(u.ssPct??6.35)/100,P=x*A,I=x/g,E=S/g,D=P/g,C=u.representacion==="simplificado"?I-D-E:I;n.push({fecha:y,concepto:u.nombre,cuantia:C,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(D>0&&n.push({fecha:y,concepto:`SS ${u.nombre}`,cuantia:D,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),E>0&&n.push({fecha:y,concepto:`IRPF ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const h of u.retribucionFlexible||[])!h.cuenta||!(h.importe>0)||e&&e.length>0&&!e.includes(h.cuenta)||n.push({fecha:y,concepto:`${u.nombre} — ${Js[h.tipo]||h.tipo}`,cuantia:h.importe,tipo:"ingreso",cuenta:h.cuenta,tags:["retribucion-flexible",h.tipo],sourceId:`${u._id}_flex_${h._id||h.tipo}`,sourceType:"nomina"})};if(g<=12){const y=g===12?1:Math.round(12/g),M=b.getDate();let{year:S,month:w}=Lt(b,i,y);for(let x=0;x<300;x++){const A=new Date(S,w+1,0).getDate(),P=new Date(S,w,Math.min(M,A));if(P>r||P>$)break;P>=i&&P>=b&&f(W(P)),w+=y,w>=12&&(S+=Math.floor(w/12),w=w%12)}}else{const y=g-12,M=b.getDate();let{year:S,month:w}=Lt(b,i,1);for(let P=0;P<300;P++){const I=new Date(S,w+1,0).getDate(),E=new Date(S,w,Math.min(M,I));if(E>r||E>$)break;E>=i&&E>=b&&f(W(E)),w++,w>=12&&(S++,w=0)}const x=Math.max(b.getFullYear(),i.getFullYear()),A=Math.min((u.fechaFin?$:r).getFullYear(),r.getFullYear());for(let P=x;P<=A;P++)for(const I of Ks.slice(0,y)){const E=new Date(P,I,15);E>=i&&E<=r&&E>=b&&E<=$&&f(W(E))}}}return n}function ao(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=H(e.start),r=H(e.end),c=J(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const d=p.getFullYear(),u=p.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=W(new Date(d,u+1,0)),$=W(new Date(d,u,15));let f=0;for(const y of l){if(o&&o.length>0&&!o.includes(y.cuenta||"default")||y.fechaInicio&&y.fechaInicio>b||y.fechaFin&&y.fechaFin<g)continue;const M=y.fechaInicio||c,S=It(a,M,$);if(S<=1)continue;const w=Math.max(1,y.frecuencia||1);f+=y.cuantia*(S-1)/w}f>.01&&n.push({fecha:$,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(d,u+1,1)}return n}function oo(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=H(e.start),i=H(e.end),r=[...a].sort((l,p)=>l.year-p.year);let c=new Date(n.getFullYear(),n.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),p=c.getMonth(),d=l+"-"+String(p+1).padStart(2,"0"),u=W(new Date(l,p,15)),v=r.filter(y=>y.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,$=Math.pow(1+b,1/12)-1,f=t*$;f>.01&&s.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,p+1,1)}return s}function so(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,s=t.reduce((i,r)=>i+ne(r,o),0),n=Wa(t,o);return{fecha:n&&n<o?n:o,saldo:s,pedida:o}}function no(t,a,e){const{fecha:o,saldo:s}=so(a,e),n=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=s;for(const p of[...n].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:d,saldoAcum:c}),c-=d}const l=[];c=s;for(const p of i){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=d,l.push({...p,delta:d,saldoAcum:c})}return[...r,...l]}function Qs(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return no([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function io(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id))),l=so(c,s),p={start:l.fecha<s.dashboardStart?l.fecha:s.dashboardStart,end:s.dashboardEnd},d=e.filter($=>$.tipo!=="transferencia"),u=e.filter($=>$.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(re(d,p,n)),g=g.concat(Xe(a,p,n)),g=g.concat(Xa(u,p,n,v)),g=g.concat(Za(o,p,n));const b=to(o,p,n,g);if(g=g.concat(b),g=g.concat(eo(e,s.tramos_irpf,p,n)),g=g.concat(Ze(i,p,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const $=(o.find(M=>M.activo&&M.esCuentaPrincipal)||o.find(M=>M.activo)||{_id:"default"})._id;g=g.concat(ao(d,r,p,n,$));const y=o.filter(M=>M.activo&&(!n||n.length===0||n.includes(M._id))).reduce((M,S)=>M+ne(S,s.dashboardStart),0);g=g.concat(oo(y,r,p,$))}return g.sort(($,f)=>$.fecha.localeCompare(f.fecha)),no(g,c,s).filter($=>$.fecha>=s.dashboardStart)}function Xs(t,a,e=null){const o=J(),n=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+wt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function ro(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function Zs(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${F(i)})`})))}return e}function tn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=H(a.dashboardStart),s=H(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function en(t,a,e=J()){const o=new Set,s=a.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=e&&(l[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(l[p.fecha]=p.saldo);return Object.keys(l).forEach(p=>o.add(p)),l}),n={};for(const r of[...o].sort()){let c=0;for(let l=0;l<a.length;l++){const p=Object.entries(s[l]).filter(([d])=>d<=r);p.length>0?(p.sort(([d],[u])=>u.localeCompare(d)),c+=p[0][1]):c+=a[l].saldoInicial||0}n[r]=c}const i=[];for(const[r,c]of Object.entries(n).sort(([l],[p])=>l.localeCompare(p))){const l=t.filter(v=>v.fecha<=r),p=l.length>0?l[l.length-1].saldoAcum:null;if(p===null)continue;const d=c-p,u=p!==0?d/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:d,pct:u})}return i}const an=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:en,detectarPuntosCriticos:Zs,mediaMensualGastos:tn},Symbol.toStringTag,{value:"Module"}));function ce(t,a=new Date){const e=W(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=W(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return re(n,{start:e,end:s}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function on(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Tt(e.capital,e.tin,e.meses),0)}function sn(t,a){return ot(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function co(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,s)=>o+Tt(s.capital,s.tin,s.meses)*Math.min(a,sn(s,e)),0)}function lo(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const s=ce(t,o),n=a.colchonMeses||6;return s*n+co(e,n,W(o))}function nn(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return lo(t,a,e,s);if(i.tipo==="fijo")return i.importe||0;const r=ce(t,s),c=i.meses||6;return r*c+co(e,c,o)}function ta(t,a,e,o,s,n=!1,i){const r=[...t.puntos||[]].sort((p,d)=>p.fecha.localeCompare(d.fecha)),c=r.filter(p=>p.fecha<=s).pop()||(n?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(ce(a,i)+on(o))*(c.meses||1):0}function rn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function cn(t,a){const e={};for(const o of a)e[o._id]=wt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=rn(o)),{fecha:o.fecha,saldos:{...e}}))}function ln(t,a,e,o,s,n,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let p=0;p<a.length;p++){const d=a[p],u=ta(c,o,s,n,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var $,f;return g+(((f=($=e[p])==null?void 0:$.saldos)==null?void 0:f[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const dn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:lo,calcColchonEnFecha:nn,calcGastoBasicoMensual:ce,calcMargenEnFecha:ta,detectarCrucesMargenes:ln,saldosPorCuentaEnExtracto:cn},Symbol.toStringTag,{value:"Module"}));function un(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function uo(t,a){return oe(H(t),H(a))}const pn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function po(t,a){const[e,o,s]=t.split("-").map(Number),n=t.slice(0,4)===a.slice(0,4);return`${s} de ${pn[o-1]}${n?"":` de ${e}`}`}function mo(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function mn(t,a={}){const{hoy:e=J(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${F(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${F(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${F(d.saldo)}, y el margen pide ${F(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=uo(e,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:s))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:mo(u),titulo:d.titulo(g),detalle:d.detalle(po(d.fecha,e)),incierto:g})}const p={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||p[d.gravedad]-p[u.gravedad]),l.slice(0,n)}const fn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:un,construirAvisos:mn,describirPlazo:mo,diasEntreISO:uo,fechaEnPalabras:po},Symbol.toStringTag,{value:"Module"})),gn=30.44*864e5;function fo(t){const a=t.getFullYear(),e=t.getMonth();return{desde:W(new Date(a,e,1)),hasta:W(new Date(a,e,Ge(a,e)))}}function go(t){const[a,e]=t.split("-").map(Number);return fo(new Date(a,e-1,1))}function vn(t,a){return Math.max(1,(H(a).getTime()-H(t).getTime())/gn)}const bn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),Mt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function hn(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function yn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",s=a.loanIdsIniciados,n=Mt(t.filter(u=>u.tipo==="ingreso")),i=Mt(t.filter(u=>o(u)&&(!s||s.has(u.sourceId??"")))),r=Mt(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=Mt(t.filter(u=>u.sourceType==="loan-amort")),l=Mt(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:d}=hn(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:d/e,gastosTotales:(i+p+d)/e,intereses:l/e}}function vo(t,a){return t.reduce((e,o)=>{const s=ot(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function $n(t,a,e,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),n=s.reduce((l,p)=>{if((p.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return l;const u=ot(p).totalIntereses,v=ot({...p,amortizaciones:(p.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return l+Math.max(0,v-u)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:ot(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=s.map(l=>ot(l).tabla),c=l=>{const{desde:p,hasta:d}=go(l);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:vo(s,a),deudaFin:vo(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function xn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:Mt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function bo(t,a=new Set,e="desglosado"){if(a.size===0)return ro(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>a.has(l)),r=n.filter(l=>!a.has(l)),c=e==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function In(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...bo(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function wn(t,a){const e=a.reduce((o,s)=>o+wt(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:Mt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Mt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Cn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Sn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function Mn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function An(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let c=null;for(const l of t){const p=e(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const En=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:An,cuentasVisibles:Cn,gastoPorTagOrdenado:In,idsHipoteca:Sn,idsPrestamosIniciados:Mn,interesesPorCuenta:xn,mesesDelPeriodo:vn,metricasFlujo:yn,rangoMes:go,rangoMesDe:fo,resumenPrestamosPeriodo:$n,sinTransferencias:bn,sumarGastosPorTag:bo,totalesPeriodo:wn},Symbol.toStringTag,{value:"Module"}));function ho(t){return t.imprevisto===!0&&t.importeCts<0&&t.tipo!=="transferencia"&&!t.estimacionId}const Pn=["luz","electricidad","gas","agua","internet","fibra","movil","telefono","telefonia","seguro","seguros","comunidad","alquiler","ibi","basura","basuras","suscripcion","suscripciones","recibo","recibos","factura","facturas","suministro","suministros","colegio","guarderia","academia","gimnasio","cuota","mutua","hipoteca","netflix","spotify","hbo","disney","prime","icloud","youtube","iberdrola","endesa","naturgy","repsol","movistar","vodafone","orange","digi","yoigo","masmovil","pepephone","calefaccion","alarma","parking","garaje"],yo=t=>t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),_n=new Set(Pn);function Dn(t){return yo([t.concepto??"",...t.tags??[]].join(" ")).split(/[^a-z0-9]+/).some(e=>_n.has(e))}function Me(t){return t?t.esFactura===!0?!0:t.esFactura===!1||(t.tipoFrecuencia??"mensual")!=="mensual"?!1:Dn(t)?!0:!!t.diaPago&&t.diaPago!==""&&(t.basico===!0||t.clasificacion==="necesidad"):!1}const Tn=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]),Fn=new Set(["account-interest"]),$o=t=>t.sourceType==="nomina"&&t.tipo==="gasto",Z=t=>Math.round(Math.abs(t)*100);function Ae(t,a,e){const o=new Map;for(const r of t){const c=r.sourceId??r.concepto,l=o.get(c)??{concepto:e(r),total:0,vencido:0,fechas:[]},p=Z(r.cuantia);l.total+=p,r.fecha<=a&&(l.vencido+=p),l.fechas.push(r.fecha),o.set(c,l)}const s=[...o.entries()].map(([r,c])=>({id:r,concepto:c.concepto,total:c.total/100,vencido:c.vencido/100,fechas:c.fechas.sort()})).sort((r,c)=>c.total-r.total||r.concepto.localeCompare(c.concepto)),n=[...o.values()].reduce((r,c)=>r+c.total,0),i=[...o.values()].reduce((r,c)=>r+c.vencido,0);return{total:n/100,vencido:i/100,pendiente:(n-i)/100,partidas:s}}function ea(t,a,e,o,s={}){const n=new Map(a.map(I=>[I._id,I])),i=new Map(e.map(I=>[I._id,I])),r=t.filter(I=>!Tn.has(I.sourceType??"")&&!Fn.has(I.sourceType??"")),c=r.filter(I=>I.tipo==="ingreso").reduce((I,E)=>I+Z(E.cuantia),0),l=r.filter($o).reduce((I,E)=>I+Z(E.cuantia),0),p=[],d=[],u=[],v=[];for(const I of r){if(I.tipo!=="gasto"||$o(I))continue;const E=I.sourceType==="expense"?n.get(I.sourceId??""):void 0;I.sourceType==="loan"||I.sourceType==="loan-amort"?p.push(I):E!=null&&E.imprevisto?u.push(I):E&&Me(E)?d.push(I):v.push(I)}for(const I of s.movimientos??[]){if(!ho(I))continue;const E=yo(I.concepto).replace(/\s+/g," ").trim();u.push({fecha:I.fecha,concepto:I.concepto,cuantia:I.importeCts/100,tipo:"gasto",tags:[],cuenta:"",sourceId:`mov:${E}`,sourceType:"movimiento"})}const g=I=>{var E;return((E=n.get(I.sourceId??""))==null?void 0:E.concepto)??I.concepto},b=Ae(p,o,I=>{var E;return((E=i.get(I.sourceId??""))==null?void 0:E.nombre)??I.concepto}),$=Ae(d,o,g),f=Ae(v,o,g),y=Ae(u,o,g),M=c-l,S=Z(b.total)+Z($.total)+Z(f.total)+Z(y.total),w=s.estimacionImprevistos??null,x=w!==null?Math.max(0,Z(w)-Z(y.total)):0,A=M/100,P=(M-S-x)/100;return{ingresosNetos:A,prestamos:b,facturas:$,otros:f,imprevistos:y,gastosTotales:S/100,estimacionImprevistos:w,reservaImprevistos:x/100,margen:P,margenPct:A>0?P/A*100:null}}function zn(t,a){const[e,o,s]=t.split("-").map(Number),[n,i,r]=a.split("-").map(Number);if(![e,o,s,n,i,r].every(Number.isFinite)||a<t)return 1;const c=new Date(n,i-1,r+1);let l=(c.getFullYear()-e)*12+(c.getMonth()+1-o);const p=g=>{const b=new Date(e,o-1+g,1),$=new Date(b.getFullYear(),b.getMonth()+1,0).getDate();return new Date(b.getFullYear(),b.getMonth(),Math.min(s,$))};p(l).getTime()>c.getTime()&&(l-=1);const d=p(l),u=Math.round((c.getTime()-d.getTime())/864e5),v=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Math.max(.03225806451612903,l+u/v)}function Ot(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);if(![e,o,s,n].every(Number.isFinite))return[];const i=[];for(let r=e,c=o;(r<s||r===s&&c<=n)&&(i.push(`${r}-${String(c).padStart(2,"0")}`),!(i.length>240));c===12?(c=1,r++):c++);return i}function At(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1+a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function aa(t,a,e,o,s,n={}){var c,l;const i=new Map(o.map(p=>[p,[]]));for(const p of t)(c=i.get(p.fecha.slice(0,7)))==null||c.push(p);const r=new Map(o.map(p=>[p,[]]));for(const p of n.movimientos??[])(l=r.get(p.fecha.slice(0,7)))==null||l.push(p);return o.map(p=>{var d;return{mes:p,desglose:ea(i.get(p)??[],a,e,s,{movimientos:r.get(p),estimacionImprevistos:((d=n.estimacion)==null?void 0:d.mes)===p?n.estimacion.importe:null})}})}function Ee(t){const a=new Map;for(const n of t)for(const i of n.partidas){const r=a.get(i.id)??{concepto:i.concepto,total:0,vencido:0,fechas:[]};r.total+=Z(i.total),r.vencido+=Z(i.vencido),r.fechas.push(...i.fechas),a.set(i.id,r)}const e=[...a.entries()].map(([n,i])=>({id:n,concepto:i.concepto,total:i.total/100,vencido:i.vencido/100,fechas:i.fechas.sort()})).sort((n,i)=>i.total-n.total||n.concepto.localeCompare(i.concepto)),o=[...a.values()].reduce((n,i)=>n+i.total,0),s=[...a.values()].reduce((n,i)=>n+i.vencido,0);return{total:o/100,vencido:s/100,pendiente:(o-s)/100,partidas:e}}function Bt(t){const a=Ee(t.map(p=>p.prestamos)),e=Ee(t.map(p=>p.facturas)),o=Ee(t.map(p=>p.otros)),s=Ee(t.map(p=>p.imprevistos)),n=t.reduce((p,d)=>p+Math.round(d.ingresosNetos*100),0),i=Z(a.total)+Z(e.total)+Z(o.total)+Z(s.total),r=t.reduce((p,d)=>p+Z(d.reservaImprevistos),0),c=n/100,l=(n-i-r)/100;return{ingresosNetos:c,prestamos:a,facturas:e,otros:o,imprevistos:s,gastosTotales:i/100,estimacionImprevistos:null,reservaImprevistos:r/100,margen:l,margenPct:c>0?l/c*100:null}}function xo(t){const a=Bt(t),e=t.length;if(e<=1)return a;const o=g=>Math.round(g*100/e)/100,s=g=>{const b=o(g.total),$=o(g.vencido);return{total:b,vencido:$,pendiente:Math.round((b-$)*100)/100,partidas:g.partidas.map(f=>({...f,total:o(f.total),vencido:o(f.vencido)}))}},n=s(a.prestamos),i=s(a.facturas),r=s(a.otros),c=s(a.imprevistos),l=Z(o(a.ingresosNetos)),p=Z(n.total)+Z(i.total)+Z(r.total)+Z(c.total),d=Z(o(a.reservaImprevistos)),u=l/100,v=(l-p-d)/100;return{ingresosNetos:u,prestamos:n,facturas:i,otros:r,imprevistos:c,gastosTotales:p/100,estimacionImprevistos:null,reservaImprevistos:d/100,margen:v,margenPct:u>0?v/u*100:null}}function Io(t,a,e){const o={mediaMensual:0,total:0,meses:0,desde:null,hasta:null};if(!e)return o;const s=At(a,-12),n=At(a,-1),i=e.slice(0,7)>s?e.slice(0,7):s;if(i>n)return o;const r=Ot(i,n),c=t.filter(l=>l.mes>=i&&l.mes<=n).reduce((l,p)=>l+Z(p.desglose.imprevistos.total),0);return{mediaMensual:Math.round(c/r.length)/100,total:c/100,meses:r.length,desde:i,hasta:n}}function wo(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Co(t){let a=null;for(const e of t.movimientos)(!a||e.fecha<a)&&(a=e.fecha);for(const e of t.gastos)e.imprevisto&&e.fechaInicio&&(!a||e.fechaInicio<a)&&(a=e.fechaInicio);return a}function oa(t,a){const e=Ot(At(t,-12),At(t,-1)),o=a.generarExtracto(`${e[0]}-01`,wo(e[e.length-1])),s=aa(o,a.gastos,a.prestamos,e,a.hoy,{movimientos:a.movimientos});return Io(s,t,Co(a))}function jn(t,a){const e=t.hoy.slice(0,7),o=oa(e,t),s=t.movimientos.filter(i=>i.fecha.startsWith(e));return{desglose:ea(a,t.gastos,t.prestamos,t.hoy,{movimientos:s,estimacionImprevistos:o.meses>0?o.mediaMensual:null}),estimacion:o}}const qn=Object.freeze(Object.defineProperty({__proto__:null,desgloseDelMes:ea,desglosePorMeses:aa,esFactura:Me,esMovimientoImprevisto:ho,estimacionImprevistosPara:oa,estimarImprevistos:Io,finDeMes:wo,mediaDeDesgloses:xo,mesEnCurso:jn,mesesDeCalendario:zn,mesesEntre:Ot,primerDatoDeSeguimiento:Co,sumarDesgloses:Bt,sumarMesesA:At},Symbol.toStringTag,{value:"Module"}));function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Et(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(F(t))}</span>`}function Nn(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function So(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const Rn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function st(t){const[a,e]=t.split("-").map(Number);return`${Rn[e-1]} ${a}`}function k(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function rt(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function Pt(t=document){var o;const a=t.getElementById("modal-content");if(!a)return null;const e=a.cloneNode(!1);return a.replaceWith(e),(o=t.getElementById("modal-box"))==null||o.classList.remove("modal-box--ancho"),e}function q(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function Y(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function mt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Mo(t,a){const e=parseFloat(mt(t,a));return Number.isFinite(e)?e:0}const lt={prestamos:"#9085e9",facturas:"#d95926",otros:"#3987e5",imprevistos:"#d55181"},Ln=t=>String(Number(t.slice(8,10)));function Ao(t,a){if(t.partidas.length===0)return"";const e=t.partidas.map(o=>{const s=a.meses!==void 0||a.media?`${o.fechas.length} ${o.fechas.length===1?"cargo":"cargos"}`:o.fechas.length>4?`${o.fechas.length} cargos`:`día ${o.fechas.map(Ln).join(", ")}`;return`<div class="mes-fila${a.meses===void 0&&!a.media&&o.fechas.every(i=>i<=a.hoy)?" mes-fila--hecha":""}">
        <span class="mes-fila-nombre" title="${m(o.concepto)}">${m(o.concepto)}</span>
        <span class="mes-fila-dia">${m(s)}</span>
        <span class="mes-fila-importe">${m(F(o.total))}</span>
      </div>`}).join("");return`<details class="mes-detalle"${a.abierto?" open":""}><summary>${t.partidas.length} ${t.partidas.length===1?"concepto":"conceptos"}</summary>${e}</details>`}function Pe(t,a,e,o,s,n){const i=e.total>0?Math.min(100,e.vencido/e.total*100):0;let r;e.total<=0?r="<span>Nada previsto</span>":o.media&&n?r=`<span>Al mes · <strong>${m(F(o.media.acumulado[n].total))}</strong> en ${o.media.meses} meses</span>`:o.meses!==void 0?r=`<span>Media <strong>${m(F(e.total/Math.max(1,o.meses)))}</strong>/mes</span>`:e.pendiente<=.004?r="<span>Ya cargado todo</span>":r=`<span>Quedan <strong>${m(F(e.pendiente))}</strong></span><span>cargado ${m(F(e.vencido))}</span>`;const c=o.meses!==void 0||o.media?"":`<div class="mes-barra" role="img" aria-label="${Math.round(i)} % ya cargado"><span style="width:${i.toFixed(1)}%"></span></div>`;return`<section class="mes-bloque ${s}" aria-label="${m(t)}">
    <div class="mes-bloque-titulo" title="${m(a)}"><span class="mes-punto" aria-hidden="true"></span>${m(t)}</div>
    <div class="mes-bloque-total">${m(F(e.total))}</div>
    ${c}
    <div class="mes-bloque-pie">${r}</div>
    ${Ao(e,o)}
  </section>`}function kn(t,a){const e=t.imprevistos,o=a.estimacion;if(!(a.meses===void 0&&!a.media&&o&&o.meses>0))return Pe("Imprevistos","Gastos marcados como imprevisto: en el gasto o en el movimiento real",e,a,"mes-bloque--imprevistos","imprevistos");const n=o.mediaMensual,i=n>0?Math.min(100,e.total/n*100):e.total>0?100:0,r=e.total>n+.004,c=r?`<span>Te has pasado <strong>${m(F(e.total-n))}</strong></span>`:t.reservaImprevistos>0?`<span>Reservado <strong>${m(F(t.reservaImprevistos))}</strong></span>`:"<span>Sin imprevistos previstos</span>",l=`Estimación ${F(n)}/mes · media de ${o.meses} ${o.meses===1?"mes":"meses"}`;return`<section class="mes-bloque mes-bloque--imprevistos${r?" es-excedido":""}" aria-label="Imprevistos">
    <div class="mes-bloque-titulo" title="Gastos marcados como imprevisto: en el gasto o en el movimiento real. La estimación es la media de lo marcado en los últimos 12 meses."><span class="mes-punto" aria-hidden="true"></span>Imprevistos</div>
    <div class="mes-bloque-total">${m(F(e.total))}<span class="mes-bloque-de"> de ${m(F(n))}</span></div>
    <div class="mes-barra" role="img" aria-label="${Math.round(i)} % de la estimación"><span style="width:${i.toFixed(1)}%"></span></div>
    <div class="mes-bloque-pie">${c}</div>
    <div class="mes-bloque-pie mes-bloque-nota"><span>${m(l)}</span></div>
    ${Ao(e,a)}
  </section>`}function _e(t,a){const e=t.margen>=0,o=t.margenPct===null?"":` · ${Math.abs(t.margenPct).toFixed(0)} % de lo que entra`,s=a.meses!==void 0&&a.meses>1?`<div class="mes-bloque-pie"><span>Media ${e?"+":"−"}${m(F(Math.abs(t.margen)/a.meses))}/mes</span></div>`:"",n=t.reservaImprevistos>0?`<div class="mes-bloque-pie"><span>${a.media?"Incluye":"Ya descontados"} ${m(F(t.reservaImprevistos))}${a.media?"/mes":""} para imprevistos</span></div>`:"",i=a.media?`<div class="mes-bloque-pie"><span>En ${a.media.meses} meses: <strong>${a.media.acumulado.margen>=0?"+":"−"}${m(F(Math.abs(a.media.acumulado.margen)))}</strong></span></div>`:"";return`<div class="mes-rejilla">
      ${Pe("Préstamos","Cuotas y amortizaciones previstas",t.prestamos,a,"mes-bloque--prestamos","prestamos")}
      ${Pe("Facturas","Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.",t.facturas,a,"mes-bloque--facturas","facturas")}
      ${Pe("Otros gastos","El resto de gastos previstos: compra, ocio, puntuales",t.otros,a,"mes-bloque--otros","otros")}
      ${kn(t,a)}
      <section class="mes-bloque mes-bloque--margen ${e?"es-positivo":"es-negativo"}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas, otros gastos e imprevistos, y menos lo que queda por reservar para imprevistos">Margen de ahorro</div>
        <div class="mes-bloque-total">${e?"+":"−"}${m(F(Math.abs(t.margen)))}</div>
        <div class="mes-bloque-pie"><span>${e?"Te sobra":"Te falta"}${m(o)}</span></div>
        ${s}
        ${i}
        ${n}
        <div class="mes-bloque-pie"><span>Gastos previstos: ${m(F(t.gastosTotales))}${a.media?"/mes":""}</span></div>
      </section>
    </div>`}function On(t,a,e,o=null){return`<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${m(st(a))}</div>
      <div class="mes-cabecera-der">
        <span class="mes-ingresos">Entran <strong>${m(F(t.ingresosNetos))}</strong> netos</span>
        <button type="button" class="btn-secondary btn-sm" data-mes-historico>Meses anteriores</button>
      </div>
    </div>
    ${_e(t,{hoy:e,estimacion:o})}
  </div>`}const X={preset:"6",vista:"mes"},Bn=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],sa=t=>`${Bn[Number(t.slice(5,7))-1]} ${t.slice(2,4)}`,Hn=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),le=t=>`${t>=0?"+":"−"}${F(Math.abs(t))}`;let de=[];function Gn(){for(const t of de)try{t.destroy()}catch{}de=[]}function Vn(t,a,e,o){if(t==="anio")return Ot(`${a.slice(0,4)}-01`,a);if(t==="personalizado"&&e&&o){const n=o>a?a:o;return Ot(e<=n?e:n,n).slice(-36)}const s=Number(t)||6;return Ot(At(a,-(s-1)),a)}function Un(t){var D;const a=t.doc??document,e=a.getElementById("modal-overlay"),o=Pt(a);if(!e||!o)return null;const s=o;(D=a.getElementById("modal-box"))==null||D.classList.add("modal-box--ancho");const n=t.hoy.slice(0,7);let i=[],r=At(n,-1);const c=t.movimientos??[];let l=null;try{l=oa(n,{...t,movimientos:c})}catch(C){console.error("[Meses anteriores] No se ha podido estimar los imprevistos:",C)}function p(){const C=Vn(X.preset,n,X.desde,X.hasta);if(C.length===0){i=[];return}const h=C[C.length-1],[T,_]=h.split("-").map(Number),z=`${h}-${String(new Date(T,_,0).getDate()).padStart(2,"0")}`,j=t.generarExtracto(`${C[0]}-01`,z);i=aa(j,t.gastos,t.prestamos,C,t.hoy,{movimientos:c,estimacion:l&&l.meses>0?{mes:n,importe:l.mediaMensual}:null}),C.includes(r)||(r=C.length>1?C[C.length-2]:C[0])}function d(){const C=(T,_)=>`<button type="button" class="period-btn${X.preset===T?" active":""}" data-hist-preset="${T}" aria-pressed="${X.preset===T}">${_}</button>`,h=X.preset==="personalizado"?`<div class="hist-rango">
            <label>Desde <input class="form-input" type="month" data-hist-desde value="${m(X.desde??"")}" max="${n}"/></label>
            <label>Hasta <input class="form-input" type="month" data-hist-hasta value="${m(X.hasta??n)}" max="${n}"/></label>
          </div>`:"";return`<div class="hist-filtros" role="group" aria-label="Periodo">
        ${C("3","3 meses")}${C("6","6 meses")}${C("12","12 meses")}${C("anio","Este año")}${C("personalizado","Elegir…")}
      </div>${h}`}function u(){return i.map(({mes:C,desglose:h})=>{const T=X.vista==="mes"&&C===r,_=C===n;return`<button type="button" class="hist-ficha${T?" activa":""}" data-hist-mes="${C}" aria-pressed="${T}"
            title="${m(st(C))}${_?" (en curso)":""}: gastos ${m(F(h.gastosTotales))}, margen ${m(le(h.margen))}">
          <span class="hist-ficha-mes">${m(sa(C))}${_?"*":""}</span>
          <span class="hist-ficha-margen ${h.margen>=0?"es-positivo":"es-negativo"}">${m(le(h.margen))}</span>
        </button>`}).join("")}function v(){if(i.length===0)return"";if(X.vista==="media"){const T=i.map(R=>R.desglose),_=xo(T),z=Bt(T),j=`${st(i[0].mes)} – ${st(i[i.length-1].mes)}`,O=i.some(R=>R.mes===n);return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Media mensual · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(j)}${O?" · incluye el mes en curso":""}</div></div>
          <span class="mes-ingresos">Entran <strong>${m(F(_.ingresosNetos))}</strong> netos al mes</span>
        </div>
        ${_e(_,{hoy:t.hoy,media:{meses:i.length,acumulado:z}})}`}if(X.vista==="acumulado"){const T=Bt(i.map(z=>z.desglose)),_=`${st(i[0].mes)} – ${st(i[i.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Acumulado · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(_)}</div></div>
          <span class="mes-ingresos">Entraron <strong>${m(F(T.ingresosNetos))}</strong> netos</span>
        </div>
        ${_e(T,{hoy:t.hoy,meses:i.length})}`}const C=i.find(T=>T.mes===r)??i[i.length-1],h=C.mes===n;return`<div class="hist-detalle-cab">
        <div class="card-title" style="margin:0">${m(st(C.mes))}${h?" · en curso":""}</div>
        <span class="mes-ingresos">Entraron <strong>${m(F(C.desglose.ingresosNetos))}</strong> netos</span>
      </div>
      ${_e(C.desglose,{hoy:t.hoy,abierto:!0,estimacion:h?l:null})}`}function g(){if(i.length===0)return{gastos:"",ahorro:""};const C=Bt(i.map(_=>_.desglose)),h=i.reduce((_,z)=>z.desglose.margen<_.desglose.margen?z:_),T=i.reduce((_,z)=>z.desglose.gastosTotales>_.desglose.gastosTotales?z:_);return{gastos:`Gastos previstos por mes, de ${st(i[0].mes)} a ${st(i[i.length-1].mes)}. El mes de más gasto fue ${st(T.mes)}, con ${F(T.desglose.gastosTotales)}.`,ahorro:`Margen de ahorro de cada mes y acumulado. En el periodo: ${le(C.margen)}. El peor mes fue ${st(h.mes)}, con ${le(h.desglose.margen)}.`}}function b(){Gn(),p();const C=g(),h=i.length?Bt(i.map(_=>_.desglose)):null,T=typeof globalThis.Chart=="function";s.innerHTML=`
      <div class="modal-title">Meses anteriores</div>
      ${d()}
      ${i.length===0?'<p class="text-sm" style="margin-top:14px">Elige un mes de inicio anterior o igual al de fin.</p>':`
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Gastos por mes</h3>
          <span class="text-sm" style="color:var(--text3)">Toca un mes para ver su desglose</span>
        </div>
        <div class="hist-estimacion">${l&&l.meses>0?`<span class="mes-punto" style="--grupo:${lt.imprevistos}" aria-hidden="true"></span>Imprevistos estimados: <strong>${m(F(l.mediaMensual))}/mes</strong> · media de lo marcado en ${l.meses} ${l.meses===1?"mes":"meses"} (${m(F(l.total))} en total)`:"Marca gastos o movimientos como «Imprevisto» y aquí aparecerá cuánto suelen costarte al mes."}
        </div>
        ${T?`<div class="hist-lienzo"><canvas data-hist-gastos role="img" aria-label="${m(C.gastos)}"></canvas></div>`:""}
      </section>
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Impacto en el ahorro</h3>
          <span class="hist-total ${h&&h.margen>=0?"es-positivo":"es-negativo"}">Acumulado ${m(le((h==null?void 0:h.margen)??0))}</span>
        </div>
        ${T?`<div class="hist-lienzo hist-lienzo--bajo"><canvas data-hist-ahorro role="img" aria-label="${m(C.ahorro)}"></canvas></div>`:""}
      </section>
      <div class="hist-fichas" role="group" aria-label="Meses del periodo">${u()}</div>
      ${i.some(_=>_.mes===n)?'<div class="text-sm" style="color:var(--text3);margin-top:4px">* Mes en curso: incluye lo que queda por cargar.</div>':""}
      <div class="hist-filtros hist-vista" role="group" aria-label="Qué desglose ver">
        <button type="button" class="period-btn${X.vista==="mes"?" active":""}" data-hist-vista="mes" aria-pressed="${X.vista==="mes"}">Mes seleccionado</button>
        <button type="button" class="period-btn${X.vista==="media"?" active":""}" data-hist-vista="media" aria-pressed="${X.vista==="media"}">Media del periodo</button>
        <button type="button" class="period-btn${X.vista==="acumulado"?" active":""}" data-hist-vista="acumulado" aria-pressed="${X.vista==="acumulado"}">Acumulado del periodo</button>
      </div>
      <div data-hist-detalle>${v()}</div>`}`,T&&i.length>0&&E()}function $(C){r=C,X.vista="mes";const h=s.querySelector(".hist-fichas");h&&(h.innerHTML=u()),s.querySelectorAll("[data-hist-vista]").forEach(_=>{const z=_.dataset.histVista==="mes";_.classList.toggle("active",z),_.setAttribute("aria-pressed",String(z))});const T=s.querySelector("[data-hist-detalle]");T&&(T.innerHTML=v()),P()}const f="#8b98ad",y="rgba(255,255,255,0.06)",M="#141b27",S="#2ee6a8",w="#ff6b6b",x="#c9d3e3",A=(C,h)=>{var T;return X.vista!=="mes"||((T=i[h])==null?void 0:T.mes)===r?C:`${C}66`};function P(){const[C,h]=de;if(C){const T=[lt.prestamos,lt.facturas,lt.otros,lt.imprevistos];C.data.datasets.forEach((_,z)=>_.backgroundColor=i.map((j,O)=>A(T[z],O))),C.update("none")}if(h){const T=h.data.datasets[0];T.backgroundColor=i.map((_,z)=>A(_.desglose.margen>=0?S:w,z)),h.update("none")}}const I=C=>({position:"top",align:"start",labels:{color:"#c9d3e3",boxWidth:10,boxHeight:10,usePointStyle:!0,font:{size:12},generateLabels:h=>h.data.datasets.map((T,_)=>({text:T.label??"",fillStyle:C[_],strokeStyle:C[_],lineWidth:0,pointStyle:"rectRounded",fontColor:"#c9d3e3",hidden:!h.isDatasetVisible(_),datasetIndex:_}))}});function E(){const C=globalThis.Chart,h=i.map(L=>L.mes===n?`${sa(L.mes)}*`:sa(L.mes)),T=L=>({x:{stacked:L,grid:{display:!1},ticks:{color:f,font:{size:11}},border:{color:y}},y:{stacked:L,grid:{color:y},border:{display:!1},ticks:{color:f,font:{size:11},maxTicksLimit:5,callback:N=>Hn.format(N)}}}),z={responsive:!0,maintainAspectRatio:!1,animation:{duration:250},interaction:{mode:"index",intersect:!1},onClick:(L,N,G)=>{const B=G.getElementsAtEventForMode(L,"index",{intersect:!1},!0);B.length>0&&i[B[0].index]&&$(i[B[0].index].mes)},onHover:(L,N)=>{var B;const G=(B=L.native)==null?void 0:B.target;G&&(G.style.cursor=N.length?"pointer":"default")}},j=L=>({backgroundColor:"#0d131d",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#eef3fb",bodyColor:"#c9d3e3",footerColor:"#8b98ad",padding:10,callbacks:{title:N=>st(i[N[0].dataIndex].mes),label:N=>` ${N.dataset.label}: ${F(N.raw)}`,...L?{footer:N=>L(N[0].dataIndex)}:{}}}),O=s.querySelector("[data-hist-gastos]");if(O){const L=(N,G,B,U)=>({label:N,data:B,backgroundColor:i.map((tt,et)=>A(G,et)),borderColor:M,borderWidth:{top:2},borderSkipped:"bottom",borderRadius:U?{topLeft:4,topRight:4}:0,maxBarThickness:38});de.push(new C(O,{type:"bar",data:{labels:h,datasets:[L("Préstamos",lt.prestamos,i.map(N=>N.desglose.prestamos.total),!1),L("Facturas",lt.facturas,i.map(N=>N.desglose.facturas.total),!1),L("Otros gastos",lt.otros,i.map(N=>N.desglose.otros.total),!1),L("Imprevistos",lt.imprevistos,i.map(N=>N.desglose.imprevistos.total),!0)]},options:{...z,scales:T(!0),plugins:{legend:I([lt.prestamos,lt.facturas,lt.otros,lt.imprevistos]),tooltip:j(N=>`Total: ${F(i[N].desglose.gastosTotales)}`)}}}))}const R=s.querySelector("[data-hist-ahorro]");if(R){let L=0;const N=i.map(G=>L=Math.round((L+G.desglose.margen)*100)/100);de.push(new C(R,{type:"bar",data:{labels:h,datasets:[{type:"bar",label:"Margen del mes",data:i.map(G=>G.desglose.margen),backgroundColor:i.map((G,B)=>A(G.desglose.margen>=0?S:w,B)),borderRadius:4,borderSkipped:!1,maxBarThickness:38,order:2},{type:"line",label:"Ahorro acumulado",data:N,borderColor:x,backgroundColor:x,borderWidth:2,pointRadius:4,pointHoverRadius:6,pointBorderColor:M,pointBorderWidth:2,tension:0,order:1}]},options:{...z,scales:T(!1),plugins:{legend:I([S,x]),tooltip:j(G=>{const B=i[G].desglose;return B.margenPct===null?"":`${B.margenPct.toFixed(0)} % de lo que entró`})}}}))}}return q(s,"[data-hist-preset]",C=>{const h=C.getAttribute("data-hist-preset");if(X.preset=h,h==="personalizado"){const T=i.map(_=>_.mes);X.desde=X.desde??T[0]??At(n,-5),X.hasta=X.hasta??T[T.length-1]??n}b()}),Y(s,"[data-hist-desde], [data-hist-hasta]",()=>{var T,_;const C=(T=s.querySelector("[data-hist-desde]"))==null?void 0:T.value,h=(_=s.querySelector("[data-hist-hasta]"))==null?void 0:_.value;C&&(X.desde=C),h&&(X.hasta=h),b()}),q(s,"[data-hist-mes]",C=>$(C.getAttribute("data-hist-mes"))),q(s,"[data-hist-vista]",C=>{X.vista=C.getAttribute("data-hist-vista"),s.querySelectorAll("[data-hist-vista]").forEach(_=>{const z=_.dataset.histVista===X.vista;_.classList.toggle("active",z),_.setAttribute("aria-pressed",String(z))});const h=s.querySelector(".hist-fichas");h&&(h.innerHTML=u());const T=s.querySelector("[data-hist-detalle]");T&&(T.innerHTML=v()),P()}),b(),e.classList.remove("hidden"),s}function Yn(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:a}function Ht(t,a){return e=>Yn(t,a,e)}const Ft=11,Eo=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Po=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function na(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const _o="default";function Do(){return{_id:_o,nombre:"Yo",esPorDefecto:!0,activo:!0}}function ia(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Eo,tramosGananciasCapital:Po,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function ra(t,a){return{loans:[],expenses:[],accounts:[na(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Do()],config:ia(t,a)}}const bt=t=>Array.isArray(t)?t:[],Wn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function ue(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function To(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function ca(t){const{varianza:a,inflacion:e,...o}=t;return o}function Kn(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=Wn(t.config),r={...ia(e,o)};for(const[p,d]of Object.entries(n))d!=null&&(r[p]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Eo),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Po),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let c=bt(t.accounts).map(p=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),ue(d)});c.length===0&&(c=[na(e)]);const l=c.filter(p=>p.esCuentaPrincipal);if(l.length===0){const p=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===p._id}))}else if(l.length>1){let p=!1;c=c.map(d=>d.esCuentaPrincipal?p?{...d,esCuentaPrincipal:!1}:(p=!0,d):d)}return s.accounts=c,s.expenses=bt(t.expenses).map(p=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=To(d.diaPago),ca(ue(d))}),s.loans=bt(t.loans).map(p=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=To(d.diaPago),d.amortizaciones=bt(d.amortizaciones).map(u=>ue(u)),ca(ue(d))}),s.nominas=bt(t.nominas).map(p=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),ca(ue(d))}),s.goals=bt(t.goals).map((p,d)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...g}=p;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),s.inflacion=bt(t.inflacion),s.tramosIRPFHistorico=bt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=bt(t.tramosGananciasCapitalHistorico),s.escenarios=bt(t.escenarios).map(({inversiones:p,...d})=>d),s}const Gt=t=>Array.isArray(t)?t:[];let la=0;function Jn(t){return la+=1,`${t}_${la.toString(36)}`}const Qn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xn=t=>typeof t=="number"&&Number.isFinite(t);function Zn(t,a){const e={...t};la=0;const o=Gt(t.transacciones),s=Gt(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,p,d,u)=>{if(!Qn(p)||!Xn(d))return;const v=`${l}|${p}`;i.has(v)||(i.add(v),n.push({_id:Jn("pc"),fecha:p,cuentaId:l,saldoCts:ut(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of Gt(t.accounts)){const p=typeof l._id=="string"?l._id:null;if(p)for(const d of Gt(l.historicoSaldos))r(p,d.fecha,d.saldo,d.nota)}const c=Gt(t.history);if(c.length>0){const l=Gt(t.accounts),p=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((l,p)=>String(l.fecha).localeCompare(String(p.fecha))),e}const da=t=>Array.isArray(t)?t:[],ti=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ei=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let ua=0;function ai(){return ua+=1,`tx_hp_${ua.toString(36)}`}function oi(t,a){const e={...t};ua=0;const o=[...da(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=da(t.expenses).map(i=>{const r=da(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!ti(g.fecha)||!ei(g.cuantia))continue;const b=p==="ingreso"?ut(g.cuantia):-ut(g.cuantia),$=`${c}|${g.fecha}|${b}`;s.has($)||(s.add($),o.push({_id:ai(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:p,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=n,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Fo=t=>Array.isArray(t)?t:[],_t=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Vt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,si=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function ni(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=Fo(e.goals),s=Fo(e.accounts),n=s.map(d=>{const u=Vt(d.bloqueoMeses,0);return{_id:`veh_${_t(d._id,"x")}`,nombre:_t(d.nombre,"Cuenta"),rentabilidadRealAnual:Vt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Vt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?ut(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:_t(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Vt(d.interes,0)>0}}),i=new Map(s.map((d,u)=>[_t(d._id,""),n[u]._id])),r=((p=n[0])==null?void 0:p._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>_t(b,"")):[],g=si(d.targetDate);return{_id:_t(d._id,`obj_mig_${u}`),nombre:_t(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:ut(Vt(d.targetAmount,0)),fechaLimite:g,prioridad:Vt(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:_t(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}function ii(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(s=>(s==null?void 0:s._id)===_o)||(e.personas=[Do(),...o]),e}const pe=t=>Array.isArray(t)?t:[];function De(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:s,...n}=o;return n})),e}function ri(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function ci(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=pe(e.loans).map(De),e.expenses=pe(e.expenses).map(De),e.nominas=pe(e.nominas).map(De),e.accounts=pe(e.accounts).map(De),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:s,...n}=e.config;e.config=n}delete e.goals;const o=pe(e.planes).filter(ri);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const zo="supuesto-archivado",Ut=t=>Array.isArray(t)?t:[],jo=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function li(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function di(t,a){const e={...t};let o=0;const s=[],n=c=>{const{escenarioIds:l,...p}=c;if(!jo(c))return p;o+=1;const d=Array.isArray(p.tags)?p.tags:[];return{...p,activo:!1,tags:d.includes(zo)?d:[...d,zo]}};e.expenses=Ut(e.expenses).map(n),e.nominas=Ut(e.nominas).map(n),e.accounts=Ut(e.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:l,...p}=c;return p}return n(c)}),e.loans=Ut(e.loans).map(c=>{const l=n(c);if(Array.isArray(l.amortizaciones)){const p=[];for(const d of l.amortizaciones){const{escenarioIds:u,...v}=d;jo(d)?s.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):p.push(v)}l.amortizaciones=p}return l});const i=[...Ut(e._migracion010_planesArchivados),...Ut(e.planes).filter(li)];delete e._migracion010_planesArchivados,delete e.planes,delete e.goals,delete e.escenarios;const r=e.config&&typeof e.config=="object"?{...e.config}:{};if(delete r.escenarioActivo,i.length>0||s.length>0||o>0){const c=r.archivoMigracion011??{},l={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...s],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=l}return(e.config!==void 0||r.archivoMigracion011)&&(e.config=r),e}const ui=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Kn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Zn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:oi},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:ni},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:ii},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:ci},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:di}],qo=["history","escenarios","planes","goals"],pi=["escenarios","planes","goals"];function No(t,a,e){let o=t;const s=[];for(const n of[...ui].sort((i,r)=>i.version-r.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const ft="state_",me="state__schemaVersion",Yt="financeapp_",pa="state__modificadoEn",Ro="financeapp:sin-espacio";function mi(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent(Ro))}catch{}}function Lo(t=localStorage,a=Yt){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==pa&&t.setItem(e(pa),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n),mi()}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function fi(t=localStorage,a=Yt){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(ft)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function gi({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(s){e={...s,cuando:a()}},pendiente:o,tomar(){const s=o();return e=null,s},limpiar(){e=null}}}const vi={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function bi(t,a){const e=vi[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function hi(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function yi({adapter:t,hoy:a=new Date}){const e=W(a),o=hi(a);let s=ra(e,o);const n=new Set;let i=[];const r=gi();function c(h){for(const T of n)T(h)}function l(h){t.set(`${ft}${h}`,s[h])}function p(){const h={};for(const j of Object.keys(s)){const O=t.get(`${ft}${j}`);O!==null&&(h[j]=O)}for(const j of qo){const O=t.get(`${ft}${j}`);O!==null&&(h[j]=O)}const T=t.get(me),{state:_,applied:z}=No(h,T,{hoyISO:e,finISO:o});if(s=d(_),u(),z.length>0){for(const j of Object.keys(s))l(j);t.set(me,Ft);for(const j of pi)t.remove(`${ft}${j}`)}return i=z,{applied:z}}function d(h){const T=ra(e,o),_={...T,...h};for(const j of Object.keys(T))j!=="config"&&(Array.isArray(_[j])||(_[j]=T[j]));const z=h.config&&typeof h.config=="object"?h.config:{};return _.config={...ia(e,o),...z},_}function u(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[na(e)],l("accounts");return}const h=s.accounts.filter(T=>T.esCuentaPrincipal);if(h.length===0)s.accounts=s.accounts.map((T,_)=>_===0?{...T,esCuentaPrincipal:!0}:T),l("accounts");else if(h.length>1){let T=!1;s.accounts=s.accounts.map(_=>_.esCuentaPrincipal?T?{..._,esCuentaPrincipal:!1}:(T=!0,_):_),l("accounts")}}function v(h){return s[h]}function g(h,T){s[h]=T,l(h),c(h)}function b(h){g("config",{...s.config,...h})}function $(h){return n.add(h),()=>n.delete(h)}function f(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function y(h,T){const _=[...s[h]],z={...T,_id:f()};return _.push(z),g(h,_),z}function M(h,T,_){const z=s[h].map(j=>j._id===T?{...j,..._}:j);g(h,z)}function S(h,T){const _=s[h],z=_.findIndex(j=>j._id===T);z<0||(r.registrar({col:h,item:_[z],indice:z}),g(h,_.filter((j,O)=>O!==z)))}function w(){const h=r.tomar();if(!h)return null;const T=[...s[h.col]];return T.splice(Math.min(h.indice,T.length),0,h.item),g(h.col,T),h}function x(){return r.pendiente()}function A(){const h=s.accounts||[],T=h.find(_=>_.esCuentaPrincipal&&_.activo)||h.find(_=>_.activo);return T?T._id:"default"}function P(h){var T;return((T=s.accounts.find(_=>_._id===h))==null?void 0:T.nombre)??h}function I(){return Ht(s.tramosIRPFHistorico,s.config.tramos_irpf)}function E(){return Ht(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function D(){return structuredClone(s)}function C(h,T=null){const{state:_,applied:z}=No(h,T,{hoyISO:e,finISO:o});s=d(_),u();for(const j of Object.keys(s))l(j);t.set(me,Ft);for(const j of Object.keys(s))c(j);return{applied:z}}return{load:p,get:v,set:g,patchConfig:b,subscribe:$,addItem:y,updateItem:M,removeItem:S,deshacerBorrado:w,borradoPendiente:x,getPrincipalAccountId:A,accountName:P,resolverTramosIRPF:I,resolverTramosGanancias:E,snapshot:D,replaceAll:C,get schemaVersion(){return Ft},get migrationsApplied(){return[...i]},get today(){return e||J()}}}function $i(){let t=0,a=null;const e=new Set;function o(s){t+=1,a=s;for(const n of e)try{n(t,s)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(s){return e.add(s),()=>e.delete(s)},crearMarca(s){let n=t;return{nombre:s,pendiente:()=>t>n,alDia:i=>{n=Math.max(n,i??t)},vista:()=>n}}}}const zt=Object.keys(ra("1970-01-01","1970-01-01"));function ko(t){const a={};for(const e of zt){const o=t.get(`${ft}${e}`);o!=null&&(a[e]=o)}return a}function xi(t,a){const e=[];for(const o of zt){const s=a[o];s!=null&&(t(`${ft}${o}`,s),e.push(o))}return e}function Ii(t){return zt.filter(a=>t[a]===void 0||t[a]===null)}function wi(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!zt.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Oo="_schemaVersion";function Ci(t,a){const e=t[Oo];if(typeof e=="number"&&Number.isFinite(e))return Math.min(e,a);const o=r=>Array.isArray(t[r])?t[r]:[],s=t.config&&typeof t.config=="object"?t.config:null;if(s&&s.features===void 0)return 4;if(t.transacciones===void 0&&t.expenses!==void 0)return 5;if(o("expenses").some(r=>Array.isArray(r.historialPrecios)&&r.historialPrecios.length>0))return 6;if(t.personas===void 0&&t.expenses!==void 0)return 8;const n=r=>r.some(c=>Array.isArray(c.escenarioIds)&&c.escenarioIds.length>0);return t.escenarios!==void 0||t.planes!==void 0||t.goals!==void 0||n(o("expenses"))||n(o("loans"))||n(o("nominas"))||n(o("accounts"))||o("loans").some(r=>n(Array.isArray(r.amortizaciones)?r.amortizaciones:[]))?Math.min(10,a):a}const Bo=`${Yt}meta_proyectos`,Ho=`${Yt}meta_proyectoActivo`,jt="default",Si="Mis finanzas";function ma(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Wt(t){return t===jt?Yt:`${Yt}p_${t}_`}function Go(){return[...zt.map(t=>`${ft}${t}`),me,pa]}function Mi(t=localStorage){function a(){try{const d=t.getItem(Bo);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function e(d){t.setItem(Bo,JSON.stringify(d))}function o(){const d=a();if(d.some(g=>g._id===jt))return d;const u=Date.now(),v=[{_id:jt,nombre:Si,creadoEn:u,actualizadoEn:u},...d];return e(v),v}function s(){try{const d=t.getItem(Ho);if(!d)return jt;const u=JSON.parse(d);return typeof u=="string"&&u?u:jt}catch{return jt}}function n(d){t.setItem(Ho,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:ma(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),g]),g}function r(d,u){const v=u.trim();v&&e(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=Wt(d),b={_id:ma(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},$=Wt(b._id);for(const f of Go()){const y=t.getItem(`${g}${f}`);y!==null&&t.setItem(`${$}${f}`,y)}return e([...o(),b]),b}function l(d){if(d===jt)throw new Error("No se puede eliminar el proyecto original.");if(d===s())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=Wt(d);for(const g of Go())t.removeItem(`${v}${g}`);e(u.filter(g=>g._id!==d))}function p(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return e(v),v}return{listar:o,activo:s,establecerActivo:n,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:p}}function Ai(t,a,e){const o=Lo(t,Wt(a)),s={};for(const n of e){const i=o.get(`${ft}${n}`);s[n]=Array.isArray(i)?i:[]}return s}function Ei(t){const a=new Map;for(const s of Object.values(t))for(const n of s){const i=n==null?void 0:n._id;typeof i=="string"&&!a.has(i)&&a.set(i,ma())}function e(s){if(typeof s=="string")return a.get(s)??s;if(Array.isArray(s))return s.map(e);if(s&&typeof s=="object"){const n={};for(const[i,r]of Object.entries(s))n[i]=e(r);return n}return s}const o={};for(const[s,n]of Object.entries(t))o[s]=n.map(e);return o}const dt={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Dt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:dt.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:dt.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:dt.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:dt.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:dt.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:dt.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:dt.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:dt.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:dt.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:dt.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:dt.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:dt.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:dt.datos,porDefecto:!1,dependencias:["sync-nube"]}],Pi=new Map(Dt.map(t=>[t.id,t]));function fe(t){return Pi.get(t)}function Vo(t){return Dt.filter(a=>(a.dependencias||[]).includes(t))}function fa(){const t={};for(const a of Dt)t[a.id]=a.porDefecto;return t}function Uo(){const t=[],a=new Map;for(const e of Dt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function _i(t){function a(){return{...fa(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,u=a(),v=new Set){const g=fe(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function s(d,u=a()){const v=fe(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function n(d,u){var M;const v=fe(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),b=new Map(Dt.map(S=>[S.id,o(S.id,g)])),$={...g,[d]:u};let f;if(u){const S=[...v.dependencias||[]];for(;S.length;){const w=S.pop();$[w]===!1&&($[w]=!0,f="dependencias-activadas"),S.push(...((M=fe(w))==null?void 0:M.dependencias)||[])}}else{const S=Vo(d).map(w=>w.id);for(;S.length;){const w=S.pop();$[w]!==!1&&($[w]=!1,f="cascada-apagado"),S.push(...Vo(w).map(x=>x.id))}}return e($),{cambiadas:Dt.filter(S=>o(S.id,$)!==b.get(S.id)).map(S=>S.id),motivo:f}}function i(){const d=a();return Dt.map(u=>{const v=s(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=a();return Uo().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=s(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(fa())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function p(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=fa(),b=[],$=[];for(const[f,y]of Object.entries(v)){if(!fe(f)){$.push(f);continue}if(typeof y!="boolean"){$.push(f);continue}g[f]=y,b.push(f)}return e(g),{aplicadas:b,ignoradas:$}}return{isEnabled:d=>o(d),setEnabled:n,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:p,bloqueadaPor:d=>s(d)}}const ge=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Kt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Di(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(ge).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${ge(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${ge(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${ge(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Ti(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${ge(o)}</div>
        ${s.map(Di).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Fi(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function zi(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Ti(e)}`,s(i)}function s(i){var c,l,p;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=e.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&Kt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Kt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=a.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${J()}.json`,g.click(),URL.revokeObjectURL(v),Kt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:b}=e.importProfile(JSON.parse(await d.text()));Kt(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){Kt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var d;e.reset(),Kt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function n(){const i=Fi(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const ht=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ji={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Yo(t){return ji[t]??t}function $t(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Wo(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function qi(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Ni(){var a,e,o,s;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(s=(o=t.Router)==null?void 0:o.rerender)==null||s.call(o)}function Ri(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-proyectos-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Li(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${ht(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${ht(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${ht(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${ht(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${ht(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${ht(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ki(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const s=o.map(i=>`<option value="${ht(i._id)}">${ht(i.nombre)}</option>`).join(""),n=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ht(i)}"/> ${ht(Yo(i))}
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
      <select id="proyecto-import-origen" class="auth-input" style="margin:4px 0 10px">${s}</select>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--hairline-soft);border-radius:8px;padding:6px 10px;margin-bottom:10px">
        ${n}
      </div>
      <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-import-btn">Importar</button>
    </div>`}function Oi(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Bi(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Li(l,c)).join("")}
      </div>
      ${Oi()}
      ${ki(r,c,e.colecciones)}`}function s(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,n(r)}function n(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!Wo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(d),qi(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;e.renombrar(d,g.trim()),$t(t,"Proyecto renombrado"),s(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const $=e.duplicar(d,b.trim()||g);$t(t,`"${$.nombre}" creado como copia de "${v.nombre}" ✓`),s(r);return}if(u==="eliminar"){if(!Wo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),$t(t,`"${v.nombre}" eliminado`),s(r)}catch(g){$t(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),d=p==null?void 0:p.value.trim();if(!d){$t(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(d);$t(t,`"${u.nombre}" creado ✓`),s(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){$t(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,d);if(u.length===0){$t(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}$t(t,`Importado: ${u.map(Yo).join(", ")} ✓`),Ni(),s(r)})}function i(){const r=Ri(a);s(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:s}}const Te=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],qt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Jt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Hi(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Gi(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-personas-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Vi(t){const a=t.color||Te[0];return`
    <div class="dm-section" data-persona-fila="${qt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${qt(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${qt(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${qt(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${qt(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${qt(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${qt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ui(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${Te.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${Te[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Yi(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Vi).join("")}
      </div>
      ${Ui()}`}function s(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=e.get("personas"),b=g.find($=>$._id===u);if(b){if(v==="renombrar"){const $=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!$||!$.trim())return;e.updateItem("personas",u,{nombre:$.trim()}),Jt(t,"Persona renombrada"),n(),s(c);return}if(v==="defecto"){e.set("personas",g.map($=>({...$,esPorDefecto:$._id===u}))),Jt(t,`"${b.nombre}" es ahora la persona por defecto`),n(),s(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),n(),s(c);return}if(v==="eliminar"){if(g.length<=1){Jt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Hi(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),Jt(t,`"${b.nombre}" eliminada`),n(),s(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){Jt(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||Te[0],g=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});Jt(t,`"${g.nombre}" creada ✓`),n(),s(c)})}function r(){const c=Gi(a);s(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:s}}const Ko={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Jo(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Wi({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,p])=>[p,l]);for(const[l,p]of[...Object.entries(Ko),...c]){const d=t.isEnabled(l),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=d?"":"none"),!d&&s()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const p=[...l.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const d=p.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),Jo(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{Jo(a,p=>t.isEnabled(p))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:n,observar:i,vistaPara:r=>Ko[r]}}const Ki="toast toast-deshacer";function Ji(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function l(d){const u=s();if(!u)return;c();const v=document.createElement("div");v.className=Ki,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${bi(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const $=a.deshacerBorrado();if(c(),!$)return;const f=s();if(f){const y=document.createElement("div");y.className="toast toast-ok",y.textContent="Deshecho.",f.appendChild(y),setTimeout(()=>y.remove(),2500)}e==null||e()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),n=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{p(),c()}}function Fe(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Qo(t,a){const e=Fe(t),o=Fe(a);if(!o)return-1;const s=e.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(e[s-1])?1:2}const ve=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Qi(t){const a=[],e=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";a.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[ve(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:ve(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:ve(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${ve(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,ve(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Xi(t,a,e={}){const{maximo:o=12,rutasDisponibles:s=null}=e,n=Fe(a);if(n.length<2)return[];const i=c=>s===null||s.includes(c),r=[];for(const c of Qi(t)){if(!i(c.ruta))continue;const l=Qo(c.titulo,n),p=l>=0?-1:Math.min(Qo(c.extra??"",n),2);if(l<0&&p<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,Fe(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const Zi="buscador-overlay",Xo="btn-buscador";function tr(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function c(){const S=a.createElement("div");S.id=Zi,S.className="modal-overlay",S.style.alignItems="flex-start",S.style.paddingTop="10vh";const w=a.createElement("div");w.className="modal-box",w.style.maxWidth="560px",w.style.padding="14px";const x=a.createElement("input");x.type="search",x.className="form-input",x.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",x.setAttribute("aria-label","Buscar en toda la aplicación"),x.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",w.appendChild(x),w.appendChild(A),S.appendChild(w),a.body.appendChild(S),S.addEventListener("click",P=>{P.target===S&&b()}),x.addEventListener("input",()=>{r=0,p()}),x.addEventListener("keydown",v),o=S,s=x,n=A,S}function l(){if(n){if(n.textContent="",i.length===0){const S=a.createElement("div");S.style.padding="14px 4px",S.style.fontSize="13px",S.style.color="var(--text3)";const w=(s==null?void 0:s.value.trim())??"";S.textContent=w.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild(S);return}i.forEach((S,w)=>{const x=a.createElement("button");x.type="button",x.className="buscador-fila",x.dataset.indice=String(w),w===r&&x.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const P=a.createElement("div");P.textContent=S.titulo,P.style.fontSize="13px",P.style.overflow="hidden",P.style.textOverflow="ellipsis",P.style.whiteSpace="nowrap";const I=a.createElement("div");I.textContent=S.detalle,I.style.fontSize="11px",I.style.color="var(--text3)",I.style.overflow="hidden",I.style.textOverflow="ellipsis",I.style.whiteSpace="nowrap",A.appendChild(P),S.detalle&&A.appendChild(I);const E=a.createElement("span");E.className="tag",E.textContent=S.etiqueta,E.style.flexShrink="0",x.appendChild(A),x.appendChild(E),x.addEventListener("click",()=>u(w)),n.appendChild(x)})}}function p(){const S=(s==null?void 0:s.value)??"";i=Xi(t.estado(),S,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(S){var w,x;i.length!==0&&(r=(r+S+i.length)%i.length,l(),(x=(w=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:w.scrollIntoView)==null||x.call(w,{block:"nearest"}))}function u(S){const w=i[S];w&&(b(),t.navegar(w.ruta))}function v(S){S.key==="Escape"?(S.preventDefault(),b()):S.key==="ArrowDown"?(S.preventDefault(),d(1)):S.key==="ArrowUp"?(S.preventDefault(),d(-1)):S.key==="Enter"&&(S.preventDefault(),u(r))}function g(){const S=o??c();S.classList.remove("hidden"),S.style.display="",r=0,s&&(s.value="",s.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function $(){return!!o&&o.style.display!=="none"}function f(S){(S.ctrlKey||S.metaKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),$()?b():g())}a.addEventListener("keydown",f);let y=null;function M(){const S=a.getElementById("period-bar");if(!S||a.getElementById(Xo))return;const w=a.createElement("button");w.id=Xo,w.type="button",w.className="btn-secondary",w.title="Buscar en toda la aplicación (Ctrl+K)",w.setAttribute("aria-label","Buscar"),w.textContent="🔍 Buscar",w.style.marginLeft="auto",w.addEventListener("click",g),S.appendChild(w),y=w}return M(),()=>{a.removeEventListener("keydown",f),y==null||y.remove(),o==null||o.remove(),o=null,s=null,n=null}}const ga="aviso-guardado";function er(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,s=t.cambios.crearMarca("guardado");let n="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(ga))==null||g.remove()}function p(){if(n==="oculto")return l();const g=e();if(!g)return;let b=a.getElementById(ga);b||(b=a.createElement("div"),b.id=ga,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${n}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const $=a.createElement("span");if($.style.flex="1",b.appendChild($),n==="pendiente")$.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,n="oculto",p()}));else if(n==="subiendo"){$.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else n==="guardado"?$.textContent="¡Guardado!":n==="error"&&($.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,b,$){const f=a.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",$),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return n="subiendo",p(),c=(async()=>{try{await t.guardar(),s.alDia(g),n="guardado",p(),r=setTimeout(()=>{n=s.pendiente()?"pendiente":"oculto",n==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),n=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,n!=="subiendo"&&(n="pendiente",p()))});return{estado:()=>i&&n==="oculto"?"oculto":n,guardarAhora:u,hayPendiente:()=>s.pendiente(),detener(){v(),l()}}}function ar({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const b=t.getElementById(s(g.route));if(b)return b;const $=t.querySelector(".view-container");if(!$)return null;const f=t.createElement("div");return f.id=s(g.route),f.className="view hidden",$.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),$=b[g.seccion??Math.max(0,b.length-1)];if(!$)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,$.appendChild(f),f.addEventListener("click",()=>{const y=globalThis.Router;y==null||y.navigate(g.route)})}function r(g){e.set(g.route,g),n(g),i(g)}function c(){return[...e.keys()].filter(g=>{const b=e.get(g);return!a||a(b.flagId??b.id)})}function l(g){return c().includes(g)}function p(g){const b=e.get(g);if(!b||a&&!a(b.flagId??b.id))return!1;const $=n(b);if(!$)return!1;if(o&&o!==g){const f=e.get(o),y=t.getElementById(s(o));f!=null&&f.unmount&&y&&f.unmount(y)}return b.mount($),o=g,!0}function d(){o&&p(o)}function u(){const g={};for(const[b,$]of e)g[b]=$.flagId??$.id;return g}function v(){for(const g of e.values())n(g),i(g)}return{register:r,routes:c,has:l,mount:p,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}const or="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function va(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function sr(t){const{store:a}=t,e=t.hoy??J,o=()=>H(e()),s=()=>a.get("config").margenesSeguridad??[];function n(v){var g;a.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=s().map(f=>({...f,puntos:(f.puntos??[]).map(y=>({...y}))})),$=b.find(f=>f._id===v);$&&(g($),n(b))}function r(v){const g=a.get("config"),b=ta(v,a.get("expenses"),g,a.get("loans"),e(),!1,o());return F(b)}function c(v,g,b){const $=g.tipo==="fijo",f=$?"":`<span class="text-sm" style="color:var(--text3)">${m(F((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${$?" selected":""}>Fijo €</option>
            <option value="meses"${$?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${$?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${$?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,g,b){const $=v.cuentas&&v.cuentas.length>0?v.cuentas.map(S=>{var w;return((w=g.find(x=>x._id===S))==null?void 0:w.nombre)??S}).join(", "):"Todas las cuentas activas",y=[...v.puntos??[]].sort((S,w)=>S.fecha.localeCompare(w.fecha)).map(S=>c(v,S,b)).join(""),M=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m($)}</div>
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
            ${y||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
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
      </div>`}function p(v,g){const b=g?s().find(M=>M._id===g):null,$=a.get("accounts").filter(M=>M.activo),f=new Set((b==null?void 0:b.cuentas)??[]),y=$.map(M=>`
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
          ${y||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${b?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(J())}"/></div>
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
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),$=Pt();!b||!$||(p($,v),b.classList.remove("hidden"),Y($,".mg-acc-chip",f=>{const y=f,M=$.querySelector(`[data-chip="${y.value}"]`);M&&(M.style.cssText=`cursor:pointer;${y.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),Y($,"#mg-p-tipo",f=>{const y=f.value==="fijo",M=$.querySelector("#mg-p-importe-wrap"),S=$.querySelector("#mg-p-meses-wrap");M&&(M.style.display=y?"":"none"),S&&(S.style.display=y?"none":"")}),q($,"[data-cerrar-form]",()=>b.classList.add("hidden")),q($,"[data-guardar-margen]",f=>{var x,A,P,I,E;const y=f.getAttribute("data-guardar-margen")||"",M=((x=$.querySelector("#mg-nombre"))==null?void 0:x.value.trim())??"";if(!M)return k("El nombre es obligatorio","err");const S=[...$.querySelectorAll(".mg-acc-chip:checked")].map(D=>D.value),w=s().map(D=>({...D}));if(y){const D=w.findIndex(C=>C._id===y);if(D===-1)return k("Margen no encontrado","err");w[D]={...w[D],nombre:M,cuentas:S}}else{const D=((A=$.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",C={_id:va(),fecha:((P=$.querySelector("#mg-p-fecha"))==null?void 0:P.value)||J(),tipo:D,importe:parseFloat(((I=$.querySelector("#mg-p-importe"))==null?void 0:I.value)??"0")||0,meses:parseFloat(((E=$.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};w.push({_id:va(),nombre:M,activo:!0,cuentas:S,puntos:[C]})}n(w),k(y?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=s(),b=a.get("accounts"),$=ce(a.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(y=>l(y,b,$)).join("")}`;const f=()=>u(v);q(v,"[data-nuevo-margen]",()=>d(null,f)),q(v,"[data-editar-margen]",y=>d(y.getAttribute("data-editar-margen"),f)),q(v,"[data-borrar-margen]",y=>{rt("¿Eliminar este margen de seguridad?")&&(n(s().filter(M=>M._id!==y.getAttribute("data-borrar-margen"))),k("Margen eliminado"),f())}),Y(v,"[data-toggle-margen]",y=>{const M=y.getAttribute("data-toggle-margen");i(M,S=>{S.activo=y.checked}),f()}),q(v,"[data-add-punto]",y=>{const M=y.getAttribute("data-add-punto");i(M,S=>{S.puntos=[...S.puntos??[],{_id:va(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),f()}),q(v,"[data-borrar-punto]",y=>{const M=y.closest("[data-punto]");if(!M)return;const S=M.dataset.margen,w=M.dataset.punto;i(S,x=>{x.puntos=(x.puntos??[]).filter(A=>A._id!==w)}),f()}),Y(v,"[data-campo]",y=>{const M=y.closest("[data-punto]");if(!M)return;const S=y.getAttribute("data-campo"),w=y.value;i(M.dataset.margen,x=>{const A=(x.puntos??[]).find(P=>P._id===M.dataset.punto);A&&(S==="fecha"?A.fecha=w:S==="tipo"?A.tipo=w:S==="importe"?A.importe=parseFloat(w)||0:A.meses=parseFloat(w)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:or,mount:u}}const nr=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],ir=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],rr=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function cr(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ba=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function Zo(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=cr(t),i=ba(nr.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ba(ir,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ba(rr,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function ts(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function es(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const lr={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function dr(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Qt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const s=(a==null?void 0:a.modo)??"",n=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=s==="porcentaje"||s==="importe",r=c=>{const l=n.has(c._id),p=n.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${l?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${m(o)}" data-persona="${m(c._id)}"
             value="${p??""}" step="0.01" min="0" placeholder="${s==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${m(o)}">
    <label class="form-label">${m(t)}</label>
    <select class="form-select" data-reparto-modo="${m(o)}">
      <option value=""${s?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${s==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${s==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${s==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${m(o)}" style="margin-top:6px;${s?"":"display:none"}">
      ${dr(e,a).map(r).join("")}
    </div>
  </div>`}function Xt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",s=e.querySelector(`[data-reparto-participantes="${a}"]`);s&&(s.style.display=o?"":"none");const n=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=n?"":"none"})}function Zt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const s=[...e.querySelectorAll(".reparto-persona:checked")];if(s.length===0)return;const n=s.map(r=>{const c=r.value,l=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=l?parseFloat(l.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:n}}function as(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var s;return((s=a.find(n=>n._id===o.personaId))==null?void 0:s.nombre)??"?"}).join(", ")} (${lr[t.modo]})`}function ha(t,a,e){const o=as(t,e),s=as(a,e);return!o&&!s?"":o===s?`Reparto: ${o}`:[s&&`Paga: ${s}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const ur="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",pr=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function mr(t){const a=t.hoy??J,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var y;return((y=s().find(M=>M._id===(f||"default")))==null?void 0:y.nombre)??(f||"default")};function i(){const f=a();let y=[...t.store.get("expenses")];if(e.mostrarExpirados||(y=y.filter(M=>!M.fechaFin||M.fechaFin>=f)),e.tipo&&(y=y.filter(M=>M.tipo===e.tipo)),e.cuenta&&(y=y.filter(M=>(M.cuenta||"default")===e.cuenta)),e.desde&&(y=y.filter(M=>(M.fechaInicio??"")>=e.desde)),e.hasta&&(y=y.filter(M=>(M.fechaInicio??"")<=e.hasta)),e.busqueda){const M=e.busqueda.toLowerCase();y=y.filter(S=>S.concepto.toLowerCase().includes(M))}return e.tags.size>0&&(y=y.filter(M=>(M.tags||[]).some(S=>e.tags.has(S)))),y.sort((M,S)=>{const w=M[e.orden]??"",x=S[e.orden]??"";return typeof w=="number"&&typeof x=="number"?(w-x)*e.sentido:String(w).localeCompare(String(x))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,y){const M=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(y)} <span class="sort-arrow">${M}</span></span>`}function l(f,y=!1){return(y?'<option value="">Todas las cuentas</option>':"")+s().filter(S=>S.activo!==!1).map(S=>`<option value="${m(S._id)}"${S._id===f?" selected":""}>${m(S.nombre)}</option>`).join("")}function p(f){const y=f.tipo==="transferencia",M=ha(f.repartoConsumo,f.repartoPago,t.store.get("personas")),S=Ve(f.diaPago??""),w=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${S?` · ${S}`:""}`,x=!!f.fechaFin&&f.fechaFin<a(),A=y?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',P=y?`${m(n(f.cuenta))} → ${m(n(f.cuentaDestino))}`:m(n(f.cuenta)),I=(f.tags||[]).map(E=>`<span class="tag${e.tags.has(E)?" active":""}" data-tag="${m(E)}" title="Filtrar por ${m(E)}">${m(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${I}</div>
      </div>
      <div>${A}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":y?"":"neg"}">${y?"⇄ ":""}${m(F(f.cuantia))}</div>
      <div class="text-sm">${m(w)}</div>
      <div class="text-sm exp-col-hide">${P}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.tipo==="gasto"&&f.imprevisto?'<span class="badge" style="background:rgba(213,81,129,0.14);color:#e87ba4" title="Cuenta como imprevisto en «Este mes»">imprevisto</span>':""}
        ${f.tipo==="gasto"&&!f.imprevisto&&Me(f)?'<span class="badge" style="background:rgba(77,159,255,0.12);color:#4d9fff" title="Cuenta como factura en «Este mes»">factura</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(M)}">👥 reparto</span>`:""}
        ${x?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const y=i(),M=r();f.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${l(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${m(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${m(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${M.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${M.map(S=>`<span class="tag${e.tags.has(S)?" active":""}" data-tag="${m(S)}">${m(S)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${y.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':y.map(p).join("")}
      </div>`}function u(f){const y=(f==null?void 0:f.tipo)==="transferencia",M=t.store.get("personas"),S=(w,x,A,P,I="")=>`<div class="form-group"><label class="form-label">${m(x)}</label>
       <input class="form-input" type="${A}" id="${w}" value="${m(P)}" placeholder="${m(I)}"/></div>`;return`
      <div class="grid-2">
        ${S("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${y?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${S("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${S("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${pr.map(([w,x])=>`<option value="${w}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===w?" selected":""}>${m(x)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${S("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${y?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8" id="ef-imprevisto-wrap"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?"":' style="display:none"'}>
        <label class="form-label" for="ef-imprevisto">Imprevisto</label>
        <label class="toggle"><input type="checkbox" id="ef-imprevisto"${f!=null&&f.imprevisto?" checked":""}/><span class="toggle-slider"></span></label>
        <span class="text-sm" style="margin-left:6px">Una avería, el dentista… Se sigue aparte y entra en la estimación de imprevistos</span>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${S("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${Zo(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${y?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((f==null?void 0:f.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(f==null?void 0:f.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(f==null?void 0:f.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="mt-8" id="ef-factura-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label" for="ef-factura">¿Es una factura o recibo?</label>
                <select class="form-select" id="ef-factura">
                  <option value=""${(f==null?void 0:f.esFactura)===void 0?" selected":""}>Automático${f?` (ahora: ${Me({...f,esFactura:void 0})?"sí":"no"})`:""}</option>
                  <option value="si"${(f==null?void 0:f.esFactura)===!0?" selected":""}>Sí: cargo fijo que llega solo</option>
                  <option value="no"${(f==null?void 0:f.esFactura)===!1?" selected":""}>No</option>
                </select>
                <div class="text-sm mt-4" style="color:var(--text3)">Decide en qué bloque de «Este mes» aparece en el cuadro de mando.</div>
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
          ${y?"":`${Qt("Reparto de consumo",f==null?void 0:f.repartoConsumo,M,"consumo")}
                 ${Qt("Reparto de pago",f==null?void 0:f.repartoPago,M,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var S;const y=((S=f.querySelector("#ef-tipo"))==null?void 0:S.value)??"gasto",M=(w,x)=>{const A=f.querySelector(w);A&&(A.style.display=x?"":"none")};M("#ef-destino-wrap",y==="transferencia"),M("#ef-basico-wrap",y!=="transferencia"),M("#ef-irpf-wrap",y==="ingreso"),M("#ef-clasificacion-wrap",y==="gasto"),M("#ef-factura-wrap",y==="gasto"),M("#ef-imprevisto-wrap",y==="gasto")}function g(f,y,M){const S=document.getElementById("modal-overlay"),w=Pt();!S||!w||(w.innerHTML=`<div class="modal-title">${m(y)}</div>${u(f)}`,S.classList.remove("hidden"),Y(w,"#ef-tipo",()=>v(w)),Y(w,"[data-dp-modo]",()=>ts(w)),Y(w,'[data-reparto-modo="consumo"]',()=>Xt(w,"consumo")),Y(w,'[data-reparto-modo="pago"]',()=>Xt(w,"pago")),q(w,"[data-cancelar]",()=>S.classList.add("hidden")),q(w,"[data-guardar]",x=>{b(w,x.getAttribute("data-guardar")||"")&&(S.classList.add("hidden"),M())}))}function b(f,y){const M=z=>{var j;return((j=f.querySelector(z))==null?void 0:j.value)??""},S=z=>{var j;return!!((j=f.querySelector(z))!=null&&j.checked)},w=M("#ef-tipo")||"gasto",x=w==="transferencia",A=M("#ef-concepto").trim(),P=parseFloat(M("#ef-cuantia").replace(",",".")),I=M("#ef-fecha-ini"),E=M("#ef-fecha-fin")||null,D=A?!Number.isFinite(P)||P<=0?"La cuantía debe ser mayor que 0 (el signo lo pone el tipo: gasto o ingreso)":I?E&&E<I?"La fecha de fin no puede ser anterior a la de inicio":x&&M("#ef-cuenta")===(M("#ef-cuenta-dest")||"default")?"En una transferencia, la cuenta de destino tiene que ser distinta de la de origen":"":"Indica la fecha de inicio":"Escribe un concepto";if(D)return k(D,"err"),!1;const C=M("#ef-tags").split(",").map(z=>z.trim()).filter(z=>z&&z!=="transferencia"),h=x?[...new Set([...C,"transferencia"])]:[...new Set(C)],T=M("#ef-clasificacion"),_={concepto:A,tipo:w,cuantia:P,frecuencia:parseInt(M("#ef-frecuencia"),10)||1,tipoFrecuencia:M("#ef-tipo-frec")||"mensual",fechaInicio:I,fechaFin:E,diaPago:es(f),cuenta:M("#ef-cuenta"),cuentaDestino:x?M("#ef-cuenta-dest")||"default":void 0,activo:S("#ef-activo"),basico:!x&&S("#ef-basico"),sujetoIRPF:!x&&S("#ef-sujetoIRPF"),clasificacion:w==="gasto"?T||null:void 0,esFactura:w==="gasto"?M("#ef-factura")==="si"?!0:M("#ef-factura")==="no"?!1:void 0:void 0,imprevisto:w==="gasto"&&S("#ef-imprevisto")?!0:void 0,tags:h,repartoConsumo:x?void 0:Zt(f,"consumo"),repartoPago:x?void 0:Zt(f,"pago")};return y?(t.store.updateItem("expenses",y,_),k("Actualizado")):(t.store.addItem("expenses",_),k("Creado")),o(),!0}function $(f,y){const M=f.querySelector("[data-busqueda]");let S;M==null||M.addEventListener("input",()=>{clearTimeout(S),S=setTimeout(()=>{e.busqueda=M.value,y();const w=f.querySelector("[data-busqueda]");w==null||w.focus(),w==null||w.setSelectionRange(w.value.length,w.value.length)},250)}),Y(f,"[data-expirados]",w=>{e.mostrarExpirados=w.checked,y()}),Y(f,"[data-f-tipo]",w=>{e.tipo=w.value,y()}),Y(f,"[data-f-cuenta]",w=>{e.cuenta=w.value,y()}),Y(f,"[data-f-desde]",w=>{e.desde=w.value,y()}),Y(f,"[data-f-hasta]",w=>{e.hasta=w.value,y()}),q(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,y()}),q(f,"[data-limpiar-tags]",()=>{e.tags=new Set,y()}),q(f,"[data-tag]",w=>{const x=w.getAttribute("data-tag");e.tags.has(x)?e.tags.delete(x):e.tags.add(x),y()}),q(f,"[data-orden]",w=>{const x=w.getAttribute("data-orden");e.orden===x?e.sentido=e.sentido===1?-1:1:(e.orden=x,e.sentido=1),y()}),q(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",y)),q(f,"[data-editar]",w=>{const x=t.store.get("expenses").find(A=>A._id===w.getAttribute("data-editar"));x&&g(x,"Editar",y)}),q(f,"[data-duplicar]",w=>{const x=t.store.get("expenses").find(I=>I._id===w.getAttribute("data-duplicar"));if(!x)return;const{_id:A,...P}=x;g({...P,concepto:`${x.concepto} (copia)`},"Duplicar movimiento",y)}),q(f,"[data-borrar]",w=>{rt("¿Eliminar?")&&(t.store.removeItem("expenses",w.getAttribute("data-borrar")),k("Eliminado"),o(),y())}),Y(f,"[data-activo]",w=>{const x=w;t.store.updateItem("expenses",x.getAttribute("data-activo"),{activo:x.checked}),o(),y()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:ur,mount(f){const y=()=>d(f);d(f),f.dataset.wired!=="1"&&($(f,y),f.dataset.wired="1")}}}function ze(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=It(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function os(t,a,e,o){return t.reduce((s,n)=>{const i=It(a,e,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function fr(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=ot({...t,amortizaciones:o.slice(0,n)}),r=ot({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ze(i.tabla,a,e)-ze(r.tabla,a,e)}})}const ya=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function gr(t,a){const e=Va(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?Ua(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=s?Ya(t.tin||0,i):null,c=o&&s?fr(t,a.periodos,a.hoy):[],l=c.length?ze(e.sinAmort.tabla,a.periodos,a.hoy)-ze(e.tabla,a.periodos,a.hoy):null,p=l===null?null:l-e.costeTotalAmort,d=n?os(e.tabla,a.periodos,a.hoy,e.comAp):null,u=n&&o?os(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=ha(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${m(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(F(e.cuota))}/mes</span>
        <span class="text-sm">${m(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${ya("Cuota mensual",m(F(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(F(a.cuotaMes))}</div>`:"")}
        ${ya("Total intereses",m(F(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(F(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${ya("Total pagado",m(F(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(Oa(e.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(F(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(F(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(Ve(t.diaPago))}</div></div>`:""}
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
               ${l!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(F(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(F(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(F(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(p??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(F(p??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(F(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(F(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?vr(t,e.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>br(v,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>hr(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function vr(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(F(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(F(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(F(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(F(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(F(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function br(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=It(e.periodos,e.hoy,t.fecha);o=m(F(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(F(t.interes))}</td>
    <td class="num">${m(F(t.amortizacion))}</td>
    <td class="num">${m(F(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function hr(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(a.fecha)}</span>
    <span class="num">${m(F(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(F(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(F(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(a._id)}">✕</button>
  </div>`}const ct=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,be=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,he=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,yr=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function $r(t,a,e,o=J()){return`
    <div class="grid-2">
      ${ct("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${ct("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${ct("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${ct("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${ct("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${yr(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Zo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${be("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${ct("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${ct("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${he("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Qt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
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
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function xr(t,a,e=J()){return`
    <div class="grid-2">
      ${ct("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${ct("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${be("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${he("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Ir="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function wr(t){const a=t.hoy??J;let e=!1;const o=new Set;let s=null;const n=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)};function i(x){const A=x.filter(I=>I.activo);if(A.length<2)return"";const P=(I,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${s===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${P(null,"Todas")}
      ${A.map(I=>P(I._id,I.nombre)).join("")}
    </div>`}function r(x){if(!x.activo||x.simulacion)return!1;const A=ot(x).tabla.filter(P=>!P.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c(x,A){const P=a(),I=P.slice(0,7),E=new Map;let D=0;for(const C of x){if(!C.activo||C.simulacion||A.has(C._id)||(C.fechaInicio||"")>P)continue;const h=ot(C).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith(I)),T=h.length>0?h[0].cuota:0;E.set(C._id,T),D+=T}return{porLoan:E,total:D,activos:[...E.values()].filter(C=>C>0).length}}function l(x){const A=a().slice(0,7),P=[];for(const I of x){if(!I.activo||I.simulacion)continue;const E=ot(I).tabla.filter(C=>!C.esAmortizacion),D=E[E.length-1];D&&D.fecha.slice(0,7)===A&&P.push({loan:I,cuota:D.cuota})}return P}function p(x){return x.length<=1?x[0]??"":`${x.slice(0,-1).join(", ")} y ${x[x.length-1]}`}function d(x){const A=t.store.get("config"),P=A.dashboardStart,I=A.dashboardEnd,E=Math.max(1,(H(I).getTime()-H(P).getTime())/(30.44*864e5));let D=0;for(const C of x)!C.activo||C.simulacion||(D+=ot(C).tabla.filter(h=>!h.esAmortizacion&&h.fecha>=P&&h.fecha<=I).reduce((h,T)=>h+T.cuota,0));return{media:D/E,desde:P,hasta:I}}function u(x){const A=t.store.get("personas"),P=Ce(A),I=[...t.store.get("loans")].sort((R,L)=>L.tin-R.tin),E=s?I.filter(R=>We(R.repartoConsumo,R.repartoPago,P).has(s)):I,D=new Set(E.filter(r).map(R=>R._id)),C=e?E:E.filter(R=>!D.has(R._id)),h=c(I,new Set(I.filter(r).map(R=>R._id))),T=d(I),_=l(I),z=t.store.get("config"),j=t.store.get("inflacion"),O=new Date(H(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});x.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${D.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${D.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${_.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${_.length===1?"acaba":"acaban"} ${m(p(_.map(R=>R.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(F(_.reduce((R,L)=>R+L.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${h.total>0||T.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${h.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(F(h.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${h.activos} préstamo${h.activos!==1?"s":""} activo${h.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${T.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(F(T.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(T.desde)} → ${m(T.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${C.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':C.map(R=>gr(R,{periodos:j,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:h.porLoan.get(R._id)??0,completado:D.has(R._id),personas:A})).join("")}
      </div>`;for(const R of x.querySelectorAll("[data-body-loan]"))o.has(R.dataset.bodyLoan??"")&&R.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>Pt(),b=()=>{var x;return(x=v())==null?void 0:x.classList.add("hidden")};function $(x,A){const P=v(),I=g();return!P||!I?null:(I.innerHTML=`<div class="modal-title">${m(x)}</div>${A}`,P.classList.remove("hidden"),q(I,"[data-cancelar]",b),I)}function f(x,A){const P=x?t.store.get("loans").find(E=>E._id===x)??null:null,I=$(x?"Editar préstamo":"Nuevo préstamo",$r(P,t.store.get("accounts"),t.store.get("personas"),a()));I&&(I.addEventListener("change",E=>{const D=E.target;D!=null&&D.matches("[data-dp-modo]")&&ts(I),D!=null&&D.matches('[data-reparto-modo="consumo"]')&&Xt(I,"consumo"),D!=null&&D.matches('[data-reparto-modo="pago"]')&&Xt(I,"pago")}),q(I,"[data-guardar-loan]",E=>{y(I,E.getAttribute("data-guardar-loan")||"")&&(b(),A())}))}function y(x,A){const P=_=>{var z;return((z=x.querySelector(_))==null?void 0:z.value)??""},I=_=>{var z;return!!((z=x.querySelector(_))!=null&&z.checked)},E=P("#f-nombre").trim(),D=parseFloat(P("#f-capital")),C=parseFloat(P("#f-tin")),h=parseInt(P("#f-meses"),10);if(!E||!Number.isFinite(D)||!Number.isFinite(C)||!Number.isFinite(h))return k("Completa los campos obligatorios","err"),!1;const T={nombre:E,capital:D,tin:C,meses:h,fechaInicio:P("#f-fecha"),comisionApertura:parseFloat(P("#f-com-ap"))||0,comisionAmort:parseFloat(P("#f-com-am"))||0,diaPago:es(x),cuenta:P("#f-cuenta"),simulacion:I("#f-sim"),activo:I("#f-activo"),mostrarFechaFinEnDashboard:I("#f-mostrar-fin"),tipoTasa:P("#f-tipo-tasa"),basico:I("#f-basico"),tags:P("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:Zt(x,"consumo"),repartoPago:Zt(x,"pago")};return A?(t.store.updateItem("loans",A,T),k("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),k("Préstamo creado")),n(),!0}function M(x,A,P){const I=t.store.get("loans").find(C=>C._id===x);if(!I)return;const E=A?(I.amortizaciones||[]).find(C=>C._id===A)??null:null,D=$(A?"Editar amortización":"Añadir amortización",xr(x,E,a()));D&&q(D,"[data-guardar-amort]",C=>{const[h,T]=(C.getAttribute("data-guardar-amort")||"").split("|");S(D,h,T)&&(b(),P([h]))})}function S(x,A,P){var z;const I=j=>{var O;return((O=x.querySelector(j))==null?void 0:O.value)??""},E=I("#am-fecha"),D=parseFloat(I("#am-cant"));if(!E||!Number.isFinite(D)||D<=0)return k("Fecha y cantidad requeridas","err"),!1;const C=t.store.get("loans").find(j=>j._id===A);if(!C)return!1;const h={fecha:E,cantidad:D,tipo:I("#am-tipo"),simulacion:!!((z=x.querySelector("#am-sim"))!=null&&z.checked)},T=C.amortizaciones||[],_=P?T.map(j=>j._id===P?{...j,...h}:j):[...T,{_id:Date.now().toString(36),...h}];return t.store.updateItem("loans",A,{amortizaciones:_}),k(P?"Amortización actualizada":"Amortización añadida"),n(),!0}function w(x,A){q(x,"[data-toggle-finalizados]",()=>{e=!e,A()}),q(x,"[data-persona-tab]",P=>{s=P.getAttribute("data-persona-tab")||null,A()}),q(x,"[data-nuevo-loan]",()=>f(null,A)),q(x,"[data-toggle-loan]",(P,I)=>{var h;if((h=I.target)!=null&&h.closest("button"))return;const E=P.getAttribute("data-toggle-loan"),D=[...x.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===E);(D==null?void 0:D.classList.toggle("open"))?o.add(E):o.delete(E)}),q(x,"[data-editar-loan]",P=>f(P.getAttribute("data-editar-loan"),A)),q(x,"[data-borrar-loan]",P=>{if(!rt("¿Eliminar préstamo?"))return;const I=P.getAttribute("data-borrar-loan");t.store.removeItem("loans",I),o.delete(I),k("Eliminado"),n(),A()}),q(x,"[data-amort-loan]",P=>{const I=P.getAttribute("data-amort-loan");o.add(I),M(I,null,A)}),q(x,"[data-editar-amort]",P=>{const[I,E]=(P.getAttribute("data-editar-amort")||"").split("|");o.add(I),M(I,E,A)}),q(x,"[data-borrar-amort]",P=>{const[I,E]=(P.getAttribute("data-borrar-amort")||"").split("|"),D=t.store.get("loans").find(C=>C._id===I);D&&(t.store.updateItem("loans",I,{amortizaciones:(D.amortizaciones||[]).filter(C=>C._id!==E)}),k("Amortización eliminada"),n(),A([I]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Ir,mount(x){const A=(P=[])=>{for(const I of P)o.add(I);u(x)};u(x),x.dataset.wired!=="1"&&(w(x,A),x.dataset.wired="1")}}}const $a=6.35;function te(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function ss(t){return Math.max(0,(t.bruto||0)-te(t))}function Cr(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Sr(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+te(r),0),o=Math.max(0,a-e),s=St(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(ss(i)/o):0);return n}function ns(t,a,e){if(t.irpfModo==="manual")return ss(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return vt(St(t.bruto||0,te(t)),e);const o=Cr(a.filter(i=>i.irpfModo!=="manual")),s=Sr(a);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return vt(n+r,e)-vt(n,e);n+=r}return vt(St(t.bruto||0,te(t)),e)}function Mr(t,a){return t.reduce((e,o)=>e+ns(o,t,a),0)}function Ar(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function Er(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+te(n),0);return Ar(St(e,o),a)}function Pr(t,a,e){const o=t.bruto||0,s=te(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??$a,c=n*(r/100),l=ns(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-c-l)/i}}function _r(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const Dr={transporte:125,restaurante:220,otros:null},Tr={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Fr=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],ee=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,zr=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function jr(t,a){const e=t.map((n,i)=>{const r=a.find(p=>p._id===n.cuenta),c=Dr[n.tipo],l=c!=null&&n.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(Tr[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(F(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(F(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?m(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=a.filter(n=>(n.modeloFondo||"cuenta")!=="pension"&&n.activo!==!1),s=o.filter(n=>(n.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${e||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(n=>`<option value="${m(n._id)}">${m(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function qr(t,a){const e=a.hoy??J(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${ee("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${ee("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${zr(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${ee("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${ee("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${ee("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Fr.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(n)} (${i+1})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2 mt-8">
          <div class="form-group" id="nf-custom-pagas-wrap"${s?' style="display:none"':""}>
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??$a).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Qt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function is(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",$a),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:Zt(t,"consumo"),repartoPago:Zt(t,"pago")}}function Nr(t,a,e,o){const s=is(t,a),n=a.reduce((f,y)=>f+(y.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),c=s.irpfModo==="manual"?i*(s.irpfPct/100):vt(St(s.bruto,n),e.tramos),l=i-r-c,p=i/s.nPagas,d=r/s.nPagas,u=c/s.nPagas,v=p-d-u,g=s.grupoNomina?e.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(s.grupoNomina)}" con ${m(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",$=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(F(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(F(s.bruto))}</span>
      ${$}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(F(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(F(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(F(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(F(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(F(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${m(F(v))}/paga`:`ingreso ${m(F(p))} − SS ${m(F(d))} − IRPF ${m(F(u))}`}${n>0?" + recargas flex":""}</span>
    </div>${b}`}function Rr(t,a,e,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=jr(a,e.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Nr(t,a,e,o))},i=()=>{var c,l;const r=(p,d)=>{const u=t.querySelector(p);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),Y(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),Y(t,'[data-reparto-modo="consumo"]',()=>Xt(t,"consumo")),Y(t,'[data-reparto-modo="pago"]',()=>Xt(t,"pago")),q(t,"[data-flex-anadir]",()=>{var l,p,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return k("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),s(),n()}),q(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const rs=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Lr(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>Pt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??Ct;function r(u,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),q(b,"[data-cerrar]",n),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(rs(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(rs(b.tramos))}</span>
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
      </div>`);g&&(q(g,"[data-editar-tabla]",b=>{const $=b.getAttribute("data-editar-tabla");d($==="default"?"default":Number($))}),q(g,"[data-borrar-tabla]",b=>{const $=Number(b.getAttribute("data-borrar-tabla"));rt(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==$)),k(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),q(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return k("Año inválido","err");const $=t.store.get("tramosIRPFHistorico");if($.some(y=>y.año===b))return k("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(y=>[...y])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const $=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function d(u){var y;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((y=v.find(M=>M.año===u))==null?void 0:y.tramos)??i()).map(M=>[...M]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,$=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!$)return;const f=()=>{const M=$.querySelector("#irpf-tramos-rows");M&&(M.innerHTML=l())};q($,"[data-volver]",c),q($,"[data-tr-anadir]",()=>{p($),e.push([0,0]),f()}),q($,"[data-tr-borrar]",M=>{p($),e.splice(Number(M.getAttribute("data-tr-borrar")),1),f()}),q($,"[data-tr-guardar]",()=>{p($);const M=[...e].sort((S,w)=>S[0]-w[0]);if(M.length===0)return k("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:M}),k("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(S=>S.año===a?{...S,tramos:M}:S)),k(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const cs=1500,Nt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,kr=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Or=t=>(t.modeloFondo||"cuenta")==="pension";function Br(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Hr(s,a,e,o)).join("")}</div>`}function Hr(t,a,e,o){const s=Je(t);if(!s)return"";const n=Qe(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,p)=>l+p.cantidad,0),c=Math.min(r,cs)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(F(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${m(F(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>cs?"neg":""}">${m(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Gr(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(F(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Vr(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Nt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Nt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Nt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Nt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Nt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${kr("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Nt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Nt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${s.map(i=>`<option value="${m(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${m(i)}</option>`).join("")}
      </select>
      ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
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
    </div>`}function Ur(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Gr(a))};Y(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),q(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return k("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),q(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Yr(t,a,e,o){var $;const s=f=>{var y;return((y=t.querySelector(f))==null?void 0:y.value)??""},n=(f,y=0)=>{const M=parseFloat(s(f));return Number.isFinite(M)?M:y},i=f=>{var y;return!!((y=t.querySelector(f))!=null&&y.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=n("#pen-saldo"),l=s("#pen-grupo"),p={nombre:r,grupoNomina:l,saldo:c,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],g=(($=[...d].sort((f,y)=>y.fecha.localeCompare(f.fecha))[0])==null?void 0:$.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:d,aportaciones:u}}}const Wr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Kr(t){const a=t.hoy??J,e=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)};let o=null;function s(y){const M=y.filter(w=>w.activo);if(M.length<2)return"";const S=(w,x)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":m(w)}"
               style="${o===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(x)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${S(null,"Todas")}
      ${M.map(w=>S(w._id,w.nombre)).join("")}
    </div>`}function n(){const y=t.store.get("config");return Ht(t.store.get("tramosIRPFHistorico"),y.tramos_irpf??Ct)(Number(a().slice(0,4)))}function i(y,M,S){const w=Pr(y,M,S),x=!!M&&y.irpfModo!=="manual",A=ha(y.repartoConsumo,y.repartoPago,t.store.get("personas")),P=[y.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${y.mesActualizacionIPC}">IPC m${y.mesActualizacionIPC}</span>`:"",w.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(F(w.flexAnual))}/año</span>`:"",Math.abs(w.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${w.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(y.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${P}</div>
      </div>
      <div class="num">${m(F(w.brutoAnual))}
        ${w.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(F(w.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(F(w.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${w.nPagas} pagas</div>
      <div class="text-sm ${x?"neg":""}">${y.irpfModo==="manual"?`${m(y.irpfPct??0)}% (manual)`:`${w.irpfPct.toFixed(1)}% (auto)`}${x?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${y.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(y.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(y._id)}"${y.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(y._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(y._id)}">✕</button>
      </div>
    </div>`}const r=y=>{var M;return((M=t.store.get("accounts").find(S=>S._id===(y||"default")))==null?void 0:M.nombre)??(y||"default")};function c(y,M,S){const w=M.reduce((P,I)=>P+(I.bruto||0),0),x=Mr(M,S),A=w>0?x/w*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(y)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(F(w))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(F(x))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${M.map(P=>i(P,M,S)).join("")}
      </div>
    </div>`}function l(y){const M=n(),S=t.store.get("personas"),w=Ce(S),x=[...t.store.get("nominas")].sort((C,h)=>(h.bruto||0)-(C.bruto||0)),A=o?x.filter(C=>We(C.repartoConsumo,C.repartoPago,w).has(o)):x,{grupos:P,sueltas:I}=_r(A),E=t.store.get("accounts").filter(Or),D=x.filter(C=>C.activo!==!1);y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${s(S)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${A.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...P.entries()].map(([C,h])=>c(C,h,M)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(C=>i(C,null,M)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Br(E,D,M,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),d=()=>Pt(),u=()=>{var y;return(y=p())==null?void 0:y.classList.add("hidden")};function v(y,M){const S=p(),w=d();return!S||!w?null:(w.innerHTML=`<div class="modal-title">${m(y)}</div>${M}`,S.classList.remove("hidden"),q(w,"[data-cancelar]",u),w)}function g(y,M){const S=y?t.store.get("nominas").find(P=>P._id===y)??null:null,w=[...(S==null?void 0:S.retribucionFlexible)??[]].map(P=>({...P})),x={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:n(),hoy:a()},A=v(y?"Editar nómina":"Nueva nómina",qr(S,x));A&&(Rr(A,w,x,y??""),q(A,"[data-guardar-nomina]",P=>{const I=is(A,w);if(!I.nombre||I.bruto<=0)return k("Nombre y bruto anual son obligatorios","err");const E=P.getAttribute("data-guardar-nomina")||"",D={...I,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,D),k("Nómina actualizada")):(t.store.addItem("nominas",D),k("Nómina creada")),e(),u(),M()}))}function b(y,M){const S=y?t.store.get("accounts").find(A=>A._id===y)??null:null,w=[...(S==null?void 0:S.planAportaciones)??[]].map(A=>({...A})),x=v(y?"Editar plan de pensiones":"Nuevo plan de pensiones",Vr(S,{nominas:t.store.get("nominas"),hoy:a()}));x&&(Ur(x,w,a()),q(x,"[data-guardar-pension]",A=>{const{datos:P,error:I}=Yr(x,w,S,a());if(I)return k(I,"err");const E=A.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,P),k("Plan actualizado")):(t.store.addItem("accounts",P),k("Plan creado")),e(),u(),M()}))}function $(y,M,S){q(y,"[data-persona-tab]",w=>{o=w.getAttribute("data-persona-tab")||null,M()}),q(y,"[data-nueva-nomina]",()=>g(null,M)),q(y,"[data-editar-nom]",w=>g(w.getAttribute("data-editar-nom"),M)),q(y,"[data-borrar-nom]",w=>{rt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",w.getAttribute("data-borrar-nom")),k("Eliminada"),e(),M())}),Y(y,"[data-activo-nom]",w=>{const x=w;t.store.updateItem("nominas",x.getAttribute("data-activo-nom"),{activo:x.checked}),e(),M()}),q(y,"[data-tramos]",()=>S.abrir()),q(y,"[data-nueva-pension]",()=>b(null,M)),q(y,"[data-editar-pension]",w=>b(w.getAttribute("data-editar-pension"),M)),q(y,"[data-borrar-pension]",w=>{rt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",w.getAttribute("data-borrar-pension")),k("Plan eliminado"),e(),M())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Wr,mount(y){const M=()=>l(y);f??(f=Lr({store:t.store,onDatosCambiados:()=>{e(),M()},año:()=>Number(a().slice(0,4))})),l(y),y.dataset.wired!=="1"&&($(y,M,f),y.dataset.wired="1")}}}const Jr="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Qr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",ls={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Xr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Zr(t,a){const e=t.filter(c=>c.activo&&pt(c)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const c of e){const l=Se(c,a);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(F(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(F(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${m(F(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(F(i))}</div><div class="stat-sub">Neto: ${m(F(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function tc(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(H(o).getTime()-H(e).getTime())/(30.44*864e5)),n=ne(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=n*(It(a.inflacion,e,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(F(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(F(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(F(i))}</span>
    </div>${r}
  </div>`}function ec(t,a){const e=ls[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),n=s.reduce((v,g)=>v+g.importe,0),i=n*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),p=Er(l,a.tramosIRPF),d=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(F(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(F(i))}/año${r?` ⚠ excede límite ${m(F(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(F(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(F(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(F(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ac(t){const a=Je(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(F(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(F(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function oc(t,a){const e=Se(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=H(o.dashboardStart),i=H(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),c=e.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=e.costBase+s.totalAportaciones,u=Math.max(0,p-d),v=Ke(u,a.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",$=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(A,P,I)=>A.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${P} ${m(E.contraparte)}: ${m(E.concepto)}</span>
          <span class="num ${I}">${m(F(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),M=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(F(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(F(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(F(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',S=a.invModo(t._id),w=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,x=S==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(F(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(F(e.neto))}</div><div class="stat-sub">${m($)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(F(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(F(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(F(p-v))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${w(S==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${w(S==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${x}
      ${M}
    </div>`}function sc(t,a){const e=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=e[0],s=wt(t),n=pt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((ls[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Qr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Jr}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(F(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(F(s))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${tc(t,a)}
    ${n==="beneficio"?ec(t,a):""}
    ${n==="pension"?ac(t):""}
    ${n==="inversion"?oc(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const nc=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function ic(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(F(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function rc(t,a){const e=t?pt(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${ct("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${be("ac-modelo","Tipo",nc,e)}
    </div>
    <div class="grid-2 mt-8">
      ${ct("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${ct("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${ct("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${ct("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${be("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
        </div>
        <div id="ac-inversion-hint"${s(e==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${s(e==="beneficio")}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${be("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(n=>`<option value="${m(n)}"${(t==null?void 0:t.grupoNomina)===n?" selected":""}>${m(n)}</option>`).join("")}
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
    </div>`}function cc(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=ic(a))};Y(t,"#ac-modelo",s=>{const n=s.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),q(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return k("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),q(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function lc(t,a,e,o,s){const n=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const $=parseFloat(n(g));return Number.isFinite($)?$:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=n("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",p=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:a,tipoBeneficio:p?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?s:u.fechaInicialSaldo??s,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:s,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function xa(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:Q(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function dc(t,a,e,o,s){const n=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(F(r.saldo))}</span>
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
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${m(s)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${m(a)}">Añadir</button>
    </div>`}const ds=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function uc(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>Pt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??ie;function r(u,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),q(b,"[data-cerrar]",n),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(ds(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(ds(b.tramos))}</span>
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
      </div>`);g&&(q(g,"[data-editar-tg]",b=>{const $=b.getAttribute("data-editar-tg");d($==="default"?"default":Number($))}),q(g,"[data-borrar-tg]",b=>{const $=Number(b.getAttribute("data-borrar-tg"));rt(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==$)),k(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),q(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return k("Año inválido","err");const $=t.store.get("tramosGananciasCapitalHistorico");if($.some(y=>y.año===b))return k("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(y=>[...y])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(u){var f;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((f=v.find(y=>y.año===u))==null?void 0:f.tramos)??i()).map(y=>[...y]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const $=()=>{const y=b.querySelector("#tg-rows");y&&(y.innerHTML=l())};q(b,"[data-volver-tg]",c),q(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),$()}),q(b,"[data-tg-borrar]",y=>{p(b),e.splice(Number(y.getAttribute("data-tg-borrar")),1),$()}),q(b,"[data-tg-guardar]",()=>{p(b);const y=[...e].sort((M,S)=>M[0]-S[0]);if(y.length===0)return k("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:y}),k("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(M=>M.año===a?{...M,tramos:y}:M)),k(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const pc=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function mc(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${pc.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function fc(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function us(t,a){const e=H(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function gc(t,a,e){const o=us(e,1)[0],s=a.slice(0,7)<o?a.slice(0,7):o,n=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=s;)n.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return n}function Ia(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function vc(t,a){const{inicio:e,fin:o}=Ia(a);return wa(t,e,o)}function wa(t,a,e){return re([t],{start:a,end:e}).reduce((s,n)=>s+Math.abs(n.cuantia),0)}function bc(t,a){const{inicio:e,fin:o}=Ia(a);return we(t.fechaInicio,t.fechaFin,e,o)}function hc(t){function a(s,n={}){var D;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=J(),desde:l,hasta:p}=n,d=t.transacciones({estimacionId:s._id}),v=d.length===0&&(((D=s.tags)==null?void 0:D.length)??0)>0?t.transacciones({tags:s.tags}):d,g=l&&p?gc(l,p,c):us(c,i),b=new Map(g.map(C=>{const{inicio:h,fin:T}=Ia(C);return[C,{inicio:l&&l>h?l:h,fin:p&&p<T?p:T}]})),$=new Map;for(const C of v){const h=b.get(C.fecha.slice(0,7));if(!h||C.fecha<h.inicio||C.fecha>h.fin)continue;const T=C.fecha.slice(0,7);$.set(T,($.get(T)??0)+Math.abs(C.importeCts)/100)}const f=[];for(const C of g){const h=$.get(C);if(h===void 0||!bc(s,C))continue;const T=b.get(C),_=V(wa(s,T.inicio,T.fin));f.push({mes:C,estimado:_,real:V(h),desviacion:V(h-_),precision:fc(_,h)})}const y=V(f.reduce((C,h)=>C+h.estimado,0)),M=V(f.reduce((C,h)=>C+h.real,0)),S=f.reduce((C,h)=>C+Math.abs(h.estimado),0),w=f.length===0?null:S>0?f.reduce((C,h)=>C+h.precision*Math.abs(h.estimado),0)/S:f.reduce((C,h)=>C+h.precision,0)/f.length,x=f.slice(-r),A=x.length>0?V(x.reduce((C,h)=>C+h.real,0)/x.length):null,P=x.reduce((C,h)=>C+h.estimado,0),I=x.reduce((C,h)=>C+h.real,0),E=P>0?I/P:null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:f,estimadoTotal:y,realTotal:M,desviacionTotal:V(M-y),precision:w,mediaRealReciente:A,factorReciente:E,infraestimada:M>y}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,n.set(r,c)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:V(r.estimado),realTotal:V(r.real),desviacionTotal:V(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function yc(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function $c(t,a){const e=[];let[o,s]=t.slice(0,7).split("-").map(Number);const[n,i]=a.slice(0,7).split("-").map(Number);for(;o<n||o===n&&s<=i;)e.push(`${o}-${String(s).padStart(2,"0")}`),s+=1,s>12&&(s=1,o+=1);return e}function xc(t,a,e,o){const s=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),n=s("gasto"),i=s("ingreso");return $c(e,o).map(r=>{const c={desde:`${r}-01`,hasta:yc(r)},l=b=>V(t.transacciones({...c,tipo:b}).reduce(($,f)=>$+Math.abs(f.importeCts)/100,0)),p=b=>V(b.reduce(($,f)=>$+vc(f,r),0)),d=p(n),u=l("gasto"),v=p(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:V(v-d),netoReal:V(g-u)}})}const je=640,ae=200,at={top:14,right:16,bottom:26,left:54};function Ic(t){return st(t).slice(0,3)}const wc={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function Cc(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=wc[a],o=t.flatMap($=>[e($).estimado,e($).real]),s=je-at.left-at.right,n=ae-at.top-at.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=$=>at.left+(t.length===1?s/2:$/(t.length-1)*s),p=$=>at.top+n-($-r)/c*n,d=t.map(($,f)=>`${l(f)},${p(e($).estimado)}`).join(" "),u=t.map(($,f)=>`${l(f)},${p(e($).real)}`).join(" "),v=r<0?`<line x1="${at.left}" y1="${p(0).toFixed(1)}" x2="${je-at.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map(($,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${p(e($).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(st($.mes))}: ${m(F(e($).real))}</title></circle>`).join(""),b=t.map(($,f)=>`<text x="${l(f).toFixed(1)}" y="${ae-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(Ic($.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${je} ${ae}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${at.left}" y1="${at.top}" x2="${at.left}" y2="${ae-at.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${at.left}" y1="${ae-at.bottom}" x2="${je-at.right}" y2="${ae-at.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${at.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(F(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const ps={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},Sc=[25,50,100,250,0];function Mc(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:fs(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ye(fs(t,5)).desde,intervaloHasta:ye(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function ms(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const s=Math.max(1,Math.ceil(o/e)),n=Math.min(Math.max(1,a),s),i=(n-1)*e;return{pagina:t.slice(i,i+e),actual:n,paginas:s,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function qe(t,a,e){if(t.total===0)return"";const o=(n,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${n}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,s=Sc.map(n=>`<option value="${n}"${n===a?" selected":""}>${n===0?"todos":`${n} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${m(e)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${s}</select>
      </div>
    </div>`}function Ca(t,a,e,o){const s=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function ye(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function fs(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1-a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Sa(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:ye(e).desde,hasta:ye(o).hasta}}function Ac(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function Ma(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),s=a.get(o);s?s.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const s=new Set(o.map(n=>n.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((n,i)=>n.fecha.localeCompare(i.fecha)),total:o.reduce((n,i)=>n+i.importeCts,0),estimacionComun:s.size===1?s.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(n=>n.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Ec(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(n=>n._id)),o=a.filter(n=>!e.has(n._id)&&n.tipo==="gasto"&&n.tags.some(i=>t.tagsComunes.includes(i))).reduce((n,i)=>n+Math.abs(i.importeCts),0),s=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:s,gastadoCts:o,diferenciaCts:o-s}}function Pc(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(F(Q(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(F(Q(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(F(Q(t.diferenciaCts)))}</strong></span>
    </div>`}function _c(t,a){const{ledger:e}=t,o=(t.hoy??J)(),s=t.accounts().filter(h=>h.activo),n=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=n?Sa(a.periodoDesde,a.periodoHasta):i?Ac(a.intervaloDesde,a.intervaloHasta):ye(a.mes),l={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(l),d=t.estimaciones().filter(h=>h.tipo!=="transferencia"),u=[...d.map(h=>({_id:h._id,etiqueta:`${m(h.concepto)} (${m(F(h.cuantia))})`})),...t.loans().filter(h=>h.activo).map(h=>({_id:h._id,etiqueta:`Préstamo: ${m(h.nombre)}`})),...t.nominas().filter(h=>h.activo).map(h=>({_id:h._id,etiqueta:`Nómina: ${m(h.nombre)}`}))],v=p.filter(h=>h.tipo!=="transferencia"&&h.importeCts<0).reduce((h,T)=>h+T.importeCts,0),g=p.filter(h=>h.tipo!=="transferencia"&&h.importeCts>0).reduce((h,T)=>h+T.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),$=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=s.map(h=>`<option value="${m(h._id)}"${h._id===a.cuentaId?" selected":""}>${m(h.nombre)}</option>`).join(""),y=h=>'<option value="">— sin asignar —</option>'+u.map(T=>`<option value="${m(T._id)}"${T._id===h?" selected":""}>${T.etiqueta}</option>`).join(""),M=h=>Object.keys(ps).map(T=>`<option value="${T}"${T===h?" selected":""}>${ps[T]}</option>`).join(""),S=ms(p,a.pagina,a.porPagina),w=new Map(t.accounts().map(h=>[h._id,h.nombre])),x=S.pagina.map(h=>`
      <tr data-tx="${m(h._id)}" style="border-bottom:1px solid var(--border)${h.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(h.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(h.concepto)}</td>
        <td style="padding:7px 8px">${So(h.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(w.get(h.cuentaId)??h.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(h._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${M(h.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(h._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${y(h.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Et(Q(h.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          ${h.importeCts<0&&h.tipo!=="transferencia"?`<button type="button" class="btn-secondary tx-imprevisto${h.imprevisto?" activo":""}" data-tx-imprevisto="${m(h._id)}" aria-pressed="${h.imprevisto?"true":"false"}"
                  title="${h.imprevisto?h.estimacionId?"Marcado como imprevisto, pero cuenta a través de su estimación":"Marcado como imprevisto. Pulsa para quitar la marca":"Marcar como imprevisto"}">⚡${h.imprevisto?" Imprevisto":""}</button>`:""}
          <button class="btn-secondary" data-tx-editar="${m(h._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(h._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),A=i?xc(e,d,r,c):[],P=n?e.transacciones({desde:r,hasta:c}):[],I=n?Ma(p):[],E=ms(I,a.pagina,a.porPagina),D=E.pagina.map(h=>{const T=a.detalleAbierto.has(h.concepto),_=T?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${So(h.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(h.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(h.concepto)}">Asignar</button>
               </div>
               ${Pc(Ec(h,P))}
             </td>
           </tr>`:"",z=T?h.movimientos.map(j=>{var O;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(j.fecha)}</span> · ${m(((O=t.accounts().find(R=>R._id===j.cuentaId))==null?void 0:O.nombre)??j.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(j._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${y(j.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Et(Q(j.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(h.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(h.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${T?"▾":"▸"}</button>
          <span style="font-size:13px">${m(h.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${h.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(h.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${h.movimientos.length} movimientos del grupo de golpe">${y(h.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Et(Q(h.total))}</td>
        <td></td>
      </tr>${_}${z}`}).join(""),C=$.slice().reverse().slice(0,8).map(h=>{var T;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(h.fecha)}</span>
        <span style="color:var(--text3)">${m(((T=t.accounts().find(_=>_._id===h.cuentaId))==null?void 0:T.nombre)??h.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(F(Q(h.saldoCts)))}</span>
        ${h.nota?`<span style="color:var(--text3)">${m(h.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(h._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${a.vista==="mensual"?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">Mes</button>
            <button class="btn-secondary btn-sm" data-acc-vista="intervalo" style="${i?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Elige un rango de fechas concreto, aunque cruce varios meses">Intervalo</button>
            <button class="btn-secondary btn-sm" data-acc-vista="agrupado" style="${n?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Agrupa los gastos que se repiten con el mismo concepto en un periodo, para asignarles la estimación de golpe">Agrupar por concepto</button>
          </div>
        </div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${f}</select>
          </div>
          ${n?`<div class="form-group" style="margin:0">
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
          <span>Gastos: ${Et(Q(v))}</span>
          <span>Ingresos: ${Et(Q(g))}</span>
          <span>Neto: ${Et(Q(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(F(b))}</strong></span>
        </div>

        ${n?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${qe(E,a.porPagina,"conceptos")}
               <div style="overflow-x:auto" data-acc-tabla>
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
                     ${D||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${qe(E,a.porPagina,"conceptos")}`:`${qe(S,a.porPagina,"movimientos")}
               <div style="overflow-x:auto" data-acc-tabla>
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
                     ${x||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${qe(S,a.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${Ca("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${Ca("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${Ca("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${Cc(A,a.comparativa)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(h=>`<option value="${m(h)}"></option>`).join("")}</datalist>
          </div>
          <label class="flex gap-8 items-center mb-8" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="nt-imprevisto"/><span class="toggle-slider"></span></label>
            Imprevisto (una avería, el dentista…)
          </label>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${y(null)}</select>
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
          ${C?`<div class="mt-12">${C}</div>`:""}
        </div>
      </div>
    </div>`}function Dc(t,a,e,o){const{ledger:s}=a,n=()=>{e.pagina=1,o()};Y(t,"#acc-cuenta",r=>{e.cuentaId=r.value,n()}),Y(t,"#acc-mes",r=>{e.mes=r.value||e.mes,n()}),q(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",n()}),Y(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,n()}),Y(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,n()}),q(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),Y(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),q(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),Y(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,n()}),Y(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,n()}),q(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),Y(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:p,hasta:d}=Sa(e.periodoDesde,e.periodoHasta),u=s.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:d,texto:e.filtroTexto||void 0}),v=Ma(u).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)s.asignarEstimacion(g._id,l);k(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),q(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,p=((l==null?void 0:l.value)??"").split(",").map($=>$.trim().toLowerCase()).filter(Boolean);if(p.length===0)return k("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=Sa(e.periodoDesde,e.periodoHasta),v=s.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:u,texto:e.filtroTexto||void 0}),g=Ma(v).find($=>$.concepto===c);if(g){for(const $ of g.movimientos)s.actualizar($._id,{tags:[...new Set([...$.tags,...p])]});k(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{n();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),q(t,"#nt-guardar",()=>{var p;const r=mt(t,"#nt-concepto").trim(),c=Mo(t,"#nt-importe");if(!r)return k("Indica un concepto","err");if(!(c>0))return k("Indica un importe mayor que cero","err");const l=mt(t,"#nt-tags").split(",").map(d=>d.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:mt(t,"#nt-fecha")||(a.hoy??J)(),cuentaId:mt(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:mt(t,"#nt-tipo"),estimacionId:mt(t,"#nt-estimacion")||null,imprevisto:((p=t.querySelector("#nt-imprevisto"))==null?void 0:p.checked)||void 0}),k("Movimiento registrado"),a.onDatosCambiados(),o()}),q(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;rt("¿Eliminar este movimiento?")&&(s.eliminar(c),k("Movimiento eliminado"),a.onDatosCambiados(),o())}),q(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=s.transacciones().find(u=>u._id===c);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(Q(l.importeCts))));if(p===null)return;const d=parseFloat(p.replace(",","."));if(!Number.isFinite(d)||d<=0)return k("Importe no válido","err");s.actualizar(c,{importe:d}),k("Movimiento actualizado"),a.onDatosCambiados(),o()}),q(t,"[data-tx-imprevisto]",r=>{const c=r.getAttribute("data-tx-imprevisto"),l=s.transacciones().find(d=>d._id===c);if(!l)return;const p=!l.imprevisto;s.actualizar(c,{imprevisto:p||void 0}),k(p?l.estimacionId?"Marcado como imprevisto. Ojo: está asignado a una estimación y cuenta a través de ella":"Marcado como imprevisto":"Ya no es un imprevisto"),a.onDatosCambiados(),o()}),Y(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");s.asignarEstimacion(c,r.value||null),k("Asignación actualizada"),a.onDatosCambiados()}),Y(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");s.actualizar(c,{tipo:r.value}),k("Tipo actualizado"),a.onDatosCambiados(),o()}),q(t,"#pc-guardar",()=>{if(mt(t,"#pc-saldo").trim()==="")return k("Indica el saldo","err");const c=Mo(t,"#pc-saldo");s.registrarPuntoControl(mt(t,"#pc-cuenta"),mt(t,"#pc-fecha")||(a.hoy??J)(),c,mt(t,"#pc-nota").trim()||void 0),k("Saldo real registrado"),a.onDatosCambiados(),o()}),q(t,"[data-pc-borrar]",r=>{rt("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(r.dataset.pcBorrar),k("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Aa(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const n=V(a*t.factorReciente),i=V(n-a),r=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:V(a),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Tc(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,r={}){const c=r.hoy??J(),l=t.get("expenses"),p=l.find(g=>g._id===n);if(!p)throw new Error(`La estimación ${n} no existe`);const d={...p,fechaFin:c},u={...p,_id:a(),cuantia:V(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=l.map(g=>g._id===n?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(n,i={}){const r=[],c=[];for(const l of n)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(p){c.push({estimacionId:l.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function s(n){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(n);if(!c)return[];const l=[];let p=c;const d=new Set;for(;p!=null&&p.ajustadaDesdeId&&!d.has(p._id);){d.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;l.unshift(b),p=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find($=>$.ajustadaDesdeId===v._id&&!g.has($._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:s}}function gs(t){var s;const a=t.estimaciones(),e=((s=t.rango)==null?void 0:s.call(t))??null,o=new Map(a.map(n=>[n._id,n]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(n=>{const i=o.get(n.estimacionId);return{analisis:n,estimacion:i,sugerencia:Aa(n,i.cuantia)}}).filter(n=>!!n.estimacion)}function Fc(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function zc(t){var r;const a=gs(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),s=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(r=t.rango)!=null&&r.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const n=s.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Et(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Nn(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Fc(t)}
        ${o.length>0?`Hay ${o.length} estimación(es) que se desvían de forma sistemática. Al ajustar, la
               estimación actual se cierra hoy y se crea su continuación con el importe corregido: el pasado se
               mantiene tal como lo estimaste.`:"Ninguna estimación se desvía lo bastante como para proponer un cambio de importe."}
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${i("Etiqueta")}${i("Estimaciones","right")}${i("Estimado","right")}${i("Real","right")}${i("Desviación","right")}${i("Precisión","right")}
          </tr></thead>
          <tbody>${n||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function jc(t,a,e){q(t,"#ajustar-todas",()=>{const o=gs(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!rt(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});k(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const qc=[";",",","	","|"],Nc={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function Ne(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function Re(t,a){const e=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Rc(t){let a=";",e=-1;for(const o of qc){const s=t.slice(0,20).map(c=>Re(c,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(c=>c===n).length*10+n;r>e&&(e=r,a=o)}return a}function $e(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),s=a.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const p=n===","?o:s;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?e?-l:l:null}function Ea(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return vs(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),vs(o,Number(e[2]),Number(e[1]))}return null}function vs(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function bs(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Ea(e)!==null).length/a.length}function hs(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>$e(e)!==null).length/a.length}function Lc(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>a.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=Ne(t[i]);if(r&&Nc[n].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(n==="importe"&&Ne(t[i]).includes("saldo"))continue;e[n]=i,o.add(i);break}}if(e.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=bs(s(r));c>i&&(i=c,n=r)}n>=0&&(e.fecha=n,o.add(n))}if(e.importe<0&&e.debe<0&&e.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||Ne(t[r]).includes("saldo"))continue;const c=hs(s(r));c>i&&(i=c,n=r)}n>=0&&(e.importe=n,o.add(n))}if(e.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=s(r);if(hs(c)>.5||bs(c)>.5)continue;const l=c.reduce((p,d)=>p+d.length,0)/Math.max(1,c.length);l>i&&(i=l,n=r)}n>=0&&(e.concepto=n)}return e}function kc(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Rc(a),o=a.map(p=>Re(p,e).length),s=Math.max(...o);let n=o.findIndex(p=>p===s);n<0&&(n=0);const i=Re(a[n],e);let r=a.slice(n+1).map(p=>Re(p,e));const c=Ea(i[0]??"")!==null||i.some(p=>$e(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const l=Lc(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:n+1,mapeo:l}}function ys(t,a,e){return`${t}|${a}|${Ne(e).replace(/\s+/g," ")}`}function Oc(t,a,e=[]){const o=new Map;for(const n of e){const i=ys(n.fecha,n.importeCts,n.concepto);o.set(i,(o.get(i)??0)+1)}const s=new Map;return t.filas.map((n,i)=>{const r=[],c=a.fecha>=0?Ea(n[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${n[a.fecha]??""}»`);let l=null;if(a.importe>=0)l=$e(n[a.importe]??""),l===null&&r.push(`importe ilegible: «${n[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?$e(n[a.debe]??""):null,v=a.haber>=0?$e(n[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const p=(a.concepto>=0?n[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=ys(c,l,p),v=(s.get(u)??0)+1;s.set(u,v),d=v<=(o.get(u)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:l,errores:r,duplicada:d}})}function Bc(t,a){const e=t.filter(s=>s.errores.length===0&&(a||!s.duplicada)),o=e.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:e.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:e.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function Le(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Hc=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Pa(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Oc(a.analisis,a.mapeo,e)}function Gc(t,a){const e=t.accounts().filter(s=>s.activo);if(!a.abierto)return`
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
      </div>`;const o=e.map(s=>`<option value="${m(s._id)}"${s._id===a.cuentaId?" selected":""}>${m(s.nombre)}</option>`).join("");return`
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

      ${a.analisis&&a.mapeo?Uc(a,a.analisis,a.mapeo):Vc()}
    </div>`}function Vc(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Uc(t,a,e){const o=Bc(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${m(c||`Columna ${l+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Hc.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${m(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${s(e[r.clave])}</select>
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
        <div class="stat-value" style="font-size:1.15rem">${Et(Q(o.sumaCts))}</div>
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

    ${n.length>0?`<div class="alert-card alert-warning mb-12">
             <div class="alert-icon">⚠️</div>
             <div class="alert-body">
               <div class="alert-title">${n.length} línea${n.length!==1?"s":""} no se puede${n.length!==1?"n":""} importar</div>
               <div class="alert-sub">${n.slice(0,4).map(r=>`línea ${r.linea}: ${m(r.errores[0])}`).join(" · ")}${n.length>4?" …":""}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,l=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(F(Q(r.importeCts)))}</td>
                <td style="font-size:11px;color:${p}">${m(l)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Yc(t,a,e,o){q(t,"[data-imp-sincronizar]",()=>{const n=a.ledger.sincronizarHistoricoImportado();if(n.length===0)return k("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var d;return((d=a.accounts().find(u=>u._id===p))==null?void 0:d.nombre)??p},r=n.reduce((p,d)=>p+d.eliminados,0),c=n.reduce((p,d)=>p+d.semanales,0),l=n.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");k(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),q(t,"[data-imp-abrir]",()=>{const n=a.accounts().filter(i=>i.activo);Object.assign(e,Le(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),q(t,"[data-imp-cerrar]",()=>{Object.assign(e,Le()),o()}),Y(t,"#imp-cuenta",n=>{e.cuentaId=n.value,Pa(a,e),o()}),Y(t,"#imp-duplicadas",n=>{e.incluirDuplicadas=n.checked,o()}),Y(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),Pa(a,e),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&Wc(n).then(r=>{const c=kc(r);e.nombreFichero=n.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},Pa(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),q(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const n=e.filas.filter(l=>l.errores.length===0&&(e.incluirDuplicadas||!l.duplicada));if(n.length===0)return;for(const l of n)a.ledger.registrar({fecha:l.fecha,cuentaId:e.cuentaId,importe:Math.abs(Q(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=n.map(l=>l.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);k(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,Le()),a.onDatosCambiados(),o()})}function Wc(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function Kc(t,a){if(a<t)return 0;let e=0,[o,s]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(s).padStart(2,"0")}`<=a.slice(0,7);){const n=new Date(o,s,0).getDate(),i=`${o}-${String(s).padStart(2,"0")}-01`,r=`${o}-${String(s).padStart(2,"0")}-${String(n).padStart(2,"0")}`,c=t>i?t:i,l=a<r?a:r,p=(H(l).getTime()-H(c).getTime())/864e5+1;e+=p/n,++s>12&&(s=1,o++)}return e}function Jc(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Qc(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function _a(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function $s(t,a,e){const o=new Map(a.map(n=>[n._id,[]])),s=a.filter(n=>{var i;return!e(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const c of s){const l=(c.tags??[]).filter(p=>n.tags.includes(p)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(n)}return o}function xs(t,a,e,o={}){const n=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&we(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:V(wa(c,a,e)),origen:"estimacion",periodicidad:ka(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&we(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=Ze(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);n.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:V(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Xe(r,{start:a,end:e});for(const l of r){const p=c.filter(d=>d.sourceId===l._id);p.length!==0&&n.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:V(p.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return n}function Xc(t,a,e,o={}){const{desde:s,hasta:n}=Jc(e);return{...Is(t,a,s,n,o),mes:e}}function Is(t,a,e,o,s={}){const n=t.transacciones({desde:e,hasta:o}),i=new Set(s.omitidos??[]),r=_=>_.tipo!=="transferencia"&&!i.has(_a(_.concepto)),c=n.filter(_=>r(_)&&_.importeCts<0),l=n.filter(_=>r(_)&&_.importeCts>0),p=n.filter(_=>_.tipo!=="transferencia"&&i.has(_a(_.concepto))),d=new Map((s.analisis??[]).map(_=>[_.estimacionId,_])),u=xs(a,e,o,s),v=_=>new Set(_.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),g=u.filter(_=>_.tipo==="gasto"),b=u.filter(_=>_.tipo==="ingreso"),$=$s(c,g,_=>v(g).has(_)),f=$s(l,b,_=>v(b).has(_)),y=new Set,M=new Set,S=(_,z,j)=>{for(const L of z)j.add(L._id);const O=V(z.reduce((L,N)=>L+Math.abs(N.importeCts)/100,0)),R=_.origen==="estimacion"?d.get(_._id):void 0;return{estimacionId:_._id,concepto:_.concepto,tipo:_.tipo,origen:_.origen,periodicidad:_.periodicidad,tags:_.tags,estimado:_.estimado,real:O,desviacion:V(O-_.estimado),sinMovimiento:z.length===0,sugerencia:R?Aa(R,_.cuantia??0,{hoy:s.hoy}):null}},w=g.map(_=>S(_,$.get(_._id)??[],y)),x=b.map(_=>S(_,f.get(_._id)??[],M)),A=(_,z)=>{const j=new Map;for(const O of _){if(z.has(O._id))continue;const R=_a(O.concepto),L=j.get(R)??{concepto:O.concepto,clave:R,total:0,movimientos:0,ids:[]};L.total=V(L.total+Math.abs(O.importeCts)/100),L.movimientos+=1,L.ids.push(O._id),j.set(R,L)}return[...j.values()].sort((O,R)=>R.total-O.total)},P=A(c,y),I=A(l,M),E=A(p,new Set),D=V(w.reduce((_,z)=>_+z.estimado,0)),C=V(c.reduce((_,z)=>_+Math.abs(z.importeCts)/100,0)),h=V(x.reduce((_,z)=>_+z.estimado,0)),T=V(l.reduce((_,z)=>_+z.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:D,real:C,desviacion:V(C-D),ingresosEstimados:h,ingresosReales:T,desviacionIngresos:V(T-h),netoEstimado:V(h-D),netoReal:V(T-C),desviacionNeta:V(T-C-(h-D)),filas:[...w,...x].sort((_,z)=>Math.abs(z.desviacion)-Math.abs(_.desviacion)),sinEstimacion:P,totalSinEstimacion:V(P.reduce((_,z)=>_+z.total,0)),ingresosSinPrever:I,totalIngresosSinPrever:V(I.reduce((_,z)=>_+z.total,0)),porTag:Zc(g,c),meses:Kc(e,o),omitidos:E,totalOmitido:V(E.reduce((_,z)=>_+z.total,0)),vacio:n.length===0}}function Zc(t,a){const e=new Map,o=(s,n,i)=>{for(const r of s.length>0?s:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[n]+=i,e.set(r,c)}};for(const s of t)o(s.tags,"estimado",s.estimado);for(const s of a)o(s.tags,"real",Math.abs(s.importeCts)/100);return[...e.entries()].map(([s,n])=>({tag:s,estimado:V(n.estimado),real:V(n.real),desviacion:V(n.real-n.estimado)})).filter(s=>s.estimado>0||s.real>0).sort((s,n)=>n.real-s.real||n.estimado-s.estimado)}function ws(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const ke=26,Da=7,Ta=(ke+Da)*2,Cs=2*Math.PI*ke,Ss=12;function tl(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function el(t){const{color:a,fraccion:e,etiqueta:o}=tl(t),s=Ta/2,n=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${Ta} ${Ta}" style="width:78px;height:78px" role="img" aria-label="${m(n)}">
        <title>${m(n)}</title>
        <circle cx="${s}" cy="${s}" r="${ke}" fill="none" stroke="var(--bg3)" stroke-width="${Da}"/>
        <circle cx="${s}" cy="${s}" r="${ke}" fill="none" stroke="${a}" stroke-width="${Da}"
                stroke-linecap="round" stroke-dasharray="${(Cs*e).toFixed(2)} ${Cs.toFixed(2)}"
                transform="rotate(-90 ${s} ${s})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=s+(o.length>1?r*10-1:4);return`<text x="${s}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(F(t.estimado))}</div>
    </div>`}function al(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,Ss),e=t.slice(Ss),o=e.reduce((s,n)=>s+n.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(el).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${m(F(o))}</span>`:""}
    </div>`}function ol(){return{mes:"",modo:"mes"}}function Ms(t,a){if(a.mes)return a.mes;const e=ws(t.ledger),o=Qc((t.hoy??J)());return e.includes(o)?o:e[0]??o}function xe(t,a){var i;const e=(t.hoy??J)(),o=t.estimaciones(),s={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return Is(t.ledger,o,r,c,{...s,analisis:l})}const n=t.precision.analizarTodas(o,{hoy:e});return Xc(t.ledger,o,Ms(t,a),{...s,analisis:n})}function As(t){var s;const a=(t.hoy??J)(),e=xs(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(s=t.resolverTramosIRPF)==null?void 0:s.call(t)}),o=n=>e.filter(i=>i.tipo===n).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function xt(t,a){return a<=0?"—":`${m(F(t/a))}/mes`}function Es(t,a,e,o){const s=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function sl(t,a){const e=a.modo==="periodo",o=Ms(t,a),s=ws(t.ledger);s.includes(o)||s.unshift(o);const n=xe(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(n.desde)} al ${m(n.hasta)}`:m(st(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Es("mes",!e,"Mes","Cierra un mes natural completo")}
      ${Es("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(n.desde)} → ${m(n.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${s.map(d=>`<option value="${m(d)}"${d===o?" selected":""}>${m(st(d))}</option>`).join("")}
             </select>`}
    </div>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${i}</div>
          ${c}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${e?"":"en "}${r}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;const l=d=>d>0?"+":"",p=n.desviacionNeta<0?"var(--red)":n.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(n.real))}</div>
          <div class="stat-sub">${xt(n.real,n.meses)} · previsto ${m(F(n.estimado))} (${xt(n.estimado,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacion)}${m(F(n.desviacion))} · ${l(n.desviacion)}${xt(n.desviacion,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(n.ingresosReales))}</div>
          <div class="stat-sub">${xt(n.ingresosReales,n.meses)} · previsto ${m(F(n.ingresosEstimados))} (${xt(n.ingresosEstimados,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacionIngresos)}${m(F(n.desviacionIngresos))} · ${l(n.desviacionIngresos)}${xt(n.desviacionIngresos,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${l(n.desviacionNeta)}${m(F(n.desviacionNeta))}</div>
          <div class="stat-sub">${l(n.desviacionNeta)}${xt(n.desviacionNeta,n.meses)}</div>
          <div class="stat-sub">neto real ${m(F(n.netoReal))} · previsto ${m(F(n.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(F(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${xt(n.totalSinEstimacion,n.meses)} · ${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${n.totalIngresosSinPrever>0?`${m(F(n.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${m(n.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${nl(n)}
      ${il(n,As(t))}
      ${cl(n,As(t))}
      ${rl(n)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${al(n.porTag)}
    </div>`}function nl(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
          ${a.map(o=>{const s=o.tipo==="gasto"?o.desviacion>0:o.desviacion<0,n=o.desviacion===0?"var(--text2)":s?"var(--red)":"var(--accent)",i=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${m(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                  <div style="font-size:10px;color:var(--text3)">${m(o.periodicidad)}</div>
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(F(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar el importe de cada pago (${m(o.periodicidad)}) de ${m(F(i.cuantiaActual))} a ${m(F(i.cuantiaSugerida))} · ${m(i.motivo)}"
                           style="font-size:11px;padding:2px 9px">→ ${m(F(i.cuantiaSugerida))}/pago</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${e.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${e.length===1?"1 estimación se desvía":`${e.length} estimaciones se desvían`}
               de forma sistemática. El importe propuesto es el de CADA pago, con la periodicidad de la estimación:
               ajustarla cierra la de hoy y abre una nueva con ese importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function Ps(t,a,e,o){return`<tr>
    <td style="font-size:12px">${m(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${m(F(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${xt(t.total,a)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${m(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${e}
      </select>
      <button class="btn-secondary btn-sm" data-cie-imprevisto="${m(t.clave)}" title="Marcar estos movimientos como imprevisto: se siguen aparte en «Este mes» y entran en la estimación de imprevistos"
              style="font-size:11px;padding:2px 8px;margin-left:4px">⚡ Imprevisto</button>
      <button class="btn-secondary btn-sm" data-cie-omitir="${m(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const _s=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function il(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`:`
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna previsión. Asigna el grupo entero a una estimación
      (o a un préstamo) si es eso, u omítelo si no es gasto tuyo — un traspaso interno, por ejemplo.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${_s}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>Ps(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function rl(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(a.concepto)} · ${m(F(a.total))} ✕</button>`).join("")}
    </div>`}function cl(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${_s}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>Ps(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function ll(t,a,e,o){Y(t,"#cie-mes",s=>{e.mes=s.value,o()}),q(t,"[data-cie-modo]",s=>{e.modo=s.getAttribute("data-cie-modo")||"mes",o()}),q(t,"[data-cie-omitir]",s=>{const n=s.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(n)||(a.setOmitidos([...i,n]),k("Concepto omitido: deja de contar en el cierre"),o())}),q(t,"[data-cie-imprevisto]",s=>{var c;const n=s.getAttribute("data-cie-imprevisto"),r=xe(a,e).sinEstimacion.find(l=>l.clave===n);if(r){for(const l of r.ids)a.ledger.actualizar(l,{imprevisto:!0});k(`${r.ids.length} movimiento${r.ids.length===1?"":"s"} marcado${r.ids.length===1?"":"s"} como imprevisto`),(c=a.onDatosCambiados)==null||c.call(a),o()}}),q(t,"[data-cie-restaurar]",s=>{const n=s.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==n)),o()}),Y(t,"[data-cie-asignar]",s=>{const n=s,i=n.getAttribute("data-cie-asignar"),r=n.value;if(!r)return;const c=xe(a,e),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(p=>p.clave===i);if(l){if(!rt(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){n.value="";return}for(const p of l.ids)a.ledger.asignarEstimacion(p,r);k(`${l.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),q(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=xe(a,e).filas.find(c=>c.estimacionId===n);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??J)()}),k(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),q(t,"[data-cie-ajustar-todas]",()=>{const n=xe(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(n,{hoy:(a.hoy??J)()});k((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const dl="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ul(t){const a=t.hoy??J,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let s="cuentas";const n=Mc(a().slice(0,7)),i=Le(),r=ol(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:l,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Ht(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Ct),omitidos:()=>u().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},$=z=>{var j;return((j=t.store.get("accounts").find(O=>O._id===z))==null?void 0:j.nombre)??z},f=()=>Ht(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Ct)(Number(a().slice(0,4))),y=()=>Ht(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??ie),M=()=>y()(Number(a().slice(0,4)));function S(){const z=u(),j=t.store.get("accounts"),O=io({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:j,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:y()}),R=new Map,L=B=>{let U=R.get(B);return U||(U={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},R.set(B,U)),U},N=(B,U)=>{const tt=`${U.sourceId}`,et=B.find(K=>K.concepto===tt),it=et??{concepto:tt,contraparte:"",total:0,ocurrencias:0};it.total+=Math.abs(U.cuantia),it.ocurrencias+=1,et||B.push(it)};for(const B of O){if(!B.cuenta)continue;const U=L(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(U.totalAportaciones+=Math.abs(B.cuantia),N(U.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(U.totalReembolsos+=Math.abs(B.cuantia),N(U.salidas,B)):B.sourceType==="investment-tax"&&(U.retencion+=Math.abs(B.cuantia))}const G=t.store.get("expenses");for(const B of R.values())for(const[U,tt]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const et of U){const it=G.find(K=>K._id===et.concepto);et.contraparte=$((it==null?void 0:it[tt])??"default"),et.concepto=(it==null?void 0:it.concepto)||(tt==="cuenta"?"Aportación":"Reembolso")}return R}function w(z){const j=s==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let O;if(s==="cuentas"){const N=t.store.get("accounts").filter(U=>pt(U)!=="pension"),G=S(),B={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:M(),flujos:U=>G.get(U)??Xr,invModo:U=>o.get(U)??"proyeccion"};O=`${Zr(N,B.tramosGanancias)}<div class="grid-3">${N.map(U=>sc(U,B)).join("")}</div>`}else s==="movimientos"?O='<div id="acc-tx"></div>':s==="importar"?O='<div id="acc-import"></div>':O='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${j}
      </div>
      ${mc(s)}
      ${O}`;const R=()=>w(z);if(s==="movimientos"){const L=z.querySelector("#acc-tx");L.innerHTML=_c(p,n),Dc(L,p,n,R)}else if(s==="importar"){const L=z.querySelector("#acc-import");L.innerHTML=Gc(d,i),Yc(L,d,i,R)}else if(s==="cierre"){const L=z.querySelector("#acc-cierre"),N=z.querySelector("#acc-precision");L.innerHTML=sl(g,r),N.innerHTML=zc(b),ll(L,g,r,R),jc(N,b,R)}}const x=()=>document.getElementById("modal-overlay"),A=()=>Pt(),P=()=>{var z;return(z=x())==null?void 0:z.classList.add("hidden")};function I(z,j){const O=x(),R=A();return!O||!R?null:(R.innerHTML=z?`<div class="modal-title">${m(z)}</div>${j}`:j,O.classList.remove("hidden"),q(R,"[data-cancelar]",P),R)}function E(z,j){const O=z?t.store.get("accounts").find(G=>G._id===z)??null:null,R=[...(O==null?void 0:O.planAportaciones)??[]].map(G=>({...G})),L=O?D(O):null,N=I(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",rc(O,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:L??0}));N&&(cc(N,R,a()),q(N,"[data-guardar-acc]",G=>{const B=G.getAttribute("data-guardar-acc")||"",{datos:U,punto:tt,error:et}=lc(N,R,O,L,a());if(et)return k(et,"err");let it=B;B?t.store.updateItem("accounts",B,U):it=t.store.addItem("accounts",U)._id,tt&&t.ledger.registrarPuntoControl(it,tt.fecha,tt.saldo,tt.nota),k(B?"Actualizada":"Cuenta / fondo creado"),e(),P(),j()}))}function D(z){const j=t.ledger.puntosControl(z._id);return j.length>0?xa(j)[0].saldo:z.saldo??null}function C(z,j){const O=t.store.get("accounts").find(N=>N._id===z);if(!O)return;const R=I("Histórico de saldos",dc(O.nombre,z,xa(t.ledger.puntosControl(z)),O.saldoInicial||0,a()));if(!R)return;const L=()=>{j(),C(z,j)};q(R,"[data-hist-anadir]",()=>{var U,tt,et;const N=((U=R.querySelector("#hi-fecha"))==null?void 0:U.value)??"",G=parseFloat(((tt=R.querySelector("#hi-saldo"))==null?void 0:tt.value)??""),B=((et=R.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!N||!Number.isFinite(G))return k("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,N,G,B||void 0),k("Punto añadido"),e(),L()}),q(R,"[data-hist-borrar]",N=>{const[,G]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(G),k("Eliminado"),e(),L()}),q(R,"[data-hist-semanal]",N=>{const G=N.getAttribute("data-hist-semanal"),B=t.ledger.generarPuntosSemanales(G);k(B>0?`Histórico con ${B} punto${B!==1?"s":""} semanal${B!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),L()}),q(R,"[data-hist-inicial]",N=>{const[G,B]=(N.getAttribute("data-hist-inicial")||"").split("|"),U=t.ledger.puntosControl(G).find(et=>et._id===B);if(!U)return;const tt=xa([U])[0].saldo;t.store.updateItem("accounts",G,{saldoInicial:tt,fechaInicialSaldo:U.fecha}),k(`Punto inicial → ${U.fecha} (${F(tt)})`),e(),L()})}function h(z){const j=t.store.get("accounts").filter(L=>L.activo);if(j.length===0)return k("No hay cuentas activas","err");const O=a(),R=j.map(L=>`• ${L.nombre}: ${F(D(L)??L.saldoInicial??0)}`).join(`
`);if(rt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${O})?

${R}

Esto recalibra el punto de arranque del dashboard.`)){for(const L of j)t.store.updateItem("accounts",L._id,{saldoInicial:D(L)??L.saldoInicial??0,fechaInicialSaldo:O});k("Saldo base actualizado"),e(),z()}}function T(z,j,O){q(z,"[data-cuentas-tab]",R=>{s=R.getAttribute("data-cuentas-tab")||"cuentas",j()}),q(z,"[data-nueva-acc]",()=>E(null,j)),q(z,"[data-editar-acc]",R=>E(R.getAttribute("data-editar-acc"),j)),q(z,"[data-tramos-ganancias]",()=>O.abrir()),q(z,"[data-reset-base]",()=>h(j)),q(z,"[data-hist-acc]",R=>C(R.getAttribute("data-hist-acc"),j)),q(z,"[data-principal-acc]",R=>{const L=R.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===L}))),k("Cuenta marcada como principal"),e(),j()}),q(z,"[data-borrar-acc]",R=>{var et,it;const L=R.getAttribute("data-borrar-acc"),N=t.store.get("accounts");if(N.length<=1)return k("Debe existir al menos una cuenta","err");const G=N.find(K=>K._id===L);if(!G)return;const U=[[((et=t.ledger)==null?void 0:et.transacciones({cuentaId:L}).length)??0,"movimiento","movimientos"],[((it=t.ledger)==null?void 0:it.puntosControl(L).filter(K=>K.origen!=="derivado").length)??0,"saldo anotado","saldos anotados"],[t.store.get("expenses").filter(K=>(K.cuenta||"default")===L||K.cuentaDestino===L).length,"gasto o ingreso","gastos o ingresos"],[t.store.get("nominas").filter(K=>K.cuenta===L).length,"nómina","nóminas"],[t.store.get("loans").filter(K=>(K.cuenta||"default")===L).length,"préstamo","préstamos"]].filter(([K])=>K>0).map(([K,gt,Rt])=>`${K} ${K===1?gt:Rt}`);if(U.length>0){if(G.activo===!1)return k("Esta cuenta ya está desactivada y tiene datos: no se puede eliminar","warn");if(!rt(`«${G.nombre}» tiene ${U.join(", ")}.

No se puede eliminar sin dejar esos datos sueltos. ¿Desactivarla? Dejará de contar en la proyección y conservará su historial; puedes reactivarla al editarla.`))return;let K=t.store.get("accounts").map(gt=>gt._id===L?{...gt,activo:!1,esCuentaPrincipal:!1}:gt);if(!K.some(gt=>gt.esCuentaPrincipal)){const gt=K.find(Rt=>Rt.activo!==!1)??K[0];K=K.map(Rt=>Rt._id===gt._id?{...Rt,esCuentaPrincipal:!0}:Rt)}t.store.set("accounts",K),k("Cuenta desactivada"),e(),j();return}if(!rt(`¿Eliminar la cuenta «${G.nombre}»? No tiene movimientos ni nada asociado.`))return;t.store.removeItem("accounts",L);const tt=t.store.get("accounts");tt.length>0&&!tt.some(K=>K.esCuentaPrincipal)&&t.store.set("accounts",tt.map((K,gt)=>gt===0?{...K,esCuentaPrincipal:!0}:K)),k("Cuenta eliminada"),e(),j()}),q(z,"[data-inv-modo]",R=>{const[L,N]=(R.getAttribute("data-inv-modo")||"").split("|");o.set(L,N==="real"?"real":"proyeccion"),j()})}let _=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:dl,mount(z){const j=()=>w(z);_??(_=uc({store:t.store,onDatosCambiados:()=>{e(),j()},año:()=>Number(a().slice(0,4))})),w(z),z.dataset.wired!=="1"&&(T(z,j,_),z.dataset.wired="1")}}}function Ds(t,a,e=!1){const o=Math.abs(ut(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function pl(t){function a(I){return`${I}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(I={}){var D;const E=(D=I.texto)==null?void 0:D.trim().toLowerCase();return t.get("transacciones").filter(C=>!(I.cuentaId&&C.cuentaId!==I.cuentaId||I.desde&&C.fecha<I.desde||I.hasta&&C.fecha>I.hasta||I.tipo&&C.tipo!==I.tipo||I.estimacionId&&C.estimacionId!==I.estimacionId||I.tags&&I.tags.length>0&&!I.tags.some(h=>C.tags.includes(h))||E&&!C.concepto.toLowerCase().includes(E))).sort((C,h)=>C.fecha.localeCompare(h.fecha)||C._id.localeCompare(h._id))}function o(I){const E={_id:a("tx"),fecha:I.fecha,cuentaId:I.cuentaId,importeCts:Ds(I.tipo,I.importe,I.negativo),concepto:I.concepto,tags:I.tags??[],estimacionId:I.estimacionId??null,tipo:I.tipo,origen:I.origen??"manual",...I.nota?{nota:I.nota}:{},...I.imprevisto?{imprevisto:!0}:{}};return t.set("transacciones",[...t.get("transacciones"),E]),E}function s(I,E){t.set("transacciones",t.get("transacciones").map(D=>{if(D._id!==I)return D;const{importe:C,...h}=E,T={...D,...h};return C!==void 0&&(T.importeCts=Ds(T.tipo,C,T.importeCts<0)),T}))}function n(I){t.set("transacciones",t.get("transacciones").filter(E=>E._id!==I))}function i(I,E){s(I,{estimacionId:E})}function r(I){return t.get("puntosControl").filter(E=>!I||E.cuentaId===I).sort((E,D)=>E.fecha.localeCompare(D.fecha))}function c(I){return r(I).filter(E=>E.origen!=="derivado")}function l(I,E,D,C){const h={_id:a("pc"),fecha:E,cuentaId:I,saldoCts:ut(D),...C?{nota:C}:{}},T=t.get("puntosControl").filter(_=>!(_.cuentaId===I&&_.fecha===E));return t.set("puntosControl",[...T,h].sort((_,z)=>_.fecha.localeCompare(z.fecha))),u(I),h}function p(I){const E=t.get("puntosControl").find(D=>D._id===I);t.set("puntosControl",t.get("puntosControl").filter(D=>D._id!==I)),E&&(E.origen==="derivado"?$(E.cuentaId):u(E.cuentaId))}function d(I,E,D){const C=T=>T.cuentaId===I&&T.origen!=="derivado"&&T.fecha>=E&&T.fecha<=D,h=t.get("puntosControl").filter(C).length;return h===0?0:(t.set("puntosControl",t.get("puntosControl").filter(T=>!C(T))),$(I),h)}function u(I){var R,L;const E=c(I),D=t.get("transacciones").filter(N=>N.cuentaId===I).sort((N,G)=>N.fecha.localeCompare(G.fecha)),C=(R=D[0])==null?void 0:R.fecha,h=(L=D[D.length-1])==null?void 0:L.fecha,T=t.get("puntosControl").filter(N=>!(N.cuentaId===I&&N.origen==="derivado"));if(!C)return t.set("puntosControl",T),$(I),0;const _=[];for(let N=se(C);N<=h;N=se(La(N,1)))_.push(N);_[_.length-1]!==h&&_.push(h);const z=new Set(E.map(N=>se(N.fecha))),j=N=>{const G=E.filter(B=>B.fecha<=N).pop();return D.filter(B=>B.fecha<=N&&(!G||B.fecha>G.fecha)).reduce((B,U)=>B+U.importeCts,(G==null?void 0:G.saldoCts)??0)},O=_.filter(N=>!z.has(se(N))).map(N=>({_id:a("pcd"),fecha:N,cuentaId:I,saldoCts:j(N),origen:"derivado"}));return t.set("puntosControl",[...T,...O].sort((N,G)=>N.fecha.localeCompare(G.fecha))),v(I,C,j(C)),$(I),O.length}function v(I,E,D){const C=t.get("accounts"),h=C.find(T=>T._id===I);!h||h.fechaInicialSaldo&&h.fechaInicialSaldo<=E||t.set("accounts",C.map(T=>T._id===I?{...T,saldoInicial:Q(D),fechaInicialSaldo:E}:T))}function g(I){return(I??[...new Set(t.get("transacciones").map(D=>D.cuentaId))]).reduce((D,C)=>D+u(C),0)}function b(I){const E=t.get("transacciones").filter(h=>h.origen==="importado"&&(!I||h.cuentaId===I)),D=new Map;for(const h of E){const T=D.get(h.cuentaId);T?T.push(h.fecha):D.set(h.cuentaId,[h.fecha])}const C=[];for(const[h,T]of D){T.sort();const _=d(h,T[0],T[T.length-1]);C.push({cuentaId:h,eliminados:_,semanales:u(h)})}return C}function $(I){const E=r(I),D=t.get("accounts");D.some(C=>C._id===I)&&t.set("accounts",D.map(C=>C._id===I?{...C,historicoSaldos:E.map(h=>({_id:h._id,fecha:h.fecha,saldo:Q(h.saldoCts),...h.nota?{nota:h.nota}:{}}))}:C))}function f(I,E=J()){const D=c(I).filter(_=>_.fecha<=E).pop(),C=D==null?void 0:D.fecha,h=(D==null?void 0:D.saldoCts)??0;return t.get("transacciones").filter(_=>_.cuentaId===I&&_.fecha<=E&&(C===void 0||_.fecha>C)).reduce((_,z)=>_+z.importeCts,h)}function y(I,E){return Q(f(I,E))}function M(I=J(),E){const D=E??t.get("accounts").filter(C=>C.activo).map(C=>C._id);return Q(D.reduce((C,h)=>C+f(h,I),0))}function S(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function w(){const I=[...t.get("transacciones").map(E=>E.fecha),...t.get("puntosControl").map(E=>E.fecha)];return I.length>0?I.sort().pop()??null:null}function x(I={}){return Q(e(I).reduce((E,D)=>E+D.importeCts,0))}function A(I={}){const E=new Map;for(const D of e(I)){const C=D.fecha.slice(0,7);E.set(C,(E.get(C)??0)+D.importeCts)}return new Map([...E.entries()].sort(([D],[C])=>D.localeCompare(C)).map(([D,C])=>[D,Q(C)]))}function P(I={}){const E=new Map;for(const D of e(I))for(const C of D.tags.length>0?D.tags:["sin_tag"])E.set(C,(E.get(C)??0)+D.importeCts);return new Map([...E.entries()].map(([D,C])=>[D,Q(C)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:y,saldoCuentaCts:f,saldoTotal:M,tieneDatos:S,ultimaFecha:w,total:x,totalPorMes:A,totalPorTag:P}}function yt(t){return t.trim().toLowerCase()}function ml(t){function a(){const l=new Map,p=(d,u)=>{const v=yt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])p(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])p(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(p=>l==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function s(l,p,d){const u=yt(p),v=(l??[]).map(yt);if(!v.includes(u))return l??[];const g=v.filter(b=>b!==u);return d===null?[...new Set(g)]:[...new Set([...g,yt(d)])]}function n(l,p){const d=yt(p);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,p){let d=0;for(const u of l)yt(u)!==yt(p)&&(d+=c(u,yt(p)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,p){let d=0;const u=t.get("expenses").map(A=>{const P=s(A.tags,l,p);return P!==A.tags&&(d+=1),P===A.tags?A:{...A,tags:P}});t.set("expenses",u);const v=t.get("transacciones").map(A=>{const P=s(A.tags,l,p);return P!==A.tags&&(d+=1),P===A.tags?A:{...A,tags:P}});t.set("transacciones",v);const g=t.get("loans").map(A=>{const P=s(A.tags,l,p);return P!==A.tags&&(d+=1),P===A.tags?A:{...A,tags:P}});t.set("loans",g);const b=t.get("nominas").map(A=>{const P=s(A.tags,l,p);return P!==A.tags&&(d+=1),P===A.tags?A:{...A,tags:P}});t.set("nominas",b);const $=t.get("config"),f=yt(l),y=A=>{const P=(A??[]).map(yt);if(!P.includes(f))return A??[];const I=P.filter(E=>E!==f);return p===null?[...new Set(I)]:[...new Set([...I,p])]},M={},S=y($.activeTagsFilter),w=y($.tagCategorias),x=y($.tagGrupos);return S!==$.activeTagsFilter&&(M.activeTagsFilter=S),w!==$.tagCategorias&&(M.tagCategorias=w),x!==$.tagGrupos&&(M.tagGrupos=x),Object.keys(M).length>0&&t.patchConfig(M),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const fl=3;function Ts(t){return t<.005?0:t}function gl(t){if(t.length<2)return null;const a=t.reduce((o,s)=>o+s,0)/t.length,e=t.reduce((o,s)=>o+(s-a)**2,0)/(t.length-1);return Math.sqrt(e)}function vl(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<fl)continue;const r=gl(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Ts(s),sigmaDeriva:Ts(n),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Fs(t,a,e=1,o=0){if(a<=0)return 0;const s=Math.max(0,t)*Math.sqrt(a),n=Math.max(0,o)*a;return s===0&&n===0?0:V(e*Math.hypot(s,n))}function bl(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,s=e.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-n)*12+(l-i)),d=Fs(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:V(r.saldoAcum+d),abajo:V(r.saldoAcum-d)}})}function hl(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Fa="financeapp_session",yl=["local","dropbox","firebase"];function $l(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!yl.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function xl({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const s=()=>t??(typeof localStorage<"u"?localStorage:null);function n(v){const g=s();if(g)try{v?g.setItem(Fa,JSON.stringify(v)):g.removeItem(Fa)}catch{}}function i(){const v=s();if(!v)return null;try{return $l(v.getItem(Fa))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(n(null),null):v:null}function p(v){const g=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return n(b),b}function d(){const v=i();v&&n({...v,ultimoUso:e()})}function u(){n(null)}return{abrir:p,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const zs=["pointerdown","keydown","visibilitychange"];function Il({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of zs)n==null||n.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,s(c);for(const p of zs)n==null||n.removeEventListener(p,r)}}return l}const wl=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Cl="FinanceApp",Sl=new TextEncoder().encode("financeapp-bio-passphrase-v1");function js(t){return new Uint8Array(new ArrayBuffer(t))}const za="financeapp_bio_credencial",ja="financeapp_bio_secreto",qa="financeapp_bio_ultimo_desbloqueo",qs="financeapp_bio_gracia_min",Ml=5;function Al(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function Oe(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function Be(t){const a=atob(t),e=js(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function El(t){return Oe(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Pl(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Be(a)}function Ns(t){return t.getClientExtensionResults()}function _l(t={}){const a=t.webauthn??Al(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),s=t.ahora??(()=>Date.now()),n=t.randomBytes??(w=>crypto.getRandomValues(js(w)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const w=o==null?void 0:o.getItem(za);if(!w)return null;try{const x=JSON.parse(w);return typeof x.credencialId!="string"||typeof x.salt!="string"?null:x}catch{return null}}function l(){return c()!==null}async function p(w){const x=await e.importKey("raw",w,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Sl},x,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(w,x){const A=n(12),P=await e.encrypt({name:"AES-GCM",iv:A},w,new TextEncoder().encode(x));return`${Oe(A)}:${Oe(P)}`}async function u(w,x){const[A,P]=x.split(":"),I=Be(A),E=Be(P),D=await e.decrypt({name:"AES-GCM",iv:I},w,E);return new TextDecoder().decode(D)}async function v(w,x){var j,O;if(!w)throw new Error("No hay clave de cifrado que envolver.");const A=n(32),P=n(32),I=n(16),E=await a.create({publicKey:{challenge:P,rp:{name:Cl},user:{id:I,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const D=Ns(E);if(!((j=D.prf)!=null&&j.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let C=((O=D.prf.results)==null?void 0:O.first)??null;if(C||(C=await g(E.rawId,A)),!C)throw new Error("El sensor no ha devuelto material de cifrado.");const h=await p(C),T=await d(h,w),_={credencialId:El(E.rawId),salt:Oe(A),modo:x,creadaEn:s()},z=i();z.setItem(za,JSON.stringify(_)),z.setItem(ja,T)}async function g(w,x){var P,I;const A=await a.get({publicKey:{challenge:n(32),allowCredentials:[{id:w,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:x}}},timeout:6e4}});return A?((I=(P=Ns(A).prf)==null?void 0:P.results)==null?void 0:I.first)??null:null}async function b(){const w=c();if(!w)throw new Error("No hay huella configurada en este dispositivo.");const x=o==null?void 0:o.getItem(ja);if(!x)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await g(Pl(w.credencialId).buffer,Be(w.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const P=await p(A),I=await u(P,x);return f(),I}function $(){o==null||o.removeItem(za),o==null||o.removeItem(ja),o==null||o.removeItem(qa)}function f(){o==null||o.setItem(qa,String(s()))}function y(){const w=o==null?void 0:o.getItem(qs);if(w==null)return Ml;const x=Number(w);return Number.isFinite(x)&&x>0?x:0}function M(w){o==null||o.setItem(qs,String(Math.max(0,Math.floor(w)||0)))}function S(){if(!l())return!1;const w=y();if(w<=0)return!1;const x=o==null?void 0:o.getItem(qa),A=x?Number(x):NaN;return Number.isFinite(A)?s()-A<w*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:$,marcarDesbloqueo:f,dentroDeGracia:S,graciaMinutos:y,configurarGracia:M}}function Rs(){if(typeof localStorage<"u"){const x=fi();x.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${x.join(", ")}`)}const t=Mi(),a=t.activo(),e=Wt(a),o=Lo(localStorage,e),s=yi({adapter:o}),n=$i(),{applied:i}=s.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Ft})`),s.subscribe(x=>n.marcar(x));function r(){var A,P,I,E,D;const x=globalThis;(P=(A=x.FirebaseService)==null?void 0:A.isConnected)!=null&&P.call(A)&&((D=(E=(I=x.FirebaseService).uploadRegistroProyectos)==null?void 0:E.call(I))==null||D.catch(C=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",C instanceof Error?C.message:C)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(x=>x._id===a)??t.listar()[0],colecciones:zt.filter(x=>x!=="config"),crear:x=>{const A=t.crear(x);return r(),A},renombrar:(x,A)=>{t.renombrar(x,A),r()},duplicar:(x,A)=>{const P=t.duplicar(x,A);return r(),P},eliminar:x=>{t.eliminar(x),r()},cambiarA:x=>t.establecerActivo(x),fusionarRemotos:x=>t.fusionarRemotos(x),importarDesde:(x,A)=>{const P=Ai(localStorage,x,A),I=Ei(P),E=[];for(const D of A){const C=I[D];if(!Array.isArray(C)||C.length===0)continue;const h=s.get(D);s.set(D,[...h,...C]),E.push(D)}return E.length>0&&n.marcar("importado-de-otro-proyecto"),{importadas:E}}},l=_i(s),p=_l(),d=xl({autoLogoutMinutos:()=>{var A,P;const x=(P=(A=globalThis.State)==null?void 0:A.get)==null?void 0:P.call(A,"config");return Number((x==null?void 0:x.autoLogoutMinutos)??s.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=pl(s),v=ml(s),g=hc(u),b=Tc(s),$=ar({isEnabled:x=>l.isEnabled(x)}),f=Wi({flags:l,rutasExtra:()=>$.flagPorRuta()}),y=zi({flags:l,onChange:()=>{var x,A;$.attachToShell(),f.apply(),(A=(x=globalThis.Router)==null?void 0:x.rerender)==null||A.call(x)}}),M=Bi({proyectos:c}),S=()=>{var A,P,I,E,D,C;const x=globalThis;if((P=(A=x.State)==null?void 0:A.load)==null||P.call(A),((E=(I=x.Router)==null?void 0:I.current)==null?void 0:E.call(I))==="dashboard")try{(C=(D=x.DashboardModule)==null?void 0:D.render)==null||C.call(D)}catch(h){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",h)}},w=Yi({store:s,onDatosCambiados:S});return $.register(mr({store:s,onDatosCambiados:S})),$.register(wr({store:s,onDatosCambiados:S})),$.register(Kr({store:s,onDatosCambiados:S})),$.register(ul({store:s,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:S})),$.register(sr({store:s,onDatosCambiados:S})),{version:Ft,core:Ws,engine:{generarExtracto:io,recomputarSaldoAcum:Qs,saldoHoy:Xs,sumarPorTags:ro,providers:{proyectarGastos:re,proyectarPrestamos:Xe,proyectarTransferencias:Xa,proyectarNominas:Ze,proyectarInteresesCuentas:to,proyectarAportaciones:Za,proyectarRetencionesFiscales:eo,proyectarInflacionGastos:ao,proyectarPerdidaAhorro:oo},analysis:an,margins:dn,avisos:fn,dashboard:En,mes:qn},store:s,flags:l,featureRegistry:{all:Dt,porGrupo:Uo},ui:{tarjetaMes:On,abrirHistoricoMeses:Un,openFeatures:y.open,openProyectos:M.open,openPersonas:w.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Ji({store:s,rerender:()=>{var A,P,I,E;const x=globalThis;(P=(A=x.State)==null?void 0:A.load)==null||P.call(A),(E=(I=x.Router)==null?void 0:I.rerender)==null||E.call(I)}}),avisoGuardado:null,instalarBuscador:()=>tr({estado:()=>({accounts:s.get("accounts"),expenses:s.get("expenses"),loans:s.get("loans"),nominas:s.get("nominas"),transacciones:s.get("transacciones")}),rutasDisponibles:()=>$.routes(),navegar:x=>{var A,P;return(P=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:P.call(A,x)}})},app:$,session:Object.assign(d,{vigilar:x=>Il({sesion:d,onCaducada:x}),opciones:wl}),biometria:p,cambios:n,datos:{colecciones:zt,snapshot:()=>({...ko(o),[Oo]:Ft}),aplicar:(x,{sellar:A=!0}={})=>{const P=A?(E,D)=>o.set(E,D):(E,D)=>{const C=globalThis.StorageAdapter;C!=null&&C.setRestaurando?C.setRestaurando(E,D):o.set(E,D)},I=xi(P,x);for(const E of qo)x[E]!==void 0&&x[E]!==null&&P(`${ft}${E}`,x[E]);return I.length>0&&P(me,Ci(x,Ft)),s.load(),n.marcar("copia-restaurada"),I},faltantes:x=>Ii(x),esVacioOPorDefecto:()=>wi(ko(o)),recargar:()=>{s.load(),n.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:Aa,medirVariabilidad:vl,bandaDeConfianza:bl,bandaAcumulada:Fs,describirBanda:hl}}}function Dl(){try{const t=Rs();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const nt=typeof window<"u"?Dl():null;if(nt){let t=!1;const a=()=>{var s,n;if(nt.app.attachToShell(),nt.ui.applyGating(),!t){t=!0,nt.ui.watchGating(),nt.ui.instalarDeshacer(),nt.ui.instalarBuscador();const i=globalThis,r=()=>{var d,u,v,g;return(u=(d=i.FirebaseService)==null?void 0:d.isConnected)!=null&&u.call(d)?i.FirebaseService:(g=(v=i.DropboxService)==null?void 0:v.isConnected)!=null&&g.call(v)?i.DropboxService:null};nt.ui.avisoGuardado=er({cambios:nt.cambios,hayDestino:()=>r()!==null,guardar:async()=>{const d=r();if(!(d!=null&&d.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const u=globalThis.AuthModule;u!=null&&u.guardarEnNube?await u.guardarEnNube():await d.uploadBackup()}});const c=document.getElementById("sidebar-proyecto-activo"),l=document.getElementById("sidebar-proyecto-activo-nombre");c&&l&&(l.textContent=nt.proyectos.activo().nombre,c.classList.remove("hidden"),c.addEventListener("click",()=>nt.ui.openProyectos())),(s=document.getElementById("btn-proyectos"))==null||s.addEventListener("click",()=>nt.ui.openProyectos());const p=nt.store.get("config").archivoMigracion011;if(p&&!p.avisado&&p.desactivados+p.amortizaciones.length>0){const d=p.desactivados+p.amortizaciones.length,u=globalThis.UI;setTimeout(()=>{var v;return(v=u==null?void 0:u.toast)==null?void 0:v.call(u,`Se han desactivado ${d} elemento${d===1?"":"s"} que venía${d===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),nt.store.patchConfig({archivoMigracion011:{...p,avisado:!0}})}(n=document.getElementById("btn-personas"))==null||n.addEventListener("click",()=>nt.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",s=>{const n=s.target;n!=null&&n.closest(".nav-btn[data-view]")&&setTimeout(a,0)}),window.addEventListener(Ro,()=>{if(document.getElementById("aviso-sin-espacio"))return;const s=document.querySelector(".view-container");if(!(s!=null&&s.parentElement))return;const n=document.createElement("div");n.id="aviso-sin-espacio",n.setAttribute("role","alert"),n.className="card",n.style.cssText="border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap";const i=document.createElement("span");i.style.flex="1",i.textContent="No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.";const r=document.createElement("button");r.className="btn-primary btn-sm",r.textContent="Exportar copia",r.addEventListener("click",()=>{var c,l;return(l=(c=globalThis.DataIO)==null?void 0:c.exportJSON)==null?void 0:l.call(c)}),n.append(i,r),s.parentElement.insertBefore(n,s)});let e=null;const o=`${Wt(nt.proyectos.activo()._id)}${ft}`;window.addEventListener("storage",s=>{!s.key||!s.key.startsWith(o)||s.key.endsWith("_modificadoEn")||s.key.endsWith("_schemaVersion")||(e&&clearTimeout(e),e=setTimeout(()=>{var i,r,c;e=null,nt.store.load(),((i=document.getElementById("modal-overlay"))==null?void 0:i.classList.contains("hidden"))===!1||(c=(r=globalThis.Router)==null?void 0:r.rerender)==null||c.call(r)},150))})}return He.bootstrap=Rs,Object.defineProperty(He,Symbol.toStringTag,{value:"Module"}),He}({});
//# sourceMappingURL=financeapp-core.js.map
