var FinanceAppBundle=function(Me){"use strict";function W(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function O(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function K(){return W(new Date)}function Ee(t,a){return new Date(t,a+1,0).getDate()}function ha(t,a,e){return W(new Date(t,a,Math.min(e,Ee(t,a))))}function le(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return W(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return ha(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),W(i)}return null}function ya(t,a){if(!a)return t;const e=O(t);return le(e.getFullYear(),e.getMonth(),a)??t}const mn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],fn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function _e(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${fn[e]||e+"º"} ${mn[o]} del mes`}return t}function Yt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Wt(t){const a=O(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),W(a)}function $a(t,a){const e=O(t);return e.setDate(e.getDate()+a),W(e)}function Ft(t,a,e){const o=Math.max(1,e),n=t.getFullYear(),s=t.getMonth(),i=(a.getFullYear()-n)*12+(a.getMonth()-s);if(i<=0)return{year:n,month:s};const r=s+Math.floor(i/o)*o;return{year:n+Math.floor(r/12),month:r%12}}function de(t,a,e,o){return!(t&&t>o||a&&a<e)}function xa(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function G(t){return J(it(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function wa(t){return(t||0).toFixed(2)+"%"}function Ct(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function Ia(t,a,e,o=0){const n=Ct(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const d=n*(1-Math.pow(1+i,-e))/i-s,p=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),l=i-d/p;if(Math.abs(l-i)<1e-10){i=l;break}i=l}return(Math.pow(1+i,12)-1)*100}function Ca(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const d=O(o),p=a/100/12;let l=e,u=Ct(c,a,l);const v=[...s].sort((b,$)=>b.fecha.localeCompare($.fecha));let f=0;for(let b=1;b<=e*2&&c>.01;b++){const $=new Date(d);d.setMonth(d.getMonth()+1);const g=ya(W($),i.diaPago||"");for(;f<v.length&&v[f].fecha<=g;){const C=v[f],w=C.cantidad*(n/100);if(c-=C.cantidad,c=Math.max(0,c),C.tipo==="plazo"?l=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(l=e-b+1,u=Ct(c,a,l)),r.push({mes:"AMORT",fecha:C.fecha,cuota:0,interes:0,amortizacion:C.cantidad,comisionAmort:w,capitalPendiente:c,esAmortizacion:!0,simulacion:C.simulacion||!1}),f++,c<.01)break}if(c<.01)break;const h=c*p,S=Math.min(u-h,c);if(c-=S,c<.01&&(c=0),r.push({mes:b,fecha:g,cuota:u,interes:h,amortizacion:S,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),l--,l<=0||c<.01)break}return r}const Sa=new Map;function X(t){var $;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((g,h)=>`${g.fecha}|${g.cantidad}|${g.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).join(";")}`,o=Sa.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:d}=t,p=Ca(n,s,i,r,c||0,a,t),l=p.reduce((g,h)=>g+h.interes,0),u=p.reduce((g,h)=>g+h.comisionAmort,0),v=n*((d||0)/100),f=p.filter(g=>!g.esAmortizacion),b={cuota:Ct(n,s,i),totalIntereses:l,tae:Ia(n,s,i,d||0),costoTotal:l+u+v,comAp:v,totalComAm:u,fechaFin:(($=f.slice(-1)[0])==null?void 0:$.fecha)||"",mesesReales:f.length,tabla:p};return Sa.set(e,b),b}function Aa(t){const a=X(t),e=X({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function vt(t,a,e){if(!t||t.length===0)return 1;const o=O(a),n=O(e);if(n<=o)return 1;const s=[...t].sort((c,d)=>c.year-d.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),d=s.filter(b=>b.year<=c),p=d.length>0?d[d.length-1]:s[0],l=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,f=Yt(r,v);i*=Math.pow(1+l,f/365.25),r=v}return i}function Ma(t,a,e,o=0){const n=O(a),s=O(e);if(s<=n)return o;const i=Yt(n,s),r=t?[...t].sort((p,l)=>p.year-l.year):[];let c=0,d=new Date(n);for(;d<s;){const p=d.getFullYear(),l=new Date(p+1,0,1),u=l<s?l:s,v=Yt(d,u),f=r.filter(g=>g.year<=p),b=f.length>0?f[f.length-1]:null,$=b!==null?b.tasa:o;c+=$*v,d=u}return i>0?c/i:o}function Ea(t,a){return((1+t/100)/(1+a/100)-1)*100}function gn(t,a,e,o){const n=vt(a,e,o);return n>0?t/n:t}function vn(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:d=0,cuotasHipoteca:p=0,gastosBasicos:l=0,gastosOtros:u=0,amortizaciones:v=0}=t,f=c-d-v-l-u,b=f,$=c>0?b/c*100:null,g=r?d-p:d,h=c>0?g/c*100:null,S=c>0?d/c*100:null,C=c>0?(l+d+v)/c*100:null,w=c>0?u/c*100:null,y=(M,I,E)=>M===null?"neutral":M>=I?"verde":M>=E?"amarillo":"rojo",A=(M,I,E)=>M===null?"neutral":M<=I?"verde":M<=E?"amarillo":"rojo";return{ingresos:c,cuotas:d,cuotasHipoteca:p,gastosBasicos:l,gastosOtros:u,amortizaciones:v,ahorroBruto:f,ahorroReal:b,tasaAhorro:$,dti:h,dtiTotal:S,excluyeHipoteca:r,pctNecesidades:C,pctDeseos:w,semAhorro:y($,e,o),semDTI:A(h,n,s),semNecesidades:A(C,i[0],i[0]+15),semDeseos:A(w,i[1],i[1]+10),semAhorroRegla:y($,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function bt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Kt(t,a){const e=Pe(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Pe(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=e&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a)??null}function _a(t,a){let e="";for(const o of t){const n=Pe(o,a);n&&n.fecha>e&&(e=n.fecha)}return e}function bn(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function hn(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function ue(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function yn(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function $n(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Dt(t,a,e){const o=it(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:J(o)}];const n=a.participantes.map(l=>l.personaId);if(a.modo==="partesIguales"){const l=yn(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(l[v])}))}const s=a.participantes.map(l=>{const u=Math.max(0,l.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((l,u)=>l+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const l=o/i,u=s.map(f=>Math.round(f*l)),v=u.reduce((f,b)=>f+b,0);return u.length>0&&(u[0]+=o-v),n.map((f,b)=>({personaId:f,importe:J(u[b])}))}const c=o-i,{ids:d,cts:p}=$n(n,s,c,e);return d.map((l,u)=>({personaId:l,importe:J(p[u])}))}function Fe(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function xn(t,a,e){const o=ue(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Fe(a.expenses,i.sourceId);for(const d of Dt(r,c==null?void 0:c.repartoPago,o))s(d.personaId).pago+=d.importe;for(const d of Dt(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).consumo+=d.importe}else if(i.sourceType==="loan"){const c=Fe(a.loans,i.sourceId);for(const d of Dt(r,c==null?void 0:c.repartoPago,o))s(d.personaId).pago+=d.importe;for(const d of Dt(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).consumo+=d.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Fe(a.nominas,i.sourceId);for(const d of Dt(r,c==null?void 0:c.repartoConsumo,o))s(d.personaId).ingresos+=d.importe}}}return[...n.values()]}function De(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const ht=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function dt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Pa(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function yt(t,a){return Pa(t,a).baseImponible}function Fa(t,a){return dt(t,a)/12}const Jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Te(t,a){if(!t||t<=0)return 0;const e=a||Jt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,d=Math.min(n,c-i);if(!(d<=0)&&(o+=d*(r/100),n-=d,n<=0))break}return o}function pe(t,a){if(rt(t)!=="inversion")return null;const e=bt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=Te(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function ze(t,a=new Date){var u;if(rt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=bt(t),n=W(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((v,f)=>v.fecha.localeCompare(f.fecha));let i=0;const r=s.reduce((v,f)=>v+f.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),d=r>0?i/r:0,p=Math.min(o,i+c*d),l=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:l,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function Da(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=bt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((d,p)=>d+p.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function je(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(d=>(d.grupoNomina||"")===o&&d.activo!==!1).reduce((d,p)=>d+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((d,p)=>d[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[d,p]of i)if(s>=d)r=p;else break;return r}const wn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Jt,TRAMOS_IRPF_DEFAULT:ht,agregarPorPersona:xn,ajustarFechaPago:ya,ajustarPrecioReal:gn,arranqueMensual:Ft,calcBaseImponibleTrabajo:yt,calcFactorInflacion:vt,calcFondoInversion:pe,calcFondosPension:ze,calcGananciasCapital:Te,calcIRPF:dt,calcImpuestoPension:Da,calcInflacionMediaAnual:Ma,calcSaludFinanciera:vn,calcTAE:Ia,calcTipoMarginalPension:je,calcTipoRealFisher:Ea,calcularReparto:Dt,clampedDate:ha,cuotaMensual:Ct,desgloseBaseTrabajo:Pa,diasEntre:Yt,entradaSaldo:Pe,etiquetaPeriodicidad:xa,fechaUltimoSaldoConocido:_a,finDeSemana:Wt,formatEUR:F,formatLocalDate:W,formatPct:wa,fromCents:J,haySimulaciones:hn,idPersonaPorDefecto:ue,labelDiaPago:_e,lastDayOfMonth:Ee,modeloFondoDe:rt,parseLocalDate:O,personasImplicadas:De,resolverDiaEfectivo:le,resumenPrestamo:X,resumenPrestamoConAhorro:Aa,retencionMensual:Fa,roundMoney:G,saldoEnFecha:Kt,saldoRealCuenta:bt,sinSimulaciones:bn,sumarDias:$a,tablaAmortizacion:Ca,toCents:it,todayISO:K,vigenteEnRango:de},Symbol.toStringTag,{value:"Module"}));function Qt(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=O(i.fechaInicio||a.start),c=i.fechaFin?O(i.fechaFin):s,d=i.cuantia,p=l=>o.push({fecha:l,concepto:i.concepto,cuantia:d,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const l=Math.max(1,i.frecuencia||1);let{year:u,month:v}=Ft(r,n,l);const f=Math.ceil(240/l)+2;for(let b=0;b<f;b++){const $=le(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),S=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,S)))})(),g=O($);if(g>s||g>c)break;g>=n&&g>=r&&p($),v+=l,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const l=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/l);u=new Date(r.getTime()+v*l)}for(;u<=s&&u<=c;)p(W(u)),u=new Date(u.getTime()+l)}}return o}function qe(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Ta(t,a,e=null,o={accounts:[]}){const n=[],s=O(a.start),i=O(a.end),r=o.accounts||[],c=o.nominas||[],d=o.resolverTramosIRPF||(()=>ht),p=o.resolverTramosGanancias||(()=>Jt),l=u=>{var v;return((v=r.find(f=>f._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=O(u.fechaInicio||a.start),f=u.fechaFin?O(u.fechaFin):i,b=$=>{const g=r.find(P=>P._id===(u.cuenta||"default")),h=r.find(P=>P._id===(u.cuentaDestino||"default")),S=rt(g),C=rt(h),w=S==="inversion"&&C==="inversion"||S==="pension"&&C==="pension",y=["transferencia",...w?["traspaso"]:[],...u.tags||[]],A=w?"traspaso-out":"transfer-out",M=w?"traspaso-in":"transfer-in",I=!e||e.length===0||e.includes(u.cuenta||"default"),E=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(I&&n.push({fecha:$,concepto:`Transf. → ${l(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:y,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:A}),E&&n.push({fecha:$,concepto:`Transf. ← ${l(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:y,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:M}),I&&!w&&g){if(S==="inversion"){const P=parseInt($.slice(0,4)),_=pe(g,p(P));if(_&&_.saldo>0&&_.plusvalia>0){const x=Math.min(1,u.cuantia/_.saldo),D=_.plusvalia*x*.19;D>.01&&n.push({fecha:$,concepto:`Retención IRPF reembolso ${g.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(S==="pension"){const P=d(parseInt($.slice(0,4))),_=je(g,c,P),x=Da(g,u.cuantia,_||void 0);if(x>0){const T=g.grupoNomina?`IRPF rescate ${g.nombre} (tipo marginal grupo "${g.grupoNomina}": ${_}%)`:`Retención rescate ${g.nombre} (${g.impuestoRetirada}% s/beneficio)`;n.push({fecha:$,concepto:T,cuantia:x,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=f&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const $=Math.max(1,u.frecuencia||1);let{year:g,month:h}=Ft(v,s,$);const S=Math.ceil(240/$)+2;for(let C=0;C<S;C++){const w=le(g,h,u.diaPago||"")||(()=>{const A=v.getDate(),M=new Date(g,h+1,0).getDate();return W(new Date(g,h,Math.min(A,M)))})(),y=O(w);if(y>i||y>f)break;y>=s&&y>=v&&b(w),h+=$,h>=12&&(g+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const $=Math.max(1,u.frecuencia||1)*864e5;let g=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/$);g=new Date(v.getTime()+h*$)}for(;g<=i&&g<=f;)b(W(g)),g=new Date(g.getTime()+$)}}return n}function za(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const d of c){if(!d.importe||d.importe<=0)continue;const p=O(d.fechaInicio||a.start),l=d.fechaFin?O(d.fechaFin):s,u=d.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),f=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",$=w=>{v&&o.push({fecha:w,concepto:`Aportación → ${i.nombre}`,cuantia:d.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:d._id,sourceType:"aportacion-out"}),f&&o.push({fecha:w,concepto:`Aportación ${i.nombre} (${d.periodicidad||"mensual"})`,cuantia:d.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:d._id,sourceType:"aportacion-in"})},g={mensual:1,trimestral:3,semestral:6,anual:12}[d.periodicidad||"mensual"]||1;let{year:h,month:S}=Ft(p,n,g);const C=Math.ceil(240/g)+2;for(let w=0;w<C;w++){const y=new Date(h,S+1,0).getDate(),A=W(new Date(h,S,Math.min(p.getDate(),y))),M=O(A);if(M>s||M>l)break;M>=n&&M>=p&&$(A),S+=g,S>=12&&(h+=Math.floor(S/12),S=S%12)}}}return o}function ja(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=O(a.start),r=O(a.end),c=s.periodoCobro||"mensual",d=c==="mensual",p=d?null:{diario:864e5,semanal:7*864e5}[c]||864e5,l=d?1/12:p/(365.25*864e5);let u=Kt(s,a.start);const v=o.filter($=>$.cuenta===s._id).map($=>({fecha:$.fecha,delta:$.tipo==="ingreso"?Math.abs($.cuantia):-Math.abs($.cuantia)})).sort(($,g)=>$.fecha.localeCompare(g.fecha));let f=0,b=new Date(i);for(;b<=r;){const $=d?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),g=new Date(Math.min($.getTime(),r.getTime()+1)),h=W(g);let S=0;for(;f<v.length&&v[f].fecha<h;)S+=v[f].delta,f++;const C=u,w=u+S,y=Math.max(0,(C+w)/2);u=w;const A=d?l:(g.getTime()-b.getTime())/(365.25*864e5),M=y*(Math.pow(1+s.interes/100,A)-1);M>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:M,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=$}}return n}function qa(t,a,e,o=null){const n=[],s=a||ht;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Fa(r,s),d={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Qt([d],e,o))}return n}const In=[5,11,2,8],Cn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ne(t,a,e=null,o=[],n=()=>ht){const s=[],i=O(a.start),r=O(a.end),c=o.length>0,d={};for(const u of t){const v=u.grupoNomina||"";d[v]||(d[v]=[]),d[v].push(u)}for(const u of Object.keys(d))d[u].sort((v,f)=>(f.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const f=u.fechaInicio||a.start,b=O(f),$=O(v);let g=0;for(let S=b.getFullYear();S<=$.getFullYear();S++){const C=new Date(S,u.mesActualizacionIPC-1,1);C>b&&C<=$&&g++}if(g===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+g,0,1));return(u.bruto||0)*vt(o,f,h)}function l(u,v){const f=p(u,v),b=(u.retribucionFlexible||[]).reduce((P,_)=>P+(_.importe||0)*12,0),$=Math.max(0,f-b);if(u.irpfModo==="manual")return $*((u.irpfPct||0)/100);const g=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return dt(yt(f,b),g);const S=d[h].filter(P=>P.activo),C=S.reduce((P,_)=>P+p(_,v),0),w=S.reduce((P,_)=>P+(_.retribucionFlexible||[]).reduce((x,T)=>x+(T.importe||0)*12,0),0),y=Math.max(0,C-w),A=yt(C,w),M=Math.max(0,f-b),I=y>0?A*(M/y):0,E=S.filter(P=>P._id!==u._id&&(P.bruto||0)>(u.bruto||0)).reduce((P,_)=>{const x=(_.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),T=Math.max(0,p(_,v)-x);return P+(y>0?A*(T/y):0)},0);return dt(E+I,g)-dt(E,g)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const f=Math.max(1,u.nPagas||12),b=O(u.fechaInicio||a.start),$=u.fechaFin?O(u.fechaFin):r,g=h=>{const S=p(u,h),C=l(u,h),w=(u.retribucionFlexible||[]).reduce((x,T)=>x+(T.importe||0)*12,0),y=Math.max(0,S-w),A=(u.ssPct??6.35)/100,M=y*A,I=y/f,E=C/f,P=M/f,_=u.representacion==="simplificado"?I-P-E:I;s.push({fecha:h,concepto:u.nombre,cuantia:_,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(P>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),E>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const x of u.retribucionFlexible||[])!x.cuenta||!(x.importe>0)||e&&e.length>0&&!e.includes(x.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${Cn[x.tipo]||x.tipo}`,cuantia:x.importe,tipo:"ingreso",cuenta:x.cuenta,tags:["retribucion-flexible",x.tipo],sourceId:`${u._id}_flex_${x._id||x.tipo}`,sourceType:"nomina"})};if(f<=12){const h=f===12?1:Math.round(12/f),S=b.getDate();let{year:C,month:w}=Ft(b,i,h);for(let y=0;y<300;y++){const A=new Date(C,w+1,0).getDate(),M=new Date(C,w,Math.min(S,A));if(M>r||M>$)break;M>=i&&M>=b&&g(W(M)),w+=h,w>=12&&(C+=Math.floor(w/12),w=w%12)}}else{const h=f-12,S=b.getDate();let{year:C,month:w}=Ft(b,i,1);for(let M=0;M<300;M++){const I=new Date(C,w+1,0).getDate(),E=new Date(C,w,Math.min(S,I));if(E>r||E>$)break;E>=i&&E>=b&&g(W(E)),w++,w>=12&&(C++,w=0)}const y=Math.max(b.getFullYear(),i.getFullYear()),A=Math.min((u.fechaFin?$:r).getFullYear(),r.getFullYear());for(let M=y;M<=A;M++)for(const I of In.slice(0,h)){const E=new Date(M,I,15);E>=i&&E<=r&&E>=b&&E<=$&&g(W(E))}}}return s}function Na(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=O(e.start),r=O(e.end),c=K(),d=t.filter(l=>l.activo&&l.tipo==="gasto"&&l.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const l=p.getFullYear(),u=p.getMonth(),v=l+"-"+String(u+1).padStart(2,"0"),f=v+"-01",b=W(new Date(l,u+1,0)),$=W(new Date(l,u,15));let g=0;for(const h of d){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<f)continue;const S=h.fechaInicio||c,C=vt(a,S,$);if(C<=1)continue;const w=Math.max(1,h.frecuencia||1);g+=h.cuantia*(C-1)/w}g>.01&&s.push({fecha:$,concepto:"Incremento coste de vida",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(l,u+1,1)}return s}function Ra(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=O(e.start),i=O(e.end),r=[...a].sort((d,p)=>d.year-p.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const d=c.getFullYear(),p=c.getMonth(),l=d+"-"+String(p+1).padStart(2,"0"),u=W(new Date(d,p,15)),v=r.filter(h=>h.year<=d),f=v.length>0?v[v.length-1]:r[0],b=f?f.tasa/100:0,$=Math.pow(1+b,1/12)-1,g=t*$;g>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+l,sourceType:"inflacion"}),c=new Date(d,p+1,1)}return n}function La(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,n=t.reduce((i,r)=>i+Kt(r,o),0),s=_a(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function ka(t,a,e){const{fecha:o,saldo:n}=La(a,e),s=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=n;for(const p of[...s].reverse()){const l=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:l,saldoAcum:c}),c-=l}const d=[];c=n;for(const p of i){const l=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=l,d.push({...p,delta:l,saldoAcum:c})}return[...r,...d]}function Sn(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return ka([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Oa(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter($=>$.activo&&(!s||s.length===0||s.includes($._id))),d=La(c,n),p={start:d.fecha<n.dashboardStart?d.fecha:n.dashboardStart,end:n.dashboardEnd},l=e.filter($=>$.tipo!=="transferencia"),u=e.filter($=>$.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let f=[];f=f.concat(Qt(l,p,s)),f=f.concat(qe(a,p,s)),f=f.concat(Ta(u,p,s,v)),f=f.concat(za(o,p,s));const b=ja(o,p,s,f);if(f=f.concat(b),f=f.concat(qa(e,n.tramos_irpf,p,s)),f=f.concat(Ne(i,p,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const $=(o.find(S=>S.activo&&S.esCuentaPrincipal)||o.find(S=>S.activo)||{_id:"default"})._id;f=f.concat(Na(l,r,p,s,$));const h=o.filter(S=>S.activo&&(!s||s.length===0||s.includes(S._id))).reduce((S,C)=>S+Kt(C,n.dashboardStart),0);f=f.concat(Ra(h,r,p,$))}return f.sort(($,g)=>$.fecha.localeCompare(g.fecha)),ka(f,c,n).filter($=>$.fecha>=n.dashboardStart)}function An(t,a,e=null){const o=K(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+bt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Ba(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Mn(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${F(i)})`})))}return e}function En(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=O(a.dashboardStart),n=O(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function _n(t,a,e=K()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",d={};c&&c<=e&&(d[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(d[p.fecha]=p.saldo);return Object.keys(d).forEach(p=>o.add(p)),d}),s={};for(const r of[...o].sort()){let c=0;for(let d=0;d<a.length;d++){const p=Object.entries(n[d]).filter(([l])=>l<=r);p.length>0?(p.sort(([l],[u])=>u.localeCompare(l)),c+=p[0][1]):c+=a[d].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([d],[p])=>d.localeCompare(p))){const d=t.filter(v=>v.fecha<=r),p=d.length>0?d[d.length-1].saldoAcum:null;if(p===null)continue;const l=c-p,u=p!==0?l/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:l,pct:u})}return i}const Pn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:_n,detectarPuntosCriticos:Mn,mediaMensualGastos:En},Symbol.toStringTag,{value:"Module"}));function Xt(t,a=new Date){const e=W(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Qt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Fn(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Ct(e.capital,e.tin,e.meses),0)}function Dn(t,a){return X(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Ha(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+Ct(n.capital,n.tin,n.meses)*Math.min(a,Dn(n,e)),0)}function Ga(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Xt(t,o),s=a.colchonMeses||6;return n*s+Ha(e,s,W(o))}function Tn(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((d,p)=>d.fecha.localeCompare(p.fecha)).filter(d=>d.fecha<=o).pop();if(!i)return Ga(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Xt(t,n),c=i.meses||6;return r*c+Ha(e,c,o)}function Re(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((p,l)=>p.fecha.localeCompare(l.fecha)),c=r.filter(p=>p.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Xt(a,i)+Fn(o))*(c.meses||1):0}function zn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function jn(t,a){const e={};for(const o of a)e[o._id]=bt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=zn(o)),{fecha:o.fecha,saldos:{...e}}))}function qn(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(d=>d.activo!==!1)){let d=!1;for(let p=0;p<a.length;p++){const l=a[p],u=Re(c,o,n,s,l.fecha,!1,i);if(u<=0){d=!1;continue}const v=!c.cuentas||c.cuentas.length===0?l.saldoAcum:c.cuentas.reduce((f,b)=>{var $,g;return f+(((g=($=e[p])==null?void 0:$.saldos)==null?void 0:g[b])||0)},0);v<u&&!d?(d=!0,r.push({tipo:"bajo_margen",fecha:l.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(u)} desde ${l.fecha}`})):v>=u&&d&&(d=!1,r.push({tipo:"recuperacion_margen",fecha:l.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${l.fecha}`}))}}return r}const Nn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ga,calcColchonEnFecha:Tn,calcGastoBasicoMensual:Xt,calcMargenEnFecha:Re,detectarCrucesMargenes:qn,saldosPorCuentaEnExtracto:jn},Symbol.toStringTag,{value:"Module"}));function Rn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Va(t,a){return Yt(O(t),O(a))}const Ln=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ua(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${Ln[o-1]}${s?"":` de ${e}`}`}function Ya(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function kn(t,a={}){const{hoy:e=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const l of t.puntosCriticos??[])l.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${F(l.saldo)}.`}):l.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${F(l.saldo)}, por debajo del colchón.`});for(const l of t.crucesMargenes??[])l.tipo==="bajo_margen"&&r.push({id:`margen:${l.nombre}`,gravedad:"aviso",fecha:l.fecha,distancia:Math.max(0,l.target-l.saldo),titulo:u=>u?`Podrías bajar de «${l.nombre}»`:`Bajas de «${l.nombre}»`,detalle:u=>`El ${u} tendrías ${F(l.saldo)}, y el margen pide ${F(l.target)}.`});const c=new Map;for(const l of r){const u=c.get(l.id);(!u||l.fecha<u.fecha)&&c.set(l.id,l)}const d=[];for(const l of c.values()){const u=Va(e,l.fecha);if(u<0||u>(l.gravedad==="critico"?o:n))continue;const v=i?i(u):0,f=v>0&&l.distancia<v;d.push({id:l.id,gravedad:l.gravedad,fecha:l.fecha,dias:u,plazo:Ya(u),titulo:l.titulo(f),detalle:l.detalle(Ua(l.fecha,e)),incierto:f})}const p={critico:0,aviso:1};return d.sort((l,u)=>l.fecha.localeCompare(u.fecha)||p[l.gravedad]-p[u.gravedad]),d.slice(0,s)}const On=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Rn,construirAvisos:kn,describirPlazo:Ya,diasEntreISO:Va,fechaEnPalabras:Ua},Symbol.toStringTag,{value:"Module"})),Bn=30.44*864e5;function Wa(t){const a=t.getFullYear(),e=t.getMonth();return{desde:W(new Date(a,e,1)),hasta:W(new Date(a,e,Ee(a,e)))}}function Ka(t){const[a,e]=t.split("-").map(Number);return Wa(new Date(a,e-1,1))}function Hn(t,a){return Math.max(1,(O(a).getTime()-O(t).getTime())/Bn)}const Gn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),$t=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function Vn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Un(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=a.loanIdsIniciados,s=$t(t.filter(u=>u.tipo==="ingreso")),i=$t(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=$t(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=$t(t.filter(u=>u.sourceType==="loan-amort")),d=$t(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:l}=Vn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:l/e,gastosTotales:(i+p+l)/e,intereses:d/e}}function Ja(t,a){return t.reduce((e,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Yn(t,a,e,o){const n=t.filter(d=>d.activo&&!d.simulacion&&(d.fechaInicio||"")<=e),s=n.reduce((d,p)=>{if((p.amortizaciones||[]).filter(f=>f.fecha>=a&&f.fecha<=e).length===0)return d;const u=X(p).totalIntereses,v=X({...p,amortizaciones:(p.amortizaciones||[]).filter(f=>f.fecha<a||f.fecha>e)}).totalIntereses;return d+Math.max(0,v-u)},0),i=n.filter(d=>d.mostrarFechaFinEnDashboard!==!1).map(d=>({loan:d,fechaFin:X(d).fechaFin})).filter(d=>!!d.fechaFin&&d.fechaFin>=a&&d.fechaFin<=e),r=n.map(d=>X(d).tabla),c=d=>{const{desde:p,hasta:l}=Ka(d);return r.reduce((u,v)=>{const f=v.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=l);return u+(f?f.cuota:0)},0)};return{deudaInicio:Ja(n,a),deudaFin:Ja(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function Wn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:$t(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Qa(t,a=new Set,e="desglosado"){if(a.size===0)return Ba(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(d=>a.has(d)),r=s.filter(d=>!a.has(d)),c=e==="porgrupos"&&i.length>0?i:r;for(const d of c)o.set(d,(o.get(d)||0)+Math.abs(n.cuantia))}return o}function Kn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Qa(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Jn(t,a){const e=a.reduce((o,n)=>o+bt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:$t(t.filter(o=>o.tipo==="gasto")),totalIngresos:$t(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Qn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Xn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function Zn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function ts(t,a){if(t.length===0)return[];const e=d=>a==="mes"?d.slice(0,7):d.slice(0,4),o=d=>a==="mes"?`${d}-01`:`${d}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const d of t){const p=e(d.fecha),l=d.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:l,maximo:Math.max(i,l),minimo:Math.min(i,l),eventos:0},r.push(c)),c.cierre=l,l>c.maximo&&(c.maximo=l),l<c.minimo&&(c.minimo=l),c.eventos+=1}return r}const es=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:ts,cuentasVisibles:Qn,gastoPorTagOrdenado:Kn,idsHipoteca:Xn,idsPrestamosIniciados:Zn,interesesPorCuenta:Wn,mesesDelPeriodo:Hn,metricasFlujo:Un,rangoMes:Ka,rangoMesDe:Wa,resumenPrestamosPeriodo:Yn,sinTransferencias:Gn,sumarGastosPorTag:Qa,totalesPeriodo:Jn},Symbol.toStringTag,{value:"Module"}));function as(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Tt(t,a){return e=>as(t,a,e)}const St=11,Xa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Za=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Le(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const to="default";function eo(){return{_id:to,nombre:"Yo",esPorDefecto:!0,activo:!0}}function ke(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Xa,tramosGananciasCapital:Za,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Oe(t,a){return{loans:[],expenses:[],accounts:[Le(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[eo()],config:ke(t,a)}}const ut=t=>Array.isArray(t)?t:[],os=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Zt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function ao(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Be(t){const{varianza:a,inflacion:e,...o}=t;return o}function ns(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=os(t.config),r={...ke(e,o)};for(const[p,l]of Object.entries(s))l!=null&&(r[p]=l);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Xa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Za),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=ut(t.accounts).map(p=>{const l={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return l.modeloFondo||(l.modeloFondo=l.esFondoPension?"pension":"cuenta"),delete l.esFondoPension,Array.isArray(l.historicoSaldos)||(l.historicoSaldos=[]),Zt(l)});c.length===0&&(c=[Le(e)]);const d=c.filter(p=>p.esCuentaPrincipal);if(d.length===0){const p=c.find(l=>l._id==="default")||c[0];c=c.map(l=>({...l,esCuentaPrincipal:l._id===p._id}))}else if(d.length>1){let p=!1;c=c.map(l=>l.esCuentaPrincipal?p?{...l,esCuentaPrincipal:!1}:(p=!0,l):l)}return n.accounts=c,n.expenses=ut(t.expenses).map(p=>{const l={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.historialPrecios)||(l.historialPrecios=[]),l.diaPago=ao(l.diaPago),Be(Zt(l))}),n.loans=ut(t.loans).map(p=>{const l={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(l.tags)||(l.tags=[]),l.diaPago=ao(l.diaPago),l.amortizaciones=ut(l.amortizaciones).map(u=>Zt(u)),Be(Zt(l))}),n.nominas=ut(t.nominas).map(p=>{const l={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.retribucionFlexible)||(l.retribucionFlexible=[]),Be(Zt(l))}),n.goals=ut(t.goals).map((p,l)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...f}=p;return{prioridad:l+1,completado:!1,usarColchon:!0,targetAmount:0,...f,cuentaIds:u}}),n.inflacion=ut(t.inflacion),n.tramosIRPFHistorico=ut(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ut(t.tramosGananciasCapitalHistorico),n.escenarios=ut(t.escenarios).map(({inversiones:p,...l})=>l),n}const zt=t=>Array.isArray(t)?t:[];let He=0;function ss(t){return He+=1,`${t}_${He.toString(36)}`}const is=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),rs=t=>typeof t=="number"&&Number.isFinite(t);function cs(t,a){const e={...t};He=0;const o=zt(t.transacciones),n=zt(t.puntosControl),s=[...n],i=new Set(n.map(d=>`${d.cuentaId}|${d.fecha}`)),r=(d,p,l,u)=>{if(!is(p)||!rs(l))return;const v=`${d}|${p}`;i.has(v)||(i.add(v),s.push({_id:ss("pc"),fecha:p,cuentaId:d,saldoCts:it(l),...typeof u=="string"&&u?{nota:u}:{}}))};for(const d of zt(t.accounts)){const p=typeof d._id=="string"?d._id:null;if(p)for(const l of zt(d.historicoSaldos))r(p,l.fecha,l.saldo,l.nota)}const c=zt(t.history);if(c.length>0){const d=zt(t.accounts),p=d.find(u=>u.esCuentaPrincipal)||d.find(u=>u.activo)||d[0],l=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:l;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((d,p)=>String(d.fecha).localeCompare(String(p.fecha))),e}const Ge=t=>Array.isArray(t)?t:[],ls=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ds=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ve=0;function us(){return Ve+=1,`tx_hp_${Ve.toString(36)}`}function ps(t,a){const e={...t};Ve=0;const o=[...Ge(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ge(t.expenses).map(i=>{const r=Ge(i.historialPrecios),c=typeof i._id=="string"?i._id:null,d=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",l=Array.isArray(i.tags)?i.tags.filter(f=>typeof f=="string"):[];if(c)for(const f of r){if(!f||!ls(f.fecha)||!ds(f.cuantia))continue;const b=p==="ingreso"?it(f.cuantia):-it(f.cuantia),$=`${c}|${f.fecha}|${b}`;n.has($)||(n.add($),o.push({_id:us(),fecha:f.fecha,cuentaId:d,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:l,estimacionId:c,tipo:p,origen:"importado",nota:typeof f.nota=="string"&&f.nota?f.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const oo=t=>Array.isArray(t)?t:[],xt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,jt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,ms=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function fs(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=oo(e.goals),n=oo(e.accounts),s=n.map(l=>{const u=jt(l.bloqueoMeses,0);return{_id:`veh_${xt(l._id,"x")}`,nombre:xt(l.nombre,"Cuenta"),rentabilidadRealAnual:jt(l.interes,0)/100,liquidez:l.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:jt(l.impuestoRetirada,0)/100,topeAportacionAnual:l.modeloFondo==="pension"?it(1500):null,riesgo:l.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:xt(l._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:jt(l.interes,0)>0}}),i=new Map(n.map((l,u)=>[xt(l._id,""),s[u]._id])),r=((p=s[0])==null?void 0:p._id)??"",c=o.map((l,u)=>{const v=Array.isArray(l.cuentaIds)?l.cuentaIds.map(b=>xt(b,"")):[],f=ms(l.targetDate);return{_id:xt(l._id,`obj_mig_${u}`),nombre:xt(l.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(jt(l.targetAmount,0)),fechaLimite:f,prioridad:jt(l.prioridad,u+1),modoAsignacion:f?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:l.completado===!0?"COMPLETADO":"PENDIENTE",notas:xt(l.notas,"")}}),d={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[d],e}function gs(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===to)||(e.personas=[eo(),...o]),e}const te=t=>Array.isArray(t)?t:[];function me(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function vs(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function bs(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=te(e.loans).map(me),e.expenses=te(e.expenses).map(me),e.nominas=te(e.nominas).map(me),e.accounts=te(e.accounts).map(me),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=te(e.planes).filter(vs);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const no="supuesto-archivado",qt=t=>Array.isArray(t)?t:[],so=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function hs(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function ys(t,a){const e={...t};let o=0;const n=[],s=c=>{const{escenarioIds:d,...p}=c;if(!so(c))return p;o+=1;const l=Array.isArray(p.tags)?p.tags:[];return{...p,activo:!1,tags:l.includes(no)?l:[...l,no]}};e.expenses=qt(e.expenses).map(s),e.nominas=qt(e.nominas).map(s),e.accounts=qt(e.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:d,...p}=c;return p}return s(c)}),e.loans=qt(e.loans).map(c=>{const d=s(c);if(Array.isArray(d.amortizaciones)){const p=[];for(const l of d.amortizaciones){const{escenarioIds:u,...v}=l;so(l)?n.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):p.push(v)}d.amortizaciones=p}return d});const i=[...qt(e._migracion010_planesArchivados),...qt(e.planes).filter(hs)];delete e._migracion010_planesArchivados,delete e.planes,delete e.goals,delete e.escenarios;const r=e.config&&typeof e.config=="object"?{...e.config}:{};if(delete r.escenarioActivo,i.length>0||n.length>0||o>0){const c=r.archivoMigracion011??{},d={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...n],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=d}return(e.config!==void 0||r.archivoMigracion011)&&(e.config=r),e}const $s=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:ns},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:cs},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ps},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:fs},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:gs},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:bs},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:ys}],io=["history","escenarios","planes","goals"],xs=["escenarios","planes","goals"];function ro(t,a,e){let o=t;const n=[];for(const s of[...$s].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const ct="state_",ee="state__schemaVersion",Nt="financeapp_",Ue="state__modificadoEn",co="financeapp:sin-espacio";function ws(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent(co))}catch{}}function lo(t=localStorage,a=Nt){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Ue&&t.setItem(e(Ue),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s),ws()}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function Is(t=localStorage,a=Nt){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(ct)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Cs({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Ss={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function As(t,a){const e=Ss[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function Ms(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Es({adapter:t,hoy:a=new Date}){const e=W(a),o=Ms(a);let n=Oe(e,o);const s=new Set;let i=[];const r=Cs();function c(x){for(const T of s)T(x)}function d(x){t.set(`${ct}${x}`,n[x])}function p(){const x={};for(const q of Object.keys(n)){const L=t.get(`${ct}${q}`);L!==null&&(x[q]=L)}for(const q of io){const L=t.get(`${ct}${q}`);L!==null&&(x[q]=L)}const T=t.get(ee),{state:D,applied:z}=ro(x,T,{hoyISO:e,finISO:o});if(n=l(D),u(),z.length>0){for(const q of Object.keys(n))d(q);t.set(ee,St);for(const q of xs)t.remove(`${ct}${q}`)}return i=z,{applied:z}}function l(x){const T=Oe(e,o),D={...T,...x};for(const q of Object.keys(T))q!=="config"&&(Array.isArray(D[q])||(D[q]=T[q]));const z=x.config&&typeof x.config=="object"?x.config:{};return D.config={...ke(e,o),...z},D}function u(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Le(e)],d("accounts");return}const x=n.accounts.filter(T=>T.esCuentaPrincipal);if(x.length===0)n.accounts=n.accounts.map((T,D)=>D===0?{...T,esCuentaPrincipal:!0}:T),d("accounts");else if(x.length>1){let T=!1;n.accounts=n.accounts.map(D=>D.esCuentaPrincipal?T?{...D,esCuentaPrincipal:!1}:(T=!0,D):D),d("accounts")}}function v(x){return n[x]}function f(x,T){n[x]=T,d(x),c(x)}function b(x){f("config",{...n.config,...x})}function $(x){return s.add(x),()=>s.delete(x)}function g(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function h(x,T){const D=[...n[x]],z={...T,_id:g()};return D.push(z),f(x,D),z}function S(x,T,D){const z=n[x].map(q=>q._id===T?{...q,...D}:q);f(x,z)}function C(x,T){const D=n[x],z=D.findIndex(q=>q._id===T);z<0||(r.registrar({col:x,item:D[z],indice:z}),f(x,D.filter((q,L)=>L!==z)))}function w(){const x=r.tomar();if(!x)return null;const T=[...n[x.col]];return T.splice(Math.min(x.indice,T.length),0,x.item),f(x.col,T),x}function y(){return r.pendiente()}function A(){const x=n.accounts||[],T=x.find(D=>D.esCuentaPrincipal&&D.activo)||x.find(D=>D.activo);return T?T._id:"default"}function M(x){var T;return((T=n.accounts.find(D=>D._id===x))==null?void 0:T.nombre)??x}function I(){return Tt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function E(){return Tt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function P(){return structuredClone(n)}function _(x,T=null){const{state:D,applied:z}=ro(x,T,{hoyISO:e,finISO:o});n=l(D),u();for(const q of Object.keys(n))d(q);t.set(ee,St);for(const q of Object.keys(n))c(q);return{applied:z}}return{load:p,get:v,set:f,patchConfig:b,subscribe:$,addItem:h,updateItem:S,removeItem:C,deshacerBorrado:w,borradoPendiente:y,getPrincipalAccountId:A,accountName:M,resolverTramosIRPF:I,resolverTramosGanancias:E,snapshot:P,replaceAll:_,get schemaVersion(){return St},get migrationsApplied(){return[...i]},get today(){return e||K()}}}function _s(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const At=Object.keys(Oe("1970-01-01","1970-01-01"));function uo(t){const a={};for(const e of At){const o=t.get(`${ct}${e}`);o!=null&&(a[e]=o)}return a}function Ps(t,a){const e=[];for(const o of At){const n=a[o];n!=null&&(t(`${ct}${o}`,n),e.push(o))}return e}function Fs(t){return At.filter(a=>t[a]===void 0||t[a]===null)}function Ds(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!At.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const po="_schemaVersion";function Ts(t,a){const e=t[po];if(typeof e=="number"&&Number.isFinite(e))return Math.min(e,a);const o=r=>Array.isArray(t[r])?t[r]:[],n=t.config&&typeof t.config=="object"?t.config:null;if(n&&n.features===void 0)return 4;if(t.transacciones===void 0&&t.expenses!==void 0)return 5;if(o("expenses").some(r=>Array.isArray(r.historialPrecios)&&r.historialPrecios.length>0))return 6;if(t.personas===void 0&&t.expenses!==void 0)return 8;const s=r=>r.some(c=>Array.isArray(c.escenarioIds)&&c.escenarioIds.length>0);return t.escenarios!==void 0||t.planes!==void 0||t.goals!==void 0||s(o("expenses"))||s(o("loans"))||s(o("nominas"))||s(o("accounts"))||o("loans").some(r=>s(Array.isArray(r.amortizaciones)?r.amortizaciones:[]))?Math.min(10,a):a}const mo=`${Nt}meta_proyectos`,fo=`${Nt}meta_proyectoActivo`,Mt="default",zs="Mis finanzas";function Ye(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Rt(t){return t===Mt?Nt:`${Nt}p_${t}_`}function go(){return[...At.map(t=>`${ct}${t}`),ee,Ue]}function js(t=localStorage){function a(){try{const l=t.getItem(mo);if(!l)return[];const u=JSON.parse(l);return Array.isArray(u)?u:[]}catch{return[]}}function e(l){t.setItem(mo,JSON.stringify(l))}function o(){const l=a();if(l.some(f=>f._id===Mt))return l;const u=Date.now(),v=[{_id:Mt,nombre:zs,creadoEn:u,actualizadoEn:u},...l];return e(v),v}function n(){try{const l=t.getItem(fo);if(!l)return Mt;const u=JSON.parse(l);return typeof u=="string"&&u?u:Mt}catch{return Mt}}function s(l){t.setItem(fo,JSON.stringify(l))}function i(l){const u=l.trim()||"Proyecto sin nombre",v=Date.now(),f={_id:Ye(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),f]),f}function r(l,u){const v=u.trim();v&&e(o().map(f=>f._id===l?{...f,nombre:v,actualizadoEn:Date.now()}:f))}function c(l,u){const v=o().find(g=>g._id===l);if(!v)throw new Error("Proyecto no encontrado.");const f=Rt(l),b={_id:Ye(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},$=Rt(b._id);for(const g of go()){const h=t.getItem(`${f}${g}`);h!==null&&t.setItem(`${$}${g}`,h)}return e([...o(),b]),b}function d(l){if(l===Mt)throw new Error("No se puede eliminar el proyecto original.");if(l===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(f=>f._id===l))return;const v=Rt(l);for(const f of go())t.removeItem(`${v}${f}`);e(u.filter(f=>f._id!==l))}function p(l){const u=new Map(o().map(f=>[f._id,f]));for(const f of l){if(!f||typeof f._id!="string")continue;const b=u.get(f._id);(!b||(f.actualizadoEn??0)>b.actualizadoEn)&&u.set(f._id,f)}const v=[...u.values()];return e(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:d,fusionarRemotos:p}}function qs(t,a,e){const o=lo(t,Rt(a)),n={};for(const s of e){const i=o.get(`${ct}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Ns(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Ye())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const ot={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},wt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:ot.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:ot.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:ot.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:ot.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:ot.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:ot.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:ot.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:ot.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:ot.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:ot.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:ot.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:ot.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:ot.datos,porDefecto:!1,dependencias:["sync-nube"]}],Rs=new Map(wt.map(t=>[t.id,t]));function ae(t){return Rs.get(t)}function vo(t){return wt.filter(a=>(a.dependencias||[]).includes(t))}function We(){const t={};for(const a of wt)t[a.id]=a.porDefecto;return t}function bo(){const t=[],a=new Map;for(const e of wt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Ls(t){function a(){return{...We(),...t.get("config").features||{}}}function e(l){t.patchConfig({features:l})}function o(l,u=a(),v=new Set){const f=ae(l);if(!f)return!1;if(f.nucleo)return!0;if(u[l]===!1)return!1;if(v.has(l))return!0;v.add(l);for(const b of f.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(l,u=a()){const v=ae(l);return v?(v.dependencias||[]).filter(f=>!o(f,u)):[]}function s(l,u){var S;const v=ae(l);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const f=a(),b=new Map(wt.map(C=>[C.id,o(C.id,f)])),$={...f,[l]:u};let g;if(u){const C=[...v.dependencias||[]];for(;C.length;){const w=C.pop();$[w]===!1&&($[w]=!0,g="dependencias-activadas"),C.push(...((S=ae(w))==null?void 0:S.dependencias)||[])}}else{const C=vo(l).map(w=>w.id);for(;C.length;){const w=C.pop();$[w]!==!1&&($[w]=!1,g="cascada-apagado"),C.push(...vo(w).map(y=>y.id))}}return e($),{cambiadas:wt.filter(C=>o(C.id,$)!==b.get(C.id)).map(C=>C.id),motivo:g}}function i(){const l=a();return wt.map(u=>{const v=n(u.id,l);return{...u,activa:o(u.id,l),...v.length>0&&l[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const l=a();return bo().map(({grupo:u,features:v})=>({grupo:u,features:v.map(f=>{const b=n(f.id,l);return{...f,activa:o(f.id,l),...b.length>0&&l[f.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(We())}function d(l){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...l?{nombre:l}:{},features:a()}}function p(l){const u=l,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const f=We(),b=[],$=[];for(const[g,h]of Object.entries(v)){if(!ae(g)){$.push(g);continue}if(typeof h!="boolean"){$.push(g);continue}f[g]=h,b.push(g)}return e(f),{aplicadas:b,ignoradas:$}}return{isEnabled:l=>o(l),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:d,importProfile:p,bloqueadaPor:l=>n(l)}}const oe=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Lt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function ks(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(oe).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${oe(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${oe(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${oe(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Os(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${oe(o)}</div>
        ${n.map(ks).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Bs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Hs(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Os(e)}`,n(i)}function n(i){var c,d,p;i.querySelectorAll("[data-feature-toggle]").forEach(l=>{l.addEventListener("change",()=>{var f;const u=l.dataset.featureToggle,v=e.setEnabled(u,l.checked);v.motivo==="dependencias-activadas"&&Lt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Lt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(f=t.onChange)==null||f.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const l=e.exportProfile(),u=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),f=a.createElement("a");f.href=v,f.download=`financeapp-funcionalidades-${K()}.json`,f.click(),URL.revokeObjectURL(v),Lt(t,"Perfil de funcionalidades guardado")}),(d=i.querySelector('[data-feature-action="import"]'))==null||d.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const l=(u=r.files)==null?void 0:u[0];if(l)try{const{aplicadas:f,ignoradas:b}=e.importProfile(JSON.parse(await l.text()));Lt(t,b.length>0?`Perfil cargado (${f.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${f.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,f),o(i)}catch(f){Lt(t,"No se pudo cargar el perfil: "+f.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var l;e.reset(),Lt(t,"Funcionalidades restablecidas"),(l=t.onChange)==null||l.call(t,[]),o(i)})}function s(){const i=Bs(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const pt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Gs={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function ho(t){return Gs[t]??t}function ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function yo(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Vs(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Us(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function Ys(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Ws(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${pt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${pt(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${pt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${pt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${pt(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${pt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Ks(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${pt(i._id)}">${pt(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${pt(i)}"/> ${pt(ho(i))}
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
    </div>`}function Js(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Qs(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(d=>Ws(d,c)).join("")}
      </div>
      ${Js()}
      ${Ks(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,d;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const l=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(f=>f._id===l);if(v){if(u==="cambiar"){if(!yo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(l),Vs(t);return}if(u==="renombrar"){const f=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!f||!f.trim())return;e.renombrar(l,f.trim()),ft(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const f=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",f):f;if(b===null)return;const $=e.duplicar(l,b.trim()||f);ft(t,`"${$.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!yo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(l),ft(t,`"${v.nombre}" eliminado`),n(r)}catch(f){ft(t,f.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),l=p==null?void 0:p.value.trim();if(!l){ft(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(l);ft(t,`"${u.nombre}" creado ✓`),n(r)}),(d=r.querySelector("#proyecto-import-btn"))==null||d.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const l=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(f=>f.dataset.proyectoImportCol);if(l.length===0){ft(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,l);if(u.length===0){ft(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}ft(t,`Importado: ${u.map(ho).join(", ")} ✓`),Us(),n(r)})}function i(){const r=Ys(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const fe=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Et=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function kt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Xs(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Zs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function ti(t){const a=t.color||fe[0];return`
    <div class="dm-section" data-persona-fila="${Et(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Et(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Et(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${Et(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${Et(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${Et(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${Et(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ei(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${fe.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${fe[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function ai(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(ti).join("")}
      </div>
      ${ei()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.personaId,v=l.dataset.personaAccion,f=e.get("personas"),b=f.find($=>$._id===u);if(b){if(v==="renombrar"){const $=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!$||!$.trim())return;e.updateItem("personas",u,{nombre:$.trim()}),kt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){e.set("personas",f.map($=>({...$,esPorDefecto:$._id===u}))),kt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(f.length<=1){kt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Xs(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),kt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const d=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(l=>{l.addEventListener("click",()=>{const u=l.getAttribute("data-persona-color");d&&(d.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const l=c.querySelector("#persona-nuevo-nombre"),u=l==null?void 0:l.value.trim();if(!u){kt(t,"Ponle un nombre a la persona","warn");return}const v=(d==null?void 0:d.value)||fe[0],f=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});kt(t,`"${f.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Zs(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const $o={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function xo(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function oi({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([d,p])=>[p,d]);for(const[d,p]of[...Object.entries($o),...c]){const l=t.isEnabled(d),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=l?"":"none"),!l&&n()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(d=>{const p=[...d.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const l=p.some(u=>u.style.display!=="none");d.style.display=l?"":"none"}),xo(a,d=>t.isEnabled(d)),r){const d=e??globalThis.Router;d==null||d.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const d=new MutationObserver(()=>{if(!c){c=!0;try{xo(a,p=>t.isEnabled(p))}finally{c=!1}}});return d.observe(r,{childList:!0,subtree:!0}),()=>d.disconnect()}return{apply:s,observar:i,vistaPara:r=>$o[r]}}const ni="toast toast-deshacer";function si(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function d(l){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=ni,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const f=document.createElement("span");f.textContent=`${As(l.col,l.item)} se ha eliminado.`,f.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const $=a.deshacerBorrado();if(c(),!$)return;const g=n();if(g){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",g.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),v.appendChild(f),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const l=a.borradoPendiente();if(!l){r=null,c();return}l!==r&&(r=l,d(l))});return()=>{p(),c()}}function ge(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function wo(t,a){const e=ge(t),o=ge(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const ne=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function ii(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[ne(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:ne(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:ne(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${ne(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,ne(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function ri(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=ge(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of ii(t)){if(!i(c.ruta))continue;const d=wo(c.titulo,s),p=d>=0?-1:Math.min(wo(c.extra??"",s),2);if(d<0&&p<0)continue;const l=d>=0?d:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:l*1e3+Math.min(999,ge(c.titulo).length)})}return r.sort((c,d)=>c.peso-d.peso||c.titulo.localeCompare(d.titulo,"es")),r.slice(0,o)}const ci="buscador-overlay",Io="btn-buscador";function li(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const C=a.createElement("div");C.id=ci,C.className="modal-overlay",C.style.alignItems="flex-start",C.style.paddingTop="10vh";const w=a.createElement("div");w.className="modal-box",w.style.maxWidth="560px",w.style.padding="14px";const y=a.createElement("input");y.type="search",y.className="form-input",y.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",y.setAttribute("aria-label","Buscar en toda la aplicación"),y.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",w.appendChild(y),w.appendChild(A),C.appendChild(w),a.body.appendChild(C),C.addEventListener("click",M=>{M.target===C&&b()}),y.addEventListener("input",()=>{r=0,p()}),y.addEventListener("keydown",v),o=C,n=y,s=A,C}function d(){if(s){if(s.textContent="",i.length===0){const C=a.createElement("div");C.style.padding="14px 4px",C.style.fontSize="13px",C.style.color="var(--text3)";const w=(n==null?void 0:n.value.trim())??"";C.textContent=w.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(C);return}i.forEach((C,w)=>{const y=a.createElement("button");y.type="button",y.className="buscador-fila",y.dataset.indice=String(w),w===r&&y.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const M=a.createElement("div");M.textContent=C.titulo,M.style.fontSize="13px",M.style.overflow="hidden",M.style.textOverflow="ellipsis",M.style.whiteSpace="nowrap";const I=a.createElement("div");I.textContent=C.detalle,I.style.fontSize="11px",I.style.color="var(--text3)",I.style.overflow="hidden",I.style.textOverflow="ellipsis",I.style.whiteSpace="nowrap",A.appendChild(M),C.detalle&&A.appendChild(I);const E=a.createElement("span");E.className="tag",E.textContent=C.etiqueta,E.style.flexShrink="0",y.appendChild(A),y.appendChild(E),y.addEventListener("click",()=>u(w)),s.appendChild(y)})}}function p(){const C=(n==null?void 0:n.value)??"";i=ri(t.estado(),C,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),d()}function l(C){var w,y;i.length!==0&&(r=(r+C+i.length)%i.length,d(),(y=(w=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:w.scrollIntoView)==null||y.call(w,{block:"nearest"}))}function u(C){const w=i[C];w&&(b(),t.navegar(w.ruta))}function v(C){C.key==="Escape"?(C.preventDefault(),b()):C.key==="ArrowDown"?(C.preventDefault(),l(1)):C.key==="ArrowUp"?(C.preventDefault(),l(-1)):C.key==="Enter"&&(C.preventDefault(),u(r))}function f(){const C=o??c();C.classList.remove("hidden"),C.style.display="",r=0,n&&(n.value="",n.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function $(){return!!o&&o.style.display!=="none"}function g(C){(C.ctrlKey||C.metaKey)&&(C.key==="k"||C.key==="K")&&(C.preventDefault(),$()?b():f())}a.addEventListener("keydown",g);let h=null;function S(){const C=a.getElementById("period-bar");if(!C||a.getElementById(Io))return;const w=a.createElement("button");w.id=Io,w.type="button",w.className="btn-secondary",w.title="Buscar en toda la aplicación (Ctrl+K)",w.setAttribute("aria-label","Buscar"),w.textContent="🔍 Buscar",w.style.marginLeft="auto",w.addEventListener("click",f),C.appendChild(w),h=w}return S(),()=>{a.removeEventListener("keydown",g),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Ke="aviso-guardado";function di(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function d(){var f;r&&clearTimeout(r),r=null,(f=a.getElementById(Ke))==null||f.remove()}function p(){if(s==="oculto")return d();const f=e();if(!f)return;let b=a.getElementById(Ke);b||(b=a.createElement("div"),b.id=Ke,f.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const $=a.createElement("span");if($.style.flex="1",b.appendChild($),s==="pendiente")$.textContent="Tienes cambios sin guardar.",b.appendChild(l("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(l("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",p()}));else if(s==="subiendo"){$.textContent="Subiendo…";const g=a.createElement("span");g.className="guardado-giro",g.setAttribute("aria-hidden","true"),b.appendChild(g)}else s==="guardado"?$.textContent="¡Guardado!":s==="error"&&($.textContent="No se ha podido guardar.",b.appendChild(l("Reintentar","btn-primary btn-sm",()=>void u())))}function l(f,b,$){const g=a.createElement("button");return g.type="button",g.className=b,g.textContent=f,g.style.flexShrink="0",g.addEventListener("click",$),g}async function u(){if(c)return c;r&&clearTimeout(r);const f=t.cambios.revision();return s="subiendo",p(),c=(async()=>{try{await t.guardar(),n.alDia(f),s="guardado",p(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",p()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,hayPendiente:()=>n.pendiente(),detener(){v(),d()}}}function ui({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(f){return`view-${f}`}function s(f){const b=t.getElementById(n(f.route));if(b)return b;const $=t.querySelector(".view-container");if(!$)return null;const g=t.createElement("div");return g.id=n(f.route),g.className="view hidden",$.appendChild(g),g}function i(f){if(t.querySelector(`.nav-btn[data-view="${f.route}"]`))return;const b=t.querySelectorAll(".nav-section"),$=b[f.seccion??Math.max(0,b.length-1)];if(!$)return;const g=t.createElement("button");g.className="nav-btn",g.dataset.view=f.route,g.innerHTML=`${f.iconoPath?`<svg viewBox="0 0 24 24"><path d="${f.iconoPath}"/></svg>`:""}<span>${f.nombre}</span>`,$.appendChild(g),g.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(f.route)})}function r(f){e.set(f.route,f),s(f),i(f)}function c(){return[...e.keys()].filter(f=>{const b=e.get(f);return!a||a(b.flagId??b.id)})}function d(f){return c().includes(f)}function p(f){const b=e.get(f);if(!b||a&&!a(b.flagId??b.id))return!1;const $=s(b);if(!$)return!1;if(o&&o!==f){const g=e.get(o),h=t.getElementById(n(o));g!=null&&g.unmount&&h&&g.unmount(h)}return b.mount($),o=f,!0}function l(){o&&p(o)}function u(){const f={};for(const[b,$]of e)f[b]=$.flagId??$.id;return f}function v(){for(const f of e.values())s(f),i(f)}return{register:r,routes:c,has:d,mount:p,rerender:l,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function It(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(F(t))}</span>`}function pi(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Co(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const mi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ve(t){const[a,e]=t.split("-").map(Number);return`${mi[e-1]} ${a}`}function R(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function nt(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function _t(t=document){const a=t.getElementById("modal-content");if(!a)return null;const e=a.cloneNode(!1);return a.replaceWith(e),e}function j(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function U(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function lt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function So(t,a){const e=parseFloat(lt(t,a));return Number.isFinite(e)?e:0}const fi="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Je(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function gi(t){const{store:a}=t,e=t.hoy??K,o=()=>O(e()),n=()=>a.get("config").margenesSeguridad??[];function s(v){var f;a.patchConfig({margenesSeguridad:v}),(f=t.onDatosCambiados)==null||f.call(t)}function i(v,f){const b=n().map(g=>({...g,puntos:(g.puntos??[]).map(h=>({...h}))})),$=b.find(g=>g._id===v);$&&(f($),s(b))}function r(v){const f=a.get("config"),b=Re(v,a.get("expenses"),f,a.get("loans"),e(),!1,o());return F(b)}function c(v,f,b){const $=f.tipo==="fijo",g=$?"":`<span class="text-sm" style="color:var(--text3)">${m(F((f.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(f._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(f.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${$?" selected":""}>Fijo €</option>
            <option value="meses"${$?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${$?`<input type="number" class="form-input" style="width:90px" value="${f.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${$?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${f.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${g}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function d(v,f,b){const $=v.cuentas&&v.cuentas.length>0?v.cuentas.map(C=>{var w;return((w=f.find(y=>y._id===C))==null?void 0:w.nombre)??C}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((C,w)=>C.fecha.localeCompare(w.fecha)).map(C=>c(v,C,b)).join(""),S=v.activo?`
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
        ${S}
      </div>`}function p(v,f){const b=f?n().find(S=>S._id===f):null,$=a.get("accounts").filter(S=>S.activo),g=new Set((b==null?void 0:b.cuentas)??[]),h=$.map(S=>`
        <label class="tag" data-chip="${m(S._id)}" style="cursor:pointer;${g.has(S._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(S._id)}" ${g.has(S._id)?"checked":""} style="display:none"/>
          ${m(S.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${f?"Editar margen":"Nuevo margen de seguridad"}</div>
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
        <button class="btn-primary" data-guardar-margen="${m(f??"")}">Guardar</button>
      </div>`}function l(v,f){const b=document.getElementById("modal-overlay"),$=_t();!b||!$||(p($,v),b.classList.remove("hidden"),U($,".mg-acc-chip",g=>{const h=g,S=$.querySelector(`[data-chip="${h.value}"]`);S&&(S.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U($,"#mg-p-tipo",g=>{const h=g.value==="fijo",S=$.querySelector("#mg-p-importe-wrap"),C=$.querySelector("#mg-p-meses-wrap");S&&(S.style.display=h?"":"none"),C&&(C.style.display=h?"none":"")}),j($,"[data-cerrar-form]",()=>b.classList.add("hidden")),j($,"[data-guardar-margen]",g=>{var y,A,M,I,E;const h=g.getAttribute("data-guardar-margen")||"",S=((y=$.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!S)return R("El nombre es obligatorio","err");const C=[...$.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),w=n().map(P=>({...P}));if(h){const P=w.findIndex(_=>_._id===h);if(P===-1)return R("Margen no encontrado","err");w[P]={...w[P],nombre:S,cuentas:C}}else{const P=((A=$.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",_={_id:Je(),fecha:((M=$.querySelector("#mg-p-fecha"))==null?void 0:M.value)||K(),tipo:P,importe:parseFloat(((I=$.querySelector("#mg-p-importe"))==null?void 0:I.value)??"0")||0,meses:parseFloat(((E=$.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};w.push({_id:Je(),nombre:S,activo:!0,cuentas:C,puntos:[_]})}s(w),R(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),f()}))}function u(v){const f=n(),b=a.get("accounts"),$=Xt(a.get("expenses"),o());v.innerHTML=`
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
      ${f.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:f.map(h=>d(h,b,$)).join("")}`;const g=()=>u(v);j(v,"[data-nuevo-margen]",()=>l(null,g)),j(v,"[data-editar-margen]",h=>l(h.getAttribute("data-editar-margen"),g)),j(v,"[data-borrar-margen]",h=>{nt("¿Eliminar este margen de seguridad?")&&(s(n().filter(S=>S._id!==h.getAttribute("data-borrar-margen"))),R("Margen eliminado"),g())}),U(v,"[data-toggle-margen]",h=>{const S=h.getAttribute("data-toggle-margen");i(S,C=>{C.activo=h.checked}),g()}),j(v,"[data-add-punto]",h=>{const S=h.getAttribute("data-add-punto");i(S,C=>{C.puntos=[...C.puntos??[],{_id:Je(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),g()}),j(v,"[data-borrar-punto]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=S.dataset.margen,w=S.dataset.punto;i(C,y=>{y.puntos=(y.puntos??[]).filter(A=>A._id!==w)}),g()}),U(v,"[data-campo]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=h.getAttribute("data-campo"),w=h.value;i(S.dataset.margen,y=>{const A=(y.puntos??[]).find(M=>M._id===S.dataset.punto);A&&(C==="fecha"?A.fecha=w:C==="tipo"?A.tipo=w:C==="importe"?A.importe=parseFloat(w)||0:A.meses=parseFloat(w)||0)}),g()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:fi,mount:u}}const vi=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],bi=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],hi=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function yi(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Qe=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function Ao(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=yi(t),i=Qe(vi.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Qe(bi,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Qe(hi,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Mo(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function Eo(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const $i={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function xi(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Ot(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const d=s.has(c._id),p=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
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
      ${xi(e,a).map(r).join("")}
    </div>
  </div>`}function Bt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Ht(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,d=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=d?parseFloat(d.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:s}}function _o(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${$i[t.modo]})`}function Xe(t,a,e){const o=_o(t,e),n=_o(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const wi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Ii=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ci(t){const a=t.hoy??K,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},n=()=>t.store.get("accounts"),s=g=>{var h;return((h=n().find(S=>S._id===(g||"default")))==null?void 0:h.nombre)??(g||"default")};function i(){const g=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(S=>!S.fechaFin||S.fechaFin>=g)),e.tipo&&(h=h.filter(S=>S.tipo===e.tipo)),e.cuenta&&(h=h.filter(S=>(S.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(S=>(S.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(S=>(S.fechaInicio??"")<=e.hasta)),e.busqueda){const S=e.busqueda.toLowerCase();h=h.filter(C=>C.concepto.toLowerCase().includes(S))}return e.tags.size>0&&(h=h.filter(S=>(S.tags||[]).some(C=>e.tags.has(C)))),h.sort((S,C)=>{const w=S[e.orden]??"",y=C[e.orden]??"";return typeof w=="number"&&typeof y=="number"?(w-y)*e.sentido:String(w).localeCompare(String(y))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(g=>g.tags||[]))].filter(Boolean).sort()}function c(g,h){const S=e.orden===g?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${g}">${m(h)} <span class="sort-arrow">${S}</span></span>`}function d(g,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(C=>C.activo!==!1).map(C=>`<option value="${m(C._id)}"${C._id===g?" selected":""}>${m(C.nombre)}</option>`).join("")}function p(g){const h=g.tipo==="transferencia",S=Xe(g.repartoConsumo,g.repartoPago,t.store.get("personas")),C=_e(g.diaPago??""),w=g.tipoFrecuencia==="extraordinario"?"Único":`Cada ${g.frecuencia??1} ${g.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${C?` · ${C}`:""}`,y=!!g.fechaFin&&g.fechaFin<a(),A=h?'<span class="badge badge-purple">⇄ transf.</span>':g.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',M=h?`${m(s(g.cuenta))} → ${m(s(g.cuentaDestino))}`:m(s(g.cuenta)),I=(g.tags||[]).map(E=>`<span class="tag${e.tags.has(E)?" active":""}" data-tag="${m(E)}" title="Filtrar por ${m(E)}">${m(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(g.concepto)}</div>
        <div class="tag-list mt-4">${I}</div>
      </div>
      <div>${A}</div>
      <div class="num ${g.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(F(g.cuantia))}</div>
      <div class="text-sm">${m(w)}</div>
      <div class="text-sm exp-col-hide">${M}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(g._id)}"${g.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${g.tipo==="gasto"&&g.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${g.tipo==="gasto"&&g.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${g.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${g.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(g.ajustadaEn??"")}">ajustada</span>`:""}
        ${S?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(S)}">👥 reparto</span>`:""}
        ${y?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(g._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(g._id)}">✕</button>
      </div>
    </div>`}function l(g){const h=i(),S=r();g.innerHTML=`
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
      ${S.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${S.map(C=>`<span class="tag${e.tags.has(C)?" active":""}" data-tag="${m(C)}">${m(C)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(p).join("")}
      </div>`}function u(g){const h=(g==null?void 0:g.tipo)==="transferencia",S=t.store.get("personas"),C=(w,y,A,M,I="")=>`<div class="form-group"><label class="form-label">${m(y)}</label>
       <input class="form-input" type="${A}" id="${w}" value="${m(M)}" placeholder="${m(I)}"/></div>`;return`
      <div class="grid-2">
        ${C("ef-concepto","Concepto","text",(g==null?void 0:g.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(g==null?void 0:g.tipo)==="gasto"||!(g!=null&&g.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(g==null?void 0:g.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${C("ef-cuantia","Cuantía (€)","number",(g==null?void 0:g.cuantia)??"","500")}
        ${C("ef-frecuencia","Frecuencia","number",(g==null?void 0:g.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Ii.map(([w,y])=>`<option value="${w}"${((g==null?void 0:g.tipoFrecuencia)??"mensual")===w?" selected":""}>${m(y)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${C("ef-fecha-ini","Fecha inicio","date",(g==null?void 0:g.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${d((g==null?void 0:g.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${d((g==null?void 0:g.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(g==null?void 0:g.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${g!=null&&g._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${C("ef-fecha-fin","Fecha fin (opcional)","date",(g==null?void 0:g.fechaFin)??"")}</div>
          <div class="mt-8">${Ao(g==null?void 0:g.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${h?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(g==null?void 0:g.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((g==null?void 0:g.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(g==null?void 0:g.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(g==null?void 0:g.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${m(((g==null?void 0:g.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${g!=null&&g.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(g==null?void 0:g.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${g!=null&&g.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${h?"":`${Ot("Reparto de consumo",g==null?void 0:g.repartoConsumo,S,"consumo")}
                 ${Ot("Reparto de pago",g==null?void 0:g.repartoPago,S,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((g==null?void 0:g._id)??"")}">Guardar</button>
      </div>`}function v(g){var C;const h=((C=g.querySelector("#ef-tipo"))==null?void 0:C.value)??"gasto",S=(w,y)=>{const A=g.querySelector(w);A&&(A.style.display=y?"":"none")};S("#ef-destino-wrap",h==="transferencia"),S("#ef-basico-wrap",h!=="transferencia"),S("#ef-irpf-wrap",h==="ingreso"),S("#ef-clasificacion-wrap",h==="gasto")}function f(g,h,S){const C=document.getElementById("modal-overlay"),w=_t();!C||!w||(w.innerHTML=`<div class="modal-title">${m(h)}</div>${u(g)}`,C.classList.remove("hidden"),U(w,"#ef-tipo",()=>v(w)),U(w,"[data-dp-modo]",()=>Mo(w)),U(w,'[data-reparto-modo="consumo"]',()=>Bt(w,"consumo")),U(w,'[data-reparto-modo="pago"]',()=>Bt(w,"pago")),j(w,"[data-cancelar]",()=>C.classList.add("hidden")),j(w,"[data-guardar]",y=>{b(w,y.getAttribute("data-guardar")||"")&&(C.classList.add("hidden"),S())}))}function b(g,h){const S=z=>{var q;return((q=g.querySelector(z))==null?void 0:q.value)??""},C=z=>{var q;return!!((q=g.querySelector(z))!=null&&q.checked)},w=S("#ef-tipo")||"gasto",y=w==="transferencia",A=S("#ef-concepto").trim(),M=parseFloat(S("#ef-cuantia").replace(",",".")),I=S("#ef-fecha-ini"),E=S("#ef-fecha-fin")||null,P=A?!Number.isFinite(M)||M<=0?"La cuantía debe ser mayor que 0 (el signo lo pone el tipo: gasto o ingreso)":I?E&&E<I?"La fecha de fin no puede ser anterior a la de inicio":y&&S("#ef-cuenta")===(S("#ef-cuenta-dest")||"default")?"En una transferencia, la cuenta de destino tiene que ser distinta de la de origen":"":"Indica la fecha de inicio":"Escribe un concepto";if(P)return R(P,"err"),!1;const _=S("#ef-tags").split(",").map(z=>z.trim()).filter(z=>z&&z!=="transferencia"),x=y?[...new Set([..._,"transferencia"])]:[...new Set(_)],T=S("#ef-clasificacion"),D={concepto:A,tipo:w,cuantia:M,frecuencia:parseInt(S("#ef-frecuencia"),10)||1,tipoFrecuencia:S("#ef-tipo-frec")||"mensual",fechaInicio:I,fechaFin:E,diaPago:Eo(g),cuenta:S("#ef-cuenta"),cuentaDestino:y?S("#ef-cuenta-dest")||"default":void 0,activo:C("#ef-activo"),basico:!y&&C("#ef-basico"),sujetoIRPF:!y&&C("#ef-sujetoIRPF"),clasificacion:w==="gasto"?T||null:void 0,tags:x,repartoConsumo:y?void 0:Ht(g,"consumo"),repartoPago:y?void 0:Ht(g,"pago")};return h?(t.store.updateItem("expenses",h,D),R("Actualizado")):(t.store.addItem("expenses",D),R("Creado")),o(),!0}function $(g,h){const S=g.querySelector("[data-busqueda]");let C;S==null||S.addEventListener("input",()=>{clearTimeout(C),C=setTimeout(()=>{e.busqueda=S.value,h();const w=g.querySelector("[data-busqueda]");w==null||w.focus(),w==null||w.setSelectionRange(w.value.length,w.value.length)},250)}),U(g,"[data-expirados]",w=>{e.mostrarExpirados=w.checked,h()}),U(g,"[data-f-tipo]",w=>{e.tipo=w.value,h()}),U(g,"[data-f-cuenta]",w=>{e.cuenta=w.value,h()}),U(g,"[data-f-desde]",w=>{e.desde=w.value,h()}),U(g,"[data-f-hasta]",w=>{e.hasta=w.value,h()}),j(g,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),j(g,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),j(g,"[data-tag]",w=>{const y=w.getAttribute("data-tag");e.tags.has(y)?e.tags.delete(y):e.tags.add(y),h()}),j(g,"[data-orden]",w=>{const y=w.getAttribute("data-orden");e.orden===y?e.sentido=e.sentido===1?-1:1:(e.orden=y,e.sentido=1),h()}),j(g,"[data-nuevo]",()=>f(null,"Nuevo gasto/ingreso",h)),j(g,"[data-editar]",w=>{const y=t.store.get("expenses").find(A=>A._id===w.getAttribute("data-editar"));y&&f(y,"Editar",h)}),j(g,"[data-duplicar]",w=>{const y=t.store.get("expenses").find(I=>I._id===w.getAttribute("data-duplicar"));if(!y)return;const{_id:A,...M}=y;f({...M,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",h)}),j(g,"[data-borrar]",w=>{nt("¿Eliminar?")&&(t.store.removeItem("expenses",w.getAttribute("data-borrar")),R("Eliminado"),o(),h())}),U(g,"[data-activo]",w=>{const y=w;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:wi,mount(g){const h=()=>l(g);l(g),g.dataset.wired!=="1"&&($(g,h),g.dataset.wired="1")}}}function be(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=vt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function Po(t,a,e,o){return t.reduce((n,s)=>{const i=vt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Si(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:be(i.tabla,a,e)-be(r.tabla,a,e)}})}const Ze=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Ai(t,a){const e=Aa(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?Ma(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?Ea(t.tin||0,i):null,c=o&&n?Si(t,a.periodos,a.hoy):[],d=c.length?be(e.sinAmort.tabla,a.periodos,a.hoy)-be(e.tabla,a.periodos,a.hoy):null,p=d===null?null:d-e.costeTotalAmort,l=s?Po(e.tabla,a.periodos,a.hoy,e.comAp):null,u=s&&o?Po(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Xe(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
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
        ${Ze("Cuota mensual",m(F(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(F(a.cuotaMes))}</div>`:"")}
        ${Ze("Total intereses",m(F(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(F(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ze("Total pagado",m(F(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(wa(e.tae))}</div></div>
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(_e(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(F(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(F(d))}</div>
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

      ${l!==null?Mi(t,e.totalPagado,l,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>Ei(v,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,f)=>_i(t._id,v,c[f]??null)).join("")}`:""}
    </div>
  </div>`}function Mi(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(F(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(F(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(F(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(F(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(F(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Ei(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=vt(e.periodos,e.hoy,t.fecha);o=m(F(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(F(t.interes))}</td>
    <td class="num">${m(F(t.amortizacion))}</td>
    <td class="num">${m(F(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function _i(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
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
  </div>`}const et=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,se=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,ie=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,Pi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Fi(t,a,e,o=K()){return`
    <div class="grid-2">
      ${et("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${et("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${et("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${et("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${et("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Pi(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Ao(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${se("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${et("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${et("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${ie("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Ot("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Ot("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ie("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ie("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ie("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Di(t,a,e=K()){return`
    <div class="grid-2">
      ${et("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${et("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${se("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${ie("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Ti="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function zi(t){const a=t.hoy??K;let e=!1;const o=new Set;let n=null;const s=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)};function i(y){const A=y.filter(I=>I.activo);if(A.length<2)return"";const M=(I,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${n===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${M(null,"Todas")}
      ${A.map(I=>M(I._id,I.nombre)).join("")}
    </div>`}function r(y){if(!y.activo||y.simulacion)return!1;const A=X(y).tabla.filter(M=>!M.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c(y,A){const M=a(),I=M.slice(0,7),E=new Map;let P=0;for(const _ of y){if(!_.activo||_.simulacion||A.has(_._id)||(_.fechaInicio||"")>M)continue;const x=X(_).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(I)),T=x.length>0?x[0].cuota:0;E.set(_._id,T),P+=T}return{porLoan:E,total:P,activos:[...E.values()].filter(_=>_>0).length}}function d(y){const A=a().slice(0,7),M=[];for(const I of y){if(!I.activo||I.simulacion)continue;const E=X(I).tabla.filter(_=>!_.esAmortizacion),P=E[E.length-1];P&&P.fecha.slice(0,7)===A&&M.push({loan:I,cuota:P.cuota})}return M}function p(y){return y.length<=1?y[0]??"":`${y.slice(0,-1).join(", ")} y ${y[y.length-1]}`}function l(y){const A=t.store.get("config"),M=A.dashboardStart,I=A.dashboardEnd,E=Math.max(1,(O(I).getTime()-O(M).getTime())/(30.44*864e5));let P=0;for(const _ of y)!_.activo||_.simulacion||(P+=X(_).tabla.filter(x=>!x.esAmortizacion&&x.fecha>=M&&x.fecha<=I).reduce((x,T)=>x+T.cuota,0));return{media:P/E,desde:M,hasta:I}}function u(y){const A=t.store.get("personas"),M=ue(A),I=[...t.store.get("loans")].sort((N,B)=>B.tin-N.tin),E=n?I.filter(N=>De(N.repartoConsumo,N.repartoPago,M).has(n)):I,P=new Set(E.filter(r).map(N=>N._id)),_=e?E:E.filter(N=>!P.has(N._id)),x=c(I,new Set(I.filter(r).map(N=>N._id))),T=l(I),D=d(I),z=t.store.get("config"),q=t.store.get("inflacion"),L=new Date(O(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${P.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${P.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${m(p(D.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(F(D.reduce((N,B)=>N+B.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${x.total>0||T.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${x.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(L)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(F(x.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${x.activos} préstamo${x.activos!==1?"s":""} activo${x.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${T.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(F(T.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(T.desde)} → ${m(T.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${_.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':_.map(N=>Ai(N,{periodos:q,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:x.porLoan.get(N._id)??0,completado:P.has(N._id),personas:A})).join("")}
      </div>`;for(const N of y.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),f=()=>_t(),b=()=>{var y;return(y=v())==null?void 0:y.classList.add("hidden")};function $(y,A){const M=v(),I=f();return!M||!I?null:(I.innerHTML=`<div class="modal-title">${m(y)}</div>${A}`,M.classList.remove("hidden"),j(I,"[data-cancelar]",b),I)}function g(y,A){const M=y?t.store.get("loans").find(E=>E._id===y)??null:null,I=$(y?"Editar préstamo":"Nuevo préstamo",Fi(M,t.store.get("accounts"),t.store.get("personas"),a()));I&&(I.addEventListener("change",E=>{const P=E.target;P!=null&&P.matches("[data-dp-modo]")&&Mo(I),P!=null&&P.matches('[data-reparto-modo="consumo"]')&&Bt(I,"consumo"),P!=null&&P.matches('[data-reparto-modo="pago"]')&&Bt(I,"pago")}),j(I,"[data-guardar-loan]",E=>{h(I,E.getAttribute("data-guardar-loan")||"")&&(b(),A())}))}function h(y,A){const M=D=>{var z;return((z=y.querySelector(D))==null?void 0:z.value)??""},I=D=>{var z;return!!((z=y.querySelector(D))!=null&&z.checked)},E=M("#f-nombre").trim(),P=parseFloat(M("#f-capital")),_=parseFloat(M("#f-tin")),x=parseInt(M("#f-meses"),10);if(!E||!Number.isFinite(P)||!Number.isFinite(_)||!Number.isFinite(x))return R("Completa los campos obligatorios","err"),!1;const T={nombre:E,capital:P,tin:_,meses:x,fechaInicio:M("#f-fecha"),comisionApertura:parseFloat(M("#f-com-ap"))||0,comisionAmort:parseFloat(M("#f-com-am"))||0,diaPago:Eo(y),cuenta:M("#f-cuenta"),simulacion:I("#f-sim"),activo:I("#f-activo"),mostrarFechaFinEnDashboard:I("#f-mostrar-fin"),tipoTasa:M("#f-tipo-tasa"),basico:I("#f-basico"),tags:M("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Ht(y,"consumo"),repartoPago:Ht(y,"pago")};return A?(t.store.updateItem("loans",A,T),R("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),R("Préstamo creado")),s(),!0}function S(y,A,M){const I=t.store.get("loans").find(_=>_._id===y);if(!I)return;const E=A?(I.amortizaciones||[]).find(_=>_._id===A)??null:null,P=$(A?"Editar amortización":"Añadir amortización",Di(y,E,a()));P&&j(P,"[data-guardar-amort]",_=>{const[x,T]=(_.getAttribute("data-guardar-amort")||"").split("|");C(P,x,T)&&(b(),M([x]))})}function C(y,A,M){var z;const I=q=>{var L;return((L=y.querySelector(q))==null?void 0:L.value)??""},E=I("#am-fecha"),P=parseFloat(I("#am-cant"));if(!E||!Number.isFinite(P)||P<=0)return R("Fecha y cantidad requeridas","err"),!1;const _=t.store.get("loans").find(q=>q._id===A);if(!_)return!1;const x={fecha:E,cantidad:P,tipo:I("#am-tipo"),simulacion:!!((z=y.querySelector("#am-sim"))!=null&&z.checked)},T=_.amortizaciones||[],D=M?T.map(q=>q._id===M?{...q,...x}:q):[...T,{_id:Date.now().toString(36),...x}];return t.store.updateItem("loans",A,{amortizaciones:D}),R(M?"Amortización actualizada":"Amortización añadida"),s(),!0}function w(y,A){j(y,"[data-toggle-finalizados]",()=>{e=!e,A()}),j(y,"[data-persona-tab]",M=>{n=M.getAttribute("data-persona-tab")||null,A()}),j(y,"[data-nuevo-loan]",()=>g(null,A)),j(y,"[data-toggle-loan]",(M,I)=>{var x;if((x=I.target)!=null&&x.closest("button"))return;const E=M.getAttribute("data-toggle-loan"),P=[...y.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===E);(P==null?void 0:P.classList.toggle("open"))?o.add(E):o.delete(E)}),j(y,"[data-editar-loan]",M=>g(M.getAttribute("data-editar-loan"),A)),j(y,"[data-borrar-loan]",M=>{if(!nt("¿Eliminar préstamo?"))return;const I=M.getAttribute("data-borrar-loan");t.store.removeItem("loans",I),o.delete(I),R("Eliminado"),s(),A()}),j(y,"[data-amort-loan]",M=>{const I=M.getAttribute("data-amort-loan");o.add(I),S(I,null,A)}),j(y,"[data-editar-amort]",M=>{const[I,E]=(M.getAttribute("data-editar-amort")||"").split("|");o.add(I),S(I,E,A)}),j(y,"[data-borrar-amort]",M=>{const[I,E]=(M.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(_=>_._id===I);P&&(t.store.updateItem("loans",I,{amortizaciones:(P.amortizaciones||[]).filter(_=>_._id!==E)}),R("Amortización eliminada"),s(),A([I]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Ti,mount(y){const A=(M=[])=>{for(const I of M)o.add(I);u(y)};u(y),y.dataset.wired!=="1"&&(w(y,A),y.dataset.wired="1")}}}const ta=6.35;function Gt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function Fo(t){return Math.max(0,(t.bruto||0)-Gt(t))}function ji(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function qi(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Gt(r),0),o=Math.max(0,a-e),n=yt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Fo(i)/o):0);return s}function Do(t,a,e){if(t.irpfModo==="manual")return Fo(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return dt(yt(t.bruto||0,Gt(t)),e);const o=ji(a.filter(i=>i.irpfModo!=="manual")),n=qi(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return dt(s+r,e)-dt(s,e);s+=r}return dt(yt(t.bruto||0,Gt(t)),e)}function Ni(t,a){return t.reduce((e,o)=>e+Do(o,t,a),0)}function Ri(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function Li(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Gt(s),0);return Ri(yt(e,o),a)}function ki(t,a,e){const o=t.bruto||0,n=Gt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??ta,c=s*(r/100),d=Do(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:d,irpfPct:s>0?d/s*100:0,netoPorPaga:(s-c-d)/i}}function Oi(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const Bi={transporte:125,restaurante:220,otros:null},Hi={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Gi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Vt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Vi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Ui(t,a){const e=t.map((s,i)=>{const r=a.find(p=>p._id===s.cuenta),c=Bi[s.tipo],d=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(Hi[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(F(s.importe))}/mes${d?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(F(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Yi(t,a){const e=a.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Vt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Vt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Vi(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Vt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Vt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Vt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Gi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
          ${Vt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
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
        ${Ot("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Ot("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function To(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ta),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:Ht(t,"consumo"),repartoPago:Ht(t,"pago")}}function Wi(t,a,e,o){const n=To(t,a),s=a.reduce((g,h)=>g+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):dt(yt(n.bruto,s),e.tramos),d=i-r-c,p=i/n.nPagas,l=r/n.nPagas,u=c/n.nPagas,v=p-l-u,f=n.grupoNomina?e.nominas.filter(g=>g.grupoNomina===n.grupoNomina&&g._id!==o):[],b=f.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(f.map(g=>g.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",$=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(F(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(F(n.bruto))}</span>
      ${$}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(F(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(F(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(F(d))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(F(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(F(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(F(v))}/paga`:`ingreso ${m(F(p))} − SS ${m(F(l))} − IRPF ${m(F(u))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function Ki(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Ui(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Wi(t,a,e,o))},i=()=>{var c,d;const r=(p,l)=>{const u=t.querySelector(p);u&&(u.style.display=l?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((d=t.querySelector("#nf-irpfmodo"))==null?void 0:d.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>Bt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>Bt(t,"pago")),j(t,"[data-flex-anadir]",()=>{var d,p,l;const r=((d=t.querySelector("#fc-tipo"))==null?void 0:d.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((l=t.querySelector("#fc-cuenta"))==null?void 0:l.value)||""}),n(),s()}),j(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const zo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ji(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>_t(),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ht;function r(u,v){const f=o(),b=n();return!f||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,f.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(zo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(zo(b.tramos))}</span>
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
      </div>`);f&&(j(f,"[data-editar-tabla]",b=>{const $=b.getAttribute("data-editar-tabla");l($==="default"?"default":Number($))}),j(f,"[data-borrar-tabla]",b=>{const $=Number(b.getAttribute("data-borrar-tabla"));nt(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(g=>g.año!==$)),R(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),j(f,"[data-anadir-anyo]",()=>{var g;const b=parseInt(((g=f.querySelector("#irpf-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const $=t.store.get("tramosIRPFHistorico");if($.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),l(b)}))}function d(){return e.map(([u,v],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${f}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${f}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((f,b)=>{const $=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(f.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function l(u){var h;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((h=v.find(S=>S.año===u))==null?void 0:h.tramos)??i()).map(S=>[...S]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,$=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${d()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!$)return;const g=()=>{const S=$.querySelector("#irpf-tramos-rows");S&&(S.innerHTML=d())};j($,"[data-volver]",c),j($,"[data-tr-anadir]",()=>{p($),e.push([0,0]),g()}),j($,"[data-tr-borrar]",S=>{p($),e.splice(Number(S.getAttribute("data-tr-borrar")),1),g()}),j($,"[data-tr-guardar]",()=>{p($);const S=[...e].sort((C,w)=>C[0]-w[0]);if(S.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:S}),R("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(C=>C.año===a?{...C,tramos:S}:C)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const jo=1500,Pt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Qi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,Xi=t=>(t.modeloFondo||"cuenta")==="pension";function Zi(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>tr(n,a,e,o)).join("")}</div>`}function tr(t,a,e,o){const n=ze(t);if(!n)return"";const s=je(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(d=>d.fecha>=`${i}-01-01`).reduce((d,p)=>d+p.cantidad,0),c=Math.min(r,jo)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(F(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${m(F(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>jo?"neg":""}">${m(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(n.proxDesbloqueo)}</div>`:""}
  </div>`}function er(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ar(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Pt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Pt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Pt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Pt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Pt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Qi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Pt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${Pt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    </div>`}function or(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=er(a))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function nr(t,a,e,o){var $;const n=g=>{var h;return((h=t.querySelector(g))==null?void 0:h.value)??""},s=(g,h=0)=>{const S=parseFloat(n(g));return Number.isFinite(S)?S:h},i=g=>{var h;return!!((h=t.querySelector(g))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),d=n("#pen-grupo"),p={nombre:r,grupoNomina:d,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:d?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},l=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],f=(($=[...l].sort((g,h)=>h.fecha.localeCompare(g.fecha))[0])==null?void 0:$.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(f===null||Math.abs(c-f)>.005)&&(l.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(f??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(f??0)})):c>0&&(l.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:l,aportaciones:u}}}const sr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function ir(t){const a=t.hoy??K,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const S=h.filter(w=>w.activo);if(S.length<2)return"";const C=(w,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":m(w)}"
               style="${o===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(y)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${C(null,"Todas")}
      ${S.map(w=>C(w._id,w.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Tt(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??ht)(Number(a().slice(0,4)))}function i(h,S,C){const w=ki(h,S,C),y=!!S&&h.irpfModo!=="manual",A=Xe(h.repartoConsumo,h.repartoPago,t.store.get("personas")),M=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",w.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(F(w.flexAnual))}/año</span>`:"",Math.abs(w.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${w.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${M}</div>
      </div>
      <div class="num">${m(F(w.brutoAnual))}
        ${w.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(F(w.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(F(w.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${w.nPagas} pagas</div>
      <div class="text-sm ${y?"neg":""}">${h.irpfModo==="manual"?`${m(h.irpfPct??0)}% (manual)`:`${w.irpfPct.toFixed(1)}% (auto)`}${y?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var S;return((S=t.store.get("accounts").find(C=>C._id===(h||"default")))==null?void 0:S.nombre)??(h||"default")};function c(h,S,C){const w=S.reduce((M,I)=>M+(I.bruto||0),0),y=Ni(S,C),A=w>0?y/w*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(F(w))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(F(y))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${S.map(M=>i(M,S,C)).join("")}
      </div>
    </div>`}function d(h){const S=s(),C=t.store.get("personas"),w=ue(C),y=[...t.store.get("nominas")].sort((_,x)=>(x.bruto||0)-(_.bruto||0)),A=o?y.filter(_=>De(_.repartoConsumo,_.repartoPago,w).has(o)):y,{grupos:M,sueltas:I}=Oi(A),E=t.store.get("accounts").filter(Xi),P=y.filter(_=>_.activo!==!1);h.innerHTML=`
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
      ${A.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...M.entries()].map(([_,x])=>c(_,x,S)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(_=>i(_,null,S)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Zi(E,P,S,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),l=()=>_t(),u=()=>{var h;return(h=p())==null?void 0:h.classList.add("hidden")};function v(h,S){const C=p(),w=l();return!C||!w?null:(w.innerHTML=`<div class="modal-title">${m(h)}</div>${S}`,C.classList.remove("hidden"),j(w,"[data-cancelar]",u),w)}function f(h,S){const C=h?t.store.get("nominas").find(M=>M._id===h)??null:null,w=[...(C==null?void 0:C.retribucionFlexible)??[]].map(M=>({...M})),y={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},A=v(h?"Editar nómina":"Nueva nómina",Yi(C,y));A&&(Ki(A,w,y,h??""),j(A,"[data-guardar-nomina]",M=>{const I=To(A,w);if(!I.nombre||I.bruto<=0)return R("Nombre y bruto anual son obligatorios","err");const E=M.getAttribute("data-guardar-nomina")||"",P={...I,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,P),R("Nómina actualizada")):(t.store.addItem("nominas",P),R("Nómina creada")),e(),u(),S()}))}function b(h,S){const C=h?t.store.get("accounts").find(A=>A._id===h)??null:null,w=[...(C==null?void 0:C.planAportaciones)??[]].map(A=>({...A})),y=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",ar(C,{nominas:t.store.get("nominas"),hoy:a()}));y&&(or(y,w,a()),j(y,"[data-guardar-pension]",A=>{const{datos:M,error:I}=nr(y,w,C,a());if(I)return R(I,"err");const E=A.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,M),R("Plan actualizado")):(t.store.addItem("accounts",M),R("Plan creado")),e(),u(),S()}))}function $(h,S,C){j(h,"[data-persona-tab]",w=>{o=w.getAttribute("data-persona-tab")||null,S()}),j(h,"[data-nueva-nomina]",()=>f(null,S)),j(h,"[data-editar-nom]",w=>f(w.getAttribute("data-editar-nom"),S)),j(h,"[data-borrar-nom]",w=>{nt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",w.getAttribute("data-borrar-nom")),R("Eliminada"),e(),S())}),U(h,"[data-activo-nom]",w=>{const y=w;t.store.updateItem("nominas",y.getAttribute("data-activo-nom"),{activo:y.checked}),e(),S()}),j(h,"[data-tramos]",()=>C.abrir()),j(h,"[data-nueva-pension]",()=>b(null,S)),j(h,"[data-editar-pension]",w=>b(w.getAttribute("data-editar-pension"),S)),j(h,"[data-borrar-pension]",w=>{nt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",w.getAttribute("data-borrar-pension")),R("Plan eliminado"),e(),S())})}let g=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:sr,mount(h){const S=()=>d(h);g??(g=Ji({store:t.store,onDatosCambiados:()=>{e(),S()},año:()=>Number(a().slice(0,4))})),d(h),h.dataset.wired!=="1"&&($(h,S,g),h.dataset.wired="1")}}}const rr="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",cr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",qo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},lr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function dr(t,a){const e=t.filter(c=>c.activo&&rt(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const d=pe(c,a);d&&(o+=d.saldo,n+=d.costBase,s+=d.plusvalia,i+=d.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(F(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(F(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${m(F(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(F(i))}</div><div class="stat-sub">Neto: ${m(F(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function ur(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(O(o).getTime()-O(e).getTime())/(30.44*864e5)),s=Kt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(vt(a.inflacion,e,o)-1),d=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(F(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${d>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(F(d))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(F(i))}</span>
    </div>${r}
  </div>`}function pr(t,a){const e=qo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(f=>f.cuenta===t._id).map(f=>({nomina:v,importe:f.importe}))),s=n.reduce((v,f)=>v+f.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,d=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),p=Li(d,a.tramosIRPF),l=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(F(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(F(i))}/año${r?` ⚠ excede límite ${m(F(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(F(o))}/año</span></div>`:""}
    ${l>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(F(l))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(F(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function mr(t){const a=ze(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(F(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(F(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function fr(t,a){const e=pe(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=O(o.dashboardStart),i=O(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,d=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+d,r)):Math.max(0,c),l=e.costBase+n.totalAportaciones,u=Math.max(0,p-l),v=Te(u,a.tramosGanancias),f=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",$=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",g=(A,M,I)=>A.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${M} ${m(E.contraparte)}: ${m(E.concepto)}</span>
          <span class="num ${I}">${m(F(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),S=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${g(n.entradas,"↓","pos")}
         ${g(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(F(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(F(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(F(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',C=a.invModo(t._id),w=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=C==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(F(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(F(e.neto))}</div><div class="stat-sub">${m($)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(F(l))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(F(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(F(p-v))}</div><div class="stat-sub">${m(f)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${w(C==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${w(C==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${S}
    </div>`}function gr(t,a){const e=[...t.historicoSaldos||[]].sort((c,d)=>d.fecha.localeCompare(c.fecha)),o=e[0],n=bt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((qo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${cr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${rr}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(F(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(F(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${ur(t,a)}
    ${s==="beneficio"?pr(t,a):""}
    ${s==="pension"?mr(t):""}
    ${s==="inversion"?fr(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const vr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function br(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function hr(t,a){const e=t?rt(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${et("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${se("ac-modelo","Tipo",vr,e)}
    </div>
    <div class="grid-2 mt-8">
      ${et("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${et("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${et("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${et("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${se("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${se("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function yr(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=br(a))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const d=t.querySelector(r);d&&(d.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function $r(t,a,e,o,n){const s=f=>{var b;return((b=t.querySelector(f))==null?void 0:b.value)??""},i=(f,b=0)=>{const $=parseFloat(s(f));return Number.isFinite($)?$:b},r=f=>{var b;return!!((b=t.querySelector(f))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const d=s("#ac-modelo")||"cuenta",p=d==="beneficio",l=i("#ac-saldo"),u={nombre:c,saldo:l,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:d,planAportaciones:a,tipoBeneficio:p?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&l<=0)return{datos:u};if(!(o===null||Math.abs(l-o)>.005))return{datos:u};if(d==="inversion"&&l>(o??0)){const f=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${f}a`,fecha:e?n:u.fechaInicialSaldo??n,cantidad:l-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:l,nota:e?"Actualización manual":"Saldo inicial"}}}function ea(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:J(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function xr(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
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
    </div>`}const No=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function wr(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>_t(),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Jt;function r(u,v){const f=o(),b=n();return!f||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,f.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(No(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(No(b.tramos))}</span>
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
      </div>`);f&&(j(f,"[data-editar-tg]",b=>{const $=b.getAttribute("data-editar-tg");l($==="default"?"default":Number($))}),j(f,"[data-borrar-tg]",b=>{const $=Number(b.getAttribute("data-borrar-tg"));nt(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(g=>g.año!==$)),R(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),j(f,"[data-anadir-anyo-tg]",()=>{var g;const b=parseInt(((g=f.querySelector("#tg-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return R("Año inválido","err");const $=t.store.get("tramosGananciasCapitalHistorico");if($.some(h=>h.año===b))return R("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),l(b)}))}function d(){return e.map(([u,v],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${f}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${f}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,f)=>{const b=u.querySelector(`[data-tg-pct="${f}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function l(u){var g;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((g=v.find(h=>h.año===u))==null?void 0:g.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${d()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const $=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=d())};j(b,"[data-volver-tg]",c),j(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),$()}),j(b,"[data-tg-borrar]",h=>{p(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),$()}),j(b,"[data-tg-guardar]",()=>{p(b);const h=[...e].sort((S,C)=>S[0]-C[0]);if(h.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),R("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(S=>S.año===a?{...S,tramos:h}:S)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Ir=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Cr(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Ir.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Sr(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Ro(t,a){const e=O(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Ar(t,a,e){const o=Ro(e,1)[0],n=a.slice(0,7)<o?a.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function aa(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Mr(t,a){const{inicio:e,fin:o}=aa(a);return oa(t,e,o)}function oa(t,a,e){return Qt([t],{start:a,end:e}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function Er(t,a){const{inicio:e,fin:o}=aa(a);return de(t.fechaInicio,t.fechaFin,e,o)}function _r(t){function a(n,s={}){var P;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:d,hasta:p}=s,l=t.transacciones({estimacionId:n._id}),v=l.length===0&&(((P=n.tags)==null?void 0:P.length)??0)>0?t.transacciones({tags:n.tags}):l,f=d&&p?Ar(d,p,c):Ro(c,i),b=new Map(f.map(_=>{const{inicio:x,fin:T}=aa(_);return[_,{inicio:d&&d>x?d:x,fin:p&&p<T?p:T}]})),$=new Map;for(const _ of v){const x=b.get(_.fecha.slice(0,7));if(!x||_.fecha<x.inicio||_.fecha>x.fin)continue;const T=_.fecha.slice(0,7);$.set(T,($.get(T)??0)+Math.abs(_.importeCts)/100)}const g=[];for(const _ of f){const x=$.get(_);if(x===void 0||!Er(n,_))continue;const T=b.get(_),D=G(oa(n,T.inicio,T.fin));g.push({mes:_,estimado:D,real:G(x),desviacion:G(x-D),precision:Sr(D,x)})}const h=G(g.reduce((_,x)=>_+x.estimado,0)),S=G(g.reduce((_,x)=>_+x.real,0)),C=g.reduce((_,x)=>_+Math.abs(x.estimado),0),w=g.length===0?null:C>0?g.reduce((_,x)=>_+x.precision*Math.abs(x.estimado),0)/C:g.reduce((_,x)=>_+x.precision,0)/g.length,y=g.slice(-r),A=y.length>0?G(y.reduce((_,x)=>_+x.real,0)/y.length):null,M=y.reduce((_,x)=>_+x.estimado,0),I=y.reduce((_,x)=>_+x.real,0),E=M>0?I/M:null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:g,estimadoTotal:h,realTotal:S,desviacionTotal:G(S-h),precision:w,mediaRealReciente:A,factorReciente:E,infraestimada:S>h}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:G(r.estimado),realTotal:G(r.real),desviacionTotal:G(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Pr(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Fr(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function Dr(t,a,e,o){const n=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return Fr(e,o).map(r=>{const c={desde:`${r}-01`,hasta:Pr(r)},d=b=>G(t.transacciones({...c,tipo:b}).reduce(($,g)=>$+Math.abs(g.importeCts)/100,0)),p=b=>G(b.reduce(($,g)=>$+Mr(g,r),0)),l=p(s),u=d("gasto"),v=p(i),f=d("ingreso");return{mes:r,estimado:l,real:u,ingresosEstimados:v,ingresosReales:f,netoEstimado:G(v-l),netoReal:G(f-u)}})}const he=640,Ut=200,Q={top:14,right:16,bottom:26,left:54};function Tr(t){return ve(t).slice(0,3)}const zr={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function jr(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=zr[a],o=t.flatMap($=>[e($).estimado,e($).real]),n=he-Q.left-Q.right,s=Ut-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,d=$=>Q.left+(t.length===1?n/2:$/(t.length-1)*n),p=$=>Q.top+s-($-r)/c*s,l=t.map(($,g)=>`${d(g)},${p(e($).estimado)}`).join(" "),u=t.map(($,g)=>`${d(g)},${p(e($).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${p(0).toFixed(1)}" x2="${he-Q.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",f=t.map(($,g)=>`<circle cx="${d(g).toFixed(1)}" cy="${p(e($).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(ve($.mes))}: ${m(F(e($).real))}</title></circle>`).join(""),b=t.map(($,g)=>`<text x="${d(g).toFixed(1)}" y="${Ut-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(Tr($.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${he} ${Ut}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${Ut-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${Ut-Q.bottom}" x2="${he-Q.right}" y2="${Ut-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Q.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(F(i))}</text>
      ${v}
      <polyline points="${l}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${f}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const Lo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},qr=[25,50,100,250,0];function Nr(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Oo(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:re(Oo(t,5)).desde,intervaloHasta:re(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function ko(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const n=Math.max(1,Math.ceil(o/e)),s=Math.min(Math.max(1,a),n),i=(s-1)*e;return{pagina:t.slice(i,i+e),actual:s,paginas:n,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function ye(t,a,e){if(t.total===0)return"";const o=(s,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${s}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,n=qr.map(s=>`<option value="${s}"${s===a?" selected":""}>${s===0?"todos":`${s} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${m(e)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${n}</select>
      </div>
    </div>`}function na(t,a,e,o){const n=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function re(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Oo(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function sa(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:re(e).desde,hasta:re(o).hasta}}function Rr(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function ia(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Lr(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function kr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(F(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(F(J(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(F(J(t.diferenciaCts)))}</strong></span>
    </div>`}function Or(t,a){const{ledger:e}=t,o=(t.hoy??K)(),n=t.accounts().filter(x=>x.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?sa(a.periodoDesde,a.periodoHasta):i?Rr(a.intervaloDesde,a.intervaloHasta):re(a.mes),d={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(d),l=t.estimaciones().filter(x=>x.tipo!=="transferencia"),u=[...l.map(x=>({_id:x._id,etiqueta:`${m(x.concepto)} (${m(F(x.cuantia))})`})),...t.loans().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Préstamo: ${m(x.nombre)}`})),...t.nominas().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Nómina: ${m(x.nombre)}`}))],v=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts<0).reduce((x,T)=>x+T.importeCts,0),f=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts>0).reduce((x,T)=>x+T.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),$=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),g=n.map(x=>`<option value="${m(x._id)}"${x._id===a.cuentaId?" selected":""}>${m(x.nombre)}</option>`).join(""),h=x=>'<option value="">— sin asignar —</option>'+u.map(T=>`<option value="${m(T._id)}"${T._id===x?" selected":""}>${T.etiqueta}</option>`).join(""),S=x=>Object.keys(Lo).map(T=>`<option value="${T}"${T===x?" selected":""}>${Lo[T]}</option>`).join(""),C=ko(p,a.pagina,a.porPagina),w=new Map(t.accounts().map(x=>[x._id,x.nombre])),y=C.pagina.map(x=>`
      <tr data-tx="${m(x._id)}" style="border-bottom:1px solid var(--border)${x.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(x.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(x.concepto)}</td>
        <td style="padding:7px 8px">${Co(x.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(w.get(x.cuentaId)??x.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(x._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${S(x.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(x._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(x.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(x.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(x._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(x._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),A=i?Dr(e,l,r,c):[],M=s?e.transacciones({desde:r,hasta:c}):[],I=s?ia(p):[],E=ko(I,a.pagina,a.porPagina),P=E.pagina.map(x=>{const T=a.detalleAbierto.has(x.concepto),D=T?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${Co(x.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(x.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(x.concepto)}">Asignar</button>
               </div>
               ${kr(Lr(x,M))}
             </td>
           </tr>`:"",z=T?x.movimientos.map(q=>{var L;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(q.fecha)}</span> · ${m(((L=t.accounts().find(N=>N._id===q.cuentaId))==null?void 0:L.nombre)??q.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(q._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(q.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${It(J(q.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(x.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(x.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${T?"▾":"▸"}</button>
          <span style="font-size:13px">${m(x.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${x.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(x.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${x.movimientos.length} movimientos del grupo de golpe">${h(x.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${It(J(x.total))}</td>
        <td></td>
      </tr>${D}${z}`}).join(""),_=$.slice().reverse().slice(0,8).map(x=>{var T;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(x.fecha)}</span>
        <span style="color:var(--text3)">${m(((T=t.accounts().find(D=>D._id===x.cuentaId))==null?void 0:T.nombre)??x.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(F(J(x.saldoCts)))}</span>
        ${x.nota?`<span style="color:var(--text3)">${m(x.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(x._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${g}</select>
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
          <span>Gastos: ${It(J(v))}</span>
          <span>Ingresos: ${It(J(f))}</span>
          <span>Neto: ${It(J(f+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(F(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${ye(E,a.porPagina,"conceptos")}
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
                     ${P||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ye(E,a.porPagina,"conceptos")}`:`${ye(C,a.porPagina,"movimientos")}
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
                     ${y||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ye(C,a.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${na("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${na("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${na("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${jr(A,a.comparativa)}`:""}`}
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${g}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(x=>`<option value="${m(x)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${g}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${_?`<div class="mt-12">${_}</div>`:""}
        </div>
      </div>
    </div>`}function Br(t,a,e,o){const{ledger:n}=a,s=()=>{e.pagina=1,o()};U(t,"#acc-cuenta",r=>{e.cuentaId=r.value,s()}),U(t,"#acc-mes",r=>{e.mes=r.value||e.mes,s()}),j(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",s()}),U(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,s()}),U(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,s()}),j(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),U(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),j(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,s()}),U(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,s()}),j(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),U(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),d=r.value||null,{desde:p,hasta:l}=sa(e.periodoDesde,e.periodoHasta),u=n.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:l,texto:e.filtroTexto||void 0}),v=ia(u).find(f=>f.concepto===c);if(v){for(const f of v.movimientos)n.asignarEstimacion(f._id,d);R(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),j(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),d=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,p=((d==null?void 0:d.value)??"").split(",").map($=>$.trim().toLowerCase()).filter(Boolean);if(p.length===0)return R("Escribe al menos una etiqueta","err");const{desde:l,hasta:u}=sa(e.periodoDesde,e.periodoHasta),v=n.transacciones({cuentaId:e.cuentaId||void 0,desde:l,hasta:u,texto:e.filtroTexto||void 0}),f=ia(v).find($=>$.concepto===c);if(f){for(const $ of f.movimientos)n.actualizar($._id,{tags:[...new Set([...$.tags,...p])]});R(`Etiquetas añadidas a ${f.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{s();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),j(t,"#nt-guardar",()=>{const r=lt(t,"#nt-concepto").trim(),c=So(t,"#nt-importe");if(!r)return R("Indica un concepto","err");if(!(c>0))return R("Indica un importe mayor que cero","err");const d=lt(t,"#nt-tags").split(",").map(p=>p.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:lt(t,"#nt-fecha")||(a.hoy??K)(),cuentaId:lt(t,"#nt-cuenta"),importe:c,concepto:r,tags:d,tipo:lt(t,"#nt-tipo"),estimacionId:lt(t,"#nt-estimacion")||null}),R("Movimiento registrado"),a.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;nt("¿Eliminar este movimiento?")&&(n.eliminar(c),R("Movimiento eliminado"),a.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,d=n.transacciones().find(u=>u._id===c);if(!d)return;const p=window.prompt(`Importe de "${d.concepto}" (€)`,String(Math.abs(J(d.importeCts))));if(p===null)return;const l=parseFloat(p.replace(",","."));if(!Number.isFinite(l)||l<=0)return R("Importe no válido","err");n.actualizar(c,{importe:l}),R("Movimiento actualizado"),a.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");n.asignarEstimacion(c,r.value||null),R("Asignación actualizada"),a.onDatosCambiados()}),U(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");n.actualizar(c,{tipo:r.value}),R("Tipo actualizado"),a.onDatosCambiados(),o()}),j(t,"#pc-guardar",()=>{if(lt(t,"#pc-saldo").trim()==="")return R("Indica el saldo","err");const c=So(t,"#pc-saldo");n.registrarPuntoControl(lt(t,"#pc-cuenta"),lt(t,"#pc-fecha")||(a.hoy??K)(),c,lt(t,"#pc-nota").trim()||void 0),R("Saldo real registrado"),a.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",r=>{nt("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(r.dataset.pcBorrar),R("Punto de control eliminado"),a.onDatosCambiados(),o())})}function ra(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const s=G(a*t.factorReciente),i=G(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:G(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Hr(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??K(),d=t.get("expenses"),p=d.find(f=>f._id===s);if(!p)throw new Error(`La estimación ${s} no existe`);const l={...p,fechaFin:c},u={...p,_id:a(),cuantia:G(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=d.map(f=>f._id===s?l:f);return v.push(u),t.set("expenses",v),{estimacionCerrada:l,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const d of s)try{r.push(e(d.estimacionId,d.cuantiaSugerida,i))}catch(p){c.push({estimacionId:d.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const d=[];let p=c;const l=new Set;for(;p!=null&&p.ajustadaDesdeId&&!l.has(p._id);){l.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;d.unshift(b),p=b}const u=[];let v=c;const f=new Set([c._id]);for(;;){const b=i.find($=>$.ajustadaDesdeId===v._id&&!f.has($._id));if(!b)break;f.add(b._id),u.push(b),v=b}return[...d,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Bo(t){var n;const a=t.estimaciones(),e=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(a.map(s=>[s._id,s]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:ra(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function Gr(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Vr(t){var r;const a=Bo(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(r=t.rango)!=null&&r.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const s=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${It(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${pi(c.precision)}</td>
      </tr>`).join(""),i=(c,d="left")=>`<th style="padding:7px 8px;text-align:${d};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Gr(t)}
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
    </div>`}function Ur(t,a,e){j(t,"#ajustar-todas",()=>{const o=Bo(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!nt(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});R(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Yr=[";",",","	","|"],Wr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function $e(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function xe(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Kr(t){let a=";",e=-1;for(const o of Yr){const n=t.slice(0,20).map(c=>xe(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function ce(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const p=s===","?o:n;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),d=Number(i||"0")*100+Number(c);return Number.isFinite(d)?e?-d:d:null}function ca(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return Ho(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),Ho(o,Number(e[2]),Number(e[1]))}return null}function Ho(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Go(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ca(e)!==null).length/a.length}function Vo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ce(e)!==null).length/a.length}function Jr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=$e(t[i]);if(r&&Wr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&$e(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Go(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||$e(t[r]).includes("saldo"))continue;const c=Vo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(Vo(c)>.5||Go(c)>.5)continue;const d=c.reduce((p,l)=>p+l.length,0)/Math.max(1,c.length);d>i&&(i=d,s=r)}s>=0&&(e.concepto=s)}return e}function Qr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Kr(a),o=a.map(p=>xe(p,e).length),n=Math.max(...o);let s=o.findIndex(p=>p===n);s<0&&(s=0);const i=xe(a[s],e);let r=a.slice(s+1).map(p=>xe(p,e));const c=ca(i[0]??"")!==null||i.some(p=>ce(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const d=Jr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,l)=>`Columna ${l+1}`):i,filas:r,lineaCabecera:s+1,mapeo:d}}function Uo(t,a,e){return`${t}|${a}|${$e(e).replace(/\s+/g," ")}`}function Xr(t,a,e=[]){const o=new Map;for(const s of e){const i=Uo(s.fecha,s.importeCts,s.concepto);o.set(i,(o.get(i)??0)+1)}const n=new Map;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?ca(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let d=null;if(a.importe>=0)d=ce(s[a.importe]??""),d===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?ce(s[a.debe]??""):null,v=a.haber>=0?ce(s[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?d=-Math.abs(u):v!==null&&v!==0?d=Math.abs(v):d=0}else r.push("sin columna de importe");d===0&&r.push("importe cero");const p=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let l=!1;if(c&&d!==null){const u=Uo(c,d,p),v=(n.get(u)??0)+1;n.set(u,v),l=v<=(o.get(u)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:d,errores:r,duplicada:l}})}function Zr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function we(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const tc=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function la(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Xr(a.analisis,a.mapeo,e)}function ec(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?oc(a,a.analisis,a.mapeo):ac()}
    </div>`}function ac(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function oc(t,a,e){const o=Zr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,d)=>`<option value="${d}"${d===r?" selected":""}>${m(c||`Columna ${d+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${tc.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${It(J(o.sumaCts))}</div>
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(F(J(r.importeCts)))}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function nc(t,a,e,o){j(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return R("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var l;return((l=a.accounts().find(u=>u._id===p))==null?void 0:l.nombre)??p},r=s.reduce((p,l)=>p+l.eliminados,0),c=s.reduce((p,l)=>p+l.semanales,0),d=s.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");R(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${d}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),j(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,we(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),j(t,"[data-imp-cerrar]",()=>{Object.assign(e,we()),o()}),U(t,"#imp-cuenta",s=>{e.cuentaId=s.value,la(a,e),o()}),U(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),la(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&sc(s).then(r=>{const c=Qr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},la(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),j(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(d=>d.errores.length===0&&(e.incluirDuplicadas||!d.duplicada));if(s.length===0)return;for(const d of s)a.ledger.registrar({fecha:d.fecha,cuentaId:e.cuentaId,importe:Math.abs(J(d.importeCts)),tipo:d.importeCts<0?"gasto":"ingreso",concepto:d.concepto,origen:"importado"});const i=s.map(d=>d.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);R(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,we()),a.onDatosCambiados(),o()})}function sc(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function ic(t,a){if(a<t)return 0;let e=0,[o,n]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(n).padStart(2,"0")}`<=a.slice(0,7);){const s=new Date(o,n,0).getDate(),i=`${o}-${String(n).padStart(2,"0")}-01`,r=`${o}-${String(n).padStart(2,"0")}-${String(s).padStart(2,"0")}`,c=t>i?t:i,d=a<r?a:r,p=(O(d).getTime()-O(c).getTime())/864e5+1;e+=p/s,++n>12&&(n=1,o++)}return e}function rc(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function cc(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function da(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Yo(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const d=(c.tags??[]).filter(p=>s.tags.includes(p)).length;d!==0&&(d>r||d===r&&i&&c._id<i._id)&&(i=c,r=d)}i&&o.get(i._id).push(s)}return o}function Wo(t,a,e,o={}){const s=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&de(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:G(oa(c,a,e)),origen:"estimacion",periodicidad:xa(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&de(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=Ne(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const d of i){const l=c.filter(u=>u.sourceId===d._id||u.sourceId.startsWith(`${d._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);s.push({_id:d._id,concepto:d.nombre,tipo:"ingreso",tags:d.tags??[],estimado:G(l),origen:"nomina",periodicidad:`${d.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=qe(r,{start:a,end:e});for(const d of r){const p=c.filter(l=>l.sourceId===d._id);p.length!==0&&s.push({_id:d._id,concepto:`Cuota ${d.nombre}`,tipo:"gasto",tags:d.tags??[],estimado:G(p.reduce((l,u)=>l+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return s}function lc(t,a,e,o={}){const{desde:n,hasta:s}=rc(e);return{...Ko(t,a,n,s,o),mes:e}}function Ko(t,a,e,o,n={}){const s=t.transacciones({desde:e,hasta:o}),i=new Set(n.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(da(D.concepto)),c=s.filter(D=>r(D)&&D.importeCts<0),d=s.filter(D=>r(D)&&D.importeCts>0),p=s.filter(D=>D.tipo!=="transferencia"&&i.has(da(D.concepto))),l=new Map((n.analisis??[]).map(D=>[D.estimacionId,D])),u=Wo(a,e,o,n),v=D=>new Set(D.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),f=u.filter(D=>D.tipo==="gasto"),b=u.filter(D=>D.tipo==="ingreso"),$=Yo(c,f,D=>v(f).has(D)),g=Yo(d,b,D=>v(b).has(D)),h=new Set,S=new Set,C=(D,z,q)=>{for(const B of z)q.add(B._id);const L=G(z.reduce((B,k)=>B+Math.abs(k.importeCts)/100,0)),N=D.origen==="estimacion"?l.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,periodicidad:D.periodicidad,tags:D.tags,estimado:D.estimado,real:L,desviacion:G(L-D.estimado),sinMovimiento:z.length===0,sugerencia:N?ra(N,D.cuantia??0,{hoy:n.hoy}):null}},w=f.map(D=>C(D,$.get(D._id)??[],h)),y=b.map(D=>C(D,g.get(D._id)??[],S)),A=(D,z)=>{const q=new Map;for(const L of D){if(z.has(L._id))continue;const N=da(L.concepto),B=q.get(N)??{concepto:L.concepto,clave:N,total:0,movimientos:0,ids:[]};B.total=G(B.total+Math.abs(L.importeCts)/100),B.movimientos+=1,B.ids.push(L._id),q.set(N,B)}return[...q.values()].sort((L,N)=>N.total-L.total)},M=A(c,h),I=A(d,S),E=A(p,new Set),P=G(w.reduce((D,z)=>D+z.estimado,0)),_=G(c.reduce((D,z)=>D+Math.abs(z.importeCts)/100,0)),x=G(y.reduce((D,z)=>D+z.estimado,0)),T=G(d.reduce((D,z)=>D+z.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:P,real:_,desviacion:G(_-P),ingresosEstimados:x,ingresosReales:T,desviacionIngresos:G(T-x),netoEstimado:G(x-P),netoReal:G(T-_),desviacionNeta:G(T-_-(x-P)),filas:[...w,...y].sort((D,z)=>Math.abs(z.desviacion)-Math.abs(D.desviacion)),sinEstimacion:M,totalSinEstimacion:G(M.reduce((D,z)=>D+z.total,0)),ingresosSinPrever:I,totalIngresosSinPrever:G(I.reduce((D,z)=>D+z.total,0)),porTag:dc(f,c),meses:ic(e,o),omitidos:E,totalOmitido:G(E.reduce((D,z)=>D+z.total,0)),vacio:s.length===0}}function dc(t,a){const e=new Map,o=(n,s,i)=>{for(const r of n.length>0?n:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[s]+=i,e.set(r,c)}};for(const n of t)o(n.tags,"estimado",n.estimado);for(const n of a)o(n.tags,"real",Math.abs(n.importeCts)/100);return[...e.entries()].map(([n,s])=>({tag:n,estimado:G(s.estimado),real:G(s.real),desviacion:G(s.real-s.estimado)})).filter(n=>n.estimado>0||n.real>0).sort((n,s)=>s.real-n.real||s.estimado-n.estimado)}function Jo(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const Ie=26,ua=7,pa=(Ie+ua)*2,Qo=2*Math.PI*Ie,Xo=12;function uc(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function pc(t){const{color:a,fraccion:e,etiqueta:o}=uc(t),n=pa/2,s=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${pa} ${pa}" style="width:78px;height:78px" role="img" aria-label="${m(s)}">
        <title>${m(s)}</title>
        <circle cx="${n}" cy="${n}" r="${Ie}" fill="none" stroke="var(--bg3)" stroke-width="${ua}"/>
        <circle cx="${n}" cy="${n}" r="${Ie}" fill="none" stroke="${a}" stroke-width="${ua}"
                stroke-linecap="round" stroke-dasharray="${(Qo*e).toFixed(2)} ${Qo.toFixed(2)}"
                transform="rotate(-90 ${n} ${n})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,d=n+(o.length>1?r*10-1:4);return`<text x="${n}" y="${d}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(F(t.estimado))}</div>
    </div>`}function mc(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,Xo),e=t.slice(Xo),o=e.reduce((n,s)=>n+s.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(pc).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${m(F(o))}</span>`:""}
    </div>`}function fc(){return{mes:"",modo:"mes"}}function Zo(t,a){if(a.mes)return a.mes;const e=Jo(t.ledger),o=cc((t.hoy??K)());return e.includes(o)?o:e[0]??o}function Ce(t,a){var i;const e=(t.hoy??K)(),o=t.estimaciones(),n={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),d=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return Ko(t.ledger,o,r,c,{...n,analisis:d})}const s=t.precision.analizarTodas(o,{hoy:e});return lc(t.ledger,o,Zo(t,a),{...n,analisis:s})}function tn(t){var n;const a=(t.hoy??K)(),e=Wo(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(n=t.resolverTramosIRPF)==null?void 0:n.call(t)}),o=s=>e.filter(i=>i.tipo===s).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function gt(t,a){return a<=0?"—":`${m(F(t/a))}/mes`}function en(t,a,e,o){const n=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function gc(t,a){const e=a.modo==="periodo",o=Zo(t,a),n=Jo(t.ledger);n.includes(o)||n.unshift(o);const s=Ce(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(s.desde)} al ${m(s.hasta)}`:m(ve(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${en("mes",!e,"Mes","Cierra un mes natural completo")}
      ${en("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(s.desde)} → ${m(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(l=>`<option value="${m(l)}"${l===o?" selected":""}>${m(ve(l))}</option>`).join("")}
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

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(s.real))}</div>
          <div class="stat-sub">${gt(s.real,s.meses)} · previsto ${m(F(s.estimado))} (${gt(s.estimado,s.meses)})</div>
          <div class="stat-sub">${d(s.desviacion)}${m(F(s.desviacion))} · ${d(s.desviacion)}${gt(s.desviacion,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(s.ingresosReales))}</div>
          <div class="stat-sub">${gt(s.ingresosReales,s.meses)} · previsto ${m(F(s.ingresosEstimados))} (${gt(s.ingresosEstimados,s.meses)})</div>
          <div class="stat-sub">${d(s.desviacionIngresos)}${m(F(s.desviacionIngresos))} · ${d(s.desviacionIngresos)}${gt(s.desviacionIngresos,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${d(s.desviacionNeta)}${m(F(s.desviacionNeta))}</div>
          <div class="stat-sub">${d(s.desviacionNeta)}${gt(s.desviacionNeta,s.meses)}</div>
          <div class="stat-sub">neto real ${m(F(s.netoReal))} · previsto ${m(F(s.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(F(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${gt(s.totalSinEstimacion,s.meses)} · ${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${s.totalIngresosSinPrever>0?`${m(F(s.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${m(s.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${vc(s)}
      ${bc(s,tn(t))}
      ${yc(s,tn(t))}
      ${hc(s)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${mc(s.porTag)}
    </div>`}function vc(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                  <div style="font-size:10px;color:var(--text3)">${m(o.periodicidad)}</div>
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
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
           </div>`:""}`}function an(t,a,e,o){return`<tr>
    <td style="font-size:12px">${m(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${m(F(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${gt(t.total,a)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${m(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${e}
      </select>
      <button class="btn-secondary btn-sm" data-cie-omitir="${m(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const on=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function bc(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${on}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>an(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function hc(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(a.concepto)} · ${m(F(a.total))} ✕</button>`).join("")}
    </div>`}function yc(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${on}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>an(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function $c(t,a,e,o){U(t,"#cie-mes",n=>{e.mes=n.value,o()}),j(t,"[data-cie-modo]",n=>{e.modo=n.getAttribute("data-cie-modo")||"mes",o()}),j(t,"[data-cie-omitir]",n=>{const s=n.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(s)||(a.setOmitidos([...i,s]),R("Concepto omitido: deja de contar en el cierre"),o())}),j(t,"[data-cie-restaurar]",n=>{const s=n.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==s)),o()}),U(t,"[data-cie-asignar]",n=>{const s=n,i=s.getAttribute("data-cie-asignar"),r=s.value;if(!r)return;const c=Ce(a,e),d=[...c.sinEstimacion,...c.ingresosSinPrever].find(p=>p.clave===i);if(d){if(!nt(`Se van a asignar ${d.movimientos} movimiento(s) de «${d.concepto}». ¿Continuar?`)){s.value="";return}for(const p of d.ids)a.ledger.asignarEstimacion(p,r);R(`${d.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),j(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Ce(a,e).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??K)()}),R(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),j(t,"[data-cie-ajustar-todas]",()=>{const s=Ce(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??K)()});R((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const xc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function wc(t){const a=t.hoy??K,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let n="cuentas";const s=Nr(a().slice(0,7)),i=we(),r=fc(),c=()=>t.store.get("expenses"),d=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:d,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},l={ledger:t.ledger,accounts:d,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),f={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Tt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??ht),omitidos:()=>u().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},$=z=>{var q;return((q=t.store.get("accounts").find(L=>L._id===z))==null?void 0:q.nombre)??z},g=()=>Tt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??ht)(Number(a().slice(0,4))),h=()=>Tt(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Jt),S=()=>h()(Number(a().slice(0,4)));function C(){const z=u(),q=t.store.get("accounts"),L=Oa({loans:[],expenses:t.store.get("expenses").filter(H=>H.tipo==="transferencia"),accounts:q,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:h()}),N=new Map,B=H=>{let V=N.get(H);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},N.set(H,V)),V},k=(H,V)=>{const tt=`${V.sourceId}`,at=H.find(ba=>ba.concepto===tt),st=at??{concepto:tt,contraparte:"",total:0,ocurrencias:0};st.total+=Math.abs(V.cuantia),st.ocurrencias+=1,at||H.push(st)};for(const H of L){if(!H.cuenta)continue;const V=B(H.cuenta);H.sourceType==="transfer-in"||H.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(H.cuantia),k(V.entradas,H)):H.sourceType==="transfer-out"||H.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(H.cuantia),k(V.salidas,H)):H.sourceType==="investment-tax"&&(V.retencion+=Math.abs(H.cuantia))}const Y=t.store.get("expenses");for(const H of N.values())for(const[V,tt]of[[H.entradas,"cuenta"],[H.salidas,"cuentaDestino"]])for(const at of V){const st=Y.find(ba=>ba._id===at.concepto);at.contraparte=$((st==null?void 0:st[tt])??"default"),at.concepto=(st==null?void 0:st.concepto)||(tt==="cuenta"?"Aportación":"Reembolso")}return N}function w(z){const q=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let L;if(n==="cuentas"){const k=t.store.get("accounts").filter(V=>rt(V)!=="pension"),Y=C(),H={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:g(),tramosGanancias:S(),flujos:V=>Y.get(V)??lr,invModo:V=>o.get(V)??"proyeccion"};L=`${dr(k,H.tramosGanancias)}<div class="grid-3">${k.map(V=>gr(V,H)).join("")}</div>`}else n==="movimientos"?L='<div id="acc-tx"></div>':n==="importar"?L='<div id="acc-import"></div>':L='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${q}
      </div>
      ${Cr(n)}
      ${L}`;const N=()=>w(z);if(n==="movimientos"){const B=z.querySelector("#acc-tx");B.innerHTML=Or(p,s),Br(B,p,s,N)}else if(n==="importar"){const B=z.querySelector("#acc-import");B.innerHTML=ec(l,i),nc(B,l,i,N)}else if(n==="cierre"){const B=z.querySelector("#acc-cierre"),k=z.querySelector("#acc-precision");B.innerHTML=gc(f,r),k.innerHTML=Vr(b),$c(B,f,r,N),Ur(k,b,N)}}const y=()=>document.getElementById("modal-overlay"),A=()=>_t(),M=()=>{var z;return(z=y())==null?void 0:z.classList.add("hidden")};function I(z,q){const L=y(),N=A();return!L||!N?null:(N.innerHTML=z?`<div class="modal-title">${m(z)}</div>${q}`:q,L.classList.remove("hidden"),j(N,"[data-cancelar]",M),N)}function E(z,q){const L=z?t.store.get("accounts").find(Y=>Y._id===z)??null:null,N=[...(L==null?void 0:L.planAportaciones)??[]].map(Y=>({...Y})),B=L?P(L):null,k=I(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",hr(L,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:B??0}));k&&(yr(k,N,a()),j(k,"[data-guardar-acc]",Y=>{const H=Y.getAttribute("data-guardar-acc")||"",{datos:V,punto:tt,error:at}=$r(k,N,L,B,a());if(at)return R(at,"err");let st=H;H?t.store.updateItem("accounts",H,V):st=t.store.addItem("accounts",V)._id,tt&&t.ledger.registrarPuntoControl(st,tt.fecha,tt.saldo,tt.nota),R(H?"Actualizada":"Cuenta / fondo creado"),e(),M(),q()}))}function P(z){const q=t.ledger.puntosControl(z._id);return q.length>0?ea(q)[0].saldo:z.saldo??null}function _(z,q){const L=t.store.get("accounts").find(k=>k._id===z);if(!L)return;const N=I("Histórico de saldos",xr(L.nombre,z,ea(t.ledger.puntosControl(z)),L.saldoInicial||0,a()));if(!N)return;const B=()=>{q(),_(z,q)};j(N,"[data-hist-anadir]",()=>{var V,tt,at;const k=((V=N.querySelector("#hi-fecha"))==null?void 0:V.value)??"",Y=parseFloat(((tt=N.querySelector("#hi-saldo"))==null?void 0:tt.value)??""),H=((at=N.querySelector("#hi-nota"))==null?void 0:at.value.trim())??"";if(!k||!Number.isFinite(Y))return R("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,k,Y,H||void 0),R("Punto añadido"),e(),B()}),j(N,"[data-hist-borrar]",k=>{const[,Y]=(k.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),R("Eliminado"),e(),B()}),j(N,"[data-hist-semanal]",k=>{const Y=k.getAttribute("data-hist-semanal"),H=t.ledger.generarPuntosSemanales(Y);R(H>0?`Histórico con ${H} punto${H!==1?"s":""} semanal${H!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),B()}),j(N,"[data-hist-inicial]",k=>{const[Y,H]=(k.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(Y).find(at=>at._id===H);if(!V)return;const tt=ea([V])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:tt,fechaInicialSaldo:V.fecha}),R(`Punto inicial → ${V.fecha} (${F(tt)})`),e(),B()})}function x(z){const q=t.store.get("accounts").filter(B=>B.activo);if(q.length===0)return R("No hay cuentas activas","err");const L=a(),N=q.map(B=>`• ${B.nombre}: ${F(P(B)??B.saldoInicial??0)}`).join(`
`);if(nt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${L})?

${N}

Esto recalibra el punto de arranque del dashboard.`)){for(const B of q)t.store.updateItem("accounts",B._id,{saldoInicial:P(B)??B.saldoInicial??0,fechaInicialSaldo:L});R("Saldo base actualizado"),e(),z()}}function T(z,q,L){j(z,"[data-cuentas-tab]",N=>{n=N.getAttribute("data-cuentas-tab")||"cuentas",q()}),j(z,"[data-nueva-acc]",()=>E(null,q)),j(z,"[data-editar-acc]",N=>E(N.getAttribute("data-editar-acc"),q)),j(z,"[data-tramos-ganancias]",()=>L.abrir()),j(z,"[data-reset-base]",()=>x(q)),j(z,"[data-hist-acc]",N=>_(N.getAttribute("data-hist-acc"),q)),j(z,"[data-principal-acc]",N=>{const B=N.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(k=>({...k,esCuentaPrincipal:k._id===B}))),R("Cuenta marcada como principal"),e(),q()}),j(z,"[data-borrar-acc]",N=>{const B=N.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return R("Debe existir al menos una cuenta","err");if(!nt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",B);const Y=t.store.get("accounts");Y.length>0&&!Y.some(H=>H.esCuentaPrincipal)&&t.store.set("accounts",Y.map((H,V)=>V===0?{...H,esCuentaPrincipal:!0}:H)),R("Cuenta eliminada"),e(),q()}),j(z,"[data-inv-modo]",N=>{const[B,k]=(N.getAttribute("data-inv-modo")||"").split("|");o.set(B,k==="real"?"real":"proyeccion"),q()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:xc,mount(z){const q=()=>w(z);D??(D=wr({store:t.store,onDatosCambiados:()=>{e(),q()},año:()=>Number(a().slice(0,4))})),w(z),z.dataset.wired!=="1"&&(T(z,q,D),z.dataset.wired="1")}}}function nn(t,a,e=!1){const o=Math.abs(it(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function Ic(t){function a(I){return`${I}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(I={}){var P;const E=(P=I.texto)==null?void 0:P.trim().toLowerCase();return t.get("transacciones").filter(_=>!(I.cuentaId&&_.cuentaId!==I.cuentaId||I.desde&&_.fecha<I.desde||I.hasta&&_.fecha>I.hasta||I.tipo&&_.tipo!==I.tipo||I.estimacionId&&_.estimacionId!==I.estimacionId||I.tags&&I.tags.length>0&&!I.tags.some(x=>_.tags.includes(x))||E&&!_.concepto.toLowerCase().includes(E))).sort((_,x)=>_.fecha.localeCompare(x.fecha)||_._id.localeCompare(x._id))}function o(I){const E={_id:a("tx"),fecha:I.fecha,cuentaId:I.cuentaId,importeCts:nn(I.tipo,I.importe,I.negativo),concepto:I.concepto,tags:I.tags??[],estimacionId:I.estimacionId??null,tipo:I.tipo,origen:I.origen??"manual",...I.nota?{nota:I.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),E]),E}function n(I,E){t.set("transacciones",t.get("transacciones").map(P=>{if(P._id!==I)return P;const{importe:_,...x}=E,T={...P,...x};return _!==void 0&&(T.importeCts=nn(T.tipo,_,T.importeCts<0)),T}))}function s(I){t.set("transacciones",t.get("transacciones").filter(E=>E._id!==I))}function i(I,E){n(I,{estimacionId:E})}function r(I){return t.get("puntosControl").filter(E=>!I||E.cuentaId===I).sort((E,P)=>E.fecha.localeCompare(P.fecha))}function c(I){return r(I).filter(E=>E.origen!=="derivado")}function d(I,E,P,_){const x={_id:a("pc"),fecha:E,cuentaId:I,saldoCts:it(P),..._?{nota:_}:{}},T=t.get("puntosControl").filter(D=>!(D.cuentaId===I&&D.fecha===E));return t.set("puntosControl",[...T,x].sort((D,z)=>D.fecha.localeCompare(z.fecha))),u(I),x}function p(I){const E=t.get("puntosControl").find(P=>P._id===I);t.set("puntosControl",t.get("puntosControl").filter(P=>P._id!==I)),E&&(E.origen==="derivado"?$(E.cuentaId):u(E.cuentaId))}function l(I,E,P){const _=T=>T.cuentaId===I&&T.origen!=="derivado"&&T.fecha>=E&&T.fecha<=P,x=t.get("puntosControl").filter(_).length;return x===0?0:(t.set("puntosControl",t.get("puntosControl").filter(T=>!_(T))),$(I),x)}function u(I){var N,B;const E=c(I),P=t.get("transacciones").filter(k=>k.cuentaId===I).sort((k,Y)=>k.fecha.localeCompare(Y.fecha)),_=(N=P[0])==null?void 0:N.fecha,x=(B=P[P.length-1])==null?void 0:B.fecha,T=t.get("puntosControl").filter(k=>!(k.cuentaId===I&&k.origen==="derivado"));if(!_)return t.set("puntosControl",T),$(I),0;const D=[];for(let k=Wt(_);k<=x;k=Wt($a(k,1)))D.push(k);D[D.length-1]!==x&&D.push(x);const z=new Set(E.map(k=>Wt(k.fecha))),q=k=>{const Y=E.filter(H=>H.fecha<=k).pop();return P.filter(H=>H.fecha<=k&&(!Y||H.fecha>Y.fecha)).reduce((H,V)=>H+V.importeCts,(Y==null?void 0:Y.saldoCts)??0)},L=D.filter(k=>!z.has(Wt(k))).map(k=>({_id:a("pcd"),fecha:k,cuentaId:I,saldoCts:q(k),origen:"derivado"}));return t.set("puntosControl",[...T,...L].sort((k,Y)=>k.fecha.localeCompare(Y.fecha))),v(I,_,q(_)),$(I),L.length}function v(I,E,P){const _=t.get("accounts"),x=_.find(T=>T._id===I);!x||x.fechaInicialSaldo&&x.fechaInicialSaldo<=E||t.set("accounts",_.map(T=>T._id===I?{...T,saldoInicial:J(P),fechaInicialSaldo:E}:T))}function f(I){return(I??[...new Set(t.get("transacciones").map(P=>P.cuentaId))]).reduce((P,_)=>P+u(_),0)}function b(I){const E=t.get("transacciones").filter(x=>x.origen==="importado"&&(!I||x.cuentaId===I)),P=new Map;for(const x of E){const T=P.get(x.cuentaId);T?T.push(x.fecha):P.set(x.cuentaId,[x.fecha])}const _=[];for(const[x,T]of P){T.sort();const D=l(x,T[0],T[T.length-1]);_.push({cuentaId:x,eliminados:D,semanales:u(x)})}return _}function $(I){const E=r(I),P=t.get("accounts");P.some(_=>_._id===I)&&t.set("accounts",P.map(_=>_._id===I?{..._,historicoSaldos:E.map(x=>({_id:x._id,fecha:x.fecha,saldo:J(x.saldoCts),...x.nota?{nota:x.nota}:{}}))}:_))}function g(I,E=K()){const P=c(I).filter(D=>D.fecha<=E).pop(),_=P==null?void 0:P.fecha,x=(P==null?void 0:P.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===I&&D.fecha<=E&&(_===void 0||D.fecha>_)).reduce((D,z)=>D+z.importeCts,x)}function h(I,E){return J(g(I,E))}function S(I=K(),E){const P=E??t.get("accounts").filter(_=>_.activo).map(_=>_._id);return J(P.reduce((_,x)=>_+g(x,I),0))}function C(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function w(){const I=[...t.get("transacciones").map(E=>E.fecha),...t.get("puntosControl").map(E=>E.fecha)];return I.length>0?I.sort().pop()??null:null}function y(I={}){return J(e(I).reduce((E,P)=>E+P.importeCts,0))}function A(I={}){const E=new Map;for(const P of e(I)){const _=P.fecha.slice(0,7);E.set(_,(E.get(_)??0)+P.importeCts)}return new Map([...E.entries()].sort(([P],[_])=>P.localeCompare(_)).map(([P,_])=>[P,J(_)]))}function M(I={}){const E=new Map;for(const P of e(I))for(const _ of P.tags.length>0?P.tags:["sin_tag"])E.set(_,(E.get(_)??0)+P.importeCts);return new Map([...E.entries()].map(([P,_])=>[P,J(_)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:d,eliminarPuntoControl:p,eliminarPuntosControlEnRango:l,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:f,saldoCuenta:h,saldoCuentaCts:g,saldoTotal:S,tieneDatos:C,ultimaFecha:w,total:y,totalPorMes:A,totalPorTag:M}}function mt(t){return t.trim().toLowerCase()}function Cc(t){function a(){const d=new Map,p=(l,u)=>{const v=mt(l);if(!v)return;const f=d.get(v)??{tag:v,estimaciones:0,reales:0,total:0};f[u]+=1,f.total+=1,d.set(v,f)};for(const l of t.get("expenses"))for(const u of l.tags??[])p(u,"estimaciones");for(const l of t.get("transacciones"))for(const u of l.tags??[])p(u,"reales");return[...d.values()].sort((l,u)=>u.total-l.total||l.tag.localeCompare(u.tag))}function e(){return a().map(d=>d.tag)}function o(d){return a().filter(p=>d==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function n(d,p,l){const u=mt(p),v=(d??[]).map(mt);if(!v.includes(u))return d??[];const f=v.filter(b=>b!==u);return l===null?[...new Set(f)]:[...new Set([...f,mt(l)])]}function s(d,p){const l=mt(p);if(!l)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(d,l)}function i(d,p){let l=0;for(const u of d)mt(u)!==mt(p)&&(l+=c(u,mt(p)).cambiados);return{cambiados:l}}function r(d){return c(d,null)}function c(d,p){let l=0;const u=t.get("expenses").map(A=>{const M=n(A.tags,d,p);return M!==A.tags&&(l+=1),M===A.tags?A:{...A,tags:M}});t.set("expenses",u);const v=t.get("transacciones").map(A=>{const M=n(A.tags,d,p);return M!==A.tags&&(l+=1),M===A.tags?A:{...A,tags:M}});t.set("transacciones",v);const f=t.get("loans").map(A=>{const M=n(A.tags,d,p);return M!==A.tags&&(l+=1),M===A.tags?A:{...A,tags:M}});t.set("loans",f);const b=t.get("nominas").map(A=>{const M=n(A.tags,d,p);return M!==A.tags&&(l+=1),M===A.tags?A:{...A,tags:M}});t.set("nominas",b);const $=t.get("config"),g=mt(d),h=A=>{const M=(A??[]).map(mt);if(!M.includes(g))return A??[];const I=M.filter(E=>E!==g);return p===null?[...new Set(I)]:[...new Set([...I,p])]},S={},C=h($.activeTagsFilter),w=h($.tagCategorias),y=h($.tagGrupos);return C!==$.activeTagsFilter&&(S.activeTagsFilter=C),w!==$.tagCategorias&&(S.tagCategorias=w),y!==$.tagGrupos&&(S.tagGrupos=y),Object.keys(S).length>0&&t.patchConfig(S),{cambiados:l}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Sc=3;function sn(t){return t<.005?0:t}function Ac(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function Mc(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<Sc)continue;const r=Ac(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:sn(n),sigmaDeriva:sn(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function rn(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:G(e*Math.hypot(n,s))}function Ec(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,d]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-s)*12+(d-i)),l=rn(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:G(r.saldoAcum+l),abajo:G(r.saldoAcum-l)}})}function _c(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ma="financeapp_session",Pc=["local","dropbox","firebase"];function Fc(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Pc.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Dc({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const f=n();if(f)try{v?f.setItem(ma,JSON.stringify(v)):f.removeItem(ma)}catch{}}function i(){const v=n();if(!v)return null;try{return Fc(v.getItem(ma))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const f=r();return f!==null&&f>=v}function d(){const v=i();return v?c()?(s(null),null):v:null}function p(v){const f=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:f,ultimoUso:f};return s(b),b}function l(){const v=i();v&&s({...v,ultimoUso:e()})}function u(){s(null)}return{abrir:p,leer:d,tocar:l,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return d()!==null}}}const cn=["pointerdown","keydown","visibilitychange"];function Tc({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of cn)s==null||s.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(d(),t.cerrar(),a())},e);function d(){if(i){i=!1,n(c);for(const p of cn)s==null||s.removeEventListener(p,r)}}return d}const zc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],jc="FinanceApp",qc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function ln(t){return new Uint8Array(new ArrayBuffer(t))}const fa="financeapp_bio_credencial",ga="financeapp_bio_secreto",va="financeapp_bio_ultimo_desbloqueo",dn="financeapp_bio_gracia_min",Nc=5;function Rc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function Se(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function Ae(t){const a=atob(t),e=ln(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function Lc(t){return Se(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function kc(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Ae(a)}function un(t){return t.getClientExtensionResults()}function Oc(t={}){const a=t.webauthn??Rc(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(w=>crypto.getRandomValues(ln(w)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const w=o==null?void 0:o.getItem(fa);if(!w)return null;try{const y=JSON.parse(w);return typeof y.credencialId!="string"||typeof y.salt!="string"?null:y}catch{return null}}function d(){return c()!==null}async function p(w){const y=await e.importKey("raw",w,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:qc},y,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function l(w,y){const A=s(12),M=await e.encrypt({name:"AES-GCM",iv:A},w,new TextEncoder().encode(y));return`${Se(A)}:${Se(M)}`}async function u(w,y){const[A,M]=y.split(":"),I=Ae(A),E=Ae(M),P=await e.decrypt({name:"AES-GCM",iv:I},w,E);return new TextDecoder().decode(P)}async function v(w,y){var q,L;if(!w)throw new Error("No hay clave de cifrado que envolver.");const A=s(32),M=s(32),I=s(16),E=await a.create({publicKey:{challenge:M,rp:{name:jc},user:{id:I,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const P=un(E);if(!((q=P.prf)!=null&&q.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let _=((L=P.prf.results)==null?void 0:L.first)??null;if(_||(_=await f(E.rawId,A)),!_)throw new Error("El sensor no ha devuelto material de cifrado.");const x=await p(_),T=await l(x,w),D={credencialId:Lc(E.rawId),salt:Se(A),modo:y,creadaEn:n()},z=i();z.setItem(fa,JSON.stringify(D)),z.setItem(ga,T)}async function f(w,y){var M,I;const A=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:w,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:y}}},timeout:6e4}});return A?((I=(M=un(A).prf)==null?void 0:M.results)==null?void 0:I.first)??null:null}async function b(){const w=c();if(!w)throw new Error("No hay huella configurada en este dispositivo.");const y=o==null?void 0:o.getItem(ga);if(!y)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await f(kc(w.credencialId).buffer,Ae(w.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const M=await p(A),I=await u(M,y);return g(),I}function $(){o==null||o.removeItem(fa),o==null||o.removeItem(ga),o==null||o.removeItem(va)}function g(){o==null||o.setItem(va,String(n()))}function h(){const w=o==null?void 0:o.getItem(dn);if(w==null)return Nc;const y=Number(w);return Number.isFinite(y)&&y>0?y:0}function S(w){o==null||o.setItem(dn,String(Math.max(0,Math.floor(w)||0)))}function C(){if(!d())return!1;const w=h();if(w<=0)return!1;const y=o==null?void 0:o.getItem(va),A=y?Number(y):NaN;return Number.isFinite(A)?n()-A<w*6e4:!1}return{disponible:r,registrada:d,leerCredencial:c,registrar:v,desbloquear:b,olvidar:$,marcarDesbloqueo:g,dentroDeGracia:C,graciaMinutos:h,configurarGracia:S}}function pn(){if(typeof localStorage<"u"){const y=Is();y.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${y.join(", ")}`)}const t=js(),a=t.activo(),e=Rt(a),o=lo(localStorage,e),n=Es({adapter:o}),s=_s(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${St})`),n.subscribe(y=>s.marcar(y));function r(){var A,M,I,E,P;const y=globalThis;(M=(A=y.FirebaseService)==null?void 0:A.isConnected)!=null&&M.call(A)&&((P=(E=(I=y.FirebaseService).uploadRegistroProyectos)==null?void 0:E.call(I))==null||P.catch(_=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",_ instanceof Error?_.message:_)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(y=>y._id===a)??t.listar()[0],colecciones:At.filter(y=>y!=="config"),crear:y=>{const A=t.crear(y);return r(),A},renombrar:(y,A)=>{t.renombrar(y,A),r()},duplicar:(y,A)=>{const M=t.duplicar(y,A);return r(),M},eliminar:y=>{t.eliminar(y),r()},cambiarA:y=>t.establecerActivo(y),fusionarRemotos:y=>t.fusionarRemotos(y),importarDesde:(y,A)=>{const M=qs(localStorage,y,A),I=Ns(M),E=[];for(const P of A){const _=I[P];if(!Array.isArray(_)||_.length===0)continue;const x=n.get(P);n.set(P,[...x,..._]),E.push(P)}return E.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:E}}},d=Ls(n),p=Oc(),l=Dc({autoLogoutMinutos:()=>{var A,M;const y=(M=(A=globalThis.State)==null?void 0:A.get)==null?void 0:M.call(A,"config");return Number((y==null?void 0:y.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=Ic(n),v=Cc(n),f=_r(u),b=Hr(n),$=ui({isEnabled:y=>d.isEnabled(y)}),g=oi({flags:d,rutasExtra:()=>$.flagPorRuta()}),h=Hs({flags:d,onChange:()=>{var y,A;$.attachToShell(),g.apply(),(A=(y=globalThis.Router)==null?void 0:y.rerender)==null||A.call(y)}}),S=Qs({proyectos:c}),C=()=>{var A,M,I,E,P,_;const y=globalThis;if((M=(A=y.State)==null?void 0:A.load)==null||M.call(A),((E=(I=y.Router)==null?void 0:I.current)==null?void 0:E.call(I))==="dashboard")try{(_=(P=y.DashboardModule)==null?void 0:P.render)==null||_.call(P)}catch(x){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",x)}},w=ai({store:n,onDatosCambiados:C});return $.register(Ci({store:n,onDatosCambiados:C})),$.register(zi({store:n,onDatosCambiados:C})),$.register(ir({store:n,onDatosCambiados:C})),$.register(wc({store:n,ledger:u,tags:v,precision:f,adjuster:b,onDatosCambiados:C})),$.register(gi({store:n,onDatosCambiados:C})),{version:St,core:wn,engine:{generarExtracto:Oa,recomputarSaldoAcum:Sn,saldoHoy:An,sumarPorTags:Ba,providers:{proyectarGastos:Qt,proyectarPrestamos:qe,proyectarTransferencias:Ta,proyectarNominas:Ne,proyectarInteresesCuentas:ja,proyectarAportaciones:za,proyectarRetencionesFiscales:qa,proyectarInflacionGastos:Na,proyectarPerdidaAhorro:Ra},analysis:Pn,margins:Nn,avisos:On,dashboard:es},store:n,flags:d,featureRegistry:{all:wt,porGrupo:bo},ui:{openFeatures:h.open,openProyectos:S.open,openPersonas:w.open,applyGating:g.apply,watchGating:()=>g.observar(),instalarDeshacer:()=>si({store:n,rerender:()=>{var A,M,I,E;const y=globalThis;(M=(A=y.State)==null?void 0:A.load)==null||M.call(A),(E=(I=y.Router)==null?void 0:I.rerender)==null||E.call(I)}}),avisoGuardado:null,instalarBuscador:()=>li({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>$.routes(),navegar:y=>{var A,M;return(M=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:M.call(A,y)}})},app:$,session:Object.assign(l,{vigilar:y=>Tc({sesion:l,onCaducada:y}),opciones:zc}),biometria:p,cambios:s,datos:{colecciones:At,snapshot:()=>({...uo(o),[po]:St}),aplicar:(y,{sellar:A=!0}={})=>{const M=A?(E,P)=>o.set(E,P):(E,P)=>{const _=globalThis.StorageAdapter;_!=null&&_.setRestaurando?_.setRestaurando(E,P):o.set(E,P)},I=Ps(M,y);for(const E of io)y[E]!==void 0&&y[E]!==null&&M(`${ct}${E}`,y[E]);return I.length>0&&M(ee,Ts(y,St)),n.load(),s.marcar("copia-restaurada"),I},faltantes:y=>Fs(y),esVacioOPorDefecto:()=>Ds(uo(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:f,adjuster:b,sugerirAjuste:ra,medirVariabilidad:Mc,bandaDeConfianza:Ec,bandaAcumulada:rn,describirBanda:_c}}}function Bc(){try{const t=pn();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const Z=typeof window<"u"?Bc():null;if(Z){let t=!1;const a=()=>{var n,s;if(Z.app.attachToShell(),Z.ui.applyGating(),!t){t=!0,Z.ui.watchGating(),Z.ui.instalarDeshacer(),Z.ui.instalarBuscador();const i=globalThis,r=()=>{var l,u,v,f;return(u=(l=i.FirebaseService)==null?void 0:l.isConnected)!=null&&u.call(l)?i.FirebaseService:(f=(v=i.DropboxService)==null?void 0:v.isConnected)!=null&&f.call(v)?i.DropboxService:null};Z.ui.avisoGuardado=di({cambios:Z.cambios,hayDestino:()=>r()!==null,guardar:async()=>{const l=r();if(!(l!=null&&l.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const u=globalThis.AuthModule;u!=null&&u.guardarEnNube?await u.guardarEnNube():await l.uploadBackup()}});const c=document.getElementById("sidebar-proyecto-activo"),d=document.getElementById("sidebar-proyecto-activo-nombre");c&&d&&(d.textContent=Z.proyectos.activo().nombre,c.classList.remove("hidden"),c.addEventListener("click",()=>Z.ui.openProyectos())),(n=document.getElementById("btn-proyectos"))==null||n.addEventListener("click",()=>Z.ui.openProyectos());const p=Z.store.get("config").archivoMigracion011;if(p&&!p.avisado&&p.desactivados+p.amortizaciones.length>0){const l=p.desactivados+p.amortizaciones.length,u=globalThis.UI;setTimeout(()=>{var v;return(v=u==null?void 0:u.toast)==null?void 0:v.call(u,`Se han desactivado ${l} elemento${l===1?"":"s"} que venía${l===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),Z.store.patchConfig({archivoMigracion011:{...p,avisado:!0}})}(s=document.getElementById("btn-personas"))==null||s.addEventListener("click",()=>Z.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",n=>{const s=n.target;s!=null&&s.closest(".nav-btn[data-view]")&&setTimeout(a,0)}),window.addEventListener(co,()=>{if(document.getElementById("aviso-sin-espacio"))return;const n=document.querySelector(".view-container");if(!(n!=null&&n.parentElement))return;const s=document.createElement("div");s.id="aviso-sin-espacio",s.setAttribute("role","alert"),s.className="card",s.style.cssText="border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap";const i=document.createElement("span");i.style.flex="1",i.textContent="No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.";const r=document.createElement("button");r.className="btn-primary btn-sm",r.textContent="Exportar copia",r.addEventListener("click",()=>{var c,d;return(d=(c=globalThis.DataIO)==null?void 0:c.exportJSON)==null?void 0:d.call(c)}),s.append(i,r),n.parentElement.insertBefore(s,n)});let e=null;const o=`${Rt(Z.proyectos.activo()._id)}${ct}`;window.addEventListener("storage",n=>{!n.key||!n.key.startsWith(o)||n.key.endsWith("_modificadoEn")||n.key.endsWith("_schemaVersion")||(e&&clearTimeout(e),e=setTimeout(()=>{var i,r,c;e=null,Z.store.load(),((i=document.getElementById("modal-overlay"))==null?void 0:i.classList.contains("hidden"))===!1||(c=(r=globalThis.Router)==null?void 0:r.rerender)==null||c.call(r)},150))})}return Me.bootstrap=pn,Object.defineProperty(Me,Symbol.toStringTag,{value:"Module"}),Me}({});
//# sourceMappingURL=financeapp-core.js.map
