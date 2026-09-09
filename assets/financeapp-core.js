var FinanceAppBundle=function(he){"use strict";function Y(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function k(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function K(){return Y(new Date)}function ye(t,a){return new Date(t,a+1,0).getDate()}function oa(t,a,e){return Y(new Date(t,a,Math.min(e,ye(t,a))))}function se(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return Y(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return oa(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return Y(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),Y(i)}return null}function na(t,a){if(!a)return t;const e=k(t);return se(e.getFullYear(),e.getMonth(),a)??t}const Lo=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Oo={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function $e(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${Oo[e]||e+"º"} ${Lo[o]} del mes`}return t}function Ot(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function kt(t){const a=k(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),Y(a)}function sa(t,a){const e=k(t);return e.setDate(e.getDate()+a),Y(e)}function it(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function J(t){return t/100}function W(t){return J(it(t))}function P(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ia(t){return(t||0).toFixed(2)+"%"}function wt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function ra(t,a,e,o=0){const n=wt(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-e))/i-s,p=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),l=i-u/p;if(Math.abs(l-i)<1e-10){i=l;break}i=l}return(Math.pow(1+i,12)-1)*100}function ca(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const u=k(o),p=a/100/12;let l=e,d=wt(c,a,l);const g=[...s].sort((h,I)=>h.fecha.localeCompare(I.fecha));let v=0;for(let h=1;h<=e*2&&c>.01;h++){const I=new Date(u);u.setMonth(u.getMonth()+1);const f=na(Y(I),i.diaPago||"");for(;v<g.length&&g[v].fecha<=f;){const S=g[v],x=S.cantidad*(n/100);if(c-=S.cantidad,c=Math.max(0,c),S.tipo==="plazo"?l=Math.ceil(-Math.log(1-c*p/d)/Math.log(1+p)):(l=e-h+1,d=wt(c,a,l)),r.push({mes:"AMORT",fecha:S.fecha,cuota:0,interes:0,amortizacion:S.cantidad,comisionAmort:x,capitalPendiente:c,esAmortizacion:!0,simulacion:S.simulacion||!1}),v++,c<.01)break}if(c<.01)break;const b=c*p,C=Math.min(d-b,c);if(c-=C,c<.01&&(c=0),r.push({mes:h,fecha:f,cuota:d,interes:b,amortizacion:C,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),l--,l<=0||c<.01)break}return r}const la=new Map;function Q(t){var I;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,b)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=la.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:u}=t,p=ca(n,s,i,r,c||0,a,t),l=p.reduce((f,b)=>f+b.interes,0),d=p.reduce((f,b)=>f+b.comisionAmort,0),g=n*((u||0)/100),v=p.filter(f=>!f.esAmortizacion),h={cuota:wt(n,s,i),totalIntereses:l,tae:ra(n,s,i,u||0),costoTotal:l+d+g,comAp:g,totalComAm:d,fechaFin:((I=v.slice(-1)[0])==null?void 0:I.fecha)||"",mesesReales:v.length,tabla:p};return la.set(e,h),h}function da(t){const a=Q(t),e=Q({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function gt(t,a,e){if(!t||t.length===0)return 1;const o=k(a),n=k(e);if(n<=o)return 1;const s=[...t].sort((c,u)=>c.year-u.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),u=s.filter(h=>h.year<=c),p=u.length>0?u[u.length-1]:s[0],l=(p?p.tasa:0)/100,d=new Date(c+1,0,1),g=d<n?d:n,v=Ot(r,g);i*=Math.pow(1+l,v/365.25),r=g}return i}function ua(t,a,e,o=0){const n=k(a),s=k(e);if(s<=n)return o;const i=Ot(n,s),r=t?[...t].sort((p,l)=>p.year-l.year):[];let c=0,u=new Date(n);for(;u<s;){const p=u.getFullYear(),l=new Date(p+1,0,1),d=l<s?l:s,g=Ot(u,d),v=r.filter(f=>f.year<=p),h=v.length>0?v[v.length-1]:null,I=h!==null?h.tasa:o;c+=I*g,u=d}return i>0?c/i:o}function pa(t,a){return((1+t/100)/(1+a/100)-1)*100}function ko(t,a,e,o){const n=gt(a,e,o);return n>0?t/n:t}function Bo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:u=0,cuotasHipoteca:p=0,gastosBasicos:l=0,gastosOtros:d=0,amortizaciones:g=0}=t,v=c-u-g-l-d,h=v,I=c>0?h/c*100:null,f=r?u-p:u,b=c>0?f/c*100:null,C=c>0?u/c*100:null,S=c>0?(l+u+g)/c*100:null,x=c>0?d/c*100:null,$=(_,w,y)=>_===null?"neutral":_>=w?"verde":_>=y?"amarillo":"rojo",A=(_,w,y)=>_===null?"neutral":_<=w?"verde":_<=y?"amarillo":"rojo";return{ingresos:c,cuotas:u,cuotasHipoteca:p,gastosBasicos:l,gastosOtros:d,amortizaciones:g,ahorroBruto:v,ahorroReal:h,tasaAhorro:I,dti:b,dtiTotal:C,excluyeHipoteca:r,pctNecesidades:S,pctDeseos:x,semAhorro:$(I,e,o),semDTI:A(b,n,s),semNecesidades:A(S,i[0],i[0]+15),semDeseos:A(x,i[1],i[1]+10),semAhorroRegla:$(I,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function rt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function vt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Bt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=e&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=a);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a);return n?n.saldo:0}}function Ho(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Go(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function ie(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Vo(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function Uo(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function Et(t,a,e){const o=it(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:J(o)}];const n=a.participantes.map(l=>l.personaId);if(a.modo==="partesIguales"){const l=Vo(o,n.length);return n.map((d,g)=>({personaId:d,importe:J(l[g])}))}const s=a.participantes.map(l=>{const d=Math.max(0,l.valor??0);return a.modo==="porcentaje"?Math.round(o*d/100):it(d)}),i=s.reduce((l,d)=>l+d,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const l=o/i,d=s.map(v=>Math.round(v*l)),g=d.reduce((v,h)=>v+h,0);return d.length>0&&(d[0]+=o-g),n.map((v,h)=>({personaId:v,importe:J(d[h])}))}const c=o-i,{ids:u,cts:p}=Uo(n,s,c,e);return u.map((l,d)=>({personaId:l,importe:J(p[d])}))}function xe(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Yo(t,a,e){const o=ie(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=xe(a.expenses,i.sourceId);for(const u of Et(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Et(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const c=xe(a.loans,i.sourceId);for(const u of Et(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of Et(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=xe(a.nominas,i.sourceId);for(const u of Et(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function we(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const It=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function ma(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function bt(t,a){return ma(t,a).baseImponible}function fa(t,a){return lt(t,a)/12}const Ht=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ie(t,a){if(!t||t<=0)return 0;const e=a||Ht;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,u=Math.min(n,c-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function re(t,a){if(rt(t)!=="inversion")return null;const e=vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=Ie(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function Ce(t,a=new Date){var d;if(rt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=vt(t),n=Y(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((g,v)=>g.fecha.localeCompare(v.fecha));let i=0;const r=s.reduce((g,v)=>g+v.cantidad,0);for(const g of s)g.fecha<=n&&(i+=g.cantidad);const c=Math.max(0,o-r),u=r>0?i/r:0,p=Math.min(o,i+c*u),l=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:l,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((d=s.find(g=>g.fecha>n))==null?void 0:d.fecha)||null}}function ga(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(rt(t)!=="pension"||!o)return 0;const n=vt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,p)=>u+p.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function Se(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,p)=>u+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((u,p)=>u[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[u,p]of i)if(s>=u)r=p;else break;return r}const Wo=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Ht,TRAMOS_IRPF_DEFAULT:It,agregarPorPersona:Yo,ajustarFechaPago:na,ajustarPrecioReal:ko,calcBaseImponibleTrabajo:bt,calcFactorInflacion:gt,calcFondoInversion:re,calcFondosPension:Ce,calcGananciasCapital:Ie,calcIRPF:lt,calcImpuestoPension:ga,calcInflacionMediaAnual:ua,calcSaludFinanciera:Bo,calcTAE:ra,calcTipoMarginalPension:Se,calcTipoRealFisher:pa,calcularReparto:Et,clampedDate:oa,cuotaMensual:wt,desgloseBaseTrabajo:ma,diasEntre:Ot,finDeSemana:kt,formatEUR:P,formatLocalDate:Y,formatPct:ia,fromCents:J,haySimulaciones:Go,idPersonaPorDefecto:ie,labelDiaPago:$e,lastDayOfMonth:ye,modeloFondoDe:rt,parseLocalDate:k,personasImplicadas:we,resolverDiaEfectivo:se,resumenPrestamo:Q,resumenPrestamoConAhorro:da,retencionMensual:fa,roundMoney:W,saldoEnFecha:Bt,saldoRealCuenta:vt,sinSimulaciones:Ho,sumarDias:sa,tablaAmortizacion:ca,toCents:it,todayISO:K},Symbol.toStringTag,{value:"Module"}));function Gt(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=k(i.fechaInicio||a.start),c=i.fechaFin?k(i.fechaFin):s,u=i.cuantia,p=l=>o.push({fecha:l,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const l=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),g=r.getMonth();const v=Math.ceil(240/l)+2;for(let h=0;h<v;h++){const I=se(d,g,i.diaPago||"")||(()=>{const b=r.getDate(),C=new Date(d,g+1,0).getDate();return Y(new Date(d,g,Math.min(b,C)))})(),f=k(I);if(f>s||f>c)break;f>=n&&f>=r&&p(I),g+=l,g>=12&&(d+=Math.floor(g/12),g=g%12)}}else if(i.tipoFrecuencia==="diaria"){const l=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const g=Math.ceil((n.getTime()-r.getTime())/l);d=new Date(r.getTime()+g*l)}for(;d<=s&&d<=c;)p(Y(d)),d=new Date(d.getTime()+l)}}return o}function va(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=Q(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ba(t,a,e=null,o={accounts:[]}){const n=[],s=k(a.start),i=k(a.end),r=o.accounts||[],c=o.nominas||[],u=o.resolverTramosIRPF||(()=>It),p=o.resolverTramosGanancias||(()=>Ht),l=d=>{var g;return((g=r.find(v=>v._id===d))==null?void 0:g.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(d.cuenta||"default")||e.includes(d.cuentaDestino||"default")))continue;const g=k(d.fechaInicio||a.start),v=d.fechaFin?k(d.fechaFin):i,h=I=>{const f=r.find(E=>E._id===(d.cuenta||"default")),b=r.find(E=>E._id===(d.cuentaDestino||"default")),C=rt(f),S=rt(b),x=C==="inversion"&&S==="inversion"||C==="pension"&&S==="pension",$=["transferencia",...x?["traspaso"]:[],...d.tags||[]],A=x?"traspaso-out":"transfer-out",_=x?"traspaso-in":"transfer-in",w=!e||e.length===0||e.includes(d.cuenta||"default"),y=!e||e.length===0||e.includes(d.cuentaDestino||"default");if(w&&n.push({fecha:I,concepto:`Transf. → ${l(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:$,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:A}),y&&n.push({fecha:I,concepto:`Transf. ← ${l(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:$,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:_}),w&&!x&&f){if(C==="inversion"){const E=parseInt(I.slice(0,4)),M=re(f,p(E));if(M&&M.saldo>0&&M.plusvalia>0){const F=Math.min(1,d.cuantia/M.saldo),q=M.plusvalia*F*.19;q>.01&&n.push({fecha:I,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:q,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(C==="pension"){const E=u(parseInt(I.slice(0,4))),M=Se(f,c,E),F=ga(f,d.cuantia,M||void 0);if(F>0){const D=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${M}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:I,concepto:D,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")g>=s&&g<=i&&g<=v&&h(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const I=Math.max(1,d.frecuencia||1);let f=g.getFullYear(),b=g.getMonth();const C=Math.ceil(240/I)+2;for(let S=0;S<C;S++){const x=se(f,b,d.diaPago||"")||(()=>{const A=g.getDate(),_=new Date(f,b+1,0).getDate();return Y(new Date(f,b,Math.min(A,_)))})(),$=k(x);if($>i||$>v)break;$>=s&&$>=g&&h(x),b+=I,b>=12&&(f+=Math.floor(b/12),b=b%12)}}else if(d.tipoFrecuencia==="diaria"){const I=Math.max(1,d.frecuencia||1)*864e5;let f=new Date(Math.max(g.getTime(),s.getTime()));if(g<s){const b=Math.ceil((s.getTime()-g.getTime())/I);f=new Date(g.getTime()+b*I)}for(;f<=i&&f<=v;)h(Y(f)),f=new Date(f.getTime()+I)}}return n}function ha(t,a,e=null){const o=[],n=k(a.start),s=k(a.end);for(const i of t){const r=rt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const u of c){if(!u.importe||u.importe<=0)continue;const p=k(u.fechaInicio||a.start),l=u.fechaFin?k(u.fechaFin):s,d=u.cuentaOrigen||"default",g=!e||!e.length||e.includes(d),v=!e||!e.length||e.includes(i._id),h=r==="pension"?"pension":"capital-mobiliario",I=x=>{g&&o.push({fecha:x,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",h],cuenta:d,sourceId:u._id,sourceType:"aportacion-out"}),v&&o.push({fecha:x,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",h],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let b=p.getFullYear(),C=p.getMonth();const S=Math.ceil(240/f)+2;for(let x=0;x<S;x++){const $=new Date(b,C+1,0).getDate(),A=Y(new Date(b,C,Math.min(p.getDate(),$))),_=k(A);if(_>s||_>l)break;_>=n&&_>=p&&I(A),C+=f,C>=12&&(b+=Math.floor(C/12),C=C%12)}}}return o}function ya(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=k(a.start),r=k(a.end),c=s.periodoCobro||"mensual",u=c==="mensual",p=u?null:{diario:864e5,semanal:7*864e5}[c]||864e5,l=u?1/12:p/(365.25*864e5);let d=Bt(s,a.start);const g=o.filter(I=>I.cuenta===s._id).map(I=>({fecha:I.fecha,delta:I.tipo==="ingreso"?Math.abs(I.cuantia):-Math.abs(I.cuantia)})).sort((I,f)=>I.fecha.localeCompare(f.fecha));let v=0,h=new Date(i);for(;h<=r;){const I=u?new Date(h.getFullYear(),h.getMonth()+1,h.getDate()):new Date(h.getTime()+p),f=new Date(Math.min(I.getTime(),r.getTime()+1)),b=Y(f);let C=0;for(;v<g.length&&g[v].fecha<b;)C+=g[v].delta,v++;const S=d,x=d+C,$=Math.max(0,(S+x)/2);d=x;const A=u?l:(f.getTime()-h.getTime())/(365.25*864e5),_=$*(Math.pow(1+s.interes/100,A)-1);_>.001&&n.push({fecha:Y(h),concepto:`Interés ${s.nombre}`,cuantia:_,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),h=I}}return n}function $a(t,a,e,o=null){const n=[],s=a||It;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=fa(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Gt([u],e,o))}return n}const Ko=[5,11,2,8],Jo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function xa(t,a,e=null,o=[],n=()=>It){const s=[],i=k(a.start),r=k(a.end),c=o.length>0,u={};for(const d of t){const g=d.grupoNomina||"";u[g]||(u[g]=[]),u[g].push(d)}for(const d of Object.keys(u))u[d].sort((g,v)=>(v.bruto||0)-(g.bruto||0));function p(d,g){if(!c||!d.mesActualizacionIPC)return d.bruto||0;const v=d.fechaInicio||a.start,h=k(v),I=k(g);let f=0;for(let C=h.getFullYear();C<=I.getFullYear();C++){const S=new Date(C,d.mesActualizacionIPC-1,1);S>h&&S<=I&&f++}if(f===0)return d.bruto||0;const b=Y(new Date(h.getFullYear()+f,0,1));return(d.bruto||0)*gt(o,v,b)}function l(d,g){const v=p(d,g),h=(d.retribucionFlexible||[]).reduce((E,M)=>E+(M.importe||0)*12,0),I=Math.max(0,v-h);if(d.irpfModo==="manual")return I*((d.irpfPct||0)/100);const f=n(parseInt(g.slice(0,4))),b=d.grupoNomina||"";if(!b)return lt(bt(v,h),f);const C=u[b].filter(E=>E.activo),S=C.reduce((E,M)=>E+p(M,g),0),x=C.reduce((E,M)=>E+(M.retribucionFlexible||[]).reduce((F,D)=>F+(D.importe||0)*12,0),0),$=Math.max(0,S-x),A=bt(S,x),_=Math.max(0,v-h),w=$>0?A*(_/$):0,y=C.filter(E=>E._id!==d._id&&(E.bruto||0)>(d.bruto||0)).reduce((E,M)=>{const F=(M.retribucionFlexible||[]).reduce((q,T)=>q+(T.importe||0)*12,0),D=Math.max(0,p(M,g)-F);return E+($>0?A*(D/$):0)},0);return lt(y+w,f)-lt(y,f)}for(const d of t){if(!d.activo)continue;const g=d.cuenta||"default";if(e&&e.length>0&&!e.includes(g))continue;const v=Math.max(1,d.nPagas||12),h=k(d.fechaInicio||a.start),I=d.fechaFin?k(d.fechaFin):r,f=b=>{const C=p(d,b),S=l(d,b),x=(d.retribucionFlexible||[]).reduce((F,D)=>F+(D.importe||0)*12,0),$=Math.max(0,C-x),A=(d.ssPct??6.35)/100,_=$*A,w=$/v,y=S/v,E=_/v,M=d.representacion==="simplificado"?w-E-y:w;s.push({fecha:b,concepto:d.nombre,cuantia:M,tipo:"ingreso",cuenta:g,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(E>0&&s.push({fecha:b,concepto:`SS ${d.nombre}`,cuantia:E,tipo:"gasto",cuenta:g,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),y>0&&s.push({fecha:b,concepto:`IRPF ${d.nombre}`,cuantia:y,tipo:"gasto",cuenta:g,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const F of d.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:b,concepto:`${d.nombre} — ${Jo[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${d._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(v<=12){const b=v===12?1:Math.round(12/v),C=h.getDate();let S=h.getFullYear(),x=h.getMonth();for(let $=0;$<300;$++){const A=new Date(S,x+1,0).getDate(),_=new Date(S,x,Math.min(C,A));if(_>r||_>I)break;_>=i&&_>=h&&f(Y(_)),x+=b,x>=12&&(S+=Math.floor(x/12),x=x%12)}}else{const b=v-12,C=h.getDate();let S=h.getFullYear(),x=h.getMonth();for(let _=0;_<300;_++){const w=new Date(S,x+1,0).getDate(),y=new Date(S,x,Math.min(C,w));if(y>r||y>I)break;y>=i&&y>=h&&f(Y(y)),x++,x>=12&&(S++,x=0)}const $=Math.max(h.getFullYear(),i.getFullYear()),A=Math.min((d.fechaFin?I:r).getFullYear(),r.getFullYear());for(let _=$;_<=A;_++)for(const w of Ko.slice(0,b)){const y=new Date(_,w,15);y>=i&&y<=r&&y>=h&&y<=I&&f(Y(y))}}}return s}function wa(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=k(e.start),r=k(e.end),c=K(),u=t.filter(l=>l.activo&&l.tipo==="gasto"&&l.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const l=p.getFullYear(),d=p.getMonth(),g=l+"-"+String(d+1).padStart(2,"0"),v=g+"-01",h=Y(new Date(l,d+1,0)),I=Y(new Date(l,d,15));let f=0;for(const b of u){if(o&&o.length>0&&!o.includes(b.cuenta||"default")||b.fechaInicio&&b.fechaInicio>h||b.fechaFin&&b.fechaFin<v)continue;const C=b.fechaInicio||c,S=gt(a,C,I);if(S<=1)continue;const x=Math.max(1,b.frecuencia||1);f+=b.cuantia*(S-1)/x}f>.01&&s.push({fecha:I,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+g,sourceType:"inflacion"}),p=new Date(l,d+1,1)}return s}function Ia(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=k(e.start),i=k(e.end),r=[...a].sort((u,p)=>u.year-p.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const u=c.getFullYear(),p=c.getMonth(),l=u+"-"+String(p+1).padStart(2,"0"),d=Y(new Date(u,p,15)),g=r.filter(b=>b.year<=u),v=g.length>0?g[g.length-1]:r[0],h=v?v.tasa/100:0,I=Math.pow(1+h,1/12)-1,f=t*I;f>.01&&n.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+l,sourceType:"inflacion"}),c=new Date(u,p+1,1)}return n}function Ca(t,a,e){const o=e.fechaReferencia||e.dashboardStart,n=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,s=a.reduce((l,d)=>l+Bt(d,n),0),i=t.filter(l=>l.fecha<n),r=t.filter(l=>l.fecha>=n),c=[];let u=s;for(const l of[...i].reverse()){const d=l.tipo==="ingreso"?Math.abs(l.cuantia):-Math.abs(l.cuantia);c.unshift({...l,delta:d,saldoAcum:u}),u-=d}const p=[];u=s;for(const l of r){const d=l.tipo==="ingreso"?Math.abs(l.cuantia):-Math.abs(l.cuantia);u+=d,p.push({...l,delta:d,saldoAcum:u})}return[...c,...p]}function Qo(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ca([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function Sa(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c={start:n.dashboardStart,end:n.dashboardEnd},u=e.filter(h=>h.tipo!=="transferencia"),p=e.filter(h=>h.tipo==="transferencia"),l={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Gt(u,c,s)),d=d.concat(va(a,c,s)),d=d.concat(ba(p,c,s,l)),d=d.concat(ha(o,c,s));const g=ya(o,c,s,d);if(d=d.concat(g),d=d.concat($a(e,n.tramos_irpf,c,s)),d=d.concat(xa(i,c,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const h=(o.find(b=>b.activo&&b.esCuentaPrincipal)||o.find(b=>b.activo)||{_id:"default"})._id;d=d.concat(wa(u,r,c,s,h));const f=o.filter(b=>b.activo&&(!s||s.length===0||s.includes(b._id))).reduce((b,C)=>b+Bt(C,n.dashboardStart),0);d=d.concat(Ia(f,r,c,h))}d.sort((h,I)=>h.fecha.localeCompare(I.fecha));const v=o.filter(h=>h.activo&&(!s||s.length===0||s.includes(h._id)));return Ca(d,v,n)}function Xo(t,a,e=null){const o=K(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Aa(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Zo(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${P(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${P(i)} < ${P(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${P(i)})`})))}return e}function tn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=k(a.dashboardStart),n=k(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function en(t,a,e=K()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",u={};c&&c<=e&&(u[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(u[p.fecha]=p.saldo);return Object.keys(u).forEach(p=>o.add(p)),u}),s={};for(const r of[...o].sort()){let c=0;for(let u=0;u<a.length;u++){const p=Object.entries(n[u]).filter(([l])=>l<=r);p.length>0?(p.sort(([l],[d])=>d.localeCompare(l)),c+=p[0][1]):c+=a[u].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([u],[p])=>u.localeCompare(p))){const u=t.filter(g=>g.fecha<=r),p=u.length>0?u[u.length-1].saldoAcum:null;if(p===null)continue;const l=c-p,d=p!==0?l/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:l,pct:d})}return i}const an=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:en,detectarPuntosCriticos:Zo,mediaMensualGastos:tn},Symbol.toStringTag,{value:"Module"}));function Vt(t,a=new Date){const e=Y(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=Y(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Gt(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function on(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+wt(e.capital,e.tin,e.meses),0)}function nn(t,a){return Q(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Ma(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+wt(n.capital,n.tin,n.meses)*Math.min(a,nn(n,e)),0)}function Ea(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=Vt(t,o),s=a.colchonMeses||6;return n*s+Ma(e,s,Y(o))}function sn(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((u,p)=>u.fecha.localeCompare(p.fecha)).filter(u=>u.fecha<=o).pop();if(!i)return Ea(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=Vt(t,n),c=i.meses||6;return r*c+Ma(e,c,o)}function Ae(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((p,l)=>p.fecha.localeCompare(l.fecha)),c=r.filter(p=>p.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(Vt(a,i)+on(o))*(c.meses||1):0}function rn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function cn(t,a){const e={};for(const o of a)e[o._id]=vt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=rn(o)),{fecha:o.fecha,saldos:{...e}}))}function ln(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let p=0;p<a.length;p++){const l=a[p],d=Ae(c,o,n,s,l.fecha,!1,i);if(d<=0){u=!1;continue}const g=!c.cuentas||c.cuentas.length===0?l.saldoAcum:c.cuentas.reduce((v,h)=>{var I,f;return v+(((f=(I=e[p])==null?void 0:I.saldos)==null?void 0:f[h])||0)},0);g<d&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:l.fecha,saldo:g,target:d,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${P(g)} < ${P(d)} desde ${l.fecha}`})):g>=d&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:l.fecha,saldo:g,target:d,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${l.fecha}`}))}}return r}const dn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ea,calcColchonEnFecha:sn,calcGastoBasicoMensual:Vt,calcMargenEnFecha:Ae,detectarCrucesMargenes:ln,saldosPorCuentaEnExtracto:cn},Symbol.toStringTag,{value:"Module"}));function un(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function _a(t,a){return Ot(k(t),k(a))}const pn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Pa(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${pn[o-1]}${s?"":` de ${e}`}`}function Fa(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function mn(t,a={}){const{hoy:e=K(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const l of t.puntosCriticos??[])l.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:d=>d?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:d=>`El ${d} el saldo proyectado baja a ${P(l.saldo)}.`}):l.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:l.fecha,distancia:Math.abs(l.saldo),titulo:d=>d?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:d=>`El ${d} el saldo queda en ${P(l.saldo)}, por debajo del colchón.`});for(const l of t.crucesMargenes??[])l.tipo==="bajo_margen"&&r.push({id:`margen:${l.nombre}`,gravedad:"aviso",fecha:l.fecha,distancia:Math.max(0,l.target-l.saldo),titulo:d=>d?`Podrías bajar de «${l.nombre}»`:`Bajas de «${l.nombre}»`,detalle:d=>`El ${d} tendrías ${P(l.saldo)}, y el margen pide ${P(l.target)}.`});const c=new Map;for(const l of r){const d=c.get(l.id);(!d||l.fecha<d.fecha)&&c.set(l.id,l)}const u=[];for(const l of c.values()){const d=_a(e,l.fecha);if(d<0||d>(l.gravedad==="critico"?o:n))continue;const g=i?i(d):0,v=g>0&&l.distancia<g;u.push({id:l.id,gravedad:l.gravedad,fecha:l.fecha,dias:d,plazo:Fa(d),titulo:l.titulo(v),detalle:l.detalle(Pa(l.fecha,e)),incierto:v})}const p={critico:0,aviso:1};return u.sort((l,d)=>l.fecha.localeCompare(d.fecha)||p[l.gravedad]-p[d.gravedad]),u.slice(0,s)}const fn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:un,construirAvisos:mn,describirPlazo:Fa,diasEntreISO:_a,fechaEnPalabras:Pa},Symbol.toStringTag,{value:"Module"})),gn=30.44*864e5;function Da(t){const a=t.getFullYear(),e=t.getMonth();return{desde:Y(new Date(a,e,1)),hasta:Y(new Date(a,e,ye(a,e)))}}function Ta(t){const[a,e]=t.split("-").map(Number);return Da(new Date(a,e-1,1))}function vn(t,a){return Math.max(1,(k(a).getTime()-k(t).getTime())/gn)}const bn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),ht=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function hn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function yn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",n=a.loanIdsIniciados,s=ht(t.filter(d=>d.tipo==="ingreso")),i=ht(t.filter(d=>o(d)&&(!n||n.has(d.sourceId??"")))),r=ht(t.filter(d=>o(d)&&a.hipotecaIds.has(d.sourceId??""))),c=ht(t.filter(d=>d.sourceType==="loan-amort")),u=ht(t.filter(d=>d.sourceType==="account-interest")),{basicos:p,deseo:l}=hn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:l/e,gastosTotales:(i+p+l)/e,intereses:u/e}}function za(t,a){return t.reduce((e,o)=>{const n=Q(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function $n(t,a,e,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=e),s=n.reduce((u,p)=>{if((p.amortizaciones||[]).filter(v=>v.fecha>=a&&v.fecha<=e).length===0)return u;const d=Q(p).totalIntereses,g=Q({...p,amortizaciones:(p.amortizaciones||[]).filter(v=>v.fecha<a||v.fecha>e)}).totalIntereses;return u+Math.max(0,g-d)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:Q(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=a&&u.fechaFin<=e),r=n.map(u=>Q(u).tabla),c=u=>{const{desde:p,hasta:l}=Ta(u);return r.reduce((d,g)=>{const v=g.find(h=>!h.esAmortizacion&&h.fecha>=p&&h.fecha<=l);return d+(v?v.cuota:0)},0)};return{deudaInicio:za(n,a),deudaFin:za(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function xn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:ht(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function ja(t,a=new Set,e="desglosado"){if(a.size===0)return Aa(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>a.has(u)),r=s.filter(u=>!a.has(u)),c=e==="porgrupos"&&i.length>0?i:r;for(const u of c)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function wn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...ja(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function In(t,a){const e=a.reduce((o,n)=>o+vt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:ht(t.filter(o=>o.tipo==="gasto")),totalIngresos:ht(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Cn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Sn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function An(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function Mn(t,a){if(t.length===0)return[];const e=u=>a==="mes"?u.slice(0,7):u.slice(0,4),o=u=>a==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const u of t){const p=e(u.fecha),l=u.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:l,maximo:Math.max(i,l),minimo:Math.min(i,l),eventos:0},r.push(c)),c.cierre=l,l>c.maximo&&(c.maximo=l),l<c.minimo&&(c.minimo=l),c.eventos+=1}return r}const En=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Mn,cuentasVisibles:Cn,gastoPorTagOrdenado:wn,idsHipoteca:Sn,idsPrestamosIniciados:An,interesesPorCuenta:xn,mesesDelPeriodo:vn,metricasFlujo:yn,rangoMes:Ta,rangoMesDe:Da,resumenPrestamosPeriodo:$n,sinTransferencias:bn,sumarGastosPorTag:ja,totalesPeriodo:In},Symbol.toStringTag,{value:"Module"}));function _n(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Ut(t,a){return e=>_n(t,a,e)}const Yt=10,qa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Na=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Me(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ra="default";function La(){return{_id:Ra,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Oa(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:qa,tramosGananciasCapital:Na,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function ka(t,a){return{loans:[],expenses:[],accounts:[Me(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[La()],config:Oa(t,a)}}const dt=t=>Array.isArray(t)?t:[],Pn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Wt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ba(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ee(t){const{varianza:a,inflacion:e,...o}=t;return o}function Fn(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=Pn(t.config),r={...Oa(e,o)};for(const[p,l]of Object.entries(s))l!=null&&(r[p]=l);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=qa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Na),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=dt(t.accounts).map(p=>{const l={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return l.modeloFondo||(l.modeloFondo=l.esFondoPension?"pension":"cuenta"),delete l.esFondoPension,Array.isArray(l.historicoSaldos)||(l.historicoSaldos=[]),Wt(l)});c.length===0&&(c=[Me(e)]);const u=c.filter(p=>p.esCuentaPrincipal);if(u.length===0){const p=c.find(l=>l._id==="default")||c[0];c=c.map(l=>({...l,esCuentaPrincipal:l._id===p._id}))}else if(u.length>1){let p=!1;c=c.map(l=>l.esCuentaPrincipal?p?{...l,esCuentaPrincipal:!1}:(p=!0,l):l)}return n.accounts=c,n.expenses=dt(t.expenses).map(p=>{const l={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.historialPrecios)||(l.historialPrecios=[]),l.diaPago=Ba(l.diaPago),Ee(Wt(l))}),n.loans=dt(t.loans).map(p=>{const l={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(l.tags)||(l.tags=[]),l.diaPago=Ba(l.diaPago),l.amortizaciones=dt(l.amortizaciones).map(d=>Wt(d)),Ee(Wt(l))}),n.nominas=dt(t.nominas).map(p=>{const l={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(l.tags)||(l.tags=[]),Array.isArray(l.retribucionFlexible)||(l.retribucionFlexible=[]),Ee(Wt(l))}),n.goals=dt(t.goals).map((p,l)=>{const d=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:g,...v}=p;return{prioridad:l+1,completado:!1,usarColchon:!0,targetAmount:0,...v,cuentaIds:d}}),n.inflacion=dt(t.inflacion),n.tramosIRPFHistorico=dt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=dt(t.tramosGananciasCapitalHistorico),n.escenarios=dt(t.escenarios).map(({inversiones:p,...l})=>l),n}const _t=t=>Array.isArray(t)?t:[];let _e=0;function Dn(t){return _e+=1,`${t}_${_e.toString(36)}`}const Tn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),zn=t=>typeof t=="number"&&Number.isFinite(t);function jn(t,a){const e={...t};_e=0;const o=_t(t.transacciones),n=_t(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,p,l,d)=>{if(!Tn(p)||!zn(l))return;const g=`${u}|${p}`;i.has(g)||(i.add(g),s.push({_id:Dn("pc"),fecha:p,cuentaId:u,saldoCts:it(l),...typeof d=="string"&&d?{nota:d}:{}}))};for(const u of _t(t.accounts)){const p=typeof u._id=="string"?u._id:null;if(p)for(const l of _t(u.historicoSaldos))r(p,l.fecha,l.saldo,l.nota)}const c=_t(t.history);if(c.length>0){const u=_t(t.accounts),p=u.find(d=>d.esCuentaPrincipal)||u.find(d=>d.activo)||u[0],l=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const d of c){const g=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:l;r(g,d.fecha,d.saldo,d.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((u,p)=>String(u.fecha).localeCompare(String(p.fecha))),e}const Pe=t=>Array.isArray(t)?t:[],qn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Nn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Fe=0;function Rn(){return Fe+=1,`tx_hp_${Fe.toString(36)}`}function Ln(t,a){const e={...t};Fe=0;const o=[...Pe(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Pe(t.expenses).map(i=>{const r=Pe(i.historialPrecios),c=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",l=Array.isArray(i.tags)?i.tags.filter(v=>typeof v=="string"):[];if(c)for(const v of r){if(!v||!qn(v.fecha)||!Nn(v.cuantia))continue;const h=p==="ingreso"?it(v.cuantia):-it(v.cuantia),I=`${c}|${v.fecha}|${h}`;n.has(I)||(n.add(I),o.push({_id:Rn(),fecha:v.fecha,cuentaId:u,importeCts:h,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:l,estimacionId:c,tipo:p,origen:"importado",nota:typeof v.nota=="string"&&v.nota?v.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...g}=i;return g});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Ha=t=>Array.isArray(t)?t:[],yt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Pt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,On=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function kn(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=Ha(e.goals),n=Ha(e.accounts),s=n.map(l=>{const d=Pt(l.bloqueoMeses,0);return{_id:`veh_${yt(l._id,"x")}`,nombre:yt(l.nombre,"Cuenta"),rentabilidadRealAnual:Pt(l.interes,0)/100,liquidez:l.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Pt(l.impuestoRetirada,0)/100,topeAportacionAnual:l.modeloFondo==="pension"?it(1500):null,riesgo:l.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:yt(l._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Pt(l.interes,0)>0}}),i=new Map(n.map((l,d)=>[yt(l._id,""),s[d]._id])),r=((p=s[0])==null?void 0:p._id)??"",c=o.map((l,d)=>{const g=Array.isArray(l.cuentaIds)?l.cuentaIds.map(h=>yt(h,"")):[],v=On(l.targetDate);return{_id:yt(l._id,`obj_mig_${d}`),nombre:yt(l.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:it(Pt(l.targetAmount,0)),fechaLimite:v,prioridad:Pt(l.prioridad,d+1),modoAsignacion:v?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(g[0])??r,saldoActual:0,estado:l.completado===!0?"COMPLETADO":"PENDIENTE",notas:yt(l.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[u],e}function Bn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ra)||(e.personas=[La(),...o]),e}const Kt=t=>Array.isArray(t)?t:[];function ce(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function Hn(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function Gn(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Kt(e.loans).map(ce),e.expenses=Kt(e.expenses).map(ce),e.nominas=Kt(e.nominas).map(ce),e.accounts=Kt(e.accounts).map(ce),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Kt(e.planes).filter(Hn);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const Vn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Fn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:jn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Ln},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:kn},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:Bn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:Gn}],Un=["history"];function Ga(t,a,e){let o=t;const n=[];for(const s of[...Vn].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const $t="state_",le="state__schemaVersion",Ft="financeapp_",De="state__modificadoEn";function Va(t=localStorage,a=Ft){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==De&&t.setItem(e(De),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function Yn(t=localStorage,a=Ft){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith($t)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Wn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Kn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Jn(t,a){const e=Kn[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function Qn(t){return Y(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Xn({adapter:t,hoy:a=new Date}){const e=Y(a),o=Qn(a);let n=ka(e,o);const s=new Set;let i=[];const r=Wn();function c(M){for(const F of s)F(M)}function u(M){t.set(`${$t}${M}`,n[M])}function p(){const M={};for(const T of Object.keys(n)){const R=t.get(`${$t}${T}`);R!==null&&(M[T]=R)}for(const T of Un){const R=t.get(`${$t}${T}`);R!==null&&(M[T]=R)}const F=t.get(le),{state:D,applied:q}=Ga(M,F,{hoyISO:e,finISO:o});if(n=D,l(),q.length>0){for(const T of Object.keys(n))u(T);t.set(le,Yt)}return i=q,{applied:q}}function l(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Me(e)],u("accounts");return}const M=n.accounts.filter(F=>F.esCuentaPrincipal);if(M.length===0)n.accounts=n.accounts.map((F,D)=>D===0?{...F,esCuentaPrincipal:!0}:F),u("accounts");else if(M.length>1){let F=!1;n.accounts=n.accounts.map(D=>D.esCuentaPrincipal?F?{...D,esCuentaPrincipal:!1}:(F=!0,D):D),u("accounts")}}function d(M){return n[M]}function g(M,F){n[M]=F,u(M),c(M)}function v(M){g("config",{...n.config,...M})}function h(M){return s.add(M),()=>s.delete(M)}function I(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(M,F){const D=[...n[M]],q={...F,_id:I()};return D.push(q),g(M,D),q}function b(M,F,D){const q=n[M].map(T=>T._id===F?{...T,...D}:T);g(M,q)}function C(M,F){const D=n[M],q=D.findIndex(T=>T._id===F);q<0||(r.registrar({col:M,item:D[q],indice:q}),g(M,D.filter((T,R)=>R!==q)))}function S(){const M=r.tomar();if(!M)return null;const F=[...n[M.col]];return F.splice(Math.min(M.indice,F.length),0,M.item),g(M.col,F),M}function x(){return r.pendiente()}function $(){const M=n.accounts||[],F=M.find(D=>D.esCuentaPrincipal&&D.activo)||M.find(D=>D.activo);return F?F._id:"default"}function A(M){var F;return((F=n.accounts.find(D=>D._id===M))==null?void 0:F.nombre)??M}function _(){return Ut(n.tramosIRPFHistorico,n.config.tramos_irpf)}function w(){return Ut(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function y(){return structuredClone(n)}function E(M,F=null){const{state:D,applied:q}=Ga(M,F,{hoyISO:e,finISO:o});n=D,l();for(const T of Object.keys(n))u(T);t.set(le,Yt);for(const T of Object.keys(n))c(T);return{applied:q}}return{load:p,get:d,set:g,patchConfig:v,subscribe:h,addItem:f,updateItem:b,removeItem:C,deshacerBorrado:S,borradoPendiente:x,getPrincipalAccountId:$,accountName:A,resolverTramosIRPF:_,resolverTramosGanancias:w,snapshot:y,replaceAll:E,get schemaVersion(){return Yt},get migrationsApplied(){return[...i]},get today(){return e||K()}}}function Zn(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const Ct=Object.keys(ka("1970-01-01","1970-01-01"));function Ua(t){const a={};for(const e of Ct){const o=t.get(`${$t}${e}`);o!=null&&(a[e]=o)}return a}function ts(t,a){const e=[];for(const o of Ct){const n=a[o];n!=null&&(t(`${$t}${o}`,n),e.push(o))}return e}function es(t){return Ct.filter(a=>t[a]===void 0||t[a]===null)}function as(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!Ct.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Ya=`${Ft}meta_proyectos`,Wa=`${Ft}meta_proyectoActivo`,St="default",os="Mis finanzas";function Te(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Jt(t){return t===St?Ft:`${Ft}p_${t}_`}function Ka(){return[...Ct.map(t=>`${$t}${t}`),le,De]}function ns(t=localStorage){function a(){try{const l=t.getItem(Ya);if(!l)return[];const d=JSON.parse(l);return Array.isArray(d)?d:[]}catch{return[]}}function e(l){t.setItem(Ya,JSON.stringify(l))}function o(){const l=a();if(l.some(v=>v._id===St))return l;const d=Date.now(),g=[{_id:St,nombre:os,creadoEn:d,actualizadoEn:d},...l];return e(g),g}function n(){try{const l=t.getItem(Wa);if(!l)return St;const d=JSON.parse(l);return typeof d=="string"&&d?d:St}catch{return St}}function s(l){t.setItem(Wa,JSON.stringify(l))}function i(l){const d=l.trim()||"Proyecto sin nombre",g=Date.now(),v={_id:Te(),nombre:d,creadoEn:g,actualizadoEn:g};return e([...o(),v]),v}function r(l,d){const g=d.trim();g&&e(o().map(v=>v._id===l?{...v,nombre:g,actualizadoEn:Date.now()}:v))}function c(l,d){const g=o().find(f=>f._id===l);if(!g)throw new Error("Proyecto no encontrado.");const v=Jt(l),h={_id:Te(),nombre:(d==null?void 0:d.trim())||`${g.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},I=Jt(h._id);for(const f of Ka()){const b=t.getItem(`${v}${f}`);b!==null&&t.setItem(`${I}${f}`,b)}return e([...o(),h]),h}function u(l){if(l===St)throw new Error("No se puede eliminar el proyecto original.");if(l===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const d=o();if(!d.some(v=>v._id===l))return;const g=Jt(l);for(const v of Ka())t.removeItem(`${g}${v}`);e(d.filter(v=>v._id!==l))}function p(l){const d=new Map(o().map(v=>[v._id,v]));for(const v of l){if(!v||typeof v._id!="string")continue;const h=d.get(v._id);(!h||(v.actualizadoEn??0)>h.actualizadoEn)&&d.set(v._id,v)}const g=[...d.values()];return e(g),g}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:u,fusionarRemotos:p}}function ss(t,a,e){const o=Va(t,Jt(a)),n={};for(const s of e){const i=o.get(`${$t}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function is(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Te())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const at={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},xt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:at.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:at.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:at.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:at.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:at.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:at.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:at.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:at.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:at.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:at.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:at.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:at.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:at.datos,porDefecto:!1,dependencias:["sync-nube"]}],rs=new Map(xt.map(t=>[t.id,t]));function Qt(t){return rs.get(t)}function Ja(t){return xt.filter(a=>(a.dependencias||[]).includes(t))}function ze(){const t={};for(const a of xt)t[a.id]=a.porDefecto;return t}function Qa(){const t=[],a=new Map;for(const e of xt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function cs(t){function a(){return{...ze(),...t.get("config").features||{}}}function e(l){t.patchConfig({features:l})}function o(l,d=a(),g=new Set){const v=Qt(l);if(!v)return!1;if(v.nucleo)return!0;if(d[l]===!1)return!1;if(g.has(l))return!0;g.add(l);for(const h of v.dependencias||[])if(!o(h,d,g))return!1;return!0}function n(l,d=a()){const g=Qt(l);return g?(g.dependencias||[]).filter(v=>!o(v,d)):[]}function s(l,d){var C;const g=Qt(l);if(!g)return{cambiadas:[]};if(g.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const v=a(),h=new Map(xt.map(S=>[S.id,o(S.id,v)])),I={...v,[l]:d};let f;if(d){const S=[...g.dependencias||[]];for(;S.length;){const x=S.pop();I[x]===!1&&(I[x]=!0,f="dependencias-activadas"),S.push(...((C=Qt(x))==null?void 0:C.dependencias)||[])}}else{const S=Ja(l).map(x=>x.id);for(;S.length;){const x=S.pop();I[x]!==!1&&(I[x]=!1,f="cascada-apagado"),S.push(...Ja(x).map($=>$.id))}}return e(I),{cambiadas:xt.filter(S=>o(S.id,I)!==h.get(S.id)).map(S=>S.id),motivo:f}}function i(){const l=a();return xt.map(d=>{const g=n(d.id,l);return{...d,activa:o(d.id,l),...g.length>0&&l[d.id]!==!1?{bloqueadaPor:g}:{}}})}function r(){const l=a();return Qa().map(({grupo:d,features:g})=>({grupo:d,features:g.map(v=>{const h=n(v.id,l);return{...v,activa:o(v.id,l),...h.length>0&&l[v.id]!==!1?{bloqueadaPor:h}:{}}})}))}function c(){e(ze())}function u(l){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...l?{nombre:l}:{},features:a()}}function p(l){const d=l,g=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!g)throw new Error('El perfil no tiene una sección "features" válida');const v=ze(),h=[],I=[];for(const[f,b]of Object.entries(g)){if(!Qt(f)){I.push(f);continue}if(typeof b!="boolean"){I.push(f);continue}v[f]=b,h.push(f)}return e(v),{aplicadas:h,ignoradas:I}}return{isEnabled:l=>o(l),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:u,importProfile:p,bloqueadaPor:l=>n(l)}}const Xt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Dt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function ls(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Xt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    </div>`}function ds(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Xt(o)}</div>
        ${n.map(ls).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function us(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function ps(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${ds(e)}`,n(i)}function n(i){var c,u,p;i.querySelectorAll("[data-feature-toggle]").forEach(l=>{l.addEventListener("change",()=>{var v;const d=l.dataset.featureToggle,g=e.setEnabled(d,l.checked);g.motivo==="dependencias-activadas"&&Dt(t,"Se han activado también las funcionalidades necesarias"),g.motivo==="cascada-apagado"&&Dt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(v=t.onChange)==null||v.call(t,g.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const l=e.exportProfile(),d=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),g=URL.createObjectURL(d),v=a.createElement("a");v.href=g,v.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(g),Dt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,g;const l=(d=r.files)==null?void 0:d[0];if(l)try{const{aplicadas:v,ignoradas:h}=e.importProfile(JSON.parse(await l.text()));Dt(t,h.length>0?`Perfil cargado (${v.length} aplicadas, ${h.length} ignoradas por ser de otra versión)`:`Perfil cargado (${v.length} funcionalidades)`),(g=t.onChange)==null||g.call(t,v),o(i)}catch(v){Dt(t,"No se pudo cargar el perfil: "+v.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var l;e.reset(),Dt(t,"Funcionalidades restablecidas"),(l=t.onChange)==null||l.call(t,[]),o(i)})}function s(){const i=us(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ms={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Xa(t){return ms[t]??t}function mt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Za(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function fs(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function gs(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function vs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function bs(t,a){const e=t._id===a,o=t._id==="default";return`
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
    </div>`}function hs(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${ut(i._id)}">${ut(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${ut(i)}"/> ${ut(Xa(i))}
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
    </div>`}function ys(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function $s(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>bs(u,c)).join("")}
      </div>
      ${ys()}
      ${hs(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,u;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const l=p.dataset.proyectoId,d=p.dataset.proyectoAccion,g=e.listar().find(v=>v._id===l);if(g){if(d==="cambiar"){if(!Za(t,`¿Cambiar a "${g.nombre}"? Se recargará la página.`))return;e.cambiarA(l),fs(t);return}if(d==="renombrar"){const v=typeof prompt=="function"?prompt("Nuevo nombre",g.nombre):null;if(!v||!v.trim())return;e.renombrar(l,v.trim()),mt(t,"Proyecto renombrado"),n(r);return}if(d==="duplicar"){const v=`${g.nombre} (copia)`,h=typeof prompt=="function"?prompt("Nombre de la copia",v):v;if(h===null)return;const I=e.duplicar(l,h.trim()||v);mt(t,`"${I.nombre}" creado como copia de "${g.nombre}" ✓`),n(r);return}if(d==="eliminar"){if(!Za(t,`¿Eliminar "${g.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(l),mt(t,`"${g.nombre}" eliminado`),n(r)}catch(v){mt(t,v.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),l=p==null?void 0:p.value.trim();if(!l){mt(t,"Ponle un nombre al proyecto","warn");return}const d=e.crear(l);mt(t,`"${d.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var g;const p=(g=r.querySelector("#proyecto-import-origen"))==null?void 0:g.value;if(!p)return;const l=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(v=>v.dataset.proyectoImportCol);if(l.length===0){mt(t,"Elige al menos una colección para importar","warn");return}const{importadas:d}=e.importarDesde(p,l);if(d.length===0){mt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}mt(t,`Importado: ${d.map(Xa).join(", ")} ✓`),gs(),n(r)})}function i(){const r=vs(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const de=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],At=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Tt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function xs(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function ws(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Is(t){const a=t.color||de[0];return`
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
    </div>`}function Cs(){return`
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
    </div>`}function Ss(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Is).join("")}
      </div>
      ${Cs()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.personaId,g=l.dataset.personaAccion,v=e.get("personas"),h=v.find(I=>I._id===d);if(h){if(g==="renombrar"){const I=typeof prompt=="function"?prompt("Nuevo nombre",h.nombre):null;if(!I||!I.trim())return;e.updateItem("personas",d,{nombre:I.trim()}),Tt(t,"Persona renombrada"),s(),n(c);return}if(g==="defecto"){e.set("personas",v.map(I=>({...I,esPorDefecto:I._id===d}))),Tt(t,`"${h.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(g==="activo"){e.updateItem("personas",d,{activo:!h.activo}),s(),n(c);return}if(g==="eliminar"){if(v.length<=1){Tt(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!xs(t,`¿Eliminar "${h.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",d),Tt(t,`"${h.nombre}" eliminada`),s(),n(c)}}})});const u=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(l=>{l.addEventListener("click",()=>{const d=l.getAttribute("data-persona-color");u&&(u.value=d),c.querySelectorAll("[data-persona-color]").forEach(g=>{g.style.border=g.getAttribute("data-persona-color")===d?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const l=c.querySelector("#persona-nuevo-nombre"),d=l==null?void 0:l.value.trim();if(!d){Tt(t,"Ponle un nombre a la persona","warn");return}const g=(u==null?void 0:u.value)||de[0],v=e.addItem("personas",{nombre:d,color:g,esPorDefecto:!1,activo:!0});Tt(t,`"${v.nombre}" creada ✓`),s(),n(c)})}function r(){const c=ws(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const to={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function eo(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function As({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([u,p])=>[p,u]);for(const[u,p]of[...Object.entries(to),...c]){const l=t.isEnabled(u),d=a.querySelector(`.nav-btn[data-view="${p}"]`);d&&(d.style.display=l?"":"none"),!l&&n()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(u=>{const p=[...u.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const l=p.some(d=>d.style.display!=="none");u.style.display=l?"":"none"}),eo(a,u=>t.isEnabled(u)),r){const u=e??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const u=new MutationObserver(()=>{if(!c){c=!0;try{eo(a,p=>t.isEnabled(p))}finally{c=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>to[r]}}const Ms="toast toast-deshacer";function Es(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(l){const d=n();if(!d)return;c();const g=document.createElement("div");g.className=Ms,g.style.display="flex",g.style.alignItems="center",g.style.gap="12px";const v=document.createElement("span");v.textContent=`${Jn(l.col,l.item)} se ha eliminado.`,v.style.flex="1";const h=document.createElement("button");h.type="button",h.className="btn-secondary btn-sm",h.textContent="Deshacer",h.style.flexShrink="0",h.addEventListener("click",()=>{const I=a.deshacerBorrado();if(c(),!I)return;const f=n();if(f){const b=document.createElement("div");b.className="toast toast-ok",b.textContent="Deshecho.",f.appendChild(b),setTimeout(()=>b.remove(),2500)}e==null||e()}),g.appendChild(v),g.appendChild(h),d.appendChild(g),s=g,i=setTimeout(c,o)}const p=a.subscribe(()=>{const l=a.borradoPendiente();if(!l){r=null,c();return}l!==r&&(r=l,u(l))});return()=>{p(),c()}}function ue(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function ao(t,a){const e=ue(t),o=ue(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Zt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function _s(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Zt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Zt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Zt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Zt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Zt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Ps(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=ue(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of _s(t)){if(!i(c.ruta))continue;const u=ao(c.titulo,s),p=u>=0?-1:Math.min(ao(c.extra??"",s),2);if(u<0&&p<0)continue;const l=u>=0?u:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:l*1e3+Math.min(999,ue(c.titulo).length)})}return r.sort((c,u)=>c.peso-u.peso||c.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Fs="buscador-overlay",oo="btn-buscador";function Ds(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const S=a.createElement("div");S.id=Fs,S.className="modal-overlay",S.style.alignItems="flex-start",S.style.paddingTop="10vh";const x=a.createElement("div");x.className="modal-box",x.style.maxWidth="560px",x.style.padding="14px";const $=a.createElement("input");$.type="search",$.className="form-input",$.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",$.setAttribute("aria-label","Buscar en toda la aplicación"),$.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",x.appendChild($),x.appendChild(A),S.appendChild(x),a.body.appendChild(S),S.addEventListener("click",_=>{_.target===S&&h()}),$.addEventListener("input",()=>{r=0,p()}),$.addEventListener("keydown",g),o=S,n=$,s=A,S}function u(){if(s){if(s.textContent="",i.length===0){const S=a.createElement("div");S.style.padding="14px 4px",S.style.fontSize="13px",S.style.color="var(--text3)";const x=(n==null?void 0:n.value.trim())??"";S.textContent=x.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(S);return}i.forEach((S,x)=>{const $=a.createElement("button");$.type="button",$.className="buscador-fila",$.dataset.indice=String(x),x===r&&$.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const _=a.createElement("div");_.textContent=S.titulo,_.style.fontSize="13px",_.style.overflow="hidden",_.style.textOverflow="ellipsis",_.style.whiteSpace="nowrap";const w=a.createElement("div");w.textContent=S.detalle,w.style.fontSize="11px",w.style.color="var(--text3)",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap",A.appendChild(_),S.detalle&&A.appendChild(w);const y=a.createElement("span");y.className="tag",y.textContent=S.etiqueta,y.style.flexShrink="0",$.appendChild(A),$.appendChild(y),$.addEventListener("click",()=>d(x)),s.appendChild($)})}}function p(){const S=(n==null?void 0:n.value)??"";i=Ps(t.estado(),S,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function l(S){var x,$;i.length!==0&&(r=(r+S+i.length)%i.length,u(),($=(x=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:x.scrollIntoView)==null||$.call(x,{block:"nearest"}))}function d(S){const x=i[S];x&&(h(),t.navegar(x.ruta))}function g(S){S.key==="Escape"?(S.preventDefault(),h()):S.key==="ArrowDown"?(S.preventDefault(),l(1)):S.key==="ArrowUp"?(S.preventDefault(),l(-1)):S.key==="Enter"&&(S.preventDefault(),d(r))}function v(){const S=o??c();S.classList.remove("hidden"),S.style.display="",r=0,n&&(n.value="",n.focus()),p()}function h(){o&&(o.style.display="none",i=[])}function I(){return!!o&&o.style.display!=="none"}function f(S){(S.ctrlKey||S.metaKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),I()?h():v())}a.addEventListener("keydown",f);let b=null;function C(){const S=a.getElementById("period-bar");if(!S||a.getElementById(oo))return;const x=a.createElement("button");x.id=oo,x.type="button",x.className="btn-secondary",x.title="Buscar en toda la aplicación (Ctrl+K)",x.setAttribute("aria-label","Buscar"),x.textContent="🔍 Buscar",x.style.marginLeft="auto",x.addEventListener("click",v),S.appendChild(x),b=x}return C(),()=>{a.removeEventListener("keydown",f),b==null||b.remove(),o==null||o.remove(),o=null,n=null,s=null}}const je="aviso-guardado";function Ts(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function u(){var v;r&&clearTimeout(r),r=null,(v=a.getElementById(je))==null||v.remove()}function p(){if(s==="oculto")return u();const v=e();if(!v)return;let h=a.getElementById(je);h||(h=a.createElement("div"),h.id=je,v.appendChild(h)),h.className=`toast toast-guardado toast-guardado--${s}`,h.style.display="flex",h.style.alignItems="center",h.style.gap="12px",h.textContent="";const I=a.createElement("span");if(I.style.flex="1",h.appendChild(I),s==="pendiente")I.textContent="Tienes cambios sin guardar.",h.appendChild(l("Guardar ahora","btn-primary btn-sm",()=>void d())),h.appendChild(l("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",p()}));else if(s==="subiendo"){I.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),h.appendChild(f)}else s==="guardado"?I.textContent="¡Guardado!":s==="error"&&(I.textContent="No se ha podido guardar.",h.appendChild(l("Reintentar","btn-primary btn-sm",()=>void d())))}function l(v,h,I){const f=a.createElement("button");return f.type="button",f.className=h,f.textContent=v,f.style.flexShrink="0",f.addEventListener("click",I),f}async function d(){if(c)return c;r&&clearTimeout(r);const v=t.cambios.revision();return s="subiendo",p(),c=(async()=>{try{await t.guardar(),n.alDia(v),s="guardado",p(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),p()},o)}catch(h){console.error("[guardado] no se ha podido subir la copia:",h),s=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const g=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",p()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:d,detener(){g(),u()}}}function zs({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(v){return`view-${v}`}function s(v){const h=t.getElementById(n(v.route));if(h)return h;const I=t.querySelector(".view-container");if(!I)return null;const f=t.createElement("div");return f.id=n(v.route),f.className="view hidden",I.appendChild(f),f}function i(v){if(t.querySelector(`.nav-btn[data-view="${v.route}"]`))return;const h=t.querySelectorAll(".nav-section"),I=h[v.seccion??Math.max(0,h.length-1)];if(!I)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=v.route,f.innerHTML=`${v.iconoPath?`<svg viewBox="0 0 24 24"><path d="${v.iconoPath}"/></svg>`:""}<span>${v.nombre}</span>`,I.appendChild(f),f.addEventListener("click",()=>{const b=globalThis.Router;b==null||b.navigate(v.route)})}function r(v){e.set(v.route,v),s(v),i(v)}function c(){return[...e.keys()].filter(v=>{const h=e.get(v);return!a||a(h.flagId??h.id)})}function u(v){return c().includes(v)}function p(v){const h=e.get(v);if(!h||a&&!a(h.flagId??h.id))return!1;const I=s(h);if(!I)return!1;if(o&&o!==v){const f=e.get(o),b=t.getElementById(n(o));f!=null&&f.unmount&&b&&f.unmount(b)}return h.mount(I),o=v,!0}function l(){o&&p(o)}function d(){const v={};for(const[h,I]of e)v[h]=I.flagId??I.id;return v}function g(){for(const v of e.values())s(v),i(v)}return{register:r,routes:c,has:u,mount:p,rerender:l,flagPorRuta:d,attachToShell:g,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ft(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(P(t))}</span>`}function no(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function qe(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const js=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function te(t){const[a,e]=t.split("-").map(Number);return`${js[e-1]} ${a}`}function j(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function ot(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function z(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function V(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function ct(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function so(t,a){const e=parseFloat(ct(t,a));return Number.isFinite(e)?e:0}const qs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ne(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Ns(t){const{store:a}=t,e=t.hoy??K,o=()=>k(e()),n=()=>a.get("config").margenesSeguridad??[];function s(g){var v;a.patchConfig({margenesSeguridad:g}),(v=t.onDatosCambiados)==null||v.call(t)}function i(g,v){const h=n().map(f=>({...f,puntos:(f.puntos??[]).map(b=>({...b}))})),I=h.find(f=>f._id===g);I&&(v(I),s(h))}function r(g){const v=a.get("config"),h=Ae(g,a.get("expenses"),v,a.get("loans"),e(),!1,o());return P(h)}function c(g,v,h){const I=v.tipo==="fijo",f=I?"":`<span class="text-sm" style="color:var(--text3)">${m(P((v.meses??0)*h))}</span>`;return`
      <tr data-punto="${m(v._id)}" data-margen="${m(g._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(v.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${I?" selected":""}>Fijo €</option>
            <option value="meses"${I?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${I?`<input type="number" class="form-input" style="width:90px" value="${v.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${I?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${v.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(g,v,h){const I=g.cuentas&&g.cuentas.length>0?g.cuentas.map(S=>{var x;return((x=v.find($=>$._id===S))==null?void 0:x.nombre)??S}).join(", "):"Todas las cuentas activas",b=[...g.puntos??[]].sort((S,x)=>S.fecha.localeCompare(x.fecha)).map(S=>c(g,S,h)).join(""),C=g.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(I)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${m(r(g))}</strong>
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
            ${b||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${m(g._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${m(g.nombre)}</span>
            <span class="badge ${g.activo?"badge-active":"badge-inactive"}">${g.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${g.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${g.activo?"checked":""} data-toggle-margen="${m(g._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${m(g._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${m(g._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${C}
      </div>`}function p(g,v){const h=v?n().find(C=>C._id===v):null,I=a.get("accounts").filter(C=>C.activo),f=new Set((h==null?void 0:h.cuentas)??[]),b=I.map(C=>`
        <label class="tag" data-chip="${m(C._id)}" style="cursor:pointer;${f.has(C._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(C._id)}" ${f.has(C._id)?"checked":""} style="display:none"/>
          ${m(C.nombre)}
        </label>`).join(" ");g.innerHTML=`
      <div class="modal-title">${v?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m((h==null?void 0:h.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${b||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${h?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
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
        <button class="btn-primary" data-guardar-margen="${m(v??"")}">Guardar</button>
      </div>`}function l(g,v){const h=document.getElementById("modal-overlay"),I=document.getElementById("modal-content");!h||!I||(p(I,g),h.classList.remove("hidden"),V(I,".mg-acc-chip",f=>{const b=f,C=I.querySelector(`[data-chip="${b.value}"]`);C&&(C.style.cssText=`cursor:pointer;${b.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),V(I,"#mg-p-tipo",f=>{const b=f.value==="fijo",C=I.querySelector("#mg-p-importe-wrap"),S=I.querySelector("#mg-p-meses-wrap");C&&(C.style.display=b?"":"none"),S&&(S.style.display=b?"none":"")}),z(I,"[data-cerrar-form]",()=>h.classList.add("hidden")),z(I,"[data-guardar-margen]",f=>{var $,A,_,w,y;const b=f.getAttribute("data-guardar-margen")||"",C=(($=I.querySelector("#mg-nombre"))==null?void 0:$.value.trim())??"";if(!C)return j("El nombre es obligatorio","err");const S=[...I.querySelectorAll(".mg-acc-chip:checked")].map(E=>E.value),x=n().map(E=>({...E}));if(b){const E=x.findIndex(M=>M._id===b);if(E===-1)return j("Margen no encontrado","err");x[E]={...x[E],nombre:C,cuentas:S}}else{const E=((A=I.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",M={_id:Ne(),fecha:((_=I.querySelector("#mg-p-fecha"))==null?void 0:_.value)||K(),tipo:E,importe:parseFloat(((w=I.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((y=I.querySelector("#mg-p-meses"))==null?void 0:y.value)??"1")||1};x.push({_id:Ne(),nombre:C,activo:!0,cuentas:S,puntos:[M]})}s(x),j(b?"Margen actualizado":"Margen creado"),h.classList.add("hidden"),v()}))}function d(g){const v=n(),h=a.get("accounts"),I=Vt(a.get("expenses"),o());g.innerHTML=`
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
             </div>`:v.map(b=>u(b,h,I)).join("")}`;const f=()=>d(g);z(g,"[data-nuevo-margen]",()=>l(null,f)),z(g,"[data-editar-margen]",b=>l(b.getAttribute("data-editar-margen"),f)),z(g,"[data-borrar-margen]",b=>{ot("¿Eliminar este margen de seguridad?")&&(s(n().filter(C=>C._id!==b.getAttribute("data-borrar-margen"))),j("Margen eliminado"),f())}),V(g,"[data-toggle-margen]",b=>{const C=b.getAttribute("data-toggle-margen");i(C,S=>{S.activo=b.checked}),f()}),z(g,"[data-add-punto]",b=>{const C=b.getAttribute("data-add-punto");i(C,S=>{S.puntos=[...S.puntos??[],{_id:Ne(),fecha:K(),tipo:"fijo",importe:0,meses:1}]}),f()}),z(g,"[data-borrar-punto]",b=>{const C=b.closest("[data-punto]");if(!C)return;const S=C.dataset.margen,x=C.dataset.punto;i(S,$=>{$.puntos=($.puntos??[]).filter(A=>A._id!==x)}),f()}),V(g,"[data-campo]",b=>{const C=b.closest("[data-punto]");if(!C)return;const S=b.getAttribute("data-campo"),x=b.value;i(C.dataset.margen,$=>{const A=($.puntos??[]).find(_=>_._id===C.dataset.punto);A&&(S==="fecha"?A.fecha=x:S==="tipo"?A.tipo=x:S==="importe"?A.importe=parseFloat(x)||0:A.meses=parseFloat(x)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:qs,mount:d}}const Rs=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],Ls=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Os=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function ks(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Re=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function io(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=ks(t),i=Re(Rs.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Re(Ls,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Re(Os,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function ro(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function co(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const Bs={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Hs(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function zt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const u=s.has(c._id),p=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
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
      ${Hs(e,a).map(r).join("")}
    </div>
  </div>`}function jt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function qt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,u=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=u?parseFloat(u.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:s}}function lo(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Bs[t.modo]})`}function Le(t,a,e){const o=lo(t,e),n=lo(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Gs="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Vs=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Us(t){const a=t.hoy??K,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var b;return((b=n().find(C=>C._id===(f||"default")))==null?void 0:b.nombre)??(f||"default")};function i(){const f=a();let b=[...t.store.get("expenses")];if(e.mostrarExpirados||(b=b.filter(C=>!C.fechaFin||C.fechaFin>=f)),e.tipo&&(b=b.filter(C=>C.tipo===e.tipo)),e.cuenta&&(b=b.filter(C=>(C.cuenta||"default")===e.cuenta)),e.desde&&(b=b.filter(C=>(C.fechaInicio??"")>=e.desde)),e.hasta&&(b=b.filter(C=>(C.fechaInicio??"")<=e.hasta)),e.busqueda){const C=e.busqueda.toLowerCase();b=b.filter(S=>S.concepto.toLowerCase().includes(C))}return e.tags.size>0&&(b=b.filter(C=>(C.tags||[]).some(S=>e.tags.has(S)))),b.sort((C,S)=>{const x=C[e.orden]??"",$=S[e.orden]??"";return typeof x=="number"&&typeof $=="number"?(x-$)*e.sentido:String(x).localeCompare(String($))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,b){const C=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(b)} <span class="sort-arrow">${C}</span></span>`}function u(f,b=!1){return(b?'<option value="">Todas las cuentas</option>':"")+n().filter(S=>S.activo!==!1).map(S=>`<option value="${m(S._id)}"${S._id===f?" selected":""}>${m(S.nombre)}</option>`).join("")}function p(f){const b=f.tipo==="transferencia",C=Le(f.repartoConsumo,f.repartoPago,t.store.get("personas")),S=$e(f.diaPago??""),x=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${S?` · ${S}`:""}`,$=!!f.fechaFin&&f.fechaFin<a(),A=b?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',_=b?`${m(s(f.cuenta))} → ${m(s(f.cuentaDestino))}`:m(s(f.cuenta)),w=(f.tags||[]).map(y=>`<span class="tag${e.tags.has(y)?" active":""}" data-tag="${m(y)}" title="Filtrar por ${m(y)}">${m(y)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${A}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":b?"":"neg"}">${b?"⇄ ":""}${m(P(f.cuantia))}</div>
      <div class="text-sm">${m(x)}</div>
      <div class="text-sm exp-col-hide">${_}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${C?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(C)}">👥 reparto</span>`:""}
        ${$?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function l(f){const b=i(),C=r();f.innerHTML=`
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
      ${C.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${C.map(S=>`<span class="tag${e.tags.has(S)?" active":""}" data-tag="${m(S)}">${m(S)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':b.map(p).join("")}
      </div>`}function d(f){const b=(f==null?void 0:f.tipo)==="transferencia",C=t.store.get("personas"),S=(x,$,A,_,w="")=>`<div class="form-group"><label class="form-label">${m($)}</label>
       <input class="form-input" type="${A}" id="${x}" value="${m(_)}" placeholder="${m(w)}"/></div>`;return`
      <div class="grid-2">
        ${S("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${b?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${S("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${S("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Vs.map(([x,$])=>`<option value="${x}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===x?" selected":""}>${m($)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${S("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${b?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${S("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${io(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${b?' style="display:none"':""}>
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
          ${b?"":`${zt("Reparto de consumo",f==null?void 0:f.repartoConsumo,C,"consumo")}
                 ${zt("Reparto de pago",f==null?void 0:f.repartoPago,C,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function g(f){var S;const b=((S=f.querySelector("#ef-tipo"))==null?void 0:S.value)??"gasto",C=(x,$)=>{const A=f.querySelector(x);A&&(A.style.display=$?"":"none")};C("#ef-destino-wrap",b==="transferencia"),C("#ef-basico-wrap",b!=="transferencia"),C("#ef-irpf-wrap",b==="ingreso"),C("#ef-clasificacion-wrap",b==="gasto")}function v(f,b,C){const S=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");!S||!x||(x.innerHTML=`<div class="modal-title">${m(b)}</div>${d(f)}`,S.classList.remove("hidden"),V(x,"#ef-tipo",()=>g(x)),V(x,"[data-dp-modo]",()=>ro(x)),V(x,'[data-reparto-modo="consumo"]',()=>jt(x,"consumo")),V(x,'[data-reparto-modo="pago"]',()=>jt(x,"pago")),z(x,"[data-cancelar]",()=>S.classList.add("hidden")),z(x,"[data-guardar]",$=>{h(x,$.getAttribute("data-guardar")||"")&&(S.classList.add("hidden"),C())}))}function h(f,b){const C=E=>{var M;return((M=f.querySelector(E))==null?void 0:M.value)??""},S=E=>{var M;return!!((M=f.querySelector(E))!=null&&M.checked)},x=C("#ef-tipo")||"gasto",$=x==="transferencia",A=C("#ef-concepto").trim(),_=parseFloat(C("#ef-cuantia"));if(!A||!Number.isFinite(_))return j("Concepto y cuantía obligatorios","err"),!1;const w=C("#ef-clasificacion"),y={concepto:A,tipo:x,cuantia:_,frecuencia:parseInt(C("#ef-frecuencia"),10)||1,tipoFrecuencia:C("#ef-tipo-frec")||"mensual",fechaInicio:C("#ef-fecha-ini"),fechaFin:C("#ef-fecha-fin")||null,diaPago:co(f),cuenta:C("#ef-cuenta"),cuentaDestino:$?C("#ef-cuenta-dest")||"default":void 0,activo:S("#ef-activo"),basico:!$&&S("#ef-basico"),sujetoIRPF:!$&&S("#ef-sujetoIRPF"),clasificacion:x==="gasto"?w||null:void 0,tags:$?["transferencia"]:C("#ef-tags").split(",").map(E=>E.trim()).filter(Boolean),repartoConsumo:$?void 0:qt(f,"consumo"),repartoPago:$?void 0:qt(f,"pago")};return b?(t.store.updateItem("expenses",b,y),j("Actualizado")):(t.store.addItem("expenses",y),j("Creado")),o(),!0}function I(f,b){const C=f.querySelector("[data-busqueda]");let S;C==null||C.addEventListener("input",()=>{clearTimeout(S),S=setTimeout(()=>{e.busqueda=C.value,b();const x=f.querySelector("[data-busqueda]");x==null||x.focus(),x==null||x.setSelectionRange(x.value.length,x.value.length)},250)}),V(f,"[data-expirados]",x=>{e.mostrarExpirados=x.checked,b()}),V(f,"[data-f-tipo]",x=>{e.tipo=x.value,b()}),V(f,"[data-f-cuenta]",x=>{e.cuenta=x.value,b()}),V(f,"[data-f-desde]",x=>{e.desde=x.value,b()}),V(f,"[data-f-hasta]",x=>{e.hasta=x.value,b()}),z(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,b()}),z(f,"[data-limpiar-tags]",()=>{e.tags=new Set,b()}),z(f,"[data-tag]",x=>{const $=x.getAttribute("data-tag");e.tags.has($)?e.tags.delete($):e.tags.add($),b()}),z(f,"[data-orden]",x=>{const $=x.getAttribute("data-orden");e.orden===$?e.sentido=e.sentido===1?-1:1:(e.orden=$,e.sentido=1),b()}),z(f,"[data-nuevo]",()=>v(null,"Nuevo gasto/ingreso",b)),z(f,"[data-editar]",x=>{const $=t.store.get("expenses").find(A=>A._id===x.getAttribute("data-editar"));$&&v($,"Editar",b)}),z(f,"[data-duplicar]",x=>{const $=t.store.get("expenses").find(w=>w._id===x.getAttribute("data-duplicar"));if(!$)return;const{_id:A,..._}=$;v({..._,concepto:`${$.concepto} (copia)`},"Duplicar movimiento",b)}),z(f,"[data-borrar]",x=>{ot("¿Eliminar?")&&(t.store.removeItem("expenses",x.getAttribute("data-borrar")),j("Eliminado"),o(),b())}),V(f,"[data-activo]",x=>{const $=x;t.store.updateItem("expenses",$.getAttribute("data-activo"),{activo:$.checked}),o(),b()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Gs,mount(f){const b=()=>l(f);l(f),f.dataset.wired!=="1"&&(I(f,b),f.dataset.wired="1")}}}function pe(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=gt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function uo(t,a,e,o){return t.reduce((n,s)=>{const i=gt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Ys(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=Q({...t,amortizaciones:o.slice(0,s)}),r=Q({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:pe(i.tabla,a,e)-pe(r.tabla,a,e)}})}const Oe=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Ws(t,a){const e=da(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?ua(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?pa(t.tin||0,i):null,c=o&&n?Ys(t,a.periodos,a.hoy):[],u=c.length?pe(e.sinAmort.tabla,a.periodos,a.hoy)-pe(e.tabla,a.periodos,a.hoy):null,p=u===null?null:u-e.costeTotalAmort,l=s?uo(e.tabla,a.periodos,a.hoy,e.comAp):null,d=s&&o?uo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const g=Le(t.repartoConsumo,t.repartoPago,a.personas);return g?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(g)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(g=>`<span class="tag">${m(g)}</span>`).join("")}
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
        ${Oe("Cuota mensual",m(P(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(P(a.cuotaMes))}</div>`:"")}
        ${Oe("Total intereses",m(P(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(P(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Oe("Total pagado",m(P(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(P(t.capital))}</div>`:"","neg")}
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m($e(t.diaPago))}</div></div>`:""}
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

      ${l!==null?Ks(t,e.totalPagado,l,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(g=>Js(g,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((g,v)=>Qs(t._id,g,c[v]??null)).join("")}`:""}
    </div>
  </div>`}function Ks(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
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
  </div>`}function Js(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=gt(e.periodos,e.hoy,t.fecha);o=m(P(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(P(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(P(t.interes))}</td>
    <td class="num">${m(P(t.amortizacion))}</td>
    <td class="num">${m(P(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Qs(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
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
  </div>`}const tt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ee=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,ae=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,Xs=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Zs(t,a,e,o=K()){return`
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
            <select class="form-select" id="f-cuenta">${Xs(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${io(t==null?void 0:t.diaPago,"loan")}
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
    </div>`}function ti(t,a,e=K()){return`
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
    </div>`}const ei="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ai(t){const a=t.hoy??K;let e=!1;const o=new Set;let n=null;const s=()=>{var $;return($=t.onDatosCambiados)==null?void 0:$.call(t)};function i($){const A=$.filter(w=>w.activo);if(A.length<2)return"";const _=(w,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${w===null?"":m(w)}"
               style="${n===w?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(y)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${_(null,"Todas")}
      ${A.map(w=>_(w._id,w.nombre)).join("")}
    </div>`}function r($){if(!$.activo||$.simulacion)return!1;const A=Q($).tabla.filter(_=>!_.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c($,A){const _=a(),w=_.slice(0,7),y=new Map;let E=0;for(const M of $){if(!M.activo||M.simulacion||A.has(M._id)||(M.fechaInicio||"")>_)continue;const F=Q(M).tabla.filter(q=>!q.esAmortizacion&&q.fecha.startsWith(w)),D=F.length>0?F[0].cuota:0;y.set(M._id,D),E+=D}return{porLoan:y,total:E,activos:[...y.values()].filter(M=>M>0).length}}function u($){const A=a().slice(0,7),_=[];for(const w of $){if(!w.activo||w.simulacion)continue;const y=Q(w).tabla.filter(M=>!M.esAmortizacion),E=y[y.length-1];E&&E.fecha.slice(0,7)===A&&_.push({loan:w,cuota:E.cuota})}return _}function p($){return $.length<=1?$[0]??"":`${$.slice(0,-1).join(", ")} y ${$[$.length-1]}`}function l($){const A=t.store.get("config"),_=A.dashboardStart,w=A.dashboardEnd,y=Math.max(1,(k(w).getTime()-k(_).getTime())/(30.44*864e5));let E=0;for(const M of $)!M.activo||M.simulacion||(E+=Q(M).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=_&&F.fecha<=w).reduce((F,D)=>F+D.cuota,0));return{media:E/y,desde:_,hasta:w}}function d($){const A=t.store.get("personas"),_=ie(A),w=[...t.store.get("loans")].sort((N,B)=>B.tin-N.tin),y=n?w.filter(N=>we(N.repartoConsumo,N.repartoPago,_).has(n)):w,E=new Set(y.filter(r).map(N=>N._id)),M=e?y:y.filter(N=>!E.has(N._id)),F=c(w,new Set(w.filter(r).map(N=>N._id))),D=l(w),q=u(w),T=t.store.get("config"),R=t.store.get("inflacion"),H=new Date(k(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});$.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${E.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${E.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${q.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${q.length===1?"acaba":"acaban"} ${m(p(q.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(P(q.reduce((N,B)=>N+B.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||D.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(H)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(P(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${D.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(P(D.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(D.desde)} → ${m(D.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(N=>Ws(N,{periodos:R,usarInflacion:!!T.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:E.has(N._id),personas:A})).join("")}
      </div>`;for(const N of $.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const g=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),h=()=>{var $;return($=g())==null?void 0:$.classList.add("hidden")};function I($,A){const _=g(),w=v();return!_||!w?null:(w.innerHTML=`<div class="modal-title">${m($)}</div>${A}`,_.classList.remove("hidden"),z(w,"[data-cancelar]",h),w)}function f($,A){const _=$?t.store.get("loans").find(y=>y._id===$)??null:null,w=I($?"Editar préstamo":"Nuevo préstamo",Zs(_,t.store.get("accounts"),t.store.get("personas"),a()));w&&(w.addEventListener("change",y=>{const E=y.target;E!=null&&E.matches("[data-dp-modo]")&&ro(w),E!=null&&E.matches('[data-reparto-modo="consumo"]')&&jt(w,"consumo"),E!=null&&E.matches('[data-reparto-modo="pago"]')&&jt(w,"pago")}),z(w,"[data-guardar-loan]",y=>{b(w,y.getAttribute("data-guardar-loan")||"")&&(h(),A())}))}function b($,A){const _=q=>{var T;return((T=$.querySelector(q))==null?void 0:T.value)??""},w=q=>{var T;return!!((T=$.querySelector(q))!=null&&T.checked)},y=_("#f-nombre").trim(),E=parseFloat(_("#f-capital")),M=parseFloat(_("#f-tin")),F=parseInt(_("#f-meses"),10);if(!y||!Number.isFinite(E)||!Number.isFinite(M)||!Number.isFinite(F))return j("Completa los campos obligatorios","err"),!1;const D={nombre:y,capital:E,tin:M,meses:F,fechaInicio:_("#f-fecha"),comisionApertura:parseFloat(_("#f-com-ap"))||0,comisionAmort:parseFloat(_("#f-com-am"))||0,diaPago:co($),cuenta:_("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:_("#f-tipo-tasa"),basico:w("#f-basico"),tags:_("#f-tags").split(",").map(q=>q.trim()).filter(Boolean),repartoConsumo:qt($,"consumo"),repartoPago:qt($,"pago")};return A?(t.store.updateItem("loans",A,D),j("Préstamo actualizado")):(t.store.addItem("loans",{...D,amortizaciones:[]}),j("Préstamo creado")),s(),!0}function C($,A,_){const w=t.store.get("loans").find(M=>M._id===$);if(!w)return;const y=A?(w.amortizaciones||[]).find(M=>M._id===A)??null:null,E=I(A?"Editar amortización":"Añadir amortización",ti($,y,a()));E&&z(E,"[data-guardar-amort]",M=>{const[F,D]=(M.getAttribute("data-guardar-amort")||"").split("|");S(E,F,D)&&(h(),_([F]))})}function S($,A,_){var T;const w=R=>{var H;return((H=$.querySelector(R))==null?void 0:H.value)??""},y=w("#am-fecha"),E=parseFloat(w("#am-cant"));if(!y||!Number.isFinite(E)||E<=0)return j("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(R=>R._id===A);if(!M)return!1;const F={fecha:y,cantidad:E,tipo:w("#am-tipo"),simulacion:!!((T=$.querySelector("#am-sim"))!=null&&T.checked)},D=M.amortizaciones||[],q=_?D.map(R=>R._id===_?{...R,...F}:R):[...D,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",A,{amortizaciones:q}),j(_?"Amortización actualizada":"Amortización añadida"),s(),!0}function x($,A){z($,"[data-toggle-finalizados]",()=>{e=!e,A()}),z($,"[data-persona-tab]",_=>{n=_.getAttribute("data-persona-tab")||null,A()}),z($,"[data-nuevo-loan]",()=>f(null,A)),z($,"[data-toggle-loan]",(_,w)=>{var F;if((F=w.target)!=null&&F.closest("button"))return;const y=_.getAttribute("data-toggle-loan"),E=[...$.querySelectorAll("[data-body-loan]")].find(D=>D.dataset.bodyLoan===y);(E==null?void 0:E.classList.toggle("open"))?o.add(y):o.delete(y)}),z($,"[data-editar-loan]",_=>f(_.getAttribute("data-editar-loan"),A)),z($,"[data-borrar-loan]",_=>{if(!ot("¿Eliminar préstamo?"))return;const w=_.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),j("Eliminado"),s(),A()}),z($,"[data-amort-loan]",_=>{const w=_.getAttribute("data-amort-loan");o.add(w),C(w,null,A)}),z($,"[data-editar-amort]",_=>{const[w,y]=(_.getAttribute("data-editar-amort")||"").split("|");o.add(w),C(w,y,A)}),z($,"[data-borrar-amort]",_=>{const[w,y]=(_.getAttribute("data-borrar-amort")||"").split("|"),E=t.store.get("loans").find(M=>M._id===w);E&&(t.store.updateItem("loans",w,{amortizaciones:(E.amortizaciones||[]).filter(M=>M._id!==y)}),j("Amortización eliminada"),s(),A([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:ei,mount($){const A=(_=[])=>{for(const w of _)o.add(w);d($)};d($),$.dataset.wired!=="1"&&(x($,A),$.dataset.wired="1")}}}const ke=6.35;function Nt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function po(t){return Math.max(0,(t.bruto||0)-Nt(t))}function oi(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function ni(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Nt(r),0),o=Math.max(0,a-e),n=bt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(po(i)/o):0);return s}function mo(t,a,e){if(t.irpfModo==="manual")return po(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return lt(bt(t.bruto||0,Nt(t)),e);const o=oi(a.filter(i=>i.irpfModo!=="manual")),n=ni(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return lt(s+r,e)-lt(s,e);s+=r}return lt(bt(t.bruto||0,Nt(t)),e)}function si(t,a){return t.reduce((e,o)=>e+mo(o,t,a),0)}function ii(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function ri(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Nt(s),0);return ii(bt(e,o),a)}function ci(t,a,e){const o=t.bruto||0,n=Nt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??ke,c=s*(r/100),u=mo(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-c-u)/i}}function li(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const di={transporte:125,restaurante:220,otros:null},ui={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},pi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Rt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,mi=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function fi(t,a){const e=t.map((s,i)=>{const r=a.find(p=>p._id===s.cuenta),c=di[s.tipo],u=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(ui[s.tipo]??s.tipo)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function gi(t,a){const e=a.hoy??K(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${mi(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
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
              ${pi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??ke).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
    </div>`}function fo(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ke),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:qt(t,"consumo"),repartoPago:qt(t,"pago")}}function vi(t,a,e,o){const n=fo(t,a),s=a.reduce((f,b)=>f+(b.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):lt(bt(n.bruto,s),e.tramos),u=i-r-c,p=i/n.nPagas,l=r/n.nPagas,d=c/n.nPagas,g=p-l-d,v=n.grupoNomina?e.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],h=v.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(v.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",I=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(P(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(P(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(P(n.bruto))}</span>
      ${I}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(P(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(P(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(P(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(P(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(P(g))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(P(g))}/paga`:`ingreso ${m(P(p))} − SS ${m(P(l))} − IRPF ${m(P(d))}`}${s>0?" + recargas flex":""}</span>
    </div>${h}`}function bi(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=fi(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=vi(t,a,e,o))},i=()=>{var c,u;const r=(p,l)=>{const d=t.querySelector(p);d&&(d.style.display=l?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),V(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),V(t,'[data-reparto-modo="consumo"]',()=>jt(t,"consumo")),V(t,'[data-reparto-modo="pago"]',()=>jt(t,"pago")),z(t,"[data-flex-anadir]",()=>{var u,p,l;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((l=t.querySelector("#fc-cuenta"))==null?void 0:l.value)||""}),n(),s()}),z(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const go=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function hi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??It;function r(d,g){const v=o(),h=n();return!v||!h?null:(h.innerHTML=`<div class="modal-title">${m(d)}</div>${g}`,v.classList.remove("hidden"),z(h,"[data-cerrar]",s),h)}function c(){a=null;const d=[...t.store.get("tramosIRPFHistorico")].sort((h,I)=>h.año-I.año),g="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${g}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${m(go(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map(h=>`<div style="${g}">
              <span style="font-weight:600;font-size:13px">${h.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(go(h.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${h.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${h.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);v&&(z(v,"[data-editar-tabla]",h=>{const I=h.getAttribute("data-editar-tabla");l(I==="default"?"default":Number(I))}),z(v,"[data-borrar-tabla]",h=>{const I=Number(h.getAttribute("data-borrar-tabla"));ot(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==I)),j(`Tabla ${I} eliminada`),t.onDatosCambiados(),c())}),z(v,"[data-anadir-anyo]",()=>{var f;const h=parseInt(((f=v.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!h||h<2e3||h>2100)return j("Año inválido","err");const I=t.store.get("tramosIRPFHistorico");if(I.some(b=>b.año===h))return j("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...I,{_id:Date.now().toString(36),año:h,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),l(h)}))}function u(){return e.map(([d,g],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${v}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${v}" value="${g}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function p(d){e=[...d.querySelectorAll("[data-tr-min]")].map((v,h)=>{const I=d.querySelector(`[data-tr-pct="${h}"]`);return[parseFloat(v.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function l(d){var b;a=d;const g=t.store.get("tramosIRPFHistorico");e=(d==="default"?i():((b=g.find(C=>C.año===d))==null?void 0:b.tramos)??i()).map(C=>[...C]);const h=d==="default"?"tabla por defecto":`ejercicio ${d}`,I=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(h)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!I)return;const f=()=>{const C=I.querySelector("#irpf-tramos-rows");C&&(C.innerHTML=u())};z(I,"[data-volver]",c),z(I,"[data-tr-anadir]",()=>{p(I),e.push([0,0]),f()}),z(I,"[data-tr-borrar]",C=>{p(I),e.splice(Number(C.getAttribute("data-tr-borrar")),1),f()}),z(I,"[data-tr-guardar]",()=>{p(I);const C=[...e].sort((S,x)=>S[0]-x[0]);if(C.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:C}),j("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(S=>S.año===a?{...S,tramos:C}:S)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const vo=1500,Mt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,yi=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,$i=t=>(t.modeloFondo||"cuenta")==="pension";function xi(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>wi(n,a,e,o)).join("")}</div>`}function wi(t,a,e,o){const n=Ce(t);if(!n)return"";const s=Se(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,p)=>u+p.cantidad,0),c=Math.min(r,vo)*(s/100);return`<div class="card">
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
  </div>`}function Ii(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Ci(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${yi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Si(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Ii(a))};V(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),z(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),z(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Ai(t,a,e,o){var I;const n=f=>{var b;return((b=t.querySelector(f))==null?void 0:b.value)??""},s=(f,b=0)=>{const C=parseFloat(n(f));return Number.isFinite(C)?C:b},i=f=>{var b;return!!((b=t.querySelector(f))!=null&&b.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),u=n("#pen-grupo"),p={nombre:r,grupoNomina:u,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},l=[...(e==null?void 0:e.historicoSaldos)??[]],d=[...(e==null?void 0:e.aportaciones)??[]],v=((I=[...l].sort((f,b)=>b.fecha.localeCompare(f.fecha))[0])==null?void 0:I.saldo)??(e==null?void 0:e.saldo)??null,h=Date.now().toString(36);return e?(v===null||Math.abs(c-v)>.005)&&(l.push({_id:h,fecha:o,saldo:c,nota:"Actualización manual"}),c>(v??0)&&d.push({_id:`${h}a`,fecha:o,cantidad:c-(v??0)})):c>0&&(l.push({_id:h,fecha:o,saldo:c,nota:"Saldo inicial"}),d.push({_id:`${h}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:l,aportaciones:d}}}const Mi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Ei(t){const a=t.hoy??K,e=()=>{var b;return(b=t.onDatosCambiados)==null?void 0:b.call(t)};let o=null;function n(b){const C=b.filter(x=>x.activo);if(C.length<2)return"";const S=(x,$)=>`<button class="btn-secondary btn-sm" data-persona-tab="${x===null?"":m(x)}"
               style="${o===x?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m($)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${S(null,"Todas")}
      ${C.map(x=>S(x._id,x.nombre)).join("")}
    </div>`}function s(){const b=t.store.get("config");return Ut(t.store.get("tramosIRPFHistorico"),b.tramos_irpf??It)(Number(a().slice(0,4)))}function i(b,C,S){const x=ci(b,C,S),$=!!C&&b.irpfModo!=="manual",A=Le(b.repartoConsumo,b.repartoPago,t.store.get("personas")),_=[b.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${b.mesActualizacionIPC}">IPC m${b.mesActualizacionIPC}</span>`:"",x.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(P(x.flexAnual))}/año</span>`:"",Math.abs(x.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${x.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(b.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${_}</div>
      </div>
      <div class="num">${m(P(x.brutoAnual))}
        ${x.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(P(x.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(P(x.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${x.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${b.irpfModo==="manual"?`${m(b.irpfPct??0)}% (manual)`:`${x.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${b.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(b.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(b._id)}"${b.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(b._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(b._id)}">✕</button>
      </div>
    </div>`}const r=b=>{var C;return((C=t.store.get("accounts").find(S=>S._id===(b||"default")))==null?void 0:C.nombre)??(b||"default")};function c(b,C,S){const x=C.reduce((_,w)=>_+(w.bruto||0),0),$=si(C,S),A=x>0?$/x*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(b)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(P(x))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(P($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${C.map(_=>i(_,C,S)).join("")}
      </div>
    </div>`}function u(b){const C=s(),S=t.store.get("personas"),x=ie(S),$=[...t.store.get("nominas")].sort((M,F)=>(F.bruto||0)-(M.bruto||0)),A=o?$.filter(M=>we(M.repartoConsumo,M.repartoPago,x).has(o)):$,{grupos:_,sueltas:w}=li(A),y=t.store.get("accounts").filter($i),E=$.filter(M=>M.activo!==!1);b.innerHTML=`
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
      ${A.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[..._.entries()].map(([M,F])=>c(M,F,C)).join("")}
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
      <div>${xi(y,E,C,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),l=()=>document.getElementById("modal-content"),d=()=>{var b;return(b=p())==null?void 0:b.classList.add("hidden")};function g(b,C){const S=p(),x=l();return!S||!x?null:(x.innerHTML=`<div class="modal-title">${m(b)}</div>${C}`,S.classList.remove("hidden"),z(x,"[data-cancelar]",d),x)}function v(b,C){const S=b?t.store.get("nominas").find(_=>_._id===b)??null:null,x=[...(S==null?void 0:S.retribucionFlexible)??[]].map(_=>({..._})),$={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},A=g(b?"Editar nómina":"Nueva nómina",gi(S,$));A&&(bi(A,x,$,b??""),z(A,"[data-guardar-nomina]",_=>{const w=fo(A,x);if(!w.nombre||w.bruto<=0)return j("Nombre y bruto anual son obligatorios","err");const y=_.getAttribute("data-guardar-nomina")||"",E={...w,activo:!0,tags:["nomina"]};y?(t.store.updateItem("nominas",y,E),j("Nómina actualizada")):(t.store.addItem("nominas",E),j("Nómina creada")),e(),d(),C()}))}function h(b,C){const S=b?t.store.get("accounts").find(A=>A._id===b)??null:null,x=[...(S==null?void 0:S.planAportaciones)??[]].map(A=>({...A})),$=g(b?"Editar plan de pensiones":"Nuevo plan de pensiones",Ci(S,{nominas:t.store.get("nominas"),hoy:a()}));$&&(Si($,x,a()),z($,"[data-guardar-pension]",A=>{const{datos:_,error:w}=Ai($,x,S,a());if(w)return j(w,"err");const y=A.getAttribute("data-guardar-pension")||"";y?(t.store.updateItem("accounts",y,_),j("Plan actualizado")):(t.store.addItem("accounts",_),j("Plan creado")),e(),d(),C()}))}function I(b,C,S){z(b,"[data-persona-tab]",x=>{o=x.getAttribute("data-persona-tab")||null,C()}),z(b,"[data-nueva-nomina]",()=>v(null,C)),z(b,"[data-editar-nom]",x=>v(x.getAttribute("data-editar-nom"),C)),z(b,"[data-borrar-nom]",x=>{ot("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",x.getAttribute("data-borrar-nom")),j("Eliminada"),e(),C())}),V(b,"[data-activo-nom]",x=>{const $=x;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),e(),C()}),z(b,"[data-tramos]",()=>S.abrir()),z(b,"[data-nueva-pension]",()=>h(null,C)),z(b,"[data-editar-pension]",x=>h(x.getAttribute("data-editar-pension"),C)),z(b,"[data-borrar-pension]",x=>{ot("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",x.getAttribute("data-borrar-pension")),j("Plan eliminado"),e(),C())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Mi,mount(b){const C=()=>u(b);f??(f=hi({store:t.store,onDatosCambiados:()=>{e(),C()},año:()=>Number(a().slice(0,4))})),u(b),b.dataset.wired!=="1"&&(I(b,C,f),b.dataset.wired="1")}}}const _i="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Pi="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",bo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Fi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Di(t,a){const e=t.filter(c=>c.activo&&rt(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const u=re(c,a);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function Ti(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(k(o).getTime()-k(e).getTime())/(30.44*864e5)),s=Bt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(gt(a.inflacion,e,o)-1),u=i-c;r=`
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
  </div>`}function zi(t,a){const e=bo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(g=>(g.retribucionFlexible??[]).filter(v=>v.cuenta===t._id).map(v=>({nomina:g,importe:v.importe}))),s=n.reduce((g,v)=>g+v.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,u=t.grupoNomina?a.nominas.filter(g=>(g.grupoNomina||"")===t.grupoNomina&&g.activo!==!1):n.slice(0,1).map(g=>g.nomina),p=ri(u,a.tramosIRPF),l=c*p/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
    ${l>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(d)}">≈ ${m(P(l))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${n.length>0?n.map(g=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(g.nomina.nombre)}: ${m(P(g.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ji(t){const a=Ce(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(P(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(P(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(P(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(P(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function qi(t,a){const e=re(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=k(o.dashboardStart),i=k(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+u,r)):Math.max(0,c),l=e.costBase+n.totalAportaciones,d=Math.max(0,p-l),g=Ie(d,a.tramosGanancias),v=d>0?(g/d*100).toFixed(1):"0",h=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",I=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(A,_,w)=>A.map(y=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${_} ${m(y.contraparte)}: ${m(y.concepto)}</span>
          <span class="num ${w}">${m(P(y.total))} · ${y.ocurrencias} mov.</span>
        </div>`).join(""),C=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(P(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(P(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(P(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',S=a.invModo(t._id),x=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,$=S==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(P(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(P(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(P(e.neto))}</div><div class="stat-sub">${m(I)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(P(l))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(P(p))}</div><div class="stat-sub">${m(h)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(P(p-g))}</div><div class="stat-sub">${m(v)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${x(S==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${x(S==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${$}
      ${C}
    </div>`}function Ni(t,a){const e=[...t.historicoSaldos||[]].sort((c,u)=>u.fecha.localeCompare(c.fecha)),o=e[0],n=vt(t),s=rt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((bo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Pi}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${_i}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(P(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(P(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ti(t,a)}
    ${s==="beneficio"?zi(t,a):""}
    ${s==="pension"?ji(t):""}
    ${s==="inversion"?qi(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const Ri=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Li(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Oi(t,a){const e=t?rt(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${ee("ac-modelo","Tipo",Ri,e)}
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
    </div>`}function ki(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Li(a))};V(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const u=t.querySelector(r);u&&(u.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),z(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),z(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Bi(t,a,e,o,n){const s=v=>{var h;return((h=t.querySelector(v))==null?void 0:h.value)??""},i=(v,h=0)=>{const I=parseFloat(s(v));return Number.isFinite(I)?I:h},r=v=>{var h;return!!((h=t.querySelector(v))!=null&&h.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",p=u==="beneficio",l=i("#ac-saldo"),d={nombre:c,saldo:l,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:u,planAportaciones:a,tipoBeneficio:p?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&l<=0)return{datos:d};if(!(o===null||Math.abs(l-o)>.005))return{datos:d};if(u==="inversion"&&l>(o??0)){const v=Date.now().toString(36);d.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${v}a`,fecha:e?n:d.fechaInicialSaldo??n,cantidad:l-(o??0)}]}return{datos:d,punto:{fecha:n,saldo:l,nota:e?"Actualización manual":"Saldo inicial"}}}function Be(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:J(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function Hi(t,a,e,o,n){const s=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(P(r.saldo))}</span>
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
    </div>`}const ho=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Gi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ht;function r(d,g){const v=o(),h=n();return!v||!h?null:(h.innerHTML=`<div class="modal-title">${m(d)}</div>${g}`,v.classList.remove("hidden"),z(h,"[data-cerrar]",s),h)}function c(){a=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort((h,I)=>h.año-I.año),g="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${g}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${m(ho(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map(h=>`<div style="${g}">
              <span style="font-weight:600;font-size:13px">${h.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(ho(h.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${h.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${h.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);v&&(z(v,"[data-editar-tg]",h=>{const I=h.getAttribute("data-editar-tg");l(I==="default"?"default":Number(I))}),z(v,"[data-borrar-tg]",h=>{const I=Number(h.getAttribute("data-borrar-tg"));ot(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==I)),j(`Tabla ${I} eliminada`),t.onDatosCambiados(),c())}),z(v,"[data-anadir-anyo-tg]",()=>{var f;const h=parseInt(((f=v.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!h||h<2e3||h>2100)return j("Año inválido","err");const I=t.store.get("tramosGananciasCapitalHistorico");if(I.some(b=>b.año===h))return j("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...I,{_id:Date.now().toString(36),año:h,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),l(h)}))}function u(){return e.map(([d,g],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${v}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${v}" value="${g}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function p(d){e=[...d.querySelectorAll("[data-tg-min]")].map((g,v)=>{const h=d.querySelector(`[data-tg-pct="${v}"]`);return[parseFloat(g.value)||0,parseFloat((h==null?void 0:h.value)??"")||0]})}function l(d){var f;a=d;const g=t.store.get("tramosGananciasCapitalHistorico");e=(d==="default"?i():((f=g.find(b=>b.año===d))==null?void 0:f.tramos)??i()).map(b=>[...b]);const h=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!h)return;const I=()=>{const b=h.querySelector("#tg-rows");b&&(b.innerHTML=u())};z(h,"[data-volver-tg]",c),z(h,"[data-tg-anadir]",()=>{p(h),e.push([0,0]),I()}),z(h,"[data-tg-borrar]",b=>{p(h),e.splice(Number(b.getAttribute("data-tg-borrar")),1),I()}),z(h,"[data-tg-guardar]",()=>{p(h);const b=[...e].sort((C,S)=>C[0]-S[0]);if(b.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:b}),j("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(C=>C.año===a?{...C,tramos:b}:C)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Vi=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Ui(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Vi.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Yi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function yo(t,a){const e=k(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Wi(t,a,e){const o=yo(e,1)[0],n=a.slice(0,7)<o?a.slice(0,7):o,s=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=n;)s.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return s}function $o(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Ki(t,a){const{inicio:e,fin:o}=$o(a);return He(t,e,o)}function He(t,a,e){return Gt([t],{start:a,end:e}).reduce((n,s)=>n+Math.abs(s.cuantia),0)}function Ji(t){function a(n,s={}){var _;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=K(),desde:u,hasta:p}=s,l=t.transacciones({estimacionId:n._id}),g=l.length===0&&(((_=n.tags)==null?void 0:_.length)??0)>0?t.transacciones({tags:n.tags}):l,v=u&&p?Wi(u,p,c):yo(c,i),h=new Map(v.map(w=>{const{inicio:y,fin:E}=$o(w);return[w,{inicio:u&&u>y?u:y,fin:p&&p<E?p:E}]})),I=new Map;for(const w of g){const y=h.get(w.fecha.slice(0,7));if(!y||w.fecha<y.inicio||w.fecha>y.fin)continue;const E=w.fecha.slice(0,7);I.set(E,(I.get(E)??0)+Math.abs(w.importeCts)/100)}const f=[];for(const w of v){const y=I.get(w);if(y===void 0)continue;const E=h.get(w),M=W(He(n,E.inicio,E.fin));f.push({mes:w,estimado:M,real:W(y),desviacion:W(y-M),precision:Yi(M,y)})}const b=W(f.reduce((w,y)=>w+y.estimado,0)),C=W(f.reduce((w,y)=>w+y.real,0)),S=f.reduce((w,y)=>w+Math.abs(y.estimado),0),x=f.length===0?null:S>0?f.reduce((w,y)=>w+y.precision*Math.abs(y.estimado),0)/S:f.reduce((w,y)=>w+y.precision,0)/f.length,$=f.slice(-r),A=$.length>0?W($.reduce((w,y)=>w+y.real,0)/$.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:b,realTotal:C,desviacionTotal:W(C-b),precision:x,mediaRealReciente:A,infraestimada:C>b}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Qi(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Xi(t,a){const e=[];let[o,n]=t.slice(0,7).split("-").map(Number);const[s,i]=a.slice(0,7).split("-").map(Number);for(;o<s||o===s&&n<=i;)e.push(`${o}-${String(n).padStart(2,"0")}`),n+=1,n>12&&(n=1,o+=1);return e}function Zi(t,a,e,o){const n=a.filter(s=>s.tipo==="gasto"&&s.activo!==!1);return Xi(e,o).map(s=>{const i=W(n.reduce((c,u)=>c+Ki(u,s),0)),r=W(t.transacciones({desde:`${s}-01`,hasta:Qi(s),tipo:"gasto"}).reduce((c,u)=>c+Math.abs(u.importeCts)/100,0));return{mes:s,estimado:i,real:r}})}const Ge=640,Lt=200,Z={top:14,right:16,bottom:26,left:54};function tr(t){return te(t).slice(0,3)}function er(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=Ge-Z.left-Z.right,e=Lt-Z.top-Z.bottom,o=Math.max(1,...t.flatMap(p=>[p.estimado,p.real])),n=p=>Z.left+(t.length===1?a/2:p/(t.length-1)*a),s=p=>Z.top+e-Math.max(0,p)/o*e,i=t.map((p,l)=>`${n(l)},${s(p.estimado)}`).join(" "),r=t.map((p,l)=>`${n(l)},${s(p.real)}`).join(" "),c=t.map((p,l)=>`<circle cx="${n(l).toFixed(1)}" cy="${s(p.real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(te(p.mes))}: ${m(P(p.real))}</title></circle>`).join(""),u=t.map((p,l)=>`<text x="${n(l).toFixed(1)}" y="${Lt-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(tr(p.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${Ge} ${Lt}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Gasto real frente a estimado por mes">
      <line x1="${Z.left}" y1="${Z.top}" x2="${Z.left}" y2="${Lt-Z.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${Z.left}" y1="${Lt-Z.bottom}" x2="${Ge-Z.right}" y2="${Lt-Z.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${Z.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(P(o))}</text>
      <polyline points="${i}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${r}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${c}
      ${u}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const xo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function ar(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:wo(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:oe(wo(t,5)).desde,intervaloHasta:oe(t).hasta}}function oe(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function wo(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Ve(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:oe(e).desde,hasta:oe(o).hasta}}function or(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function Ue(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(s=>s.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function nr(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(s=>s._id)),o=a.filter(s=>!e.has(s._id)&&s.tipo==="gasto"&&s.tags.some(i=>t.tagsComunes.includes(i))).reduce((s,i)=>s+Math.abs(i.importeCts),0),n=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:n,gastadoCts:o,diferenciaCts:o-n}}function sr(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(P(J(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(P(J(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(P(J(t.diferenciaCts)))}</strong></span>
    </div>`}function ir(t,a){const{ledger:e}=t,o=(t.hoy??K)(),n=t.accounts().filter(y=>y.activo),s=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=s?Ve(a.periodoDesde,a.periodoHasta):i?or(a.intervaloDesde,a.intervaloHasta):oe(a.mes),u={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(u),l=t.estimaciones().filter(y=>y.tipo!=="transferencia"),d=[...l.map(y=>({_id:y._id,etiqueta:`${m(y.concepto)} (${m(P(y.cuantia))})`})),...t.loans().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Préstamo: ${m(y.nombre)}`})),...t.nominas().filter(y=>y.activo).map(y=>({_id:y._id,etiqueta:`Nómina: ${m(y.nombre)}`}))],g=p.filter(y=>y.tipo!=="transferencia"&&y.importeCts<0).reduce((y,E)=>y+E.importeCts,0),v=p.filter(y=>y.tipo!=="transferencia"&&y.importeCts>0).reduce((y,E)=>y+E.importeCts,0),h=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),I=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=n.map(y=>`<option value="${m(y._id)}"${y._id===a.cuentaId?" selected":""}>${m(y.nombre)}</option>`).join(""),b=y=>'<option value="">— sin asignar —</option>'+d.map(E=>`<option value="${m(E._id)}"${E._id===y?" selected":""}>${E.etiqueta}</option>`).join(""),C=y=>Object.keys(xo).map(E=>`<option value="${E}"${E===y?" selected":""}>${xo[E]}</option>`).join(""),S=p.map(y=>{var E;return`
      <tr data-tx="${m(y._id)}" style="border-bottom:1px solid var(--border)${y.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(y.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(y.concepto)}</td>
        <td style="padding:7px 8px">${qe(y.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(((E=t.accounts().find(M=>M._id===y.cuentaId))==null?void 0:E.nombre)??y.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(y._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${C(y.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(y._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${b(y.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${ft(J(y.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(y._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(y._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),x=i?Zi(e,l,r,c):[],$=s?e.transacciones({desde:r,hasta:c}):[],_=(s?Ue(p):[]).map(y=>{const E=a.detalleAbierto.has(y.concepto),M=E?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${qe(y.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(y.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(y.concepto)}">Asignar</button>
               </div>
               ${sr(nr(y,$))}
             </td>
           </tr>`:"",F=E?y.movimientos.map(D=>{var q;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(D.fecha)}</span> · ${m(((q=t.accounts().find(T=>T._id===D.cuentaId))==null?void 0:q.nombre)??D.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(D._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${b(D.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${ft(J(D.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(y.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(y.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${E?"▾":"▸"}</button>
          <span style="font-size:13px">${m(y.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${y.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(y.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${y.movimientos.length} movimientos del grupo de golpe">${b(y.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${ft(J(y.total))}</td>
        <td></td>
      </tr>${M}${F}`}).join(""),w=I.slice().reverse().slice(0,8).map(y=>{var E;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(y.fecha)}</span>
        <span style="color:var(--text3)">${m(((E=t.accounts().find(M=>M._id===y.cuentaId))==null?void 0:E.nombre)??y.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(P(J(y.saldoCts)))}</span>
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
          <span>Gastos: ${ft(J(g))}</span>
          <span>Ingresos: ${ft(J(v))}</span>
          <span>Neto: ${ft(J(v+g))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(P(h))}</strong></span>
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
                     ${S||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${i?`<div class="divider"></div>
                      <div class="card-title mb-8">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                      ${er(x)}`:""}`}
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
            <select class="form-input" id="nt-estimacion">${b(null)}</select>
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
    </div>`}function rr(t,a,e,o){const{ledger:n}=a;V(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),V(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()}),z(t,"[data-acc-vista]",i=>{e.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),V(t,"#acc-periodo-desde",i=>{e.periodoDesde=i.value||e.periodoDesde,o()}),V(t,"#acc-periodo-hasta",i=>{e.periodoHasta=i.value||e.periodoHasta,o()}),V(t,"#acc-intervalo-desde",i=>{e.intervaloDesde=i.value||e.intervaloDesde,o()}),V(t,"#acc-intervalo-hasta",i=>{e.intervaloHasta=i.value||e.intervaloHasta,o()}),z(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");e.detalleAbierto.has(r)?e.detalleAbierto.delete(r):e.detalleAbierto.add(r),o()}),V(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:u,hasta:p}=Ve(e.periodoDesde,e.periodoHasta),l=n.transacciones({cuentaId:e.cuentaId||void 0,desde:u,hasta:p,texto:e.filtroTexto||void 0}),d=Ue(l).find(g=>g.concepto===r);if(d){for(const g of d.movimientos)n.asignarEstimacion(g._id,c);j(`Estimación asignada a ${d.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),z(t,"[data-grp-tags-asignar]",i=>{var v;const r=i.getAttribute("data-grp-tags-asignar"),c=((v=i.closest("tr"))==null?void 0:v.querySelector("[data-grp-tags]"))??null,u=((c==null?void 0:c.value)??"").split(",").map(h=>h.trim().toLowerCase()).filter(Boolean);if(u.length===0)return j("Escribe al menos una etiqueta","err");const{desde:p,hasta:l}=Ve(e.periodoDesde,e.periodoHasta),d=n.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:l,texto:e.filtroTexto||void 0}),g=Ue(d).find(h=>h.concepto===r);if(g){for(const h of g.movimientos)n.actualizar(h._id,{tags:[...new Set([...h.tags,...u])]});j(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),z(t,"#nt-guardar",()=>{const i=ct(t,"#nt-concepto").trim(),r=so(t,"#nt-importe");if(!i)return j("Indica un concepto","err");if(!(r>0))return j("Indica un importe mayor que cero","err");const c=ct(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ct(t,"#nt-fecha")||(a.hoy??K)(),cuentaId:ct(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:ct(t,"#nt-tipo"),estimacionId:ct(t,"#nt-estimacion")||null}),j("Movimiento registrado"),a.onDatosCambiados(),o()}),z(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;ot("¿Eliminar este movimiento?")&&(n.eliminar(r),j("Movimiento eliminado"),a.onDatosCambiados(),o())}),z(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(l=>l._id===r);if(!c)return;const u=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(J(c.importeCts))));if(u===null)return;const p=parseFloat(u.replace(",","."));if(!Number.isFinite(p)||p<=0)return j("Importe no válido","err");n.actualizar(r,{importe:p}),j("Movimiento actualizado"),a.onDatosCambiados(),o()}),V(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),j("Asignación actualizada"),a.onDatosCambiados()}),V(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),j("Tipo actualizado"),a.onDatosCambiados(),o()}),z(t,"#pc-guardar",()=>{if(ct(t,"#pc-saldo").trim()==="")return j("Indica el saldo","err");const r=so(t,"#pc-saldo");n.registrarPuntoControl(ct(t,"#pc-cuenta"),ct(t,"#pc-fecha")||(a.hoy??K)(),r,ct(t,"#pc-nota").trim()||void 0),j("Saldo real registrado"),a.onDatosCambiados(),o()}),z(t,"[data-pc-borrar]",i=>{ot("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),j("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ye(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function cr(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??K(),u=t.get("expenses"),p=u.find(v=>v._id===s);if(!p)throw new Error(`La estimación ${s} no existe`);const l={...p,fechaFin:c},d={...p,_id:a(),cuantia:W(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},g=u.map(v=>v._id===s?l:v);return g.push(d),t.set("expenses",g),{estimacionCerrada:l,estimacionNueva:d}}function o(s,i={}){const r=[],c=[];for(const u of s)try{r.push(e(u.estimacionId,u.cuantiaSugerida,i))}catch(p){c.push({estimacionId:u.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(h=>[h._id,h])),c=r.get(s);if(!c)return[];const u=[];let p=c;const l=new Set;for(;p!=null&&p.ajustadaDesdeId&&!l.has(p._id);){l.add(p._id);const h=r.get(p.ajustadaDesdeId);if(!h)break;u.unshift(h),p=h}const d=[];let g=c;const v=new Set([c._id]);for(;;){const h=i.find(I=>I.ajustadaDesdeId===g._id&&!v.has(I._id));if(!h)break;v.add(h._id),d.push(h),g=h}return[...u,c,...d]}return{aplicar:e,aplicarTodas:o,cadena:n}}function We(t){var n;const a=t.estimaciones(),e=((n=t.rango)==null?void 0:n.call(t))??null,o=new Map(a.map(s=>[s._id,s]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(s=>{const i=o.get(s.estimacionId);return{analisis:s,estimacion:i,sugerencia:Ye(s,i.cuantia)}}).filter(s=>!!s.estimacion)}function lr(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function dr(t){var c;const a=We(t),e=a.filter(u=>u.analisis.precision!==null),o=a.filter(u=>u.sugerencia!==null),n=t.precision.analizarPorTag(a.map(u=>u.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(c=t.rango)!=null&&c.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:u,estimacion:p,sugerencia:l})=>{const d=u.meses.slice(-6).map(g=>`${te(g.mes)}: ${P(g.estimado)} → ${P(g.real)} (${g.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${m(p.concepto)}</div>
          <div style="margin-top:3px">${qe(u.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${m(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(P(u.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(P(u.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${ft(u.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${no(u.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${l?`<button class="btn-secondary" data-sugerir="${m(u.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${m(l.motivo)}">Sugerir ajuste → ${m(P(l.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(u=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(u.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${u.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(u.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(P(u.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${ft(u.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${no(u.precision)}</td>
      </tr>`).join(""),r=(u,p="left")=>`<th style="padding:7px 8px;text-align:${p};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${u}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Precisión de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm mb-10" style="color:var(--text2);line-height:1.6">
        ${lr(t)} Al ajustar, la
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
    </div>`}function ur(t,a,e){z(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=We(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${P(i.cuantiaActual)}
Nueva estimación: ${P(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;ot(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),j(`Estimación ajustada a ${P(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),z(t,"#ajustar-todas",()=>{const o=We(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${P(r.cuantiaActual)} → ${P(r.cuantiaSugerida)}`).join(`
`);if(!ot(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});j(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const pr=[";",",","	","|"],mr={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function me(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function fe(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function fr(t){let a=";",e=-1;for(const o of pr){const n=t.slice(0,20).map(c=>fe(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function ne(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const p=s===","?o:n;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(c);return Number.isFinite(u)?e?-u:u:null}function Ke(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return Io(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),Io(o,Number(e[2]),Number(e[1]))}return null}function Io(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Co(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Ke(e)!==null).length/a.length}function So(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>ne(e)!==null).length/a.length}function gr(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=me(t[i]);if(r&&mr[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&me(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Co(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||me(t[r]).includes("saldo"))continue;const c=So(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(So(c)>.5||Co(c)>.5)continue;const u=c.reduce((p,l)=>p+l.length,0)/Math.max(1,c.length);u>i&&(i=u,s=r)}s>=0&&(e.concepto=s)}return e}function vr(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=fr(a),o=a.map(p=>fe(p,e).length),n=Math.max(...o);let s=o.findIndex(p=>p===n);s<0&&(s=0);const i=fe(a[s],e);let r=a.slice(s+1).map(p=>fe(p,e));const c=Ke(i[0]??"")!==null||i.some(p=>ne(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const u=gr(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,l)=>`Columna ${l+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function Ao(t,a,e){return`${t}|${a}|${me(e).replace(/\s+/g," ")}`}function br(t,a,e=[]){const o=new Set(e.map(s=>Ao(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?Ke(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let u=null;if(a.importe>=0)u=ne(s[a.importe]??""),u===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const d=a.debe>=0?ne(s[a.debe]??""):null,g=a.haber>=0?ne(s[a.haber]??""):null;d===null&&g===null?r.push("sin importe en Debe ni en Haber"):d!==null&&d!==0?u=-Math.abs(d):g!==null&&g!==0?u=Math.abs(g):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const p=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let l=!1;if(c&&u!==null){const d=Ao(c,u,p);l=o.has(d)||n.has(d),n.add(d)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:u,errores:r,duplicada:l}})}function hr(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ge(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const yr=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Je(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=br(a.analisis,a.mapeo,e)}function $r(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?wr(a,a.analisis,a.mapeo):xr()}
    </div>`}function xr(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function wr(t,a,e){const o=hr(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,u)=>`<option value="${u}"${u===r?" selected":""}>${m(c||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${yr.map(r=>`<div class="form-group">
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
          ${i.map(r=>{const c=r.errores.length>0,u=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(P(J(r.importeCts)))}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Ir(t,a,e,o){z(t,"[data-imp-sincronizar]",()=>{const s=a.ledger.sincronizarHistoricoImportado();if(s.length===0)return j("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var l;return((l=a.accounts().find(d=>d._id===p))==null?void 0:l.nombre)??p},r=s.reduce((p,l)=>p+l.eliminados,0),c=s.reduce((p,l)=>p+l.semanales,0),u=s.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");j(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${u}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),z(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,ge(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),z(t,"[data-imp-cerrar]",()=>{Object.assign(e,ge()),o()}),V(t,"#imp-cuenta",s=>{e.cuentaId=s.value,Je(a,e),o()}),V(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),V(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),Je(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Cr(s).then(r=>{const c=vr(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},Je(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),z(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(u=>u.errores.length===0&&(e.incluirDuplicadas||!u.duplicada));if(s.length===0)return;for(const u of s)a.ledger.registrar({fecha:u.fecha,cuentaId:e.cuentaId,importe:Math.abs(J(u.importeCts)),tipo:u.importeCts<0?"gasto":"ingreso",concepto:u.concepto,origen:"importado"});const i=s.map(u=>u.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);j(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,ge()),a.onDatosCambiados(),o()})}function Cr(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function Sr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ar(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function Mr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Er(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const u=(c.tags??[]).filter(p=>s.tags.includes(p)).length;u!==0&&(u>r||u===r&&i&&c._id<i._id)&&(i=c,r=u)}i&&o.get(i._id).push(s)}return o}function _r(t,a,e,o={}){const{desde:n,hasta:s}=Sr(e);return{...Mo(t,a,n,s,o),mes:e}}function Mo(t,a,e,o,n={}){const s=t.transacciones({desde:e,hasta:o}),i=s.filter(b=>b.tipo!=="transferencia"&&b.importeCts<0),r=s.filter(b=>b.tipo!=="transferencia"&&b.importeCts>0),c=a.filter(b=>b.tipo==="gasto"&&b.activo!==!1),u=new Map((n.analisis??[]).map(b=>[b.estimacionId,b])),p=new Set(c.filter(b=>t.transacciones({estimacionId:b._id}).length>0).map(b=>b._id)),l=Er(i,c,b=>p.has(b)),d=new Set,g=c.map(b=>{const C=l.get(b._id)??[];for(const A of C)d.add(A._id);const S=W(C.reduce((A,_)=>A+Math.abs(_.importeCts)/100,0)),x=W(He(b,e,o)),$=u.get(b._id);return{estimacionId:b._id,concepto:b.concepto,tags:b.tags??[],estimado:x,real:S,desviacion:W(S-x),sinMovimiento:C.length===0,sugerencia:$?Ye($,b.cuantia,{hoy:n.hoy}):null}}),v=new Map;for(const b of i){if(d.has(b._id))continue;const C=Mr(b.concepto),S=v.get(C)??{concepto:b.concepto,total:0,movimientos:0};S.total=W(S.total+Math.abs(b.importeCts)/100),S.movimientos+=1,v.set(C,S)}const h=[...v.values()].sort((b,C)=>C.total-b.total),I=W(g.reduce((b,C)=>b+C.estimado,0)),f=W(i.reduce((b,C)=>b+Math.abs(C.importeCts)/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:I,real:f,desviacion:W(f-I),ingresosReales:W(r.reduce((b,C)=>b+C.importeCts/100,0)),filas:g.sort((b,C)=>Math.abs(C.desviacion)-Math.abs(b.desviacion)),sinEstimacion:h,totalSinEstimacion:W(h.reduce((b,C)=>b+C.total,0)),vacio:s.length===0}}function Eo(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function Pr(){return{mes:"",modo:"mes"}}function _o(t,a){if(a.mes)return a.mes;const e=Eo(t.ledger),o=Ar((t.hoy??K)());return e.includes(o)?o:e[0]??o}function Qe(t,a){const e=(t.hoy??K)(),o=t.estimaciones();if(a.modo==="periodo"){const{desde:s,hasta:i}=t.periodo(),r=t.precision.analizarTodas(o,{hoy:e,desde:s,hasta:i});return Mo(t.ledger,o,s,i,{analisis:r,hoy:e})}const n=t.precision.analizarTodas(o,{hoy:e});return _r(t.ledger,o,_o(t,a),{analisis:n,hoy:e})}function Po(t,a,e,o){const n=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${n}">${m(e)}</button>`}function Fr(t,a){const e=a.modo==="periodo",o=_o(t,a),n=Eo(t.ledger);n.includes(o)||n.unshift(o);const s=Qe(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(s.desde)} al ${m(s.hasta)}`:m(te(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${Po("mes",!e,"Mes","Cierra un mes natural completo")}
      ${Po("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono)">${m(s.desde)} → ${m(s.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
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
      </div>`;const u=l=>l>0?"+":"",p=s.desviacion>0?"var(--red)":s.desviacion<0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(P(s.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${m(P(s.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${u(s.desviacion)}${m(P(s.desviacion))}</div>
          <div class="stat-sub">${s.desviacion>0?"de más":s.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(P(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Dr(s)}
      ${Tr(s)}
    </div>`}function Dr(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
           </div>`:""}`}function Tr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function zr(t,a,e,o){V(t,"#cie-mes",n=>{e.mes=n.value,o()}),z(t,"[data-cie-modo]",n=>{e.modo=n.getAttribute("data-cie-modo")||"mes",o()}),z(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Qe(a,e).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??K)()}),j(`«${r.concepto}» ajustada a ${P(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),z(t,"[data-cie-ajustar-todas]",()=>{const s=Qe(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??K)()});j(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const jr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function qr(t){const a=t.hoy??K,e=()=>{var T;return(T=t.onDatosCambiados)==null?void 0:T.call(t)},o=new Map;let n="cuentas";const s=ar(a().slice(0,7)),i=ge(),r=Pr(),c=()=>t.store.get("expenses"),u=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:u,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},l={ledger:t.ledger,accounts:u,onDatosCambiados:e},d=()=>t.store.get("config"),g=()=>({desde:d().dashboardStart,hasta:d().dashboardEnd}),v={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,periodo:g,hoy:a},h={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?g():null,hoy:a},I=T=>{var R;return((R=t.store.get("accounts").find(H=>H._id===T))==null?void 0:R.nombre)??T},f=()=>Ut(t.store.get("tramosIRPFHistorico"),d().tramos_irpf??It)(Number(a().slice(0,4))),b=()=>Ut(t.store.get("tramosGananciasCapitalHistorico"),d().tramosGananciasCapital??Ht),C=()=>b()(Number(a().slice(0,4)));function S(){const T=d(),R=t.store.get("accounts"),H=Sa({loans:[],expenses:t.store.get("expenses").filter(O=>O.tipo==="transferencia"),accounts:R,config:{dashboardStart:T.dashboardStart,dashboardEnd:T.dashboardEnd,fechaReferencia:T.dashboardStart},nominas:[],resolverTramosGanancias:b()}),N=new Map,B=O=>{let G=N.get(O);return G||(G={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},N.set(O,G)),G},L=(O,G)=>{const X=`${G.sourceId}`,et=O.find(aa=>aa.concepto===X),nt=et??{concepto:X,contraparte:"",total:0,ocurrencias:0};nt.total+=Math.abs(G.cuantia),nt.ocurrencias+=1,et||O.push(nt)};for(const O of H){if(!O.cuenta)continue;const G=B(O.cuenta);O.sourceType==="transfer-in"||O.sourceType==="traspaso-in"?(G.totalAportaciones+=Math.abs(O.cuantia),L(G.entradas,O)):O.sourceType==="transfer-out"||O.sourceType==="traspaso-out"?(G.totalReembolsos+=Math.abs(O.cuantia),L(G.salidas,O)):O.sourceType==="investment-tax"&&(G.retencion+=Math.abs(O.cuantia))}const U=t.store.get("expenses");for(const O of N.values())for(const[G,X]of[[O.entradas,"cuenta"],[O.salidas,"cuentaDestino"]])for(const et of G){const nt=U.find(aa=>aa._id===et.concepto);et.contraparte=I((nt==null?void 0:nt[X])??"default"),et.concepto=(nt==null?void 0:nt.concepto)||(X==="cuenta"?"Aportación":"Reembolso")}return N}function x(T){const R=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let H;if(n==="cuentas"){const L=t.store.get("accounts").filter(G=>rt(G)!=="pension"),U=S(),O={config:d(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:C(),flujos:G=>U.get(G)??Fi,invModo:G=>o.get(G)??"proyeccion"};H=`${Di(L,O.tramosGanancias)}<div class="grid-3">${L.map(G=>Ni(G,O)).join("")}</div>`}else n==="movimientos"?H='<div id="acc-tx"></div>':n==="importar"?H='<div id="acc-import"></div>':H='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';T.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${R}
      </div>
      ${Ui(n)}
      ${H}`;const N=()=>x(T);if(n==="movimientos"){const B=T.querySelector("#acc-tx");B.innerHTML=ir(p,s),rr(B,p,s,N)}else if(n==="importar"){const B=T.querySelector("#acc-import");B.innerHTML=$r(l,i),Ir(B,l,i,N)}else if(n==="cierre"){const B=T.querySelector("#acc-cierre"),L=T.querySelector("#acc-precision");B.innerHTML=Fr(v,r),L.innerHTML=dr(h),zr(B,v,r,N),ur(L,h,N)}}const $=()=>document.getElementById("modal-overlay"),A=()=>document.getElementById("modal-content"),_=()=>{var T;return(T=$())==null?void 0:T.classList.add("hidden")};function w(T,R){const H=$(),N=A();return!H||!N?null:(N.innerHTML=T?`<div class="modal-title">${m(T)}</div>${R}`:R,H.classList.remove("hidden"),z(N,"[data-cancelar]",_),N)}function y(T,R){const H=T?t.store.get("accounts").find(U=>U._id===T)??null:null,N=[...(H==null?void 0:H.planAportaciones)??[]].map(U=>({...U})),B=H?E(H):null,L=w(T?"Editar cuenta / fondo":"Nueva cuenta / fondo",Oi(H,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:B??0}));L&&(ki(L,N,a()),z(L,"[data-guardar-acc]",U=>{const O=U.getAttribute("data-guardar-acc")||"",{datos:G,punto:X,error:et}=Bi(L,N,H,B,a());if(et)return j(et,"err");let nt=O;O?t.store.updateItem("accounts",O,G):nt=t.store.addItem("accounts",G)._id,X&&t.ledger.registrarPuntoControl(nt,X.fecha,X.saldo,X.nota),j(O?"Actualizada":"Cuenta / fondo creado"),e(),_(),R()}))}function E(T){const R=t.ledger.puntosControl(T._id);return R.length>0?Be(R)[0].saldo:T.saldo??null}function M(T,R){const H=t.store.get("accounts").find(L=>L._id===T);if(!H)return;const N=w("Histórico de saldos",Hi(H.nombre,T,Be(t.ledger.puntosControl(T)),H.saldoInicial||0,a()));if(!N)return;const B=()=>{R(),M(T,R)};z(N,"[data-hist-anadir]",()=>{var G,X,et;const L=((G=N.querySelector("#hi-fecha"))==null?void 0:G.value)??"",U=parseFloat(((X=N.querySelector("#hi-saldo"))==null?void 0:X.value)??""),O=((et=N.querySelector("#hi-nota"))==null?void 0:et.value.trim())??"";if(!L||!Number.isFinite(U))return j("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(T,L,U,O||void 0),j("Punto añadido"),e(),B()}),z(N,"[data-hist-borrar]",L=>{const[,U]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(U),j("Eliminado"),e(),B()}),z(N,"[data-hist-semanal]",L=>{const U=L.getAttribute("data-hist-semanal"),O=t.ledger.generarPuntosSemanales(U);j(O>0?`Histórico con ${O} punto${O!==1?"s":""} semanal${O!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),B()}),z(N,"[data-hist-inicial]",L=>{const[U,O]=(L.getAttribute("data-hist-inicial")||"").split("|"),G=t.ledger.puntosControl(U).find(et=>et._id===O);if(!G)return;const X=Be([G])[0].saldo;t.store.updateItem("accounts",U,{saldoInicial:X,fechaInicialSaldo:G.fecha}),j(`Punto inicial → ${G.fecha} (${P(X)})`),e(),B()})}function F(T){const R=t.store.get("accounts").filter(B=>B.activo);if(R.length===0)return j("No hay cuentas activas","err");const H=a(),N=R.map(B=>`• ${B.nombre}: ${P(E(B)??B.saldoInicial??0)}`).join(`
`);if(ot(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${H})?

${N}

Esto recalibra el punto de arranque del dashboard.`)){for(const B of R)t.store.updateItem("accounts",B._id,{saldoInicial:E(B)??B.saldoInicial??0,fechaInicialSaldo:H});j("Saldo base actualizado"),e(),T()}}function D(T,R,H){z(T,"[data-cuentas-tab]",N=>{n=N.getAttribute("data-cuentas-tab")||"cuentas",R()}),z(T,"[data-nueva-acc]",()=>y(null,R)),z(T,"[data-editar-acc]",N=>y(N.getAttribute("data-editar-acc"),R)),z(T,"[data-tramos-ganancias]",()=>H.abrir()),z(T,"[data-reset-base]",()=>F(R)),z(T,"[data-hist-acc]",N=>M(N.getAttribute("data-hist-acc"),R)),z(T,"[data-principal-acc]",N=>{const B=N.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===B}))),j("Cuenta marcada como principal"),e(),R()}),z(T,"[data-borrar-acc]",N=>{const B=N.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return j("Debe existir al menos una cuenta","err");if(!ot("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",B);const U=t.store.get("accounts");U.length>0&&!U.some(O=>O.esCuentaPrincipal)&&t.store.set("accounts",U.map((O,G)=>G===0?{...O,esCuentaPrincipal:!0}:O)),j("Cuenta eliminada"),e(),R()}),z(T,"[data-inv-modo]",N=>{const[B,L]=(N.getAttribute("data-inv-modo")||"").split("|");o.set(B,L==="real"?"real":"proyeccion"),R()})}let q=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:jr,mount(T){const R=()=>x(T);q??(q=Gi({store:t.store,onDatosCambiados:()=>{e(),R()},año:()=>Number(a().slice(0,4))})),x(T),T.dataset.wired!=="1"&&(D(T,R,q),T.dataset.wired="1")}}}function Fo(t,a,e=!1){const o=Math.abs(it(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function Nr(t){function a(w){return`${w}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(w={}){var E;const y=(E=w.texto)==null?void 0:E.trim().toLowerCase();return t.get("transacciones").filter(M=>!(w.cuentaId&&M.cuentaId!==w.cuentaId||w.desde&&M.fecha<w.desde||w.hasta&&M.fecha>w.hasta||w.tipo&&M.tipo!==w.tipo||w.estimacionId&&M.estimacionId!==w.estimacionId||w.tags&&w.tags.length>0&&!w.tags.some(F=>M.tags.includes(F))||y&&!M.concepto.toLowerCase().includes(y))).sort((M,F)=>M.fecha.localeCompare(F.fecha)||M._id.localeCompare(F._id))}function o(w){const y={_id:a("tx"),fecha:w.fecha,cuentaId:w.cuentaId,importeCts:Fo(w.tipo,w.importe,w.negativo),concepto:w.concepto,tags:w.tags??[],estimacionId:w.estimacionId??null,tipo:w.tipo,origen:w.origen??"manual",...w.nota?{nota:w.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),y]),y}function n(w,y){t.set("transacciones",t.get("transacciones").map(E=>{if(E._id!==w)return E;const{importe:M,...F}=y,D={...E,...F};return M!==void 0&&(D.importeCts=Fo(D.tipo,M,D.importeCts<0)),D}))}function s(w){t.set("transacciones",t.get("transacciones").filter(y=>y._id!==w))}function i(w,y){n(w,{estimacionId:y})}function r(w){return t.get("puntosControl").filter(y=>!w||y.cuentaId===w).sort((y,E)=>y.fecha.localeCompare(E.fecha))}function c(w){return r(w).filter(y=>y.origen!=="derivado")}function u(w,y,E,M){const F={_id:a("pc"),fecha:y,cuentaId:w,saldoCts:it(E),...M?{nota:M}:{}},D=t.get("puntosControl").filter(q=>!(q.cuentaId===w&&q.fecha===y));return t.set("puntosControl",[...D,F].sort((q,T)=>q.fecha.localeCompare(T.fecha))),d(w),F}function p(w){const y=t.get("puntosControl").find(E=>E._id===w);t.set("puntosControl",t.get("puntosControl").filter(E=>E._id!==w)),y&&(y.origen==="derivado"?I(y.cuentaId):d(y.cuentaId))}function l(w,y,E){const M=D=>D.cuentaId===w&&D.origen!=="derivado"&&D.fecha>=y&&D.fecha<=E,F=t.get("puntosControl").filter(M).length;return F===0?0:(t.set("puntosControl",t.get("puntosControl").filter(D=>!M(D))),I(w),F)}function d(w){var N,B;const y=c(w),E=t.get("transacciones").filter(L=>L.cuentaId===w).sort((L,U)=>L.fecha.localeCompare(U.fecha)),M=(N=E[0])==null?void 0:N.fecha,F=(B=E[E.length-1])==null?void 0:B.fecha,D=t.get("puntosControl").filter(L=>!(L.cuentaId===w&&L.origen==="derivado"));if(!M)return t.set("puntosControl",D),I(w),0;const q=[];for(let L=kt(M);L<=F;L=kt(sa(L,1)))q.push(L);q[q.length-1]!==F&&q.push(F);const T=new Set(y.map(L=>kt(L.fecha))),R=L=>{const U=y.filter(O=>O.fecha<=L).pop();return E.filter(O=>O.fecha<=L&&(!U||O.fecha>U.fecha)).reduce((O,G)=>O+G.importeCts,(U==null?void 0:U.saldoCts)??0)},H=q.filter(L=>!T.has(kt(L))).map(L=>({_id:a("pcd"),fecha:L,cuentaId:w,saldoCts:R(L),origen:"derivado"}));return t.set("puntosControl",[...D,...H].sort((L,U)=>L.fecha.localeCompare(U.fecha))),g(w,M,R(M)),I(w),H.length}function g(w,y,E){const M=t.get("accounts"),F=M.find(D=>D._id===w);!F||F.fechaInicialSaldo&&F.fechaInicialSaldo<=y||t.set("accounts",M.map(D=>D._id===w?{...D,saldoInicial:J(E),fechaInicialSaldo:y}:D))}function v(w){return(w??[...new Set(t.get("transacciones").map(E=>E.cuentaId))]).reduce((E,M)=>E+d(M),0)}function h(w){const y=t.get("transacciones").filter(F=>F.origen==="importado"&&(!w||F.cuentaId===w)),E=new Map;for(const F of y){const D=E.get(F.cuentaId);D?D.push(F.fecha):E.set(F.cuentaId,[F.fecha])}const M=[];for(const[F,D]of E){D.sort();const q=l(F,D[0],D[D.length-1]);M.push({cuentaId:F,eliminados:q,semanales:d(F)})}return M}function I(w){const y=r(w),E=t.get("accounts");E.some(M=>M._id===w)&&t.set("accounts",E.map(M=>M._id===w?{...M,historicoSaldos:y.map(F=>({_id:F._id,fecha:F.fecha,saldo:J(F.saldoCts),...F.nota?{nota:F.nota}:{}}))}:M))}function f(w,y=K()){const E=c(w).filter(q=>q.fecha<=y).pop(),M=E==null?void 0:E.fecha,F=(E==null?void 0:E.saldoCts)??0;return t.get("transacciones").filter(q=>q.cuentaId===w&&q.fecha<=y&&(M===void 0||q.fecha>M)).reduce((q,T)=>q+T.importeCts,F)}function b(w,y){return J(f(w,y))}function C(w=K(),y){const E=y??t.get("accounts").filter(M=>M.activo).map(M=>M._id);return J(E.reduce((M,F)=>M+f(F,w),0))}function S(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function x(){const w=[...t.get("transacciones").map(y=>y.fecha),...t.get("puntosControl").map(y=>y.fecha)];return w.length>0?w.sort().pop()??null:null}function $(w={}){return J(e(w).reduce((y,E)=>y+E.importeCts,0))}function A(w={}){const y=new Map;for(const E of e(w)){const M=E.fecha.slice(0,7);y.set(M,(y.get(M)??0)+E.importeCts)}return new Map([...y.entries()].sort(([E],[M])=>E.localeCompare(M)).map(([E,M])=>[E,J(M)]))}function _(w={}){const y=new Map;for(const E of e(w))for(const M of E.tags.length>0?E.tags:["sin_tag"])y.set(M,(y.get(M)??0)+E.importeCts);return new Map([...y.entries()].map(([E,M])=>[E,J(M)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:u,eliminarPuntoControl:p,eliminarPuntosControlEnRango:l,sincronizarHistoricoImportado:h,generarPuntosSemanales:d,generarPuntosSemanalesTodas:v,saldoCuenta:b,saldoCuentaCts:f,saldoTotal:C,tieneDatos:S,ultimaFecha:x,total:$,totalPorMes:A,totalPorTag:_}}function pt(t){return t.trim().toLowerCase()}function Rr(t){function a(){const u=new Map,p=(l,d)=>{const g=pt(l);if(!g)return;const v=u.get(g)??{tag:g,estimaciones:0,reales:0,total:0};v[d]+=1,v.total+=1,u.set(g,v)};for(const l of t.get("expenses"))for(const d of l.tags??[])p(d,"estimaciones");for(const l of t.get("transacciones"))for(const d of l.tags??[])p(d,"reales");return[...u.values()].sort((l,d)=>d.total-l.total||l.tag.localeCompare(d.tag))}function e(){return a().map(u=>u.tag)}function o(u){return a().filter(p=>u==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function n(u,p,l){const d=pt(p),g=(u??[]).map(pt);if(!g.includes(d))return u??[];const v=g.filter(h=>h!==d);return l===null?[...new Set(v)]:[...new Set([...v,pt(l)])]}function s(u,p){const l=pt(p);if(!l)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(u,l)}function i(u,p){let l=0;for(const d of u)pt(d)!==pt(p)&&(l+=c(d,pt(p)).cambiados);return{cambiados:l}}function r(u){return c(u,null)}function c(u,p){let l=0;const d=t.get("expenses").map(A=>{const _=n(A.tags,u,p);return _!==A.tags&&(l+=1),_===A.tags?A:{...A,tags:_}});t.set("expenses",d);const g=t.get("transacciones").map(A=>{const _=n(A.tags,u,p);return _!==A.tags&&(l+=1),_===A.tags?A:{...A,tags:_}});t.set("transacciones",g);const v=t.get("loans").map(A=>{const _=n(A.tags,u,p);return _!==A.tags&&(l+=1),_===A.tags?A:{...A,tags:_}});t.set("loans",v);const h=t.get("nominas").map(A=>{const _=n(A.tags,u,p);return _!==A.tags&&(l+=1),_===A.tags?A:{...A,tags:_}});t.set("nominas",h);const I=t.get("config"),f=pt(u),b=A=>{const _=(A??[]).map(pt);if(!_.includes(f))return A??[];const w=_.filter(y=>y!==f);return p===null?[...new Set(w)]:[...new Set([...w,p])]},C={},S=b(I.activeTagsFilter),x=b(I.tagCategorias),$=b(I.tagGrupos);return S!==I.activeTagsFilter&&(C.activeTagsFilter=S),x!==I.tagCategorias&&(C.tagCategorias=x),$!==I.tagGrupos&&(C.tagGrupos=$),Object.keys(C).length>0&&t.patchConfig(C),{cambiados:l}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Lr=3;function Do(t){return t<.005?0:t}function Or(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function kr(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<Lr)continue;const r=Or(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Do(n),sigmaDeriva:Do(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function To(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:W(e*Math.hypot(n,s))}function Br(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,u]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-s)*12+(u-i)),l=To(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+l),abajo:W(r.saldoAcum-l)}})}function Hr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Xe="financeapp_session",Gr=["local","dropbox","firebase"];function Vr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Gr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Ur({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(g){const v=n();if(v)try{g?v.setItem(Xe,JSON.stringify(g)):v.removeItem(Xe)}catch{}}function i(){const g=n();if(!g)return null;try{return Vr(g.getItem(Xe))}catch{return null}}function r(){const g=i();return g?(e()-g.ultimoUso)/6e4:null}function c(){const g=a();if(!Number.isFinite(g)||g<=0||o())return!1;const v=r();return v!==null&&v>=g}function u(){const g=i();return g?c()?(s(null),null):g:null}function p(g){const v=e(),h={modo:g.modo,...g.email?{email:g.email}:{},...g.passphrase?{passphrase:g.passphrase}:{},creadaEn:v,ultimoUso:v};return s(h),h}function l(){const g=i();g&&s({...g,ultimoUso:e()})}function d(){s(null)}return{abrir:p,leer:u,tocar:l,cerrar:d,caducada:c,inactividadMinutos:r,get activa(){return u()!==null}}}const zo=["pointerdown","keydown","visibilitychange"];function Yr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of zo)s==null||s.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),a())},e);function u(){if(i){i=!1,n(c);for(const p of zo)s==null||s.removeEventListener(p,r)}}return u}const Wr=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Kr="FinanceApp",Jr=new TextEncoder().encode("financeapp-bio-passphrase-v1");function jo(t){return new Uint8Array(new ArrayBuffer(t))}const Ze="financeapp_bio_credencial",ta="financeapp_bio_secreto",ea="financeapp_bio_ultimo_desbloqueo",qo="financeapp_bio_gracia_min",Qr=5;function Xr(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function ve(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function be(t){const a=atob(t),e=jo(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function Zr(t){return ve(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function tc(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return be(a)}function No(t){return t.getClientExtensionResults()}function ec(t={}){const a=t.webauthn??Xr(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(x=>crypto.getRandomValues(jo(x)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const x=o==null?void 0:o.getItem(Ze);if(!x)return null;try{const $=JSON.parse(x);return typeof $.credencialId!="string"||typeof $.salt!="string"?null:$}catch{return null}}function u(){return c()!==null}async function p(x){const $=await e.importKey("raw",x,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Jr},$,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function l(x,$){const A=s(12),_=await e.encrypt({name:"AES-GCM",iv:A},x,new TextEncoder().encode($));return`${ve(A)}:${ve(_)}`}async function d(x,$){const[A,_]=$.split(":"),w=be(A),y=be(_),E=await e.decrypt({name:"AES-GCM",iv:w},x,y);return new TextDecoder().decode(E)}async function g(x,$){var R,H;if(!x)throw new Error("No hay clave de cifrado que envolver.");const A=s(32),_=s(32),w=s(16),y=await a.create({publicKey:{challenge:_,rp:{name:Kr},user:{id:w,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!y)throw new Error("No se ha podido crear la credencial biométrica.");const E=No(y);if(!((R=E.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((H=E.prf.results)==null?void 0:H.first)??null;if(M||(M=await v(y.rawId,A)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await p(M),D=await l(F,x),q={credencialId:Zr(y.rawId),salt:ve(A),modo:$,creadaEn:n()},T=i();T.setItem(Ze,JSON.stringify(q)),T.setItem(ta,D)}async function v(x,$){var _,w;const A=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:x,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:$}}},timeout:6e4}});return A?((w=(_=No(A).prf)==null?void 0:_.results)==null?void 0:w.first)??null:null}async function h(){const x=c();if(!x)throw new Error("No hay huella configurada en este dispositivo.");const $=o==null?void 0:o.getItem(ta);if(!$)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await v(tc(x.credencialId).buffer,be(x.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const _=await p(A),w=await d(_,$);return f(),w}function I(){o==null||o.removeItem(Ze),o==null||o.removeItem(ta),o==null||o.removeItem(ea)}function f(){o==null||o.setItem(ea,String(n()))}function b(){const x=o==null?void 0:o.getItem(qo);if(x==null)return Qr;const $=Number(x);return Number.isFinite($)&&$>0?$:0}function C(x){o==null||o.setItem(qo,String(Math.max(0,Math.floor(x)||0)))}function S(){if(!u())return!1;const x=b();if(x<=0)return!1;const $=o==null?void 0:o.getItem(ea),A=$?Number($):NaN;return Number.isFinite(A)?n()-A<x*6e4:!1}return{disponible:r,registrada:u,leerCredencial:c,registrar:g,desbloquear:h,olvidar:I,marcarDesbloqueo:f,dentroDeGracia:S,graciaMinutos:b,configurarGracia:C}}function Ro(){if(typeof localStorage<"u"){const $=Yn();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=ns(),a=t.activo(),e=Jt(a),o=Va(localStorage,e),n=Xn({adapter:o}),s=Zn(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Yt})`),n.subscribe($=>s.marcar($));function r(){var A,_,w,y,E;const $=globalThis;(_=(A=$.FirebaseService)==null?void 0:A.isConnected)!=null&&_.call(A)&&((E=(y=(w=$.FirebaseService).uploadRegistroProyectos)==null?void 0:y.call(w))==null||E.catch(M=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",M instanceof Error?M.message:M)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find($=>$._id===a)??t.listar()[0],colecciones:Ct.filter($=>$!=="config"),crear:$=>{const A=t.crear($);return r(),A},renombrar:($,A)=>{t.renombrar($,A),r()},duplicar:($,A)=>{const _=t.duplicar($,A);return r(),_},eliminar:$=>{t.eliminar($),r()},cambiarA:$=>t.establecerActivo($),fusionarRemotos:$=>t.fusionarRemotos($),importarDesde:($,A)=>{const _=ss(localStorage,$,A),w=is(_),y=[];for(const E of A){const M=w[E];if(!Array.isArray(M)||M.length===0)continue;const F=n.get(E);n.set(E,[...F,...M]),y.push(E)}return y.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:y}}},u=cs(n),p=ec(),l=Ur({autoLogoutMinutos:()=>{var A,_;const $=(_=(A=globalThis.State)==null?void 0:A.get)==null?void 0:_.call(A,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),d=Nr(n),g=Rr(n),v=Ji(d),h=cr(n),I=zs({isEnabled:$=>u.isEnabled($)}),f=As({flags:u,rutasExtra:()=>I.flagPorRuta()}),b=ps({flags:u,onChange:()=>{var $,A;I.attachToShell(),f.apply(),(A=($=globalThis.Router)==null?void 0:$.rerender)==null||A.call($)}}),C=$s({proyectos:c}),S=()=>{var A,_,w,y,E,M;const $=globalThis;if((_=(A=$.State)==null?void 0:A.load)==null||_.call(A),((y=(w=$.Router)==null?void 0:w.current)==null?void 0:y.call(w))==="dashboard")try{(M=(E=$.DashboardModule)==null?void 0:E.render)==null||M.call(E)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},x=Ss({store:n,onDatosCambiados:S});return I.register(Us({store:n,onDatosCambiados:S})),I.register(ai({store:n,onDatosCambiados:S})),I.register(Ei({store:n,onDatosCambiados:S})),I.register(qr({store:n,ledger:d,tags:g,precision:v,adjuster:h,onDatosCambiados:S})),I.register(Ns({store:n,onDatosCambiados:S})),{version:Yt,core:Wo,engine:{generarExtracto:Sa,recomputarSaldoAcum:Qo,saldoHoy:Xo,sumarPorTags:Aa,providers:{proyectarGastos:Gt,proyectarPrestamos:va,proyectarTransferencias:ba,proyectarNominas:xa,proyectarInteresesCuentas:ya,proyectarAportaciones:ha,proyectarRetencionesFiscales:$a,proyectarInflacionGastos:wa,proyectarPerdidaAhorro:Ia},analysis:an,margins:dn,avisos:fn,dashboard:En},store:n,flags:u,featureRegistry:{all:xt,porGrupo:Qa},ui:{openFeatures:b.open,openProyectos:C.open,openPersonas:x.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Es({store:n,rerender:()=>{var A,_,w,y;const $=globalThis;(_=(A=$.State)==null?void 0:A.load)==null||_.call(A),(y=(w=$.Router)==null?void 0:w.rerender)==null||y.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Ds({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>I.routes(),navegar:$=>{var A,_;return(_=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:_.call(A,$)}})},app:I,session:Object.assign(l,{vigilar:$=>Yr({sesion:l,onCaducada:$}),opciones:Wr}),biometria:p,cambios:s,datos:{colecciones:Ct,snapshot:()=>Ua(o),aplicar:($,{sellar:A=!0}={})=>{const w=ts(A?(y,E)=>o.set(y,E):(y,E)=>{const M=globalThis.StorageAdapter;M!=null&&M.setRestaurando?M.setRestaurando(y,E):o.set(y,E)},$);return n.load(),s.marcar("copia-restaurada"),w},faltantes:$=>es($),esVacioOPorDefecto:()=>as(Ua(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:d,tags:g,precision:v,adjuster:h,sugerirAjuste:Ye,medirVariabilidad:kr,bandaDeConfianza:Br,bandaAcumulada:To,describirBanda:Hr}}}function ac(){try{const t=Ro();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const st=typeof window<"u"?ac():null;if(st){let t=!1;const a=()=>{var e,o;if(st.app.attachToShell(),st.ui.applyGating(),!t){t=!0,st.ui.watchGating(),st.ui.instalarDeshacer(),st.ui.instalarBuscador();const n=globalThis,s=()=>{var c,u,p,l;return(u=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&u.call(c)?n.FirebaseService:(l=(p=n.DropboxService)==null?void 0:p.isConnected)!=null&&l.call(p)?n.DropboxService:null};st.ui.avisoGuardado=Ts({cambios:st.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=st.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>st.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>st.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>st.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return he.bootstrap=Ro,Object.defineProperty(he,Symbol.toStringTag,{value:"Module"}),he}({});
//# sourceMappingURL=financeapp-core.js.map
