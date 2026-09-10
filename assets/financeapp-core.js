var FinanceAppBundle=function(Se){"use strict";function W(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function k(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function K(){return W(new Date)}function Ae(t,a){return new Date(t,a+1,0).getDate()}function fa(t,a,e){return W(new Date(t,a,Math.min(e,Ae(t,a))))}function ie(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return W(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return fa(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),W(i)}return null}function ga(t,a){if(!a)return t;const e=k(t);return ie(e.getFullYear(),e.getMonth(),a)??t}const sn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],rn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Me(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${rn[e]||e+"º"} ${sn[o]} del mes`}return t}function Ht(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Gt(t){const a=k(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),W(a)}function va(t,a){const e=k(t);return e.setDate(e.getDate()+a),W(e)}function Pt(t,a,e){const o=Math.max(1,e),n=t.getFullYear(),s=t.getMonth(),i=(a.getFullYear()-n)*12+(a.getMonth()-s);if(i<=0)return{year:n,month:s};const r=s+Math.floor(i/o)*o;return{year:n+Math.floor(r/12),month:r%12}}function re(t,a,e,o){return!(t&&t>o||a&&a<e)}function ba(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function G(t){return J(it(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ha(t){return(t||0).toFixed(2)+"%"}function Ct(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function ya(t,a,e,o=0){const n=Ct(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=n*(1-Math.pow(1+i,-e))/i-s,m=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-l/m;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function $a(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const l=k(o),m=a/100/12;let d=e,u=Ct(c,a,d);const v=[...s].sort((b,y)=>b.fecha.localeCompare(y.fecha));let g=0;for(let b=1;b<=e*2&&c>.01;b++){const y=new Date(l);l.setMonth(l.getMonth()+1);const f=ga(W(y),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const S=v[g],x=S.cantidad*(n/100);if(c-=S.cantidad,c=Math.max(0,c),S.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*m/u)/Math.log(1+m)):(d=e-b+1,u=Ct(c,a,d)),r.push({mes:"AMORT",fecha:S.fecha,cuota:0,interes:0,amortizacion:S.cantidad,comisionAmort:x,capitalPendiente:c,esAmortizacion:!0,simulacion:S.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*m,A=Math.min(u-h,c);if(c-=A,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:h,amortizacion:A,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const xa=new Map;function X(t){var y;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=xa.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,m=$a(n,s,i,r,c||0,a,t),d=m.reduce((f,h)=>f+h.interes,0),u=m.reduce((f,h)=>f+h.comisionAmort,0),v=n*((l||0)/100),g=m.filter(f=>!f.esAmortizacion),b={cuota:Ct(n,s,i),totalIntereses:d,tae:ya(n,s,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:((y=g.slice(-1)[0])==null?void 0:y.fecha)||"",mesesReales:g.length,tabla:m};return xa.set(e,b),b}function Ia(t){const a=X(t),e=X({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function gt(t,a,e){if(!t||t.length===0)return 1;const o=k(a),n=k(e);if(n<=o)return 1;const s=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),l=s.filter(b=>b.year<=c),m=l.length>0?l[l.length-1]:s[0],d=(m?m.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,g=Ht(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function wa(t,a,e,o=0){const n=k(a),s=k(e);if(s<=n)return o;const i=Ht(n,s),r=t?[...t].sort((m,d)=>m.year-d.year):[];let c=0,l=new Date(n);for(;l<s;){const m=l.getFullYear(),d=new Date(m+1,0,1),u=d<s?d:s,v=Ht(l,u),g=r.filter(f=>f.year<=m),b=g.length>0?g[g.length-1]:null,y=b!==null?b.tasa:o;c+=y*v,l=u}return i>0?c/i:o}function Ca(t,a){return((1+t/100)/(1+a/100)-1)*100}function cn(t,a,e,o){const n=gt(a,e,o);return n>0?t/n:t}function ln(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:m=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,b=g,y=c>0?b/c*100:null,f=r?l-m:l,h=c>0?f/c*100:null,A=c>0?l/c*100:null,S=c>0?(d+l+v)/c*100:null,x=c>0?u/c*100:null,$=(E,w,P)=>E===null?"neutral":E>=w?"verde":E>=P?"amarillo":"rojo",M=(E,w,P)=>E===null?"neutral":E<=w?"verde":E<=P?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:m,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:y,dti:h,dtiTotal:A,excluyeHipoteca:r,pctNecesidades:S,pctDeseos:x,semAhorro:$(y,e,o),semDTI:M(h,n,s),semNecesidades:M(S,i[0],i[0]+15),semDeseos:M(x,i[1],i[1]+10),semAhorroRegla:$(y,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function vt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Vt(t,a){const e=Ee(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Ee(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=e&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a)??null}function Sa(t,a){let e="";for(const o of t){const n=Ee(o,a);n&&n.fecha>e&&(e=n.fecha)}return e}function dn(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function un(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function ce(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function pn(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function mn(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function _t(t,a,e){const o=it(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:J(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=pn(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(d[v])}))}const s=a.participantes.map(d=>{const u=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=s.map(g=>Math.round(g*d)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),n.map((g,b)=>({personaId:g,importe:J(u[b])}))}const c=o-i,{ids:l,cts:m}=mn(n,s,c,e);return l.map((d,u)=>({personaId:d,importe:J(m[u])}))}function Pe(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function fn(t,a,e){const o=ce(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Pe(a.expenses,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Pe(a.loans,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Pe(a.nominas,i.sourceId);for(const l of _t(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).ingresos+=l.importe}}}return[...n.values()]}function _e(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const bt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Aa(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function ht(t,a){return Aa(t,a).baseImponible}function Ma(t,a){return lt(t,a)/12}const Ut=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Fe(t,a){if(!t||t<=0)return 0;const e=a||Ut;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,l=Math.min(n,c-i);if(!(l<=0)&&(o+=l*(r/100),n-=l,n<=0))break}return o}function le(t,a){if(rt(t)!=="inversion")return null;const e=vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=Fe(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function De(t,a=new Date){var u;if(rt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=vt(t),n=W(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=s.reduce((v,g)=>v+g.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,m=Math.min(o,i+c*l),d=Math.max(0,o-m);return{saldo:o,disponible:m,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function Ea(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=vt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((l,m)=>l+m.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function Te(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,m)=>l+(m.bruto||0)*(m.nPagas||12),0),i=[...e||[]].sort((l,m)=>l[0]-m[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,m]of i)if(s>=l)r=m;else break;return r}const gn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Ut,TRAMOS_IRPF_DEFAULT:bt,agregarPorPersona:fn,ajustarFechaPago:ga,ajustarPrecioReal:cn,arranqueMensual:Pt,calcBaseImponibleTrabajo:ht,calcFactorInflacion:gt,calcFondoInversion:le,calcFondosPension:De,calcGananciasCapital:Fe,calcIRPF:lt,calcImpuestoPension:Ea,calcInflacionMediaAnual:wa,calcSaludFinanciera:ln,calcTAE:ya,calcTipoMarginalPension:Te,calcTipoRealFisher:Ca,calcularReparto:_t,clampedDate:fa,cuotaMensual:Ct,desgloseBaseTrabajo:Aa,diasEntre:Ht,entradaSaldo:Ee,etiquetaPeriodicidad:ba,fechaUltimoSaldoConocido:Sa,finDeSemana:Gt,formatEUR:F,formatLocalDate:W,formatPct:ha,fromCents:J,haySimulaciones:un,idPersonaPorDefecto:ce,labelDiaPago:Me,lastDayOfMonth:Ae,modeloFondoDe:rt,parseLocalDate:k,personasImplicadas:_e,resolverDiaEfectivo:ie,resumenPrestamo:X,resumenPrestamoConAhorro:Ia,retencionMensual:Ma,roundMoney:G,saldoEnFecha:Vt,saldoRealCuenta:vt,sinSimulaciones:dn,sumarDias:va,tablaAmortizacion:$a,toCents:it,todayISO:K,vigenteEnRango:re},Symbol.toStringTag,{value:"Module"}));function Yt(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=k(i.fechaInicio||a.start),c=i.fechaFin?k(i.fechaFin):s,l=i.cuantia,m=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&m(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=Pt(r,n,d);const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const y=ie(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),A=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,A)))})(),f=k(y);if(f>s||f>c)break;f>=n&&f>=r&&m(y),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=s&&u<=c;)m(W(u)),u=new Date(u.getTime()+d)}}return o}function ze(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Pa(t,a,e=null,o={accounts:[]}){const n=[],s=k(a.start),i=k(a.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>bt),m=o.resolverTramosGanancias||(()=>Ut),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=k(u.fechaInicio||a.start),g=u.fechaFin?k(u.fechaFin):i,b=y=>{const f=r.find(_=>_._id===(u.cuenta||"default")),h=r.find(_=>_._id===(u.cuentaDestino||"default")),A=rt(f),S=rt(h),x=A==="inversion"&&S==="inversion"||A==="pension"&&S==="pension",$=["transferencia",...x?["traspaso"]:[],...u.tags||[]],M=x?"traspaso-out":"transfer-out",E=x?"traspaso-in":"transfer-in",w=!e||e.length===0||e.includes(u.cuenta||"default"),P=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(w&&n.push({fecha:y,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:$,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:M}),P&&n.push({fecha:y,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:$,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:E}),w&&!x&&f){if(A==="inversion"){const _=parseInt(y.slice(0,4)),C=le(f,m(_));if(C&&C.saldo>0&&C.plusvalia>0){const I=Math.min(1,u.cuantia/C.saldo),D=C.plusvalia*I*.19;D>.01&&n.push({fecha:y,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(A==="pension"){const _=l(parseInt(y.slice(0,4))),C=Te(f,c,_),I=Ea(f,u.cuantia,C||void 0);if(I>0){const T=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${C}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:y,concepto:T,cuantia:I,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const y=Math.max(1,u.frecuencia||1);let{year:f,month:h}=Pt(v,s,y);const A=Math.ceil(240/y)+2;for(let S=0;S<A;S++){const x=ie(f,h,u.diaPago||"")||(()=>{const M=v.getDate(),E=new Date(f,h+1,0).getDate();return W(new Date(f,h,Math.min(M,E)))})(),$=k(x);if($>i||$>g)break;$>=s&&$>=v&&b(x),h+=y,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const y=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/y);f=new Date(v.getTime()+h*y)}for(;f<=i&&f<=g;)b(W(f)),f=new Date(f.getTime()+y)}}return n}function _a(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const m=k(l.fechaInicio||a.start),d=l.fechaFin?k(l.fechaFin):s,u=l.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),g=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",y=x=>{v&&o.push({fecha:x,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:x,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:h,month:A}=Pt(m,n,f);const S=Math.ceil(240/f)+2;for(let x=0;x<S;x++){const $=new Date(h,A+1,0).getDate(),M=W(new Date(h,A,Math.min(m.getDate(),$))),E=k(M);if(E>s||E>d)break;E>=n&&E>=m&&y(M),A+=f,A>=12&&(h+=Math.floor(A/12),A=A%12)}}}return o}function Fa(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=k(a.start),r=k(a.end),c=s.periodoCobro||"mensual",l=c==="mensual",m=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:m/(365.25*864e5);let u=Vt(s,a.start);const v=o.filter(y=>y.cuenta===s._id).map(y=>({fecha:y.fecha,delta:y.tipo==="ingreso"?Math.abs(y.cuantia):-Math.abs(y.cuantia)})).sort((y,f)=>y.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const y=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+m),f=new Date(Math.min(y.getTime(),r.getTime()+1)),h=W(f);let A=0;for(;g<v.length&&v[g].fecha<h;)A+=v[g].delta,g++;const S=u,x=u+A,$=Math.max(0,(S+x)/2);u=x;const M=l?d:(f.getTime()-b.getTime())/(365.25*864e5),E=$*(Math.pow(1+s.interes/100,M)-1);E>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:E,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=y}}return n}function Da(t,a,e,o=null){const n=[],s=a||bt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Ma(r,s),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Yt([l],e,o))}return n}const vn=[5,11,2,8],bn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function je(t,a,e=null,o=[],n=()=>bt){const s=[],i=k(a.start),r=k(a.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function m(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||a.start,b=k(g),y=k(v);let f=0;for(let A=b.getFullYear();A<=y.getFullYear();A++){const S=new Date(A,u.mesActualizacionIPC-1,1);S>b&&S<=y&&f++}if(f===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*gt(o,g,h)}function d(u,v){const g=m(u,v),b=(u.retribucionFlexible||[]).reduce((_,C)=>_+(C.importe||0)*12,0),y=Math.max(0,g-b);if(u.irpfModo==="manual")return y*((u.irpfPct||0)/100);const f=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return lt(ht(g,b),f);const A=l[h].filter(_=>_.activo),S=A.reduce((_,C)=>_+m(C,v),0),x=A.reduce((_,C)=>_+(C.retribucionFlexible||[]).reduce((I,T)=>I+(T.importe||0)*12,0),0),$=Math.max(0,S-x),M=ht(S,x),E=Math.max(0,g-b),w=$>0?M*(E/$):0,P=A.filter(_=>_._id!==u._id&&(_.bruto||0)>(u.bruto||0)).reduce((_,C)=>{const I=(C.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),T=Math.max(0,m(C,v)-I);return _+($>0?M*(T/$):0)},0);return lt(P+w,f)-lt(P,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=k(u.fechaInicio||a.start),y=u.fechaFin?k(u.fechaFin):r,f=h=>{const A=m(u,h),S=d(u,h),x=(u.retribucionFlexible||[]).reduce((I,T)=>I+(T.importe||0)*12,0),$=Math.max(0,A-x),M=(u.ssPct??6.35)/100,E=$*M,w=$/g,P=S/g,_=E/g,C=u.representacion==="simplificado"?w-_-P:w;s.push({fecha:h,concepto:u.nombre,cuantia:C,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(_>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),P>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const I of u.retribucionFlexible||[])!I.cuenta||!(I.importe>0)||e&&e.length>0&&!e.includes(I.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${bn[I.tipo]||I.tipo}`,cuantia:I.importe,tipo:"ingreso",cuenta:I.cuenta,tags:["retribucion-flexible",I.tipo],sourceId:`${u._id}_flex_${I._id||I.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),A=b.getDate();let{year:S,month:x}=Pt(b,i,h);for(let $=0;$<300;$++){const M=new Date(S,x+1,0).getDate(),E=new Date(S,x,Math.min(A,M));if(E>r||E>y)break;E>=i&&E>=b&&f(W(E)),x+=h,x>=12&&(S+=Math.floor(x/12),x=x%12)}}else{const h=g-12,A=b.getDate();let{year:S,month:x}=Pt(b,i,1);for(let E=0;E<300;E++){const w=new Date(S,x+1,0).getDate(),P=new Date(S,x,Math.min(A,w));if(P>r||P>y)break;P>=i&&P>=b&&f(W(P)),x++,x>=12&&(S++,x=0)}const $=Math.max(b.getFullYear(),i.getFullYear()),M=Math.min((u.fechaFin?y:r).getFullYear(),r.getFullYear());for(let E=$;E<=M;E++)for(const w of vn.slice(0,h)){const P=new Date(E,w,15);P>=i&&P<=r&&P>=b&&P<=y&&f(W(P))}}}return s}function Ta(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=k(e.start),r=k(e.end),c=K(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let m=new Date(i.getFullYear(),i.getMonth(),1);for(;m<=r;){const d=m.getFullYear(),u=m.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=W(new Date(d,u+1,0)),y=W(new Date(d,u,15));let f=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const A=h.fechaInicio||c,S=gt(a,A,y);if(S<=1)continue;const x=Math.max(1,h.frecuencia||1);f+=h.cuantia*(S-1)/x}f>.01&&s.push({fecha:y,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),m=new Date(d,u+1,1)}return s}function za(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=k(e.start),i=k(e.end),r=[...a].sort((l,m)=>l.year-m.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),m=c.getMonth(),d=l+"-"+String(m+1).padStart(2,"0"),u=W(new Date(l,m,15)),v=r.filter(h=>h.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,y=Math.pow(1+b,1/12)-1,f=t*y;f>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,m+1,1)}return n}function ja(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,n=t.reduce((i,r)=>i+Vt(r,o),0),s=Sa(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function qa(t,a,e){const{fecha:o,saldo:n}=ja(a,e),s=t.filter(m=>m.fecha<o),i=t.filter(m=>m.fecha>=o),r=[];let c=n;for(const m of[...s].reverse()){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);r.unshift({...m,delta:d,saldoAcum:c}),c-=d}const l=[];c=n;for(const m of i){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);c+=d,l.push({...m,delta:d,saldoAcum:c})}return[...r,...l]}function hn(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return qa([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Ra(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(y=>y.activo&&(!s||s.length===0||s.includes(y._id))),l=ja(c,n),m={start:l.fecha<n.dashboardStart?l.fecha:n.dashboardStart,end:n.dashboardEnd},d=e.filter(y=>y.tipo!=="transferencia"),u=e.filter(y=>y.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Yt(d,m,s)),g=g.concat(ze(a,m,s)),g=g.concat(Pa(u,m,s,v)),g=g.concat(_a(o,m,s));const b=Fa(o,m,s,g);if(g=g.concat(b),g=g.concat(Da(e,n.tramos_irpf,m,s)),g=g.concat(je(i,m,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const y=(o.find(A=>A.activo&&A.esCuentaPrincipal)||o.find(A=>A.activo)||{_id:"default"})._id;g=g.concat(Ta(d,r,m,s,y));const h=o.filter(A=>A.activo&&(!s||s.length===0||s.includes(A._id))).reduce((A,S)=>A+Vt(S,n.dashboardStart),0);g=g.concat(za(h,r,m,y))}return g.sort((y,f)=>y.fecha.localeCompare(f.fecha)),qa(g,c,n).filter(y=>y.fecha>=n.dashboardStart)}function yn(t,a,e=null){const o=K(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Na(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function $n(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${F(i)})`})))}return e}function xn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=k(a.dashboardStart),n=k(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function In(t,a,e=K()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=e&&(l[c]=r.saldoInicial||0);for(const m of r.historicoSaldos||[])m.fecha<=e&&(!c||m.fecha>=c)&&(l[m.fecha]=m.saldo);return Object.keys(l).forEach(m=>o.add(m)),l}),s={};for(const r of[...o].sort()){let c=0;for(let l=0;l<a.length;l++){const m=Object.entries(n[l]).filter(([d])=>d<=r);m.length>0?(m.sort(([d],[u])=>u.localeCompare(d)),c+=m[0][1]):c+=a[l].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([l],[m])=>l.localeCompare(m))){const l=t.filter(v=>v.fecha<=r),m=l.length>0?l[l.length-1].saldoAcum:null;if(m===null)continue;const d=c-m,u=m!==0?d/Math.abs(m)*100:0;i.push({cuenta:"Total",fecha:r,estimado:m,real:c,desv:d,pct:u})}return i}const wn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:In,detectarPuntosCriticos:$n,mediaMensualGastos:xn},Symbol.toStringTag,{value:"Module"}));function Wt(t,a=new Date){const e=W(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Yt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Cn(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Ct(e.capital,e.tin,e.meses),0)}function Sn(t,a){return X(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function La(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+Ct(n.capital,n.tin,n.meses)*Math.min(a,Sn(n,e)),0)}function Oa(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Wt(t,o),s=a.colchonMeses||6;return n*s+La(e,s,W(o))}function An(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((l,m)=>l.fecha.localeCompare(m.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Oa(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Wt(t,n),c=i.meses||6;return r*c+La(e,c,o)}function qe(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((m,d)=>m.fecha.localeCompare(d.fecha)),c=r.filter(m=>m.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Wt(a,i)+Cn(o))*(c.meses||1):0}function Mn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function En(t,a){const e={};for(const o of a)e[o._id]=vt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Mn(o)),{fecha:o.fecha,saldos:{...e}}))}function Pn(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let m=0;m<a.length;m++){const d=a[m],u=qe(c,o,n,s,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var y,f;return g+(((f=(y=e[m])==null?void 0:y.saldos)==null?void 0:f[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const _n=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Oa,calcColchonEnFecha:An,calcGastoBasicoMensual:Wt,calcMargenEnFecha:qe,detectarCrucesMargenes:Pn,saldosPorCuentaEnExtracto:En},Symbol.toStringTag,{value:"Module"}));function Fn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function ka(t,a){return Ht(k(t),k(a))}const Dn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ba(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${Dn[o-1]}${s?"":` de ${e}`}`}function Ha(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Tn(t,a={}){const{hoy:e=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${F(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${F(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${F(d.saldo)}, y el margen pide ${F(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=ka(e,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:n))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Ha(u),titulo:d.titulo(g),detalle:d.detalle(Ba(d.fecha,e)),incierto:g})}const m={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||m[d.gravedad]-m[u.gravedad]),l.slice(0,s)}const zn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Fn,construirAvisos:Tn,describirPlazo:Ha,diasEntreISO:ka,fechaEnPalabras:Ba},Symbol.toStringTag,{value:"Module"})),jn=30.44*864e5;function Ga(t){const a=t.getFullYear(),e=t.getMonth();return{desde:W(new Date(a,e,1)),hasta:W(new Date(a,e,Ae(a,e)))}}function Va(t){const[a,e]=t.split("-").map(Number);return Ga(new Date(a,e-1,1))}function qn(t,a){return Math.max(1,(k(a).getTime()-k(t).getTime())/jn)}const Rn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),yt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function Nn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Ln(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=a.loanIdsIniciados,s=yt(t.filter(u=>u.tipo==="ingreso")),i=yt(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=yt(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=yt(t.filter(u=>u.sourceType==="loan-amort")),l=yt(t.filter(u=>u.sourceType==="account-interest")),{basicos:m,deseo:d}=Nn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:m/e,gastosDeseo:d/e,gastosTotales:(i+m+d)/e,intereses:l/e}}function Ua(t,a){return t.reduce((e,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function On(t,a,e,o){const n=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),s=n.reduce((l,m)=>{if((m.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return l;const u=X(m).totalIntereses,v=X({...m,amortizaciones:(m.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return l+Math.max(0,v-u)},0),i=n.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:X(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=n.map(l=>X(l).tabla),c=l=>{const{desde:m,hasta:d}=Va(l);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=m&&b.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:Ua(n,a),deudaFin:Ua(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function kn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:yt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Ya(t,a=new Set,e="desglosado"){if(a.size===0)return Na(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(l=>a.has(l)),r=s.filter(l=>!a.has(l)),c=e==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(n.cuantia))}return o}function Bn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Ya(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Hn(t,a){const e=a.reduce((o,n)=>o+vt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:yt(t.filter(o=>o.tipo==="gasto")),totalIngresos:yt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Gn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Vn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function Un(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function Yn(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const l of t){const m=e(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==m)&&(c&&(i=c.cierre),c={periodo:m,inicio:o(m),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const Wn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Yn,cuentasVisibles:Gn,gastoPorTagOrdenado:Bn,idsHipoteca:Vn,idsPrestamosIniciados:Un,interesesPorCuenta:kn,mesesDelPeriodo:qn,metricasFlujo:Ln,rangoMes:Va,rangoMesDe:Ga,resumenPrestamosPeriodo:On,sinTransferencias:Rn,sumarGastosPorTag:Ya,totalesPeriodo:Hn},Symbol.toStringTag,{value:"Module"}));function Kn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Ft(t,a){return e=>Kn(t,a,e)}const Kt=10,Wa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ka=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Re(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ja="default";function Qa(){return{_id:Ja,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Xa(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Wa,tramosGananciasCapital:Ka,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Za(t,a){return{loans:[],expenses:[],accounts:[Re(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Qa()],config:Xa(t,a)}}const dt=t=>Array.isArray(t)?t:[],Jn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Jt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function to(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ne(t){const{varianza:a,inflacion:e,...o}=t;return o}function Qn(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=Jn(t.config),r={...Xa(e,o)};for(const[m,d]of Object.entries(s))d!=null&&(r[m]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Wa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Ka),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(m=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...m};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Jt(d)});c.length===0&&(c=[Re(e)]);const l=c.filter(m=>m.esCuentaPrincipal);if(l.length===0){const m=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===m._id}))}else if(l.length>1){let m=!1;c=c.map(d=>d.esCuentaPrincipal?m?{...d,esCuentaPrincipal:!1}:(m=!0,d):d)}return n.accounts=c,n.expenses=dt(t.expenses).map(m=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=to(d.diaPago),Ne(Jt(d))}),n.loans=dt(t.loans).map(m=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...m};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=to(d.diaPago),d.amortizaciones=dt(d.amortizaciones).map(u=>Jt(u)),Ne(Jt(d))}),n.nominas=dt(t.nominas).map(m=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ne(Jt(d))}),n.goals=dt(t.goals).map((m,d)=>{const u=Array.isArray(m.cuentaIds)?m.cuentaIds:m.cuentaId?[m.cuentaId]:[],{cuentaId:v,...g}=m;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:m,...d})=>d),n}const Dt=t=>Array.isArray(t)?t:[];let Le=0;function Xn(t){return Le+=1,`${t}_${Le.toString(36)}`}const Zn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ts=t=>typeof t=="number"&&Number.isFinite(t);function es(t,a){const e={...t};Le=0;const o=Dt(t.transacciones),n=Dt(t.puntosControl),s=[...n],i=new Set(n.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,m,d,u)=>{if(!Zn(m)||!ts(d))return;const v=`${l}|${m}`;i.has(v)||(i.add(v),s.push({_id:Xn("pc"),fecha:m,cuentaId:l,saldoCts:it(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of Dt(t.accounts)){const m=typeof l._id=="string"?l._id:null;if(m)for(const d of Dt(l.historicoSaldos))r(m,d.fecha,d.saldo,d.nota)}const c=Dt(t.history);if(c.length>0){const l=Dt(t.accounts),m=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(m==null?void 0:m._id)=="string"?m._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((l,m)=>String(l.fecha).localeCompare(String(m.fecha))),e}const Oe=t=>Array.isArray(t)?t:[],as=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),os=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let ke=0;function ns(){return ke+=1,`tx_hp_${ke.toString(36)}`}function ss(t,a){const e={...t};ke=0;const o=[...Oe(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Oe(t.expenses).map(i=>{const r=Oe(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",m=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!as(g.fecha)||!os(g.cuantia))continue;const b=m==="ingreso"?it(g.cuantia):-it(g.cuantia),y=`${c}|${g.fecha}|${b}`;n.has(y)||(n.add(y),o.push({_id:ns(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:m,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const eo=t=>Array.isArray(t)?t:[],$t=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Tt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,is=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function rs(t,a){var m;const e={...t};if(Array.isArray(e.planes))return e;const o=eo(e.goals),n=eo(e.accounts),s=n.map(d=>{const u=Tt(d.bloqueoMeses,0);return{_id:`veh_${$t(d._id,"x")}`,nombre:$t(d.nombre,"Cuenta"),rentabilidadRealAnual:Tt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Tt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?it(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:$t(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Tt(d.interes,0)>0}}),i=new Map(n.map((d,u)=>[$t(d._id,""),s[u]._id])),r=((m=s[0])==null?void 0:m._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>$t(b,"")):[],g=is(d.targetDate);return{_id:$t(d._id,`obj_mig_${u}`),nombre:$t(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(Tt(d.targetAmount,0)),fechaLimite:g,prioridad:Tt(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:$t(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}function cs(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ja)||(e.personas=[Qa(),...o]),e}const Qt=t=>Array.isArray(t)?t:[];function de(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function ls(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function ds(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Qt(e.loans).map(de),e.expenses=Qt(e.expenses).map(de),e.nominas=Qt(e.nominas).map(de),e.accounts=Qt(e.accounts).map(de),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Qt(e.planes).filter(ls);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const us=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Qn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:es},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ss},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:rs},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:cs},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:ds}],ps=["history"];function ao(t,a,e){let o=t;const n=[];for(const s of[...us].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const xt="state_",ue="state__schemaVersion",zt="financeapp_",Be="state__modificadoEn";function oo(t=localStorage,a=zt){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Be&&t.setItem(e(Be),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function ms(t=localStorage,a=zt){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(xt)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function fs({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const gs={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function vs(t,a){const e=gs[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function bs(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function hs({adapter:t,hoy:a=new Date}){const e=W(a),o=bs(a);let n=Za(e,o);const s=new Set;let i=[];const r=fs();function c(C){for(const I of s)I(C)}function l(C){t.set(`${xt}${C}`,n[C])}function m(){const C={};for(const z of Object.keys(n)){const N=t.get(`${xt}${z}`);N!==null&&(C[z]=N)}for(const z of ps){const N=t.get(`${xt}${z}`);N!==null&&(C[z]=N)}const I=t.get(ue),{state:T,applied:D}=ao(C,I,{hoyISO:e,finISO:o});if(n=T,d(),D.length>0){for(const z of Object.keys(n))l(z);t.set(ue,Kt)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Re(e)],l("accounts");return}const C=n.accounts.filter(I=>I.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((I,T)=>T===0?{...I,esCuentaPrincipal:!0}:I),l("accounts");else if(C.length>1){let I=!1;n.accounts=n.accounts.map(T=>T.esCuentaPrincipal?I?{...T,esCuentaPrincipal:!1}:(I=!0,T):T),l("accounts")}}function u(C){return n[C]}function v(C,I){n[C]=I,l(C),c(C)}function g(C){v("config",{...n.config,...C})}function b(C){return s.add(C),()=>s.delete(C)}function y(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(C,I){const T=[...n[C]],D={...I,_id:y()};return T.push(D),v(C,T),D}function h(C,I,T){const D=n[C].map(z=>z._id===I?{...z,...T}:z);v(C,D)}function A(C,I){const T=n[C],D=T.findIndex(z=>z._id===I);D<0||(r.registrar({col:C,item:T[D],indice:D}),v(C,T.filter((z,N)=>N!==D)))}function S(){const C=r.tomar();if(!C)return null;const I=[...n[C.col]];return I.splice(Math.min(C.indice,I.length),0,C.item),v(C.col,I),C}function x(){return r.pendiente()}function $(){const C=n.accounts||[],I=C.find(T=>T.esCuentaPrincipal&&T.activo)||C.find(T=>T.activo);return I?I._id:"default"}function M(C){var I;return((I=n.accounts.find(T=>T._id===C))==null?void 0:I.nombre)??C}function E(){return Ft(n.tramosIRPFHistorico,n.config.tramos_irpf)}function w(){return Ft(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function P(){return structuredClone(n)}function _(C,I=null){const{state:T,applied:D}=ao(C,I,{hoyISO:e,finISO:o});n=T,d();for(const z of Object.keys(n))l(z);t.set(ue,Kt);for(const z of Object.keys(n))c(z);return{applied:D}}return{load:m,get:u,set:v,patchConfig:g,subscribe:b,addItem:f,updateItem:h,removeItem:A,deshacerBorrado:S,borradoPendiente:x,getPrincipalAccountId:$,accountName:M,resolverTramosIRPF:E,resolverTramosGanancias:w,snapshot:P,replaceAll:_,get schemaVersion(){return Kt},get migrationsApplied(){return[...i]},get today(){return e||K()}}}function ys(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const St=Object.keys(Za("1970-01-01","1970-01-01"));function no(t){const a={};for(const e of St){const o=t.get(`${xt}${e}`);o!=null&&(a[e]=o)}return a}function $s(t,a){const e=[];for(const o of St){const n=a[o];n!=null&&(t(`${xt}${o}`,n),e.push(o))}return e}function xs(t){return St.filter(a=>t[a]===void 0||t[a]===null)}function Is(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!St.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const so=`${zt}meta_proyectos`,io=`${zt}meta_proyectoActivo`,At="default",ws="Mis finanzas";function He(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Xt(t){return t===At?zt:`${zt}p_${t}_`}function ro(){return[...St.map(t=>`${xt}${t}`),ue,Be]}function Cs(t=localStorage){function a(){try{const d=t.getItem(so);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function e(d){t.setItem(so,JSON.stringify(d))}function o(){const d=a();if(d.some(g=>g._id===At))return d;const u=Date.now(),v=[{_id:At,nombre:ws,creadoEn:u,actualizadoEn:u},...d];return e(v),v}function n(){try{const d=t.getItem(io);if(!d)return At;const u=JSON.parse(d);return typeof u=="string"&&u?u:At}catch{return At}}function s(d){t.setItem(io,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:He(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),g]),g}function r(d,u){const v=u.trim();v&&e(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=Xt(d),b={_id:He(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},y=Xt(b._id);for(const f of ro()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${y}${f}`,h)}return e([...o(),b]),b}function l(d){if(d===At)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=Xt(d);for(const g of ro())t.removeItem(`${v}${g}`);e(u.filter(g=>g._id!==d))}function m(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return e(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:m}}function Ss(t,a,e){const o=oo(t,Xt(a)),n={};for(const s of e){const i=o.get(`${xt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function As(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,He())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const at={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},It=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:at.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:at.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:at.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:at.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:at.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:at.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:at.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:at.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:at.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:at.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:at.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:at.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:at.datos,porDefecto:!1,dependencias:["sync-nube"]}],Ms=new Map(It.map(t=>[t.id,t]));function Zt(t){return Ms.get(t)}function co(t){return It.filter(a=>(a.dependencias||[]).includes(t))}function Ge(){const t={};for(const a of It)t[a.id]=a.porDefecto;return t}function lo(){const t=[],a=new Map;for(const e of It)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Es(t){function a(){return{...Ge(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,u=a(),v=new Set){const g=Zt(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(d,u=a()){const v=Zt(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function s(d,u){var A;const v=Zt(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),b=new Map(It.map(S=>[S.id,o(S.id,g)])),y={...g,[d]:u};let f;if(u){const S=[...v.dependencias||[]];for(;S.length;){const x=S.pop();y[x]===!1&&(y[x]=!0,f="dependencias-activadas"),S.push(...((A=Zt(x))==null?void 0:A.dependencias)||[])}}else{const S=co(d).map(x=>x.id);for(;S.length;){const x=S.pop();y[x]!==!1&&(y[x]=!1,f="cascada-apagado"),S.push(...co(x).map($=>$.id))}}return e(y),{cambiadas:It.filter(S=>o(S.id,y)!==b.get(S.id)).map(S=>S.id),motivo:f}}function i(){const d=a();return It.map(u=>{const v=n(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=a();return lo().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=n(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(Ge())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function m(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=Ge(),b=[],y=[];for(const[f,h]of Object.entries(v)){if(!Zt(f)){y.push(f);continue}if(typeof h!="boolean"){y.push(f);continue}g[f]=h,b.push(f)}return e(g),{aplicadas:b,ignoradas:y}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:m,bloqueadaPor:d=>n(d)}}const te=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function jt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ps(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(te).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${te(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${te(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${te(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function _s(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${te(o)}</div>
        ${n.map(Ps).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Fs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ds(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${_s(e)}`,n(i)}function n(i){var c,l,m;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=e.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&jt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&jt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=a.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(v),jt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:b}=e.importProfile(JSON.parse(await d.text()));jt(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){jt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(m=i.querySelector('[data-feature-action="reset"]'))==null||m.addEventListener("click",()=>{var d;e.reset(),jt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=Fs(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ts={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function uo(t){return Ts[t]??t}function mt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function po(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function zs(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function js(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function qs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Rs(t,a){const e=t._id===a,o=t._id==="default";return`
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
    </div>`}function Ns(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(uo(i))}
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
    </div>`}function Ls(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Os(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Rs(l,c)).join("")}
      </div>
      ${Ls()}
      ${Ns(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(m=>{m.addEventListener("click",()=>{const d=m.dataset.proyectoId,u=m.dataset.proyectoAccion,v=e.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!po(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(d),zs(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;e.renombrar(d,g.trim()),mt(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const y=e.duplicar(d,b.trim()||g);mt(t,`"${y.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!po(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),mt(t,`"${v.nombre}" eliminado`),n(r)}catch(g){mt(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const m=r.querySelector("#proyecto-nuevo-nombre"),d=m==null?void 0:m.value.trim();if(!d){mt(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(d);mt(t,`"${u.nombre}" creado ✓`),n(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const m=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!m)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){mt(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(m,d);if(u.length===0){mt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}mt(t,`Importado: ${u.map(uo).join(", ")} ✓`),js(),n(r)})}function i(){const r=qs(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const pe=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Mt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function qt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function ks(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Bs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Hs(t){const a=t.color||pe[0];return`
    <div class="dm-section" data-persona-fila="${Mt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Mt(a)};flex:none"></span>
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
    </div>`}function Gs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${pe.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${pe[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Vs(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Hs).join("")}
      </div>
      ${Gs()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var m;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=e.get("personas"),b=g.find(y=>y._id===u);if(b){if(v==="renombrar"){const y=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!y||!y.trim())return;e.updateItem("personas",u,{nombre:y.trim()}),qt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){e.set("personas",g.map(y=>({...y,esPorDefecto:y._id===u}))),qt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(g.length<=1){qt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!ks(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),qt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(m=c.querySelector("#persona-nuevo-btn"))==null||m.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){qt(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||pe[0],g=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});qt(t,`"${g.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Bs(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const mo={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function fo(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Us({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,m])=>[m,l]);for(const[l,m]of[...Object.entries(mo),...c]){const d=t.isEnabled(l),u=a.querySelector(`.nav-btn[data-view="${m}"]`);u&&(u.style.display=d?"":"none"),!d&&n()===m&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const m=[...l.querySelectorAll(".nav-btn[data-view]")];if(m.length===0)return;const d=m.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),fo(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{fo(a,m=>t.isEnabled(m))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:s,observar:i,vistaPara:r=>mo[r]}}const Ys="toast toast-deshacer";function Ws(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function l(d){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=Ys,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${vs(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const y=a.deshacerBorrado();if(c(),!y)return;const f=n();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const m=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{m(),c()}}function me(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function go(t,a){const e=me(t),o=me(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const ee=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Ks(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[ee(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:ee(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:ee(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${ee(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,ee(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Js(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=me(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of Ks(t)){if(!i(c.ruta))continue;const l=go(c.titulo,s),m=l>=0?-1:Math.min(go(c.extra??"",s),2);if(l<0&&m<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,me(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const Qs="buscador-overlay",vo="btn-buscador";function Xs(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const S=a.createElement("div");S.id=Qs,S.className="modal-overlay",S.style.alignItems="flex-start",S.style.paddingTop="10vh";const x=a.createElement("div");x.className="modal-box",x.style.maxWidth="560px",x.style.padding="14px";const $=a.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const M=a.createElement("div");return M.style.marginTop="10px",M.style.maxHeight="52vh",M.style.overflowY="auto",x.appendChild($),x.appendChild(M),S.appendChild(x),a.body.appendChild(S),S.addEventListener("click",E=>{E.target===S&&b()}),$.addEventListener("input",()=>{r=0,m()}),$.addEventListener("keydown",v),o=S,n=$,s=M,S}function l(){if(s){if(s.textContent="",i.length===0){const S=a.createElement("div");S.style.padding="14px 4px",S.style.fontSize="13px",S.style.color="var(--text3)";const x=(n==null?void 0:n.value.trim())??"";S.textContent=x.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(S);return}i.forEach((S,x)=>{const $=a.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(x),x===r&&$.classList.add("activa");const M=a.createElement("div");M.style.minWidth="0";const E=a.createElement("div");E.textContent=S.titulo,E.style.fontSize="13px",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap";const w=a.createElement("div");w.textContent=S.detalle,w.style.fontSize="11px",w.style.color="var(--text3)",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap",M.appendChild(E),S.detalle&&M.appendChild(w);const P=a.createElement("span");P.className="tag",P.textContent=S.etiqueta,P.style.flexShrink="0",$.appendChild(M),$.appendChild(P),$.addEventListener("click",()=>u(x)),s.appendChild($)})}}function m(){const S=(n==null?void 0:n.value)??"";i=Js(t.estado(),S,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(S){var x,$;i.length!==0&&(r=(r+S+i.length)%i.length,l(),($=(x=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:x.scrollIntoView)==null||$.call(x,{block:"nearest"}))}function u(S){const x=i[S];x&&(b(),t.navegar(x.ruta))}function v(S){S.key==="Escape"?(S.preventDefault(),b()):S.key==="ArrowDown"?(S.preventDefault(),d(1)):S.key==="ArrowUp"?(S.preventDefault(),d(-1)):S.key==="Enter"&&(S.preventDefault(),u(r))}function g(){const S=o??c();S.classList.remove("hidden"),S.style.display="",r=0,n&&(n.value="",n.focus()),m()}function b(){o&&(o.style.display="none",i=[])}function y(){return!!o&&o.style.display!=="none"}function f(S){(S.ctrlKey||S.metaKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),y()?b():g())}a.addEventListener("keydown",f);let h=null;function A(){const S=a.getElementById("period-bar");if(!S||a.getElementById(vo))return;const x=a.createElement("button");x.id=vo,x.type="button",x.className="btn-secondary",x.title="Buscar en toda la aplicación (Ctrl+K)",x.setAttribute("aria-label","Buscar"),x.textContent="🔍 Buscar",x.style.marginLeft="auto",x.addEventListener("click",g),S.appendChild(x),h=x}return A(),()=>{a.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Ve="aviso-guardado";function Zs(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(Ve))==null||g.remove()}function m(){if(s==="oculto")return l();const g=e();if(!g)return;let b=a.getElementById(Ve);b||(b=a.createElement("div"),b.id=Ve,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const y=a.createElement("span");if(y.style.flex="1",b.appendChild(y),s==="pendiente")y.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",m()}));else if(s==="subiendo"){y.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else s==="guardado"?y.textContent="¡Guardado!":s==="error"&&(y.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,b,y){const f=a.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",y),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return s="subiendo",m(),c=(async()=>{try{await t.guardar(),n.alDia(g),s="guardado",m(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),m()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",m()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",m()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,detener(){v(),l()}}}function ti({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(g){return`view-${g}`}function s(g){const b=t.getElementById(n(g.route));if(b)return b;const y=t.querySelector(".view-container");if(!y)return null;const f=t.createElement("div");return f.id=n(g.route),f.className="view hidden",y.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),y=b[g.seccion??Math.max(0,b.length-1)];if(!y)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,y.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){e.set(g.route,g),s(g),i(g)}function c(){return[...e.keys()].filter(g=>{const b=e.get(g);return!a||a(b.flagId??b.id)})}function l(g){return c().includes(g)}function m(g){const b=e.get(g);if(!b||a&&!a(b.flagId??b.id))return!1;const y=s(b);if(!y)return!1;if(o&&o!==g){const f=e.get(o),h=t.getElementById(n(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount(y),o=g,!0}function d(){o&&m(o)}function u(){const g={};for(const[b,y]of e)g[b]=y.flagId??y.id;return g}function v(){for(const g of e.values())s(g),i(g)}return{register:r,routes:c,has:l,mount:m,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function p(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function wt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${p(F(t))}</span>`}function ei(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function bo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${p(a)}</span>`).join(" ")}const ai=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function fe(t){const[a,e]=t.split("-").map(Number);return`${ai[e-1]} ${a}`}function R(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function ot(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function j(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function U(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function ct(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function ho(t,a){const e=parseFloat(ct(t,a));return Number.isFinite(e)?e:0}const oi="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ue(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ni(t){const{store:a}=t,e=t.hoy??K,o=()=>k(e()),n=()=>a.get("config").margenesSeguridad??[];function s(v){var g;a.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=n().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),y=b.find(f=>f._id===v);y&&(g(y),s(b))}function r(v){const g=a.get("config"),b=qe(v,a.get("expenses"),g,a.get("loans"),e(),!1,o());return F(b)}function c(v,g,b){const y=g.tipo==="fijo",f=y?"":`<span class="text-sm" style="color:var(--text3)">${p(F((g.meses??0)*b))}</span>`;return`
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
      </tr>`}function l(v,g,b){const y=v.cuentas&&v.cuentas.length>0?v.cuentas.map(S=>{var x;return((x=g.find($=>$._id===S))==null?void 0:x.nombre)??S}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((S,x)=>S.fecha.localeCompare(x.fecha)).map(S=>c(v,S,b)).join(""),A=v.activo?`
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
        ${A}
      </div>`}function m(v,g){const b=g?n().find(A=>A._id===g):null,y=a.get("accounts").filter(A=>A.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=y.map(A=>`
        <label class="tag" data-chip="${p(A._id)}" style="cursor:pointer;${f.has(A._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${p(A._id)}" ${f.has(A._id)?"checked":""} style="display:none"/>
          ${p(A.nombre)}
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
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");!b||!y||(m(y,v),b.classList.remove("hidden"),U(y,".mg-acc-chip",f=>{const h=f,A=y.querySelector(`[data-chip="${h.value}"]`);A&&(A.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(y,"#mg-p-tipo",f=>{const h=f.value==="fijo",A=y.querySelector("#mg-p-importe-wrap"),S=y.querySelector("#mg-p-meses-wrap");A&&(A.style.display=h?"":"none"),S&&(S.style.display=h?"none":"")}),j(y,"[data-cerrar-form]",()=>b.classList.add("hidden")),j(y,"[data-guardar-margen]",f=>{var $,M,E,w,P;const h=f.getAttribute("data-guardar-margen")||"",A=(($=y.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!A)return R("El nombre es obligatorio","err");const S=[...y.querySelectorAll(".mg-acc-chip:checked")].map(_=>_.value),x=n().map(_=>({..._}));if(h){const _=x.findIndex(C=>C._id===h);if(_===-1)return R("Margen no encontrado","err");x[_]={...x[_],nombre:A,cuentas:S}}else{const _=((M=y.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",C={_id:Ue(),fecha:((E=y.querySelector("#mg-p-fecha"))==null?void 0:E.value)||K(),tipo:_,importe:parseFloat(((w=y.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((P=y.querySelector("#mg-p-meses"))==null?void 0:P.value)??"1")||1};x.push({_id:Ue(),nombre:A,activo:!0,cuentas:S,puntos:[C]})}s(x),R(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=n(),b=a.get("accounts"),y=Wt(a.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(h=>l(h,b,y)).join("")}`;const f=()=>u(v);j(v,"[data-nuevo-margen]",()=>d(null,f)),j(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),f)),j(v,"[data-borrar-margen]",h=>{ot("¿Eliminar este margen de seguridad?")&&(s(n().filter(A=>A._id!==h.getAttribute("data-borrar-margen"))),R("Margen eliminado"),f())}),U(v,"[data-toggle-margen]",h=>{const A=h.getAttribute("data-toggle-margen");i(A,S=>{S.activo=h.checked}),f()}),j(v,"[data-add-punto]",h=>{const A=h.getAttribute("data-add-punto");i(A,S=>{S.puntos=[...S.puntos??[],{_id:Ue(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),f()}),j(v,"[data-borrar-punto]",h=>{const A=h.closest("[data-punto]");if(!A)return;const S=A.dataset.margen,x=A.dataset.punto;i(S,$=>{$.puntos=($.puntos??[]).filter(M=>M._id!==x)}),f()}),U(v,"[data-campo]",h=>{const A=h.closest("[data-punto]");if(!A)return;const S=h.getAttribute("data-campo"),x=h.value;i(A.dataset.margen,$=>{const M=($.puntos??[]).find(E=>E._id===A.dataset.punto);M&&(S==="fecha"?M.fecha=x:S==="tipo"?M.tipo=x:S==="importe"?M.importe=parseFloat(x)||0:M.meses=parseFloat(x)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:oi,mount:u}}const si=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],ii=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],ri=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function ci(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ye=(t,a)=>t.map(([e,o])=>`<option value="${p(e)}"${e===a?" selected":""}>${p(o)}</option>`).join("");function yo(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=ci(t),i=Ye(si.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${p(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ye(ii,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ye(ri,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function $o(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function xo(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const li={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function di(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Rt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const l=s.has(c._id),m=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
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
      ${di(e,a).map(r).join("")}
    </div>
  </div>`}function Nt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Lt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,l=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),m=l?parseFloat(l.value):NaN;return Number.isFinite(m)?{personaId:c,valor:m}:{personaId:c}});return{modo:o,participantes:s}}function Io(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${li[t.modo]})`}function We(t,a,e){const o=Io(t,e),n=Io(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const ui="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",pi=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function mi(t){const a=t.hoy??K,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var h;return((h=n().find(A=>A._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(A=>!A.fechaFin||A.fechaFin>=f)),e.tipo&&(h=h.filter(A=>A.tipo===e.tipo)),e.cuenta&&(h=h.filter(A=>(A.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(A=>(A.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(A=>(A.fechaInicio??"")<=e.hasta)),e.busqueda){const A=e.busqueda.toLowerCase();h=h.filter(S=>S.concepto.toLowerCase().includes(A))}return e.tags.size>0&&(h=h.filter(A=>(A.tags||[]).some(S=>e.tags.has(S)))),h.sort((A,S)=>{const x=A[e.orden]??"",$=S[e.orden]??"";return typeof x=="number"&&typeof $=="number"?(x-$)*e.sentido:String(x).localeCompare(String($))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const A=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${p(h)} <span class="sort-arrow">${A}</span></span>`}function l(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(S=>S.activo!==!1).map(S=>`<option value="${p(S._id)}"${S._id===f?" selected":""}>${p(S.nombre)}</option>`).join("")}function m(f){const h=f.tipo==="transferencia",A=We(f.repartoConsumo,f.repartoPago,t.store.get("personas")),S=Me(f.diaPago??""),x=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${S?` · ${S}`:""}`,$=!!f.fechaFin&&f.fechaFin<a(),M=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',E=h?`${p(s(f.cuenta))} → ${p(s(f.cuentaDestino))}`:p(s(f.cuenta)),w=(f.tags||[]).map(P=>`<span class="tag${e.tags.has(P)?" active":""}" data-tag="${p(P)}" title="Filtrar por ${p(P)}">${p(P)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${M}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${p(F(f.cuantia))}</div>
      <div class="text-sm">${p(x)}</div>
      <div class="text-sm exp-col-hide">${E}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${p(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${p(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(A)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${p(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${p(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${p(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const h=i(),A=r();f.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${p(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${p(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${p(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${A.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${A.map(S=>`<span class="tag${e.tags.has(S)?" active":""}" data-tag="${p(S)}">${p(S)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(m).join("")}
      </div>`}function u(f){const h=(f==null?void 0:f.tipo)==="transferencia",A=t.store.get("personas"),S=(x,$,M,E,w="")=>`<div class="form-group"><label class="form-label">${p($)}</label>
       <input class="form-input" type="${M}" id="${x}" value="${p(E)}" placeholder="${p(w)}"/></div>`;return`
      <div class="grid-2">
        ${S("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${S("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${S("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${pi.map(([x,$])=>`<option value="${x}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===x?" selected":""}>${p($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${S("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
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
          <div class="mt-8">${S("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${yo(f==null?void 0:f.diaPago,"exp")}</div>
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
          ${h?"":`${Rt("Reparto de consumo",f==null?void 0:f.repartoConsumo,A,"consumo")}
                 ${Rt("Reparto de pago",f==null?void 0:f.repartoPago,A,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${p((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var S;const h=((S=f.querySelector("#ef-tipo"))==null?void 0:S.value)??"gasto",A=(x,$)=>{const M=f.querySelector(x);M&&(M.style.display=$?"":"none")};A("#ef-destino-wrap",h==="transferencia"),A("#ef-basico-wrap",h!=="transferencia"),A("#ef-irpf-wrap",h==="ingreso"),A("#ef-clasificacion-wrap",h==="gasto")}function g(f,h,A){const S=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");!S||!x||(x.innerHTML=`<div class="modal-title">${p(h)}</div>${u(f)}`,S.classList.remove("hidden"),U(x,"#ef-tipo",()=>v(x)),U(x,"[data-dp-modo]",()=>$o(x)),U(x,'[data-reparto-modo="consumo"]',()=>Nt(x,"consumo")),U(x,'[data-reparto-modo="pago"]',()=>Nt(x,"pago")),j(x,"[data-cancelar]",()=>S.classList.add("hidden")),j(x,"[data-guardar]",$=>{b(x,$.getAttribute("data-guardar")||"")&&(S.classList.add("hidden"),A())}))}function b(f,h){const A=_=>{var C;return((C=f.querySelector(_))==null?void 0:C.value)??""},S=_=>{var C;return!!((C=f.querySelector(_))!=null&&C.checked)},x=A("#ef-tipo")||"gasto",$=x==="transferencia",M=A("#ef-concepto").trim(),E=parseFloat(A("#ef-cuantia"));if(!M||!Number.isFinite(E))return R("Concepto y cuantía obligatorios","err"),!1;const w=A("#ef-clasificacion"),P={concepto:M,tipo:x,cuantia:E,frecuencia:parseInt(A("#ef-frecuencia"),10)||1,tipoFrecuencia:A("#ef-tipo-frec")||"mensual",fechaInicio:A("#ef-fecha-ini"),fechaFin:A("#ef-fecha-fin")||null,diaPago:xo(f),cuenta:A("#ef-cuenta"),cuentaDestino:$?A("#ef-cuenta-dest")||"default":void 0,activo:S("#ef-activo"),basico:!$&&S("#ef-basico"),sujetoIRPF:!$&&S("#ef-sujetoIRPF"),clasificacion:x==="gasto"?w||null:void 0,tags:$?["transferencia"]:A("#ef-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:$?void 0:Lt(f,"consumo"),repartoPago:$?void 0:Lt(f,"pago")};return h?(t.store.updateItem("expenses",h,P),R("Actualizado")):(t.store.addItem("expenses",P),R("Creado")),o(),!0}function y(f,h){const A=f.querySelector("[data-busqueda]");let S;A==null||A.addEventListener("input",()=>{clearTimeout(S),S=setTimeout(()=>{e.busqueda=A.value,h();const x=f.querySelector("[data-busqueda]");x==null||x.focus(),x==null||x.setSelectionRange(x.value.length,x.value.length)},250)}),U(f,"[data-expirados]",x=>{e.mostrarExpirados=x.checked,h()}),U(f,"[data-f-tipo]",x=>{e.tipo=x.value,h()}),U(f,"[data-f-cuenta]",x=>{e.cuenta=x.value,h()}),U(f,"[data-f-desde]",x=>{e.desde=x.value,h()}),U(f,"[data-f-hasta]",x=>{e.hasta=x.value,h()}),j(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),j(f,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),j(f,"[data-tag]",x=>{const $=x.getAttribute("data-tag");e.tags.has($)?e.tags.delete($):e.tags.add($),h()}),j(f,"[data-orden]",x=>{const $=x.getAttribute("data-orden");e.orden===$?e.sentido=e.sentido===1?-1:1:(e.orden=$,e.sentido=1),h()}),j(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),j(f,"[data-editar]",x=>{const $=t.store.get("expenses").find(M=>M._id===x.getAttribute("data-editar"));$&&g($,"Editar",h)}),j(f,"[data-duplicar]",x=>{const $=t.store.get("expenses").find(w=>w._id===x.getAttribute("data-duplicar"));if(!$)return;const{_id:M,...E}=$;g({...E,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",h)}),j(f,"[data-borrar]",x=>{ot("¿Eliminar?")&&(t.store.removeItem("expenses",x.getAttribute("data-borrar")),R("Eliminado"),o(),h())}),U(f,"[data-activo]",x=>{const $=x;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:ui,mount(f){const h=()=>d(f);d(f),f.dataset.wired!=="1"&&(y(f,h),f.dataset.wired="1")}}}function ge(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=gt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function wo(t,a,e,o){return t.reduce((n,s)=>{const i=gt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function fi(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ge(i.tabla,a,e)-ge(r.tabla,a,e)}})}const Ke=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${p(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function gi(t,a){const e=Ia(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?wa(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?Ca(t.tin||0,i):null,c=o&&n?fi(t,a.periodos,a.hoy):[],l=c.length?ge(e.sinAmort.tabla,a.periodos,a.hoy)-ge(e.tabla,a.periodos,a.hoy):null,m=l===null?null:l-e.costeTotalAmort,d=s?wo(e.tabla,a.periodos,a.hoy,e.comAp):null,u=s&&o?wo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${p(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${p(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=We(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${p(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${p(t.tin)}%</span>
        <span class="text-sm">${p(F(e.cuota))}/mes</span>
        <span class="text-sm">${p(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${p(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${p(t._id)}">

      <div class="grid-4 mb-12">
        ${Ke("Cuota mensual",p(F(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${p(F(a.cuotaMes))}</div>`:"")}
        ${Ke("Total intereses",p(F(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(F(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${p(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ke("Total pagado",p(F(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${p(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${p(ha(e.tae))}</div></div>
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
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${p(F(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${p(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${p(Me(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${p(F(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${p(F(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${p(F(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(m??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${p(F(m??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${p(F(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${p(F(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?vi(t,e.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>bi(v,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>hi(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function vi(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${p(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${p(F(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${p(F(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${p(F(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${p(F(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${p(F(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function bi(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=gt(e.periodos,e.hoy,t.fecha);o=p(F(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":p(t.mes)}</td>
    <td class="num">${p(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":p(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${p(F(t.interes))}</td>
    <td class="num">${p(F(t.amortizacion))}</td>
    <td class="num">${p(F(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function hi(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${p(a.fecha)}</span>
    <span class="num">${p(F(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${p(F(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${p(F(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${p(t)}|${p(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${p(t)}|${p(a._id)}">✕</button>
  </div>`}const tt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,ae=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,oe=(t,a,e,o="")=>`<label class="form-label">${p(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${p(o)}</span>`:""}`,yi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${p(e._id)}"${e._id===a?" selected":""}>${p(e.nombre)}</option>`).join("");function $i(t,a,e,o=K()){return`
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
            <select class="form-select" id="f-cuenta">${yi(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${yo(t==null?void 0:t.diaPago,"loan")}
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
        ${Rt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Rt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
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
    </div>`}function xi(t,a,e=K()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${tt("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${ae("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${oe("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${p(t)}|${p((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Ii="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function wi(t){const a=t.hoy??K;let e=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const M=$.filter(w=>w.activo);if(M.length<2)return"";const E=(w,P)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":p(w)}"
               style="${n===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p(P)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${E(null,"Todas")}
      ${M.map(w=>E(w._id,w.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const M=X($).tabla.filter(E=>!E.esAmortizacion);return M.length===0?!0:M[M.length-1].fecha<a()}function c($,M){const E=a(),w=E.slice(0,7),P=new Map;let _=0;for(const C of $){if(!C.activo||C.simulacion||M.has(C._id)||(C.fechaInicio||"")>E)continue;const I=X(C).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(w)),T=I.length>0?I[0].cuota:0;P.set(C._id,T),_+=T}return{porLoan:P,total:_,activos:[...P.values()].filter(C=>C>0).length}}function l($){const M=a().slice(0,7),E=[];for(const w of $){if(!w.activo||w.simulacion)continue;const P=X(w).tabla.filter(C=>!C.esAmortizacion),_=P[P.length-1];_&&_.fecha.slice(0,7)===M&&E.push({loan:w,cuota:_.cuota})}return E}function m($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function d($){const M=t.store.get("config"),E=M.dashboardStart,w=M.dashboardEnd,P=Math.max(1,(k(w).getTime()-k(E).getTime())/(30.44*864e5));let _=0;for(const C of $)!C.activo||C.simulacion||(_+=X(C).tabla.filter(I=>!I.esAmortizacion&&I.fecha>=E&&I.fecha<=w).reduce((I,T)=>I+T.cuota,0));return{media:_/P,desde:E,hasta:w}}function u($){const M=t.store.get("personas"),E=ce(M),w=[...t.store.get("loans")].sort((q,B)=>B.tin-q.tin),P=n?w.filter(q=>_e(q.repartoConsumo,q.repartoPago,E).has(n)):w,_=new Set(P.filter(r).map(q=>q._id)),C=e?P:P.filter(q=>!_.has(q._id)),I=c(w,new Set(w.filter(r).map(q=>q._id))),T=d(w),D=l(w),z=t.store.get("config"),N=t.store.get("inflacion"),O=new Date(k(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${_.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${_.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(M)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${p(m(D.map(q=>q.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${p(F(D.reduce((q,B)=>q+B.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${I.total>0||T.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${I.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${p(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${p(F(I.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${I.activos} préstamo${I.activos!==1?"s":""} activo${I.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${T.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${p(F(T.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${p(T.desde)} → ${p(T.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${C.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':C.map(q=>gi(q,{periodos:N,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:I.porLoan.get(q._id)??0,completado:_.has(q._id),personas:M})).join("")}
      </div>`;for(const q of $.querySelectorAll("[data-body-loan]"))o.has(q.dataset.bodyLoan??"")&&q.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),b=()=>{var $;return($=v())==null?void 0:$.classList.add("hidden")};function y($,M){const E=v(),w=g();return!E||!w?null:(w.innerHTML=`<div class="modal-title">${p($)}</div>${M}`,E.classList.remove("hidden"),j(w,"[data-cancelar]",b),w)}function f($,M){const E=$?t.store.get("loans").find(P=>P._id===$)??null:null,w=y($?"Editar préstamo":"Nuevo préstamo",$i(E,t.store.get("accounts"),t.store.get("personas"),a()));w&&(w.addEventListener("change",P=>{const _=P.target;_!=null&&_.matches("[data-dp-modo]")&&$o(w),_!=null&&_.matches('[data-reparto-modo="consumo"]')&&Nt(w,"consumo"),_!=null&&_.matches('[data-reparto-modo="pago"]')&&Nt(w,"pago")}),j(w,"[data-guardar-loan]",P=>{h(w,P.getAttribute("data-guardar-loan")||"")&&(b(),M())}))}function h($,M){const E=D=>{var z;return((z=$.querySelector(D))==null?void 0:z.value)??""},w=D=>{var z;return!!((z=$.querySelector(D))!=null&&z.checked)},P=E("#f-nombre").trim(),_=parseFloat(E("#f-capital")),C=parseFloat(E("#f-tin")),I=parseInt(E("#f-meses"),10);if(!P||!Number.isFinite(_)||!Number.isFinite(C)||!Number.isFinite(I))return R("Completa los campos obligatorios","err"),!1;const T={nombre:P,capital:_,tin:C,meses:I,fechaInicio:E("#f-fecha"),comisionApertura:parseFloat(E("#f-com-ap"))||0,comisionAmort:parseFloat(E("#f-com-am"))||0,diaPago:xo($),cuenta:E("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:E("#f-tipo-tasa"),basico:w("#f-basico"),tags:E("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Lt($,"consumo"),repartoPago:Lt($,"pago")};return M?(t.store.updateItem("loans",M,T),R("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),R("Préstamo creado")),s(),!0}function A($,M,E){const w=t.store.get("loans").find(C=>C._id===$);if(!w)return;const P=M?(w.amortizaciones||[]).find(C=>C._id===M)??null:null,_=y(M?"Editar amortización":"Añadir amortización",xi($,P,a()));_&&j(_,"[data-guardar-amort]",C=>{const[I,T]=(C.getAttribute("data-guardar-amort")||"").split("|");S(_,I,T)&&(b(),E([I]))})}function S($,M,E){var z;const w=N=>{var O;return((O=$.querySelector(N))==null?void 0:O.value)??""},P=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!P||!Number.isFinite(_)||_<=0)return R("Fecha y cantidad requeridas","err"),!1;const C=t.store.get("loans").find(N=>N._id===M);if(!C)return!1;const I={fecha:P,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((z=$.querySelector("#am-sim"))!=null&&z.checked)},T=C.amortizaciones||[],D=E?T.map(N=>N._id===E?{...N,...I}:N):[...T,{_id:Date.now().toString(36),...I}];return t.store.updateItem("loans",M,{amortizaciones:D}),R(E?"Amortización actualizada":"Amortización añadida"),s(),!0}function x($,M){j($,"[data-toggle-finalizados]",()=>{e=!e,M()}),j($,"[data-persona-tab]",E=>{n=E.getAttribute("data-persona-tab")||null,M()}),j($,"[data-nuevo-loan]",()=>f(null,M)),j($,"[data-toggle-loan]",(E,w)=>{var I;if((I=w.target)!=null&&I.closest("button"))return;const P=E.getAttribute("data-toggle-loan"),_=[...$.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===P);(_==null?void 0:_.classList.toggle("open"))?o.add(P):o.delete(P)}),j($,"[data-editar-loan]",E=>f(E.getAttribute("data-editar-loan"),M)),j($,"[data-borrar-loan]",E=>{if(!ot("¿Eliminar préstamo?"))return;const w=E.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),R("Eliminado"),s(),M()}),j($,"[data-amort-loan]",E=>{const w=E.getAttribute("data-amort-loan");o.add(w),A(w,null,M)}),j($,"[data-editar-amort]",E=>{const[w,P]=(E.getAttribute("data-editar-amort")||"").split("|");o.add(w),A(w,P,M)}),j($,"[data-borrar-amort]",E=>{const[w,P]=(E.getAttribute("data-borrar-amort")||"").split("|"),_=t.store.get("loans").find(C=>C._id===w);_&&(t.store.updateItem("loans",w,{amortizaciones:(_.amortizaciones||[]).filter(C=>C._id!==P)}),R("Amortización eliminada"),s(),M([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Ii,mount($){const M=(E=[])=>{for(const w of E)o.add(w);u($)};u($),$.dataset.wired!=="1"&&(x($,M),$.dataset.wired="1")}}}const Je=6.35;function Ot(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function Co(t){return Math.max(0,(t.bruto||0)-Ot(t))}function Ci(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Si(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Ot(r),0),o=Math.max(0,a-e),n=ht(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Co(i)/o):0);return s}function So(t,a,e){if(t.irpfModo==="manual")return Co(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return lt(ht(t.bruto||0,Ot(t)),e);const o=Ci(a.filter(i=>i.irpfModo!=="manual")),n=Si(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,e)-lt(s,e);s+=r}return lt(ht(t.bruto||0,Ot(t)),e)}function Ai(t,a){return t.reduce((e,o)=>e+So(o,t,a),0)}function Mi(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function Ei(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Ot(s),0);return Mi(ht(e,o),a)}function Pi(t,a,e){const o=t.bruto||0,n=Ot(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Je,c=s*(r/100),l=So(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:s>0?l/s*100:0,netoPorPaga:(s-c-l)/i}}function _i(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const Fi={transporte:125,restaurante:220,otros:null},Di={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Ti=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,zi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${p(e._id)}"${e._id===a?" selected":""}>${p(e.nombre)}</option>`).join("");function ji(t,a){const e=t.map((s,i)=>{const r=a.find(m=>m._id===s.cuenta),c=Fi[s.tipo],l=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${p(Di[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${p(F(s.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${p(F(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?p(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(s=>`<option value="${p(s._id)}">${p(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function qi(t,a){const e=a.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${zi(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${kt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${kt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${kt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Ti.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${p(s)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Je).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Rt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Rt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ao(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Je),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:Lt(t,"consumo"),repartoPago:Lt(t,"pago")}}function Ri(t,a,e,o){const n=Ao(t,a),s=a.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(ht(n.bruto,s),e.tramos),l=i-r-c,m=i/n.nPagas,d=r/n.nPagas,u=c/n.nPagas,v=m-d-u,g=n.grupoNomina?e.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${p(n.grupoNomina)}" con ${p(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",y=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${p(F(s))}/año (exento IRPF y SS)</span>
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
    </div>${b}`}function Ni(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=ji(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Ri(t,a,e,o))},i=()=>{var c,l;const r=(m,d)=>{const u=t.querySelector(m);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Nt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Nt(t,"pago")),j(t,"[data-flex-anadir]",()=>{var l,m,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((m=t.querySelector("#fc-importe"))==null?void 0:m.value)??"")||0;if(!c)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),j(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const Mo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Li(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??bt;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${p(Mo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(Mo(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tabla]",b=>{const y=b.getAttribute("data-editar-tabla");d(y==="default"?"default":Number(y))}),j(g,"[data-borrar-tabla]",b=>{const y=Number(b.getAttribute("data-borrar-tabla"));ot(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==y)),R(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const y=t.store.get("tramosIRPFHistorico");if(y.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function m(u){e=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const y=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat((y==null?void 0:y.value)??"")||0]})}function d(u){var h;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((h=v.find(A=>A.año===u))==null?void 0:h.tramos)??i()).map(A=>[...A]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,y=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${p(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!y)return;const f=()=>{const A=y.querySelector("#irpf-tramos-rows");A&&(A.innerHTML=l())};j(y,"[data-volver]",c),j(y,"[data-tr-anadir]",()=>{m(y),e.push([0,0]),f()}),j(y,"[data-tr-borrar]",A=>{m(y),e.splice(Number(A.getAttribute("data-tr-borrar")),1),f()}),j(y,"[data-tr-guardar]",()=>{m(y);const A=[...e].sort((S,x)=>S[0]-x[0]);if(A.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:A}),R("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(S=>S.año===a?{...S,tramos:A}:S)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Eo=1500,Et=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,Oi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,ki=t=>(t.modeloFondo||"cuenta")==="pension";function Bi(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Hi(n,a,e,o)).join("")}</div>`}function Hi(t,a,e,o){const n=De(t);if(!n)return"";const s=Te(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,m)=>l+m.cantidad,0),c=Math.min(r,Eo)*(s/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Eo?"neg":""}">${p(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${p(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${p(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${p(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Gi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(F(e.importe))} / ${p(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Vi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Et("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Et("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Et("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Et("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Et("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Oi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Ui(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Gi(a))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Yi(t,a,e,o){var y;const n=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},s=(f,h=0)=>{const A=parseFloat(n(f));return Number.isFinite(A)?A:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),l=n("#pen-grupo"),m={nombre:r,grupoNomina:l,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],g=((y=[...d].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:y.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:m.fechaInicialSaldo??o,cantidad:c})),{datos:{...m,historicoSaldos:d,aportaciones:u}}}const Wi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Ki(t){const a=t.hoy??K,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const A=h.filter(x=>x.activo);if(A.length<2)return"";const S=(x,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${x===null?"":p(x)}"
               style="${o===x?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${S(null,"Todas")}
      ${A.map(x=>S(x._id,x.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Ft(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??bt)(Number(a().slice(0,4)))}function i(h,A,S){const x=Pi(h,A,S),$=!!A&&h.irpfModo!=="manual",M=We(h.repartoConsumo,h.repartoPago,t.store.get("personas")),E=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",x.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${p(F(x.flexAnual))}/año</span>`:"",Math.abs(x.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${x.ssPct.toFixed(2)}%</span>`:"",M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(M)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${E}</div>
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
    </div>`}const r=h=>{var A;return((A=t.store.get("accounts").find(S=>S._id===(h||"default")))==null?void 0:A.nombre)??(h||"default")};function c(h,A,S){const x=A.reduce((E,w)=>E+(w.bruto||0),0),$=Ai(A,S),M=x>0?$/x*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${p(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${p(F(x))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${M.toFixed(1)}%</strong> (${p(F($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${A.map(E=>i(E,A,S)).join("")}
      </div>
    </div>`}function l(h){const A=s(),S=t.store.get("personas"),x=ce(S),$=[...t.store.get("nominas")].sort((C,I)=>(I.bruto||0)-(C.bruto||0)),M=o?$.filter(C=>_e(C.repartoConsumo,C.repartoPago,x).has(o)):$,{grupos:E,sueltas:w}=_i(M),P=t.store.get("accounts").filter(ki),_=$.filter(C=>C.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n(S)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${M.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...E.entries()].map(([C,I])=>c(C,I,A)).join("")}
      ${w.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${w.map(C=>i(C,null,A)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Bi(P,_,A,a())}</div>`}const m=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),u=()=>{var h;return(h=m())==null?void 0:h.classList.add("hidden")};function v(h,A){const S=m(),x=d();return!S||!x?null:(x.innerHTML=`<div class="modal-title">${p(h)}</div>${A}`,S.classList.remove("hidden"),j(x,"[data-cancelar]",u),x)}function g(h,A){const S=h?t.store.get("nominas").find(E=>E._id===h)??null:null,x=[...(S==null?void 0:S.retribucionFlexible)??[]].map(E=>({...E})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},M=v(h?"Editar nómina":"Nueva nómina",qi(S,$));M&&(Ni(M,x,$,h??""),j(M,"[data-guardar-nomina]",E=>{const w=Ao(M,x);if(!w.nombre||w.bruto<=0)return R("Nombre y bruto anual son obligatorios","err");const P=E.getAttribute("data-guardar-nomina")||"",_={...w,activo:!0,tags:["nomina"]};P?(t.store.updateItem("nominas",P,_),R("Nómina actualizada")):(t.store.addItem("nominas",_),R("Nómina creada")),e(),u(),A()}))}function b(h,A){const S=h?t.store.get("accounts").find(M=>M._id===h)??null:null,x=[...(S==null?void 0:S.planAportaciones)??[]].map(M=>({...M})),$=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Vi(S,{nominas:t.store.get("nominas"),hoy:a()}));$&&(Ui($,x,a()),j($,"[data-guardar-pension]",M=>{const{datos:E,error:w}=Yi($,x,S,a());if(w)return R(w,"err");const P=M.getAttribute("data-guardar-pension")||"";P?(t.store.updateItem("accounts",P,E),R("Plan actualizado")):(t.store.addItem("accounts",E),R("Plan creado")),e(),u(),A()}))}function y(h,A,S){j(h,"[data-persona-tab]",x=>{o=x.getAttribute("data-persona-tab")||null,A()}),j(h,"[data-nueva-nomina]",()=>g(null,A)),j(h,"[data-editar-nom]",x=>g(x.getAttribute("data-editar-nom"),A)),j(h,"[data-borrar-nom]",x=>{ot("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",x.getAttribute("data-borrar-nom")),R("Eliminada"),e(),A())}),U(h,"[data-activo-nom]",x=>{const $=x;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),e(),A()}),j(h,"[data-tramos]",()=>S.abrir()),j(h,"[data-nueva-pension]",()=>b(null,A)),j(h,"[data-editar-pension]",x=>b(x.getAttribute("data-editar-pension"),A)),j(h,"[data-borrar-pension]",x=>{ot("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",x.getAttribute("data-borrar-pension")),R("Plan eliminado"),e(),A())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Wi,mount(h){const A=()=>l(h);f??(f=Li({store:t.store,onDatosCambiados:()=>{e(),A()},año:()=>Number(a().slice(0,4))})),l(h),h.dataset.wired!=="1"&&(y(h,A,f),h.dataset.wired="1")}}}const Ji="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Qi="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Po={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Xi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Zi(t,a){const e=t.filter(c=>c.activo&&rt(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const l=le(c,a);l&&(o+=l.saldo,n+=l.costBase,s+=l.plusvalia,i+=l.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function tr(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(k(o).getTime()-k(e).getTime())/(30.44*864e5)),s=Vt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(gt(a.inflacion,e,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${p(F(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${p(F(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${p(e.slice(0,7))} → ${p(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${p(F(i))}</span>
    </div>${r}
  </div>`}function er(t,a){const e=Po[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),s=n.reduce((v,g)=>v+g.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),m=Ei(l,a.tramosIRPF),d=c*m/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${m}%`:`tipo marginal ${m}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${p(e.label)}</div>
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
  </div>`}function ar(t){const a=De(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(F(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(F(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${p(F(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${p(F(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${p(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${p(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function or(t,a){const e=le(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=k(o.dashboardStart),i=k(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,m=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,u=Math.max(0,m-d),v=Fe(u,a.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",y=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(M,E,w)=>M.map(P=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${E} ${p(P.contraparte)}: ${p(P.concepto)}</span>
          <span class="num ${w}">${p(F(P.total))} · ${P.ocurrencias} mov.</span>
        </div>`).join(""),A=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${p(o.dashboardStart.slice(0,7))} → ${p(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${p(F(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${p(F(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${p(F(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',S=a.invModo(t._id),x=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=S==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(F(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${p(F(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${p(F(e.neto))}</div><div class="stat-sub">${p(y)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${p(F(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${p(F(m))}</div><div class="stat-sub">${p(b)} · ${p(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${p(F(m-v))}</div><div class="stat-sub">${p(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${p(t._id)}|real" style="${x(S==="real")}">Real</button>
          <button data-inv-modo="${p(t._id)}|proyeccion" style="${x(S==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${A}
    </div>`}function nr(t,a){const e=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=e[0],n=vt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${p((Po[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${p(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${p(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${p(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Qi}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Ji}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${p(F(t.saldoInicial||0))}</div><div class="stat-sub">${p(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${p(F(n))}</div>${o?`<div class="stat-sub">Registro: ${p(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${p(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${p(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${tr(t,a)}
    ${s==="beneficio"?er(t,a):""}
    ${s==="pension"?ar(t):""}
    ${s==="inversion"?or(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${p(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${p(t.descripcion)}</div>`:""}
  </div>`}const sr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function ir(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(F(e.importe))} / ${p(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${p(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function rr(t,a){const e=t?rt(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ae("ac-modelo","Tipo",sr,e)}
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
          ${ae("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function cr(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=ir(a))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function lr(t,a,e,o,n){const s=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const y=parseFloat(s(g));return Number.isFinite(y)?y:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=s("#ac-modelo")||"cuenta",m=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:a,tipoBeneficio:m?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:m?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?n:u.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function Qe(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:J(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function dr(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${p(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${p(F(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':p(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${p(a)}|${p(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${p(a)}|${p(r._id)}">✕</button>
      </div>`).join(""),i=e.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${p(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${p(a)}"
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
        <input class="form-input" type="date" id="hi-fecha" value="${p(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${p(a)}">Añadir</button>
    </div>`}const _o=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function ur(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ut;function r(u,v){const g=o(),b=n();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${p(u)}</div>${v}`,g.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${p(_o(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(_o(b.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tg]",b=>{const y=b.getAttribute("data-editar-tg");d(y==="default"?"default":Number(y))}),j(g,"[data-borrar-tg]",b=>{const y=Number(b.getAttribute("data-borrar-tg"));ot(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==y)),R(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const y=t.store.get("tramosGananciasCapitalHistorico");if(y.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function m(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(u){var f;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((f=v.find(h=>h.año===u))==null?void 0:f.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const y=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};j(b,"[data-volver-tg]",c),j(b,"[data-tg-anadir]",()=>{m(b),e.push([0,0]),y()}),j(b,"[data-tg-borrar]",h=>{m(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),y()}),j(b,"[data-tg-guardar]",()=>{m(b);const h=[...e].sort((A,S)=>A[0]-S[0]);if(h.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),R("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(A=>A.año===a?{...A,tramos:h}:A)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const pr=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function mr(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${pr.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function fr(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Fo(t,a){const e=k(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function gr(t,a,e){const o=Fo(e,1)[0],n=a.slice(0,7)<o?a.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function Xe(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function vr(t,a){const{inicio:e,fin:o}=Xe(a);return Ze(t,e,o)}function Ze(t,a,e){return Yt([t],{start:a,end:e}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function br(t,a){const{inicio:e,fin:o}=Xe(a);return re(t.fechaInicio,t.fechaFin,e,o)}function hr(t){function a(n,s={}){var _;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:l,hasta:m}=s,d=t.transacciones({estimacionId:n._id}),v=d.length===0&&(((_=n.tags)==null?void 0:_.length)??0)>0?t.transacciones({tags:n.tags}):d,g=l&&m?gr(l,m,c):Fo(c,i),b=new Map(g.map(C=>{const{inicio:I,fin:T}=Xe(C);return[C,{inicio:l&&l>I?l:I,fin:m&&m<T?m:T}]})),y=new Map;for(const C of v){const I=b.get(C.fecha.slice(0,7));if(!I||C.fecha<I.inicio||C.fecha>I.fin)continue;const T=C.fecha.slice(0,7);y.set(T,(y.get(T)??0)+Math.abs(C.importeCts)/100)}const f=[];for(const C of g){const I=y.get(C);if(I===void 0||!br(n,C))continue;const T=b.get(C),D=G(Ze(n,T.inicio,T.fin));f.push({mes:C,estimado:D,real:G(I),desviacion:G(I-D),precision:fr(D,I)})}const h=G(f.reduce((C,I)=>C+I.estimado,0)),A=G(f.reduce((C,I)=>C+I.real,0)),S=f.reduce((C,I)=>C+Math.abs(I.estimado),0),x=f.length===0?null:S>0?f.reduce((C,I)=>C+I.precision*Math.abs(I.estimado),0)/S:f.reduce((C,I)=>C+I.precision,0)/f.length,$=f.slice(-r),M=$.length>0?G($.reduce((C,I)=>C+I.real,0)/$.length):null,E=$.reduce((C,I)=>C+I.estimado,0),w=$.reduce((C,I)=>C+I.real,0),P=E>0?w/E:null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:h,realTotal:A,desviacionTotal:G(A-h),precision:x,mediaRealReciente:M,factorReciente:P,infraestimada:A>h}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:G(r.estimado),realTotal:G(r.real),desviacionTotal:G(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function yr(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function $r(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function xr(t,a,e,o){const n=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return $r(e,o).map(r=>{const c={desde:`${r}-01`,hasta:yr(r)},l=b=>G(t.transacciones({...c,tipo:b}).reduce((y,f)=>y+Math.abs(f.importeCts)/100,0)),m=b=>G(b.reduce((y,f)=>y+vr(f,r),0)),d=m(s),u=l("gasto"),v=m(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:G(v-d),netoReal:G(g-u)}})}const ve=640,Bt=200,Q={top:14,right:16,bottom:26,left:54};function Ir(t){return fe(t).slice(0,3)}const wr={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function Cr(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=wr[a],o=t.flatMap(y=>[e(y).estimado,e(y).real]),n=ve-Q.left-Q.right,s=Bt-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=y=>Q.left+(t.length===1?n/2:y/(t.length-1)*n),m=y=>Q.top+s-(y-r)/c*s,d=t.map((y,f)=>`${l(f)},${m(e(y).estimado)}`).join(" "),u=t.map((y,f)=>`${l(f)},${m(e(y).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${m(0).toFixed(1)}" x2="${ve-Q.right}" y2="${m(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((y,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${m(e(y).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${p(fe(y.mes))}: ${p(F(e(y).real))}</title></circle>`).join(""),b=t.map((y,f)=>`<text x="${l(f).toFixed(1)}" y="${Bt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${p(Ir(y.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${ve} ${Bt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${Bt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${Bt-Q.bottom}" x2="${ve-Q.right}" y2="${Bt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
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
    </div>`}const Do={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},Sr=[25,50,100,250,0];function Ar(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:zo(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ne(zo(t,5)).desde,intervaloHasta:ne(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function To(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const n=Math.max(1,Math.ceil(o/e)),s=Math.min(Math.max(1,a),n),i=(s-1)*e;return{pagina:t.slice(i,i+e),actual:s,paginas:n,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function be(t,a,e){if(t.total===0)return"";const o=(s,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${s}" ${r?"":"disabled"} title="${p(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,n=Sr.map(s=>`<option value="${s}"${s===a?" selected":""}>${s===0?"todos":`${s} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${p(e)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${n}</select>
      </div>
    </div>`}function ta(t,a,e,o){const n=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${p(o)}" style="${n}">${p(e)}</button>`}function ne(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function zo(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function ea(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:ne(e).desde,hasta:ne(o).hasta}}function Mr(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function aa(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Er(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function Pr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${p(F(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${p(F(J(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${p(F(J(t.diferenciaCts)))}</strong></span>
    </div>`}function _r(t,a){const{ledger:e}=t,o=(t.hoy??K)(),n=t.accounts().filter(I=>I.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?ea(a.periodoDesde,a.periodoHasta):i?Mr(a.intervaloDesde,a.intervaloHasta):ne(a.mes),l={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},m=e.transacciones(l),d=t.estimaciones().filter(I=>I.tipo!=="transferencia"),u=[...d.map(I=>({_id:I._id,etiqueta:`${p(I.concepto)} (${p(F(I.cuantia))})`})),...t.loans().filter(I=>I.activo).map(I=>({_id:I._id,etiqueta:`Préstamo: ${p(I.nombre)}`})),...t.nominas().filter(I=>I.activo).map(I=>({_id:I._id,etiqueta:`Nómina: ${p(I.nombre)}`}))],v=m.filter(I=>I.tipo!=="transferencia"&&I.importeCts<0).reduce((I,T)=>I+T.importeCts,0),g=m.filter(I=>I.tipo!=="transferencia"&&I.importeCts>0).reduce((I,T)=>I+T.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),y=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=n.map(I=>`<option value="${p(I._id)}"${I._id===a.cuentaId?" selected":""}>${p(I.nombre)}</option>`).join(""),h=I=>'<option value="">— sin asignar —</option>'+u.map(T=>`<option value="${p(T._id)}"${T._id===I?" selected":""}>${T.etiqueta}</option>`).join(""),A=I=>Object.keys(Do).map(T=>`<option value="${T}"${T===I?" selected":""}>${Do[T]}</option>`).join(""),S=To(m,a.pagina,a.porPagina),x=new Map(t.accounts().map(I=>[I._id,I.nombre])),$=S.pagina.map(I=>`
      <tr data-tx="${p(I._id)}" style="border-bottom:1px solid var(--border)${I.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${p(I.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${p(I.concepto)}</td>
        <td style="padding:7px 8px">${bo(I.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${p(x.get(I.cuentaId)??I.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${p(I._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${A(I.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${p(I._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(I.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${wt(J(I.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${p(I._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${p(I._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),M=i?xr(e,d,r,c):[],E=s?e.transacciones({desde:r,hasta:c}):[],w=s?aa(m):[],P=To(w,a.pagina,a.porPagina),_=P.pagina.map(I=>{const T=a.detalleAbierto.has(I.concepto),D=T?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${bo(I.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${p(I.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${p(I.concepto)}">Asignar</button>
               </div>
               ${Pr(Er(I,E))}
             </td>
           </tr>`:"",z=T?I.movimientos.map(N=>{var O;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${p(N.fecha)}</span> · ${p(((O=t.accounts().find(q=>q._id===N.cuentaId))==null?void 0:O.nombre)??N.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${p(N._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(N.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${wt(J(N.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${p(I.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${p(I.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${T?"▾":"▸"}</button>
          <span style="font-size:13px">${p(I.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${I.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${p(I.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${I.movimientos.length} movimientos del grupo de golpe">${h(I.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${wt(J(I.total))}</td>
        <td></td>
      </tr>${D}${z}`}).join(""),C=y.slice().reverse().slice(0,8).map(I=>{var T;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${p(I.fecha)}</span>
        <span style="color:var(--text3)">${p(((T=t.accounts().find(D=>D._id===I.cuentaId))==null?void 0:T.nombre)??I.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${p(F(J(I.saldoCts)))}</span>
        ${I.nota?`<span style="color:var(--text3)">${p(I.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${p(I._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${p(a.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${p(a.periodoHasta)}" style="width:140px"/>
                 </div>`:i?`<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${p(a.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${p(a.intervaloHasta)}" style="width:150px"/>
                   </div>`:`<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${p(a.mes)}" style="width:140px"/>
                   </div>`}
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${p(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${wt(J(v))}</span>
          <span>Ingresos: ${wt(J(g))}</span>
          <span>Neto: ${wt(J(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${p(c)}: <strong>${p(F(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${p(a.periodoDesde)} y ${p(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${be(P,a.porPagina,"conceptos")}
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
               ${be(P,a.porPagina,"conceptos")}`:`${be(S,a.porPagina,"movimientos")}
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
               ${be(S,a.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${p(r)} → ${p(c)}</div>
                        <div class="flex gap-6">
                          ${ta("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${ta("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${ta("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${Cr(M,a.comparativa)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(I=>`<option value="${p(I)}"></option>`).join("")}</datalist>
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
          ${C?`<div class="mt-12">${C}</div>`:""}
        </div>
      </div>
    </div>`}function Fr(t,a,e,o){const{ledger:n}=a,s=()=>{e.pagina=1,o()};U(t,"#acc-cuenta",r=>{e.cuentaId=r.value,s()}),U(t,"#acc-mes",r=>{e.mes=r.value||e.mes,s()}),j(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",s()}),U(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,s()}),U(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,s()}),j(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),U(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),j(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,s()}),U(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,s()}),j(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),U(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:m,hasta:d}=ea(e.periodoDesde,e.periodoHasta),u=n.transacciones({cuentaId:e.cuentaId||void 0,desde:m,hasta:d,texto:e.filtroTexto||void 0}),v=aa(u).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)n.asignarEstimacion(g._id,l);R(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),j(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,m=((l==null?void 0:l.value)??"").split(",").map(y=>y.trim().toLowerCase()).filter(Boolean);if(m.length===0)return R("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=ea(e.periodoDesde,e.periodoHasta),v=n.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:u,texto:e.filtroTexto||void 0}),g=aa(v).find(y=>y.concepto===c);if(g){for(const y of g.movimientos)n.actualizar(y._id,{tags:[...new Set([...y.tags,...m])]});R(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{s();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),j(t,"#nt-guardar",()=>{const r=ct(t,"#nt-concepto").trim(),c=ho(t,"#nt-importe");if(!r)return R("Indica un concepto","err");if(!(c>0))return R("Indica un importe mayor que cero","err");const l=ct(t,"#nt-tags").split(",").map(m=>m.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(a.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),R("Movimiento registrado"),a.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;ot("¿Eliminar este movimiento?")&&(n.eliminar(c),R("Movimiento eliminado"),a.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=n.transacciones().find(u=>u._id===c);if(!l)return;const m=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(J(l.importeCts))));if(m===null)return;const d=parseFloat(m.replace(",","."));if(!Number.isFinite(d)||d<=0)return R("Importe no válido","err");n.actualizar(c,{importe:d}),R("Movimiento actualizado"),a.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");n.asignarEstimacion(c,r.value||null),R("Asignación actualizada"),a.onDatosCambiados()}),U(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");n.actualizar(c,{tipo:r.value}),R("Tipo actualizado"),a.onDatosCambiados(),o()}),j(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return R("Indica el saldo","err");const c=ho(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(a.hoy??K)(),c,ct(t,"#pc-nota").trim()||void 0),R("Saldo real registrado"),a.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",r=>{ot("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(r.dataset.pcBorrar),R("Punto de control eliminado"),a.onDatosCambiados(),o())})}function oa(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const s=G(a*t.factorReciente),i=G(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:G(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Dr(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??K(),l=t.get("expenses"),m=l.find(g=>g._id===s);if(!m)throw new Error(`La estimación ${s} no existe`);const d={...m,fechaFin:c},u={...m,_id:a(),cuantia:G(i),fechaInicio:c,fechaFin:m.fechaFin??null,ajustadaDesdeId:m._id,ajustadaEn:c},v=l.map(g=>g._id===s?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const l of s)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(m){c.push({estimacionId:l.estimacionId,error:m.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const l=[];let m=c;const d=new Set;for(;m!=null&&m.ajustadaDesdeId&&!d.has(m._id);){d.add(m._id);const b=r.get(m.ajustadaDesdeId);if(!b)break;l.unshift(b),m=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find(y=>y.ajustadaDesdeId===v._id&&!g.has(y._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:n}}function jo(t){var n;const a=t.estimaciones(),e=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(a.map(s=>[s._id,s]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:oa(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function Tr(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?p(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function zr(t){var r;const a=jo(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${wt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${ei(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Tr(t)}
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
    </div>`}function jr(t,a,e){j(t,"#ajustar-todas",()=>{const o=jo(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!ot(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});R(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const qr=[";",",","	","|"],Rr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function he(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ye(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Nr(t){let a=";",e=-1;for(const o of qr){const n=t.slice(0,20).map(c=>ye(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function se(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const m=s===","?o:n;i=a.slice(0,m).replace(/[.,]/g,""),r=a.slice(m+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?e?-l:l:null}function na(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return qo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),qo(o,Number(e[2]),Number(e[1]))}return null}function qo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Ro(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>na(e)!==null).length/a.length}function No(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>se(e)!==null).length/a.length}function Lr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=he(t[i]);if(r&&Rr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&he(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Ro(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||he(t[r]).includes("saldo"))continue;const c=No(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(No(c)>.5||Ro(c)>.5)continue;const l=c.reduce((m,d)=>m+d.length,0)/Math.max(1,c.length);l>i&&(i=l,s=r)}s>=0&&(e.concepto=s)}return e}function Or(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(m=>m.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Nr(a),o=a.map(m=>ye(m,e).length),n=Math.max(...o);let s=o.findIndex(m=>m===n);s<0&&(s=0);const i=ye(a[s],e);let r=a.slice(s+1).map(m=>ye(m,e));const c=na(i[0]??"")!==null||i.some(m=>se(m)!==null&&/\d/.test(m));c&&(r=[i,...r]);const l=Lr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((m,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:l}}function Lo(t,a,e){return`${t}|${a}|${he(e).replace(/\s+/g," ")}`}function kr(t,a,e=[]){const o=new Set(e.map(s=>Lo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?na(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let l=null;if(a.importe>=0)l=se(s[a.importe]??""),l===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?se(s[a.debe]??""):null,v=a.haber>=0?se(s[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const m=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=Lo(c,l,m);d=o.has(u)||n.has(u),n.add(u)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:m,importeCts:l,errores:r,duplicada:d}})}function Br(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function $e(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Hr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function sa(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=kr(a.analisis,a.mapeo,e)}function Gr(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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
      </div>`;const o=e.map(n=>`<option value="${p(n._id)}"${n._id===a.cuentaId?" selected":""}>${p(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${a.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${p(a.error)}</div></div>`:""}

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

      ${a.analisis&&a.mapeo?Ur(a,a.analisis,a.mapeo):Vr()}
    </div>`}function Vr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Ur(t,a,e){const o=Br(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${p(c||`Columna ${l+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${p(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${p(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Hr.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${p(r.etiqueta)}</label>
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
        <div class="stat-value" style="font-size:1.15rem">${wt(J(o.sumaCts))}</div>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Yr(t,a,e,o){j(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return R("Nada que sincronizar: no hay movimientos importados todavía");const i=m=>{var d;return((d=a.accounts().find(u=>u._id===m))==null?void 0:d.nombre)??m},r=s.reduce((m,d)=>m+d.eliminados,0),c=s.reduce((m,d)=>m+d.semanales,0),l=s.map(m=>`${i(m.cuentaId)} (${m.semanales})`).join(", ");R(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),j(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,$e(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),j(t,"[data-imp-cerrar]",()=>{Object.assign(e,$e()),o()}),U(t,"#imp-cuenta",s=>{e.cuentaId=s.value,sa(a,e),o()}),U(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),sa(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Wr(s).then(r=>{const c=Or(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},sa(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),j(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(l=>l.errores.length===0&&(e.incluirDuplicadas||!l.duplicada));if(s.length===0)return;for(const l of s)a.ledger.registrar({fecha:l.fecha,cuentaId:e.cuentaId,importe:Math.abs(J(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=s.map(l=>l.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);R(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,$e()),a.onDatosCambiados(),o()})}function Wr(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function Kr(t,a){if(a<t)return 0;let e=0,[o,n]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(n).padStart(2,"0")}`<=a.slice(0,7);){const s=new Date(o,n,0).getDate(),i=`${o}-${String(n).padStart(2,"0")}-01`,r=`${o}-${String(n).padStart(2,"0")}-${String(s).padStart(2,"0")}`,c=t>i?t:i,l=a<r?a:r,m=(k(l).getTime()-k(c).getTime())/864e5+1;e+=m/s,++n>12&&(n=1,o++)}return e}function Jr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Qr(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function ia(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Oo(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const l=(c.tags??[]).filter(m=>s.tags.includes(m)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(s)}return o}function ko(t,a,e,o={}){const s=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&re(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:G(Ze(c,a,e)),origen:"estimacion",periodicidad:ba(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&re(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=je(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);s.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:G(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=ze(r,{start:a,end:e});for(const l of r){const m=c.filter(d=>d.sourceId===l._id);m.length!==0&&s.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:G(m.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return s}function Xr(t,a,e,o={}){const{desde:n,hasta:s}=Jr(e);return{...Bo(t,a,n,s,o),mes:e}}function Bo(t,a,e,o,n={}){const s=t.transacciones({desde:e,hasta:o}),i=new Set(n.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(ia(D.concepto)),c=s.filter(D=>r(D)&&D.importeCts<0),l=s.filter(D=>r(D)&&D.importeCts>0),m=s.filter(D=>D.tipo!=="transferencia"&&i.has(ia(D.concepto))),d=new Map((n.analisis??[]).map(D=>[D.estimacionId,D])),u=ko(a,e,o,n),v=D=>new Set(D.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),g=u.filter(D=>D.tipo==="gasto"),b=u.filter(D=>D.tipo==="ingreso"),y=Oo(c,g,D=>v(g).has(D)),f=Oo(l,b,D=>v(b).has(D)),h=new Set,A=new Set,S=(D,z,N)=>{for(const B of z)N.add(B._id);const O=G(z.reduce((B,L)=>B+Math.abs(L.importeCts)/100,0)),q=D.origen==="estimacion"?d.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,periodicidad:D.periodicidad,tags:D.tags,estimado:D.estimado,real:O,desviacion:G(O-D.estimado),sinMovimiento:z.length===0,sugerencia:q?oa(q,D.cuantia??0,{hoy:n.hoy}):null}},x=g.map(D=>S(D,y.get(D._id)??[],h)),$=b.map(D=>S(D,f.get(D._id)??[],A)),M=(D,z)=>{const N=new Map;for(const O of D){if(z.has(O._id))continue;const q=ia(O.concepto),B=N.get(q)??{concepto:O.concepto,clave:q,total:0,movimientos:0,ids:[]};B.total=G(B.total+Math.abs(O.importeCts)/100),B.movimientos+=1,B.ids.push(O._id),N.set(q,B)}return[...N.values()].sort((O,q)=>q.total-O.total)},E=M(c,h),w=M(l,A),P=M(m,new Set),_=G(x.reduce((D,z)=>D+z.estimado,0)),C=G(c.reduce((D,z)=>D+Math.abs(z.importeCts)/100,0)),I=G($.reduce((D,z)=>D+z.estimado,0)),T=G(l.reduce((D,z)=>D+z.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:_,real:C,desviacion:G(C-_),ingresosEstimados:I,ingresosReales:T,desviacionIngresos:G(T-I),netoEstimado:G(I-_),netoReal:G(T-C),desviacionNeta:G(T-C-(I-_)),filas:[...x,...$].sort((D,z)=>Math.abs(z.desviacion)-Math.abs(D.desviacion)),sinEstimacion:E,totalSinEstimacion:G(E.reduce((D,z)=>D+z.total,0)),ingresosSinPrever:w,totalIngresosSinPrever:G(w.reduce((D,z)=>D+z.total,0)),porTag:Zr(g,c),meses:Kr(e,o),omitidos:P,totalOmitido:G(P.reduce((D,z)=>D+z.total,0)),vacio:s.length===0}}function Zr(t,a){const e=new Map,o=(n,s,i)=>{for(const r of n.length>0?n:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[s]+=i,e.set(r,c)}};for(const n of t)o(n.tags,"estimado",n.estimado);for(const n of a)o(n.tags,"real",Math.abs(n.importeCts)/100);return[...e.entries()].map(([n,s])=>({tag:n,estimado:G(s.estimado),real:G(s.real),desviacion:G(s.real-s.estimado)})).filter(n=>n.estimado>0||n.real>0).sort((n,s)=>s.real-n.real||s.estimado-n.estimado)}function Ho(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const xe=26,ra=7,ca=(xe+ra)*2,Go=2*Math.PI*xe,Vo=12;function tc(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function ec(t){const{color:a,fraccion:e,etiqueta:o}=tc(t),n=ca/2,s=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${ca} ${ca}" style="width:78px;height:78px" role="img" aria-label="${p(s)}">
        <title>${p(s)}</title>
        <circle cx="${n}" cy="${n}" r="${xe}" fill="none" stroke="var(--bg3)" stroke-width="${ra}"/>
        <circle cx="${n}" cy="${n}" r="${xe}" fill="none" stroke="${a}" stroke-width="${ra}"
                stroke-linecap="round" stroke-dasharray="${(Go*e).toFixed(2)} ${Go.toFixed(2)}"
                transform="rotate(-90 ${n} ${n})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=n+(o.length>1?r*10-1:4);return`<text x="${n}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${p(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${p(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${p(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${p(F(t.estimado))}</div>
    </div>`}function ac(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,Vo),e=t.slice(Vo),o=e.reduce((n,s)=>n+s.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(ec).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${p(F(o))}</span>`:""}
    </div>`}function oc(){return{mes:"",modo:"mes"}}function Uo(t,a){if(a.mes)return a.mes;const e=Ho(t.ledger),o=Qr((t.hoy??K)());return e.includes(o)?o:e[0]??o}function Ie(t,a){var i;const e=(t.hoy??K)(),o=t.estimaciones(),n={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return Bo(t.ledger,o,r,c,{...n,analisis:l})}const s=t.precision.analizarTodas(o,{hoy:e});return Xr(t.ledger,o,Uo(t,a),{...n,analisis:s})}function Yo(t){var n;const a=(t.hoy??K)(),e=ko(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(n=t.resolverTramosIRPF)==null?void 0:n.call(t)}),o=s=>e.filter(i=>i.tipo===s).map(i=>`<option value="${p(i._id)}">${p(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function ft(t,a){return a<=0?"—":`${p(F(t/a))}/mes`}function Wo(t,a,e,o){const n=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${p(o)}" style="${n}">${p(e)}</button>`}function nc(t,a){const e=a.modo==="periodo",o=Uo(t,a),n=Ho(t.ledger);n.includes(o)||n.unshift(o);const s=Ie(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${p(s.desde)} al ${p(s.hasta)}`:p(fe(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Wo("mes",!e,"Mes","Cierra un mes natural completo")}
      ${Wo("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${p(s.desde)} → ${p(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(d=>`<option value="${p(d)}"${d===o?" selected":""}>${p(fe(d))}</option>`).join("")}
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

      ${sc(s)}
      ${ic(s,Yo(t))}
      ${cc(s,Yo(t))}
      ${rc(s)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${ac(s.porTag)}
    </div>`}function sc(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                  ${p(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                  <div style="font-size:10px;color:var(--text3)">${p(o.periodicidad)}</div>
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(F(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
                  ${o.desviacion>0?"+":""}${p(F(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${p(o.estimacionId)}"
                           title="Pasar el importe de cada pago (${p(o.periodicidad)}) de ${p(F(i.cuantiaActual))} a ${p(F(i.cuantiaSugerida))} · ${p(i.motivo)}"
                           style="font-size:11px;padding:2px 9px">→ ${p(F(i.cuantiaSugerida))}/pago</button>`:""}
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
           </div>`:""}`}function Ko(t,a,e,o){return`<tr>
    <td style="font-size:12px">${p(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${p(F(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${ft(t.total,a)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${p(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${e}
      </select>
      <button class="btn-secondary btn-sm" data-cie-omitir="${p(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const Jo=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function ic(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${Jo}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>Ko(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function rc(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${p(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${p(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${p(a.concepto)} · ${p(F(a.total))} ✕</button>`).join("")}
    </div>`}function cc(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${Jo}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>Ko(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function lc(t,a,e,o){U(t,"#cie-mes",n=>{e.mes=n.value,o()}),j(t,"[data-cie-modo]",n=>{e.modo=n.getAttribute("data-cie-modo")||"mes",o()}),j(t,"[data-cie-omitir]",n=>{const s=n.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(s)||(a.setOmitidos([...i,s]),R("Concepto omitido: deja de contar en el cierre"),o())}),j(t,"[data-cie-restaurar]",n=>{const s=n.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==s)),o()}),U(t,"[data-cie-asignar]",n=>{const s=n,i=s.getAttribute("data-cie-asignar"),r=s.value;if(!r)return;const c=Ie(a,e),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(m=>m.clave===i);if(l){if(!ot(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){s.value="";return}for(const m of l.ids)a.ledger.asignarEstimacion(m,r);R(`${l.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),j(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Ie(a,e).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??K)()}),R(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),j(t,"[data-cie-ajustar-todas]",()=>{const s=Ie(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??K)()});R((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const dc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function uc(t){const a=t.hoy??K,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let n="cuentas";const s=Ar(a().slice(0,7)),i=$e(),r=oc(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),m={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:l,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Ft(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt),omitidos:()=>u().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},y=z=>{var N;return((N=t.store.get("accounts").find(O=>O._id===z))==null?void 0:N.nombre)??z},f=()=>Ft(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??bt)(Number(a().slice(0,4))),h=()=>Ft(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Ut),A=()=>h()(Number(a().slice(0,4)));function S(){const z=u(),N=t.store.get("accounts"),O=Ra({loans:[],expenses:t.store.get("expenses").filter(H=>H.tipo==="transferencia"),accounts:N,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:h()}),q=new Map,B=H=>{let V=q.get(H);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},q.set(H,V)),V},L=(H,V)=>{const Z=`${V.sourceId}`,et=H.find(ma=>ma.concepto===Z),nt=et??{concepto:Z,contraparte:"",total:0,ocurrencias:0};nt.total+=Math.abs(V.cuantia),nt.ocurrencias+=1,et||H.push(nt)};for(const H of O){if(!H.cuenta)continue;const V=B(H.cuenta);H.sourceType==="transfer-in"||H.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(H.cuantia),L(V.entradas,H)):H.sourceType==="transfer-out"||H.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(H.cuantia),L(V.salidas,H)):H.sourceType==="investment-tax"&&(V.retencion+=Math.abs(H.cuantia))}const Y=t.store.get("expenses");for(const H of q.values())for(const[V,Z]of[[H.entradas,"cuenta"],[H.salidas,"cuentaDestino"]])for(const et of V){const nt=Y.find(ma=>ma._id===et.concepto);et.contraparte=y((nt==null?void 0:nt[Z])??"default"),et.concepto=(nt==null?void 0:nt.concepto)||(Z==="cuenta"?"Aportación":"Reembolso")}return q}function x(z){const N=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let O;if(n==="cuentas"){const L=t.store.get("accounts").filter(V=>rt(V)!=="pension"),Y=S(),H={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:A(),flujos:V=>Y.get(V)??Xi,invModo:V=>o.get(V)??"proyeccion"};O=`${Zi(L,H.tramosGanancias)}<div class="grid-3">${L.map(V=>nr(V,H)).join("")}</div>`}else n==="movimientos"?O='<div id="acc-tx"></div>':n==="importar"?O='<div id="acc-import"></div>':O='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${N}
      </div>
      ${mr(n)}
      ${O}`;const q=()=>x(z);if(n==="movimientos"){const B=z.querySelector("#acc-tx");B.innerHTML=_r(m,s),Fr(B,m,s,q)}else if(n==="importar"){const B=z.querySelector("#acc-import");B.innerHTML=Gr(d,i),Yr(B,d,i,q)}else if(n==="cierre"){const B=z.querySelector("#acc-cierre"),L=z.querySelector("#acc-precision");B.innerHTML=nc(g,r),L.innerHTML=zr(b),lc(B,g,r,q),jr(L,b,q)}}const $=()=>document.getElementById("modal-overlay"),M=()=>document.getElementById("modal-content"),E=()=>{var z;return(z=$())==null?void 0:z.classList.add("hidden")};function w(z,N){const O=$(),q=M();return!O||!q?null:(q.innerHTML=z?`<div class="modal-title">${p(z)}</div>${N}`:N,O.classList.remove("hidden"),j(q,"[data-cancelar]",E),q)}function P(z,N){const O=z?t.store.get("accounts").find(Y=>Y._id===z)??null:null,q=[...(O==null?void 0:O.planAportaciones)??[]].map(Y=>({...Y})),B=O?_(O):null,L=w(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",rr(O,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:B??0}));L&&(cr(L,q,a()),j(L,"[data-guardar-acc]",Y=>{const H=Y.getAttribute("data-guardar-acc")||"",{datos:V,punto:Z,error:et}=lr(L,q,O,B,a());if(et)return R(et,"err");let nt=H;H?t.store.updateItem("accounts",H,V):nt=t.store.addItem("accounts",V)._id,Z&&t.ledger.registrarPuntoControl(nt,Z.fecha,Z.saldo,Z.nota),R(H?"Actualizada":"Cuenta / fondo creado"),e(),E(),N()}))}function _(z){const N=t.ledger.puntosControl(z._id);return N.length>0?Qe(N)[0].saldo:z.saldo??null}function C(z,N){const O=t.store.get("accounts").find(L=>L._id===z);if(!O)return;const q=w("Histórico de saldos",dr(O.nombre,z,Qe(t.ledger.puntosControl(z)),O.saldoInicial||0,a()));if(!q)return;const B=()=>{N(),C(z,N)};j(q,"[data-hist-anadir]",()=>{var V,Z,et;const L=((V=q.querySelector("#hi-fecha"))==null?void 0:V.value)??"",Y=parseFloat(((Z=q.querySelector("#hi-saldo"))==null?void 0:Z.value)??""),H=((et=q.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!L||!Number.isFinite(Y))return R("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,L,Y,H||void 0),R("Punto añadido"),e(),B()}),j(q,"[data-hist-borrar]",L=>{const[,Y]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),R("Eliminado"),e(),B()}),j(q,"[data-hist-semanal]",L=>{const Y=L.getAttribute("data-hist-semanal"),H=t.ledger.generarPuntosSemanales(Y);R(H>0?`Histórico con ${H} punto${H!==1?"s":""} semanal${H!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),B()}),j(q,"[data-hist-inicial]",L=>{const[Y,H]=(L.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(Y).find(et=>et._id===H);if(!V)return;const Z=Qe([V])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:Z,fechaInicialSaldo:V.fecha}),R(`Punto inicial → ${V.fecha} (${F(Z)})`),e(),B()})}function I(z){const N=t.store.get("accounts").filter(B=>B.activo);if(N.length===0)return R("No hay cuentas activas","err");const O=a(),q=N.map(B=>`• ${B.nombre}: ${F(_(B)??B.saldoInicial??0)}`).join(`
`);if(ot(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${O})?

${q}

Esto recalibra el punto de arranque del dashboard.`)){for(const B of N)t.store.updateItem("accounts",B._id,{saldoInicial:_(B)??B.saldoInicial??0,fechaInicialSaldo:O});R("Saldo base actualizado"),e(),z()}}function T(z,N,O){j(z,"[data-cuentas-tab]",q=>{n=q.getAttribute("data-cuentas-tab")||"cuentas",N()}),j(z,"[data-nueva-acc]",()=>P(null,N)),j(z,"[data-editar-acc]",q=>P(q.getAttribute("data-editar-acc"),N)),j(z,"[data-tramos-ganancias]",()=>O.abrir()),j(z,"[data-reset-base]",()=>I(N)),j(z,"[data-hist-acc]",q=>C(q.getAttribute("data-hist-acc"),N)),j(z,"[data-principal-acc]",q=>{const B=q.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===B}))),R("Cuenta marcada como principal"),e(),N()}),j(z,"[data-borrar-acc]",q=>{const B=q.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return R("Debe existir al menos una cuenta","err");if(!ot("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",B);const Y=t.store.get("accounts");Y.length>0&&!Y.some(H=>H.esCuentaPrincipal)&&t.store.set("accounts",Y.map((H,V)=>V===0?{...H,esCuentaPrincipal:!0}:H)),R("Cuenta eliminada"),e(),N()}),j(z,"[data-inv-modo]",q=>{const[B,L]=(q.getAttribute("data-inv-modo")||"").split("|");o.set(B,L==="real"?"real":"proyeccion"),N()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:dc,mount(z){const N=()=>x(z);D??(D=ur({store:t.store,onDatosCambiados:()=>{e(),N()},año:()=>Number(a().slice(0,4))})),x(z),z.dataset.wired!=="1"&&(T(z,N,D),z.dataset.wired="1")}}}function Qo(t,a,e=!1){const o=Math.abs(it(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function pc(t){function a(w){return`${w}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(w={}){var _;const P=(_=w.texto)==null?void 0:_.trim().toLowerCase();return t.get("transacciones").filter(C=>!(w.cuentaId&&C.cuentaId!==w.cuentaId||w.desde&&C.fecha<w.desde||w.hasta&&C.fecha>w.hasta||w.tipo&&C.tipo!==w.tipo||w.estimacionId&&C.estimacionId!==w.estimacionId||w.tags&&w.tags.length>0&&!w.tags.some(I=>C.tags.includes(I))||P&&!C.concepto.toLowerCase().includes(P))).sort((C,I)=>C.fecha.localeCompare(I.fecha)||C._id.localeCompare(I._id))}function o(w){const P={_id:a("tx"),fecha:w.fecha,cuentaId:w.cuentaId,importeCts:Qo(w.tipo,w.importe,w.negativo),concepto:w.concepto,tags:w.tags??[],estimacionId:w.estimacionId??null,tipo:w.tipo,origen:w.origen??"manual",...w.nota?{nota:w.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),P]),P}function n(w,P){t.set("transacciones",t.get("transacciones").map(_=>{if(_._id!==w)return _;const{importe:C,...I}=P,T={..._,...I};return C!==void 0&&(T.importeCts=Qo(T.tipo,C,T.importeCts<0)),T}))}function s(w){t.set("transacciones",t.get("transacciones").filter(P=>P._id!==w))}function i(w,P){n(w,{estimacionId:P})}function r(w){return t.get("puntosControl").filter(P=>!w||P.cuentaId===w).sort((P,_)=>P.fecha.localeCompare(_.fecha))}function c(w){return r(w).filter(P=>P.origen!=="derivado")}function l(w,P,_,C){const I={_id:a("pc"),fecha:P,cuentaId:w,saldoCts:it(_),...C?{nota:C}:{}},T=t.get("puntosControl").filter(D=>!(D.cuentaId===w&&D.fecha===P));return t.set("puntosControl",[...T,I].sort((D,z)=>D.fecha.localeCompare(z.fecha))),u(w),I}function m(w){const P=t.get("puntosControl").find(_=>_._id===w);t.set("puntosControl",t.get("puntosControl").filter(_=>_._id!==w)),P&&(P.origen==="derivado"?y(P.cuentaId):u(P.cuentaId))}function d(w,P,_){const C=T=>T.cuentaId===w&&T.origen!=="derivado"&&T.fecha>=P&&T.fecha<=_,I=t.get("puntosControl").filter(C).length;return I===0?0:(t.set("puntosControl",t.get("puntosControl").filter(T=>!C(T))),y(w),I)}function u(w){var q,B;const P=c(w),_=t.get("transacciones").filter(L=>L.cuentaId===w).sort((L,Y)=>L.fecha.localeCompare(Y.fecha)),C=(q=_[0])==null?void 0:q.fecha,I=(B=_[_.length-1])==null?void 0:B.fecha,T=t.get("puntosControl").filter(L=>!(L.cuentaId===w&&L.origen==="derivado"));if(!C)return t.set("puntosControl",T),y(w),0;const D=[];for(let L=Gt(C);L<=I;L=Gt(va(L,1)))D.push(L);D[D.length-1]!==I&&D.push(I);const z=new Set(P.map(L=>Gt(L.fecha))),N=L=>{const Y=P.filter(H=>H.fecha<=L).pop();return _.filter(H=>H.fecha<=L&&(!Y||H.fecha>Y.fecha)).reduce((H,V)=>H+V.importeCts,(Y==null?void 0:Y.saldoCts)??0)},O=D.filter(L=>!z.has(Gt(L))).map(L=>({_id:a("pcd"),fecha:L,cuentaId:w,saldoCts:N(L),origen:"derivado"}));return t.set("puntosControl",[...T,...O].sort((L,Y)=>L.fecha.localeCompare(Y.fecha))),v(w,C,N(C)),y(w),O.length}function v(w,P,_){const C=t.get("accounts"),I=C.find(T=>T._id===w);!I||I.fechaInicialSaldo&&I.fechaInicialSaldo<=P||t.set("accounts",C.map(T=>T._id===w?{...T,saldoInicial:J(_),fechaInicialSaldo:P}:T))}function g(w){return(w??[...new Set(t.get("transacciones").map(_=>_.cuentaId))]).reduce((_,C)=>_+u(C),0)}function b(w){const P=t.get("transacciones").filter(I=>I.origen==="importado"&&(!w||I.cuentaId===w)),_=new Map;for(const I of P){const T=_.get(I.cuentaId);T?T.push(I.fecha):_.set(I.cuentaId,[I.fecha])}const C=[];for(const[I,T]of _){T.sort();const D=d(I,T[0],T[T.length-1]);C.push({cuentaId:I,eliminados:D,semanales:u(I)})}return C}function y(w){const P=r(w),_=t.get("accounts");_.some(C=>C._id===w)&&t.set("accounts",_.map(C=>C._id===w?{...C,historicoSaldos:P.map(I=>({_id:I._id,fecha:I.fecha,saldo:J(I.saldoCts),...I.nota?{nota:I.nota}:{}}))}:C))}function f(w,P=K()){const _=c(w).filter(D=>D.fecha<=P).pop(),C=_==null?void 0:_.fecha,I=(_==null?void 0:_.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===w&&D.fecha<=P&&(C===void 0||D.fecha>C)).reduce((D,z)=>D+z.importeCts,I)}function h(w,P){return J(f(w,P))}function A(w=K(),P){const _=P??t.get("accounts").filter(C=>C.activo).map(C=>C._id);return J(_.reduce((C,I)=>C+f(I,w),0))}function S(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function x(){const w=[...t.get("transacciones").map(P=>P.fecha),...t.get("puntosControl").map(P=>P.fecha)];return w.length>0?w.sort().pop()??null:null}function $(w={}){return J(e(w).reduce((P,_)=>P+_.importeCts,0))}function M(w={}){const P=new Map;for(const _ of e(w)){const C=_.fecha.slice(0,7);P.set(C,(P.get(C)??0)+_.importeCts)}return new Map([...P.entries()].sort(([_],[C])=>_.localeCompare(C)).map(([_,C])=>[_,J(C)]))}function E(w={}){const P=new Map;for(const _ of e(w))for(const C of _.tags.length>0?_.tags:["sin_tag"])P.set(C,(P.get(C)??0)+_.importeCts);return new Map([...P.entries()].map(([_,C])=>[_,J(C)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:m,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:A,tieneDatos:S,ultimaFecha:x,total:$,totalPorMes:M,totalPorTag:E}}function pt(t){return t.trim().toLowerCase()}function mc(t){function a(){const l=new Map,m=(d,u)=>{const v=pt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])m(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])m(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(m=>l==="estimaciones"?m.reales===0:m.estimaciones===0).map(m=>m.tag)}function n(l,m,d){const u=pt(m),v=(l??[]).map(pt);if(!v.includes(u))return l??[];const g=v.filter(b=>b!==u);return d===null?[...new Set(g)]:[...new Set([...g,pt(d)])]}function s(l,m){const d=pt(m);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,m){let d=0;for(const u of l)pt(u)!==pt(m)&&(d+=c(u,pt(m)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,m){let d=0;const u=t.get("expenses").map(M=>{const E=n(M.tags,l,m);return E!==M.tags&&(d+=1),E===M.tags?M:{...M,tags:E}});t.set("expenses",u);const v=t.get("transacciones").map(M=>{const E=n(M.tags,l,m);return E!==M.tags&&(d+=1),E===M.tags?M:{...M,tags:E}});t.set("transacciones",v);const g=t.get("loans").map(M=>{const E=n(M.tags,l,m);return E!==M.tags&&(d+=1),E===M.tags?M:{...M,tags:E}});t.set("loans",g);const b=t.get("nominas").map(M=>{const E=n(M.tags,l,m);return E!==M.tags&&(d+=1),E===M.tags?M:{...M,tags:E}});t.set("nominas",b);const y=t.get("config"),f=pt(l),h=M=>{const E=(M??[]).map(pt);if(!E.includes(f))return M??[];const w=E.filter(P=>P!==f);return m===null?[...new Set(w)]:[...new Set([...w,m])]},A={},S=h(y.activeTagsFilter),x=h(y.tagCategorias),$=h(y.tagGrupos);return S!==y.activeTagsFilter&&(A.activeTagsFilter=S),x!==y.tagCategorias&&(A.tagCategorias=x),$!==y.tagGrupos&&(A.tagGrupos=$),Object.keys(A).length>0&&t.patchConfig(A),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const fc=3;function Xo(t){return t<.005?0:t}function gc(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function vc(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<fc)continue;const r=gc(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Xo(n),sigmaDeriva:Xo(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Zo(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:G(e*Math.hypot(n,s))}function bc(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),m=Math.max(0,(c-s)*12+(l-i)),d=Zo(a.sigmaMensual,m,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:G(r.saldoAcum+d),abajo:G(r.saldoAcum-d)}})}function hc(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const la="financeapp_session",yc=["local","dropbox","firebase"];function $c(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!yc.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function xc({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const g=n();if(g)try{v?g.setItem(la,JSON.stringify(v)):g.removeItem(la)}catch{}}function i(){const v=n();if(!v)return null;try{return $c(v.getItem(la))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(s(null),null):v:null}function m(v){const g=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return s(b),b}function d(){const v=i();v&&s({...v,ultimoUso:e()})}function u(){s(null)}return{abrir:m,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const tn=["pointerdown","keydown","visibilitychange"];function Ic({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const m of tn)s==null||s.addEventListener(m,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,n(c);for(const m of tn)s==null||s.removeEventListener(m,r)}}return l}const wc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Cc="FinanceApp",Sc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function en(t){return new Uint8Array(new ArrayBuffer(t))}const da="financeapp_bio_credencial",ua="financeapp_bio_secreto",pa="financeapp_bio_ultimo_desbloqueo",an="financeapp_bio_gracia_min",Ac=5;function Mc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function we(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function Ce(t){const a=atob(t),e=en(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function Ec(t){return we(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Pc(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Ce(a)}function on(t){return t.getClientExtensionResults()}function _c(t={}){const a=t.webauthn??Mc(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(x=>crypto.getRandomValues(en(x)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const x=o==null?void 0:o.getItem(da);if(!x)return null;try{const $=JSON.parse(x);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function l(){return c()!==null}async function m(x){const $=await e.importKey("raw",x,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Sc},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(x,$){const M=s(12),E=await e.encrypt({name:"AES-GCM",iv:M},x,new TextEncoder().encode($));return`${we(M)}:${we(E)}`}async function u(x,$){const[M,E]=$.split(":"),w=Ce(M),P=Ce(E),_=await e.decrypt({name:"AES-GCM",iv:w},x,P);return new TextDecoder().decode(_)}async function v(x,$){var N,O;if(!x)throw new Error("No hay clave de cifrado que envolver.");const M=s(32),E=s(32),w=s(16),P=await a.create({publicKey:{challenge:E,rp:{name:Cc},user:{id:w,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:M}}},timeout:6e4}});if(!P)throw new Error("No se ha podido crear la credencial biométrica.");const _=on(P);if(!((N=_.prf)!=null&&N.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let C=((O=_.prf.results)==null?void 0:O.first)??null;if(C||(C=await g(P.rawId,M)),!C)throw new Error("El sensor no ha devuelto material de cifrado.");const I=await m(C),T=await d(I,x),D={credencialId:Ec(P.rawId),salt:we(M),modo:$,creadaEn:n()},z=i();z.setItem(da,JSON.stringify(D)),z.setItem(ua,T)}async function g(x,$){var E,w;const M=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:x,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return M?((w=(E=on(M).prf)==null?void 0:E.results)==null?void 0:w.first)??null:null}async function b(){const x=c();if(!x)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(ua);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const M=await g(Pc(x.credencialId).buffer,Ce(x.salt));if(!M)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const E=await m(M),w=await u(E,$);return f(),w}function y(){o==null||o.removeItem(da),o==null||o.removeItem(ua),o==null||o.removeItem(pa)}function f(){o==null||o.setItem(pa,String(n()))}function h(){const x=o==null?void 0:o.getItem(an);if(x==null)return Ac;const $=Number(x);return Number.isFinite($)&&$>0?$:0}function A(x){o==null||o.setItem(an,String(Math.max(0,Math.floor(x)||0)))}function S(){if(!l())return!1;const x=h();if(x<=0)return!1;const $=o==null?void 0:o.getItem(pa),M=$?Number($):NaN;return Number.isFinite(M)?n()-M<x*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:y,marcarDesbloqueo:f,dentroDeGracia:S,graciaMinutos:h,configurarGracia:A}}function nn(){if(typeof localStorage<"u"){const $=ms();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=Cs(),a=t.activo(),e=Xt(a),o=oo(localStorage,e),n=hs({adapter:o}),s=ys(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Kt})`),n.subscribe($=>s.marcar($));function r(){var M,E,w,P,_;const $=globalThis;(E=(M=$.FirebaseService)==null?void 0:M.isConnected)!=null&&E.call(M)&&((_=(P=(w=$.FirebaseService).uploadRegistroProyectos)==null?void 0:P.call(w))==null||_.catch(C=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",C instanceof Error?C.message:C)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===a)??t.listar()[0],colecciones:St.filter($=>$!=="config"),crear:$=>{const M=t.crear($);return r(),M},renombrar:($,M)=>{t.renombrar($,M),r()},duplicar:($,M)=>{const E=t.duplicar($,M);return r(),E},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,M)=>{const E=Ss(localStorage,$,M),w=As(E),P=[];for(const _ of M){const C=w[_];if(!Array.isArray(C)||C.length===0)continue;const I=n.get(_);n.set(_,[...I,...C]),P.push(_)}return P.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:P}}},l=Es(n),m=_c(),d=xc({autoLogoutMinutos:()=>{var M,E;const $=(E=(M=globalThis.State)==null?void 0:M.get)==null?void 0:E.call(M,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>m.dentroDeGracia()}),u=pc(n),v=mc(n),g=hr(u),b=Dr(n),y=ti({isEnabled:$=>l.isEnabled($)}),f=Us({flags:l,rutasExtra:()=>y.flagPorRuta()}),h=Ds({flags:l,onChange:()=>{var $,M;y.attachToShell(),f.apply(),(M=($=globalThis.Router)==null?void 0:$.rerender)==null||M.call($)}}),A=Os({proyectos:c}),S=()=>{var M,E,w,P,_,C;const $=globalThis;if((E=(M=$.State)==null?void 0:M.load)==null||E.call(M),((P=(w=$.Router)==null?void 0:w.current)==null?void 0:P.call(w))==="dashboard")try{(C=(_=$.DashboardModule)==null?void 0:_.render)==null||C.call(_)}catch(I){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",I)}},x=Vs({store:n,onDatosCambiados:S});return y.register(mi({store:n,onDatosCambiados:S})),y.register(wi({store:n,onDatosCambiados:S})),y.register(Ki({store:n,onDatosCambiados:S})),y.register(uc({store:n,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:S})),y.register(ni({store:n,onDatosCambiados:S})),{version:Kt,core:gn,engine:{generarExtracto:Ra,recomputarSaldoAcum:hn,saldoHoy:yn,sumarPorTags:Na,providers:{proyectarGastos:Yt,proyectarPrestamos:ze,proyectarTransferencias:Pa,proyectarNominas:je,proyectarInteresesCuentas:Fa,proyectarAportaciones:_a,proyectarRetencionesFiscales:Da,proyectarInflacionGastos:Ta,proyectarPerdidaAhorro:za},analysis:wn,margins:_n,avisos:zn,dashboard:Wn},store:n,flags:l,featureRegistry:{all:It,porGrupo:lo},ui:{openFeatures:h.open,openProyectos:A.open,openPersonas:x.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Ws({store:n,rerender:()=>{var M,E,w,P;const $=globalThis;(E=(M=$.State)==null?void 0:M.load)==null||E.call(M),(P=(w=$.Router)==null?void 0:w.rerender)==null||P.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Xs({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>y.routes(),navegar:$=>{var M,E;return(E=(M=globalThis.Router)==null?void 0:M.navigate)==null?void 0:E.call(M,$)}})},app:y,session:Object.assign(d,{vigilar:$=>Ic({sesion:d,onCaducada:$}),opciones:wc}),biometria:m,cambios:s,datos:{colecciones:St,snapshot:()=>no(o),aplicar:($,{sellar:M=!0}={})=>{const w=$s(M?(P,_)=>o.set(P,_):(P,_)=>{const C=globalThis.StorageAdapter;C!=null&&C.setRestaurando?C.setRestaurando(P,_):o.set(P,_)},$);return n.load(),s.marcar("copia-restaurada"),w},faltantes:$=>xs($),esVacioOPorDefecto:()=>Is(no(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:oa,medirVariabilidad:vc,bandaDeConfianza:bc,bandaAcumulada:Zo,describirBanda:hc}}}function Fc(){try{const t=nn();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const st=typeof window<"u"?Fc():null;if(st){let t=!1;const a=()=>{var e,o;if(st.app.attachToShell(),st.ui.applyGating(),!t){t=!0,st.ui.watchGating(),st.ui.instalarDeshacer(),st.ui.instalarBuscador();const n=globalThis,s=()=>{var c,l,m,d;return(l=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&l.call(c)?n.FirebaseService:(d=(m=n.DropboxService)==null?void 0:m.isConnected)!=null&&d.call(m)?n.DropboxService:null};st.ui.avisoGuardado=Zs({cambios:st.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=st.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>st.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>st.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>st.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return Se.bootstrap=nn,Object.defineProperty(Se,Symbol.toStringTag,{value:"Module"}),Se}({});
//# sourceMappingURL=financeapp-core.js.map
