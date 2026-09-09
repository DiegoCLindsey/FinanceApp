var FinanceAppBundle=function(pe){"use strict";function V(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function L(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function U(){return V(new Date)}function me(t,a){return new Date(t,a+1,0).getDate()}function Ke(t,a,e){return V(new Date(t,a,Math.min(e,me(t,a))))}function Zt(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return V(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return Ke(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),V(i)}return null}function Je(t,a){if(!a)return t;const e=L(t);return Zt(e.getFullYear(),e.getMonth(),a)??t}const Eo=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],_o={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function fe(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${_o[e]||e+"º"} ${Eo[o]} del mes`}return t}function Nt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function nt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function W(t){return t/100}function Y(t){return W(nt(t))}function _(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Qe(t){return(t||0).toFixed(2)+"%"}function $t(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function Xe(t,a,e,o=0){const n=$t(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-e))/i-s,v=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-u/v;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function Ze(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const u=L(o),v=a/100/12;let d=e,l=$t(c,a,d);const f=[...s].sort((x,C)=>x.fecha.localeCompare(C.fecha));let g=0;for(let x=1;x<=e*2&&c>.01;x++){const C=new Date(u);u.setMonth(u.getMonth()+1);const p=Je(V(C),i.diaPago||"");for(;g<f.length&&f[g].fecha<=p;){const $=f[g],y=$.cantidad*(n/100);if(c-=$.cantidad,c=Math.max(0,c),$.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*v/l)/Math.log(1+v)):(d=e-x+1,l=$t(c,a,d)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:y,capitalPendiente:c,esAmortizacion:!0,simulacion:$.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const I=c*v,w=Math.min(l-I,c);if(c-=w,c<.01&&(c=0),r.push({mes:x,fecha:p,cuota:l,interes:I,amortizacion:w,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const ta=new Map;function J(t){var C;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((p,I)=>`${p.fecha}|${p.cantidad}|${p.tipo||""}`.localeCompare(`${I.fecha}|${I.cantidad}|${I.tipo||""}`)).map(p=>`${p.fecha}:${p.cantidad}:${p.tipo||""}`).join(";")}`,o=ta.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:u}=t,v=Ze(n,s,i,r,c||0,a,t),d=v.reduce((p,I)=>p+I.interes,0),l=v.reduce((p,I)=>p+I.comisionAmort,0),f=n*((u||0)/100),g=v.filter(p=>!p.esAmortizacion),x={cuota:$t(n,s,i),totalIntereses:d,tae:Xe(n,s,i,u||0),costoTotal:d+l+f,comAp:f,totalComAm:l,fechaFin:((C=g.slice(-1)[0])==null?void 0:C.fecha)||"",mesesReales:g.length,tabla:v};return ta.set(e,x),x}function ea(t){const a=J(t),e=J({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function mt(t,a,e){if(!t||t.length===0)return 1;const o=L(a),n=L(e);if(n<=o)return 1;const s=[...t].sort((c,u)=>c.year-u.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),u=s.filter(x=>x.year<=c),v=u.length>0?u[u.length-1]:s[0],d=(v?v.tasa:0)/100,l=new Date(c+1,0,1),f=l<n?l:n,g=Nt(r,f);i*=Math.pow(1+d,g/365.25),r=f}return i}function aa(t,a,e,o=0){const n=L(a),s=L(e);if(s<=n)return o;const i=Nt(n,s),r=t?[...t].sort((v,d)=>v.year-d.year):[];let c=0,u=new Date(n);for(;u<s;){const v=u.getFullYear(),d=new Date(v+1,0,1),l=d<s?d:s,f=Nt(u,l),g=r.filter(p=>p.year<=v),x=g.length>0?g[g.length-1]:null,C=x!==null?x.tasa:o;c+=C*f,u=l}return i>0?c/i:o}function oa(t,a){return((1+t/100)/(1+a/100)-1)*100}function Po(t,a,e,o){const n=mt(a,e,o);return n>0?t/n:t}function Fo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:u=0,cuotasHipoteca:v=0,gastosBasicos:d=0,gastosOtros:l=0,amortizaciones:f=0}=t,g=c-u-f-d-l,x=g,C=c>0?x/c*100:null,p=r?u-v:u,I=c>0?p/c*100:null,w=c>0?u/c*100:null,$=c>0?(d+u+f)/c*100:null,y=c>0?l/c*100:null,b=(S,A,E)=>S===null?"neutral":S>=A?"verde":S>=E?"amarillo":"rojo",h=(S,A,E)=>S===null?"neutral":S<=A?"verde":S<=E?"amarillo":"rojo";return{ingresos:c,cuotas:u,cuotasHipoteca:v,gastosBasicos:d,gastosOtros:l,amortizaciones:f,ahorroBruto:g,ahorroReal:x,tasaAhorro:C,dti:I,dtiTotal:w,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:y,semAhorro:b(C,e,o),semDTI:h(I,n,s),semNecesidades:h($,i[0],i[0]+15),semDeseos:h(y,i[1],i[1]+10),semAhorroRegla:b(C,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function st(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function ft(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Rt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=e&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=a);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a);return n?n.saldo:0}}function Do(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function To(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function te(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function zo(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function jo(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function At(t,a,e){const o=nt(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:W(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=zo(o,n.length);return n.map((l,f)=>({personaId:l,importe:W(d[f])}))}const s=a.participantes.map(d=>{const l=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*l/100):nt(l)}),i=s.reduce((d,l)=>d+l,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,l=s.map(g=>Math.round(g*d)),f=l.reduce((g,x)=>g+x,0);return l.length>0&&(l[0]+=o-f),n.map((g,x)=>({personaId:g,importe:W(l[x])}))}const c=o-i,{ids:u,cts:v}=jo(n,s,c,e);return u.map((d,l)=>({personaId:d,importe:W(v[l])}))}function ge(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function qo(t,a,e){const o=te(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=ge(a.expenses,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const c=ge(a.loans,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=ge(a.nominas,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function ve(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const xt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function rt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function na(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function gt(t,a){return na(t,a).baseImponible}function sa(t,a){return rt(t,a)/12}const Lt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function be(t,a){if(!t||t<=0)return 0;const e=a||Lt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,u=Math.min(n,c-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function ee(t,a){if(st(t)!=="inversion")return null;const e=ft(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=be(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function he(t,a=new Date){var l;if(st(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=ft(t),n=V(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((f,g)=>f.fecha.localeCompare(g.fecha));let i=0;const r=s.reduce((f,g)=>f+g.cantidad,0);for(const f of s)f.fecha<=n&&(i+=f.cantidad);const c=Math.max(0,o-r),u=r>0?i/r:0,v=Math.min(o,i+c*u),d=Math.max(0,o-v);return{saldo:o,disponible:v,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((l=s.find(f=>f.fecha>n))==null?void 0:l.fecha)||null}}function ia(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(st(t)!=="pension"||!o)return 0;const n=ft(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,v)=>u+v.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function ye(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,v)=>u+(v.bruto||0)*(v.nPagas||12),0),i=[...e||[]].sort((u,v)=>u[0]-v[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[u,v]of i)if(s>=u)r=v;else break;return r}const No=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Lt,TRAMOS_IRPF_DEFAULT:xt,agregarPorPersona:qo,ajustarFechaPago:Je,ajustarPrecioReal:Po,calcBaseImponibleTrabajo:gt,calcFactorInflacion:mt,calcFondoInversion:ee,calcFondosPension:he,calcGananciasCapital:be,calcIRPF:rt,calcImpuestoPension:ia,calcInflacionMediaAnual:aa,calcSaludFinanciera:Fo,calcTAE:Xe,calcTipoMarginalPension:ye,calcTipoRealFisher:oa,calcularReparto:At,clampedDate:Ke,cuotaMensual:$t,desgloseBaseTrabajo:na,diasEntre:Nt,formatEUR:_,formatLocalDate:V,formatPct:Qe,fromCents:W,haySimulaciones:To,idPersonaPorDefecto:te,labelDiaPago:fe,lastDayOfMonth:me,modeloFondoDe:st,parseLocalDate:L,personasImplicadas:ve,resolverDiaEfectivo:Zt,resumenPrestamo:J,resumenPrestamoConAhorro:ea,retencionMensual:sa,roundMoney:Y,saldoEnFecha:Rt,saldoRealCuenta:ft,sinSimulaciones:Do,tablaAmortizacion:Ze,toCents:nt,todayISO:U},Symbol.toStringTag,{value:"Module"}));function Ot(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=L(i.fechaInicio||a.start),c=i.fechaFin?L(i.fechaFin):s,u=i.cuantia,v=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&v(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let l=r.getFullYear(),f=r.getMonth();const g=Math.ceil(240/d)+2;for(let x=0;x<g;x++){const C=Zt(l,f,i.diaPago||"")||(()=>{const I=r.getDate(),w=new Date(l,f+1,0).getDate();return V(new Date(l,f,Math.min(I,w)))})(),p=L(C);if(p>s||p>c)break;p>=n&&p>=r&&v(C),f+=d,f>=12&&(l+=Math.floor(f/12),f=f%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let l=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const f=Math.ceil((n.getTime()-r.getTime())/d);l=new Date(r.getTime()+f*d)}for(;l<=s&&l<=c;)v(V(l)),l=new Date(l.getTime()+d)}}return o}function ra(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=J(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ca(t,a,e=null,o={accounts:[]}){const n=[],s=L(a.start),i=L(a.end),r=o.accounts||[],c=o.nominas||[],u=o.resolverTramosIRPF||(()=>xt),v=o.resolverTramosGanancias||(()=>Lt),d=l=>{var f;return((f=r.find(g=>g._id===l))==null?void 0:f.nombre)??l};for(const l of t){if(!l.activo||l.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(l.cuenta||"default")||e.includes(l.cuentaDestino||"default")))continue;const f=L(l.fechaInicio||a.start),g=l.fechaFin?L(l.fechaFin):i,x=C=>{const p=r.find(P=>P._id===(l.cuenta||"default")),I=r.find(P=>P._id===(l.cuentaDestino||"default")),w=st(p),$=st(I),y=w==="inversion"&&$==="inversion"||w==="pension"&&$==="pension",b=["transferencia",...y?["traspaso"]:[],...l.tags||[]],h=y?"traspaso-out":"transfer-out",S=y?"traspaso-in":"transfer-in",A=!e||e.length===0||e.includes(l.cuenta||"default"),E=!e||e.length===0||e.includes(l.cuentaDestino||"default");if(A&&n.push({fecha:C,concepto:`Transf. → ${d(l.cuentaDestino||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"gasto",tags:b,cuenta:l.cuenta||"default",sourceId:l._id,sourceType:h}),E&&n.push({fecha:C,concepto:`Transf. ← ${d(l.cuenta||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"ingreso",tags:b,cuenta:l.cuentaDestino||"default",sourceId:l._id,sourceType:S}),A&&!y&&p){if(w==="inversion"){const P=parseInt(C.slice(0,4)),M=ee(p,v(P));if(M&&M.saldo>0&&M.plusvalia>0){const F=Math.min(1,l.cuantia/M.saldo),D=M.plusvalia*F*.19;D>.01&&n.push({fecha:C,concepto:`Retención IRPF reembolso ${p.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"investment-tax"})}}else if(w==="pension"){const P=u(parseInt(C.slice(0,4))),M=ye(p,c,P),F=ia(p,l.cuantia,M||void 0);if(F>0){const q=p.grupoNomina?`IRPF rescate ${p.nombre} (tipo marginal grupo "${p.grupoNomina}": ${M}%)`:`Retención rescate ${p.nombre} (${p.impuestoRetirada}% s/beneficio)`;n.push({fecha:C,concepto:q,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"pension-tax"})}}}};if(l.tipoFrecuencia==="extraordinario")f>=s&&f<=i&&f<=g&&x(l.fechaInicio);else if(l.tipoFrecuencia==="mensual"){const C=Math.max(1,l.frecuencia||1);let p=f.getFullYear(),I=f.getMonth();const w=Math.ceil(240/C)+2;for(let $=0;$<w;$++){const y=Zt(p,I,l.diaPago||"")||(()=>{const h=f.getDate(),S=new Date(p,I+1,0).getDate();return V(new Date(p,I,Math.min(h,S)))})(),b=L(y);if(b>i||b>g)break;b>=s&&b>=f&&x(y),I+=C,I>=12&&(p+=Math.floor(I/12),I=I%12)}}else if(l.tipoFrecuencia==="diaria"){const C=Math.max(1,l.frecuencia||1)*864e5;let p=new Date(Math.max(f.getTime(),s.getTime()));if(f<s){const I=Math.ceil((s.getTime()-f.getTime())/C);p=new Date(f.getTime()+I*C)}for(;p<=i&&p<=g;)x(V(p)),p=new Date(p.getTime()+C)}}return n}function la(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){const r=st(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const u of c){if(!u.importe||u.importe<=0)continue;const v=L(u.fechaInicio||a.start),d=u.fechaFin?L(u.fechaFin):s,l=u.cuentaOrigen||"default",f=!e||!e.length||e.includes(l),g=!e||!e.length||e.includes(i._id),x=r==="pension"?"pension":"capital-mobiliario",C=y=>{f&&o.push({fecha:y,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",x],cuenta:l,sourceId:u._id,sourceType:"aportacion-out"}),g&&o.push({fecha:y,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",x],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},p={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let I=v.getFullYear(),w=v.getMonth();const $=Math.ceil(240/p)+2;for(let y=0;y<$;y++){const b=new Date(I,w+1,0).getDate(),h=V(new Date(I,w,Math.min(v.getDate(),b))),S=L(h);if(S>s||S>d)break;S>=n&&S>=v&&C(h),w+=p,w>=12&&(I+=Math.floor(w/12),w=w%12)}}}return o}function da(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=L(a.start),r=L(a.end),c=s.periodoCobro||"mensual",u=c==="mensual",v=u?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=u?1/12:v/(365.25*864e5);let l=Rt(s,a.start);const f=o.filter(C=>C.cuenta===s._id).map(C=>({fecha:C.fecha,delta:C.tipo==="ingreso"?Math.abs(C.cuantia):-Math.abs(C.cuantia)})).sort((C,p)=>C.fecha.localeCompare(p.fecha));let g=0,x=new Date(i);for(;x<=r;){const C=u?new Date(x.getFullYear(),x.getMonth()+1,x.getDate()):new Date(x.getTime()+v),p=new Date(Math.min(C.getTime(),r.getTime()+1)),I=V(p);let w=0;for(;g<f.length&&f[g].fecha<I;)w+=f[g].delta,g++;const $=l,y=l+w,b=Math.max(0,($+y)/2);l=y;const h=u?d:(p.getTime()-x.getTime())/(365.25*864e5),S=b*(Math.pow(1+s.interes/100,h)-1);S>.001&&n.push({fecha:V(x),concepto:`Interés ${s.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),x=C}}return n}function ua(t,a,e,o=null){const n=[],s=a||xt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=sa(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Ot([u],e,o))}return n}const Ro=[5,11,2,8],Lo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function pa(t,a,e=null,o=[],n=()=>xt){const s=[],i=L(a.start),r=L(a.end),c=o.length>0,u={};for(const l of t){const f=l.grupoNomina||"";u[f]||(u[f]=[]),u[f].push(l)}for(const l of Object.keys(u))u[l].sort((f,g)=>(g.bruto||0)-(f.bruto||0));function v(l,f){if(!c||!l.mesActualizacionIPC)return l.bruto||0;const g=l.fechaInicio||a.start,x=L(g),C=L(f);let p=0;for(let w=x.getFullYear();w<=C.getFullYear();w++){const $=new Date(w,l.mesActualizacionIPC-1,1);$>x&&$<=C&&p++}if(p===0)return l.bruto||0;const I=V(new Date(x.getFullYear()+p,0,1));return(l.bruto||0)*mt(o,g,I)}function d(l,f){const g=v(l,f),x=(l.retribucionFlexible||[]).reduce((P,M)=>P+(M.importe||0)*12,0),C=Math.max(0,g-x);if(l.irpfModo==="manual")return C*((l.irpfPct||0)/100);const p=n(parseInt(f.slice(0,4))),I=l.grupoNomina||"";if(!I)return rt(gt(g,x),p);const w=u[I].filter(P=>P.activo),$=w.reduce((P,M)=>P+v(M,f),0),y=w.reduce((P,M)=>P+(M.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),0),b=Math.max(0,$-y),h=gt($,y),S=Math.max(0,g-x),A=b>0?h*(S/b):0,E=w.filter(P=>P._id!==l._id&&(P.bruto||0)>(l.bruto||0)).reduce((P,M)=>{const F=(M.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),q=Math.max(0,v(M,f)-F);return P+(b>0?h*(q/b):0)},0);return rt(E+A,p)-rt(E,p)}for(const l of t){if(!l.activo)continue;const f=l.cuenta||"default";if(e&&e.length>0&&!e.includes(f))continue;const g=Math.max(1,l.nPagas||12),x=L(l.fechaInicio||a.start),C=l.fechaFin?L(l.fechaFin):r,p=I=>{const w=v(l,I),$=d(l,I),y=(l.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),b=Math.max(0,w-y),h=(l.ssPct??6.35)/100,S=b*h,A=b/g,E=$/g,P=S/g,M=l.representacion==="simplificado"?A-P-E:A;s.push({fecha:I,concepto:l.nombre,cuantia:M,tipo:"ingreso",cuenta:f,tags:l.tags||[],sourceId:l._id,sourceType:"nomina"}),l.representacion==="detallado"&&(P>0&&s.push({fecha:I,concepto:`SS ${l.nombre}`,cuantia:P,tipo:"gasto",cuenta:f,tags:["seguridad-social","fiscal"],sourceId:l._id+"_ss",sourceType:"nomina"}),E>0&&s.push({fecha:I,concepto:`IRPF ${l.nombre}`,cuantia:E,tipo:"gasto",cuenta:f,tags:["irpf","fiscal"],sourceId:l._id+"_irpf",sourceType:"nomina"}));for(const F of l.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:I,concepto:`${l.nombre} — ${Lo[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${l._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(g<=12){const I=g===12?1:Math.round(12/g),w=x.getDate();let $=x.getFullYear(),y=x.getMonth();for(let b=0;b<300;b++){const h=new Date($,y+1,0).getDate(),S=new Date($,y,Math.min(w,h));if(S>r||S>C)break;S>=i&&S>=x&&p(V(S)),y+=I,y>=12&&($+=Math.floor(y/12),y=y%12)}}else{const I=g-12,w=x.getDate();let $=x.getFullYear(),y=x.getMonth();for(let S=0;S<300;S++){const A=new Date($,y+1,0).getDate(),E=new Date($,y,Math.min(w,A));if(E>r||E>C)break;E>=i&&E>=x&&p(V(E)),y++,y>=12&&($++,y=0)}const b=Math.max(x.getFullYear(),i.getFullYear()),h=Math.min((l.fechaFin?C:r).getFullYear(),r.getFullYear());for(let S=b;S<=h;S++)for(const A of Ro.slice(0,I)){const E=new Date(S,A,15);E>=i&&E<=r&&E>=x&&E<=C&&p(V(E))}}}return s}function ma(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=L(e.start),r=L(e.end),c=U(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let v=new Date(i.getFullYear(),i.getMonth(),1);for(;v<=r;){const d=v.getFullYear(),l=v.getMonth(),f=d+"-"+String(l+1).padStart(2,"0"),g=f+"-01",x=V(new Date(d,l+1,0)),C=V(new Date(d,l,15));let p=0;for(const I of u){if(o&&o.length>0&&!o.includes(I.cuenta||"default")||I.fechaInicio&&I.fechaInicio>x||I.fechaFin&&I.fechaFin<g)continue;const w=I.fechaInicio||c,$=mt(a,w,C);if($<=1)continue;const y=Math.max(1,I.frecuencia||1);p+=I.cuantia*($-1)/y}p>.01&&s.push({fecha:C,concepto:"Incremento coste de vida",cuantia:p,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+f,sourceType:"inflacion"}),v=new Date(d,l+1,1)}return s}function fa(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=L(e.start),i=L(e.end),r=[...a].sort((u,v)=>u.year-v.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const u=c.getFullYear(),v=c.getMonth(),d=u+"-"+String(v+1).padStart(2,"0"),l=V(new Date(u,v,15)),f=r.filter(I=>I.year<=u),g=f.length>0?f[f.length-1]:r[0],x=g?g.tasa/100:0,C=Math.pow(1+x,1/12)-1,p=t*C;p>.01&&n.push({fecha:l,concepto:"Pérdida ahorro por inflación",cuantia:p,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(u,v+1,1)}return n}function ga(t,a,e){const o=e.fechaReferencia||e.dashboardStart,n=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,s=a.reduce((d,l)=>d+Rt(l,n),0),i=t.filter(d=>d.fecha<n),r=t.filter(d=>d.fecha>=n),c=[];let u=s;for(const d of[...i].reverse()){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);c.unshift({...d,delta:l,saldoAcum:u}),u-=l}const v=[];u=s;for(const d of r){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=l,v.push({...d,delta:l,saldoAcum:u})}return[...c,...v]}function Oo(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return ga([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function va(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c={start:n.dashboardStart,end:n.dashboardEnd},u=e.filter(x=>x.tipo!=="transferencia"),v=e.filter(x=>x.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let l=[];l=l.concat(Ot(u,c,s)),l=l.concat(ra(a,c,s)),l=l.concat(ca(v,c,s,d)),l=l.concat(la(o,c,s));const f=da(o,c,s,l);if(l=l.concat(f),l=l.concat(ua(e,n.tramos_irpf,c,s)),l=l.concat(pa(i,c,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const x=(o.find(I=>I.activo&&I.esCuentaPrincipal)||o.find(I=>I.activo)||{_id:"default"})._id;l=l.concat(ma(u,r,c,s,x));const p=o.filter(I=>I.activo&&(!s||s.length===0||s.includes(I._id))).reduce((I,w)=>I+Rt(w,n.dashboardStart),0);l=l.concat(fa(p,r,c,x))}l.sort((x,C)=>x.fecha.localeCompare(C.fecha));const g=o.filter(x=>x.activo&&(!s||s.length===0||s.includes(x._id)));return ga(l,g,n)}function ko(t,a,e=null){const o=U(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+ft(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function ba(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Bo(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${_(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${_(i)} < ${_(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${_(i)})`})))}return e}function Ho(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=L(a.dashboardStart),n=L(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function Go(t,a,e=U()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",u={};c&&c<=e&&(u[c]=r.saldoInicial||0);for(const v of r.historicoSaldos||[])v.fecha<=e&&(!c||v.fecha>=c)&&(u[v.fecha]=v.saldo);return Object.keys(u).forEach(v=>o.add(v)),u}),s={};for(const r of[...o].sort()){let c=0;for(let u=0;u<a.length;u++){const v=Object.entries(n[u]).filter(([d])=>d<=r);v.length>0?(v.sort(([d],[l])=>l.localeCompare(d)),c+=v[0][1]):c+=a[u].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([u],[v])=>u.localeCompare(v))){const u=t.filter(f=>f.fecha<=r),v=u.length>0?u[u.length-1].saldoAcum:null;if(v===null)continue;const d=c-v,l=v!==0?d/Math.abs(v)*100:0;i.push({cuenta:"Total",fecha:r,estimado:v,real:c,desv:d,pct:l})}return i}const Vo=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Go,detectarPuntosCriticos:Bo,mediaMensualGastos:Ho},Symbol.toStringTag,{value:"Module"}));function kt(t,a=new Date){const e=V(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Ot(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Uo(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+$t(e.capital,e.tin,e.meses),0)}function Yo(t,a){return J(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function ha(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+$t(n.capital,n.tin,n.meses)*Math.min(a,Yo(n,e)),0)}function ya(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=kt(t,o),s=a.colchonMeses||6;return n*s+ha(e,s,V(o))}function Wo(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((u,v)=>u.fecha.localeCompare(v.fecha)).filter(u=>u.fecha<=o).pop();if(!i)return ya(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=kt(t,n),c=i.meses||6;return r*c+ha(e,c,o)}function $e(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((v,d)=>v.fecha.localeCompare(d.fecha)),c=r.filter(v=>v.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(kt(a,i)+Uo(o))*(c.meses||1):0}function Ko(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Jo(t,a){const e={};for(const o of a)e[o._id]=ft(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Ko(o)),{fecha:o.fecha,saldos:{...e}}))}function Qo(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let v=0;v<a.length;v++){const d=a[v],l=$e(c,o,n,s,d.fecha,!1,i);if(l<=0){u=!1;continue}const f=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,x)=>{var C,p;return g+(((p=(C=e[v])==null?void 0:C.saldos)==null?void 0:p[x])||0)},0);f<l&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${_(f)} < ${_(l)} desde ${d.fecha}`})):f>=l&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:f,target:l,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Xo=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:ya,calcColchonEnFecha:Wo,calcGastoBasicoMensual:kt,calcMargenEnFecha:$e,detectarCrucesMargenes:Qo,saldosPorCuentaEnExtracto:Jo},Symbol.toStringTag,{value:"Module"}));function Zo(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function $a(t,a){return Nt(L(t),L(a))}const tn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function xa(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${tn[o-1]}${s?"":` de ${e}`}`}function Ia(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function en(t,a={}){const{hoy:e=U(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:l=>`El ${l} el saldo proyectado baja a ${_(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:l=>`El ${l} el saldo queda en ${_(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:l=>l?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:l=>`El ${l} tendrías ${_(d.saldo)}, y el margen pide ${_(d.target)}.`});const c=new Map;for(const d of r){const l=c.get(d.id);(!l||d.fecha<l.fecha)&&c.set(d.id,d)}const u=[];for(const d of c.values()){const l=$a(e,d.fecha);if(l<0||l>(d.gravedad==="critico"?o:n))continue;const f=i?i(l):0,g=f>0&&d.distancia<f;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:l,plazo:Ia(l),titulo:d.titulo(g),detalle:d.detalle(xa(d.fecha,e)),incierto:g})}const v={critico:0,aviso:1};return u.sort((d,l)=>d.fecha.localeCompare(l.fecha)||v[d.gravedad]-v[l.gravedad]),u.slice(0,s)}const an=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Zo,construirAvisos:en,describirPlazo:Ia,diasEntreISO:$a,fechaEnPalabras:xa},Symbol.toStringTag,{value:"Module"})),on=30.44*864e5;function wa(t){const a=t.getFullYear(),e=t.getMonth();return{desde:V(new Date(a,e,1)),hasta:V(new Date(a,e,me(a,e)))}}function Ca(t){const[a,e]=t.split("-").map(Number);return wa(new Date(a,e-1,1))}function nn(t,a){return Math.max(1,(L(a).getTime()-L(t).getTime())/on)}const sn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),vt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function rn(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function cn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=l=>l.sourceType==="loan"&&l.tipo==="gasto",n=a.loanIdsIniciados,s=vt(t.filter(l=>l.tipo==="ingreso")),i=vt(t.filter(l=>o(l)&&(!n||n.has(l.sourceId??"")))),r=vt(t.filter(l=>o(l)&&a.hipotecaIds.has(l.sourceId??""))),c=vt(t.filter(l=>l.sourceType==="loan-amort")),u=vt(t.filter(l=>l.sourceType==="account-interest")),{basicos:v,deseo:d}=rn(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:v/e,gastosDeseo:d/e,gastosTotales:(i+v+d)/e,intereses:u/e}}function Sa(t,a){return t.reduce((e,o)=>{const n=J(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function ln(t,a,e,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=e),s=n.reduce((u,v)=>{if((v.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return u;const l=J(v).totalIntereses,f=J({...v,amortizaciones:(v.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return u+Math.max(0,f-l)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:J(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=a&&u.fechaFin<=e),r=n.map(u=>J(u).tabla),c=u=>{const{desde:v,hasta:d}=Ca(u);return r.reduce((l,f)=>{const g=f.find(x=>!x.esAmortizacion&&x.fecha>=v&&x.fecha<=d);return l+(g?g.cuota:0)},0)};return{deudaInicio:Sa(n,a),deudaFin:Sa(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function dn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:vt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Aa(t,a=new Set,e="desglosado"){if(a.size===0)return ba(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>a.has(u)),r=s.filter(u=>!a.has(u)),c=e==="porgrupos"&&i.length>0?i:r;for(const u of c)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function un(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Aa(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function pn(t,a){const e=a.reduce((o,n)=>o+ft(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:vt(t.filter(o=>o.tipo==="gasto")),totalIngresos:vt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function mn(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function fn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function gn(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function vn(t,a){if(t.length===0)return[];const e=u=>a==="mes"?u.slice(0,7):u.slice(0,4),o=u=>a==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const u of t){const v=e(u.fecha),d=u.saldoAcum??i;(!c||c.periodo!==v)&&(c&&(i=c.cierre),c={periodo:v,inicio:o(v),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const bn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:vn,cuentasVisibles:mn,gastoPorTagOrdenado:un,idsHipoteca:fn,idsPrestamosIniciados:gn,interesesPorCuenta:dn,mesesDelPeriodo:nn,metricasFlujo:cn,rangoMes:Ca,rangoMesDe:wa,resumenPrestamosPeriodo:ln,sinTransferencias:sn,sumarGastosPorTag:Aa,totalesPeriodo:pn},Symbol.toStringTag,{value:"Module"}));function hn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Bt(t,a){return e=>hn(t,a,e)}const Ht=10,Ma=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ea=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function xe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const _a="default";function Pa(){return{_id:_a,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Fa(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ma,tramosGananciasCapital:Ea,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Da(t,a){return{loans:[],expenses:[],accounts:[xe(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[Pa()],config:Fa(t,a)}}const ct=t=>Array.isArray(t)?t:[],yn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Gt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ta(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ie(t){const{varianza:a,inflacion:e,...o}=t;return o}function $n(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=yn(t.config),r={...Fa(e,o)};for(const[v,d]of Object.entries(s))d!=null&&(r[v]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ma),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Ea),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=ct(t.accounts).map(v=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...v};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Gt(d)});c.length===0&&(c=[xe(e)]);const u=c.filter(v=>v.esCuentaPrincipal);if(u.length===0){const v=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===v._id}))}else if(u.length>1){let v=!1;c=c.map(d=>d.esCuentaPrincipal?v?{...d,esCuentaPrincipal:!1}:(v=!0,d):d)}return n.accounts=c,n.expenses=ct(t.expenses).map(v=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...v};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Ta(d.diaPago),Ie(Gt(d))}),n.loans=ct(t.loans).map(v=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...v};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Ta(d.diaPago),d.amortizaciones=ct(d.amortizaciones).map(l=>Gt(l)),Ie(Gt(d))}),n.nominas=ct(t.nominas).map(v=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...v};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ie(Gt(d))}),n.goals=ct(t.goals).map((v,d)=>{const l=Array.isArray(v.cuentaIds)?v.cuentaIds:v.cuentaId?[v.cuentaId]:[],{cuentaId:f,...g}=v;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:l}}),n.inflacion=ct(t.inflacion),n.tramosIRPFHistorico=ct(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ct(t.tramosGananciasCapitalHistorico),n.escenarios=ct(t.escenarios).map(({inversiones:v,...d})=>d),n}const Mt=t=>Array.isArray(t)?t:[];let we=0;function xn(t){return we+=1,`${t}_${we.toString(36)}`}const In=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),wn=t=>typeof t=="number"&&Number.isFinite(t);function Cn(t,a){const e={...t};we=0;const o=Mt(t.transacciones),n=Mt(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,v,d,l)=>{if(!In(v)||!wn(d))return;const f=`${u}|${v}`;i.has(f)||(i.add(f),s.push({_id:xn("pc"),fecha:v,cuentaId:u,saldoCts:nt(d),...typeof l=="string"&&l?{nota:l}:{}}))};for(const u of Mt(t.accounts)){const v=typeof u._id=="string"?u._id:null;if(v)for(const d of Mt(u.historicoSaldos))r(v,d.fecha,d.saldo,d.nota)}const c=Mt(t.history);if(c.length>0){const u=Mt(t.accounts),v=u.find(l=>l.esCuentaPrincipal)||u.find(l=>l.activo)||u[0],d=typeof(v==null?void 0:v._id)=="string"?v._id:"default";for(const l of c){const f=typeof l.cuenta=="string"?l.cuenta:typeof l.cuentaId=="string"?l.cuentaId:d;r(f,l.fecha,l.saldo,l.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((u,v)=>String(u.fecha).localeCompare(String(v.fecha))),e}const Ce=t=>Array.isArray(t)?t:[],Sn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),An=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Se=0;function Mn(){return Se+=1,`tx_hp_${Se.toString(36)}`}function En(t,a){const e={...t};Se=0;const o=[...Ce(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ce(t.expenses).map(i=>{const r=Ce(i.historialPrecios),c=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",v=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!Sn(g.fecha)||!An(g.cuantia))continue;const x=v==="ingreso"?nt(g.cuantia):-nt(g.cuantia),C=`${c}|${g.fecha}|${x}`;n.has(C)||(n.add(C),o.push({_id:Mn(),fecha:g.fecha,cuentaId:u,importeCts:x,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:v,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:l,...f}=i;return f});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const za=t=>Array.isArray(t)?t:[],bt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Et=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,_n=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Pn(t,a){var v;const e={...t};if(Array.isArray(e.planes))return e;const o=za(e.goals),n=za(e.accounts),s=n.map(d=>{const l=Et(d.bloqueoMeses,0);return{_id:`veh_${bt(d._id,"x")}`,nombre:bt(d.nombre,"Cuenta"),rentabilidadRealAnual:Et(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":l>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Et(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?nt(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:bt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Et(d.interes,0)>0}}),i=new Map(n.map((d,l)=>[bt(d._id,""),s[l]._id])),r=((v=s[0])==null?void 0:v._id)??"",c=o.map((d,l)=>{const f=Array.isArray(d.cuentaIds)?d.cuentaIds.map(x=>bt(x,"")):[],g=_n(d.targetDate);return{_id:bt(d._id,`obj_mig_${l}`),nombre:bt(d.nombre,`Objetivo ${l+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:nt(Et(d.targetAmount,0)),fechaLimite:g,prioridad:Et(d.prioridad,l+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(f[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:bt(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[u],e}function Fn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===_a)||(e.personas=[Pa(),...o]),e}const Vt=t=>Array.isArray(t)?t:[];function ae(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function Dn(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function Tn(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Vt(e.loans).map(ae),e.expenses=Vt(e.expenses).map(ae),e.nominas=Vt(e.nominas).map(ae),e.accounts=Vt(e.accounts).map(ae),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Vt(e.planes).filter(Dn);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const zn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:$n},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Cn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:En},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Pn},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:Fn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:Tn}],jn=["history"];function ja(t,a,e){let o=t;const n=[];for(const s of[...zn].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const ht="state_",oe="state__schemaVersion",_t="financeapp_",Ae="state__modificadoEn";function qa(t=localStorage,a=_t){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Ae&&t.setItem(e(Ae),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function qn(t=localStorage,a=_t){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(ht)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Nn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const Rn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Ln(t,a){const e=Rn[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function On(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function kn({adapter:t,hoy:a=new Date}){const e=V(a),o=On(a);let n=Da(e,o);const s=new Set;let i=[];const r=Nn();function c(M){for(const F of s)F(M)}function u(M){t.set(`${ht}${M}`,n[M])}function v(){const M={};for(const z of Object.keys(n)){const R=t.get(`${ht}${z}`);R!==null&&(M[z]=R)}for(const z of jn){const R=t.get(`${ht}${z}`);R!==null&&(M[z]=R)}const F=t.get(oe),{state:q,applied:D}=ja(M,F,{hoyISO:e,finISO:o});if(n=q,d(),D.length>0){for(const z of Object.keys(n))u(z);t.set(oe,Ht)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[xe(e)],u("accounts");return}const M=n.accounts.filter(F=>F.esCuentaPrincipal);if(M.length===0)n.accounts=n.accounts.map((F,q)=>q===0?{...F,esCuentaPrincipal:!0}:F),u("accounts");else if(M.length>1){let F=!1;n.accounts=n.accounts.map(q=>q.esCuentaPrincipal?F?{...q,esCuentaPrincipal:!1}:(F=!0,q):q),u("accounts")}}function l(M){return n[M]}function f(M,F){n[M]=F,u(M),c(M)}function g(M){f("config",{...n.config,...M})}function x(M){return s.add(M),()=>s.delete(M)}function C(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function p(M,F){const q=[...n[M]],D={...F,_id:C()};return q.push(D),f(M,q),D}function I(M,F,q){const D=n[M].map(z=>z._id===F?{...z,...q}:z);f(M,D)}function w(M,F){const q=n[M],D=q.findIndex(z=>z._id===F);D<0||(r.registrar({col:M,item:q[D],indice:D}),f(M,q.filter((z,R)=>R!==D)))}function $(){const M=r.tomar();if(!M)return null;const F=[...n[M.col]];return F.splice(Math.min(M.indice,F.length),0,M.item),f(M.col,F),M}function y(){return r.pendiente()}function b(){const M=n.accounts||[],F=M.find(q=>q.esCuentaPrincipal&&q.activo)||M.find(q=>q.activo);return F?F._id:"default"}function h(M){var F;return((F=n.accounts.find(q=>q._id===M))==null?void 0:F.nombre)??M}function S(){return Bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function A(){return Bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function E(){return structuredClone(n)}function P(M,F=null){const{state:q,applied:D}=ja(M,F,{hoyISO:e,finISO:o});n=q,d();for(const z of Object.keys(n))u(z);t.set(oe,Ht);for(const z of Object.keys(n))c(z);return{applied:D}}return{load:v,get:l,set:f,patchConfig:g,subscribe:x,addItem:p,updateItem:I,removeItem:w,deshacerBorrado:$,borradoPendiente:y,getPrincipalAccountId:b,accountName:h,resolverTramosIRPF:S,resolverTramosGanancias:A,snapshot:E,replaceAll:P,get schemaVersion(){return Ht},get migrationsApplied(){return[...i]},get today(){return e||U()}}}function Bn(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const It=Object.keys(Da("1970-01-01","1970-01-01"));function Na(t){const a={};for(const e of It){const o=t.get(`${ht}${e}`);o!=null&&(a[e]=o)}return a}function Hn(t,a){const e=[];for(const o of It){const n=a[o];n!=null&&(t(`${ht}${o}`,n),e.push(o))}return e}function Gn(t){return It.filter(a=>t[a]===void 0||t[a]===null)}function Vn(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!It.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Ra=`${_t}meta_proyectos`,La=`${_t}meta_proyectoActivo`,wt="default",Un="Mis finanzas";function Me(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Ut(t){return t===wt?_t:`${_t}p_${t}_`}function Oa(){return[...It.map(t=>`${ht}${t}`),oe,Ae]}function Yn(t=localStorage){function a(){try{const d=t.getItem(Ra);if(!d)return[];const l=JSON.parse(d);return Array.isArray(l)?l:[]}catch{return[]}}function e(d){t.setItem(Ra,JSON.stringify(d))}function o(){const d=a();if(d.some(g=>g._id===wt))return d;const l=Date.now(),f=[{_id:wt,nombre:Un,creadoEn:l,actualizadoEn:l},...d];return e(f),f}function n(){try{const d=t.getItem(La);if(!d)return wt;const l=JSON.parse(d);return typeof l=="string"&&l?l:wt}catch{return wt}}function s(d){t.setItem(La,JSON.stringify(d))}function i(d){const l=d.trim()||"Proyecto sin nombre",f=Date.now(),g={_id:Me(),nombre:l,creadoEn:f,actualizadoEn:f};return e([...o(),g]),g}function r(d,l){const f=l.trim();f&&e(o().map(g=>g._id===d?{...g,nombre:f,actualizadoEn:Date.now()}:g))}function c(d,l){const f=o().find(p=>p._id===d);if(!f)throw new Error("Proyecto no encontrado.");const g=Ut(d),x={_id:Me(),nombre:(l==null?void 0:l.trim())||`${f.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},C=Ut(x._id);for(const p of Oa()){const I=t.getItem(`${g}${p}`);I!==null&&t.setItem(`${C}${p}`,I)}return e([...o(),x]),x}function u(d){if(d===wt)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const l=o();if(!l.some(g=>g._id===d))return;const f=Ut(d);for(const g of Oa())t.removeItem(`${f}${g}`);e(l.filter(g=>g._id!==d))}function v(d){const l=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const x=l.get(g._id);(!x||(g.actualizadoEn??0)>x.actualizadoEn)&&l.set(g._id,g)}const f=[...l.values()];return e(f),f}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:u,fusionarRemotos:v}}function Wn(t,a,e){const o=qa(t,Ut(a)),n={};for(const s of e){const i=o.get(`${ht}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Kn(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Me())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const tt={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},yt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:tt.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:tt.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:tt.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:tt.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:tt.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:tt.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:tt.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:tt.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:tt.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:tt.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:tt.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:tt.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:tt.datos,porDefecto:!1,dependencias:["sync-nube"]}],Jn=new Map(yt.map(t=>[t.id,t]));function Yt(t){return Jn.get(t)}function ka(t){return yt.filter(a=>(a.dependencias||[]).includes(t))}function Ee(){const t={};for(const a of yt)t[a.id]=a.porDefecto;return t}function Ba(){const t=[],a=new Map;for(const e of yt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Qn(t){function a(){return{...Ee(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,l=a(),f=new Set){const g=Yt(d);if(!g)return!1;if(g.nucleo)return!0;if(l[d]===!1)return!1;if(f.has(d))return!0;f.add(d);for(const x of g.dependencias||[])if(!o(x,l,f))return!1;return!0}function n(d,l=a()){const f=Yt(d);return f?(f.dependencias||[]).filter(g=>!o(g,l)):[]}function s(d,l){var w;const f=Yt(d);if(!f)return{cambiadas:[]};if(f.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),x=new Map(yt.map($=>[$.id,o($.id,g)])),C={...g,[d]:l};let p;if(l){const $=[...f.dependencias||[]];for(;$.length;){const y=$.pop();C[y]===!1&&(C[y]=!0,p="dependencias-activadas"),$.push(...((w=Yt(y))==null?void 0:w.dependencias)||[])}}else{const $=ka(d).map(y=>y.id);for(;$.length;){const y=$.pop();C[y]!==!1&&(C[y]=!1,p="cascada-apagado"),$.push(...ka(y).map(b=>b.id))}}return e(C),{cambiadas:yt.filter($=>o($.id,C)!==x.get($.id)).map($=>$.id),motivo:p}}function i(){const d=a();return yt.map(l=>{const f=n(l.id,d);return{...l,activa:o(l.id,d),...f.length>0&&d[l.id]!==!1?{bloqueadaPor:f}:{}}})}function r(){const d=a();return Ba().map(({grupo:l,features:f})=>({grupo:l,features:f.map(g=>{const x=n(g.id,d);return{...g,activa:o(g.id,d),...x.length>0&&d[g.id]!==!1?{bloqueadaPor:x}:{}}})}))}function c(){e(Ee())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function v(d){const l=d,f=l&&typeof l=="object"&&l.features&&typeof l.features=="object"?l.features:null;if(!f)throw new Error('El perfil no tiene una sección "features" válida');const g=Ee(),x=[],C=[];for(const[p,I]of Object.entries(f)){if(!Yt(p)){C.push(p);continue}if(typeof I!="boolean"){C.push(p);continue}g[p]=I,x.push(p)}return e(g),{aplicadas:x,ignoradas:C}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:u,importProfile:v,bloqueadaPor:d=>n(d)}}const Wt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Pt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Xn(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Wt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Wt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Wt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Wt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Zn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Wt(o)}</div>
        ${n.map(Xn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function ts(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function es(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Zn(e)}`,n(i)}function n(i){var c,u,v;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const l=d.dataset.featureToggle,f=e.setEnabled(l,d.checked);f.motivo==="dependencias-activadas"&&Pt(t,"Se han activado también las funcionalidades necesarias"),f.motivo==="cascada-apagado"&&Pt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,f.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),l=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),f=URL.createObjectURL(l),g=a.createElement("a");g.href=f,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(f),Pt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var l,f;const d=(l=r.files)==null?void 0:l[0];if(d)try{const{aplicadas:g,ignoradas:x}=e.importProfile(JSON.parse(await d.text()));Pt(t,x.length>0?`Perfil cargado (${g.length} aplicadas, ${x.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(f=t.onChange)==null||f.call(t,g),o(i)}catch(g){Pt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(v=i.querySelector('[data-feature-action="reset"]'))==null||v.addEventListener("click",()=>{var d;e.reset(),Pt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=ts(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const lt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),as={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Ha(t){return as[t]??t}function ut(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ga(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function os(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function ns(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function ss(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function is(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${lt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${lt(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${lt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${lt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${lt(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${lt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function rs(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${lt(i._id)}">${lt(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${lt(i)}"/> ${lt(Ha(i))}
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
    </div>`}function cs(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function ls(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>is(u,c)).join("")}
      </div>
      ${cs()}
      ${rs(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,u;r.querySelectorAll("[data-proyecto-accion]").forEach(v=>{v.addEventListener("click",()=>{const d=v.dataset.proyectoId,l=v.dataset.proyectoAccion,f=e.listar().find(g=>g._id===d);if(f){if(l==="cambiar"){if(!Ga(t,`¿Cambiar a "${f.nombre}"? Se recargará la página.`))return;e.cambiarA(d),os(t);return}if(l==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",f.nombre):null;if(!g||!g.trim())return;e.renombrar(d,g.trim()),ut(t,"Proyecto renombrado"),n(r);return}if(l==="duplicar"){const g=`${f.nombre} (copia)`,x=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(x===null)return;const C=e.duplicar(d,x.trim()||g);ut(t,`"${C.nombre}" creado como copia de "${f.nombre}" ✓`),n(r);return}if(l==="eliminar"){if(!Ga(t,`¿Eliminar "${f.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),ut(t,`"${f.nombre}" eliminado`),n(r)}catch(g){ut(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const v=r.querySelector("#proyecto-nuevo-nombre"),d=v==null?void 0:v.value.trim();if(!d){ut(t,"Ponle un nombre al proyecto","warn");return}const l=e.crear(d);ut(t,`"${l.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var f;const v=(f=r.querySelector("#proyecto-import-origen"))==null?void 0:f.value;if(!v)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){ut(t,"Elige al menos una colección para importar","warn");return}const{importadas:l}=e.importarDesde(v,d);if(l.length===0){ut(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}ut(t,`Importado: ${l.map(Ha).join(", ")} ✓`),ns(),n(r)})}function i(){const r=ss(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const ne=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Ct=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function ds(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function us(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function ps(t){const a=t.color||ne[0];return`
    <div class="dm-section" data-persona-fila="${Ct(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${Ct(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Ct(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${Ct(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${Ct(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${Ct(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${Ct(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ms(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${ne.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${ne[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function fs(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(ps).join("")}
      </div>
      ${ms()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var v;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.personaId,f=d.dataset.personaAccion,g=e.get("personas"),x=g.find(C=>C._id===l);if(x){if(f==="renombrar"){const C=typeof prompt=="function"?prompt("Nuevo nombre",x.nombre):null;if(!C||!C.trim())return;e.updateItem("personas",l,{nombre:C.trim()}),Ft(t,"Persona renombrada"),s(),n(c);return}if(f==="defecto"){e.set("personas",g.map(C=>({...C,esPorDefecto:C._id===l}))),Ft(t,`"${x.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(f==="activo"){e.updateItem("personas",l,{activo:!x.activo}),s(),n(c);return}if(f==="eliminar"){if(g.length<=1){Ft(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!ds(t,`¿Eliminar "${x.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",l),Ft(t,`"${x.nombre}" eliminada`),s(),n(c)}}})});const u=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const l=d.getAttribute("data-persona-color");u&&(u.value=l),c.querySelectorAll("[data-persona-color]").forEach(f=>{f.style.border=f.getAttribute("data-persona-color")===l?"2px solid white":"2px solid transparent"})})}),(v=c.querySelector("#persona-nuevo-btn"))==null||v.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),l=d==null?void 0:d.value.trim();if(!l){Ft(t,"Ponle un nombre a la persona","warn");return}const f=(u==null?void 0:u.value)||ne[0],g=e.addItem("personas",{nombre:l,color:f,esPorDefecto:!1,activo:!0});Ft(t,`"${g.nombre}" creada ✓`),s(),n(c)})}function r(){const c=us(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const Va={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Ua(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function gs({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([u,v])=>[v,u]);for(const[u,v]of[...Object.entries(Va),...c]){const d=t.isEnabled(u),l=a.querySelector(`.nav-btn[data-view="${v}"]`);l&&(l.style.display=d?"":"none"),!d&&n()===v&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(u=>{const v=[...u.querySelectorAll(".nav-btn[data-view]")];if(v.length===0)return;const d=v.some(l=>l.style.display!=="none");u.style.display=d?"":"none"}),Ua(a,u=>t.isEnabled(u)),r){const u=e??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const u=new MutationObserver(()=>{if(!c){c=!0;try{Ua(a,v=>t.isEnabled(v))}finally{c=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>Va[r]}}const vs="toast toast-deshacer";function bs(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(d){const l=n();if(!l)return;c();const f=document.createElement("div");f.className=vs,f.style.display="flex",f.style.alignItems="center",f.style.gap="12px";const g=document.createElement("span");g.textContent=`${Ln(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const x=document.createElement("button");x.type="button",x.className="btn-secondary btn-sm",x.textContent="Deshacer",x.style.flexShrink="0",x.addEventListener("click",()=>{const C=a.deshacerBorrado();if(c(),!C)return;const p=n();if(p){const I=document.createElement("div");I.className="toast toast-ok",I.textContent="Deshecho.",p.appendChild(I),setTimeout(()=>I.remove(),2500)}e==null||e()}),f.appendChild(g),f.appendChild(x),l.appendChild(f),s=f,i=setTimeout(c,o)}const v=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,u(d))});return()=>{v(),c()}}function se(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Ya(t,a){const e=se(t),o=se(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Kt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function hs(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Kt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Kt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Kt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Kt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Kt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function ys(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=se(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of hs(t)){if(!i(c.ruta))continue;const u=Ya(c.titulo,s),v=u>=0?-1:Math.min(Ya(c.extra??"",s),2);if(u<0&&v<0)continue;const d=u>=0?u:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,se(c.titulo).length)})}return r.sort((c,u)=>c.peso-u.peso||c.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const $s="buscador-overlay",Wa="btn-buscador";function xs(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const $=a.createElement("div");$.id=$s,$.className="modal-overlay",$.style.alignItems="flex-start",$.style.paddingTop="10vh";const y=a.createElement("div");y.className="modal-box",y.style.maxWidth="560px",y.style.padding="14px";const b=a.createElement("input");b.type="search",b.className="form-input",b.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",b.setAttribute("aria-label","Buscar en toda la aplicación"),b.autocomplete="off";const h=a.createElement("div");return h.style.marginTop="10px",h.style.maxHeight="52vh",h.style.overflowY="auto",y.appendChild(b),y.appendChild(h),$.appendChild(y),a.body.appendChild($),$.addEventListener("click",S=>{S.target===$&&x()}),b.addEventListener("input",()=>{r=0,v()}),b.addEventListener("keydown",f),o=$,n=b,s=h,$}function u(){if(s){if(s.textContent="",i.length===0){const $=a.createElement("div");$.style.padding="14px 4px",$.style.fontSize="13px",$.style.color="var(--text3)";const y=(n==null?void 0:n.value.trim())??"";$.textContent=y.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild($);return}i.forEach(($,y)=>{const b=a.createElement("button");b.type="button",b.className="buscador-fila",b.dataset.indice=String(y),y===r&&b.classList.add("activa");const h=a.createElement("div");h.style.minWidth="0";const S=a.createElement("div");S.textContent=$.titulo,S.style.fontSize="13px",S.style.overflow="hidden",S.style.textOverflow="ellipsis",S.style.whiteSpace="nowrap";const A=a.createElement("div");A.textContent=$.detalle,A.style.fontSize="11px",A.style.color="var(--text3)",A.style.overflow="hidden",A.style.textOverflow="ellipsis",A.style.whiteSpace="nowrap",h.appendChild(S),$.detalle&&h.appendChild(A);const E=a.createElement("span");E.className="tag",E.textContent=$.etiqueta,E.style.flexShrink="0",b.appendChild(h),b.appendChild(E),b.addEventListener("click",()=>l(y)),s.appendChild(b)})}}function v(){const $=(n==null?void 0:n.value)??"";i=ys(t.estado(),$,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d($){var y,b;i.length!==0&&(r=(r+$+i.length)%i.length,u(),(b=(y=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:y.scrollIntoView)==null||b.call(y,{block:"nearest"}))}function l($){const y=i[$];y&&(x(),t.navegar(y.ruta))}function f($){$.key==="Escape"?($.preventDefault(),x()):$.key==="ArrowDown"?($.preventDefault(),d(1)):$.key==="ArrowUp"?($.preventDefault(),d(-1)):$.key==="Enter"&&($.preventDefault(),l(r))}function g(){const $=o??c();$.classList.remove("hidden"),$.style.display="",r=0,n&&(n.value="",n.focus()),v()}function x(){o&&(o.style.display="none",i=[])}function C(){return!!o&&o.style.display!=="none"}function p($){($.ctrlKey||$.metaKey)&&($.key==="k"||$.key==="K")&&($.preventDefault(),C()?x():g())}a.addEventListener("keydown",p);let I=null;function w(){const $=a.getElementById("period-bar");if(!$||a.getElementById(Wa))return;const y=a.createElement("button");y.id=Wa,y.type="button",y.className="btn-secondary",y.title="Buscar en toda la aplicación (Ctrl+K)",y.setAttribute("aria-label","Buscar"),y.textContent="🔍 Buscar",y.style.marginLeft="auto",y.addEventListener("click",g),$.appendChild(y),I=y}return w(),()=>{a.removeEventListener("keydown",p),I==null||I.remove(),o==null||o.remove(),o=null,n=null,s=null}}const _e="aviso-guardado";function Is(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function u(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(_e))==null||g.remove()}function v(){if(s==="oculto")return u();const g=e();if(!g)return;let x=a.getElementById(_e);x||(x=a.createElement("div"),x.id=_e,g.appendChild(x)),x.className=`toast toast-guardado toast-guardado--${s}`,x.style.display="flex",x.style.alignItems="center",x.style.gap="12px",x.textContent="";const C=a.createElement("span");if(C.style.flex="1",x.appendChild(C),s==="pendiente")C.textContent="Tienes cambios sin guardar.",x.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void l())),x.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",v()}));else if(s==="subiendo"){C.textContent="Subiendo…";const p=a.createElement("span");p.className="guardado-giro",p.setAttribute("aria-hidden","true"),x.appendChild(p)}else s==="guardado"?C.textContent="¡Guardado!":s==="error"&&(C.textContent="No se ha podido guardar.",x.appendChild(d("Reintentar","btn-primary btn-sm",()=>void l())))}function d(g,x,C){const p=a.createElement("button");return p.type="button",p.className=x,p.textContent=g,p.style.flexShrink="0",p.addEventListener("click",C),p}async function l(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return s="subiendo",v(),c=(async()=>{try{await t.guardar(),n.alDia(g),s="guardado",v(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),v()},o)}catch(x){console.error("[guardado] no se ha podido subir la copia:",x),s=t.hayDestino()?"error":"oculto",v()}finally{c=null}})(),c}const f=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",v()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:l,detener(){f(),u()}}}function ws({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(g){return`view-${g}`}function s(g){const x=t.getElementById(n(g.route));if(x)return x;const C=t.querySelector(".view-container");if(!C)return null;const p=t.createElement("div");return p.id=n(g.route),p.className="view hidden",C.appendChild(p),p}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const x=t.querySelectorAll(".nav-section"),C=x[g.seccion??Math.max(0,x.length-1)];if(!C)return;const p=t.createElement("button");p.className="nav-btn",p.dataset.view=g.route,p.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,C.appendChild(p),p.addEventListener("click",()=>{const I=globalThis.Router;I==null||I.navigate(g.route)})}function r(g){e.set(g.route,g),s(g),i(g)}function c(){return[...e.keys()].filter(g=>{const x=e.get(g);return!a||a(x.flagId??x.id)})}function u(g){return c().includes(g)}function v(g){const x=e.get(g);if(!x||a&&!a(x.flagId??x.id))return!1;const C=s(x);if(!C)return!1;if(o&&o!==g){const p=e.get(o),I=t.getElementById(n(o));p!=null&&p.unmount&&I&&p.unmount(I)}return x.mount(C),o=g,!0}function d(){o&&v(o)}function l(){const g={};for(const[x,C]of e)g[x]=C.flagId??C.id;return g}function f(){for(const g of e.values())s(g),i(g)}return{register:r,routes:c,has:u,mount:v,rerender:d,flagPorRuta:l,attachToShell:f,get activa(){return o}}}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function pt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(_(t))}</span>`}function Ka(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Ja(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const Cs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Pe(t){const[a,e]=t.split("-").map(Number);return`${Cs[e-1]} ${a}`}function j(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function et(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function T(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function G(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function it(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Qa(t,a){const e=parseFloat(it(t,a));return Number.isFinite(e)?e:0}const Ss="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Fe(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function As(t){const{store:a}=t,e=t.hoy??U,o=()=>L(e()),n=()=>a.get("config").margenesSeguridad??[];function s(f){var g;a.patchConfig({margenesSeguridad:f}),(g=t.onDatosCambiados)==null||g.call(t)}function i(f,g){const x=n().map(p=>({...p,puntos:(p.puntos??[]).map(I=>({...I}))})),C=x.find(p=>p._id===f);C&&(g(C),s(x))}function r(f){const g=a.get("config"),x=$e(f,a.get("expenses"),g,a.get("loans"),e(),!1,o());return _(x)}function c(f,g,x){const C=g.tipo==="fijo",p=C?"":`<span class="text-sm" style="color:var(--text3)">${m(_((g.meses??0)*x))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(f._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${C?" selected":""}>Fijo €</option>
            <option value="meses"${C?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${C?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${C?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${p}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(f,g,x){const C=f.cuentas&&f.cuentas.length>0?f.cuentas.map($=>{var y;return((y=g.find(b=>b._id===$))==null?void 0:y.nombre)??$}).join(", "):"Todas las cuentas activas",I=[...f.puntos??[]].sort(($,y)=>$.fecha.localeCompare(y.fecha)).map($=>c(f,$,x)).join(""),w=f.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(C)}</div>
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
            ${I||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
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
      </div>`}function v(f,g){const x=g?n().find(w=>w._id===g):null,C=a.get("accounts").filter(w=>w.activo),p=new Set((x==null?void 0:x.cuentas)??[]),I=C.map(w=>`
        <label class="tag" data-chip="${m(w._id)}" style="cursor:pointer;${p.has(w._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(w._id)}" ${p.has(w._id)?"checked":""} style="display:none"/>
          ${m(w.nombre)}
        </label>`).join(" ");f.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m((x==null?void 0:x.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${I||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${x?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(U())}"/></div>
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
      </div>`}function d(f,g){const x=document.getElementById("modal-overlay"),C=document.getElementById("modal-content");!x||!C||(v(C,f),x.classList.remove("hidden"),G(C,".mg-acc-chip",p=>{const I=p,w=C.querySelector(`[data-chip="${I.value}"]`);w&&(w.style.cssText=`cursor:pointer;${I.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),G(C,"#mg-p-tipo",p=>{const I=p.value==="fijo",w=C.querySelector("#mg-p-importe-wrap"),$=C.querySelector("#mg-p-meses-wrap");w&&(w.style.display=I?"":"none"),$&&($.style.display=I?"none":"")}),T(C,"[data-cerrar-form]",()=>x.classList.add("hidden")),T(C,"[data-guardar-margen]",p=>{var b,h,S,A,E;const I=p.getAttribute("data-guardar-margen")||"",w=((b=C.querySelector("#mg-nombre"))==null?void 0:b.value.trim())??"";if(!w)return j("El nombre es obligatorio","err");const $=[...C.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),y=n().map(P=>({...P}));if(I){const P=y.findIndex(M=>M._id===I);if(P===-1)return j("Margen no encontrado","err");y[P]={...y[P],nombre:w,cuentas:$}}else{const P=((h=C.querySelector("#mg-p-tipo"))==null?void 0:h.value)??"fijo",M={_id:Fe(),fecha:((S=C.querySelector("#mg-p-fecha"))==null?void 0:S.value)||U(),tipo:P,importe:parseFloat(((A=C.querySelector("#mg-p-importe"))==null?void 0:A.value)??"0")||0,meses:parseFloat(((E=C.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};y.push({_id:Fe(),nombre:w,activo:!0,cuentas:$,puntos:[M]})}s(y),j(I?"Margen actualizado":"Margen creado"),x.classList.add("hidden"),g()}))}function l(f){const g=n(),x=a.get("accounts"),C=kt(a.get("expenses"),o());f.innerHTML=`
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
             </div>`:g.map(I=>u(I,x,C)).join("")}`;const p=()=>l(f);T(f,"[data-nuevo-margen]",()=>d(null,p)),T(f,"[data-editar-margen]",I=>d(I.getAttribute("data-editar-margen"),p)),T(f,"[data-borrar-margen]",I=>{et("¿Eliminar este margen de seguridad?")&&(s(n().filter(w=>w._id!==I.getAttribute("data-borrar-margen"))),j("Margen eliminado"),p())}),G(f,"[data-toggle-margen]",I=>{const w=I.getAttribute("data-toggle-margen");i(w,$=>{$.activo=I.checked}),p()}),T(f,"[data-add-punto]",I=>{const w=I.getAttribute("data-add-punto");i(w,$=>{$.puntos=[...$.puntos??[],{_id:Fe(),fecha:U(),tipo:"fijo",importe:0,meses:1}]}),p()}),T(f,"[data-borrar-punto]",I=>{const w=I.closest("[data-punto]");if(!w)return;const $=w.dataset.margen,y=w.dataset.punto;i($,b=>{b.puntos=(b.puntos??[]).filter(h=>h._id!==y)}),p()}),G(f,"[data-campo]",I=>{const w=I.closest("[data-punto]");if(!w)return;const $=I.getAttribute("data-campo"),y=I.value;i(w.dataset.margen,b=>{const h=(b.puntos??[]).find(S=>S._id===w.dataset.punto);h&&($==="fecha"?h.fecha=y:$==="tipo"?h.tipo=y:$==="importe"?h.importe=parseFloat(y)||0:h.meses=parseFloat(y)||0)}),p()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Ss,mount:l}}const Ms=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],Es=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],_s=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Ps(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const De=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function Xa(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=Ps(t),i=De(Ms.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${De(Es,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${De(_s,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Za(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function to(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const Fs={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Ds(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Dt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const u=s.has(c._id),v=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${u?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${m(o)}" data-persona="${m(c._id)}"
             value="${v??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
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
      ${Ds(e,a).map(r).join("")}
    </div>
  </div>`}function Tt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function zt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,u=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),v=u?parseFloat(u.value):NaN;return Number.isFinite(v)?{personaId:c,valor:v}:{personaId:c}});return{modo:o,participantes:s}}function eo(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Fs[t.modo]})`}function Te(t,a,e){const o=eo(t,e),n=eo(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const Ts="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",zs=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function js(t){const a=t.hoy??U,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},n=()=>t.store.get("accounts"),s=p=>{var I;return((I=n().find(w=>w._id===(p||"default")))==null?void 0:I.nombre)??(p||"default")};function i(){const p=a();let I=[...t.store.get("expenses")];if(e.mostrarExpirados||(I=I.filter(w=>!w.fechaFin||w.fechaFin>=p)),e.tipo&&(I=I.filter(w=>w.tipo===e.tipo)),e.cuenta&&(I=I.filter(w=>(w.cuenta||"default")===e.cuenta)),e.desde&&(I=I.filter(w=>(w.fechaInicio??"")>=e.desde)),e.hasta&&(I=I.filter(w=>(w.fechaInicio??"")<=e.hasta)),e.busqueda){const w=e.busqueda.toLowerCase();I=I.filter($=>$.concepto.toLowerCase().includes(w))}return e.tags.size>0&&(I=I.filter(w=>(w.tags||[]).some($=>e.tags.has($)))),I.sort((w,$)=>{const y=w[e.orden]??"",b=$[e.orden]??"";return typeof y=="number"&&typeof b=="number"?(y-b)*e.sentido:String(y).localeCompare(String(b))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(p=>p.tags||[]))].filter(Boolean).sort()}function c(p,I){const w=e.orden===p?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${p}">${m(I)} <span class="sort-arrow">${w}</span></span>`}function u(p,I=!1){return(I?'<option value="">Todas las cuentas</option>':"")+n().filter($=>$.activo!==!1).map($=>`<option value="${m($._id)}"${$._id===p?" selected":""}>${m($.nombre)}</option>`).join("")}function v(p){const I=p.tipo==="transferencia",w=Te(p.repartoConsumo,p.repartoPago,t.store.get("personas")),$=fe(p.diaPago??""),y=p.tipoFrecuencia==="extraordinario"?"Único":`Cada ${p.frecuencia??1} ${p.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${$?` · ${$}`:""}`,b=!!p.fechaFin&&p.fechaFin<a(),h=I?'<span class="badge badge-purple">⇄ transf.</span>':p.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=I?`${m(s(p.cuenta))} → ${m(s(p.cuentaDestino))}`:m(s(p.cuenta)),A=(p.tags||[]).map(E=>`<span class="tag${e.tags.has(E)?" active":""}" data-tag="${m(E)}" title="Filtrar por ${m(E)}">${m(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(p.concepto)}</div>
        <div class="tag-list mt-4">${A}</div>
      </div>
      <div>${h}</div>
      <div class="num ${p.tipo==="ingreso"?"pos":I?"":"neg"}">${I?"⇄ ":""}${m(_(p.cuantia))}</div>
      <div class="text-sm">${m(y)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(p._id)}"${p.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${p.tipo==="gasto"&&p.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${p.tipo==="gasto"&&p.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${p.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${p.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(p.ajustadaEn??"")}">ajustada</span>`:""}
        ${w?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(w)}">👥 reparto</span>`:""}
        ${b?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(p._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(p._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(p._id)}">✕</button>
      </div>
    </div>`}function d(p){const I=i(),w=r();p.innerHTML=`
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
              ${w.map($=>`<span class="tag${e.tags.has($)?" active":""}" data-tag="${m($)}">${m($)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${I.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':I.map(v).join("")}
      </div>`}function l(p){const I=(p==null?void 0:p.tipo)==="transferencia",w=t.store.get("personas"),$=(y,b,h,S,A="")=>`<div class="form-group"><label class="form-label">${m(b)}</label>
       <input class="form-input" type="${h}" id="${y}" value="${m(S)}" placeholder="${m(A)}"/></div>`;return`
      <div class="grid-2">
        ${$("ef-concepto","Concepto","text",(p==null?void 0:p.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(p==null?void 0:p.tipo)==="gasto"||!(p!=null&&p.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(p==null?void 0:p.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${I?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${$("ef-cuantia","Cuantía (€)","number",(p==null?void 0:p.cuantia)??"","500")}
        ${$("ef-frecuencia","Frecuencia","number",(p==null?void 0:p.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${zs.map(([y,b])=>`<option value="${y}"${((p==null?void 0:p.tipoFrecuencia)??"mensual")===y?" selected":""}>${m(b)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${$("ef-fecha-ini","Fecha inicio","date",(p==null?void 0:p.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((p==null?void 0:p.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${I?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((p==null?void 0:p.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(p==null?void 0:p.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${p!=null&&p._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${$("ef-fecha-fin","Fecha fin (opcional)","date",(p==null?void 0:p.fechaFin)??"")}</div>
          <div class="mt-8">${Xa(p==null?void 0:p.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${I?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(p==null?void 0:p.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((p==null?void 0:p.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(p==null?void 0:p.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(p==null?void 0:p.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${m(((p==null?void 0:p.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${p!=null&&p.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(p==null?void 0:p.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${p!=null&&p.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${I?"":`${Dt("Reparto de consumo",p==null?void 0:p.repartoConsumo,w,"consumo")}
                 ${Dt("Reparto de pago",p==null?void 0:p.repartoPago,w,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((p==null?void 0:p._id)??"")}">Guardar</button>
      </div>`}function f(p){var $;const I=(($=p.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",w=(y,b)=>{const h=p.querySelector(y);h&&(h.style.display=b?"":"none")};w("#ef-destino-wrap",I==="transferencia"),w("#ef-basico-wrap",I!=="transferencia"),w("#ef-irpf-wrap",I==="ingreso"),w("#ef-clasificacion-wrap",I==="gasto")}function g(p,I,w){const $=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");!$||!y||(y.innerHTML=`<div class="modal-title">${m(I)}</div>${l(p)}`,$.classList.remove("hidden"),G(y,"#ef-tipo",()=>f(y)),G(y,"[data-dp-modo]",()=>Za(y)),G(y,'[data-reparto-modo="consumo"]',()=>Tt(y,"consumo")),G(y,'[data-reparto-modo="pago"]',()=>Tt(y,"pago")),T(y,"[data-cancelar]",()=>$.classList.add("hidden")),T(y,"[data-guardar]",b=>{x(y,b.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),w())}))}function x(p,I){const w=P=>{var M;return((M=p.querySelector(P))==null?void 0:M.value)??""},$=P=>{var M;return!!((M=p.querySelector(P))!=null&&M.checked)},y=w("#ef-tipo")||"gasto",b=y==="transferencia",h=w("#ef-concepto").trim(),S=parseFloat(w("#ef-cuantia"));if(!h||!Number.isFinite(S))return j("Concepto y cuantía obligatorios","err"),!1;const A=w("#ef-clasificacion"),E={concepto:h,tipo:y,cuantia:S,frecuencia:parseInt(w("#ef-frecuencia"),10)||1,tipoFrecuencia:w("#ef-tipo-frec")||"mensual",fechaInicio:w("#ef-fecha-ini"),fechaFin:w("#ef-fecha-fin")||null,diaPago:to(p),cuenta:w("#ef-cuenta"),cuentaDestino:b?w("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!b&&$("#ef-basico"),sujetoIRPF:!b&&$("#ef-sujetoIRPF"),clasificacion:y==="gasto"?A||null:void 0,tags:b?["transferencia"]:w("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),repartoConsumo:b?void 0:zt(p,"consumo"),repartoPago:b?void 0:zt(p,"pago")};return I?(t.store.updateItem("expenses",I,E),j("Actualizado")):(t.store.addItem("expenses",E),j("Creado")),o(),!0}function C(p,I){const w=p.querySelector("[data-busqueda]");let $;w==null||w.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{e.busqueda=w.value,I();const y=p.querySelector("[data-busqueda]");y==null||y.focus(),y==null||y.setSelectionRange(y.value.length,y.value.length)},250)}),G(p,"[data-expirados]",y=>{e.mostrarExpirados=y.checked,I()}),G(p,"[data-f-tipo]",y=>{e.tipo=y.value,I()}),G(p,"[data-f-cuenta]",y=>{e.cuenta=y.value,I()}),G(p,"[data-f-desde]",y=>{e.desde=y.value,I()}),G(p,"[data-f-hasta]",y=>{e.hasta=y.value,I()}),T(p,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,I()}),T(p,"[data-limpiar-tags]",()=>{e.tags=new Set,I()}),T(p,"[data-tag]",y=>{const b=y.getAttribute("data-tag");e.tags.has(b)?e.tags.delete(b):e.tags.add(b),I()}),T(p,"[data-orden]",y=>{const b=y.getAttribute("data-orden");e.orden===b?e.sentido=e.sentido===1?-1:1:(e.orden=b,e.sentido=1),I()}),T(p,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",I)),T(p,"[data-editar]",y=>{const b=t.store.get("expenses").find(h=>h._id===y.getAttribute("data-editar"));b&&g(b,"Editar",I)}),T(p,"[data-duplicar]",y=>{const b=t.store.get("expenses").find(A=>A._id===y.getAttribute("data-duplicar"));if(!b)return;const{_id:h,...S}=b;g({...S,concepto:`${b.concepto} (copia)`},"Duplicar movimiento",I)}),T(p,"[data-borrar]",y=>{et("¿Eliminar?")&&(t.store.removeItem("expenses",y.getAttribute("data-borrar")),j("Eliminado"),o(),I())}),G(p,"[data-activo]",y=>{const b=y;t.store.updateItem("expenses",b.getAttribute("data-activo"),{activo:b.checked}),o(),I()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ts,mount(p){const I=()=>d(p);d(p),p.dataset.wired!=="1"&&(C(p,I),p.dataset.wired="1")}}}function ie(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=mt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function ao(t,a,e,o){return t.reduce((n,s)=>{const i=mt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function qs(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=J({...t,amortizaciones:o.slice(0,s)}),r=J({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ie(i.tabla,a,e)-ie(r.tabla,a,e)}})}const ze=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Ns(t,a){const e=ea(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?aa(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?oa(t.tin||0,i):null,c=o&&n?qs(t,a.periodos,a.hoy):[],u=c.length?ie(e.sinAmort.tabla,a.periodos,a.hoy)-ie(e.tabla,a.periodos,a.hoy):null,v=u===null?null:u-e.costeTotalAmort,d=s?ao(e.tabla,a.periodos,a.hoy,e.comAp):null,l=s&&o?ao(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const f=Te(t.repartoConsumo,t.repartoPago,a.personas);return f?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(f)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(f=>`<span class="tag">${m(f)}</span>`).join("")}
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
        ${ze("Cuota mensual",m(_(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(_(a.cuotaMes))}</div>`:"")}
        ${ze("Total intereses",m(_(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(_(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${ze("Total pagado",m(_(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(_(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(Qe(e.tae))}</div></div>
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(fe(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(_(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(_(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(_(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(_(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(v??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(_(v??0))}</div>
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

      ${d!==null?Rs(t,e.totalPagado,d,l):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(f=>Ls(f,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((f,g)=>Os(t._id,f,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function Rs(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
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
  </div>`}function Ls(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=mt(e.periodos,e.hoy,t.fecha);o=m(_(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(_(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(_(t.interes))}</td>
    <td class="num">${m(_(t.amortizacion))}</td>
    <td class="num">${m(_(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Os(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
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
  </div>`}const X=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,Jt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,Qt=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,ks=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Bs(t,a,e,o=U()){return`
    <div class="grid-2">
      ${X("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${X("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${X("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${X("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${X("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${ks(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Xa(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Jt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${X("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${X("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Qt("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Dt("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${Dt("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Qt("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Qt("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Qt("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Hs(t,a,e=U()){return`
    <div class="grid-2">
      ${X("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${X("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Jt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${Qt("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Gs="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Vs(t){const a=t.hoy??U;let e=!1;const o=new Set;let n=null;const s=()=>{var b;return(b=t.onDatosCambiados)==null?void 0:b.call(t)};function i(b){const h=b.filter(A=>A.activo);if(h.length<2)return"";const S=(A,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${A===null?"":m(A)}"
               style="${n===A?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${S(null,"Todas")}
      ${h.map(A=>S(A._id,A.nombre)).join("")}
    </div>`}function r(b){if(!b.activo||b.simulacion)return!1;const h=J(b).tabla.filter(S=>!S.esAmortizacion);return h.length===0?!0:h[h.length-1].fecha<a()}function c(b,h){const S=a(),A=S.slice(0,7),E=new Map;let P=0;for(const M of b){if(!M.activo||M.simulacion||h.has(M._id)||(M.fechaInicio||"")>S)continue;const F=J(M).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(A)),q=F.length>0?F[0].cuota:0;E.set(M._id,q),P+=q}return{porLoan:E,total:P,activos:[...E.values()].filter(M=>M>0).length}}function u(b){const h=a().slice(0,7),S=[];for(const A of b){if(!A.activo||A.simulacion)continue;const E=J(A).tabla.filter(M=>!M.esAmortizacion),P=E[E.length-1];P&&P.fecha.slice(0,7)===h&&S.push({loan:A,cuota:P.cuota})}return S}function v(b){return b.length<=1?b[0]??"":`${b.slice(0,-1).join(", ")} y ${b[b.length-1]}`}function d(b){const h=t.store.get("config"),S=h.dashboardStart,A=h.dashboardEnd,E=Math.max(1,(L(A).getTime()-L(S).getTime())/(30.44*864e5));let P=0;for(const M of b)!M.activo||M.simulacion||(P+=J(M).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=S&&F.fecha<=A).reduce((F,q)=>F+q.cuota,0));return{media:P/E,desde:S,hasta:A}}function l(b){const h=t.store.get("personas"),S=te(h),A=[...t.store.get("loans")].sort((N,H)=>H.tin-N.tin),E=n?A.filter(N=>ve(N.repartoConsumo,N.repartoPago,S).has(n)):A,P=new Set(E.filter(r).map(N=>N._id)),M=e?E:E.filter(N=>!P.has(N._id)),F=c(A,new Set(A.filter(r).map(N=>N._id))),q=d(A),D=u(A),z=t.store.get("config"),R=t.store.get("inflacion"),O=new Date(L(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});b.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${P.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${P.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(h)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${m(v(D.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(_(D.reduce((N,H)=>N+H.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||q.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(_(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${q.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(_(q.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(q.desde)} → ${m(q.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(N=>Ns(N,{periodos:R,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:P.has(N._id),personas:h})).join("")}
      </div>`;for(const N of b.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const f=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),x=()=>{var b;return(b=f())==null?void 0:b.classList.add("hidden")};function C(b,h){const S=f(),A=g();return!S||!A?null:(A.innerHTML=`<div class="modal-title">${m(b)}</div>${h}`,S.classList.remove("hidden"),T(A,"[data-cancelar]",x),A)}function p(b,h){const S=b?t.store.get("loans").find(E=>E._id===b)??null:null,A=C(b?"Editar préstamo":"Nuevo préstamo",Bs(S,t.store.get("accounts"),t.store.get("personas"),a()));A&&(A.addEventListener("change",E=>{const P=E.target;P!=null&&P.matches("[data-dp-modo]")&&Za(A),P!=null&&P.matches('[data-reparto-modo="consumo"]')&&Tt(A,"consumo"),P!=null&&P.matches('[data-reparto-modo="pago"]')&&Tt(A,"pago")}),T(A,"[data-guardar-loan]",E=>{I(A,E.getAttribute("data-guardar-loan")||"")&&(x(),h())}))}function I(b,h){const S=D=>{var z;return((z=b.querySelector(D))==null?void 0:z.value)??""},A=D=>{var z;return!!((z=b.querySelector(D))!=null&&z.checked)},E=S("#f-nombre").trim(),P=parseFloat(S("#f-capital")),M=parseFloat(S("#f-tin")),F=parseInt(S("#f-meses"),10);if(!E||!Number.isFinite(P)||!Number.isFinite(M)||!Number.isFinite(F))return j("Completa los campos obligatorios","err"),!1;const q={nombre:E,capital:P,tin:M,meses:F,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:to(b),cuenta:S("#f-cuenta"),simulacion:A("#f-sim"),activo:A("#f-activo"),mostrarFechaFinEnDashboard:A("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:A("#f-basico"),tags:S("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:zt(b,"consumo"),repartoPago:zt(b,"pago")};return h?(t.store.updateItem("loans",h,q),j("Préstamo actualizado")):(t.store.addItem("loans",{...q,amortizaciones:[]}),j("Préstamo creado")),s(),!0}function w(b,h,S){const A=t.store.get("loans").find(M=>M._id===b);if(!A)return;const E=h?(A.amortizaciones||[]).find(M=>M._id===h)??null:null,P=C(h?"Editar amortización":"Añadir amortización",Hs(b,E,a()));P&&T(P,"[data-guardar-amort]",M=>{const[F,q]=(M.getAttribute("data-guardar-amort")||"").split("|");$(P,F,q)&&(x(),S([F]))})}function $(b,h,S){var z;const A=R=>{var O;return((O=b.querySelector(R))==null?void 0:O.value)??""},E=A("#am-fecha"),P=parseFloat(A("#am-cant"));if(!E||!Number.isFinite(P)||P<=0)return j("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(R=>R._id===h);if(!M)return!1;const F={fecha:E,cantidad:P,tipo:A("#am-tipo"),simulacion:!!((z=b.querySelector("#am-sim"))!=null&&z.checked)},q=M.amortizaciones||[],D=S?q.map(R=>R._id===S?{...R,...F}:R):[...q,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",h,{amortizaciones:D}),j(S?"Amortización actualizada":"Amortización añadida"),s(),!0}function y(b,h){T(b,"[data-toggle-finalizados]",()=>{e=!e,h()}),T(b,"[data-persona-tab]",S=>{n=S.getAttribute("data-persona-tab")||null,h()}),T(b,"[data-nuevo-loan]",()=>p(null,h)),T(b,"[data-toggle-loan]",(S,A)=>{var F;if((F=A.target)!=null&&F.closest("button"))return;const E=S.getAttribute("data-toggle-loan"),P=[...b.querySelectorAll("[data-body-loan]")].find(q=>q.dataset.bodyLoan===E);(P==null?void 0:P.classList.toggle("open"))?o.add(E):o.delete(E)}),T(b,"[data-editar-loan]",S=>p(S.getAttribute("data-editar-loan"),h)),T(b,"[data-borrar-loan]",S=>{if(!et("¿Eliminar préstamo?"))return;const A=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",A),o.delete(A),j("Eliminado"),s(),h()}),T(b,"[data-amort-loan]",S=>{const A=S.getAttribute("data-amort-loan");o.add(A),w(A,null,h)}),T(b,"[data-editar-amort]",S=>{const[A,E]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(A),w(A,E,h)}),T(b,"[data-borrar-amort]",S=>{const[A,E]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(M=>M._id===A);P&&(t.store.updateItem("loans",A,{amortizaciones:(P.amortizaciones||[]).filter(M=>M._id!==E)}),j("Amortización eliminada"),s(),h([A]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Gs,mount(b){const h=(S=[])=>{for(const A of S)o.add(A);l(b)};l(b),b.dataset.wired!=="1"&&(y(b,h),b.dataset.wired="1")}}}const je=6.35;function jt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function oo(t){return Math.max(0,(t.bruto||0)-jt(t))}function Us(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Ys(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+jt(r),0),o=Math.max(0,a-e),n=gt(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(oo(i)/o):0);return s}function no(t,a,e){if(t.irpfModo==="manual")return oo(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return rt(gt(t.bruto||0,jt(t)),e);const o=Us(a.filter(i=>i.irpfModo!=="manual")),n=Ys(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return rt(s+r,e)-rt(s,e);s+=r}return rt(gt(t.bruto||0,jt(t)),e)}function Ws(t,a){return t.reduce((e,o)=>e+no(o,t,a),0)}function Ks(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function Js(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+jt(s),0);return Ks(gt(e,o),a)}function Qs(t,a,e){const o=t.bruto||0,n=jt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??je,c=s*(r/100),u=no(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-c-u)/i}}function Xs(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const Zs={transporte:125,restaurante:220,otros:null},ti={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},ei=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],qt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ai=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function oi(t,a){const e=t.map((s,i)=>{const r=a.find(v=>v._id===s.cuenta),c=Zs[s.tipo],u=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(ti[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(_(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(_(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function ni(t,a){const e=a.hoy??U(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${qt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${qt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${ai(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${qt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${qt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${qt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${ei.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(s)} (${i+1})</option>`).join("")}
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
          ${qt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??je).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Dt("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${Dt("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function so(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",je),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:zt(t,"consumo"),repartoPago:zt(t,"pago")}}function si(t,a,e,o){const n=so(t,a),s=a.reduce((p,I)=>p+(I.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):rt(gt(n.bruto,s),e.tramos),u=i-r-c,v=i/n.nPagas,d=r/n.nPagas,l=c/n.nPagas,f=v-d-l,g=n.grupoNomina?e.nominas.filter(p=>p.grupoNomina===n.grupoNomina&&p._id!==o):[],x=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(n.grupoNomina)}" con ${m(g.map(p=>p.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",C=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(_(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(_(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(_(n.bruto))}</span>
      ${C}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(_(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(_(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(_(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(_(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(_(f))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${m(_(f))}/paga`:`ingreso ${m(_(v))} − SS ${m(_(d))} − IRPF ${m(_(l))}`}${s>0?" + recargas flex":""}</span>
    </div>${x}`}function ii(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=oi(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=si(t,a,e,o))},i=()=>{var c,u;const r=(v,d)=>{const l=t.querySelector(v);l&&(l.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),G(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),G(t,'[data-reparto-modo="consumo"]',()=>Tt(t,"consumo")),G(t,'[data-reparto-modo="pago"]',()=>Tt(t,"pago")),T(t,"[data-flex-anadir]",()=>{var u,v,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",c=parseFloat(((v=t.querySelector("#fc-importe"))==null?void 0:v.value)??"")||0;if(!c)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),T(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const io=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function ri(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??xt;function r(l,f){const g=o(),x=n();return!g||!x?null:(x.innerHTML=`<div class="modal-title">${m(l)}</div>${f}`,g.classList.remove("hidden"),T(x,"[data-cerrar]",s),x)}function c(){a=null;const l=[...t.store.get("tramosIRPFHistorico")].sort((x,C)=>x.año-C.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(io(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${l.map(x=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${x.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(io(x.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${x.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${x.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(T(g,"[data-editar-tabla]",x=>{const C=x.getAttribute("data-editar-tabla");d(C==="default"?"default":Number(C))}),T(g,"[data-borrar-tabla]",x=>{const C=Number(x.getAttribute("data-borrar-tabla"));et(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(p=>p.año!==C)),j(`Tabla ${C} eliminada`),t.onDatosCambiados(),c())}),T(g,"[data-anadir-anyo]",()=>{var p;const x=parseInt(((p=g.querySelector("#irpf-new-year"))==null?void 0:p.value)??"",10);if(!x||x<2e3||x>2100)return j("Año inválido","err");const C=t.store.get("tramosIRPFHistorico");if(C.some(I=>I.año===x))return j("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...C,{_id:Date.now().toString(36),año:x,tramos:i().map(I=>[...I])}]),t.onDatosCambiados(),d(x)}))}function u(){return e.map(([l,f],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function v(l){e=[...l.querySelectorAll("[data-tr-min]")].map((g,x)=>{const C=l.querySelector(`[data-tr-pct="${x}"]`);return[parseFloat(g.value)||0,parseFloat((C==null?void 0:C.value)??"")||0]})}function d(l){var I;a=l;const f=t.store.get("tramosIRPFHistorico");e=(l==="default"?i():((I=f.find(w=>w.año===l))==null?void 0:I.tramos)??i()).map(w=>[...w]);const x=l==="default"?"tabla por defecto":`ejercicio ${l}`,C=r(`Tramos IRPF — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(x)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!C)return;const p=()=>{const w=C.querySelector("#irpf-tramos-rows");w&&(w.innerHTML=u())};T(C,"[data-volver]",c),T(C,"[data-tr-anadir]",()=>{v(C),e.push([0,0]),p()}),T(C,"[data-tr-borrar]",w=>{v(C),e.splice(Number(w.getAttribute("data-tr-borrar")),1),p()}),T(C,"[data-tr-guardar]",()=>{v(C);const w=[...e].sort(($,y)=>$[0]-y[0]);if(w.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:w}),j("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===a?{...$,tramos:w}:$)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const ro=1500,St=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(n)}"/></div>`,ci=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${m(n)}"${n===o?" selected":""}>${m(s)}</option>`).join("")}
   </select></div>`,li=t=>(t.modeloFondo||"cuenta")==="pension";function di(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>ui(n,a,e,o)).join("")}</div>`}function ui(t,a,e,o){const n=he(t);if(!n)return"";const s=ye(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,v)=>u+v.cantidad,0),c=Math.min(r,ro)*(s/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>ro?"neg":""}">${m(_(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(_(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(n.proxDesbloqueo)}</div>`:""}
  </div>`}function pi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function mi(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${St("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${St("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${St("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${St("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${St("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${ci("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${St("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${St("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    </div>`}function fi(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=pi(a))};G(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function gi(t,a,e,o){var C;const n=p=>{var I;return((I=t.querySelector(p))==null?void 0:I.value)??""},s=(p,I=0)=>{const w=parseFloat(n(p));return Number.isFinite(w)?w:I},i=p=>{var I;return!!((I=t.querySelector(p))!=null&&I.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),u=n("#pen-grupo"),v={nombre:r,grupoNomina:u,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],l=[...(e==null?void 0:e.aportaciones)??[]],g=((C=[...d].sort((p,I)=>I.fecha.localeCompare(p.fecha))[0])==null?void 0:C.saldo)??(e==null?void 0:e.saldo)??null,x=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:x,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&l.push({_id:`${x}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:x,fecha:o,saldo:c,nota:"Saldo inicial"}),l.push({_id:`${x}a`,fecha:v.fechaInicialSaldo??o,cantidad:c})),{datos:{...v,historicoSaldos:d,aportaciones:l}}}const vi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function bi(t){const a=t.hoy??U,e=()=>{var I;return(I=t.onDatosCambiados)==null?void 0:I.call(t)};let o=null;function n(I){const w=I.filter(y=>y.activo);if(w.length<2)return"";const $=(y,b)=>`<button class="btn-secondary btn-sm" data-persona-tab="${y===null?"":m(y)}"
               style="${o===y?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(b)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${$(null,"Todas")}
      ${w.map(y=>$(y._id,y.nombre)).join("")}
    </div>`}function s(){const I=t.store.get("config");return Bt(t.store.get("tramosIRPFHistorico"),I.tramos_irpf??xt)(Number(a().slice(0,4)))}function i(I,w,$){const y=Qs(I,w,$),b=!!w&&I.irpfModo!=="manual",h=Te(I.repartoConsumo,I.repartoPago,t.store.get("personas")),S=[I.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${I.mesActualizacionIPC}">IPC m${I.mesActualizacionIPC}</span>`:"",y.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(_(y.flexAnual))}/año</span>`:"",Math.abs(y.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${y.ssPct.toFixed(2)}%</span>`:"",h?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(h)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(I.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${S}</div>
      </div>
      <div class="num">${m(_(y.brutoAnual))}
        ${y.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(_(y.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(_(y.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${y.nPagas} pagas</div>
      <div class="text-sm ${b?"neg":""}">${I.irpfModo==="manual"?`${m(I.irpfPct??0)}% (manual)`:`${y.irpfPct.toFixed(1)}% (auto)`}${b?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${I.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(I.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(I._id)}"${I.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(I._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(I._id)}">✕</button>
      </div>
    </div>`}const r=I=>{var w;return((w=t.store.get("accounts").find($=>$._id===(I||"default")))==null?void 0:w.nombre)??(I||"default")};function c(I,w,$){const y=w.reduce((S,A)=>S+(A.bruto||0),0),b=Ws(w,$),h=y>0?b/y*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(I)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(_(y))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${h.toFixed(1)}%</strong> (${m(_(b))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${w.map(S=>i(S,w,$)).join("")}
      </div>
    </div>`}function u(I){const w=s(),$=t.store.get("personas"),y=te($),b=[...t.store.get("nominas")].sort((M,F)=>(F.bruto||0)-(M.bruto||0)),h=o?b.filter(M=>ve(M.repartoConsumo,M.repartoPago,y).has(o)):b,{grupos:S,sueltas:A}=Xs(h),E=t.store.get("accounts").filter(li),P=b.filter(M=>M.activo!==!1);I.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${n($)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${h.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...S.entries()].map(([M,F])=>c(M,F,w)).join("")}
      ${A.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${A.map(M=>i(M,null,w)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${di(E,P,w,a())}</div>`}const v=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),l=()=>{var I;return(I=v())==null?void 0:I.classList.add("hidden")};function f(I,w){const $=v(),y=d();return!$||!y?null:(y.innerHTML=`<div class="modal-title">${m(I)}</div>${w}`,$.classList.remove("hidden"),T(y,"[data-cancelar]",l),y)}function g(I,w){const $=I?t.store.get("nominas").find(S=>S._id===I)??null:null,y=[...($==null?void 0:$.retribucionFlexible)??[]].map(S=>({...S})),b={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},h=f(I?"Editar nómina":"Nueva nómina",ni($,b));h&&(ii(h,y,b,I??""),T(h,"[data-guardar-nomina]",S=>{const A=so(h,y);if(!A.nombre||A.bruto<=0)return j("Nombre y bruto anual son obligatorios","err");const E=S.getAttribute("data-guardar-nomina")||"",P={...A,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,P),j("Nómina actualizada")):(t.store.addItem("nominas",P),j("Nómina creada")),e(),l(),w()}))}function x(I,w){const $=I?t.store.get("accounts").find(h=>h._id===I)??null:null,y=[...($==null?void 0:$.planAportaciones)??[]].map(h=>({...h})),b=f(I?"Editar plan de pensiones":"Nuevo plan de pensiones",mi($,{nominas:t.store.get("nominas"),hoy:a()}));b&&(fi(b,y,a()),T(b,"[data-guardar-pension]",h=>{const{datos:S,error:A}=gi(b,y,$,a());if(A)return j(A,"err");const E=h.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,S),j("Plan actualizado")):(t.store.addItem("accounts",S),j("Plan creado")),e(),l(),w()}))}function C(I,w,$){T(I,"[data-persona-tab]",y=>{o=y.getAttribute("data-persona-tab")||null,w()}),T(I,"[data-nueva-nomina]",()=>g(null,w)),T(I,"[data-editar-nom]",y=>g(y.getAttribute("data-editar-nom"),w)),T(I,"[data-borrar-nom]",y=>{et("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",y.getAttribute("data-borrar-nom")),j("Eliminada"),e(),w())}),G(I,"[data-activo-nom]",y=>{const b=y;t.store.updateItem("nominas",b.getAttribute("data-activo-nom"),{activo:b.checked}),e(),w()}),T(I,"[data-tramos]",()=>$.abrir()),T(I,"[data-nueva-pension]",()=>x(null,w)),T(I,"[data-editar-pension]",y=>x(y.getAttribute("data-editar-pension"),w)),T(I,"[data-borrar-pension]",y=>{et("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",y.getAttribute("data-borrar-pension")),j("Plan eliminado"),e(),w())})}let p=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:vi,mount(I){const w=()=>u(I);p??(p=ri({store:t.store,onDatosCambiados:()=>{e(),w()},año:()=>Number(a().slice(0,4))})),u(I),I.dataset.wired!=="1"&&(C(I,w,p),I.dataset.wired="1")}}}const hi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",yi="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",co={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},$i={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function xi(t,a){const e=t.filter(c=>c.activo&&st(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const u=ee(c,a);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function Ii(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(L(o).getTime()-L(e).getTime())/(30.44*864e5)),s=Rt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(mt(a.inflacion,e,o)-1),u=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(_(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(_(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(_(i))}</span>
    </div>${r}
  </div>`}function wi(t,a){const e=co[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(f=>(f.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:f,importe:g.importe}))),s=n.reduce((f,g)=>f+g.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,u=t.grupoNomina?a.nominas.filter(f=>(f.grupoNomina||"")===t.grupoNomina&&f.activo!==!1):n.slice(0,1).map(f=>f.nomina),v=Js(u,a.tramosIRPF),d=c*v/100,l=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${v}%`:`tipo marginal ${v}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(l)}">≈ ${m(_(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(v)}%)</span></span></div>`:""}
    ${n.length>0?n.map(f=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(f.nomina.nombre)}: ${m(_(f.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Ci(t){const a=he(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(_(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(_(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(_(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(_(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function Si(t,a){const e=ee(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=L(o.dashboardStart),i=L(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,v=c>0&&r>0?Math.max(0,c*Math.pow(1+u,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,l=Math.max(0,v-d),f=be(l,a.tramosGanancias),g=l>0?(f/l*100).toFixed(1):"0",x=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",C=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",p=(h,S,A)=>h.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${m(E.contraparte)}: ${m(E.concepto)}</span>
          <span class="num ${A}">${m(_(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),w=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${p(n.entradas,"↓","pos")}
         ${p(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(_(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(_(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(_(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=a.invModo(t._id),y=h=>`padding:3px 10px;border-radius:20px;border:1px solid ${h?"var(--accent)":"var(--border)"};background:${h?"var(--accent-dim)":"transparent"};color:${h?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,b=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(_(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(_(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(_(e.neto))}</div><div class="stat-sub">${m(C)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(_(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(_(v))}</div><div class="stat-sub">${m(x)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(_(v-f))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${y($==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${y($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${b}
      ${w}
    </div>`}function Ai(t,a){const e=[...t.historicoSaldos||[]].sort((c,u)=>u.fecha.localeCompare(c.fecha)),o=e[0],n=ft(t),s=st(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((co[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${yi}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${hi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(_(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(_(n))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ii(t,a)}
    ${s==="beneficio"?wi(t,a):""}
    ${s==="pension"?Ci(t):""}
    ${s==="inversion"?Si(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const Mi=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Ei(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function _i(t,a){const e=t?st(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${X("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Jt("ac-modelo","Tipo",Mi,e)}
    </div>
    <div class="grid-2 mt-8">
      ${X("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${X("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${X("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${X("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Jt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Jt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function Pi(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Ei(a))};G(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const u=t.querySelector(r);u&&(u.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Fi(t,a,e,o,n){const s=g=>{var x;return((x=t.querySelector(g))==null?void 0:x.value)??""},i=(g,x=0)=>{const C=parseFloat(s(g));return Number.isFinite(C)?C:x},r=g=>{var x;return!!((x=t.querySelector(g))!=null&&x.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",v=u==="beneficio",d=i("#ac-saldo"),l={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:u,planAportaciones:a,tipoBeneficio:v?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:v?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:l};if(!(o===null||Math.abs(d-o)>.005))return{datos:l};if(u==="inversion"&&d>(o??0)){const g=Date.now().toString(36);l.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?n:l.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:l,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function qe(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:W(a.saldoCts),nota:a.nota}))}function Di(t,a,e,o,n){const s=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${m(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${m(_(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${m(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${m(a)}|${m(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${m(a)}|${m(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${m(t)}</div>
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
    </div>`}const lo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Ti(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Lt;function r(l,f){const g=o(),x=n();return!g||!x?null:(x.innerHTML=`<div class="modal-title">${m(l)}</div>${f}`,g.classList.remove("hidden"),T(x,"[data-cerrar]",s),x)}function c(){a=null;const l=[...t.store.get("tramosGananciasCapitalHistorico")].sort((x,C)=>x.año-C.año),f="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(lo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${l.map(x=>`<div style="${f}">
              <span style="font-weight:600;font-size:13px">${x.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(lo(x.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${x.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${x.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(T(g,"[data-editar-tg]",x=>{const C=x.getAttribute("data-editar-tg");d(C==="default"?"default":Number(C))}),T(g,"[data-borrar-tg]",x=>{const C=Number(x.getAttribute("data-borrar-tg"));et(`¿Eliminar la tabla del ejercicio ${C}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(p=>p.año!==C)),j(`Tabla ${C} eliminada`),t.onDatosCambiados(),c())}),T(g,"[data-anadir-anyo-tg]",()=>{var p;const x=parseInt(((p=g.querySelector("#tg-new-year"))==null?void 0:p.value)??"",10);if(!x||x<2e3||x>2100)return j("Año inválido","err");const C=t.store.get("tramosGananciasCapitalHistorico");if(C.some(I=>I.año===x))return j("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...C,{_id:Date.now().toString(36),año:x,tramos:i().map(I=>[...I])}]),t.onDatosCambiados(),d(x)}))}function u(){return e.map(([l,f],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${f}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function v(l){e=[...l.querySelectorAll("[data-tg-min]")].map((f,g)=>{const x=l.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(f.value)||0,parseFloat((x==null?void 0:x.value)??"")||0]})}function d(l){var p;a=l;const f=t.store.get("tramosGananciasCapitalHistorico");e=(l==="default"?i():((p=f.find(I=>I.año===l))==null?void 0:p.tramos)??i()).map(I=>[...I]);const x=r(`Ganancias de capital — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!x)return;const C=()=>{const I=x.querySelector("#tg-rows");I&&(I.innerHTML=u())};T(x,"[data-volver-tg]",c),T(x,"[data-tg-anadir]",()=>{v(x),e.push([0,0]),C()}),T(x,"[data-tg-borrar]",I=>{v(x),e.splice(Number(I.getAttribute("data-tg-borrar")),1),C()}),T(x,"[data-tg-guardar]",()=>{v(x);const I=[...e].sort((w,$)=>w[0]-$[0]);if(I.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:I}),j("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(w=>w.año===a?{...w,tramos:I}:w)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const zi=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function ji(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${zi.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}const uo={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"};function qi(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Ni(t,5),periodoHasta:t,detalleAbierto:new Set}}function Ne(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ni(t,a){const[e,o]=t.split("-").map(Number),n=new Date(e,o-1-a,1);return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function po(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:Ne(e).desde,hasta:Ne(o).hasta}}function mo(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),n=a.get(o);n?n.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const n=new Set(o.map(s=>s.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((s,i)=>s.fecha.localeCompare(i.fecha)),total:o.reduce((s,i)=>s+i.importeCts,0),estimacionComun:n.size===1?n.values().next().value??null:null}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Ri(t,a){const{ledger:e}=t,o=(t.hoy??U)(),n=t.accounts().filter(h=>h.activo),s=a.vista==="agrupado",{desde:i,hasta:r}=s?po(a.periodoDesde,a.periodoHasta):Ne(a.mes),c={cuentaId:a.cuentaId||void 0,desde:i,hasta:r,texto:a.filtroTexto||void 0},u=e.transacciones(c),d=[...t.estimaciones().filter(h=>h.tipo!=="transferencia").map(h=>({_id:h._id,etiqueta:`${m(h.concepto)} (${m(_(h.cuantia))})`})),...t.loans().filter(h=>h.activo).map(h=>({_id:h._id,etiqueta:`Préstamo: ${m(h.nombre)}`})),...t.nominas().filter(h=>h.activo).map(h=>({_id:h._id,etiqueta:`Nómina: ${m(h.nombre)}`}))],l=u.filter(h=>h.tipo!=="transferencia"&&h.importeCts<0).reduce((h,S)=>h+S.importeCts,0),f=u.filter(h=>h.tipo!=="transferencia"&&h.importeCts>0).reduce((h,S)=>h+S.importeCts,0),g=a.cuentaId?e.saldoCuenta(a.cuentaId,r):e.saldoTotal(r),x=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),C=n.map(h=>`<option value="${m(h._id)}"${h._id===a.cuentaId?" selected":""}>${m(h.nombre)}</option>`).join(""),p=h=>'<option value="">— sin asignar —</option>'+d.map(S=>`<option value="${m(S._id)}"${S._id===h?" selected":""}>${S.etiqueta}</option>`).join(""),I=h=>Object.keys(uo).map(S=>`<option value="${S}"${S===h?" selected":""}>${uo[S]}</option>`).join(""),w=u.map(h=>{var S;return`
      <tr data-tx="${m(h._id)}" style="border-bottom:1px solid var(--border)${h.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(h.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(h.concepto)}</td>
        <td style="padding:7px 8px">${Ja(h.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(((S=t.accounts().find(A=>A._id===h.cuentaId))==null?void 0:S.nombre)??h.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(h._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${I(h.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(h._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${p(h.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${pt(W(h.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${m(h._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(h._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),y=(s?mo(u):[]).map(h=>{const S=a.detalleAbierto.has(h.concepto),A=S?h.movimientos.map(E=>{var P;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(E.fecha)}</span> · ${m(((P=t.accounts().find(M=>M._id===E.cuentaId))==null?void 0:P.nombre)??E.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(E._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${p(E.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${pt(W(E.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(h.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(h.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${S?"▾":"▸"}</button>
          <span style="font-size:13px">${m(h.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${h.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(h.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${h.movimientos.length} movimientos del grupo de golpe">${p(h.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${pt(W(h.total))}</td>
        <td></td>
      </tr>${A}`}).join(""),b=x.slice().reverse().slice(0,8).map(h=>{var S;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(h.fecha)}</span>
        <span style="color:var(--text3)">${m(((S=t.accounts().find(A=>A._id===h.cuentaId))==null?void 0:S.nombre)??h.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(_(W(h.saldoCts)))}</span>
        ${h.nota?`<span style="color:var(--text3)">${m(h.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(h._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${s?"":"background:var(--accent);color:#04120c;border-color:var(--accent)"}">Vista mensual</button>
            <button class="btn-secondary btn-sm" data-acc-vista="agrupado" style="${s?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Agrupa los gastos que se repiten con el mismo concepto en un periodo, para asignarles la estimación de golpe">Agrupar por concepto</button>
          </div>
        </div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${C}</select>
          </div>
          ${s?`<div class="form-group" style="margin:0">
                   <label class="form-label">Desde</label>
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${m(a.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${m(a.periodoHasta)}" style="width:140px"/>
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
          <span>Gastos: ${pt(W(l))}</span>
          <span>Ingresos: ${pt(W(f))}</span>
          <span>Neto: ${pt(W(f+l))}</span>
          <span style="margin-left:auto">Saldo a ${m(r)}: <strong>${m(_(g))}</strong></span>
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
                     ${y||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
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
                     ${w||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>`}
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${C}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(h=>`<option value="${m(h)}"></option>`).join("")}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${p(null)}</select>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${C}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${b?`<div class="mt-12">${b}</div>`:""}
        </div>
      </div>
    </div>`}function Li(t,a,e,o){const{ledger:n}=a;G(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),G(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()}),T(t,"[data-acc-vista]",i=>{e.vista=i.getAttribute("data-acc-vista")||"mensual",o()}),G(t,"#acc-periodo-desde",i=>{e.periodoDesde=i.value||e.periodoDesde,o()}),G(t,"#acc-periodo-hasta",i=>{e.periodoHasta=i.value||e.periodoHasta,o()}),T(t,"[data-grp-detalle]",i=>{const r=i.getAttribute("data-grp-detalle");e.detalleAbierto.has(r)?e.detalleAbierto.delete(r):e.detalleAbierto.add(r),o()}),G(t,"[data-grp-estimacion]",i=>{const r=i.getAttribute("data-grp-estimacion"),c=i.value||null,{desde:u,hasta:v}=po(e.periodoDesde,e.periodoHasta),d=n.transacciones({cuentaId:e.cuentaId||void 0,desde:u,hasta:v,texto:e.filtroTexto||void 0}),l=mo(d).find(f=>f.concepto===r);if(l){for(const f of l.movimientos)n.asignarEstimacion(f._id,c);j(`Estimación asignada a ${l.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),T(t,"#nt-guardar",()=>{const i=it(t,"#nt-concepto").trim(),r=Qa(t,"#nt-importe");if(!i)return j("Indica un concepto","err");if(!(r>0))return j("Indica un importe mayor que cero","err");const c=it(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:it(t,"#nt-fecha")||(a.hoy??U)(),cuentaId:it(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:it(t,"#nt-tipo"),estimacionId:it(t,"#nt-estimacion")||null}),j("Movimiento registrado"),a.onDatosCambiados(),o()}),T(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;et("¿Eliminar este movimiento?")&&(n.eliminar(r),j("Movimiento eliminado"),a.onDatosCambiados(),o())}),T(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(d=>d._id===r);if(!c)return;const u=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(W(c.importeCts))));if(u===null)return;const v=parseFloat(u.replace(",","."));if(!Number.isFinite(v)||v<=0)return j("Importe no válido","err");n.actualizar(r,{importe:v}),j("Movimiento actualizado"),a.onDatosCambiados(),o()}),G(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),j("Asignación actualizada"),a.onDatosCambiados()}),G(t,"[data-tx-tipo]",i=>{const r=i.getAttribute("data-tx-tipo");n.actualizar(r,{tipo:i.value}),j("Tipo actualizado"),a.onDatosCambiados(),o()}),T(t,"#pc-guardar",()=>{if(it(t,"#pc-saldo").trim()==="")return j("Indica el saldo","err");const r=Qa(t,"#pc-saldo");n.registrarPuntoControl(it(t,"#pc-cuenta"),it(t,"#pc-fecha")||(a.hoy??U)(),r,it(t,"#pc-nota").trim()||void 0),j("Saldo real registrado"),a.onDatosCambiados(),o()}),T(t,"[data-pc-borrar]",i=>{et("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),j("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Re(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=Y(t.mediaRealReciente),i=Y(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:Y(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function Oi(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??U(),u=t.get("expenses"),v=u.find(g=>g._id===s);if(!v)throw new Error(`La estimación ${s} no existe`);const d={...v,fechaFin:c},l={...v,_id:a(),cuantia:Y(i),fechaInicio:c,fechaFin:v.fechaFin??null,ajustadaDesdeId:v._id,ajustadaEn:c},f=u.map(g=>g._id===s?d:g);return f.push(l),t.set("expenses",f),{estimacionCerrada:d,estimacionNueva:l}}function o(s,i={}){const r=[],c=[];for(const u of s)try{r.push(e(u.estimacionId,u.cuantiaSugerida,i))}catch(v){c.push({estimacionId:u.estimacionId,error:v.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(x=>[x._id,x])),c=r.get(s);if(!c)return[];const u=[];let v=c;const d=new Set;for(;v!=null&&v.ajustadaDesdeId&&!d.has(v._id);){d.add(v._id);const x=r.get(v.ajustadaDesdeId);if(!x)break;u.unshift(x),v=x}const l=[];let f=c;const g=new Set([c._id]);for(;;){const x=i.find(C=>C.ajustadaDesdeId===f._id&&!g.has(C._id));if(!x)break;g.add(x._id),l.push(x),f=x}return[...u,c,...l]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Le(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const n=e.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Re(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function ki(t){const a=Le(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:c,estimacion:u,sugerencia:v})=>{const d=c.meses.slice(-6).map(l=>`${Pe(l.mes)}: ${_(l.estimado)} → ${_(l.real)} (${l.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${m(u.concepto)}</div>
          <div style="margin-top:3px">${Ja(c.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${m(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(_(c.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${m(_(c.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${pt(c.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Ka(c.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${v?`<button class="btn-secondary" data-sugerir="${m(c.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${m(v.motivo)}">Sugerir ajuste → ${m(_(v.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${pt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Ka(c.precision)}</td>
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
    </div>`}function Bi(t,a,e){T(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Le(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${_(i.cuantiaActual)}
Nueva estimación: ${_(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;et(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),j(`Estimación ajustada a ${_(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),T(t,"#ajustar-todas",()=>{const o=Le(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${_(r.cuantiaActual)} → ${_(r.cuantiaSugerida)}`).join(`
`);if(!et(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});j(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Hi=[";",",","	","|"],Gi={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function re(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ce(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Vi(t){let a=";",e=-1;for(const o of Hi){const n=t.slice(0,20).map(c=>ce(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function Xt(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const v=s===","?o:n;i=a.slice(0,v).replace(/[.,]/g,""),r=a.slice(v+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(c);return Number.isFinite(u)?e?-u:u:null}function Oe(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return fo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),fo(o,Number(e[2]),Number(e[1]))}return null}function fo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function go(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Oe(e)!==null).length/a.length}function vo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Xt(e)!==null).length/a.length}function Ui(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=re(t[i]);if(r&&Gi[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&re(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=go(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||re(t[r]).includes("saldo"))continue;const c=vo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(vo(c)>.5||go(c)>.5)continue;const u=c.reduce((v,d)=>v+d.length,0)/Math.max(1,c.length);u>i&&(i=u,s=r)}s>=0&&(e.concepto=s)}return e}function Yi(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(v=>v.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Vi(a),o=a.map(v=>ce(v,e).length),n=Math.max(...o);let s=o.findIndex(v=>v===n);s<0&&(s=0);const i=ce(a[s],e);let r=a.slice(s+1).map(v=>ce(v,e));const c=Oe(i[0]??"")!==null||i.some(v=>Xt(v)!==null&&/\d/.test(v));c&&(r=[i,...r]);const u=Ui(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((v,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function bo(t,a,e){return`${t}|${a}|${re(e).replace(/\s+/g," ")}`}function Wi(t,a,e=[]){const o=new Set(e.map(s=>bo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?Oe(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let u=null;if(a.importe>=0)u=Xt(s[a.importe]??""),u===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const l=a.debe>=0?Xt(s[a.debe]??""):null,f=a.haber>=0?Xt(s[a.haber]??""):null;l===null&&f===null?r.push("sin importe en Debe ni en Haber"):l!==null&&l!==0?u=-Math.abs(l):f!==null&&f!==0?u=Math.abs(f):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const v=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&u!==null){const l=bo(c,u,v);d=o.has(l)||n.has(l),n.add(l)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:v,importeCts:u,errores:r,duplicada:d}})}function Ki(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function le(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Ji=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ke(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Wi(a.analisis,a.mapeo,e)}function Qi(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
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

      ${a.analisis&&a.mapeo?Zi(a,a.analisis,a.mapeo):Xi()}
    </div>`}function Xi(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Zi(t,a,e){const o=Ki(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,u)=>`<option value="${u}"${u===r?" selected":""}>${m(c||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Ji.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${pt(W(o.sumaCts))}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,u=c?r.errores[0]:r.duplicada?"repetido":"se importa",v=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(_(W(r.importeCts)))}</td>
                <td style="font-size:11px;color:${v}">${m(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function tr(t,a,e,o){T(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,le(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),T(t,"[data-imp-cerrar]",()=>{Object.assign(e,le()),o()}),G(t,"#imp-cuenta",s=>{e.cuentaId=s.value,ke(a,e),o()}),G(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),G(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),ke(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&er(s).then(r=>{const c=Yi(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},ke(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),T(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(c=>c.errores.length===0&&(e.incluirDuplicadas||!c.duplicada));if(s.length===0)return;for(const c of s)a.ledger.registrar({fecha:c.fecha,cuentaId:e.cuentaId,importe:Math.abs(W(c.importeCts)),tipo:c.importeCts<0?"gasto":"ingreso",concepto:c.concepto,origen:"importado"});const i=s.map(c=>c.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]);j(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,le()),a.onDatosCambiados(),o()})}function er(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function ar(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function or(t,a){const e=L(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function nr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function ho(t,a){const{inicio:e,fin:o}=nr(a);return Ot([t],{start:e,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function sr(t){function a(n,s={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=U()}=s,u=t.transacciones({estimacionId:n._id}),d=u.length===0&&((($=n.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:n.tags}):u,l=new Map;for(const y of d){const b=y.fecha.slice(0,7);l.set(b,(l.get(b)??0)+Math.abs(y.importeCts)/100)}const f=[];for(const y of or(c,i)){const b=l.get(y);if(b===void 0)continue;const h=Y(ho(n,y));f.push({mes:y,estimado:h,real:Y(b),desviacion:Y(b-h),precision:ar(h,b)})}const g=Y(f.reduce((y,b)=>y+b.estimado,0)),x=Y(f.reduce((y,b)=>y+b.real,0)),C=f.reduce((y,b)=>y+Math.abs(b.estimado),0),p=f.length===0?null:C>0?f.reduce((y,b)=>y+b.precision*Math.abs(b.estimado),0)/C:f.reduce((y,b)=>y+b.precision,0)/f.length,I=f.slice(-r),w=I.length>0?Y(I.reduce((y,b)=>y+b.real,0)/I.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:f,estimadoTotal:g,realTotal:x,desviacionTotal:Y(x-g),precision:p,mediaRealReciente:w,infraestimada:x>g}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:Y(r.estimado),realTotal:Y(r.real),desviacionTotal:Y(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function ir(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function rr(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function cr(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function lr(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const u=(c.tags??[]).filter(v=>s.tags.includes(v)).length;u!==0&&(u>r||u===r&&i&&c._id<i._id)&&(i=c,r=u)}i&&o.get(i._id).push(s)}return o}function dr(t,a,e,o={}){const{desde:n,hasta:s}=ir(e),i=t.transacciones({desde:n,hasta:s}),r=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts<0),c=i.filter(w=>w.tipo!=="transferencia"&&w.importeCts>0),u=a.filter(w=>w.tipo==="gasto"&&w.activo!==!1),v=new Map((o.analisis??[]).map(w=>[w.estimacionId,w])),d=new Set(u.filter(w=>t.transacciones({estimacionId:w._id}).length>0).map(w=>w._id)),l=lr(r,u,w=>d.has(w)),f=new Set,g=u.map(w=>{const $=l.get(w._id)??[];for(const S of $)f.add(S._id);const y=Y($.reduce((S,A)=>S+Math.abs(A.importeCts)/100,0)),b=Y(ho(w,e)),h=v.get(w._id);return{estimacionId:w._id,concepto:w.concepto,tags:w.tags??[],estimado:b,real:y,desviacion:Y(y-b),sinMovimiento:$.length===0,sugerencia:h?Re(h,w.cuantia,{hoy:o.hoy}):null}}),x=new Map;for(const w of r){if(f.has(w._id))continue;const $=cr(w.concepto),y=x.get($)??{concepto:w.concepto,total:0,movimientos:0};y.total=Y(y.total+Math.abs(w.importeCts)/100),y.movimientos+=1,x.set($,y)}const C=[...x.values()].sort((w,$)=>$.total-w.total),p=Y(g.reduce((w,$)=>w+$.estimado,0)),I=Y(r.reduce((w,$)=>w+Math.abs($.importeCts)/100,0));return{mes:e,estimado:p,real:I,desviacion:Y(I-p),ingresosReales:Y(c.reduce((w,$)=>w+$.importeCts/100,0)),filas:g.sort((w,$)=>Math.abs($.desviacion)-Math.abs(w.desviacion)),sinEstimacion:C,totalSinEstimacion:Y(C.reduce((w,$)=>w+$.total,0)),vacio:i.length===0}}function yo(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function ur(){return{mes:""}}function Be(t,a){if(a.mes)return a.mes;const e=yo(t.ledger),o=rr((t.hoy??U)());return e.includes(o)?o:e[0]??o}function He(t,a){const e=(t.hoy??U)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:e});return dr(t.ledger,o,a,{analisis:n,hoy:e})}function pr(t,a){const e=Be(t,a),o=yo(t.ledger);o.includes(e)||o.unshift(e);const n=He(t,e),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(c=>`<option value="${m(c)}"${c===e?" selected":""}>${m(Pe(c))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${m(Pe(e))}. Importa el extracto del banco o
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
          <div class="stat-value" style="font-size:1.15rem">${m(_(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${m(_(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${m(_(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(_(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${mr(n)}
      ${fr(n)}
    </div>`}function mr(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(_(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(_(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar la estimación de ${m(_(s.cuantiaActual))} a ${m(_(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${m(_(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function fr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${m(_(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function gr(t,a,e,o){G(t,"#cie-mes",n=>{e.mes=n.value,o()}),T(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=He(a,Be(a,e)).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??U)()}),j(`«${r.concepto}» ajustada a ${_(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),T(t,"[data-cie-ajustar-todas]",()=>{const s=He(a,Be(a,e)).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??U)()});j(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const vr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function br(t){const a=t.hoy??U,e=()=>{var D;return(D=t.onDatosCambiados)==null?void 0:D.call(t)},o=new Map;let n="cuentas";const s=qi(a().slice(0,7)),i=le(),r=ur(),c=()=>t.store.get("expenses"),u=()=>t.store.get("accounts"),v={ledger:t.ledger,accounts:u,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:u,onDatosCambiados:e},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},f={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},g=()=>t.store.get("config"),x=D=>{var z;return((z=t.store.get("accounts").find(R=>R._id===D))==null?void 0:z.nombre)??D},C=()=>Bt(t.store.get("tramosIRPFHistorico"),g().tramos_irpf??xt)(Number(a().slice(0,4))),p=()=>Bt(t.store.get("tramosGananciasCapitalHistorico"),g().tramosGananciasCapital??Lt),I=()=>p()(Number(a().slice(0,4)));function w(){const D=g(),z=t.store.get("accounts"),R=va({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:z,config:{dashboardStart:D.dashboardStart,dashboardEnd:D.dashboardEnd,fechaReferencia:D.dashboardStart},nominas:[],resolverTramosGanancias:p()}),O=new Map,N=k=>{let B=O.get(k);return B||(B={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},O.set(k,B)),B},H=(k,B)=>{const Q=`${B.sourceId}`,Z=k.find(We=>We.concepto===Q),at=Z??{concepto:Q,contraparte:"",total:0,ocurrencias:0};at.total+=Math.abs(B.cuantia),at.ocurrencias+=1,Z||k.push(at)};for(const k of R){if(!k.cuenta)continue;const B=N(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(B.totalAportaciones+=Math.abs(k.cuantia),H(B.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(B.totalReembolsos+=Math.abs(k.cuantia),H(B.salidas,k)):k.sourceType==="investment-tax"&&(B.retencion+=Math.abs(k.cuantia))}const K=t.store.get("expenses");for(const k of O.values())for(const[B,Q]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const Z of B){const at=K.find(We=>We._id===Z.concepto);Z.contraparte=x((at==null?void 0:at[Q])??"default"),Z.concepto=(at==null?void 0:at.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return O}function $(D){const z=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let R;if(n==="cuentas"){const H=t.store.get("accounts").filter(B=>st(B)!=="pension"),K=w(),k={config:g(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:C(),tramosGanancias:I(),flujos:B=>K.get(B)??$i,invModo:B=>o.get(B)??"proyeccion"};R=`${xi(H,k.tramosGanancias)}<div class="grid-3">${H.map(B=>Ai(B,k)).join("")}</div>`}else n==="movimientos"?R='<div id="acc-tx"></div>':n==="importar"?R='<div id="acc-import"></div>':R='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';D.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${z}
      </div>
      ${ji(n)}
      ${R}`;const O=()=>$(D);if(n==="movimientos"){const N=D.querySelector("#acc-tx");N.innerHTML=Ri(v,s),Li(N,v,s,O)}else if(n==="importar"){const N=D.querySelector("#acc-import");N.innerHTML=Qi(d,i),tr(N,d,i,O)}else if(n==="cierre"){const N=D.querySelector("#acc-cierre"),H=D.querySelector("#acc-precision");N.innerHTML=pr(l,r),H.innerHTML=ki(f),gr(N,l,r,O),Bi(H,f,O)}}const y=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),h=()=>{var D;return(D=y())==null?void 0:D.classList.add("hidden")};function S(D,z){const R=y(),O=b();return!R||!O?null:(O.innerHTML=D?`<div class="modal-title">${m(D)}</div>${z}`:z,R.classList.remove("hidden"),T(O,"[data-cancelar]",h),O)}function A(D,z){const R=D?t.store.get("accounts").find(K=>K._id===D)??null:null,O=[...(R==null?void 0:R.planAportaciones)??[]].map(K=>({...K})),N=R?E(R):null,H=S(D?"Editar cuenta / fondo":"Nueva cuenta / fondo",_i(R,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));H&&(Pi(H,O,a()),T(H,"[data-guardar-acc]",K=>{const k=K.getAttribute("data-guardar-acc")||"",{datos:B,punto:Q,error:Z}=Fi(H,O,R,N,a());if(Z)return j(Z,"err");let at=k;k?t.store.updateItem("accounts",k,B):at=t.store.addItem("accounts",B)._id,Q&&t.ledger.registrarPuntoControl(at,Q.fecha,Q.saldo,Q.nota),j(k?"Actualizada":"Cuenta / fondo creado"),e(),h(),z()}))}function E(D){const z=t.ledger.puntosControl(D._id);return z.length>0?qe(z)[0].saldo:D.saldo??null}function P(D,z){const R=t.store.get("accounts").find(H=>H._id===D);if(!R)return;const O=S("Histórico de saldos",Di(R.nombre,D,qe(t.ledger.puntosControl(D)),R.saldoInicial||0,a()));if(!O)return;const N=()=>{z(),P(D,z)};T(O,"[data-hist-anadir]",()=>{var B,Q,Z;const H=((B=O.querySelector("#hi-fecha"))==null?void 0:B.value)??"",K=parseFloat(((Q=O.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),k=((Z=O.querySelector("#hi-nota"))==null?void 0:Z.value.trim())??"";if(!H||!Number.isFinite(K))return j("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(D,H,K,k||void 0),j("Punto añadido"),e(),N()}),T(O,"[data-hist-borrar]",H=>{const[,K]=(H.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(K),j("Eliminado"),e(),N()}),T(O,"[data-hist-inicial]",H=>{const[K,k]=(H.getAttribute("data-hist-inicial")||"").split("|"),B=t.ledger.puntosControl(K).find(Z=>Z._id===k);if(!B)return;const Q=qe([B])[0].saldo;t.store.updateItem("accounts",K,{saldoInicial:Q,fechaInicialSaldo:B.fecha}),j(`Punto inicial → ${B.fecha} (${_(Q)})`),e(),N()})}function M(D){const z=t.store.get("accounts").filter(N=>N.activo);if(z.length===0)return j("No hay cuentas activas","err");const R=a(),O=z.map(N=>`• ${N.nombre}: ${_(E(N)??N.saldoInicial??0)}`).join(`
`);if(et(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${R})?

${O}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of z)t.store.updateItem("accounts",N._id,{saldoInicial:E(N)??N.saldoInicial??0,fechaInicialSaldo:R});j("Saldo base actualizado"),e(),D()}}function F(D,z,R){T(D,"[data-cuentas-tab]",O=>{n=O.getAttribute("data-cuentas-tab")||"cuentas",z()}),T(D,"[data-nueva-acc]",()=>A(null,z)),T(D,"[data-editar-acc]",O=>A(O.getAttribute("data-editar-acc"),z)),T(D,"[data-tramos-ganancias]",()=>R.abrir()),T(D,"[data-reset-base]",()=>M(z)),T(D,"[data-hist-acc]",O=>P(O.getAttribute("data-hist-acc"),z)),T(D,"[data-principal-acc]",O=>{const N=O.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(H=>({...H,esCuentaPrincipal:H._id===N}))),j("Cuenta marcada como principal"),e(),z()}),T(D,"[data-borrar-acc]",O=>{const N=O.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return j("Debe existir al menos una cuenta","err");if(!et("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const K=t.store.get("accounts");K.length>0&&!K.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",K.map((k,B)=>B===0?{...k,esCuentaPrincipal:!0}:k)),j("Cuenta eliminada"),e(),z()}),T(D,"[data-inv-modo]",O=>{const[N,H]=(O.getAttribute("data-inv-modo")||"").split("|");o.set(N,H==="real"?"real":"proyeccion"),z()})}let q=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:vr,mount(D){const z=()=>$(D);q??(q=Ti({store:t.store,onDatosCambiados:()=>{e(),z()},año:()=>Number(a().slice(0,4))})),$(D),D.dataset.wired!=="1"&&(F(D,z,q),D.dataset.wired="1")}}}function $o(t,a,e=!1){const o=Math.abs(nt(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function hr(t){function a($){return`${$}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e($={}){var b;const y=(b=$.texto)==null?void 0:b.trim().toLowerCase();return t.get("transacciones").filter(h=>!($.cuentaId&&h.cuentaId!==$.cuentaId||$.desde&&h.fecha<$.desde||$.hasta&&h.fecha>$.hasta||$.tipo&&h.tipo!==$.tipo||$.estimacionId&&h.estimacionId!==$.estimacionId||$.tags&&$.tags.length>0&&!$.tags.some(S=>h.tags.includes(S))||y&&!h.concepto.toLowerCase().includes(y))).sort((h,S)=>h.fecha.localeCompare(S.fecha)||h._id.localeCompare(S._id))}function o($){const y={_id:a("tx"),fecha:$.fecha,cuentaId:$.cuentaId,importeCts:$o($.tipo,$.importe,$.negativo),concepto:$.concepto,tags:$.tags??[],estimacionId:$.estimacionId??null,tipo:$.tipo,origen:$.origen??"manual",...$.nota?{nota:$.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),y]),y}function n($,y){t.set("transacciones",t.get("transacciones").map(b=>{if(b._id!==$)return b;const{importe:h,...S}=y,A={...b,...S};return h!==void 0&&(A.importeCts=$o(A.tipo,h,A.importeCts<0)),A}))}function s($){t.set("transacciones",t.get("transacciones").filter(y=>y._id!==$))}function i($,y){n($,{estimacionId:y})}function r($){return t.get("puntosControl").filter(y=>!$||y.cuentaId===$).sort((y,b)=>y.fecha.localeCompare(b.fecha))}function c($,y,b,h){const S={_id:a("pc"),fecha:y,cuentaId:$,saldoCts:nt(b),...h?{nota:h}:{}},A=t.get("puntosControl").filter(E=>!(E.cuentaId===$&&E.fecha===y));return t.set("puntosControl",[...A,S].sort((E,P)=>E.fecha.localeCompare(P.fecha))),d($),S}function u($){const y=t.get("puntosControl").find(b=>b._id===$);t.set("puntosControl",t.get("puntosControl").filter(b=>b._id!==$)),y&&d(y.cuentaId)}function v($,y,b){const h=A=>A.cuentaId===$&&A.fecha>=y&&A.fecha<=b,S=t.get("puntosControl").filter(h).length;return S===0?0:(t.set("puntosControl",t.get("puntosControl").filter(A=>!h(A))),d($),S)}function d($){const y=r($),b=t.get("accounts");b.some(h=>h._id===$)&&t.set("accounts",b.map(h=>h._id===$?{...h,historicoSaldos:y.map(S=>({_id:S._id,fecha:S.fecha,saldo:W(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:h))}function l($,y=U()){const b=r($).filter(E=>E.fecha<=y).pop(),h=b==null?void 0:b.fecha,S=(b==null?void 0:b.saldoCts)??0;return t.get("transacciones").filter(E=>E.cuentaId===$&&E.fecha<=y&&(h===void 0||E.fecha>h)).reduce((E,P)=>E+P.importeCts,S)}function f($,y){return W(l($,y))}function g($=U(),y){const b=y??t.get("accounts").filter(h=>h.activo).map(h=>h._id);return W(b.reduce((h,S)=>h+l(S,$),0))}function x(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function C(){const $=[...t.get("transacciones").map(y=>y.fecha),...t.get("puntosControl").map(y=>y.fecha)];return $.length>0?$.sort().pop()??null:null}function p($={}){return W(e($).reduce((y,b)=>y+b.importeCts,0))}function I($={}){const y=new Map;for(const b of e($)){const h=b.fecha.slice(0,7);y.set(h,(y.get(h)??0)+b.importeCts)}return new Map([...y.entries()].sort(([b],[h])=>b.localeCompare(h)).map(([b,h])=>[b,W(h)]))}function w($={}){const y=new Map;for(const b of e($))for(const h of b.tags.length>0?b.tags:["sin_tag"])y.set(h,(y.get(h)??0)+b.importeCts);return new Map([...y.entries()].map(([b,h])=>[b,W(h)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:c,eliminarPuntoControl:u,eliminarPuntosControlEnRango:v,saldoCuenta:f,saldoCuentaCts:l,saldoTotal:g,tieneDatos:x,ultimaFecha:C,total:p,totalPorMes:I,totalPorTag:w}}function dt(t){return t.trim().toLowerCase()}function yr(t){function a(){const u=new Map,v=(d,l)=>{const f=dt(d);if(!f)return;const g=u.get(f)??{tag:f,estimaciones:0,reales:0,total:0};g[l]+=1,g.total+=1,u.set(f,g)};for(const d of t.get("expenses"))for(const l of d.tags??[])v(l,"estimaciones");for(const d of t.get("transacciones"))for(const l of d.tags??[])v(l,"reales");return[...u.values()].sort((d,l)=>l.total-d.total||d.tag.localeCompare(l.tag))}function e(){return a().map(u=>u.tag)}function o(u){return a().filter(v=>u==="estimaciones"?v.reales===0:v.estimaciones===0).map(v=>v.tag)}function n(u,v,d){const l=dt(v),f=(u??[]).map(dt);if(!f.includes(l))return u??[];const g=f.filter(x=>x!==l);return d===null?[...new Set(g)]:[...new Set([...g,dt(d)])]}function s(u,v){const d=dt(v);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(u,d)}function i(u,v){let d=0;for(const l of u)dt(l)!==dt(v)&&(d+=c(l,dt(v)).cambiados);return{cambiados:d}}function r(u){return c(u,null)}function c(u,v){let d=0;const l=t.get("expenses").map(h=>{const S=n(h.tags,u,v);return S!==h.tags&&(d+=1),S===h.tags?h:{...h,tags:S}});t.set("expenses",l);const f=t.get("transacciones").map(h=>{const S=n(h.tags,u,v);return S!==h.tags&&(d+=1),S===h.tags?h:{...h,tags:S}});t.set("transacciones",f);const g=t.get("loans").map(h=>{const S=n(h.tags,u,v);return S!==h.tags&&(d+=1),S===h.tags?h:{...h,tags:S}});t.set("loans",g);const x=t.get("nominas").map(h=>{const S=n(h.tags,u,v);return S!==h.tags&&(d+=1),S===h.tags?h:{...h,tags:S}});t.set("nominas",x);const C=t.get("config"),p=dt(u),I=h=>{const S=(h??[]).map(dt);if(!S.includes(p))return h??[];const A=S.filter(E=>E!==p);return v===null?[...new Set(A)]:[...new Set([...A,v])]},w={},$=I(C.activeTagsFilter),y=I(C.tagCategorias),b=I(C.tagGrupos);return $!==C.activeTagsFilter&&(w.activeTagsFilter=$),y!==C.tagCategorias&&(w.tagCategorias=y),b!==C.tagGrupos&&(w.tagGrupos=b),Object.keys(w).length>0&&t.patchConfig(w),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const $r=3;function xo(t){return t<.005?0:t}function xr(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function Ir(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<$r)continue;const r=xr(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:xo(n),sigmaDeriva:xo(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Io(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:Y(e*Math.hypot(n,s))}function wr(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,u]=r.fecha.slice(0,7).split("-").map(Number),v=Math.max(0,(c-s)*12+(u-i)),d=Io(a.sigmaMensual,v,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:Y(r.saldoAcum+d),abajo:Y(r.saldoAcum-d)}})}function Cr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const Ge="financeapp_session",Sr=["local","dropbox","firebase"];function Ar(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Sr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Mr({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(f){const g=n();if(g)try{f?g.setItem(Ge,JSON.stringify(f)):g.removeItem(Ge)}catch{}}function i(){const f=n();if(!f)return null;try{return Ar(f.getItem(Ge))}catch{return null}}function r(){const f=i();return f?(e()-f.ultimoUso)/6e4:null}function c(){const f=a();if(!Number.isFinite(f)||f<=0||o())return!1;const g=r();return g!==null&&g>=f}function u(){const f=i();return f?c()?(s(null),null):f:null}function v(f){const g=e(),x={modo:f.modo,...f.email?{email:f.email}:{},...f.passphrase?{passphrase:f.passphrase}:{},creadaEn:g,ultimoUso:g};return s(x),x}function d(){const f=i();f&&s({...f,ultimoUso:e()})}function l(){s(null)}return{abrir:v,leer:u,tocar:d,cerrar:l,caducada:c,inactividadMinutos:r,get activa(){return u()!==null}}}const wo=["pointerdown","keydown","visibilitychange"];function Er({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const v of wo)s==null||s.addEventListener(v,r);const c=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),a())},e);function u(){if(i){i=!1,n(c);for(const v of wo)s==null||s.removeEventListener(v,r)}}return u}const _r=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Pr="FinanceApp",Fr=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Co(t){return new Uint8Array(new ArrayBuffer(t))}const Ve="financeapp_bio_credencial",Ue="financeapp_bio_secreto",Ye="financeapp_bio_ultimo_desbloqueo",So="financeapp_bio_gracia_min",Dr=5;function Tr(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function de(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ue(t){const a=atob(t),e=Co(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function zr(t){return de(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function jr(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ue(a)}function Ao(t){return t.getClientExtensionResults()}function qr(t={}){const a=t.webauthn??Tr(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(y=>crypto.getRandomValues(Co(y)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const y=o==null?void 0:o.getItem(Ve);if(!y)return null;try{const b=JSON.parse(y);return typeof b.credencialId!="string"||typeof b.salt!="string"?null:b}catch{return null}}function u(){return c()!==null}async function v(y){const b=await e.importKey("raw",y,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Fr},b,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(y,b){const h=s(12),S=await e.encrypt({name:"AES-GCM",iv:h},y,new TextEncoder().encode(b));return`${de(h)}:${de(S)}`}async function l(y,b){const[h,S]=b.split(":"),A=ue(h),E=ue(S),P=await e.decrypt({name:"AES-GCM",iv:A},y,E);return new TextDecoder().decode(P)}async function f(y,b){var R,O;if(!y)throw new Error("No hay clave de cifrado que envolver.");const h=s(32),S=s(32),A=s(16),E=await a.create({publicKey:{challenge:S,rp:{name:Pr},user:{id:A,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:h}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const P=Ao(E);if(!((R=P.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((O=P.prf.results)==null?void 0:O.first)??null;if(M||(M=await g(E.rawId,h)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await v(M),q=await d(F,y),D={credencialId:zr(E.rawId),salt:de(h),modo:b,creadaEn:n()},z=i();z.setItem(Ve,JSON.stringify(D)),z.setItem(Ue,q)}async function g(y,b){var S,A;const h=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:y,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:b}}},timeout:6e4}});return h?((A=(S=Ao(h).prf)==null?void 0:S.results)==null?void 0:A.first)??null:null}async function x(){const y=c();if(!y)throw new Error("No hay huella configurada en este dispositivo.");const b=o==null?void 0:o.getItem(Ue);if(!b)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const h=await g(jr(y.credencialId).buffer,ue(y.salt));if(!h)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const S=await v(h),A=await l(S,b);return p(),A}function C(){o==null||o.removeItem(Ve),o==null||o.removeItem(Ue),o==null||o.removeItem(Ye)}function p(){o==null||o.setItem(Ye,String(n()))}function I(){const y=o==null?void 0:o.getItem(So);if(y==null)return Dr;const b=Number(y);return Number.isFinite(b)&&b>0?b:0}function w(y){o==null||o.setItem(So,String(Math.max(0,Math.floor(y)||0)))}function $(){if(!u())return!1;const y=I();if(y<=0)return!1;const b=o==null?void 0:o.getItem(Ye),h=b?Number(b):NaN;return Number.isFinite(h)?n()-h<y*6e4:!1}return{disponible:r,registrada:u,leerCredencial:c,registrar:f,desbloquear:x,olvidar:C,marcarDesbloqueo:p,dentroDeGracia:$,graciaMinutos:I,configurarGracia:w}}function Mo(){if(typeof localStorage<"u"){const b=qn();b.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${b.join(", ")}`)}const t=Yn(),a=t.activo(),e=Ut(a),o=qa(localStorage,e),n=kn({adapter:o}),s=Bn(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Ht})`),n.subscribe(b=>s.marcar(b));function r(){var h,S,A,E,P;const b=globalThis;(S=(h=b.FirebaseService)==null?void 0:h.isConnected)!=null&&S.call(h)&&((P=(E=(A=b.FirebaseService).uploadRegistroProyectos)==null?void 0:E.call(A))==null||P.catch(M=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",M instanceof Error?M.message:M)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(b=>b._id===a)??t.listar()[0],colecciones:It.filter(b=>b!=="config"),crear:b=>{const h=t.crear(b);return r(),h},renombrar:(b,h)=>{t.renombrar(b,h),r()},duplicar:(b,h)=>{const S=t.duplicar(b,h);return r(),S},eliminar:b=>{t.eliminar(b),r()},cambiarA:b=>t.establecerActivo(b),fusionarRemotos:b=>t.fusionarRemotos(b),importarDesde:(b,h)=>{const S=Wn(localStorage,b,h),A=Kn(S),E=[];for(const P of h){const M=A[P];if(!Array.isArray(M)||M.length===0)continue;const F=n.get(P);n.set(P,[...F,...M]),E.push(P)}return E.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:E}}},u=Qn(n),v=qr(),d=Mr({autoLogoutMinutos:()=>{var h,S;const b=(S=(h=globalThis.State)==null?void 0:h.get)==null?void 0:S.call(h,"config");return Number((b==null?void 0:b.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>v.dentroDeGracia()}),l=hr(n),f=yr(n),g=sr(l),x=Oi(n),C=ws({isEnabled:b=>u.isEnabled(b)}),p=gs({flags:u,rutasExtra:()=>C.flagPorRuta()}),I=es({flags:u,onChange:()=>{var b,h;C.attachToShell(),p.apply(),(h=(b=globalThis.Router)==null?void 0:b.rerender)==null||h.call(b)}}),w=ls({proyectos:c}),$=()=>{var h,S,A,E,P,M;const b=globalThis;if((S=(h=b.State)==null?void 0:h.load)==null||S.call(h),((E=(A=b.Router)==null?void 0:A.current)==null?void 0:E.call(A))==="dashboard")try{(M=(P=b.DashboardModule)==null?void 0:P.render)==null||M.call(P)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},y=fs({store:n,onDatosCambiados:$});return C.register(js({store:n,onDatosCambiados:$})),C.register(Vs({store:n,onDatosCambiados:$})),C.register(bi({store:n,onDatosCambiados:$})),C.register(br({store:n,ledger:l,tags:f,precision:g,adjuster:x,onDatosCambiados:$})),C.register(As({store:n,onDatosCambiados:$})),{version:Ht,core:No,engine:{generarExtracto:va,recomputarSaldoAcum:Oo,saldoHoy:ko,sumarPorTags:ba,providers:{proyectarGastos:Ot,proyectarPrestamos:ra,proyectarTransferencias:ca,proyectarNominas:pa,proyectarInteresesCuentas:da,proyectarAportaciones:la,proyectarRetencionesFiscales:ua,proyectarInflacionGastos:ma,proyectarPerdidaAhorro:fa},analysis:Vo,margins:Xo,avisos:an,dashboard:bn},store:n,flags:u,featureRegistry:{all:yt,porGrupo:Ba},ui:{openFeatures:I.open,openProyectos:w.open,openPersonas:y.open,applyGating:p.apply,watchGating:()=>p.observar(),instalarDeshacer:()=>bs({store:n,rerender:()=>{var h,S,A,E;const b=globalThis;(S=(h=b.State)==null?void 0:h.load)==null||S.call(h),(E=(A=b.Router)==null?void 0:A.rerender)==null||E.call(A)}}),avisoGuardado:null,instalarBuscador:()=>xs({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>C.routes(),navegar:b=>{var h,S;return(S=(h=globalThis.Router)==null?void 0:h.navigate)==null?void 0:S.call(h,b)}})},app:C,session:Object.assign(d,{vigilar:b=>Er({sesion:d,onCaducada:b}),opciones:_r}),biometria:v,cambios:s,datos:{colecciones:It,snapshot:()=>Na(o),aplicar:(b,{sellar:h=!0}={})=>{const A=Hn(h?(E,P)=>o.set(E,P):(E,P)=>{const M=globalThis.StorageAdapter;M!=null&&M.setRestaurando?M.setRestaurando(E,P):o.set(E,P)},b);return n.load(),s.marcar("copia-restaurada"),A},faltantes:b=>Gn(b),esVacioOPorDefecto:()=>Vn(Na(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:l,tags:f,precision:g,adjuster:x,sugerirAjuste:Re,medirVariabilidad:Ir,bandaDeConfianza:wr,bandaAcumulada:Io,describirBanda:Cr}}}function Nr(){try{const t=Mo();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const ot=typeof window<"u"?Nr():null;if(ot){let t=!1;const a=()=>{var e,o;if(ot.app.attachToShell(),ot.ui.applyGating(),!t){t=!0,ot.ui.watchGating(),ot.ui.instalarDeshacer(),ot.ui.instalarBuscador();const n=globalThis,s=()=>{var c,u,v,d;return(u=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&u.call(c)?n.FirebaseService:(d=(v=n.DropboxService)==null?void 0:v.isConnected)!=null&&d.call(v)?n.DropboxService:null};ot.ui.avisoGuardado=Is({cambios:ot.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=ot.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>ot.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>ot.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>ot.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return pe.bootstrap=Mo,Object.defineProperty(pe,Symbol.toStringTag,{value:"Module"}),pe}({});
//# sourceMappingURL=financeapp-core.js.map
