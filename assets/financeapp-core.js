var FinanceAppBundle=function(ve){"use strict";function V(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function L(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function Y(){return V(new Date)}function be(t,a){return new Date(t,a+1,0).getDate()}function aa(t,a,e){return V(new Date(t,a,Math.min(e,be(t,a))))}function oe(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return V(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return aa(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),V(i)}return null}function oa(t,a){if(!a)return t;const e=L(t);return oe(e.getFullYear(),e.getMonth(),a)??t}const Do=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],To={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function he(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${To[e]||e+"º"} ${Do[o]} del mes`}return t}function Lt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function st(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function W(t){return t/100}function U(t){return W(st(t))}function P(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function na(t){return(t||0).toFixed(2)+"%"}function $t(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function sa(t,a,e,o=0){const n=$t(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-e))/i-s,m=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-u/m;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function ia(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const u=L(o),m=a/100/12;let d=e,l=$t(c,a,d);const f=[...s].sort((y,S)=>y.fecha.localeCompare(S.fecha));let v=0;for(let y=1;y<=e*2&&c>.01;y++){const S=new Date(u);u.setMonth(u.getMonth()+1);const g=oa(V(S),i.diaPago||"");for(;v<f.length&&f[v].fecha<=g;){const I=f[v],b=I.cantidad*(n/100);if(c-=I.cantidad,c=Math.max(0,c),I.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*m/l)/Math.log(1+m)):(d=e-y+1,l=$t(c,a,d)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:b,capitalPendiente:c,esAmortizacion:!0,simulacion:I.simulacion||!1}),v++,c<.01)break}if(c<.01)break;const x=c*m,w=Math.min(l-x,c);if(c-=w,c<.01&&(c=0),r.push({mes:y,fecha:g,cuota:l,interes:x,amortizacion:w,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const ra=new Map;function J(t){var S;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((g,x)=>`${g.fecha}|${g.cantidad}|${g.tipo||""}`.localeCompare(`${x.fecha}|${x.cantidad}|${x.tipo||""}`)).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).join(";")}`,o=ra.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:u}=t,m=ia(n,s,i,r,c||0,a,t),d=m.reduce((g,x)=>g+x.interes,0),l=m.reduce((g,x)=>g+x.comisionAmort,0),f=n*((u||0)/100),v=m.filter(g=>!g.esAmortizacion),y={cuota:$t(n,s,i),totalIntereses:d,tae:sa(n,s,i,u||0),costoTotal:d+l+f,comAp:f,totalComAm:l,fechaFin:((S=v.slice(-1)[0])==null?void 0:S.fecha)||"",mesesReales:v.length,tabla:m};return ra.set(e,y),y}function ca(t){const a=J(t),e=J({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function ft(t,a,e){if(!t||t.length===0)return 1;const o=L(a),n=L(e);if(n<=o)return 1;const s=[...t].sort((c,u)=>c.year-u.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),u=s.filter(y=>y.year<=c),m=u.length>0?u[u.length-1]:s[0],d=(m?m.tasa:0)/100,l=new Date(c+1,0,1),f=l<n?l:n,v=Lt(r,f);i*=Math.pow(1+d,v/365.25),r=f}return i}function la(t,a,e,o=0){const n=L(a),s=L(e);if(s<=n)return o;const i=Lt(n,s),r=t?[...t].sort((m,d)=>m.year-d.year):[];let c=0,u=new Date(n);for(;u<s;){const m=u.getFullYear(),d=new Date(m+1,0,1),l=d<s?d:s,f=Lt(u,l),v=r.filter(g=>g.year<=m),y=v.length>0?v[v.length-1]:null,S=y!==null?y.tasa:o;c+=S*f,u=l}return i>0?c/i:o}function da(t,a){return((1+t/100)/(1+a/100)-1)*100}function zo(t,a,e,o){const n=ft(a,e,o);return n>0?t/n:t}function jo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:u=0,cuotasHipoteca:m=0,gastosBasicos:d=0,gastosOtros:l=0,amortizaciones:f=0}=t,v=c-u-f-d-l,y=v,S=c>0?y/c*100:null,g=r?u-m:u,x=c>0?g/c*100:null,w=c>0?u/c*100:null,I=c>0?(d+u+f)/c*100:null,b=c>0?l/c*100:null,h=(C,M,A)=>C===null?"neutral":C>=M?"verde":C>=A?"amarillo":"rojo",$=(C,M,A)=>C===null?"neutral":C<=M?"verde":C<=A?"amarillo":"rojo";return{ingresos:c,cuotas:u,cuotasHipoteca:m,gastosBasicos:d,gastosOtros:l,amortizaciones:f,ahorroBruto:v,ahorroReal:y,tasaAhorro:S,dti:x,dtiTotal:w,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:b,semAhorro:h(S,e,o),semDTI:$(x,n,s),semNecesidades:$(I,i[0],i[0]+15),semDeseos:$(b,i[1],i[1]+10),semAhorroRegla:h(S,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function it(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function gt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Ot(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=e&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=a);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a);return n?n.saldo:0}}function qo(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function No(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function ne(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Ro(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function Lo(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Mt(t,a,e){const o=st(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:W(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Ro(o,n.length);return n.map((l,f)=>({personaId:l,importe:W(d[f])}))}const s=a.participantes.map(d=>{const l=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*l/100):st(l)}),i=s.reduce((d,l)=>d+l,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,l=s.map(v=>Math.round(v*d)),f=l.reduce((v,y)=>v+y,0);return l.length>0&&(l[0]+=o-f),n.map((v,y)=>({personaId:v,importe:W(l[y])}))}const c=o-i,{ids:u,cts:m}=Lo(n,s,c,e);return u.map((d,l)=>({personaId:d,importe:W(m[l])}))}function ye(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Oo(t,a,e){const o=ne(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=ye(a.expenses,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const c=ye(a.loans,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=ye(a.nominas,i.sourceId);for(const u of Mt(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function xe(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const wt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ct(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function ua(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function vt(t,a){return ua(t,a).baseImponible}function pa(t,a){return ct(t,a)/12}const kt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function $e(t,a){if(!t||t<=0)return 0;const e=a||kt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,u=Math.min(n,c-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function se(t,a){if(it(t)!=="inversion")return null;const e=gt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=$e(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function we(t,a=new Date){var l;if(it(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=gt(t),n=V(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((f,v)=>f.fecha.localeCompare(v.fecha));let i=0;const r=s.reduce((f,v)=>f+v.cantidad,0);for(const f of s)f.fecha<=n&&(i+=f.cantidad);const c=Math.max(0,o-r),u=r>0?i/r:0,m=Math.min(o,i+c*u),d=Math.max(0,o-m);return{saldo:o,disponible:m,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((l=s.find(f=>f.fecha>n))==null?void 0:l.fecha)||null}}function ma(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(it(t)!=="pension"||!o)return 0;const n=gt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,m)=>u+m.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function Ie(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,m)=>u+(m.bruto||0)*(m.nPagas||12),0),i=[...e||[]].sort((u,m)=>u[0]-m[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[u,m]of i)if(s>=u)r=m;else break;return r}const ko=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:kt,TRAMOS_IRPF_DEFAULT:wt,agregarPorPersona:Oo,ajustarFechaPago:oa,ajustarPrecioReal:zo,calcBaseImponibleTrabajo:vt,calcFactorInflacion:ft,calcFondoInversion:se,calcFondosPension:we,calcGananciasCapital:$e,calcIRPF:ct,calcImpuestoPension:ma,calcInflacionMediaAnual:la,calcSaludFinanciera:jo,calcTAE:sa,calcTipoMarginalPension:Ie,calcTipoRealFisher:da,calcularReparto:Mt,clampedDate:aa,cuotaMensual:$t,desgloseBaseTrabajo:ua,diasEntre:Lt,formatEUR:P,formatLocalDate:V,formatPct:na,fromCents:W,haySimulaciones:No,idPersonaPorDefecto:ne,labelDiaPago:he,lastDayOfMonth:be,modeloFondoDe:it,parseLocalDate:L,personasImplicadas:xe,resolverDiaEfectivo:oe,resumenPrestamo:J,resumenPrestamoConAhorro:ca,retencionMensual:pa,roundMoney:U,saldoEnFecha:Ot,saldoRealCuenta:gt,sinSimulaciones:qo,tablaAmortizacion:ia,toCents:st,todayISO:Y},Symbol.toStringTag,{value:"Module"}));function Bt(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=L(i.fechaInicio||a.start),c=i.fechaFin?L(i.fechaFin):s,u=i.cuantia,m=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&m(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let l=r.getFullYear(),f=r.getMonth();const v=Math.ceil(240/d)+2;for(let y=0;y<v;y++){const S=oe(l,f,i.diaPago||"")||(()=>{const x=r.getDate(),w=new Date(l,f+1,0).getDate();return V(new Date(l,f,Math.min(x,w)))})(),g=L(S);if(g>s||g>c)break;g>=n&&g>=r&&m(S),f+=d,f>=12&&(l+=Math.floor(f/12),f=f%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let l=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const f=Math.ceil((n.getTime()-r.getTime())/d);l=new Date(r.getTime()+f*d)}for(;l<=s&&l<=c;)m(V(l)),l=new Date(l.getTime()+d)}}return o}function fa(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=J(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ga(t,a,e=null,o={accounts:[]}){const n=[],s=L(a.start),i=L(a.end),r=o.accounts||[],c=o.nominas||[],u=o.resolverTramosIRPF||(()=>wt),m=o.resolverTramosGanancias||(()=>kt),d=l=>{var f;return((f=r.find(v=>v._id===l))==null?void 0:f.nombre)??l};for(const l of t){if(!l.activo||l.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(l.cuenta||"default")||e.includes(l.cuentaDestino||"default")))continue;const f=L(l.fechaInicio||a.start),v=l.fechaFin?L(l.fechaFin):i,y=S=>{const g=r.find(_=>_._id===(l.cuenta||"default")),x=r.find(_=>_._id===(l.cuentaDestino||"default")),w=it(g),I=it(x),b=w==="inversion"&&I==="inversion"||w==="pension"&&I==="pension",h=["transferencia",...b?["traspaso"]:[],...l.tags||[]],$=b?"traspaso-out":"transfer-out",C=b?"traspaso-in":"transfer-in",M=!e||e.length===0||e.includes(l.cuenta||"default"),A=!e||e.length===0||e.includes(l.cuentaDestino||"default");if(M&&n.push({fecha:S,concepto:`Transf. → ${d(l.cuentaDestino||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"gasto",tags:h,cuenta:l.cuenta||"default",sourceId:l._id,sourceType:$}),A&&n.push({fecha:S,concepto:`Transf. ← ${d(l.cuenta||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"ingreso",tags:h,cuenta:l.cuentaDestino||"default",sourceId:l._id,sourceType:C}),M&&!b&&g){if(w==="inversion"){const _=parseInt(S.slice(0,4)),E=se(g,m(_));if(E&&E.saldo>0&&E.plusvalia>0){const F=Math.min(1,l.cuantia/E.saldo),D=E.plusvalia*F*.19;D>.01&&n.push({fecha:S,concepto:`Retención IRPF reembolso ${g.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"investment-tax"})}}else if(w==="pension"){const _=u(parseInt(S.slice(0,4))),E=Ie(g,c,_),F=ma(g,l.cuantia,E||void 0);if(F>0){const q=g.grupoNomina?`IRPF rescate ${g.nombre} (tipo marginal grupo "${g.grupoNomina}": ${E}%)`:`Retención rescate ${g.nombre} (${g.impuestoRetirada}% s/beneficio)`;n.push({fecha:S,concepto:q,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"pension-tax"})}}}};if(l.tipoFrecuencia==="extraordinario")f>=s&&f<=i&&f<=v&&y(l.fechaInicio);else if(l.tipoFrecuencia==="mensual"){const S=Math.max(1,l.frecuencia||1);let g=f.getFullYear(),x=f.getMonth();const w=Math.ceil(240/S)+2;for(let I=0;I<w;I++){const b=oe(g,x,l.diaPago||"")||(()=>{const $=f.getDate(),C=new Date(g,x+1,0).getDate();return V(new Date(g,x,Math.min($,C)))})(),h=L(b);if(h>i||h>v)break;h>=s&&h>=f&&y(b),x+=S,x>=12&&(g+=Math.floor(x/12),x=x%12)}}else if(l.tipoFrecuencia==="diaria"){const S=Math.max(1,l.frecuencia||1)*864e5;let g=new Date(Math.max(f.getTime(),s.getTime()));if(f<s){const x=Math.ceil((s.getTime()-f.getTime())/S);g=new Date(f.getTime()+x*S)}for(;g<=i&&g<=v;)y(V(g)),g=new Date(g.getTime()+S)}}return n}function va(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){const r=it(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const u of c){if(!u.importe||u.importe<=0)continue;const m=L(u.fechaInicio||a.start),d=u.fechaFin?L(u.fechaFin):s,l=u.cuentaOrigen||"default",f=!e||!e.length||e.includes(l),v=!e||!e.length||e.includes(i._id),y=r==="pension"?"pension":"capital-mobiliario",S=b=>{f&&o.push({fecha:b,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",y],cuenta:l,sourceId:u._id,sourceType:"aportacion-out"}),v&&o.push({fecha:b,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",y],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},g={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let x=m.getFullYear(),w=m.getMonth();const I=Math.ceil(240/g)+2;for(let b=0;b<I;b++){const h=new Date(x,w+1,0).getDate(),$=V(new Date(x,w,Math.min(m.getDate(),h))),C=L($);if(C>s||C>d)break;C>=n&&C>=m&&S($),w+=g,w>=12&&(x+=Math.floor(w/12),w=w%12)}}}return o}function ba(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=L(a.start),r=L(a.end),c=s.periodoCobro||"mensual",u=c==="mensual",m=u?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=u?1/12:m/(365.25*864e5);let l=Ot(s,a.start);const f=o.filter(S=>S.cuenta===s._id).map(S=>({fecha:S.fecha,delta:S.tipo==="ingreso"?Math.abs(S.cuantia):-Math.abs(S.cuantia)})).sort((S,g)=>S.fecha.localeCompare(g.fecha));let v=0,y=new Date(i);for(;y<=r;){const S=u?new Date(y.getFullYear(),y.getMonth()+1,y.getDate()):new Date(y.getTime()+m),g=new Date(Math.min(S.getTime(),r.getTime()+1)),x=V(g);let w=0;for(;v<f.length&&f[v].fecha<x;)w+=f[v].delta,v++;const I=l,b=l+w,h=Math.max(0,(I+b)/2);l=b;const $=u?d:(g.getTime()-y.getTime())/(365.25*864e5),C=h*(Math.pow(1+s.interes/100,$)-1);C>.001&&n.push({fecha:V(y),concepto:`Interés ${s.nombre}`,cuantia:C,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),y=S}}return n}function ha(t,a,e,o=null){const n=[],s=a||wt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=pa(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Bt([u],e,o))}return n}const Bo=[5,11,2,8],Ho={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ya(t,a,e=null,o=[],n=()=>wt){const s=[],i=L(a.start),r=L(a.end),c=o.length>0,u={};for(const l of t){const f=l.grupoNomina||"";u[f]||(u[f]=[]),u[f].push(l)}for(const l of Object.keys(u))u[l].sort((f,v)=>(v.bruto||0)-(f.bruto||0));function m(l,f){if(!c||!l.mesActualizacionIPC)return l.bruto||0;const v=l.fechaInicio||a.start,y=L(v),S=L(f);let g=0;for(let w=y.getFullYear();w<=S.getFullYear();w++){const I=new Date(w,l.mesActualizacionIPC-1,1);I>y&&I<=S&&g++}if(g===0)return l.bruto||0;const x=V(new Date(y.getFullYear()+g,0,1));return(l.bruto||0)*ft(o,v,x)}function d(l,f){const v=m(l,f),y=(l.retribucionFlexible||[]).reduce((_,E)=>_+(E.importe||0)*12,0),S=Math.max(0,v-y);if(l.irpfModo==="manual")return S*((l.irpfPct||0)/100);const g=n(parseInt(f.slice(0,4))),x=l.grupoNomina||"";if(!x)return ct(vt(v,y),g);const w=u[x].filter(_=>_.activo),I=w.reduce((_,E)=>_+m(E,f),0),b=w.reduce((_,E)=>_+(E.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),0),h=Math.max(0,I-b),$=vt(I,b),C=Math.max(0,v-y),M=h>0?$*(C/h):0,A=w.filter(_=>_._id!==l._id&&(_.bruto||0)>(l.bruto||0)).reduce((_,E)=>{const F=(E.retribucionFlexible||[]).reduce((D,j)=>D+(j.importe||0)*12,0),q=Math.max(0,m(E,f)-F);return _+(h>0?$*(q/h):0)},0);return ct(A+M,g)-ct(A,g)}for(const l of t){if(!l.activo)continue;const f=l.cuenta||"default";if(e&&e.length>0&&!e.includes(f))continue;const v=Math.max(1,l.nPagas||12),y=L(l.fechaInicio||a.start),S=l.fechaFin?L(l.fechaFin):r,g=x=>{const w=m(l,x),I=d(l,x),b=(l.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),h=Math.max(0,w-b),$=(l.ssPct??6.35)/100,C=h*$,M=h/v,A=I/v,_=C/v,E=l.representacion==="simplificado"?M-_-A:M;s.push({fecha:x,concepto:l.nombre,cuantia:E,tipo:"ingreso",cuenta:f,tags:l.tags||[],sourceId:l._id,sourceType:"nomina"}),l.representacion==="detallado"&&(_>0&&s.push({fecha:x,concepto:`SS ${l.nombre}`,cuantia:_,tipo:"gasto",cuenta:f,tags:["seguridad-social","fiscal"],sourceId:l._id+"_ss",sourceType:"nomina"}),A>0&&s.push({fecha:x,concepto:`IRPF ${l.nombre}`,cuantia:A,tipo:"gasto",cuenta:f,tags:["irpf","fiscal"],sourceId:l._id+"_irpf",sourceType:"nomina"}));for(const F of l.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:x,concepto:`${l.nombre} — ${Ho[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${l._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(v<=12){const x=v===12?1:Math.round(12/v),w=y.getDate();let I=y.getFullYear(),b=y.getMonth();for(let h=0;h<300;h++){const $=new Date(I,b+1,0).getDate(),C=new Date(I,b,Math.min(w,$));if(C>r||C>S)break;C>=i&&C>=y&&g(V(C)),b+=x,b>=12&&(I+=Math.floor(b/12),b=b%12)}}else{const x=v-12,w=y.getDate();let I=y.getFullYear(),b=y.getMonth();for(let C=0;C<300;C++){const M=new Date(I,b+1,0).getDate(),A=new Date(I,b,Math.min(w,M));if(A>r||A>S)break;A>=i&&A>=y&&g(V(A)),b++,b>=12&&(I++,b=0)}const h=Math.max(y.getFullYear(),i.getFullYear()),$=Math.min((l.fechaFin?S:r).getFullYear(),r.getFullYear());for(let C=h;C<=$;C++)for(const M of Bo.slice(0,x)){const A=new Date(C,M,15);A>=i&&A<=r&&A>=y&&A<=S&&g(V(A))}}}return s}function xa(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=L(e.start),r=L(e.end),c=Y(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let m=new Date(i.getFullYear(),i.getMonth(),1);for(;m<=r;){const d=m.getFullYear(),l=m.getMonth(),f=d+"-"+String(l+1).padStart(2,"0"),v=f+"-01",y=V(new Date(d,l+1,0)),S=V(new Date(d,l,15));let g=0;for(const x of u){if(o&&o.length>0&&!o.includes(x.cuenta||"default")||x.fechaInicio&&x.fechaInicio>y||x.fechaFin&&x.fechaFin<v)continue;const w=x.fechaInicio||c,I=ft(a,w,S);if(I<=1)continue;const b=Math.max(1,x.frecuencia||1);g+=x.cuantia*(I-1)/b}g>.01&&s.push({fecha:S,concepto:"Incremento coste de vida",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+f,sourceType:"inflacion"}),m=new Date(d,l+1,1)}return s}function $a(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=L(e.start),i=L(e.end),r=[...a].sort((u,m)=>u.year-m.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const u=c.getFullYear(),m=c.getMonth(),d=u+"-"+String(m+1).padStart(2,"0"),l=V(new Date(u,m,15)),f=r.filter(x=>x.year<=u),v=f.length>0?f[f.length-1]:r[0],y=v?v.tasa/100:0,S=Math.pow(1+y,1/12)-1,g=t*S;g>.01&&n.push({fecha:l,concepto:"Pérdida ahorro por inflación",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(u,m+1,1)}return n}function wa(t,a,e){const o=e.fechaReferencia||e.dashboardStart,n=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,s=a.reduce((d,l)=>d+Ot(l,n),0),i=t.filter(d=>d.fecha<n),r=t.filter(d=>d.fecha>=n),c=[];let u=s;for(const d of[...i].reverse()){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);c.unshift({...d,delta:l,saldoAcum:u}),u-=l}const m=[];u=s;for(const d of r){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=l,m.push({...d,delta:l,saldoAcum:u})}return[...c,...m]}function Go(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return wa([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Ia(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c={start:n.dashboardStart,end:n.dashboardEnd},u=e.filter(y=>y.tipo!=="transferencia"),m=e.filter(y=>y.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let l=[];l=l.concat(Bt(u,c,s)),l=l.concat(fa(a,c,s)),l=l.concat(ga(m,c,s,d)),l=l.concat(va(o,c,s));const f=ba(o,c,s,l);if(l=l.concat(f),l=l.concat(ha(e,n.tramos_irpf,c,s)),l=l.concat(ya(i,c,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const y=(o.find(x=>x.activo&&x.esCuentaPrincipal)||o.find(x=>x.activo)||{_id:"default"})._id;l=l.concat(xa(u,r,c,s,y));const g=o.filter(x=>x.activo&&(!s||s.length===0||s.includes(x._id))).reduce((x,w)=>x+Ot(w,n.dashboardStart),0);l=l.concat($a(g,r,c,y))}l.sort((y,S)=>y.fecha.localeCompare(S.fecha));const v=o.filter(y=>y.activo&&(!s||s.length===0||s.includes(y._id)));return wa(l,v,n)}function Vo(t,a,e=null){const o=Y(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+gt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Ca(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Uo(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${P(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${P(i)} < ${P(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${P(i)})`})))}return e}function Yo(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=L(a.dashboardStart),n=L(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function Wo(t,a,e=Y()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",u={};c&&c<=e&&(u[c]=r.saldoInicial||0);for(const m of r.historicoSaldos||[])m.fecha<=e&&(!c||m.fecha>=c)&&(u[m.fecha]=m.saldo);return Object.keys(u).forEach(m=>o.add(m)),u}),s={};for(const r of[...o].sort()){let c=0;for(let u=0;u<a.length;u++){const m=Object.entries(n[u]).filter(([d])=>d<=r);m.length>0?(m.sort(([d],[l])=>l.localeCompare(d)),c+=m[0][1]):c+=a[u].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([u],[m])=>u.localeCompare(m))){const u=t.filter(f=>f.fecha<=r),m=u.length>0?u[u.length-1].saldoAcum:null;if(m===null)continue;const d=c-m,l=m!==0?d/Math.abs(m)*100:0;i.push({cuenta:"Total",fecha:r,estimado:m,real:c,desv:d,pct:l})}return i}const Ko=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Wo,detectarPuntosCriticos:Uo,mediaMensualGastos:Yo},Symbol.toStringTag,{value:"Module"}));function Ht(t,a=new Date){const e=V(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Bt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Jo(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+$t(e.capital,e.tin,e.meses),0)}function Qo(t,a){return J(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Sa(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+$t(n.capital,n.tin,n.meses)*Math.min(a,Qo(n,e)),0)}function Aa(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Ht(t,o),s=a.colchonMeses||6;return n*s+Sa(e,s,V(o))}function Xo(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((u,m)=>u.fecha.localeCompare(m.fecha)).filter(u=>u.fecha<=o).pop();if(!i)return Aa(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Ht(t,n),c=i.meses||6;return r*c+Sa(e,c,o)}function Ce(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((m,d)=>m.fecha.localeCompare(d.fecha)),c=r.filter(m=>m.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Ht(a,i)+Jo(o))*(c.meses||1):0}function Zo(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function tn(t,a){const e={};for(const o of a)e[o._id]=gt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Zo(o)),{fecha:o.fecha,saldos:{...e}}))}function en(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let m=0;m<a.length;m++){const d=a[m],l=Ce(c,o,n,s,d.fecha,!1,i);if(l<=0){u=!1;continue}const f=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((v,y)=>{var S,g;return v+(((g=(S=e[m])==null?void 0:S.saldos)==null?void 0:g[y])||0)},0);f<l&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${P(f)} < ${P(l)} desde ${d.fecha}`})):f>=l&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const an=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Aa,calcColchonEnFecha:Xo,calcGastoBasicoMensual:Ht,calcMargenEnFecha:Ce,detectarCrucesMargenes:en,saldosPorCuentaEnExtracto:tn},Symbol.toStringTag,{value:"Module"}));function on(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Ma(t,a){return Lt(L(t),L(a))}const nn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ea(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${nn[o-1]}${s?"":` de ${e}`}`}function _a(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function sn(t,a={}){const{hoy:e=Y(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:l=>`El ${l} el saldo proyectado baja a ${P(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:l=>`El ${l} el saldo queda en ${P(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:l=>l?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:l=>`El ${l} tendrías ${P(d.saldo)}, y el margen pide ${P(d.target)}.`});const c=new Map;for(const d of r){const l=c.get(d.id);(!l||d.fecha<l.fecha)&&c.set(d.id,d)}const u=[];for(const d of c.values()){const l=Ma(e,d.fecha);if(l<0||l>(d.gravedad==="critico"?o:n))continue;const f=i?i(l):0,v=f>0&&d.distancia<f;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:l,plazo:_a(l),titulo:d.titulo(v),detalle:d.detalle(Ea(d.fecha,e)),incierto:v})}const m={critico:0,aviso:1};return u.sort((d,l)=>d.fecha.localeCompare(l.fecha)||m[d.gravedad]-m[l.gravedad]),u.slice(0,s)}const rn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:on,construirAvisos:sn,describirPlazo:_a,diasEntreISO:Ma,fechaEnPalabras:Ea},Symbol.toStringTag,{value:"Module"})),cn=30.44*864e5;function Pa(t){const a=t.getFullYear(),e=t.getMonth();return{desde:V(new Date(a,e,1)),hasta:V(new Date(a,e,be(a,e)))}}function Fa(t){const[a,e]=t.split("-").map(Number);return Pa(new Date(a,e-1,1))}function ln(t,a){return Math.max(1,(L(a).getTime()-L(t).getTime())/cn)}const dn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),bt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function un(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function pn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=l=>l.sourceType==="loan"&&l.tipo==="gasto",n=a.loanIdsIniciados,s=bt(t.filter(l=>l.tipo==="ingreso")),i=bt(t.filter(l=>o(l)&&(!n||n.has(l.sourceId??"")))),r=bt(t.filter(l=>o(l)&&a.hipotecaIds.has(l.sourceId??""))),c=bt(t.filter(l=>l.sourceType==="loan-amort")),u=bt(t.filter(l=>l.sourceType==="account-interest")),{basicos:m,deseo:d}=un(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:m/e,gastosDeseo:d/e,gastosTotales:(i+m+d)/e,intereses:u/e}}function Da(t,a){return t.reduce((e,o)=>{const n=J(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function mn(t,a,e,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=e),s=n.reduce((u,m)=>{if((m.amortizaciones||[]).filter(v=>v.fecha>=a&&v.fecha<=e).length===0)return u;const l=J(m).totalIntereses,f=J({...m,amortizaciones:(m.amortizaciones||[]).filter(v=>v.fecha<a||v.fecha>e)}).totalIntereses;return u+Math.max(0,f-l)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:J(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=a&&u.fechaFin<=e),r=n.map(u=>J(u).tabla),c=u=>{const{desde:m,hasta:d}=Fa(u);return r.reduce((l,f)=>{const v=f.find(y=>!y.esAmortizacion&&y.fecha>=m&&y.fecha<=d);return l+(v?v.cuota:0)},0)};return{deudaInicio:Da(n,a),deudaFin:Da(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function fn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:bt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Ta(t,a=new Set,e="desglosado"){if(a.size===0)return Ca(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>a.has(u)),r=s.filter(u=>!a.has(u)),c=e==="porgrupos"&&i.length>0?i:r;for(const u of c)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function gn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Ta(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function vn(t,a){const e=a.reduce((o,n)=>o+gt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:bt(t.filter(o=>o.tipo==="gasto")),totalIngresos:bt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function bn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function hn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function yn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function xn(t,a){if(t.length===0)return[];const e=u=>a==="mes"?u.slice(0,7):u.slice(0,4),o=u=>a==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const u of t){const m=e(u.fecha),d=u.saldoAcum??i;(!c||c.periodo!==m)&&(c&&(i=c.cierre),c={periodo:m,inicio:o(m),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const $n=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:xn,cuentasVisibles:bn,gastoPorTagOrdenado:gn,idsHipoteca:hn,idsPrestamosIniciados:yn,interesesPorCuenta:fn,mesesDelPeriodo:ln,metricasFlujo:pn,rangoMes:Fa,rangoMesDe:Pa,resumenPrestamosPeriodo:mn,sinTransferencias:dn,sumarGastosPorTag:Ta,totalesPeriodo:vn},Symbol.toStringTag,{value:"Module"}));function wn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Gt(t,a){return e=>wn(t,a,e)}const Vt=10,za=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ja=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Se(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const qa="default";function Na(){return{_id:qa,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Ra(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:za,tramosGananciasCapital:ja,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function La(t,a){return{loans:[],expenses:[],accounts:[Se(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Na()],config:Ra(t,a)}}const lt=t=>Array.isArray(t)?t:[],In=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Ut(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Oa(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ae(t){const{varianza:a,inflacion:e,...o}=t;return o}function Cn(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=In(t.config),r={...Ra(e,o)};for(const[m,d]of Object.entries(s))d!=null&&(r[m]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=za),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ja),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=lt(t.accounts).map(m=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...m};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Ut(d)});c.length===0&&(c=[Se(e)]);const u=c.filter(m=>m.esCuentaPrincipal);if(u.length===0){const m=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===m._id}))}else if(u.length>1){let m=!1;c=c.map(d=>d.esCuentaPrincipal?m?{...d,esCuentaPrincipal:!1}:(m=!0,d):d)}return n.accounts=c,n.expenses=lt(t.expenses).map(m=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Oa(d.diaPago),Ae(Ut(d))}),n.loans=lt(t.loans).map(m=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...m};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Oa(d.diaPago),d.amortizaciones=lt(d.amortizaciones).map(l=>Ut(l)),Ae(Ut(d))}),n.nominas=lt(t.nominas).map(m=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...m};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ae(Ut(d))}),n.goals=lt(t.goals).map((m,d)=>{const l=Array.isArray(m.cuentaIds)?m.cuentaIds:m.cuentaId?[m.cuentaId]:[],{cuentaId:f,...v}=m;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...v,cuentaIds:l}}),n.inflacion=lt(t.inflacion),n.tramosIRPFHistorico=lt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=lt(t.tramosGananciasCapitalHistorico),n.escenarios=lt(t.escenarios).map(({inversiones:m,...d})=>d),n}const Et=t=>Array.isArray(t)?t:[];let Me=0;function Sn(t){return Me+=1,`${t}_${Me.toString(36)}`}const An=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Mn=t=>typeof t=="number"&&Number.isFinite(t);function En(t,a){const e={...t};Me=0;const o=Et(t.transacciones),n=Et(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,m,d,l)=>{if(!An(m)||!Mn(d))return;const f=`${u}|${m}`;i.has(f)||(i.add(f),s.push({_id:Sn("pc"),fecha:m,cuentaId:u,saldoCts:st(d),...typeof l=="string"&&l?{nota:l}:{}}))};for(const u of Et(t.accounts)){const m=typeof u._id=="string"?u._id:null;if(m)for(const d of Et(u.historicoSaldos))r(m,d.fecha,d.saldo,d.nota)}const c=Et(t.history);if(c.length>0){const u=Et(t.accounts),m=u.find(l=>l.esCuentaPrincipal)||u.find(l=>l.activo)||u[0],d=typeof(m==null?void 0:m._id)=="string"?m._id:"default";for(const l of c){const f=typeof l.cuenta=="string"?l.cuenta:typeof l.cuentaId=="string"?l.cuentaId:d;r(f,l.fecha,l.saldo,l.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((u,m)=>String(u.fecha).localeCompare(String(m.fecha))),e}const Ee=t=>Array.isArray(t)?t:[],_n=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Pn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let _e=0;function Fn(){return _e+=1,`tx_hp_${_e.toString(36)}`}function Dn(t,a){const e={...t};_e=0;const o=[...Ee(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ee(t.expenses).map(i=>{const r=Ee(i.historialPrecios),c=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",m=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(v=>typeof v=="string"):[];if(c)for(const v of r){if(!v||!_n(v.fecha)||!Pn(v.cuantia))continue;const y=m==="ingreso"?st(v.cuantia):-st(v.cuantia),S=`${c}|${v.fecha}|${y}`;n.has(S)||(n.add(S),o.push({_id:Fn(),fecha:v.fecha,cuentaId:u,importeCts:y,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:m,origen:"importado",nota:typeof v.nota=="string"&&v.nota?v.nota:"Importado del historial de precios"}))}const{historialPrecios:l,...f}=i;return f});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const ka=t=>Array.isArray(t)?t:[],ht=(t,a="")=>typeof t=="string"&&t.trim()?t:a,_t=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,Tn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function zn(t,a){var m;const e={...t};if(Array.isArray(e.planes))return e;const o=ka(e.goals),n=ka(e.accounts),s=n.map(d=>{const l=_t(d.bloqueoMeses,0);return{_id:`veh_${ht(d._id,"x")}`,nombre:ht(d.nombre,"Cuenta"),rentabilidadRealAnual:_t(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":l>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:_t(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?st(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:ht(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:_t(d.interes,0)>0}}),i=new Map(n.map((d,l)=>[ht(d._id,""),s[l]._id])),r=((m=s[0])==null?void 0:m._id)??"",c=o.map((d,l)=>{const f=Array.isArray(d.cuentaIds)?d.cuentaIds.map(y=>ht(y,"")):[],v=Tn(d.targetDate);return{_id:ht(d._id,`obj_mig_${l}`),nombre:ht(d.nombre,`Objetivo ${l+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:st(_t(d.targetAmount,0)),fechaLimite:v,prioridad:_t(d.prioridad,l+1),modoAsignacion:v?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(f[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:ht(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[u],e}function jn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===qa)||(e.personas=[Na(),...o]),e}const Yt=t=>Array.isArray(t)?t:[];function ie(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function qn(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function Nn(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Yt(e.loans).map(ie),e.expenses=Yt(e.expenses).map(ie),e.nominas=Yt(e.nominas).map(ie),e.accounts=Yt(e.accounts).map(ie),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Yt(e.planes).filter(qn);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const Rn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Cn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:En},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Dn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:zn},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:jn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:Nn}],Ln=["history"];function Ba(t,a,e){let o=t;const n=[];for(const s of[...Rn].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const yt="state_",re="state__schemaVersion",Pt="financeapp_",Pe="state__modificadoEn";function Ha(t=localStorage,a=Pt){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Pe&&t.setItem(e(Pe),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function On(t=localStorage,a=Pt){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(yt)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function kn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Bn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Hn(t,a){const e=Bn[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function Gn(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Vn({adapter:t,hoy:a=new Date}){const e=V(a),o=Gn(a);let n=La(e,o);const s=new Set;let i=[];const r=kn();function c(E){for(const F of s)F(E)}function u(E){t.set(`${yt}${E}`,n[E])}function m(){const E={};for(const j of Object.keys(n)){const R=t.get(`${yt}${j}`);R!==null&&(E[j]=R)}for(const j of Ln){const R=t.get(`${yt}${j}`);R!==null&&(E[j]=R)}const F=t.get(re),{state:q,applied:D}=Ba(E,F,{hoyISO:e,finISO:o});if(n=q,d(),D.length>0){for(const j of Object.keys(n))u(j);t.set(re,Vt)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Se(e)],u("accounts");return}const E=n.accounts.filter(F=>F.esCuentaPrincipal);if(E.length===0)n.accounts=n.accounts.map((F,q)=>q===0?{...F,esCuentaPrincipal:!0}:F),u("accounts");else if(E.length>1){let F=!1;n.accounts=n.accounts.map(q=>q.esCuentaPrincipal?F?{...q,esCuentaPrincipal:!1}:(F=!0,q):q),u("accounts")}}function l(E){return n[E]}function f(E,F){n[E]=F,u(E),c(E)}function v(E){f("config",{...n.config,...E})}function y(E){return s.add(E),()=>s.delete(E)}function S(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function g(E,F){const q=[...n[E]],D={...F,_id:S()};return q.push(D),f(E,q),D}function x(E,F,q){const D=n[E].map(j=>j._id===F?{...j,...q}:j);f(E,D)}function w(E,F){const q=n[E],D=q.findIndex(j=>j._id===F);D<0||(r.registrar({col:E,item:q[D],indice:D}),f(E,q.filter((j,R)=>R!==D)))}function I(){const E=r.tomar();if(!E)return null;const F=[...n[E.col]];return F.splice(Math.min(E.indice,F.length),0,E.item),f(E.col,F),E}function b(){return r.pendiente()}function h(){const E=n.accounts||[],F=E.find(q=>q.esCuentaPrincipal&&q.activo)||E.find(q=>q.activo);return F?F._id:"default"}function $(E){var F;return((F=n.accounts.find(q=>q._id===E))==null?void 0:F.nombre)??E}function C(){return Gt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function M(){return Gt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function A(){return structuredClone(n)}function _(E,F=null){const{state:q,applied:D}=Ba(E,F,{hoyISO:e,finISO:o});n=q,d();for(const j of Object.keys(n))u(j);t.set(re,Vt);for(const j of Object.keys(n))c(j);return{applied:D}}return{load:m,get:l,set:f,patchConfig:v,subscribe:y,addItem:g,updateItem:x,removeItem:w,deshacerBorrado:I,borradoPendiente:b,getPrincipalAccountId:h,accountName:$,resolverTramosIRPF:C,resolverTramosGanancias:M,snapshot:A,replaceAll:_,get schemaVersion(){return Vt},get migrationsApplied(){return[...i]},get today(){return e||Y()}}}function Un(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const It=Object.keys(La("1970-01-01","1970-01-01"));function Ga(t){const a={};for(const e of It){const o=t.get(`${yt}${e}`);o!=null&&(a[e]=o)}return a}function Yn(t,a){const e=[];for(const o of It){const n=a[o];n!=null&&(t(`${yt}${o}`,n),e.push(o))}return e}function Wn(t){return It.filter(a=>t[a]===void 0||t[a]===null)}function Kn(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!It.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Va=`${Pt}meta_proyectos`,Ua=`${Pt}meta_proyectoActivo`,Ct="default",Jn="Mis finanzas";function Fe(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Wt(t){return t===Ct?Pt:`${Pt}p_${t}_`}function Ya(){return[...It.map(t=>`${yt}${t}`),re,Pe]}function Qn(t=localStorage){function a(){try{const d=t.getItem(Va);if(!d)return[];const l=JSON.parse(d);return Array.isArray(l)?l:[]}catch{return[]}}function e(d){t.setItem(Va,JSON.stringify(d))}function o(){const d=a();if(d.some(v=>v._id===Ct))return d;const l=Date.now(),f=[{_id:Ct,nombre:Jn,creadoEn:l,actualizadoEn:l},...d];return e(f),f}function n(){try{const d=t.getItem(Ua);if(!d)return Ct;const l=JSON.parse(d);return typeof l=="string"&&l?l:Ct}catch{return Ct}}function s(d){t.setItem(Ua,JSON.stringify(d))}function i(d){const l=d.trim()||"Proyecto sin nombre",f=Date.now(),v={_id:Fe(),nombre:l,creadoEn:f,actualizadoEn:f};return e([...o(),v]),v}function r(d,l){const f=l.trim();f&&e(o().map(v=>v._id===d?{...v,nombre:f,actualizadoEn:Date.now()}:v))}function c(d,l){const f=o().find(g=>g._id===d);if(!f)throw new Error("Proyecto no encontrado.");const v=Wt(d),y={_id:Fe(),nombre:(l==null?void 0:l.trim())||`${f.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},S=Wt(y._id);for(const g of Ya()){const x=t.getItem(`${v}${g}`);x!==null&&t.setItem(`${S}${g}`,x)}return e([...o(),y]),y}function u(d){if(d===Ct)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const l=o();if(!l.some(v=>v._id===d))return;const f=Wt(d);for(const v of Ya())t.removeItem(`${f}${v}`);e(l.filter(v=>v._id!==d))}function m(d){const l=new Map(o().map(v=>[v._id,v]));for(const v of d){if(!v||typeof v._id!="string")continue;const y=l.get(v._id);(!y||(v.actualizadoEn??0)>y.actualizadoEn)&&l.set(v._id,v)}const f=[...l.values()];return e(f),f}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:u,fusionarRemotos:m}}function Xn(t,a,e){const o=Ha(t,Wt(a)),n={};for(const s of e){const i=o.get(`${yt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Zn(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Fe())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const et={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},xt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:et.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:et.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:et.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:et.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:et.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:et.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:et.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:et.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:et.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:et.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:et.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:et.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:et.datos,porDefecto:!1,dependencias:["sync-nube"]}],ts=new Map(xt.map(t=>[t.id,t]));function Kt(t){return ts.get(t)}function Wa(t){return xt.filter(a=>(a.dependencias||[]).includes(t))}function De(){const t={};for(const a of xt)t[a.id]=a.porDefecto;return t}function Ka(){const t=[],a=new Map;for(const e of xt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function es(t){function a(){return{...De(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,l=a(),f=new Set){const v=Kt(d);if(!v)return!1;if(v.nucleo)return!0;if(l[d]===!1)return!1;if(f.has(d))return!0;f.add(d);for(const y of v.dependencias||[])if(!o(y,l,f))return!1;return!0}function n(d,l=a()){const f=Kt(d);return f?(f.dependencias||[]).filter(v=>!o(v,l)):[]}function s(d,l){var w;const f=Kt(d);if(!f)return{cambiadas:[]};if(f.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const v=a(),y=new Map(xt.map(I=>[I.id,o(I.id,v)])),S={...v,[d]:l};let g;if(l){const I=[...f.dependencias||[]];for(;I.length;){const b=I.pop();S[b]===!1&&(S[b]=!0,g="dependencias-activadas"),I.push(...((w=Kt(b))==null?void 0:w.dependencias)||[])}}else{const I=Wa(d).map(b=>b.id);for(;I.length;){const b=I.pop();S[b]!==!1&&(S[b]=!1,g="cascada-apagado"),I.push(...Wa(b).map(h=>h.id))}}return e(S),{cambiadas:xt.filter(I=>o(I.id,S)!==y.get(I.id)).map(I=>I.id),motivo:g}}function i(){const d=a();return xt.map(l=>{const f=n(l.id,d);return{...l,activa:o(l.id,d),...f.length>0&&d[l.id]!==!1?{bloqueadaPor:f}:{}}})}function r(){const d=a();return Ka().map(({grupo:l,features:f})=>({grupo:l,features:f.map(v=>{const y=n(v.id,d);return{...v,activa:o(v.id,d),...y.length>0&&d[v.id]!==!1?{bloqueadaPor:y}:{}}})}))}function c(){e(De())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function m(d){const l=d,f=l&&typeof l=="object"&&l.features&&typeof l.features=="object"?l.features:null;if(!f)throw new Error('El perfil no tiene una sección "features" válida');const v=De(),y=[],S=[];for(const[g,x]of Object.entries(f)){if(!Kt(g)){S.push(g);continue}if(typeof x!="boolean"){S.push(g);continue}v[g]=x,y.push(g)}return e(v),{aplicadas:y,ignoradas:S}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:u,importProfile:m,bloqueadaPor:d=>n(d)}}const Jt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function as(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Jt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Jt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Jt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Jt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function os(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Jt(o)}</div>
        ${n.map(as).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function ns(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function ss(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${os(e)}`,n(i)}function n(i){var c,u,m;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var v;const l=d.dataset.featureToggle,f=e.setEnabled(l,d.checked);f.motivo==="dependencias-activadas"&&Ft(t,"Se han activado también las funcionalidades necesarias"),f.motivo==="cascada-apagado"&&Ft(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(v=t.onChange)==null||v.call(t,f.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),l=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),f=URL.createObjectURL(l),v=a.createElement("a");v.href=f,v.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(f),Ft(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var l,f;const d=(l=r.files)==null?void 0:l[0];if(d)try{const{aplicadas:v,ignoradas:y}=e.importProfile(JSON.parse(await d.text()));Ft(t,y.length>0?`Perfil cargado (${v.length} aplicadas, ${y.length} ignoradas por ser de otra versión)`:`Perfil cargado (${v.length} funcionalidades)`),(f=t.onChange)==null||f.call(t,v),o(i)}catch(v){Ft(t,"No se pudo cargar el perfil: "+v.message,"err")}finally{r.value=""}}),(m=i.querySelector('[data-feature-action="reset"]'))==null||m.addEventListener("click",()=>{var d;e.reset(),Ft(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=ns(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const dt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),is={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Ja(t){return is[t]??t}function pt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Qa(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function rs(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function cs(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function ls(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function ds(t,a){const e=t._id===a,o=t._id==="default";return`
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
    </div>`}function us(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${dt(i._id)}">${dt(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${dt(i)}"/> ${dt(Ja(i))}
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
    </div>`}function ps(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function ms(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>ds(u,c)).join("")}
      </div>
      ${ps()}
      ${us(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,u;r.querySelectorAll("[data-proyecto-accion]").forEach(m=>{m.addEventListener("click",()=>{const d=m.dataset.proyectoId,l=m.dataset.proyectoAccion,f=e.listar().find(v=>v._id===d);if(f){if(l==="cambiar"){if(!Qa(t,`¿Cambiar a "${f.nombre}"? Se recargará la página.`))return;e.cambiarA(d),rs(t);return}if(l==="renombrar"){const v=typeof prompt=="function"?prompt("Nuevo nombre",f.nombre):null;if(!v||!v.trim())return;e.renombrar(d,v.trim()),pt(t,"Proyecto renombrado"),n(r);return}if(l==="duplicar"){const v=`${f.nombre} (copia)`,y=typeof prompt=="function"?prompt("Nombre de la copia",v):v;if(y===null)return;const S=e.duplicar(d,y.trim()||v);pt(t,`"${S.nombre}" creado como copia de "${f.nombre}" ✓`),n(r);return}if(l==="eliminar"){if(!Qa(t,`¿Eliminar "${f.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),pt(t,`"${f.nombre}" eliminado`),n(r)}catch(v){pt(t,v.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const m=r.querySelector("#proyecto-nuevo-nombre"),d=m==null?void 0:m.value.trim();if(!d){pt(t,"Ponle un nombre al proyecto","warn");return}const l=e.crear(d);pt(t,`"${l.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var f;const m=(f=r.querySelector("#proyecto-import-origen"))==null?void 0:f.value;if(!m)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(v=>v.dataset.proyectoImportCol);if(d.length===0){pt(t,"Elige al menos una colección para importar","warn");return}const{importadas:l}=e.importarDesde(m,d);if(l.length===0){pt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}pt(t,`Importado: ${l.map(Ja).join(", ")} ✓`),cs(),n(r)})}function i(){const r=ls(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const ce=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],St=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Dt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function fs(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function gs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function vs(t){const a=t.color||ce[0];return`
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
    </div>`}function bs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${ce.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${ce[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function hs(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(vs).join("")}
      </div>
      ${bs()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var m;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.personaId,f=d.dataset.personaAccion,v=e.get("personas"),y=v.find(S=>S._id===l);if(y){if(f==="renombrar"){const S=typeof prompt=="function"?prompt("Nuevo nombre",y.nombre):null;if(!S||!S.trim())return;e.updateItem("personas",l,{nombre:S.trim()}),Dt(t,"Persona renombrada"),s(),n(c);return}if(f==="defecto"){e.set("personas",v.map(S=>({...S,esPorDefecto:S._id===l}))),Dt(t,`"${y.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(f==="activo"){e.updateItem("personas",l,{activo:!y.activo}),s(),n(c);return}if(f==="eliminar"){if(v.length<=1){Dt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!fs(t,`¿Eliminar "${y.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",l),Dt(t,`"${y.nombre}" eliminada`),s(),n(c)}}})});const u=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const l=d.getAttribute("data-persona-color");u&&(u.value=l),c.querySelectorAll("[data-persona-color]").forEach(f=>{f.style.border=f.getAttribute("data-persona-color")===l?"2px solid white":"2px solid transparent"})})}),(m=c.querySelector("#persona-nuevo-btn"))==null||m.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),l=d==null?void 0:d.value.trim();if(!l){Dt(t,"Ponle un nombre a la persona","warn");return}const f=(u==null?void 0:u.value)||ce[0],v=e.addItem("personas",{nombre:l,color:f,esPorDefecto:!1,activo:!0});Dt(t,`"${v.nombre}" creada ✓`),s(),n(c)})}function r(){const c=gs(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const Xa={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Za(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function ys({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([u,m])=>[m,u]);for(const[u,m]of[...Object.entries(Xa),...c]){const d=t.isEnabled(u),l=a.querySelector(`.nav-btn[data-view="${m}"]`);l&&(l.style.display=d?"":"none"),!d&&n()===m&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(u=>{const m=[...u.querySelectorAll(".nav-btn[data-view]")];if(m.length===0)return;const d=m.some(l=>l.style.display!=="none");u.style.display=d?"":"none"}),Za(a,u=>t.isEnabled(u)),r){const u=e??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const u=new MutationObserver(()=>{if(!c){c=!0;try{Za(a,m=>t.isEnabled(m))}finally{c=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>Xa[r]}}const xs="toast toast-deshacer";function $s(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(d){const l=n();if(!l)return;c();const f=document.createElement("div");f.className=xs,f.style.display="flex",f.style.alignItems="center",f.style.gap="12px";const v=document.createElement("span");v.textContent=`${Hn(d.col,d.item)} se ha eliminado.`,v.style.flex="1";const y=document.createElement("button");y.type="button",y.className="btn-secondary btn-sm",y.textContent="Deshacer",y.style.flexShrink="0",y.addEventListener("click",()=>{const S=a.deshacerBorrado();if(c(),!S)return;const g=n();if(g){const x=document.createElement("div");x.className="toast toast-ok",x.textContent="Deshecho.",g.appendChild(x),setTimeout(()=>x.remove(),2500)}e==null||e()}),f.appendChild(v),f.appendChild(y),l.appendChild(f),s=f,i=setTimeout(c,o)}const m=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,u(d))});return()=>{m(),c()}}function le(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function to(t,a){const e=le(t),o=le(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Qt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function ws(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Qt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Qt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Qt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Qt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Qt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Is(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=le(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of ws(t)){if(!i(c.ruta))continue;const u=to(c.titulo,s),m=u>=0?-1:Math.min(to(c.extra??"",s),2);if(u<0&&m<0)continue;const d=u>=0?u:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,le(c.titulo).length)})}return r.sort((c,u)=>c.peso-u.peso||c.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Cs="buscador-overlay",eo="btn-buscador";function Ss(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const I=a.createElement("div");I.id=Cs,I.className="modal-overlay",I.style.alignItems="flex-start",I.style.paddingTop="10vh";const b=a.createElement("div");b.className="modal-box",b.style.maxWidth="560px",b.style.padding="14px";const h=a.createElement("input");h.type="search",h.className="form-input",h.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",h.setAttribute("aria-label","Buscar en toda la aplicación"),h.autocomplete="off";const $=a.createElement("div");return $.style.marginTop="10px",$.style.maxHeight="52vh",$.style.overflowY="auto",b.appendChild(h),b.appendChild($),I.appendChild(b),a.body.appendChild(I),I.addEventListener("click",C=>{C.target===I&&y()}),h.addEventListener("input",()=>{r=0,m()}),h.addEventListener("keydown",f),o=I,n=h,s=$,I}function u(){if(s){if(s.textContent="",i.length===0){const I=a.createElement("div");I.style.padding="14px 4px",I.style.fontSize="13px",I.style.color="var(--text3)";const b=(n==null?void 0:n.value.trim())??"";I.textContent=b.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(I);return}i.forEach((I,b)=>{const h=a.createElement("button");h.type="button",h.className="buscador-fila",h.dataset.indice=String(b),b===r&&h.classList.add("activa");const $=a.createElement("div");$.style.minWidth="0";const C=a.createElement("div");C.textContent=I.titulo,C.style.fontSize="13px",C.style.overflow="hidden",C.style.textOverflow="ellipsis",C.style.whiteSpace="nowrap";const M=a.createElement("div");M.textContent=I.detalle,M.style.fontSize="11px",M.style.color="var(--text3)",M.style.overflow="hidden",M.style.textOverflow="ellipsis",M.style.whiteSpace="nowrap",$.appendChild(C),I.detalle&&$.appendChild(M);const A=a.createElement("span");A.className="tag",A.textContent=I.etiqueta,A.style.flexShrink="0",h.appendChild($),h.appendChild(A),h.addEventListener("click",()=>l(b)),s.appendChild(h)})}}function m(){const I=(n==null?void 0:n.value)??"";i=Is(t.estado(),I,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d(I){var b,h;i.length!==0&&(r=(r+I+i.length)%i.length,u(),(h=(b=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:b.scrollIntoView)==null||h.call(b,{block:"nearest"}))}function l(I){const b=i[I];b&&(y(),t.navegar(b.ruta))}function f(I){I.key==="Escape"?(I.preventDefault(),y()):I.key==="ArrowDown"?(I.preventDefault(),d(1)):I.key==="ArrowUp"?(I.preventDefault(),d(-1)):I.key==="Enter"&&(I.preventDefault(),l(r))}function v(){const I=o??c();I.classList.remove("hidden"),I.style.display="",r=0,n&&(n.value="",n.focus()),m()}function y(){o&&(o.style.display="none",i=[])}function S(){return!!o&&o.style.display!=="none"}function g(I){(I.ctrlKey||I.metaKey)&&(I.key==="k"||I.key==="K")&&(I.preventDefault(),S()?y():v())}a.addEventListener("keydown",g);let x=null;function w(){const I=a.getElementById("period-bar");if(!I||a.getElementById(eo))return;const b=a.createElement("button");b.id=eo,b.type="button",b.className="btn-secondary",b.title="Buscar en toda la aplicación (Ctrl+K)",b.setAttribute("aria-label","Buscar"),b.textContent="🔍 Buscar",b.style.marginLeft="auto",b.addEventListener("click",v),I.appendChild(b),x=b}return w(),()=>{a.removeEventListener("keydown",g),x==null||x.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Te="aviso-guardado";function As(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function u(){var v;r&&clearTimeout(r),r=null,(v=a.getElementById(Te))==null||v.remove()}function m(){if(s==="oculto")return u();const v=e();if(!v)return;let y=a.getElementById(Te);y||(y=a.createElement("div"),y.id=Te,v.appendChild(y)),y.className=`toast toast-guardado toast-guardado--${s}`,y.style.display="flex",y.style.alignItems="center",y.style.gap="12px",y.textContent="";const S=a.createElement("span");if(S.style.flex="1",y.appendChild(S),s==="pendiente")S.textContent="Tienes cambios sin guardar.",y.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void l())),y.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",m()}));else if(s==="subiendo"){S.textContent="Subiendo…";const g=a.createElement("span");g.className="guardado-giro",g.setAttribute("aria-hidden","true"),y.appendChild(g)}else s==="guardado"?S.textContent="¡Guardado!":s==="error"&&(S.textContent="No se ha podido guardar.",y.appendChild(d("Reintentar","btn-primary btn-sm",()=>void l())))}function d(v,y,S){const g=a.createElement("button");return g.type="button",g.className=y,g.textContent=v,g.style.flexShrink="0",g.addEventListener("click",S),g}async function l(){if(c)return c;r&&clearTimeout(r);const v=t.cambios.revision();return s="subiendo",m(),c=(async()=>{try{await t.guardar(),n.alDia(v),s="guardado",m(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),m()},o)}catch(y){console.error("[guardado] no se ha podido subir la copia:",y),s=t.hayDestino()?"error":"oculto",m()}finally{c=null}})(),c}const f=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",m()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:l,detener(){f(),u()}}}function Ms({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(v){return`view-${v}`}function s(v){const y=t.getElementById(n(v.route));if(y)return y;const S=t.querySelector(".view-container");if(!S)return null;const g=t.createElement("div");return g.id=n(v.route),g.className="view hidden",S.appendChild(g),g}function i(v){if(t.querySelector(`.nav-btn[data-view="${v.route}"]`))return;const y=t.querySelectorAll(".nav-section"),S=y[v.seccion??Math.max(0,y.length-1)];if(!S)return;const g=t.createElement("button");g.className="nav-btn",g.dataset.view=v.route,g.innerHTML=`${v.iconoPath?`<svg viewBox="0 0 24 24"><path d="${v.iconoPath}"/></svg>`:""}<span>${v.nombre}</span>`,S.appendChild(g),g.addEventListener("click",()=>{const x=globalThis.Router;x==null||x.navigate(v.route)})}function r(v){e.set(v.route,v),s(v),i(v)}function c(){return[...e.keys()].filter(v=>{const y=e.get(v);return!a||a(y.flagId??y.id)})}function u(v){return c().includes(v)}function m(v){const y=e.get(v);if(!y||a&&!a(y.flagId??y.id))return!1;const S=s(y);if(!S)return!1;if(o&&o!==v){const g=e.get(o),x=t.getElementById(n(o));g!=null&&g.unmount&&x&&g.unmount(x)}return y.mount(S),o=v,!0}function d(){o&&m(o)}function l(){const v={};for(const[y,S]of e)v[y]=S.flagId??S.id;return v}function f(){for(const v of e.values())s(v),i(v)}return{register:r,routes:c,has:u,mount:m,rerender:d,flagPorRuta:l,attachToShell:f,get activa(){return o}}}function p(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function mt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${p(P(t))}</span>`}function ao(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function ze(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${p(a)}</span>`).join(" ")}const Es=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Xt(t){const[a,e]=t.split("-").map(Number);return`${Es[e-1]} ${a}`}function z(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function at(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function T(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function H(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function rt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function oo(t,a){const e=parseFloat(rt(t,a));return Number.isFinite(e)?e:0}const _s="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function je(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Ps(t){const{store:a}=t,e=t.hoy??Y,o=()=>L(e()),n=()=>a.get("config").margenesSeguridad??[];function s(f){var v;a.patchConfig({margenesSeguridad:f}),(v=t.onDatosCambiados)==null||v.call(t)}function i(f,v){const y=n().map(g=>({...g,puntos:(g.puntos??[]).map(x=>({...x}))})),S=y.find(g=>g._id===f);S&&(v(S),s(y))}function r(f){const v=a.get("config"),y=Ce(f,a.get("expenses"),v,a.get("loans"),e(),!1,o());return P(y)}function c(f,v,y){const S=v.tipo==="fijo",g=S?"":`<span class="text-sm" style="color:var(--text3)">${p(P((v.meses??0)*y))}</span>`;return`
      <tr data-punto="${p(v._id)}" data-margen="${p(f._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${p(v.fecha)}" data-campo="fecha"/>
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
      </tr>`}function u(f,v,y){const S=f.cuentas&&f.cuentas.length>0?f.cuentas.map(I=>{var b;return((b=v.find(h=>h._id===I))==null?void 0:b.nombre)??I}).join(", "):"Todas las cuentas activas",x=[...f.puntos??[]].sort((I,b)=>I.fecha.localeCompare(b.fecha)).map(I=>c(f,I,y)).join(""),w=f.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${p(S)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${p(r(f))}</strong>
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
            ${x||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${p(f._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${p(f.nombre)}</span>
            <span class="badge ${f.activo?"badge-active":"badge-inactive"}">${f.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${f.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${f.activo?"checked":""} data-toggle-margen="${p(f._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${p(f._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${p(f._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${w}
      </div>`}function m(f,v){const y=v?n().find(w=>w._id===v):null,S=a.get("accounts").filter(w=>w.activo),g=new Set((y==null?void 0:y.cuentas)??[]),x=S.map(w=>`
        <label class="tag" data-chip="${p(w._id)}" style="cursor:pointer;${g.has(w._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${p(w._id)}" ${g.has(w._id)?"checked":""} style="display:none"/>
          ${p(w.nombre)}
        </label>`).join(" ");f.innerHTML=`
      <div class="modal-title">${v?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${p((y==null?void 0:y.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${x||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${y?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${p(Y())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${p(v??"")}">Guardar</button>
      </div>`}function d(f,v){const y=document.getElementById("modal-overlay"),S=document.getElementById("modal-content");!y||!S||(m(S,f),y.classList.remove("hidden"),H(S,".mg-acc-chip",g=>{const x=g,w=S.querySelector(`[data-chip="${x.value}"]`);w&&(w.style.cssText=`cursor:pointer;${x.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),H(S,"#mg-p-tipo",g=>{const x=g.value==="fijo",w=S.querySelector("#mg-p-importe-wrap"),I=S.querySelector("#mg-p-meses-wrap");w&&(w.style.display=x?"":"none"),I&&(I.style.display=x?"none":"")}),T(S,"[data-cerrar-form]",()=>y.classList.add("hidden")),T(S,"[data-guardar-margen]",g=>{var h,$,C,M,A;const x=g.getAttribute("data-guardar-margen")||"",w=((h=S.querySelector("#mg-nombre"))==null?void 0:h.value.trim())??"";if(!w)return z("El nombre es obligatorio","err");const I=[...S.querySelectorAll(".mg-acc-chip:checked")].map(_=>_.value),b=n().map(_=>({..._}));if(x){const _=b.findIndex(E=>E._id===x);if(_===-1)return z("Margen no encontrado","err");b[_]={...b[_],nombre:w,cuentas:I}}else{const _=(($=S.querySelector("#mg-p-tipo"))==null?void 0:$.value)??"fijo",E={_id:je(),fecha:((C=S.querySelector("#mg-p-fecha"))==null?void 0:C.value)||Y(),tipo:_,importe:parseFloat(((M=S.querySelector("#mg-p-importe"))==null?void 0:M.value)??"0")||0,meses:parseFloat(((A=S.querySelector("#mg-p-meses"))==null?void 0:A.value)??"1")||1};b.push({_id:je(),nombre:w,activo:!0,cuentas:I,puntos:[E]})}s(b),z(x?"Margen actualizado":"Margen creado"),y.classList.add("hidden"),v()}))}function l(f){const v=n(),y=a.get("accounts"),S=Ht(a.get("expenses"),o());f.innerHTML=`
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
             </div>`:v.map(x=>u(x,y,S)).join("")}`;const g=()=>l(f);T(f,"[data-nuevo-margen]",()=>d(null,g)),T(f,"[data-editar-margen]",x=>d(x.getAttribute("data-editar-margen"),g)),T(f,"[data-borrar-margen]",x=>{at("¿Eliminar este margen de seguridad?")&&(s(n().filter(w=>w._id!==x.getAttribute("data-borrar-margen"))),z("Margen eliminado"),g())}),H(f,"[data-toggle-margen]",x=>{const w=x.getAttribute("data-toggle-margen");i(w,I=>{I.activo=x.checked}),g()}),T(f,"[data-add-punto]",x=>{const w=x.getAttribute("data-add-punto");i(w,I=>{I.puntos=[...I.puntos??[],{_id:je(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),g()}),T(f,"[data-borrar-punto]",x=>{const w=x.closest("[data-punto]");if(!w)return;const I=w.dataset.margen,b=w.dataset.punto;i(I,h=>{h.puntos=(h.puntos??[]).filter($=>$._id!==b)}),g()}),H(f,"[data-campo]",x=>{const w=x.closest("[data-punto]");if(!w)return;const I=x.getAttribute("data-campo"),b=x.value;i(w.dataset.margen,h=>{const $=(h.puntos??[]).find(C=>C._id===w.dataset.punto);$&&(I==="fecha"?$.fecha=b:I==="tipo"?$.tipo=b:I==="importe"?$.importe=parseFloat(b)||0:$.meses=parseFloat(b)||0)}),g()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:_s,mount:l}}const Fs=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],Ds=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Ts=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function zs(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const qe=(t,a)=>t.map(([e,o])=>`<option value="${p(e)}"${e===a?" selected":""}>${p(o)}</option>`).join("");function no(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=zs(t),i=qe(Fs.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${p(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${qe(Ds,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${qe(Ts,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function so(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function io(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const js={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function qs(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Tt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const u=s.has(c._id),m=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${p(o)}" value="${p(c._id)}"${u?" checked":""}/>
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
      ${qs(e,a).map(r).join("")}
    </div>
  </div>`}function zt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function jt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,u=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),m=u?parseFloat(u.value):NaN;return Number.isFinite(m)?{personaId:c,valor:m}:{personaId:c}});return{modo:o,participantes:s}}function ro(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${js[t.modo]})`}function Ne(t,a,e){const o=ro(t,e),n=ro(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Ns="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Rs=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ls(t){const a=t.hoy??Y,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},n=()=>t.store.get("accounts"),s=g=>{var x;return((x=n().find(w=>w._id===(g||"default")))==null?void 0:x.nombre)??(g||"default")};function i(){const g=a();let x=[...t.store.get("expenses")];if(e.mostrarExpirados||(x=x.filter(w=>!w.fechaFin||w.fechaFin>=g)),e.tipo&&(x=x.filter(w=>w.tipo===e.tipo)),e.cuenta&&(x=x.filter(w=>(w.cuenta||"default")===e.cuenta)),e.desde&&(x=x.filter(w=>(w.fechaInicio??"")>=e.desde)),e.hasta&&(x=x.filter(w=>(w.fechaInicio??"")<=e.hasta)),e.busqueda){const w=e.busqueda.toLowerCase();x=x.filter(I=>I.concepto.toLowerCase().includes(w))}return e.tags.size>0&&(x=x.filter(w=>(w.tags||[]).some(I=>e.tags.has(I)))),x.sort((w,I)=>{const b=w[e.orden]??"",h=I[e.orden]??"";return typeof b=="number"&&typeof h=="number"?(b-h)*e.sentido:String(b).localeCompare(String(h))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(g=>g.tags||[]))].filter(Boolean).sort()}function c(g,x){const w=e.orden===g?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${g}">${p(x)} <span class="sort-arrow">${w}</span></span>`}function u(g,x=!1){return(x?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${p(I._id)}"${I._id===g?" selected":""}>${p(I.nombre)}</option>`).join("")}function m(g){const x=g.tipo==="transferencia",w=Ne(g.repartoConsumo,g.repartoPago,t.store.get("personas")),I=he(g.diaPago??""),b=g.tipoFrecuencia==="extraordinario"?"Único":`Cada ${g.frecuencia??1} ${g.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${I?` · ${I}`:""}`,h=!!g.fechaFin&&g.fechaFin<a(),$=x?'<span class="badge badge-purple">⇄ transf.</span>':g.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',C=x?`${p(s(g.cuenta))} → ${p(s(g.cuentaDestino))}`:p(s(g.cuenta)),M=(g.tags||[]).map(A=>`<span class="tag${e.tags.has(A)?" active":""}" data-tag="${p(A)}" title="Filtrar por ${p(A)}">${p(A)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(g.concepto)}</div>
        <div class="tag-list mt-4">${M}</div>
      </div>
      <div>${$}</div>
      <div class="num ${g.tipo==="ingreso"?"pos":x?"":"neg"}">${x?"⇄ ":""}${p(P(g.cuantia))}</div>
      <div class="text-sm">${p(b)}</div>
      <div class="text-sm exp-col-hide">${C}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${p(g._id)}"${g.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${g.tipo==="gasto"&&g.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${g.tipo==="gasto"&&g.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${g.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${g.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${p(g.ajustadaEn??"")}">ajustada</span>`:""}
        ${w?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(w)}">👥 reparto</span>`:""}
        ${h?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${p(g._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${p(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${p(g._id)}">✕</button>
      </div>
    </div>`}function d(g){const x=i(),w=r();g.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${u(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${p(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${p(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${w.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${w.map(I=>`<span class="tag${e.tags.has(I)?" active":""}" data-tag="${p(I)}">${p(I)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${x.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':x.map(m).join("")}
      </div>`}function l(g){const x=(g==null?void 0:g.tipo)==="transferencia",w=t.store.get("personas"),I=(b,h,$,C,M="")=>`<div class="form-group"><label class="form-label">${p(h)}</label>
       <input class="form-input" type="${$}" id="${b}" value="${p(C)}" placeholder="${p(M)}"/></div>`;return`
      <div class="grid-2">
        ${I("ef-concepto","Concepto","text",(g==null?void 0:g.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(g==null?void 0:g.tipo)==="gasto"||!(g!=null&&g.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(g==null?void 0:g.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${x?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${I("ef-cuantia","Cuantía (€)","number",(g==null?void 0:g.cuantia)??"","500")}
        ${I("ef-frecuencia","Frecuencia","number",(g==null?void 0:g.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Rs.map(([b,h])=>`<option value="${b}"${((g==null?void 0:g.tipoFrecuencia)??"mensual")===b?" selected":""}>${p(h)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${I("ef-fecha-ini","Fecha inicio","date",(g==null?void 0:g.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((g==null?void 0:g.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${x?"":' style="display:none"'}>
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
          <div class="mt-8">${I("ef-fecha-fin","Fecha fin (opcional)","date",(g==null?void 0:g.fechaFin)??"")}</div>
          <div class="mt-8">${no(g==null?void 0:g.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${x?' style="display:none"':""}>
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
              <input class="form-input" type="text" id="ef-tags" value="${p(((g==null?void 0:g.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
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
          ${x?"":`${Tt("Reparto de consumo",g==null?void 0:g.repartoConsumo,w,"consumo")}
                 ${Tt("Reparto de pago",g==null?void 0:g.repartoPago,w,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${p((g==null?void 0:g._id)??"")}">Guardar</button>
      </div>`}function f(g){var I;const x=((I=g.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",w=(b,h)=>{const $=g.querySelector(b);$&&($.style.display=h?"":"none")};w("#ef-destino-wrap",x==="transferencia"),w("#ef-basico-wrap",x!=="transferencia"),w("#ef-irpf-wrap",x==="ingreso"),w("#ef-clasificacion-wrap",x==="gasto")}function v(g,x,w){const I=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");!I||!b||(b.innerHTML=`<div class="modal-title">${p(x)}</div>${l(g)}`,I.classList.remove("hidden"),H(b,"#ef-tipo",()=>f(b)),H(b,"[data-dp-modo]",()=>so(b)),H(b,'[data-reparto-modo="consumo"]',()=>zt(b,"consumo")),H(b,'[data-reparto-modo="pago"]',()=>zt(b,"pago")),T(b,"[data-cancelar]",()=>I.classList.add("hidden")),T(b,"[data-guardar]",h=>{y(b,h.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),w())}))}function y(g,x){const w=_=>{var E;return((E=g.querySelector(_))==null?void 0:E.value)??""},I=_=>{var E;return!!((E=g.querySelector(_))!=null&&E.checked)},b=w("#ef-tipo")||"gasto",h=b==="transferencia",$=w("#ef-concepto").trim(),C=parseFloat(w("#ef-cuantia"));if(!$||!Number.isFinite(C))return z("Concepto y cuantía obligatorios","err"),!1;const M=w("#ef-clasificacion"),A={concepto:$,tipo:b,cuantia:C,frecuencia:parseInt(w("#ef-frecuencia"),10)||1,tipoFrecuencia:w("#ef-tipo-frec")||"mensual",fechaInicio:w("#ef-fecha-ini"),fechaFin:w("#ef-fecha-fin")||null,diaPago:io(g),cuenta:w("#ef-cuenta"),cuentaDestino:h?w("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!h&&I("#ef-basico"),sujetoIRPF:!h&&I("#ef-sujetoIRPF"),clasificacion:b==="gasto"?M||null:void 0,tags:h?["transferencia"]:w("#ef-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:h?void 0:jt(g,"consumo"),repartoPago:h?void 0:jt(g,"pago")};return x?(t.store.updateItem("expenses",x,A),z("Actualizado")):(t.store.addItem("expenses",A),z("Creado")),o(),!0}function S(g,x){const w=g.querySelector("[data-busqueda]");let I;w==null||w.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{e.busqueda=w.value,x();const b=g.querySelector("[data-busqueda]");b==null||b.focus(),b==null||b.setSelectionRange(b.value.length,b.value.length)},250)}),H(g,"[data-expirados]",b=>{e.mostrarExpirados=b.checked,x()}),H(g,"[data-f-tipo]",b=>{e.tipo=b.value,x()}),H(g,"[data-f-cuenta]",b=>{e.cuenta=b.value,x()}),H(g,"[data-f-desde]",b=>{e.desde=b.value,x()}),H(g,"[data-f-hasta]",b=>{e.hasta=b.value,x()}),T(g,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,x()}),T(g,"[data-limpiar-tags]",()=>{e.tags=new Set,x()}),T(g,"[data-tag]",b=>{const h=b.getAttribute("data-tag");e.tags.has(h)?e.tags.delete(h):e.tags.add(h),x()}),T(g,"[data-orden]",b=>{const h=b.getAttribute("data-orden");e.orden===h?e.sentido=e.sentido===1?-1:1:(e.orden=h,e.sentido=1),x()}),T(g,"[data-nuevo]",()=>v(null,"Nuevo gasto/ingreso",x)),T(g,"[data-editar]",b=>{const h=t.store.get("expenses").find($=>$._id===b.getAttribute("data-editar"));h&&v(h,"Editar",x)}),T(g,"[data-duplicar]",b=>{const h=t.store.get("expenses").find(M=>M._id===b.getAttribute("data-duplicar"));if(!h)return;const{_id:$,...C}=h;v({...C,concepto:`${h.concepto} (copia)`},"Duplicar movimiento",x)}),T(g,"[data-borrar]",b=>{at("¿Eliminar?")&&(t.store.removeItem("expenses",b.getAttribute("data-borrar")),z("Eliminado"),o(),x())}),H(g,"[data-activo]",b=>{const h=b;t.store.updateItem("expenses",h.getAttribute("data-activo"),{activo:h.checked}),o(),x()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ns,mount(g){const x=()=>d(g);d(g),g.dataset.wired!=="1"&&(S(g,x),g.dataset.wired="1")}}}function de(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=ft(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function co(t,a,e,o){return t.reduce((n,s)=>{const i=ft(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Os(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=J({...t,amortizaciones:o.slice(0,s)}),r=J({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:de(i.tabla,a,e)-de(r.tabla,a,e)}})}const Re=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${p(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function ks(t,a){const e=ca(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?la(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?da(t.tin||0,i):null,c=o&&n?Os(t,a.periodos,a.hoy):[],u=c.length?de(e.sinAmort.tabla,a.periodos,a.hoy)-de(e.tabla,a.periodos,a.hoy):null,m=u===null?null:u-e.costeTotalAmort,d=s?co(e.tabla,a.periodos,a.hoy,e.comAp):null,l=s&&o?co(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${p(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${p(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const f=Ne(t.repartoConsumo,t.repartoPago,a.personas);return f?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p(f)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(f=>`<span class="tag">${p(f)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${p(t.tin)}%</span>
        <span class="text-sm">${p(P(e.cuota))}/mes</span>
        <span class="text-sm">${p(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${p(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${p(t._id)}">

      <div class="grid-4 mb-12">
        ${Re("Cuota mensual",p(P(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${p(P(a.cuotaMes))}</div>`:"")}
        ${Re("Total intereses",p(P(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(P(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${p(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${p(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Re("Total pagado",p(P(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${p(P(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${p(na(e.tae))}</div></div>
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
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${p(P(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${p(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${p(he(t.diaPago))}</div></div>`:""}
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
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${p(P(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${p(P(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(P(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${p(P(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(m??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${p(P(m??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${p(P(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${p(P(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${p(P(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?Bs(t,e.totalPagado,d,l):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(f=>Hs(f,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((f,v)=>Gs(t._id,f,c[v]??null)).join("")}`:""}
    </div>
  </div>`}function Bs(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${p(P(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${p(P(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${p(P(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${p(P(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${p(P(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${p(P(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Hs(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=ft(e.periodos,e.hoy,t.fecha);o=p(P(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":p(t.mes)}</td>
    <td class="num">${p(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":p(P(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${p(P(t.interes))}</td>
    <td class="num">${p(P(t.amortizacion))}</td>
    <td class="num">${p(P(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Gs(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${p(a.fecha)}</span>
    <span class="num">${p(P(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${p(P(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${p(P(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${p(t)}|${p(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${p(t)}|${p(a._id)}">✕</button>
  </div>`}const Z=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,Zt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,te=(t,a,e,o="")=>`<label class="form-label">${p(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${p(o)}</span>`:""}`,Vs=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${p(e._id)}"${e._id===a?" selected":""}>${p(e.nombre)}</option>`).join("");function Us(t,a,e,o=Y()){return`
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
            <select class="form-select" id="f-cuenta">${Vs(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${no(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Zt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Z("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Z("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${p(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${te("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Tt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Tt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${te("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${te("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${te("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ys(t,a,e=Y()){return`
    <div class="grid-2">
      ${Z("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${Z("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Zt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${te("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${p(t)}|${p((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Ws="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Ks(t){const a=t.hoy??Y;let e=!1;const o=new Set;let n=null;const s=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};function i(h){const $=h.filter(M=>M.activo);if($.length<2)return"";const C=(M,A)=>`<button class="btn-secondary btn-sm" data-persona-tab="${M===null?"":p(M)}"
               style="${n===M?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p(A)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${C(null,"Todas")}
      ${$.map(M=>C(M._id,M.nombre)).join("")}
    </div>`}function r(h){if(!h.activo||h.simulacion)return!1;const $=J(h).tabla.filter(C=>!C.esAmortizacion);return $.length===0?!0:$[$.length-1].fecha<a()}function c(h,$){const C=a(),M=C.slice(0,7),A=new Map;let _=0;for(const E of h){if(!E.activo||E.simulacion||$.has(E._id)||(E.fechaInicio||"")>C)continue;const F=J(E).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(M)),q=F.length>0?F[0].cuota:0;A.set(E._id,q),_+=q}return{porLoan:A,total:_,activos:[...A.values()].filter(E=>E>0).length}}function u(h){const $=a().slice(0,7),C=[];for(const M of h){if(!M.activo||M.simulacion)continue;const A=J(M).tabla.filter(E=>!E.esAmortizacion),_=A[A.length-1];_&&_.fecha.slice(0,7)===$&&C.push({loan:M,cuota:_.cuota})}return C}function m(h){return h.length<=1?h[0]??"":`${h.slice(0,-1).join(", ")} y ${h[h.length-1]}`}function d(h){const $=t.store.get("config"),C=$.dashboardStart,M=$.dashboardEnd,A=Math.max(1,(L(M).getTime()-L(C).getTime())/(30.44*864e5));let _=0;for(const E of h)!E.activo||E.simulacion||(_+=J(E).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=C&&F.fecha<=M).reduce((F,q)=>F+q.cuota,0));return{media:_/A,desde:C,hasta:M}}function l(h){const $=t.store.get("personas"),C=ne($),M=[...t.store.get("loans")].sort((N,G)=>G.tin-N.tin),A=n?M.filter(N=>xe(N.repartoConsumo,N.repartoPago,C).has(n)):M,_=new Set(A.filter(r).map(N=>N._id)),E=e?A:A.filter(N=>!_.has(N._id)),F=c(M,new Set(M.filter(r).map(N=>N._id))),q=d(M),D=u(M),j=t.store.get("config"),R=t.store.get("inflacion"),O=new Date(L(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${_.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${_.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i($)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${p(m(D.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${p(P(D.reduce((N,G)=>N+G.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||q.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${p(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${p(P(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${q.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${p(P(q.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${p(q.desde)} → ${p(q.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${E.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':E.map(N=>ks(N,{periodos:R,usarInflacion:!!j.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:_.has(N._id),personas:$})).join("")}
      </div>`;for(const N of h.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const f=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),y=()=>{var h;return(h=f())==null?void 0:h.classList.add("hidden")};function S(h,$){const C=f(),M=v();return!C||!M?null:(M.innerHTML=`<div class="modal-title">${p(h)}</div>${$}`,C.classList.remove("hidden"),T(M,"[data-cancelar]",y),M)}function g(h,$){const C=h?t.store.get("loans").find(A=>A._id===h)??null:null,M=S(h?"Editar préstamo":"Nuevo préstamo",Us(C,t.store.get("accounts"),t.store.get("personas"),a()));M&&(M.addEventListener("change",A=>{const _=A.target;_!=null&&_.matches("[data-dp-modo]")&&so(M),_!=null&&_.matches('[data-reparto-modo="consumo"]')&&zt(M,"consumo"),_!=null&&_.matches('[data-reparto-modo="pago"]')&&zt(M,"pago")}),T(M,"[data-guardar-loan]",A=>{x(M,A.getAttribute("data-guardar-loan")||"")&&(y(),$())}))}function x(h,$){const C=D=>{var j;return((j=h.querySelector(D))==null?void 0:j.value)??""},M=D=>{var j;return!!((j=h.querySelector(D))!=null&&j.checked)},A=C("#f-nombre").trim(),_=parseFloat(C("#f-capital")),E=parseFloat(C("#f-tin")),F=parseInt(C("#f-meses"),10);if(!A||!Number.isFinite(_)||!Number.isFinite(E)||!Number.isFinite(F))return z("Completa los campos obligatorios","err"),!1;const q={nombre:A,capital:_,tin:E,meses:F,fechaInicio:C("#f-fecha"),comisionApertura:parseFloat(C("#f-com-ap"))||0,comisionAmort:parseFloat(C("#f-com-am"))||0,diaPago:io(h),cuenta:C("#f-cuenta"),simulacion:M("#f-sim"),activo:M("#f-activo"),mostrarFechaFinEnDashboard:M("#f-mostrar-fin"),tipoTasa:C("#f-tipo-tasa"),basico:M("#f-basico"),tags:C("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:jt(h,"consumo"),repartoPago:jt(h,"pago")};return $?(t.store.updateItem("loans",$,q),z("Préstamo actualizado")):(t.store.addItem("loans",{...q,amortizaciones:[]}),z("Préstamo creado")),s(),!0}function w(h,$,C){const M=t.store.get("loans").find(E=>E._id===h);if(!M)return;const A=$?(M.amortizaciones||[]).find(E=>E._id===$)??null:null,_=S($?"Editar amortización":"Añadir amortización",Ys(h,A,a()));_&&T(_,"[data-guardar-amort]",E=>{const[F,q]=(E.getAttribute("data-guardar-amort")||"").split("|");I(_,F,q)&&(y(),C([F]))})}function I(h,$,C){var j;const M=R=>{var O;return((O=h.querySelector(R))==null?void 0:O.value)??""},A=M("#am-fecha"),_=parseFloat(M("#am-cant"));if(!A||!Number.isFinite(_)||_<=0)return z("Fecha y cantidad requeridas","err"),!1;const E=t.store.get("loans").find(R=>R._id===$);if(!E)return!1;const F={fecha:A,cantidad:_,tipo:M("#am-tipo"),simulacion:!!((j=h.querySelector("#am-sim"))!=null&&j.checked)},q=E.amortizaciones||[],D=C?q.map(R=>R._id===C?{...R,...F}:R):[...q,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",$,{amortizaciones:D}),z(C?"Amortización actualizada":"Amortización añadida"),s(),!0}function b(h,$){T(h,"[data-toggle-finalizados]",()=>{e=!e,$()}),T(h,"[data-persona-tab]",C=>{n=C.getAttribute("data-persona-tab")||null,$()}),T(h,"[data-nuevo-loan]",()=>g(null,$)),T(h,"[data-toggle-loan]",(C,M)=>{var F;if((F=M.target)!=null&&F.closest("button"))return;const A=C.getAttribute("data-toggle-loan"),_=[...h.querySelectorAll("[data-body-loan]")].find(q=>q.dataset.bodyLoan===A);(_==null?void 0:_.classList.toggle("open"))?o.add(A):o.delete(A)}),T(h,"[data-editar-loan]",C=>g(C.getAttribute("data-editar-loan"),$)),T(h,"[data-borrar-loan]",C=>{if(!at("¿Eliminar préstamo?"))return;const M=C.getAttribute("data-borrar-loan");t.store.removeItem("loans",M),o.delete(M),z("Eliminado"),s(),$()}),T(h,"[data-amort-loan]",C=>{const M=C.getAttribute("data-amort-loan");o.add(M),w(M,null,$)}),T(h,"[data-editar-amort]",C=>{const[M,A]=(C.getAttribute("data-editar-amort")||"").split("|");o.add(M),w(M,A,$)}),T(h,"[data-borrar-amort]",C=>{const[M,A]=(C.getAttribute("data-borrar-amort")||"").split("|"),_=t.store.get("loans").find(E=>E._id===M);_&&(t.store.updateItem("loans",M,{amortizaciones:(_.amortizaciones||[]).filter(E=>E._id!==A)}),z("Amortización eliminada"),s(),$([M]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Ws,mount(h){const $=(C=[])=>{for(const M of C)o.add(M);l(h)};l(h),h.dataset.wired!=="1"&&(b(h,$),h.dataset.wired="1")}}}const Le=6.35;function qt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function lo(t){return Math.max(0,(t.bruto||0)-qt(t))}function Js(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Qs(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+qt(r),0),o=Math.max(0,a-e),n=vt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(lo(i)/o):0);return s}function uo(t,a,e){if(t.irpfModo==="manual")return lo(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return ct(vt(t.bruto||0,qt(t)),e);const o=Js(a.filter(i=>i.irpfModo!=="manual")),n=Qs(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ct(s+r,e)-ct(s,e);s+=r}return ct(vt(t.bruto||0,qt(t)),e)}function Xs(t,a){return t.reduce((e,o)=>e+uo(o,t,a),0)}function Zs(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function ti(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+qt(s),0);return Zs(vt(e,o),a)}function ei(t,a,e){const o=t.bruto||0,n=qt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Le,c=s*(r/100),u=uo(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-c-u)/i}}function ai(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const oi={transporte:125,restaurante:220,otros:null},ni={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},si=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Nt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,ii=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${p(e._id)}"${e._id===a?" selected":""}>${p(e.nombre)}</option>`).join("");function ri(t,a){const e=t.map((s,i)=>{const r=a.find(m=>m._id===s.cuenta),c=oi[s.tipo],u=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${p(ni[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${p(P(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${p(P(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function ci(t,a){const e=a.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${ii(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
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
              ${si.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${p(s)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Le).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
      <button class="btn-primary" data-guardar-nomina="${p((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function po(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Le),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:jt(t,"consumo"),repartoPago:jt(t,"pago")}}function li(t,a,e,o){const n=po(t,a),s=a.reduce((g,x)=>g+(x.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):ct(vt(n.bruto,s),e.tramos),u=i-r-c,m=i/n.nPagas,d=r/n.nPagas,l=c/n.nPagas,f=m-d-l,v=n.grupoNomina?e.nominas.filter(g=>g.grupoNomina===n.grupoNomina&&g._id!==o):[],y=v.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${p(n.grupoNomina)}" con ${p(v.map(g=>g.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",S=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${p(P(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${p(P(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${p(P(n.bruto))}</span>
      ${S}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${p(P(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${p(P(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${p(P(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${p(P(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${p(P(f))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${p(P(f))}/paga`:`ingreso ${p(P(m))} − SS ${p(P(d))} − IRPF ${p(P(l))}`}${s>0?" + recargas flex":""}</span>
    </div>${y}`}function di(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=ri(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=li(t,a,e,o))},i=()=>{var c,u;const r=(m,d)=>{const l=t.querySelector(m);l&&(l.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),H(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),H(t,'[data-reparto-modo="consumo"]',()=>zt(t,"consumo")),H(t,'[data-reparto-modo="pago"]',()=>zt(t,"pago")),T(t,"[data-flex-anadir]",()=>{var u,m,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",c=parseFloat(((m=t.querySelector("#fc-importe"))==null?void 0:m.value)??"")||0;if(!c)return z("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),T(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const mo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function ui(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??wt;function r(l,f){const v=o(),y=n();return!v||!y?null:(y.innerHTML=`<div class="modal-title">${p(l)}</div>${f}`,v.classList.remove("hidden"),T(y,"[data-cerrar]",s),y)}function c(){a=null;const l=[...t.store.get("tramosIRPFHistorico")].sort((y,S)=>y.año-S.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${p(mo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${l.map(y=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${y.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(mo(y.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${y.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${y.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);v&&(T(v,"[data-editar-tabla]",y=>{const S=y.getAttribute("data-editar-tabla");d(S==="default"?"default":Number(S))}),T(v,"[data-borrar-tabla]",y=>{const S=Number(y.getAttribute("data-borrar-tabla"));at(`¿Eliminar la tabla del ejercicio ${S}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(g=>g.año!==S)),z(`Tabla ${S} eliminada`),t.onDatosCambiados(),c())}),T(v,"[data-anadir-anyo]",()=>{var g;const y=parseInt(((g=v.querySelector("#irpf-new-year"))==null?void 0:g.value)??"",10);if(!y||y<2e3||y>2100)return z("Año inválido","err");const S=t.store.get("tramosIRPFHistorico");if(S.some(x=>x.año===y))return z("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...S,{_id:Date.now().toString(36),año:y,tramos:i().map(x=>[...x])}]),t.onDatosCambiados(),d(y)}))}function u(){return e.map(([l,f],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${v}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function m(l){e=[...l.querySelectorAll("[data-tr-min]")].map((v,y)=>{const S=l.querySelector(`[data-tr-pct="${y}"]`);return[parseFloat(v.value)||0,parseFloat((S==null?void 0:S.value)??"")||0]})}function d(l){var x;a=l;const f=t.store.get("tramosIRPFHistorico");e=(l==="default"?i():((x=f.find(w=>w.año===l))==null?void 0:x.tramos)??i()).map(w=>[...w]);const y=l==="default"?"tabla por defecto":`ejercicio ${l}`,S=r(`Tramos IRPF — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${p(y)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!S)return;const g=()=>{const w=S.querySelector("#irpf-tramos-rows");w&&(w.innerHTML=u())};T(S,"[data-volver]",c),T(S,"[data-tr-anadir]",()=>{m(S),e.push([0,0]),g()}),T(S,"[data-tr-borrar]",w=>{m(S),e.splice(Number(w.getAttribute("data-tr-borrar")),1),g()}),T(S,"[data-tr-guardar]",()=>{m(S);const w=[...e].sort((I,b)=>I[0]-b[0]);if(w.length===0)return z("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:w}),z("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===a?{...I,tramos:w}:I)),z(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const fo=1500,At=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${p(o)}" placeholder="${p(n)}"/></div>`,pi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${p(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${p(n)}"${n===o?" selected":""}>${p(s)}</option>`).join("")}
   </select></div>`,mi=t=>(t.modeloFondo||"cuenta")==="pension";function fi(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>gi(n,a,e,o)).join("")}</div>`}function gi(t,a,e,o){const n=we(t);if(!n)return"";const s=Ie(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,m)=>u+m.cantidad,0),c=Math.min(r,fo)*(s/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>fo?"neg":""}">${p(P(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${p(P(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${p(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${p(n.proxDesbloqueo)}</div>`:""}
  </div>`}function vi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(P(e.importe))} / ${p(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function bi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${pi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function hi(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=vi(a))};H(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return z("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function yi(t,a,e,o){var S;const n=g=>{var x;return((x=t.querySelector(g))==null?void 0:x.value)??""},s=(g,x=0)=>{const w=parseFloat(n(g));return Number.isFinite(w)?w:x},i=g=>{var x;return!!((x=t.querySelector(g))!=null&&x.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),u=n("#pen-grupo"),m={nombre:r,grupoNomina:u,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],l=[...(e==null?void 0:e.aportaciones)??[]],v=((S=[...d].sort((g,x)=>x.fecha.localeCompare(g.fecha))[0])==null?void 0:S.saldo)??(e==null?void 0:e.saldo)??null,y=Date.now().toString(36);return e?(v===null||Math.abs(c-v)>.005)&&(d.push({_id:y,fecha:o,saldo:c,nota:"Actualización manual"}),c>(v??0)&&l.push({_id:`${y}a`,fecha:o,cantidad:c-(v??0)})):c>0&&(d.push({_id:y,fecha:o,saldo:c,nota:"Saldo inicial"}),l.push({_id:`${y}a`,fecha:m.fechaInicialSaldo??o,cantidad:c})),{datos:{...m,historicoSaldos:d,aportaciones:l}}}const xi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function $i(t){const a=t.hoy??Y,e=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)};let o=null;function n(x){const w=x.filter(b=>b.activo);if(w.length<2)return"";const I=(b,h)=>`<button class="btn-secondary btn-sm" data-persona-tab="${b===null?"":p(b)}"
               style="${o===b?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${p(h)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${I(null,"Todas")}
      ${w.map(b=>I(b._id,b.nombre)).join("")}
    </div>`}function s(){const x=t.store.get("config");return Gt(t.store.get("tramosIRPFHistorico"),x.tramos_irpf??wt)(Number(a().slice(0,4)))}function i(x,w,I){const b=ei(x,w,I),h=!!w&&x.irpfModo!=="manual",$=Ne(x.repartoConsumo,x.repartoPago,t.store.get("personas")),C=[x.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${x.mesActualizacionIPC}">IPC m${x.mesActualizacionIPC}</span>`:"",b.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${p(P(b.flexAnual))}/año</span>`:"",Math.abs(b.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${b.ssPct.toFixed(2)}%</span>`:"",$?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${p($)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${p(x.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${C}</div>
      </div>
      <div class="num">${p(P(b.brutoAnual))}
        ${b.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${p(P(b.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${p(P(b.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${b.nPagas} pagas</div>
      <div class="text-sm ${h?"neg":""}">${x.irpfModo==="manual"?`${p(x.irpfPct??0)}% (manual)`:`${b.irpfPct.toFixed(1)}% (auto)`}${h?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${x.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${p(r(x.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${p(x._id)}"${x.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${p(x._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${p(x._id)}">✕</button>
      </div>
    </div>`}const r=x=>{var w;return((w=t.store.get("accounts").find(I=>I._id===(x||"default")))==null?void 0:w.nombre)??(x||"default")};function c(x,w,I){const b=w.reduce((C,M)=>C+(M.bruto||0),0),h=Xs(w,I),$=b>0?h/b*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${p(x)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${p(P(b))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${$.toFixed(1)}%</strong> (${p(P(h))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${w.map(C=>i(C,w,I)).join("")}
      </div>
    </div>`}function u(x){const w=s(),I=t.store.get("personas"),b=ne(I),h=[...t.store.get("nominas")].sort((E,F)=>(F.bruto||0)-(E.bruto||0)),$=o?h.filter(E=>xe(E.repartoConsumo,E.repartoPago,b).has(o)):h,{grupos:C,sueltas:M}=ai($),A=t.store.get("accounts").filter(mi),_=h.filter(E=>E.activo!==!1);x.innerHTML=`
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
      ${$.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...C.entries()].map(([E,F])=>c(E,F,w)).join("")}
      ${M.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${M.map(E=>i(E,null,w)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${fi(A,_,w,a())}</div>`}const m=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),l=()=>{var x;return(x=m())==null?void 0:x.classList.add("hidden")};function f(x,w){const I=m(),b=d();return!I||!b?null:(b.innerHTML=`<div class="modal-title">${p(x)}</div>${w}`,I.classList.remove("hidden"),T(b,"[data-cancelar]",l),b)}function v(x,w){const I=x?t.store.get("nominas").find(C=>C._id===x)??null:null,b=[...(I==null?void 0:I.retribucionFlexible)??[]].map(C=>({...C})),h={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},$=f(x?"Editar nómina":"Nueva nómina",ci(I,h));$&&(di($,b,h,x??""),T($,"[data-guardar-nomina]",C=>{const M=po($,b);if(!M.nombre||M.bruto<=0)return z("Nombre y bruto anual son obligatorios","err");const A=C.getAttribute("data-guardar-nomina")||"",_={...M,activo:!0,tags:["nomina"]};A?(t.store.updateItem("nominas",A,_),z("Nómina actualizada")):(t.store.addItem("nominas",_),z("Nómina creada")),e(),l(),w()}))}function y(x,w){const I=x?t.store.get("accounts").find($=>$._id===x)??null:null,b=[...(I==null?void 0:I.planAportaciones)??[]].map($=>({...$})),h=f(x?"Editar plan de pensiones":"Nuevo plan de pensiones",bi(I,{nominas:t.store.get("nominas"),hoy:a()}));h&&(hi(h,b,a()),T(h,"[data-guardar-pension]",$=>{const{datos:C,error:M}=yi(h,b,I,a());if(M)return z(M,"err");const A=$.getAttribute("data-guardar-pension")||"";A?(t.store.updateItem("accounts",A,C),z("Plan actualizado")):(t.store.addItem("accounts",C),z("Plan creado")),e(),l(),w()}))}function S(x,w,I){T(x,"[data-persona-tab]",b=>{o=b.getAttribute("data-persona-tab")||null,w()}),T(x,"[data-nueva-nomina]",()=>v(null,w)),T(x,"[data-editar-nom]",b=>v(b.getAttribute("data-editar-nom"),w)),T(x,"[data-borrar-nom]",b=>{at("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",b.getAttribute("data-borrar-nom")),z("Eliminada"),e(),w())}),H(x,"[data-activo-nom]",b=>{const h=b;t.store.updateItem("nominas",h.getAttribute("data-activo-nom"),{activo:h.checked}),e(),w()}),T(x,"[data-tramos]",()=>I.abrir()),T(x,"[data-nueva-pension]",()=>y(null,w)),T(x,"[data-editar-pension]",b=>y(b.getAttribute("data-editar-pension"),w)),T(x,"[data-borrar-pension]",b=>{at("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",b.getAttribute("data-borrar-pension")),z("Plan eliminado"),e(),w())})}let g=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:xi,mount(x){const w=()=>u(x);g??(g=ui({store:t.store,onDatosCambiados:()=>{e(),w()},año:()=>Number(a().slice(0,4))})),u(x),x.dataset.wired!=="1"&&(S(x,w,g),x.dataset.wired="1")}}}const wi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Ii="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",go={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Ci={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Si(t,a){const e=t.filter(c=>c.activo&&it(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const u=se(c,a);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function Ai(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(L(o).getTime()-L(e).getTime())/(30.44*864e5)),s=Ot(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(ft(a.inflacion,e,o)-1),u=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${p(P(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${p(P(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${p(e.slice(0,7))} → ${p(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${p(P(i))}</span>
    </div>${r}
  </div>`}function Mi(t,a){const e=go[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(f=>(f.retribucionFlexible??[]).filter(v=>v.cuenta===t._id).map(v=>({nomina:f,importe:v.importe}))),s=n.reduce((f,v)=>f+v.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,u=t.grupoNomina?a.nominas.filter(f=>(f.grupoNomina||"")===t.grupoNomina&&f.activo!==!1):n.slice(0,1).map(f=>f.nomina),m=ti(u,a.tramosIRPF),d=c*m/100,l=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${m}%`:`tipo marginal ${m}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${p(e.label)}</div>
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
             <span class="num pos" title="Importe exento × ${p(l)}">≈ ${p(P(d))}/año <span style="font-size:10px;color:var(--text3)">(${p(m)}%)</span></span></div>`:""}
    ${n.length>0?n.map(f=>`<div style="font-size:11px;color:var(--text3)">↩ ${p(f.nomina.nombre)}: ${p(P(f.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Ei(t){const a=we(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${p(P(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${p(P(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${p(P(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${p(P(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${p(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${p(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function _i(t,a){const e=se(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=L(o.dashboardStart),i=L(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,m=c>0&&r>0?Math.max(0,c*Math.pow(1+u,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,l=Math.max(0,m-d),f=$e(l,a.tramosGanancias),v=l>0?(f/l*100).toFixed(1):"0",y=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",S=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",g=($,C,M)=>$.map(A=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${C} ${p(A.contraparte)}: ${p(A.concepto)}</span>
          <span class="num ${M}">${p(P(A.total))} · ${A.ocurrencias} mov.</span>
        </div>`).join(""),w=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${p(o.dashboardStart.slice(0,7))} → ${p(o.dashboardEnd.slice(0,7))})</div>
         ${g(n.entradas,"↓","pos")}
         ${g(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${p(P(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${p(P(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${p(P(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=a.invModo(t._id),b=$=>`padding:3px 10px;border-radius:20px;border:1px solid ${$?"var(--accent)":"var(--border)"};background:${$?"var(--accent-dim)":"transparent"};color:${$?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,h=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${p(P(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${p(P(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${p(P(e.neto))}</div><div class="stat-sub">${p(S)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${p(P(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${p(P(m))}</div><div class="stat-sub">${p(y)} · ${p(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${p(P(m-f))}</div><div class="stat-sub">${p(v)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${p(t._id)}|real" style="${b(I==="real")}">Real</button>
          <button data-inv-modo="${p(t._id)}|proyeccion" style="${b(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${h}
      ${w}
    </div>`}function Pi(t,a){const e=[...t.historicoSaldos||[]].sort((c,u)=>u.fecha.localeCompare(c.fecha)),o=e[0],n=gt(t),s=it(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${p((go[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${p(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${p(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${p(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Ii}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${p(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${wi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${p(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${p(P(t.saldoInicial||0))}</div><div class="stat-sub">${p(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${p(P(n))}</div>${o?`<div class="stat-sub">Registro: ${p(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${p(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${p(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ai(t,a)}
    ${s==="beneficio"?Mi(t,a):""}
    ${s==="pension"?Ei(t):""}
    ${s==="inversion"?_i(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${p(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${p(t.descripcion)}</div>`:""}
  </div>`}const Fi=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Di(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${p(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${p(P(e.importe))} / ${p(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Ti(t,a){const e=t?it(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${Z("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Zt("ac-modelo","Tipo",Fi,e)}
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
          ${Zt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Zt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function zi(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Di(a))};H(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const u=t.querySelector(r);u&&(u.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return z("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function ji(t,a,e,o,n){const s=v=>{var y;return((y=t.querySelector(v))==null?void 0:y.value)??""},i=(v,y=0)=>{const S=parseFloat(s(v));return Number.isFinite(S)?S:y},r=v=>{var y;return!!((y=t.querySelector(v))!=null&&y.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",m=u==="beneficio",d=i("#ac-saldo"),l={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:u,planAportaciones:a,tipoBeneficio:m?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:m?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:l};if(!(o===null||Math.abs(d-o)>.005))return{datos:l};if(u==="inversion"&&d>(o??0)){const v=Date.now().toString(36);l.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${v}a`,fecha:e?n:l.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:l,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function Oe(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:W(a.saldoCts),nota:a.nota}))}function qi(t,a,e,o,n){const s=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${p(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${p(P(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${p(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${p(a)}|${p(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${p(a)}|${p(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${p(t)}</div>
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
    </div>`}const vo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ni(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??kt;function r(l,f){const v=o(),y=n();return!v||!y?null:(y.innerHTML=`<div class="modal-title">${p(l)}</div>${f}`,v.classList.remove("hidden"),T(y,"[data-cerrar]",s),y)}function c(){a=null;const l=[...t.store.get("tramosGananciasCapitalHistorico")].sort((y,S)=>y.año-S.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${p(vo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${l.map(y=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${y.año}</span>
              <span class="text-sm" style="color:var(--text2)">${p(vo(y.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${y.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${y.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);v&&(T(v,"[data-editar-tg]",y=>{const S=y.getAttribute("data-editar-tg");d(S==="default"?"default":Number(S))}),T(v,"[data-borrar-tg]",y=>{const S=Number(y.getAttribute("data-borrar-tg"));at(`¿Eliminar la tabla del ejercicio ${S}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(g=>g.año!==S)),z(`Tabla ${S} eliminada`),t.onDatosCambiados(),c())}),T(v,"[data-anadir-anyo-tg]",()=>{var g;const y=parseInt(((g=v.querySelector("#tg-new-year"))==null?void 0:g.value)??"",10);if(!y||y<2e3||y>2100)return z("Año inválido","err");const S=t.store.get("tramosGananciasCapitalHistorico");if(S.some(x=>x.año===y))return z("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...S,{_id:Date.now().toString(36),año:y,tramos:i().map(x=>[...x])}]),t.onDatosCambiados(),d(y)}))}function u(){return e.map(([l,f],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${v}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function m(l){e=[...l.querySelectorAll("[data-tg-min]")].map((f,v)=>{const y=l.querySelector(`[data-tg-pct="${v}"]`);return[parseFloat(f.value)||0,parseFloat((y==null?void 0:y.value)??"")||0]})}function d(l){var g;a=l;const f=t.store.get("tramosGananciasCapitalHistorico");e=(l==="default"?i():((g=f.find(x=>x.año===l))==null?void 0:g.tramos)??i()).map(x=>[...x]);const y=r(`Ganancias de capital — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!y)return;const S=()=>{const x=y.querySelector("#tg-rows");x&&(x.innerHTML=u())};T(y,"[data-volver-tg]",c),T(y,"[data-tg-anadir]",()=>{m(y),e.push([0,0]),S()}),T(y,"[data-tg-borrar]",x=>{m(y),e.splice(Number(x.getAttribute("data-tg-borrar")),1),S()}),T(y,"[data-tg-guardar]",()=>{m(y);const x=[...e].sort((w,I)=>w[0]-I[0]);if(x.length===0)return z("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:x}),z("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(w=>w.año===a?{...w,tramos:x}:w)),z(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Ri=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Li(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Ri.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Oi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function ki(t,a){const e=L(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Bi(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function ke(t,a){const{inicio:e,fin:o}=Bi(a);return Bt([t],{start:e,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function Hi(t){function a(n,s={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=Y()}=s,u=t.transacciones({estimacionId:n._id}),d=u.length===0&&(((I=n.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:n.tags}):u,l=new Map;for(const b of d){const h=b.fecha.slice(0,7);l.set(h,(l.get(h)??0)+Math.abs(b.importeCts)/100)}const f=[];for(const b of ki(c,i)){const h=l.get(b);if(h===void 0)continue;const $=U(ke(n,b));f.push({mes:b,estimado:$,real:U(h),desviacion:U(h-$),precision:Oi($,h)})}const v=U(f.reduce((b,h)=>b+h.estimado,0)),y=U(f.reduce((b,h)=>b+h.real,0)),S=f.reduce((b,h)=>b+Math.abs(h.estimado),0),g=f.length===0?null:S>0?f.reduce((b,h)=>b+h.precision*Math.abs(h.estimado),0)/S:f.reduce((b,h)=>b+h.precision,0)/f.length,x=f.slice(-r),w=x.length>0?U(x.reduce((b,h)=>b+h.real,0)/x.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:v,realTotal:y,desviacionTotal:U(y-v),precision:g,mediaRealReciente:w,infraestimada:y>v}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:U(r.estimado),realTotal:U(r.real),desviacionTotal:U(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Gi(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Vi(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function Ui(t,a,e,o){const n=a.filter(s=>s.tipo==="gasto"&&s.activo!==!1);return Vi(e,o).map(s=>{const i=U(n.reduce((c,u)=>c+ke(u,s),0)),r=U(t.transacciones({desde:`${s}-01`,hasta:Gi(s),tipo:"gasto"}).reduce((c,u)=>c+Math.abs(u.importeCts)/100,0));return{mes:s,estimado:i,real:r}})}const Be=640,Rt=200,X={top:14,right:16,bottom:26,left:54};function Yi(t){return Xt(t).slice(0,3)}function Wi(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=Be-X.left-X.right,e=Rt-X.top-X.bottom,o=Math.max(1,...t.flatMap(m=>[m.estimado,m.real])),n=m=>X.left+(t.length===1?a/2:m/(t.length-1)*a),s=m=>X.top+e-Math.max(0,m)/o*e,i=t.map((m,d)=>`${n(d)},${s(m.estimado)}`).join(" "),r=t.map((m,d)=>`${n(d)},${s(m.real)}`).join(" "),c=t.map((m,d)=>`<circle cx="${n(d).toFixed(1)}" cy="${s(m.real).toFixed(1)}" r="3" fill="var(--accent)"><title>${p(Xt(m.mes))}: ${p(P(m.real))}</title></circle>`).join(""),u=t.map((m,d)=>`<text x="${n(d).toFixed(1)}" y="${Rt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${p(Yi(m.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${Be} ${Rt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Gasto real frente a estimado por mes">
      <line x1="${X.left}" y1="${X.top}" x2="${X.left}" y2="${Rt-X.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${X.left}" y1="${Rt-X.bottom}" x2="${Be-X.right}" y2="${Rt-X.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${X.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${p(P(o))}</text>
      <polyline points="${i}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${r}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${c}
      ${u}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const bo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function Ki(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:ho(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:ee(ho(t,5)).desde,intervaloHasta:ee(t).hasta}}function ee(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function ho(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function He(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:ee(e).desde,hasta:ee(o).hasta}}function Ji(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function Ge(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Qi(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function Xi(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${p(P(W(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${p(P(W(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${p(P(W(t.diferenciaCts)))}</strong></span>
    </div>`}function Zi(t,a){const{ledger:e}=t,o=(t.hoy??Y)(),n=t.accounts().filter(A=>A.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?He(a.periodoDesde,a.periodoHasta):i?Ji(a.intervaloDesde,a.intervaloHasta):ee(a.mes),u={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},m=e.transacciones(u),d=t.estimaciones().filter(A=>A.tipo!=="transferencia"),l=[...d.map(A=>({_id:A._id,etiqueta:`${p(A.concepto)} (${p(P(A.cuantia))})`})),...t.loans().filter(A=>A.activo).map(A=>({_id:A._id,etiqueta:`Préstamo: ${p(A.nombre)}`})),...t.nominas().filter(A=>A.activo).map(A=>({_id:A._id,etiqueta:`Nómina: ${p(A.nombre)}`}))],f=m.filter(A=>A.tipo!=="transferencia"&&A.importeCts<0).reduce((A,_)=>A+_.importeCts,0),v=m.filter(A=>A.tipo!=="transferencia"&&A.importeCts>0).reduce((A,_)=>A+_.importeCts,0),y=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),S=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),g=n.map(A=>`<option value="${p(A._id)}"${A._id===a.cuentaId?" selected":""}>${p(A.nombre)}</option>`).join(""),x=A=>'<option value="">— sin asignar —</option>'+l.map(_=>`<option value="${p(_._id)}"${_._id===A?" selected":""}>${_.etiqueta}</option>`).join(""),w=A=>Object.keys(bo).map(_=>`<option value="${_}"${_===A?" selected":""}>${bo[_]}</option>`).join(""),I=m.map(A=>{var _;return`
      <tr data-tx="${p(A._id)}" style="border-bottom:1px solid var(--border)${A.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${p(A.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${p(A.concepto)}</td>
        <td style="padding:7px 8px">${ze(A.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${p(((_=t.accounts().find(E=>E._id===A.cuentaId))==null?void 0:_.nombre)??A.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${p(A._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${w(A.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${p(A._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${x(A.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${mt(W(A.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${p(A._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${p(A._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),b=i?Ui(e,d,r,c):[],h=s?e.transacciones({desde:r,hasta:c}):[],C=(s?Ge(m):[]).map(A=>{const _=a.detalleAbierto.has(A.concepto),E=_?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${ze(A.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${p(A.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${p(A.concepto)}">Asignar</button>
               </div>
               ${Xi(Qi(A,h))}
             </td>
           </tr>`:"",F=_?A.movimientos.map(q=>{var D;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${p(q.fecha)}</span> · ${p(((D=t.accounts().find(j=>j._id===q.cuentaId))==null?void 0:D.nombre)??q.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${p(q._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${x(q.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${mt(W(q.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${p(A.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${p(A.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${_?"▾":"▸"}</button>
          <span style="font-size:13px">${p(A.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${A.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${p(A.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${A.movimientos.length} movimientos del grupo de golpe">${x(A.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${mt(W(A.total))}</td>
        <td></td>
      </tr>${E}${F}`}).join(""),M=S.slice().reverse().slice(0,8).map(A=>{var _;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${p(A.fecha)}</span>
        <span style="color:var(--text3)">${p(((_=t.accounts().find(E=>E._id===A.cuentaId))==null?void 0:_.nombre)??A.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${p(P(W(A.saldoCts)))}</span>
        ${A.nota?`<span style="color:var(--text3)">${p(A.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${p(A._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span>Gastos: ${mt(W(f))}</span>
          <span>Ingresos: ${mt(W(v))}</span>
          <span>Neto: ${mt(W(v+f))}</span>
          <span style="margin-left:auto">Saldo a ${p(c)}: <strong>${p(P(y))}</strong></span>
        </div>

        ${s?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${p(a.periodoDesde)} y ${p(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
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
                     ${C||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
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
                     ${I||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${i?`<div class="divider"></div>
                      <div class="card-title mb-8">Real frente a estimado — ${p(r)} → ${p(c)}</div>
                      ${Wi(b)}`:""}`}
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${g}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(A=>`<option value="${p(A)}"></option>`).join("")}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${x(null)}</select>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${g}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${M?`<div class="mt-12">${M}</div>`:""}
        </div>
      </div>
    </div>`}function tr(t,a,e,o){const{ledger:n}=a;H(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),H(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()}),T(t,"[data-acc-vista]",i=>{e.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),H(t,"#acc-periodo-desde",i=>{e.periodoDesde=i.value||e.periodoDesde,o()}),H(t,"#acc-periodo-hasta",i=>{e.periodoHasta=i.value||e.periodoHasta,o()}),H(t,"#acc-intervalo-desde",i=>{e.intervaloDesde=i.value||e.intervaloDesde,o()}),H(t,"#acc-intervalo-hasta",i=>{e.intervaloHasta=i.value||e.intervaloHasta,o()}),T(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");e.detalleAbierto.has(r)?e.detalleAbierto.delete(r):e.detalleAbierto.add(r),o()}),H(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:u,hasta:m}=He(e.periodoDesde,e.periodoHasta),d=n.transacciones({cuentaId:e.cuentaId||void 0,desde:u,hasta:m,texto:e.filtroTexto||void 0}),l=Ge(d).find(f=>f.concepto===r);if(l){for(const f of l.movimientos)n.asignarEstimacion(f._id,c);z(`Estimación asignada a ${l.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),T(t,"[data-grp-tags-asignar]",i=>{var v;const r=i.getAttribute("data-grp-tags-asignar"),c=((v=i.closest("tr"))==null?void 0:v.querySelector("[data-grp-tags]"))??null,u=((c==null?void 0:c.value)??"").split(",").map(y=>y.trim().toLowerCase()).filter(Boolean);if(u.length===0)return z("Escribe al menos una etiqueta","err");const{desde:m,hasta:d}=He(e.periodoDesde,e.periodoHasta),l=n.transacciones({cuentaId:e.cuentaId||void 0,desde:m,hasta:d,texto:e.filtroTexto||void 0}),f=Ge(l).find(y=>y.concepto===r);if(f){for(const y of f.movimientos)n.actualizar(y._id,{tags:[...new Set([...y.tags,...u])]});z(`Etiquetas añadidas a ${f.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),T(t,"#nt-guardar",()=>{const i=rt(t,"#nt-concepto").trim(),r=oo(t,"#nt-importe");if(!i)return z("Indica un concepto","err");if(!(r>0))return z("Indica un importe mayor que cero","err");const c=rt(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:rt(t,"#nt-fecha")||(a.hoy??Y)(),cuentaId:rt(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:rt(t,"#nt-tipo"),estimacionId:rt(t,"#nt-estimacion")||null}),z("Movimiento registrado"),a.onDatosCambiados(),o()}),T(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;at("¿Eliminar este movimiento?")&&(n.eliminar(r),z("Movimiento eliminado"),a.onDatosCambiados(),o())}),T(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(d=>d._id===r);if(!c)return;const u=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(W(c.importeCts))));if(u===null)return;const m=parseFloat(u.replace(",","."));if(!Number.isFinite(m)||m<=0)return z("Importe no válido","err");n.actualizar(r,{importe:m}),z("Movimiento actualizado"),a.onDatosCambiados(),o()}),H(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),z("Asignación actualizada"),a.onDatosCambiados()}),H(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),z("Tipo actualizado"),a.onDatosCambiados(),o()}),T(t,"#pc-guardar",()=>{if(rt(t,"#pc-saldo").trim()==="")return z("Indica el saldo","err");const r=oo(t,"#pc-saldo");n.registrarPuntoControl(rt(t,"#pc-cuenta"),rt(t,"#pc-fecha")||(a.hoy??Y)(),r,rt(t,"#pc-nota").trim()||void 0),z("Saldo real registrado"),a.onDatosCambiados(),o()}),T(t,"[data-pc-borrar]",i=>{at("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),z("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ve(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=U(t.mediaRealReciente),i=U(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:U(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function er(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??Y(),u=t.get("expenses"),m=u.find(v=>v._id===s);if(!m)throw new Error(`La estimación ${s} no existe`);const d={...m,fechaFin:c},l={...m,_id:a(),cuantia:U(i),fechaInicio:c,fechaFin:m.fechaFin??null,ajustadaDesdeId:m._id,ajustadaEn:c},f=u.map(v=>v._id===s?d:v);return f.push(l),t.set("expenses",f),{estimacionCerrada:d,estimacionNueva:l}}function o(s,i={}){const r=[],c=[];for(const u of s)try{r.push(e(u.estimacionId,u.cuantiaSugerida,i))}catch(m){c.push({estimacionId:u.estimacionId,error:m.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(y=>[y._id,y])),c=r.get(s);if(!c)return[];const u=[];let m=c;const d=new Set;for(;m!=null&&m.ajustadaDesdeId&&!d.has(m._id);){d.add(m._id);const y=r.get(m.ajustadaDesdeId);if(!y)break;u.unshift(y),m=y}const l=[];let f=c;const v=new Set([c._id]);for(;;){const y=i.find(S=>S.ajustadaDesdeId===f._id&&!v.has(S._id));if(!y)break;v.add(y._id),l.push(y),f=y}return[...u,c,...l]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Ue(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const n=e.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ve(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function ar(t){const a=Ue(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:c,estimacion:u,sugerencia:m})=>{const d=c.meses.slice(-6).map(l=>`${Xt(l.mes)}: ${P(l.estimado)} → ${P(l.real)} (${l.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${p(u.concepto)}</div>
          <div style="margin-top:3px">${ze(c.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${p(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${p(P(c.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${p(P(c.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${mt(c.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${ao(c.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${m?`<button class="btn-secondary" data-sugerir="${p(c.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${p(m.motivo)}">Sugerir ajuste → ${p(P(m.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${p(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${mt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${ao(c.precision)}</td>
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
    </div>`}function or(t,a,e){T(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Ue(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${P(i.cuantiaActual)}
Nueva estimación: ${P(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;at(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),z(`Estimación ajustada a ${P(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),T(t,"#ajustar-todas",()=>{const o=Ue(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${P(r.cuantiaActual)} → ${P(r.cuantiaSugerida)}`).join(`
`);if(!at(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});z(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const nr=[";",",","	","|"],sr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function ue(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function pe(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function ir(t){let a=";",e=-1;for(const o of nr){const n=t.slice(0,20).map(c=>pe(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function ae(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const m=s===","?o:n;i=a.slice(0,m).replace(/[.,]/g,""),r=a.slice(m+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(c);return Number.isFinite(u)?e?-u:u:null}function Ye(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return yo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),yo(o,Number(e[2]),Number(e[1]))}return null}function yo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function xo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Ye(e)!==null).length/a.length}function $o(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ae(e)!==null).length/a.length}function rr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=ue(t[i]);if(r&&sr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&ue(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=xo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||ue(t[r]).includes("saldo"))continue;const c=$o(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if($o(c)>.5||xo(c)>.5)continue;const u=c.reduce((m,d)=>m+d.length,0)/Math.max(1,c.length);u>i&&(i=u,s=r)}s>=0&&(e.concepto=s)}return e}function cr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(m=>m.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=ir(a),o=a.map(m=>pe(m,e).length),n=Math.max(...o);let s=o.findIndex(m=>m===n);s<0&&(s=0);const i=pe(a[s],e);let r=a.slice(s+1).map(m=>pe(m,e));const c=Ye(i[0]??"")!==null||i.some(m=>ae(m)!==null&&/\d/.test(m));c&&(r=[i,...r]);const u=rr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((m,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function wo(t,a,e){return`${t}|${a}|${ue(e).replace(/\s+/g," ")}`}function lr(t,a,e=[]){const o=new Set(e.map(s=>wo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?Ye(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let u=null;if(a.importe>=0)u=ae(s[a.importe]??""),u===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const l=a.debe>=0?ae(s[a.debe]??""):null,f=a.haber>=0?ae(s[a.haber]??""):null;l===null&&f===null?r.push("sin importe en Debe ni en Haber"):l!==null&&l!==0?u=-Math.abs(l):f!==null&&f!==0?u=Math.abs(f):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const m=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&u!==null){const l=wo(c,u,m);d=o.has(l)||n.has(l),n.add(l)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:m,importeCts:u,errores:r,duplicada:d}})}function dr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function me(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const ur=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function We(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=lr(a.analisis,a.mapeo,e)}function pr(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?fr(a,a.analisis,a.mapeo):mr()}
    </div>`}function mr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function fr(t,a,e){const o=dr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,u)=>`<option value="${u}"${u===r?" selected":""}>${p(c||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${p(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${p(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${ur.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${mt(W(o.sumaCts))}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,u=c?r.errores[0]:r.duplicada?"repetido":"se importa",m=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${p(r.fecha??"—")}</td>
                <td style="font-size:12px">${p(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":p(P(W(r.importeCts)))}</td>
                <td style="font-size:11px;color:${m}">${p(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function gr(t,a,e,o){T(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return z("Nada que sincronizar: ningún histórico manual coincide con lo importado");const i=u=>{var m;return((m=a.accounts().find(d=>d._id===u))==null?void 0:m.nombre)??u},r=s.reduce((u,m)=>u+m.eliminados,0),c=s.map(u=>`${i(u.cuentaId)} (${u.eliminados})`).join(", ");z(`${r} punto${r!==1?"s":""} de control sustituido${r!==1?"s":""} · ${c}`),a.onDatosCambiados(),o()}),T(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,me(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),T(t,"[data-imp-cerrar]",()=>{Object.assign(e,me()),o()}),H(t,"#imp-cuenta",s=>{e.cuentaId=s.value,We(a,e),o()}),H(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),H(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),We(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&vr(s).then(r=>{const c=cr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},We(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),T(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(c=>c.errores.length===0&&(e.incluirDuplicadas||!c.duplicada));if(s.length===0)return;for(const c of s)a.ledger.registrar({fecha:c.fecha,cuentaId:e.cuentaId,importe:Math.abs(W(c.importeCts)),tipo:c.importeCts<0?"gasto":"ingreso",concepto:c.concepto,origen:"importado"});const i=s.map(c=>c.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]);z(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,me()),a.onDatosCambiados(),o()})}function vr(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function br(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function hr(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function yr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function xr(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const u=(c.tags??[]).filter(m=>s.tags.includes(m)).length;u!==0&&(u>r||u===r&&i&&c._id<i._id)&&(i=c,r=u)}i&&o.get(i._id).push(s)}return o}function $r(t,a,e,o={}){const{desde:n,hasta:s}=br(e),i=t.transacciones({desde:n,hasta:s}),r=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts<0),c=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts>0),u=a.filter(w=>w.tipo==="gasto"&&w.activo!==!1),m=new Map((o.analisis??[]).map(w=>[w.estimacionId,w])),d=new Set(u.filter(w=>t.transacciones({estimacionId:w._id}).length>0).map(w=>w._id)),l=xr(r,u,w=>d.has(w)),f=new Set,v=u.map(w=>{const I=l.get(w._id)??[];for(const C of I)f.add(C._id);const b=U(I.reduce((C,M)=>C+Math.abs(M.importeCts)/100,0)),h=U(ke(w,e)),$=m.get(w._id);return{estimacionId:w._id,concepto:w.concepto,tags:w.tags??[],estimado:h,real:b,desviacion:U(b-h),sinMovimiento:I.length===0,sugerencia:$?Ve($,w.cuantia,{hoy:o.hoy}):null}}),y=new Map;for(const w of r){if(f.has(w._id))continue;const I=yr(w.concepto),b=y.get(I)??{concepto:w.concepto,total:0,movimientos:0};b.total=U(b.total+Math.abs(w.importeCts)/100),b.movimientos+=1,y.set(I,b)}const S=[...y.values()].sort((w,I)=>I.total-w.total),g=U(v.reduce((w,I)=>w+I.estimado,0)),x=U(r.reduce((w,I)=>w+Math.abs(I.importeCts)/100,0));return{mes:e,estimado:g,real:x,desviacion:U(x-g),ingresosReales:U(c.reduce((w,I)=>w+I.importeCts/100,0)),filas:v.sort((w,I)=>Math.abs(I.desviacion)-Math.abs(w.desviacion)),sinEstimacion:S,totalSinEstimacion:U(S.reduce((w,I)=>w+I.total,0)),vacio:i.length===0}}function Io(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function wr(){return{mes:""}}function Ke(t,a){if(a.mes)return a.mes;const e=Io(t.ledger),o=hr((t.hoy??Y)());return e.includes(o)?o:e[0]??o}function Je(t,a){const e=(t.hoy??Y)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:e});return $r(t.ledger,o,a,{analisis:n,hoy:e})}function Ir(t,a){const e=Ke(t,a),o=Io(t.ledger);o.includes(e)||o.unshift(e);const n=Je(t,e),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(c=>`<option value="${p(c)}"${c===e?" selected":""}>${p(Xt(c))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${p(Xt(e))}. Importa el extracto del banco o
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
          <div class="stat-value" style="font-size:1.15rem">${p(P(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${p(P(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${p(P(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${p(P(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Cr(n)}
      ${Sr(n)}
    </div>`}function Cr(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                  ${p(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${p(P(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${p(P(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${p(o.estimacionId)}"
                           title="Pasar la estimación de ${p(P(s.cuantiaActual))} a ${p(P(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${p(P(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function Sr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
                <td style="font-size:12px">${p(a.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${a.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${p(P(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Ar(t,a,e,o){H(t,"#cie-mes",n=>{e.mes=n.value,o()}),T(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Je(a,Ke(a,e)).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??Y)()}),z(`«${r.concepto}» ajustada a ${P(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),T(t,"[data-cie-ajustar-todas]",()=>{const s=Je(a,Ke(a,e)).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??Y)()});z(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const Mr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Er(t){const a=t.hoy??Y,e=()=>{var D;return(D=t.onDatosCambiados)==null?void 0:D.call(t)},o=new Map;let n="cuentas";const s=Ki(a().slice(0,7)),i=me(),r=wr(),c=()=>t.store.get("expenses"),u=()=>t.store.get("accounts"),m={ledger:t.ledger,accounts:u,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:u,onDatosCambiados:e},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},f={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},v=()=>t.store.get("config"),y=D=>{var j;return((j=t.store.get("accounts").find(R=>R._id===D))==null?void 0:j.nombre)??D},S=()=>Gt(t.store.get("tramosIRPFHistorico"),v().tramos_irpf??wt)(Number(a().slice(0,4))),g=()=>Gt(t.store.get("tramosGananciasCapitalHistorico"),v().tramosGananciasCapital??kt),x=()=>g()(Number(a().slice(0,4)));function w(){const D=v(),j=t.store.get("accounts"),R=Ia({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:j,config:{dashboardStart:D.dashboardStart,dashboardEnd:D.dashboardEnd,fechaReferencia:D.dashboardStart},nominas:[],resolverTramosGanancias:g()}),O=new Map,N=k=>{let B=O.get(k);return B||(B={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},O.set(k,B)),B},G=(k,B)=>{const Q=`${B.sourceId}`,tt=k.find(ea=>ea.concepto===Q),ot=tt??{concepto:Q,contraparte:"",total:0,ocurrencias:0};ot.total+=Math.abs(B.cuantia),ot.ocurrencias+=1,tt||k.push(ot)};for(const k of R){if(!k.cuenta)continue;const B=N(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(B.totalAportaciones+=Math.abs(k.cuantia),G(B.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(B.totalReembolsos+=Math.abs(k.cuantia),G(B.salidas,k)):k.sourceType==="investment-tax"&&(B.retencion+=Math.abs(k.cuantia))}const K=t.store.get("expenses");for(const k of O.values())for(const[B,Q]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const tt of B){const ot=K.find(ea=>ea._id===tt.concepto);tt.contraparte=y((ot==null?void 0:ot[Q])??"default"),tt.concepto=(ot==null?void 0:ot.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return O}function I(D){const j=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let R;if(n==="cuentas"){const G=t.store.get("accounts").filter(B=>it(B)!=="pension"),K=w(),k={config:v(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:S(),tramosGanancias:x(),flujos:B=>K.get(B)??Ci,invModo:B=>o.get(B)??"proyeccion"};R=`${Si(G,k.tramosGanancias)}<div class="grid-3">${G.map(B=>Pi(B,k)).join("")}</div>`}else n==="movimientos"?R='<div id="acc-tx"></div>':n==="importar"?R='<div id="acc-import"></div>':R='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';D.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${j}
      </div>
      ${Li(n)}
      ${R}`;const O=()=>I(D);if(n==="movimientos"){const N=D.querySelector("#acc-tx");N.innerHTML=Zi(m,s),tr(N,m,s,O)}else if(n==="importar"){const N=D.querySelector("#acc-import");N.innerHTML=pr(d,i),gr(N,d,i,O)}else if(n==="cierre"){const N=D.querySelector("#acc-cierre"),G=D.querySelector("#acc-precision");N.innerHTML=Ir(l,r),G.innerHTML=ar(f),Ar(N,l,r,O),or(G,f,O)}}const b=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),$=()=>{var D;return(D=b())==null?void 0:D.classList.add("hidden")};function C(D,j){const R=b(),O=h();return!R||!O?null:(O.innerHTML=D?`<div class="modal-title">${p(D)}</div>${j}`:j,R.classList.remove("hidden"),T(O,"[data-cancelar]",$),O)}function M(D,j){const R=D?t.store.get("accounts").find(K=>K._id===D)??null:null,O=[...(R==null?void 0:R.planAportaciones)??[]].map(K=>({...K})),N=R?A(R):null,G=C(D?"Editar cuenta / fondo":"Nueva cuenta / fondo",Ti(R,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));G&&(zi(G,O,a()),T(G,"[data-guardar-acc]",K=>{const k=K.getAttribute("data-guardar-acc")||"",{datos:B,punto:Q,error:tt}=ji(G,O,R,N,a());if(tt)return z(tt,"err");let ot=k;k?t.store.updateItem("accounts",k,B):ot=t.store.addItem("accounts",B)._id,Q&&t.ledger.registrarPuntoControl(ot,Q.fecha,Q.saldo,Q.nota),z(k?"Actualizada":"Cuenta / fondo creado"),e(),$(),j()}))}function A(D){const j=t.ledger.puntosControl(D._id);return j.length>0?Oe(j)[0].saldo:D.saldo??null}function _(D,j){const R=t.store.get("accounts").find(G=>G._id===D);if(!R)return;const O=C("Histórico de saldos",qi(R.nombre,D,Oe(t.ledger.puntosControl(D)),R.saldoInicial||0,a()));if(!O)return;const N=()=>{j(),_(D,j)};T(O,"[data-hist-anadir]",()=>{var B,Q,tt;const G=((B=O.querySelector("#hi-fecha"))==null?void 0:B.value)??"",K=parseFloat(((Q=O.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),k=((tt=O.querySelector("#hi-nota"))==null?void 0:tt.value.trim())??"";if(!G||!Number.isFinite(K))return z("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(D,G,K,k||void 0),z("Punto añadido"),e(),N()}),T(O,"[data-hist-borrar]",G=>{const[,K]=(G.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(K),z("Eliminado"),e(),N()}),T(O,"[data-hist-inicial]",G=>{const[K,k]=(G.getAttribute("data-hist-inicial")||"").split("|"),B=t.ledger.puntosControl(K).find(tt=>tt._id===k);if(!B)return;const Q=Oe([B])[0].saldo;t.store.updateItem("accounts",K,{saldoInicial:Q,fechaInicialSaldo:B.fecha}),z(`Punto inicial → ${B.fecha} (${P(Q)})`),e(),N()})}function E(D){const j=t.store.get("accounts").filter(N=>N.activo);if(j.length===0)return z("No hay cuentas activas","err");const R=a(),O=j.map(N=>`• ${N.nombre}: ${P(A(N)??N.saldoInicial??0)}`).join(`
`);if(at(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${R})?

${O}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of j)t.store.updateItem("accounts",N._id,{saldoInicial:A(N)??N.saldoInicial??0,fechaInicialSaldo:R});z("Saldo base actualizado"),e(),D()}}function F(D,j,R){T(D,"[data-cuentas-tab]",O=>{n=O.getAttribute("data-cuentas-tab")||"cuentas",j()}),T(D,"[data-nueva-acc]",()=>M(null,j)),T(D,"[data-editar-acc]",O=>M(O.getAttribute("data-editar-acc"),j)),T(D,"[data-tramos-ganancias]",()=>R.abrir()),T(D,"[data-reset-base]",()=>E(j)),T(D,"[data-hist-acc]",O=>_(O.getAttribute("data-hist-acc"),j)),T(D,"[data-principal-acc]",O=>{const N=O.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(G=>({...G,esCuentaPrincipal:G._id===N}))),z("Cuenta marcada como principal"),e(),j()}),T(D,"[data-borrar-acc]",O=>{const N=O.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return z("Debe existir al menos una cuenta","err");if(!at("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const K=t.store.get("accounts");K.length>0&&!K.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",K.map((k,B)=>B===0?{...k,esCuentaPrincipal:!0}:k)),z("Cuenta eliminada"),e(),j()}),T(D,"[data-inv-modo]",O=>{const[N,G]=(O.getAttribute("data-inv-modo")||"").split("|");o.set(N,G==="real"?"real":"proyeccion"),j()})}let q=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:Mr,mount(D){const j=()=>I(D);q??(q=Ni({store:t.store,onDatosCambiados:()=>{e(),j()},año:()=>Number(a().slice(0,4))})),I(D),D.dataset.wired!=="1"&&(F(D,j,q),D.dataset.wired="1")}}}function Co(t,a,e=!1){const o=Math.abs(st(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function _r(t){function a(b){return`${b}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(b={}){var $;const h=($=b.texto)==null?void 0:$.trim().toLowerCase();return t.get("transacciones").filter(C=>!(b.cuentaId&&C.cuentaId!==b.cuentaId||b.desde&&C.fecha<b.desde||b.hasta&&C.fecha>b.hasta||b.tipo&&C.tipo!==b.tipo||b.estimacionId&&C.estimacionId!==b.estimacionId||b.tags&&b.tags.length>0&&!b.tags.some(M=>C.tags.includes(M))||h&&!C.concepto.toLowerCase().includes(h))).sort((C,M)=>C.fecha.localeCompare(M.fecha)||C._id.localeCompare(M._id))}function o(b){const h={_id:a("tx"),fecha:b.fecha,cuentaId:b.cuentaId,importeCts:Co(b.tipo,b.importe,b.negativo),concepto:b.concepto,tags:b.tags??[],estimacionId:b.estimacionId??null,tipo:b.tipo,origen:b.origen??"manual",...b.nota?{nota:b.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),h]),h}function n(b,h){t.set("transacciones",t.get("transacciones").map($=>{if($._id!==b)return $;const{importe:C,...M}=h,A={...$,...M};return C!==void 0&&(A.importeCts=Co(A.tipo,C,A.importeCts<0)),A}))}function s(b){t.set("transacciones",t.get("transacciones").filter(h=>h._id!==b))}function i(b,h){n(b,{estimacionId:h})}function r(b){return t.get("puntosControl").filter(h=>!b||h.cuentaId===b).sort((h,$)=>h.fecha.localeCompare($.fecha))}function c(b,h,$,C){const M={_id:a("pc"),fecha:h,cuentaId:b,saldoCts:st($),...C?{nota:C}:{}},A=t.get("puntosControl").filter(_=>!(_.cuentaId===b&&_.fecha===h));return t.set("puntosControl",[...A,M].sort((_,E)=>_.fecha.localeCompare(E.fecha))),l(b),M}function u(b){const h=t.get("puntosControl").find($=>$._id===b);t.set("puntosControl",t.get("puntosControl").filter($=>$._id!==b)),h&&l(h.cuentaId)}function m(b,h,$){const C=A=>A.cuentaId===b&&A.fecha>=h&&A.fecha<=$,M=t.get("puntosControl").filter(C).length;return M===0?0:(t.set("puntosControl",t.get("puntosControl").filter(A=>!C(A))),l(b),M)}function d(b){const h=t.get("transacciones").filter(M=>M.origen==="importado"&&(!b||M.cuentaId===b)),$=new Map;for(const M of h){const A=$.get(M.cuentaId);A?A.push(M.fecha):$.set(M.cuentaId,[M.fecha])}const C=[];for(const[M,A]of $){A.sort();const _=m(M,A[0],A[A.length-1]);_>0&&C.push({cuentaId:M,eliminados:_})}return C}function l(b){const h=r(b),$=t.get("accounts");$.some(C=>C._id===b)&&t.set("accounts",$.map(C=>C._id===b?{...C,historicoSaldos:h.map(M=>({_id:M._id,fecha:M.fecha,saldo:W(M.saldoCts),...M.nota?{nota:M.nota}:{}}))}:C))}function f(b,h=Y()){const $=r(b).filter(_=>_.fecha<=h).pop(),C=$==null?void 0:$.fecha,M=($==null?void 0:$.saldoCts)??0;return t.get("transacciones").filter(_=>_.cuentaId===b&&_.fecha<=h&&(C===void 0||_.fecha>C)).reduce((_,E)=>_+E.importeCts,M)}function v(b,h){return W(f(b,h))}function y(b=Y(),h){const $=h??t.get("accounts").filter(C=>C.activo).map(C=>C._id);return W($.reduce((C,M)=>C+f(M,b),0))}function S(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function g(){const b=[...t.get("transacciones").map(h=>h.fecha),...t.get("puntosControl").map(h=>h.fecha)];return b.length>0?b.sort().pop()??null:null}function x(b={}){return W(e(b).reduce((h,$)=>h+$.importeCts,0))}function w(b={}){const h=new Map;for(const $ of e(b)){const C=$.fecha.slice(0,7);h.set(C,(h.get(C)??0)+$.importeCts)}return new Map([...h.entries()].sort(([$],[C])=>$.localeCompare(C)).map(([$,C])=>[$,W(C)]))}function I(b={}){const h=new Map;for(const $ of e(b))for(const C of $.tags.length>0?$.tags:["sin_tag"])h.set(C,(h.get(C)??0)+$.importeCts);return new Map([...h.entries()].map(([$,C])=>[$,W(C)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:c,eliminarPuntoControl:u,eliminarPuntosControlEnRango:m,sincronizarHistoricoImportado:d,saldoCuenta:v,saldoCuentaCts:f,saldoTotal:y,tieneDatos:S,ultimaFecha:g,total:x,totalPorMes:w,totalPorTag:I}}function ut(t){return t.trim().toLowerCase()}function Pr(t){function a(){const u=new Map,m=(d,l)=>{const f=ut(d);if(!f)return;const v=u.get(f)??{tag:f,estimaciones:0,reales:0,total:0};v[l]+=1,v.total+=1,u.set(f,v)};for(const d of t.get("expenses"))for(const l of d.tags??[])m(l,"estimaciones");for(const d of t.get("transacciones"))for(const l of d.tags??[])m(l,"reales");return[...u.values()].sort((d,l)=>l.total-d.total||d.tag.localeCompare(l.tag))}function e(){return a().map(u=>u.tag)}function o(u){return a().filter(m=>u==="estimaciones"?m.reales===0:m.estimaciones===0).map(m=>m.tag)}function n(u,m,d){const l=ut(m),f=(u??[]).map(ut);if(!f.includes(l))return u??[];const v=f.filter(y=>y!==l);return d===null?[...new Set(v)]:[...new Set([...v,ut(d)])]}function s(u,m){const d=ut(m);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(u,d)}function i(u,m){let d=0;for(const l of u)ut(l)!==ut(m)&&(d+=c(l,ut(m)).cambiados);return{cambiados:d}}function r(u){return c(u,null)}function c(u,m){let d=0;const l=t.get("expenses").map($=>{const C=n($.tags,u,m);return C!==$.tags&&(d+=1),C===$.tags?$:{...$,tags:C}});t.set("expenses",l);const f=t.get("transacciones").map($=>{const C=n($.tags,u,m);return C!==$.tags&&(d+=1),C===$.tags?$:{...$,tags:C}});t.set("transacciones",f);const v=t.get("loans").map($=>{const C=n($.tags,u,m);return C!==$.tags&&(d+=1),C===$.tags?$:{...$,tags:C}});t.set("loans",v);const y=t.get("nominas").map($=>{const C=n($.tags,u,m);return C!==$.tags&&(d+=1),C===$.tags?$:{...$,tags:C}});t.set("nominas",y);const S=t.get("config"),g=ut(u),x=$=>{const C=($??[]).map(ut);if(!C.includes(g))return $??[];const M=C.filter(A=>A!==g);return m===null?[...new Set(M)]:[...new Set([...M,m])]},w={},I=x(S.activeTagsFilter),b=x(S.tagCategorias),h=x(S.tagGrupos);return I!==S.activeTagsFilter&&(w.activeTagsFilter=I),b!==S.tagCategorias&&(w.tagCategorias=b),h!==S.tagGrupos&&(w.tagGrupos=h),Object.keys(w).length>0&&t.patchConfig(w),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Fr=3;function So(t){return t<.005?0:t}function Dr(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function Tr(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<Fr)continue;const r=Dr(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:So(n),sigmaDeriva:So(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Ao(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:U(e*Math.hypot(n,s))}function zr(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,u]=r.fecha.slice(0,7).split("-").map(Number),m=Math.max(0,(c-s)*12+(u-i)),d=Ao(a.sigmaMensual,m,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:U(r.saldoAcum+d),abajo:U(r.saldoAcum-d)}})}function jr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Qe="financeapp_session",qr=["local","dropbox","firebase"];function Nr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!qr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Rr({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(f){const v=n();if(v)try{f?v.setItem(Qe,JSON.stringify(f)):v.removeItem(Qe)}catch{}}function i(){const f=n();if(!f)return null;try{return Nr(f.getItem(Qe))}catch{return null}}function r(){const f=i();return f?(e()-f.ultimoUso)/6e4:null}function c(){const f=a();if(!Number.isFinite(f)||f<=0||o())return!1;const v=r();return v!==null&&v>=f}function u(){const f=i();return f?c()?(s(null),null):f:null}function m(f){const v=e(),y={modo:f.modo,...f.email?{email:f.email}:{},...f.passphrase?{passphrase:f.passphrase}:{},creadaEn:v,ultimoUso:v};return s(y),y}function d(){const f=i();f&&s({...f,ultimoUso:e()})}function l(){s(null)}return{abrir:m,leer:u,tocar:d,cerrar:l,caducada:c,inactividadMinutos:r,get activa(){return u()!==null}}}const Mo=["pointerdown","keydown","visibilitychange"];function Lr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const m of Mo)s==null||s.addEventListener(m,r);const c=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),a())},e);function u(){if(i){i=!1,n(c);for(const m of Mo)s==null||s.removeEventListener(m,r)}}return u}const Or=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],kr="FinanceApp",Br=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Eo(t){return new Uint8Array(new ArrayBuffer(t))}const Xe="financeapp_bio_credencial",Ze="financeapp_bio_secreto",ta="financeapp_bio_ultimo_desbloqueo",_o="financeapp_bio_gracia_min",Hr=5;function Gr(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function fe(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ge(t){const a=atob(t),e=Eo(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function Vr(t){return fe(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Ur(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ge(a)}function Po(t){return t.getClientExtensionResults()}function Yr(t={}){const a=t.webauthn??Gr(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(b=>crypto.getRandomValues(Eo(b)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const b=o==null?void 0:o.getItem(Xe);if(!b)return null;try{const h=JSON.parse(b);return typeof h.credencialId!="string"||typeof h.salt!="string"?null:h}catch{return null}}function u(){return c()!==null}async function m(b){const h=await e.importKey("raw",b,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Br},h,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(b,h){const $=s(12),C=await e.encrypt({name:"AES-GCM",iv:$},b,new TextEncoder().encode(h));return`${fe($)}:${fe(C)}`}async function l(b,h){const[$,C]=h.split(":"),M=ge($),A=ge(C),_=await e.decrypt({name:"AES-GCM",iv:M},b,A);return new TextDecoder().decode(_)}async function f(b,h){var R,O;if(!b)throw new Error("No hay clave de cifrado que envolver.");const $=s(32),C=s(32),M=s(16),A=await a.create({publicKey:{challenge:C,rp:{name:kr},user:{id:M,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:$}}},timeout:6e4}});if(!A)throw new Error("No se ha podido crear la credencial biométrica.");const _=Po(A);if(!((R=_.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let E=((O=_.prf.results)==null?void 0:O.first)??null;if(E||(E=await v(A.rawId,$)),!E)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await m(E),q=await d(F,b),D={credencialId:Vr(A.rawId),salt:fe($),modo:h,creadaEn:n()},j=i();j.setItem(Xe,JSON.stringify(D)),j.setItem(Ze,q)}async function v(b,h){var C,M;const $=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:b,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:h}}},timeout:6e4}});return $?((M=(C=Po($).prf)==null?void 0:C.results)==null?void 0:M.first)??null:null}async function y(){const b=c();if(!b)throw new Error("No hay huella configurada en este dispositivo.");const h=o==null?void 0:o.getItem(Ze);if(!h)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const $=await v(Ur(b.credencialId).buffer,ge(b.salt));if(!$)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const C=await m($),M=await l(C,h);return g(),M}function S(){o==null||o.removeItem(Xe),o==null||o.removeItem(Ze),o==null||o.removeItem(ta)}function g(){o==null||o.setItem(ta,String(n()))}function x(){const b=o==null?void 0:o.getItem(_o);if(b==null)return Hr;const h=Number(b);return Number.isFinite(h)&&h>0?h:0}function w(b){o==null||o.setItem(_o,String(Math.max(0,Math.floor(b)||0)))}function I(){if(!u())return!1;const b=x();if(b<=0)return!1;const h=o==null?void 0:o.getItem(ta),$=h?Number(h):NaN;return Number.isFinite($)?n()-$<b*6e4:!1}return{disponible:r,registrada:u,leerCredencial:c,registrar:f,desbloquear:y,olvidar:S,marcarDesbloqueo:g,dentroDeGracia:I,graciaMinutos:x,configurarGracia:w}}function Fo(){if(typeof localStorage<"u"){const h=On();h.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${h.join(", ")}`)}const t=Qn(),a=t.activo(),e=Wt(a),o=Ha(localStorage,e),n=Vn({adapter:o}),s=Un(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Vt})`),n.subscribe(h=>s.marcar(h));function r(){var $,C,M,A,_;const h=globalThis;(C=($=h.FirebaseService)==null?void 0:$.isConnected)!=null&&C.call($)&&((_=(A=(M=h.FirebaseService).uploadRegistroProyectos)==null?void 0:A.call(M))==null||_.catch(E=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",E instanceof Error?E.message:E)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(h=>h._id===a)??t.listar()[0],colecciones:It.filter(h=>h!=="config"),crear:h=>{const $=t.crear(h);return r(),$},renombrar:(h,$)=>{t.renombrar(h,$),r()},duplicar:(h,$)=>{const C=t.duplicar(h,$);return r(),C},eliminar:h=>{t.eliminar(h),r()},cambiarA:h=>t.establecerActivo(h),fusionarRemotos:h=>t.fusionarRemotos(h),importarDesde:(h,$)=>{const C=Xn(localStorage,h,$),M=Zn(C),A=[];for(const _ of $){const E=M[_];if(!Array.isArray(E)||E.length===0)continue;const F=n.get(_);n.set(_,[...F,...E]),A.push(_)}return A.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:A}}},u=es(n),m=Yr(),d=Rr({autoLogoutMinutos:()=>{var $,C;const h=(C=($=globalThis.State)==null?void 0:$.get)==null?void 0:C.call($,"config");return Number((h==null?void 0:h.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>m.dentroDeGracia()}),l=_r(n),f=Pr(n),v=Hi(l),y=er(n),S=Ms({isEnabled:h=>u.isEnabled(h)}),g=ys({flags:u,rutasExtra:()=>S.flagPorRuta()}),x=ss({flags:u,onChange:()=>{var h,$;S.attachToShell(),g.apply(),($=(h=globalThis.Router)==null?void 0:h.rerender)==null||$.call(h)}}),w=ms({proyectos:c}),I=()=>{var $,C,M,A,_,E;const h=globalThis;if((C=($=h.State)==null?void 0:$.load)==null||C.call($),((A=(M=h.Router)==null?void 0:M.current)==null?void 0:A.call(M))==="dashboard")try{(E=(_=h.DashboardModule)==null?void 0:_.render)==null||E.call(_)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},b=hs({store:n,onDatosCambiados:I});return S.register(Ls({store:n,onDatosCambiados:I})),S.register(Ks({store:n,onDatosCambiados:I})),S.register($i({store:n,onDatosCambiados:I})),S.register(Er({store:n,ledger:l,tags:f,precision:v,adjuster:y,onDatosCambiados:I})),S.register(Ps({store:n,onDatosCambiados:I})),{version:Vt,core:ko,engine:{generarExtracto:Ia,recomputarSaldoAcum:Go,saldoHoy:Vo,sumarPorTags:Ca,providers:{proyectarGastos:Bt,proyectarPrestamos:fa,proyectarTransferencias:ga,proyectarNominas:ya,proyectarInteresesCuentas:ba,proyectarAportaciones:va,proyectarRetencionesFiscales:ha,proyectarInflacionGastos:xa,proyectarPerdidaAhorro:$a},analysis:Ko,margins:an,avisos:rn,dashboard:$n},store:n,flags:u,featureRegistry:{all:xt,porGrupo:Ka},ui:{openFeatures:x.open,openProyectos:w.open,openPersonas:b.open,applyGating:g.apply,watchGating:()=>g.observar(),instalarDeshacer:()=>$s({store:n,rerender:()=>{var $,C,M,A;const h=globalThis;(C=($=h.State)==null?void 0:$.load)==null||C.call($),(A=(M=h.Router)==null?void 0:M.rerender)==null||A.call(M)}}),avisoGuardado:null,instalarBuscador:()=>Ss({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>S.routes(),navegar:h=>{var $,C;return(C=($=globalThis.Router)==null?void 0:$.navigate)==null?void 0:C.call($,h)}})},app:S,session:Object.assign(d,{vigilar:h=>Lr({sesion:d,onCaducada:h}),opciones:Or}),biometria:m,cambios:s,datos:{colecciones:It,snapshot:()=>Ga(o),aplicar:(h,{sellar:$=!0}={})=>{const M=Yn($?(A,_)=>o.set(A,_):(A,_)=>{const E=globalThis.StorageAdapter;E!=null&&E.setRestaurando?E.setRestaurando(A,_):o.set(A,_)},h);return n.load(),s.marcar("copia-restaurada"),M},faltantes:h=>Wn(h),esVacioOPorDefecto:()=>Kn(Ga(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:l,tags:f,precision:v,adjuster:y,sugerirAjuste:Ve,medirVariabilidad:Tr,bandaDeConfianza:zr,bandaAcumulada:Ao,describirBanda:jr}}}function Wr(){try{const t=Fo();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const nt=typeof window<"u"?Wr():null;if(nt){let t=!1;const a=()=>{var e,o;if(nt.app.attachToShell(),nt.ui.applyGating(),!t){t=!0,nt.ui.watchGating(),nt.ui.instalarDeshacer(),nt.ui.instalarBuscador();const n=globalThis,s=()=>{var c,u,m,d;return(u=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&u.call(c)?n.FirebaseService:(d=(m=n.DropboxService)==null?void 0:m.isConnected)!=null&&d.call(m)?n.DropboxService:null};nt.ui.avisoGuardado=As({cambios:nt.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=nt.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>nt.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>nt.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>nt.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return ve.bootstrap=Fo,Object.defineProperty(ve,Symbol.toStringTag,{value:"Module"}),ve}({});
//# sourceMappingURL=financeapp-core.js.map
