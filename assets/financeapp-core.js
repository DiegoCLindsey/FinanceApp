var FinanceAppBundle=function(Ce){"use strict";function W(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function k(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function K(){return W(new Date)}function Se(t,e){return new Date(t,e+1,0).getDate()}function pa(t,e,a){return W(new Date(t,e,Math.min(a,Se(t,e))))}function ie(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return W(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return pa(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),W(i)}return null}function ma(t,e){if(!e)return t;const a=k(t);return ie(a.getFullYear(),a.getMonth(),e)??t}const on=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],nn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ae(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${nn[a]||a+"º"} ${on[o]} del mes`}return t}function Ht(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function Gt(t){const e=k(t),a=e.getDay()===0?0:7-e.getDay();return e.setDate(e.getDate()+a),W(e)}function fa(t,e){const a=k(t);return a.setDate(a.getDate()+e),W(a)}function Pt(t,e,a){const o=Math.max(1,a),n=t.getFullYear(),s=t.getMonth(),i=(e.getFullYear()-n)*12+(e.getMonth()-s);if(i<=0)return{year:n,month:s};const r=s+Math.floor(i/o)*o;return{year:n+Math.floor(r/12),month:r%12}}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function G(t){return J(it(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ga(t){return(t||0).toFixed(2)+"%"}function Ct(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function va(t,e,a,o=0){const n=Ct(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const l=n*(1-Math.pow(1+i,-a))/i-s,m=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),d=i-l/m;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function ba(t,e,a,o,n=0,s=[],i={}){const r=[];let c=t;const l=k(o),m=e/100/12;let d=a,u=Ct(c,e,d);const v=[...s].sort((b,y)=>b.fecha.localeCompare(y.fecha));let g=0;for(let b=1;b<=a*2&&c>.01;b++){const y=new Date(l);l.setMonth(l.getMonth()+1);const f=ma(W(y),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const I=v[g],x=I.cantidad*(n/100);if(c-=I.cantidad,c=Math.max(0,c),I.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*m/u)/Math.log(1+m)):(d=a-b+1,u=Ct(c,e,d)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:x,capitalPendiente:c,esAmortizacion:!0,simulacion:I.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*m,C=Math.min(u-h,c);if(c-=C,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:h,amortizacion:C,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const ha=new Map;function X(t){var y;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=ha.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,m=ba(n,s,i,r,c||0,e,t),d=m.reduce((f,h)=>f+h.interes,0),u=m.reduce((f,h)=>f+h.comisionAmort,0),v=n*((l||0)/100),g=m.filter(f=>!f.esAmortizacion),b={cuota:Ct(n,s,i),totalIntereses:d,tae:va(n,s,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:((y=g.slice(-1)[0])==null?void 0:y.fecha)||"",mesesReales:g.length,tabla:m};return ha.set(a,b),b}function ya(t){const e=X(t),a=X({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function gt(t,e,a){if(!t||t.length===0)return 1;const o=k(e),n=k(a);if(n<=o)return 1;const s=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),l=s.filter(b=>b.year<=c),m=l.length>0?l[l.length-1]:s[0],d=(m?m.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,g=Ht(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function $a(t,e,a,o=0){const n=k(e),s=k(a);if(s<=n)return o;const i=Ht(n,s),r=t?[...t].sort((m,d)=>m.year-d.year):[];let c=0,l=new Date(n);for(;l<s;){const m=l.getFullYear(),d=new Date(m+1,0,1),u=d<s?d:s,v=Ht(l,u),g=r.filter(f=>f.year<=m),b=g.length>0?g[g.length-1]:null,y=b!==null?b.tasa:o;c+=y*v,l=u}return i>0?c/i:o}function xa(t,e){return((1+t/100)/(1+e/100)-1)*100}function sn(t,e,a,o){const n=gt(e,a,o);return n>0?t/n:t}function rn(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:m=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,b=g,y=c>0?b/c*100:null,f=r?l-m:l,h=c>0?f/c*100:null,C=c>0?l/c*100:null,I=c>0?(d+l+v)/c*100:null,x=c>0?u/c*100:null,$=(P,w,E)=>P===null?"neutral":P>=w?"verde":P>=E?"amarillo":"rojo",S=(P,w,E)=>P===null?"neutral":P<=w?"verde":P<=E?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:m,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:y,dti:h,dtiTotal:C,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:x,semAhorro:$(y,a,o),semDTI:S(h,n,s),semNecesidades:S(I,i[0],i[0]+15),semDeseos:S(x,i[1],i[1]+10),semAhorroRegla:$(y,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function vt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Vt(t,e){const a=Me(t,e);return a?a.saldo:e>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Me(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];return a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=a&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=e)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e)??null}function wa(t,e){let a="";for(const o of t){const n=Me(o,e);n&&n.fecha>a&&(a=n.fecha)}return a}function cn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ln(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}function re(t){var e,a;return((e=t.find(o=>o.esPorDefecto))==null?void 0:e._id)??((a=t[0])==null?void 0:a._id)??"default"}function dn(t,e){if(e<=0)return[];const a=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/e),s=o-n*e;return Array.from({length:e},(i,r)=>a*(n+(r<s?1:0)))}function un(t,e,a,o){if(a===0)return{ids:t,cts:e};const n=t.indexOf(o);if(n>=0){const s=[...e];return s[n]+=a,{ids:t,cts:s}}return{ids:[...t,o],cts:[...e,a]}}function _t(t,e,a){const o=it(t);if(!e||e.participantes.length===0)return[{personaId:a,importe:J(o)}];const n=e.participantes.map(d=>d.personaId);if(e.modo==="partesIguales"){const d=dn(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(d[v])}))}const s=e.participantes.map(d=>{const u=Math.max(0,d.valor??0);return e.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=s.map(g=>Math.round(g*d)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),n.map((g,b)=>({personaId:g,importe:J(u[b])}))}const c=o-i,{ids:l,cts:m}=un(n,s,c,a);return l.map((d,u)=>({personaId:d,importe:J(m[u])}))}function Ee(t,e){return t.find(a=>a._id===e||e.startsWith(`${a._id}_`))}function pn(t,e,a){const o=re(a),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of a)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Ee(e.expenses,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Ee(e.loans,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Ee(e.nominas,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).ingresos+=l.importe}}}return[...n.values()]}function Pe(t,e,a){const o=n=>!n||n.participantes.length===0?[a]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(e)])}const bt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Ia(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function ht(t,e){return Ia(t,e).baseImponible}function Ca(t,e){return lt(t,e)/12}const Ut=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function _e(t,e){if(!t||t<=0)return 0;const a=e||Ut;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],c=s<a.length-1?a[s+1][0]:1/0,l=Math.min(n,c-i);if(!(l<=0)&&(o+=l*(r/100),n-=l,n<=0))break}return o}function ce(t,e){if(rt(t)!=="inversion")return null;const a=vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=_e(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function Fe(t,e=new Date){var u;if(rt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=vt(t),n=W(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=s.reduce((v,g)=>v+g.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,m=Math.min(o,i+c*l),d=Math.max(0,o-m);return{saldo:o,disponible:m,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function Sa(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=vt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((l,m)=>l+m.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function De(t,e,a){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,m)=>l+(m.bruto||0)*(m.nPagas||12),0),i=[...a||[]].sort((l,m)=>l[0]-m[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,m]of i)if(s>=l)r=m;else break;return r}const mn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Ut,TRAMOS_IRPF_DEFAULT:bt,agregarPorPersona:pn,ajustarFechaPago:ma,ajustarPrecioReal:sn,arranqueMensual:Pt,calcBaseImponibleTrabajo:ht,calcFactorInflacion:gt,calcFondoInversion:ce,calcFondosPension:Fe,calcGananciasCapital:_e,calcIRPF:lt,calcImpuestoPension:Sa,calcInflacionMediaAnual:$a,calcSaludFinanciera:rn,calcTAE:va,calcTipoMarginalPension:De,calcTipoRealFisher:xa,calcularReparto:_t,clampedDate:pa,cuotaMensual:Ct,desgloseBaseTrabajo:Ia,diasEntre:Ht,entradaSaldo:Me,fechaUltimoSaldoConocido:wa,finDeSemana:Gt,formatEUR:F,formatLocalDate:W,formatPct:ga,fromCents:J,haySimulaciones:ln,idPersonaPorDefecto:re,labelDiaPago:Ae,lastDayOfMonth:Se,modeloFondoDe:rt,parseLocalDate:k,personasImplicadas:Pe,resolverDiaEfectivo:ie,resumenPrestamo:X,resumenPrestamoConAhorro:ya,retencionMensual:Ca,roundMoney:G,saldoEnFecha:Vt,saldoRealCuenta:vt,sinSimulaciones:cn,sumarDias:fa,tablaAmortizacion:ba,toCents:it,todayISO:K},Symbol.toStringTag,{value:"Module"}));function Yt(t,e,a=null){const o=[],n=k(e.start),s=k(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=k(i.fechaInicio||e.start),c=i.fechaFin?k(i.fechaFin):s,l=i.cuantia,m=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&m(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=Pt(r,n,d);const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const y=ie(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),C=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,C)))})(),f=k(y);if(f>s||f>c)break;f>=n&&f>=r&&m(y),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=s&&u<=c;)m(W(u)),u=new Date(u.getTime()+d)}}return o}function Te(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Aa(t,e,a=null,o={accounts:[]}){const n=[],s=k(e.start),i=k(e.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>bt),m=o.resolverTramosGanancias||(()=>Ut),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(u.cuenta||"default")||a.includes(u.cuentaDestino||"default")))continue;const v=k(u.fechaInicio||e.start),g=u.fechaFin?k(u.fechaFin):i,b=y=>{const f=r.find(_=>_._id===(u.cuenta||"default")),h=r.find(_=>_._id===(u.cuentaDestino||"default")),C=rt(f),I=rt(h),x=C==="inversion"&&I==="inversion"||C==="pension"&&I==="pension",$=["transferencia",...x?["traspaso"]:[],...u.tags||[]],S=x?"traspaso-out":"transfer-out",P=x?"traspaso-in":"transfer-in",w=!a||a.length===0||a.includes(u.cuenta||"default"),E=!a||a.length===0||a.includes(u.cuentaDestino||"default");if(w&&n.push({fecha:y,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:$,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:S}),E&&n.push({fecha:y,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:$,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:P}),w&&!x&&f){if(C==="inversion"){const _=parseInt(y.slice(0,4)),M=ce(f,m(_));if(M&&M.saldo>0&&M.plusvalia>0){const A=Math.min(1,u.cuantia/M.saldo),D=M.plusvalia*A*.19;D>.01&&n.push({fecha:y,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(C==="pension"){const _=l(parseInt(y.slice(0,4))),M=De(f,c,_),A=Sa(f,u.cuantia,M||void 0);if(A>0){const z=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${M}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:y,concepto:z,cuantia:A,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const y=Math.max(1,u.frecuencia||1);let{year:f,month:h}=Pt(v,s,y);const C=Math.ceil(240/y)+2;for(let I=0;I<C;I++){const x=ie(f,h,u.diaPago||"")||(()=>{const S=v.getDate(),P=new Date(f,h+1,0).getDate();return W(new Date(f,h,Math.min(S,P)))})(),$=k(x);if($>i||$>g)break;$>=s&&$>=v&&b(x),h+=y,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const y=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/y);f=new Date(v.getTime()+h*y)}for(;f<=i&&f<=g;)b(W(f)),f=new Date(f.getTime()+y)}}return n}function Ma(t,e,a=null){const o=[],n=k(e.start),s=k(e.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const m=k(l.fechaInicio||e.start),d=l.fechaFin?k(l.fechaFin):s,u=l.cuentaOrigen||"default",v=!a||!a.length||a.includes(u),g=!a||!a.length||a.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",y=x=>{v&&o.push({fecha:x,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:x,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:h,month:C}=Pt(m,n,f);const I=Math.ceil(240/f)+2;for(let x=0;x<I;x++){const $=new Date(h,C+1,0).getDate(),S=W(new Date(h,C,Math.min(m.getDate(),$))),P=k(S);if(P>s||P>d)break;P>=n&&P>=m&&y(S),C+=f,C>=12&&(h+=Math.floor(C/12),C=C%12)}}}return o}function Ea(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=k(e.start),r=k(e.end),c=s.periodoCobro||"mensual",l=c==="mensual",m=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:m/(365.25*864e5);let u=Vt(s,e.start);const v=o.filter(y=>y.cuenta===s._id).map(y=>({fecha:y.fecha,delta:y.tipo==="ingreso"?Math.abs(y.cuantia):-Math.abs(y.cuantia)})).sort((y,f)=>y.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const y=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+m),f=new Date(Math.min(y.getTime(),r.getTime()+1)),h=W(f);let C=0;for(;g<v.length&&v[g].fecha<h;)C+=v[g].delta,g++;const I=u,x=u+C,$=Math.max(0,(I+x)/2);u=x;const S=l?d:(f.getTime()-b.getTime())/(365.25*864e5),P=$*(Math.pow(1+s.interes/100,S)-1);P>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:P,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=y}}return n}function Pa(t,e,a,o=null){const n=[],s=e||bt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Ca(r,s),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Yt([l],a,o))}return n}const fn=[5,11,2,8],gn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ze(t,e,a=null,o=[],n=()=>bt){const s=[],i=k(e.start),r=k(e.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function m(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||e.start,b=k(g),y=k(v);let f=0;for(let C=b.getFullYear();C<=y.getFullYear();C++){const I=new Date(C,u.mesActualizacionIPC-1,1);I>b&&I<=y&&f++}if(f===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*gt(o,g,h)}function d(u,v){const g=m(u,v),b=(u.retribucionFlexible||[]).reduce((_,M)=>_+(M.importe||0)*12,0),y=Math.max(0,g-b);if(u.irpfModo==="manual")return y*((u.irpfPct||0)/100);const f=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return lt(ht(g,b),f);const C=l[h].filter(_=>_.activo),I=C.reduce((_,M)=>_+m(M,v),0),x=C.reduce((_,M)=>_+(M.retribucionFlexible||[]).reduce((A,z)=>A+(z.importe||0)*12,0),0),$=Math.max(0,I-x),S=ht(I,x),P=Math.max(0,g-b),w=$>0?S*(P/$):0,E=C.filter(_=>_._id!==u._id&&(_.bruto||0)>(u.bruto||0)).reduce((_,M)=>{const A=(M.retribucionFlexible||[]).reduce((D,T)=>D+(T.importe||0)*12,0),z=Math.max(0,m(M,v)-A);return _+($>0?S*(z/$):0)},0);return lt(E+w,f)-lt(E,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=k(u.fechaInicio||e.start),y=u.fechaFin?k(u.fechaFin):r,f=h=>{const C=m(u,h),I=d(u,h),x=(u.retribucionFlexible||[]).reduce((A,z)=>A+(z.importe||0)*12,0),$=Math.max(0,C-x),S=(u.ssPct??6.35)/100,P=$*S,w=$/g,E=I/g,_=P/g,M=u.representacion==="simplificado"?w-_-E:w;s.push({fecha:h,concepto:u.nombre,cuantia:M,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(_>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),E>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const A of u.retribucionFlexible||[])!A.cuenta||!(A.importe>0)||a&&a.length>0&&!a.includes(A.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${gn[A.tipo]||A.tipo}`,cuantia:A.importe,tipo:"ingreso",cuenta:A.cuenta,tags:["retribucion-flexible",A.tipo],sourceId:`${u._id}_flex_${A._id||A.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),C=b.getDate();let{year:I,month:x}=Pt(b,i,h);for(let $=0;$<300;$++){const S=new Date(I,x+1,0).getDate(),P=new Date(I,x,Math.min(C,S));if(P>r||P>y)break;P>=i&&P>=b&&f(W(P)),x+=h,x>=12&&(I+=Math.floor(x/12),x=x%12)}}else{const h=g-12,C=b.getDate();let{year:I,month:x}=Pt(b,i,1);for(let P=0;P<300;P++){const w=new Date(I,x+1,0).getDate(),E=new Date(I,x,Math.min(C,w));if(E>r||E>y)break;E>=i&&E>=b&&f(W(E)),x++,x>=12&&(I++,x=0)}const $=Math.max(b.getFullYear(),i.getFullYear()),S=Math.min((u.fechaFin?y:r).getFullYear(),r.getFullYear());for(let P=$;P<=S;P++)for(const w of fn.slice(0,h)){const E=new Date(P,w,15);E>=i&&E<=r&&E>=b&&E<=y&&f(W(E))}}}return s}function _a(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=k(a.start),r=k(a.end),c=K(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let m=new Date(i.getFullYear(),i.getMonth(),1);for(;m<=r;){const d=m.getFullYear(),u=m.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=W(new Date(d,u+1,0)),y=W(new Date(d,u,15));let f=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const C=h.fechaInicio||c,I=gt(e,C,y);if(I<=1)continue;const x=Math.max(1,h.frecuencia||1);f+=h.cuantia*(I-1)/x}f>.01&&s.push({fecha:y,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),m=new Date(d,u+1,1)}return s}function Fa(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=k(a.start),i=k(a.end),r=[...e].sort((l,m)=>l.year-m.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),m=c.getMonth(),d=l+"-"+String(m+1).padStart(2,"0"),u=W(new Date(l,m,15)),v=r.filter(h=>h.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,y=Math.pow(1+b,1/12)-1,f=t*y;f>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,m+1,1)}return n}function Da(t,e){const a=e.fechaReferencia||e.dashboardStart,o=a<e.dashboardStart?e.dashboardStart:a>e.dashboardEnd?e.dashboardEnd:a,n=t.reduce((i,r)=>i+Vt(r,o),0),s=wa(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function Ta(t,e,a){const{fecha:o,saldo:n}=Da(e,a),s=t.filter(m=>m.fecha<o),i=t.filter(m=>m.fecha>=o),r=[];let c=n;for(const m of[...s].reverse()){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);r.unshift({...m,delta:d,saldoAcum:c}),c-=d}const l=[];c=n;for(const m of i){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);c+=d,l.push({...m,delta:d,saldoAcum:c})}return[...r,...l]}function vn(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ta([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function za(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(y=>y.activo&&(!s||s.length===0||s.includes(y._id))),l=Da(c,n),m={start:l.fecha<n.dashboardStart?l.fecha:n.dashboardStart,end:n.dashboardEnd},d=a.filter(y=>y.tipo!=="transferencia"),u=a.filter(y=>y.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Yt(d,m,s)),g=g.concat(Te(e,m,s)),g=g.concat(Aa(u,m,s,v)),g=g.concat(Ma(o,m,s));const b=Ea(o,m,s,g);if(g=g.concat(b),g=g.concat(Pa(a,n.tramos_irpf,m,s)),g=g.concat(ze(i,m,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const y=(o.find(C=>C.activo&&C.esCuentaPrincipal)||o.find(C=>C.activo)||{_id:"default"})._id;g=g.concat(_a(d,r,m,s,y));const h=o.filter(C=>C.activo&&(!s||s.length===0||s.includes(C._id))).reduce((C,I)=>C+Vt(I,n.dashboardStart),0);g=g.concat(Fa(h,r,m,y))}return g.sort((y,f)=>y.fecha.localeCompare(f.fecha)),Ta(g,c,n).filter(y=>y.fecha>=n.dashboardStart)}function bn(t,e,a=null){const o=K(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,c)=>r+vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function ja(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function hn(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${F(i)})`})))}return a}function yn(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=k(e.dashboardStart),n=k(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function $n(t,e,a=K()){const o=new Set,n=e.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=a&&(l[c]=r.saldoInicial||0);for(const m of r.historicoSaldos||[])m.fecha<=a&&(!c||m.fecha>=c)&&(l[m.fecha]=m.saldo);return Object.keys(l).forEach(m=>o.add(m)),l}),s={};for(const r of[...o].sort()){let c=0;for(let l=0;l<e.length;l++){const m=Object.entries(n[l]).filter(([d])=>d<=r);m.length>0?(m.sort(([d],[u])=>u.localeCompare(d)),c+=m[0][1]):c+=e[l].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([l],[m])=>l.localeCompare(m))){const l=t.filter(v=>v.fecha<=r),m=l.length>0?l[l.length-1].saldoAcum:null;if(m===null)continue;const d=c-m,u=m!==0?d/Math.abs(m)*100:0;i.push({cuenta:"Total",fecha:r,estimado:m,real:c,desv:d,pct:u})}return i}const xn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:$n,detectarPuntosCriticos:hn,mediaMensualGastos:yn},Symbol.toStringTag,{value:"Module"}));function Wt(t,e=new Date){const a=W(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Yt(s,{start:a,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function wn(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Ct(a.capital,a.tin,a.meses),0)}function In(t,e){return X(t).tabla.filter(a=>!a.esAmortizacion&&a.fecha>=e).length}function qa(t,e,a){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+Ct(n.capital,n.tin,n.meses)*Math.min(e,In(n,a)),0)}function Na(t,e,a,o=new Date){if(e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0)return e.colchonFijo;const n=Wt(t,o),s=e.colchonMeses||6;return n*s+qa(a,s,W(o))}function Cn(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,m)=>l.fecha.localeCompare(m.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Na(t,e,a,n);if(i.tipo==="fijo")return i.importe||0;const r=Wt(t,n),c=i.meses||6;return r*c+qa(a,c,o)}function je(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((m,d)=>m.fecha.localeCompare(d.fecha)),c=r.filter(m=>m.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Wt(e,i)+wn(o))*(c.meses||1):0}function Sn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function An(t,e){const a={};for(const o of e)a[o._id]=vt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=Sn(o)),{fecha:o.fecha,saldos:{...a}}))}function Mn(t,e,a,o,n,s,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let m=0;m<e.length;m++){const d=e[m],u=je(c,o,n,s,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var y,f;return g+(((f=(y=a[m])==null?void 0:y.saldos)==null?void 0:f[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const En=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Na,calcColchonEnFecha:Cn,calcGastoBasicoMensual:Wt,calcMargenEnFecha:je,detectarCrucesMargenes:Mn,saldosPorCuentaEnExtracto:An},Symbol.toStringTag,{value:"Module"}));function Pn(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Ra(t,e){return Ht(k(t),k(e))}const _n=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function La(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${_n[o-1]}${s?"":` de ${a}`}`}function Oa(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Fn(t,e={}){const{hoy:a=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${F(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${F(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${F(d.saldo)}, y el margen pide ${F(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=Ra(a,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:n))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Oa(u),titulo:d.titulo(g),detalle:d.detalle(La(d.fecha,a)),incierto:g})}const m={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||m[d.gravedad]-m[u.gravedad]),l.slice(0,s)}const Dn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Pn,construirAvisos:Fn,describirPlazo:Oa,diasEntreISO:Ra,fechaEnPalabras:La},Symbol.toStringTag,{value:"Module"})),Tn=30.44*864e5;function ka(t){const e=t.getFullYear(),a=t.getMonth();return{desde:W(new Date(e,a,1)),hasta:W(new Date(e,a,Se(e,a)))}}function Ba(t){const[e,a]=t.split("-").map(Number);return ka(new Date(e,a-1,1))}function zn(t,e){return Math.max(1,(k(e).getTime()-k(t).getTime())/Tn)}const jn=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),yt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function qn(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Nn(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=e.loanIdsIniciados,s=yt(t.filter(u=>u.tipo==="ingreso")),i=yt(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=yt(t.filter(u=>o(u)&&e.hipotecaIds.has(u.sourceId??""))),c=yt(t.filter(u=>u.sourceType==="loan-amort")),l=yt(t.filter(u=>u.sourceType==="account-interest")),{basicos:m,deseo:d}=qn(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:c/a,gastosBasicos:m/a,gastosDeseo:d/a,gastosTotales:(i+m+d)/a,intereses:l/a}}function Ha(t,e){return t.reduce((a,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Rn(t,e,a,o){const n=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=a),s=n.reduce((l,m)=>{if((m.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return l;const u=X(m).totalIntereses,v=X({...m,amortizaciones:(m.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return l+Math.max(0,v-u)},0),i=n.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:X(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=e&&l.fechaFin<=a),r=n.map(l=>X(l).tabla),c=l=>{const{desde:m,hasta:d}=Ba(l);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=m&&b.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:Ha(n,e),deudaFin:Ha(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(e.slice(0,7)),cuotasFin:c(a.slice(0,7)),finEnPeriodo:i}}function Ln(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:yt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Ga(t,e=new Set,a="desglosado"){if(e.size===0)return ja(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(l=>e.has(l)),r=s.filter(l=>!e.has(l)),c=a==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(n.cuantia))}return o}function On(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Ga(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function kn(t,e){const a=e.reduce((o,n)=>o+vt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:yt(t.filter(o=>o.tipo==="gasto")),totalIngresos:yt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Bn(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Hn(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function Gn(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Vn(t,e){if(t.length===0)return[];const a=l=>e==="mes"?l.slice(0,7):l.slice(0,4),o=l=>e==="mes"?`${l}-01`:`${l}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const l of t){const m=a(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==m)&&(c&&(i=c.cierre),c={periodo:m,inicio:o(m),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const Un=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Vn,cuentasVisibles:Bn,gastoPorTagOrdenado:On,idsHipoteca:Hn,idsPrestamosIniciados:Gn,interesesPorCuenta:Ln,mesesDelPeriodo:zn,metricasFlujo:Nn,rangoMes:Ba,rangoMesDe:ka,resumenPrestamosPeriodo:Rn,sinTransferencias:jn,sumarGastosPorTag:Ga,totalesPeriodo:kn},Symbol.toStringTag,{value:"Module"}));function Yn(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function Ft(t,e){return a=>Yn(t,e,a)}const Kt=10,Va=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ua=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function qe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ya="default";function Wa(){return{_id:Ya,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Ka(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Va,tramosGananciasCapital:Ua,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Ja(t,e){return{loans:[],expenses:[],accounts:[qe(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Wa()],config:Ka(t,e)}}const dt=t=>Array.isArray(t)?t:[],Wn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Jt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Qa(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Ne(t){const{varianza:e,inflacion:a,...o}=t;return o}function Kn(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Wn(t.config),r={...Ka(a,o)};for(const[m,d]of Object.entries(s))d!=null&&(r[m]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Va),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Ua),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(m=>{const d={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...m};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Jt(d)});c.length===0&&(c=[qe(a)]);const l=c.filter(m=>m.esCuentaPrincipal);if(l.length===0){const m=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===m._id}))}else if(l.length>1){let m=!1;c=c.map(d=>d.esCuentaPrincipal?m?{...d,esCuentaPrincipal:!1}:(m=!0,d):d)}return n.accounts=c,n.expenses=dt(t.expenses).map(m=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Qa(d.diaPago),Ne(Jt(d))}),n.loans=dt(t.loans).map(m=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...m};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Qa(d.diaPago),d.amortizaciones=dt(d.amortizaciones).map(u=>Jt(u)),Ne(Jt(d))}),n.nominas=dt(t.nominas).map(m=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ne(Jt(d))}),n.goals=dt(t.goals).map((m,d)=>{const u=Array.isArray(m.cuentaIds)?m.cuentaIds:m.cuentaId?[m.cuentaId]:[],{cuentaId:v,...g}=m;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:m,...d})=>d),n}const Dt=t=>Array.isArray(t)?t:[];let Re=0;function Jn(t){return Re+=1,`${t}_${Re.toString(36)}`}const Qn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xn=t=>typeof t=="number"&&Number.isFinite(t);function Zn(t,e){const a={...t};Re=0;const o=Dt(t.transacciones),n=Dt(t.puntosControl),s=[...n],i=new Set(n.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,m,d,u)=>{if(!Qn(m)||!Xn(d))return;const v=`${l}|${m}`;i.has(v)||(i.add(v),s.push({_id:Jn("pc"),fecha:m,cuentaId:l,saldoCts:it(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of Dt(t.accounts)){const m=typeof l._id=="string"?l._id:null;if(m)for(const d of Dt(l.historicoSaldos))r(m,d.fecha,d.saldo,d.nota)}const c=Dt(t.history);if(c.length>0){const l=Dt(t.accounts),m=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(m==null?void 0:m._id)=="string"?m._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((l,m)=>String(l.fecha).localeCompare(String(m.fecha))),a}const Le=t=>Array.isArray(t)?t:[],ts=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),es=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Oe=0;function as(){return Oe+=1,`tx_hp_${Oe.toString(36)}`}function os(t,e){const a={...t};Oe=0;const o=[...Le(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Le(t.expenses).map(i=>{const r=Le(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",m=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!ts(g.fecha)||!es(g.cuantia))continue;const b=m==="ingreso"?it(g.cuantia):-it(g.cuantia),y=`${c}|${g.fecha}|${b}`;n.has(y)||(n.add(y),o.push({_id:as(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:m,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const Xa=t=>Array.isArray(t)?t:[],$t=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Tt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,ns=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function ss(t,e){var m;const a={...t};if(Array.isArray(a.planes))return a;const o=Xa(a.goals),n=Xa(a.accounts),s=n.map(d=>{const u=Tt(d.bloqueoMeses,0);return{_id:`veh_${$t(d._id,"x")}`,nombre:$t(d.nombre,"Cuenta"),rentabilidadRealAnual:Tt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Tt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?it(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:$t(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Tt(d.interes,0)>0}}),i=new Map(n.map((d,u)=>[$t(d._id,""),s[u]._id])),r=((m=s[0])==null?void 0:m._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>$t(b,"")):[],g=ns(d.targetDate);return{_id:$t(d._id,`obj_mig_${u}`),nombre:$t(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(Tt(d.targetAmount,0)),fechaLimite:g,prioridad:Tt(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:$t(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:e.hoyISO};return a.planes=[l],a}function is(t,e){const a={...t},o=Array.isArray(a.personas)?a.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ya)||(a.personas=[Wa(),...o]),a}const Qt=t=>Array.isArray(t)?t:[];function le(t){const{escenarioIds:e,...a}=t;return Array.isArray(a.amortizaciones)&&(a.amortizaciones=a.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),a}function rs(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function cs(t,e){const a={...t};if(a.escenarios===void 0&&a.planes===void 0&&a.goals===void 0)return a;if(a.loans=Qt(a.loans).map(le),a.expenses=Qt(a.expenses).map(le),a.nominas=Qt(a.nominas).map(le),a.accounts=Qt(a.accounts).map(le),delete a.escenarios,a.config&&typeof a.config=="object"){const{escenarioActivo:n,...s}=a.config;a.config=s}delete a.goals;const o=Qt(a.planes).filter(rs);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),a._migracion010_planesArchivados=o),delete a.planes,a}const ls=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Kn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Zn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:os},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:ss},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:is},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:cs}],ds=["history"];function Za(t,e,a){let o=t;const n=[];for(const s of[...ls].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const xt="state_",de="state__schemaVersion",zt="financeapp_",ke="state__modificadoEn";function to(t=localStorage,e=zt){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==ke&&t.setItem(a(ke),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function us(t=localStorage,e=zt){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(xt)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function ps({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const ms={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function fs(t,e){const a=ms[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function gs(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function vs({adapter:t,hoy:e=new Date}){const a=W(e),o=gs(e);let n=Ja(a,o);const s=new Set;let i=[];const r=ps();function c(M){for(const A of s)A(M)}function l(M){t.set(`${xt}${M}`,n[M])}function m(){const M={};for(const T of Object.keys(n)){const R=t.get(`${xt}${T}`);R!==null&&(M[T]=R)}for(const T of ds){const R=t.get(`${xt}${T}`);R!==null&&(M[T]=R)}const A=t.get(de),{state:z,applied:D}=Za(M,A,{hoyISO:a,finISO:o});if(n=z,d(),D.length>0){for(const T of Object.keys(n))l(T);t.set(de,Kt)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[qe(a)],l("accounts");return}const M=n.accounts.filter(A=>A.esCuentaPrincipal);if(M.length===0)n.accounts=n.accounts.map((A,z)=>z===0?{...A,esCuentaPrincipal:!0}:A),l("accounts");else if(M.length>1){let A=!1;n.accounts=n.accounts.map(z=>z.esCuentaPrincipal?A?{...z,esCuentaPrincipal:!1}:(A=!0,z):z),l("accounts")}}function u(M){return n[M]}function v(M,A){n[M]=A,l(M),c(M)}function g(M){v("config",{...n.config,...M})}function b(M){return s.add(M),()=>s.delete(M)}function y(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(M,A){const z=[...n[M]],D={...A,_id:y()};return z.push(D),v(M,z),D}function h(M,A,z){const D=n[M].map(T=>T._id===A?{...T,...z}:T);v(M,D)}function C(M,A){const z=n[M],D=z.findIndex(T=>T._id===A);D<0||(r.registrar({col:M,item:z[D],indice:D}),v(M,z.filter((T,R)=>R!==D)))}function I(){const M=r.tomar();if(!M)return null;const A=[...n[M.col]];return A.splice(Math.min(M.indice,A.length),0,M.item),v(M.col,A),M}function x(){return r.pendiente()}function $(){const M=n.accounts||[],A=M.find(z=>z.esCuentaPrincipal&&z.activo)||M.find(z=>z.activo);return A?A._id:"default"}function S(M){var A;return((A=n.accounts.find(z=>z._id===M))==null?void 0:A.nombre)??M}function P(){return Ft(n.tramosIRPFHistorico,n.config.tramos_irpf)}function w(){return Ft(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function E(){return structuredClone(n)}function _(M,A=null){const{state:z,applied:D}=Za(M,A,{hoyISO:a,finISO:o});n=z,d();for(const T of Object.keys(n))l(T);t.set(de,Kt);for(const T of Object.keys(n))c(T);return{applied:D}}return{load:m,get:u,set:v,patchConfig:g,subscribe:b,addItem:f,updateItem:h,removeItem:C,deshacerBorrado:I,borradoPendiente:x,getPrincipalAccountId:$,accountName:S,resolverTramosIRPF:P,resolverTramosGanancias:w,snapshot:E,replaceAll:_,get schemaVersion(){return Kt},get migrationsApplied(){return[...i]},get today(){return a||K()}}}function bs(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const St=Object.keys(Ja("1970-01-01","1970-01-01"));function eo(t){const e={};for(const a of St){const o=t.get(`${xt}${a}`);o!=null&&(e[a]=o)}return e}function hs(t,e){const a=[];for(const o of St){const n=e[o];n!=null&&(t(`${xt}${o}`,n),a.push(o))}return a}function ys(t){return St.filter(e=>t[e]===void 0||t[e]===null)}function $s(t){var i;const e=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!St.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>e(r).length===0))return!1;const o=e("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?e("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const ao=`${zt}meta_proyectos`,oo=`${zt}meta_proyectoActivo`,At="default",xs="Mis finanzas";function Be(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Xt(t){return t===At?zt:`${zt}p_${t}_`}function no(){return[...St.map(t=>`${xt}${t}`),de,ke]}function ws(t=localStorage){function e(){try{const d=t.getItem(ao);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function a(d){t.setItem(ao,JSON.stringify(d))}function o(){const d=e();if(d.some(g=>g._id===At))return d;const u=Date.now(),v=[{_id:At,nombre:xs,creadoEn:u,actualizadoEn:u},...d];return a(v),v}function n(){try{const d=t.getItem(oo);if(!d)return At;const u=JSON.parse(d);return typeof u=="string"&&u?u:At}catch{return At}}function s(d){t.setItem(oo,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:Be(),nombre:u,creadoEn:v,actualizadoEn:v};return a([...o(),g]),g}function r(d,u){const v=u.trim();v&&a(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=Xt(d),b={_id:Be(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},y=Xt(b._id);for(const f of no()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${y}${f}`,h)}return a([...o(),b]),b}function l(d){if(d===At)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=Xt(d);for(const g of no())t.removeItem(`${v}${g}`);a(u.filter(g=>g._id!==d))}function m(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return a(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:m}}function Is(t,e,a){const o=to(t,Xt(e)),n={};for(const s of a){const i=o.get(`${xt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Cs(t){const e=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!e.has(i)&&e.set(i,Be())}function a(n){if(typeof n=="string")return e.get(n)??n;if(Array.isArray(n))return n.map(a);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=a(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(a);return o}const at={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},wt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:at.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:at.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:at.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:at.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:at.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:at.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:at.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:at.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:at.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:at.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:at.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:at.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:at.datos,porDefecto:!1,dependencias:["sync-nube"]}],Ss=new Map(wt.map(t=>[t.id,t]));function Zt(t){return Ss.get(t)}function so(t){return wt.filter(e=>(e.dependencias||[]).includes(t))}function He(){const t={};for(const e of wt)t[e.id]=e.porDefecto;return t}function io(){const t=[],e=new Map;for(const a of wt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function As(t){function e(){return{...He(),...t.get("config").features||{}}}function a(d){t.patchConfig({features:d})}function o(d,u=e(),v=new Set){const g=Zt(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(d,u=e()){const v=Zt(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function s(d,u){var C;const v=Zt(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),b=new Map(wt.map(I=>[I.id,o(I.id,g)])),y={...g,[d]:u};let f;if(u){const I=[...v.dependencias||[]];for(;I.length;){const x=I.pop();y[x]===!1&&(y[x]=!0,f="dependencias-activadas"),I.push(...((C=Zt(x))==null?void 0:C.dependencias)||[])}}else{const I=so(d).map(x=>x.id);for(;I.length;){const x=I.pop();y[x]!==!1&&(y[x]=!1,f="cascada-apagado"),I.push(...so(x).map($=>$.id))}}return a(y),{cambiadas:wt.filter(I=>o(I.id,y)!==b.get(I.id)).map(I=>I.id),motivo:f}}function i(){const d=e();return wt.map(u=>{const v=n(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=e();return io().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=n(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){a(He())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:e()}}function m(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=He(),b=[],y=[];for(const[f,h]of Object.entries(v)){if(!Zt(f)){y.push(f);continue}if(typeof h!="boolean"){y.push(f);continue}g[f]=h,b.push(f)}return a(g),{aplicadas:b,ignoradas:y}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:m,bloqueadaPor:d=>n(d)}}const te=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function jt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Ms(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(te).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${te(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${te(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${te(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function Es(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${te(o)}</div>
        ${n.map(Ms).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Ps(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function _s(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Es(a)}`,n(i)}function n(i){var c,l,m;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=a.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&jt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&jt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=a.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=e.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(v),jt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:b}=a.importProfile(JSON.parse(await d.text()));jt(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){jt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(m=i.querySelector('[data-feature-action="reset"]'))==null||m.addEventListener("click",()=>{var d;a.reset(),jt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=Ps(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Fs={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function ro(t){return Fs[t]??t}function mt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function co(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Ds(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Ts(){var e,a,o,n;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function zs(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function js(t,e){const a=t._id===e,o=t._id==="default";return`
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
    </div>`}function qs(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=a.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(ro(i))}
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
    </div>`}function Ns(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Rs(t){const e=t.document??document,{proyectos:a}=t;function o(){const r=a.listar(),c=a.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>js(l,c)).join("")}
      </div>
      ${Ns()}
      ${qs(r,c,a.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(m=>{m.addEventListener("click",()=>{const d=m.dataset.proyectoId,u=m.dataset.proyectoAccion,v=a.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!co(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;a.cambiarA(d),Ds(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;a.renombrar(d,g.trim()),mt(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const y=a.duplicar(d,b.trim()||g);mt(t,`"${y.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!co(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(d),mt(t,`"${v.nombre}" eliminado`),n(r)}catch(g){mt(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const m=r.querySelector("#proyecto-nuevo-nombre"),d=m==null?void 0:m.value.trim();if(!d){mt(t,"Ponle un nombre al proyecto","warn");return}const u=a.crear(d);mt(t,`"${u.nombre}" creado ✓`),n(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const m=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!m)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){mt(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=a.importarDesde(m,d);if(u.length===0){mt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}mt(t,`Importado: ${u.map(ro).join(", ")} ✓`),Ts(),n(r)})}function i(){const r=zs(e);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const ue=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Mt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function qt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Ls(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Os(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function ks(t){const e=t.color||ue[0];return`
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
    </div>`}function Bs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${ue.map((t,e)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${e===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${ue[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Hs(t){const e=t.document??document,{store:a}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${a.get("personas").map(ks).join("")}
      </div>
      ${Bs()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var m;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=a.get("personas"),b=g.find(y=>y._id===u);if(b){if(v==="renombrar"){const y=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!y||!y.trim())return;a.updateItem("personas",u,{nombre:y.trim()}),qt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){a.set("personas",g.map(y=>({...y,esPorDefecto:y._id===u}))),qt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){a.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(g.length<=1){qt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Ls(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;a.removeItem("personas",u),qt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(m=c.querySelector("#persona-nuevo-btn"))==null||m.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){qt(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||ue[0],g=a.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});qt(t,`"${g.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Os(e);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const lo={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function uo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function Gs({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,m])=>[m,l]);for(const[l,m]of[...Object.entries(lo),...c]){const d=t.isEnabled(l),u=e.querySelector(`.nav-btn[data-view="${m}"]`);u&&(u.style.display=d?"":"none"),!d&&n()===m&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(l=>{const m=[...l.querySelectorAll(".nav-btn[data-view]")];if(m.length===0)return;const d=m.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),uo(e,l=>t.isEnabled(l)),r){const l=a??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{uo(e,m=>t.isEnabled(m))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:s,observar:i,vistaPara:r=>lo[r]}}const Vs="toast toast-deshacer";function Us(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function l(d){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=Vs,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${fs(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const y=e.deshacerBorrado();if(c(),!y)return;const f=n();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}a==null||a()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const m=e.subscribe(()=>{const d=e.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{m(),c()}}function pe(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function po(t,e){const a=pe(t),o=pe(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const ee=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Ys(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[ee(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:ee(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:ee(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${ee(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,ee(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return e}function Ws(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=pe(e);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of Ys(t)){if(!i(c.ruta))continue;const l=po(c.titulo,s),m=l>=0?-1:Math.min(po(c.extra??"",s),2);if(l<0&&m<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,pe(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const Ks="buscador-overlay",mo="btn-buscador";function Js(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const I=e.createElement("div");I.id=Ks,I.className="modal-overlay",I.style.alignItems="flex-start",I.style.paddingTop="10vh";const x=e.createElement("div");x.className="modal-box",x.style.maxWidth="560px",x.style.padding="14px";const $=e.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const S=e.createElement("div");return S.style.marginTop="10px",S.style.maxHeight="52vh",S.style.overflowY="auto",x.appendChild($),x.appendChild(S),I.appendChild(x),e.body.appendChild(I),I.addEventListener("click",P=>{P.target===I&&b()}),$.addEventListener("input",()=>{r=0,m()}),$.addEventListener("keydown",v),o=I,n=$,s=S,I}function l(){if(s){if(s.textContent="",i.length===0){const I=e.createElement("div");I.style.padding="14px 4px",I.style.fontSize="13px",I.style.color="var(--text3)";const x=(n==null?void 0:n.value.trim())??"";I.textContent=x.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(I);return}i.forEach((I,x)=>{const $=e.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(x),x===r&&$.classList.add("activa");const S=e.createElement("div");S.style.minWidth="0";const P=e.createElement("div");P.textContent=I.titulo,P.style.fontSize="13px",P.style.overflow="hidden",P.style.textOverflow="ellipsis",P.style.whiteSpace="nowrap";const w=e.createElement("div");w.textContent=I.detalle,w.style.fontSize="11px",w.style.color="var(--text3)",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap",S.appendChild(P),I.detalle&&S.appendChild(w);const E=e.createElement("span");E.className="tag",E.textContent=I.etiqueta,E.style.flexShrink="0",$.appendChild(S),$.appendChild(E),$.addEventListener("click",()=>u(x)),s.appendChild($)})}}function m(){const I=(n==null?void 0:n.value)??"";i=Ws(t.estado(),I,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(I){var x,$;i.length!==0&&(r=(r+I+i.length)%i.length,l(),($=(x=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:x.scrollIntoView)==null||$.call(x,{block:"nearest"}))}function u(I){const x=i[I];x&&(b(),t.navegar(x.ruta))}function v(I){I.key==="Escape"?(I.preventDefault(),b()):I.key==="ArrowDown"?(I.preventDefault(),d(1)):I.key==="ArrowUp"?(I.preventDefault(),d(-1)):I.key==="Enter"&&(I.preventDefault(),u(r))}function g(){const I=o??c();I.classList.remove("hidden"),I.style.display="",r=0,n&&(n.value="",n.focus()),m()}function b(){o&&(o.style.display="none",i=[])}function y(){return!!o&&o.style.display!=="none"}function f(I){(I.ctrlKey||I.metaKey)&&(I.key==="k"||I.key==="K")&&(I.preventDefault(),y()?b():g())}e.addEventListener("keydown",f);let h=null;function C(){const I=e.getElementById("period-bar");if(!I||e.getElementById(mo))return;const x=e.createElement("button");x.id=mo,x.type="button",x.className="btn-secondary",x.title="Buscar en toda la aplicación (Ctrl+K)",x.setAttribute("aria-label","Buscar"),x.textContent="🔍 Buscar",x.style.marginLeft="auto",x.addEventListener("click",g),I.appendChild(x),h=x}return C(),()=>{e.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Ge="aviso-guardado";function Qs(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=e.getElementById(Ge))==null||g.remove()}function m(){if(s==="oculto")return l();const g=a();if(!g)return;let b=e.getElementById(Ge);b||(b=e.createElement("div"),b.id=Ge,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const y=e.createElement("span");if(y.style.flex="1",b.appendChild(y),s==="pendiente")y.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",m()}));else if(s==="subiendo"){y.textContent="Subiendo…";const f=e.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else s==="guardado"?y.textContent="¡Guardado!":s==="error"&&(y.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,b,y){const f=e.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",y),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return s="subiendo",m(),c=(async()=>{try{await t.guardar(),n.alDia(g),s="guardado",m(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),m()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",m()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",m()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,detener(){v(),l()}}}function Xs({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(g){return`view-${g}`}function s(g){const b=t.getElementById(n(g.route));if(b)return b;const y=t.querySelector(".view-container");if(!y)return null;const f=t.createElement("div");return f.id=n(g.route),f.className="view hidden",y.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),y=b[g.seccion??Math.max(0,b.length-1)];if(!y)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,y.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){a.set(g.route,g),s(g),i(g)}function c(){return[...a.keys()].filter(g=>{const b=a.get(g);return!e||e(b.flagId??b.id)})}function l(g){return c().includes(g)}function m(g){const b=a.get(g);if(!b||e&&!e(b.flagId??b.id))return!1;const y=s(b);if(!y)return!1;if(o&&o!==g){const f=a.get(o),h=t.getElementById(n(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount(y),o=g,!0}function d(){o&&m(o)}function u(){const g={};for(const[b,y]of a)g[b]=y.flagId??y.id;return g}function v(){for(const g of a.values())s(g),i(g)}return{register:r,routes:c,has:l,mount:m,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function p(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function It(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${p(F(t))}</span>`}function Zs(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function fo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${p(e)}</span>`).join(" ")}const ti=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function me(t){const[e,a]=t.split("-").map(Number);return`${ti[a-1]} ${e}`}function N(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function ot(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function j(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function U(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ct(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function go(t,e){const a=parseFloat(ct(t,e));return Number.isFinite(a)?a:0}const ei="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ve(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ai(t){const{store:e}=t,a=t.hoy??K,o=()=>k(a()),n=()=>e.get("config").margenesSeguridad??[];function s(v){var g;e.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=n().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),y=b.find(f=>f._id===v);y&&(g(y),s(b))}function r(v){const g=e.get("config"),b=je(v,e.get("expenses"),g,e.get("loans"),a(),!1,o());return F(b)}function c(v,g,b){const y=g.tipo==="fijo",f=y?"":`<span class="text-sm" style="color:var(--text3)">${p(F((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${p(g._id)}" data-margen="${p(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${p(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${y?" selected":""}>Fijo €</option>
            <option value="meses"${y?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${y?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${y?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,g,b){const y=v.cuentas&&v.cuentas.length>0?v.cuentas.map(I=>{var x;return((x=g.find($=>$._id===I))==null?void 0:x.nombre)??I}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((I,x)=>I.fecha.localeCompare(x.fecha)).map(I=>c(v,I,b)).join(""),C=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${p(y)}</div>
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
        ${C}
      </div>`}function m(v,g){const b=g?n().find(C=>C._id===g):null,y=e.get("accounts").filter(C=>C.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=y.map(C=>`
        <label class="tag" data-chip="${p(C._id)}" style="cursor:pointer;${f.has(C._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${p(C._id)}" ${f.has(C._id)?"checked":""} style="display:none"/>
          ${p(C.nombre)}
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
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");!b||!y||(m(y,v),b.classList.remove("hidden"),U(y,".mg-acc-chip",f=>{const h=f,C=y.querySelector(`[data-chip="${h.value}"]`);C&&(C.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(y,"#mg-p-tipo",f=>{const h=f.value==="fijo",C=y.querySelector("#mg-p-importe-wrap"),I=y.querySelector("#mg-p-meses-wrap");C&&(C.style.display=h?"":"none"),I&&(I.style.display=h?"none":"")}),j(y,"[data-cerrar-form]",()=>b.classList.add("hidden")),j(y,"[data-guardar-margen]",f=>{var $,S,P,w,E;const h=f.getAttribute("data-guardar-margen")||"",C=(($=y.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!C)return N("El nombre es obligatorio","err");const I=[...y.querySelectorAll(".mg-acc-chip:checked")].map(_=>_.value),x=n().map(_=>({..._}));if(h){const _=x.findIndex(M=>M._id===h);if(_===-1)return N("Margen no encontrado","err");x[_]={...x[_],nombre:C,cuentas:I}}else{const _=((S=y.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",M={_id:Ve(),fecha:((P=y.querySelector("#mg-p-fecha"))==null?void 0:P.value)||K(),tipo:_,importe:parseFloat(((w=y.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((E=y.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};x.push({_id:Ve(),nombre:C,activo:!0,cuentas:I,puntos:[M]})}s(x),N(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=n(),b=e.get("accounts"),y=Wt(e.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(h=>l(h,b,y)).join("")}`;const f=()=>u(v);j(v,"[data-nuevo-margen]",()=>d(null,f)),j(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),f)),j(v,"[data-borrar-margen]",h=>{ot("¿Eliminar este margen de seguridad?")&&(s(n().filter(C=>C._id!==h.getAttribute("data-borrar-margen"))),N("Margen eliminado"),f())}),U(v,"[data-toggle-margen]",h=>{const C=h.getAttribute("data-toggle-margen");i(C,I=>{I.activo=h.checked}),f()}),j(v,"[data-add-punto]",h=>{const C=h.getAttribute("data-add-punto");i(C,I=>{I.puntos=[...I.puntos??[],{_id:Ve(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),f()}),j(v,"[data-borrar-punto]",h=>{const C=h.closest("[data-punto]");if(!C)return;const I=C.dataset.margen,x=C.dataset.punto;i(I,$=>{$.puntos=($.puntos??[]).filter(S=>S._id!==x)}),f()}),U(v,"[data-campo]",h=>{const C=h.closest("[data-punto]");if(!C)return;const I=h.getAttribute("data-campo"),x=h.value;i(C.dataset.margen,$=>{const S=($.puntos??[]).find(P=>P._id===C.dataset.punto);S&&(I==="fecha"?S.fecha=x:I==="tipo"?S.tipo=x:I==="importe"?S.importe=parseFloat(x)||0:S.meses=parseFloat(x)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:ei,mount:u}}const oi=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],ni=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],si=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function ii(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ue=(t,e)=>t.map(([a,o])=>`<option value="${p(a)}"${a===e?" selected":""}>${p(o)}</option>`).join("");function vo(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=ii(t),i=Ue(oi.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${p(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ue(ni,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ue(si,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function bo(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function ho(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const ri={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function ci(t,e){const a=new Set(((e==null?void 0:e.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||a.has(o._id))}function Nt(t,e,a,o){if(a.filter(c=>c.activo).length<2)return"";const n=(e==null?void 0:e.modo)??"",s=new Map(((e==null?void 0:e.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const l=s.has(c._id),m=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
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
      ${ci(a,e).map(r).join("")}
    </div>
  </div>`}function Rt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"",n=a.querySelector(`[data-reparto-participantes="${e}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";a.querySelectorAll(`[data-reparto-valor="${e}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Lt(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...a.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,l=a.querySelector(`[data-reparto-valor="${e}"][data-persona="${c}"]`),m=l?parseFloat(l.value):NaN;return Number.isFinite(m)?{personaId:c,valor:m}:{personaId:c}});return{modo:o,participantes:s}}function yo(t,e){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=e.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${ri[t.modo]})`}function Ye(t,e,a){const o=yo(t,a),n=yo(e,a);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const li="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",di=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function ui(t){const e=t.hoy??K,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var h;return((h=n().find(C=>C._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=e();let h=[...t.store.get("expenses")];if(a.mostrarExpirados||(h=h.filter(C=>!C.fechaFin||C.fechaFin>=f)),a.tipo&&(h=h.filter(C=>C.tipo===a.tipo)),a.cuenta&&(h=h.filter(C=>(C.cuenta||"default")===a.cuenta)),a.desde&&(h=h.filter(C=>(C.fechaInicio??"")>=a.desde)),a.hasta&&(h=h.filter(C=>(C.fechaInicio??"")<=a.hasta)),a.busqueda){const C=a.busqueda.toLowerCase();h=h.filter(I=>I.concepto.toLowerCase().includes(C))}return a.tags.size>0&&(h=h.filter(C=>(C.tags||[]).some(I=>a.tags.has(I)))),h.sort((C,I)=>{const x=C[a.orden]??"",$=I[a.orden]??"";return typeof x=="number"&&typeof $=="number"?(x-$)*a.sentido:String(x).localeCompare(String($))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const C=a.orden===f?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${p(h)} <span class="sort-arrow">${C}</span></span>`}function l(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${p(I._id)}"${I._id===f?" selected":""}>${p(I.nombre)}</option>`).join("")}function m(f){const h=f.tipo==="transferencia",C=Ye(f.repartoConsumo,f.repartoPago,t.store.get("personas")),I=Ae(f.diaPago??""),x=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${I?` · ${I}`:""}`,$=!!f.fechaFin&&f.fechaFin<e(),S=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',P=h?`${p(s(f.cuenta))} → ${p(s(f.cuentaDestino))}`:p(s(f.cuenta)),w=(f.tags||[]).map(E=>`<span class="tag${a.tags.has(E)?" active":""}" data-tag="${p(E)}" title="Filtrar por ${p(E)}">${p(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${S}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${p(F(f.cuantia))}</div>
      <div class="text-sm">${p(x)}</div>
      <div class="text-sm exp-col-hide">${P}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${p(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${p(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${C?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(C)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${p(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${p(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${p(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const h=i(),C=r();f.innerHTML=`
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
      ${C.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${C.map(I=>`<span class="tag${a.tags.has(I)?" active":""}" data-tag="${p(I)}">${p(I)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(m).join("")}
      </div>`}function u(f){const h=(f==null?void 0:f.tipo)==="transferencia",C=t.store.get("personas"),I=(x,$,S,P,w="")=>`<div class="form-group"><label class="form-label">${p($)}</label>
       <input class="form-input" type="${S}" id="${x}" value="${p(P)}" placeholder="${p(w)}"/></div>`;return`
      <div class="grid-2">
        ${I("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${I("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${I("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${di.map(([x,$])=>`<option value="${x}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===x?" selected":""}>${p($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${I("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??e())}
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
          <div class="mt-8">${I("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${vo(f==null?void 0:f.diaPago,"exp")}</div>
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
          ${h?"":`${Nt("Reparto de consumo",f==null?void 0:f.repartoConsumo,C,"consumo")}
                 ${Nt("Reparto de pago",f==null?void 0:f.repartoPago,C,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${p((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var I;const h=((I=f.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",C=(x,$)=>{const S=f.querySelector(x);S&&(S.style.display=$?"":"none")};C("#ef-destino-wrap",h==="transferencia"),C("#ef-basico-wrap",h!=="transferencia"),C("#ef-irpf-wrap",h==="ingreso"),C("#ef-clasificacion-wrap",h==="gasto")}function g(f,h,C){const I=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");!I||!x||(x.innerHTML=`<div class="modal-title">${p(h)}</div>${u(f)}`,I.classList.remove("hidden"),U(x,"#ef-tipo",()=>v(x)),U(x,"[data-dp-modo]",()=>bo(x)),U(x,'[data-reparto-modo="consumo"]',()=>Rt(x,"consumo")),U(x,'[data-reparto-modo="pago"]',()=>Rt(x,"pago")),j(x,"[data-cancelar]",()=>I.classList.add("hidden")),j(x,"[data-guardar]",$=>{b(x,$.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),C())}))}function b(f,h){const C=_=>{var M;return((M=f.querySelector(_))==null?void 0:M.value)??""},I=_=>{var M;return!!((M=f.querySelector(_))!=null&&M.checked)},x=C("#ef-tipo")||"gasto",$=x==="transferencia",S=C("#ef-concepto").trim(),P=parseFloat(C("#ef-cuantia"));if(!S||!Number.isFinite(P))return N("Concepto y cuantía obligatorios","err"),!1;const w=C("#ef-clasificacion"),E={concepto:S,tipo:x,cuantia:P,frecuencia:parseInt(C("#ef-frecuencia"),10)||1,tipoFrecuencia:C("#ef-tipo-frec")||"mensual",fechaInicio:C("#ef-fecha-ini"),fechaFin:C("#ef-fecha-fin")||null,diaPago:ho(f),cuenta:C("#ef-cuenta"),cuentaDestino:$?C("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!$&&I("#ef-basico"),sujetoIRPF:!$&&I("#ef-sujetoIRPF"),clasificacion:x==="gasto"?w||null:void 0,tags:$?["transferencia"]:C("#ef-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:$?void 0:Lt(f,"consumo"),repartoPago:$?void 0:Lt(f,"pago")};return h?(t.store.updateItem("expenses",h,E),N("Actualizado")):(t.store.addItem("expenses",E),N("Creado")),o(),!0}function y(f,h){const C=f.querySelector("[data-busqueda]");let I;C==null||C.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{a.busqueda=C.value,h();const x=f.querySelector("[data-busqueda]");x==null||x.focus(),x==null||x.setSelectionRange(x.value.length,x.value.length)},250)}),U(f,"[data-expirados]",x=>{a.mostrarExpirados=x.checked,h()}),U(f,"[data-f-tipo]",x=>{a.tipo=x.value,h()}),U(f,"[data-f-cuenta]",x=>{a.cuenta=x.value,h()}),U(f,"[data-f-desde]",x=>{a.desde=x.value,h()}),U(f,"[data-f-hasta]",x=>{a.hasta=x.value,h()}),j(f,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,h()}),j(f,"[data-limpiar-tags]",()=>{a.tags=new Set,h()}),j(f,"[data-tag]",x=>{const $=x.getAttribute("data-tag");a.tags.has($)?a.tags.delete($):a.tags.add($),h()}),j(f,"[data-orden]",x=>{const $=x.getAttribute("data-orden");a.orden===$?a.sentido=a.sentido===1?-1:1:(a.orden=$,a.sentido=1),h()}),j(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),j(f,"[data-editar]",x=>{const $=t.store.get("expenses").find(S=>S._id===x.getAttribute("data-editar"));$&&g($,"Editar",h)}),j(f,"[data-duplicar]",x=>{const $=t.store.get("expenses").find(w=>w._id===x.getAttribute("data-duplicar"));if(!$)return;const{_id:S,...P}=$;g({...P,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",h)}),j(f,"[data-borrar]",x=>{ot("¿Eliminar?")&&(t.store.removeItem("expenses",x.getAttribute("data-borrar")),N("Eliminado"),o(),h())}),U(f,"[data-activo]",x=>{const $=x;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:li,mount(f){const h=()=>d(f);d(f),f.dataset.wired!=="1"&&(y(f,h),f.dataset.wired="1")}}}function fe(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=gt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function $o(t,e,a,o){return t.reduce((n,s)=>{const i=gt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function pi(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:fe(i.tabla,e,a)-fe(r.tabla,e,a)}})}const We=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${p(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function mi(t,e){const a=ya(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?$a(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?xa(t.tin||0,i):null,c=o&&n?pi(t,e.periodos,e.hoy):[],l=c.length?fe(a.sinAmort.tabla,e.periodos,e.hoy)-fe(a.tabla,e.periodos,e.hoy):null,m=l===null?null:l-a.costeTotalAmort,d=s?$o(a.tabla,e.periodos,e.hoy,a.comAp):null,u=s&&o?$o(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${p(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${p(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Ye(t.repartoConsumo,t.repartoPago,e.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${p(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${p(t.tin)}%</span>
        <span class="text-sm">${p(F(a.cuota))}/mes</span>
        <span class="text-sm">${p(a.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${p(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${p(t._id)}">

      <div class="grid-4 mb-12">
        ${We("Cuota mensual",p(F(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${p(F(e.cuotaMes))}</div>`:"")}
        ${We("Total intereses",p(F(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(F(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${p(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${We("Total pagado",p(F(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${p(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${p(ga(a.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${p(F(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${p(F(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${p(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${p(Ae(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${p(F(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${p(F(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(F(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${p(F(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(m??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${p(F(m??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${p(F(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(F(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${p(F(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?fi(t,a.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>gi(v,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>vi(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function fi(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${p(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${p(F(a))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${p(F(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${p(F(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${p(F(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${p(F(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function gi(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=gt(a.periodos,a.hoy,t.fecha);o=p(F(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":p(t.mes)}</td>
    <td class="num">${p(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":p(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${p(F(t.interes))}</td>
    <td class="num">${p(F(t.amortizacion))}</td>
    <td class="num">${p(F(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function vi(t,e,a){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${p(e.fecha)}</span>
    <span class="num">${p(F(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${p(F(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${p(F(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${p(t)}|${p(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${p(t)}|${p(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,ae=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,oe=(t,e,a,o="")=>`<label class="form-label">${p(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${p(o)}</span>`:""}`,bi=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${p(a._id)}"${a._id===e?" selected":""}>${p(a.nombre)}</option>`).join("");function hi(t,e,a,o=K()){return`
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
            <select class="form-select" id="f-cuenta">${bi(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${vo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${ae("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
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
          ${oe("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Nt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a,"consumo")}
        ${Nt("Reparto de pago",t==null?void 0:t.repartoPago,a,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${oe("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${oe("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${oe("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function yi(t,e,a=K()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??a)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${ae("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${oe("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${p(t)}|${p((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const $i="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function xi(t){const e=t.hoy??K;let a=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const S=$.filter(w=>w.activo);if(S.length<2)return"";const P=(w,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":p(w)}"
               style="${n===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p(E)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${P(null,"Todas")}
      ${S.map(w=>P(w._id,w.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const S=X($).tabla.filter(P=>!P.esAmortizacion);return S.length===0?!0:S[S.length-1].fecha<e()}function c($,S){const P=e(),w=P.slice(0,7),E=new Map;let _=0;for(const M of $){if(!M.activo||M.simulacion||S.has(M._id)||(M.fechaInicio||"")>P)continue;const A=X(M).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(w)),z=A.length>0?A[0].cuota:0;E.set(M._id,z),_+=z}return{porLoan:E,total:_,activos:[...E.values()].filter(M=>M>0).length}}function l($){const S=e().slice(0,7),P=[];for(const w of $){if(!w.activo||w.simulacion)continue;const E=X(w).tabla.filter(M=>!M.esAmortizacion),_=E[E.length-1];_&&_.fecha.slice(0,7)===S&&P.push({loan:w,cuota:_.cuota})}return P}function m($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function d($){const S=t.store.get("config"),P=S.dashboardStart,w=S.dashboardEnd,E=Math.max(1,(k(w).getTime()-k(P).getTime())/(30.44*864e5));let _=0;for(const M of $)!M.activo||M.simulacion||(_+=X(M).tabla.filter(A=>!A.esAmortizacion&&A.fecha>=P&&A.fecha<=w).reduce((A,z)=>A+z.cuota,0));return{media:_/E,desde:P,hasta:w}}function u($){const S=t.store.get("personas"),P=re(S),w=[...t.store.get("loans")].sort((q,B)=>B.tin-q.tin),E=n?w.filter(q=>Pe(q.repartoConsumo,q.repartoPago,P).has(n)):w,_=new Set(E.filter(r).map(q=>q._id)),M=a?E:E.filter(q=>!_.has(q._id)),A=c(w,new Set(w.filter(r).map(q=>q._id))),z=d(w),D=l(w),T=t.store.get("config"),R=t.store.get("inflacion"),O=new Date(k(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${_.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${_.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(S)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${p(m(D.map(q=>q.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${p(F(D.reduce((q,B)=>q+B.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${A.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${A.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${p(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${p(F(A.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${A.activos} préstamo${A.activos!==1?"s":""} activo${A.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${p(F(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${p(z.desde)} → ${p(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(q=>mi(q,{periodos:R,usarInflacion:!!T.usarInflacion,hoy:e(),cuotaMes:A.porLoan.get(q._id)??0,completado:_.has(q._id),personas:S})).join("")}
      </div>`;for(const q of $.querySelectorAll("[data-body-loan]"))o.has(q.dataset.bodyLoan??"")&&q.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),b=()=>{var $;return($=v())==null?void 0:$.classList.add("hidden")};function y($,S){const P=v(),w=g();return!P||!w?null:(w.innerHTML=`<div class="modal-title">${p($)}</div>${S}`,P.classList.remove("hidden"),j(w,"[data-cancelar]",b),w)}function f($,S){const P=$?t.store.get("loans").find(E=>E._id===$)??null:null,w=y($?"Editar préstamo":"Nuevo préstamo",hi(P,t.store.get("accounts"),t.store.get("personas"),e()));w&&(w.addEventListener("change",E=>{const _=E.target;_!=null&&_.matches("[data-dp-modo]")&&bo(w),_!=null&&_.matches('[data-reparto-modo="consumo"]')&&Rt(w,"consumo"),_!=null&&_.matches('[data-reparto-modo="pago"]')&&Rt(w,"pago")}),j(w,"[data-guardar-loan]",E=>{h(w,E.getAttribute("data-guardar-loan")||"")&&(b(),S())}))}function h($,S){const P=D=>{var T;return((T=$.querySelector(D))==null?void 0:T.value)??""},w=D=>{var T;return!!((T=$.querySelector(D))!=null&&T.checked)},E=P("#f-nombre").trim(),_=parseFloat(P("#f-capital")),M=parseFloat(P("#f-tin")),A=parseInt(P("#f-meses"),10);if(!E||!Number.isFinite(_)||!Number.isFinite(M)||!Number.isFinite(A))return N("Completa los campos obligatorios","err"),!1;const z={nombre:E,capital:_,tin:M,meses:A,fechaInicio:P("#f-fecha"),comisionApertura:parseFloat(P("#f-com-ap"))||0,comisionAmort:parseFloat(P("#f-com-am"))||0,diaPago:ho($),cuenta:P("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:P("#f-tipo-tasa"),basico:w("#f-basico"),tags:P("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Lt($,"consumo"),repartoPago:Lt($,"pago")};return S?(t.store.updateItem("loans",S,z),N("Préstamo actualizado")):(t.store.addItem("loans",{...z,amortizaciones:[]}),N("Préstamo creado")),s(),!0}function C($,S,P){const w=t.store.get("loans").find(M=>M._id===$);if(!w)return;const E=S?(w.amortizaciones||[]).find(M=>M._id===S)??null:null,_=y(S?"Editar amortización":"Añadir amortización",yi($,E,e()));_&&j(_,"[data-guardar-amort]",M=>{const[A,z]=(M.getAttribute("data-guardar-amort")||"").split("|");I(_,A,z)&&(b(),P([A]))})}function I($,S,P){var T;const w=R=>{var O;return((O=$.querySelector(R))==null?void 0:O.value)??""},E=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!E||!Number.isFinite(_)||_<=0)return N("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(R=>R._id===S);if(!M)return!1;const A={fecha:E,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((T=$.querySelector("#am-sim"))!=null&&T.checked)},z=M.amortizaciones||[],D=P?z.map(R=>R._id===P?{...R,...A}:R):[...z,{_id:Date.now().toString(36),...A}];return t.store.updateItem("loans",S,{amortizaciones:D}),N(P?"Amortización actualizada":"Amortización añadida"),s(),!0}function x($,S){j($,"[data-toggle-finalizados]",()=>{a=!a,S()}),j($,"[data-persona-tab]",P=>{n=P.getAttribute("data-persona-tab")||null,S()}),j($,"[data-nuevo-loan]",()=>f(null,S)),j($,"[data-toggle-loan]",(P,w)=>{var A;if((A=w.target)!=null&&A.closest("button"))return;const E=P.getAttribute("data-toggle-loan"),_=[...$.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===E);(_==null?void 0:_.classList.toggle("open"))?o.add(E):o.delete(E)}),j($,"[data-editar-loan]",P=>f(P.getAttribute("data-editar-loan"),S)),j($,"[data-borrar-loan]",P=>{if(!ot("¿Eliminar préstamo?"))return;const w=P.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),N("Eliminado"),s(),S()}),j($,"[data-amort-loan]",P=>{const w=P.getAttribute("data-amort-loan");o.add(w),C(w,null,S)}),j($,"[data-editar-amort]",P=>{const[w,E]=(P.getAttribute("data-editar-amort")||"").split("|");o.add(w),C(w,E,S)}),j($,"[data-borrar-amort]",P=>{const[w,E]=(P.getAttribute("data-borrar-amort")||"").split("|"),_=t.store.get("loans").find(M=>M._id===w);_&&(t.store.updateItem("loans",w,{amortizaciones:(_.amortizaciones||[]).filter(M=>M._id!==E)}),N("Amortización eliminada"),s(),S([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:$i,mount($){const S=(P=[])=>{for(const w of P)o.add(w);u($)};u($),$.dataset.wired!=="1"&&(x($,S),$.dataset.wired="1")}}}const Ke=6.35;function Ot(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function xo(t){return Math.max(0,(t.bruto||0)-Ot(t))}function wi(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function Ii(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Ot(r),0),o=Math.max(0,e-a),n=ht(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(xo(i)/o):0);return s}function wo(t,e,a){if(t.irpfModo==="manual")return xo(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return lt(ht(t.bruto||0,Ot(t)),a);const o=wi(e.filter(i=>i.irpfModo!=="manual")),n=Ii(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,a)-lt(s,a);s+=r}return lt(ht(t.bruto||0,Ot(t)),a)}function Ci(t,e){return t.reduce((a,o)=>a+wo(o,t,e),0)}function Si(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Ai(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Ot(s),0);return Si(ht(a,o),e)}function Mi(t,e,a){const o=t.bruto||0,n=Ot(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Ke,c=s*(r/100),l=wo(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:s>0?l/s*100:0,netoPorPaga:(s-c-l)/i}}function Ei(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Pi={transporte:125,restaurante:220,otros:null},_i={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Fi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,Di=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${p(a._id)}"${a._id===e?" selected":""}>${p(a.nombre)}</option>`).join("");function Ti(t,e){const a=t.map((s,i)=>{const r=e.find(m=>m._id===s.cuenta),c=Pi[s.tipo],l=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${p(_i[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${p(F(s.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${p(F(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function zi(t,e){const a=e.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${kt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${kt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Di(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${kt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${kt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${kt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Fi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${p(s)} (${i+1})</option>`).join("")}
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
          ${kt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Ke).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Nt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e.personas,"consumo")}
        ${Nt("Reparto de pago",t==null?void 0:t.repartoPago,e.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Io(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(a(i));return Number.isFinite(c)?c:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Ke),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,retribucionFlexible:e,repartoConsumo:Lt(t,"consumo"),repartoPago:Lt(t,"pago")}}function ji(t,e,a,o){const n=Io(t,e),s=e.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(ht(n.bruto,s),a.tramos),l=i-r-c,m=i/n.nPagas,d=r/n.nPagas,u=c/n.nPagas,v=m-d-u,g=n.grupoNomina?a.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${p(n.grupoNomina)}" con ${p(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",y=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${p(F(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${p(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${p(F(n.bruto))}</span>
      ${y}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${p(F(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${p(F(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${p(F(l))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${p(F(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${p(F(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${p(F(v))}/paga`:`ingreso ${p(F(m))} − SS ${p(F(d))} − IRPF ${p(F(u))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function qi(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Ti(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=ji(t,e,a,o))},i=()=>{var c,l;const r=(m,d)=>{const u=t.querySelector(m);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Rt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Rt(t,"pago")),j(t,"[data-flex-anadir]",()=>{var l,m,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((m=t.querySelector("#fc-importe"))==null?void 0:m.value)??"")||0;if(!c)return N("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),j(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const Co=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Ni(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??bt;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){e=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${p(Co(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(Co(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tabla]",b=>{const y=b.getAttribute("data-editar-tabla");d(y==="default"?"default":Number(y))}),j(g,"[data-borrar-tabla]",b=>{const y=Number(b.getAttribute("data-borrar-tabla"));ot(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==y)),N(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return N("Año inválido","err");const y=t.store.get("tramosIRPFHistorico");if(y.some(h=>h.año===b))return N("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function m(u){a=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const y=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat((y==null?void 0:y.value)??"")||0]})}function d(u){var h;e=u;const v=t.store.get("tramosIRPFHistorico");a=(u==="default"?i():((h=v.find(C=>C.año===u))==null?void 0:h.tramos)??i()).map(C=>[...C]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,y=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${p(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!y)return;const f=()=>{const C=y.querySelector("#irpf-tramos-rows");C&&(C.innerHTML=l())};j(y,"[data-volver]",c),j(y,"[data-tr-anadir]",()=>{m(y),a.push([0,0]),f()}),j(y,"[data-tr-borrar]",C=>{m(y),a.splice(Number(C.getAttribute("data-tr-borrar")),1),f()}),j(y,"[data-tr-guardar]",()=>{m(y);const C=[...a].sort((I,x)=>I[0]-x[0]);if(C.length===0)return N("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:C}),N("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===e?{...I,tramos:C}:I)),N(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const So=1500,Et=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,Ri=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${p(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,Li=t=>(t.modeloFondo||"cuenta")==="pension";function Oi(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>ki(n,e,a,o)).join("")}</div>`}function ki(t,e,a,o){const n=Fe(t);if(!n)return"";const s=De(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,m)=>l+m.cantidad,0),c=Math.min(r,So)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${p(F(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(F(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${p(F(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(F(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(F(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${p(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>So?"neg":""}">${p(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${p(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${p(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${p(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Bi(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(F(a.importe))} / ${p(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Hi(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${Ri("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Gi(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Bi(e))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return N("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Vi(t,e,a,o){var y;const n=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},s=(f,h=0)=>{const C=parseFloat(n(f));return Number.isFinite(C)?C:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),l=n("#pen-grupo"),m={nombre:r,grupoNomina:l,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(a==null?void 0:a.historicoSaldos)??[]],u=[...(a==null?void 0:a.aportaciones)??[]],g=((y=[...d].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:y.saldo)??(a==null?void 0:a.saldo)??null,b=Date.now().toString(36);return a?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:m.fechaInicialSaldo??o,cantidad:c})),{datos:{...m,historicoSaldos:d,aportaciones:u}}}const Ui="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Yi(t){const e=t.hoy??K,a=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const C=h.filter(x=>x.activo);if(C.length<2)return"";const I=(x,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${x===null?"":p(x)}"
               style="${o===x?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${I(null,"Todas")}
      ${C.map(x=>I(x._id,x.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Ft(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??bt)(Number(e().slice(0,4)))}function i(h,C,I){const x=Mi(h,C,I),$=!!C&&h.irpfModo!=="manual",S=Ye(h.repartoConsumo,h.repartoPago,t.store.get("personas")),P=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",x.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${p(F(x.flexAnual))}/año</span>`:"",Math.abs(x.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${x.ssPct.toFixed(2)}%</span>`:"",S?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(S)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${P}</div>
      </div>
      <div class="num">${p(F(x.brutoAnual))}
        ${x.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${p(F(x.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${p(F(x.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${x.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${h.irpfModo==="manual"?`${p(h.irpfPct??0)}% (manual)`:`${x.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${p(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${p(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${p(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${p(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var C;return((C=t.store.get("accounts").find(I=>I._id===(h||"default")))==null?void 0:C.nombre)??(h||"default")};function c(h,C,I){const x=C.reduce((P,w)=>P+(w.bruto||0),0),$=Ci(C,I),S=x>0?$/x*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${p(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${p(F(x))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${S.toFixed(1)}%</strong> (${p(F($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${C.map(P=>i(P,C,I)).join("")}
      </div>
    </div>`}function l(h){const C=s(),I=t.store.get("personas"),x=re(I),$=[...t.store.get("nominas")].sort((M,A)=>(A.bruto||0)-(M.bruto||0)),S=o?$.filter(M=>Pe(M.repartoConsumo,M.repartoPago,x).has(o)):$,{grupos:P,sueltas:w}=Ei(S),E=t.store.get("accounts").filter(Li),_=$.filter(M=>M.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n(I)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${S.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...P.entries()].map(([M,A])=>c(M,A,C)).join("")}
      ${w.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${w.map(M=>i(M,null,C)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Oi(E,_,C,e())}</div>`}const m=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),u=()=>{var h;return(h=m())==null?void 0:h.classList.add("hidden")};function v(h,C){const I=m(),x=d();return!I||!x?null:(x.innerHTML=`<div class="modal-title">${p(h)}</div>${C}`,I.classList.remove("hidden"),j(x,"[data-cancelar]",u),x)}function g(h,C){const I=h?t.store.get("nominas").find(P=>P._id===h)??null:null,x=[...(I==null?void 0:I.retribucionFlexible)??[]].map(P=>({...P})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:e()},S=v(h?"Editar nómina":"Nueva nómina",zi(I,$));S&&(qi(S,x,$,h??""),j(S,"[data-guardar-nomina]",P=>{const w=Io(S,x);if(!w.nombre||w.bruto<=0)return N("Nombre y bruto anual son obligatorios","err");const E=P.getAttribute("data-guardar-nomina")||"",_={...w,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,_),N("Nómina actualizada")):(t.store.addItem("nominas",_),N("Nómina creada")),a(),u(),C()}))}function b(h,C){const I=h?t.store.get("accounts").find(S=>S._id===h)??null:null,x=[...(I==null?void 0:I.planAportaciones)??[]].map(S=>({...S})),$=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Hi(I,{nominas:t.store.get("nominas"),hoy:e()}));$&&(Gi($,x,e()),j($,"[data-guardar-pension]",S=>{const{datos:P,error:w}=Vi($,x,I,e());if(w)return N(w,"err");const E=S.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,P),N("Plan actualizado")):(t.store.addItem("accounts",P),N("Plan creado")),a(),u(),C()}))}function y(h,C,I){j(h,"[data-persona-tab]",x=>{o=x.getAttribute("data-persona-tab")||null,C()}),j(h,"[data-nueva-nomina]",()=>g(null,C)),j(h,"[data-editar-nom]",x=>g(x.getAttribute("data-editar-nom"),C)),j(h,"[data-borrar-nom]",x=>{ot("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",x.getAttribute("data-borrar-nom")),N("Eliminada"),a(),C())}),U(h,"[data-activo-nom]",x=>{const $=x;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),a(),C()}),j(h,"[data-tramos]",()=>I.abrir()),j(h,"[data-nueva-pension]",()=>b(null,C)),j(h,"[data-editar-pension]",x=>b(x.getAttribute("data-editar-pension"),C)),j(h,"[data-borrar-pension]",x=>{ot("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",x.getAttribute("data-borrar-pension")),N("Plan eliminado"),a(),C())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Ui,mount(h){const C=()=>l(h);f??(f=Ni({store:t.store,onDatosCambiados:()=>{a(),C()},año:()=>Number(e().slice(0,4))})),l(h),h.dataset.wired!=="1"&&(y(h,C,f),h.dataset.wired="1")}}}const Wi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Ki="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Ao={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Ji={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Qi(t,e){const a=t.filter(c=>c.activo&&rt(c)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of a){const l=ce(c,e);l&&(o+=l.saldo,n+=l.costBase,s+=l.plusvalia,i+=l.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${p(F(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${p(F(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${p(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${p(F(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${p(F(i))}</div><div class="stat-sub">Neto: ${p(F(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Xi(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(k(o).getTime()-k(a).getTime())/(30.44*864e5)),s=Vt(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const c=s*(gt(e.inflacion,a,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${p(F(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${p(F(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${p(a.slice(0,7))} → ${p(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${p(F(i))}</span>
    </div>${r}
  </div>`}function Zi(t,e){const a=Ao[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),s=n.reduce((v,g)=>v+g.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),m=Ai(l,e.tramosIRPF),d=c*m/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${m}%`:`tipo marginal ${m}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${p(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${p(F(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${p(F(i))}/año${r?` ⚠ excede límite ${p(F(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${p(F(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${p(u)}">≈ ${p(F(d))}/año <span style="font-size:10px;color:var(--text3)">(${p(m)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${p(v.nomina.nombre)}: ${p(F(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function tr(t){const e=Fe(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(F(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(F(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${p(F(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${p(F(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${p(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${p(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function er(t,e){const a=ce(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=k(o.dashboardStart),i=k(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=a.saldo+n.totalAportaciones-n.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,m=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=a.costBase+n.totalAportaciones,u=Math.max(0,m-d),v=_e(u,e.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",y=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",f=(S,P,w)=>S.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${P} ${p(E.contraparte)}: ${p(E.concepto)}</span>
          <span class="num ${w}">${p(F(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),C=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${p(o.dashboardStart.slice(0,7))} → ${p(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${p(F(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${p(F(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${p(F(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=e.invModo(t._id),x=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(F(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${p(F(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${p(F(a.neto))}</div><div class="stat-sub">${p(y)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${p(F(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${p(F(m))}</div><div class="stat-sub">${p(b)} · ${p(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${p(F(m-v))}</div><div class="stat-sub">${p(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${p(t._id)}|real" style="${x(I==="real")}">Real</button>
          <button data-inv-modo="${p(t._id)}|proyeccion" style="${x(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${C}
    </div>`}function ar(t,e){const a=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=a[0],n=vt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${p((Ao[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${p(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${p(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${p(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Ki}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Wi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${p(F(t.saldoInicial||0))}</div><div class="stat-sub">${p(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${p(F(n))}</div>${o?`<div class="stat-sub">Registro: ${p(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${p(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${p(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Xi(t,e)}
    ${s==="beneficio"?Zi(t,e):""}
    ${s==="pension"?tr(t):""}
    ${s==="inversion"?er(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${p(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${p(t.descripcion)}</div>`:""}
  </div>`}const or=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function nr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(F(a.importe))} / ${p(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function sr(t,e){const a=t?rt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ae("ac-modelo","Tipo",or,a)}
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
          ${ae("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${ae("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function ir(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=nr(e))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return N("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function rr(t,e,a,o,n){const s=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const y=parseFloat(s(g));return Number.isFinite(y)?y:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=s("#ac-modelo")||"cuenta",m=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:e,tipoBeneficio:m?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:m?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?n:u.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:d,nota:a?"Actualización manual":"Saldo inicial"}}}function Je(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:J(e.saldoCts),nota:e.nota,derivado:e.origen==="derivado"}))}function cr(t,e,a,o,n){const s=a.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${p(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${p(F(r.saldo))}</span>
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
    </div>`}const Mo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function lr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ut;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){e=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${p(Mo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(Mo(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tg]",b=>{const y=b.getAttribute("data-editar-tg");d(y==="default"?"default":Number(y))}),j(g,"[data-borrar-tg]",b=>{const y=Number(b.getAttribute("data-borrar-tg"));ot(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==y)),N(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return N("Año inválido","err");const y=t.store.get("tramosGananciasCapitalHistorico");if(y.some(h=>h.año===b))return N("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([u,v],g)=>`<div class="grid-2 mt-8">
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
      </div>`);if(!b)return;const y=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};j(b,"[data-volver-tg]",c),j(b,"[data-tg-anadir]",()=>{m(b),a.push([0,0]),y()}),j(b,"[data-tg-borrar]",h=>{m(b),a.splice(Number(h.getAttribute("data-tg-borrar")),1),y()}),j(b,"[data-tg-guardar]",()=>{m(b);const h=[...a].sort((C,I)=>C[0]-I[0]);if(h.length===0)return N("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),N("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(C=>C.año===e?{...C,tramos:h}:C)),N(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const dr=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function ur(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${dr.map(e=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${e.id}" style="${e.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${e.etiqueta}</button>`).join("")}
  </div>`}function pr(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Eo(t,e){const a=k(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function mr(t,e,a){const o=Eo(a,1)[0],n=e.slice(0,7)<o?e.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function Po(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function fr(t,e){const{inicio:a,fin:o}=Po(e);return Qe(t,a,o)}function Qe(t,e,a){return Yt([t],{start:e,end:a}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function gr(t){function e(n,s={}){var P;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:l,hasta:m}=s,d=t.transacciones({estimacionId:n._id}),v=d.length===0&&(((P=n.tags)==null?void 0:P.length)??0)>0?t.transacciones({tags:n.tags}):d,g=l&&m?mr(l,m,c):Eo(c,i),b=new Map(g.map(w=>{const{inicio:E,fin:_}=Po(w);return[w,{inicio:l&&l>E?l:E,fin:m&&m<_?m:_}]})),y=new Map;for(const w of v){const E=b.get(w.fecha.slice(0,7));if(!E||w.fecha<E.inicio||w.fecha>E.fin)continue;const _=w.fecha.slice(0,7);y.set(_,(y.get(_)??0)+Math.abs(w.importeCts)/100)}const f=[];for(const w of g){const E=y.get(w);if(E===void 0)continue;const _=b.get(w),M=G(Qe(n,_.inicio,_.fin));f.push({mes:w,estimado:M,real:G(E),desviacion:G(E-M),precision:pr(M,E)})}const h=G(f.reduce((w,E)=>w+E.estimado,0)),C=G(f.reduce((w,E)=>w+E.real,0)),I=f.reduce((w,E)=>w+Math.abs(E.estimado),0),x=f.length===0?null:I>0?f.reduce((w,E)=>w+E.precision*Math.abs(E.estimado),0)/I:f.reduce((w,E)=>w+E.precision,0)/f.length,$=f.slice(-r),S=$.length>0?G($.reduce((w,E)=>w+E.real,0)/$.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:h,realTotal:C,desviacionTotal:G(C-h),precision:x,mediaRealReciente:S,infraestimada:C>h}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:G(r.estimado),realTotal:G(r.real),desviacionTotal:G(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function vr(t){const[e,a]=t.split("-").map(Number);return`${t}-${String(new Date(e,a,0).getDate()).padStart(2,"0")}`}function br(t,e){const a=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=e.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)a.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return a}function hr(t,e,a,o){const n=r=>e.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return br(a,o).map(r=>{const c={desde:`${r}-01`,hasta:vr(r)},l=b=>G(t.transacciones({...c,tipo:b}).reduce((y,f)=>y+Math.abs(f.importeCts)/100,0)),m=b=>G(b.reduce((y,f)=>y+fr(f,r),0)),d=m(s),u=l("gasto"),v=m(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:G(v-d),netoReal:G(g-u)}})}const ge=640,Bt=200,Q={top:14,right:16,bottom:26,left:54};function yr(t){return me(t).slice(0,3)}const $r={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function xr(t,e="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=$r[e],o=t.flatMap(y=>[a(y).estimado,a(y).real]),n=ge-Q.left-Q.right,s=Bt-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=y=>Q.left+(t.length===1?n/2:y/(t.length-1)*n),m=y=>Q.top+s-(y-r)/c*s,d=t.map((y,f)=>`${l(f)},${m(a(y).estimado)}`).join(" "),u=t.map((y,f)=>`${l(f)},${m(a(y).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${m(0).toFixed(1)}" x2="${ge-Q.right}" y2="${m(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((y,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${m(a(y).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${p(me(y.mes))}: ${p(F(a(y).real))}</title></circle>`).join(""),b=t.map((y,f)=>`<text x="${l(f).toFixed(1)}" y="${Bt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${p(yr(y.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${ge} ${Bt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${Bt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${Bt-Q.bottom}" x2="${ge-Q.right}" y2="${Bt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Q.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${p(F(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const _o={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},wr=[25,50,100,250,0];function Ir(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Do(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ne(Do(t,5)).desde,intervaloHasta:ne(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function Fo(t,e,a){const o=t.length;if(a<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const n=Math.max(1,Math.ceil(o/a)),s=Math.min(Math.max(1,e),n),i=(s-1)*a;return{pagina:t.slice(i,i+a),actual:s,paginas:n,total:o,desde:o>0?i+1:0,hasta:Math.min(i+a,o)}}function ve(t,e,a){if(t.total===0)return"";const o=(s,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${s}" ${r?"":"disabled"} title="${p(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,n=wr.map(s=>`<option value="${s}"${s===e?" selected":""}>${s===0?"todos":`${s} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${p(a)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${n}</select>
      </div>
    </div>`}function Xe(t,e,a,o){const n=t===e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${p(o)}" style="${n}">${p(a)}</button>`}function ne(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Do(t,e){const[a,o]=t.split("-").map(Number),n=new Date(a,o-1-e,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Ze(t,e){const[a,o]=t<=e?[t,e]:[e,t];return{desde:ne(a).desde,hasta:ne(o).hasta}}function Cr(t,e){return t<=e?{desde:t,hasta:e}:{desde:e,hasta:t}}function ta(t){const e=new Map;for(const a of t){const o=a.concepto.trim(),n=e.get(o);n?n.push(a):e.set(o,[a])}return[...e.entries()].filter(([,a])=>a.length>1).map(([a,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:a,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((a,o)=>o.movimientos.length-a.movimientos.length||a.concepto.localeCompare(o.concepto))}function Sr(t,e){if(t.tagsComunes.length===0)return null;const a=new Set(t.movimientos.map(s=>s._id)),o=e.filter(s=>!a.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function Ar(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const e=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",a=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${p(F(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${p(F(J(t.gastadoCts)))}</strong></span>
      <span style="color:${e}">Diferencia: <strong style="font-family:var(--font-mono)">${a}${p(F(J(t.diferenciaCts)))}</strong></span>
    </div>`}function Mr(t,e){const{ledger:a}=t,o=(t.hoy??K)(),n=t.accounts().filter(A=>A.activo),s=e.vista==="agrupado",i=e.vista==="intervalo",{desde:r,hasta:c}=s?Ze(e.periodoDesde,e.periodoHasta):i?Cr(e.intervaloDesde,e.intervaloHasta):ne(e.mes),l={cuentaId:e.cuentaId||void 0,desde:r,hasta:c,texto:e.filtroTexto||void 0},m=a.transacciones(l),d=t.estimaciones().filter(A=>A.tipo!=="transferencia"),u=[...d.map(A=>({_id:A._id,etiqueta:`${p(A.concepto)} (${p(F(A.cuantia))})`})),...t.loans().filter(A=>A.activo).map(A=>({_id:A._id,etiqueta:`Préstamo: ${p(A.nombre)}`})),...t.nominas().filter(A=>A.activo).map(A=>({_id:A._id,etiqueta:`Nómina: ${p(A.nombre)}`}))],v=m.filter(A=>A.tipo!=="transferencia"&&A.importeCts<0).reduce((A,z)=>A+z.importeCts,0),g=m.filter(A=>A.tipo!=="transferencia"&&A.importeCts>0).reduce((A,z)=>A+z.importeCts,0),b=e.cuentaId?a.saldoCuenta(e.cuentaId,c):a.saldoTotal(c),y=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),f=n.map(A=>`<option value="${p(A._id)}"${A._id===e.cuentaId?" selected":""}>${p(A.nombre)}</option>`).join(""),h=A=>'<option value="">— sin asignar —</option>'+u.map(z=>`<option value="${p(z._id)}"${z._id===A?" selected":""}>${z.etiqueta}</option>`).join(""),C=A=>Object.keys(_o).map(z=>`<option value="${z}"${z===A?" selected":""}>${_o[z]}</option>`).join(""),I=Fo(m,e.pagina,e.porPagina),x=new Map(t.accounts().map(A=>[A._id,A.nombre])),$=I.pagina.map(A=>`
      <tr data-tx="${p(A._id)}" style="border-bottom:1px solid var(--border)${A.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${p(A.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${p(A.concepto)}</td>
        <td style="padding:7px 8px">${fo(A.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${p(x.get(A.cuentaId)??A.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${p(A._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${C(A.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${p(A._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(A.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(A.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${p(A._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${p(A._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),S=i?hr(a,d,r,c):[],P=s?a.transacciones({desde:r,hasta:c}):[],w=s?ta(m):[],E=Fo(w,e.pagina,e.porPagina),_=E.pagina.map(A=>{const z=e.detalleAbierto.has(A.concepto),D=z?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${fo(A.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${p(A.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${p(A.concepto)}">Asignar</button>
               </div>
               ${Ar(Sr(A,P))}
             </td>
           </tr>`:"",T=z?A.movimientos.map(R=>{var O;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${p(R.fecha)}</span> · ${p(((O=t.accounts().find(q=>q._id===R.cuentaId))==null?void 0:O.nombre)??R.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${p(R._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(R.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${It(J(R.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${p(A.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${p(A.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${z?"▾":"▸"}</button>
          <span style="font-size:13px">${p(A.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${A.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${p(A.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${A.movimientos.length} movimientos del grupo de golpe">${h(A.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(A.total))}</td>
        <td></td>
      </tr>${D}${T}`}).join(""),M=y.slice().reverse().slice(0,8).map(A=>{var z;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${p(A.fecha)}</span>
        <span style="color:var(--text3)">${p(((z=t.accounts().find(D=>D._id===A.cuentaId))==null?void 0:z.nombre)??A.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${p(F(J(A.saldoCts)))}</span>
        ${A.nota?`<span style="color:var(--text3)">${p(A.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${p(A._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span style="margin-left:auto">Saldo a ${p(c)}: <strong>${p(F(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${p(e.periodoDesde)} y ${p(e.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${ve(E,e.porPagina,"conceptos")}
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
                     ${_||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ve(E,e.porPagina,"conceptos")}`:`${ve(I,e.porPagina,"movimientos")}
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
                     ${$||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ve(I,e.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${p(r)} → ${p(c)}</div>
                        <div class="flex gap-6">
                          ${Xe("neto",e.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${Xe("gasto",e.comparativa,"Gasto","Solo el gasto")}
                          ${Xe("ingreso",e.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${xr(S,e.comparativa)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(A=>`<option value="${p(A)}"></option>`).join("")}</datalist>
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
          ${M?`<div class="mt-12">${M}</div>`:""}
        </div>
      </div>
    </div>`}function Er(t,e,a,o){const{ledger:n}=e,s=()=>{a.pagina=1,o()};U(t,"#acc-cuenta",r=>{a.cuentaId=r.value,s()}),U(t,"#acc-mes",r=>{a.mes=r.value||a.mes,s()}),j(t,"[data-acc-vista]",r=>{a.vista=r.getAttribute("data-acc-vista")||"mensual",s()}),U(t,"#acc-periodo-desde",r=>{a.periodoDesde=r.value||a.periodoDesde,s()}),U(t,"#acc-periodo-hasta",r=>{a.periodoHasta=r.value||a.periodoHasta,s()}),j(t,"[data-acc-pagina]",r=>{var c;r.disabled||(a.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),U(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);a.porPagina=Number.isFinite(c)&&c>=0?c:50,a.pagina=1,o()}),j(t,"[data-acc-comparativa]",r=>{a.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",r=>{a.intervaloDesde=r.value||a.intervaloDesde,s()}),U(t,"#acc-intervalo-hasta",r=>{a.intervaloHasta=r.value||a.intervaloHasta,s()}),j(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");a.detalleAbierto.has(c)?a.detalleAbierto.delete(c):a.detalleAbierto.add(c),o()}),U(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:m,hasta:d}=Ze(a.periodoDesde,a.periodoHasta),u=n.transacciones({cuentaId:a.cuentaId||void 0,desde:m,hasta:d,texto:a.filtroTexto||void 0}),v=ta(u).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)n.asignarEstimacion(g._id,l);N(`Estimación asignada a ${v.movimientos.length} movimientos`),e.onDatosCambiados(),o()}}),j(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,m=((l==null?void 0:l.value)??"").split(",").map(y=>y.trim().toLowerCase()).filter(Boolean);if(m.length===0)return N("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=Ze(a.periodoDesde,a.periodoHasta),v=n.transacciones({cuentaId:a.cuentaId||void 0,desde:d,hasta:u,texto:a.filtroTexto||void 0}),g=ta(v).find(y=>y.concepto===c);if(g){for(const y of g.movimientos)n.actualizar(y._id,{tags:[...new Set([...y.tags,...m])]});N(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),e.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{a.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{s();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),j(t,"#nt-guardar",()=>{const r=ct(t,"#nt-concepto").trim(),c=go(t,"#nt-importe");if(!r)return N("Indica un concepto","err");if(!(c>0))return N("Indica un importe mayor que cero","err");const l=ct(t,"#nt-tags").split(",").map(m=>m.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(e.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),N("Movimiento registrado"),e.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;ot("¿Eliminar este movimiento?")&&(n.eliminar(c),N("Movimiento eliminado"),e.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=n.transacciones().find(u=>u._id===c);if(!l)return;const m=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(J(l.importeCts))));if(m===null)return;const d=parseFloat(m.replace(",","."));if(!Number.isFinite(d)||d<=0)return N("Importe no válido","err");n.actualizar(c,{importe:d}),N("Movimiento actualizado"),e.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");n.asignarEstimacion(c,r.value||null),N("Asignación actualizada"),e.onDatosCambiados()}),U(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");n.actualizar(c,{tipo:r.value}),N("Tipo actualizado"),e.onDatosCambiados(),o()}),j(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return N("Indica el saldo","err");const c=go(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(e.hoy??K)(),c,ct(t,"#pc-nota").trim()||void 0),N("Saldo real registrado"),e.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",r=>{ot("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(r.dataset.pcBorrar),N("Punto de control eliminado"),e.onDatosCambiados(),o())})}function ea(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=G(t.mediaRealReciente),i=G(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:G(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function Pr(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const c=r.hoy??K(),l=t.get("expenses"),m=l.find(g=>g._id===s);if(!m)throw new Error(`La estimación ${s} no existe`);const d={...m,fechaFin:c},u={...m,_id:e(),cuantia:G(i),fechaInicio:c,fechaFin:m.fechaFin??null,ajustadaDesdeId:m._id,ajustadaEn:c},v=l.map(g=>g._id===s?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const l of s)try{r.push(a(l.estimacionId,l.cuantiaSugerida,i))}catch(m){c.push({estimacionId:l.estimacionId,error:m.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const l=[];let m=c;const d=new Set;for(;m!=null&&m.ajustadaDesdeId&&!d.has(m._id);){d.add(m._id);const b=r.get(m.ajustadaDesdeId);if(!b)break;l.unshift(b),m=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find(y=>y.ajustadaDesdeId===v._id&&!g.has(y._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:a,aplicarTodas:o,cadena:n}}function To(t){var n;const e=t.estimaciones(),a=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(e.map(s=>[s._id,s]));return t.precision.analizarTodas(e,a?{desde:a.desde,hasta:a.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:ea(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function _r(t){var a;const e=((a=t.rango)==null?void 0:a.call(t))??null;return e?p(`Limitado al periodo de la cabecera (${e.desde} → ${e.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Fr(t){var r;const e=To(t),a=e.filter(c=>c.analisis.precision!==null),o=e.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(e.map(c=>c.analisis));if(a.length===0)return`
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${It(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Zs(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${_r(t)}
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
    </div>`}function Dr(t,e,a){j(t,"#ajustar-todas",()=>{const o=To(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!ot(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});N(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Tr=[";",",","	","|"],zr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function be(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function he(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function jr(t){let e=";",a=-1;for(const o of Tr){const n=t.slice(0,20).map(c=>he(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>a&&(a=r,e=o)}return e}function se(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const m=s===","?o:n;i=e.slice(0,m).replace(/[.,]/g,""),r=e.slice(m+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?a?-l:l:null}function aa(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return zo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),zo(o,Number(a[2]),Number(a[1]))}return null}function zo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function jo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>aa(a)!==null).length/e.length}function qo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>se(a)!==null).length/e.length}function qr(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=be(t[i]);if(r&&zr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&be(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=jo(n(r));c>i&&(i=c,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||be(t[r]).includes("saldo"))continue;const c=qo(n(r));c>i&&(i=c,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(qo(c)>.5||jo(c)>.5)continue;const l=c.reduce((m,d)=>m+d.length,0)/Math.max(1,c.length);l>i&&(i=l,s=r)}s>=0&&(a.concepto=s)}return a}function Nr(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(m=>m.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=jr(e),o=e.map(m=>he(m,a).length),n=Math.max(...o);let s=o.findIndex(m=>m===n);s<0&&(s=0);const i=he(e[s],a);let r=e.slice(s+1).map(m=>he(m,a));const c=aa(i[0]??"")!==null||i.some(m=>se(m)!==null&&/\d/.test(m));c&&(r=[i,...r]);const l=qr(c?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:c?i.map((m,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:l}}function No(t,e,a){return`${t}|${e}|${be(a).replace(/\s+/g," ")}`}function Rr(t,e,a=[]){const o=new Set(a.map(s=>No(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=e.fecha>=0?aa(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let l=null;if(e.importe>=0)l=se(s[e.importe]??""),l===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const u=e.debe>=0?se(s[e.debe]??""):null,v=e.haber>=0?se(s[e.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const m=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=No(c,l,m);d=o.has(u)||n.has(u),n.add(u)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:m,importeCts:l,errores:r,duplicada:d}})}function Lr(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ye(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Or=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function oa(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Rr(e.analisis,e.mapeo,a)}function kr(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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

      ${e.analisis&&e.mapeo?Hr(e,e.analisis,e.mapeo):Br()}
    </div>`}function Br(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Hr(t,e,a){const o=Lr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${p(c||`Columna ${l+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${p(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${p(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Or.map(r=>`<div class="form-group">
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":p(F(J(r.importeCts)))}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Gr(t,e,a,o){j(t,"[data-imp-sincronizar]",()=>{const s=e.ledger.sincronizarHistoricoImportado();if(s.length===0)return N("Nada que sincronizar: no hay movimientos importados todavía");const i=m=>{var d;return((d=e.accounts().find(u=>u._id===m))==null?void 0:d.nombre)??m},r=s.reduce((m,d)=>m+d.eliminados,0),c=s.reduce((m,d)=>m+d.semanales,0),l=s.map(m=>`${i(m.cuentaId)} (${m.semanales})`).join(", ");N(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),e.onDatosCambiados(),o()}),j(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,ye(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),j(t,"[data-imp-cerrar]",()=>{Object.assign(a,ye()),o()}),U(t,"#imp-cuenta",s=>{a.cuentaId=s.value,oa(e,a),o()}),U(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),oa(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Vr(s).then(r=>{const c=Nr(r);a.nombreFichero=s.name,a.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=c,a.mapeo={...c.mapeo},oa(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),j(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(l=>l.errores.length===0&&(a.incluirDuplicadas||!l.duplicada));if(s.length===0)return;for(const l of s)e.ledger.registrar({fecha:l.fecha,cuentaId:a.cuentaId,importe:Math.abs(J(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=s.map(l=>l.fecha).sort(),r=e.ledger.eliminarPuntosControlEnRango(a.cuentaId,i[0],i[i.length-1]),c=e.ledger.generarPuntosSemanales(a.cuentaId);N(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(a,ye()),e.onDatosCambiados(),o()})}function Vr(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function Ur(t,e){if(e<t)return 0;let a=0,[o,n]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(n).padStart(2,"0")}`<=e.slice(0,7);){const s=new Date(o,n,0).getDate(),i=`${o}-${String(n).padStart(2,"0")}-01`,r=`${o}-${String(n).padStart(2,"0")}-${String(s).padStart(2,"0")}`,c=t>i?t:i,l=e<r?e:r,m=(k(l).getTime()-k(c).getTime())/864e5+1;a+=m/s,++n>12&&(n=1,o++)}return a}function Yr(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Wr(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function na(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Ro(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const l=(c.tags??[]).filter(m=>s.tags.includes(m)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(s)}return o}function Lo(t,e,a,o={}){const s=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:G(Qe(c,e,a)),origen:"estimacion",cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1);if(i.length>0){const c=ze(i,{start:e,end:a},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);s.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:G(d),origen:"nomina"})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Te(r,{start:e,end:a});for(const l of r){const m=c.filter(d=>d.sourceId===l._id);m.length!==0&&s.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:G(m.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo"})}}return s}function Kr(t,e,a,o={}){const{desde:n,hasta:s}=Yr(a);return{...Oo(t,e,n,s,o),mes:a}}function Oo(t,e,a,o,n={}){const s=t.transacciones({desde:a,hasta:o}),i=new Set(n.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(na(D.concepto)),c=s.filter(D=>r(D)&&D.importeCts<0),l=s.filter(D=>r(D)&&D.importeCts>0),m=s.filter(D=>D.tipo!=="transferencia"&&i.has(na(D.concepto))),d=new Map((n.analisis??[]).map(D=>[D.estimacionId,D])),u=Lo(e,a,o,n),v=D=>new Set(D.filter(T=>t.transacciones({estimacionId:T._id}).length>0).map(T=>T._id)),g=u.filter(D=>D.tipo==="gasto"),b=u.filter(D=>D.tipo==="ingreso"),y=Ro(c,g,D=>v(g).has(D)),f=Ro(l,b,D=>v(b).has(D)),h=new Set,C=new Set,I=(D,T,R)=>{for(const B of T)R.add(B._id);const O=G(T.reduce((B,L)=>B+Math.abs(L.importeCts)/100,0)),q=D.origen==="estimacion"?d.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,tags:D.tags,estimado:D.estimado,real:O,desviacion:G(O-D.estimado),sinMovimiento:T.length===0,sugerencia:q?ea(q,D.cuantia??0,{hoy:n.hoy}):null}},x=g.map(D=>I(D,y.get(D._id)??[],h)),$=b.map(D=>I(D,f.get(D._id)??[],C)),S=(D,T)=>{const R=new Map;for(const O of D){if(T.has(O._id))continue;const q=na(O.concepto),B=R.get(q)??{concepto:O.concepto,clave:q,total:0,movimientos:0,ids:[]};B.total=G(B.total+Math.abs(O.importeCts)/100),B.movimientos+=1,B.ids.push(O._id),R.set(q,B)}return[...R.values()].sort((O,q)=>q.total-O.total)},P=S(c,h),w=S(l,C),E=S(m,new Set),_=G(x.reduce((D,T)=>D+T.estimado,0)),M=G(c.reduce((D,T)=>D+Math.abs(T.importeCts)/100,0)),A=G($.reduce((D,T)=>D+T.estimado,0)),z=G(l.reduce((D,T)=>D+T.importeCts/100,0));return{mes:a.slice(0,7),desde:a,hasta:o,estimado:_,real:M,desviacion:G(M-_),ingresosEstimados:A,ingresosReales:z,desviacionIngresos:G(z-A),netoEstimado:G(A-_),netoReal:G(z-M),desviacionNeta:G(z-M-(A-_)),filas:[...x,...$].sort((D,T)=>Math.abs(T.desviacion)-Math.abs(D.desviacion)),sinEstimacion:P,totalSinEstimacion:G(P.reduce((D,T)=>D+T.total,0)),ingresosSinPrever:w,totalIngresosSinPrever:G(w.reduce((D,T)=>D+T.total,0)),porTag:Jr(g,c),meses:Ur(a,o),omitidos:E,totalOmitido:G(E.reduce((D,T)=>D+T.total,0)),vacio:s.length===0}}function Jr(t,e){const a=new Map,o=(n,s,i)=>{for(const r of n.length>0?n:["sin etiqueta"]){const c=a.get(r)??{estimado:0,real:0};c[s]+=i,a.set(r,c)}};for(const n of t)o(n.tags,"estimado",n.estimado);for(const n of e)o(n.tags,"real",Math.abs(n.importeCts)/100);return[...a.entries()].map(([n,s])=>({tag:n,estimado:G(s.estimado),real:G(s.real),desviacion:G(s.real-s.estimado)})).filter(n=>n.estimado>0||n.real>0).sort((n,s)=>s.real-n.real||s.estimado-n.estimado)}function ko(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}const $e=26,sa=7,ia=($e+sa)*2,Bo=2*Math.PI*$e,Ho=12;function Qr(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const e=t.real/t.estimado*100;return{color:e>110?"var(--red)":e>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(e)}%`]}}function Xr(t){const{color:e,fraccion:a,etiqueta:o}=Qr(t),n=ia/2,s=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${ia} ${ia}" style="width:78px;height:78px" role="img" aria-label="${p(s)}">
        <title>${p(s)}</title>
        <circle cx="${n}" cy="${n}" r="${$e}" fill="none" stroke="var(--bg3)" stroke-width="${sa}"/>
        <circle cx="${n}" cy="${n}" r="${$e}" fill="none" stroke="${e}" stroke-width="${sa}"
                stroke-linecap="round" stroke-dasharray="${(Bo*a).toFixed(2)} ${Bo.toFixed(2)}"
                transform="rotate(-90 ${n} ${n})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=n+(o.length>1?r*10-1:4);return`<text x="${n}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${p(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${p(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${p(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${p(F(t.estimado))}</div>
    </div>`}function Zr(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const e=t.slice(0,Ho),a=t.slice(Ho),o=a.reduce((n,s)=>n+s.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${e.map(Xr).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${a.length>0?`<span style="color:var(--text3)">y ${a.length} etiqueta(s) más, ${p(F(o))}</span>`:""}
    </div>`}function tc(){return{mes:"",modo:"mes"}}function Go(t,e){if(e.mes)return e.mes;const a=ko(t.ledger),o=Wr((t.hoy??K)());return a.includes(o)?o:a[0]??o}function xe(t,e){var i;const a=(t.hoy??K)(),o=t.estimaciones(),n={hoy:a,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(e.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:a,desde:r,hasta:c});return Oo(t.ledger,o,r,c,{...n,analisis:l})}const s=t.precision.analizarTodas(o,{hoy:a});return Kr(t.ledger,o,Go(t,e),{...n,analisis:s})}function Vo(t){var n;const e=(t.hoy??K)(),a=Lo(t.estimaciones(),e,e,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(n=t.resolverTramosIRPF)==null?void 0:n.call(t)}),o=s=>a.filter(i=>i.tipo===s).map(i=>`<option value="${p(i._id)}">${p(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function ft(t,e){return e<=0?"—":`${p(F(t/e))}/mes`}function Uo(t,e,a,o){const n=e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${p(o)}" style="${n}">${p(a)}</button>`}function ec(t,e){const a=e.modo==="periodo",o=Go(t,e),n=ko(t.ledger);n.includes(o)||n.unshift(o);const s=xe(t,e),i=a?"Cierre del periodo":"Cierre de mes",r=a?`del ${p(s.desde)} al ${p(s.hasta)}`:p(me(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Uo("mes",!a,"Mes","Cierra un mes natural completo")}
      ${Uo("periodo",a,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${a?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${p(s.desde)} → ${p(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(d=>`<option value="${p(d)}"${d===o?" selected":""}>${p(me(d))}</option>`).join("")}
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
          <div class="stat-value" style="font-size:1.15rem">${p(F(s.real))}</div>
          <div class="stat-sub">${ft(s.real,s.meses)} · previsto ${p(F(s.estimado))} (${ft(s.estimado,s.meses)})</div>
          <div class="stat-sub">${l(s.desviacion)}${p(F(s.desviacion))} · ${l(s.desviacion)}${ft(s.desviacion,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${p(F(s.ingresosReales))}</div>
          <div class="stat-sub">${ft(s.ingresosReales,s.meses)} · previsto ${p(F(s.ingresosEstimados))} (${ft(s.ingresosEstimados,s.meses)})</div>
          <div class="stat-sub">${l(s.desviacionIngresos)}${p(F(s.desviacionIngresos))} · ${l(s.desviacionIngresos)}${ft(s.desviacionIngresos,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${m}">${l(s.desviacionNeta)}${p(F(s.desviacionNeta))}</div>
          <div class="stat-sub">${l(s.desviacionNeta)}${ft(s.desviacionNeta,s.meses)}</div>
          <div class="stat-sub">neto real ${p(F(s.netoReal))} · previsto ${p(F(s.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${p(F(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${ft(s.totalSinEstimacion,s.meses)} · ${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${s.totalIngresosSinPrever>0?`${p(F(s.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${p(s.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${ac(s)}
      ${oc(s,Vo(t))}
      ${sc(s,Vo(t))}
      ${nc(s)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${Zr(s.porTag)}
    </div>`}function ac(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const a=e.filter(o=>o.sugerencia);return`
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
                  ${o.desviacion>0?"+":""}${p(F(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${p(o.estimacionId)}"
                           title="Pasar la estimación de ${p(F(i.cuantiaActual))} a ${p(F(i.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${p(F(i.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function Yo(t,e,a,o){return`<tr>
    <td style="font-size:12px">${p(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${p(F(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${ft(t.total,e)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${p(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${a}
      </select>
      <button class="btn-secondary btn-sm" data-cie-omitir="${p(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const Wo=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function oc(t,e){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${Wo}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(a=>Yo(a,t.meses,e.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function nc(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${p(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(e=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${p(e.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${p(e.concepto)} · ${p(F(e.total))} ✕</button>`).join("")}
    </div>`}function sc(t,e){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${Wo}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(a=>Yo(a,t.meses,e.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function ic(t,e,a,o){U(t,"#cie-mes",n=>{a.mes=n.value,o()}),j(t,"[data-cie-modo]",n=>{a.modo=n.getAttribute("data-cie-modo")||"mes",o()}),j(t,"[data-cie-omitir]",n=>{const s=n.getAttribute("data-cie-omitir"),i=e.omitidos();i.includes(s)||(e.setOmitidos([...i,s]),N("Concepto omitido: deja de contar en el cierre"),o())}),j(t,"[data-cie-restaurar]",n=>{const s=n.getAttribute("data-cie-restaurar");e.setOmitidos(e.omitidos().filter(i=>i!==s)),o()}),U(t,"[data-cie-asignar]",n=>{const s=n,i=s.getAttribute("data-cie-asignar"),r=s.value;if(!r)return;const c=xe(e,a),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(m=>m.clave===i);if(l){if(!ot(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){s.value="";return}for(const m of l.ids)e.ledger.asignarEstimacion(m,r);N(`${l.movimientos} movimiento(s) asignados`),e.onDatosCambiados(),o()}}),j(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=xe(e,a).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??K)()}),N(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),j(t,"[data-cie-ajustar-todas]",()=>{const s=xe(e,a).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??K)()});N(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const rc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function cc(t){const e=t.hoy??K,a=()=>{var T;return(T=t.onDatosCambiados)==null?void 0:T.call(t)},o=new Map;let n="cuentas";const s=Ir(e().slice(0,7)),i=ye(),r=tc(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),m={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:a,hoy:e},d={ledger:t.ledger,accounts:l,onDatosCambiados:a},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Ft(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt),omitidos:()=>u().cierreOmitidos??[],setOmitidos:T=>t.store.patchConfig({cierreOmitidos:T}),onDatosCambiados:a,periodo:v,hoy:e},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:a,rango:()=>r.modo==="periodo"?v():null,hoy:e},y=T=>{var R;return((R=t.store.get("accounts").find(O=>O._id===T))==null?void 0:R.nombre)??T},f=()=>Ft(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt)(Number(e().slice(0,4))),h=()=>Ft(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Ut),C=()=>h()(Number(e().slice(0,4)));function I(){const T=u(),R=t.store.get("accounts"),O=za({loans:[],expenses:t.store.get("expenses").filter(H=>H.tipo==="transferencia"),accounts:R,config:{dashboardStart:T.dashboardStart,dashboardEnd:T.dashboardEnd,fechaReferencia:T.dashboardStart},nominas:[],resolverTramosGanancias:h()}),q=new Map,B=H=>{let V=q.get(H);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},q.set(H,V)),V},L=(H,V)=>{const Z=`${V.sourceId}`,et=H.find(ua=>ua.concepto===Z),nt=et??{concepto:Z,contraparte:"",total:0,ocurrencias:0};nt.total+=Math.abs(V.cuantia),nt.ocurrencias+=1,et||H.push(nt)};for(const H of O){if(!H.cuenta)continue;const V=B(H.cuenta);H.sourceType==="transfer-in"||H.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(H.cuantia),L(V.entradas,H)):H.sourceType==="transfer-out"||H.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(H.cuantia),L(V.salidas,H)):H.sourceType==="investment-tax"&&(V.retencion+=Math.abs(H.cuantia))}const Y=t.store.get("expenses");for(const H of q.values())for(const[V,Z]of[[H.entradas,"cuenta"],[H.salidas,"cuentaDestino"]])for(const et of V){const nt=Y.find(ua=>ua._id===et.concepto);et.contraparte=y((nt==null?void 0:nt[Z])??"default"),et.concepto=(nt==null?void 0:nt.concepto)||(Z==="cuenta"?"Aportación":"Reembolso")}return q}function x(T){const R=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let O;if(n==="cuentas"){const L=t.store.get("accounts").filter(V=>rt(V)!=="pension"),Y=I(),H={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:C(),flujos:V=>Y.get(V)??Ji,invModo:V=>o.get(V)??"proyeccion"};O=`${Qi(L,H.tramosGanancias)}<div class="grid-3">${L.map(V=>ar(V,H)).join("")}</div>`}else n==="movimientos"?O='<div id="acc-tx"></div>':n==="importar"?O='<div id="acc-import"></div>':O='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';T.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${R}
      </div>
      ${ur(n)}
      ${O}`;const q=()=>x(T);if(n==="movimientos"){const B=T.querySelector("#acc-tx");B.innerHTML=Mr(m,s),Er(B,m,s,q)}else if(n==="importar"){const B=T.querySelector("#acc-import");B.innerHTML=kr(d,i),Gr(B,d,i,q)}else if(n==="cierre"){const B=T.querySelector("#acc-cierre"),L=T.querySelector("#acc-precision");B.innerHTML=ec(g,r),L.innerHTML=Fr(b),ic(B,g,r,q),Dr(L,b,q)}}const $=()=>document.getElementById("modal-overlay"),S=()=>document.getElementById("modal-content"),P=()=>{var T;return(T=$())==null?void 0:T.classList.add("hidden")};function w(T,R){const O=$(),q=S();return!O||!q?null:(q.innerHTML=T?`<div class="modal-title">${p(T)}</div>${R}`:R,O.classList.remove("hidden"),j(q,"[data-cancelar]",P),q)}function E(T,R){const O=T?t.store.get("accounts").find(Y=>Y._id===T)??null:null,q=[...(O==null?void 0:O.planAportaciones)??[]].map(Y=>({...Y})),B=O?_(O):null,L=w(T?"Editar cuenta / fondo":"Nueva cuenta / fondo",sr(O,{nominas:t.store.get("nominas"),hoy:e(),saldoActual:B??0}));L&&(ir(L,q,e()),j(L,"[data-guardar-acc]",Y=>{const H=Y.getAttribute("data-guardar-acc")||"",{datos:V,punto:Z,error:et}=rr(L,q,O,B,e());if(et)return N(et,"err");let nt=H;H?t.store.updateItem("accounts",H,V):nt=t.store.addItem("accounts",V)._id,Z&&t.ledger.registrarPuntoControl(nt,Z.fecha,Z.saldo,Z.nota),N(H?"Actualizada":"Cuenta / fondo creado"),a(),P(),R()}))}function _(T){const R=t.ledger.puntosControl(T._id);return R.length>0?Je(R)[0].saldo:T.saldo??null}function M(T,R){const O=t.store.get("accounts").find(L=>L._id===T);if(!O)return;const q=w("Histórico de saldos",cr(O.nombre,T,Je(t.ledger.puntosControl(T)),O.saldoInicial||0,e()));if(!q)return;const B=()=>{R(),M(T,R)};j(q,"[data-hist-anadir]",()=>{var V,Z,et;const L=((V=q.querySelector("#hi-fecha"))==null?void 0:V.value)??"",Y=parseFloat(((Z=q.querySelector("#hi-saldo"))==null?void 0:Z.value)??""),H=((et=q.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!L||!Number.isFinite(Y))return N("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(T,L,Y,H||void 0),N("Punto añadido"),a(),B()}),j(q,"[data-hist-borrar]",L=>{const[,Y]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),N("Eliminado"),a(),B()}),j(q,"[data-hist-semanal]",L=>{const Y=L.getAttribute("data-hist-semanal"),H=t.ledger.generarPuntosSemanales(Y);N(H>0?`Histórico con ${H} punto${H!==1?"s":""} semanal${H!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),a(),B()}),j(q,"[data-hist-inicial]",L=>{const[Y,H]=(L.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(Y).find(et=>et._id===H);if(!V)return;const Z=Je([V])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:Z,fechaInicialSaldo:V.fecha}),N(`Punto inicial → ${V.fecha} (${F(Z)})`),a(),B()})}function A(T){const R=t.store.get("accounts").filter(B=>B.activo);if(R.length===0)return N("No hay cuentas activas","err");const O=e(),q=R.map(B=>`• ${B.nombre}: ${F(_(B)??B.saldoInicial??0)}`).join(`
`);if(ot(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${O})?

${q}

Esto recalibra el punto de arranque del dashboard.`)){for(const B of R)t.store.updateItem("accounts",B._id,{saldoInicial:_(B)??B.saldoInicial??0,fechaInicialSaldo:O});N("Saldo base actualizado"),a(),T()}}function z(T,R,O){j(T,"[data-cuentas-tab]",q=>{n=q.getAttribute("data-cuentas-tab")||"cuentas",R()}),j(T,"[data-nueva-acc]",()=>E(null,R)),j(T,"[data-editar-acc]",q=>E(q.getAttribute("data-editar-acc"),R)),j(T,"[data-tramos-ganancias]",()=>O.abrir()),j(T,"[data-reset-base]",()=>A(R)),j(T,"[data-hist-acc]",q=>M(q.getAttribute("data-hist-acc"),R)),j(T,"[data-principal-acc]",q=>{const B=q.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===B}))),N("Cuenta marcada como principal"),a(),R()}),j(T,"[data-borrar-acc]",q=>{const B=q.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return N("Debe existir al menos una cuenta","err");if(!ot("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",B);const Y=t.store.get("accounts");Y.length>0&&!Y.some(H=>H.esCuentaPrincipal)&&t.store.set("accounts",Y.map((H,V)=>V===0?{...H,esCuentaPrincipal:!0}:H)),N("Cuenta eliminada"),a(),R()}),j(T,"[data-inv-modo]",q=>{const[B,L]=(q.getAttribute("data-inv-modo")||"").split("|");o.set(B,L==="real"?"real":"proyeccion"),R()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:rc,mount(T){const R=()=>x(T);D??(D=lr({store:t.store,onDatosCambiados:()=>{a(),R()},año:()=>Number(e().slice(0,4))})),x(T),T.dataset.wired!=="1"&&(z(T,R,D),T.dataset.wired="1")}}}function Ko(t,e,a=!1){const o=Math.abs(it(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function lc(t){function e(w){return`${w}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(w={}){var _;const E=(_=w.texto)==null?void 0:_.trim().toLowerCase();return t.get("transacciones").filter(M=>!(w.cuentaId&&M.cuentaId!==w.cuentaId||w.desde&&M.fecha<w.desde||w.hasta&&M.fecha>w.hasta||w.tipo&&M.tipo!==w.tipo||w.estimacionId&&M.estimacionId!==w.estimacionId||w.tags&&w.tags.length>0&&!w.tags.some(A=>M.tags.includes(A))||E&&!M.concepto.toLowerCase().includes(E))).sort((M,A)=>M.fecha.localeCompare(A.fecha)||M._id.localeCompare(A._id))}function o(w){const E={_id:e("tx"),fecha:w.fecha,cuentaId:w.cuentaId,importeCts:Ko(w.tipo,w.importe,w.negativo),concepto:w.concepto,tags:w.tags??[],estimacionId:w.estimacionId??null,tipo:w.tipo,origen:w.origen??"manual",...w.nota?{nota:w.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),E]),E}function n(w,E){t.set("transacciones",t.get("transacciones").map(_=>{if(_._id!==w)return _;const{importe:M,...A}=E,z={..._,...A};return M!==void 0&&(z.importeCts=Ko(z.tipo,M,z.importeCts<0)),z}))}function s(w){t.set("transacciones",t.get("transacciones").filter(E=>E._id!==w))}function i(w,E){n(w,{estimacionId:E})}function r(w){return t.get("puntosControl").filter(E=>!w||E.cuentaId===w).sort((E,_)=>E.fecha.localeCompare(_.fecha))}function c(w){return r(w).filter(E=>E.origen!=="derivado")}function l(w,E,_,M){const A={_id:e("pc"),fecha:E,cuentaId:w,saldoCts:it(_),...M?{nota:M}:{}},z=t.get("puntosControl").filter(D=>!(D.cuentaId===w&&D.fecha===E));return t.set("puntosControl",[...z,A].sort((D,T)=>D.fecha.localeCompare(T.fecha))),u(w),A}function m(w){const E=t.get("puntosControl").find(_=>_._id===w);t.set("puntosControl",t.get("puntosControl").filter(_=>_._id!==w)),E&&(E.origen==="derivado"?y(E.cuentaId):u(E.cuentaId))}function d(w,E,_){const M=z=>z.cuentaId===w&&z.origen!=="derivado"&&z.fecha>=E&&z.fecha<=_,A=t.get("puntosControl").filter(M).length;return A===0?0:(t.set("puntosControl",t.get("puntosControl").filter(z=>!M(z))),y(w),A)}function u(w){var q,B;const E=c(w),_=t.get("transacciones").filter(L=>L.cuentaId===w).sort((L,Y)=>L.fecha.localeCompare(Y.fecha)),M=(q=_[0])==null?void 0:q.fecha,A=(B=_[_.length-1])==null?void 0:B.fecha,z=t.get("puntosControl").filter(L=>!(L.cuentaId===w&&L.origen==="derivado"));if(!M)return t.set("puntosControl",z),y(w),0;const D=[];for(let L=Gt(M);L<=A;L=Gt(fa(L,1)))D.push(L);D[D.length-1]!==A&&D.push(A);const T=new Set(E.map(L=>Gt(L.fecha))),R=L=>{const Y=E.filter(H=>H.fecha<=L).pop();return _.filter(H=>H.fecha<=L&&(!Y||H.fecha>Y.fecha)).reduce((H,V)=>H+V.importeCts,(Y==null?void 0:Y.saldoCts)??0)},O=D.filter(L=>!T.has(Gt(L))).map(L=>({_id:e("pcd"),fecha:L,cuentaId:w,saldoCts:R(L),origen:"derivado"}));return t.set("puntosControl",[...z,...O].sort((L,Y)=>L.fecha.localeCompare(Y.fecha))),v(w,M,R(M)),y(w),O.length}function v(w,E,_){const M=t.get("accounts"),A=M.find(z=>z._id===w);!A||A.fechaInicialSaldo&&A.fechaInicialSaldo<=E||t.set("accounts",M.map(z=>z._id===w?{...z,saldoInicial:J(_),fechaInicialSaldo:E}:z))}function g(w){return(w??[...new Set(t.get("transacciones").map(_=>_.cuentaId))]).reduce((_,M)=>_+u(M),0)}function b(w){const E=t.get("transacciones").filter(A=>A.origen==="importado"&&(!w||A.cuentaId===w)),_=new Map;for(const A of E){const z=_.get(A.cuentaId);z?z.push(A.fecha):_.set(A.cuentaId,[A.fecha])}const M=[];for(const[A,z]of _){z.sort();const D=d(A,z[0],z[z.length-1]);M.push({cuentaId:A,eliminados:D,semanales:u(A)})}return M}function y(w){const E=r(w),_=t.get("accounts");_.some(M=>M._id===w)&&t.set("accounts",_.map(M=>M._id===w?{...M,historicoSaldos:E.map(A=>({_id:A._id,fecha:A.fecha,saldo:J(A.saldoCts),...A.nota?{nota:A.nota}:{}}))}:M))}function f(w,E=K()){const _=c(w).filter(D=>D.fecha<=E).pop(),M=_==null?void 0:_.fecha,A=(_==null?void 0:_.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===w&&D.fecha<=E&&(M===void 0||D.fecha>M)).reduce((D,T)=>D+T.importeCts,A)}function h(w,E){return J(f(w,E))}function C(w=K(),E){const _=E??t.get("accounts").filter(M=>M.activo).map(M=>M._id);return J(_.reduce((M,A)=>M+f(A,w),0))}function I(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function x(){const w=[...t.get("transacciones").map(E=>E.fecha),...t.get("puntosControl").map(E=>E.fecha)];return w.length>0?w.sort().pop()??null:null}function $(w={}){return J(a(w).reduce((E,_)=>E+_.importeCts,0))}function S(w={}){const E=new Map;for(const _ of a(w)){const M=_.fecha.slice(0,7);E.set(M,(E.get(M)??0)+_.importeCts)}return new Map([...E.entries()].sort(([_],[M])=>_.localeCompare(M)).map(([_,M])=>[_,J(M)]))}function P(w={}){const E=new Map;for(const _ of a(w))for(const M of _.tags.length>0?_.tags:["sin_tag"])E.set(M,(E.get(M)??0)+_.importeCts);return new Map([...E.entries()].map(([_,M])=>[_,J(M)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:m,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:C,tieneDatos:I,ultimaFecha:x,total:$,totalPorMes:S,totalPorTag:P}}function pt(t){return t.trim().toLowerCase()}function dc(t){function e(){const l=new Map,m=(d,u)=>{const v=pt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])m(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])m(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function a(){return e().map(l=>l.tag)}function o(l){return e().filter(m=>l==="estimaciones"?m.reales===0:m.estimaciones===0).map(m=>m.tag)}function n(l,m,d){const u=pt(m),v=(l??[]).map(pt);if(!v.includes(u))return l??[];const g=v.filter(b=>b!==u);return d===null?[...new Set(g)]:[...new Set([...g,pt(d)])]}function s(l,m){const d=pt(m);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,m){let d=0;for(const u of l)pt(u)!==pt(m)&&(d+=c(u,pt(m)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,m){let d=0;const u=t.get("expenses").map(S=>{const P=n(S.tags,l,m);return P!==S.tags&&(d+=1),P===S.tags?S:{...S,tags:P}});t.set("expenses",u);const v=t.get("transacciones").map(S=>{const P=n(S.tags,l,m);return P!==S.tags&&(d+=1),P===S.tags?S:{...S,tags:P}});t.set("transacciones",v);const g=t.get("loans").map(S=>{const P=n(S.tags,l,m);return P!==S.tags&&(d+=1),P===S.tags?S:{...S,tags:P}});t.set("loans",g);const b=t.get("nominas").map(S=>{const P=n(S.tags,l,m);return P!==S.tags&&(d+=1),P===S.tags?S:{...S,tags:P}});t.set("nominas",b);const y=t.get("config"),f=pt(l),h=S=>{const P=(S??[]).map(pt);if(!P.includes(f))return S??[];const w=P.filter(E=>E!==f);return m===null?[...new Set(w)]:[...new Set([...w,m])]},C={},I=h(y.activeTagsFilter),x=h(y.tagCategorias),$=h(y.tagGrupos);return I!==y.activeTagsFilter&&(C.activeTagsFilter=I),x!==y.tagCategorias&&(C.tagCategorias=x),$!==y.tagGrupos&&(C.tagGrupos=$),Object.keys(C).length>0&&t.patchConfig(C),{cambiados:d}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const uc=3;function Jo(t){return t<.005?0:t}function pc(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function mc(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<uc)continue;const r=pc(i.meses.map(c=>c.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Jo(n),sigmaDeriva:Jo(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Qo(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:G(a*Math.hypot(n,s))}function fc(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),m=Math.max(0,(c-s)*12+(l-i)),d=Qo(e.sigmaMensual,m,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:G(r.saldoAcum+d),abajo:G(r.saldoAcum-d)}})}function gc(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ra="financeapp_session",vc=["local","dropbox","firebase"];function bc(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!vc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function hc({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const g=n();if(g)try{v?g.setItem(ra,JSON.stringify(v)):g.removeItem(ra)}catch{}}function i(){const v=n();if(!v)return null;try{return bc(v.getItem(ra))}catch{return null}}function r(){const v=i();return v?(a()-v.ultimoUso)/6e4:null}function c(){const v=e();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(s(null),null):v:null}function m(v){const g=a(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return s(b),b}function d(){const v=i();v&&s({...v,ultimoUso:a()})}function u(){s(null)}return{abrir:m,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const Xo=["pointerdown","keydown","visibilitychange"];function yc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const m of Xo)s==null||s.addEventListener(m,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),e())},a);function l(){if(i){i=!1,n(c);for(const m of Xo)s==null||s.removeEventListener(m,r)}}return l}const $c=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],xc="FinanceApp",wc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Zo(t){return new Uint8Array(new ArrayBuffer(t))}const ca="financeapp_bio_credencial",la="financeapp_bio_secreto",da="financeapp_bio_ultimo_desbloqueo",tn="financeapp_bio_gracia_min",Ic=5;function Cc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function we(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function Ie(t){const e=atob(t),a=Zo(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function Sc(t){return we(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Ac(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Ie(e)}function en(t){return t.getClientExtensionResults()}function Mc(t={}){const e=t.webauthn??Cc(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(x=>crypto.getRandomValues(Zo(x)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function c(){const x=o==null?void 0:o.getItem(ca);if(!x)return null;try{const $=JSON.parse(x);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function l(){return c()!==null}async function m(x){const $=await a.importKey("raw",x,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:wc},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(x,$){const S=s(12),P=await a.encrypt({name:"AES-GCM",iv:S},x,new TextEncoder().encode($));return`${we(S)}:${we(P)}`}async function u(x,$){const[S,P]=$.split(":"),w=Ie(S),E=Ie(P),_=await a.decrypt({name:"AES-GCM",iv:w},x,E);return new TextDecoder().decode(_)}async function v(x,$){var R,O;if(!x)throw new Error("No hay clave de cifrado que envolver.");const S=s(32),P=s(32),w=s(16),E=await e.create({publicKey:{challenge:P,rp:{name:xc},user:{id:w,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:S}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const _=en(E);if(!((R=_.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((O=_.prf.results)==null?void 0:O.first)??null;if(M||(M=await g(E.rawId,S)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const A=await m(M),z=await d(A,x),D={credencialId:Sc(E.rawId),salt:we(S),modo:$,creadaEn:n()},T=i();T.setItem(ca,JSON.stringify(D)),T.setItem(la,z)}async function g(x,$){var P,w;const S=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:x,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return S?((w=(P=en(S).prf)==null?void 0:P.results)==null?void 0:w.first)??null:null}async function b(){const x=c();if(!x)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(la);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const S=await g(Ac(x.credencialId).buffer,Ie(x.salt));if(!S)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const P=await m(S),w=await u(P,$);return f(),w}function y(){o==null||o.removeItem(ca),o==null||o.removeItem(la),o==null||o.removeItem(da)}function f(){o==null||o.setItem(da,String(n()))}function h(){const x=o==null?void 0:o.getItem(tn);if(x==null)return Ic;const $=Number(x);return Number.isFinite($)&&$>0?$:0}function C(x){o==null||o.setItem(tn,String(Math.max(0,Math.floor(x)||0)))}function I(){if(!l())return!1;const x=h();if(x<=0)return!1;const $=o==null?void 0:o.getItem(da),S=$?Number($):NaN;return Number.isFinite(S)?n()-S<x*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:y,marcarDesbloqueo:f,dentroDeGracia:I,graciaMinutos:h,configurarGracia:C}}function an(){if(typeof localStorage<"u"){const $=us();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=ws(),e=t.activo(),a=Xt(e),o=to(localStorage,a),n=vs({adapter:o}),s=bs(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Kt})`),n.subscribe($=>s.marcar($));function r(){var S,P,w,E,_;const $=globalThis;(P=(S=$.FirebaseService)==null?void 0:S.isConnected)!=null&&P.call(S)&&((_=(E=(w=$.FirebaseService).uploadRegistroProyectos)==null?void 0:E.call(w))==null||_.catch(M=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",M instanceof Error?M.message:M)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===e)??t.listar()[0],colecciones:St.filter($=>$!=="config"),crear:$=>{const S=t.crear($);return r(),S},renombrar:($,S)=>{t.renombrar($,S),r()},duplicar:($,S)=>{const P=t.duplicar($,S);return r(),P},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,S)=>{const P=Is(localStorage,$,S),w=Cs(P),E=[];for(const _ of S){const M=w[_];if(!Array.isArray(M)||M.length===0)continue;const A=n.get(_);n.set(_,[...A,...M]),E.push(_)}return E.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:E}}},l=As(n),m=Mc(),d=hc({autoLogoutMinutos:()=>{var S,P;const $=(P=(S=globalThis.State)==null?void 0:S.get)==null?void 0:P.call(S,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>m.dentroDeGracia()}),u=lc(n),v=dc(n),g=gr(u),b=Pr(n),y=Xs({isEnabled:$=>l.isEnabled($)}),f=Gs({flags:l,rutasExtra:()=>y.flagPorRuta()}),h=_s({flags:l,onChange:()=>{var $,S;y.attachToShell(),f.apply(),(S=($=globalThis.Router)==null?void 0:$.rerender)==null||S.call($)}}),C=Rs({proyectos:c}),I=()=>{var S,P,w,E,_,M;const $=globalThis;if((P=(S=$.State)==null?void 0:S.load)==null||P.call(S),((E=(w=$.Router)==null?void 0:w.current)==null?void 0:E.call(w))==="dashboard")try{(M=(_=$.DashboardModule)==null?void 0:_.render)==null||M.call(_)}catch(A){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",A)}},x=Hs({store:n,onDatosCambiados:I});return y.register(ui({store:n,onDatosCambiados:I})),y.register(xi({store:n,onDatosCambiados:I})),y.register(Yi({store:n,onDatosCambiados:I})),y.register(cc({store:n,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:I})),y.register(ai({store:n,onDatosCambiados:I})),{version:Kt,core:mn,engine:{generarExtracto:za,recomputarSaldoAcum:vn,saldoHoy:bn,sumarPorTags:ja,providers:{proyectarGastos:Yt,proyectarPrestamos:Te,proyectarTransferencias:Aa,proyectarNominas:ze,proyectarInteresesCuentas:Ea,proyectarAportaciones:Ma,proyectarRetencionesFiscales:Pa,proyectarInflacionGastos:_a,proyectarPerdidaAhorro:Fa},analysis:xn,margins:En,avisos:Dn,dashboard:Un},store:n,flags:l,featureRegistry:{all:wt,porGrupo:io},ui:{openFeatures:h.open,openProyectos:C.open,openPersonas:x.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Us({store:n,rerender:()=>{var S,P,w,E;const $=globalThis;(P=(S=$.State)==null?void 0:S.load)==null||P.call(S),(E=(w=$.Router)==null?void 0:w.rerender)==null||E.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Js({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>y.routes(),navegar:$=>{var S,P;return(P=(S=globalThis.Router)==null?void 0:S.navigate)==null?void 0:P.call(S,$)}})},app:y,session:Object.assign(d,{vigilar:$=>yc({sesion:d,onCaducada:$}),opciones:$c}),biometria:m,cambios:s,datos:{colecciones:St,snapshot:()=>eo(o),aplicar:($,{sellar:S=!0}={})=>{const w=hs(S?(E,_)=>o.set(E,_):(E,_)=>{const M=globalThis.StorageAdapter;M!=null&&M.setRestaurando?M.setRestaurando(E,_):o.set(E,_)},$);return n.load(),s.marcar("copia-restaurada"),w},faltantes:$=>ys($),esVacioOPorDefecto:()=>$s(eo(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:ea,medirVariabilidad:mc,bandaDeConfianza:fc,bandaAcumulada:Qo,describirBanda:gc}}}function Ec(){try{const t=an();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const st=typeof window<"u"?Ec():null;if(st){let t=!1;const e=()=>{var a,o;if(st.app.attachToShell(),st.ui.applyGating(),!t){t=!0,st.ui.watchGating(),st.ui.instalarDeshacer(),st.ui.instalarBuscador();const n=globalThis,s=()=>{var c,l,m,d;return(l=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&l.call(c)?n.FirebaseService:(d=(m=n.DropboxService)==null?void 0:m.isConnected)!=null&&d.call(m)?n.DropboxService:null};st.ui.avisoGuardado=Qs({cambios:st.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=st.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>st.ui.openProyectos())),(a=document.getElementById("btn-proyectos"))==null||a.addEventListener("click",()=>st.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>st.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return Ce.bootstrap=an,Object.defineProperty(Ce,Symbol.toStringTag,{value:"Module"}),Ce}({});
//# sourceMappingURL=financeapp-core.js.map
