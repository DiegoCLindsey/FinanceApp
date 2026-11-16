var FinanceAppBundle=function(Me){"use strict";function W(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function O(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function K(){return W(new Date)}function Ee(t,a){return new Date(t,a+1,0).getDate()}function ha(t,a,e){return W(new Date(t,a,Math.min(e,Ee(t,a))))}function ce(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return W(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return ha(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return W(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),W(i)}return null}function ya(t,a){if(!a)return t;const e=O(t);return ce(e.getFullYear(),e.getMonth(),a)??t}const dn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],un={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Pe(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${un[e]||e+"º"} ${dn[o]} del mes`}return t}function Vt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Ut(t){const a=O(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),W(a)}function $a(t,a){const e=O(t);return e.setDate(e.getDate()+a),W(e)}function _t(t,a,e){const o=Math.max(1,e),n=t.getFullYear(),s=t.getMonth(),i=(a.getFullYear()-n)*12+(a.getMonth()-s);if(i<=0)return{year:n,month:s};const r=s+Math.floor(i/o)*o;return{year:n+Math.floor(r/12),month:r%12}}function le(t,a,e,o){return!(t&&t>o||a&&a<e)}function xa(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function G(t){return J(it(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Ia(t){return(t||0).toFixed(2)+"%"}function Ct(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function wa(t,a,e,o=0){const n=Ct(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=n*(1-Math.pow(1+i,-e))/i-s,p=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-l/p;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function Ca(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const l=O(o),p=a/100/12;let d=e,u=Ct(c,a,d);const v=[...s].sort((b,y)=>b.fecha.localeCompare(y.fecha));let f=0;for(let b=1;b<=e*2&&c>.01;b++){const y=new Date(l);l.setMonth(l.getMonth()+1);const g=ya(W(y),i.diaPago||"");for(;f<v.length&&v[f].fecha<=g;){const C=v[f],I=C.cantidad*(n/100);if(c-=C.cantidad,c=Math.max(0,c),C.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(d=e-b+1,u=Ct(c,a,d)),r.push({mes:"AMORT",fecha:C.fecha,cuota:0,interes:0,amortizacion:C.cantidad,comisionAmort:I,capitalPendiente:c,esAmortizacion:!0,simulacion:C.simulacion||!1}),f++,c<.01)break}if(c<.01)break;const h=c*p,S=Math.min(u-h,c);if(c-=S,c<.01&&(c=0),r.push({mes:b,fecha:g,cuota:u,interes:h,amortizacion:S,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const Sa=new Map;function X(t){var y;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((g,h)=>`${g.fecha}|${g.cantidad}|${g.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).join(";")}`,o=Sa.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,p=Ca(n,s,i,r,c||0,a,t),d=p.reduce((g,h)=>g+h.interes,0),u=p.reduce((g,h)=>g+h.comisionAmort,0),v=n*((l||0)/100),f=p.filter(g=>!g.esAmortizacion),b={cuota:Ct(n,s,i),totalIntereses:d,tae:wa(n,s,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:((y=f.slice(-1)[0])==null?void 0:y.fecha)||"",mesesReales:f.length,tabla:p};return Sa.set(e,b),b}function Aa(t){const a=X(t),e=X({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function vt(t,a,e){if(!t||t.length===0)return 1;const o=O(a),n=O(e);if(n<=o)return 1;const s=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),l=s.filter(b=>b.year<=c),p=l.length>0?l[l.length-1]:s[0],d=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<n?u:n,f=Vt(r,v);i*=Math.pow(1+d,f/365.25),r=v}return i}function Ma(t,a,e,o=0){const n=O(a),s=O(e);if(s<=n)return o;const i=Vt(n,s),r=t?[...t].sort((p,d)=>p.year-d.year):[];let c=0,l=new Date(n);for(;l<s;){const p=l.getFullYear(),d=new Date(p+1,0,1),u=d<s?d:s,v=Vt(l,u),f=r.filter(g=>g.year<=p),b=f.length>0?f[f.length-1]:null,y=b!==null?b.tasa:o;c+=y*v,l=u}return i>0?c/i:o}function Ea(t,a){return((1+t/100)/(1+a/100)-1)*100}function pn(t,a,e,o){const n=vt(a,e,o);return n>0?t/n:t}function mn(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:p=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,f=c-l-v-d-u,b=f,y=c>0?b/c*100:null,g=r?l-p:l,h=c>0?g/c*100:null,S=c>0?l/c*100:null,C=c>0?(d+l+v)/c*100:null,I=c>0?u/c*100:null,$=(E,w,P)=>E===null?"neutral":E>=w?"verde":E>=P?"amarillo":"rojo",A=(E,w,P)=>E===null?"neutral":E<=w?"verde":E<=P?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:p,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:f,ahorroReal:b,tasaAhorro:y,dti:h,dtiTotal:S,excluyeHipoteca:r,pctNecesidades:C,pctDeseos:I,semAhorro:$(y,e,o),semDTI:A(h,n,s),semNecesidades:A(C,i[0],i[0]+15),semDeseos:A(I,i[1],i[1]+10),semAhorroRegla:$(y,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function bt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Yt(t,a){const e=_e(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function _e(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,s)=>{n.fecha>=e&&o.push({...n,prioridad:s})}),o.sort((n,s)=>s.fecha.localeCompare(n.fecha)||s.prioridad-n.prioridad),o.find(n=>n.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((n,s)=>s.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a)??null}function Pa(t,a){let e="";for(const o of t){const n=_e(o,a);n&&n.fecha>e&&(e=n.fecha)}return e}function fn(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function gn(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function de(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function vn(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function bn(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Ft(t,a,e){const o=it(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:J(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=vn(o,n.length);return n.map((u,v)=>({personaId:u,importe:J(d[v])}))}const s=a.participantes.map(d=>{const u=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):it(u)}),i=s.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=s.map(f=>Math.round(f*d)),v=u.reduce((f,b)=>f+b,0);return u.length>0&&(u[0]+=o-v),n.map((f,b)=>({personaId:f,importe:J(u[b])}))}const c=o-i,{ids:l,cts:p}=bn(n,s,c,e);return l.map((d,u)=>({personaId:d,importe:J(p[u])}))}function Fe(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function hn(t,a,e){const o=de(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Fe(a.expenses,i.sourceId);for(const l of Ft(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of Ft(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Fe(a.loans,i.sourceId);for(const l of Ft(r,c==null?void 0:c.repartoPago,o))s(l.personaId).pago+=l.importe;for(const l of Ft(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Fe(a.nominas,i.sourceId);for(const l of Ft(r,c==null?void 0:c.repartoConsumo,o))s(l.personaId).ingresos+=l.importe}}}return[...n.values()]}function De(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const ht=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function _a(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function yt(t,a){return _a(t,a).baseImponible}function Fa(t,a){return lt(t,a)/12}const Wt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Te(t,a){if(!t||t<=0)return 0;const e=a||Wt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,l=Math.min(n,c-i);if(!(l<=0)&&(o+=l*(r/100),n-=l,n<=0))break}return o}function ue(t,a){if(rt(t)!=="inversion")return null;const e=bt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=Te(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function ze(t,a=new Date){var u;if(rt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=bt(t),n=W(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((v,f)=>v.fecha.localeCompare(f.fecha));let i=0;const r=s.reduce((v,f)=>v+f.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,p=Math.min(o,i+c*l),d=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((u=s.find(v=>v.fecha>n))==null?void 0:u.fecha)||null}}function Da(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=bt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((l,p)=>l+p.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function je(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,p)=>l+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((l,p)=>l[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,p]of i)if(s>=l)r=p;else break;return r}const yn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Wt,TRAMOS_IRPF_DEFAULT:ht,agregarPorPersona:hn,ajustarFechaPago:ya,ajustarPrecioReal:pn,arranqueMensual:_t,calcBaseImponibleTrabajo:yt,calcFactorInflacion:vt,calcFondoInversion:ue,calcFondosPension:ze,calcGananciasCapital:Te,calcIRPF:lt,calcImpuestoPension:Da,calcInflacionMediaAnual:Ma,calcSaludFinanciera:mn,calcTAE:wa,calcTipoMarginalPension:je,calcTipoRealFisher:Ea,calcularReparto:Ft,clampedDate:ha,cuotaMensual:Ct,desgloseBaseTrabajo:_a,diasEntre:Vt,entradaSaldo:_e,etiquetaPeriodicidad:xa,fechaUltimoSaldoConocido:Pa,finDeSemana:Ut,formatEUR:F,formatLocalDate:W,formatPct:Ia,fromCents:J,haySimulaciones:gn,idPersonaPorDefecto:de,labelDiaPago:Pe,lastDayOfMonth:Ee,modeloFondoDe:rt,parseLocalDate:O,personasImplicadas:De,resolverDiaEfectivo:ce,resumenPrestamo:X,resumenPrestamoConAhorro:Aa,retencionMensual:Fa,roundMoney:G,saldoEnFecha:Yt,saldoRealCuenta:bt,sinSimulaciones:fn,sumarDias:$a,tablaAmortizacion:Ca,toCents:it,todayISO:K,vigenteEnRango:le},Symbol.toStringTag,{value:"Module"}));function Kt(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=O(i.fechaInicio||a.start),c=i.fechaFin?O(i.fechaFin):s,l=i.cuantia,p=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=_t(r,n,d);const f=Math.ceil(240/d)+2;for(let b=0;b<f;b++){const y=ce(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),S=new Date(u,v+1,0).getDate();return W(new Date(u,v,Math.min(h,S)))})(),g=O(y);if(g>s||g>c)break;g>=n&&g>=r&&p(y),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=s&&u<=c;)p(W(u)),u=new Date(u.getTime()+d)}}return o}function qe(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=X(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Ta(t,a,e=null,o={accounts:[]}){const n=[],s=O(a.start),i=O(a.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>ht),p=o.resolverTramosGanancias||(()=>Wt),d=u=>{var v;return((v=r.find(f=>f._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=O(u.fechaInicio||a.start),f=u.fechaFin?O(u.fechaFin):i,b=y=>{const g=r.find(_=>_._id===(u.cuenta||"default")),h=r.find(_=>_._id===(u.cuentaDestino||"default")),S=rt(g),C=rt(h),I=S==="inversion"&&C==="inversion"||S==="pension"&&C==="pension",$=["transferencia",...I?["traspaso"]:[],...u.tags||[]],A=I?"traspaso-out":"transfer-out",E=I?"traspaso-in":"transfer-in",w=!e||e.length===0||e.includes(u.cuenta||"default"),P=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(w&&n.push({fecha:y,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:$,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:A}),P&&n.push({fecha:y,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:$,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:E}),w&&!I&&g){if(S==="inversion"){const _=parseInt(y.slice(0,4)),M=ue(g,p(_));if(M&&M.saldo>0&&M.plusvalia>0){const x=Math.min(1,u.cuantia/M.saldo),D=M.plusvalia*x*.19;D>.01&&n.push({fecha:y,concepto:`Retención IRPF reembolso ${g.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(S==="pension"){const _=l(parseInt(y.slice(0,4))),M=je(g,c,_),x=Da(g,u.cuantia,M||void 0);if(x>0){const T=g.grupoNomina?`IRPF rescate ${g.nombre} (tipo marginal grupo "${g.grupoNomina}": ${M}%)`:`Retención rescate ${g.nombre} (${g.impuestoRetirada}% s/beneficio)`;n.push({fecha:y,concepto:T,cuantia:x,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=f&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const y=Math.max(1,u.frecuencia||1);let{year:g,month:h}=_t(v,s,y);const S=Math.ceil(240/y)+2;for(let C=0;C<S;C++){const I=ce(g,h,u.diaPago||"")||(()=>{const A=v.getDate(),E=new Date(g,h+1,0).getDate();return W(new Date(g,h,Math.min(A,E)))})(),$=O(I);if($>i||$>f)break;$>=s&&$>=v&&b(I),h+=y,h>=12&&(g+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const y=Math.max(1,u.frecuencia||1)*864e5;let g=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const h=Math.ceil((s.getTime()-v.getTime())/y);g=new Date(v.getTime()+h*y)}for(;g<=i&&g<=f;)b(W(g)),g=new Date(g.getTime()+y)}}return n}function za(t,a,e=null){const o=[],n=O(a.start),s=O(a.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const p=O(l.fechaInicio||a.start),d=l.fechaFin?O(l.fechaFin):s,u=l.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),f=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",y=I=>{v&&o.push({fecha:I,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),f&&o.push({fecha:I,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},g={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:h,month:S}=_t(p,n,g);const C=Math.ceil(240/g)+2;for(let I=0;I<C;I++){const $=new Date(h,S+1,0).getDate(),A=W(new Date(h,S,Math.min(p.getDate(),$))),E=O(A);if(E>s||E>d)break;E>=n&&E>=p&&y(A),S+=g,S>=12&&(h+=Math.floor(S/12),S=S%12)}}}return o}function ja(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=O(a.start),r=O(a.end),c=s.periodoCobro||"mensual",l=c==="mensual",p=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:p/(365.25*864e5);let u=Yt(s,a.start);const v=o.filter(y=>y.cuenta===s._id).map(y=>({fecha:y.fecha,delta:y.tipo==="ingreso"?Math.abs(y.cuantia):-Math.abs(y.cuantia)})).sort((y,g)=>y.fecha.localeCompare(g.fecha));let f=0,b=new Date(i);for(;b<=r;){const y=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),g=new Date(Math.min(y.getTime(),r.getTime()+1)),h=W(g);let S=0;for(;f<v.length&&v[f].fecha<h;)S+=v[f].delta,f++;const C=u,I=u+S,$=Math.max(0,(C+I)/2);u=I;const A=l?d:(g.getTime()-b.getTime())/(365.25*864e5),E=$*(Math.pow(1+s.interes/100,A)-1);E>.001&&n.push({fecha:W(b),concepto:`Interés ${s.nombre}`,cuantia:E,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=y}}return n}function qa(t,a,e,o=null){const n=[],s=a||ht;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Fa(r,s),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Kt([l],e,o))}return n}const $n=[5,11,2,8],xn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Re(t,a,e=null,o=[],n=()=>ht){const s=[],i=O(a.start),r=O(a.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,f)=>(f.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const f=u.fechaInicio||a.start,b=O(f),y=O(v);let g=0;for(let S=b.getFullYear();S<=y.getFullYear();S++){const C=new Date(S,u.mesActualizacionIPC-1,1);C>b&&C<=y&&g++}if(g===0)return u.bruto||0;const h=W(new Date(b.getFullYear()+g,0,1));return(u.bruto||0)*vt(o,f,h)}function d(u,v){const f=p(u,v),b=(u.retribucionFlexible||[]).reduce((_,M)=>_+(M.importe||0)*12,0),y=Math.max(0,f-b);if(u.irpfModo==="manual")return y*((u.irpfPct||0)/100);const g=n(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return lt(yt(f,b),g);const S=l[h].filter(_=>_.activo),C=S.reduce((_,M)=>_+p(M,v),0),I=S.reduce((_,M)=>_+(M.retribucionFlexible||[]).reduce((x,T)=>x+(T.importe||0)*12,0),0),$=Math.max(0,C-I),A=yt(C,I),E=Math.max(0,f-b),w=$>0?A*(E/$):0,P=S.filter(_=>_._id!==u._id&&(_.bruto||0)>(u.bruto||0)).reduce((_,M)=>{const x=(M.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),T=Math.max(0,p(M,v)-x);return _+($>0?A*(T/$):0)},0);return lt(P+w,g)-lt(P,g)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const f=Math.max(1,u.nPagas||12),b=O(u.fechaInicio||a.start),y=u.fechaFin?O(u.fechaFin):r,g=h=>{const S=p(u,h),C=d(u,h),I=(u.retribucionFlexible||[]).reduce((x,T)=>x+(T.importe||0)*12,0),$=Math.max(0,S-I),A=(u.ssPct??6.35)/100,E=$*A,w=$/f,P=C/f,_=E/f,M=u.representacion==="simplificado"?w-_-P:w;s.push({fecha:h,concepto:u.nombre,cuantia:M,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(_>0&&s.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),P>0&&s.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const x of u.retribucionFlexible||[])!x.cuenta||!(x.importe>0)||e&&e.length>0&&!e.includes(x.cuenta)||s.push({fecha:h,concepto:`${u.nombre} — ${xn[x.tipo]||x.tipo}`,cuantia:x.importe,tipo:"ingreso",cuenta:x.cuenta,tags:["retribucion-flexible",x.tipo],sourceId:`${u._id}_flex_${x._id||x.tipo}`,sourceType:"nomina"})};if(f<=12){const h=f===12?1:Math.round(12/f),S=b.getDate();let{year:C,month:I}=_t(b,i,h);for(let $=0;$<300;$++){const A=new Date(C,I+1,0).getDate(),E=new Date(C,I,Math.min(S,A));if(E>r||E>y)break;E>=i&&E>=b&&g(W(E)),I+=h,I>=12&&(C+=Math.floor(I/12),I=I%12)}}else{const h=f-12,S=b.getDate();let{year:C,month:I}=_t(b,i,1);for(let E=0;E<300;E++){const w=new Date(C,I+1,0).getDate(),P=new Date(C,I,Math.min(S,w));if(P>r||P>y)break;P>=i&&P>=b&&g(W(P)),I++,I>=12&&(C++,I=0)}const $=Math.max(b.getFullYear(),i.getFullYear()),A=Math.min((u.fechaFin?y:r).getFullYear(),r.getFullYear());for(let E=$;E<=A;E++)for(const w of $n.slice(0,h)){const P=new Date(E,w,15);P>=i&&P<=r&&P>=b&&P<=y&&g(W(P))}}}return s}function Ra(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=O(e.start),r=O(e.end),c=K(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const d=p.getFullYear(),u=p.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),f=v+"-01",b=W(new Date(d,u+1,0)),y=W(new Date(d,u,15));let g=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<f)continue;const S=h.fechaInicio||c,C=vt(a,S,y);if(C<=1)continue;const I=Math.max(1,h.frecuencia||1);g+=h.cuantia*(C-1)/I}g>.01&&s.push({fecha:y,concepto:"Incremento coste de vida",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(d,u+1,1)}return s}function Na(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=O(e.start),i=O(e.end),r=[...a].sort((l,p)=>l.year-p.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),p=c.getMonth(),d=l+"-"+String(p+1).padStart(2,"0"),u=W(new Date(l,p,15)),v=r.filter(h=>h.year<=l),f=v.length>0?v[v.length-1]:r[0],b=f?f.tasa/100:0,y=Math.pow(1+b,1/12)-1,g=t*y;g>.01&&n.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,p+1,1)}return n}function La(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,n=t.reduce((i,r)=>i+Yt(r,o),0),s=Pa(t,o);return{fecha:s&&s<o?s:o,saldo:n,pedida:o}}function ka(t,a,e){const{fecha:o,saldo:n}=La(a,e),s=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=n;for(const p of[...s].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:d,saldoAcum:c}),c-=d}const l=[];c=n;for(const p of i){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=d,l.push({...p,delta:d,saldoAcum:c})}return[...r,...l]}function In(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return ka([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Oa(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(y=>y.activo&&(!s||s.length===0||s.includes(y._id))),l=La(c,n),p={start:l.fecha<n.dashboardStart?l.fecha:n.dashboardStart,end:n.dashboardEnd},d=e.filter(y=>y.tipo!=="transferencia"),u=e.filter(y=>y.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let f=[];f=f.concat(Kt(d,p,s)),f=f.concat(qe(a,p,s)),f=f.concat(Ta(u,p,s,v)),f=f.concat(za(o,p,s));const b=ja(o,p,s,f);if(f=f.concat(b),f=f.concat(qa(e,n.tramos_irpf,p,s)),f=f.concat(Re(i,p,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const y=(o.find(S=>S.activo&&S.esCuentaPrincipal)||o.find(S=>S.activo)||{_id:"default"})._id;f=f.concat(Ra(d,r,p,s,y));const h=o.filter(S=>S.activo&&(!s||s.length===0||s.includes(S._id))).reduce((S,C)=>S+Yt(C,n.dashboardStart),0);f=f.concat(Na(h,r,p,y))}return f.sort((y,g)=>y.fecha.localeCompare(g.fecha)),ka(f,c,n).filter(y=>y.fecha>=n.dashboardStart)}function wn(t,a,e=null){const o=K(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+bt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Ha(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Cn(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${F(i)})`})))}return e}function Sn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=O(a.dashboardStart),n=O(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function An(t,a,e=K()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=e&&(l[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(l[p.fecha]=p.saldo);return Object.keys(l).forEach(p=>o.add(p)),l}),s={};for(const r of[...o].sort()){let c=0;for(let l=0;l<a.length;l++){const p=Object.entries(n[l]).filter(([d])=>d<=r);p.length>0?(p.sort(([d],[u])=>u.localeCompare(d)),c+=p[0][1]):c+=a[l].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([l],[p])=>l.localeCompare(p))){const l=t.filter(v=>v.fecha<=r),p=l.length>0?l[l.length-1].saldoAcum:null;if(p===null)continue;const d=c-p,u=p!==0?d/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:d,pct:u})}return i}const Mn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:An,detectarPuntosCriticos:Cn,mediaMensualGastos:Sn},Symbol.toStringTag,{value:"Module"}));function Jt(t,a=new Date){const e=W(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=W(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Kt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function En(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Ct(e.capital,e.tin,e.meses),0)}function Pn(t,a){return X(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Ba(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+Ct(n.capital,n.tin,n.meses)*Math.min(a,Pn(n,e)),0)}function Ga(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Jt(t,o),s=a.colchonMeses||6;return n*s+Ba(e,s,W(o))}function _n(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Ga(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Jt(t,n),c=i.meses||6;return r*c+Ba(e,c,o)}function Ne(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((p,d)=>p.fecha.localeCompare(d.fecha)),c=r.filter(p=>p.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Jt(a,i)+En(o))*(c.meses||1):0}function Fn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Dn(t,a){const e={};for(const o of a)e[o._id]=bt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Fn(o)),{fecha:o.fecha,saldos:{...e}}))}function Tn(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let p=0;p<a.length;p++){const d=a[p],u=Ne(c,o,n,s,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((f,b)=>{var y,g;return f+(((g=(y=e[p])==null?void 0:y.saldos)==null?void 0:g[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const zn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ga,calcColchonEnFecha:_n,calcGastoBasicoMensual:Jt,calcMargenEnFecha:Ne,detectarCrucesMargenes:Tn,saldosPorCuentaEnExtracto:Dn},Symbol.toStringTag,{value:"Module"}));function jn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Va(t,a){return Vt(O(t),O(a))}const qn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ua(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${qn[o-1]}${s?"":` de ${e}`}`}function Ya(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Rn(t,a={}){const{hoy:e=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${F(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${F(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${F(d.saldo)}, y el margen pide ${F(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=Va(e,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:n))continue;const v=i?i(u):0,f=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Ya(u),titulo:d.titulo(f),detalle:d.detalle(Ua(d.fecha,e)),incierto:f})}const p={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||p[d.gravedad]-p[u.gravedad]),l.slice(0,s)}const Nn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:jn,construirAvisos:Rn,describirPlazo:Ya,diasEntreISO:Va,fechaEnPalabras:Ua},Symbol.toStringTag,{value:"Module"})),Ln=30.44*864e5;function Wa(t){const a=t.getFullYear(),e=t.getMonth();return{desde:W(new Date(a,e,1)),hasta:W(new Date(a,e,Ee(a,e)))}}function Ka(t){const[a,e]=t.split("-").map(Number);return Wa(new Date(a,e-1,1))}function kn(t,a){return Math.max(1,(O(a).getTime()-O(t).getTime())/Ln)}const On=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),$t=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function Hn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Bn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",n=a.loanIdsIniciados,s=$t(t.filter(u=>u.tipo==="ingreso")),i=$t(t.filter(u=>o(u)&&(!n||n.has(u.sourceId??"")))),r=$t(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=$t(t.filter(u=>u.sourceType==="loan-amort")),l=$t(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:d}=Hn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:d/e,gastosTotales:(i+p+d)/e,intereses:l/e}}function Ja(t,a){return t.reduce((e,o)=>{const n=X(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Gn(t,a,e,o){const n=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),s=n.reduce((l,p)=>{if((p.amortizaciones||[]).filter(f=>f.fecha>=a&&f.fecha<=e).length===0)return l;const u=X(p).totalIntereses,v=X({...p,amortizaciones:(p.amortizaciones||[]).filter(f=>f.fecha<a||f.fecha>e)}).totalIntereses;return l+Math.max(0,v-u)},0),i=n.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:X(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=n.map(l=>X(l).tabla),c=l=>{const{desde:p,hasta:d}=Ka(l);return r.reduce((u,v)=>{const f=v.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=d);return u+(f?f.cuota:0)},0)};return{deudaInicio:Ja(n,a),deudaFin:Ja(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function Vn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:$t(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Qa(t,a=new Set,e="desglosado"){if(a.size===0)return Ha(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(l=>a.has(l)),r=s.filter(l=>!a.has(l)),c=e==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(n.cuantia))}return o}function Un(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Qa(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Yn(t,a){const e=a.reduce((o,n)=>o+bt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:$t(t.filter(o=>o.tipo==="gasto")),totalIngresos:$t(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Wn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Kn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function Jn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function Qn(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const l of t){const p=e(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const Xn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Qn,cuentasVisibles:Wn,gastoPorTagOrdenado:Un,idsHipoteca:Kn,idsPrestamosIniciados:Jn,interesesPorCuenta:Vn,mesesDelPeriodo:kn,metricasFlujo:Bn,rangoMes:Ka,rangoMesDe:Wa,resumenPrestamosPeriodo:Gn,sinTransferencias:On,sumarGastosPorTag:Qa,totalesPeriodo:Yn},Symbol.toStringTag,{value:"Module"}));function Zn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Dt(t,a){return e=>Zn(t,a,e)}const Qt=11,Xa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Za=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Le(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const to="default";function eo(){return{_id:to,nombre:"Yo",esPorDefecto:!0,activo:!0}}function ke(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Xa,tramosGananciasCapital:Za,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Oe(t,a){return{loans:[],expenses:[],accounts:[Le(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[eo()],config:ke(t,a)}}const dt=t=>Array.isArray(t)?t:[],ts=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Xt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function ao(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function He(t){const{varianza:a,inflacion:e,...o}=t;return o}function es(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=ts(t.config),r={...ke(e,o)};for(const[p,d]of Object.entries(s))d!=null&&(r[p]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Xa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Za),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(p=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Xt(d)});c.length===0&&(c=[Le(e)]);const l=c.filter(p=>p.esCuentaPrincipal);if(l.length===0){const p=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===p._id}))}else if(l.length>1){let p=!1;c=c.map(d=>d.esCuentaPrincipal?p?{...d,esCuentaPrincipal:!1}:(p=!0,d):d)}return n.accounts=c,n.expenses=dt(t.expenses).map(p=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=ao(d.diaPago),He(Xt(d))}),n.loans=dt(t.loans).map(p=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=ao(d.diaPago),d.amortizaciones=dt(d.amortizaciones).map(u=>Xt(u)),He(Xt(d))}),n.nominas=dt(t.nominas).map(p=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),He(Xt(d))}),n.goals=dt(t.goals).map((p,d)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...f}=p;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...f,cuentaIds:u}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:p,...d})=>d),n}const Tt=t=>Array.isArray(t)?t:[];let Be=0;function as(t){return Be+=1,`${t}_${Be.toString(36)}`}const os=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ns=t=>typeof t=="number"&&Number.isFinite(t);function ss(t,a){const e={...t};Be=0;const o=Tt(t.transacciones),n=Tt(t.puntosControl),s=[...n],i=new Set(n.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,p,d,u)=>{if(!os(p)||!ns(d))return;const v=`${l}|${p}`;i.has(v)||(i.add(v),s.push({_id:as("pc"),fecha:p,cuentaId:l,saldoCts:it(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of Tt(t.accounts)){const p=typeof l._id=="string"?l._id:null;if(p)for(const d of Tt(l.historicoSaldos))r(p,d.fecha,d.saldo,d.nota)}const c=Tt(t.history);if(c.length>0){const l=Tt(t.accounts),p=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((l,p)=>String(l.fecha).localeCompare(String(p.fecha))),e}const Ge=t=>Array.isArray(t)?t:[],is=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),rs=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ve=0;function cs(){return Ve+=1,`tx_hp_${Ve.toString(36)}`}function ls(t,a){const e={...t};Ve=0;const o=[...Ge(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ge(t.expenses).map(i=>{const r=Ge(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(f=>typeof f=="string"):[];if(c)for(const f of r){if(!f||!is(f.fecha)||!rs(f.cuantia))continue;const b=p==="ingreso"?it(f.cuantia):-it(f.cuantia),y=`${c}|${f.fecha}|${b}`;n.has(y)||(n.add(y),o.push({_id:cs(),fecha:f.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:p,origen:"importado",nota:typeof f.nota=="string"&&f.nota?f.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const oo=t=>Array.isArray(t)?t:[],xt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,zt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,ds=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function us(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=oo(e.goals),n=oo(e.accounts),s=n.map(d=>{const u=zt(d.bloqueoMeses,0);return{_id:`veh_${xt(d._id,"x")}`,nombre:xt(d.nombre,"Cuenta"),rentabilidadRealAnual:zt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:zt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?it(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:xt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:zt(d.interes,0)>0}}),i=new Map(n.map((d,u)=>[xt(d._id,""),s[u]._id])),r=((p=s[0])==null?void 0:p._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>xt(b,"")):[],f=ds(d.targetDate);return{_id:xt(d._id,`obj_mig_${u}`),nombre:xt(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(zt(d.targetAmount,0)),fechaLimite:f,prioridad:zt(d.prioridad,u+1),modoAsignacion:f?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:xt(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}function ps(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===to)||(e.personas=[eo(),...o]),e}const Zt=t=>Array.isArray(t)?t:[];function pe(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function ms(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function fs(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Zt(e.loans).map(pe),e.expenses=Zt(e.expenses).map(pe),e.nominas=Zt(e.nominas).map(pe),e.accounts=Zt(e.accounts).map(pe),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Zt(e.planes).filter(ms);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const no="supuesto-archivado",jt=t=>Array.isArray(t)?t:[],so=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function gs(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function vs(t,a){const e={...t};let o=0;const n=[],s=c=>{const{escenarioIds:l,...p}=c;if(!so(c))return p;o+=1;const d=Array.isArray(p.tags)?p.tags:[];return{...p,activo:!1,tags:d.includes(no)?d:[...d,no]}};e.expenses=jt(e.expenses).map(s),e.nominas=jt(e.nominas).map(s),e.accounts=jt(e.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:l,...p}=c;return p}return s(c)}),e.loans=jt(e.loans).map(c=>{const l=s(c);if(Array.isArray(l.amortizaciones)){const p=[];for(const d of l.amortizaciones){const{escenarioIds:u,...v}=d;so(d)?n.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):p.push(v)}l.amortizaciones=p}return l});const i=[...jt(e._migracion010_planesArchivados),...jt(e.planes).filter(gs)];delete e._migracion010_planesArchivados,delete e.planes,delete e.goals,delete e.escenarios;const r=e.config&&typeof e.config=="object"?{...e.config}:{};if(delete r.escenarioActivo,i.length>0||n.length>0||o>0){const c=r.archivoMigracion011??{},l={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...n],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=l}return(e.config!==void 0||r.archivoMigracion011)&&(e.config=r),e}const bs=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:es},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:ss},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ls},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:us},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:ps},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:fs},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:vs}],hs=["history","escenarios","planes","goals"],ys=["escenarios","planes","goals"];function io(t,a,e){let o=t;const n=[];for(const s of[...bs].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const mt="state_",me="state__schemaVersion",qt="financeapp_",Ue="state__modificadoEn";function ro(t=localStorage,a=qt){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Ue&&t.setItem(e(Ue),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function $s(t=localStorage,a=qt){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(mt)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function xs({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Is={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function ws(t,a){const e=Is[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function Cs(t){return W(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Ss({adapter:t,hoy:a=new Date}){const e=W(a),o=Cs(a);let n=Oe(e,o);const s=new Set;let i=[];const r=xs();function c(x){for(const T of s)T(x)}function l(x){t.set(`${mt}${x}`,n[x])}function p(){const x={};for(const q of Object.keys(n)){const L=t.get(`${mt}${q}`);L!==null&&(x[q]=L)}for(const q of hs){const L=t.get(`${mt}${q}`);L!==null&&(x[q]=L)}const T=t.get(me),{state:D,applied:z}=io(x,T,{hoyISO:e,finISO:o});if(n=d(D),u(),z.length>0){for(const q of Object.keys(n))l(q);t.set(me,Qt);for(const q of ys)t.remove(`${mt}${q}`)}return i=z,{applied:z}}function d(x){const T=Oe(e,o),D={...T,...x};for(const q of Object.keys(T))q!=="config"&&(Array.isArray(D[q])||(D[q]=T[q]));const z=x.config&&typeof x.config=="object"?x.config:{};return D.config={...ke(e,o),...z},D}function u(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Le(e)],l("accounts");return}const x=n.accounts.filter(T=>T.esCuentaPrincipal);if(x.length===0)n.accounts=n.accounts.map((T,D)=>D===0?{...T,esCuentaPrincipal:!0}:T),l("accounts");else if(x.length>1){let T=!1;n.accounts=n.accounts.map(D=>D.esCuentaPrincipal?T?{...D,esCuentaPrincipal:!1}:(T=!0,D):D),l("accounts")}}function v(x){return n[x]}function f(x,T){n[x]=T,l(x),c(x)}function b(x){f("config",{...n.config,...x})}function y(x){return s.add(x),()=>s.delete(x)}function g(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function h(x,T){const D=[...n[x]],z={...T,_id:g()};return D.push(z),f(x,D),z}function S(x,T,D){const z=n[x].map(q=>q._id===T?{...q,...D}:q);f(x,z)}function C(x,T){const D=n[x],z=D.findIndex(q=>q._id===T);z<0||(r.registrar({col:x,item:D[z],indice:z}),f(x,D.filter((q,L)=>L!==z)))}function I(){const x=r.tomar();if(!x)return null;const T=[...n[x.col]];return T.splice(Math.min(x.indice,T.length),0,x.item),f(x.col,T),x}function $(){return r.pendiente()}function A(){const x=n.accounts||[],T=x.find(D=>D.esCuentaPrincipal&&D.activo)||x.find(D=>D.activo);return T?T._id:"default"}function E(x){var T;return((T=n.accounts.find(D=>D._id===x))==null?void 0:T.nombre)??x}function w(){return Dt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function P(){return Dt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function M(x,T=null){const{state:D,applied:z}=io(x,T,{hoyISO:e,finISO:o});n=d(D),u();for(const q of Object.keys(n))l(q);t.set(me,Qt);for(const q of Object.keys(n))c(q);return{applied:z}}return{load:p,get:v,set:f,patchConfig:b,subscribe:y,addItem:h,updateItem:S,removeItem:C,deshacerBorrado:I,borradoPendiente:$,getPrincipalAccountId:A,accountName:E,resolverTramosIRPF:w,resolverTramosGanancias:P,snapshot:_,replaceAll:M,get schemaVersion(){return Qt},get migrationsApplied(){return[...i]},get today(){return e||K()}}}function As(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const St=Object.keys(Oe("1970-01-01","1970-01-01"));function co(t){const a={};for(const e of St){const o=t.get(`${mt}${e}`);o!=null&&(a[e]=o)}return a}function Ms(t,a){const e=[];for(const o of St){const n=a[o];n!=null&&(t(`${mt}${o}`,n),e.push(o))}return e}function Es(t){return St.filter(a=>t[a]===void 0||t[a]===null)}function Ps(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!St.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const lo=`${qt}meta_proyectos`,uo=`${qt}meta_proyectoActivo`,At="default",_s="Mis finanzas";function Ye(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function te(t){return t===At?qt:`${qt}p_${t}_`}function po(){return[...St.map(t=>`${mt}${t}`),me,Ue]}function Fs(t=localStorage){function a(){try{const d=t.getItem(lo);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function e(d){t.setItem(lo,JSON.stringify(d))}function o(){const d=a();if(d.some(f=>f._id===At))return d;const u=Date.now(),v=[{_id:At,nombre:_s,creadoEn:u,actualizadoEn:u},...d];return e(v),v}function n(){try{const d=t.getItem(uo);if(!d)return At;const u=JSON.parse(d);return typeof u=="string"&&u?u:At}catch{return At}}function s(d){t.setItem(uo,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),f={_id:Ye(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),f]),f}function r(d,u){const v=u.trim();v&&e(o().map(f=>f._id===d?{...f,nombre:v,actualizadoEn:Date.now()}:f))}function c(d,u){const v=o().find(g=>g._id===d);if(!v)throw new Error("Proyecto no encontrado.");const f=te(d),b={_id:Ye(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},y=te(b._id);for(const g of po()){const h=t.getItem(`${f}${g}`);h!==null&&t.setItem(`${y}${g}`,h)}return e([...o(),b]),b}function l(d){if(d===At)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(f=>f._id===d))return;const v=te(d);for(const f of po())t.removeItem(`${v}${f}`);e(u.filter(f=>f._id!==d))}function p(d){const u=new Map(o().map(f=>[f._id,f]));for(const f of d){if(!f||typeof f._id!="string")continue;const b=u.get(f._id);(!b||(f.actualizadoEn??0)>b.actualizadoEn)&&u.set(f._id,f)}const v=[...u.values()];return e(v),v}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:p}}function Ds(t,a,e){const o=ro(t,te(a)),n={};for(const s of e){const i=o.get(`${mt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Ts(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Ye())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const ot={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},It=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:ot.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:ot.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:ot.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:ot.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:ot.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:ot.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:ot.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:ot.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:ot.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:ot.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:ot.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:ot.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:ot.datos,porDefecto:!1,dependencias:["sync-nube"]}],zs=new Map(It.map(t=>[t.id,t]));function ee(t){return zs.get(t)}function mo(t){return It.filter(a=>(a.dependencias||[]).includes(t))}function We(){const t={};for(const a of It)t[a.id]=a.porDefecto;return t}function fo(){const t=[],a=new Map;for(const e of It)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function js(t){function a(){return{...We(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,u=a(),v=new Set){const f=ee(d);if(!f)return!1;if(f.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of f.dependencias||[])if(!o(b,u,v))return!1;return!0}function n(d,u=a()){const v=ee(d);return v?(v.dependencias||[]).filter(f=>!o(f,u)):[]}function s(d,u){var S;const v=ee(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const f=a(),b=new Map(It.map(C=>[C.id,o(C.id,f)])),y={...f,[d]:u};let g;if(u){const C=[...v.dependencias||[]];for(;C.length;){const I=C.pop();y[I]===!1&&(y[I]=!0,g="dependencias-activadas"),C.push(...((S=ee(I))==null?void 0:S.dependencias)||[])}}else{const C=mo(d).map(I=>I.id);for(;C.length;){const I=C.pop();y[I]!==!1&&(y[I]=!1,g="cascada-apagado"),C.push(...mo(I).map($=>$.id))}}return e(y),{cambiadas:It.filter(C=>o(C.id,y)!==b.get(C.id)).map(C=>C.id),motivo:g}}function i(){const d=a();return It.map(u=>{const v=n(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=a();return fo().map(({grupo:u,features:v})=>({grupo:u,features:v.map(f=>{const b=n(f.id,d);return{...f,activa:o(f.id,d),...b.length>0&&d[f.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(We())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function p(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const f=We(),b=[],y=[];for(const[g,h]of Object.entries(v)){if(!ee(g)){y.push(g);continue}if(typeof h!="boolean"){y.push(g);continue}f[g]=h,b.push(g)}return e(f),{aplicadas:b,ignoradas:y}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:p,bloqueadaPor:d=>n(d)}}const ae=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Rt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function qs(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(ae).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${ae(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${ae(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${ae(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Rs(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${ae(o)}</div>
        ${n.map(qs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Ns(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ls(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Rs(e)}`,n(i)}function n(i){var c,l,p;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var f;const u=d.dataset.featureToggle,v=e.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&Rt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Rt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(f=t.onChange)==null||f.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),f=a.createElement("a");f.href=v,f.download=`financeapp-funcionalidades-${K()}.json`,f.click(),URL.revokeObjectURL(v),Rt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:f,ignoradas:b}=e.importProfile(JSON.parse(await d.text()));Rt(t,b.length>0?`Perfil cargado (${f.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${f.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,f),o(i)}catch(f){Rt(t,"No se pudo cargar el perfil: "+f.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var d;e.reset(),Rt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=Ns(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ks={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function go(t){return ks[t]??t}function ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function vo(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Os(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Hs(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function Bs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Gs(t,a){const e=t._id===a,o=t._id==="default";return`
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
    </div>`}function Vs(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(go(i))}
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
    </div>`}function Us(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Ys(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Gs(l,c)).join("")}
      </div>
      ${Us()}
      ${Vs(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(f=>f._id===d);if(v){if(u==="cambiar"){if(!vo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(d),Os(t);return}if(u==="renombrar"){const f=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!f||!f.trim())return;e.renombrar(d,f.trim()),ft(t,"Proyecto renombrado"),n(r);return}if(u==="duplicar"){const f=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",f):f;if(b===null)return;const y=e.duplicar(d,b.trim()||f);ft(t,`"${y.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(u==="eliminar"){if(!vo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),ft(t,`"${v.nombre}" eliminado`),n(r)}catch(f){ft(t,f.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),d=p==null?void 0:p.value.trim();if(!d){ft(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(d);ft(t,`"${u.nombre}" creado ✓`),n(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(f=>f.dataset.proyectoImportCol);if(d.length===0){ft(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,d);if(u.length===0){ft(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}ft(t,`Importado: ${u.map(go).join(", ")} ✓`),Hs(),n(r)})}function i(){const r=Bs(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const fe=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Mt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Nt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ws(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Ks(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Js(t){const a=t.color||fe[0];return`
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
    </div>`}function Qs(){return`
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
    </div>`}function Xs(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Js).join("")}
      </div>
      ${Qs()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,f=e.get("personas"),b=f.find(y=>y._id===u);if(b){if(v==="renombrar"){const y=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!y||!y.trim())return;e.updateItem("personas",u,{nombre:y.trim()}),Nt(t,"Persona renombrada"),s(),n(c);return}if(v==="defecto"){e.set("personas",f.map(y=>({...y,esPorDefecto:y._id===u}))),Nt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),s(),n(c);return}if(v==="eliminar"){if(f.length<=1){Nt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Ws(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),Nt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){Nt(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||fe[0],f=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});Nt(t,`"${f.nombre}" creada ✓`),s(),n(c)})}function r(){const c=Ks(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const bo={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function ho(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Zs({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,p])=>[p,l]);for(const[l,p]of[...Object.entries(bo),...c]){const d=t.isEnabled(l),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=d?"":"none"),!d&&n()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const p=[...l.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const d=p.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),ho(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{ho(a,p=>t.isEnabled(p))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:s,observar:i,vistaPara:r=>bo[r]}}const ti="toast toast-deshacer";function ei(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function l(d){const u=n();if(!u)return;c();const v=document.createElement("div");v.className=ti,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const f=document.createElement("span");f.textContent=`${ws(d.col,d.item)} se ha eliminado.`,f.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const y=a.deshacerBorrado();if(c(),!y)return;const g=n();if(g){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",g.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),v.appendChild(f),v.appendChild(b),u.appendChild(v),s=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{p(),c()}}function ge(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function yo(t,a){const e=ge(t),o=ge(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const oe=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function ai(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[oe(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:oe(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:oe(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${oe(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,oe(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function oi(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=ge(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of ai(t)){if(!i(c.ruta))continue;const l=yo(c.titulo,s),p=l>=0?-1:Math.min(yo(c.extra??"",s),2);if(l<0&&p<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,ge(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const ni="buscador-overlay",$o="btn-buscador";function si(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const C=a.createElement("div");C.id=ni,C.className="modal-overlay",C.style.alignItems="flex-start",C.style.paddingTop="10vh";const I=a.createElement("div");I.className="modal-box",I.style.maxWidth="560px",I.style.padding="14px";const $=a.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",I.appendChild($),I.appendChild(A),C.appendChild(I),a.body.appendChild(C),C.addEventListener("click",E=>{E.target===C&&b()}),$.addEventListener("input",()=>{r=0,p()}),$.addEventListener("keydown",v),o=C,n=$,s=A,C}function l(){if(s){if(s.textContent="",i.length===0){const C=a.createElement("div");C.style.padding="14px 4px",C.style.fontSize="13px",C.style.color="var(--text3)";const I=(n==null?void 0:n.value.trim())??"";C.textContent=I.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(C);return}i.forEach((C,I)=>{const $=a.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(I),I===r&&$.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const E=a.createElement("div");E.textContent=C.titulo,E.style.fontSize="13px",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap";const w=a.createElement("div");w.textContent=C.detalle,w.style.fontSize="11px",w.style.color="var(--text3)",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap",A.appendChild(E),C.detalle&&A.appendChild(w);const P=a.createElement("span");P.className="tag",P.textContent=C.etiqueta,P.style.flexShrink="0",$.appendChild(A),$.appendChild(P),$.addEventListener("click",()=>u(I)),s.appendChild($)})}}function p(){const C=(n==null?void 0:n.value)??"";i=oi(t.estado(),C,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(C){var I,$;i.length!==0&&(r=(r+C+i.length)%i.length,l(),($=(I=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:I.scrollIntoView)==null||$.call(I,{block:"nearest"}))}function u(C){const I=i[C];I&&(b(),t.navegar(I.ruta))}function v(C){C.key==="Escape"?(C.preventDefault(),b()):C.key==="ArrowDown"?(C.preventDefault(),d(1)):C.key==="ArrowUp"?(C.preventDefault(),d(-1)):C.key==="Enter"&&(C.preventDefault(),u(r))}function f(){const C=o??c();C.classList.remove("hidden"),C.style.display="",r=0,n&&(n.value="",n.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function y(){return!!o&&o.style.display!=="none"}function g(C){(C.ctrlKey||C.metaKey)&&(C.key==="k"||C.key==="K")&&(C.preventDefault(),y()?b():f())}a.addEventListener("keydown",g);let h=null;function S(){const C=a.getElementById("period-bar");if(!C||a.getElementById($o))return;const I=a.createElement("button");I.id=$o,I.type="button",I.className="btn-secondary",I.title="Buscar en toda la aplicación (Ctrl+K)",I.setAttribute("aria-label","Buscar"),I.textContent="🔍 Buscar",I.style.marginLeft="auto",I.addEventListener("click",f),C.appendChild(I),h=I}return S(),()=>{a.removeEventListener("keydown",g),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Ke="aviso-guardado";function ii(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function l(){var f;r&&clearTimeout(r),r=null,(f=a.getElementById(Ke))==null||f.remove()}function p(){if(s==="oculto")return l();const f=e();if(!f)return;let b=a.getElementById(Ke);b||(b=a.createElement("div"),b.id=Ke,f.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const y=a.createElement("span");if(y.style.flex="1",b.appendChild(y),s==="pendiente")y.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",p()}));else if(s==="subiendo"){y.textContent="Subiendo…";const g=a.createElement("span");g.className="guardado-giro",g.setAttribute("aria-hidden","true"),b.appendChild(g)}else s==="guardado"?y.textContent="¡Guardado!":s==="error"&&(y.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(f,b,y){const g=a.createElement("button");return g.type="button",g.className=b,g.textContent=f,g.style.flexShrink="0",g.addEventListener("click",y),g}async function u(){if(c)return c;r&&clearTimeout(r);const f=t.cambios.revision();return s="subiendo",p(),c=(async()=>{try{await t.guardar(),n.alDia(f),s="guardado",p(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",p()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:u,hayPendiente:()=>n.pendiente(),detener(){v(),l()}}}function ri({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(f){return`view-${f}`}function s(f){const b=t.getElementById(n(f.route));if(b)return b;const y=t.querySelector(".view-container");if(!y)return null;const g=t.createElement("div");return g.id=n(f.route),g.className="view hidden",y.appendChild(g),g}function i(f){if(t.querySelector(`.nav-btn[data-view="${f.route}"]`))return;const b=t.querySelectorAll(".nav-section"),y=b[f.seccion??Math.max(0,b.length-1)];if(!y)return;const g=t.createElement("button");g.className="nav-btn",g.dataset.view=f.route,g.innerHTML=`${f.iconoPath?`<svg viewBox="0 0 24 24"><path d="${f.iconoPath}"/></svg>`:""}<span>${f.nombre}</span>`,y.appendChild(g),g.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(f.route)})}function r(f){e.set(f.route,f),s(f),i(f)}function c(){return[...e.keys()].filter(f=>{const b=e.get(f);return!a||a(b.flagId??b.id)})}function l(f){return c().includes(f)}function p(f){const b=e.get(f);if(!b||a&&!a(b.flagId??b.id))return!1;const y=s(b);if(!y)return!1;if(o&&o!==f){const g=e.get(o),h=t.getElementById(n(o));g!=null&&g.unmount&&h&&g.unmount(h)}return b.mount(y),o=f,!0}function d(){o&&p(o)}function u(){const f={};for(const[b,y]of e)f[b]=y.flagId??y.id;return f}function v(){for(const f of e.values())s(f),i(f)}return{register:r,routes:c,has:l,mount:p,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function wt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(F(t))}</span>`}function ci(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function xo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const li=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ve(t){const[a,e]=t.split("-").map(Number);return`${li[e-1]} ${a}`}function N(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function nt(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function Et(t=document){const a=t.getElementById("modal-content");if(!a)return null;const e=a.cloneNode(!1);return a.replaceWith(e),e}function j(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function U(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function ct(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Io(t,a){const e=parseFloat(ct(t,a));return Number.isFinite(e)?e:0}const di="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Je(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ui(t){const{store:a}=t,e=t.hoy??K,o=()=>O(e()),n=()=>a.get("config").margenesSeguridad??[];function s(v){var f;a.patchConfig({margenesSeguridad:v}),(f=t.onDatosCambiados)==null||f.call(t)}function i(v,f){const b=n().map(g=>({...g,puntos:(g.puntos??[]).map(h=>({...h}))})),y=b.find(g=>g._id===v);y&&(f(y),s(b))}function r(v){const f=a.get("config"),b=Ne(v,a.get("expenses"),f,a.get("loans"),e(),!1,o());return F(b)}function c(v,f,b){const y=f.tipo==="fijo",g=y?"":`<span class="text-sm" style="color:var(--text3)">${m(F((f.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(f._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(f.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${y?" selected":""}>Fijo €</option>
            <option value="meses"${y?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${y?`<input type="number" class="form-input" style="width:90px" value="${f.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${y?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${f.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${g}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,f,b){const y=v.cuentas&&v.cuentas.length>0?v.cuentas.map(C=>{var I;return((I=f.find($=>$._id===C))==null?void 0:I.nombre)??C}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((C,I)=>C.fecha.localeCompare(I.fecha)).map(C=>c(v,C,b)).join(""),S=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(y)}</div>
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
      </div>`}function p(v,f){const b=f?n().find(S=>S._id===f):null,y=a.get("accounts").filter(S=>S.activo),g=new Set((b==null?void 0:b.cuentas)??[]),h=y.map(S=>`
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
      </div>`}function d(v,f){const b=document.getElementById("modal-overlay"),y=Et();!b||!y||(p(y,v),b.classList.remove("hidden"),U(y,".mg-acc-chip",g=>{const h=g,S=y.querySelector(`[data-chip="${h.value}"]`);S&&(S.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(y,"#mg-p-tipo",g=>{const h=g.value==="fijo",S=y.querySelector("#mg-p-importe-wrap"),C=y.querySelector("#mg-p-meses-wrap");S&&(S.style.display=h?"":"none"),C&&(C.style.display=h?"none":"")}),j(y,"[data-cerrar-form]",()=>b.classList.add("hidden")),j(y,"[data-guardar-margen]",g=>{var $,A,E,w,P;const h=g.getAttribute("data-guardar-margen")||"",S=(($=y.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!S)return N("El nombre es obligatorio","err");const C=[...y.querySelectorAll(".mg-acc-chip:checked")].map(_=>_.value),I=n().map(_=>({..._}));if(h){const _=I.findIndex(M=>M._id===h);if(_===-1)return N("Margen no encontrado","err");I[_]={...I[_],nombre:S,cuentas:C}}else{const _=((A=y.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",M={_id:Je(),fecha:((E=y.querySelector("#mg-p-fecha"))==null?void 0:E.value)||K(),tipo:_,importe:parseFloat(((w=y.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((P=y.querySelector("#mg-p-meses"))==null?void 0:P.value)??"1")||1};I.push({_id:Je(),nombre:S,activo:!0,cuentas:C,puntos:[M]})}s(I),N(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),f()}))}function u(v){const f=n(),b=a.get("accounts"),y=Jt(a.get("expenses"),o());v.innerHTML=`
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
             </div>`:f.map(h=>l(h,b,y)).join("")}`;const g=()=>u(v);j(v,"[data-nuevo-margen]",()=>d(null,g)),j(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),g)),j(v,"[data-borrar-margen]",h=>{nt("¿Eliminar este margen de seguridad?")&&(s(n().filter(S=>S._id!==h.getAttribute("data-borrar-margen"))),N("Margen eliminado"),g())}),U(v,"[data-toggle-margen]",h=>{const S=h.getAttribute("data-toggle-margen");i(S,C=>{C.activo=h.checked}),g()}),j(v,"[data-add-punto]",h=>{const S=h.getAttribute("data-add-punto");i(S,C=>{C.puntos=[...C.puntos??[],{_id:Je(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),g()}),j(v,"[data-borrar-punto]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=S.dataset.margen,I=S.dataset.punto;i(C,$=>{$.puntos=($.puntos??[]).filter(A=>A._id!==I)}),g()}),U(v,"[data-campo]",h=>{const S=h.closest("[data-punto]");if(!S)return;const C=h.getAttribute("data-campo"),I=h.value;i(S.dataset.margen,$=>{const A=($.puntos??[]).find(E=>E._id===S.dataset.punto);A&&(C==="fecha"?A.fecha=I:C==="tipo"?A.tipo=I:C==="importe"?A.importe=parseFloat(I)||0:A.meses=parseFloat(I)||0)}),g()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:di,mount:u}}const pi=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],mi=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],fi=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function gi(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Qe=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function wo(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=gi(t),i=Qe(pi.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Qe(mi,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Qe(fi,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Co(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function So(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const vi={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function bi(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Lt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const l=s.has(c._id),p=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${l?" checked":""}/>
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
      ${bi(e,a).map(r).join("")}
    </div>
  </div>`}function kt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function Ot(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,l=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=l?parseFloat(l.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:s}}function Ao(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${vi[t.modo]})`}function Xe(t,a,e){const o=Ao(t,e),n=Ao(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const hi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",yi=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function $i(t){const a=t.hoy??K,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},n=()=>t.store.get("accounts"),s=g=>{var h;return((h=n().find(S=>S._id===(g||"default")))==null?void 0:h.nombre)??(g||"default")};function i(){const g=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(S=>!S.fechaFin||S.fechaFin>=g)),e.tipo&&(h=h.filter(S=>S.tipo===e.tipo)),e.cuenta&&(h=h.filter(S=>(S.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(S=>(S.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(S=>(S.fechaInicio??"")<=e.hasta)),e.busqueda){const S=e.busqueda.toLowerCase();h=h.filter(C=>C.concepto.toLowerCase().includes(S))}return e.tags.size>0&&(h=h.filter(S=>(S.tags||[]).some(C=>e.tags.has(C)))),h.sort((S,C)=>{const I=S[e.orden]??"",$=C[e.orden]??"";return typeof I=="number"&&typeof $=="number"?(I-$)*e.sentido:String(I).localeCompare(String($))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(g=>g.tags||[]))].filter(Boolean).sort()}function c(g,h){const S=e.orden===g?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${g}">${m(h)} <span class="sort-arrow">${S}</span></span>`}function l(g,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(C=>C.activo!==!1).map(C=>`<option value="${m(C._id)}"${C._id===g?" selected":""}>${m(C.nombre)}</option>`).join("")}function p(g){const h=g.tipo==="transferencia",S=Xe(g.repartoConsumo,g.repartoPago,t.store.get("personas")),C=Pe(g.diaPago??""),I=g.tipoFrecuencia==="extraordinario"?"Único":`Cada ${g.frecuencia??1} ${g.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${C?` · ${C}`:""}`,$=!!g.fechaFin&&g.fechaFin<a(),A=h?'<span class="badge badge-purple">⇄ transf.</span>':g.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',E=h?`${m(s(g.cuenta))} → ${m(s(g.cuentaDestino))}`:m(s(g.cuenta)),w=(g.tags||[]).map(P=>`<span class="tag${e.tags.has(P)?" active":""}" data-tag="${m(P)}" title="Filtrar por ${m(P)}">${m(P)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(g.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${A}</div>
      <div class="num ${g.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(F(g.cuantia))}</div>
      <div class="text-sm">${m(I)}</div>
      <div class="text-sm exp-col-hide">${E}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(g._id)}"${g.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${g.tipo==="gasto"&&g.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${g.tipo==="gasto"&&g.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${g.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${g.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(g.ajustadaEn??"")}">ajustada</span>`:""}
        ${S?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(S)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(g._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(g._id)}">✕</button>
      </div>
    </div>`}function d(g){const h=i(),S=r();g.innerHTML=`
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
      </div>`}function u(g){const h=(g==null?void 0:g.tipo)==="transferencia",S=t.store.get("personas"),C=(I,$,A,E,w="")=>`<div class="form-group"><label class="form-label">${m($)}</label>
       <input class="form-input" type="${A}" id="${I}" value="${m(E)}" placeholder="${m(w)}"/></div>`;return`
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
            ${yi.map(([I,$])=>`<option value="${I}"${((g==null?void 0:g.tipoFrecuencia)??"mensual")===I?" selected":""}>${m($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${C("ef-fecha-ini","Fecha inicio","date",(g==null?void 0:g.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((g==null?void 0:g.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((g==null?void 0:g.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(g==null?void 0:g.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${g!=null&&g._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${C("ef-fecha-fin","Fecha fin (opcional)","date",(g==null?void 0:g.fechaFin)??"")}</div>
          <div class="mt-8">${wo(g==null?void 0:g.diaPago,"exp")}</div>
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
          ${h?"":`${Lt("Reparto de consumo",g==null?void 0:g.repartoConsumo,S,"consumo")}
                 ${Lt("Reparto de pago",g==null?void 0:g.repartoPago,S,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((g==null?void 0:g._id)??"")}">Guardar</button>
      </div>`}function v(g){var C;const h=((C=g.querySelector("#ef-tipo"))==null?void 0:C.value)??"gasto",S=(I,$)=>{const A=g.querySelector(I);A&&(A.style.display=$?"":"none")};S("#ef-destino-wrap",h==="transferencia"),S("#ef-basico-wrap",h!=="transferencia"),S("#ef-irpf-wrap",h==="ingreso"),S("#ef-clasificacion-wrap",h==="gasto")}function f(g,h,S){const C=document.getElementById("modal-overlay"),I=Et();!C||!I||(I.innerHTML=`<div class="modal-title">${m(h)}</div>${u(g)}`,C.classList.remove("hidden"),U(I,"#ef-tipo",()=>v(I)),U(I,"[data-dp-modo]",()=>Co(I)),U(I,'[data-reparto-modo="consumo"]',()=>kt(I,"consumo")),U(I,'[data-reparto-modo="pago"]',()=>kt(I,"pago")),j(I,"[data-cancelar]",()=>C.classList.add("hidden")),j(I,"[data-guardar]",$=>{b(I,$.getAttribute("data-guardar")||"")&&(C.classList.add("hidden"),S())}))}function b(g,h){const S=_=>{var M;return((M=g.querySelector(_))==null?void 0:M.value)??""},C=_=>{var M;return!!((M=g.querySelector(_))!=null&&M.checked)},I=S("#ef-tipo")||"gasto",$=I==="transferencia",A=S("#ef-concepto").trim(),E=parseFloat(S("#ef-cuantia"));if(!A||!Number.isFinite(E))return N("Concepto y cuantía obligatorios","err"),!1;const w=S("#ef-clasificacion"),P={concepto:A,tipo:I,cuantia:E,frecuencia:parseInt(S("#ef-frecuencia"),10)||1,tipoFrecuencia:S("#ef-tipo-frec")||"mensual",fechaInicio:S("#ef-fecha-ini"),fechaFin:S("#ef-fecha-fin")||null,diaPago:So(g),cuenta:S("#ef-cuenta"),cuentaDestino:$?S("#ef-cuenta-dest")||"default":void 0,activo:C("#ef-activo"),basico:!$&&C("#ef-basico"),sujetoIRPF:!$&&C("#ef-sujetoIRPF"),clasificacion:I==="gasto"?w||null:void 0,tags:$?["transferencia"]:S("#ef-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:$?void 0:Ot(g,"consumo"),repartoPago:$?void 0:Ot(g,"pago")};return h?(t.store.updateItem("expenses",h,P),N("Actualizado")):(t.store.addItem("expenses",P),N("Creado")),o(),!0}function y(g,h){const S=g.querySelector("[data-busqueda]");let C;S==null||S.addEventListener("input",()=>{clearTimeout(C),C=setTimeout(()=>{e.busqueda=S.value,h();const I=g.querySelector("[data-busqueda]");I==null||I.focus(),I==null||I.setSelectionRange(I.value.length,I.value.length)},250)}),U(g,"[data-expirados]",I=>{e.mostrarExpirados=I.checked,h()}),U(g,"[data-f-tipo]",I=>{e.tipo=I.value,h()}),U(g,"[data-f-cuenta]",I=>{e.cuenta=I.value,h()}),U(g,"[data-f-desde]",I=>{e.desde=I.value,h()}),U(g,"[data-f-hasta]",I=>{e.hasta=I.value,h()}),j(g,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),j(g,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),j(g,"[data-tag]",I=>{const $=I.getAttribute("data-tag");e.tags.has($)?e.tags.delete($):e.tags.add($),h()}),j(g,"[data-orden]",I=>{const $=I.getAttribute("data-orden");e.orden===$?e.sentido=e.sentido===1?-1:1:(e.orden=$,e.sentido=1),h()}),j(g,"[data-nuevo]",()=>f(null,"Nuevo gasto/ingreso",h)),j(g,"[data-editar]",I=>{const $=t.store.get("expenses").find(A=>A._id===I.getAttribute("data-editar"));$&&f($,"Editar",h)}),j(g,"[data-duplicar]",I=>{const $=t.store.get("expenses").find(w=>w._id===I.getAttribute("data-duplicar"));if(!$)return;const{_id:A,...E}=$;f({...E,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",h)}),j(g,"[data-borrar]",I=>{nt("¿Eliminar?")&&(t.store.removeItem("expenses",I.getAttribute("data-borrar")),N("Eliminado"),o(),h())}),U(g,"[data-activo]",I=>{const $=I;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:hi,mount(g){const h=()=>d(g);d(g),g.dataset.wired!=="1"&&(y(g,h),g.dataset.wired="1")}}}function be(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=vt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function Mo(t,a,e,o){return t.reduce((n,s)=>{const i=vt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function xi(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=X({...t,amortizaciones:o.slice(0,s)}),r=X({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:be(i.tabla,a,e)-be(r.tabla,a,e)}})}const Ze=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Ii(t,a){const e=Aa(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?Ma(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?Ea(t.tin||0,i):null,c=o&&n?xi(t,a.periodos,a.hoy):[],l=c.length?be(e.sinAmort.tabla,a.periodos,a.hoy)-be(e.tabla,a.periodos,a.hoy):null,p=l===null?null:l-e.costeTotalAmort,d=s?Mo(e.tabla,a.periodos,a.hoy,e.comAp):null,u=s&&o?Mo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
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
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(Ia(e.tae))}</div></div>
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(Pe(t.diaPago))}</div></div>`:""}
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

      ${d!==null?wi(t,e.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>Ci(v,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,f)=>Si(t._id,v,c[f]??null)).join("")}`:""}
    </div>
  </div>`}function wi(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
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
  </div>`}function Ci(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=vt(e.periodos,e.hoy,t.fecha);o=m(F(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(F(t.interes))}</td>
    <td class="num">${m(F(t.amortizacion))}</td>
    <td class="num">${m(F(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Si(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
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
  </div>`}const tt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ne=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,se=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,Ai=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Mi(t,a,e,o=K()){return`
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
            <select class="form-select" id="f-cuenta">${Ai(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${wo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${ne("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
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
          ${se("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Lt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Lt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${se("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${se("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${se("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ei(t,a,e=K()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${tt("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${ne("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${se("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Pi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function _i(t){const a=t.hoy??K;let e=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const A=$.filter(w=>w.activo);if(A.length<2)return"";const E=(w,P)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":m(w)}"
               style="${n===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(P)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${E(null,"Todas")}
      ${A.map(w=>E(w._id,w.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const A=X($).tabla.filter(E=>!E.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c($,A){const E=a(),w=E.slice(0,7),P=new Map;let _=0;for(const M of $){if(!M.activo||M.simulacion||A.has(M._id)||(M.fechaInicio||"")>E)continue;const x=X(M).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(w)),T=x.length>0?x[0].cuota:0;P.set(M._id,T),_+=T}return{porLoan:P,total:_,activos:[...P.values()].filter(M=>M>0).length}}function l($){const A=a().slice(0,7),E=[];for(const w of $){if(!w.activo||w.simulacion)continue;const P=X(w).tabla.filter(M=>!M.esAmortizacion),_=P[P.length-1];_&&_.fecha.slice(0,7)===A&&E.push({loan:w,cuota:_.cuota})}return E}function p($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function d($){const A=t.store.get("config"),E=A.dashboardStart,w=A.dashboardEnd,P=Math.max(1,(O(w).getTime()-O(E).getTime())/(30.44*864e5));let _=0;for(const M of $)!M.activo||M.simulacion||(_+=X(M).tabla.filter(x=>!x.esAmortizacion&&x.fecha>=E&&x.fecha<=w).reduce((x,T)=>x+T.cuota,0));return{media:_/P,desde:E,hasta:w}}function u($){const A=t.store.get("personas"),E=de(A),w=[...t.store.get("loans")].sort((R,H)=>H.tin-R.tin),P=n?w.filter(R=>De(R.repartoConsumo,R.repartoPago,E).has(n)):w,_=new Set(P.filter(r).map(R=>R._id)),M=e?P:P.filter(R=>!_.has(R._id)),x=c(w,new Set(w.filter(r).map(R=>R._id))),T=d(w),D=l(w),z=t.store.get("config"),q=t.store.get("inflacion"),L=new Date(O(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${_.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${_.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${m(p(D.map(R=>R.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(F(D.reduce((R,H)=>R+H.cuota,0)))}</strong> de cuotas para el mes que viene.
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
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(R=>Ii(R,{periodos:q,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:x.porLoan.get(R._id)??0,completado:_.has(R._id),personas:A})).join("")}
      </div>`;for(const R of $.querySelectorAll("[data-body-loan]"))o.has(R.dataset.bodyLoan??"")&&R.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),f=()=>Et(),b=()=>{var $;return($=v())==null?void 0:$.classList.add("hidden")};function y($,A){const E=v(),w=f();return!E||!w?null:(w.innerHTML=`<div class="modal-title">${m($)}</div>${A}`,E.classList.remove("hidden"),j(w,"[data-cancelar]",b),w)}function g($,A){const E=$?t.store.get("loans").find(P=>P._id===$)??null:null,w=y($?"Editar préstamo":"Nuevo préstamo",Mi(E,t.store.get("accounts"),t.store.get("personas"),a()));w&&(w.addEventListener("change",P=>{const _=P.target;_!=null&&_.matches("[data-dp-modo]")&&Co(w),_!=null&&_.matches('[data-reparto-modo="consumo"]')&&kt(w,"consumo"),_!=null&&_.matches('[data-reparto-modo="pago"]')&&kt(w,"pago")}),j(w,"[data-guardar-loan]",P=>{h(w,P.getAttribute("data-guardar-loan")||"")&&(b(),A())}))}function h($,A){const E=D=>{var z;return((z=$.querySelector(D))==null?void 0:z.value)??""},w=D=>{var z;return!!((z=$.querySelector(D))!=null&&z.checked)},P=E("#f-nombre").trim(),_=parseFloat(E("#f-capital")),M=parseFloat(E("#f-tin")),x=parseInt(E("#f-meses"),10);if(!P||!Number.isFinite(_)||!Number.isFinite(M)||!Number.isFinite(x))return N("Completa los campos obligatorios","err"),!1;const T={nombre:P,capital:_,tin:M,meses:x,fechaInicio:E("#f-fecha"),comisionApertura:parseFloat(E("#f-com-ap"))||0,comisionAmort:parseFloat(E("#f-com-am"))||0,diaPago:So($),cuenta:E("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:E("#f-tipo-tasa"),basico:w("#f-basico"),tags:E("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Ot($,"consumo"),repartoPago:Ot($,"pago")};return A?(t.store.updateItem("loans",A,T),N("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),N("Préstamo creado")),s(),!0}function S($,A,E){const w=t.store.get("loans").find(M=>M._id===$);if(!w)return;const P=A?(w.amortizaciones||[]).find(M=>M._id===A)??null:null,_=y(A?"Editar amortización":"Añadir amortización",Ei($,P,a()));_&&j(_,"[data-guardar-amort]",M=>{const[x,T]=(M.getAttribute("data-guardar-amort")||"").split("|");C(_,x,T)&&(b(),E([x]))})}function C($,A,E){var z;const w=q=>{var L;return((L=$.querySelector(q))==null?void 0:L.value)??""},P=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!P||!Number.isFinite(_)||_<=0)return N("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(q=>q._id===A);if(!M)return!1;const x={fecha:P,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((z=$.querySelector("#am-sim"))!=null&&z.checked)},T=M.amortizaciones||[],D=E?T.map(q=>q._id===E?{...q,...x}:q):[...T,{_id:Date.now().toString(36),...x}];return t.store.updateItem("loans",A,{amortizaciones:D}),N(E?"Amortización actualizada":"Amortización añadida"),s(),!0}function I($,A){j($,"[data-toggle-finalizados]",()=>{e=!e,A()}),j($,"[data-persona-tab]",E=>{n=E.getAttribute("data-persona-tab")||null,A()}),j($,"[data-nuevo-loan]",()=>g(null,A)),j($,"[data-toggle-loan]",(E,w)=>{var x;if((x=w.target)!=null&&x.closest("button"))return;const P=E.getAttribute("data-toggle-loan"),_=[...$.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===P);(_==null?void 0:_.classList.toggle("open"))?o.add(P):o.delete(P)}),j($,"[data-editar-loan]",E=>g(E.getAttribute("data-editar-loan"),A)),j($,"[data-borrar-loan]",E=>{if(!nt("¿Eliminar préstamo?"))return;const w=E.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),N("Eliminado"),s(),A()}),j($,"[data-amort-loan]",E=>{const w=E.getAttribute("data-amort-loan");o.add(w),S(w,null,A)}),j($,"[data-editar-amort]",E=>{const[w,P]=(E.getAttribute("data-editar-amort")||"").split("|");o.add(w),S(w,P,A)}),j($,"[data-borrar-amort]",E=>{const[w,P]=(E.getAttribute("data-borrar-amort")||"").split("|"),_=t.store.get("loans").find(M=>M._id===w);_&&(t.store.updateItem("loans",w,{amortizaciones:(_.amortizaciones||[]).filter(M=>M._id!==P)}),N("Amortización eliminada"),s(),A([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Pi,mount($){const A=(E=[])=>{for(const w of E)o.add(w);u($)};u($),$.dataset.wired!=="1"&&(I($,A),$.dataset.wired="1")}}}const ta=6.35;function Ht(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function Eo(t){return Math.max(0,(t.bruto||0)-Ht(t))}function Fi(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Di(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Ht(r),0),o=Math.max(0,a-e),n=yt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Eo(i)/o):0);return s}function Po(t,a,e){if(t.irpfModo==="manual")return Eo(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return lt(yt(t.bruto||0,Ht(t)),e);const o=Fi(a.filter(i=>i.irpfModo!=="manual")),n=Di(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,e)-lt(s,e);s+=r}return lt(yt(t.bruto||0,Ht(t)),e)}function Ti(t,a){return t.reduce((e,o)=>e+Po(o,t,a),0)}function zi(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function ji(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Ht(s),0);return zi(yt(e,o),a)}function qi(t,a,e){const o=t.bruto||0,n=Ht(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??ta,c=s*(r/100),l=Po(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:s>0?l/s*100:0,netoPorPaga:(s-c-l)/i}}function Ri(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const Ni={transporte:125,restaurante:220,otros:null},Li={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},ki=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Bt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Oi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Hi(t,a){const e=t.map((s,i)=>{const r=a.find(p=>p._id===s.cuenta),c=Ni[s.tipo],l=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(Li[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(F(s.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(F(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Bi(t,a){const e=a.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Bt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Bt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Oi(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Bt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Bt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Bt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${ki.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
          ${Bt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
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
        ${Lt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Lt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function _o(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ta),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:Ot(t,"consumo"),repartoPago:Ot(t,"pago")}}function Gi(t,a,e,o){const n=_o(t,a),s=a.reduce((g,h)=>g+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(yt(n.bruto,s),e.tramos),l=i-r-c,p=i/n.nPagas,d=r/n.nPagas,u=c/n.nPagas,v=p-d-u,f=n.grupoNomina?e.nominas.filter(g=>g.grupoNomina===n.grupoNomina&&g._id!==o):[],b=f.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(f.map(g=>g.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",y=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(F(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(F(n.bruto))}</span>
      ${y}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(F(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(F(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(F(l))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(F(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(F(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(F(v))}/paga`:`ingreso ${m(F(p))} − SS ${m(F(d))} − IRPF ${m(F(u))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function Vi(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Hi(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Gi(t,a,e,o))},i=()=>{var c,l;const r=(p,d)=>{const u=t.querySelector(p);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),U(t,'[data-reparto-modo="consumo"]',()=>kt(t,"consumo")),U(t,'[data-reparto-modo="pago"]',()=>kt(t,"pago")),j(t,"[data-flex-anadir]",()=>{var l,p,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return N("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),j(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const Fo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ui(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>Et(),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ht;function r(u,v){const f=o(),b=n();return!f||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,f.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Fo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Fo(b.tramos))}</span>
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
      </div>`);f&&(j(f,"[data-editar-tabla]",b=>{const y=b.getAttribute("data-editar-tabla");d(y==="default"?"default":Number(y))}),j(f,"[data-borrar-tabla]",b=>{const y=Number(b.getAttribute("data-borrar-tabla"));nt(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(g=>g.año!==y)),N(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(f,"[data-anadir-anyo]",()=>{var g;const b=parseInt(((g=f.querySelector("#irpf-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return N("Año inválido","err");const y=t.store.get("tramosIRPFHistorico");if(y.some(h=>h.año===b))return N("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${f}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${f}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((f,b)=>{const y=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(f.value)||0,parseFloat((y==null?void 0:y.value)??"")||0]})}function d(u){var h;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((h=v.find(S=>S.año===u))==null?void 0:h.tramos)??i()).map(S=>[...S]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,y=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!y)return;const g=()=>{const S=y.querySelector("#irpf-tramos-rows");S&&(S.innerHTML=l())};j(y,"[data-volver]",c),j(y,"[data-tr-anadir]",()=>{p(y),e.push([0,0]),g()}),j(y,"[data-tr-borrar]",S=>{p(y),e.splice(Number(S.getAttribute("data-tr-borrar")),1),g()}),j(y,"[data-tr-guardar]",()=>{p(y);const S=[...e].sort((C,I)=>C[0]-I[0]);if(S.length===0)return N("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:S}),N("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(C=>C.año===a?{...C,tramos:S}:C)),N(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Do=1500,Pt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Yi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,Wi=t=>(t.modeloFondo||"cuenta")==="pension";function Ki(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Ji(n,a,e,o)).join("")}</div>`}function Ji(t,a,e,o){const n=ze(t);if(!n)return"";const s=je(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,p)=>l+p.cantidad,0),c=Math.min(r,Do)*(s/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Do?"neg":""}">${m(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Qi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Xi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${Yi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Zi(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Qi(a))};U(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return N("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function tr(t,a,e,o){var y;const n=g=>{var h;return((h=t.querySelector(g))==null?void 0:h.value)??""},s=(g,h=0)=>{const S=parseFloat(n(g));return Number.isFinite(S)?S:h},i=g=>{var h;return!!((h=t.querySelector(g))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),l=n("#pen-grupo"),p={nombre:r,grupoNomina:l,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],f=((y=[...d].sort((g,h)=>h.fecha.localeCompare(g.fecha))[0])==null?void 0:y.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(f===null||Math.abs(c-f)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(f??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(f??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:d,aportaciones:u}}}const er="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function ar(t){const a=t.hoy??K,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const S=h.filter(I=>I.activo);if(S.length<2)return"";const C=(I,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${o===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${C(null,"Todas")}
      ${S.map(I=>C(I._id,I.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Dt(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??ht)(Number(a().slice(0,4)))}function i(h,S,C){const I=qi(h,S,C),$=!!S&&h.irpfModo!=="manual",A=Xe(h.repartoConsumo,h.repartoPago,t.store.get("personas")),E=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",I.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(F(I.flexAnual))}/año</span>`:"",Math.abs(I.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${I.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${E}</div>
      </div>
      <div class="num">${m(F(I.brutoAnual))}
        ${I.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(F(I.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(F(I.netoPorPaga))}</div>
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
    </div>`}const r=h=>{var S;return((S=t.store.get("accounts").find(C=>C._id===(h||"default")))==null?void 0:S.nombre)??(h||"default")};function c(h,S,C){const I=S.reduce((E,w)=>E+(w.bruto||0),0),$=Ti(S,C),A=I>0?$/I*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(F(I))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(F($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${S.map(E=>i(E,S,C)).join("")}
      </div>
    </div>`}function l(h){const S=s(),C=t.store.get("personas"),I=de(C),$=[...t.store.get("nominas")].sort((M,x)=>(x.bruto||0)-(M.bruto||0)),A=o?$.filter(M=>De(M.repartoConsumo,M.repartoPago,I).has(o)):$,{grupos:E,sueltas:w}=Ri(A),P=t.store.get("accounts").filter(Wi),_=$.filter(M=>M.activo!==!1);h.innerHTML=`
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
      ${[...E.entries()].map(([M,x])=>c(M,x,S)).join("")}
      ${w.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${w.map(M=>i(M,null,S)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Ki(P,_,S,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),d=()=>Et(),u=()=>{var h;return(h=p())==null?void 0:h.classList.add("hidden")};function v(h,S){const C=p(),I=d();return!C||!I?null:(I.innerHTML=`<div class="modal-title">${m(h)}</div>${S}`,C.classList.remove("hidden"),j(I,"[data-cancelar]",u),I)}function f(h,S){const C=h?t.store.get("nominas").find(E=>E._id===h)??null:null,I=[...(C==null?void 0:C.retribucionFlexible)??[]].map(E=>({...E})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},A=v(h?"Editar nómina":"Nueva nómina",Bi(C,$));A&&(Vi(A,I,$,h??""),j(A,"[data-guardar-nomina]",E=>{const w=_o(A,I);if(!w.nombre||w.bruto<=0)return N("Nombre y bruto anual son obligatorios","err");const P=E.getAttribute("data-guardar-nomina")||"",_={...w,activo:!0,tags:["nomina"]};P?(t.store.updateItem("nominas",P,_),N("Nómina actualizada")):(t.store.addItem("nominas",_),N("Nómina creada")),e(),u(),S()}))}function b(h,S){const C=h?t.store.get("accounts").find(A=>A._id===h)??null:null,I=[...(C==null?void 0:C.planAportaciones)??[]].map(A=>({...A})),$=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Xi(C,{nominas:t.store.get("nominas"),hoy:a()}));$&&(Zi($,I,a()),j($,"[data-guardar-pension]",A=>{const{datos:E,error:w}=tr($,I,C,a());if(w)return N(w,"err");const P=A.getAttribute("data-guardar-pension")||"";P?(t.store.updateItem("accounts",P,E),N("Plan actualizado")):(t.store.addItem("accounts",E),N("Plan creado")),e(),u(),S()}))}function y(h,S,C){j(h,"[data-persona-tab]",I=>{o=I.getAttribute("data-persona-tab")||null,S()}),j(h,"[data-nueva-nomina]",()=>f(null,S)),j(h,"[data-editar-nom]",I=>f(I.getAttribute("data-editar-nom"),S)),j(h,"[data-borrar-nom]",I=>{nt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",I.getAttribute("data-borrar-nom")),N("Eliminada"),e(),S())}),U(h,"[data-activo-nom]",I=>{const $=I;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),e(),S()}),j(h,"[data-tramos]",()=>C.abrir()),j(h,"[data-nueva-pension]",()=>b(null,S)),j(h,"[data-editar-pension]",I=>b(I.getAttribute("data-editar-pension"),S)),j(h,"[data-borrar-pension]",I=>{nt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",I.getAttribute("data-borrar-pension")),N("Plan eliminado"),e(),S())})}let g=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:er,mount(h){const S=()=>l(h);g??(g=Ui({store:t.store,onDatosCambiados:()=>{e(),S()},año:()=>Number(a().slice(0,4))})),l(h),h.dataset.wired!=="1"&&(y(h,S,g),h.dataset.wired="1")}}}const or="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",nr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",To={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},sr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function ir(t,a){const e=t.filter(c=>c.activo&&rt(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const l=ue(c,a);l&&(o+=l.saldo,n+=l.costBase,s+=l.plusvalia,i+=l.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function rr(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(O(o).getTime()-O(e).getTime())/(30.44*864e5)),s=Yt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(vt(a.inflacion,e,o)-1),l=i-c;r=`
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
  </div>`}function cr(t,a){const e=To[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(f=>f.cuenta===t._id).map(f=>({nomina:v,importe:f.importe}))),s=n.reduce((v,f)=>v+f.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),p=ji(l,a.tramosIRPF),d=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(F(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(F(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function lr(t){const a=ze(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(F(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(F(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function dr(t,a){const e=ue(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=O(o.dashboardStart),i=O(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,u=Math.max(0,p-d),v=Te(u,a.tramosGanancias),f=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",y=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",g=(A,E,w)=>A.map(P=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${E} ${m(P.contraparte)}: ${m(P.concepto)}</span>
          <span class="num ${w}">${m(F(P.total))} · ${P.ocurrencias} mov.</span>
        </div>`).join(""),S=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${g(n.entradas,"↓","pos")}
         ${g(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(F(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(F(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(F(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',C=a.invModo(t._id),I=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=C==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(F(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(F(e.neto))}</div><div class="stat-sub">${m(y)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(F(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(F(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(F(p-v))}</div><div class="stat-sub">${m(f)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${I(C==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${I(C==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${S}
    </div>`}function ur(t,a){const e=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=e[0],n=bt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((To[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${nr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${or}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(F(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(F(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${rr(t,a)}
    ${s==="beneficio"?cr(t,a):""}
    ${s==="pension"?lr(t):""}
    ${s==="inversion"?dr(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const pr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function mr(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function fr(t,a){const e=t?rt(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ne("ac-modelo","Tipo",pr,e)}
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
          ${ne("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${ne("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function gr(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=mr(a))};U(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return N("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),j(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function vr(t,a,e,o,n){const s=f=>{var b;return((b=t.querySelector(f))==null?void 0:b.value)??""},i=(f,b=0)=>{const y=parseFloat(s(f));return Number.isFinite(y)?y:b},r=f=>{var b;return!!((b=t.querySelector(f))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=s("#ac-modelo")||"cuenta",p=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:a,tipoBeneficio:p?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const f=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${f}a`,fecha:e?n:u.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function ea(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:J(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function br(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
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
    </div>`}const zo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function hr(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>Et(),s=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Wt;function r(u,v){const f=o(),b=n();return!f||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,f.classList.remove("hidden"),j(b,"[data-cerrar]",s),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(zo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(zo(b.tramos))}</span>
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
      </div>`);f&&(j(f,"[data-editar-tg]",b=>{const y=b.getAttribute("data-editar-tg");d(y==="default"?"default":Number(y))}),j(f,"[data-borrar-tg]",b=>{const y=Number(b.getAttribute("data-borrar-tg"));nt(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(g=>g.año!==y)),N(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),j(f,"[data-anadir-anyo-tg]",()=>{var g;const b=parseInt(((g=f.querySelector("#tg-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return N("Año inválido","err");const y=t.store.get("tramosGananciasCapitalHistorico");if(y.some(h=>h.año===b))return N("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${f}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${f}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,f)=>{const b=u.querySelector(`[data-tg-pct="${f}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(u){var g;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((g=v.find(h=>h.año===u))==null?void 0:g.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const y=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};j(b,"[data-volver-tg]",c),j(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),y()}),j(b,"[data-tg-borrar]",h=>{p(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),y()}),j(b,"[data-tg-guardar]",()=>{p(b);const h=[...e].sort((S,C)=>S[0]-C[0]);if(h.length===0)return N("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),N("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(S=>S.año===a?{...S,tramos:h}:S)),N(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const yr=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function $r(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${yr.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function xr(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function jo(t,a){const e=O(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Ir(t,a,e){const o=jo(e,1)[0],n=a.slice(0,7)<o?a.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function aa(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function wr(t,a){const{inicio:e,fin:o}=aa(a);return oa(t,e,o)}function oa(t,a,e){return Kt([t],{start:a,end:e}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function Cr(t,a){const{inicio:e,fin:o}=aa(a);return le(t.fechaInicio,t.fechaFin,e,o)}function Sr(t){function a(n,s={}){var _;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:l,hasta:p}=s,d=t.transacciones({estimacionId:n._id}),v=d.length===0&&(((_=n.tags)==null?void 0:_.length)??0)>0?t.transacciones({tags:n.tags}):d,f=l&&p?Ir(l,p,c):jo(c,i),b=new Map(f.map(M=>{const{inicio:x,fin:T}=aa(M);return[M,{inicio:l&&l>x?l:x,fin:p&&p<T?p:T}]})),y=new Map;for(const M of v){const x=b.get(M.fecha.slice(0,7));if(!x||M.fecha<x.inicio||M.fecha>x.fin)continue;const T=M.fecha.slice(0,7);y.set(T,(y.get(T)??0)+Math.abs(M.importeCts)/100)}const g=[];for(const M of f){const x=y.get(M);if(x===void 0||!Cr(n,M))continue;const T=b.get(M),D=G(oa(n,T.inicio,T.fin));g.push({mes:M,estimado:D,real:G(x),desviacion:G(x-D),precision:xr(D,x)})}const h=G(g.reduce((M,x)=>M+x.estimado,0)),S=G(g.reduce((M,x)=>M+x.real,0)),C=g.reduce((M,x)=>M+Math.abs(x.estimado),0),I=g.length===0?null:C>0?g.reduce((M,x)=>M+x.precision*Math.abs(x.estimado),0)/C:g.reduce((M,x)=>M+x.precision,0)/g.length,$=g.slice(-r),A=$.length>0?G($.reduce((M,x)=>M+x.real,0)/$.length):null,E=$.reduce((M,x)=>M+x.estimado,0),w=$.reduce((M,x)=>M+x.real,0),P=E>0?w/E:null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:g,estimadoTotal:h,realTotal:S,desviacionTotal:G(S-h),precision:I,mediaRealReciente:A,factorReciente:P,infraestimada:S>h}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:G(r.estimado),realTotal:G(r.real),desviacionTotal:G(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Ar(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Mr(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function Er(t,a,e,o){const n=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),s=n("gasto"),i=n("ingreso");return Mr(e,o).map(r=>{const c={desde:`${r}-01`,hasta:Ar(r)},l=b=>G(t.transacciones({...c,tipo:b}).reduce((y,g)=>y+Math.abs(g.importeCts)/100,0)),p=b=>G(b.reduce((y,g)=>y+wr(g,r),0)),d=p(s),u=l("gasto"),v=p(i),f=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:f,netoEstimado:G(v-d),netoReal:G(f-u)}})}const he=640,Gt=200,Q={top:14,right:16,bottom:26,left:54};function Pr(t){return ve(t).slice(0,3)}const _r={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function Fr(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=_r[a],o=t.flatMap(y=>[e(y).estimado,e(y).real]),n=he-Q.left-Q.right,s=Gt-Q.top-Q.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=y=>Q.left+(t.length===1?n/2:y/(t.length-1)*n),p=y=>Q.top+s-(y-r)/c*s,d=t.map((y,g)=>`${l(g)},${p(e(y).estimado)}`).join(" "),u=t.map((y,g)=>`${l(g)},${p(e(y).real)}`).join(" "),v=r<0?`<line x1="${Q.left}" y1="${p(0).toFixed(1)}" x2="${he-Q.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",f=t.map((y,g)=>`<circle cx="${l(g).toFixed(1)}" cy="${p(e(y).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(ve(y.mes))}: ${m(F(e(y).real))}</title></circle>`).join(""),b=t.map((y,g)=>`<text x="${l(g).toFixed(1)}" y="${Gt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(Pr(y.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${he} ${Gt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${Q.left}" y1="${Q.top}" x2="${Q.left}" y2="${Gt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Q.left}" y1="${Gt-Q.bottom}" x2="${he-Q.right}" y2="${Gt-Q.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Q.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(F(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${f}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const qo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},Dr=[25,50,100,250,0];function Tr(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:No(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ie(No(t,5)).desde,intervaloHasta:ie(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function Ro(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const n=Math.max(1,Math.ceil(o/e)),s=Math.min(Math.max(1,a),n),i=(s-1)*e;return{pagina:t.slice(i,i+e),actual:s,paginas:n,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function ye(t,a,e){if(t.total===0)return"";const o=(s,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${s}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,n=Dr.map(s=>`<option value="${s}"${s===a?" selected":""}>${s===0?"todos":`${s} por página`}</option>`).join("");return`
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
    </div>`}function na(t,a,e,o){const n=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function ie(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function No(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function sa(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:ie(e).desde,hasta:ie(o).hasta}}function zr(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function ia(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function jr(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function qr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(F(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(F(J(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(F(J(t.diferenciaCts)))}</strong></span>
    </div>`}function Rr(t,a){const{ledger:e}=t,o=(t.hoy??K)(),n=t.accounts().filter(x=>x.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?sa(a.periodoDesde,a.periodoHasta):i?zr(a.intervaloDesde,a.intervaloHasta):ie(a.mes),l={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(l),d=t.estimaciones().filter(x=>x.tipo!=="transferencia"),u=[...d.map(x=>({_id:x._id,etiqueta:`${m(x.concepto)} (${m(F(x.cuantia))})`})),...t.loans().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Préstamo: ${m(x.nombre)}`})),...t.nominas().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Nómina: ${m(x.nombre)}`}))],v=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts<0).reduce((x,T)=>x+T.importeCts,0),f=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts>0).reduce((x,T)=>x+T.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),y=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),g=n.map(x=>`<option value="${m(x._id)}"${x._id===a.cuentaId?" selected":""}>${m(x.nombre)}</option>`).join(""),h=x=>'<option value="">— sin asignar —</option>'+u.map(T=>`<option value="${m(T._id)}"${T._id===x?" selected":""}>${T.etiqueta}</option>`).join(""),S=x=>Object.keys(qo).map(T=>`<option value="${T}"${T===x?" selected":""}>${qo[T]}</option>`).join(""),C=Ro(p,a.pagina,a.porPagina),I=new Map(t.accounts().map(x=>[x._id,x.nombre])),$=C.pagina.map(x=>`
      <tr data-tx="${m(x._id)}" style="border-bottom:1px solid var(--border)${x.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(x.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(x.concepto)}</td>
        <td style="padding:7px 8px">${xo(x.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(I.get(x.cuentaId)??x.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(x._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${S(x.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(x._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(x.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${wt(J(x.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(x._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(x._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),A=i?Er(e,d,r,c):[],E=s?e.transacciones({desde:r,hasta:c}):[],w=s?ia(p):[],P=Ro(w,a.pagina,a.porPagina),_=P.pagina.map(x=>{const T=a.detalleAbierto.has(x.concepto),D=T?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${xo(x.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(x.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(x.concepto)}">Asignar</button>
               </div>
               ${qr(jr(x,E))}
             </td>
           </tr>`:"",z=T?x.movimientos.map(q=>{var L;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(q.fecha)}</span> · ${m(((L=t.accounts().find(R=>R._id===q.cuentaId))==null?void 0:L.nombre)??q.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(q._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(q.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${wt(J(q.importeCts))}</td>
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${wt(J(x.total))}</td>
        <td></td>
      </tr>${D}${z}`}).join(""),M=y.slice().reverse().slice(0,8).map(x=>{var T;return`
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
          <span>Gastos: ${wt(J(v))}</span>
          <span>Ingresos: ${wt(J(f))}</span>
          <span>Neto: ${wt(J(f+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(F(b))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${ye(P,a.porPagina,"conceptos")}
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
               ${ye(P,a.porPagina,"conceptos")}`:`${ye(C,a.porPagina,"movimientos")}
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
                      ${Fr(A,a.comparativa)}`:""}`}
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
          ${M?`<div class="mt-12">${M}</div>`:""}
        </div>
      </div>
    </div>`}function Nr(t,a,e,o){const{ledger:n}=a,s=()=>{e.pagina=1,o()};U(t,"#acc-cuenta",r=>{e.cuentaId=r.value,s()}),U(t,"#acc-mes",r=>{e.mes=r.value||e.mes,s()}),j(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",s()}),U(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,s()}),U(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,s()}),j(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),U(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),j(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),U(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,s()}),U(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,s()}),j(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),U(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:p,hasta:d}=sa(e.periodoDesde,e.periodoHasta),u=n.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:d,texto:e.filtroTexto||void 0}),v=ia(u).find(f=>f.concepto===c);if(v){for(const f of v.movimientos)n.asignarEstimacion(f._id,l);N(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),j(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,p=((l==null?void 0:l.value)??"").split(",").map(y=>y.trim().toLowerCase()).filter(Boolean);if(p.length===0)return N("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=sa(e.periodoDesde,e.periodoHasta),v=n.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:u,texto:e.filtroTexto||void 0}),f=ia(v).find(y=>y.concepto===c);if(f){for(const y of f.movimientos)n.actualizar(y._id,{tags:[...new Set([...y.tags,...p])]});N(`Etiquetas añadidas a ${f.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{s();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),j(t,"#nt-guardar",()=>{const r=ct(t,"#nt-concepto").trim(),c=Io(t,"#nt-importe");if(!r)return N("Indica un concepto","err");if(!(c>0))return N("Indica un importe mayor que cero","err");const l=ct(t,"#nt-tags").split(",").map(p=>p.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(a.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),N("Movimiento registrado"),a.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;nt("¿Eliminar este movimiento?")&&(n.eliminar(c),N("Movimiento eliminado"),a.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=n.transacciones().find(u=>u._id===c);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(J(l.importeCts))));if(p===null)return;const d=parseFloat(p.replace(",","."));if(!Number.isFinite(d)||d<=0)return N("Importe no válido","err");n.actualizar(c,{importe:d}),N("Movimiento actualizado"),a.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");n.asignarEstimacion(c,r.value||null),N("Asignación actualizada"),a.onDatosCambiados()}),U(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");n.actualizar(c,{tipo:r.value}),N("Tipo actualizado"),a.onDatosCambiados(),o()}),j(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return N("Indica el saldo","err");const c=Io(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(a.hoy??K)(),c,ct(t,"#pc-nota").trim()||void 0),N("Saldo real registrado"),a.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",r=>{nt("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(r.dataset.pcBorrar),N("Punto de control eliminado"),a.onDatosCambiados(),o())})}function ra(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const s=G(a*t.factorReciente),i=G(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:G(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Lr(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??K(),l=t.get("expenses"),p=l.find(f=>f._id===s);if(!p)throw new Error(`La estimación ${s} no existe`);const d={...p,fechaFin:c},u={...p,_id:a(),cuantia:G(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=l.map(f=>f._id===s?d:f);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(s,i={}){const r=[],c=[];for(const l of s)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(p){c.push({estimacionId:l.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const l=[];let p=c;const d=new Set;for(;p!=null&&p.ajustadaDesdeId&&!d.has(p._id);){d.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;l.unshift(b),p=b}const u=[];let v=c;const f=new Set([c._id]);for(;;){const b=i.find(y=>y.ajustadaDesdeId===v._id&&!f.has(y._id));if(!b)break;f.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Lo(t){var n;const a=t.estimaciones(),e=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(a.map(s=>[s._id,s]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:ra(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function kr(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Or(t){var r;const a=Lo(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${wt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${ci(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${kr(t)}
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
    </div>`}function Hr(t,a,e){j(t,"#ajustar-todas",()=>{const o=Lo(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!nt(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});N(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Br=[";",",","	","|"],Gr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function $e(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function xe(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Vr(t){let a=";",e=-1;for(const o of Br){const n=t.slice(0,20).map(c=>xe(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function re(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const p=s===","?o:n;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?e?-l:l:null}function ca(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return ko(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),ko(o,Number(e[2]),Number(e[1]))}return null}function ko(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Oo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ca(e)!==null).length/a.length}function Ho(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>re(e)!==null).length/a.length}function Ur(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=$e(t[i]);if(r&&Gr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&$e(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Oo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||$e(t[r]).includes("saldo"))continue;const c=Ho(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(Ho(c)>.5||Oo(c)>.5)continue;const l=c.reduce((p,d)=>p+d.length,0)/Math.max(1,c.length);l>i&&(i=l,s=r)}s>=0&&(e.concepto=s)}return e}function Yr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Vr(a),o=a.map(p=>xe(p,e).length),n=Math.max(...o);let s=o.findIndex(p=>p===n);s<0&&(s=0);const i=xe(a[s],e);let r=a.slice(s+1).map(p=>xe(p,e));const c=ca(i[0]??"")!==null||i.some(p=>re(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const l=Ur(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:l}}function Bo(t,a,e){return`${t}|${a}|${$e(e).replace(/\s+/g," ")}`}function Wr(t,a,e=[]){const o=new Map;for(const s of e){const i=Bo(s.fecha,s.importeCts,s.concepto);o.set(i,(o.get(i)??0)+1)}const n=new Map;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?ca(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let l=null;if(a.importe>=0)l=re(s[a.importe]??""),l===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?re(s[a.debe]??""):null,v=a.haber>=0?re(s[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const p=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=Bo(c,l,p),v=(n.get(u)??0)+1;n.set(u,v),d=v<=(o.get(u)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:l,errores:r,duplicada:d}})}function Kr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function Ie(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Jr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function la(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Wr(a.analisis,a.mapeo,e)}function Qr(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?Zr(a,a.analisis,a.mapeo):Xr()}
    </div>`}function Xr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Zr(t,a,e){const o=Kr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${m(c||`Columna ${l+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Jr.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${wt(J(o.sumaCts))}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,l=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(F(J(r.importeCts)))}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function tc(t,a,e,o){j(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return N("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var d;return((d=a.accounts().find(u=>u._id===p))==null?void 0:d.nombre)??p},r=s.reduce((p,d)=>p+d.eliminados,0),c=s.reduce((p,d)=>p+d.semanales,0),l=s.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");N(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),j(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,Ie(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),j(t,"[data-imp-cerrar]",()=>{Object.assign(e,Ie()),o()}),U(t,"#imp-cuenta",s=>{e.cuentaId=s.value,la(a,e),o()}),U(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),U(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),la(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&ec(s).then(r=>{const c=Yr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},la(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),j(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(l=>l.errores.length===0&&(e.incluirDuplicadas||!l.duplicada));if(s.length===0)return;for(const l of s)a.ledger.registrar({fecha:l.fecha,cuentaId:e.cuentaId,importe:Math.abs(J(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=s.map(l=>l.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);N(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,Ie()),a.onDatosCambiados(),o()})}function ec(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function ac(t,a){if(a<t)return 0;let e=0,[o,n]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(n).padStart(2,"0")}`<=a.slice(0,7);){const s=new Date(o,n,0).getDate(),i=`${o}-${String(n).padStart(2,"0")}-01`,r=`${o}-${String(n).padStart(2,"0")}-${String(s).padStart(2,"0")}`,c=t>i?t:i,l=a<r?a:r,p=(O(l).getTime()-O(c).getTime())/864e5+1;e+=p/s,++n>12&&(n=1,o++)}return e}function oc(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function nc(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function da(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Go(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const l=(c.tags??[]).filter(p=>s.tags.includes(p)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(s)}return o}function Vo(t,a,e,o={}){const s=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&le(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:G(oa(c,a,e)),origen:"estimacion",periodicidad:xa(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&le(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=Re(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);s.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:G(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=qe(r,{start:a,end:e});for(const l of r){const p=c.filter(d=>d.sourceId===l._id);p.length!==0&&s.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:G(p.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return s}function sc(t,a,e,o={}){const{desde:n,hasta:s}=oc(e);return{...Uo(t,a,n,s,o),mes:e}}function Uo(t,a,e,o,n={}){const s=t.transacciones({desde:e,hasta:o}),i=new Set(n.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(da(D.concepto)),c=s.filter(D=>r(D)&&D.importeCts<0),l=s.filter(D=>r(D)&&D.importeCts>0),p=s.filter(D=>D.tipo!=="transferencia"&&i.has(da(D.concepto))),d=new Map((n.analisis??[]).map(D=>[D.estimacionId,D])),u=Vo(a,e,o,n),v=D=>new Set(D.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),f=u.filter(D=>D.tipo==="gasto"),b=u.filter(D=>D.tipo==="ingreso"),y=Go(c,f,D=>v(f).has(D)),g=Go(l,b,D=>v(b).has(D)),h=new Set,S=new Set,C=(D,z,q)=>{for(const H of z)q.add(H._id);const L=G(z.reduce((H,k)=>H+Math.abs(k.importeCts)/100,0)),R=D.origen==="estimacion"?d.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,periodicidad:D.periodicidad,tags:D.tags,estimado:D.estimado,real:L,desviacion:G(L-D.estimado),sinMovimiento:z.length===0,sugerencia:R?ra(R,D.cuantia??0,{hoy:n.hoy}):null}},I=f.map(D=>C(D,y.get(D._id)??[],h)),$=b.map(D=>C(D,g.get(D._id)??[],S)),A=(D,z)=>{const q=new Map;for(const L of D){if(z.has(L._id))continue;const R=da(L.concepto),H=q.get(R)??{concepto:L.concepto,clave:R,total:0,movimientos:0,ids:[]};H.total=G(H.total+Math.abs(L.importeCts)/100),H.movimientos+=1,H.ids.push(L._id),q.set(R,H)}return[...q.values()].sort((L,R)=>R.total-L.total)},E=A(c,h),w=A(l,S),P=A(p,new Set),_=G(I.reduce((D,z)=>D+z.estimado,0)),M=G(c.reduce((D,z)=>D+Math.abs(z.importeCts)/100,0)),x=G($.reduce((D,z)=>D+z.estimado,0)),T=G(l.reduce((D,z)=>D+z.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:_,real:M,desviacion:G(M-_),ingresosEstimados:x,ingresosReales:T,desviacionIngresos:G(T-x),netoEstimado:G(x-_),netoReal:G(T-M),desviacionNeta:G(T-M-(x-_)),filas:[...I,...$].sort((D,z)=>Math.abs(z.desviacion)-Math.abs(D.desviacion)),sinEstimacion:E,totalSinEstimacion:G(E.reduce((D,z)=>D+z.total,0)),ingresosSinPrever:w,totalIngresosSinPrever:G(w.reduce((D,z)=>D+z.total,0)),porTag:ic(f,c),meses:ac(e,o),omitidos:P,totalOmitido:G(P.reduce((D,z)=>D+z.total,0)),vacio:s.length===0}}function ic(t,a){const e=new Map,o=(n,s,i)=>{for(const r of n.length>0?n:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[s]+=i,e.set(r,c)}};for(const n of t)o(n.tags,"estimado",n.estimado);for(const n of a)o(n.tags,"real",Math.abs(n.importeCts)/100);return[...e.entries()].map(([n,s])=>({tag:n,estimado:G(s.estimado),real:G(s.real),desviacion:G(s.real-s.estimado)})).filter(n=>n.estimado>0||n.real>0).sort((n,s)=>s.real-n.real||s.estimado-n.estimado)}function Yo(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const we=26,ua=7,pa=(we+ua)*2,Wo=2*Math.PI*we,Ko=12;function rc(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function cc(t){const{color:a,fraccion:e,etiqueta:o}=rc(t),n=pa/2,s=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${pa} ${pa}" style="width:78px;height:78px" role="img" aria-label="${m(s)}">
        <title>${m(s)}</title>
        <circle cx="${n}" cy="${n}" r="${we}" fill="none" stroke="var(--bg3)" stroke-width="${ua}"/>
        <circle cx="${n}" cy="${n}" r="${we}" fill="none" stroke="${a}" stroke-width="${ua}"
                stroke-linecap="round" stroke-dasharray="${(Wo*e).toFixed(2)} ${Wo.toFixed(2)}"
                transform="rotate(-90 ${n} ${n})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=n+(o.length>1?r*10-1:4);return`<text x="${n}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(F(t.estimado))}</div>
    </div>`}function lc(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,Ko),e=t.slice(Ko),o=e.reduce((n,s)=>n+s.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(cc).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${m(F(o))}</span>`:""}
    </div>`}function dc(){return{mes:"",modo:"mes"}}function Jo(t,a){if(a.mes)return a.mes;const e=Yo(t.ledger),o=nc((t.hoy??K)());return e.includes(o)?o:e[0]??o}function Ce(t,a){var i;const e=(t.hoy??K)(),o=t.estimaciones(),n={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return Uo(t.ledger,o,r,c,{...n,analisis:l})}const s=t.precision.analizarTodas(o,{hoy:e});return sc(t.ledger,o,Jo(t,a),{...n,analisis:s})}function Qo(t){var n;const a=(t.hoy??K)(),e=Vo(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(n=t.resolverTramosIRPF)==null?void 0:n.call(t)}),o=s=>e.filter(i=>i.tipo===s).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function gt(t,a){return a<=0?"—":`${m(F(t/a))}/mes`}function Xo(t,a,e,o){const n=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function uc(t,a){const e=a.modo==="periodo",o=Jo(t,a),n=Yo(t.ledger);n.includes(o)||n.unshift(o);const s=Ce(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(s.desde)} al ${m(s.hasta)}`:m(ve(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Xo("mes",!e,"Mes","Cierra un mes natural completo")}
      ${Xo("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(s.desde)} → ${m(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${n.map(d=>`<option value="${m(d)}"${d===o?" selected":""}>${m(ve(d))}</option>`).join("")}
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
      </div>`;const l=d=>d>0?"+":"",p=s.desviacionNeta<0?"var(--red)":s.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
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
          <div class="stat-sub">${l(s.desviacion)}${m(F(s.desviacion))} · ${l(s.desviacion)}${gt(s.desviacion,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(s.ingresosReales))}</div>
          <div class="stat-sub">${gt(s.ingresosReales,s.meses)} · previsto ${m(F(s.ingresosEstimados))} (${gt(s.ingresosEstimados,s.meses)})</div>
          <div class="stat-sub">${l(s.desviacionIngresos)}${m(F(s.desviacionIngresos))} · ${l(s.desviacionIngresos)}${gt(s.desviacionIngresos,s.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${l(s.desviacionNeta)}${m(F(s.desviacionNeta))}</div>
          <div class="stat-sub">${l(s.desviacionNeta)}${gt(s.desviacionNeta,s.meses)}</div>
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

      ${pc(s)}
      ${mc(s,Qo(t))}
      ${gc(s,Qo(t))}
      ${fc(s)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${lc(s.porTag)}
    </div>`}function pc(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
           </div>`:""}`}function Zo(t,a,e,o){return`<tr>
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
  </tr>`}const tn=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function mc(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${tn}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>Zo(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function fc(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(a.concepto)} · ${m(F(a.total))} ✕</button>`).join("")}
    </div>`}function gc(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${tn}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>Zo(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function vc(t,a,e,o){U(t,"#cie-mes",n=>{e.mes=n.value,o()}),j(t,"[data-cie-modo]",n=>{e.modo=n.getAttribute("data-cie-modo")||"mes",o()}),j(t,"[data-cie-omitir]",n=>{const s=n.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(s)||(a.setOmitidos([...i,s]),N("Concepto omitido: deja de contar en el cierre"),o())}),j(t,"[data-cie-restaurar]",n=>{const s=n.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==s)),o()}),U(t,"[data-cie-asignar]",n=>{const s=n,i=s.getAttribute("data-cie-asignar"),r=s.value;if(!r)return;const c=Ce(a,e),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(p=>p.clave===i);if(l){if(!nt(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){s.value="";return}for(const p of l.ids)a.ledger.asignarEstimacion(p,r);N(`${l.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),j(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Ce(a,e).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??K)()}),N(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),j(t,"[data-cie-ajustar-todas]",()=>{const s=Ce(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??K)()});N((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const bc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function hc(t){const a=t.hoy??K,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let n="cuentas";const s=Tr(a().slice(0,7)),i=Ie(),r=dc(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:l,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),f={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>Dt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??ht),omitidos:()=>u().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},y=z=>{var q;return((q=t.store.get("accounts").find(L=>L._id===z))==null?void 0:q.nombre)??z},g=()=>Dt(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??ht)(Number(a().slice(0,4))),h=()=>Dt(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??Wt),S=()=>h()(Number(a().slice(0,4)));function C(){const z=u(),q=t.store.get("accounts"),L=Oa({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:q,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:h()}),R=new Map,H=B=>{let V=R.get(B);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},R.set(B,V)),V},k=(B,V)=>{const Z=`${V.sourceId}`,at=B.find(ba=>ba.concepto===Z),st=at??{concepto:Z,contraparte:"",total:0,ocurrencias:0};st.total+=Math.abs(V.cuantia),st.ocurrencias+=1,at||B.push(st)};for(const B of L){if(!B.cuenta)continue;const V=H(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(B.cuantia),k(V.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(B.cuantia),k(V.salidas,B)):B.sourceType==="investment-tax"&&(V.retencion+=Math.abs(B.cuantia))}const Y=t.store.get("expenses");for(const B of R.values())for(const[V,Z]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const at of V){const st=Y.find(ba=>ba._id===at.concepto);at.contraparte=y((st==null?void 0:st[Z])??"default"),at.concepto=(st==null?void 0:st.concepto)||(Z==="cuenta"?"Aportación":"Reembolso")}return R}function I(z){const q=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let L;if(n==="cuentas"){const k=t.store.get("accounts").filter(V=>rt(V)!=="pension"),Y=C(),B={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:g(),tramosGanancias:S(),flujos:V=>Y.get(V)??sr,invModo:V=>o.get(V)??"proyeccion"};L=`${ir(k,B.tramosGanancias)}<div class="grid-3">${k.map(V=>ur(V,B)).join("")}</div>`}else n==="movimientos"?L='<div id="acc-tx"></div>':n==="importar"?L='<div id="acc-import"></div>':L='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${q}
      </div>
      ${$r(n)}
      ${L}`;const R=()=>I(z);if(n==="movimientos"){const H=z.querySelector("#acc-tx");H.innerHTML=Rr(p,s),Nr(H,p,s,R)}else if(n==="importar"){const H=z.querySelector("#acc-import");H.innerHTML=Qr(d,i),tc(H,d,i,R)}else if(n==="cierre"){const H=z.querySelector("#acc-cierre"),k=z.querySelector("#acc-precision");H.innerHTML=uc(f,r),k.innerHTML=Or(b),vc(H,f,r,R),Hr(k,b,R)}}const $=()=>document.getElementById("modal-overlay"),A=()=>Et(),E=()=>{var z;return(z=$())==null?void 0:z.classList.add("hidden")};function w(z,q){const L=$(),R=A();return!L||!R?null:(R.innerHTML=z?`<div class="modal-title">${m(z)}</div>${q}`:q,L.classList.remove("hidden"),j(R,"[data-cancelar]",E),R)}function P(z,q){const L=z?t.store.get("accounts").find(Y=>Y._id===z)??null:null,R=[...(L==null?void 0:L.planAportaciones)??[]].map(Y=>({...Y})),H=L?_(L):null,k=w(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",fr(L,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:H??0}));k&&(gr(k,R,a()),j(k,"[data-guardar-acc]",Y=>{const B=Y.getAttribute("data-guardar-acc")||"",{datos:V,punto:Z,error:at}=vr(k,R,L,H,a());if(at)return N(at,"err");let st=B;B?t.store.updateItem("accounts",B,V):st=t.store.addItem("accounts",V)._id,Z&&t.ledger.registrarPuntoControl(st,Z.fecha,Z.saldo,Z.nota),N(B?"Actualizada":"Cuenta / fondo creado"),e(),E(),q()}))}function _(z){const q=t.ledger.puntosControl(z._id);return q.length>0?ea(q)[0].saldo:z.saldo??null}function M(z,q){const L=t.store.get("accounts").find(k=>k._id===z);if(!L)return;const R=w("Histórico de saldos",br(L.nombre,z,ea(t.ledger.puntosControl(z)),L.saldoInicial||0,a()));if(!R)return;const H=()=>{q(),M(z,q)};j(R,"[data-hist-anadir]",()=>{var V,Z,at;const k=((V=R.querySelector("#hi-fecha"))==null?void 0:V.value)??"",Y=parseFloat(((Z=R.querySelector("#hi-saldo"))==null?void 0:Z.value)??""),B=((at=R.querySelector("#hi-nota"))==null?void 0:at.value.trim())??"";if(!k||!Number.isFinite(Y))return N("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,k,Y,B||void 0),N("Punto añadido"),e(),H()}),j(R,"[data-hist-borrar]",k=>{const[,Y]=(k.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(Y),N("Eliminado"),e(),H()}),j(R,"[data-hist-semanal]",k=>{const Y=k.getAttribute("data-hist-semanal"),B=t.ledger.generarPuntosSemanales(Y);N(B>0?`Histórico con ${B} punto${B!==1?"s":""} semanal${B!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),H()}),j(R,"[data-hist-inicial]",k=>{const[Y,B]=(k.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(Y).find(at=>at._id===B);if(!V)return;const Z=ea([V])[0].saldo;t.store.updateItem("accounts",Y,{saldoInicial:Z,fechaInicialSaldo:V.fecha}),N(`Punto inicial → ${V.fecha} (${F(Z)})`),e(),H()})}function x(z){const q=t.store.get("accounts").filter(H=>H.activo);if(q.length===0)return N("No hay cuentas activas","err");const L=a(),R=q.map(H=>`• ${H.nombre}: ${F(_(H)??H.saldoInicial??0)}`).join(`
`);if(nt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${L})?

${R}

Esto recalibra el punto de arranque del dashboard.`)){for(const H of q)t.store.updateItem("accounts",H._id,{saldoInicial:_(H)??H.saldoInicial??0,fechaInicialSaldo:L});N("Saldo base actualizado"),e(),z()}}function T(z,q,L){j(z,"[data-cuentas-tab]",R=>{n=R.getAttribute("data-cuentas-tab")||"cuentas",q()}),j(z,"[data-nueva-acc]",()=>P(null,q)),j(z,"[data-editar-acc]",R=>P(R.getAttribute("data-editar-acc"),q)),j(z,"[data-tramos-ganancias]",()=>L.abrir()),j(z,"[data-reset-base]",()=>x(q)),j(z,"[data-hist-acc]",R=>M(R.getAttribute("data-hist-acc"),q)),j(z,"[data-principal-acc]",R=>{const H=R.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(k=>({...k,esCuentaPrincipal:k._id===H}))),N("Cuenta marcada como principal"),e(),q()}),j(z,"[data-borrar-acc]",R=>{const H=R.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return N("Debe existir al menos una cuenta","err");if(!nt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",H);const Y=t.store.get("accounts");Y.length>0&&!Y.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",Y.map((B,V)=>V===0?{...B,esCuentaPrincipal:!0}:B)),N("Cuenta eliminada"),e(),q()}),j(z,"[data-inv-modo]",R=>{const[H,k]=(R.getAttribute("data-inv-modo")||"").split("|");o.set(H,k==="real"?"real":"proyeccion"),q()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:bc,mount(z){const q=()=>I(z);D??(D=hr({store:t.store,onDatosCambiados:()=>{e(),q()},año:()=>Number(a().slice(0,4))})),I(z),z.dataset.wired!=="1"&&(T(z,q,D),z.dataset.wired="1")}}}function en(t,a,e=!1){const o=Math.abs(it(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function yc(t){function a(w){return`${w}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(w={}){var _;const P=(_=w.texto)==null?void 0:_.trim().toLowerCase();return t.get("transacciones").filter(M=>!(w.cuentaId&&M.cuentaId!==w.cuentaId||w.desde&&M.fecha<w.desde||w.hasta&&M.fecha>w.hasta||w.tipo&&M.tipo!==w.tipo||w.estimacionId&&M.estimacionId!==w.estimacionId||w.tags&&w.tags.length>0&&!w.tags.some(x=>M.tags.includes(x))||P&&!M.concepto.toLowerCase().includes(P))).sort((M,x)=>M.fecha.localeCompare(x.fecha)||M._id.localeCompare(x._id))}function o(w){const P={_id:a("tx"),fecha:w.fecha,cuentaId:w.cuentaId,importeCts:en(w.tipo,w.importe,w.negativo),concepto:w.concepto,tags:w.tags??[],estimacionId:w.estimacionId??null,tipo:w.tipo,origen:w.origen??"manual",...w.nota?{nota:w.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),P]),P}function n(w,P){t.set("transacciones",t.get("transacciones").map(_=>{if(_._id!==w)return _;const{importe:M,...x}=P,T={..._,...x};return M!==void 0&&(T.importeCts=en(T.tipo,M,T.importeCts<0)),T}))}function s(w){t.set("transacciones",t.get("transacciones").filter(P=>P._id!==w))}function i(w,P){n(w,{estimacionId:P})}function r(w){return t.get("puntosControl").filter(P=>!w||P.cuentaId===w).sort((P,_)=>P.fecha.localeCompare(_.fecha))}function c(w){return r(w).filter(P=>P.origen!=="derivado")}function l(w,P,_,M){const x={_id:a("pc"),fecha:P,cuentaId:w,saldoCts:it(_),...M?{nota:M}:{}},T=t.get("puntosControl").filter(D=>!(D.cuentaId===w&&D.fecha===P));return t.set("puntosControl",[...T,x].sort((D,z)=>D.fecha.localeCompare(z.fecha))),u(w),x}function p(w){const P=t.get("puntosControl").find(_=>_._id===w);t.set("puntosControl",t.get("puntosControl").filter(_=>_._id!==w)),P&&(P.origen==="derivado"?y(P.cuentaId):u(P.cuentaId))}function d(w,P,_){const M=T=>T.cuentaId===w&&T.origen!=="derivado"&&T.fecha>=P&&T.fecha<=_,x=t.get("puntosControl").filter(M).length;return x===0?0:(t.set("puntosControl",t.get("puntosControl").filter(T=>!M(T))),y(w),x)}function u(w){var R,H;const P=c(w),_=t.get("transacciones").filter(k=>k.cuentaId===w).sort((k,Y)=>k.fecha.localeCompare(Y.fecha)),M=(R=_[0])==null?void 0:R.fecha,x=(H=_[_.length-1])==null?void 0:H.fecha,T=t.get("puntosControl").filter(k=>!(k.cuentaId===w&&k.origen==="derivado"));if(!M)return t.set("puntosControl",T),y(w),0;const D=[];for(let k=Ut(M);k<=x;k=Ut($a(k,1)))D.push(k);D[D.length-1]!==x&&D.push(x);const z=new Set(P.map(k=>Ut(k.fecha))),q=k=>{const Y=P.filter(B=>B.fecha<=k).pop();return _.filter(B=>B.fecha<=k&&(!Y||B.fecha>Y.fecha)).reduce((B,V)=>B+V.importeCts,(Y==null?void 0:Y.saldoCts)??0)},L=D.filter(k=>!z.has(Ut(k))).map(k=>({_id:a("pcd"),fecha:k,cuentaId:w,saldoCts:q(k),origen:"derivado"}));return t.set("puntosControl",[...T,...L].sort((k,Y)=>k.fecha.localeCompare(Y.fecha))),v(w,M,q(M)),y(w),L.length}function v(w,P,_){const M=t.get("accounts"),x=M.find(T=>T._id===w);!x||x.fechaInicialSaldo&&x.fechaInicialSaldo<=P||t.set("accounts",M.map(T=>T._id===w?{...T,saldoInicial:J(_),fechaInicialSaldo:P}:T))}function f(w){return(w??[...new Set(t.get("transacciones").map(_=>_.cuentaId))]).reduce((_,M)=>_+u(M),0)}function b(w){const P=t.get("transacciones").filter(x=>x.origen==="importado"&&(!w||x.cuentaId===w)),_=new Map;for(const x of P){const T=_.get(x.cuentaId);T?T.push(x.fecha):_.set(x.cuentaId,[x.fecha])}const M=[];for(const[x,T]of _){T.sort();const D=d(x,T[0],T[T.length-1]);M.push({cuentaId:x,eliminados:D,semanales:u(x)})}return M}function y(w){const P=r(w),_=t.get("accounts");_.some(M=>M._id===w)&&t.set("accounts",_.map(M=>M._id===w?{...M,historicoSaldos:P.map(x=>({_id:x._id,fecha:x.fecha,saldo:J(x.saldoCts),...x.nota?{nota:x.nota}:{}}))}:M))}function g(w,P=K()){const _=c(w).filter(D=>D.fecha<=P).pop(),M=_==null?void 0:_.fecha,x=(_==null?void 0:_.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===w&&D.fecha<=P&&(M===void 0||D.fecha>M)).reduce((D,z)=>D+z.importeCts,x)}function h(w,P){return J(g(w,P))}function S(w=K(),P){const _=P??t.get("accounts").filter(M=>M.activo).map(M=>M._id);return J(_.reduce((M,x)=>M+g(x,w),0))}function C(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const w=[...t.get("transacciones").map(P=>P.fecha),...t.get("puntosControl").map(P=>P.fecha)];return w.length>0?w.sort().pop()??null:null}function $(w={}){return J(e(w).reduce((P,_)=>P+_.importeCts,0))}function A(w={}){const P=new Map;for(const _ of e(w)){const M=_.fecha.slice(0,7);P.set(M,(P.get(M)??0)+_.importeCts)}return new Map([...P.entries()].sort(([_],[M])=>_.localeCompare(M)).map(([_,M])=>[_,J(M)]))}function E(w={}){const P=new Map;for(const _ of e(w))for(const M of _.tags.length>0?_.tags:["sin_tag"])P.set(M,(P.get(M)??0)+_.importeCts);return new Map([...P.entries()].map(([_,M])=>[_,J(M)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:f,saldoCuenta:h,saldoCuentaCts:g,saldoTotal:S,tieneDatos:C,ultimaFecha:I,total:$,totalPorMes:A,totalPorTag:E}}function pt(t){return t.trim().toLowerCase()}function $c(t){function a(){const l=new Map,p=(d,u)=>{const v=pt(d);if(!v)return;const f=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};f[u]+=1,f.total+=1,l.set(v,f)};for(const d of t.get("expenses"))for(const u of d.tags??[])p(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])p(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(p=>l==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function n(l,p,d){const u=pt(p),v=(l??[]).map(pt);if(!v.includes(u))return l??[];const f=v.filter(b=>b!==u);return d===null?[...new Set(f)]:[...new Set([...f,pt(d)])]}function s(l,p){const d=pt(p);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,p){let d=0;for(const u of l)pt(u)!==pt(p)&&(d+=c(u,pt(p)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,p){let d=0;const u=t.get("expenses").map(A=>{const E=n(A.tags,l,p);return E!==A.tags&&(d+=1),E===A.tags?A:{...A,tags:E}});t.set("expenses",u);const v=t.get("transacciones").map(A=>{const E=n(A.tags,l,p);return E!==A.tags&&(d+=1),E===A.tags?A:{...A,tags:E}});t.set("transacciones",v);const f=t.get("loans").map(A=>{const E=n(A.tags,l,p);return E!==A.tags&&(d+=1),E===A.tags?A:{...A,tags:E}});t.set("loans",f);const b=t.get("nominas").map(A=>{const E=n(A.tags,l,p);return E!==A.tags&&(d+=1),E===A.tags?A:{...A,tags:E}});t.set("nominas",b);const y=t.get("config"),g=pt(l),h=A=>{const E=(A??[]).map(pt);if(!E.includes(g))return A??[];const w=E.filter(P=>P!==g);return p===null?[...new Set(w)]:[...new Set([...w,p])]},S={},C=h(y.activeTagsFilter),I=h(y.tagCategorias),$=h(y.tagGrupos);return C!==y.activeTagsFilter&&(S.activeTagsFilter=C),I!==y.tagCategorias&&(S.tagCategorias=I),$!==y.tagGrupos&&(S.tagGrupos=$),Object.keys(S).length>0&&t.patchConfig(S),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const xc=3;function an(t){return t<.005?0:t}function Ic(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function wc(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<xc)continue;const r=Ic(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:an(n),sigmaDeriva:an(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function on(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:G(e*Math.hypot(n,s))}function Cc(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-s)*12+(l-i)),d=on(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:G(r.saldoAcum+d),abajo:G(r.saldoAcum-d)}})}function Sc(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ma="financeapp_session",Ac=["local","dropbox","firebase"];function Mc(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Ac.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Ec({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const f=n();if(f)try{v?f.setItem(ma,JSON.stringify(v)):f.removeItem(ma)}catch{}}function i(){const v=n();if(!v)return null;try{return Mc(v.getItem(ma))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const f=r();return f!==null&&f>=v}function l(){const v=i();return v?c()?(s(null),null):v:null}function p(v){const f=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:f,ultimoUso:f};return s(b),b}function d(){const v=i();v&&s({...v,ultimoUso:e()})}function u(){s(null)}return{abrir:p,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const nn=["pointerdown","keydown","visibilitychange"];function Pc({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of nn)s==null||s.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,n(c);for(const p of nn)s==null||s.removeEventListener(p,r)}}return l}const _c=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Fc="FinanceApp",Dc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function sn(t){return new Uint8Array(new ArrayBuffer(t))}const fa="financeapp_bio_credencial",ga="financeapp_bio_secreto",va="financeapp_bio_ultimo_desbloqueo",rn="financeapp_bio_gracia_min",Tc=5;function zc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function Se(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function Ae(t){const a=atob(t),e=sn(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function jc(t){return Se(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function qc(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Ae(a)}function cn(t){return t.getClientExtensionResults()}function Rc(t={}){const a=t.webauthn??zc(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(I=>crypto.getRandomValues(sn(I)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const I=o==null?void 0:o.getItem(fa);if(!I)return null;try{const $=JSON.parse(I);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function l(){return c()!==null}async function p(I){const $=await e.importKey("raw",I,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Dc},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(I,$){const A=s(12),E=await e.encrypt({name:"AES-GCM",iv:A},I,new TextEncoder().encode($));return`${Se(A)}:${Se(E)}`}async function u(I,$){const[A,E]=$.split(":"),w=Ae(A),P=Ae(E),_=await e.decrypt({name:"AES-GCM",iv:w},I,P);return new TextDecoder().decode(_)}async function v(I,$){var q,L;if(!I)throw new Error("No hay clave de cifrado que envolver.");const A=s(32),E=s(32),w=s(16),P=await a.create({publicKey:{challenge:E,rp:{name:Fc},user:{id:w,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!P)throw new Error("No se ha podido crear la credencial biométrica.");const _=cn(P);if(!((q=_.prf)!=null&&q.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((L=_.prf.results)==null?void 0:L.first)??null;if(M||(M=await f(P.rawId,A)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const x=await p(M),T=await d(x,I),D={credencialId:jc(P.rawId),salt:Se(A),modo:$,creadaEn:n()},z=i();z.setItem(fa,JSON.stringify(D)),z.setItem(ga,T)}async function f(I,$){var E,w;const A=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:I,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return A?((w=(E=cn(A).prf)==null?void 0:E.results)==null?void 0:w.first)??null:null}async function b(){const I=c();if(!I)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(ga);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await f(qc(I.credencialId).buffer,Ae(I.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const E=await p(A),w=await u(E,$);return g(),w}function y(){o==null||o.removeItem(fa),o==null||o.removeItem(ga),o==null||o.removeItem(va)}function g(){o==null||o.setItem(va,String(n()))}function h(){const I=o==null?void 0:o.getItem(rn);if(I==null)return Tc;const $=Number(I);return Number.isFinite($)&&$>0?$:0}function S(I){o==null||o.setItem(rn,String(Math.max(0,Math.floor(I)||0)))}function C(){if(!l())return!1;const I=h();if(I<=0)return!1;const $=o==null?void 0:o.getItem(va),A=$?Number($):NaN;return Number.isFinite(A)?n()-A<I*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:y,marcarDesbloqueo:g,dentroDeGracia:C,graciaMinutos:h,configurarGracia:S}}function ln(){if(typeof localStorage<"u"){const $=$s();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=Fs(),a=t.activo(),e=te(a),o=ro(localStorage,e),n=Ss({adapter:o}),s=As(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Qt})`),n.subscribe($=>s.marcar($));function r(){var A,E,w,P,_;const $=globalThis;(E=(A=$.FirebaseService)==null?void 0:A.isConnected)!=null&&E.call(A)&&((_=(P=(w=$.FirebaseService).uploadRegistroProyectos)==null?void 0:P.call(w))==null||_.catch(M=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",M instanceof Error?M.message:M)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===a)??t.listar()[0],colecciones:St.filter($=>$!=="config"),crear:$=>{const A=t.crear($);return r(),A},renombrar:($,A)=>{t.renombrar($,A),r()},duplicar:($,A)=>{const E=t.duplicar($,A);return r(),E},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,A)=>{const E=Ds(localStorage,$,A),w=Ts(E),P=[];for(const _ of A){const M=w[_];if(!Array.isArray(M)||M.length===0)continue;const x=n.get(_);n.set(_,[...x,...M]),P.push(_)}return P.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:P}}},l=js(n),p=Rc(),d=Ec({autoLogoutMinutos:()=>{var A,E;const $=(E=(A=globalThis.State)==null?void 0:A.get)==null?void 0:E.call(A,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=yc(n),v=$c(n),f=Sr(u),b=Lr(n),y=ri({isEnabled:$=>l.isEnabled($)}),g=Zs({flags:l,rutasExtra:()=>y.flagPorRuta()}),h=Ls({flags:l,onChange:()=>{var $,A;y.attachToShell(),g.apply(),(A=($=globalThis.Router)==null?void 0:$.rerender)==null||A.call($)}}),S=Ys({proyectos:c}),C=()=>{var A,E,w,P,_,M;const $=globalThis;if((E=(A=$.State)==null?void 0:A.load)==null||E.call(A),((P=(w=$.Router)==null?void 0:w.current)==null?void 0:P.call(w))==="dashboard")try{(M=(_=$.DashboardModule)==null?void 0:_.render)==null||M.call(_)}catch(x){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",x)}},I=Xs({store:n,onDatosCambiados:C});return y.register($i({store:n,onDatosCambiados:C})),y.register(_i({store:n,onDatosCambiados:C})),y.register(ar({store:n,onDatosCambiados:C})),y.register(hc({store:n,ledger:u,tags:v,precision:f,adjuster:b,onDatosCambiados:C})),y.register(ui({store:n,onDatosCambiados:C})),{version:Qt,core:yn,engine:{generarExtracto:Oa,recomputarSaldoAcum:In,saldoHoy:wn,sumarPorTags:Ha,providers:{proyectarGastos:Kt,proyectarPrestamos:qe,proyectarTransferencias:Ta,proyectarNominas:Re,proyectarInteresesCuentas:ja,proyectarAportaciones:za,proyectarRetencionesFiscales:qa,proyectarInflacionGastos:Ra,proyectarPerdidaAhorro:Na},analysis:Mn,margins:zn,avisos:Nn,dashboard:Xn},store:n,flags:l,featureRegistry:{all:It,porGrupo:fo},ui:{openFeatures:h.open,openProyectos:S.open,openPersonas:I.open,applyGating:g.apply,watchGating:()=>g.observar(),instalarDeshacer:()=>ei({store:n,rerender:()=>{var A,E,w,P;const $=globalThis;(E=(A=$.State)==null?void 0:A.load)==null||E.call(A),(P=(w=$.Router)==null?void 0:w.rerender)==null||P.call(w)}}),avisoGuardado:null,instalarBuscador:()=>si({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>y.routes(),navegar:$=>{var A,E;return(E=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:E.call(A,$)}})},app:y,session:Object.assign(d,{vigilar:$=>Pc({sesion:d,onCaducada:$}),opciones:_c}),biometria:p,cambios:s,datos:{colecciones:St,snapshot:()=>co(o),aplicar:($,{sellar:A=!0}={})=>{const w=Ms(A?(P,_)=>o.set(P,_):(P,_)=>{const M=globalThis.StorageAdapter;M!=null&&M.setRestaurando?M.setRestaurando(P,_):o.set(P,_)},$);return n.load(),s.marcar("copia-restaurada"),w},faltantes:$=>Es($),esVacioOPorDefecto:()=>Ps(co(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:f,adjuster:b,sugerirAjuste:ra,medirVariabilidad:wc,bandaDeConfianza:Cc,bandaAcumulada:on,describirBanda:Sc}}}function Nc(){try{const t=ln();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const et=typeof window<"u"?Nc():null;if(et){let t=!1;const a=()=>{var e,o;if(et.app.attachToShell(),et.ui.applyGating(),!t){t=!0,et.ui.watchGating(),et.ui.instalarDeshacer(),et.ui.instalarBuscador();const n=globalThis,s=()=>{var l,p,d,u;return(p=(l=n.FirebaseService)==null?void 0:l.isConnected)!=null&&p.call(l)?n.FirebaseService:(u=(d=n.DropboxService)==null?void 0:d.isConnected)!=null&&u.call(d)?n.DropboxService:null};et.ui.avisoGuardado=ii({cambios:et.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const l=s();if(!(l!=null&&l.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const p=globalThis.AuthModule;p!=null&&p.guardarEnNube?await p.guardarEnNube():await l.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=et.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>et.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>et.ui.openProyectos());const c=et.store.get("config").archivoMigracion011;if(c&&!c.avisado&&c.desactivados+c.amortizaciones.length>0){const l=c.desactivados+c.amortizaciones.length,p=globalThis.UI;setTimeout(()=>{var d;return(d=p==null?void 0:p.toast)==null?void 0:d.call(p,`Se han desactivado ${l} elemento${l===1?"":"s"} que venía${l===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),et.store.patchConfig({archivoMigracion011:{...c,avisado:!0}})}(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>et.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return Me.bootstrap=ln,Object.defineProperty(Me,Symbol.toStringTag,{value:"Module"}),Me}({});
//# sourceMappingURL=financeapp-core.js.map
