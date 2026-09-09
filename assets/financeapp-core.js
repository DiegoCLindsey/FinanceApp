var FinanceAppBundle=function(we){"use strict";function W(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function O(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function K(){return W(new Date)}function Ie(t,e){return new Date(t,e+1,0).getDate()}function da(t,e,a){return W(new Date(t,e,Math.min(a,Ie(t,e))))}function se(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return W(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return da(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),W(i)}return null}function ua(t,e){if(!e)return t;const a=O(t);return se(a.getFullYear(),a.getMonth(),e)??t}const tn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],en={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ce(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${en[a]||a+"º"} ${tn[o]} del mes`}return t}function Bt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function Ht(t){const e=O(t),a=e.getDay()===0?0:7-e.getDay();return e.setDate(e.getDate()+a),W(e)}function pa(t,e){const a=O(t);return a.setDate(a.getDate()+e),W(a)}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function G(t){return J(it(t))}function P(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ma(t){return(t||0).toFixed(2)+"%"}function Ct(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function fa(t,e,a,o=0){const n=Ct(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const l=n*(1-Math.pow(1+i,-a))/i-s,m=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),d=i-l/m;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function ga(t,e,a,o,n=0,s=[],i={}){const r=[];let c=t;const l=O(o),m=e/100/12;let d=a,u=Ct(c,e,d);const v=[...s].sort((b,x)=>b.fecha.localeCompare(x.fecha));let g=0;for(let b=1;b<=a*2&&c>.01;b++){const x=new Date(l);l.setMonth(l.getMonth()+1);const f=ua(W(x),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const C=v[g],w=C.cantidad*(n/100);if(c-=C.cantidad,c=Math.max(0,c),C.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*m/u)/Math.log(1+m)):(d=a-b+1,u=Ct(c,e,d)),r.push({mes:"AMORT",fecha:C.fecha,cuota:0,interes:0,amortizacion:C.cantidad,comisionAmort:w,capitalPendiente:c,esAmortizacion:!0,simulacion:C.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*m,S=Math.min(u-h,c);if(c-=S,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:h,amortizacion:S,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const va=new Map;function X(t){var x;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=va.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,m=ga(n,s,i,r,c||0,e,t),d=m.reduce((f,h)=>f+h.interes,0),u=m.reduce((f,h)=>f+h.comisionAmort,0),v=n*((l||0)/100),g=m.filter(f=>!f.esAmortizacion),b={cuota:Ct(n,s,i),totalIntereses:d,tae:fa(n,s,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:((x=g.slice(-1)[0])==null?void 0:x.fecha)||"",mesesReales:g.length,tabla:m};return va.set(a,b),b}function ba(t){const e=X(t),a=X({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function gt(t,e,a){if(!t||t.length===0)return 1;const o=O(e),n=O(a);if(n<=o)return 1;const s=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),l=s.filter(b=>b.year<=c),m=l.length>0?l[l.length-1]:s[0],d=(m?m.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,g=Bt(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function ha(t,e,a,o=0){const n=O(e),s=O(a);if(s<=n)return o;const i=Bt(n,s),r=t?[...t].sort((m,d)=>m.year-d.year):[];let c=0,l=new Date(n);for(;l<s;){const m=l.getFullYear(),d=new Date(m+1,0,1),u=d<s?d:s,v=Bt(l,u),g=r.filter(f=>f.year<=m),b=g.length>0?g[g.length-1]:null,x=b!==null?b.tasa:o;c+=x*v,l=u}return i>0?c/i:o}function ya(t,e){return((1+t/100)/(1+e/100)-1)*100}function an(t,e,a,o){const n=gt(e,a,o);return n>0?t/n:t}function on(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:m=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,b=g,x=c>0?b/c*100:null,f=r?l-m:l,h=c>0?f/c*100:null,S=c>0?l/c*100:null,C=c>0?(d+l+v)/c*100:null,w=c>0?u/c*100:null,$=(_,I,y)=>_===null?"neutral":_>=I?"verde":_>=y?"amarillo":"rojo",M=(_,I,y)=>_===null?"neutral":_<=I?"verde":_<=y?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:m,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:x,dti:h,dtiTotal:S,excluyeHipoteca:r,pctNecesidades:C,pctDeseos:w,semAhorro:$(x,a,o),semDTI:M(h,n,s),semNecesidades:M(C,i[0],i[0]+15),semDeseos:M(w,i[1],i[1]+10),semAhorroRegla:$(x,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function vt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Gt(t,e){const a=Se(t,e);return a?a.saldo:e>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Se(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];return a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=a&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=e)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e)??null}function $a(t,e){let a="";for(const o of t){const n=Se(o,e);n&&n.fecha>a&&(a=n.fecha)}return a}function nn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function sn(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}function ie(t){var e,a;return((e=t.find(o=>o.esPorDefecto))==null?void 0:e._id)??((a=t[0])==null?void 0:a._id)??"default"}function rn(t,e){if(e<=0)return[];const a=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/e),s=o-n*e;return Array.from({length:e},(i,r)=>a*(n+(r<s?1:0)))}function cn(t,e,a,o){if(a===0)return{ids:t,cts:e};const n=t.indexOf(o);if(n>=0){const s=[...e];return s[n]+=a,{ids:t,cts:s}}return{ids:[...t,o],cts:[...e,a]}}function _t(t,e,a){const o=it(t);if(!e||e.participantes.length===0)return[{personaId:a,importe:J(o)}];const n=e.participantes.map(d=>d.personaId);if(e.modo==="partesIguales"){const d=rn(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(d[v])}))}const s=e.participantes.map(d=>{const u=Math.max(0,d.valor??0);return e.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=s.map(g=>Math.round(g*d)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),n.map((g,b)=>({personaId:g,importe:J(u[b])}))}const c=o-i,{ids:l,cts:m}=cn(n,s,c,a);return l.map((d,u)=>({personaId:d,importe:J(m[u])}))}function Ae(t,e){return t.find(a=>a._id===e||e.startsWith(`${a._id}_`))}function ln(t,e,a){const o=ie(a),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of a)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Ae(e.expenses,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Ae(e.loans,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Ae(e.nominas,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).ingresos+=l.importe}}}return[...n.values()]}function Me(t,e,a){const o=n=>!n||n.participantes.length===0?[a]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(e)])}const bt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function xa(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function ht(t,e){return xa(t,e).baseImponible}function wa(t,e){return lt(t,e)/12}const Vt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ee(t,e){if(!t||t<=0)return 0;const a=e||Vt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],c=s<a.length-1?a[s+1][0]:1/0,l=Math.min(n,c-i);if(!(l<=0)&&(o+=l*(r/100),n-=l,n<=0))break}return o}function re(t,e){if(rt(t)!=="inversion")return null;const a=vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Ee(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function _e(t,e=new Date){var u;if(rt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=vt(t),n=W(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=s.reduce((v,g)=>v+g.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,m=Math.min(o,i+c*l),d=Math.max(0,o-m);return{saldo:o,disponible:m,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function Ia(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=vt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((l,m)=>l+m.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function Pe(t,e,a){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,m)=>l+(m.bruto||0)*(m.nPagas||12),0),i=[...a||[]].sort((l,m)=>l[0]-m[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,m]of i)if(s>=l)r=m;else break;return r}const dn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Vt,TRAMOS_IRPF_DEFAULT:bt,agregarPorPersona:ln,ajustarFechaPago:ua,ajustarPrecioReal:an,calcBaseImponibleTrabajo:ht,calcFactorInflacion:gt,calcFondoInversion:re,calcFondosPension:_e,calcGananciasCapital:Ee,calcIRPF:lt,calcImpuestoPension:Ia,calcInflacionMediaAnual:ha,calcSaludFinanciera:on,calcTAE:fa,calcTipoMarginalPension:Pe,calcTipoRealFisher:ya,calcularReparto:_t,clampedDate:da,cuotaMensual:Ct,desgloseBaseTrabajo:xa,diasEntre:Bt,entradaSaldo:Se,fechaUltimoSaldoConocido:$a,finDeSemana:Ht,formatEUR:P,formatLocalDate:W,formatPct:ma,fromCents:J,haySimulaciones:sn,idPersonaPorDefecto:ie,labelDiaPago:Ce,lastDayOfMonth:Ie,modeloFondoDe:rt,parseLocalDate:O,personasImplicadas:Me,resolverDiaEfectivo:se,resumenPrestamo:X,resumenPrestamoConAhorro:ba,retencionMensual:wa,roundMoney:G,saldoEnFecha:Gt,saldoRealCuenta:vt,sinSimulaciones:nn,sumarDias:pa,tablaAmortizacion:ga,toCents:it,todayISO:K},Symbol.toStringTag,{value:"Module"}));function Ut(t,e,a=null){const o=[],n=O(e.start),s=O(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=O(i.fechaInicio||e.start),c=i.fechaFin?O(i.fechaFin):s,l=i.cuantia,m=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&m(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let u=r.getFullYear(),v=r.getMonth();const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const x=se(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),S=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,S)))})(),f=O(x);if(f>s||f>c)break;f>=n&&f>=r&&m(x),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=s&&u<=c;)m(W(u)),u=new Date(u.getTime()+d)}}return o}function Fe(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Ca(t,e,a=null,o={accounts:[]}){const n=[],s=O(e.start),i=O(e.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>bt),m=o.resolverTramosGanancias||(()=>Vt),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(u.cuenta||"default")||a.includes(u.cuentaDestino||"default")))continue;const v=O(u.fechaInicio||e.start),g=u.fechaFin?O(u.fechaFin):i,b=x=>{const f=r.find(E=>E._id===(u.cuenta||"default")),h=r.find(E=>E._id===(u.cuentaDestino||"default")),S=rt(f),C=rt(h),w=S==="inversion"&&C==="inversion"||S==="pension"&&C==="pension",$=["transferencia",...w?["traspaso"]:[],...u.tags||[]],M=w?"traspaso-out":"transfer-out",_=w?"traspaso-in":"transfer-in",I=!a||a.length===0||a.includes(u.cuenta||"default"),y=!a||a.length===0||a.includes(u.cuentaDestino||"default");if(I&&n.push({fecha:x,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:$,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:M}),y&&n.push({fecha:x,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:$,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:_}),I&&!w&&f){if(S==="inversion"){const E=parseInt(x.slice(0,4)),A=re(f,m(E));if(A&&A.saldo>0&&A.plusvalia>0){const F=Math.min(1,u.cuantia/A.saldo),D=A.plusvalia*F*.19;D>.01&&n.push({fecha:x,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(S==="pension"){const E=l(parseInt(x.slice(0,4))),A=Pe(f,c,E),F=Ia(f,u.cuantia,A||void 0);if(F>0){const z=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${A}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:x,concepto:z,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const x=Math.max(1,u.frecuencia||1);let f=v.getFullYear(),h=v.getMonth();const S=Math.ceil(240/x)+2;for(let C=0;C<S;C++){const w=se(f,h,u.diaPago||"")||(()=>{const M=v.getDate(),_=new Date(f,h+1,0).getDate();return W(new Date(f,h,Math.min(M,_)))})(),$=O(w);if($>i||$>g)break;$>=s&&$>=v&&b(w),h+=x,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const x=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/x);f=new Date(v.getTime()+h*x)}for(;f<=i&&f<=g;)b(W(f)),f=new Date(f.getTime()+x)}}return n}function Sa(t,e,a=null){const o=[],n=O(e.start),s=O(e.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const m=O(l.fechaInicio||e.start),d=l.fechaFin?O(l.fechaFin):s,u=l.cuentaOrigen||"default",v=!a||!a.length||a.includes(u),g=!a||!a.length||a.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",x=w=>{v&&o.push({fecha:w,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:w,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let h=m.getFullYear(),S=m.getMonth();const C=Math.ceil(240/f)+2;for(let w=0;w<C;w++){const $=new Date(h,S+1,0).getDate(),M=W(new Date(h,S,Math.min(m.getDate(),$))),_=O(M);if(_>s||_>d)break;_>=n&&_>=m&&x(M),S+=f,S>=12&&(h+=Math.floor(S/12),S=S%12)}}}return o}function Aa(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=O(e.start),r=O(e.end),c=s.periodoCobro||"mensual",l=c==="mensual",m=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:m/(365.25*864e5);let u=Gt(s,e.start);const v=o.filter(x=>x.cuenta===s._id).map(x=>({fecha:x.fecha,delta:x.tipo==="ingreso"?Math.abs(x.cuantia):-Math.abs(x.cuantia)})).sort((x,f)=>x.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const x=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+m),f=new Date(Math.min(x.getTime(),r.getTime()+1)),h=W(f);let S=0;for(;g<v.length&&v[g].fecha<h;)S+=v[g].delta,g++;const C=u,w=u+S,$=Math.max(0,(C+w)/2);u=w;const M=l?d:(f.getTime()-b.getTime())/(365.25*864e5),_=$*(Math.pow(1+s.interes/100,M)-1);_>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:_,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=x}}return n}function Ma(t,e,a,o=null){const n=[],s=e||bt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=wa(r,s),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Ut([l],a,o))}return n}const un=[5,11,2,8],pn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function De(t,e,a=null,o=[],n=()=>bt){const s=[],i=O(e.start),r=O(e.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function m(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||e.start,b=O(g),x=O(v);let f=0;for(let S=b.getFullYear();S<=x.getFullYear();S++){const C=new Date(S,u.mesActualizacionIPC-1,1);C>b&&C<=x&&f++}if(f===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*gt(o,g,h)}function d(u,v){const g=m(u,v),b=(u.retribucionFlexible||[]).reduce((E,A)=>E+(A.importe||0)*12,0),x=Math.max(0,g-b);if(u.irpfModo==="manual")return x*((u.irpfPct||0)/100);const f=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return lt(ht(g,b),f);const S=l[h].filter(E=>E.activo),C=S.reduce((E,A)=>E+m(A,v),0),w=S.reduce((E,A)=>E+(A.retribucionFlexible||[]).reduce((F,z)=>F+(z.importe||0)*12,0),0),$=Math.max(0,C-w),M=ht(C,w),_=Math.max(0,g-b),I=$>0?M*(_/$):0,y=S.filter(E=>E._id!==u._id&&(E.bruto||0)>(u.bruto||0)).reduce((E,A)=>{const F=(A.retribucionFlexible||[]).reduce((D,T)=>D+(T.importe||0)*12,0),z=Math.max(0,m(A,v)-F);return E+($>0?M*(z/$):0)},0);return lt(y+I,f)-lt(y,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=O(u.fechaInicio||e.start),x=u.fechaFin?O(u.fechaFin):r,f=h=>{const S=m(u,h),C=d(u,h),w=(u.retribucionFlexible||[]).reduce((F,z)=>F+(z.importe||0)*12,0),$=Math.max(0,S-w),M=(u.ssPct??6.35)/100,_=$*M,I=$/g,y=C/g,E=_/g,A=u.representacion==="simplificado"?I-E-y:I;s.push({fecha:h,concepto:u.nombre,cuantia:A,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(E>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),y>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:y,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const F of u.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||a&&a.length>0&&!a.includes(F.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${pn[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${u._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),S=b.getDate();let C=b.getFullYear(),w=b.getMonth();for(let $=0;$<300;$++){const M=new Date(C,w+1,0).getDate(),_=new Date(C,w,Math.min(S,M));if(_>r||_>x)break;_>=i&&_>=b&&f(W(_)),w+=h,w>=12&&(C+=Math.floor(w/12),w=w%12)}}else{const h=g-12,S=b.getDate();let C=b.getFullYear(),w=b.getMonth();for(let _=0;_<300;_++){const I=new Date(C,w+1,0).getDate(),y=new Date(C,w,Math.min(S,I));if(y>r||y>x)break;y>=i&&y>=b&&f(W(y)),w++,w>=12&&(C++,w=0)}const $=Math.max(b.getFullYear(),i.getFullYear()),M=Math.min((u.fechaFin?x:r).getFullYear(),r.getFullYear());for(let _=$;_<=M;_++)for(const I of un.slice(0,h)){const y=new Date(_,I,15);y>=i&&y<=r&&y>=b&&y<=x&&f(W(y))}}}return s}function Ea(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=O(a.start),r=O(a.end),c=K(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let m=new Date(i.getFullYear(),i.getMonth(),1);for(;m<=r;){const d=m.getFullYear(),u=m.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=W(new Date(d,u+1,0)),x=W(new Date(d,u,15));let f=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const S=h.fechaInicio||c,C=gt(e,S,x);if(C<=1)continue;const w=Math.max(1,h.frecuencia||1);f+=h.cuantia*(C-1)/w}f>.01&&s.push({fecha:x,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),m=new Date(d,u+1,1)}return s}function _a(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=O(a.start),i=O(a.end),r=[...e].sort((l,m)=>l.year-m.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),m=c.getMonth(),d=l+"-"+String(m+1).padStart(2,"0"),u=W(new Date(l,m,15)),v=r.filter(h=>h.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,x=Math.pow(1+b,1/12)-1,f=t*x;f>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,m+1,1)}return n}function Pa(t,e){const a=e.fechaReferencia||e.dashboardStart,o=a<e.dashboardStart?e.dashboardStart:a>e.dashboardEnd?e.dashboardEnd:a,n=t.reduce((i,r)=>i+Gt(r,o),0),s=$a(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function Fa(t,e,a){const{fecha:o,saldo:n}=Pa(e,a),s=t.filter(m=>m.fecha<o),i=t.filter(m=>m.fecha>=o),r=[];let c=n;for(const m of[...s].reverse()){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);r.unshift({...m,delta:d,saldoAcum:c}),c-=d}const l=[];c=n;for(const m of i){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);c+=d,l.push({...m,delta:d,saldoAcum:c})}return[...r,...l]}function mn(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Fa([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function Da(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(x=>x.activo&&(!s||s.length===0||s.includes(x._id))),l=Pa(c,n),m={start:l.fecha<n.dashboardStart?l.fecha:n.dashboardStart,end:n.dashboardEnd},d=a.filter(x=>x.tipo!=="transferencia"),u=a.filter(x=>x.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Ut(d,m,s)),g=g.concat(Fe(e,m,s)),g=g.concat(Ca(u,m,s,v)),g=g.concat(Sa(o,m,s));const b=Aa(o,m,s,g);if(g=g.concat(b),g=g.concat(Ma(a,n.tramos_irpf,m,s)),g=g.concat(De(i,m,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const x=(o.find(S=>S.activo&&S.esCuentaPrincipal)||o.find(S=>S.activo)||{_id:"default"})._id;g=g.concat(Ea(d,r,m,s,x));const h=o.filter(S=>S.activo&&(!s||s.length===0||s.includes(S._id))).reduce((S,C)=>S+Gt(C,n.dashboardStart),0);g=g.concat(_a(h,r,m,x))}return g.sort((x,f)=>x.fecha.localeCompare(f.fecha)),Fa(g,c,n).filter(x=>x.fecha>=n.dashboardStart)}function fn(t,e,a=null){const o=K(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,c)=>r+vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Ta(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function gn(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${P(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${P(i)} < ${P(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${P(i)})`})))}return a}function vn(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=O(e.dashboardStart),n=O(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function bn(t,e,a=K()){const o=new Set,n=e.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=a&&(l[c]=r.saldoInicial||0);for(const m of r.historicoSaldos||[])m.fecha<=a&&(!c||m.fecha>=c)&&(l[m.fecha]=m.saldo);return Object.keys(l).forEach(m=>o.add(m)),l}),s={};for(const r of[...o].sort()){let c=0;for(let l=0;l<e.length;l++){const m=Object.entries(n[l]).filter(([d])=>d<=r);m.length>0?(m.sort(([d],[u])=>u.localeCompare(d)),c+=m[0][1]):c+=e[l].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([l],[m])=>l.localeCompare(m))){const l=t.filter(v=>v.fecha<=r),m=l.length>0?l[l.length-1].saldoAcum:null;if(m===null)continue;const d=c-m,u=m!==0?d/Math.abs(m)*100:0;i.push({cuenta:"Total",fecha:r,estimado:m,real:c,desv:d,pct:u})}return i}const hn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:bn,detectarPuntosCriticos:gn,mediaMensualGastos:vn},Symbol.toStringTag,{value:"Module"}));function Yt(t,e=new Date){const a=W(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Ut(s,{start:a,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function yn(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Ct(a.capital,a.tin,a.meses),0)}function $n(t,e){return X(t).tabla.filter(a=>!a.esAmortizacion&&a.fecha>=e).length}function za(t,e,a){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+Ct(n.capital,n.tin,n.meses)*Math.min(e,$n(n,a)),0)}function ja(t,e,a,o=new Date){if(e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0)return e.colchonFijo;const n=Yt(t,o),s=e.colchonMeses||6;return n*s+za(a,s,W(o))}function xn(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,m)=>l.fecha.localeCompare(m.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return ja(t,e,a,n);if(i.tipo==="fijo")return i.importe||0;const r=Yt(t,n),c=i.meses||6;return r*c+za(a,c,o)}function Te(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((m,d)=>m.fecha.localeCompare(d.fecha)),c=r.filter(m=>m.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Yt(e,i)+yn(o))*(c.meses||1):0}function wn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function In(t,e){const a={};for(const o of e)a[o._id]=vt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=wn(o)),{fecha:o.fecha,saldos:{...a}}))}function Cn(t,e,a,o,n,s,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let m=0;m<e.length;m++){const d=e[m],u=Te(c,o,n,s,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var x,f;return g+(((f=(x=a[m])==null?void 0:x.saldos)==null?void 0:f[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${P(v)} < ${P(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Sn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:ja,calcColchonEnFecha:xn,calcGastoBasicoMensual:Yt,calcMargenEnFecha:Te,detectarCrucesMargenes:Cn,saldosPorCuentaEnExtracto:In},Symbol.toStringTag,{value:"Module"}));function An(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function qa(t,e){return Bt(O(t),O(e))}const Mn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ra(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${Mn[o-1]}${s?"":` de ${a}`}`}function Na(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function En(t,e={}){const{hoy:a=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${P(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${P(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${P(d.saldo)}, y el margen pide ${P(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=qa(a,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:n))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Na(u),titulo:d.titulo(g),detalle:d.detalle(Ra(d.fecha,a)),incierto:g})}const m={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||m[d.gravedad]-m[u.gravedad]),l.slice(0,s)}const _n=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:An,construirAvisos:En,describirPlazo:Na,diasEntreISO:qa,fechaEnPalabras:Ra},Symbol.toStringTag,{value:"Module"})),Pn=30.44*864e5;function La(t){const e=t.getFullYear(),a=t.getMonth();return{desde:W(new Date(e,a,1)),hasta:W(new Date(e,a,Ie(e,a)))}}function Oa(t){const[e,a]=t.split("-").map(Number);return La(new Date(e,a-1,1))}function Fn(t,e){return Math.max(1,(O(e).getTime()-O(t).getTime())/Pn)}const Dn=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),yt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Tn(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function zn(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=e.loanIdsIniciados,s=yt(t.filter(u=>u.tipo==="ingreso")),i=yt(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=yt(t.filter(u=>o(u)&&e.hipotecaIds.has(u.sourceId??""))),c=yt(t.filter(u=>u.sourceType==="loan-amort")),l=yt(t.filter(u=>u.sourceType==="account-interest")),{basicos:m,deseo:d}=Tn(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:c/a,gastosBasicos:m/a,gastosDeseo:d/a,gastosTotales:(i+m+d)/a,intereses:l/a}}function ka(t,e){return t.reduce((a,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function jn(t,e,a,o){const n=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=a),s=n.reduce((l,m)=>{if((m.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return l;const u=X(m).totalIntereses,v=X({...m,amortizaciones:(m.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return l+Math.max(0,v-u)},0),i=n.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:X(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=e&&l.fechaFin<=a),r=n.map(l=>X(l).tabla),c=l=>{const{desde:m,hasta:d}=Oa(l);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=m&&b.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:ka(n,e),deudaFin:ka(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(e.slice(0,7)),cuotasFin:c(a.slice(0,7)),finEnPeriodo:i}}function qn(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:yt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Ba(t,e=new Set,a="desglosado"){if(e.size===0)return Ta(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(l=>e.has(l)),r=s.filter(l=>!e.has(l)),c=a==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(n.cuantia))}return o}function Rn(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Ba(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Nn(t,e){const a=e.reduce((o,n)=>o+vt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:yt(t.filter(o=>o.tipo==="gasto")),totalIngresos:yt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Ln(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function On(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function kn(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Bn(t,e){if(t.length===0)return[];const a=l=>e==="mes"?l.slice(0,7):l.slice(0,4),o=l=>e==="mes"?`${l}-01`:`${l}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const l of t){const m=a(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==m)&&(c&&(i=c.cierre),c={periodo:m,inicio:o(m),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const Hn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Bn,cuentasVisibles:Ln,gastoPorTagOrdenado:Rn,idsHipoteca:On,idsPrestamosIniciados:kn,interesesPorCuenta:qn,mesesDelPeriodo:Fn,metricasFlujo:zn,rangoMes:Oa,rangoMesDe:La,resumenPrestamosPeriodo:jn,sinTransferencias:Dn,sumarGastosPorTag:Ba,totalesPeriodo:Nn},Symbol.toStringTag,{value:"Module"}));function Gn(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function Pt(t,e){return a=>Gn(t,e,a)}const Wt=10,Ha=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ga=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ze(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Va="default";function Ua(){return{_id:Va,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Ya(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ha,tramosGananciasCapital:Ga,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Wa(t,e){return{loans:[],expenses:[],accounts:[ze(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Ua()],config:Ya(t,e)}}const dt=t=>Array.isArray(t)?t:[],Vn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Kt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Ka(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function je(t){const{varianza:e,inflacion:a,...o}=t;return o}function Un(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Vn(t.config),r={...Ya(a,o)};for(const[m,d]of Object.entries(s))d!=null&&(r[m]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ha),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Ga),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(m=>{const d={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...m};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Kt(d)});c.length===0&&(c=[ze(a)]);const l=c.filter(m=>m.esCuentaPrincipal);if(l.length===0){const m=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===m._id}))}else if(l.length>1){let m=!1;c=c.map(d=>d.esCuentaPrincipal?m?{...d,esCuentaPrincipal:!1}:(m=!0,d):d)}return n.accounts=c,n.expenses=dt(t.expenses).map(m=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Ka(d.diaPago),je(Kt(d))}),n.loans=dt(t.loans).map(m=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...m};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Ka(d.diaPago),d.amortizaciones=dt(d.amortizaciones).map(u=>Kt(u)),je(Kt(d))}),n.nominas=dt(t.nominas).map(m=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),je(Kt(d))}),n.goals=dt(t.goals).map((m,d)=>{const u=Array.isArray(m.cuentaIds)?m.cuentaIds:m.cuentaId?[m.cuentaId]:[],{cuentaId:v,...g}=m;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:m,...d})=>d),n}const Ft=t=>Array.isArray(t)?t:[];let qe=0;function Yn(t){return qe+=1,`${t}_${qe.toString(36)}`}const Wn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Kn=t=>typeof t=="number"&&Number.isFinite(t);function Jn(t,e){const a={...t};qe=0;const o=Ft(t.transacciones),n=Ft(t.puntosControl),s=[...n],i=new Set(n.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,m,d,u)=>{if(!Wn(m)||!Kn(d))return;const v=`${l}|${m}`;i.has(v)||(i.add(v),s.push({_id:Yn("pc"),fecha:m,cuentaId:l,saldoCts:it(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of Ft(t.accounts)){const m=typeof l._id=="string"?l._id:null;if(m)for(const d of Ft(l.historicoSaldos))r(m,d.fecha,d.saldo,d.nota)}const c=Ft(t.history);if(c.length>0){const l=Ft(t.accounts),m=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(m==null?void 0:m._id)=="string"?m._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((l,m)=>String(l.fecha).localeCompare(String(m.fecha))),a}const Re=t=>Array.isArray(t)?t:[],Qn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ne=0;function Zn(){return Ne+=1,`tx_hp_${Ne.toString(36)}`}function ts(t,e){const a={...t};Ne=0;const o=[...Re(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Re(t.expenses).map(i=>{const r=Re(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",m=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!Qn(g.fecha)||!Xn(g.cuantia))continue;const b=m==="ingreso"?it(g.cuantia):-it(g.cuantia),x=`${c}|${g.fecha}|${b}`;n.has(x)||(n.add(x),o.push({_id:Zn(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:m,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const Ja=t=>Array.isArray(t)?t:[],$t=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Dt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,es=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function as(t,e){var m;const a={...t};if(Array.isArray(a.planes))return a;const o=Ja(a.goals),n=Ja(a.accounts),s=n.map(d=>{const u=Dt(d.bloqueoMeses,0);return{_id:`veh_${$t(d._id,"x")}`,nombre:$t(d.nombre,"Cuenta"),rentabilidadRealAnual:Dt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Dt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?it(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:$t(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Dt(d.interes,0)>0}}),i=new Map(n.map((d,u)=>[$t(d._id,""),s[u]._id])),r=((m=s[0])==null?void 0:m._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>$t(b,"")):[],g=es(d.targetDate);return{_id:$t(d._id,`obj_mig_${u}`),nombre:$t(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(Dt(d.targetAmount,0)),fechaLimite:g,prioridad:Dt(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:$t(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:e.hoyISO};return a.planes=[l],a}function os(t,e){const a={...t},o=Array.isArray(a.personas)?a.personas:[];return o.some(n=>(n==null?void 0:n._id)===Va)||(a.personas=[Ua(),...o]),a}const Jt=t=>Array.isArray(t)?t:[];function ce(t){const{escenarioIds:e,...a}=t;return Array.isArray(a.amortizaciones)&&(a.amortizaciones=a.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),a}function ns(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function ss(t,e){const a={...t};if(a.escenarios===void 0&&a.planes===void 0&&a.goals===void 0)return a;if(a.loans=Jt(a.loans).map(ce),a.expenses=Jt(a.expenses).map(ce),a.nominas=Jt(a.nominas).map(ce),a.accounts=Jt(a.accounts).map(ce),delete a.escenarios,a.config&&typeof a.config=="object"){const{escenarioActivo:n,...s}=a.config;a.config=s}delete a.goals;const o=Jt(a.planes).filter(ns);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),a._migracion010_planesArchivados=o),delete a.planes,a}const is=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Un},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Jn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ts},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:as},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:os},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:ss}],rs=["history"];function Qa(t,e,a){let o=t;const n=[];for(const s of[...is].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const xt="state_",le="state__schemaVersion",Tt="financeapp_",Le="state__modificadoEn";function Xa(t=localStorage,e=Tt){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==Le&&t.setItem(a(Le),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function cs(t=localStorage,e=Tt){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(xt)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function ls({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const ds={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function us(t,e){const a=ds[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function ps(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function ms({adapter:t,hoy:e=new Date}){const a=W(e),o=ps(e);let n=Wa(a,o);const s=new Set;let i=[];const r=ls();function c(A){for(const F of s)F(A)}function l(A){t.set(`${xt}${A}`,n[A])}function m(){const A={};for(const T of Object.keys(n)){const N=t.get(`${xt}${T}`);N!==null&&(A[T]=N)}for(const T of rs){const N=t.get(`${xt}${T}`);N!==null&&(A[T]=N)}const F=t.get(le),{state:z,applied:D}=Qa(A,F,{hoyISO:a,finISO:o});if(n=z,d(),D.length>0){for(const T of Object.keys(n))l(T);t.set(le,Wt)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[ze(a)],l("accounts");return}const A=n.accounts.filter(F=>F.esCuentaPrincipal);if(A.length===0)n.accounts=n.accounts.map((F,z)=>z===0?{...F,esCuentaPrincipal:!0}:F),l("accounts");else if(A.length>1){let F=!1;n.accounts=n.accounts.map(z=>z.esCuentaPrincipal?F?{...z,esCuentaPrincipal:!1}:(F=!0,z):z),l("accounts")}}function u(A){return n[A]}function v(A,F){n[A]=F,l(A),c(A)}function g(A){v("config",{...n.config,...A})}function b(A){return s.add(A),()=>s.delete(A)}function x(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(A,F){const z=[...n[A]],D={...F,_id:x()};return z.push(D),v(A,z),D}function h(A,F,z){const D=n[A].map(T=>T._id===F?{...T,...z}:T);v(A,D)}function S(A,F){const z=n[A],D=z.findIndex(T=>T._id===F);D<0||(r.registrar({col:A,item:z[D],indice:D}),v(A,z.filter((T,N)=>N!==D)))}function C(){const A=r.tomar();if(!A)return null;const F=[...n[A.col]];return F.splice(Math.min(A.indice,F.length),0,A.item),v(A.col,F),A}function w(){return r.pendiente()}function $(){const A=n.accounts||[],F=A.find(z=>z.esCuentaPrincipal&&z.activo)||A.find(z=>z.activo);return F?F._id:"default"}function M(A){var F;return((F=n.accounts.find(z=>z._id===A))==null?void 0:F.nombre)??A}function _(){return Pt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function I(){return Pt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function y(){return structuredClone(n)}function E(A,F=null){const{state:z,applied:D}=Qa(A,F,{hoyISO:a,finISO:o});n=z,d();for(const T of Object.keys(n))l(T);t.set(le,Wt);for(const T of Object.keys(n))c(T);return{applied:D}}return{load:m,get:u,set:v,patchConfig:g,subscribe:b,addItem:f,updateItem:h,removeItem:S,deshacerBorrado:C,borradoPendiente:w,getPrincipalAccountId:$,accountName:M,resolverTramosIRPF:_,resolverTramosGanancias:I,snapshot:y,replaceAll:E,get schemaVersion(){return Wt},get migrationsApplied(){return[...i]},get today(){return a||K()}}}function fs(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const St=Object.keys(Wa("1970-01-01","1970-01-01"));function Za(t){const e={};for(const a of St){const o=t.get(`${xt}${a}`);o!=null&&(e[a]=o)}return e}function gs(t,e){const a=[];for(const o of St){const n=e[o];n!=null&&(t(`${xt}${o}`,n),a.push(o))}return a}function vs(t){return St.filter(e=>t[e]===void 0||t[e]===null)}function bs(t){var i;const e=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!St.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>e(r).length===0))return!1;const o=e("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?e("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const to=`${Tt}meta_proyectos`,eo=`${Tt}meta_proyectoActivo`,At="default",hs="Mis finanzas";function Oe(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Qt(t){return t===At?Tt:`${Tt}p_${t}_`}function ao(){return[...St.map(t=>`${xt}${t}`),le,Le]}function ys(t=localStorage){function e(){try{const d=t.getItem(to);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function a(d){t.setItem(to,JSON.stringify(d))}function o(){const d=e();if(d.some(g=>g._id===At))return d;const u=Date.now(),v=[{_id:At,nombre:hs,creadoEn:u,actualizadoEn:u},...d];return a(v),v}function n(){try{const d=t.getItem(eo);if(!d)return At;const u=JSON.parse(d);return typeof u=="string"&&u?u:At}catch{return At}}function s(d){t.setItem(eo,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:Oe(),nombre:u,creadoEn:v,actualizadoEn:v};return a([...o(),g]),g}function r(d,u){const v=u.trim();v&&a(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=Qt(d),b={_id:Oe(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},x=Qt(b._id);for(const f of ao()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${x}${f}`,h)}return a([...o(),b]),b}function l(d){if(d===At)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=Qt(d);for(const g of ao())t.removeItem(`${v}${g}`);a(u.filter(g=>g._id!==d))}function m(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return a(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:m}}function $s(t,e,a){const o=Xa(t,Qt(e)),n={};for(const s of a){const i=o.get(`${xt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function xs(t){const e=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!e.has(i)&&e.set(i,Oe())}function a(n){if(typeof n=="string")return e.get(n)??n;if(Array.isArray(n))return n.map(a);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=a(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(a);return o}const at={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},wt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:at.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:at.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:at.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:at.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:at.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:at.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:at.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:at.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:at.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:at.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:at.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:at.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:at.datos,porDefecto:!1,dependencias:["sync-nube"]}],ws=new Map(wt.map(t=>[t.id,t]));function Xt(t){return ws.get(t)}function oo(t){return wt.filter(e=>(e.dependencias||[]).includes(t))}function ke(){const t={};for(const e of wt)t[e.id]=e.porDefecto;return t}function no(){const t=[],e=new Map;for(const a of wt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function Is(t){function e(){return{...ke(),...t.get("config").features||{}}}function a(d){t.patchConfig({features:d})}function o(d,u=e(),v=new Set){const g=Xt(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(d,u=e()){const v=Xt(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function s(d,u){var S;const v=Xt(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),b=new Map(wt.map(C=>[C.id,o(C.id,g)])),x={...g,[d]:u};let f;if(u){const C=[...v.dependencias||[]];for(;C.length;){const w=C.pop();x[w]===!1&&(x[w]=!0,f="dependencias-activadas"),C.push(...((S=Xt(w))==null?void 0:S.dependencias)||[])}}else{const C=oo(d).map(w=>w.id);for(;C.length;){const w=C.pop();x[w]!==!1&&(x[w]=!1,f="cascada-apagado"),C.push(...oo(w).map($=>$.id))}}return a(x),{cambiadas:wt.filter(C=>o(C.id,x)!==b.get(C.id)).map(C=>C.id),motivo:f}}function i(){const d=e();return wt.map(u=>{const v=n(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=e();return no().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=n(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){a(ke())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:e()}}function m(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=ke(),b=[],x=[];for(const[f,h]of Object.entries(v)){if(!Xt(f)){x.push(f);continue}if(typeof h!="boolean"){x.push(f);continue}g[f]=h,b.push(f)}return a(g),{aplicadas:b,ignoradas:x}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:m,bloqueadaPor:d=>n(d)}}const Zt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function zt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Cs(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Zt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Zt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Zt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Zt(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function Ss(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Zt(o)}</div>
        ${n.map(Cs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function As(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ms(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Ss(a)}`,n(i)}function n(i){var c,l,m;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=a.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&zt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&zt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=a.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=e.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(v),zt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:b}=a.importProfile(JSON.parse(await d.text()));zt(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){zt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(m=i.querySelector('[data-feature-action="reset"]'))==null||m.addEventListener("click",()=>{var d;a.reset(),zt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=As(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Es={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function so(t){return Es[t]??t}function mt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function io(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function _s(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Ps(){var e,a,o,n;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function Fs(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Ds(t,e){const a=t._id===e,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${ut(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${ut(t.nombre)}
        </div>
        ${a?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${a?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${ut(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${ut(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${ut(t._id)}">Duplicar</button>
        ${o||a?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${ut(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ts(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=a.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(so(i))}
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
    </div>`}function zs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function js(t){const e=t.document??document,{proyectos:a}=t;function o(){const r=a.listar(),c=a.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Ds(l,c)).join("")}
      </div>
      ${zs()}
      ${Ts(r,c,a.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(m=>{m.addEventListener("click",()=>{const d=m.dataset.proyectoId,u=m.dataset.proyectoAccion,v=a.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!io(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;a.cambiarA(d),_s(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;a.renombrar(d,g.trim()),mt(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const x=a.duplicar(d,b.trim()||g);mt(t,`"${x.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!io(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(d),mt(t,`"${v.nombre}" eliminado`),n(r)}catch(g){mt(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const m=r.querySelector("#proyecto-nuevo-nombre"),d=m==null?void 0:m.value.trim();if(!d){mt(t,"Ponle un nombre al proyecto","warn");return}const u=a.crear(d);mt(t,`"${u.nombre}" creado ✓`),n(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const m=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!m)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){mt(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=a.importarDesde(m,d);if(u.length===0){mt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}mt(t,`Importado: ${u.map(so).join(", ")} ✓`),Ps(),n(r)})}function i(){const r=Fs(e);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const de=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Mt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function jt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function qs(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Rs(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Ns(t){const e=t.color||de[0];return`
    <div class="dm-section" data-persona-fila="${Mt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Mt(e)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Mt(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${Mt(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${Mt(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${Mt(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${Mt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ls(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${de.map((t,e)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${e===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${de[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Os(t){const e=t.document??document,{store:a}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${a.get("personas").map(Ns).join("")}
      </div>
      ${Ls()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var m;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=a.get("personas"),b=g.find(x=>x._id===u);if(b){if(v==="renombrar"){const x=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!x||!x.trim())return;a.updateItem("personas",u,{nombre:x.trim()}),jt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){a.set("personas",g.map(x=>({...x,esPorDefecto:x._id===u}))),jt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){a.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(g.length<=1){jt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!qs(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;a.removeItem("personas",u),jt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(m=c.querySelector("#persona-nuevo-btn"))==null||m.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){jt(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||de[0],g=a.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});jt(t,`"${g.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Rs(e);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const ro={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function co(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function ks({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,m])=>[m,l]);for(const[l,m]of[...Object.entries(ro),...c]){const d=t.isEnabled(l),u=e.querySelector(`.nav-btn[data-view="${m}"]`);u&&(u.style.display=d?"":"none"),!d&&n()===m&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(l=>{const m=[...l.querySelectorAll(".nav-btn[data-view]")];if(m.length===0)return;const d=m.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),co(e,l=>t.isEnabled(l)),r){const l=a??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{co(e,m=>t.isEnabled(m))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:s,observar:i,vistaPara:r=>ro[r]}}const Bs="toast toast-deshacer";function Hs(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function l(d){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=Bs,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${us(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const x=e.deshacerBorrado();if(c(),!x)return;const f=n();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}a==null||a()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const m=e.subscribe(()=>{const d=e.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{m(),c()}}function ue(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function lo(t,e){const a=ue(t),o=ue(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const te=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Gs(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[te(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:te(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:te(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${te(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,te(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return e}function Vs(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=ue(e);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of Gs(t)){if(!i(c.ruta))continue;const l=lo(c.titulo,s),m=l>=0?-1:Math.min(lo(c.extra??"",s),2);if(l<0&&m<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,ue(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const Us="buscador-overlay",uo="btn-buscador";function Ys(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const C=e.createElement("div");C.id=Us,C.className="modal-overlay",C.style.alignItems="flex-start",C.style.paddingTop="10vh";const w=e.createElement("div");w.className="modal-box",w.style.maxWidth="560px",w.style.padding="14px";const $=e.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const M=e.createElement("div");return M.style.marginTop="10px",M.style.maxHeight="52vh",M.style.overflowY="auto",w.appendChild($),w.appendChild(M),C.appendChild(w),e.body.appendChild(C),C.addEventListener("click",_=>{_.target===C&&b()}),$.addEventListener("input",()=>{r=0,m()}),$.addEventListener("keydown",v),o=C,n=$,s=M,C}function l(){if(s){if(s.textContent="",i.length===0){const C=e.createElement("div");C.style.padding="14px 4px",C.style.fontSize="13px",C.style.color="var(--text3)";const w=(n==null?void 0:n.value.trim())??"";C.textContent=w.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(C);return}i.forEach((C,w)=>{const $=e.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(w),w===r&&$.classList.add("activa");const M=e.createElement("div");M.style.minWidth="0";const _=e.createElement("div");_.textContent=C.titulo,_.style.fontSize="13px",_.style.overflow="hidden",_.style.textOverflow="ellipsis",_.style.whiteSpace="nowrap";const I=e.createElement("div");I.textContent=C.detalle,I.style.fontSize="11px",I.style.color="var(--text3)",I.style.overflow="hidden",I.style.textOverflow="ellipsis",I.style.whiteSpace="nowrap",M.appendChild(_),C.detalle&&M.appendChild(I);const y=e.createElement("span");y.className="tag",y.textContent=C.etiqueta,y.style.flexShrink="0",$.appendChild(M),$.appendChild(y),$.addEventListener("click",()=>u(w)),s.appendChild($)})}}function m(){const C=(n==null?void 0:n.value)??"";i=Vs(t.estado(),C,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(C){var w,$;i.length!==0&&(r=(r+C+i.length)%i.length,l(),($=(w=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:w.scrollIntoView)==null||$.call(w,{block:"nearest"}))}function u(C){const w=i[C];w&&(b(),t.navegar(w.ruta))}function v(C){C.key==="Escape"?(C.preventDefault(),b()):C.key==="ArrowDown"?(C.preventDefault(),d(1)):C.key==="ArrowUp"?(C.preventDefault(),d(-1)):C.key==="Enter"&&(C.preventDefault(),u(r))}function g(){const C=o??c();C.classList.remove("hidden"),C.style.display="",r=0,n&&(n.value="",n.focus()),m()}function b(){o&&(o.style.display="none",i=[])}function x(){return!!o&&o.style.display!=="none"}function f(C){(C.ctrlKey||C.metaKey)&&(C.key==="k"||C.key==="K")&&(C.preventDefault(),x()?b():g())}e.addEventListener("keydown",f);let h=null;function S(){const C=e.getElementById("period-bar");if(!C||e.getElementById(uo))return;const w=e.createElement("button");w.id=uo,w.type="button",w.className="btn-secondary",w.title="Buscar en toda la aplicación (Ctrl+K)",w.setAttribute("aria-label","Buscar"),w.textContent="🔍 Buscar",w.style.marginLeft="auto",w.addEventListener("click",g),C.appendChild(w),h=w}return S(),()=>{e.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Be="aviso-guardado";function Ws(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=e.getElementById(Be))==null||g.remove()}function m(){if(s==="oculto")return l();const g=a();if(!g)return;let b=e.getElementById(Be);b||(b=e.createElement("div"),b.id=Be,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const x=e.createElement("span");if(x.style.flex="1",b.appendChild(x),s==="pendiente")x.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",m()}));else if(s==="subiendo"){x.textContent="Subiendo…";const f=e.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else s==="guardado"?x.textContent="¡Guardado!":s==="error"&&(x.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,b,x){const f=e.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",x),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return s="subiendo",m(),c=(async()=>{try{await t.guardar(),n.alDia(g),s="guardado",m(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),m()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",m()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",m()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,detener(){v(),l()}}}function Ks({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(g){return`view-${g}`}function s(g){const b=t.getElementById(n(g.route));if(b)return b;const x=t.querySelector(".view-container");if(!x)return null;const f=t.createElement("div");return f.id=n(g.route),f.className="view hidden",x.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),x=b[g.seccion??Math.max(0,b.length-1)];if(!x)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,x.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){a.set(g.route,g),s(g),i(g)}function c(){return[...a.keys()].filter(g=>{const b=a.get(g);return!e||e(b.flagId??b.id)})}function l(g){return c().includes(g)}function m(g){const b=a.get(g);if(!b||e&&!e(b.flagId??b.id))return!1;const x=s(b);if(!x)return!1;if(o&&o!==g){const f=a.get(o),h=t.getElementById(n(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount(x),o=g,!0}function d(){o&&m(o)}function u(){const g={};for(const[b,x]of a)g[b]=x.flagId??x.id;return g}function v(){for(const g of a.values())s(g),i(g)}return{register:r,routes:c,has:l,mount:m,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function p(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function It(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${p(P(t))}</span>`}function Js(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function po(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${p(e)}</span>`).join(" ")}const Qs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function pe(t){const[e,a]=t.split("-").map(Number);return`${Qs[a-1]} ${e}`}function R(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function ot(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function j(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function U(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ct(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function mo(t,e){const a=parseFloat(ct(t,e));return Number.isFinite(a)?a:0}const Xs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function He(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Zs(t){const{store:e}=t,a=t.hoy??K,o=()=>O(a()),n=()=>e.get("config").margenesSeguridad??[];function s(v){var g;e.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=n().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),x=b.find(f=>f._id===v);x&&(g(x),s(b))}function r(v){const g=e.get("config"),b=Te(v,e.get("expenses"),g,e.get("loans"),a(),!1,o());return P(b)}function c(v,g,b){const x=g.tipo==="fijo",f=x?"":`<span class="text-sm" style="color:var(--text3)">${p(P((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${p(g._id)}" data-margen="${p(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${p(g.fecha)}" data-campo="fecha"/>
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
      </tr>`}function l(v,g,b){const x=v.cuentas&&v.cuentas.length>0?v.cuentas.map(C=>{var w;return((w=g.find($=>$._id===C))==null?void 0:w.nombre)??C}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((C,w)=>C.fecha.localeCompare(w.fecha)).map(C=>c(v,C,b)).join(""),S=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${p(x)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${p(r(v))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${p(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${p(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${p(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${p(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${p(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${S}
      </div>`}function m(v,g){const b=g?n().find(S=>S._id===g):null,x=e.get("accounts").filter(S=>S.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=x.map(S=>`
        <label class="tag" data-chip="${p(S._id)}" style="cursor:pointer;${f.has(S._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${p(S._id)}" ${f.has(S._id)?"checked":""} style="display:none"/>
          ${p(S.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${p((b==null?void 0:b.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
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
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${p(K())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${p(g??"")}">Guardar</button>
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");!b||!x||(m(x,v),b.classList.remove("hidden"),U(x,".mg-acc-chip",f=>{const h=f,S=x.querySelector(`[data-chip="${h.value}"]`);S&&(S.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(x,"#mg-p-tipo",f=>{const h=f.value==="fijo",S=x.querySelector("#mg-p-importe-wrap"),C=x.querySelector("#mg-p-meses-wrap");S&&(S.style.display=h?"":"none"),C&&(C.style.display=h?"none":"")}),j(x,"[data-cerrar-form]",()=>b.classList.add("hidden")),j(x,"[data-guardar-margen]",f=>{var $,M,_,I,y;const h=f.getAttribute("data-guardar-margen")||"",S=(($=x.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!S)return R("El nombre es obligatorio","err");const C=[...x.querySelectorAll(".mg-acc-chip:checked")].map(E=>E.value),w=n().map(E=>({...E}));if(h){const E=w.findIndex(A=>A._id===h);if(E===-1)return R("Margen no encontrado","err");w[E]={...w[E],nombre:S,cuentas:C}}else{const E=((M=x.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",A={_id:He(),fecha:((_=x.querySelector("#mg-p-fecha"))==null?void 0:_.value)||K(),tipo:E,importe:parseFloat(((I=x.querySelector("#mg-p-importe"))==null?void 0:I.value)??"0")||0,meses:parseFloat(((y=x.querySelector("#mg-p-meses"))==null?void 0:y.value)??"1")||1};w.push({_id:He(),nombre:S,activo:!0,cuentas:C,puntos:[A]})}s(w),R(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=n(),b=e.get("accounts"),x=Yt(e.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(h=>l(h,b,x)).join("")}`;const f=()=>u(v);j(v,"[data-nuevo-margen]",()=>d(null,f)),j(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),f)),j(v,"[data-borrar-margen]",h=>{ot("¿Eliminar este margen de seguridad?")&&(s(n().filter(S=>S._id!==h.getAttribute("data-borrar-margen"))),R("Margen eliminado"),f())}),U(v,"[data-toggle-margen]",h=>{const S=h.getAttribute("data-toggle-margen");i(S,C=>{C.activo=h.checked}),f()}),j(v,"[data-add-punto]",h=>{const S=h.getAttribute("data-add-punto");i(S,C=>{C.puntos=[...C.puntos??[],{_id:He(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),f()}),j(v,"[data-borrar-punto]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=S.dataset.margen,w=S.dataset.punto;i(C,$=>{$.puntos=($.puntos??[]).filter(M=>M._id!==w)}),f()}),U(v,"[data-campo]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=h.getAttribute("data-campo"),w=h.value;i(S.dataset.margen,$=>{const M=($.puntos??[]).find(_=>_._id===S.dataset.punto);M&&(C==="fecha"?M.fecha=w:C==="tipo"?M.tipo=w:C==="importe"?M.importe=parseFloat(w)||0:M.meses=parseFloat(w)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Xs,mount:u}}const ti=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],ei=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],ai=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function oi(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ge=(t,e)=>t.map(([a,o])=>`<option value="${p(a)}"${a===e?" selected":""}>${p(o)}</option>`).join("");function fo(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=oi(t),i=Ge(ti.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${p(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ge(ei,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ge(ai,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function go(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function vo(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const ni={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function si(t,e){const a=new Set(((e==null?void 0:e.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||a.has(o._id))}function qt(t,e,a,o){if(a.filter(c=>c.activo).length<2)return"";const n=(e==null?void 0:e.modo)??"",s=new Map(((e==null?void 0:e.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const l=s.has(c._id),m=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${p(o)}" value="${p(c._id)}"${l?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${p(o)}" data-persona="${p(c._id)}"
             value="${m??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${p(o)}">
    <label class="form-label">${p(t)}</label>
    <select class="form-select" data-reparto-modo="${p(o)}">
      <option value=""${n?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${n==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${n==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${n==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${p(o)}" style="margin-top:6px;${n?"":"display:none"}">
      ${si(a,e).map(r).join("")}
    </div>
  </div>`}function Rt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"",n=a.querySelector(`[data-reparto-participantes="${e}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";a.querySelectorAll(`[data-reparto-valor="${e}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Nt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...a.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,l=a.querySelector(`[data-reparto-valor="${e}"][data-persona="${c}"]`),m=l?parseFloat(l.value):NaN;return Number.isFinite(m)?{personaId:c,valor:m}:{personaId:c}});return{modo:o,participantes:s}}function bo(t,e){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=e.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${ni[t.modo]})`}function Ve(t,e,a){const o=bo(t,a),n=bo(e,a);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const ii="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",ri=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function ci(t){const e=t.hoy??K,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var h;return((h=n().find(S=>S._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=e();let h=[...t.store.get("expenses")];if(a.mostrarExpirados||(h=h.filter(S=>!S.fechaFin||S.fechaFin>=f)),a.tipo&&(h=h.filter(S=>S.tipo===a.tipo)),a.cuenta&&(h=h.filter(S=>(S.cuenta||"default")===a.cuenta)),a.desde&&(h=h.filter(S=>(S.fechaInicio??"")>=a.desde)),a.hasta&&(h=h.filter(S=>(S.fechaInicio??"")<=a.hasta)),a.busqueda){const S=a.busqueda.toLowerCase();h=h.filter(C=>C.concepto.toLowerCase().includes(S))}return a.tags.size>0&&(h=h.filter(S=>(S.tags||[]).some(C=>a.tags.has(C)))),h.sort((S,C)=>{const w=S[a.orden]??"",$=C[a.orden]??"";return typeof w=="number"&&typeof $=="number"?(w-$)*a.sentido:String(w).localeCompare(String($))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const S=a.orden===f?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${p(h)} <span class="sort-arrow">${S}</span></span>`}function l(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(C=>C.activo!==!1).map(C=>`<option value="${p(C._id)}"${C._id===f?" selected":""}>${p(C.nombre)}</option>`).join("")}function m(f){const h=f.tipo==="transferencia",S=Ve(f.repartoConsumo,f.repartoPago,t.store.get("personas")),C=Ce(f.diaPago??""),w=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${C?` · ${C}`:""}`,$=!!f.fechaFin&&f.fechaFin<e(),M=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',_=h?`${p(s(f.cuenta))} → ${p(s(f.cuentaDestino))}`:p(s(f.cuenta)),I=(f.tags||[]).map(y=>`<span class="tag${a.tags.has(y)?" active":""}" data-tag="${p(y)}" title="Filtrar por ${p(y)}">${p(y)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(f.concepto)}</div>
        <div class="tag-list mt-4">${I}</div>
      </div>
      <div>${M}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${p(P(f.cuantia))}</div>
      <div class="text-sm">${p(w)}</div>
      <div class="text-sm exp-col-hide">${_}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${p(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${p(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${S?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(S)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${p(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${p(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${p(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const h=i(),S=r();f.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${p(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${p(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${p(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${S.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${S.map(C=>`<span class="tag${a.tags.has(C)?" active":""}" data-tag="${p(C)}">${p(C)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(m).join("")}
      </div>`}function u(f){const h=(f==null?void 0:f.tipo)==="transferencia",S=t.store.get("personas"),C=(w,$,M,_,I="")=>`<div class="form-group"><label class="form-label">${p($)}</label>
       <input class="form-input" type="${M}" id="${w}" value="${p(_)}" placeholder="${p(I)}"/></div>`;return`
      <div class="grid-2">
        ${C("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${C("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${C("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${ri.map(([w,$])=>`<option value="${w}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===w?" selected":""}>${p($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${C("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${C("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${fo(f==null?void 0:f.diaPago,"exp")}</div>
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
              <input class="form-input" type="text" id="ef-tags" value="${p(((f==null?void 0:f.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
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
          ${h?"":`${qt("Reparto de consumo",f==null?void 0:f.repartoConsumo,S,"consumo")}
                 ${qt("Reparto de pago",f==null?void 0:f.repartoPago,S,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${p((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var C;const h=((C=f.querySelector("#ef-tipo"))==null?void 0:C.value)??"gasto",S=(w,$)=>{const M=f.querySelector(w);M&&(M.style.display=$?"":"none")};S("#ef-destino-wrap",h==="transferencia"),S("#ef-basico-wrap",h!=="transferencia"),S("#ef-irpf-wrap",h==="ingreso"),S("#ef-clasificacion-wrap",h==="gasto")}function g(f,h,S){const C=document.getElementById("modal-overlay"),w=document.getElementById("modal-content");!C||!w||(w.innerHTML=`<div class="modal-title">${p(h)}</div>${u(f)}`,C.classList.remove("hidden"),U(w,"#ef-tipo",()=>v(w)),U(w,"[data-dp-modo]",()=>go(w)),U(w,'[data-reparto-modo="consumo"]',()=>Rt(w,"consumo")),U(w,'[data-reparto-modo="pago"]',()=>Rt(w,"pago")),j(w,"[data-cancelar]",()=>C.classList.add("hidden")),j(w,"[data-guardar]",$=>{b(w,$.getAttribute("data-guardar")||"")&&(C.classList.add("hidden"),S())}))}function b(f,h){const S=E=>{var A;return((A=f.querySelector(E))==null?void 0:A.value)??""},C=E=>{var A;return!!((A=f.querySelector(E))!=null&&A.checked)},w=S("#ef-tipo")||"gasto",$=w==="transferencia",M=S("#ef-concepto").trim(),_=parseFloat(S("#ef-cuantia"));if(!M||!Number.isFinite(_))return R("Concepto y cuantía obligatorios","err"),!1;const I=S("#ef-clasificacion"),y={concepto:M,tipo:w,cuantia:_,frecuencia:parseInt(S("#ef-frecuencia"),10)||1,tipoFrecuencia:S("#ef-tipo-frec")||"mensual",fechaInicio:S("#ef-fecha-ini"),fechaFin:S("#ef-fecha-fin")||null,diaPago:vo(f),cuenta:S("#ef-cuenta"),cuentaDestino:$?S("#ef-cuenta-dest")||"default":void 0,activo:C("#ef-activo"),basico:!$&&C("#ef-basico"),sujetoIRPF:!$&&C("#ef-sujetoIRPF"),clasificacion:w==="gasto"?I||null:void 0,tags:$?["transferencia"]:S("#ef-tags").split(",").map(E=>E.trim()).filter(Boolean),repartoConsumo:$?void 0:Nt(f,"consumo"),repartoPago:$?void 0:Nt(f,"pago")};return h?(t.store.updateItem("expenses",h,y),R("Actualizado")):(t.store.addItem("expenses",y),R("Creado")),o(),!0}function x(f,h){const S=f.querySelector("[data-busqueda]");let C;S==null||S.addEventListener("input",()=>{clearTimeout(C),C=setTimeout(()=>{a.busqueda=S.value,h();const w=f.querySelector("[data-busqueda]");w==null||w.focus(),w==null||w.setSelectionRange(w.value.length,w.value.length)},250)}),U(f,"[data-expirados]",w=>{a.mostrarExpirados=w.checked,h()}),U(f,"[data-f-tipo]",w=>{a.tipo=w.value,h()}),U(f,"[data-f-cuenta]",w=>{a.cuenta=w.value,h()}),U(f,"[data-f-desde]",w=>{a.desde=w.value,h()}),U(f,"[data-f-hasta]",w=>{a.hasta=w.value,h()}),j(f,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,h()}),j(f,"[data-limpiar-tags]",()=>{a.tags=new Set,h()}),j(f,"[data-tag]",w=>{const $=w.getAttribute("data-tag");a.tags.has($)?a.tags.delete($):a.tags.add($),h()}),j(f,"[data-orden]",w=>{const $=w.getAttribute("data-orden");a.orden===$?a.sentido=a.sentido===1?-1:1:(a.orden=$,a.sentido=1),h()}),j(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),j(f,"[data-editar]",w=>{const $=t.store.get("expenses").find(M=>M._id===w.getAttribute("data-editar"));$&&g($,"Editar",h)}),j(f,"[data-duplicar]",w=>{const $=t.store.get("expenses").find(I=>I._id===w.getAttribute("data-duplicar"));if(!$)return;const{_id:M,..._}=$;g({..._,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",h)}),j(f,"[data-borrar]",w=>{ot("¿Eliminar?")&&(t.store.removeItem("expenses",w.getAttribute("data-borrar")),R("Eliminado"),o(),h())}),U(f,"[data-activo]",w=>{const $=w;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:ii,mount(f){const h=()=>d(f);d(f),f.dataset.wired!=="1"&&(x(f,h),f.dataset.wired="1")}}}function me(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=gt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function ho(t,e,a,o){return t.reduce((n,s)=>{const i=gt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function li(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:me(i.tabla,e,a)-me(r.tabla,e,a)}})}const Ue=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${p(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function di(t,e){const a=ba(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?ha(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?ya(t.tin||0,i):null,c=o&&n?li(t,e.periodos,e.hoy):[],l=c.length?me(a.sinAmort.tabla,e.periodos,e.hoy)-me(a.tabla,e.periodos,e.hoy):null,m=l===null?null:l-a.costeTotalAmort,d=s?ho(a.tabla,e.periodos,e.hoy,a.comAp):null,u=s&&o?ho(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${p(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${p(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Ve(t.repartoConsumo,t.repartoPago,e.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${p(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${p(t.tin)}%</span>
        <span class="text-sm">${p(P(a.cuota))}/mes</span>
        <span class="text-sm">${p(a.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${p(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${p(t._id)}">

      <div class="grid-4 mb-12">
        ${Ue("Cuota mensual",p(P(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${p(P(e.cuotaMes))}</div>`:"")}
        ${Ue("Total intereses",p(P(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(P(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${p(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ue("Total pagado",p(P(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${p(P(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${p(ma(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${p(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${p(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${p(P(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${p(P(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${p(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${p(Ce(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${p(t._id)}">+ Amortizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${l!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${p(P(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${p(P(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(P(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${p(P(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(m??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${p(P(m??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${p(P(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(P(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${p(P(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?ui(t,a.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>pi(v,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>mi(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function ui(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${p(P(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${p(P(a))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${p(P(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${p(P(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${p(P(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${p(P(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function pi(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=gt(a.periodos,a.hoy,t.fecha);o=p(P(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":p(t.mes)}</td>
    <td class="num">${p(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":p(P(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${p(P(t.interes))}</td>
    <td class="num">${p(P(t.amortizacion))}</td>
    <td class="num">${p(P(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function mi(t,e,a){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${p(e.fecha)}</span>
    <span class="num">${p(P(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${p(P(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${p(P(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${p(t)}|${p(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${p(t)}|${p(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,ee=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,ae=(t,e,a,o="")=>`<label class="form-label">${p(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${p(o)}</span>`:""}`,fi=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${p(a._id)}"${a._id===e?" selected":""}>${p(a.nombre)}</option>`).join("");function gi(t,e,a,o=K()){return`
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
            <select class="form-select" id="f-cuenta">${fi(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${fo(t==null?void 0:t.diaPago,"loan")}
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
          <input class="form-input" type="text" id="f-tags" value="${p(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${ae("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a,"consumo")}
        ${qt("Reparto de pago",t==null?void 0:t.repartoPago,a,"pago")}
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
      <button class="btn-primary" data-guardar-loan="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function vi(t,e,a=K()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??a)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${ee("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${ae("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${p(t)}|${p((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const bi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function hi(t){const e=t.hoy??K;let a=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const M=$.filter(I=>I.activo);if(M.length<2)return"";const _=(I,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":p(I)}"
               style="${n===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p(y)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${_(null,"Todas")}
      ${M.map(I=>_(I._id,I.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const M=X($).tabla.filter(_=>!_.esAmortizacion);return M.length===0?!0:M[M.length-1].fecha<e()}function c($,M){const _=e(),I=_.slice(0,7),y=new Map;let E=0;for(const A of $){if(!A.activo||A.simulacion||M.has(A._id)||(A.fechaInicio||"")>_)continue;const F=X(A).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(I)),z=F.length>0?F[0].cuota:0;y.set(A._id,z),E+=z}return{porLoan:y,total:E,activos:[...y.values()].filter(A=>A>0).length}}function l($){const M=e().slice(0,7),_=[];for(const I of $){if(!I.activo||I.simulacion)continue;const y=X(I).tabla.filter(A=>!A.esAmortizacion),E=y[y.length-1];E&&E.fecha.slice(0,7)===M&&_.push({loan:I,cuota:E.cuota})}return _}function m($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function d($){const M=t.store.get("config"),_=M.dashboardStart,I=M.dashboardEnd,y=Math.max(1,(O(I).getTime()-O(_).getTime())/(30.44*864e5));let E=0;for(const A of $)!A.activo||A.simulacion||(E+=X(A).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=_&&F.fecha<=I).reduce((F,z)=>F+z.cuota,0));return{media:E/y,desde:_,hasta:I}}function u($){const M=t.store.get("personas"),_=ie(M),I=[...t.store.get("loans")].sort((q,k)=>k.tin-q.tin),y=n?I.filter(q=>Me(q.repartoConsumo,q.repartoPago,_).has(n)):I,E=new Set(y.filter(r).map(q=>q._id)),A=a?y:y.filter(q=>!E.has(q._id)),F=c(I,new Set(I.filter(r).map(q=>q._id))),z=d(I),D=l(I),T=t.store.get("config"),N=t.store.get("inflacion"),H=new Date(O(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${E.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${E.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(M)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${p(m(D.map(q=>q.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${p(P(D.reduce((q,k)=>q+k.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${p(H)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${p(P(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${p(P(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${p(z.desde)} → ${p(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${A.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':A.map(q=>di(q,{periodos:N,usarInflacion:!!T.usarInflacion,hoy:e(),cuotaMes:F.porLoan.get(q._id)??0,completado:E.has(q._id),personas:M})).join("")}
      </div>`;for(const q of $.querySelectorAll("[data-body-loan]"))o.has(q.dataset.bodyLoan??"")&&q.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),b=()=>{var $;return($=v())==null?void 0:$.classList.add("hidden")};function x($,M){const _=v(),I=g();return!_||!I?null:(I.innerHTML=`<div class="modal-title">${p($)}</div>${M}`,_.classList.remove("hidden"),j(I,"[data-cancelar]",b),I)}function f($,M){const _=$?t.store.get("loans").find(y=>y._id===$)??null:null,I=x($?"Editar préstamo":"Nuevo préstamo",gi(_,t.store.get("accounts"),t.store.get("personas"),e()));I&&(I.addEventListener("change",y=>{const E=y.target;E!=null&&E.matches("[data-dp-modo]")&&go(I),E!=null&&E.matches('[data-reparto-modo="consumo"]')&&Rt(I,"consumo"),E!=null&&E.matches('[data-reparto-modo="pago"]')&&Rt(I,"pago")}),j(I,"[data-guardar-loan]",y=>{h(I,y.getAttribute("data-guardar-loan")||"")&&(b(),M())}))}function h($,M){const _=D=>{var T;return((T=$.querySelector(D))==null?void 0:T.value)??""},I=D=>{var T;return!!((T=$.querySelector(D))!=null&&T.checked)},y=_("#f-nombre").trim(),E=parseFloat(_("#f-capital")),A=parseFloat(_("#f-tin")),F=parseInt(_("#f-meses"),10);if(!y||!Number.isFinite(E)||!Number.isFinite(A)||!Number.isFinite(F))return R("Completa los campos obligatorios","err"),!1;const z={nombre:y,capital:E,tin:A,meses:F,fechaInicio:_("#f-fecha"),comisionApertura:parseFloat(_("#f-com-ap"))||0,comisionAmort:parseFloat(_("#f-com-am"))||0,diaPago:vo($),cuenta:_("#f-cuenta"),simulacion:I("#f-sim"),activo:I("#f-activo"),mostrarFechaFinEnDashboard:I("#f-mostrar-fin"),tipoTasa:_("#f-tipo-tasa"),basico:I("#f-basico"),tags:_("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Nt($,"consumo"),repartoPago:Nt($,"pago")};return M?(t.store.updateItem("loans",M,z),R("Préstamo actualizado")):(t.store.addItem("loans",{...z,amortizaciones:[]}),R("Préstamo creado")),s(),!0}function S($,M,_){const I=t.store.get("loans").find(A=>A._id===$);if(!I)return;const y=M?(I.amortizaciones||[]).find(A=>A._id===M)??null:null,E=x(M?"Editar amortización":"Añadir amortización",vi($,y,e()));E&&j(E,"[data-guardar-amort]",A=>{const[F,z]=(A.getAttribute("data-guardar-amort")||"").split("|");C(E,F,z)&&(b(),_([F]))})}function C($,M,_){var T;const I=N=>{var H;return((H=$.querySelector(N))==null?void 0:H.value)??""},y=I("#am-fecha"),E=parseFloat(I("#am-cant"));if(!y||!Number.isFinite(E)||E<=0)return R("Fecha y cantidad requeridas","err"),!1;const A=t.store.get("loans").find(N=>N._id===M);if(!A)return!1;const F={fecha:y,cantidad:E,tipo:I("#am-tipo"),simulacion:!!((T=$.querySelector("#am-sim"))!=null&&T.checked)},z=A.amortizaciones||[],D=_?z.map(N=>N._id===_?{...N,...F}:N):[...z,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",M,{amortizaciones:D}),R(_?"Amortización actualizada":"Amortización añadida"),s(),!0}function w($,M){j($,"[data-toggle-finalizados]",()=>{a=!a,M()}),j($,"[data-persona-tab]",_=>{n=_.getAttribute("data-persona-tab")||null,M()}),j($,"[data-nuevo-loan]",()=>f(null,M)),j($,"[data-toggle-loan]",(_,I)=>{var F;if((F=I.target)!=null&&F.closest("button"))return;const y=_.getAttribute("data-toggle-loan"),E=[...$.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===y);(E==null?void 0:E.classList.toggle("open"))?o.add(y):o.delete(y)}),j($,"[data-editar-loan]",_=>f(_.getAttribute("data-editar-loan"),M)),j($,"[data-borrar-loan]",_=>{if(!ot("¿Eliminar préstamo?"))return;const I=_.getAttribute("data-borrar-loan");t.store.removeItem("loans",I),o.delete(I),R("Eliminado"),s(),M()}),j($,"[data-amort-loan]",_=>{const I=_.getAttribute("data-amort-loan");o.add(I),S(I,null,M)}),j($,"[data-editar-amort]",_=>{const[I,y]=(_.getAttribute("data-editar-amort")||"").split("|");o.add(I),S(I,y,M)}),j($,"[data-borrar-amort]",_=>{const[I,y]=(_.getAttribute("data-borrar-amort")||"").split("|"),E=t.store.get("loans").find(A=>A._id===I);E&&(t.store.updateItem("loans",I,{amortizaciones:(E.amortizaciones||[]).filter(A=>A._id!==y)}),R("Amortización eliminada"),s(),M([I]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:bi,mount($){const M=(_=[])=>{for(const I of _)o.add(I);u($)};u($),$.dataset.wired!=="1"&&(w($,M),$.dataset.wired="1")}}}const Ye=6.35;function Lt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function yo(t){return Math.max(0,(t.bruto||0)-Lt(t))}function yi(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function $i(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Lt(r),0),o=Math.max(0,e-a),n=ht(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(yo(i)/o):0);return s}function $o(t,e,a){if(t.irpfModo==="manual")return yo(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return lt(ht(t.bruto||0,Lt(t)),a);const o=yi(e.filter(i=>i.irpfModo!=="manual")),n=$i(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,a)-lt(s,a);s+=r}return lt(ht(t.bruto||0,Lt(t)),a)}function xi(t,e){return t.reduce((a,o)=>a+$o(o,t,e),0)}function wi(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Ii(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Lt(s),0);return wi(ht(a,o),e)}function Ci(t,e,a){const o=t.bruto||0,n=Lt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Ye,c=s*(r/100),l=$o(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:s>0?l/s*100:0,netoPorPaga:(s-c-l)/i}}function Si(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Ai={transporte:125,restaurante:220,otros:null},Mi={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Ei=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Ot=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,_i=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${p(a._id)}"${a._id===e?" selected":""}>${p(a.nombre)}</option>`).join("");function Pi(t,e){const a=t.map((s,i)=>{const r=e.find(m=>m._id===s.cuenta),c=Ai[s.tipo],l=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${p(Mi[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${p(P(s.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${p(P(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?p(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(s=>`<option value="${p(s._id)}">${p(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Fi(t,e){const a=e.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Ot("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Ot("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${_i(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Ot("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Ot("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Ot("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Ei.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${p(s)} (${i+1})</option>`).join("")}
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
          ${Ot("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Ye).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${qt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e.personas,"consumo")}
        ${qt("Reparto de pago",t==null?void 0:t.repartoPago,e.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function xo(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(a(i));return Number.isFinite(c)?c:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Ye),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,retribucionFlexible:e,repartoConsumo:Nt(t,"consumo"),repartoPago:Nt(t,"pago")}}function Di(t,e,a,o){const n=xo(t,e),s=e.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(ht(n.bruto,s),a.tramos),l=i-r-c,m=i/n.nPagas,d=r/n.nPagas,u=c/n.nPagas,v=m-d-u,g=n.grupoNomina?a.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${p(n.grupoNomina)}" con ${p(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",x=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${p(P(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${p(P(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${p(P(n.bruto))}</span>
      ${x}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${p(P(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${p(P(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${p(P(l))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${p(P(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${p(P(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${p(P(v))}/paga`:`ingreso ${p(P(m))} − SS ${p(P(d))} − IRPF ${p(P(u))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function Ti(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Pi(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Di(t,e,a,o))},i=()=>{var c,l;const r=(m,d)=>{const u=t.querySelector(m);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Rt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Rt(t,"pago")),j(t,"[data-flex-anadir]",()=>{var l,m,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((m=t.querySelector("#fc-importe"))==null?void 0:m.value)??"")||0;if(!c)return R("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),j(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const wo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function zi(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??bt;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){e=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,x)=>b.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${p(wo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(wo(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tabla]",b=>{const x=b.getAttribute("data-editar-tabla");d(x==="default"?"default":Number(x))}),j(g,"[data-borrar-tabla]",b=>{const x=Number(b.getAttribute("data-borrar-tabla"));ot(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==x)),R(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const x=t.store.get("tramosIRPFHistorico");if(x.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...x,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function m(u){a=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const x=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat((x==null?void 0:x.value)??"")||0]})}function d(u){var h;e=u;const v=t.store.get("tramosIRPFHistorico");a=(u==="default"?i():((h=v.find(S=>S.año===u))==null?void 0:h.tramos)??i()).map(S=>[...S]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,x=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${p(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!x)return;const f=()=>{const S=x.querySelector("#irpf-tramos-rows");S&&(S.innerHTML=l())};j(x,"[data-volver]",c),j(x,"[data-tr-anadir]",()=>{m(x),a.push([0,0]),f()}),j(x,"[data-tr-borrar]",S=>{m(x),a.splice(Number(S.getAttribute("data-tr-borrar")),1),f()}),j(x,"[data-tr-guardar]",()=>{m(x);const S=[...a].sort((C,w)=>C[0]-w[0]);if(S.length===0)return R("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:S}),R("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(C=>C.año===e?{...C,tramos:S}:C)),R(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Io=1500,Et=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,ji=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,qi=t=>(t.modeloFondo||"cuenta")==="pension";function Ri(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Ni(n,e,a,o)).join("")}</div>`}function Ni(t,e,a,o){const n=_e(t);if(!n)return"";const s=Pe(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,m)=>l+m.cantidad,0),c=Math.min(r,Io)*(s/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${p(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${p(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${p(P(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(P(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${p(P(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(P(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(P(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${p(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Io?"neg":""}">${p(P(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${p(P(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${p(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${p(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Li(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(P(a.importe))} / ${p(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Oi(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Et("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Et("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Et("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Et("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Et("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${ji("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Et("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${Et("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${n.map(i=>`<option value="${p(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${p(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${p((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ki(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Li(e))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Bi(t,e,a,o){var x;const n=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},s=(f,h=0)=>{const S=parseFloat(n(f));return Number.isFinite(S)?S:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),l=n("#pen-grupo"),m={nombre:r,grupoNomina:l,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(a==null?void 0:a.historicoSaldos)??[]],u=[...(a==null?void 0:a.aportaciones)??[]],g=((x=[...d].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:x.saldo)??(a==null?void 0:a.saldo)??null,b=Date.now().toString(36);return a?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:m.fechaInicialSaldo??o,cantidad:c})),{datos:{...m,historicoSaldos:d,aportaciones:u}}}const Hi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Gi(t){const e=t.hoy??K,a=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const S=h.filter(w=>w.activo);if(S.length<2)return"";const C=(w,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":p(w)}"
               style="${o===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${C(null,"Todas")}
      ${S.map(w=>C(w._id,w.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Pt(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??bt)(Number(e().slice(0,4)))}function i(h,S,C){const w=Ci(h,S,C),$=!!S&&h.irpfModo!=="manual",M=Ve(h.repartoConsumo,h.repartoPago,t.store.get("personas")),_=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",w.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${p(P(w.flexAnual))}/año</span>`:"",Math.abs(w.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${w.ssPct.toFixed(2)}%</span>`:"",M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(M)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${_}</div>
      </div>
      <div class="num">${p(P(w.brutoAnual))}
        ${w.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${p(P(w.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${p(P(w.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${w.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${h.irpfModo==="manual"?`${p(h.irpfPct??0)}% (manual)`:`${w.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${p(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${p(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${p(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${p(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var S;return((S=t.store.get("accounts").find(C=>C._id===(h||"default")))==null?void 0:S.nombre)??(h||"default")};function c(h,S,C){const w=S.reduce((_,I)=>_+(I.bruto||0),0),$=xi(S,C),M=w>0?$/w*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${p(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${p(P(w))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${M.toFixed(1)}%</strong> (${p(P($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${S.map(_=>i(_,S,C)).join("")}
      </div>
    </div>`}function l(h){const S=s(),C=t.store.get("personas"),w=ie(C),$=[...t.store.get("nominas")].sort((A,F)=>(F.bruto||0)-(A.bruto||0)),M=o?$.filter(A=>Me(A.repartoConsumo,A.repartoPago,w).has(o)):$,{grupos:_,sueltas:I}=Si(M),y=t.store.get("accounts").filter(qi),E=$.filter(A=>A.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n(C)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${M.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[..._.entries()].map(([A,F])=>c(A,F,S)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(A=>i(A,null,S)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Ri(y,E,S,e())}</div>`}const m=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),u=()=>{var h;return(h=m())==null?void 0:h.classList.add("hidden")};function v(h,S){const C=m(),w=d();return!C||!w?null:(w.innerHTML=`<div class="modal-title">${p(h)}</div>${S}`,C.classList.remove("hidden"),j(w,"[data-cancelar]",u),w)}function g(h,S){const C=h?t.store.get("nominas").find(_=>_._id===h)??null:null,w=[...(C==null?void 0:C.retribucionFlexible)??[]].map(_=>({..._})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:e()},M=v(h?"Editar nómina":"Nueva nómina",Fi(C,$));M&&(Ti(M,w,$,h??""),j(M,"[data-guardar-nomina]",_=>{const I=xo(M,w);if(!I.nombre||I.bruto<=0)return R("Nombre y bruto anual son obligatorios","err");const y=_.getAttribute("data-guardar-nomina")||"",E={...I,activo:!0,tags:["nomina"]};y?(t.store.updateItem("nominas",y,E),R("Nómina actualizada")):(t.store.addItem("nominas",E),R("Nómina creada")),a(),u(),S()}))}function b(h,S){const C=h?t.store.get("accounts").find(M=>M._id===h)??null:null,w=[...(C==null?void 0:C.planAportaciones)??[]].map(M=>({...M})),$=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Oi(C,{nominas:t.store.get("nominas"),hoy:e()}));$&&(ki($,w,e()),j($,"[data-guardar-pension]",M=>{const{datos:_,error:I}=Bi($,w,C,e());if(I)return R(I,"err");const y=M.getAttribute("data-guardar-pension")||"";y?(t.store.updateItem("accounts",y,_),R("Plan actualizado")):(t.store.addItem("accounts",_),R("Plan creado")),a(),u(),S()}))}function x(h,S,C){j(h,"[data-persona-tab]",w=>{o=w.getAttribute("data-persona-tab")||null,S()}),j(h,"[data-nueva-nomina]",()=>g(null,S)),j(h,"[data-editar-nom]",w=>g(w.getAttribute("data-editar-nom"),S)),j(h,"[data-borrar-nom]",w=>{ot("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",w.getAttribute("data-borrar-nom")),R("Eliminada"),a(),S())}),U(h,"[data-activo-nom]",w=>{const $=w;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),a(),S()}),j(h,"[data-tramos]",()=>C.abrir()),j(h,"[data-nueva-pension]",()=>b(null,S)),j(h,"[data-editar-pension]",w=>b(w.getAttribute("data-editar-pension"),S)),j(h,"[data-borrar-pension]",w=>{ot("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",w.getAttribute("data-borrar-pension")),R("Plan eliminado"),a(),S())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Hi,mount(h){const S=()=>l(h);f??(f=zi({store:t.store,onDatosCambiados:()=>{a(),S()},año:()=>Number(e().slice(0,4))})),l(h),h.dataset.wired!=="1"&&(x(h,S,f),h.dataset.wired="1")}}}const Vi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Ui="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Co={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Yi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Wi(t,e){const a=t.filter(c=>c.activo&&rt(c)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of a){const l=re(c,e);l&&(o+=l.saldo,n+=l.costBase,s+=l.plusvalia,i+=l.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${p(P(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${p(P(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${p(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${p(P(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${p(P(i))}</div><div class="stat-sub">Neto: ${p(P(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Ki(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(O(o).getTime()-O(a).getTime())/(30.44*864e5)),s=Gt(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const c=s*(gt(e.inflacion,a,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${p(P(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${p(P(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${p(a.slice(0,7))} → ${p(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${p(P(i))}</span>
    </div>${r}
  </div>`}function Ji(t,e){const a=Co[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),s=n.reduce((v,g)=>v+g.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),m=Ii(l,e.tramosIRPF),d=c*m/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${m}%`:`tipo marginal ${m}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${p(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${p(P(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${p(P(i))}/año${r?` ⚠ excede límite ${p(P(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${p(P(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${p(u)}">≈ ${p(P(d))}/año <span style="font-size:10px;color:var(--text3)">(${p(m)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${p(v.nomina.nombre)}: ${p(P(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Qi(t){const e=_e(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(P(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(P(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${p(P(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${p(P(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${p(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${p(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function Xi(t,e){const a=re(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=O(o.dashboardStart),i=O(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=a.saldo+n.totalAportaciones-n.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,m=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=a.costBase+n.totalAportaciones,u=Math.max(0,m-d),v=Ee(u,e.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",x=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",f=(M,_,I)=>M.map(y=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${_} ${p(y.contraparte)}: ${p(y.concepto)}</span>
          <span class="num ${I}">${p(P(y.total))} · ${y.ocurrencias} mov.</span>
        </div>`).join(""),S=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${p(o.dashboardStart.slice(0,7))} → ${p(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${p(P(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${p(P(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${p(P(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',C=e.invModo(t._id),w=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=C==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(P(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${p(P(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${p(P(a.neto))}</div><div class="stat-sub">${p(x)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${p(P(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${p(P(m))}</div><div class="stat-sub">${p(b)} · ${p(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${p(P(m-v))}</div><div class="stat-sub">${p(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${p(t._id)}|real" style="${w(C==="real")}">Real</button>
          <button data-inv-modo="${p(t._id)}|proyeccion" style="${w(C==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${S}
    </div>`}function Zi(t,e){const a=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=a[0],n=vt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${p((Co[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${p(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${p(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${p(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Ui}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Vi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${p(P(t.saldoInicial||0))}</div><div class="stat-sub">${p(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${p(P(n))}</div>${o?`<div class="stat-sub">Registro: ${p(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${p(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${p(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ki(t,e)}
    ${s==="beneficio"?Ji(t,e):""}
    ${s==="pension"?Qi(t):""}
    ${s==="inversion"?Xi(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${p(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${p(t.descripcion)}</div>`:""}
  </div>`}const tr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function er(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(P(a.importe))} / ${p(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ar(t,e){const a=t?rt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ee("ac-modelo","Tipo",tr,a)}
    </div>
    <div class="grid-2 mt-8">
      ${tt("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${tt("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${tt("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${tt("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
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
            ${ee("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(s=>`<option value="${p(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${p(s)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${p((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function or(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=er(e))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function nr(t,e,a,o,n){const s=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const x=parseFloat(s(g));return Number.isFinite(x)?x:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=s("#ac-modelo")||"cuenta",m=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:e,tipoBeneficio:m?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:m?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?n:u.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:d,nota:a?"Actualización manual":"Saldo inicial"}}}function We(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:J(e.saldoCts),nota:e.nota,derivado:e.origen==="derivado"}))}function sr(t,e,a,o,n){const s=a.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${p(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${p(P(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':p(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${p(e)}|${p(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${p(e)}|${p(r._id)}">✕</button>
      </div>`).join(""),i=a.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${p(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${p(e)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos. Si el arranque de la cuenta es posterior al primer movimiento, lo retrasa hasta él para que no tape la curva.">↻ Recalcular semanal</button>
    </div>
    <div class="text-sm mt-4 mb-8" style="color:var(--text3)">
      ${i>0?`${i} de los puntos son semanales calculados del ledger; el resto los has registrado tú y mandan sobre el saldo.`:"Los puntos que registras aquí anclan el saldo. «Recalcular semanal» añade además un punto por semana con lo que dicen los movimientos."}
    </div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${p(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${p(e)}">Añadir</button>
    </div>`}const So=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function ir(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Vt;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){e=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,x)=>b.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${p(So(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(So(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tg]",b=>{const x=b.getAttribute("data-editar-tg");d(x==="default"?"default":Number(x))}),j(g,"[data-borrar-tg]",b=>{const x=Number(b.getAttribute("data-borrar-tg"));ot(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==x)),R(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const x=t.store.get("tramosGananciasCapitalHistorico");if(x.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...x,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function m(u){a=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(u){var f;e=u;const v=t.store.get("tramosGananciasCapitalHistorico");a=(u==="default"?i():((f=v.find(h=>h.año===u))==null?void 0:f.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const x=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};j(b,"[data-volver-tg]",c),j(b,"[data-tg-anadir]",()=>{m(b),a.push([0,0]),x()}),j(b,"[data-tg-borrar]",h=>{m(b),a.splice(Number(h.getAttribute("data-tg-borrar")),1),x()}),j(b,"[data-tg-guardar]",()=>{m(b);const h=[...a].sort((S,C)=>S[0]-C[0]);if(h.length===0)return R("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),R("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(S=>S.año===e?{...S,tramos:h}:S)),R(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const rr=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function cr(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${rr.map(e=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${e.id}" style="${e.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${e.etiqueta}</button>`).join("")}
  </div>`}function lr(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Ao(t,e){const a=O(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function dr(t,e,a){const o=Ao(a,1)[0],n=e.slice(0,7)<o?e.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function Mo(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function ur(t,e){const{inicio:a,fin:o}=Mo(e);return Ke(t,a,o)}function Ke(t,e,a){return Ut([t],{start:e,end:a}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function pr(t){function e(n,s={}){var _;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:l,hasta:m}=s,d=t.transacciones({estimacionId:n._id}),v=d.length===0&&(((_=n.tags)==null?void 0:_.length)??0)>0?t.transacciones({tags:n.tags}):d,g=l&&m?dr(l,m,c):Ao(c,i),b=new Map(g.map(I=>{const{inicio:y,fin:E}=Mo(I);return[I,{inicio:l&&l>y?l:y,fin:m&&m<E?m:E}]})),x=new Map;for(const I of v){const y=b.get(I.fecha.slice(0,7));if(!y||I.fecha<y.inicio||I.fecha>y.fin)continue;const E=I.fecha.slice(0,7);x.set(E,(x.get(E)??0)+Math.abs(I.importeCts)/100)}const f=[];for(const I of g){const y=x.get(I);if(y===void 0)continue;const E=b.get(I),A=G(Ke(n,E.inicio,E.fin));f.push({mes:I,estimado:A,real:G(y),desviacion:G(y-A),precision:lr(A,y)})}const h=G(f.reduce((I,y)=>I+y.estimado,0)),S=G(f.reduce((I,y)=>I+y.real,0)),C=f.reduce((I,y)=>I+Math.abs(y.estimado),0),w=f.length===0?null:C>0?f.reduce((I,y)=>I+y.precision*Math.abs(y.estimado),0)/C:f.reduce((I,y)=>I+y.precision,0)/f.length,$=f.slice(-r),M=$.length>0?G($.reduce((I,y)=>I+y.real,0)/$.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:h,realTotal:S,desviacionTotal:G(S-h),precision:w,mediaRealReciente:M,infraestimada:S>h}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:G(r.estimado),realTotal:G(r.real),desviacionTotal:G(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function mr(t){const[e,a]=t.split("-").map(Number);return`${t}-${String(new Date(e,a,0).getDate()).padStart(2,"0")}`}function fr(t,e){const a=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=e.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)a.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return a}function gr(t,e,a,o){const n=r=>e.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return fr(a,o).map(r=>{const c={desde:`${r}-01`,hasta:mr(r)},l=b=>G(t.transacciones({...c,tipo:b}).reduce((x,f)=>x+Math.abs(f.importeCts)/100,0)),m=b=>G(b.reduce((x,f)=>x+ur(f,r),0)),d=m(s),u=l("gasto"),v=m(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:G(v-d),netoReal:G(g-u)}})}const fe=640,kt=200,Q={top:14,right:16,bottom:26,left:54};function vr(t){return pe(t).slice(0,3)}const br={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function hr(t,e="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=br[e],o=t.flatMap(x=>[a(x).estimado,a(x).real]),n=fe-Q.left-Q.right,s=kt-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=x=>Q.left+(t.length===1?n/2:x/(t.length-1)*n),m=x=>Q.top+s-(x-r)/c*s,d=t.map((x,f)=>`${l(f)},${m(a(x).estimado)}`).join(" "),u=t.map((x,f)=>`${l(f)},${m(a(x).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${m(0).toFixed(1)}" x2="${fe-Q.right}" y2="${m(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((x,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${m(a(x).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${p(pe(x.mes))}: ${p(P(a(x).real))}</title></circle>`).join(""),b=t.map((x,f)=>`<text x="${l(f).toFixed(1)}" y="${kt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${p(vr(x.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${fe} ${kt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${kt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${kt-Q.bottom}" x2="${fe-Q.right}" y2="${kt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Q.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${p(P(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const Eo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function yr(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:_o(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:oe(_o(t,5)).desde,intervaloHasta:oe(t).hasta,comparativa:"neto"}}function Je(t,e,a,o){const n=t===e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${p(o)}" style="${n}">${p(a)}</button>`}function oe(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function _o(t,e){const[a,o]=t.split("-").map(Number),n=new Date(a,o-1-e,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Qe(t,e){const[a,o]=t<=e?[t,e]:[e,t];return{desde:oe(a).desde,hasta:oe(o).hasta}}function $r(t,e){return t<=e?{desde:t,hasta:e}:{desde:e,hasta:t}}function Xe(t){const e=new Map;for(const a of t){const o=a.concepto.trim(),n=e.get(o);n?n.push(a):e.set(o,[a])}return[...e.entries()].filter(([,a])=>a.length>1).map(([a,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:a,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((a,o)=>o.movimientos.length-a.movimientos.length||a.concepto.localeCompare(o.concepto))}function xr(t,e){if(t.tagsComunes.length===0)return null;const a=new Set(t.movimientos.map(s=>s._id)),o=e.filter(s=>!a.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function wr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const e=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",a=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${p(P(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${p(P(J(t.gastadoCts)))}</strong></span>
      <span style="color:${e}">Diferencia: <strong style="font-family:var(--font-mono)">${a}${p(P(J(t.diferenciaCts)))}</strong></span>
    </div>`}function Ir(t,e){const{ledger:a}=t,o=(t.hoy??K)(),n=t.accounts().filter(y=>y.activo),s=e.vista==="agrupado",i=e.vista==="intervalo",{desde:r,hasta:c}=s?Qe(e.periodoDesde,e.periodoHasta):i?$r(e.intervaloDesde,e.intervaloHasta):oe(e.mes),l={cuentaId:e.cuentaId||void 0,desde:r,hasta:c,texto:e.filtroTexto||void 0},m=a.transacciones(l),d=t.estimaciones().filter(y=>y.tipo!=="transferencia"),u=[...d.map(y=>({_id:y._id,etiqueta:`${p(y.concepto)} (${p(P(y.cuantia))})`})),...t.loans().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Préstamo: ${p(y.nombre)}`})),...t.nominas().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Nómina: ${p(y.nombre)}`}))],v=m.filter(y=>y.tipo!=="transferencia"&&y.importeCts<0).reduce((y,E)=>y+E.importeCts,0),g=m.filter(y=>y.tipo!=="transferencia"&&y.importeCts>0).reduce((y,E)=>y+E.importeCts,0),b=e.cuentaId?a.saldoCuenta(e.cuentaId,c):a.saldoTotal(c),x=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),f=n.map(y=>`<option value="${p(y._id)}"${y._id===e.cuentaId?" selected":""}>${p(y.nombre)}</option>`).join(""),h=y=>'<option value="">— sin asignar —</option>'+u.map(E=>`<option value="${p(E._id)}"${E._id===y?" selected":""}>${E.etiqueta}</option>`).join(""),S=y=>Object.keys(Eo).map(E=>`<option value="${E}"${E===y?" selected":""}>${Eo[E]}</option>`).join(""),C=m.map(y=>{var E;return`
      <tr data-tx="${p(y._id)}" style="border-bottom:1px solid var(--border)${y.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${p(y.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${p(y.concepto)}</td>
        <td style="padding:7px 8px">${po(y.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${p(((E=t.accounts().find(A=>A._id===y.cuentaId))==null?void 0:E.nombre)??y.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${p(y._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${S(y.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${p(y._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(y.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(y.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${p(y._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${p(y._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),w=i?gr(a,d,r,c):[],$=s?a.transacciones({desde:r,hasta:c}):[],_=(s?Xe(m):[]).map(y=>{const E=e.detalleAbierto.has(y.concepto),A=E?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${po(y.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${p(y.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${p(y.concepto)}">Asignar</button>
               </div>
               ${wr(xr(y,$))}
             </td>
           </tr>`:"",F=E?y.movimientos.map(z=>{var D;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${p(z.fecha)}</span> · ${p(((D=t.accounts().find(T=>T._id===z.cuentaId))==null?void 0:D.nombre)??z.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${p(z._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(z.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${It(J(z.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${p(y.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${p(y.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${E?"▾":"▸"}</button>
          <span style="font-size:13px">${p(y.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${y.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${p(y.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${y.movimientos.length} movimientos del grupo de golpe">${h(y.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(y.total))}</td>
        <td></td>
      </tr>${A}${F}`}).join(""),I=x.slice().reverse().slice(0,8).map(y=>{var E;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${p(y.fecha)}</span>
        <span style="color:var(--text3)">${p(((E=t.accounts().find(A=>A._id===y.cuentaId))==null?void 0:E.nombre)??y.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${p(P(J(y.saldoCts)))}</span>
        ${y.nota?`<span style="color:var(--text3)">${p(y.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${p(y._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${e.vista==="mensual"?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">Mes</button>
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
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${p(e.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${p(e.periodoHasta)}" style="width:140px"/>
                 </div>`:i?`<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${p(e.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${p(e.intervaloHasta)}" style="width:150px"/>
                   </div>`:`<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${p(e.mes)}" style="width:140px"/>
                   </div>`}
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${p(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${It(J(v))}</span>
          <span>Ingresos: ${It(J(g))}</span>
          <span>Neto: ${It(J(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${p(c)}: <strong>${p(P(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${p(e.periodoDesde)} y ${p(e.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
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
                     ${_||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
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
                     ${C||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${p(r)} → ${p(c)}</div>
                        <div class="flex gap-6">
                          ${Je("neto",e.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${Je("gasto",e.comparativa,"Gasto","Solo el gasto")}
                          ${Je("ingreso",e.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${hr(w,e.comparativa)}`:""}`}
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${p(o)}"/></div>
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(y=>`<option value="${p(y)}"></option>`).join("")}</datalist>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${p(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${f}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${I?`<div class="mt-12">${I}</div>`:""}
        </div>
      </div>
    </div>`}function Cr(t,e,a,o){const{ledger:n}=e;U(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),U(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()}),j(t,"[data-acc-vista]",i=>{a.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),U(t,"#acc-periodo-desde",i=>{a.periodoDesde=i.value||a.periodoDesde,o()}),U(t,"#acc-periodo-hasta",i=>{a.periodoHasta=i.value||a.periodoHasta,o()}),j(t,"[data-acc-comparativa]",i=>{a.comparativa=i.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",i=>{a.intervaloDesde=i.value||a.intervaloDesde,o()}),U(t,"#acc-intervalo-hasta",i=>{a.intervaloHasta=i.value||a.intervaloHasta,o()}),j(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");a.detalleAbierto.has(r)?a.detalleAbierto.delete(r):a.detalleAbierto.add(r),o()}),U(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:l,hasta:m}=Qe(a.periodoDesde,a.periodoHasta),d=n.transacciones({cuentaId:a.cuentaId||void 0,desde:l,hasta:m,texto:a.filtroTexto||void 0}),u=Xe(d).find(v=>v.concepto===r);if(u){for(const v of u.movimientos)n.asignarEstimacion(v._id,c);R(`Estimación asignada a ${u.movimientos.length} movimientos`),e.onDatosCambiados(),o()}}),j(t,"[data-grp-tags-asignar]",i=>{var g;const r=i.getAttribute("data-grp-tags-asignar"),c=((g=i.closest("tr"))==null?void 0:g.querySelector("[data-grp-tags]"))??null,l=((c==null?void 0:c.value)??"").split(",").map(b=>b.trim().toLowerCase()).filter(Boolean);if(l.length===0)return R("Escribe al menos una etiqueta","err");const{desde:m,hasta:d}=Qe(a.periodoDesde,a.periodoHasta),u=n.transacciones({cuentaId:a.cuentaId||void 0,desde:m,hasta:d,texto:a.filtroTexto||void 0}),v=Xe(u).find(b=>b.concepto===r);if(v){for(const b of v.movimientos)n.actualizar(b._id,{tags:[...new Set([...b.tags,...l])]});R(`Etiquetas añadidas a ${v.movimientos.length} movimientos`),e.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),j(t,"#nt-guardar",()=>{const i=ct(t,"#nt-concepto").trim(),r=mo(t,"#nt-importe");if(!i)return R("Indica un concepto","err");if(!(r>0))return R("Indica un importe mayor que cero","err");const c=ct(t,"#nt-tags").split(",").map(l=>l.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(e.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),R("Movimiento registrado"),e.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;ot("¿Eliminar este movimiento?")&&(n.eliminar(r),R("Movimiento eliminado"),e.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(d=>d._id===r);if(!c)return;const l=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(J(c.importeCts))));if(l===null)return;const m=parseFloat(l.replace(",","."));if(!Number.isFinite(m)||m<=0)return R("Importe no válido","err");n.actualizar(r,{importe:m}),R("Movimiento actualizado"),e.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),R("Asignación actualizada"),e.onDatosCambiados()}),U(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),R("Tipo actualizado"),e.onDatosCambiados(),o()}),j(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return R("Indica el saldo","err");const r=mo(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(e.hoy??K)(),r,ct(t,"#pc-nota").trim()||void 0),R("Saldo real registrado"),e.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",i=>{ot("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),R("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Ze(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=G(t.mediaRealReciente),i=G(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:G(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function Sr(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const c=r.hoy??K(),l=t.get("expenses"),m=l.find(g=>g._id===s);if(!m)throw new Error(`La estimación ${s} no existe`);const d={...m,fechaFin:c},u={...m,_id:e(),cuantia:G(i),fechaInicio:c,fechaFin:m.fechaFin??null,ajustadaDesdeId:m._id,ajustadaEn:c},v=l.map(g=>g._id===s?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const l of s)try{r.push(a(l.estimacionId,l.cuantiaSugerida,i))}catch(m){c.push({estimacionId:l.estimacionId,error:m.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const l=[];let m=c;const d=new Set;for(;m!=null&&m.ajustadaDesdeId&&!d.has(m._id);){d.add(m._id);const b=r.get(m.ajustadaDesdeId);if(!b)break;l.unshift(b),m=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find(x=>x.ajustadaDesdeId===v._id&&!g.has(x._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:a,aplicarTodas:o,cadena:n}}function Po(t){var n;const e=t.estimaciones(),a=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(e.map(s=>[s._id,s]));return t.precision.analizarTodas(e,a?{desde:a.desde,hasta:a.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:Ze(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function Ar(t){var a;const e=((a=t.rango)==null?void 0:a.call(t))??null;return e?p(`Limitado al periodo de la cabecera (${e.desde} → ${e.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Mr(t){var r;const e=Po(t),a=e.filter(c=>c.analisis.precision!==null),o=e.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(e.map(c=>c.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(r=t.rango)!=null&&r.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const s=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${p(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${It(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Js(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Ar(t)}
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
          <tbody>${s||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function Er(t,e,a){j(t,"#ajustar-todas",()=>{const o=Po(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${P(r.cuantiaActual)} → ${P(r.cuantiaSugerida)}`).join(`
`);if(!ot(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});R(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const _r=[";",",","	","|"],Pr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function ge(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ve(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function Fr(t){let e=";",a=-1;for(const o of _r){const n=t.slice(0,20).map(c=>ve(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>a&&(a=r,e=o)}return e}function ne(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const m=s===","?o:n;i=e.slice(0,m).replace(/[.,]/g,""),r=e.slice(m+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?a?-l:l:null}function ta(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return Fo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),Fo(o,Number(a[2]),Number(a[1]))}return null}function Fo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Do(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ta(a)!==null).length/e.length}function To(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ne(a)!==null).length/e.length}function Dr(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=ge(t[i]);if(r&&Pr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&ge(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Do(n(r));c>i&&(i=c,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||ge(t[r]).includes("saldo"))continue;const c=To(n(r));c>i&&(i=c,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(To(c)>.5||Do(c)>.5)continue;const l=c.reduce((m,d)=>m+d.length,0)/Math.max(1,c.length);l>i&&(i=l,s=r)}s>=0&&(a.concepto=s)}return a}function Tr(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(m=>m.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=Fr(e),o=e.map(m=>ve(m,a).length),n=Math.max(...o);let s=o.findIndex(m=>m===n);s<0&&(s=0);const i=ve(e[s],a);let r=e.slice(s+1).map(m=>ve(m,a));const c=ta(i[0]??"")!==null||i.some(m=>ne(m)!==null&&/\d/.test(m));c&&(r=[i,...r]);const l=Dr(c?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:c?i.map((m,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:l}}function zo(t,e,a){return`${t}|${e}|${ge(a).replace(/\s+/g," ")}`}function zr(t,e,a=[]){const o=new Set(a.map(s=>zo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=e.fecha>=0?ta(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let l=null;if(e.importe>=0)l=ne(s[e.importe]??""),l===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const u=e.debe>=0?ne(s[e.debe]??""):null,v=e.haber>=0?ne(s[e.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const m=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=zo(c,l,m);d=o.has(u)||n.has(u),n.add(u)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:m,importeCts:l,errores:r,duplicada:d}})}function jr(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function be(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const qr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ea(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=zr(e.analisis,e.mapeo,a)}function Rr(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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
      </div>`;const o=a.map(n=>`<option value="${p(n._id)}"${n._id===e.cuentaId?" selected":""}>${p(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${e.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${p(e.error)}</div></div>`:""}

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

      ${e.analisis&&e.mapeo?Lr(e,e.analisis,e.mapeo):Nr()}
    </div>`}function Nr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Lr(t,e,a){const o=jr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${p(c||`Columna ${l+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${p(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${p(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${qr.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${p(r.etiqueta)}</label>
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
        <div class="stat-value" style="font-size:1.15rem">${It(J(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${p(o.desde)} → ${p(o.hasta??"")}`:"—"}</div>
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
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${p(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,l=c?r.errores[0]:r.duplicada?"repetido":"se importa",m=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${p(r.fecha??"—")}</td>
                <td style="font-size:12px">${p(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":p(P(J(r.importeCts)))}</td>
                <td style="font-size:11px;color:${m}">${p(l)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Or(t,e,a,o){j(t,"[data-imp-sincronizar]",()=>{const s=e.ledger.sincronizarHistoricoImportado();if(s.length===0)return R("Nada que sincronizar: no hay movimientos importados todavía");const i=m=>{var d;return((d=e.accounts().find(u=>u._id===m))==null?void 0:d.nombre)??m},r=s.reduce((m,d)=>m+d.eliminados,0),c=s.reduce((m,d)=>m+d.semanales,0),l=s.map(m=>`${i(m.cuentaId)} (${m.semanales})`).join(", ");R(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),e.onDatosCambiados(),o()}),j(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,be(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),j(t,"[data-imp-cerrar]",()=>{Object.assign(a,be()),o()}),U(t,"#imp-cuenta",s=>{a.cuentaId=s.value,ea(e,a),o()}),U(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),ea(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&kr(s).then(r=>{const c=Tr(r);a.nombreFichero=s.name,a.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=c,a.mapeo={...c.mapeo},ea(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),j(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(l=>l.errores.length===0&&(a.incluirDuplicadas||!l.duplicada));if(s.length===0)return;for(const l of s)e.ledger.registrar({fecha:l.fecha,cuentaId:a.cuentaId,importe:Math.abs(J(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=s.map(l=>l.fecha).sort(),r=e.ledger.eliminarPuntosControlEnRango(a.cuentaId,i[0],i[i.length-1]),c=e.ledger.generarPuntosSemanales(a.cuentaId);R(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(a,be()),e.onDatosCambiados(),o()})}function kr(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function Br(t,e){if(e<t)return 0;let a=0,[o,n]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(n).padStart(2,"0")}`<=e.slice(0,7);){const s=new Date(o,n,0).getDate(),i=`${o}-${String(n).padStart(2,"0")}-01`,r=`${o}-${String(n).padStart(2,"0")}-${String(s).padStart(2,"0")}`,c=t>i?t:i,l=e<r?e:r,m=(O(l).getTime()-O(c).getTime())/864e5+1;a+=m/s,++n>12&&(n=1,o++)}return a}function Hr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Gr(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function aa(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function jo(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const l=(c.tags??[]).filter(m=>s.tags.includes(m)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(s)}return o}function qo(t,e,a,o={}){const s=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:G(Ke(c,e,a)),origen:"estimacion",cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1);if(i.length>0){const c=De(i,{start:e,end:a},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);s.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:G(d),origen:"nomina"})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Fe(r,{start:e,end:a});for(const l of r){const m=c.filter(d=>d.sourceId===l._id);m.length!==0&&s.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:G(m.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo"})}}return s}function Vr(t,e,a,o={}){const{desde:n,hasta:s}=Hr(a);return{...Ro(t,e,n,s,o),mes:a}}function Ro(t,e,a,o,n={}){const s=t.transacciones({desde:a,hasta:o}),i=new Set(n.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(aa(D.concepto)),c=s.filter(D=>r(D)&&D.importeCts<0),l=s.filter(D=>r(D)&&D.importeCts>0),m=s.filter(D=>D.tipo!=="transferencia"&&i.has(aa(D.concepto))),d=new Map((n.analisis??[]).map(D=>[D.estimacionId,D])),u=qo(e,a,o,n),v=D=>new Set(D.filter(T=>t.transacciones({estimacionId:T._id}).length>0).map(T=>T._id)),g=u.filter(D=>D.tipo==="gasto"),b=u.filter(D=>D.tipo==="ingreso"),x=jo(c,g,D=>v(g).has(D)),f=jo(l,b,D=>v(b).has(D)),h=new Set,S=new Set,C=(D,T,N)=>{for(const k of T)N.add(k._id);const H=G(T.reduce((k,L)=>k+Math.abs(L.importeCts)/100,0)),q=D.origen==="estimacion"?d.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,tags:D.tags,estimado:D.estimado,real:H,desviacion:G(H-D.estimado),sinMovimiento:T.length===0,sugerencia:q?Ze(q,D.cuantia??0,{hoy:n.hoy}):null}},w=g.map(D=>C(D,x.get(D._id)??[],h)),$=b.map(D=>C(D,f.get(D._id)??[],S)),M=(D,T)=>{const N=new Map;for(const H of D){if(T.has(H._id))continue;const q=aa(H.concepto),k=N.get(q)??{concepto:H.concepto,clave:q,total:0,movimientos:0,ids:[]};k.total=G(k.total+Math.abs(H.importeCts)/100),k.movimientos+=1,k.ids.push(H._id),N.set(q,k)}return[...N.values()].sort((H,q)=>q.total-H.total)},_=M(c,h),I=M(l,S),y=M(m,new Set),E=G(w.reduce((D,T)=>D+T.estimado,0)),A=G(c.reduce((D,T)=>D+Math.abs(T.importeCts)/100,0)),F=G($.reduce((D,T)=>D+T.estimado,0)),z=G(l.reduce((D,T)=>D+T.importeCts/100,0));return{mes:a.slice(0,7),desde:a,hasta:o,estimado:E,real:A,desviacion:G(A-E),ingresosEstimados:F,ingresosReales:z,desviacionIngresos:G(z-F),netoEstimado:G(F-E),netoReal:G(z-A),desviacionNeta:G(z-A-(F-E)),filas:[...w,...$].sort((D,T)=>Math.abs(T.desviacion)-Math.abs(D.desviacion)),sinEstimacion:_,totalSinEstimacion:G(_.reduce((D,T)=>D+T.total,0)),ingresosSinPrever:I,totalIngresosSinPrever:G(I.reduce((D,T)=>D+T.total,0)),porTag:Ur(g,c),meses:Br(a,o),omitidos:y,totalOmitido:G(y.reduce((D,T)=>D+T.total,0)),vacio:s.length===0}}function Ur(t,e){const a=new Map,o=(n,s,i)=>{for(const r of n.length>0?n:["sin etiqueta"]){const c=a.get(r)??{estimado:0,real:0};c[s]+=i,a.set(r,c)}};for(const n of t)o(n.tags,"estimado",n.estimado);for(const n of e)o(n.tags,"real",Math.abs(n.importeCts)/100);return[...a.entries()].map(([n,s])=>({tag:n,estimado:G(s.estimado),real:G(s.real),desviacion:G(s.real-s.estimado)})).filter(n=>n.estimado>0||n.real>0).sort((n,s)=>s.real-n.real||s.estimado-n.estimado)}function No(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}const he=26,oa=7,na=(he+oa)*2,Lo=2*Math.PI*he,Oo=12;function Yr(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const e=t.real/t.estimado*100;return{color:e>110?"var(--red)":e>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(e)}%`]}}function Wr(t){const{color:e,fraccion:a,etiqueta:o}=Yr(t),n=na/2,s=`${t.tag}: real ${P(t.real)} de ${P(t.estimado)} previsto (${t.desviacion>=0?"+":""}${P(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${na} ${na}" style="width:78px;height:78px" role="img" aria-label="${p(s)}">
        <title>${p(s)}</title>
        <circle cx="${n}" cy="${n}" r="${he}" fill="none" stroke="var(--bg3)" stroke-width="${oa}"/>
        <circle cx="${n}" cy="${n}" r="${he}" fill="none" stroke="${e}" stroke-width="${oa}"
                stroke-linecap="round" stroke-dasharray="${(Lo*a).toFixed(2)} ${Lo.toFixed(2)}"
                transform="rotate(-90 ${n} ${n})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=n+(o.length>1?r*10-1:4);return`<text x="${n}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${p(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${p(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${p(P(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${p(P(t.estimado))}</div>
    </div>`}function Kr(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const e=t.slice(0,Oo),a=t.slice(Oo),o=a.reduce((n,s)=>n+s.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${e.map(Wr).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${a.length>0?`<span style="color:var(--text3)">y ${a.length} etiqueta(s) más, ${p(P(o))}</span>`:""}
    </div>`}function Jr(){return{mes:"",modo:"mes"}}function ko(t,e){if(e.mes)return e.mes;const a=No(t.ledger),o=Gr((t.hoy??K)());return a.includes(o)?o:a[0]??o}function ye(t,e){var i;const a=(t.hoy??K)(),o=t.estimaciones(),n={hoy:a,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(e.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:a,desde:r,hasta:c});return Ro(t.ledger,o,r,c,{...n,analisis:l})}const s=t.precision.analizarTodas(o,{hoy:a});return Vr(t.ledger,o,ko(t,e),{...n,analisis:s})}function Bo(t){var n;const e=(t.hoy??K)(),a=qo(t.estimaciones(),e,e,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(n=t.resolverTramosIRPF)==null?void 0:n.call(t)}),o=s=>a.filter(i=>i.tipo===s).map(i=>`<option value="${p(i._id)}">${p(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function ft(t,e){return e<=0?"—":`${p(P(t/e))}/mes`}function Ho(t,e,a,o){const n=e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${p(o)}" style="${n}">${p(a)}</button>`}function Qr(t,e){const a=e.modo==="periodo",o=ko(t,e),n=No(t.ledger);n.includes(o)||n.unshift(o);const s=ye(t,e),i=a?"Cierre del periodo":"Cierre de mes",r=a?`del ${p(s.desde)} al ${p(s.hasta)}`:p(pe(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Ho("mes",!a,"Mes","Cierra un mes natural completo")}
      ${Ho("periodo",a,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${a?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${p(s.desde)} → ${p(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(d=>`<option value="${p(d)}"${d===o?" selected":""}>${p(pe(d))}</option>`).join("")}
             </select>`}
    </div>`;if(s.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${i}</div>
          ${c}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${a?"":"en "}${r}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;const l=d=>d>0?"+":"",m=s.desviacionNeta<0?"var(--red)":s.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${p(P(s.real))}</div>
          <div class="stat-sub">${ft(s.real,s.meses)} · previsto ${p(P(s.estimado))} (${ft(s.estimado,s.meses)})</div>
          <div class="stat-sub">${l(s.desviacion)}${p(P(s.desviacion))} · ${l(s.desviacion)}${ft(s.desviacion,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${p(P(s.ingresosReales))}</div>
          <div class="stat-sub">${ft(s.ingresosReales,s.meses)} · previsto ${p(P(s.ingresosEstimados))} (${ft(s.ingresosEstimados,s.meses)})</div>
          <div class="stat-sub">${l(s.desviacionIngresos)}${p(P(s.desviacionIngresos))} · ${l(s.desviacionIngresos)}${ft(s.desviacionIngresos,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${m}">${l(s.desviacionNeta)}${p(P(s.desviacionNeta))}</div>
          <div class="stat-sub">${l(s.desviacionNeta)}${ft(s.desviacionNeta,s.meses)}</div>
          <div class="stat-sub">neto real ${p(P(s.netoReal))} · previsto ${p(P(s.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${p(P(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${ft(s.totalSinEstimacion,s.meses)} · ${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${s.totalIngresosSinPrever>0?`${p(P(s.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${p(s.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${Xr(s)}
      ${Zr(s,Bo(t))}
      ${ec(s,Bo(t))}
      ${tc(s)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${Kr(s.porTag)}
    </div>`}function Xr(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const a=e.filter(o=>o.sugerencia);return`
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
          ${e.map(o=>{const n=o.tipo==="gasto"?o.desviacion>0:o.desviacion<0,s=o.desviacion===0?"var(--text2)":n?"var(--red)":"var(--accent)",i=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${p(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
                  ${o.desviacion>0?"+":""}${p(P(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${p(o.estimacionId)}"
                           title="Pasar la estimación de ${p(P(i.cuantiaActual))} a ${p(P(i.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${p(P(i.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function Go(t,e,a,o){return`<tr>
    <td style="font-size:12px">${p(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${p(P(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${ft(t.total,e)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${p(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${a}
      </select>
      <button class="btn-secondary btn-sm" data-cie-omitir="${p(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const Vo=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function Zr(t,e){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${Vo}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(a=>Go(a,t.meses,e.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function tc(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${p(P(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(e=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${p(e.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${p(e.concepto)} · ${p(P(e.total))} ✕</button>`).join("")}
    </div>`}function ec(t,e){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${Vo}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(a=>Go(a,t.meses,e.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function ac(t,e,a,o){U(t,"#cie-mes",n=>{a.mes=n.value,o()}),j(t,"[data-cie-modo]",n=>{a.modo=n.getAttribute("data-cie-modo")||"mes",o()}),j(t,"[data-cie-omitir]",n=>{const s=n.getAttribute("data-cie-omitir"),i=e.omitidos();i.includes(s)||(e.setOmitidos([...i,s]),R("Concepto omitido: deja de contar en el cierre"),o())}),j(t,"[data-cie-restaurar]",n=>{const s=n.getAttribute("data-cie-restaurar");e.setOmitidos(e.omitidos().filter(i=>i!==s)),o()}),U(t,"[data-cie-asignar]",n=>{const s=n,i=s.getAttribute("data-cie-asignar"),r=s.value;if(!r)return;const c=ye(e,a),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(m=>m.clave===i);if(l){if(!ot(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){s.value="";return}for(const m of l.ids)e.ledger.asignarEstimacion(m,r);R(`${l.movimientos} movimiento(s) asignados`),e.onDatosCambiados(),o()}}),j(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=ye(e,a).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??K)()}),R(`«${r.concepto}» ajustada a ${P(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),j(t,"[data-cie-ajustar-todas]",()=>{const s=ye(e,a).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??K)()});R(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const oc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function nc(t){const e=t.hoy??K,a=()=>{var T;return(T=t.onDatosCambiados)==null?void 0:T.call(t)},o=new Map;let n="cuentas";const s=yr(e().slice(0,7)),i=be(),r=Jr(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),m={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:a,hoy:e},d={ledger:t.ledger,accounts:l,onDatosCambiados:a},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Pt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt),omitidos:()=>u().cierreOmitidos??[],setOmitidos:T=>t.store.patchConfig({cierreOmitidos:T}),onDatosCambiados:a,periodo:v,hoy:e},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:a,rango:()=>r.modo==="periodo"?v():null,hoy:e},x=T=>{var N;return((N=t.store.get("accounts").find(H=>H._id===T))==null?void 0:N.nombre)??T},f=()=>Pt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt)(Number(e().slice(0,4))),h=()=>Pt(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Vt),S=()=>h()(Number(e().slice(0,4)));function C(){const T=u(),N=t.store.get("accounts"),H=Da({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:N,config:{dashboardStart:T.dashboardStart,dashboardEnd:T.dashboardEnd,fechaReferencia:T.dashboardStart},nominas:[],resolverTramosGanancias:h()}),q=new Map,k=B=>{let V=q.get(B);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},q.set(B,V)),V},L=(B,V)=>{const Z=`${V.sourceId}`,et=B.find(la=>la.concepto===Z),nt=et??{concepto:Z,contraparte:"",total:0,ocurrencias:0};nt.total+=Math.abs(V.cuantia),nt.ocurrencias+=1,et||B.push(nt)};for(const B of H){if(!B.cuenta)continue;const V=k(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(B.cuantia),L(V.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(B.cuantia),L(V.salidas,B)):B.sourceType==="investment-tax"&&(V.retencion+=Math.abs(B.cuantia))}const Y=t.store.get("expenses");for(const B of q.values())for(const[V,Z]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const et of V){const nt=Y.find(la=>la._id===et.concepto);et.contraparte=x((nt==null?void 0:nt[Z])??"default"),et.concepto=(nt==null?void 0:nt.concepto)||(Z==="cuenta"?"Aportación":"Reembolso")}return q}function w(T){const N=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let H;if(n==="cuentas"){const L=t.store.get("accounts").filter(V=>rt(V)!=="pension"),Y=C(),B={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:S(),flujos:V=>Y.get(V)??Yi,invModo:V=>o.get(V)??"proyeccion"};H=`${Wi(L,B.tramosGanancias)}<div class="grid-3">${L.map(V=>Zi(V,B)).join("")}</div>`}else n==="movimientos"?H='<div id="acc-tx"></div>':n==="importar"?H='<div id="acc-import"></div>':H='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';T.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${N}
      </div>
      ${cr(n)}
      ${H}`;const q=()=>w(T);if(n==="movimientos"){const k=T.querySelector("#acc-tx");k.innerHTML=Ir(m,s),Cr(k,m,s,q)}else if(n==="importar"){const k=T.querySelector("#acc-import");k.innerHTML=Rr(d,i),Or(k,d,i,q)}else if(n==="cierre"){const k=T.querySelector("#acc-cierre"),L=T.querySelector("#acc-precision");k.innerHTML=Qr(g,r),L.innerHTML=Mr(b),ac(k,g,r,q),Er(L,b,q)}}const $=()=>document.getElementById("modal-overlay"),M=()=>document.getElementById("modal-content"),_=()=>{var T;return(T=$())==null?void 0:T.classList.add("hidden")};function I(T,N){const H=$(),q=M();return!H||!q?null:(q.innerHTML=T?`<div class="modal-title">${p(T)}</div>${N}`:N,H.classList.remove("hidden"),j(q,"[data-cancelar]",_),q)}function y(T,N){const H=T?t.store.get("accounts").find(Y=>Y._id===T)??null:null,q=[...(H==null?void 0:H.planAportaciones)??[]].map(Y=>({...Y})),k=H?E(H):null,L=I(T?"Editar cuenta / fondo":"Nueva cuenta / fondo",ar(H,{nominas:t.store.get("nominas"),hoy:e(),saldoActual:k??0}));L&&(or(L,q,e()),j(L,"[data-guardar-acc]",Y=>{const B=Y.getAttribute("data-guardar-acc")||"",{datos:V,punto:Z,error:et}=nr(L,q,H,k,e());if(et)return R(et,"err");let nt=B;B?t.store.updateItem("accounts",B,V):nt=t.store.addItem("accounts",V)._id,Z&&t.ledger.registrarPuntoControl(nt,Z.fecha,Z.saldo,Z.nota),R(B?"Actualizada":"Cuenta / fondo creado"),a(),_(),N()}))}function E(T){const N=t.ledger.puntosControl(T._id);return N.length>0?We(N)[0].saldo:T.saldo??null}function A(T,N){const H=t.store.get("accounts").find(L=>L._id===T);if(!H)return;const q=I("Histórico de saldos",sr(H.nombre,T,We(t.ledger.puntosControl(T)),H.saldoInicial||0,e()));if(!q)return;const k=()=>{N(),A(T,N)};j(q,"[data-hist-anadir]",()=>{var V,Z,et;const L=((V=q.querySelector("#hi-fecha"))==null?void 0:V.value)??"",Y=parseFloat(((Z=q.querySelector("#hi-saldo"))==null?void 0:Z.value)??""),B=((et=q.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!L||!Number.isFinite(Y))return R("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(T,L,Y,B||void 0),R("Punto añadido"),a(),k()}),j(q,"[data-hist-borrar]",L=>{const[,Y]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),R("Eliminado"),a(),k()}),j(q,"[data-hist-semanal]",L=>{const Y=L.getAttribute("data-hist-semanal"),B=t.ledger.generarPuntosSemanales(Y);R(B>0?`Histórico con ${B} punto${B!==1?"s":""} semanal${B!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),a(),k()}),j(q,"[data-hist-inicial]",L=>{const[Y,B]=(L.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(Y).find(et=>et._id===B);if(!V)return;const Z=We([V])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:Z,fechaInicialSaldo:V.fecha}),R(`Punto inicial → ${V.fecha} (${P(Z)})`),a(),k()})}function F(T){const N=t.store.get("accounts").filter(k=>k.activo);if(N.length===0)return R("No hay cuentas activas","err");const H=e(),q=N.map(k=>`• ${k.nombre}: ${P(E(k)??k.saldoInicial??0)}`).join(`
`);if(ot(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${H})?

${q}

Esto recalibra el punto de arranque del dashboard.`)){for(const k of N)t.store.updateItem("accounts",k._id,{saldoInicial:E(k)??k.saldoInicial??0,fechaInicialSaldo:H});R("Saldo base actualizado"),a(),T()}}function z(T,N,H){j(T,"[data-cuentas-tab]",q=>{n=q.getAttribute("data-cuentas-tab")||"cuentas",N()}),j(T,"[data-nueva-acc]",()=>y(null,N)),j(T,"[data-editar-acc]",q=>y(q.getAttribute("data-editar-acc"),N)),j(T,"[data-tramos-ganancias]",()=>H.abrir()),j(T,"[data-reset-base]",()=>F(N)),j(T,"[data-hist-acc]",q=>A(q.getAttribute("data-hist-acc"),N)),j(T,"[data-principal-acc]",q=>{const k=q.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===k}))),R("Cuenta marcada como principal"),a(),N()}),j(T,"[data-borrar-acc]",q=>{const k=q.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return R("Debe existir al menos una cuenta","err");if(!ot("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",k);const Y=t.store.get("accounts");Y.length>0&&!Y.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",Y.map((B,V)=>V===0?{...B,esCuentaPrincipal:!0}:B)),R("Cuenta eliminada"),a(),N()}),j(T,"[data-inv-modo]",q=>{const[k,L]=(q.getAttribute("data-inv-modo")||"").split("|");o.set(k,L==="real"?"real":"proyeccion"),N()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:oc,mount(T){const N=()=>w(T);D??(D=ir({store:t.store,onDatosCambiados:()=>{a(),N()},año:()=>Number(e().slice(0,4))})),w(T),T.dataset.wired!=="1"&&(z(T,N,D),T.dataset.wired="1")}}}function Uo(t,e,a=!1){const o=Math.abs(it(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function sc(t){function e(I){return`${I}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(I={}){var E;const y=(E=I.texto)==null?void 0:E.trim().toLowerCase();return t.get("transacciones").filter(A=>!(I.cuentaId&&A.cuentaId!==I.cuentaId||I.desde&&A.fecha<I.desde||I.hasta&&A.fecha>I.hasta||I.tipo&&A.tipo!==I.tipo||I.estimacionId&&A.estimacionId!==I.estimacionId||I.tags&&I.tags.length>0&&!I.tags.some(F=>A.tags.includes(F))||y&&!A.concepto.toLowerCase().includes(y))).sort((A,F)=>A.fecha.localeCompare(F.fecha)||A._id.localeCompare(F._id))}function o(I){const y={_id:e("tx"),fecha:I.fecha,cuentaId:I.cuentaId,importeCts:Uo(I.tipo,I.importe,I.negativo),concepto:I.concepto,tags:I.tags??[],estimacionId:I.estimacionId??null,tipo:I.tipo,origen:I.origen??"manual",...I.nota?{nota:I.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),y]),y}function n(I,y){t.set("transacciones",t.get("transacciones").map(E=>{if(E._id!==I)return E;const{importe:A,...F}=y,z={...E,...F};return A!==void 0&&(z.importeCts=Uo(z.tipo,A,z.importeCts<0)),z}))}function s(I){t.set("transacciones",t.get("transacciones").filter(y=>y._id!==I))}function i(I,y){n(I,{estimacionId:y})}function r(I){return t.get("puntosControl").filter(y=>!I||y.cuentaId===I).sort((y,E)=>y.fecha.localeCompare(E.fecha))}function c(I){return r(I).filter(y=>y.origen!=="derivado")}function l(I,y,E,A){const F={_id:e("pc"),fecha:y,cuentaId:I,saldoCts:it(E),...A?{nota:A}:{}},z=t.get("puntosControl").filter(D=>!(D.cuentaId===I&&D.fecha===y));return t.set("puntosControl",[...z,F].sort((D,T)=>D.fecha.localeCompare(T.fecha))),u(I),F}function m(I){const y=t.get("puntosControl").find(E=>E._id===I);t.set("puntosControl",t.get("puntosControl").filter(E=>E._id!==I)),y&&(y.origen==="derivado"?x(y.cuentaId):u(y.cuentaId))}function d(I,y,E){const A=z=>z.cuentaId===I&&z.origen!=="derivado"&&z.fecha>=y&&z.fecha<=E,F=t.get("puntosControl").filter(A).length;return F===0?0:(t.set("puntosControl",t.get("puntosControl").filter(z=>!A(z))),x(I),F)}function u(I){var q,k;const y=c(I),E=t.get("transacciones").filter(L=>L.cuentaId===I).sort((L,Y)=>L.fecha.localeCompare(Y.fecha)),A=(q=E[0])==null?void 0:q.fecha,F=(k=E[E.length-1])==null?void 0:k.fecha,z=t.get("puntosControl").filter(L=>!(L.cuentaId===I&&L.origen==="derivado"));if(!A)return t.set("puntosControl",z),x(I),0;const D=[];for(let L=Ht(A);L<=F;L=Ht(pa(L,1)))D.push(L);D[D.length-1]!==F&&D.push(F);const T=new Set(y.map(L=>Ht(L.fecha))),N=L=>{const Y=y.filter(B=>B.fecha<=L).pop();return E.filter(B=>B.fecha<=L&&(!Y||B.fecha>Y.fecha)).reduce((B,V)=>B+V.importeCts,(Y==null?void 0:Y.saldoCts)??0)},H=D.filter(L=>!T.has(Ht(L))).map(L=>({_id:e("pcd"),fecha:L,cuentaId:I,saldoCts:N(L),origen:"derivado"}));return t.set("puntosControl",[...z,...H].sort((L,Y)=>L.fecha.localeCompare(Y.fecha))),v(I,A,N(A)),x(I),H.length}function v(I,y,E){const A=t.get("accounts"),F=A.find(z=>z._id===I);!F||F.fechaInicialSaldo&&F.fechaInicialSaldo<=y||t.set("accounts",A.map(z=>z._id===I?{...z,saldoInicial:J(E),fechaInicialSaldo:y}:z))}function g(I){return(I??[...new Set(t.get("transacciones").map(E=>E.cuentaId))]).reduce((E,A)=>E+u(A),0)}function b(I){const y=t.get("transacciones").filter(F=>F.origen==="importado"&&(!I||F.cuentaId===I)),E=new Map;for(const F of y){const z=E.get(F.cuentaId);z?z.push(F.fecha):E.set(F.cuentaId,[F.fecha])}const A=[];for(const[F,z]of E){z.sort();const D=d(F,z[0],z[z.length-1]);A.push({cuentaId:F,eliminados:D,semanales:u(F)})}return A}function x(I){const y=r(I),E=t.get("accounts");E.some(A=>A._id===I)&&t.set("accounts",E.map(A=>A._id===I?{...A,historicoSaldos:y.map(F=>({_id:F._id,fecha:F.fecha,saldo:J(F.saldoCts),...F.nota?{nota:F.nota}:{}}))}:A))}function f(I,y=K()){const E=c(I).filter(D=>D.fecha<=y).pop(),A=E==null?void 0:E.fecha,F=(E==null?void 0:E.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===I&&D.fecha<=y&&(A===void 0||D.fecha>A)).reduce((D,T)=>D+T.importeCts,F)}function h(I,y){return J(f(I,y))}function S(I=K(),y){const E=y??t.get("accounts").filter(A=>A.activo).map(A=>A._id);return J(E.reduce((A,F)=>A+f(F,I),0))}function C(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function w(){const I=[...t.get("transacciones").map(y=>y.fecha),...t.get("puntosControl").map(y=>y.fecha)];return I.length>0?I.sort().pop()??null:null}function $(I={}){return J(a(I).reduce((y,E)=>y+E.importeCts,0))}function M(I={}){const y=new Map;for(const E of a(I)){const A=E.fecha.slice(0,7);y.set(A,(y.get(A)??0)+E.importeCts)}return new Map([...y.entries()].sort(([E],[A])=>E.localeCompare(A)).map(([E,A])=>[E,J(A)]))}function _(I={}){const y=new Map;for(const E of a(I))for(const A of E.tags.length>0?E.tags:["sin_tag"])y.set(A,(y.get(A)??0)+E.importeCts);return new Map([...y.entries()].map(([E,A])=>[E,J(A)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:m,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:S,tieneDatos:C,ultimaFecha:w,total:$,totalPorMes:M,totalPorTag:_}}function pt(t){return t.trim().toLowerCase()}function ic(t){function e(){const l=new Map,m=(d,u)=>{const v=pt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])m(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])m(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function a(){return e().map(l=>l.tag)}function o(l){return e().filter(m=>l==="estimaciones"?m.reales===0:m.estimaciones===0).map(m=>m.tag)}function n(l,m,d){const u=pt(m),v=(l??[]).map(pt);if(!v.includes(u))return l??[];const g=v.filter(b=>b!==u);return d===null?[...new Set(g)]:[...new Set([...g,pt(d)])]}function s(l,m){const d=pt(m);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,m){let d=0;for(const u of l)pt(u)!==pt(m)&&(d+=c(u,pt(m)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,m){let d=0;const u=t.get("expenses").map(M=>{const _=n(M.tags,l,m);return _!==M.tags&&(d+=1),_===M.tags?M:{...M,tags:_}});t.set("expenses",u);const v=t.get("transacciones").map(M=>{const _=n(M.tags,l,m);return _!==M.tags&&(d+=1),_===M.tags?M:{...M,tags:_}});t.set("transacciones",v);const g=t.get("loans").map(M=>{const _=n(M.tags,l,m);return _!==M.tags&&(d+=1),_===M.tags?M:{...M,tags:_}});t.set("loans",g);const b=t.get("nominas").map(M=>{const _=n(M.tags,l,m);return _!==M.tags&&(d+=1),_===M.tags?M:{...M,tags:_}});t.set("nominas",b);const x=t.get("config"),f=pt(l),h=M=>{const _=(M??[]).map(pt);if(!_.includes(f))return M??[];const I=_.filter(y=>y!==f);return m===null?[...new Set(I)]:[...new Set([...I,m])]},S={},C=h(x.activeTagsFilter),w=h(x.tagCategorias),$=h(x.tagGrupos);return C!==x.activeTagsFilter&&(S.activeTagsFilter=C),w!==x.tagCategorias&&(S.tagCategorias=w),$!==x.tagGrupos&&(S.tagGrupos=$),Object.keys(S).length>0&&t.patchConfig(S),{cambiados:d}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const rc=3;function Yo(t){return t<.005?0:t}function cc(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function lc(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<rc)continue;const r=cc(i.meses.map(c=>c.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Yo(n),sigmaDeriva:Yo(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Wo(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:G(a*Math.hypot(n,s))}function dc(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),m=Math.max(0,(c-s)*12+(l-i)),d=Wo(e.sigmaMensual,m,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:G(r.saldoAcum+d),abajo:G(r.saldoAcum-d)}})}function uc(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const sa="financeapp_session",pc=["local","dropbox","firebase"];function mc(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!pc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function fc({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const g=n();if(g)try{v?g.setItem(sa,JSON.stringify(v)):g.removeItem(sa)}catch{}}function i(){const v=n();if(!v)return null;try{return mc(v.getItem(sa))}catch{return null}}function r(){const v=i();return v?(a()-v.ultimoUso)/6e4:null}function c(){const v=e();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(s(null),null):v:null}function m(v){const g=a(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return s(b),b}function d(){const v=i();v&&s({...v,ultimoUso:a()})}function u(){s(null)}return{abrir:m,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const Ko=["pointerdown","keydown","visibilitychange"];function gc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const m of Ko)s==null||s.addEventListener(m,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),e())},a);function l(){if(i){i=!1,n(c);for(const m of Ko)s==null||s.removeEventListener(m,r)}}return l}const vc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],bc="FinanceApp",hc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Jo(t){return new Uint8Array(new ArrayBuffer(t))}const ia="financeapp_bio_credencial",ra="financeapp_bio_secreto",ca="financeapp_bio_ultimo_desbloqueo",Qo="financeapp_bio_gracia_min",yc=5;function $c(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function $e(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function xe(t){const e=atob(t),a=Jo(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function xc(t){return $e(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function wc(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return xe(e)}function Xo(t){return t.getClientExtensionResults()}function Ic(t={}){const e=t.webauthn??$c(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(w=>crypto.getRandomValues(Jo(w)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function c(){const w=o==null?void 0:o.getItem(ia);if(!w)return null;try{const $=JSON.parse(w);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function l(){return c()!==null}async function m(w){const $=await a.importKey("raw",w,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:hc},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(w,$){const M=s(12),_=await a.encrypt({name:"AES-GCM",iv:M},w,new TextEncoder().encode($));return`${$e(M)}:${$e(_)}`}async function u(w,$){const[M,_]=$.split(":"),I=xe(M),y=xe(_),E=await a.decrypt({name:"AES-GCM",iv:I},w,y);return new TextDecoder().decode(E)}async function v(w,$){var N,H;if(!w)throw new Error("No hay clave de cifrado que envolver.");const M=s(32),_=s(32),I=s(16),y=await e.create({publicKey:{challenge:_,rp:{name:bc},user:{id:I,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:M}}},timeout:6e4}});if(!y)throw new Error("No se ha podido crear la credencial biométrica.");const E=Xo(y);if(!((N=E.prf)!=null&&N.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let A=((H=E.prf.results)==null?void 0:H.first)??null;if(A||(A=await g(y.rawId,M)),!A)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await m(A),z=await d(F,w),D={credencialId:xc(y.rawId),salt:$e(M),modo:$,creadaEn:n()},T=i();T.setItem(ia,JSON.stringify(D)),T.setItem(ra,z)}async function g(w,$){var _,I;const M=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:w,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return M?((I=(_=Xo(M).prf)==null?void 0:_.results)==null?void 0:I.first)??null:null}async function b(){const w=c();if(!w)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(ra);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const M=await g(wc(w.credencialId).buffer,xe(w.salt));if(!M)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const _=await m(M),I=await u(_,$);return f(),I}function x(){o==null||o.removeItem(ia),o==null||o.removeItem(ra),o==null||o.removeItem(ca)}function f(){o==null||o.setItem(ca,String(n()))}function h(){const w=o==null?void 0:o.getItem(Qo);if(w==null)return yc;const $=Number(w);return Number.isFinite($)&&$>0?$:0}function S(w){o==null||o.setItem(Qo,String(Math.max(0,Math.floor(w)||0)))}function C(){if(!l())return!1;const w=h();if(w<=0)return!1;const $=o==null?void 0:o.getItem(ca),M=$?Number($):NaN;return Number.isFinite(M)?n()-M<w*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:x,marcarDesbloqueo:f,dentroDeGracia:C,graciaMinutos:h,configurarGracia:S}}function Zo(){if(typeof localStorage<"u"){const $=cs();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=ys(),e=t.activo(),a=Qt(e),o=Xa(localStorage,a),n=ms({adapter:o}),s=fs(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Wt})`),n.subscribe($=>s.marcar($));function r(){var M,_,I,y,E;const $=globalThis;(_=(M=$.FirebaseService)==null?void 0:M.isConnected)!=null&&_.call(M)&&((E=(y=(I=$.FirebaseService).uploadRegistroProyectos)==null?void 0:y.call(I))==null||E.catch(A=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",A instanceof Error?A.message:A)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===e)??t.listar()[0],colecciones:St.filter($=>$!=="config"),crear:$=>{const M=t.crear($);return r(),M},renombrar:($,M)=>{t.renombrar($,M),r()},duplicar:($,M)=>{const _=t.duplicar($,M);return r(),_},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,M)=>{const _=$s(localStorage,$,M),I=xs(_),y=[];for(const E of M){const A=I[E];if(!Array.isArray(A)||A.length===0)continue;const F=n.get(E);n.set(E,[...F,...A]),y.push(E)}return y.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:y}}},l=Is(n),m=Ic(),d=fc({autoLogoutMinutos:()=>{var M,_;const $=(_=(M=globalThis.State)==null?void 0:M.get)==null?void 0:_.call(M,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>m.dentroDeGracia()}),u=sc(n),v=ic(n),g=pr(u),b=Sr(n),x=Ks({isEnabled:$=>l.isEnabled($)}),f=ks({flags:l,rutasExtra:()=>x.flagPorRuta()}),h=Ms({flags:l,onChange:()=>{var $,M;x.attachToShell(),f.apply(),(M=($=globalThis.Router)==null?void 0:$.rerender)==null||M.call($)}}),S=js({proyectos:c}),C=()=>{var M,_,I,y,E,A;const $=globalThis;if((_=(M=$.State)==null?void 0:M.load)==null||_.call(M),((y=(I=$.Router)==null?void 0:I.current)==null?void 0:y.call(I))==="dashboard")try{(A=(E=$.DashboardModule)==null?void 0:E.render)==null||A.call(E)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},w=Os({store:n,onDatosCambiados:C});return x.register(ci({store:n,onDatosCambiados:C})),x.register(hi({store:n,onDatosCambiados:C})),x.register(Gi({store:n,onDatosCambiados:C})),x.register(nc({store:n,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:C})),x.register(Zs({store:n,onDatosCambiados:C})),{version:Wt,core:dn,engine:{generarExtracto:Da,recomputarSaldoAcum:mn,saldoHoy:fn,sumarPorTags:Ta,providers:{proyectarGastos:Ut,proyectarPrestamos:Fe,proyectarTransferencias:Ca,proyectarNominas:De,proyectarInteresesCuentas:Aa,proyectarAportaciones:Sa,proyectarRetencionesFiscales:Ma,proyectarInflacionGastos:Ea,proyectarPerdidaAhorro:_a},analysis:hn,margins:Sn,avisos:_n,dashboard:Hn},store:n,flags:l,featureRegistry:{all:wt,porGrupo:no},ui:{openFeatures:h.open,openProyectos:S.open,openPersonas:w.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Hs({store:n,rerender:()=>{var M,_,I,y;const $=globalThis;(_=(M=$.State)==null?void 0:M.load)==null||_.call(M),(y=(I=$.Router)==null?void 0:I.rerender)==null||y.call(I)}}),avisoGuardado:null,instalarBuscador:()=>Ys({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>x.routes(),navegar:$=>{var M,_;return(_=(M=globalThis.Router)==null?void 0:M.navigate)==null?void 0:_.call(M,$)}})},app:x,session:Object.assign(d,{vigilar:$=>gc({sesion:d,onCaducada:$}),opciones:vc}),biometria:m,cambios:s,datos:{colecciones:St,snapshot:()=>Za(o),aplicar:($,{sellar:M=!0}={})=>{const I=gs(M?(y,E)=>o.set(y,E):(y,E)=>{const A=globalThis.StorageAdapter;A!=null&&A.setRestaurando?A.setRestaurando(y,E):o.set(y,E)},$);return n.load(),s.marcar("copia-restaurada"),I},faltantes:$=>vs($),esVacioOPorDefecto:()=>bs(Za(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:Ze,medirVariabilidad:lc,bandaDeConfianza:dc,bandaAcumulada:Wo,describirBanda:uc}}}function Cc(){try{const t=Zo();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const st=typeof window<"u"?Cc():null;if(st){let t=!1;const e=()=>{var a,o;if(st.app.attachToShell(),st.ui.applyGating(),!t){t=!0,st.ui.watchGating(),st.ui.instalarDeshacer(),st.ui.instalarBuscador();const n=globalThis,s=()=>{var c,l,m,d;return(l=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&l.call(c)?n.FirebaseService:(d=(m=n.DropboxService)==null?void 0:m.isConnected)!=null&&d.call(m)?n.DropboxService:null};st.ui.avisoGuardado=Ws({cambios:st.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=st.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>st.ui.openProyectos())),(a=document.getElementById("btn-proyectos"))==null||a.addEventListener("click",()=>st.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>st.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return we.bootstrap=Zo,Object.defineProperty(we,Symbol.toStringTag,{value:"Module"}),we}({});
//# sourceMappingURL=financeapp-core.js.map
