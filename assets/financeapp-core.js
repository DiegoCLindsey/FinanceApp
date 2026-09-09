var FinanceAppBundle=function(be){"use strict";function U(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function k(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function W(){return U(new Date)}function he(t,a){return new Date(t,a+1,0).getDate()}function oa(t,a,e){return U(new Date(t,a,Math.min(e,he(t,a))))}function ne(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return U(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return oa(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return U(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),U(i)}return null}function na(t,a){if(!a)return t;const e=k(t);return ne(e.getFullYear(),e.getMonth(),a)??t}const zo=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],jo={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function ye(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${jo[e]||e+"º"} ${zo[o]} del mes`}return t}function Lt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Ot(t){const a=k(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),U(a)}function sa(t,a){const e=k(t);return e.setDate(e.getDate()+a),U(e)}function st(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function K(t){return t/100}function Y(t){return K(st(t))}function P(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ia(t){return(t||0).toFixed(2)+"%"}function xt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function ra(t,a,e,o=0){const n=xt(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-e))/i-s,p=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-u/p;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function ca(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const u=k(o),p=a/100/12;let d=e,l=xt(c,a,d);const f=[...s].sort((b,S)=>b.fecha.localeCompare(S.fecha));let v=0;for(let b=1;b<=e*2&&c>.01;b++){const S=new Date(u);u.setMonth(u.getMonth()+1);const g=na(U(S),i.diaPago||"");for(;v<f.length&&f[v].fecha<=g;){const C=f[v],$=C.cantidad*(n/100);if(c-=C.cantidad,c=Math.max(0,c),C.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*p/l)/Math.log(1+p)):(d=e-b+1,l=xt(c,a,d)),r.push({mes:"AMORT",fecha:C.fecha,cuota:0,interes:0,amortizacion:C.cantidad,comisionAmort:$,capitalPendiente:c,esAmortizacion:!0,simulacion:C.simulacion||!1}),v++,c<.01)break}if(c<.01)break;const h=c*p,w=Math.min(l-h,c);if(c-=w,c<.01&&(c=0),r.push({mes:b,fecha:g,cuota:l,interes:h,amortizacion:w,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const la=new Map;function J(t){var S;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((g,h)=>`${g.fecha}|${g.cantidad}|${g.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).join(";")}`,o=la.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:u}=t,p=ca(n,s,i,r,c||0,a,t),d=p.reduce((g,h)=>g+h.interes,0),l=p.reduce((g,h)=>g+h.comisionAmort,0),f=n*((u||0)/100),v=p.filter(g=>!g.esAmortizacion),b={cuota:xt(n,s,i),totalIntereses:d,tae:ra(n,s,i,u||0),costoTotal:d+l+f,comAp:f,totalComAm:l,fechaFin:((S=v.slice(-1)[0])==null?void 0:S.fecha)||"",mesesReales:v.length,tabla:p};return la.set(e,b),b}function da(t){const a=J(t),e=J({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function ft(t,a,e){if(!t||t.length===0)return 1;const o=k(a),n=k(e);if(n<=o)return 1;const s=[...t].sort((c,u)=>c.year-u.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),u=s.filter(b=>b.year<=c),p=u.length>0?u[u.length-1]:s[0],d=(p?p.tasa:0)/100,l=new Date(c+1,0,1),f=l<n?l:n,v=Lt(r,f);i*=Math.pow(1+d,v/365.25),r=f}return i}function ua(t,a,e,o=0){const n=k(a),s=k(e);if(s<=n)return o;const i=Lt(n,s),r=t?[...t].sort((p,d)=>p.year-d.year):[];let c=0,u=new Date(n);for(;u<s;){const p=u.getFullYear(),d=new Date(p+1,0,1),l=d<s?d:s,f=Lt(u,l),v=r.filter(g=>g.year<=p),b=v.length>0?v[v.length-1]:null,S=b!==null?b.tasa:o;c+=S*f,u=l}return i>0?c/i:o}function pa(t,a){return((1+t/100)/(1+a/100)-1)*100}function qo(t,a,e,o){const n=ft(a,e,o);return n>0?t/n:t}function No(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:u=0,cuotasHipoteca:p=0,gastosBasicos:d=0,gastosOtros:l=0,amortizaciones:f=0}=t,v=c-u-f-d-l,b=v,S=c>0?b/c*100:null,g=r?u-p:u,h=c>0?g/c*100:null,w=c>0?u/c*100:null,C=c>0?(d+u+f)/c*100:null,$=c>0?l/c*100:null,y=(x,M,I)=>x===null?"neutral":x>=M?"verde":x>=I?"amarillo":"rojo",A=(x,M,I)=>x===null?"neutral":x<=M?"verde":x<=I?"amarillo":"rojo";return{ingresos:c,cuotas:u,cuotasHipoteca:p,gastosBasicos:d,gastosOtros:l,amortizaciones:f,ahorroBruto:v,ahorroReal:b,tasaAhorro:S,dti:h,dtiTotal:w,excluyeHipoteca:r,pctNecesidades:C,pctDeseos:$,semAhorro:y(S,e,o),semDTI:A(h,n,s),semNecesidades:A(C,i[0],i[0]+15),semDeseos:A($,i[1],i[1]+10),semAhorroRegla:y(S,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function it(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function gt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function kt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=e&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=a);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a);return n?n.saldo:0}}function Ro(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Lo(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function se(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Oo(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function ko(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Mt(t,a,e){const o=st(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:K(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Oo(o,n.length);return n.map((l,f)=>({personaId:l,importe:K(d[f])}))}const s=a.participantes.map(d=>{const l=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*l/100):st(l)}),i=s.reduce((d,l)=>d+l,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,l=s.map(v=>Math.round(v*d)),f=l.reduce((v,b)=>v+b,0);return l.length>0&&(l[0]+=o-f),n.map((v,b)=>({personaId:v,importe:K(l[b])}))}const c=o-i,{ids:u,cts:p}=ko(n,s,c,e);return u.map((d,l)=>({personaId:d,importe:K(p[l])}))}function $e(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Bo(t,a,e){const o=se(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=$e(a.expenses,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const c=$e(a.loans,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=$e(a.nominas,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function xe(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const wt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ct(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function ma(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function vt(t,a){return ma(t,a).baseImponible}function fa(t,a){return ct(t,a)/12}const Bt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function we(t,a){if(!t||t<=0)return 0;const e=a||Bt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,u=Math.min(n,c-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function ie(t,a){if(it(t)!=="inversion")return null;const e=gt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=we(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function Ie(t,a=new Date){var l;if(it(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=gt(t),n=U(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((f,v)=>f.fecha.localeCompare(v.fecha));let i=0;const r=s.reduce((f,v)=>f+v.cantidad,0);for(const f of s)f.fecha<=n&&(i+=f.cantidad);const c=Math.max(0,o-r),u=r>0?i/r:0,p=Math.min(o,i+c*u),d=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((l=s.find(f=>f.fecha>n))==null?void 0:l.fecha)||null}}function ga(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(it(t)!=="pension"||!o)return 0;const n=gt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,p)=>u+p.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function Ce(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,p)=>u+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((u,p)=>u[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[u,p]of i)if(s>=u)r=p;else break;return r}const Ho=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Bt,TRAMOS_IRPF_DEFAULT:wt,agregarPorPersona:Bo,ajustarFechaPago:na,ajustarPrecioReal:qo,calcBaseImponibleTrabajo:vt,calcFactorInflacion:ft,calcFondoInversion:ie,calcFondosPension:Ie,calcGananciasCapital:we,calcIRPF:ct,calcImpuestoPension:ga,calcInflacionMediaAnual:ua,calcSaludFinanciera:No,calcTAE:ra,calcTipoMarginalPension:Ce,calcTipoRealFisher:pa,calcularReparto:Mt,clampedDate:oa,cuotaMensual:xt,desgloseBaseTrabajo:ma,diasEntre:Lt,finDeSemana:Ot,formatEUR:P,formatLocalDate:U,formatPct:ia,fromCents:K,haySimulaciones:Lo,idPersonaPorDefecto:se,labelDiaPago:ye,lastDayOfMonth:he,modeloFondoDe:it,parseLocalDate:k,personasImplicadas:xe,resolverDiaEfectivo:ne,resumenPrestamo:J,resumenPrestamoConAhorro:da,retencionMensual:fa,roundMoney:Y,saldoEnFecha:kt,saldoRealCuenta:gt,sinSimulaciones:Ro,sumarDias:sa,tablaAmortizacion:ca,toCents:st,todayISO:W},Symbol.toStringTag,{value:"Module"}));function Ht(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=k(i.fechaInicio||a.start),c=i.fechaFin?k(i.fechaFin):s,u=i.cuantia,p=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let l=r.getFullYear(),f=r.getMonth();const v=Math.ceil(240/d)+2;for(let b=0;b<v;b++){const S=ne(l,f,i.diaPago||"")||(()=>{const h=r.getDate(),w=new Date(l,f+1,0).getDate();return U(new Date(l,f,Math.min(h,w)))})(),g=k(S);if(g>s||g>c)break;g>=n&&g>=r&&p(S),f+=d,f>=12&&(l+=Math.floor(f/12),f=f%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let l=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const f=Math.ceil((n.getTime()-r.getTime())/d);l=new Date(r.getTime()+f*d)}for(;l<=s&&l<=c;)p(U(l)),l=new Date(l.getTime()+d)}}return o}function va(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=J(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ba(t,a,e=null,o={accounts:[]}){const n=[],s=k(a.start),i=k(a.end),r=o.accounts||[],c=o.nominas||[],u=o.resolverTramosIRPF||(()=>wt),p=o.resolverTramosGanancias||(()=>Bt),d=l=>{var f;return((f=r.find(v=>v._id===l))==null?void 0:f.nombre)??l};for(const l of t){if(!l.activo||l.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(l.cuenta||"default")||e.includes(l.cuentaDestino||"default")))continue;const f=k(l.fechaInicio||a.start),v=l.fechaFin?k(l.fechaFin):i,b=S=>{const g=r.find(E=>E._id===(l.cuenta||"default")),h=r.find(E=>E._id===(l.cuentaDestino||"default")),w=it(g),C=it(h),$=w==="inversion"&&C==="inversion"||w==="pension"&&C==="pension",y=["transferencia",...$?["traspaso"]:[],...l.tags||[]],A=$?"traspaso-out":"transfer-out",x=$?"traspaso-in":"transfer-in",M=!e||e.length===0||e.includes(l.cuenta||"default"),I=!e||e.length===0||e.includes(l.cuentaDestino||"default");if(M&&n.push({fecha:S,concepto:`Transf. → ${d(l.cuentaDestino||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"gasto",tags:y,cuenta:l.cuenta||"default",sourceId:l._id,sourceType:A}),I&&n.push({fecha:S,concepto:`Transf. ← ${d(l.cuenta||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"ingreso",tags:y,cuenta:l.cuentaDestino||"default",sourceId:l._id,sourceType:x}),M&&!$&&g){if(w==="inversion"){const E=parseInt(S.slice(0,4)),_=ie(g,p(E));if(_&&_.saldo>0&&_.plusvalia>0){const F=Math.min(1,l.cuantia/_.saldo),D=_.plusvalia*F*.19;D>.01&&n.push({fecha:S,concepto:`Retención IRPF reembolso ${g.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"investment-tax"})}}else if(w==="pension"){const E=u(parseInt(S.slice(0,4))),_=Ce(g,c,E),F=ga(g,l.cuantia,_||void 0);if(F>0){const z=g.grupoNomina?`IRPF rescate ${g.nombre} (tipo marginal grupo "${g.grupoNomina}": ${_}%)`:`Retención rescate ${g.nombre} (${g.impuestoRetirada}% s/beneficio)`;n.push({fecha:S,concepto:z,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"pension-tax"})}}}};if(l.tipoFrecuencia==="extraordinario")f>=s&&f<=i&&f<=v&&b(l.fechaInicio);else if(l.tipoFrecuencia==="mensual"){const S=Math.max(1,l.frecuencia||1);let g=f.getFullYear(),h=f.getMonth();const w=Math.ceil(240/S)+2;for(let C=0;C<w;C++){const $=ne(g,h,l.diaPago||"")||(()=>{const A=f.getDate(),x=new Date(g,h+1,0).getDate();return U(new Date(g,h,Math.min(A,x)))})(),y=k($);if(y>i||y>v)break;y>=s&&y>=f&&b($),h+=S,h>=12&&(g+=Math.floor(h/12),h=h%12)}}else if(l.tipoFrecuencia==="diaria"){const S=Math.max(1,l.frecuencia||1)*864e5;let g=new Date(Math.max(f.getTime(),s.getTime()));if(f<s){const h=Math.ceil((s.getTime()-f.getTime())/S);g=new Date(f.getTime()+h*S)}for(;g<=i&&g<=v;)b(U(g)),g=new Date(g.getTime()+S)}}return n}function ha(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){const r=it(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const u of c){if(!u.importe||u.importe<=0)continue;const p=k(u.fechaInicio||a.start),d=u.fechaFin?k(u.fechaFin):s,l=u.cuentaOrigen||"default",f=!e||!e.length||e.includes(l),v=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",S=$=>{f&&o.push({fecha:$,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:l,sourceId:u._id,sourceType:"aportacion-out"}),v&&o.push({fecha:$,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},g={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let h=p.getFullYear(),w=p.getMonth();const C=Math.ceil(240/g)+2;for(let $=0;$<C;$++){const y=new Date(h,w+1,0).getDate(),A=U(new Date(h,w,Math.min(p.getDate(),y))),x=k(A);if(x>s||x>d)break;x>=n&&x>=p&&S(A),w+=g,w>=12&&(h+=Math.floor(w/12),w=w%12)}}}return o}function ya(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=k(a.start),r=k(a.end),c=s.periodoCobro||"mensual",u=c==="mensual",p=u?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=u?1/12:p/(365.25*864e5);let l=kt(s,a.start);const f=o.filter(S=>S.cuenta===s._id).map(S=>({fecha:S.fecha,delta:S.tipo==="ingreso"?Math.abs(S.cuantia):-Math.abs(S.cuantia)})).sort((S,g)=>S.fecha.localeCompare(g.fecha));let v=0,b=new Date(i);for(;b<=r;){const S=u?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),g=new Date(Math.min(S.getTime(),r.getTime()+1)),h=U(g);let w=0;for(;v<f.length&&f[v].fecha<h;)w+=f[v].delta,v++;const C=l,$=l+w,y=Math.max(0,(C+$)/2);l=$;const A=u?d:(g.getTime()-b.getTime())/(365.25*864e5),x=y*(Math.pow(1+s.interes/100,A)-1);x>.001&&n.push({fecha:U(b),concepto:`Interés ${s.nombre}`,cuantia:x,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),b=S}}return n}function $a(t,a,e,o=null){const n=[],s=a||wt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=fa(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Ht([u],e,o))}return n}const Go=[5,11,2,8],Vo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function xa(t,a,e=null,o=[],n=()=>wt){const s=[],i=k(a.start),r=k(a.end),c=o.length>0,u={};for(const l of t){const f=l.grupoNomina||"";u[f]||(u[f]=[]),u[f].push(l)}for(const l of Object.keys(u))u[l].sort((f,v)=>(v.bruto||0)-(f.bruto||0));function p(l,f){if(!c||!l.mesActualizacionIPC)return l.bruto||0;const v=l.fechaInicio||a.start,b=k(v),S=k(f);let g=0;for(let w=b.getFullYear();w<=S.getFullYear();w++){const C=new Date(w,l.mesActualizacionIPC-1,1);C>b&&C<=S&&g++}if(g===0)return l.bruto||0;const h=U(new Date(b.getFullYear()+g,0,1));return(l.bruto||0)*ft(o,v,h)}function d(l,f){const v=p(l,f),b=(l.retribucionFlexible||[]).reduce((E,_)=>E+(_.importe||0)*12,0),S=Math.max(0,v-b);if(l.irpfModo==="manual")return S*((l.irpfPct||0)/100);const g=n(parseInt(f.slice(0,4))),h=l.grupoNomina||"";if(!h)return ct(vt(v,b),g);const w=u[h].filter(E=>E.activo),C=w.reduce((E,_)=>E+p(_,f),0),$=w.reduce((E,_)=>E+(_.retribucionFlexible||[]).reduce((F,z)=>F+(z.importe||0)*12,0),0),y=Math.max(0,C-$),A=vt(C,$),x=Math.max(0,v-b),M=y>0?A*(x/y):0,I=w.filter(E=>E._id!==l._id&&(E.bruto||0)>(l.bruto||0)).reduce((E,_)=>{const F=(_.retribucionFlexible||[]).reduce((D,j)=>D+(j.importe||0)*12,0),z=Math.max(0,p(_,f)-F);return E+(y>0?A*(z/y):0)},0);return ct(I+M,g)-ct(I,g)}for(const l of t){if(!l.activo)continue;const f=l.cuenta||"default";if(e&&e.length>0&&!e.includes(f))continue;const v=Math.max(1,l.nPagas||12),b=k(l.fechaInicio||a.start),S=l.fechaFin?k(l.fechaFin):r,g=h=>{const w=p(l,h),C=d(l,h),$=(l.retribucionFlexible||[]).reduce((F,z)=>F+(z.importe||0)*12,0),y=Math.max(0,w-$),A=(l.ssPct??6.35)/100,x=y*A,M=y/v,I=C/v,E=x/v,_=l.representacion==="simplificado"?M-E-I:M;s.push({fecha:h,concepto:l.nombre,cuantia:_,tipo:"ingreso",cuenta:f,tags:l.tags||[],sourceId:l._id,sourceType:"nomina"}),l.representacion==="detallado"&&(E>0&&s.push({fecha:h,concepto:`SS ${l.nombre}`,cuantia:E,tipo:"gasto",cuenta:f,tags:["seguridad-social","fiscal"],sourceId:l._id+"_ss",sourceType:"nomina"}),I>0&&s.push({fecha:h,concepto:`IRPF ${l.nombre}`,cuantia:I,tipo:"gasto",cuenta:f,tags:["irpf","fiscal"],sourceId:l._id+"_irpf",sourceType:"nomina"}));for(const F of l.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:h,concepto:`${l.nombre} — ${Vo[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${l._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(v<=12){const h=v===12?1:Math.round(12/v),w=b.getDate();let C=b.getFullYear(),$=b.getMonth();for(let y=0;y<300;y++){const A=new Date(C,$+1,0).getDate(),x=new Date(C,$,Math.min(w,A));if(x>r||x>S)break;x>=i&&x>=b&&g(U(x)),$+=h,$>=12&&(C+=Math.floor($/12),$=$%12)}}else{const h=v-12,w=b.getDate();let C=b.getFullYear(),$=b.getMonth();for(let x=0;x<300;x++){const M=new Date(C,$+1,0).getDate(),I=new Date(C,$,Math.min(w,M));if(I>r||I>S)break;I>=i&&I>=b&&g(U(I)),$++,$>=12&&(C++,$=0)}const y=Math.max(b.getFullYear(),i.getFullYear()),A=Math.min((l.fechaFin?S:r).getFullYear(),r.getFullYear());for(let x=y;x<=A;x++)for(const M of Go.slice(0,h)){const I=new Date(x,M,15);I>=i&&I<=r&&I>=b&&I<=S&&g(U(I))}}}return s}function wa(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=k(e.start),r=k(e.end),c=W(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const d=p.getFullYear(),l=p.getMonth(),f=d+"-"+String(l+1).padStart(2,"0"),v=f+"-01",b=U(new Date(d,l+1,0)),S=U(new Date(d,l,15));let g=0;for(const h of u){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<v)continue;const w=h.fechaInicio||c,C=ft(a,w,S);if(C<=1)continue;const $=Math.max(1,h.frecuencia||1);g+=h.cuantia*(C-1)/$}g>.01&&s.push({fecha:S,concepto:"Incremento coste de vida",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+f,sourceType:"inflacion"}),p=new Date(d,l+1,1)}return s}function Ia(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=k(e.start),i=k(e.end),r=[...a].sort((u,p)=>u.year-p.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const u=c.getFullYear(),p=c.getMonth(),d=u+"-"+String(p+1).padStart(2,"0"),l=U(new Date(u,p,15)),f=r.filter(h=>h.year<=u),v=f.length>0?f[f.length-1]:r[0],b=v?v.tasa/100:0,S=Math.pow(1+b,1/12)-1,g=t*S;g>.01&&n.push({fecha:l,concepto:"Pérdida ahorro por inflación",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(u,p+1,1)}return n}function Ca(t,a,e){const o=e.fechaReferencia||e.dashboardStart,n=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,s=a.reduce((d,l)=>d+kt(l,n),0),i=t.filter(d=>d.fecha<n),r=t.filter(d=>d.fecha>=n),c=[];let u=s;for(const d of[...i].reverse()){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);c.unshift({...d,delta:l,saldoAcum:u}),u-=l}const p=[];u=s;for(const d of r){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=l,p.push({...d,delta:l,saldoAcum:u})}return[...c,...p]}function Uo(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ca([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Sa(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c={start:n.dashboardStart,end:n.dashboardEnd},u=e.filter(b=>b.tipo!=="transferencia"),p=e.filter(b=>b.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let l=[];l=l.concat(Ht(u,c,s)),l=l.concat(va(a,c,s)),l=l.concat(ba(p,c,s,d)),l=l.concat(ha(o,c,s));const f=ya(o,c,s,l);if(l=l.concat(f),l=l.concat($a(e,n.tramos_irpf,c,s)),l=l.concat(xa(i,c,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const b=(o.find(h=>h.activo&&h.esCuentaPrincipal)||o.find(h=>h.activo)||{_id:"default"})._id;l=l.concat(wa(u,r,c,s,b));const g=o.filter(h=>h.activo&&(!s||s.length===0||s.includes(h._id))).reduce((h,w)=>h+kt(w,n.dashboardStart),0);l=l.concat(Ia(g,r,c,b))}l.sort((b,S)=>b.fecha.localeCompare(S.fecha));const v=o.filter(b=>b.activo&&(!s||s.length===0||s.includes(b._id)));return Ca(l,v,n)}function Yo(t,a,e=null){const o=W(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+gt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Aa(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Wo(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${P(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${P(i)} < ${P(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${P(i)})`})))}return e}function Ko(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=k(a.dashboardStart),n=k(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function Jo(t,a,e=W()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",u={};c&&c<=e&&(u[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(u[p.fecha]=p.saldo);return Object.keys(u).forEach(p=>o.add(p)),u}),s={};for(const r of[...o].sort()){let c=0;for(let u=0;u<a.length;u++){const p=Object.entries(n[u]).filter(([d])=>d<=r);p.length>0?(p.sort(([d],[l])=>l.localeCompare(d)),c+=p[0][1]):c+=a[u].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([u],[p])=>u.localeCompare(p))){const u=t.filter(f=>f.fecha<=r),p=u.length>0?u[u.length-1].saldoAcum:null;if(p===null)continue;const d=c-p,l=p!==0?d/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:d,pct:l})}return i}const Qo=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Jo,detectarPuntosCriticos:Wo,mediaMensualGastos:Ko},Symbol.toStringTag,{value:"Module"}));function Gt(t,a=new Date){const e=U(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=U(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Ht(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Xo(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+xt(e.capital,e.tin,e.meses),0)}function Zo(t,a){return J(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Ma(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+xt(n.capital,n.tin,n.meses)*Math.min(a,Zo(n,e)),0)}function Ea(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Gt(t,o),s=a.colchonMeses||6;return n*s+Ma(e,s,U(o))}function tn(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((u,p)=>u.fecha.localeCompare(p.fecha)).filter(u=>u.fecha<=o).pop();if(!i)return Ea(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Gt(t,n),c=i.meses||6;return r*c+Ma(e,c,o)}function Se(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((p,d)=>p.fecha.localeCompare(d.fecha)),c=r.filter(p=>p.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Gt(a,i)+Xo(o))*(c.meses||1):0}function en(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function an(t,a){const e={};for(const o of a)e[o._id]=gt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=en(o)),{fecha:o.fecha,saldos:{...e}}))}function on(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let p=0;p<a.length;p++){const d=a[p],l=Se(c,o,n,s,d.fecha,!1,i);if(l<=0){u=!1;continue}const f=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((v,b)=>{var S,g;return v+(((g=(S=e[p])==null?void 0:S.saldos)==null?void 0:g[b])||0)},0);f<l&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${P(f)} < ${P(l)} desde ${d.fecha}`})):f>=l&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const nn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ea,calcColchonEnFecha:tn,calcGastoBasicoMensual:Gt,calcMargenEnFecha:Se,detectarCrucesMargenes:on,saldosPorCuentaEnExtracto:an},Symbol.toStringTag,{value:"Module"}));function sn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function _a(t,a){return Lt(k(t),k(a))}const rn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Pa(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${rn[o-1]}${s?"":` de ${e}`}`}function Fa(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function cn(t,a={}){const{hoy:e=W(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:l=>`El ${l} el saldo proyectado baja a ${P(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:l=>`El ${l} el saldo queda en ${P(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:l=>l?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:l=>`El ${l} tendrías ${P(d.saldo)}, y el margen pide ${P(d.target)}.`});const c=new Map;for(const d of r){const l=c.get(d.id);(!l||d.fecha<l.fecha)&&c.set(d.id,d)}const u=[];for(const d of c.values()){const l=_a(e,d.fecha);if(l<0||l>(d.gravedad==="critico"?o:n))continue;const f=i?i(l):0,v=f>0&&d.distancia<f;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:l,plazo:Fa(l),titulo:d.titulo(v),detalle:d.detalle(Pa(d.fecha,e)),incierto:v})}const p={critico:0,aviso:1};return u.sort((d,l)=>d.fecha.localeCompare(l.fecha)||p[d.gravedad]-p[l.gravedad]),u.slice(0,s)}const ln=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:sn,construirAvisos:cn,describirPlazo:Fa,diasEntreISO:_a,fechaEnPalabras:Pa},Symbol.toStringTag,{value:"Module"})),dn=30.44*864e5;function Da(t){const a=t.getFullYear(),e=t.getMonth();return{desde:U(new Date(a,e,1)),hasta:U(new Date(a,e,he(a,e)))}}function Ta(t){const[a,e]=t.split("-").map(Number);return Da(new Date(a,e-1,1))}function un(t,a){return Math.max(1,(k(a).getTime()-k(t).getTime())/dn)}const pn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),bt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function mn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function fn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=l=>l.sourceType==="loan"&&l.tipo==="gasto",n=a.loanIdsIniciados,s=bt(t.filter(l=>l.tipo==="ingreso")),i=bt(t.filter(l=>o(l)&&(!n||n.has(l.sourceId??"")))),r=bt(t.filter(l=>o(l)&&a.hipotecaIds.has(l.sourceId??""))),c=bt(t.filter(l=>l.sourceType==="loan-amort")),u=bt(t.filter(l=>l.sourceType==="account-interest")),{basicos:p,deseo:d}=mn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:d/e,gastosTotales:(i+p+d)/e,intereses:u/e}}function za(t,a){return t.reduce((e,o)=>{const n=J(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function gn(t,a,e,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=e),s=n.reduce((u,p)=>{if((p.amortizaciones||[]).filter(v=>v.fecha>=a&&v.fecha<=e).length===0)return u;const l=J(p).totalIntereses,f=J({...p,amortizaciones:(p.amortizaciones||[]).filter(v=>v.fecha<a||v.fecha>e)}).totalIntereses;return u+Math.max(0,f-l)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:J(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=a&&u.fechaFin<=e),r=n.map(u=>J(u).tabla),c=u=>{const{desde:p,hasta:d}=Ta(u);return r.reduce((l,f)=>{const v=f.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=d);return l+(v?v.cuota:0)},0)};return{deudaInicio:za(n,a),deudaFin:za(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function vn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:bt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function ja(t,a=new Set,e="desglosado"){if(a.size===0)return Aa(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>a.has(u)),r=s.filter(u=>!a.has(u)),c=e==="porgrupos"&&i.length>0?i:r;for(const u of c)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function bn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...ja(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function hn(t,a){const e=a.reduce((o,n)=>o+gt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:bt(t.filter(o=>o.tipo==="gasto")),totalIngresos:bt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function yn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function $n(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function xn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function wn(t,a){if(t.length===0)return[];const e=u=>a==="mes"?u.slice(0,7):u.slice(0,4),o=u=>a==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const u of t){const p=e(u.fecha),d=u.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const In=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:wn,cuentasVisibles:yn,gastoPorTagOrdenado:bn,idsHipoteca:$n,idsPrestamosIniciados:xn,interesesPorCuenta:vn,mesesDelPeriodo:un,metricasFlujo:fn,rangoMes:Ta,rangoMesDe:Da,resumenPrestamosPeriodo:gn,sinTransferencias:pn,sumarGastosPorTag:ja,totalesPeriodo:hn},Symbol.toStringTag,{value:"Module"}));function Cn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Vt(t,a){return e=>Cn(t,a,e)}const Ut=10,qa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Na=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ae(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ra="default";function La(){return{_id:Ra,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Oa(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:qa,tramosGananciasCapital:Na,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function ka(t,a){return{loans:[],expenses:[],accounts:[Ae(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[La()],config:Oa(t,a)}}const lt=t=>Array.isArray(t)?t:[],Sn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Yt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ba(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Me(t){const{varianza:a,inflacion:e,...o}=t;return o}function An(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=Sn(t.config),r={...Oa(e,o)};for(const[p,d]of Object.entries(s))d!=null&&(r[p]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=qa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Na),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=lt(t.accounts).map(p=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Yt(d)});c.length===0&&(c=[Ae(e)]);const u=c.filter(p=>p.esCuentaPrincipal);if(u.length===0){const p=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===p._id}))}else if(u.length>1){let p=!1;c=c.map(d=>d.esCuentaPrincipal?p?{...d,esCuentaPrincipal:!1}:(p=!0,d):d)}return n.accounts=c,n.expenses=lt(t.expenses).map(p=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Ba(d.diaPago),Me(Yt(d))}),n.loans=lt(t.loans).map(p=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Ba(d.diaPago),d.amortizaciones=lt(d.amortizaciones).map(l=>Yt(l)),Me(Yt(d))}),n.nominas=lt(t.nominas).map(p=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Me(Yt(d))}),n.goals=lt(t.goals).map((p,d)=>{const l=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:f,...v}=p;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...v,cuentaIds:l}}),n.inflacion=lt(t.inflacion),n.tramosIRPFHistorico=lt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=lt(t.tramosGananciasCapitalHistorico),n.escenarios=lt(t.escenarios).map(({inversiones:p,...d})=>d),n}const Et=t=>Array.isArray(t)?t:[];let Ee=0;function Mn(t){return Ee+=1,`${t}_${Ee.toString(36)}`}const En=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),_n=t=>typeof t=="number"&&Number.isFinite(t);function Pn(t,a){const e={...t};Ee=0;const o=Et(t.transacciones),n=Et(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,p,d,l)=>{if(!En(p)||!_n(d))return;const f=`${u}|${p}`;i.has(f)||(i.add(f),s.push({_id:Mn("pc"),fecha:p,cuentaId:u,saldoCts:st(d),...typeof l=="string"&&l?{nota:l}:{}}))};for(const u of Et(t.accounts)){const p=typeof u._id=="string"?u._id:null;if(p)for(const d of Et(u.historicoSaldos))r(p,d.fecha,d.saldo,d.nota)}const c=Et(t.history);if(c.length>0){const u=Et(t.accounts),p=u.find(l=>l.esCuentaPrincipal)||u.find(l=>l.activo)||u[0],d=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const l of c){const f=typeof l.cuenta=="string"?l.cuenta:typeof l.cuentaId=="string"?l.cuentaId:d;r(f,l.fecha,l.saldo,l.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((u,p)=>String(u.fecha).localeCompare(String(p.fecha))),e}const _e=t=>Array.isArray(t)?t:[],Fn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Dn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Pe=0;function Tn(){return Pe+=1,`tx_hp_${Pe.toString(36)}`}function zn(t,a){const e={...t};Pe=0;const o=[..._e(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=_e(t.expenses).map(i=>{const r=_e(i.historialPrecios),c=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(v=>typeof v=="string"):[];if(c)for(const v of r){if(!v||!Fn(v.fecha)||!Dn(v.cuantia))continue;const b=p==="ingreso"?st(v.cuantia):-st(v.cuantia),S=`${c}|${v.fecha}|${b}`;n.has(S)||(n.add(S),o.push({_id:Tn(),fecha:v.fecha,cuentaId:u,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:p,origen:"importado",nota:typeof v.nota=="string"&&v.nota?v.nota:"Importado del historial de precios"}))}const{historialPrecios:l,...f}=i;return f});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Ha=t=>Array.isArray(t)?t:[],ht=(t,a="")=>typeof t=="string"&&t.trim()?t:a,_t=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,jn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function qn(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=Ha(e.goals),n=Ha(e.accounts),s=n.map(d=>{const l=_t(d.bloqueoMeses,0);return{_id:`veh_${ht(d._id,"x")}`,nombre:ht(d.nombre,"Cuenta"),rentabilidadRealAnual:_t(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":l>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:_t(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?st(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:ht(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:_t(d.interes,0)>0}}),i=new Map(n.map((d,l)=>[ht(d._id,""),s[l]._id])),r=((p=s[0])==null?void 0:p._id)??"",c=o.map((d,l)=>{const f=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>ht(b,"")):[],v=jn(d.targetDate);return{_id:ht(d._id,`obj_mig_${l}`),nombre:ht(d.nombre,`Objetivo ${l+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:st(_t(d.targetAmount,0)),fechaLimite:v,prioridad:_t(d.prioridad,l+1),modoAsignacion:v?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(f[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:ht(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[u],e}function Nn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ra)||(e.personas=[La(),...o]),e}const Wt=t=>Array.isArray(t)?t:[];function re(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function Rn(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function Ln(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Wt(e.loans).map(re),e.expenses=Wt(e.expenses).map(re),e.nominas=Wt(e.nominas).map(re),e.accounts=Wt(e.accounts).map(re),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Wt(e.planes).filter(Rn);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const On=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:An},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Pn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:zn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:qn},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:Nn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:Ln}],kn=["history"];function Ga(t,a,e){let o=t;const n=[];for(const s of[...On].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const yt="state_",ce="state__schemaVersion",Pt="financeapp_",Fe="state__modificadoEn";function Va(t=localStorage,a=Pt){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Fe&&t.setItem(e(Fe),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function Bn(t=localStorage,a=Pt){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(yt)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Hn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Gn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Vn(t,a){const e=Gn[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function Un(t){return U(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Yn({adapter:t,hoy:a=new Date}){const e=U(a),o=Un(a);let n=ka(e,o);const s=new Set;let i=[];const r=Hn();function c(_){for(const F of s)F(_)}function u(_){t.set(`${yt}${_}`,n[_])}function p(){const _={};for(const j of Object.keys(n)){const L=t.get(`${yt}${j}`);L!==null&&(_[j]=L)}for(const j of kn){const L=t.get(`${yt}${j}`);L!==null&&(_[j]=L)}const F=t.get(ce),{state:z,applied:D}=Ga(_,F,{hoyISO:e,finISO:o});if(n=z,d(),D.length>0){for(const j of Object.keys(n))u(j);t.set(ce,Ut)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Ae(e)],u("accounts");return}const _=n.accounts.filter(F=>F.esCuentaPrincipal);if(_.length===0)n.accounts=n.accounts.map((F,z)=>z===0?{...F,esCuentaPrincipal:!0}:F),u("accounts");else if(_.length>1){let F=!1;n.accounts=n.accounts.map(z=>z.esCuentaPrincipal?F?{...z,esCuentaPrincipal:!1}:(F=!0,z):z),u("accounts")}}function l(_){return n[_]}function f(_,F){n[_]=F,u(_),c(_)}function v(_){f("config",{...n.config,..._})}function b(_){return s.add(_),()=>s.delete(_)}function S(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function g(_,F){const z=[...n[_]],D={...F,_id:S()};return z.push(D),f(_,z),D}function h(_,F,z){const D=n[_].map(j=>j._id===F?{...j,...z}:j);f(_,D)}function w(_,F){const z=n[_],D=z.findIndex(j=>j._id===F);D<0||(r.registrar({col:_,item:z[D],indice:D}),f(_,z.filter((j,L)=>L!==D)))}function C(){const _=r.tomar();if(!_)return null;const F=[...n[_.col]];return F.splice(Math.min(_.indice,F.length),0,_.item),f(_.col,F),_}function $(){return r.pendiente()}function y(){const _=n.accounts||[],F=_.find(z=>z.esCuentaPrincipal&&z.activo)||_.find(z=>z.activo);return F?F._id:"default"}function A(_){var F;return((F=n.accounts.find(z=>z._id===_))==null?void 0:F.nombre)??_}function x(){return Vt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function M(){return Vt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function I(){return structuredClone(n)}function E(_,F=null){const{state:z,applied:D}=Ga(_,F,{hoyISO:e,finISO:o});n=z,d();for(const j of Object.keys(n))u(j);t.set(ce,Ut);for(const j of Object.keys(n))c(j);return{applied:D}}return{load:p,get:l,set:f,patchConfig:v,subscribe:b,addItem:g,updateItem:h,removeItem:w,deshacerBorrado:C,borradoPendiente:$,getPrincipalAccountId:y,accountName:A,resolverTramosIRPF:x,resolverTramosGanancias:M,snapshot:I,replaceAll:E,get schemaVersion(){return Ut},get migrationsApplied(){return[...i]},get today(){return e||W()}}}function Wn(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const It=Object.keys(ka("1970-01-01","1970-01-01"));function Ua(t){const a={};for(const e of It){const o=t.get(`${yt}${e}`);o!=null&&(a[e]=o)}return a}function Kn(t,a){const e=[];for(const o of It){const n=a[o];n!=null&&(t(`${yt}${o}`,n),e.push(o))}return e}function Jn(t){return It.filter(a=>t[a]===void 0||t[a]===null)}function Qn(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!It.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Ya=`${Pt}meta_proyectos`,Wa=`${Pt}meta_proyectoActivo`,Ct="default",Xn="Mis finanzas";function De(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Kt(t){return t===Ct?Pt:`${Pt}p_${t}_`}function Ka(){return[...It.map(t=>`${yt}${t}`),ce,Fe]}function Zn(t=localStorage){function a(){try{const d=t.getItem(Ya);if(!d)return[];const l=JSON.parse(d);return Array.isArray(l)?l:[]}catch{return[]}}function e(d){t.setItem(Ya,JSON.stringify(d))}function o(){const d=a();if(d.some(v=>v._id===Ct))return d;const l=Date.now(),f=[{_id:Ct,nombre:Xn,creadoEn:l,actualizadoEn:l},...d];return e(f),f}function n(){try{const d=t.getItem(Wa);if(!d)return Ct;const l=JSON.parse(d);return typeof l=="string"&&l?l:Ct}catch{return Ct}}function s(d){t.setItem(Wa,JSON.stringify(d))}function i(d){const l=d.trim()||"Proyecto sin nombre",f=Date.now(),v={_id:De(),nombre:l,creadoEn:f,actualizadoEn:f};return e([...o(),v]),v}function r(d,l){const f=l.trim();f&&e(o().map(v=>v._id===d?{...v,nombre:f,actualizadoEn:Date.now()}:v))}function c(d,l){const f=o().find(g=>g._id===d);if(!f)throw new Error("Proyecto no encontrado.");const v=Kt(d),b={_id:De(),nombre:(l==null?void 0:l.trim())||`${f.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},S=Kt(b._id);for(const g of Ka()){const h=t.getItem(`${v}${g}`);h!==null&&t.setItem(`${S}${g}`,h)}return e([...o(),b]),b}function u(d){if(d===Ct)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const l=o();if(!l.some(v=>v._id===d))return;const f=Kt(d);for(const v of Ka())t.removeItem(`${f}${v}`);e(l.filter(v=>v._id!==d))}function p(d){const l=new Map(o().map(v=>[v._id,v]));for(const v of d){if(!v||typeof v._id!="string")continue;const b=l.get(v._id);(!b||(v.actualizadoEn??0)>b.actualizadoEn)&&l.set(v._id,v)}const f=[...l.values()];return e(f),f}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:u,fusionarRemotos:p}}function ts(t,a,e){const o=Va(t,Kt(a)),n={};for(const s of e){const i=o.get(`${yt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function es(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,De())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const et={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},$t=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:et.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:et.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:et.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:et.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:et.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:et.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:et.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:et.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:et.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:et.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:et.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:et.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:et.datos,porDefecto:!1,dependencias:["sync-nube"]}],as=new Map($t.map(t=>[t.id,t]));function Jt(t){return as.get(t)}function Ja(t){return $t.filter(a=>(a.dependencias||[]).includes(t))}function Te(){const t={};for(const a of $t)t[a.id]=a.porDefecto;return t}function Qa(){const t=[],a=new Map;for(const e of $t)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function os(t){function a(){return{...Te(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,l=a(),f=new Set){const v=Jt(d);if(!v)return!1;if(v.nucleo)return!0;if(l[d]===!1)return!1;if(f.has(d))return!0;f.add(d);for(const b of v.dependencias||[])if(!o(b,l,f))return!1;return!0}function n(d,l=a()){const f=Jt(d);return f?(f.dependencias||[]).filter(v=>!o(v,l)):[]}function s(d,l){var w;const f=Jt(d);if(!f)return{cambiadas:[]};if(f.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const v=a(),b=new Map($t.map(C=>[C.id,o(C.id,v)])),S={...v,[d]:l};let g;if(l){const C=[...f.dependencias||[]];for(;C.length;){const $=C.pop();S[$]===!1&&(S[$]=!0,g="dependencias-activadas"),C.push(...((w=Jt($))==null?void 0:w.dependencias)||[])}}else{const C=Ja(d).map($=>$.id);for(;C.length;){const $=C.pop();S[$]!==!1&&(S[$]=!1,g="cascada-apagado"),C.push(...Ja($).map(y=>y.id))}}return e(S),{cambiadas:$t.filter(C=>o(C.id,S)!==b.get(C.id)).map(C=>C.id),motivo:g}}function i(){const d=a();return $t.map(l=>{const f=n(l.id,d);return{...l,activa:o(l.id,d),...f.length>0&&d[l.id]!==!1?{bloqueadaPor:f}:{}}})}function r(){const d=a();return Qa().map(({grupo:l,features:f})=>({grupo:l,features:f.map(v=>{const b=n(v.id,d);return{...v,activa:o(v.id,d),...b.length>0&&d[v.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(Te())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function p(d){const l=d,f=l&&typeof l=="object"&&l.features&&typeof l.features=="object"?l.features:null;if(!f)throw new Error('El perfil no tiene una sección "features" válida');const v=Te(),b=[],S=[];for(const[g,h]of Object.entries(f)){if(!Jt(g)){S.push(g);continue}if(typeof h!="boolean"){S.push(g);continue}v[g]=h,b.push(g)}return e(v),{aplicadas:b,ignoradas:S}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:u,importProfile:p,bloqueadaPor:d=>n(d)}}const Qt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function ns(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Qt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Qt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Qt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Qt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function ss(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Qt(o)}</div>
        ${n.map(ns).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function is(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function rs(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${ss(e)}`,n(i)}function n(i){var c,u,p;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var v;const l=d.dataset.featureToggle,f=e.setEnabled(l,d.checked);f.motivo==="dependencias-activadas"&&Ft(t,"Se han activado también las funcionalidades necesarias"),f.motivo==="cascada-apagado"&&Ft(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(v=t.onChange)==null||v.call(t,f.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),l=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),f=URL.createObjectURL(l),v=a.createElement("a");v.href=f,v.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(f),Ft(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var l,f;const d=(l=r.files)==null?void 0:l[0];if(d)try{const{aplicadas:v,ignoradas:b}=e.importProfile(JSON.parse(await d.text()));Ft(t,b.length>0?`Perfil cargado (${v.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${v.length} funcionalidades)`),(f=t.onChange)==null||f.call(t,v),o(i)}catch(v){Ft(t,"No se pudo cargar el perfil: "+v.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var d;e.reset(),Ft(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=is(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const dt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),cs={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Xa(t){return cs[t]??t}function pt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Za(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function ls(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function ds(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function us(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function ps(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${dt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${dt(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${dt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${dt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${dt(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${dt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ms(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${dt(i._id)}">${dt(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${dt(i)}"/> ${dt(Xa(i))}
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
    </div>`}function fs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function gs(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>ps(u,c)).join("")}
      </div>
      ${fs()}
      ${ms(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,u;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.proyectoId,l=p.dataset.proyectoAccion,f=e.listar().find(v=>v._id===d);if(f){if(l==="cambiar"){if(!Za(t,`¿Cambiar a "${f.nombre}"? Se recargará la página.`))return;e.cambiarA(d),ls(t);return}if(l==="renombrar"){const v=typeof prompt=="function"?prompt("Nuevo nombre",f.nombre):null;if(!v||!v.trim())return;e.renombrar(d,v.trim()),pt(t,"Proyecto renombrado"),n(r);return}if(l==="duplicar"){const v=`${f.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",v):v;if(b===null)return;const S=e.duplicar(d,b.trim()||v);pt(t,`"${S.nombre}" creado como copia de "${f.nombre}" ✓`),n(r);return}if(l==="eliminar"){if(!Za(t,`¿Eliminar "${f.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),pt(t,`"${f.nombre}" eliminado`),n(r)}catch(v){pt(t,v.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),d=p==null?void 0:p.value.trim();if(!d){pt(t,"Ponle un nombre al proyecto","warn");return}const l=e.crear(d);pt(t,`"${l.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var f;const p=(f=r.querySelector("#proyecto-import-origen"))==null?void 0:f.value;if(!p)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(v=>v.dataset.proyectoImportCol);if(d.length===0){pt(t,"Elige al menos una colección para importar","warn");return}const{importadas:l}=e.importarDesde(p,d);if(l.length===0){pt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}pt(t,`Importado: ${l.map(Xa).join(", ")} ✓`),ds(),n(r)})}function i(){const r=us(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const le=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],St=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Dt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function vs(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function bs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function hs(t){const a=t.color||le[0];return`
    <div class="dm-section" data-persona-fila="${St(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${St(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${St(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${St(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${St(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${St(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${St(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ys(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${le.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${le[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function $s(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(hs).join("")}
      </div>
      ${ys()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.personaId,f=d.dataset.personaAccion,v=e.get("personas"),b=v.find(S=>S._id===l);if(b){if(f==="renombrar"){const S=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!S||!S.trim())return;e.updateItem("personas",l,{nombre:S.trim()}),Dt(t,"Persona renombrada"),s(),n(c);return}if(f==="defecto"){e.set("personas",v.map(S=>({...S,esPorDefecto:S._id===l}))),Dt(t,`"${b.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(f==="activo"){e.updateItem("personas",l,{activo:!b.activo}),s(),n(c);return}if(f==="eliminar"){if(v.length<=1){Dt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!vs(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",l),Dt(t,`"${b.nombre}" eliminada`),s(),n(c)}}})});const u=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const l=d.getAttribute("data-persona-color");u&&(u.value=l),c.querySelectorAll("[data-persona-color]").forEach(f=>{f.style.border=f.getAttribute("data-persona-color")===l?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),l=d==null?void 0:d.value.trim();if(!l){Dt(t,"Ponle un nombre a la persona","warn");return}const f=(u==null?void 0:u.value)||le[0],v=e.addItem("personas",{nombre:l,color:f,esPorDefecto:!1,activo:!0});Dt(t,`"${v.nombre}" creada ✓`),s(),n(c)})}function r(){const c=bs(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const to={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function eo(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function xs({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([u,p])=>[p,u]);for(const[u,p]of[...Object.entries(to),...c]){const d=t.isEnabled(u),l=a.querySelector(`.nav-btn[data-view="${p}"]`);l&&(l.style.display=d?"":"none"),!d&&n()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(u=>{const p=[...u.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const d=p.some(l=>l.style.display!=="none");u.style.display=d?"":"none"}),eo(a,u=>t.isEnabled(u)),r){const u=e??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const u=new MutationObserver(()=>{if(!c){c=!0;try{eo(a,p=>t.isEnabled(p))}finally{c=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>to[r]}}const ws="toast toast-deshacer";function Is(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(d){const l=n();if(!l)return;c();const f=document.createElement("div");f.className=ws,f.style.display="flex",f.style.alignItems="center",f.style.gap="12px";const v=document.createElement("span");v.textContent=`${Vn(d.col,d.item)} se ha eliminado.`,v.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const S=a.deshacerBorrado();if(c(),!S)return;const g=n();if(g){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",g.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),f.appendChild(v),f.appendChild(b),l.appendChild(f),s=f,i=setTimeout(c,o)}const p=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,u(d))});return()=>{p(),c()}}function de(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function ao(t,a){const e=de(t),o=de(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Xt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Cs(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Xt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Xt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Xt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Xt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Xt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Ss(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=de(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of Cs(t)){if(!i(c.ruta))continue;const u=ao(c.titulo,s),p=u>=0?-1:Math.min(ao(c.extra??"",s),2);if(u<0&&p<0)continue;const d=u>=0?u:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,de(c.titulo).length)})}return r.sort((c,u)=>c.peso-u.peso||c.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const As="buscador-overlay",oo="btn-buscador";function Ms(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const C=a.createElement("div");C.id=As,C.className="modal-overlay",C.style.alignItems="flex-start",C.style.paddingTop="10vh";const $=a.createElement("div");$.className="modal-box",$.style.maxWidth="560px",$.style.padding="14px";const y=a.createElement("input");y.type="search",y.className="form-input",y.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",y.setAttribute("aria-label","Buscar en toda la aplicación"),y.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",$.appendChild(y),$.appendChild(A),C.appendChild($),a.body.appendChild(C),C.addEventListener("click",x=>{x.target===C&&b()}),y.addEventListener("input",()=>{r=0,p()}),y.addEventListener("keydown",f),o=C,n=y,s=A,C}function u(){if(s){if(s.textContent="",i.length===0){const C=a.createElement("div");C.style.padding="14px 4px",C.style.fontSize="13px",C.style.color="var(--text3)";const $=(n==null?void 0:n.value.trim())??"";C.textContent=$.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(C);return}i.forEach((C,$)=>{const y=a.createElement("button");y.type="button",y.className="buscador-fila",y.dataset.indice=String($),$===r&&y.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const x=a.createElement("div");x.textContent=C.titulo,x.style.fontSize="13px",x.style.overflow="hidden",x.style.textOverflow="ellipsis",x.style.whiteSpace="nowrap";const M=a.createElement("div");M.textContent=C.detalle,M.style.fontSize="11px",M.style.color="var(--text3)",M.style.overflow="hidden",M.style.textOverflow="ellipsis",M.style.whiteSpace="nowrap",A.appendChild(x),C.detalle&&A.appendChild(M);const I=a.createElement("span");I.className="tag",I.textContent=C.etiqueta,I.style.flexShrink="0",y.appendChild(A),y.appendChild(I),y.addEventListener("click",()=>l($)),s.appendChild(y)})}}function p(){const C=(n==null?void 0:n.value)??"";i=Ss(t.estado(),C,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d(C){var $,y;i.length!==0&&(r=(r+C+i.length)%i.length,u(),(y=($=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:$.scrollIntoView)==null||y.call($,{block:"nearest"}))}function l(C){const $=i[C];$&&(b(),t.navegar($.ruta))}function f(C){C.key==="Escape"?(C.preventDefault(),b()):C.key==="ArrowDown"?(C.preventDefault(),d(1)):C.key==="ArrowUp"?(C.preventDefault(),d(-1)):C.key==="Enter"&&(C.preventDefault(),l(r))}function v(){const C=o??c();C.classList.remove("hidden"),C.style.display="",r=0,n&&(n.value="",n.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function S(){return!!o&&o.style.display!=="none"}function g(C){(C.ctrlKey||C.metaKey)&&(C.key==="k"||C.key==="K")&&(C.preventDefault(),S()?b():v())}a.addEventListener("keydown",g);let h=null;function w(){const C=a.getElementById("period-bar");if(!C||a.getElementById(oo))return;const $=a.createElement("button");$.id=oo,$.type="button",$.className="btn-secondary",$.title="Buscar en toda la aplicación (Ctrl+K)",$.setAttribute("aria-label","Buscar"),$.textContent="🔍 Buscar",$.style.marginLeft="auto",$.addEventListener("click",v),C.appendChild($),h=$}return w(),()=>{a.removeEventListener("keydown",g),h==null||h.remove(),o==null||o.remove(),o=null,n=null,s=null}}const ze="aviso-guardado";function Es(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function u(){var v;r&&clearTimeout(r),r=null,(v=a.getElementById(ze))==null||v.remove()}function p(){if(s==="oculto")return u();const v=e();if(!v)return;let b=a.getElementById(ze);b||(b=a.createElement("div"),b.id=ze,v.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${s}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const S=a.createElement("span");if(S.style.flex="1",b.appendChild(S),s==="pendiente")S.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void l())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",p()}));else if(s==="subiendo"){S.textContent="Subiendo…";const g=a.createElement("span");g.className="guardado-giro",g.setAttribute("aria-hidden","true"),b.appendChild(g)}else s==="guardado"?S.textContent="¡Guardado!":s==="error"&&(S.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void l())))}function d(v,b,S){const g=a.createElement("button");return g.type="button",g.className=b,g.textContent=v,g.style.flexShrink="0",g.addEventListener("click",S),g}async function l(){if(c)return c;r&&clearTimeout(r);const v=t.cambios.revision();return s="subiendo",p(),c=(async()=>{try{await t.guardar(),n.alDia(v),s="guardado",p(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),s=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const f=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",p()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:l,detener(){f(),u()}}}function _s({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(v){return`view-${v}`}function s(v){const b=t.getElementById(n(v.route));if(b)return b;const S=t.querySelector(".view-container");if(!S)return null;const g=t.createElement("div");return g.id=n(v.route),g.className="view hidden",S.appendChild(g),g}function i(v){if(t.querySelector(`.nav-btn[data-view="${v.route}"]`))return;const b=t.querySelectorAll(".nav-section"),S=b[v.seccion??Math.max(0,b.length-1)];if(!S)return;const g=t.createElement("button");g.className="nav-btn",g.dataset.view=v.route,g.innerHTML=`${v.iconoPath?`<svg viewBox="0 0 24 24"><path d="${v.iconoPath}"/></svg>`:""}<span>${v.nombre}</span>`,S.appendChild(g),g.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(v.route)})}function r(v){e.set(v.route,v),s(v),i(v)}function c(){return[...e.keys()].filter(v=>{const b=e.get(v);return!a||a(b.flagId??b.id)})}function u(v){return c().includes(v)}function p(v){const b=e.get(v);if(!b||a&&!a(b.flagId??b.id))return!1;const S=s(b);if(!S)return!1;if(o&&o!==v){const g=e.get(o),h=t.getElementById(n(o));g!=null&&g.unmount&&h&&g.unmount(h)}return b.mount(S),o=v,!0}function d(){o&&p(o)}function l(){const v={};for(const[b,S]of e)v[b]=S.flagId??S.id;return v}function f(){for(const v of e.values())s(v),i(v)}return{register:r,routes:c,has:u,mount:p,rerender:d,flagPorRuta:l,attachToShell:f,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function mt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(P(t))}</span>`}function no(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function je(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const Ps=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Zt(t){const[a,e]=t.split("-").map(Number);return`${Ps[e-1]} ${a}`}function q(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function at(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function T(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function G(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function rt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function so(t,a){const e=parseFloat(rt(t,a));return Number.isFinite(e)?e:0}const Fs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function qe(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Ds(t){const{store:a}=t,e=t.hoy??W,o=()=>k(e()),n=()=>a.get("config").margenesSeguridad??[];function s(f){var v;a.patchConfig({margenesSeguridad:f}),(v=t.onDatosCambiados)==null||v.call(t)}function i(f,v){const b=n().map(g=>({...g,puntos:(g.puntos??[]).map(h=>({...h}))})),S=b.find(g=>g._id===f);S&&(v(S),s(b))}function r(f){const v=a.get("config"),b=Se(f,a.get("expenses"),v,a.get("loans"),e(),!1,o());return P(b)}function c(f,v,b){const S=v.tipo==="fijo",g=S?"":`<span class="text-sm" style="color:var(--text3)">${m(P((v.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(v._id)}" data-margen="${m(f._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(v.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${S?" selected":""}>Fijo €</option>
            <option value="meses"${S?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${S?`<input type="number" class="form-input" style="width:90px" value="${v.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${S?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${v.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${g}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(f,v,b){const S=f.cuentas&&f.cuentas.length>0?f.cuentas.map(C=>{var $;return(($=v.find(y=>y._id===C))==null?void 0:$.nombre)??C}).join(", "):"Todas las cuentas activas",h=[...f.puntos??[]].sort((C,$)=>C.fecha.localeCompare($.fecha)).map(C=>c(f,C,b)).join(""),w=f.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(S)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${m(r(f))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${m(f._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${m(f.nombre)}</span>
            <span class="badge ${f.activo?"badge-active":"badge-inactive"}">${f.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${f.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${f.activo?"checked":""} data-toggle-margen="${m(f._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${m(f._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${m(f._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${w}
      </div>`}function p(f,v){const b=v?n().find(w=>w._id===v):null,S=a.get("accounts").filter(w=>w.activo),g=new Set((b==null?void 0:b.cuentas)??[]),h=S.map(w=>`
        <label class="tag" data-chip="${m(w._id)}" style="cursor:pointer;${g.has(w._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(w._id)}" ${g.has(w._id)?"checked":""} style="display:none"/>
          ${m(w.nombre)}
        </label>`).join(" ");f.innerHTML=`
      <div class="modal-title">${v?"Editar margen":"Nuevo margen de seguridad"}</div>
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
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(W())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${m(v??"")}">Guardar</button>
      </div>`}function d(f,v){const b=document.getElementById("modal-overlay"),S=document.getElementById("modal-content");!b||!S||(p(S,f),b.classList.remove("hidden"),G(S,".mg-acc-chip",g=>{const h=g,w=S.querySelector(`[data-chip="${h.value}"]`);w&&(w.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),G(S,"#mg-p-tipo",g=>{const h=g.value==="fijo",w=S.querySelector("#mg-p-importe-wrap"),C=S.querySelector("#mg-p-meses-wrap");w&&(w.style.display=h?"":"none"),C&&(C.style.display=h?"none":"")}),T(S,"[data-cerrar-form]",()=>b.classList.add("hidden")),T(S,"[data-guardar-margen]",g=>{var y,A,x,M,I;const h=g.getAttribute("data-guardar-margen")||"",w=((y=S.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!w)return q("El nombre es obligatorio","err");const C=[...S.querySelectorAll(".mg-acc-chip:checked")].map(E=>E.value),$=n().map(E=>({...E}));if(h){const E=$.findIndex(_=>_._id===h);if(E===-1)return q("Margen no encontrado","err");$[E]={...$[E],nombre:w,cuentas:C}}else{const E=((A=S.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",_={_id:qe(),fecha:((x=S.querySelector("#mg-p-fecha"))==null?void 0:x.value)||W(),tipo:E,importe:parseFloat(((M=S.querySelector("#mg-p-importe"))==null?void 0:M.value)??"0")||0,meses:parseFloat(((I=S.querySelector("#mg-p-meses"))==null?void 0:I.value)??"1")||1};$.push({_id:qe(),nombre:w,activo:!0,cuentas:C,puntos:[_]})}s($),q(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),v()}))}function l(f){const v=n(),b=a.get("accounts"),S=Gt(a.get("expenses"),o());f.innerHTML=`
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
      ${v.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:v.map(h=>u(h,b,S)).join("")}`;const g=()=>l(f);T(f,"[data-nuevo-margen]",()=>d(null,g)),T(f,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),g)),T(f,"[data-borrar-margen]",h=>{at("¿Eliminar este margen de seguridad?")&&(s(n().filter(w=>w._id!==h.getAttribute("data-borrar-margen"))),q("Margen eliminado"),g())}),G(f,"[data-toggle-margen]",h=>{const w=h.getAttribute("data-toggle-margen");i(w,C=>{C.activo=h.checked}),g()}),T(f,"[data-add-punto]",h=>{const w=h.getAttribute("data-add-punto");i(w,C=>{C.puntos=[...C.puntos??[],{_id:qe(),fecha:W(),tipo:"fijo",importe:0,meses:1}]}),g()}),T(f,"[data-borrar-punto]",h=>{const w=h.closest("[data-punto]");if(!w)return;const C=w.dataset.margen,$=w.dataset.punto;i(C,y=>{y.puntos=(y.puntos??[]).filter(A=>A._id!==$)}),g()}),G(f,"[data-campo]",h=>{const w=h.closest("[data-punto]");if(!w)return;const C=h.getAttribute("data-campo"),$=h.value;i(w.dataset.margen,y=>{const A=(y.puntos??[]).find(x=>x._id===w.dataset.punto);A&&(C==="fecha"?A.fecha=$:C==="tipo"?A.tipo=$:C==="importe"?A.importe=parseFloat($)||0:A.meses=parseFloat($)||0)}),g()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Fs,mount:l}}const Ts=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],zs=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],js=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function qs(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ne=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function io(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=qs(t),i=Ne(Ts.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ne(zs,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ne(js,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function ro(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function co(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const Ns={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Rs(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Tt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const u=s.has(c._id),p=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${u?" checked":""}/>
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
      ${Rs(e,a).map(r).join("")}
    </div>
  </div>`}function zt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function jt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,u=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=u?parseFloat(u.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:s}}function lo(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Ns[t.modo]})`}function Re(t,a,e){const o=lo(t,e),n=lo(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Ls="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Os=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function ks(t){const a=t.hoy??W,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},n=()=>t.store.get("accounts"),s=g=>{var h;return((h=n().find(w=>w._id===(g||"default")))==null?void 0:h.nombre)??(g||"default")};function i(){const g=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(w=>!w.fechaFin||w.fechaFin>=g)),e.tipo&&(h=h.filter(w=>w.tipo===e.tipo)),e.cuenta&&(h=h.filter(w=>(w.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(w=>(w.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(w=>(w.fechaInicio??"")<=e.hasta)),e.busqueda){const w=e.busqueda.toLowerCase();h=h.filter(C=>C.concepto.toLowerCase().includes(w))}return e.tags.size>0&&(h=h.filter(w=>(w.tags||[]).some(C=>e.tags.has(C)))),h.sort((w,C)=>{const $=w[e.orden]??"",y=C[e.orden]??"";return typeof $=="number"&&typeof y=="number"?($-y)*e.sentido:String($).localeCompare(String(y))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(g=>g.tags||[]))].filter(Boolean).sort()}function c(g,h){const w=e.orden===g?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${g}">${m(h)} <span class="sort-arrow">${w}</span></span>`}function u(g,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+n().filter(C=>C.activo!==!1).map(C=>`<option value="${m(C._id)}"${C._id===g?" selected":""}>${m(C.nombre)}</option>`).join("")}function p(g){const h=g.tipo==="transferencia",w=Re(g.repartoConsumo,g.repartoPago,t.store.get("personas")),C=ye(g.diaPago??""),$=g.tipoFrecuencia==="extraordinario"?"Único":`Cada ${g.frecuencia??1} ${g.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${C?` · ${C}`:""}`,y=!!g.fechaFin&&g.fechaFin<a(),A=h?'<span class="badge badge-purple">⇄ transf.</span>':g.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',x=h?`${m(s(g.cuenta))} → ${m(s(g.cuentaDestino))}`:m(s(g.cuenta)),M=(g.tags||[]).map(I=>`<span class="tag${e.tags.has(I)?" active":""}" data-tag="${m(I)}" title="Filtrar por ${m(I)}">${m(I)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(g.concepto)}</div>
        <div class="tag-list mt-4">${M}</div>
      </div>
      <div>${A}</div>
      <div class="num ${g.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(P(g.cuantia))}</div>
      <div class="text-sm">${m($)}</div>
      <div class="text-sm exp-col-hide">${x}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(g._id)}"${g.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${g.tipo==="gasto"&&g.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${g.tipo==="gasto"&&g.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${g.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${g.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(g.ajustadaEn??"")}">ajustada</span>`:""}
        ${w?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(w)}">👥 reparto</span>`:""}
        ${y?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(g._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(g._id)}">✕</button>
      </div>
    </div>`}function d(g){const h=i(),w=r();g.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${u(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${m(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${m(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${w.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${w.map(C=>`<span class="tag${e.tags.has(C)?" active":""}" data-tag="${m(C)}">${m(C)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(p).join("")}
      </div>`}function l(g){const h=(g==null?void 0:g.tipo)==="transferencia",w=t.store.get("personas"),C=($,y,A,x,M="")=>`<div class="form-group"><label class="form-label">${m(y)}</label>
       <input class="form-input" type="${A}" id="${$}" value="${m(x)}" placeholder="${m(M)}"/></div>`;return`
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
            ${Os.map(([$,y])=>`<option value="${$}"${((g==null?void 0:g.tipoFrecuencia)??"mensual")===$?" selected":""}>${m(y)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${C("ef-fecha-ini","Fecha inicio","date",(g==null?void 0:g.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((g==null?void 0:g.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((g==null?void 0:g.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(g==null?void 0:g.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${g!=null&&g._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${C("ef-fecha-fin","Fecha fin (opcional)","date",(g==null?void 0:g.fechaFin)??"")}</div>
          <div class="mt-8">${io(g==null?void 0:g.diaPago,"exp")}</div>
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
          ${h?"":`${Tt("Reparto de consumo",g==null?void 0:g.repartoConsumo,w,"consumo")}
                 ${Tt("Reparto de pago",g==null?void 0:g.repartoPago,w,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((g==null?void 0:g._id)??"")}">Guardar</button>
      </div>`}function f(g){var C;const h=((C=g.querySelector("#ef-tipo"))==null?void 0:C.value)??"gasto",w=($,y)=>{const A=g.querySelector($);A&&(A.style.display=y?"":"none")};w("#ef-destino-wrap",h==="transferencia"),w("#ef-basico-wrap",h!=="transferencia"),w("#ef-irpf-wrap",h==="ingreso"),w("#ef-clasificacion-wrap",h==="gasto")}function v(g,h,w){const C=document.getElementById("modal-overlay"),$=document.getElementById("modal-content");!C||!$||($.innerHTML=`<div class="modal-title">${m(h)}</div>${l(g)}`,C.classList.remove("hidden"),G($,"#ef-tipo",()=>f($)),G($,"[data-dp-modo]",()=>ro($)),G($,'[data-reparto-modo="consumo"]',()=>zt($,"consumo")),G($,'[data-reparto-modo="pago"]',()=>zt($,"pago")),T($,"[data-cancelar]",()=>C.classList.add("hidden")),T($,"[data-guardar]",y=>{b($,y.getAttribute("data-guardar")||"")&&(C.classList.add("hidden"),w())}))}function b(g,h){const w=E=>{var _;return((_=g.querySelector(E))==null?void 0:_.value)??""},C=E=>{var _;return!!((_=g.querySelector(E))!=null&&_.checked)},$=w("#ef-tipo")||"gasto",y=$==="transferencia",A=w("#ef-concepto").trim(),x=parseFloat(w("#ef-cuantia"));if(!A||!Number.isFinite(x))return q("Concepto y cuantía obligatorios","err"),!1;const M=w("#ef-clasificacion"),I={concepto:A,tipo:$,cuantia:x,frecuencia:parseInt(w("#ef-frecuencia"),10)||1,tipoFrecuencia:w("#ef-tipo-frec")||"mensual",fechaInicio:w("#ef-fecha-ini"),fechaFin:w("#ef-fecha-fin")||null,diaPago:co(g),cuenta:w("#ef-cuenta"),cuentaDestino:y?w("#ef-cuenta-dest")||"default":void 0,activo:C("#ef-activo"),basico:!y&&C("#ef-basico"),sujetoIRPF:!y&&C("#ef-sujetoIRPF"),clasificacion:$==="gasto"?M||null:void 0,tags:y?["transferencia"]:w("#ef-tags").split(",").map(E=>E.trim()).filter(Boolean),repartoConsumo:y?void 0:jt(g,"consumo"),repartoPago:y?void 0:jt(g,"pago")};return h?(t.store.updateItem("expenses",h,I),q("Actualizado")):(t.store.addItem("expenses",I),q("Creado")),o(),!0}function S(g,h){const w=g.querySelector("[data-busqueda]");let C;w==null||w.addEventListener("input",()=>{clearTimeout(C),C=setTimeout(()=>{e.busqueda=w.value,h();const $=g.querySelector("[data-busqueda]");$==null||$.focus(),$==null||$.setSelectionRange($.value.length,$.value.length)},250)}),G(g,"[data-expirados]",$=>{e.mostrarExpirados=$.checked,h()}),G(g,"[data-f-tipo]",$=>{e.tipo=$.value,h()}),G(g,"[data-f-cuenta]",$=>{e.cuenta=$.value,h()}),G(g,"[data-f-desde]",$=>{e.desde=$.value,h()}),G(g,"[data-f-hasta]",$=>{e.hasta=$.value,h()}),T(g,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),T(g,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),T(g,"[data-tag]",$=>{const y=$.getAttribute("data-tag");e.tags.has(y)?e.tags.delete(y):e.tags.add(y),h()}),T(g,"[data-orden]",$=>{const y=$.getAttribute("data-orden");e.orden===y?e.sentido=e.sentido===1?-1:1:(e.orden=y,e.sentido=1),h()}),T(g,"[data-nuevo]",()=>v(null,"Nuevo gasto/ingreso",h)),T(g,"[data-editar]",$=>{const y=t.store.get("expenses").find(A=>A._id===$.getAttribute("data-editar"));y&&v(y,"Editar",h)}),T(g,"[data-duplicar]",$=>{const y=t.store.get("expenses").find(M=>M._id===$.getAttribute("data-duplicar"));if(!y)return;const{_id:A,...x}=y;v({...x,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",h)}),T(g,"[data-borrar]",$=>{at("¿Eliminar?")&&(t.store.removeItem("expenses",$.getAttribute("data-borrar")),q("Eliminado"),o(),h())}),G(g,"[data-activo]",$=>{const y=$;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ls,mount(g){const h=()=>d(g);d(g),g.dataset.wired!=="1"&&(S(g,h),g.dataset.wired="1")}}}function ue(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=ft(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function uo(t,a,e,o){return t.reduce((n,s)=>{const i=ft(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Bs(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=J({...t,amortizaciones:o.slice(0,s)}),r=J({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ue(i.tabla,a,e)-ue(r.tabla,a,e)}})}const Le=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Hs(t,a){const e=da(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?ua(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?pa(t.tin||0,i):null,c=o&&n?Bs(t,a.periodos,a.hoy):[],u=c.length?ue(e.sinAmort.tabla,a.periodos,a.hoy)-ue(e.tabla,a.periodos,a.hoy):null,p=u===null?null:u-e.costeTotalAmort,d=s?uo(e.tabla,a.periodos,a.hoy,e.comAp):null,l=s&&o?uo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const f=Re(t.repartoConsumo,t.repartoPago,a.personas);return f?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(f)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(f=>`<span class="tag">${m(f)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(P(e.cuota))}/mes</span>
        <span class="text-sm">${m(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${Le("Cuota mensual",m(P(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(P(a.cuotaMes))}</div>`:"")}
        ${Le("Total intereses",m(P(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(P(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Le("Total pagado",m(P(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(P(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(ia(e.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(P(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(P(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(ye(t.diaPago))}</div></div>`:""}
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
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(P(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(P(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(P(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(P(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(p??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(P(p??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(P(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(P(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(P(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?Gs(t,e.totalPagado,d,l):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(f=>Vs(f,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((f,v)=>Us(t._id,f,c[v]??null)).join("")}`:""}
    </div>
  </div>`}function Gs(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(P(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(P(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(P(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(P(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(P(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(P(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Vs(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=ft(e.periodos,e.hoy,t.fecha);o=m(P(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(P(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(P(t.interes))}</td>
    <td class="num">${m(P(t.amortizacion))}</td>
    <td class="num">${m(P(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Us(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(a.fecha)}</span>
    <span class="num">${m(P(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(P(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(P(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(a._id)}">✕</button>
  </div>`}const Z=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,te=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,ee=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,Ys=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Ws(t,a,e,o=W()){return`
    <div class="grid-2">
      ${Z("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${Z("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${Z("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${Z("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${Z("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Ys(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${io(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${te("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Z("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Z("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${ee("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Tt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Tt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ee("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ee("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ee("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ks(t,a,e=W()){return`
    <div class="grid-2">
      ${Z("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${Z("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${te("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${ee("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Js="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Qs(t){const a=t.hoy??W;let e=!1;const o=new Set;let n=null;const s=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)};function i(y){const A=y.filter(M=>M.activo);if(A.length<2)return"";const x=(M,I)=>`<button class="btn-secondary btn-sm" data-persona-tab="${M===null?"":m(M)}"
               style="${n===M?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(I)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${x(null,"Todas")}
      ${A.map(M=>x(M._id,M.nombre)).join("")}
    </div>`}function r(y){if(!y.activo||y.simulacion)return!1;const A=J(y).tabla.filter(x=>!x.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c(y,A){const x=a(),M=x.slice(0,7),I=new Map;let E=0;for(const _ of y){if(!_.activo||_.simulacion||A.has(_._id)||(_.fechaInicio||"")>x)continue;const F=J(_).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(M)),z=F.length>0?F[0].cuota:0;I.set(_._id,z),E+=z}return{porLoan:I,total:E,activos:[...I.values()].filter(_=>_>0).length}}function u(y){const A=a().slice(0,7),x=[];for(const M of y){if(!M.activo||M.simulacion)continue;const I=J(M).tabla.filter(_=>!_.esAmortizacion),E=I[I.length-1];E&&E.fecha.slice(0,7)===A&&x.push({loan:M,cuota:E.cuota})}return x}function p(y){return y.length<=1?y[0]??"":`${y.slice(0,-1).join(", ")} y ${y[y.length-1]}`}function d(y){const A=t.store.get("config"),x=A.dashboardStart,M=A.dashboardEnd,I=Math.max(1,(k(M).getTime()-k(x).getTime())/(30.44*864e5));let E=0;for(const _ of y)!_.activo||_.simulacion||(E+=J(_).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=x&&F.fecha<=M).reduce((F,z)=>F+z.cuota,0));return{media:E/I,desde:x,hasta:M}}function l(y){const A=t.store.get("personas"),x=se(A),M=[...t.store.get("loans")].sort((N,R)=>R.tin-N.tin),I=n?M.filter(N=>xe(N.repartoConsumo,N.repartoPago,x).has(n)):M,E=new Set(I.filter(r).map(N=>N._id)),_=e?I:I.filter(N=>!E.has(N._id)),F=c(M,new Set(M.filter(r).map(N=>N._id))),z=d(M),D=u(M),j=t.store.get("config"),L=t.store.get("inflacion"),B=new Date(k(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${E.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${E.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${m(p(D.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(P(D.reduce((N,R)=>N+R.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(B)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(P(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(P(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(z.desde)} → ${m(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${_.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':_.map(N=>Hs(N,{periodos:L,usarInflacion:!!j.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:E.has(N._id),personas:A})).join("")}
      </div>`;for(const N of y.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const f=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),b=()=>{var y;return(y=f())==null?void 0:y.classList.add("hidden")};function S(y,A){const x=f(),M=v();return!x||!M?null:(M.innerHTML=`<div class="modal-title">${m(y)}</div>${A}`,x.classList.remove("hidden"),T(M,"[data-cancelar]",b),M)}function g(y,A){const x=y?t.store.get("loans").find(I=>I._id===y)??null:null,M=S(y?"Editar préstamo":"Nuevo préstamo",Ws(x,t.store.get("accounts"),t.store.get("personas"),a()));M&&(M.addEventListener("change",I=>{const E=I.target;E!=null&&E.matches("[data-dp-modo]")&&ro(M),E!=null&&E.matches('[data-reparto-modo="consumo"]')&&zt(M,"consumo"),E!=null&&E.matches('[data-reparto-modo="pago"]')&&zt(M,"pago")}),T(M,"[data-guardar-loan]",I=>{h(M,I.getAttribute("data-guardar-loan")||"")&&(b(),A())}))}function h(y,A){const x=D=>{var j;return((j=y.querySelector(D))==null?void 0:j.value)??""},M=D=>{var j;return!!((j=y.querySelector(D))!=null&&j.checked)},I=x("#f-nombre").trim(),E=parseFloat(x("#f-capital")),_=parseFloat(x("#f-tin")),F=parseInt(x("#f-meses"),10);if(!I||!Number.isFinite(E)||!Number.isFinite(_)||!Number.isFinite(F))return q("Completa los campos obligatorios","err"),!1;const z={nombre:I,capital:E,tin:_,meses:F,fechaInicio:x("#f-fecha"),comisionApertura:parseFloat(x("#f-com-ap"))||0,comisionAmort:parseFloat(x("#f-com-am"))||0,diaPago:co(y),cuenta:x("#f-cuenta"),simulacion:M("#f-sim"),activo:M("#f-activo"),mostrarFechaFinEnDashboard:M("#f-mostrar-fin"),tipoTasa:x("#f-tipo-tasa"),basico:M("#f-basico"),tags:x("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:jt(y,"consumo"),repartoPago:jt(y,"pago")};return A?(t.store.updateItem("loans",A,z),q("Préstamo actualizado")):(t.store.addItem("loans",{...z,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function w(y,A,x){const M=t.store.get("loans").find(_=>_._id===y);if(!M)return;const I=A?(M.amortizaciones||[]).find(_=>_._id===A)??null:null,E=S(A?"Editar amortización":"Añadir amortización",Ks(y,I,a()));E&&T(E,"[data-guardar-amort]",_=>{const[F,z]=(_.getAttribute("data-guardar-amort")||"").split("|");C(E,F,z)&&(b(),x([F]))})}function C(y,A,x){var j;const M=L=>{var B;return((B=y.querySelector(L))==null?void 0:B.value)??""},I=M("#am-fecha"),E=parseFloat(M("#am-cant"));if(!I||!Number.isFinite(E)||E<=0)return q("Fecha y cantidad requeridas","err"),!1;const _=t.store.get("loans").find(L=>L._id===A);if(!_)return!1;const F={fecha:I,cantidad:E,tipo:M("#am-tipo"),simulacion:!!((j=y.querySelector("#am-sim"))!=null&&j.checked)},z=_.amortizaciones||[],D=x?z.map(L=>L._id===x?{...L,...F}:L):[...z,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",A,{amortizaciones:D}),q(x?"Amortización actualizada":"Amortización añadida"),s(),!0}function $(y,A){T(y,"[data-toggle-finalizados]",()=>{e=!e,A()}),T(y,"[data-persona-tab]",x=>{n=x.getAttribute("data-persona-tab")||null,A()}),T(y,"[data-nuevo-loan]",()=>g(null,A)),T(y,"[data-toggle-loan]",(x,M)=>{var F;if((F=M.target)!=null&&F.closest("button"))return;const I=x.getAttribute("data-toggle-loan"),E=[...y.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===I);(E==null?void 0:E.classList.toggle("open"))?o.add(I):o.delete(I)}),T(y,"[data-editar-loan]",x=>g(x.getAttribute("data-editar-loan"),A)),T(y,"[data-borrar-loan]",x=>{if(!at("¿Eliminar préstamo?"))return;const M=x.getAttribute("data-borrar-loan");t.store.removeItem("loans",M),o.delete(M),q("Eliminado"),s(),A()}),T(y,"[data-amort-loan]",x=>{const M=x.getAttribute("data-amort-loan");o.add(M),w(M,null,A)}),T(y,"[data-editar-amort]",x=>{const[M,I]=(x.getAttribute("data-editar-amort")||"").split("|");o.add(M),w(M,I,A)}),T(y,"[data-borrar-amort]",x=>{const[M,I]=(x.getAttribute("data-borrar-amort")||"").split("|"),E=t.store.get("loans").find(_=>_._id===M);E&&(t.store.updateItem("loans",M,{amortizaciones:(E.amortizaciones||[]).filter(_=>_._id!==I)}),q("Amortización eliminada"),s(),A([M]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Js,mount(y){const A=(x=[])=>{for(const M of x)o.add(M);l(y)};l(y),y.dataset.wired!=="1"&&($(y,A),y.dataset.wired="1")}}}const Oe=6.35;function qt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function po(t){return Math.max(0,(t.bruto||0)-qt(t))}function Xs(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Zs(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+qt(r),0),o=Math.max(0,a-e),n=vt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(po(i)/o):0);return s}function mo(t,a,e){if(t.irpfModo==="manual")return po(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return ct(vt(t.bruto||0,qt(t)),e);const o=Xs(a.filter(i=>i.irpfModo!=="manual")),n=Zs(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ct(s+r,e)-ct(s,e);s+=r}return ct(vt(t.bruto||0,qt(t)),e)}function ti(t,a){return t.reduce((e,o)=>e+mo(o,t,a),0)}function ei(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function ai(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+qt(s),0);return ei(vt(e,o),a)}function oi(t,a,e){const o=t.bruto||0,n=qt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Oe,c=s*(r/100),u=mo(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-c-u)/i}}function ni(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const si={transporte:125,restaurante:220,otros:null},ii={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},ri=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Nt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ci=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function li(t,a){const e=t.map((s,i)=>{const r=a.find(p=>p._id===s.cuenta),c=si[s.tipo],u=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(ii[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(P(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(P(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function di(t,a){const e=a.hoy??W(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Nt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Nt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${ci(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Nt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Nt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Nt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${ri.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
          ${Nt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Oe).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Tt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Tt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function fo(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Oe),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:jt(t,"consumo"),repartoPago:jt(t,"pago")}}function ui(t,a,e,o){const n=fo(t,a),s=a.reduce((g,h)=>g+(h.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):ct(vt(n.bruto,s),e.tramos),u=i-r-c,p=i/n.nPagas,d=r/n.nPagas,l=c/n.nPagas,f=p-d-l,v=n.grupoNomina?e.nominas.filter(g=>g.grupoNomina===n.grupoNomina&&g._id!==o):[],b=v.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(v.map(g=>g.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",S=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(P(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(P(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(P(n.bruto))}</span>
      ${S}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(P(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(P(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(P(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(P(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(P(f))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(P(f))}/paga`:`ingreso ${m(P(p))} − SS ${m(P(d))} − IRPF ${m(P(l))}`}${s>0?" + recargas flex":""}</span>
    </div>${b}`}function pi(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=li(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=ui(t,a,e,o))},i=()=>{var c,u;const r=(p,d)=>{const l=t.querySelector(p);l&&(l.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),G(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),G(t,'[data-reparto-modo="consumo"]',()=>zt(t,"consumo")),G(t,'[data-reparto-modo="pago"]',()=>zt(t,"pago")),T(t,"[data-flex-anadir]",()=>{var u,p,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),T(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const go=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function mi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??wt;function r(l,f){const v=o(),b=n();return!v||!b?null:(b.innerHTML=`<div class="modal-title">${m(l)}</div>${f}`,v.classList.remove("hidden"),T(b,"[data-cerrar]",s),b)}function c(){a=null;const l=[...t.store.get("tramosIRPFHistorico")].sort((b,S)=>b.año-S.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(go(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${l.map(b=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(go(b.tramos))}</span>
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
      </div>`);v&&(T(v,"[data-editar-tabla]",b=>{const S=b.getAttribute("data-editar-tabla");d(S==="default"?"default":Number(S))}),T(v,"[data-borrar-tabla]",b=>{const S=Number(b.getAttribute("data-borrar-tabla"));at(`¿Eliminar la tabla del ejercicio ${S}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(g=>g.año!==S)),q(`Tabla ${S} eliminada`),t.onDatosCambiados(),c())}),T(v,"[data-anadir-anyo]",()=>{var g;const b=parseInt(((g=v.querySelector("#irpf-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return q("Año inválido","err");const S=t.store.get("tramosIRPFHistorico");if(S.some(h=>h.año===b))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...S,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function u(){return e.map(([l,f],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${v}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function p(l){e=[...l.querySelectorAll("[data-tr-min]")].map((v,b)=>{const S=l.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(v.value)||0,parseFloat((S==null?void 0:S.value)??"")||0]})}function d(l){var h;a=l;const f=t.store.get("tramosIRPFHistorico");e=(l==="default"?i():((h=f.find(w=>w.año===l))==null?void 0:h.tramos)??i()).map(w=>[...w]);const b=l==="default"?"tabla por defecto":`ejercicio ${l}`,S=r(`Tramos IRPF — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!S)return;const g=()=>{const w=S.querySelector("#irpf-tramos-rows");w&&(w.innerHTML=u())};T(S,"[data-volver]",c),T(S,"[data-tr-anadir]",()=>{p(S),e.push([0,0]),g()}),T(S,"[data-tr-borrar]",w=>{p(S),e.splice(Number(w.getAttribute("data-tr-borrar")),1),g()}),T(S,"[data-tr-guardar]",()=>{p(S);const w=[...e].sort((C,$)=>C[0]-$[0]);if(w.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:w}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(C=>C.año===a?{...C,tramos:w}:C)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const vo=1500,At=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,fi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,gi=t=>(t.modeloFondo||"cuenta")==="pension";function vi(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>bi(n,a,e,o)).join("")}</div>`}function bi(t,a,e,o){const n=Ie(t);if(!n)return"";const s=Ce(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,p)=>u+p.cantidad,0),c=Math.min(r,vo)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(P(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(P(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${m(P(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(P(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(P(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>vo?"neg":""}">${m(P(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(P(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(n.proxDesbloqueo)}</div>`:""}
  </div>`}function hi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(P(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function yi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${At("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${At("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${At("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${At("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${At("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${fi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${At("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${At("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    </div>`}function $i(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=hi(a))};G(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function xi(t,a,e,o){var S;const n=g=>{var h;return((h=t.querySelector(g))==null?void 0:h.value)??""},s=(g,h=0)=>{const w=parseFloat(n(g));return Number.isFinite(w)?w:h},i=g=>{var h;return!!((h=t.querySelector(g))!=null&&h.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),u=n("#pen-grupo"),p={nombre:r,grupoNomina:u,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],l=[...(e==null?void 0:e.aportaciones)??[]],v=((S=[...d].sort((g,h)=>h.fecha.localeCompare(g.fecha))[0])==null?void 0:S.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(v===null||Math.abs(c-v)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(v??0)&&l.push({_id:`${b}a`,fecha:o,cantidad:c-(v??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),l.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:d,aportaciones:l}}}const wi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Ii(t){const a=t.hoy??W,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function n(h){const w=h.filter($=>$.activo);if(w.length<2)return"";const C=($,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${$===null?"":m($)}"
               style="${o===$?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(y)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${C(null,"Todas")}
      ${w.map($=>C($._id,$.nombre)).join("")}
    </div>`}function s(){const h=t.store.get("config");return Vt(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??wt)(Number(a().slice(0,4)))}function i(h,w,C){const $=oi(h,w,C),y=!!w&&h.irpfModo!=="manual",A=Re(h.repartoConsumo,h.repartoPago,t.store.get("personas")),x=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",$.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(P($.flexAnual))}/año</span>`:"",Math.abs($.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${$.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${x}</div>
      </div>
      <div class="num">${m(P($.brutoAnual))}
        ${$.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(P($.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(P($.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${$.nPagas} pagas</div>
      <div class="text-sm ${y?"neg":""}">${h.irpfModo==="manual"?`${m(h.irpfPct??0)}% (manual)`:`${$.irpfPct.toFixed(1)}% (auto)`}${y?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var w;return((w=t.store.get("accounts").find(C=>C._id===(h||"default")))==null?void 0:w.nombre)??(h||"default")};function c(h,w,C){const $=w.reduce((x,M)=>x+(M.bruto||0),0),y=ti(w,C),A=$>0?y/$*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(P($))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(P(y))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${w.map(x=>i(x,w,C)).join("")}
      </div>
    </div>`}function u(h){const w=s(),C=t.store.get("personas"),$=se(C),y=[...t.store.get("nominas")].sort((_,F)=>(F.bruto||0)-(_.bruto||0)),A=o?y.filter(_=>xe(_.repartoConsumo,_.repartoPago,$).has(o)):y,{grupos:x,sueltas:M}=ni(A),I=t.store.get("accounts").filter(gi),E=y.filter(_=>_.activo!==!1);h.innerHTML=`
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
      ${[...x.entries()].map(([_,F])=>c(_,F,w)).join("")}
      ${M.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${M.map(_=>i(_,null,w)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${vi(I,E,w,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),l=()=>{var h;return(h=p())==null?void 0:h.classList.add("hidden")};function f(h,w){const C=p(),$=d();return!C||!$?null:($.innerHTML=`<div class="modal-title">${m(h)}</div>${w}`,C.classList.remove("hidden"),T($,"[data-cancelar]",l),$)}function v(h,w){const C=h?t.store.get("nominas").find(x=>x._id===h)??null:null,$=[...(C==null?void 0:C.retribucionFlexible)??[]].map(x=>({...x})),y={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},A=f(h?"Editar nómina":"Nueva nómina",di(C,y));A&&(pi(A,$,y,h??""),T(A,"[data-guardar-nomina]",x=>{const M=fo(A,$);if(!M.nombre||M.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const I=x.getAttribute("data-guardar-nomina")||"",E={...M,activo:!0,tags:["nomina"]};I?(t.store.updateItem("nominas",I,E),q("Nómina actualizada")):(t.store.addItem("nominas",E),q("Nómina creada")),e(),l(),w()}))}function b(h,w){const C=h?t.store.get("accounts").find(A=>A._id===h)??null:null,$=[...(C==null?void 0:C.planAportaciones)??[]].map(A=>({...A})),y=f(h?"Editar plan de pensiones":"Nuevo plan de pensiones",yi(C,{nominas:t.store.get("nominas"),hoy:a()}));y&&($i(y,$,a()),T(y,"[data-guardar-pension]",A=>{const{datos:x,error:M}=xi(y,$,C,a());if(M)return q(M,"err");const I=A.getAttribute("data-guardar-pension")||"";I?(t.store.updateItem("accounts",I,x),q("Plan actualizado")):(t.store.addItem("accounts",x),q("Plan creado")),e(),l(),w()}))}function S(h,w,C){T(h,"[data-persona-tab]",$=>{o=$.getAttribute("data-persona-tab")||null,w()}),T(h,"[data-nueva-nomina]",()=>v(null,w)),T(h,"[data-editar-nom]",$=>v($.getAttribute("data-editar-nom"),w)),T(h,"[data-borrar-nom]",$=>{at("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",$.getAttribute("data-borrar-nom")),q("Eliminada"),e(),w())}),G(h,"[data-activo-nom]",$=>{const y=$;t.store.updateItem("nominas",y.getAttribute("data-activo-nom"),{activo:y.checked}),e(),w()}),T(h,"[data-tramos]",()=>C.abrir()),T(h,"[data-nueva-pension]",()=>b(null,w)),T(h,"[data-editar-pension]",$=>b($.getAttribute("data-editar-pension"),w)),T(h,"[data-borrar-pension]",$=>{at("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",$.getAttribute("data-borrar-pension")),q("Plan eliminado"),e(),w())})}let g=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:wi,mount(h){const w=()=>u(h);g??(g=mi({store:t.store,onDatosCambiados:()=>{e(),w()},año:()=>Number(a().slice(0,4))})),u(h),h.dataset.wired!=="1"&&(S(h,w,g),h.dataset.wired="1")}}}const Ci="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Si="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",bo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Ai={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Mi(t,a){const e=t.filter(c=>c.activo&&it(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const u=ie(c,a);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(P(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(P(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${m(P(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(P(i))}</div><div class="stat-sub">Neto: ${m(P(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Ei(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(k(o).getTime()-k(e).getTime())/(30.44*864e5)),s=kt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(ft(a.inflacion,e,o)-1),u=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(P(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(P(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(P(i))}</span>
    </div>${r}
  </div>`}function _i(t,a){const e=bo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(f=>(f.retribucionFlexible??[]).filter(v=>v.cuenta===t._id).map(v=>({nomina:f,importe:v.importe}))),s=n.reduce((f,v)=>f+v.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,u=t.grupoNomina?a.nominas.filter(f=>(f.grupoNomina||"")===t.grupoNomina&&f.activo!==!1):n.slice(0,1).map(f=>f.nomina),p=ai(u,a.tramosIRPF),d=c*p/100,l=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(P(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(P(i))}/año${r?` ⚠ excede límite ${m(P(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(P(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(l)}">≈ ${m(P(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${n.length>0?n.map(f=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(f.nomina.nombre)}: ${m(P(f.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Pi(t){const a=Ie(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(P(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(P(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(P(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(P(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function Fi(t,a){const e=ie(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=k(o.dashboardStart),i=k(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+u,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,l=Math.max(0,p-d),f=we(l,a.tramosGanancias),v=l>0?(f/l*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",S=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",g=(A,x,M)=>A.map(I=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${x} ${m(I.contraparte)}: ${m(I.concepto)}</span>
          <span class="num ${M}">${m(P(I.total))} · ${I.ocurrencias} mov.</span>
        </div>`).join(""),w=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${g(n.entradas,"↓","pos")}
         ${g(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(P(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(P(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(P(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',C=a.invModo(t._id),$=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=C==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(P(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(P(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(P(e.neto))}</div><div class="stat-sub">${m(S)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(P(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(P(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(P(p-f))}</div><div class="stat-sub">${m(v)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${$(C==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${$(C==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${w}
    </div>`}function Di(t,a){const e=[...t.historicoSaldos||[]].sort((c,u)=>u.fecha.localeCompare(c.fecha)),o=e[0],n=gt(t),s=it(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((bo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Si}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Ci}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(P(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(P(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ei(t,a)}
    ${s==="beneficio"?_i(t,a):""}
    ${s==="pension"?Pi(t):""}
    ${s==="inversion"?Fi(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const Ti=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function zi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(P(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ji(t,a){const e=t?it(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${Z("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${te("ac-modelo","Tipo",Ti,e)}
    </div>
    <div class="grid-2 mt-8">
      ${Z("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${Z("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Z("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Z("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
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
            ${te("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function qi(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=zi(a))};G(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const u=t.querySelector(r);u&&(u.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Ni(t,a,e,o,n){const s=v=>{var b;return((b=t.querySelector(v))==null?void 0:b.value)??""},i=(v,b=0)=>{const S=parseFloat(s(v));return Number.isFinite(S)?S:b},r=v=>{var b;return!!((b=t.querySelector(v))!=null&&b.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",p=u==="beneficio",d=i("#ac-saldo"),l={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:u,planAportaciones:a,tipoBeneficio:p?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:l};if(!(o===null||Math.abs(d-o)>.005))return{datos:l};if(u==="inversion"&&d>(o??0)){const v=Date.now().toString(36);l.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${v}a`,fecha:e?n:l.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:l,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function ke(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:K(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function Ri(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(P(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':m(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${m(a)}|${m(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${m(a)}|${m(r._id)}">✕</button>
      </div>`).join(""),i=e.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${m(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${m(a)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos">↻ Recalcular semanal</button>
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
    </div>`}const ho=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Li(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Bt;function r(l,f){const v=o(),b=n();return!v||!b?null:(b.innerHTML=`<div class="modal-title">${m(l)}</div>${f}`,v.classList.remove("hidden"),T(b,"[data-cerrar]",s),b)}function c(){a=null;const l=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,S)=>b.año-S.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(ho(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${l.map(b=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(ho(b.tramos))}</span>
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
      </div>`);v&&(T(v,"[data-editar-tg]",b=>{const S=b.getAttribute("data-editar-tg");d(S==="default"?"default":Number(S))}),T(v,"[data-borrar-tg]",b=>{const S=Number(b.getAttribute("data-borrar-tg"));at(`¿Eliminar la tabla del ejercicio ${S}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(g=>g.año!==S)),q(`Tabla ${S} eliminada`),t.onDatosCambiados(),c())}),T(v,"[data-anadir-anyo-tg]",()=>{var g;const b=parseInt(((g=v.querySelector("#tg-new-year"))==null?void 0:g.value)??"",10);if(!b||b<2e3||b>2100)return q("Año inválido","err");const S=t.store.get("tramosGananciasCapitalHistorico");if(S.some(h=>h.año===b))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...S,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function u(){return e.map(([l,f],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${v}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function p(l){e=[...l.querySelectorAll("[data-tg-min]")].map((f,v)=>{const b=l.querySelector(`[data-tg-pct="${v}"]`);return[parseFloat(f.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(l){var g;a=l;const f=t.store.get("tramosGananciasCapitalHistorico");e=(l==="default"?i():((g=f.find(h=>h.año===l))==null?void 0:g.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const S=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=u())};T(b,"[data-volver-tg]",c),T(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),S()}),T(b,"[data-tg-borrar]",h=>{p(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),S()}),T(b,"[data-tg-guardar]",()=>{p(b);const h=[...e].sort((w,C)=>w[0]-C[0]);if(h.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(w=>w.año===a?{...w,tramos:h}:w)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Oi=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function ki(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Oi.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Bi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Hi(t,a){const e=k(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Gi(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Be(t,a){const{inicio:e,fin:o}=Gi(a);return Ht([t],{start:e,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function Vi(t){function a(n,s={}){var C;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=W()}=s,u=t.transacciones({estimacionId:n._id}),d=u.length===0&&(((C=n.tags)==null?void 0:C.length)??0)>0?t.transacciones({tags:n.tags}):u,l=new Map;for(const $ of d){const y=$.fecha.slice(0,7);l.set(y,(l.get(y)??0)+Math.abs($.importeCts)/100)}const f=[];for(const $ of Hi(c,i)){const y=l.get($);if(y===void 0)continue;const A=Y(Be(n,$));f.push({mes:$,estimado:A,real:Y(y),desviacion:Y(y-A),precision:Bi(A,y)})}const v=Y(f.reduce(($,y)=>$+y.estimado,0)),b=Y(f.reduce(($,y)=>$+y.real,0)),S=f.reduce(($,y)=>$+Math.abs(y.estimado),0),g=f.length===0?null:S>0?f.reduce(($,y)=>$+y.precision*Math.abs(y.estimado),0)/S:f.reduce(($,y)=>$+y.precision,0)/f.length,h=f.slice(-r),w=h.length>0?Y(h.reduce(($,y)=>$+y.real,0)/h.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:v,realTotal:b,desviacionTotal:Y(b-v),precision:g,mediaRealReciente:w,infraestimada:b>v}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:Y(r.estimado),realTotal:Y(r.real),desviacionTotal:Y(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Ui(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Yi(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function Wi(t,a,e,o){const n=a.filter(s=>s.tipo==="gasto"&&s.activo!==!1);return Yi(e,o).map(s=>{const i=Y(n.reduce((c,u)=>c+Be(u,s),0)),r=Y(t.transacciones({desde:`${s}-01`,hasta:Ui(s),tipo:"gasto"}).reduce((c,u)=>c+Math.abs(u.importeCts)/100,0));return{mes:s,estimado:i,real:r}})}const He=640,Rt=200,X={top:14,right:16,bottom:26,left:54};function Ki(t){return Zt(t).slice(0,3)}function Ji(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=He-X.left-X.right,e=Rt-X.top-X.bottom,o=Math.max(1,...t.flatMap(p=>[p.estimado,p.real])),n=p=>X.left+(t.length===1?a/2:p/(t.length-1)*a),s=p=>X.top+e-Math.max(0,p)/o*e,i=t.map((p,d)=>`${n(d)},${s(p.estimado)}`).join(" "),r=t.map((p,d)=>`${n(d)},${s(p.real)}`).join(" "),c=t.map((p,d)=>`<circle cx="${n(d).toFixed(1)}" cy="${s(p.real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(Zt(p.mes))}: ${m(P(p.real))}</title></circle>`).join(""),u=t.map((p,d)=>`<text x="${n(d).toFixed(1)}" y="${Rt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(Ki(p.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${He} ${Rt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Gasto real frente a estimado por mes">
      <line x1="${X.left}" y1="${X.top}" x2="${X.left}" y2="${Rt-X.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${X.left}" y1="${Rt-X.bottom}" x2="${He-X.right}" y2="${Rt-X.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${X.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(P(o))}</text>
      <polyline points="${i}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${r}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${c}
      ${u}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const yo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function Qi(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:$o(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ae($o(t,5)).desde,intervaloHasta:ae(t).hasta}}function ae(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function $o(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Ge(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:ae(e).desde,hasta:ae(o).hasta}}function Xi(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function Ve(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Zi(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function tr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(P(K(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(P(K(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(P(K(t.diferenciaCts)))}</strong></span>
    </div>`}function er(t,a){const{ledger:e}=t,o=(t.hoy??W)(),n=t.accounts().filter(I=>I.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?Ge(a.periodoDesde,a.periodoHasta):i?Xi(a.intervaloDesde,a.intervaloHasta):ae(a.mes),u={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(u),d=t.estimaciones().filter(I=>I.tipo!=="transferencia"),l=[...d.map(I=>({_id:I._id,etiqueta:`${m(I.concepto)} (${m(P(I.cuantia))})`})),...t.loans().filter(I=>I.activo).map(I=>({_id:I._id,etiqueta:`Préstamo: ${m(I.nombre)}`})),...t.nominas().filter(I=>I.activo).map(I=>({_id:I._id,etiqueta:`Nómina: ${m(I.nombre)}`}))],f=p.filter(I=>I.tipo!=="transferencia"&&I.importeCts<0).reduce((I,E)=>I+E.importeCts,0),v=p.filter(I=>I.tipo!=="transferencia"&&I.importeCts>0).reduce((I,E)=>I+E.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),S=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),g=n.map(I=>`<option value="${m(I._id)}"${I._id===a.cuentaId?" selected":""}>${m(I.nombre)}</option>`).join(""),h=I=>'<option value="">— sin asignar —</option>'+l.map(E=>`<option value="${m(E._id)}"${E._id===I?" selected":""}>${E.etiqueta}</option>`).join(""),w=I=>Object.keys(yo).map(E=>`<option value="${E}"${E===I?" selected":""}>${yo[E]}</option>`).join(""),C=p.map(I=>{var E;return`
      <tr data-tx="${m(I._id)}" style="border-bottom:1px solid var(--border)${I.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(I.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(I.concepto)}</td>
        <td style="padding:7px 8px">${je(I.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(((E=t.accounts().find(_=>_._id===I.cuentaId))==null?void 0:E.nombre)??I.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(I._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${w(I.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(I._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(I.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${mt(K(I.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(I._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(I._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),$=i?Wi(e,d,r,c):[],y=s?e.transacciones({desde:r,hasta:c}):[],x=(s?Ve(p):[]).map(I=>{const E=a.detalleAbierto.has(I.concepto),_=E?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${je(I.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(I.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(I.concepto)}">Asignar</button>
               </div>
               ${tr(Zi(I,y))}
             </td>
           </tr>`:"",F=E?I.movimientos.map(z=>{var D;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(z.fecha)}</span> · ${m(((D=t.accounts().find(j=>j._id===z.cuentaId))==null?void 0:D.nombre)??z.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(z._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(z.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${mt(K(z.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(I.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(I.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${E?"▾":"▸"}</button>
          <span style="font-size:13px">${m(I.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${I.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(I.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${I.movimientos.length} movimientos del grupo de golpe">${h(I.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${mt(K(I.total))}</td>
        <td></td>
      </tr>${_}${F}`}).join(""),M=S.slice().reverse().slice(0,8).map(I=>{var E;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(I.fecha)}</span>
        <span style="color:var(--text3)">${m(((E=t.accounts().find(_=>_._id===I.cuentaId))==null?void 0:E.nombre)??I.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(P(K(I.saldoCts)))}</span>
        ${I.nota?`<span style="color:var(--text3)">${m(I.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(I._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span>Gastos: ${mt(K(f))}</span>
          <span>Ingresos: ${mt(K(v))}</span>
          <span>Neto: ${mt(K(v+f))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(P(b))}</strong></span>
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
                     ${x||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
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
                      <div class="card-title mb-8">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                      ${Ji($)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(I=>`<option value="${m(I)}"></option>`).join("")}</datalist>
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
    </div>`}function ar(t,a,e,o){const{ledger:n}=a;G(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),G(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()}),T(t,"[data-acc-vista]",i=>{e.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),G(t,"#acc-periodo-desde",i=>{e.periodoDesde=i.value||e.periodoDesde,o()}),G(t,"#acc-periodo-hasta",i=>{e.periodoHasta=i.value||e.periodoHasta,o()}),G(t,"#acc-intervalo-desde",i=>{e.intervaloDesde=i.value||e.intervaloDesde,o()}),G(t,"#acc-intervalo-hasta",i=>{e.intervaloHasta=i.value||e.intervaloHasta,o()}),T(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");e.detalleAbierto.has(r)?e.detalleAbierto.delete(r):e.detalleAbierto.add(r),o()}),G(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:u,hasta:p}=Ge(e.periodoDesde,e.periodoHasta),d=n.transacciones({cuentaId:e.cuentaId||void 0,desde:u,hasta:p,texto:e.filtroTexto||void 0}),l=Ve(d).find(f=>f.concepto===r);if(l){for(const f of l.movimientos)n.asignarEstimacion(f._id,c);q(`Estimación asignada a ${l.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),T(t,"[data-grp-tags-asignar]",i=>{var v;const r=i.getAttribute("data-grp-tags-asignar"),c=((v=i.closest("tr"))==null?void 0:v.querySelector("[data-grp-tags]"))??null,u=((c==null?void 0:c.value)??"").split(",").map(b=>b.trim().toLowerCase()).filter(Boolean);if(u.length===0)return q("Escribe al menos una etiqueta","err");const{desde:p,hasta:d}=Ge(e.periodoDesde,e.periodoHasta),l=n.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:d,texto:e.filtroTexto||void 0}),f=Ve(l).find(b=>b.concepto===r);if(f){for(const b of f.movimientos)n.actualizar(b._id,{tags:[...new Set([...b.tags,...u])]});q(`Etiquetas añadidas a ${f.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),T(t,"#nt-guardar",()=>{const i=rt(t,"#nt-concepto").trim(),r=so(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const c=rt(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:rt(t,"#nt-fecha")||(a.hoy??W)(),cuentaId:rt(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:rt(t,"#nt-tipo"),estimacionId:rt(t,"#nt-estimacion")||null}),q("Movimiento registrado"),a.onDatosCambiados(),o()}),T(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;at("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),a.onDatosCambiados(),o())}),T(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(d=>d._id===r);if(!c)return;const u=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(K(c.importeCts))));if(u===null)return;const p=parseFloat(u.replace(",","."));if(!Number.isFinite(p)||p<=0)return q("Importe no válido","err");n.actualizar(r,{importe:p}),q("Movimiento actualizado"),a.onDatosCambiados(),o()}),G(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),a.onDatosCambiados()}),G(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),q("Tipo actualizado"),a.onDatosCambiados(),o()}),T(t,"#pc-guardar",()=>{if(rt(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=so(t,"#pc-saldo");n.registrarPuntoControl(rt(t,"#pc-cuenta"),rt(t,"#pc-fecha")||(a.hoy??W)(),r,rt(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),a.onDatosCambiados(),o()}),T(t,"[data-pc-borrar]",i=>{at("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ue(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=Y(t.mediaRealReciente),i=Y(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:Y(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function or(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??W(),u=t.get("expenses"),p=u.find(v=>v._id===s);if(!p)throw new Error(`La estimación ${s} no existe`);const d={...p,fechaFin:c},l={...p,_id:a(),cuantia:Y(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},f=u.map(v=>v._id===s?d:v);return f.push(l),t.set("expenses",f),{estimacionCerrada:d,estimacionNueva:l}}function o(s,i={}){const r=[],c=[];for(const u of s)try{r.push(e(u.estimacionId,u.cuantiaSugerida,i))}catch(p){c.push({estimacionId:u.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(s);if(!c)return[];const u=[];let p=c;const d=new Set;for(;p!=null&&p.ajustadaDesdeId&&!d.has(p._id);){d.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;u.unshift(b),p=b}const l=[];let f=c;const v=new Set([c._id]);for(;;){const b=i.find(S=>S.ajustadaDesdeId===f._id&&!v.has(S._id));if(!b)break;v.add(b._id),l.push(b),f=b}return[...u,c,...l]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Ye(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const n=e.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ue(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function nr(t){const a=Ye(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:c,estimacion:u,sugerencia:p})=>{const d=c.meses.slice(-6).map(l=>`${Zt(l.mes)}: ${P(l.estimado)} → ${P(l.real)} (${l.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${m(u.concepto)}</div>
          <div style="margin-top:3px">${je(c.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${m(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(P(c.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(P(c.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${mt(c.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${no(c.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${p?`<button class="btn-secondary" data-sugerir="${m(c.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${m(p.motivo)}">Sugerir ajuste → ${m(P(p.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${mt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${no(c.precision)}</td>
      </tr>`).join(""),r=(c,u="left")=>`<th style="padding:7px 8px;text-align:${u};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
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
    </div>`}function sr(t,a,e){T(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Ye(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${P(i.cuantiaActual)}
Nueva estimación: ${P(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;at(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),q(`Estimación ajustada a ${P(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),T(t,"#ajustar-todas",()=>{const o=Ye(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${P(r.cuantiaActual)} → ${P(r.cuantiaSugerida)}`).join(`
`);if(!at(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const ir=[";",",","	","|"],rr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function pe(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function me(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function cr(t){let a=";",e=-1;for(const o of ir){const n=t.slice(0,20).map(c=>me(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function oe(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const p=s===","?o:n;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(c);return Number.isFinite(u)?e?-u:u:null}function We(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return xo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),xo(o,Number(e[2]),Number(e[1]))}return null}function xo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function wo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>We(e)!==null).length/a.length}function Io(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>oe(e)!==null).length/a.length}function lr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=pe(t[i]);if(r&&rr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&pe(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=wo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||pe(t[r]).includes("saldo"))continue;const c=Io(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(Io(c)>.5||wo(c)>.5)continue;const u=c.reduce((p,d)=>p+d.length,0)/Math.max(1,c.length);u>i&&(i=u,s=r)}s>=0&&(e.concepto=s)}return e}function dr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=cr(a),o=a.map(p=>me(p,e).length),n=Math.max(...o);let s=o.findIndex(p=>p===n);s<0&&(s=0);const i=me(a[s],e);let r=a.slice(s+1).map(p=>me(p,e));const c=We(i[0]??"")!==null||i.some(p=>oe(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const u=lr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function Co(t,a,e){return`${t}|${a}|${pe(e).replace(/\s+/g," ")}`}function ur(t,a,e=[]){const o=new Set(e.map(s=>Co(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?We(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let u=null;if(a.importe>=0)u=oe(s[a.importe]??""),u===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const l=a.debe>=0?oe(s[a.debe]??""):null,f=a.haber>=0?oe(s[a.haber]??""):null;l===null&&f===null?r.push("sin importe en Debe ni en Haber"):l!==null&&l!==0?u=-Math.abs(l):f!==null&&f!==0?u=Math.abs(f):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const p=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&u!==null){const l=Co(c,u,p);d=o.has(l)||n.has(l),n.add(l)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:u,errores:r,duplicada:d}})}function pr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function fe(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const mr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Ke(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=ur(a.analisis,a.mapeo,e)}function fr(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?vr(a,a.analisis,a.mapeo):gr()}
    </div>`}function gr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function vr(t,a,e){const o=pr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,u)=>`<option value="${u}"${u===r?" selected":""}>${m(c||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${mr.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${mt(K(o.sumaCts))}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,u=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(P(K(r.importeCts)))}</td>
                <td style="font-size:11px;color:${p}">${m(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function br(t,a,e,o){T(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return q("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var d;return((d=a.accounts().find(l=>l._id===p))==null?void 0:d.nombre)??p},r=s.reduce((p,d)=>p+d.eliminados,0),c=s.reduce((p,d)=>p+d.semanales,0),u=s.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");q(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${u}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),T(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,fe(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),T(t,"[data-imp-cerrar]",()=>{Object.assign(e,fe()),o()}),G(t,"#imp-cuenta",s=>{e.cuentaId=s.value,Ke(a,e),o()}),G(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),G(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),Ke(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&hr(s).then(r=>{const c=dr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},Ke(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),T(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(u=>u.errores.length===0&&(e.incluirDuplicadas||!u.duplicada));if(s.length===0)return;for(const u of s)a.ledger.registrar({fecha:u.fecha,cuentaId:e.cuentaId,importe:Math.abs(K(u.importeCts)),tipo:u.importeCts<0?"gasto":"ingreso",concepto:u.concepto,origen:"importado"});const i=s.map(u=>u.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,fe()),a.onDatosCambiados(),o()})}function hr(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function yr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function $r(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function xr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function wr(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const u=(c.tags??[]).filter(p=>s.tags.includes(p)).length;u!==0&&(u>r||u===r&&i&&c._id<i._id)&&(i=c,r=u)}i&&o.get(i._id).push(s)}return o}function Ir(t,a,e,o={}){const{desde:n,hasta:s}=yr(e),i=t.transacciones({desde:n,hasta:s}),r=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts<0),c=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts>0),u=a.filter(w=>w.tipo==="gasto"&&w.activo!==!1),p=new Map((o.analisis??[]).map(w=>[w.estimacionId,w])),d=new Set(u.filter(w=>t.transacciones({estimacionId:w._id}).length>0).map(w=>w._id)),l=wr(r,u,w=>d.has(w)),f=new Set,v=u.map(w=>{const C=l.get(w._id)??[];for(const x of C)f.add(x._id);const $=Y(C.reduce((x,M)=>x+Math.abs(M.importeCts)/100,0)),y=Y(Be(w,e)),A=p.get(w._id);return{estimacionId:w._id,concepto:w.concepto,tags:w.tags??[],estimado:y,real:$,desviacion:Y($-y),sinMovimiento:C.length===0,sugerencia:A?Ue(A,w.cuantia,{hoy:o.hoy}):null}}),b=new Map;for(const w of r){if(f.has(w._id))continue;const C=xr(w.concepto),$=b.get(C)??{concepto:w.concepto,total:0,movimientos:0};$.total=Y($.total+Math.abs(w.importeCts)/100),$.movimientos+=1,b.set(C,$)}const S=[...b.values()].sort((w,C)=>C.total-w.total),g=Y(v.reduce((w,C)=>w+C.estimado,0)),h=Y(r.reduce((w,C)=>w+Math.abs(C.importeCts)/100,0));return{mes:e,estimado:g,real:h,desviacion:Y(h-g),ingresosReales:Y(c.reduce((w,C)=>w+C.importeCts/100,0)),filas:v.sort((w,C)=>Math.abs(C.desviacion)-Math.abs(w.desviacion)),sinEstimacion:S,totalSinEstimacion:Y(S.reduce((w,C)=>w+C.total,0)),vacio:i.length===0}}function So(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function Cr(){return{mes:""}}function Je(t,a){if(a.mes)return a.mes;const e=So(t.ledger),o=$r((t.hoy??W)());return e.includes(o)?o:e[0]??o}function Qe(t,a){const e=(t.hoy??W)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:e});return Ir(t.ledger,o,a,{analisis:n,hoy:e})}function Sr(t,a){const e=Je(t,a),o=So(t.ledger);o.includes(e)||o.unshift(e);const n=Qe(t,e),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(c=>`<option value="${m(c)}"${c===e?" selected":""}>${m(Zt(c))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${m(Zt(e))}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué se desvió el mes respecto a lo que habías previsto.
        </div>
      </div>`;const i=c=>c>0?"+":"",r=n.desviacion>0?"var(--red)":n.desviacion<0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Cierre de mes</div>
        ${s}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(P(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${m(P(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${m(P(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(P(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Ar(n)}
      ${Mr(n)}
    </div>`}function Ar(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const e=a.filter(o=>o.sugerencia);return`
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
          ${a.map(o=>{const n=o.desviacion>0?"var(--red)":o.desviacion<0?"var(--accent)":"var(--text2)",s=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${m(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(P(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar la estimación de ${m(P(s.cuantiaActual))} a ${m(P(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${m(P(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function Mr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
          ${t.sinEstimacion.slice(0,10).map(a=>`<tr>
                <td style="font-size:12px">${m(a.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${a.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${m(P(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Er(t,a,e,o){G(t,"#cie-mes",n=>{e.mes=n.value,o()}),T(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Qe(a,Je(a,e)).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??W)()}),q(`«${r.concepto}» ajustada a ${P(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),T(t,"[data-cie-ajustar-todas]",()=>{const s=Qe(a,Je(a,e)).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??W)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const _r="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Pr(t){const a=t.hoy??W,e=()=>{var D;return(D=t.onDatosCambiados)==null?void 0:D.call(t)},o=new Map;let n="cuentas";const s=Qi(a().slice(0,7)),i=fe(),r=Cr(),c=()=>t.store.get("expenses"),u=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:u,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:u,onDatosCambiados:e},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},f={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},v=()=>t.store.get("config"),b=D=>{var j;return((j=t.store.get("accounts").find(L=>L._id===D))==null?void 0:j.nombre)??D},S=()=>Vt(t.store.get("tramosIRPFHistorico"),v().tramos_irpf??wt)(Number(a().slice(0,4))),g=()=>Vt(t.store.get("tramosGananciasCapitalHistorico"),v().tramosGananciasCapital??Bt),h=()=>g()(Number(a().slice(0,4)));function w(){const D=v(),j=t.store.get("accounts"),L=Sa({loans:[],expenses:t.store.get("expenses").filter(O=>O.tipo==="transferencia"),accounts:j,config:{dashboardStart:D.dashboardStart,dashboardEnd:D.dashboardEnd,fechaReferencia:D.dashboardStart},nominas:[],resolverTramosGanancias:g()}),B=new Map,N=O=>{let H=B.get(O);return H||(H={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},B.set(O,H)),H},R=(O,H)=>{const Q=`${H.sourceId}`,tt=O.find(aa=>aa.concepto===Q),ot=tt??{concepto:Q,contraparte:"",total:0,ocurrencias:0};ot.total+=Math.abs(H.cuantia),ot.ocurrencias+=1,tt||O.push(ot)};for(const O of L){if(!O.cuenta)continue;const H=N(O.cuenta);O.sourceType==="transfer-in"||O.sourceType==="traspaso-in"?(H.totalAportaciones+=Math.abs(O.cuantia),R(H.entradas,O)):O.sourceType==="transfer-out"||O.sourceType==="traspaso-out"?(H.totalReembolsos+=Math.abs(O.cuantia),R(H.salidas,O)):O.sourceType==="investment-tax"&&(H.retencion+=Math.abs(O.cuantia))}const V=t.store.get("expenses");for(const O of B.values())for(const[H,Q]of[[O.entradas,"cuenta"],[O.salidas,"cuentaDestino"]])for(const tt of H){const ot=V.find(aa=>aa._id===tt.concepto);tt.contraparte=b((ot==null?void 0:ot[Q])??"default"),tt.concepto=(ot==null?void 0:ot.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return B}function C(D){const j=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let L;if(n==="cuentas"){const R=t.store.get("accounts").filter(H=>it(H)!=="pension"),V=w(),O={config:v(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:S(),tramosGanancias:h(),flujos:H=>V.get(H)??Ai,invModo:H=>o.get(H)??"proyeccion"};L=`${Mi(R,O.tramosGanancias)}<div class="grid-3">${R.map(H=>Di(H,O)).join("")}</div>`}else n==="movimientos"?L='<div id="acc-tx"></div>':n==="importar"?L='<div id="acc-import"></div>':L='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';D.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${j}
      </div>
      ${ki(n)}
      ${L}`;const B=()=>C(D);if(n==="movimientos"){const N=D.querySelector("#acc-tx");N.innerHTML=er(p,s),ar(N,p,s,B)}else if(n==="importar"){const N=D.querySelector("#acc-import");N.innerHTML=fr(d,i),br(N,d,i,B)}else if(n==="cierre"){const N=D.querySelector("#acc-cierre"),R=D.querySelector("#acc-precision");N.innerHTML=Sr(l,r),R.innerHTML=nr(f),Er(N,l,r,B),sr(R,f,B)}}const $=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),A=()=>{var D;return(D=$())==null?void 0:D.classList.add("hidden")};function x(D,j){const L=$(),B=y();return!L||!B?null:(B.innerHTML=D?`<div class="modal-title">${m(D)}</div>${j}`:j,L.classList.remove("hidden"),T(B,"[data-cancelar]",A),B)}function M(D,j){const L=D?t.store.get("accounts").find(V=>V._id===D)??null:null,B=[...(L==null?void 0:L.planAportaciones)??[]].map(V=>({...V})),N=L?I(L):null,R=x(D?"Editar cuenta / fondo":"Nueva cuenta / fondo",ji(L,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));R&&(qi(R,B,a()),T(R,"[data-guardar-acc]",V=>{const O=V.getAttribute("data-guardar-acc")||"",{datos:H,punto:Q,error:tt}=Ni(R,B,L,N,a());if(tt)return q(tt,"err");let ot=O;O?t.store.updateItem("accounts",O,H):ot=t.store.addItem("accounts",H)._id,Q&&t.ledger.registrarPuntoControl(ot,Q.fecha,Q.saldo,Q.nota),q(O?"Actualizada":"Cuenta / fondo creado"),e(),A(),j()}))}function I(D){const j=t.ledger.puntosControl(D._id);return j.length>0?ke(j)[0].saldo:D.saldo??null}function E(D,j){const L=t.store.get("accounts").find(R=>R._id===D);if(!L)return;const B=x("Histórico de saldos",Ri(L.nombre,D,ke(t.ledger.puntosControl(D)),L.saldoInicial||0,a()));if(!B)return;const N=()=>{j(),E(D,j)};T(B,"[data-hist-anadir]",()=>{var H,Q,tt;const R=((H=B.querySelector("#hi-fecha"))==null?void 0:H.value)??"",V=parseFloat(((Q=B.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),O=((tt=B.querySelector("#hi-nota"))==null?void 0:tt.value.trim())??"";if(!R||!Number.isFinite(V))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(D,R,V,O||void 0),q("Punto añadido"),e(),N()}),T(B,"[data-hist-borrar]",R=>{const[,V]=(R.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(V),q("Eliminado"),e(),N()}),T(B,"[data-hist-semanal]",R=>{const V=R.getAttribute("data-hist-semanal"),O=t.ledger.generarPuntosSemanales(V);q(O>0?`Histórico con ${O} punto${O!==1?"s":""} semanal${O!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),N()}),T(B,"[data-hist-inicial]",R=>{const[V,O]=(R.getAttribute("data-hist-inicial")||"").split("|"),H=t.ledger.puntosControl(V).find(tt=>tt._id===O);if(!H)return;const Q=ke([H])[0].saldo;t.store.updateItem("accounts",V,{saldoInicial:Q,fechaInicialSaldo:H.fecha}),q(`Punto inicial → ${H.fecha} (${P(Q)})`),e(),N()})}function _(D){const j=t.store.get("accounts").filter(N=>N.activo);if(j.length===0)return q("No hay cuentas activas","err");const L=a(),B=j.map(N=>`• ${N.nombre}: ${P(I(N)??N.saldoInicial??0)}`).join(`
`);if(at(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${L})?

${B}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of j)t.store.updateItem("accounts",N._id,{saldoInicial:I(N)??N.saldoInicial??0,fechaInicialSaldo:L});q("Saldo base actualizado"),e(),D()}}function F(D,j,L){T(D,"[data-cuentas-tab]",B=>{n=B.getAttribute("data-cuentas-tab")||"cuentas",j()}),T(D,"[data-nueva-acc]",()=>M(null,j)),T(D,"[data-editar-acc]",B=>M(B.getAttribute("data-editar-acc"),j)),T(D,"[data-tramos-ganancias]",()=>L.abrir()),T(D,"[data-reset-base]",()=>_(j)),T(D,"[data-hist-acc]",B=>E(B.getAttribute("data-hist-acc"),j)),T(D,"[data-principal-acc]",B=>{const N=B.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(R=>({...R,esCuentaPrincipal:R._id===N}))),q("Cuenta marcada como principal"),e(),j()}),T(D,"[data-borrar-acc]",B=>{const N=B.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!at("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const V=t.store.get("accounts");V.length>0&&!V.some(O=>O.esCuentaPrincipal)&&t.store.set("accounts",V.map((O,H)=>H===0?{...O,esCuentaPrincipal:!0}:O)),q("Cuenta eliminada"),e(),j()}),T(D,"[data-inv-modo]",B=>{const[N,R]=(B.getAttribute("data-inv-modo")||"").split("|");o.set(N,R==="real"?"real":"proyeccion"),j()})}let z=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:_r,mount(D){const j=()=>C(D);z??(z=Li({store:t.store,onDatosCambiados:()=>{e(),j()},año:()=>Number(a().slice(0,4))})),C(D),D.dataset.wired!=="1"&&(F(D,j,z),D.dataset.wired="1")}}}function Ao(t,a,e=!1){const o=Math.abs(st(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function Fr(t){function a(x){return`${x}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(x={}){var I;const M=(I=x.texto)==null?void 0:I.trim().toLowerCase();return t.get("transacciones").filter(E=>!(x.cuentaId&&E.cuentaId!==x.cuentaId||x.desde&&E.fecha<x.desde||x.hasta&&E.fecha>x.hasta||x.tipo&&E.tipo!==x.tipo||x.estimacionId&&E.estimacionId!==x.estimacionId||x.tags&&x.tags.length>0&&!x.tags.some(_=>E.tags.includes(_))||M&&!E.concepto.toLowerCase().includes(M))).sort((E,_)=>E.fecha.localeCompare(_.fecha)||E._id.localeCompare(_._id))}function o(x){const M={_id:a("tx"),fecha:x.fecha,cuentaId:x.cuentaId,importeCts:Ao(x.tipo,x.importe,x.negativo),concepto:x.concepto,tags:x.tags??[],estimacionId:x.estimacionId??null,tipo:x.tipo,origen:x.origen??"manual",...x.nota?{nota:x.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),M]),M}function n(x,M){t.set("transacciones",t.get("transacciones").map(I=>{if(I._id!==x)return I;const{importe:E,..._}=M,F={...I,..._};return E!==void 0&&(F.importeCts=Ao(F.tipo,E,F.importeCts<0)),F}))}function s(x){t.set("transacciones",t.get("transacciones").filter(M=>M._id!==x))}function i(x,M){n(x,{estimacionId:M})}function r(x){return t.get("puntosControl").filter(M=>!x||M.cuentaId===x).sort((M,I)=>M.fecha.localeCompare(I.fecha))}function c(x){return r(x).filter(M=>M.origen!=="derivado")}function u(x,M,I,E){const _={_id:a("pc"),fecha:M,cuentaId:x,saldoCts:st(I),...E?{nota:E}:{}},F=t.get("puntosControl").filter(z=>!(z.cuentaId===x&&z.fecha===M));return t.set("puntosControl",[...F,_].sort((z,D)=>z.fecha.localeCompare(D.fecha))),l(x),_}function p(x){const M=t.get("puntosControl").find(I=>I._id===x);t.set("puntosControl",t.get("puntosControl").filter(I=>I._id!==x)),M&&(M.origen==="derivado"?b(M.cuentaId):l(M.cuentaId))}function d(x,M,I){const E=F=>F.cuentaId===x&&F.origen!=="derivado"&&F.fecha>=M&&F.fecha<=I,_=t.get("puntosControl").filter(E).length;return _===0?0:(t.set("puntosControl",t.get("puntosControl").filter(F=>!E(F))),b(x),_)}function l(x){var B,N;const M=c(x),I=t.get("transacciones").filter(R=>R.cuentaId===x).sort((R,V)=>R.fecha.localeCompare(V.fecha)),E=(B=I[0])==null?void 0:B.fecha,_=(N=I[I.length-1])==null?void 0:N.fecha,F=t.get("puntosControl").filter(R=>!(R.cuentaId===x&&R.origen==="derivado"));if(!E)return t.set("puntosControl",F),b(x),0;const z=[];for(let R=Ot(E);R<=_;R=Ot(sa(R,1)))z.push(R);z[z.length-1]!==_&&z.push(_);const D=new Set(M.map(R=>Ot(R.fecha))),j=R=>{const V=M.filter(O=>O.fecha<=R).pop();return I.filter(O=>O.fecha<=R&&(!V||O.fecha>V.fecha)).reduce((O,H)=>O+H.importeCts,(V==null?void 0:V.saldoCts)??0)},L=z.filter(R=>!D.has(Ot(R))).map(R=>({_id:a("pcd"),fecha:R,cuentaId:x,saldoCts:j(R),origen:"derivado"}));return t.set("puntosControl",[...F,...L].sort((R,V)=>R.fecha.localeCompare(V.fecha))),b(x),L.length}function f(x){return(x??[...new Set(t.get("transacciones").map(I=>I.cuentaId))]).reduce((I,E)=>I+l(E),0)}function v(x){const M=t.get("transacciones").filter(_=>_.origen==="importado"&&(!x||_.cuentaId===x)),I=new Map;for(const _ of M){const F=I.get(_.cuentaId);F?F.push(_.fecha):I.set(_.cuentaId,[_.fecha])}const E=[];for(const[_,F]of I){F.sort();const z=d(_,F[0],F[F.length-1]);E.push({cuentaId:_,eliminados:z,semanales:l(_)})}return E}function b(x){const M=r(x),I=t.get("accounts");I.some(E=>E._id===x)&&t.set("accounts",I.map(E=>E._id===x?{...E,historicoSaldos:M.map(_=>({_id:_._id,fecha:_.fecha,saldo:K(_.saldoCts),..._.nota?{nota:_.nota}:{}}))}:E))}function S(x,M=W()){const I=c(x).filter(z=>z.fecha<=M).pop(),E=I==null?void 0:I.fecha,_=(I==null?void 0:I.saldoCts)??0;return t.get("transacciones").filter(z=>z.cuentaId===x&&z.fecha<=M&&(E===void 0||z.fecha>E)).reduce((z,D)=>z+D.importeCts,_)}function g(x,M){return K(S(x,M))}function h(x=W(),M){const I=M??t.get("accounts").filter(E=>E.activo).map(E=>E._id);return K(I.reduce((E,_)=>E+S(_,x),0))}function w(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function C(){const x=[...t.get("transacciones").map(M=>M.fecha),...t.get("puntosControl").map(M=>M.fecha)];return x.length>0?x.sort().pop()??null:null}function $(x={}){return K(e(x).reduce((M,I)=>M+I.importeCts,0))}function y(x={}){const M=new Map;for(const I of e(x)){const E=I.fecha.slice(0,7);M.set(E,(M.get(E)??0)+I.importeCts)}return new Map([...M.entries()].sort(([I],[E])=>I.localeCompare(E)).map(([I,E])=>[I,K(E)]))}function A(x={}){const M=new Map;for(const I of e(x))for(const E of I.tags.length>0?I.tags:["sin_tag"])M.set(E,(M.get(E)??0)+I.importeCts);return new Map([...M.entries()].map(([I,E])=>[I,K(E)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:u,eliminarPuntoControl:p,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:v,generarPuntosSemanales:l,generarPuntosSemanalesTodas:f,saldoCuenta:g,saldoCuentaCts:S,saldoTotal:h,tieneDatos:w,ultimaFecha:C,total:$,totalPorMes:y,totalPorTag:A}}function ut(t){return t.trim().toLowerCase()}function Dr(t){function a(){const u=new Map,p=(d,l)=>{const f=ut(d);if(!f)return;const v=u.get(f)??{tag:f,estimaciones:0,reales:0,total:0};v[l]+=1,v.total+=1,u.set(f,v)};for(const d of t.get("expenses"))for(const l of d.tags??[])p(l,"estimaciones");for(const d of t.get("transacciones"))for(const l of d.tags??[])p(l,"reales");return[...u.values()].sort((d,l)=>l.total-d.total||d.tag.localeCompare(l.tag))}function e(){return a().map(u=>u.tag)}function o(u){return a().filter(p=>u==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function n(u,p,d){const l=ut(p),f=(u??[]).map(ut);if(!f.includes(l))return u??[];const v=f.filter(b=>b!==l);return d===null?[...new Set(v)]:[...new Set([...v,ut(d)])]}function s(u,p){const d=ut(p);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(u,d)}function i(u,p){let d=0;for(const l of u)ut(l)!==ut(p)&&(d+=c(l,ut(p)).cambiados);return{cambiados:d}}function r(u){return c(u,null)}function c(u,p){let d=0;const l=t.get("expenses").map(A=>{const x=n(A.tags,u,p);return x!==A.tags&&(d+=1),x===A.tags?A:{...A,tags:x}});t.set("expenses",l);const f=t.get("transacciones").map(A=>{const x=n(A.tags,u,p);return x!==A.tags&&(d+=1),x===A.tags?A:{...A,tags:x}});t.set("transacciones",f);const v=t.get("loans").map(A=>{const x=n(A.tags,u,p);return x!==A.tags&&(d+=1),x===A.tags?A:{...A,tags:x}});t.set("loans",v);const b=t.get("nominas").map(A=>{const x=n(A.tags,u,p);return x!==A.tags&&(d+=1),x===A.tags?A:{...A,tags:x}});t.set("nominas",b);const S=t.get("config"),g=ut(u),h=A=>{const x=(A??[]).map(ut);if(!x.includes(g))return A??[];const M=x.filter(I=>I!==g);return p===null?[...new Set(M)]:[...new Set([...M,p])]},w={},C=h(S.activeTagsFilter),$=h(S.tagCategorias),y=h(S.tagGrupos);return C!==S.activeTagsFilter&&(w.activeTagsFilter=C),$!==S.tagCategorias&&(w.tagCategorias=$),y!==S.tagGrupos&&(w.tagGrupos=y),Object.keys(w).length>0&&t.patchConfig(w),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Tr=3;function Mo(t){return t<.005?0:t}function zr(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function jr(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<Tr)continue;const r=zr(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Mo(n),sigmaDeriva:Mo(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Eo(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:Y(e*Math.hypot(n,s))}function qr(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,u]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-s)*12+(u-i)),d=Eo(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:Y(r.saldoAcum+d),abajo:Y(r.saldoAcum-d)}})}function Nr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Xe="financeapp_session",Rr=["local","dropbox","firebase"];function Lr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Rr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Or({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(f){const v=n();if(v)try{f?v.setItem(Xe,JSON.stringify(f)):v.removeItem(Xe)}catch{}}function i(){const f=n();if(!f)return null;try{return Lr(f.getItem(Xe))}catch{return null}}function r(){const f=i();return f?(e()-f.ultimoUso)/6e4:null}function c(){const f=a();if(!Number.isFinite(f)||f<=0||o())return!1;const v=r();return v!==null&&v>=f}function u(){const f=i();return f?c()?(s(null),null):f:null}function p(f){const v=e(),b={modo:f.modo,...f.email?{email:f.email}:{},...f.passphrase?{passphrase:f.passphrase}:{},creadaEn:v,ultimoUso:v};return s(b),b}function d(){const f=i();f&&s({...f,ultimoUso:e()})}function l(){s(null)}return{abrir:p,leer:u,tocar:d,cerrar:l,caducada:c,inactividadMinutos:r,get activa(){return u()!==null}}}const _o=["pointerdown","keydown","visibilitychange"];function kr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of _o)s==null||s.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),a())},e);function u(){if(i){i=!1,n(c);for(const p of _o)s==null||s.removeEventListener(p,r)}}return u}const Br=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Hr="FinanceApp",Gr=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Po(t){return new Uint8Array(new ArrayBuffer(t))}const Ze="financeapp_bio_credencial",ta="financeapp_bio_secreto",ea="financeapp_bio_ultimo_desbloqueo",Fo="financeapp_bio_gracia_min",Vr=5;function Ur(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function ge(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ve(t){const a=atob(t),e=Po(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function Yr(t){return ge(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Wr(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ve(a)}function Do(t){return t.getClientExtensionResults()}function Kr(t={}){const a=t.webauthn??Ur(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??($=>crypto.getRandomValues(Po($)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const $=o==null?void 0:o.getItem(Ze);if(!$)return null;try{const y=JSON.parse($);return typeof y.credencialId!="string"||typeof y.salt!="string"?null:y}catch{return null}}function u(){return c()!==null}async function p($){const y=await e.importKey("raw",$,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Gr},y,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d($,y){const A=s(12),x=await e.encrypt({name:"AES-GCM",iv:A},$,new TextEncoder().encode(y));return`${ge(A)}:${ge(x)}`}async function l($,y){const[A,x]=y.split(":"),M=ve(A),I=ve(x),E=await e.decrypt({name:"AES-GCM",iv:M},$,I);return new TextDecoder().decode(E)}async function f($,y){var L,B;if(!$)throw new Error("No hay clave de cifrado que envolver.");const A=s(32),x=s(32),M=s(16),I=await a.create({publicKey:{challenge:x,rp:{name:Hr},user:{id:M,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!I)throw new Error("No se ha podido crear la credencial biométrica.");const E=Do(I);if(!((L=E.prf)!=null&&L.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let _=((B=E.prf.results)==null?void 0:B.first)??null;if(_||(_=await v(I.rawId,A)),!_)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await p(_),z=await d(F,$),D={credencialId:Yr(I.rawId),salt:ge(A),modo:y,creadaEn:n()},j=i();j.setItem(Ze,JSON.stringify(D)),j.setItem(ta,z)}async function v($,y){var x,M;const A=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:$,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:y}}},timeout:6e4}});return A?((M=(x=Do(A).prf)==null?void 0:x.results)==null?void 0:M.first)??null:null}async function b(){const $=c();if(!$)throw new Error("No hay huella configurada en este dispositivo.");const y=o==null?void 0:o.getItem(ta);if(!y)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await v(Wr($.credencialId).buffer,ve($.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const x=await p(A),M=await l(x,y);return g(),M}function S(){o==null||o.removeItem(Ze),o==null||o.removeItem(ta),o==null||o.removeItem(ea)}function g(){o==null||o.setItem(ea,String(n()))}function h(){const $=o==null?void 0:o.getItem(Fo);if($==null)return Vr;const y=Number($);return Number.isFinite(y)&&y>0?y:0}function w($){o==null||o.setItem(Fo,String(Math.max(0,Math.floor($)||0)))}function C(){if(!u())return!1;const $=h();if($<=0)return!1;const y=o==null?void 0:o.getItem(ea),A=y?Number(y):NaN;return Number.isFinite(A)?n()-A<$*6e4:!1}return{disponible:r,registrada:u,leerCredencial:c,registrar:f,desbloquear:b,olvidar:S,marcarDesbloqueo:g,dentroDeGracia:C,graciaMinutos:h,configurarGracia:w}}function To(){if(typeof localStorage<"u"){const y=Bn();y.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${y.join(", ")}`)}const t=Zn(),a=t.activo(),e=Kt(a),o=Va(localStorage,e),n=Yn({adapter:o}),s=Wn(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Ut})`),n.subscribe(y=>s.marcar(y));function r(){var A,x,M,I,E;const y=globalThis;(x=(A=y.FirebaseService)==null?void 0:A.isConnected)!=null&&x.call(A)&&((E=(I=(M=y.FirebaseService).uploadRegistroProyectos)==null?void 0:I.call(M))==null||E.catch(_=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",_ instanceof Error?_.message:_)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(y=>y._id===a)??t.listar()[0],colecciones:It.filter(y=>y!=="config"),crear:y=>{const A=t.crear(y);return r(),A},renombrar:(y,A)=>{t.renombrar(y,A),r()},duplicar:(y,A)=>{const x=t.duplicar(y,A);return r(),x},eliminar:y=>{t.eliminar(y),r()},cambiarA:y=>t.establecerActivo(y),fusionarRemotos:y=>t.fusionarRemotos(y),importarDesde:(y,A)=>{const x=ts(localStorage,y,A),M=es(x),I=[];for(const E of A){const _=M[E];if(!Array.isArray(_)||_.length===0)continue;const F=n.get(E);n.set(E,[...F,..._]),I.push(E)}return I.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:I}}},u=os(n),p=Kr(),d=Or({autoLogoutMinutos:()=>{var A,x;const y=(x=(A=globalThis.State)==null?void 0:A.get)==null?void 0:x.call(A,"config");return Number((y==null?void 0:y.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),l=Fr(n),f=Dr(n),v=Vi(l),b=or(n),S=_s({isEnabled:y=>u.isEnabled(y)}),g=xs({flags:u,rutasExtra:()=>S.flagPorRuta()}),h=rs({flags:u,onChange:()=>{var y,A;S.attachToShell(),g.apply(),(A=(y=globalThis.Router)==null?void 0:y.rerender)==null||A.call(y)}}),w=gs({proyectos:c}),C=()=>{var A,x,M,I,E,_;const y=globalThis;if((x=(A=y.State)==null?void 0:A.load)==null||x.call(A),((I=(M=y.Router)==null?void 0:M.current)==null?void 0:I.call(M))==="dashboard")try{(_=(E=y.DashboardModule)==null?void 0:E.render)==null||_.call(E)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},$=$s({store:n,onDatosCambiados:C});return S.register(ks({store:n,onDatosCambiados:C})),S.register(Qs({store:n,onDatosCambiados:C})),S.register(Ii({store:n,onDatosCambiados:C})),S.register(Pr({store:n,ledger:l,tags:f,precision:v,adjuster:b,onDatosCambiados:C})),S.register(Ds({store:n,onDatosCambiados:C})),{version:Ut,core:Ho,engine:{generarExtracto:Sa,recomputarSaldoAcum:Uo,saldoHoy:Yo,sumarPorTags:Aa,providers:{proyectarGastos:Ht,proyectarPrestamos:va,proyectarTransferencias:ba,proyectarNominas:xa,proyectarInteresesCuentas:ya,proyectarAportaciones:ha,proyectarRetencionesFiscales:$a,proyectarInflacionGastos:wa,proyectarPerdidaAhorro:Ia},analysis:Qo,margins:nn,avisos:ln,dashboard:In},store:n,flags:u,featureRegistry:{all:$t,porGrupo:Qa},ui:{openFeatures:h.open,openProyectos:w.open,openPersonas:$.open,applyGating:g.apply,watchGating:()=>g.observar(),instalarDeshacer:()=>Is({store:n,rerender:()=>{var A,x,M,I;const y=globalThis;(x=(A=y.State)==null?void 0:A.load)==null||x.call(A),(I=(M=y.Router)==null?void 0:M.rerender)==null||I.call(M)}}),avisoGuardado:null,instalarBuscador:()=>Ms({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>S.routes(),navegar:y=>{var A,x;return(x=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:x.call(A,y)}})},app:S,session:Object.assign(d,{vigilar:y=>kr({sesion:d,onCaducada:y}),opciones:Br}),biometria:p,cambios:s,datos:{colecciones:It,snapshot:()=>Ua(o),aplicar:(y,{sellar:A=!0}={})=>{const M=Kn(A?(I,E)=>o.set(I,E):(I,E)=>{const _=globalThis.StorageAdapter;_!=null&&_.setRestaurando?_.setRestaurando(I,E):o.set(I,E)},y);return n.load(),s.marcar("copia-restaurada"),M},faltantes:y=>Jn(y),esVacioOPorDefecto:()=>Qn(Ua(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:l,tags:f,precision:v,adjuster:b,sugerirAjuste:Ue,medirVariabilidad:jr,bandaDeConfianza:qr,bandaAcumulada:Eo,describirBanda:Nr}}}function Jr(){try{const t=To();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const nt=typeof window<"u"?Jr():null;if(nt){let t=!1;const a=()=>{var e,o;if(nt.app.attachToShell(),nt.ui.applyGating(),!t){t=!0,nt.ui.watchGating(),nt.ui.instalarDeshacer(),nt.ui.instalarBuscador();const n=globalThis,s=()=>{var c,u,p,d;return(u=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&u.call(c)?n.FirebaseService:(d=(p=n.DropboxService)==null?void 0:p.isConnected)!=null&&d.call(p)?n.DropboxService:null};nt.ui.avisoGuardado=Es({cambios:nt.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=nt.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>nt.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>nt.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>nt.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return be.bootstrap=To,Object.defineProperty(be,Symbol.toStringTag,{value:"Module"}),be}({});
//# sourceMappingURL=financeapp-core.js.map
