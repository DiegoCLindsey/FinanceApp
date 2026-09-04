var FinanceAppBundle=function(pe){"use strict";function G(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function L(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function V(){return G(new Date)}function me(t,a){return new Date(t,a+1,0).getDate()}function We(t,a,e){return G(new Date(t,a,Math.min(e,me(t,a))))}function Zt(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return G(new Date(t,a+1,0));const n=parseInt(o);if(!isNaN(n))return We(t,a,n)}if(e.startsWith("nthweekday:")){const o=e.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return G(r)}const i=new Date(t,a,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),G(i)}return null}function Ke(t,a){if(!a)return t;const e=L(t);return Zt(e.getFullYear(),e.getMonth(),a)??t}const Co=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],So={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function fe(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${So[e]||e+"º"} ${Co[o]} del mes`}return t}function Nt(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function nt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function W(t){return t/100}function U(t){return W(nt(t))}function E(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Je(t){return(t||0).toFixed(2)+"%"}function yt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function Qe(t,a,e,o=0){const n=yt(t,a,e),s=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-e))/i-s,v=n*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-u/v;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function Xe(t,a,e,o,n=0,s=[],i={}){const r=[];let c=t;const u=L(o),v=a/100/12;let d=e,l=yt(c,a,d);const m=[...s].sort((x,w)=>x.fecha.localeCompare(w.fecha));let f=0;for(let x=1;x<=e*2&&c>.01;x++){const w=new Date(u);u.setMonth(u.getMonth()+1);const p=Ke(G(w),i.diaPago||"");for(;f<m.length&&m[f].fecha<=p;){const I=m[f],$=I.cantidad*(n/100);if(c-=I.cantidad,c=Math.max(0,c),I.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*v/l)/Math.log(1+v)):(d=e-x+1,l=yt(c,a,d)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:$,capitalPendiente:c,esAmortizacion:!0,simulacion:I.simulacion||!1}),f++,c<.01)break}if(c<.01)break;const b=c*v,h=Math.min(l-b,c);if(c-=h,c<.01&&(c=0),r.push({mes:x,fecha:p,cuota:l,interes:b,amortizacion:h,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const Ze=new Map;function J(t){var w;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((p,b)=>`${p.fecha}|${p.cantidad}|${p.tipo||""}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo||""}`)).map(p=>`${p.fecha}:${p.cantidad}:${p.tipo||""}`).join(";")}`,o=Ze.get(e);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:u}=t,v=Xe(n,s,i,r,c||0,a,t),d=v.reduce((p,b)=>p+b.interes,0),l=v.reduce((p,b)=>p+b.comisionAmort,0),m=n*((u||0)/100),f=v.filter(p=>!p.esAmortizacion),x={cuota:yt(n,s,i),totalIntereses:d,tae:Qe(n,s,i,u||0),costoTotal:d+l+m,comAp:m,totalComAm:l,fechaFin:((w=f.slice(-1)[0])==null?void 0:w.fecha)||"",mesesReales:f.length,tabla:v};return Ze.set(e,x),x}function ta(t){const a=J(t),e=J({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,n=e.mesesReales-a.mesesReales,s=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function pt(t,a,e){if(!t||t.length===0)return 1;const o=L(a),n=L(e);if(n<=o)return 1;const s=[...t].sort((c,u)=>c.year-u.year);let i=1,r=new Date(o);for(;r<n;){const c=r.getFullYear(),u=s.filter(x=>x.year<=c),v=u.length>0?u[u.length-1]:s[0],d=(v?v.tasa:0)/100,l=new Date(c+1,0,1),m=l<n?l:n,f=Nt(r,m);i*=Math.pow(1+d,f/365.25),r=m}return i}function ea(t,a,e,o=0){const n=L(a),s=L(e);if(s<=n)return o;const i=Nt(n,s),r=t?[...t].sort((v,d)=>v.year-d.year):[];let c=0,u=new Date(n);for(;u<s;){const v=u.getFullYear(),d=new Date(v+1,0,1),l=d<s?d:s,m=Nt(u,l),f=r.filter(p=>p.year<=v),x=f.length>0?f[f.length-1]:null,w=x!==null?x.tasa:o;c+=w*m,u=l}return i>0?c/i:o}function aa(t,a){return((1+t/100)/(1+a/100)-1)*100}function Ao(t,a,e,o){const n=pt(a,e,o);return n>0?t/n:t}function Mo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,n=a.saludUmbralDTIVerde??30,s=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:u=0,cuotasHipoteca:v=0,gastosBasicos:d=0,gastosOtros:l=0,amortizaciones:m=0}=t,f=c-u-m-d-l,x=f,w=c>0?x/c*100:null,p=r?u-v:u,b=c>0?p/c*100:null,h=c>0?u/c*100:null,I=c>0?(d+u+m)/c*100:null,$=c>0?l/c*100:null,y=(S,A,_)=>S===null?"neutral":S>=A?"verde":S>=_?"amarillo":"rojo",C=(S,A,_)=>S===null?"neutral":S<=A?"verde":S<=_?"amarillo":"rojo";return{ingresos:c,cuotas:u,cuotasHipoteca:v,gastosBasicos:d,gastosOtros:l,amortizaciones:m,ahorroBruto:f,ahorroReal:x,tasaAhorro:w,dti:b,dtiTotal:h,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:$,semAhorro:y(w,e,o),semDTI:C(b,n,s),semNecesidades:C(I,i[0],i[0]+15),semDeseos:C($,i[1],i[1]+10),semAhorroRegla:y(w,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function st(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function mt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Rt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=e&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=a);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a);return n?n.saldo:0}}function Eo(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function _o(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function te(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Po(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),n=Math.floor(o/a),s=o-n*a;return Array.from({length:a},(i,r)=>e*(n+(r<s?1:0)))}function Fo(t,a,e,o){if(e===0)return{ids:t,cts:a};const n=t.indexOf(o);if(n>=0){const s=[...a];return s[n]+=e,{ids:t,cts:s}}return{ids:[...t,o],cts:[...a,e]}}function At(t,a,e){const o=nt(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:W(o)}];const n=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Po(o,n.length);return n.map((l,m)=>({personaId:l,importe:W(d[m])}))}const s=a.participantes.map(d=>{const l=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*l/100):nt(l)}),i=s.reduce((d,l)=>d+l,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,l=s.map(f=>Math.round(f*d)),m=l.reduce((f,x)=>f+x,0);return l.length>0&&(l[0]+=o-m),n.map((f,x)=>({personaId:f,importe:W(l[x])}))}const c=o-i,{ids:u,cts:v}=Fo(n,s,c,e);return u.map((d,l)=>({personaId:d,importe:W(v[l])}))}function ge(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Do(t,a,e){const o=te(e),n=new Map,s=i=>{let r=n.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},n.set(i,r)),r};for(const i of e)s(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=ge(a.expenses,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="loan"){const c=ge(a.loans,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoPago,o))s(u.personaId).pago+=u.importe;for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).consumo+=u.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=ge(a.nominas,i.sourceId);for(const u of At(r,c==null?void 0:c.repartoConsumo,o))s(u.personaId).ingresos+=u.importe}}}return[...n.values()]}function ve(t,a,e){const o=n=>!n||n.participantes.length===0?[e]:n.participantes.map(s=>s.personaId);return new Set([...o(t),...o(a)])}const $t=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function rt(t,a){const e=[...a].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=e.length-1;s>=0;s--){const[i,r]=e[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function oa(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,n=Math.min(2e3,e),s=Math.max(0,e-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function ft(t,a){return oa(t,a).baseImponible}function na(t,a){return rt(t,a)/12}const Lt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function be(t,a){if(!t||t<=0)return 0;const e=a||Lt;let o=0,n=t;for(let s=0;s<e.length;s++){const[i,r]=e[s],c=s<e.length-1?e[s+1][0]:1/0,u=Math.min(n,c-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function ee(t,a){if(st(t)!=="inversion")return null;const e=mt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,e-o),s=be(n,a);return{saldo:e,costBase:o,plusvalia:n,impuesto:s,neto:e-s}}function he(t,a=new Date){var l;if(st(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=mt(t),n=G(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),s=[...t.aportaciones||[]].sort((m,f)=>m.fecha.localeCompare(f.fecha));let i=0;const r=s.reduce((m,f)=>m+f.cantidad,0);for(const m of s)m.fecha<=n&&(i+=m.cantidad);const c=Math.max(0,o-r),u=r>0?i/r:0,v=Math.min(o,i+c*u),d=Math.max(0,o-v);return{saldo:o,disponible:v,bloqueado:d,costBase:r,beneficio:c,numAportaciones:s.length,proxDesbloqueo:((l=s.find(m=>m.fecha>n))==null?void 0:l.fecha)||null}}function sa(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(st(t)!=="pension"||!o)return 0;const n=mt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,v)=>u+v.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(a*r*o/100).toFixed(2)}function ye(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(a||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,v)=>u+(v.bruto||0)*(v.nPagas||12),0),i=[...e||[]].sort((u,v)=>u[0]-v[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[u,v]of i)if(s>=u)r=v;else break;return r}const To=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:Lt,TRAMOS_IRPF_DEFAULT:$t,agregarPorPersona:Do,ajustarFechaPago:Ke,ajustarPrecioReal:Ao,calcBaseImponibleTrabajo:ft,calcFactorInflacion:pt,calcFondoInversion:ee,calcFondosPension:he,calcGananciasCapital:be,calcIRPF:rt,calcImpuestoPension:sa,calcInflacionMediaAnual:ea,calcSaludFinanciera:Mo,calcTAE:Qe,calcTipoMarginalPension:ye,calcTipoRealFisher:aa,calcularReparto:At,clampedDate:We,cuotaMensual:yt,desgloseBaseTrabajo:oa,diasEntre:Nt,formatEUR:E,formatLocalDate:G,formatPct:Je,fromCents:W,haySimulaciones:_o,idPersonaPorDefecto:te,labelDiaPago:fe,lastDayOfMonth:me,modeloFondoDe:st,parseLocalDate:L,personasImplicadas:ve,resolverDiaEfectivo:Zt,resumenPrestamo:J,resumenPrestamoConAhorro:ta,retencionMensual:na,roundMoney:U,saldoEnFecha:Rt,saldoRealCuenta:mt,sinSimulaciones:Eo,tablaAmortizacion:Xe,toCents:nt,todayISO:V},Symbol.toStringTag,{value:"Module"}));function Ot(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=L(i.fechaInicio||a.start),c=i.fechaFin?L(i.fechaFin):s,u=i.cuantia,v=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=c&&v(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let l=r.getFullYear(),m=r.getMonth();const f=Math.ceil(240/d)+2;for(let x=0;x<f;x++){const w=Zt(l,m,i.diaPago||"")||(()=>{const b=r.getDate(),h=new Date(l,m+1,0).getDate();return G(new Date(l,m,Math.min(b,h)))})(),p=L(w);if(p>s||p>c)break;p>=n&&p>=r&&v(w),m+=d,m>=12&&(l+=Math.floor(m/12),m=m%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let l=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const m=Math.ceil((n.getTime()-r.getTime())/d);l=new Date(r.getTime()+m*d)}for(;l<=s&&l<=c;)v(G(l)),l=new Date(l.getTime()+d)}}return o}function ia(t,a,e=null){const o=[];for(const n of t){if(!n.activo||e&&e.length>0&&!e.includes(n.cuenta||"default"))continue;const{tabla:s}=J(n);for(const i of s)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function ra(t,a,e=null,o={accounts:[]}){const n=[],s=L(a.start),i=L(a.end),r=o.accounts||[],c=o.nominas||[],u=o.resolverTramosIRPF||(()=>$t),v=o.resolverTramosGanancias||(()=>Lt),d=l=>{var m;return((m=r.find(f=>f._id===l))==null?void 0:m.nombre)??l};for(const l of t){if(!l.activo||l.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(l.cuenta||"default")||e.includes(l.cuentaDestino||"default")))continue;const m=L(l.fechaInicio||a.start),f=l.fechaFin?L(l.fechaFin):i,x=w=>{const p=r.find(P=>P._id===(l.cuenta||"default")),b=r.find(P=>P._id===(l.cuentaDestino||"default")),h=st(p),I=st(b),$=h==="inversion"&&I==="inversion"||h==="pension"&&I==="pension",y=["transferencia",...$?["traspaso"]:[],...l.tags||[]],C=$?"traspaso-out":"transfer-out",S=$?"traspaso-in":"transfer-in",A=!e||e.length===0||e.includes(l.cuenta||"default"),_=!e||e.length===0||e.includes(l.cuentaDestino||"default");if(A&&n.push({fecha:w,concepto:`Transf. → ${d(l.cuentaDestino||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"gasto",tags:y,cuenta:l.cuenta||"default",sourceId:l._id,sourceType:C}),_&&n.push({fecha:w,concepto:`Transf. ← ${d(l.cuenta||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"ingreso",tags:y,cuenta:l.cuentaDestino||"default",sourceId:l._id,sourceType:S}),A&&!$&&p){if(h==="inversion"){const P=parseInt(w.slice(0,4)),M=ee(p,v(P));if(M&&M.saldo>0&&M.plusvalia>0){const F=Math.min(1,l.cuantia/M.saldo),D=M.plusvalia*F*.19;D>.01&&n.push({fecha:w,concepto:`Retención IRPF reembolso ${p.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"investment-tax"})}}else if(h==="pension"){const P=u(parseInt(w.slice(0,4))),M=ye(p,c,P),F=sa(p,l.cuantia,M||void 0);if(F>0){const q=p.grupoNomina?`IRPF rescate ${p.nombre} (tipo marginal grupo "${p.grupoNomina}": ${M}%)`:`Retención rescate ${p.nombre} (${p.impuestoRetirada}% s/beneficio)`;n.push({fecha:w,concepto:q,cuantia:F,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"pension-tax"})}}}};if(l.tipoFrecuencia==="extraordinario")m>=s&&m<=i&&m<=f&&x(l.fechaInicio);else if(l.tipoFrecuencia==="mensual"){const w=Math.max(1,l.frecuencia||1);let p=m.getFullYear(),b=m.getMonth();const h=Math.ceil(240/w)+2;for(let I=0;I<h;I++){const $=Zt(p,b,l.diaPago||"")||(()=>{const C=m.getDate(),S=new Date(p,b+1,0).getDate();return G(new Date(p,b,Math.min(C,S)))})(),y=L($);if(y>i||y>f)break;y>=s&&y>=m&&x($),b+=w,b>=12&&(p+=Math.floor(b/12),b=b%12)}}else if(l.tipoFrecuencia==="diaria"){const w=Math.max(1,l.frecuencia||1)*864e5;let p=new Date(Math.max(m.getTime(),s.getTime()));if(m<s){const b=Math.ceil((s.getTime()-m.getTime())/w);p=new Date(m.getTime()+b*w)}for(;p<=i&&p<=f;)x(G(p)),p=new Date(p.getTime()+w)}}return n}function ca(t,a,e=null){const o=[],n=L(a.start),s=L(a.end);for(const i of t){const r=st(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const u of c){if(!u.importe||u.importe<=0)continue;const v=L(u.fechaInicio||a.start),d=u.fechaFin?L(u.fechaFin):s,l=u.cuentaOrigen||"default",m=!e||!e.length||e.includes(l),f=!e||!e.length||e.includes(i._id),x=r==="pension"?"pension":"capital-mobiliario",w=$=>{m&&o.push({fecha:$,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",x],cuenta:l,sourceId:u._id,sourceType:"aportacion-out"}),f&&o.push({fecha:$,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",x],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},p={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let b=v.getFullYear(),h=v.getMonth();const I=Math.ceil(240/p)+2;for(let $=0;$<I;$++){const y=new Date(b,h+1,0).getDate(),C=G(new Date(b,h,Math.min(v.getDate(),y))),S=L(C);if(S>s||S>d)break;S>=n&&S>=v&&w(C),h+=p,h>=12&&(b+=Math.floor(h/12),h=h%12)}}}return o}function la(t,a,e=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||e&&e.length>0&&!e.includes(s._id))continue;const i=L(a.start),r=L(a.end),c=s.periodoCobro||"mensual",u=c==="mensual",v=u?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=u?1/12:v/(365.25*864e5);let l=Rt(s,a.start);const m=o.filter(w=>w.cuenta===s._id).map(w=>({fecha:w.fecha,delta:w.tipo==="ingreso"?Math.abs(w.cuantia):-Math.abs(w.cuantia)})).sort((w,p)=>w.fecha.localeCompare(p.fecha));let f=0,x=new Date(i);for(;x<=r;){const w=u?new Date(x.getFullYear(),x.getMonth()+1,x.getDate()):new Date(x.getTime()+v),p=new Date(Math.min(w.getTime(),r.getTime()+1)),b=G(p);let h=0;for(;f<m.length&&m[f].fecha<b;)h+=m[f].delta,f++;const I=l,$=l+h,y=Math.max(0,(I+$)/2);l=$;const C=u?d:(p.getTime()-x.getTime())/(365.25*864e5),S=y*(Math.pow(1+s.interes/100,C)-1);S>.001&&n.push({fecha:G(x),concepto:`Interés ${s.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),x=w}}return n}function da(t,a,e,o=null){const n=[],s=a||$t;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=na(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};n.push(...Ot([u],e,o))}return n}const zo=[5,11,2,8],jo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ua(t,a,e=null,o=[],n=()=>$t){const s=[],i=L(a.start),r=L(a.end),c=o.length>0,u={};for(const l of t){const m=l.grupoNomina||"";u[m]||(u[m]=[]),u[m].push(l)}for(const l of Object.keys(u))u[l].sort((m,f)=>(f.bruto||0)-(m.bruto||0));function v(l,m){if(!c||!l.mesActualizacionIPC)return l.bruto||0;const f=l.fechaInicio||a.start,x=L(f),w=L(m);let p=0;for(let h=x.getFullYear();h<=w.getFullYear();h++){const I=new Date(h,l.mesActualizacionIPC-1,1);I>x&&I<=w&&p++}if(p===0)return l.bruto||0;const b=G(new Date(x.getFullYear()+p,0,1));return(l.bruto||0)*pt(o,f,b)}function d(l,m){const f=v(l,m),x=(l.retribucionFlexible||[]).reduce((P,M)=>P+(M.importe||0)*12,0),w=Math.max(0,f-x);if(l.irpfModo==="manual")return w*((l.irpfPct||0)/100);const p=n(parseInt(m.slice(0,4))),b=l.grupoNomina||"";if(!b)return rt(ft(f,x),p);const h=u[b].filter(P=>P.activo),I=h.reduce((P,M)=>P+v(M,m),0),$=h.reduce((P,M)=>P+(M.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),0),y=Math.max(0,I-$),C=ft(I,$),S=Math.max(0,f-x),A=y>0?C*(S/y):0,_=h.filter(P=>P._id!==l._id&&(P.bruto||0)>(l.bruto||0)).reduce((P,M)=>{const F=(M.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),q=Math.max(0,v(M,m)-F);return P+(y>0?C*(q/y):0)},0);return rt(_+A,p)-rt(_,p)}for(const l of t){if(!l.activo)continue;const m=l.cuenta||"default";if(e&&e.length>0&&!e.includes(m))continue;const f=Math.max(1,l.nPagas||12),x=L(l.fechaInicio||a.start),w=l.fechaFin?L(l.fechaFin):r,p=b=>{const h=v(l,b),I=d(l,b),$=(l.retribucionFlexible||[]).reduce((F,q)=>F+(q.importe||0)*12,0),y=Math.max(0,h-$),C=(l.ssPct??6.35)/100,S=y*C,A=y/f,_=I/f,P=S/f,M=l.representacion==="simplificado"?A-P-_:A;s.push({fecha:b,concepto:l.nombre,cuantia:M,tipo:"ingreso",cuenta:m,tags:l.tags||[],sourceId:l._id,sourceType:"nomina"}),l.representacion==="detallado"&&(P>0&&s.push({fecha:b,concepto:`SS ${l.nombre}`,cuantia:P,tipo:"gasto",cuenta:m,tags:["seguridad-social","fiscal"],sourceId:l._id+"_ss",sourceType:"nomina"}),_>0&&s.push({fecha:b,concepto:`IRPF ${l.nombre}`,cuantia:_,tipo:"gasto",cuenta:m,tags:["irpf","fiscal"],sourceId:l._id+"_irpf",sourceType:"nomina"}));for(const F of l.retribucionFlexible||[])!F.cuenta||!(F.importe>0)||e&&e.length>0&&!e.includes(F.cuenta)||s.push({fecha:b,concepto:`${l.nombre} — ${jo[F.tipo]||F.tipo}`,cuantia:F.importe,tipo:"ingreso",cuenta:F.cuenta,tags:["retribucion-flexible",F.tipo],sourceId:`${l._id}_flex_${F._id||F.tipo}`,sourceType:"nomina"})};if(f<=12){const b=f===12?1:Math.round(12/f),h=x.getDate();let I=x.getFullYear(),$=x.getMonth();for(let y=0;y<300;y++){const C=new Date(I,$+1,0).getDate(),S=new Date(I,$,Math.min(h,C));if(S>r||S>w)break;S>=i&&S>=x&&p(G(S)),$+=b,$>=12&&(I+=Math.floor($/12),$=$%12)}}else{const b=f-12,h=x.getDate();let I=x.getFullYear(),$=x.getMonth();for(let S=0;S<300;S++){const A=new Date(I,$+1,0).getDate(),_=new Date(I,$,Math.min(h,A));if(_>r||_>w)break;_>=i&&_>=x&&p(G(_)),$++,$>=12&&(I++,$=0)}const y=Math.max(x.getFullYear(),i.getFullYear()),C=Math.min((l.fechaFin?w:r).getFullYear(),r.getFullYear());for(let S=y;S<=C;S++)for(const A of zo.slice(0,b)){const _=new Date(S,A,15);_>=i&&_<=r&&_>=x&&_<=w&&p(G(_))}}}return s}function pa(t,a,e,o=null,n="default"){const s=[];if(!a||a.length===0)return s;const i=L(e.start),r=L(e.end),c=V(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let v=new Date(i.getFullYear(),i.getMonth(),1);for(;v<=r;){const d=v.getFullYear(),l=v.getMonth(),m=d+"-"+String(l+1).padStart(2,"0"),f=m+"-01",x=G(new Date(d,l+1,0)),w=G(new Date(d,l,15));let p=0;for(const b of u){if(o&&o.length>0&&!o.includes(b.cuenta||"default")||b.fechaInicio&&b.fechaInicio>x||b.fechaFin&&b.fechaFin<f)continue;const h=b.fechaInicio||c,I=pt(a,h,w);if(I<=1)continue;const $=Math.max(1,b.frecuencia||1);p+=b.cuantia*(I-1)/$}p>.01&&s.push({fecha:w,concepto:"Incremento coste de vida",cuantia:p,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+m,sourceType:"inflacion"}),v=new Date(d,l+1,1)}return s}function ma(t,a,e,o="default"){const n=[];if(!a||a.length===0||t<=0)return n;const s=L(e.start),i=L(e.end),r=[...a].sort((u,v)=>u.year-v.year);let c=new Date(s.getFullYear(),s.getMonth(),1);for(;c<=i;){const u=c.getFullYear(),v=c.getMonth(),d=u+"-"+String(v+1).padStart(2,"0"),l=G(new Date(u,v,15)),m=r.filter(b=>b.year<=u),f=m.length>0?m[m.length-1]:r[0],x=f?f.tasa/100:0,w=Math.pow(1+x,1/12)-1,p=t*w;p>.01&&n.push({fecha:l,concepto:"Pérdida ahorro por inflación",cuantia:p,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(u,v+1,1)}return n}function fa(t,a,e){const o=e.fechaReferencia||e.dashboardStart,n=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,s=a.reduce((d,l)=>d+Rt(l,n),0),i=t.filter(d=>d.fecha<n),r=t.filter(d=>d.fecha>=n),c=[];let u=s;for(const d of[...i].reverse()){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);c.unshift({...d,delta:l,saldoAcum:u}),u-=l}const v=[];u=s;for(const d of r){const l=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=l,v.push({...d,delta:l,saldoAcum:u})}return[...c,...v]}function qo(t,a,e,o=null){const n=a.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return fa([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,e)}function ga(t){const{loans:a,expenses:e,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c={start:n.dashboardStart,end:n.dashboardEnd},u=e.filter(x=>x.tipo!=="transferencia"),v=e.filter(x=>x.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let l=[];l=l.concat(Ot(u,c,s)),l=l.concat(ia(a,c,s)),l=l.concat(ra(v,c,s,d)),l=l.concat(ca(o,c,s));const m=la(o,c,s,l);if(l=l.concat(m),l=l.concat(da(e,n.tramos_irpf,c,s)),l=l.concat(ua(i,c,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const x=(o.find(b=>b.activo&&b.esCuentaPrincipal)||o.find(b=>b.activo)||{_id:"default"})._id;l=l.concat(pa(u,r,c,s,x));const p=o.filter(b=>b.activo&&(!s||s.length===0||s.includes(b._id))).reduce((b,h)=>b+Rt(h,n.dashboardStart),0);l=l.concat(ma(p,r,c,x))}l.sort((x,w)=>x.fecha.localeCompare(w.fecha));const f=o.filter(x=>x.activo&&(!s||s.length===0||s.includes(x._id)));return fa(l,f,n)}function No(t,a,e=null){const o=V(),s=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+mt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function va(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])e.set(n,(e.get(n)||0)+Math.abs(o.cuantia));return e}function Ro(t,a){const e=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${E(i)}) a partir del ${s.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${E(i)} < ${E(a)}) desde ${s.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${E(i)})`})))}return e}function Lo(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=L(a.dashboardStart),n=L(a.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return e/s}function Oo(t,a,e=V()){const o=new Set,n=a.map(r=>{const c=r.fechaInicialSaldo||"",u={};c&&c<=e&&(u[c]=r.saldoInicial||0);for(const v of r.historicoSaldos||[])v.fecha<=e&&(!c||v.fecha>=c)&&(u[v.fecha]=v.saldo);return Object.keys(u).forEach(v=>o.add(v)),u}),s={};for(const r of[...o].sort()){let c=0;for(let u=0;u<a.length;u++){const v=Object.entries(n[u]).filter(([d])=>d<=r);v.length>0?(v.sort(([d],[l])=>l.localeCompare(d)),c+=v[0][1]):c+=a[u].saldoInicial||0}s[r]=c}const i=[];for(const[r,c]of Object.entries(s).sort(([u],[v])=>u.localeCompare(v))){const u=t.filter(m=>m.fecha<=r),v=u.length>0?u[u.length-1].saldoAcum:null;if(v===null)continue;const d=c-v,l=v!==0?d/Math.abs(v)*100:0;i.push({cuenta:"Total",fecha:r,estimado:v,real:c,desv:d,pct:l})}return i}const ko=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Oo,detectarPuntosCriticos:Ro,mediaMensualGastos:Lo},Symbol.toStringTag,{value:"Module"}));function kt(t,a=new Date){const e=G(a),o=new Date(a);o.setMonth(o.getMonth()+1);const n=G(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Ot(s,{start:e,end:n}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Bo(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+yt(e.capital,e.tin,e.meses),0)}function Ho(t,a){return J(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function ba(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,n)=>o+yt(n.capital,n.tin,n.meses)*Math.min(a,Ho(n,e)),0)}function ha(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const n=kt(t,o),s=a.colchonMeses||6;return n*s+ba(e,s,G(o))}function Go(t,a,e,o,n){const i=[...a.colchonPuntos||[]].sort((u,v)=>u.fecha.localeCompare(v.fecha)).filter(u=>u.fecha<=o).pop();if(!i)return ha(t,a,e,n);if(i.tipo==="fijo")return i.importe||0;const r=kt(t,n),c=i.meses||6;return r*c+ba(e,c,o)}function $e(t,a,e,o,n,s=!1,i){const r=[...t.puntos||[]].sort((v,d)=>v.fecha.localeCompare(d.fecha)),c=r.filter(v=>v.fecha<=n).pop()||(s?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(kt(a,i)+Bo(o))*(c.meses||1):0}function Vo(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Uo(t,a){const e={};for(const o of a)e[o._id]=mt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Vo(o)),{fecha:o.fecha,saldos:{...e}}))}function Yo(t,a,e,o,n,s,i){const r=[];for(const c of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let v=0;v<a.length;v++){const d=a[v],l=$e(c,o,n,s,d.fecha,!1,i);if(l<=0){u=!1;continue}const m=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((f,x)=>{var w,p;return f+(((p=(w=e[v])==null?void 0:w.saldos)==null?void 0:p[x])||0)},0);m<l&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:m,target:l,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${E(m)} < ${E(l)} desde ${d.fecha}`})):m>=l&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:m,target:l,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Wo=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:ha,calcColchonEnFecha:Go,calcGastoBasicoMensual:kt,calcMargenEnFecha:$e,detectarCrucesMargenes:Yo,saldosPorCuentaEnExtracto:Uo},Symbol.toStringTag,{value:"Module"}));function Ko(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function ya(t,a){return Nt(L(t),L(a))}const Jo=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function $a(t,a){const[e,o,n]=t.split("-").map(Number),s=t.slice(0,4)===a.slice(0,4);return`${n} de ${Jo[o-1]}${s?"":` de ${e}`}`}function xa(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Qo(t,a={}){const{hoy:e=V(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:l=>`El ${l} el saldo proyectado baja a ${E(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:l=>l?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:l=>`El ${l} el saldo queda en ${E(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:l=>l?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:l=>`El ${l} tendrías ${E(d.saldo)}, y el margen pide ${E(d.target)}.`});const c=new Map;for(const d of r){const l=c.get(d.id);(!l||d.fecha<l.fecha)&&c.set(d.id,d)}const u=[];for(const d of c.values()){const l=ya(e,d.fecha);if(l<0||l>(d.gravedad==="critico"?o:n))continue;const m=i?i(l):0,f=m>0&&d.distancia<m;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:l,plazo:xa(l),titulo:d.titulo(f),detalle:d.detalle($a(d.fecha,e)),incierto:f})}const v={critico:0,aviso:1};return u.sort((d,l)=>d.fecha.localeCompare(l.fecha)||v[d.gravedad]-v[l.gravedad]),u.slice(0,s)}const Xo=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Ko,construirAvisos:Qo,describirPlazo:xa,diasEntreISO:ya,fechaEnPalabras:$a},Symbol.toStringTag,{value:"Module"})),Zo=30.44*864e5;function Ia(t){const a=t.getFullYear(),e=t.getMonth();return{desde:G(new Date(a,e,1)),hasta:G(new Date(a,e,me(a,e)))}}function wa(t){const[a,e]=t.split("-").map(Number);return Ia(new Date(a,e-1,1))}function tn(t,a){return Math.max(1,(L(a).getTime()-L(t).getTime())/Zo)}const en=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),gt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function an(t,a){const e=new Map(a.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=e.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function on(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=l=>l.sourceType==="loan"&&l.tipo==="gasto",n=a.loanIdsIniciados,s=gt(t.filter(l=>l.tipo==="ingreso")),i=gt(t.filter(l=>o(l)&&(!n||n.has(l.sourceId??"")))),r=gt(t.filter(l=>o(l)&&a.hipotecaIds.has(l.sourceId??""))),c=gt(t.filter(l=>l.sourceType==="loan-amort")),u=gt(t.filter(l=>l.sourceType==="account-interest")),{basicos:v,deseo:d}=an(t,a.expenses);return{ingresos:s/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:v/e,gastosDeseo:d/e,gastosTotales:(i+v+d)/e,intereses:u/e}}function Ca(t,a){return t.reduce((e,o)=>{const n=J(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=a);return e+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function nn(t,a,e,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=e),s=n.reduce((u,v)=>{if((v.amortizaciones||[]).filter(f=>f.fecha>=a&&f.fecha<=e).length===0)return u;const l=J(v).totalIntereses,m=J({...v,amortizaciones:(v.amortizaciones||[]).filter(f=>f.fecha<a||f.fecha>e)}).totalIntereses;return u+Math.max(0,m-l)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:J(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=a&&u.fechaFin<=e),r=n.map(u=>J(u).tabla),c=u=>{const{desde:v,hasta:d}=wa(u);return r.reduce((l,m)=>{const f=m.find(x=>!x.esAmortizacion&&x.fecha>=v&&x.fecha<=d);return l+(f?f.cuota:0)},0)};return{deudaInicio:Ca(n,a),deudaFin:Ca(n,e),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function sn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:gt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Sa(t,a=new Set,e="desglosado"){if(a.size===0)return va(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>a.has(u)),r=s.filter(u=>!a.has(u)),c=e==="porgrupos"&&i.length>0?i:r;for(const u of c)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function rn(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Sa(t,a.grupoTags,a.modo).entries()].filter(([n])=>!e||e.size===0||e.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function cn(t,a){const e=a.reduce((o,n)=>o+mt(n),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:gt(t.filter(o=>o.tipo==="gasto")),totalIngresos:gt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function ln(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function dn(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function un(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function pn(t,a){if(t.length===0)return[];const e=u=>a==="mes"?u.slice(0,7):u.slice(0,4),o=u=>a==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let c=null;for(const u of t){const v=e(u.fecha),d=u.saldoAcum??i;(!c||c.periodo!==v)&&(c&&(i=c.cierre),c={periodo:v,inicio:o(v),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const mn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:pn,cuentasVisibles:ln,gastoPorTagOrdenado:rn,idsHipoteca:dn,idsPrestamosIniciados:un,interesesPorCuenta:sn,mesesDelPeriodo:tn,metricasFlujo:on,rangoMes:wa,rangoMesDe:Ia,resumenPrestamosPeriodo:nn,sinTransferencias:en,sumarGastosPorTag:Sa,totalesPeriodo:cn},Symbol.toStringTag,{value:"Module"}));function fn(t,a,e){const o=t||[];if(!o.length)return a;const n=o.find(i=>i.año===e);if(n)return n.tramos;const s=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:a}function Bt(t,a){return e=>fn(t,a,e)}const Ht=10,Aa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ma=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function xe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const Ea="default";function _a(){return{_id:Ea,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Pa(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Aa,tramosGananciasCapital:Ma,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Fa(t,a){return{loans:[],expenses:[],accounts:[xe(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[_a()],config:Pa(t,a)}}const ct=t=>Array.isArray(t)?t:[],gn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Gt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Da(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ie(t){const{varianza:a,inflacion:e,...o}=t;return o}function vn(t,a){const{hoyISO:e,finISO:o}=a,n={...t},s=gn(t.config),r={...Pa(e,o)};for(const[v,d]of Object.entries(s))d!=null&&(r[v]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Aa),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Ma),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let c=ct(t.accounts).map(v=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...v};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Gt(d)});c.length===0&&(c=[xe(e)]);const u=c.filter(v=>v.esCuentaPrincipal);if(u.length===0){const v=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===v._id}))}else if(u.length>1){let v=!1;c=c.map(d=>d.esCuentaPrincipal?v?{...d,esCuentaPrincipal:!1}:(v=!0,d):d)}return n.accounts=c,n.expenses=ct(t.expenses).map(v=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...v};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=Da(d.diaPago),Ie(Gt(d))}),n.loans=ct(t.loans).map(v=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...v};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=Da(d.diaPago),d.amortizaciones=ct(d.amortizaciones).map(l=>Gt(l)),Ie(Gt(d))}),n.nominas=ct(t.nominas).map(v=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...v};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ie(Gt(d))}),n.goals=ct(t.goals).map((v,d)=>{const l=Array.isArray(v.cuentaIds)?v.cuentaIds:v.cuentaId?[v.cuentaId]:[],{cuentaId:m,...f}=v;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...f,cuentaIds:l}}),n.inflacion=ct(t.inflacion),n.tramosIRPFHistorico=ct(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ct(t.tramosGananciasCapitalHistorico),n.escenarios=ct(t.escenarios).map(({inversiones:v,...d})=>d),n}const Mt=t=>Array.isArray(t)?t:[];let we=0;function bn(t){return we+=1,`${t}_${we.toString(36)}`}const hn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),yn=t=>typeof t=="number"&&Number.isFinite(t);function $n(t,a){const e={...t};we=0;const o=Mt(t.transacciones),n=Mt(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,v,d,l)=>{if(!hn(v)||!yn(d))return;const m=`${u}|${v}`;i.has(m)||(i.add(m),s.push({_id:bn("pc"),fecha:v,cuentaId:u,saldoCts:nt(d),...typeof l=="string"&&l?{nota:l}:{}}))};for(const u of Mt(t.accounts)){const v=typeof u._id=="string"?u._id:null;if(v)for(const d of Mt(u.historicoSaldos))r(v,d.fecha,d.saldo,d.nota)}const c=Mt(t.history);if(c.length>0){const u=Mt(t.accounts),v=u.find(l=>l.esCuentaPrincipal)||u.find(l=>l.activo)||u[0],d=typeof(v==null?void 0:v._id)=="string"?v._id:"default";for(const l of c){const m=typeof l.cuenta=="string"?l.cuenta:typeof l.cuentaId=="string"?l.cuentaId:d;r(m,l.fecha,l.saldo,l.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=s.sort((u,v)=>String(u.fecha).localeCompare(String(v.fecha))),e}const Ce=t=>Array.isArray(t)?t:[],xn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),In=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Se=0;function wn(){return Se+=1,`tx_hp_${Se.toString(36)}`}function Cn(t,a){const e={...t};Se=0;const o=[...Ce(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ce(t.expenses).map(i=>{const r=Ce(i.historialPrecios),c=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",v=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(f=>typeof f=="string"):[];if(c)for(const f of r){if(!f||!xn(f.fecha)||!In(f.cuantia))continue;const x=v==="ingreso"?nt(f.cuantia):-nt(f.cuantia),w=`${c}|${f.fecha}|${x}`;n.has(w)||(n.add(w),o.push({_id:wn(),fecha:f.fecha,cuentaId:u,importeCts:x,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:v,origen:"importado",nota:typeof f.nota=="string"&&f.nota?f.nota:"Importado del historial de precios"}))}const{historialPrecios:l,...m}=i;return m});return e.expenses=s,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Ta=t=>Array.isArray(t)?t:[],vt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Et=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,Sn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function An(t,a){var v;const e={...t};if(Array.isArray(e.planes))return e;const o=Ta(e.goals),n=Ta(e.accounts),s=n.map(d=>{const l=Et(d.bloqueoMeses,0);return{_id:`veh_${vt(d._id,"x")}`,nombre:vt(d.nombre,"Cuenta"),rentabilidadRealAnual:Et(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":l>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Et(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?nt(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:vt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Et(d.interes,0)>0}}),i=new Map(n.map((d,l)=>[vt(d._id,""),s[l]._id])),r=((v=s[0])==null?void 0:v._id)??"",c=o.map((d,l)=>{const m=Array.isArray(d.cuentaIds)?d.cuentaIds.map(x=>vt(x,"")):[],f=Sn(d.targetDate);return{_id:vt(d._id,`obj_mig_${l}`),nombre:vt(d.nombre,`Objetivo ${l+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:nt(Et(d.targetAmount,0)),fechaLimite:f,prioridad:Et(d.prioridad,l+1),modoAsignacion:f?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(m[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:vt(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[u],e}function Mn(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(n=>(n==null?void 0:n._id)===Ea)||(e.personas=[_a(),...o]),e}const Vt=t=>Array.isArray(t)?t:[];function ae(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:n,...s}=o;return s})),e}function En(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function _n(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Vt(e.loans).map(ae),e.expenses=Vt(e.expenses).map(ae),e.nominas=Vt(e.nominas).map(ae),e.accounts=Vt(e.accounts).map(ae),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:n,...s}=e.config;e.config=s}delete e.goals;const o=Vt(e.planes).filter(En);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const Pn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:vn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:$n},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Cn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:An},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:Mn},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:_n}],Fn=["history"];function za(t,a,e){let o=t;const n=[];for(const s of[...Pn].sort((i,r)=>i.version-r.version))(a??0)>=s.version||(o=s.migrate(o,e),n.push(s.version));return{state:o,applied:n}}const bt="state_",oe="state__schemaVersion",_t="financeapp_",Ae="state__modificadoEn";function ja(t=localStorage,a=_t){const e=o=>`${a}${o}`;return{get(o){try{const n=t.getItem(e(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(e(o),JSON.stringify(n)),o!==Ae&&t.setItem(e(Ae),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(a)&&o.push(s.slice(a.length))}return o}}}function Dn(t=localStorage,a=_t){const e=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(bt)&&!s.startsWith(a)&&e.push(s)}const o=[];for(const n of e)try{const s=t.getItem(n);s!==null&&t.getItem(`${a}${n}`)===null&&(t.setItem(`${a}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Tn({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(n){e={...n,cuando:a()}},pendiente:o,tomar(){const n=o();return e=null,n},limpiar(){e=null}}}const zn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function jn(t,a){const e=zn[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function qn(t){return G(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Nn({adapter:t,hoy:a=new Date}){const e=G(a),o=qn(a);let n=Fa(e,o);const s=new Set;let i=[];const r=Tn();function c(M){for(const F of s)F(M)}function u(M){t.set(`${bt}${M}`,n[M])}function v(){const M={};for(const z of Object.keys(n)){const R=t.get(`${bt}${z}`);R!==null&&(M[z]=R)}for(const z of Fn){const R=t.get(`${bt}${z}`);R!==null&&(M[z]=R)}const F=t.get(oe),{state:q,applied:D}=za(M,F,{hoyISO:e,finISO:o});if(n=q,d(),D.length>0){for(const z of Object.keys(n))u(z);t.set(oe,Ht)}return i=D,{applied:D}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[xe(e)],u("accounts");return}const M=n.accounts.filter(F=>F.esCuentaPrincipal);if(M.length===0)n.accounts=n.accounts.map((F,q)=>q===0?{...F,esCuentaPrincipal:!0}:F),u("accounts");else if(M.length>1){let F=!1;n.accounts=n.accounts.map(q=>q.esCuentaPrincipal?F?{...q,esCuentaPrincipal:!1}:(F=!0,q):q),u("accounts")}}function l(M){return n[M]}function m(M,F){n[M]=F,u(M),c(M)}function f(M){m("config",{...n.config,...M})}function x(M){return s.add(M),()=>s.delete(M)}function w(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function p(M,F){const q=[...n[M]],D={...F,_id:w()};return q.push(D),m(M,q),D}function b(M,F,q){const D=n[M].map(z=>z._id===F?{...z,...q}:z);m(M,D)}function h(M,F){const q=n[M],D=q.findIndex(z=>z._id===F);D<0||(r.registrar({col:M,item:q[D],indice:D}),m(M,q.filter((z,R)=>R!==D)))}function I(){const M=r.tomar();if(!M)return null;const F=[...n[M.col]];return F.splice(Math.min(M.indice,F.length),0,M.item),m(M.col,F),M}function $(){return r.pendiente()}function y(){const M=n.accounts||[],F=M.find(q=>q.esCuentaPrincipal&&q.activo)||M.find(q=>q.activo);return F?F._id:"default"}function C(M){var F;return((F=n.accounts.find(q=>q._id===M))==null?void 0:F.nombre)??M}function S(){return Bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function A(){return Bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function P(M,F=null){const{state:q,applied:D}=za(M,F,{hoyISO:e,finISO:o});n=q,d();for(const z of Object.keys(n))u(z);t.set(oe,Ht);for(const z of Object.keys(n))c(z);return{applied:D}}return{load:v,get:l,set:m,patchConfig:f,subscribe:x,addItem:p,updateItem:b,removeItem:h,deshacerBorrado:I,borradoPendiente:$,getPrincipalAccountId:y,accountName:C,resolverTramosIRPF:S,resolverTramosGanancias:A,snapshot:_,replaceAll:P,get schemaVersion(){return Ht},get migrationsApplied(){return[...i]},get today(){return e||V()}}}function Rn(){let t=0,a=null;const e=new Set;function o(n){t+=1,a=n;for(const s of e)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(n){return e.add(n),()=>e.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const xt=Object.keys(Fa("1970-01-01","1970-01-01"));function qa(t){const a={};for(const e of xt){const o=t.get(`${bt}${e}`);o!=null&&(a[e]=o)}return a}function Ln(t,a){const e=[];for(const o of xt){const n=a[o];n!=null&&(t(`${bt}${o}`,n),e.push(o))}return e}function On(t){return xt.filter(a=>t[a]===void 0||t[a]===null)}function kn(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!xt.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Na=`${_t}meta_proyectos`,Ra=`${_t}meta_proyectoActivo`,It="default",Bn="Mis finanzas";function Me(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function Ut(t){return t===It?_t:`${_t}p_${t}_`}function La(){return[...xt.map(t=>`${bt}${t}`),oe,Ae]}function Hn(t=localStorage){function a(){try{const d=t.getItem(Na);if(!d)return[];const l=JSON.parse(d);return Array.isArray(l)?l:[]}catch{return[]}}function e(d){t.setItem(Na,JSON.stringify(d))}function o(){const d=a();if(d.some(f=>f._id===It))return d;const l=Date.now(),m=[{_id:It,nombre:Bn,creadoEn:l,actualizadoEn:l},...d];return e(m),m}function n(){try{const d=t.getItem(Ra);if(!d)return It;const l=JSON.parse(d);return typeof l=="string"&&l?l:It}catch{return It}}function s(d){t.setItem(Ra,JSON.stringify(d))}function i(d){const l=d.trim()||"Proyecto sin nombre",m=Date.now(),f={_id:Me(),nombre:l,creadoEn:m,actualizadoEn:m};return e([...o(),f]),f}function r(d,l){const m=l.trim();m&&e(o().map(f=>f._id===d?{...f,nombre:m,actualizadoEn:Date.now()}:f))}function c(d,l){const m=o().find(p=>p._id===d);if(!m)throw new Error("Proyecto no encontrado.");const f=Ut(d),x={_id:Me(),nombre:(l==null?void 0:l.trim())||`${m.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},w=Ut(x._id);for(const p of La()){const b=t.getItem(`${f}${p}`);b!==null&&t.setItem(`${w}${p}`,b)}return e([...o(),x]),x}function u(d){if(d===It)throw new Error("No se puede eliminar el proyecto original.");if(d===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const l=o();if(!l.some(f=>f._id===d))return;const m=Ut(d);for(const f of La())t.removeItem(`${m}${f}`);e(l.filter(f=>f._id!==d))}function v(d){const l=new Map(o().map(f=>[f._id,f]));for(const f of d){if(!f||typeof f._id!="string")continue;const x=l.get(f._id);(!x||(f.actualizadoEn??0)>x.actualizadoEn)&&l.set(f._id,f)}const m=[...l.values()];return e(m),m}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:c,eliminar:u,fusionarRemotos:v}}function Gn(t,a,e){const o=ja(t,Ut(a)),n={};for(const s of e){const i=o.get(`${bt}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function Vn(t){const a=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!a.has(i)&&a.set(i,Me())}function e(n){if(typeof n=="string")return a.get(n)??n;if(Array.isArray(n))return n.map(e);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=e(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(e);return o}const tt={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},ht=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:tt.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:tt.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:tt.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:tt.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:tt.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:tt.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:tt.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:tt.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:tt.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:tt.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:tt.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:tt.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:tt.datos,porDefecto:!1,dependencias:["sync-nube"]}],Un=new Map(ht.map(t=>[t.id,t]));function Yt(t){return Un.get(t)}function Oa(t){return ht.filter(a=>(a.dependencias||[]).includes(t))}function Ee(){const t={};for(const a of ht)t[a.id]=a.porDefecto;return t}function ka(){const t=[],a=new Map;for(const e of ht)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Yn(t){function a(){return{...Ee(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,l=a(),m=new Set){const f=Yt(d);if(!f)return!1;if(f.nucleo)return!0;if(l[d]===!1)return!1;if(m.has(d))return!0;m.add(d);for(const x of f.dependencias||[])if(!o(x,l,m))return!1;return!0}function n(d,l=a()){const m=Yt(d);return m?(m.dependencias||[]).filter(f=>!o(f,l)):[]}function s(d,l){var h;const m=Yt(d);if(!m)return{cambiadas:[]};if(m.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const f=a(),x=new Map(ht.map(I=>[I.id,o(I.id,f)])),w={...f,[d]:l};let p;if(l){const I=[...m.dependencias||[]];for(;I.length;){const $=I.pop();w[$]===!1&&(w[$]=!0,p="dependencias-activadas"),I.push(...((h=Yt($))==null?void 0:h.dependencias)||[])}}else{const I=Oa(d).map($=>$.id);for(;I.length;){const $=I.pop();w[$]!==!1&&(w[$]=!1,p="cascada-apagado"),I.push(...Oa($).map(y=>y.id))}}return e(w),{cambiadas:ht.filter(I=>o(I.id,w)!==x.get(I.id)).map(I=>I.id),motivo:p}}function i(){const d=a();return ht.map(l=>{const m=n(l.id,d);return{...l,activa:o(l.id,d),...m.length>0&&d[l.id]!==!1?{bloqueadaPor:m}:{}}})}function r(){const d=a();return ka().map(({grupo:l,features:m})=>({grupo:l,features:m.map(f=>{const x=n(f.id,d);return{...f,activa:o(f.id,d),...x.length>0&&d[f.id]!==!1?{bloqueadaPor:x}:{}}})}))}function c(){e(Ee())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function v(d){const l=d,m=l&&typeof l=="object"&&l.features&&typeof l.features=="object"?l.features:null;if(!m)throw new Error('El perfil no tiene una sección "features" válida');const f=Ee(),x=[],w=[];for(const[p,b]of Object.entries(m)){if(!Yt(p)){w.push(p);continue}if(typeof b!="boolean"){w.push(p);continue}f[p]=b,x.push(p)}return e(f),{aplicadas:x,ignoradas:w}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:c,exportProfile:u,importProfile:v,bloqueadaPor:d=>n(d)}}const Wt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Pt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Wn(t){var n,s;const e=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(Wt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    </div>`}function Kn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Wt(o)}</div>
        ${n.map(Wn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Jn(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Qn(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Kn(e)}`,n(i)}function n(i){var c,u,v;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var f;const l=d.dataset.featureToggle,m=e.setEnabled(l,d.checked);m.motivo==="dependencias-activadas"&&Pt(t,"Se han activado también las funcionalidades necesarias"),m.motivo==="cascada-apagado"&&Pt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(f=t.onChange)==null||f.call(t,m.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),l=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),m=URL.createObjectURL(l),f=a.createElement("a");f.href=m,f.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,f.click(),URL.revokeObjectURL(m),Pt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var l,m;const d=(l=r.files)==null?void 0:l[0];if(d)try{const{aplicadas:f,ignoradas:x}=e.importProfile(JSON.parse(await d.text()));Pt(t,x.length>0?`Perfil cargado (${f.length} aplicadas, ${x.length} ignoradas por ser de otra versión)`:`Perfil cargado (${f.length} funcionalidades)`),(m=t.onChange)==null||m.call(t,f),o(i)}catch(f){Pt(t,"No se pudo cargar el perfil: "+f.message,"err")}finally{r.value=""}}),(v=i.querySelector('[data-feature-action="reset"]'))==null||v.addEventListener("click",()=>{var d;e.reset(),Pt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=Jn(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const lt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Xn={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Ba(t){return Xn[t]??t}function ut(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ha(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Zn(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function ts(){var a,e,o,n;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function es(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function as(t,a){const e=t._id===a,o=t._id==="default";return`
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
    </div>`}function os(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const n=o.map(i=>`<option value="${lt(i._id)}">${lt(i.nombre)}</option>`).join(""),s=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${lt(i)}"/> ${lt(Ba(i))}
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
    </div>`}function ns(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function ss(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>as(u,c)).join("")}
      </div>
      ${ns()}
      ${os(r,c,e.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var c,u;r.querySelectorAll("[data-proyecto-accion]").forEach(v=>{v.addEventListener("click",()=>{const d=v.dataset.proyectoId,l=v.dataset.proyectoAccion,m=e.listar().find(f=>f._id===d);if(m){if(l==="cambiar"){if(!Ha(t,`¿Cambiar a "${m.nombre}"? Se recargará la página.`))return;e.cambiarA(d),Zn(t);return}if(l==="renombrar"){const f=typeof prompt=="function"?prompt("Nuevo nombre",m.nombre):null;if(!f||!f.trim())return;e.renombrar(d,f.trim()),ut(t,"Proyecto renombrado"),n(r);return}if(l==="duplicar"){const f=`${m.nombre} (copia)`,x=typeof prompt=="function"?prompt("Nombre de la copia",f):f;if(x===null)return;const w=e.duplicar(d,x.trim()||f);ut(t,`"${w.nombre}" creado como copia de "${m.nombre}" ✓`),n(r);return}if(l==="eliminar"){if(!Ha(t,`¿Eliminar "${m.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),ut(t,`"${m.nombre}" eliminado`),n(r)}catch(f){ut(t,f.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const v=r.querySelector("#proyecto-nuevo-nombre"),d=v==null?void 0:v.value.trim();if(!d){ut(t,"Ponle un nombre al proyecto","warn");return}const l=e.crear(d);ut(t,`"${l.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var m;const v=(m=r.querySelector("#proyecto-import-origen"))==null?void 0:m.value;if(!v)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(f=>f.dataset.proyectoImportCol);if(d.length===0){ut(t,"Elige al menos una colección para importar","warn");return}const{importadas:l}=e.importarDesde(v,d);if(l.length===0){ut(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}ut(t,`Importado: ${l.map(Ba).join(", ")} ✓`),ts(),n(r)})}function i(){const r=es(a);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const ne=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],wt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ft(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function is(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function rs(t){var n;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-personas-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function cs(t){const a=t.color||ne[0];return`
    <div class="dm-section" data-persona-fila="${wt(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${wt(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${wt(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${wt(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${wt(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${wt(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${wt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function ls(){return`
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
    </div>`}function ds(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(cs).join("")}
      </div>
      ${ls()}`}function n(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function s(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var v;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.personaId,m=d.dataset.personaAccion,f=e.get("personas"),x=f.find(w=>w._id===l);if(x){if(m==="renombrar"){const w=typeof prompt=="function"?prompt("Nuevo nombre",x.nombre):null;if(!w||!w.trim())return;e.updateItem("personas",l,{nombre:w.trim()}),Ft(t,"Persona renombrada"),s(),n(c);return}if(m==="defecto"){e.set("personas",f.map(w=>({...w,esPorDefecto:w._id===l}))),Ft(t,`"${x.nombre}" es ahora la persona por defecto`),s(),n(c);return}if(m==="activo"){e.updateItem("personas",l,{activo:!x.activo}),s(),n(c);return}if(m==="eliminar"){if(f.length<=1){Ft(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!is(t,`¿Eliminar "${x.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",l),Ft(t,`"${x.nombre}" eliminada`),s(),n(c)}}})});const u=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const l=d.getAttribute("data-persona-color");u&&(u.value=l),c.querySelectorAll("[data-persona-color]").forEach(m=>{m.style.border=m.getAttribute("data-persona-color")===l?"2px solid white":"2px solid transparent"})})}),(v=c.querySelector("#persona-nuevo-btn"))==null||v.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),l=d==null?void 0:d.value.trim();if(!l){Ft(t,"Ponle un nombre a la persona","warn");return}const m=(u==null?void 0:u.value)||ne[0],f=e.addItem("personas",{nombre:l,color:m,esPorDefecto:!1,activo:!0});Ft(t,`"${f.nombre}" creada ✓`),s(),n(c)})}function r(){const c=rs(a);n(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:n}}const Ga={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Va(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const n=a(o);e.style.display=n?"":"none",n?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function us({flags:t,document:a=document,router:e,rutasExtra:o}){function n(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([u,v])=>[v,u]);for(const[u,v]of[...Object.entries(Ga),...c]){const d=t.isEnabled(u),l=a.querySelector(`.nav-btn[data-view="${v}"]`);l&&(l.style.display=d?"":"none"),!d&&n()===v&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(u=>{const v=[...u.querySelectorAll(".nav-btn[data-view]")];if(v.length===0)return;const d=v.some(l=>l.style.display!=="none");u.style.display=d?"":"none"}),Va(a,u=>t.isEnabled(u)),r){const u=e??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const u=new MutationObserver(()=>{if(!c){c=!0;try{Va(a,v=>t.isEnabled(v))}finally{c=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>Ga[r]}}const ps="toast toast-deshacer";function ms(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(d){const l=n();if(!l)return;c();const m=document.createElement("div");m.className=ps,m.style.display="flex",m.style.alignItems="center",m.style.gap="12px";const f=document.createElement("span");f.textContent=`${jn(d.col,d.item)} se ha eliminado.`,f.style.flex="1";const x=document.createElement("button");x.type="button",x.className="btn-secondary btn-sm",x.textContent="Deshacer",x.style.flexShrink="0",x.addEventListener("click",()=>{const w=a.deshacerBorrado();if(c(),!w)return;const p=n();if(p){const b=document.createElement("div");b.className="toast toast-ok",b.textContent="Deshecho.",p.appendChild(b),setTimeout(()=>b.remove(),2500)}e==null||e()}),m.appendChild(f),m.appendChild(x),l.appendChild(m),s=m,i=setTimeout(c,o)}const v=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,u(d))});return()=>{v(),c()}}function se(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Ua(t,a){const e=se(t),o=se(a);if(!o)return-1;const n=e.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(e[n-1])?1:2}const Kt=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function fs(t){const a=[],e=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";a.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Kt(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Kt(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Kt(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Kt(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Kt(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function gs(t,a,e={}){const{maximo:o=12,rutasDisponibles:n=null}=e,s=se(a);if(s.length<2)return[];const i=c=>n===null||n.includes(c),r=[];for(const c of fs(t)){if(!i(c.ruta))continue;const u=Ua(c.titulo,s),v=u>=0?-1:Math.min(Ua(c.extra??"",s),2);if(u<0&&v<0)continue;const d=u>=0?u:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,se(c.titulo).length)})}return r.sort((c,u)=>c.peso-u.peso||c.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const vs="buscador-overlay",Ya="btn-buscador";function bs(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function c(){const I=a.createElement("div");I.id=vs,I.className="modal-overlay",I.style.alignItems="flex-start",I.style.paddingTop="10vh";const $=a.createElement("div");$.className="modal-box",$.style.maxWidth="560px",$.style.padding="14px";const y=a.createElement("input");y.type="search",y.className="form-input",y.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",y.setAttribute("aria-label","Buscar en toda la aplicación"),y.autocomplete="off";const C=a.createElement("div");return C.style.marginTop="10px",C.style.maxHeight="52vh",C.style.overflowY="auto",$.appendChild(y),$.appendChild(C),I.appendChild($),a.body.appendChild(I),I.addEventListener("click",S=>{S.target===I&&x()}),y.addEventListener("input",()=>{r=0,v()}),y.addEventListener("keydown",m),o=I,n=y,s=C,I}function u(){if(s){if(s.textContent="",i.length===0){const I=a.createElement("div");I.style.padding="14px 4px",I.style.fontSize="13px",I.style.color="var(--text3)";const $=(n==null?void 0:n.value.trim())??"";I.textContent=$.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(I);return}i.forEach((I,$)=>{const y=a.createElement("button");y.type="button",y.className="buscador-fila",y.dataset.indice=String($),$===r&&y.classList.add("activa");const C=a.createElement("div");C.style.minWidth="0";const S=a.createElement("div");S.textContent=I.titulo,S.style.fontSize="13px",S.style.overflow="hidden",S.style.textOverflow="ellipsis",S.style.whiteSpace="nowrap";const A=a.createElement("div");A.textContent=I.detalle,A.style.fontSize="11px",A.style.color="var(--text3)",A.style.overflow="hidden",A.style.textOverflow="ellipsis",A.style.whiteSpace="nowrap",C.appendChild(S),I.detalle&&C.appendChild(A);const _=a.createElement("span");_.className="tag",_.textContent=I.etiqueta,_.style.flexShrink="0",y.appendChild(C),y.appendChild(_),y.addEventListener("click",()=>l($)),s.appendChild(y)})}}function v(){const I=(n==null?void 0:n.value)??"";i=gs(t.estado(),I,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d(I){var $,y;i.length!==0&&(r=(r+I+i.length)%i.length,u(),(y=($=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:$.scrollIntoView)==null||y.call($,{block:"nearest"}))}function l(I){const $=i[I];$&&(x(),t.navegar($.ruta))}function m(I){I.key==="Escape"?(I.preventDefault(),x()):I.key==="ArrowDown"?(I.preventDefault(),d(1)):I.key==="ArrowUp"?(I.preventDefault(),d(-1)):I.key==="Enter"&&(I.preventDefault(),l(r))}function f(){const I=o??c();I.classList.remove("hidden"),I.style.display="",r=0,n&&(n.value="",n.focus()),v()}function x(){o&&(o.style.display="none",i=[])}function w(){return!!o&&o.style.display!=="none"}function p(I){(I.ctrlKey||I.metaKey)&&(I.key==="k"||I.key==="K")&&(I.preventDefault(),w()?x():f())}a.addEventListener("keydown",p);let b=null;function h(){const I=a.getElementById("period-bar");if(!I||a.getElementById(Ya))return;const $=a.createElement("button");$.id=Ya,$.type="button",$.className="btn-secondary",$.title="Buscar en toda la aplicación (Ctrl+K)",$.setAttribute("aria-label","Buscar"),$.textContent="🔍 Buscar",$.style.marginLeft="auto",$.addEventListener("click",f),I.appendChild($),b=$}return h(),()=>{a.removeEventListener("keydown",p),b==null||b.remove(),o==null||o.remove(),o=null,n=null,s=null}}const _e="aviso-guardado";function hs(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,c=null;function u(){var f;r&&clearTimeout(r),r=null,(f=a.getElementById(_e))==null||f.remove()}function v(){if(s==="oculto")return u();const f=e();if(!f)return;let x=a.getElementById(_e);x||(x=a.createElement("div"),x.id=_e,f.appendChild(x)),x.className=`toast toast-guardado toast-guardado--${s}`,x.style.display="flex",x.style.alignItems="center",x.style.gap="12px",x.textContent="";const w=a.createElement("span");if(w.style.flex="1",x.appendChild(w),s==="pendiente")w.textContent="Tienes cambios sin guardar.",x.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void l())),x.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",v()}));else if(s==="subiendo"){w.textContent="Subiendo…";const p=a.createElement("span");p.className="guardado-giro",p.setAttribute("aria-hidden","true"),x.appendChild(p)}else s==="guardado"?w.textContent="¡Guardado!":s==="error"&&(w.textContent="No se ha podido guardar.",x.appendChild(d("Reintentar","btn-primary btn-sm",()=>void l())))}function d(f,x,w){const p=a.createElement("button");return p.type="button",p.className=x,p.textContent=f,p.style.flexShrink="0",p.addEventListener("click",w),p}async function l(){if(c)return c;r&&clearTimeout(r);const f=t.cambios.revision();return s="subiendo",v(),c=(async()=>{try{await t.guardar(),n.alDia(f),s="guardado",v(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),v()},o)}catch(x){console.error("[guardado] no se ha podido subir la copia:",x),s="error",v()}finally{c=null}})(),c}const m=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",v()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:l,detener(){m(),u()}}}function ys({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function n(f){return`view-${f}`}function s(f){const x=t.getElementById(n(f.route));if(x)return x;const w=t.querySelector(".view-container");if(!w)return null;const p=t.createElement("div");return p.id=n(f.route),p.className="view hidden",w.appendChild(p),p}function i(f){if(t.querySelector(`.nav-btn[data-view="${f.route}"]`))return;const x=t.querySelectorAll(".nav-section"),w=x[f.seccion??Math.max(0,x.length-1)];if(!w)return;const p=t.createElement("button");p.className="nav-btn",p.dataset.view=f.route,p.innerHTML=`${f.iconoPath?`<svg viewBox="0 0 24 24"><path d="${f.iconoPath}"/></svg>`:""}<span>${f.nombre}</span>`,w.appendChild(p),p.addEventListener("click",()=>{const b=globalThis.Router;b==null||b.navigate(f.route)})}function r(f){e.set(f.route,f),s(f),i(f)}function c(){return[...e.keys()].filter(f=>{const x=e.get(f);return!a||a(x.flagId??x.id)})}function u(f){return c().includes(f)}function v(f){const x=e.get(f);if(!x||a&&!a(x.flagId??x.id))return!1;const w=s(x);if(!w)return!1;if(o&&o!==f){const p=e.get(o),b=t.getElementById(n(o));p!=null&&p.unmount&&b&&p.unmount(b)}return x.mount(w),o=f,!0}function d(){o&&v(o)}function l(){const f={};for(const[x,w]of e)f[x]=w.flagId??w.id;return f}function m(){for(const f of e.values())s(f),i(f)}return{register:r,routes:c,has:u,mount:v,rerender:d,flagPorRuta:l,attachToShell:m,get activa(){return o}}}function g(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ct(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${g(E(t))}</span>`}function Wa(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Ka(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${g(a)}</span>`).join(" ")}const $s=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Pe(t){const[a,e]=t.split("-").map(Number);return`${$s[e-1]} ${a}`}function j(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function et(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function T(t,a,e){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function Y(t,a,e){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(a);n&&t.contains(n)&&e(n,o)})}function it(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Ja(t,a){const e=parseFloat(it(t,a));return Number.isFinite(e)?e:0}const xs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Fe(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Is(t){const{store:a}=t,e=t.hoy??V,o=()=>L(e()),n=()=>a.get("config").margenesSeguridad??[];function s(m){var f;a.patchConfig({margenesSeguridad:m}),(f=t.onDatosCambiados)==null||f.call(t)}function i(m,f){const x=n().map(p=>({...p,puntos:(p.puntos??[]).map(b=>({...b}))})),w=x.find(p=>p._id===m);w&&(f(w),s(x))}function r(m){const f=a.get("config"),x=$e(m,a.get("expenses"),f,a.get("loans"),e(),!1,o());return E(x)}function c(m,f,x){const w=f.tipo==="fijo",p=w?"":`<span class="text-sm" style="color:var(--text3)">${g(E((f.meses??0)*x))}</span>`;return`
      <tr data-punto="${g(f._id)}" data-margen="${g(m._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${g(f.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${w?" selected":""}>Fijo €</option>
            <option value="meses"${w?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${w?`<input type="number" class="form-input" style="width:90px" value="${f.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${w?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${f.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${p}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(m,f,x){const w=m.cuentas&&m.cuentas.length>0?m.cuentas.map(I=>{var $;return(($=f.find(y=>y._id===I))==null?void 0:$.nombre)??I}).join(", "):"Todas las cuentas activas",b=[...m.puntos??[]].sort((I,$)=>I.fecha.localeCompare($.fecha)).map(I=>c(m,I,x)).join(""),h=m.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${g(w)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${g(r(m))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${g(m._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${g(m.nombre)}</span>
            <span class="badge ${m.activo?"badge-active":"badge-inactive"}">${m.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${m.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${m.activo?"checked":""} data-toggle-margen="${g(m._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${g(m._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${g(m._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${h}
      </div>`}function v(m,f){const x=f?n().find(h=>h._id===f):null,w=a.get("accounts").filter(h=>h.activo),p=new Set((x==null?void 0:x.cuentas)??[]),b=w.map(h=>`
        <label class="tag" data-chip="${g(h._id)}" style="cursor:pointer;${p.has(h._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${g(h._id)}" ${p.has(h._id)?"checked":""} style="display:none"/>
          ${g(h.nombre)}
        </label>`).join(" ");m.innerHTML=`
      <div class="modal-title">${f?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${g((x==null?void 0:x.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${b||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${x?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${g(V())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${g(f??"")}">Guardar</button>
      </div>`}function d(m,f){const x=document.getElementById("modal-overlay"),w=document.getElementById("modal-content");!x||!w||(v(w,m),x.classList.remove("hidden"),Y(w,".mg-acc-chip",p=>{const b=p,h=w.querySelector(`[data-chip="${b.value}"]`);h&&(h.style.cssText=`cursor:pointer;${b.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),Y(w,"#mg-p-tipo",p=>{const b=p.value==="fijo",h=w.querySelector("#mg-p-importe-wrap"),I=w.querySelector("#mg-p-meses-wrap");h&&(h.style.display=b?"":"none"),I&&(I.style.display=b?"none":"")}),T(w,"[data-cerrar-form]",()=>x.classList.add("hidden")),T(w,"[data-guardar-margen]",p=>{var y,C,S,A,_;const b=p.getAttribute("data-guardar-margen")||"",h=((y=w.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!h)return j("El nombre es obligatorio","err");const I=[...w.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),$=n().map(P=>({...P}));if(b){const P=$.findIndex(M=>M._id===b);if(P===-1)return j("Margen no encontrado","err");$[P]={...$[P],nombre:h,cuentas:I}}else{const P=((C=w.querySelector("#mg-p-tipo"))==null?void 0:C.value)??"fijo",M={_id:Fe(),fecha:((S=w.querySelector("#mg-p-fecha"))==null?void 0:S.value)||V(),tipo:P,importe:parseFloat(((A=w.querySelector("#mg-p-importe"))==null?void 0:A.value)??"0")||0,meses:parseFloat(((_=w.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};$.push({_id:Fe(),nombre:h,activo:!0,cuentas:I,puntos:[M]})}s($),j(b?"Margen actualizado":"Margen creado"),x.classList.add("hidden"),f()}))}function l(m){const f=n(),x=a.get("accounts"),w=kt(a.get("expenses"),o());m.innerHTML=`
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
             </div>`:f.map(b=>u(b,x,w)).join("")}`;const p=()=>l(m);T(m,"[data-nuevo-margen]",()=>d(null,p)),T(m,"[data-editar-margen]",b=>d(b.getAttribute("data-editar-margen"),p)),T(m,"[data-borrar-margen]",b=>{et("¿Eliminar este margen de seguridad?")&&(s(n().filter(h=>h._id!==b.getAttribute("data-borrar-margen"))),j("Margen eliminado"),p())}),Y(m,"[data-toggle-margen]",b=>{const h=b.getAttribute("data-toggle-margen");i(h,I=>{I.activo=b.checked}),p()}),T(m,"[data-add-punto]",b=>{const h=b.getAttribute("data-add-punto");i(h,I=>{I.puntos=[...I.puntos??[],{_id:Fe(),fecha:V(),tipo:"fijo",importe:0,meses:1}]}),p()}),T(m,"[data-borrar-punto]",b=>{const h=b.closest("[data-punto]");if(!h)return;const I=h.dataset.margen,$=h.dataset.punto;i(I,y=>{y.puntos=(y.puntos??[]).filter(C=>C._id!==$)}),p()}),Y(m,"[data-campo]",b=>{const h=b.closest("[data-punto]");if(!h)return;const I=b.getAttribute("data-campo"),$=b.value;i(h.dataset.margen,y=>{const C=(y.puntos??[]).find(S=>S._id===h.dataset.punto);C&&(I==="fecha"?C.fecha=$:I==="tipo"?C.tipo=$:I==="importe"?C.importe=parseFloat($)||0:C.meses=parseFloat($)||0)}),p()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:xs,mount:l}}const ws=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],Cs=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Ss=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function As(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const De=(t,a)=>t.map(([e,o])=>`<option value="${g(e)}"${e===a?" selected":""}>${g(o)}</option>`).join("");function Qa(t,a="dp"){const{modo:e,dia:o,nth:n,wd:s}=As(t),i=De(ws.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${g(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${De(Cs,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${De(Ss,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Xa(t){var o,n,s;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=a.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",e==="dia"?"":"none"),(s=a.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",e==="nthweekday"?"":"none")}function Za(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=n=>{var s;return((s=a.querySelector(n))==null?void 0:s.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const Ms={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function Es(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function Dt(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const n=(a==null?void 0:a.modo)??"",s=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=n==="porcentaje"||n==="importe",r=c=>{const u=s.has(c._id),v=s.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${g(o)}" value="${g(c._id)}"${u?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${g(o)}" data-persona="${g(c._id)}"
             value="${v??""}" step="0.01" min="0" placeholder="${n==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${g(o)}">
    <label class="form-label">${g(t)}</label>
    <select class="form-select" data-reparto-modo="${g(o)}">
      <option value=""${n?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${n==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${n==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${n==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${g(o)}" style="margin-top:6px;${n?"":"display:none"}">
      ${Es(e,a).map(r).join("")}
    </div>
  </div>`}function Tt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",n=e.querySelector(`[data-reparto-participantes="${a}"]`);n&&(n.style.display=o?"":"none");const s=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=s?"":"none"})}function zt(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const n=[...e.querySelectorAll(".reparto-persona:checked")];if(n.length===0)return;const s=n.map(r=>{const c=r.value,u=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),v=u?parseFloat(u.value):NaN;return Number.isFinite(v)?{personaId:c,valor:v}:{personaId:c}});return{modo:o,participantes:s}}function to(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var n;return((n=a.find(s=>s._id===o.personaId))==null?void 0:n.nombre)??"?"}).join(", ")} (${Ms[t.modo]})`}function Te(t,a,e){const o=to(t,e),n=to(a,e);return!o&&!n?"":o===n?`Reparto: ${o}`:[n&&`Paga: ${n}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const _s="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Ps=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Fs(t){const a=t.hoy??V,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},n=()=>t.store.get("accounts"),s=p=>{var b;return((b=n().find(h=>h._id===(p||"default")))==null?void 0:b.nombre)??(p||"default")};function i(){const p=a();let b=[...t.store.get("expenses")];if(e.mostrarExpirados||(b=b.filter(h=>!h.fechaFin||h.fechaFin>=p)),e.tipo&&(b=b.filter(h=>h.tipo===e.tipo)),e.cuenta&&(b=b.filter(h=>(h.cuenta||"default")===e.cuenta)),e.desde&&(b=b.filter(h=>(h.fechaInicio??"")>=e.desde)),e.hasta&&(b=b.filter(h=>(h.fechaInicio??"")<=e.hasta)),e.busqueda){const h=e.busqueda.toLowerCase();b=b.filter(I=>I.concepto.toLowerCase().includes(h))}return e.tags.size>0&&(b=b.filter(h=>(h.tags||[]).some(I=>e.tags.has(I)))),b.sort((h,I)=>{const $=h[e.orden]??"",y=I[e.orden]??"";return typeof $=="number"&&typeof y=="number"?($-y)*e.sentido:String($).localeCompare(String(y))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(p=>p.tags||[]))].filter(Boolean).sort()}function c(p,b){const h=e.orden===p?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${p}">${g(b)} <span class="sort-arrow">${h}</span></span>`}function u(p,b=!1){return(b?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${g(I._id)}"${I._id===p?" selected":""}>${g(I.nombre)}</option>`).join("")}function v(p){const b=p.tipo==="transferencia",h=Te(p.repartoConsumo,p.repartoPago,t.store.get("personas")),I=fe(p.diaPago??""),$=p.tipoFrecuencia==="extraordinario"?"Único":`Cada ${p.frecuencia??1} ${p.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${I?` · ${I}`:""}`,y=!!p.fechaFin&&p.fechaFin<a(),C=b?'<span class="badge badge-purple">⇄ transf.</span>':p.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=b?`${g(s(p.cuenta))} → ${g(s(p.cuentaDestino))}`:g(s(p.cuenta)),A=(p.tags||[]).map(_=>`<span class="tag${e.tags.has(_)?" active":""}" data-tag="${g(_)}" title="Filtrar por ${g(_)}">${g(_)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${g(p.concepto)}</div>
        <div class="tag-list mt-4">${A}</div>
      </div>
      <div>${C}</div>
      <div class="num ${p.tipo==="ingreso"?"pos":b?"":"neg"}">${b?"⇄ ":""}${g(E(p.cuantia))}</div>
      <div class="text-sm">${g($)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${g(p._id)}"${p.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${p.tipo==="gasto"&&p.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${p.tipo==="gasto"&&p.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${p.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${p.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${g(p.ajustadaEn??"")}">ajustada</span>`:""}
        ${h?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${g(h)}">👥 reparto</span>`:""}
        ${y?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${g(p._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${g(p._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${g(p._id)}">✕</button>
      </div>
    </div>`}function d(p){const b=i(),h=r();p.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${g(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${u(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${g(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${g(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${h.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${h.map(I=>`<span class="tag${e.tags.has(I)?" active":""}" data-tag="${g(I)}">${g(I)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':b.map(v).join("")}
      </div>`}function l(p){const b=(p==null?void 0:p.tipo)==="transferencia",h=t.store.get("personas"),I=($,y,C,S,A="")=>`<div class="form-group"><label class="form-label">${g(y)}</label>
       <input class="form-input" type="${C}" id="${$}" value="${g(S)}" placeholder="${g(A)}"/></div>`;return`
      <div class="grid-2">
        ${I("ef-concepto","Concepto","text",(p==null?void 0:p.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(p==null?void 0:p.tipo)==="gasto"||!(p!=null&&p.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(p==null?void 0:p.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${b?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${I("ef-cuantia","Cuantía (€)","number",(p==null?void 0:p.cuantia)??"","500")}
        ${I("ef-frecuencia","Frecuencia","number",(p==null?void 0:p.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Ps.map(([$,y])=>`<option value="${$}"${((p==null?void 0:p.tipoFrecuencia)??"mensual")===$?" selected":""}>${g(y)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${I("ef-fecha-ini","Fecha inicio","date",(p==null?void 0:p.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((p==null?void 0:p.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${b?"":' style="display:none"'}>
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
          <div class="mt-8">${I("ef-fecha-fin","Fecha fin (opcional)","date",(p==null?void 0:p.fechaFin)??"")}</div>
          <div class="mt-8">${Qa(p==null?void 0:p.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${b?' style="display:none"':""}>
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
              <input class="form-input" type="text" id="ef-tags" value="${g(((p==null?void 0:p.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
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
          ${b?"":`${Dt("Reparto de consumo",p==null?void 0:p.repartoConsumo,h,"consumo")}
                 ${Dt("Reparto de pago",p==null?void 0:p.repartoPago,h,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${g((p==null?void 0:p._id)??"")}">Guardar</button>
      </div>`}function m(p){var I;const b=((I=p.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",h=($,y)=>{const C=p.querySelector($);C&&(C.style.display=y?"":"none")};h("#ef-destino-wrap",b==="transferencia"),h("#ef-basico-wrap",b!=="transferencia"),h("#ef-irpf-wrap",b==="ingreso"),h("#ef-clasificacion-wrap",b==="gasto")}function f(p,b,h){const I=document.getElementById("modal-overlay"),$=document.getElementById("modal-content");!I||!$||($.innerHTML=`<div class="modal-title">${g(b)}</div>${l(p)}`,I.classList.remove("hidden"),Y($,"#ef-tipo",()=>m($)),Y($,"[data-dp-modo]",()=>Xa($)),Y($,'[data-reparto-modo="consumo"]',()=>Tt($,"consumo")),Y($,'[data-reparto-modo="pago"]',()=>Tt($,"pago")),T($,"[data-cancelar]",()=>I.classList.add("hidden")),T($,"[data-guardar]",y=>{x($,y.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),h())}))}function x(p,b){const h=P=>{var M;return((M=p.querySelector(P))==null?void 0:M.value)??""},I=P=>{var M;return!!((M=p.querySelector(P))!=null&&M.checked)},$=h("#ef-tipo")||"gasto",y=$==="transferencia",C=h("#ef-concepto").trim(),S=parseFloat(h("#ef-cuantia"));if(!C||!Number.isFinite(S))return j("Concepto y cuantía obligatorios","err"),!1;const A=h("#ef-clasificacion"),_={concepto:C,tipo:$,cuantia:S,frecuencia:parseInt(h("#ef-frecuencia"),10)||1,tipoFrecuencia:h("#ef-tipo-frec")||"mensual",fechaInicio:h("#ef-fecha-ini"),fechaFin:h("#ef-fecha-fin")||null,diaPago:Za(p),cuenta:h("#ef-cuenta"),cuentaDestino:y?h("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!y&&I("#ef-basico"),sujetoIRPF:!y&&I("#ef-sujetoIRPF"),clasificacion:$==="gasto"?A||null:void 0,tags:y?["transferencia"]:h("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),repartoConsumo:y?void 0:zt(p,"consumo"),repartoPago:y?void 0:zt(p,"pago")};return b?(t.store.updateItem("expenses",b,_),j("Actualizado")):(t.store.addItem("expenses",_),j("Creado")),o(),!0}function w(p,b){const h=p.querySelector("[data-busqueda]");let I;h==null||h.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{e.busqueda=h.value,b();const $=p.querySelector("[data-busqueda]");$==null||$.focus(),$==null||$.setSelectionRange($.value.length,$.value.length)},250)}),Y(p,"[data-expirados]",$=>{e.mostrarExpirados=$.checked,b()}),Y(p,"[data-f-tipo]",$=>{e.tipo=$.value,b()}),Y(p,"[data-f-cuenta]",$=>{e.cuenta=$.value,b()}),Y(p,"[data-f-desde]",$=>{e.desde=$.value,b()}),Y(p,"[data-f-hasta]",$=>{e.hasta=$.value,b()}),T(p,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,b()}),T(p,"[data-limpiar-tags]",()=>{e.tags=new Set,b()}),T(p,"[data-tag]",$=>{const y=$.getAttribute("data-tag");e.tags.has(y)?e.tags.delete(y):e.tags.add(y),b()}),T(p,"[data-orden]",$=>{const y=$.getAttribute("data-orden");e.orden===y?e.sentido=e.sentido===1?-1:1:(e.orden=y,e.sentido=1),b()}),T(p,"[data-nuevo]",()=>f(null,"Nuevo gasto/ingreso",b)),T(p,"[data-editar]",$=>{const y=t.store.get("expenses").find(C=>C._id===$.getAttribute("data-editar"));y&&f(y,"Editar",b)}),T(p,"[data-duplicar]",$=>{const y=t.store.get("expenses").find(A=>A._id===$.getAttribute("data-duplicar"));if(!y)return;const{_id:C,...S}=y;f({...S,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",b)}),T(p,"[data-borrar]",$=>{et("¿Eliminar?")&&(t.store.removeItem("expenses",$.getAttribute("data-borrar")),j("Eliminado"),o(),b())}),Y(p,"[data-activo]",$=>{const y=$;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),b()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:_s,mount(p){const b=()=>d(p);d(p),p.dataset.wired!=="1"&&(w(p,b),p.dataset.wired="1")}}}function ie(t,a,e){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(a,e,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function eo(t,a,e,o){return t.reduce((n,s)=>{const i=pt(a,e,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Ds(t,a,e){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=J({...t,amortizaciones:o.slice(0,s)}),r=J({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ie(i.tabla,a,e)-ie(r.tabla,a,e)}})}const ze=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${g(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function Ts(t,a){const e=ta(t),o=(t.amortizaciones||[]).length>0,n=a.periodos.length>0,s=a.usarInflacion&&n,i=n?ea(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=n?aa(t.tin||0,i):null,c=o&&n?Ds(t,a.periodos,a.hoy):[],u=c.length?ie(e.sinAmort.tabla,a.periodos,a.hoy)-ie(e.tabla,a.periodos,a.hoy):null,v=u===null?null:u-e.costeTotalAmort,d=s?eo(e.tabla,a.periodos,a.hoy,e.comAp):null,l=s&&o?eo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${g(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${g(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const m=Te(t.repartoConsumo,t.repartoPago,a.personas);return m?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${g(m)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(m=>`<span class="tag">${g(m)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${g(t.tin)}%</span>
        <span class="text-sm">${g(E(e.cuota))}/mes</span>
        <span class="text-sm">${g(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${g(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${g(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${g(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${g(t._id)}">

      <div class="grid-4 mb-12">
        ${ze("Cuota mensual",g(E(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${g(E(a.cuotaMes))}</div>`:"")}
        ${ze("Total intereses",g(E(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${g(E(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${g(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${g(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${ze("Total pagado",g(E(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${g(E(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${g(Je(e.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${g(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${g(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${g(E(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${g(E(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${g(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${g(fe(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${g(t._id)}">+ Amortizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${g(E(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${g(E(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${g(E(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${g(E(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(v??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${g(E(v??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${g(E(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${g(E(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${g(E(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?zs(t,e.totalPagado,d,l):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(m=>js(m,s,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((m,f)=>qs(t._id,m,c[f]??null)).join("")}`:""}
    </div>
  </div>`}function zs(t,a,e,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${g(E(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${g(E(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${g(E(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=a-e,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${g(E(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${g(E(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${g(E(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function js(t,a,e){let o="";if(a&&!t.esAmortizacion){const n=pt(e.periodos,e.hoy,t.fecha);o=g(E(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":g(t.mes)}</td>
    <td class="num">${g(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":g(E(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${g(E(t.interes))}</td>
    <td class="num">${g(E(t.amortizacion))}</td>
    <td class="num">${g(E(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function qs(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${g(a.fecha)}</span>
    <span class="num">${g(E(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${g(E(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${g(E(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${g(t)}|${g(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${g(t)}|${g(a._id)}">✕</button>
  </div>`}const X=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${g(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${g(o)}" placeholder="${g(n)}"/></div>`,Jt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${g(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${g(n)}"${n===o?" selected":""}>${g(s)}</option>`).join("")}
   </select></div>`,Qt=(t,a,e,o="")=>`<label class="form-label">${g(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${g(o)}</span>`:""}`,Ns=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${g(e._id)}"${e._id===a?" selected":""}>${g(e.nombre)}</option>`).join("");function Rs(t,a,e,o=V()){return`
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
            <select class="form-select" id="f-cuenta">${Ns(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Qa(t==null?void 0:t.diaPago,"loan")}
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
          <input class="form-input" type="text" id="f-tags" value="${g(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
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
      <button class="btn-primary" data-guardar-loan="${g((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ls(t,a,e=V()){return`
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
      <button class="btn-primary" data-guardar-amort="${g(t)}|${g((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Os="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ks(t){const a=t.hoy??V;let e=!1;const o=new Set;let n=null;const s=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)};function i(y){const C=y.filter(A=>A.activo);if(C.length<2)return"";const S=(A,_)=>`<button class="btn-secondary btn-sm" data-persona-tab="${A===null?"":g(A)}"
               style="${n===A?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${g(_)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${S(null,"Todas")}
      ${C.map(A=>S(A._id,A.nombre)).join("")}
    </div>`}function r(y){if(!y.activo||y.simulacion)return!1;const C=J(y).tabla.filter(S=>!S.esAmortizacion);return C.length===0?!0:C[C.length-1].fecha<a()}function c(y,C){const S=a(),A=S.slice(0,7),_=new Map;let P=0;for(const M of y){if(!M.activo||M.simulacion||C.has(M._id)||(M.fechaInicio||"")>S)continue;const F=J(M).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(A)),q=F.length>0?F[0].cuota:0;_.set(M._id,q),P+=q}return{porLoan:_,total:P,activos:[..._.values()].filter(M=>M>0).length}}function u(y){const C=a().slice(0,7),S=[];for(const A of y){if(!A.activo||A.simulacion)continue;const _=J(A).tabla.filter(M=>!M.esAmortizacion),P=_[_.length-1];P&&P.fecha.slice(0,7)===C&&S.push({loan:A,cuota:P.cuota})}return S}function v(y){return y.length<=1?y[0]??"":`${y.slice(0,-1).join(", ")} y ${y[y.length-1]}`}function d(y){const C=t.store.get("config"),S=C.dashboardStart,A=C.dashboardEnd,_=Math.max(1,(L(A).getTime()-L(S).getTime())/(30.44*864e5));let P=0;for(const M of y)!M.activo||M.simulacion||(P+=J(M).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=S&&F.fecha<=A).reduce((F,q)=>F+q.cuota,0));return{media:P/_,desde:S,hasta:A}}function l(y){const C=t.store.get("personas"),S=te(C),A=[...t.store.get("loans")].sort((N,H)=>H.tin-N.tin),_=n?A.filter(N=>ve(N.repartoConsumo,N.repartoPago,S).has(n)):A,P=new Set(_.filter(r).map(N=>N._id)),M=e?_:_.filter(N=>!P.has(N._id)),F=c(A,new Set(A.filter(r).map(N=>N._id))),q=d(A),D=u(A),z=t.store.get("config"),R=t.store.get("inflacion"),O=new Date(L(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${P.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${P.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(C)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${g(v(D.map(N=>N.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${g(E(D.reduce((N,H)=>N+H.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${F.total>0||q.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${F.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${g(O)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${g(E(F.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${F.activos} préstamo${F.activos!==1?"s":""} activo${F.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${q.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${g(E(q.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${g(q.desde)} → ${g(q.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(N=>Ts(N,{periodos:R,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:F.porLoan.get(N._id)??0,completado:P.has(N._id),personas:C})).join("")}
      </div>`;for(const N of y.querySelectorAll("[data-body-loan]"))o.has(N.dataset.bodyLoan??"")&&N.classList.add("open")}const m=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),x=()=>{var y;return(y=m())==null?void 0:y.classList.add("hidden")};function w(y,C){const S=m(),A=f();return!S||!A?null:(A.innerHTML=`<div class="modal-title">${g(y)}</div>${C}`,S.classList.remove("hidden"),T(A,"[data-cancelar]",x),A)}function p(y,C){const S=y?t.store.get("loans").find(_=>_._id===y)??null:null,A=w(y?"Editar préstamo":"Nuevo préstamo",Rs(S,t.store.get("accounts"),t.store.get("personas"),a()));A&&(A.addEventListener("change",_=>{const P=_.target;P!=null&&P.matches("[data-dp-modo]")&&Xa(A),P!=null&&P.matches('[data-reparto-modo="consumo"]')&&Tt(A,"consumo"),P!=null&&P.matches('[data-reparto-modo="pago"]')&&Tt(A,"pago")}),T(A,"[data-guardar-loan]",_=>{b(A,_.getAttribute("data-guardar-loan")||"")&&(x(),C())}))}function b(y,C){const S=D=>{var z;return((z=y.querySelector(D))==null?void 0:z.value)??""},A=D=>{var z;return!!((z=y.querySelector(D))!=null&&z.checked)},_=S("#f-nombre").trim(),P=parseFloat(S("#f-capital")),M=parseFloat(S("#f-tin")),F=parseInt(S("#f-meses"),10);if(!_||!Number.isFinite(P)||!Number.isFinite(M)||!Number.isFinite(F))return j("Completa los campos obligatorios","err"),!1;const q={nombre:_,capital:P,tin:M,meses:F,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:Za(y),cuenta:S("#f-cuenta"),simulacion:A("#f-sim"),activo:A("#f-activo"),mostrarFechaFinEnDashboard:A("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:A("#f-basico"),tags:S("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:zt(y,"consumo"),repartoPago:zt(y,"pago")};return C?(t.store.updateItem("loans",C,q),j("Préstamo actualizado")):(t.store.addItem("loans",{...q,amortizaciones:[]}),j("Préstamo creado")),s(),!0}function h(y,C,S){const A=t.store.get("loans").find(M=>M._id===y);if(!A)return;const _=C?(A.amortizaciones||[]).find(M=>M._id===C)??null:null,P=w(C?"Editar amortización":"Añadir amortización",Ls(y,_,a()));P&&T(P,"[data-guardar-amort]",M=>{const[F,q]=(M.getAttribute("data-guardar-amort")||"").split("|");I(P,F,q)&&(x(),S([F]))})}function I(y,C,S){var z;const A=R=>{var O;return((O=y.querySelector(R))==null?void 0:O.value)??""},_=A("#am-fecha"),P=parseFloat(A("#am-cant"));if(!_||!Number.isFinite(P)||P<=0)return j("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(R=>R._id===C);if(!M)return!1;const F={fecha:_,cantidad:P,tipo:A("#am-tipo"),simulacion:!!((z=y.querySelector("#am-sim"))!=null&&z.checked)},q=M.amortizaciones||[],D=S?q.map(R=>R._id===S?{...R,...F}:R):[...q,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",C,{amortizaciones:D}),j(S?"Amortización actualizada":"Amortización añadida"),s(),!0}function $(y,C){T(y,"[data-toggle-finalizados]",()=>{e=!e,C()}),T(y,"[data-persona-tab]",S=>{n=S.getAttribute("data-persona-tab")||null,C()}),T(y,"[data-nuevo-loan]",()=>p(null,C)),T(y,"[data-toggle-loan]",(S,A)=>{var F;if((F=A.target)!=null&&F.closest("button"))return;const _=S.getAttribute("data-toggle-loan"),P=[...y.querySelectorAll("[data-body-loan]")].find(q=>q.dataset.bodyLoan===_);(P==null?void 0:P.classList.toggle("open"))?o.add(_):o.delete(_)}),T(y,"[data-editar-loan]",S=>p(S.getAttribute("data-editar-loan"),C)),T(y,"[data-borrar-loan]",S=>{if(!et("¿Eliminar préstamo?"))return;const A=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",A),o.delete(A),j("Eliminado"),s(),C()}),T(y,"[data-amort-loan]",S=>{const A=S.getAttribute("data-amort-loan");o.add(A),h(A,null,C)}),T(y,"[data-editar-amort]",S=>{const[A,_]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(A),h(A,_,C)}),T(y,"[data-borrar-amort]",S=>{const[A,_]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(M=>M._id===A);P&&(t.store.updateItem("loans",A,{amortizaciones:(P.amortizaciones||[]).filter(M=>M._id!==_)}),j("Amortización eliminada"),s(),C([A]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Os,mount(y){const C=(S=[])=>{for(const A of S)o.add(A);l(y)};l(y),y.dataset.wired!=="1"&&($(y,C),y.dataset.wired="1")}}}const je=6.35;function jt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function ao(t){return Math.max(0,(t.bruto||0)-jt(t))}function Bs(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Hs(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+jt(r),0),o=Math.max(0,a-e),n=ft(a,e),s=new Map;for(const i of t)s.set(i._id,o>0?n*(ao(i)/o):0);return s}function oo(t,a,e){if(t.irpfModo==="manual")return ao(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return rt(ft(t.bruto||0,jt(t)),e);const o=Bs(a.filter(i=>i.irpfModo!=="manual")),n=Hs(a);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return rt(s+r,e)-rt(s,e);s+=r}return rt(ft(t.bruto||0,jt(t)),e)}function Gs(t,a){return t.reduce((e,o)=>e+oo(o,t,a),0)}function Vs(t,a){var n;const e=[...a||[]].sort((s,i)=>s[0]-i[0]);let o=((n=e[0])==null?void 0:n[1])??19;for(const[s,i]of e)if(t>=s)o=i;else break;return o}function Us(t,a){if(!t||t.length===0)return 0;const e=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+jt(s),0);return Vs(ft(e,o),a)}function Ys(t,a,e){const o=t.bruto||0,n=jt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??je,c=s*(r/100),u=oo(t,a,e);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-c-u)/i}}function Ws(t){const a=new Map,e=[];for(const o of t){const n=o.grupoNomina||"";if(!n){e.push(o);continue}const s=a.get(n)??[];s.push(o),a.set(n,s)}return{grupos:a,sueltas:e}}const Ks={transporte:125,restaurante:220,otros:null},Js={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Qs=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],qt=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${g(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${g(o)}" placeholder="${g(n)}"/></div>`,Xs=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${g(e._id)}"${e._id===a?" selected":""}>${g(e.nombre)}</option>`).join("");function Zs(t,a){const e=t.map((s,i)=>{const r=a.find(v=>v._id===s.cuenta),c=Ks[s.tipo],u=c!=null&&s.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${g(Js[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${g(E(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${g(E(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?g(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(s=>`<option value="${g(s._id)}">${g(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function ti(t,a){const e=a.hoy??V(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${Xs(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
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
              ${Qs.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${g(s)} (${i+1})</option>`).join("")}
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
      <button class="btn-primary" data-guardar-nomina="${g((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function no(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},n=e("#nf-npagas"),s=n==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",je),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:zt(t,"consumo"),repartoPago:zt(t,"pago")}}function ei(t,a,e,o){const n=no(t,a),s=a.reduce((p,b)=>p+(b.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),c=n.irpfModo==="manual"?i*(n.irpfPct/100):rt(ft(n.bruto,s),e.tramos),u=i-r-c,v=i/n.nPagas,d=r/n.nPagas,l=c/n.nPagas,m=v-d-l,f=n.grupoNomina?e.nominas.filter(p=>p.grupoNomina===n.grupoNomina&&p._id!==o):[],x=f.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${g(n.grupoNomina)}" con ${g(f.map(p=>p.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",w=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${g(E(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${g(E(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${g(E(n.bruto))}</span>
      ${w}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${g(E(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${g(E(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${g(E(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${g(E(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${g(E(m))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${g(E(m))}/paga`:`ingreso ${g(E(v))} − SS ${g(E(d))} − IRPF ${g(E(l))}`}${s>0?" + recargas flex":""}</span>
    </div>${x}`}function ai(t,a,e,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Zs(a,e.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=ei(t,a,e,o))},i=()=>{var c,u;const r=(v,d)=>{const l=t.querySelector(v);l&&(l.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),Y(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),Y(t,'[data-reparto-modo="consumo"]',()=>Tt(t,"consumo")),Y(t,'[data-reparto-modo="pago"]',()=>Tt(t,"pago")),T(t,"[data-flex-anadir]",()=>{var u,v,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",c=parseFloat(((v=t.querySelector("#fc-importe"))==null?void 0:v.value)??"")||0;if(!c)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),T(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const so=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function oi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??$t;function r(l,m){const f=o(),x=n();return!f||!x?null:(x.innerHTML=`<div class="modal-title">${g(l)}</div>${m}`,f.classList.remove("hidden"),T(x,"[data-cerrar]",s),x)}function c(){a=null;const l=[...t.store.get("tramosIRPFHistorico")].sort((x,w)=>x.año-w.año),m="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${m}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${g(so(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${l.map(x=>`<div style="${m}">
              <span style="font-weight:600;font-size:13px">${x.año}</span>
              <span class="text-sm" style="color:var(--text2)">${g(so(x.tramos))}</span>
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
      </div>`);f&&(T(f,"[data-editar-tabla]",x=>{const w=x.getAttribute("data-editar-tabla");d(w==="default"?"default":Number(w))}),T(f,"[data-borrar-tabla]",x=>{const w=Number(x.getAttribute("data-borrar-tabla"));et(`¿Eliminar la tabla del ejercicio ${w}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(p=>p.año!==w)),j(`Tabla ${w} eliminada`),t.onDatosCambiados(),c())}),T(f,"[data-anadir-anyo]",()=>{var p;const x=parseInt(((p=f.querySelector("#irpf-new-year"))==null?void 0:p.value)??"",10);if(!x||x<2e3||x>2100)return j("Año inválido","err");const w=t.store.get("tramosIRPFHistorico");if(w.some(b=>b.año===x))return j("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...w,{_id:Date.now().toString(36),año:x,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),d(x)}))}function u(){return e.map(([l,m],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${f}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${f}" value="${m}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function v(l){e=[...l.querySelectorAll("[data-tr-min]")].map((f,x)=>{const w=l.querySelector(`[data-tr-pct="${x}"]`);return[parseFloat(f.value)||0,parseFloat((w==null?void 0:w.value)??"")||0]})}function d(l){var b;a=l;const m=t.store.get("tramosIRPFHistorico");e=(l==="default"?i():((b=m.find(h=>h.año===l))==null?void 0:b.tramos)??i()).map(h=>[...h]);const x=l==="default"?"tabla por defecto":`ejercicio ${l}`,w=r(`Tramos IRPF — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${g(x)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!w)return;const p=()=>{const h=w.querySelector("#irpf-tramos-rows");h&&(h.innerHTML=u())};T(w,"[data-volver]",c),T(w,"[data-tr-anadir]",()=>{v(w),e.push([0,0]),p()}),T(w,"[data-tr-borrar]",h=>{v(w),e.splice(Number(h.getAttribute("data-tr-borrar")),1),p()}),T(w,"[data-tr-guardar]",()=>{v(w);const h=[...e].sort((I,$)=>I[0]-$[0]);if(h.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:h}),j("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===a?{...I,tramos:h}:I)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const io=1500,St=(t,a,e,o,n="")=>`<div class="form-group"><label class="form-label">${g(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${g(o)}" placeholder="${g(n)}"/></div>`,ni=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${g(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([n,s])=>`<option value="${g(n)}"${n===o?" selected":""}>${g(s)}</option>`).join("")}
   </select></div>`,si=t=>(t.modeloFondo||"cuenta")==="pension";function ii(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>ri(n,a,e,o)).join("")}</div>`}function ri(t,a,e,o){const n=he(t);if(!n)return"";const s=ye(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,v)=>u+v.cantidad,0),c=Math.min(r,io)*(s/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${g(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${g(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${g(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${g(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${g(E(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${g(E(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${g(E(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${g(E(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${g(E(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${g(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>io?"neg":""}">${g(E(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${g(E(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${g(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${g(n.proxDesbloqueo)}</div>`:""}
  </div>`}function ci(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${g(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${g(E(e.importe))} / ${g(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${g(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function li(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${ni("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
        ${n.map(i=>`<option value="${g(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${g(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${g((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${g((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function di(t,a,e){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=ci(a))};Y(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function ui(t,a,e,o){var w;const n=p=>{var b;return((b=t.querySelector(p))==null?void 0:b.value)??""},s=(p,b=0)=>{const h=parseFloat(n(p));return Number.isFinite(h)?h:b},i=p=>{var b;return!!((b=t.querySelector(p))!=null&&b.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=s("#pen-saldo"),u=n("#pen-grupo"),v={nombre:r,grupoNomina:u,saldo:c,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:a,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],l=[...(e==null?void 0:e.aportaciones)??[]],f=((w=[...d].sort((p,b)=>b.fecha.localeCompare(p.fecha))[0])==null?void 0:w.saldo)??(e==null?void 0:e.saldo)??null,x=Date.now().toString(36);return e?(f===null||Math.abs(c-f)>.005)&&(d.push({_id:x,fecha:o,saldo:c,nota:"Actualización manual"}),c>(f??0)&&l.push({_id:`${x}a`,fecha:o,cantidad:c-(f??0)})):c>0&&(d.push({_id:x,fecha:o,saldo:c,nota:"Saldo inicial"}),l.push({_id:`${x}a`,fecha:v.fechaInicialSaldo??o,cantidad:c})),{datos:{...v,historicoSaldos:d,aportaciones:l}}}const pi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function mi(t){const a=t.hoy??V,e=()=>{var b;return(b=t.onDatosCambiados)==null?void 0:b.call(t)};let o=null;function n(b){const h=b.filter($=>$.activo);if(h.length<2)return"";const I=($,y)=>`<button class="btn-secondary btn-sm" data-persona-tab="${$===null?"":g($)}"
               style="${o===$?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${g(y)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${I(null,"Todas")}
      ${h.map($=>I($._id,$.nombre)).join("")}
    </div>`}function s(){const b=t.store.get("config");return Bt(t.store.get("tramosIRPFHistorico"),b.tramos_irpf??$t)(Number(a().slice(0,4)))}function i(b,h,I){const $=Ys(b,h,I),y=!!h&&b.irpfModo!=="manual",C=Te(b.repartoConsumo,b.repartoPago,t.store.get("personas")),S=[b.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${b.mesActualizacionIPC}">IPC m${b.mesActualizacionIPC}</span>`:"",$.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${g(E($.flexAnual))}/año</span>`:"",Math.abs($.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${$.ssPct.toFixed(2)}%</span>`:"",C?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${g(C)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${g(b.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${S}</div>
      </div>
      <div class="num">${g(E($.brutoAnual))}
        ${$.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${g(E($.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${g(E($.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${$.nPagas} pagas</div>
      <div class="text-sm ${y?"neg":""}">${b.irpfModo==="manual"?`${g(b.irpfPct??0)}% (manual)`:`${$.irpfPct.toFixed(1)}% (auto)`}${y?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${b.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${g(r(b.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${g(b._id)}"${b.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${g(b._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${g(b._id)}">✕</button>
      </div>
    </div>`}const r=b=>{var h;return((h=t.store.get("accounts").find(I=>I._id===(b||"default")))==null?void 0:h.nombre)??(b||"default")};function c(b,h,I){const $=h.reduce((S,A)=>S+(A.bruto||0),0),y=Gs(h,I),C=$>0?y/$*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${g(b)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${g(E($))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${C.toFixed(1)}%</strong> (${g(E(y))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${h.map(S=>i(S,h,I)).join("")}
      </div>
    </div>`}function u(b){const h=s(),I=t.store.get("personas"),$=te(I),y=[...t.store.get("nominas")].sort((M,F)=>(F.bruto||0)-(M.bruto||0)),C=o?y.filter(M=>ve(M.repartoConsumo,M.repartoPago,$).has(o)):y,{grupos:S,sueltas:A}=Ws(C),_=t.store.get("accounts").filter(si),P=y.filter(M=>M.activo!==!1);b.innerHTML=`
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
      ${C.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...S.entries()].map(([M,F])=>c(M,F,h)).join("")}
      ${A.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${A.map(M=>i(M,null,h)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${ii(_,P,h,a())}</div>`}const v=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),l=()=>{var b;return(b=v())==null?void 0:b.classList.add("hidden")};function m(b,h){const I=v(),$=d();return!I||!$?null:($.innerHTML=`<div class="modal-title">${g(b)}</div>${h}`,I.classList.remove("hidden"),T($,"[data-cancelar]",l),$)}function f(b,h){const I=b?t.store.get("nominas").find(S=>S._id===b)??null:null,$=[...(I==null?void 0:I.retribucionFlexible)??[]].map(S=>({...S})),y={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:s(),hoy:a()},C=m(b?"Editar nómina":"Nueva nómina",ti(I,y));C&&(ai(C,$,y,b??""),T(C,"[data-guardar-nomina]",S=>{const A=no(C,$);if(!A.nombre||A.bruto<=0)return j("Nombre y bruto anual son obligatorios","err");const _=S.getAttribute("data-guardar-nomina")||"",P={...A,activo:!0,tags:["nomina"]};_?(t.store.updateItem("nominas",_,P),j("Nómina actualizada")):(t.store.addItem("nominas",P),j("Nómina creada")),e(),l(),h()}))}function x(b,h){const I=b?t.store.get("accounts").find(C=>C._id===b)??null:null,$=[...(I==null?void 0:I.planAportaciones)??[]].map(C=>({...C})),y=m(b?"Editar plan de pensiones":"Nuevo plan de pensiones",li(I,{nominas:t.store.get("nominas"),hoy:a()}));y&&(di(y,$,a()),T(y,"[data-guardar-pension]",C=>{const{datos:S,error:A}=ui(y,$,I,a());if(A)return j(A,"err");const _=C.getAttribute("data-guardar-pension")||"";_?(t.store.updateItem("accounts",_,S),j("Plan actualizado")):(t.store.addItem("accounts",S),j("Plan creado")),e(),l(),h()}))}function w(b,h,I){T(b,"[data-persona-tab]",$=>{o=$.getAttribute("data-persona-tab")||null,h()}),T(b,"[data-nueva-nomina]",()=>f(null,h)),T(b,"[data-editar-nom]",$=>f($.getAttribute("data-editar-nom"),h)),T(b,"[data-borrar-nom]",$=>{et("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",$.getAttribute("data-borrar-nom")),j("Eliminada"),e(),h())}),Y(b,"[data-activo-nom]",$=>{const y=$;t.store.updateItem("nominas",y.getAttribute("data-activo-nom"),{activo:y.checked}),e(),h()}),T(b,"[data-tramos]",()=>I.abrir()),T(b,"[data-nueva-pension]",()=>x(null,h)),T(b,"[data-editar-pension]",$=>x($.getAttribute("data-editar-pension"),h)),T(b,"[data-borrar-pension]",$=>{et("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",$.getAttribute("data-borrar-pension")),j("Plan eliminado"),e(),h())})}let p=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:pi,mount(b){const h=()=>u(b);p??(p=oi({store:t.store,onDatosCambiados:()=>{e(),h()},año:()=>Number(a().slice(0,4))})),u(b),b.dataset.wired!=="1"&&(w(b,h,p),b.dataset.wired="1")}}}const fi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",gi="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",ro={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},vi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function bi(t,a){const e=t.filter(c=>c.activo&&st(c)==="inversion");if(e.length===0)return"";let o=0,n=0,s=0,i=0;for(const c of e){const u=ee(c,a);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${g(E(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${g(E(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${g(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${g(E(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${g(E(i))}</div><div class="stat-sub">Neto: ${g(E(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function hi(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,n=Math.max(1,(L(o).getTime()-L(e).getTime())/(30.44*864e5)),s=Rt(t,e),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=s*(pt(a.inflacion,e,o)-1),u=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${g(E(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${g(E(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${g(e.slice(0,7))} → ${g(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${g(E(i))}</span>
    </div>${r}
  </div>`}function yi(t,a){const e=ro[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,n=a.nominas.flatMap(m=>(m.retribucionFlexible??[]).filter(f=>f.cuenta===t._id).map(f=>({nomina:m,importe:f.importe}))),s=n.reduce((m,f)=>m+f.importe,0),i=s*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,u=t.grupoNomina?a.nominas.filter(m=>(m.grupoNomina||"")===t.grupoNomina&&m.activo!==!1):n.slice(0,1).map(m=>m.nomina),v=Us(u,a.tramosIRPF),d=c*v/100,l=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${v}%`:`tipo marginal ${v}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${g(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${g(E(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${g(E(i))}/año${r?` ⚠ excede límite ${g(E(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${g(E(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${g(l)}">≈ ${g(E(d))}/año <span style="font-size:10px;color:var(--text3)">(${g(v)}%)</span></span></div>`:""}
    ${n.length>0?n.map(m=>`<div style="font-size:11px;color:var(--text3)">↩ ${g(m.nomina.nombre)}: ${g(E(m.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function $i(t){const a=he(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${g(E(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${g(E(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${g(E(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${g(E(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${g(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${g(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function xi(t,a){const e=ee(t,a.tramosGanancias);if(!e)return"";const o=a.config,n=a.flujos(t._id),s=L(o.dashboardStart),i=L(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),c=e.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,v=c>0&&r>0?Math.max(0,c*Math.pow(1+u,r)):Math.max(0,c),d=e.costBase+n.totalAportaciones,l=Math.max(0,v-d),m=be(l,a.tramosGanancias),f=l>0?(m/l*100).toFixed(1):"0",x=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",w=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",p=(C,S,A)=>C.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${g(_.contraparte)}: ${g(_.concepto)}</span>
          <span class="num ${A}">${g(E(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),h=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${g(o.dashboardStart.slice(0,7))} → ${g(o.dashboardEnd.slice(0,7))})</div>
         ${p(n.entradas,"↓","pos")}
         ${p(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${g(E(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${g(E(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${g(E(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=a.invModo(t._id),$=C=>`padding:3px 10px;border-radius:20px;border:1px solid ${C?"var(--accent)":"var(--border)"};background:${C?"var(--accent-dim)":"transparent"};color:${C?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${g(E(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${g(E(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${g(E(e.neto))}</div><div class="stat-sub">${g(w)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${g(E(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${g(E(v))}</div><div class="stat-sub">${g(x)} · ${g(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${g(E(v-m))}</div><div class="stat-sub">${g(f)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${g(t._id)}|real" style="${$(I==="real")}">Real</button>
          <button data-inv-modo="${g(t._id)}|proyeccion" style="${$(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${h}
    </div>`}function Ii(t,a){const e=[...t.historicoSaldos||[]].sort((c,u)=>u.fecha.localeCompare(c.fecha)),o=e[0],n=mt(t),s=st(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${g((ro[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${g(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${g(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${g(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${gi}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${g(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${fi}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${g(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${g(E(t.saldoInicial||0))}</div><div class="stat-sub">${g(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${g(E(n))}</div>${o?`<div class="stat-sub">Registro: ${g(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${g(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${g(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${hi(t,a)}
    ${s==="beneficio"?yi(t,a):""}
    ${s==="pension"?$i(t):""}
    ${s==="inversion"?xi(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${g(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${g(t.descripcion)}</div>`:""}
  </div>`}const wi=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Ci(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${g(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${g(E(e.importe))} / ${g(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${g(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Si(t,a){const e=t?st(t):"cuenta",o=[...new Set(a.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${X("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Jt("ac-modelo","Tipo",wi,e)}
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
              ${o.map(s=>`<option value="${g(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${g(s)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${g((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${g((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ai(t,a,e){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Ci(a))};Y(t,"#ac-modelo",n=>{const s=n.value,i=(r,c)=>{const u=t.querySelector(r);u&&(u.style.display=c?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,c;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return j("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{a.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Mi(t,a,e,o,n){const s=f=>{var x;return((x=t.querySelector(f))==null?void 0:x.value)??""},i=(f,x=0)=>{const w=parseFloat(s(f));return Number.isFinite(w)?w:x},r=f=>{var x;return!!((x=t.querySelector(f))!=null&&x.checked)},c=s("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",v=u==="beneficio",d=i("#ac-saldo"),l={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:u,planAportaciones:a,tipoBeneficio:v?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:v?s("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:l};if(!(o===null||Math.abs(d-o)>.005))return{datos:l};if(u==="inversion"&&d>(o??0)){const f=Date.now().toString(36);l.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${f}a`,fecha:e?n:l.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:l,punto:{fecha:n,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function qe(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:W(a.saldoCts),nota:a.nota}))}function Ei(t,a,e,o,n){const s=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${g(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${g(E(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${g(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${g(a)}|${g(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${g(a)}|${g(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${g(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${g(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${g(a)}">Añadir</button>
    </div>`}const co=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function _i(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Lt;function r(l,m){const f=o(),x=n();return!f||!x?null:(x.innerHTML=`<div class="modal-title">${g(l)}</div>${m}`,f.classList.remove("hidden"),T(x,"[data-cerrar]",s),x)}function c(){a=null;const l=[...t.store.get("tramosGananciasCapitalHistorico")].sort((x,w)=>x.año-w.año),m="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",f=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${m}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${g(co(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${l.map(x=>`<div style="${m}">
              <span style="font-weight:600;font-size:13px">${x.año}</span>
              <span class="text-sm" style="color:var(--text2)">${g(co(x.tramos))}</span>
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
      </div>`);f&&(T(f,"[data-editar-tg]",x=>{const w=x.getAttribute("data-editar-tg");d(w==="default"?"default":Number(w))}),T(f,"[data-borrar-tg]",x=>{const w=Number(x.getAttribute("data-borrar-tg"));et(`¿Eliminar la tabla del ejercicio ${w}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(p=>p.año!==w)),j(`Tabla ${w} eliminada`),t.onDatosCambiados(),c())}),T(f,"[data-anadir-anyo-tg]",()=>{var p;const x=parseInt(((p=f.querySelector("#tg-new-year"))==null?void 0:p.value)??"",10);if(!x||x<2e3||x>2100)return j("Año inválido","err");const w=t.store.get("tramosGananciasCapitalHistorico");if(w.some(b=>b.año===x))return j("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...w,{_id:Date.now().toString(36),año:x,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),d(x)}))}function u(){return e.map(([l,m],f)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${f}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${f}" value="${m}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${f}">✕</button>
          </div>
        </div>`).join("")}function v(l){e=[...l.querySelectorAll("[data-tg-min]")].map((m,f)=>{const x=l.querySelector(`[data-tg-pct="${f}"]`);return[parseFloat(m.value)||0,parseFloat((x==null?void 0:x.value)??"")||0]})}function d(l){var p;a=l;const m=t.store.get("tramosGananciasCapitalHistorico");e=(l==="default"?i():((p=m.find(b=>b.año===l))==null?void 0:p.tramos)??i()).map(b=>[...b]);const x=r(`Ganancias de capital — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!x)return;const w=()=>{const b=x.querySelector("#tg-rows");b&&(b.innerHTML=u())};T(x,"[data-volver-tg]",c),T(x,"[data-tg-anadir]",()=>{v(x),e.push([0,0]),w()}),T(x,"[data-tg-borrar]",b=>{v(x),e.splice(Number(b.getAttribute("data-tg-borrar")),1),w()}),T(x,"[data-tg-guardar]",()=>{v(x);const b=[...e].sort((h,I)=>h[0]-I[0]);if(b.length===0)return j("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:b}),j("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(h=>h.año===a?{...h,tramos:b}:h)),j(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Pi=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Fi(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${Pi.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function Di(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ti(t,a){const{ledger:e}=t,o=(t.hoy??V)(),n=t.accounts().filter(b=>b.activo),{desde:s,hasta:i}=Di(a.mes),r={cuentaId:a.cuentaId||void 0,desde:s,hasta:i,texto:a.filtroTexto||void 0},c=e.transacciones(r),u=t.estimaciones().filter(b=>b.tipo!=="transferencia"),v=c.filter(b=>b.importeCts<0).reduce((b,h)=>b+h.importeCts,0),d=c.filter(b=>b.importeCts>0).reduce((b,h)=>b+h.importeCts,0),l=a.cuentaId?e.saldoCuenta(a.cuentaId,i):e.saldoTotal(i),m=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=n.map(b=>`<option value="${g(b._id)}"${b._id===a.cuentaId?" selected":""}>${g(b.nombre)}</option>`).join(""),x=b=>'<option value="">— sin asignar —</option>'+u.map(h=>`<option value="${g(h._id)}"${h._id===b?" selected":""}>${g(h.concepto)} (${g(E(h.cuantia))})</option>`).join(""),w=c.map(b=>{var h;return`
      <tr data-tx="${g(b._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${g(b.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${g(b.concepto)}</td>
        <td style="padding:7px 8px">${Ka(b.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${g(((h=t.accounts().find(I=>I._id===b.cuentaId))==null?void 0:h.nombre)??b.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${g(b._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${x(b.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Ct(W(b.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${g(b._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${g(b._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),p=m.slice().reverse().slice(0,8).map(b=>{var h;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${g(b.fecha)}</span>
        <span style="color:var(--text3)">${g(((h=t.accounts().find(I=>I._id===b.cuentaId))==null?void 0:h.nombre)??b.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${g(E(W(b.saldoCts)))}</span>
        ${b.nota?`<span style="color:var(--text3)">${g(b.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${g(b._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${f}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${g(a.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${g(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Ct(W(v))}</span>
          <span>Ingresos: ${Ct(W(d))}</span>
          <span>Neto: ${Ct(W(d+v))}</span>
          <span style="margin-left:auto">Saldo a ${g(i)}: <strong>${g(E(l))}</strong></span>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg3)">
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${w||'<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${g(o)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(b=>`<option value="${g(b)}"></option>`).join("")}</datalist>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${g(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${f}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${p?`<div class="mt-12">${p}</div>`:""}
        </div>
      </div>
    </div>`}function zi(t,a,e,o){const{ledger:n}=a;Y(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),Y(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{e.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),T(t,"#nt-guardar",()=>{const i=it(t,"#nt-concepto").trim(),r=Ja(t,"#nt-importe");if(!i)return j("Indica un concepto","err");if(!(r>0))return j("Indica un importe mayor que cero","err");const c=it(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:it(t,"#nt-fecha")||(a.hoy??V)(),cuentaId:it(t,"#nt-cuenta"),importe:r,concepto:i,tags:c,tipo:it(t,"#nt-tipo"),estimacionId:it(t,"#nt-estimacion")||null}),j("Movimiento registrado"),a.onDatosCambiados(),o()}),T(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;et("¿Eliminar este movimiento?")&&(n.eliminar(r),j("Movimiento eliminado"),a.onDatosCambiados(),o())}),T(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,c=n.transacciones().find(d=>d._id===r);if(!c)return;const u=window.prompt(`Importe de "${c.concepto}" (€)`,String(Math.abs(W(c.importeCts))));if(u===null)return;const v=parseFloat(u.replace(",","."));if(!Number.isFinite(v)||v<=0)return j("Importe no válido","err");n.actualizar(r,{importe:v}),j("Movimiento actualizado"),a.onDatosCambiados(),o()}),Y(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),j("Asignación actualizada"),a.onDatosCambiados()}),T(t,"#pc-guardar",()=>{if(it(t,"#pc-saldo").trim()==="")return j("Indica el saldo","err");const r=Ja(t,"#pc-saldo");n.registrarPuntoControl(it(t,"#pc-cuenta"),it(t,"#pc-fecha")||(a.hoy??V)(),r,it(t,"#pc-nota").trim()||void 0),j("Saldo real registrado"),a.onDatosCambiados(),o()}),T(t,"[data-pc-borrar]",i=>{et("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),j("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ne(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=U(t.mediaRealReciente),i=U(s-a),r=a!==0?i/Math.abs(a)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:U(a),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo estimado`:`El gasto real de los últimos ${c} meses es inferior a lo estimado`}}function ji(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(s,i,r={}){const c=r.hoy??V(),u=t.get("expenses"),v=u.find(f=>f._id===s);if(!v)throw new Error(`La estimación ${s} no existe`);const d={...v,fechaFin:c},l={...v,_id:a(),cuantia:U(i),fechaInicio:c,fechaFin:v.fechaFin??null,ajustadaDesdeId:v._id,ajustadaEn:c},m=u.map(f=>f._id===s?d:f);return m.push(l),t.set("expenses",m),{estimacionCerrada:d,estimacionNueva:l}}function o(s,i={}){const r=[],c=[];for(const u of s)try{r.push(e(u.estimacionId,u.cuantiaSugerida,i))}catch(v){c.push({estimacionId:u.estimacionId,error:v.message})}return{aplicadas:r,errores:c}}function n(s){const i=t.get("expenses"),r=new Map(i.map(x=>[x._id,x])),c=r.get(s);if(!c)return[];const u=[];let v=c;const d=new Set;for(;v!=null&&v.ajustadaDesdeId&&!d.has(v._id);){d.add(v._id);const x=r.get(v.ajustadaDesdeId);if(!x)break;u.unshift(x),v=x}const l=[];let m=c;const f=new Set([c._id]);for(;;){const x=i.find(w=>w.ajustadaDesdeId===m._id&&!f.has(w._id));if(!x)break;f.add(x._id),l.push(x),m=x}return[...u,c,...l]}return{aplicar:e,aplicarTodas:o,cadena:n}}function Re(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const n=e.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ne(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function qi(t){const a=Re(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),n=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=e.map(({analisis:c,estimacion:u,sugerencia:v})=>{const d=c.meses.slice(-6).map(l=>`${Pe(l.mes)}: ${E(l.estimado)} → ${E(l.real)} (${l.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${g(u.concepto)}</div>
          <div style="margin-top:3px">${Ka(c.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${g(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${g(E(c.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${g(E(c.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Ct(c.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Wa(c.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${v?`<button class="btn-secondary" data-sugerir="${g(c.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${g(v.motivo)}">Sugerir ajuste → ${g(E(v.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${g(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${g(E(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${g(E(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Ct(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Wa(c.precision)}</td>
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
    </div>`}function Ni(t,a,e){T(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Re(a).find(c=>c.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${E(i.cuantiaActual)}
Nueva estimación: ${E(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;et(r)&&(a.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:a.hoy()}),j(`Estimación ajustada a ${E(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),T(t,"#ajustar-todas",()=>{const o=Re(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${E(r.cuantiaActual)} → ${E(r.cuantiaSugerida)}`).join(`
`);if(!et(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});j(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Ri=[";",",","	","|"],Li={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function re(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ce(t,a){const e=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Oi(t){let a=";",e=-1;for(const o of Ri){const n=t.slice(0,20).map(c=>ce(c,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(c=>c===s).length*10+s;r>e&&(e=r,a=o)}return a}function Xt(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),n=a.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const v=s===","?o:n;i=a.slice(0,v).replace(/[.,]/g,""),r=a.slice(v+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(c);return Number.isFinite(u)?e?-u:u:null}function Le(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return lo(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),lo(o,Number(e[2]),Number(e[1]))}return null}function lo(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function uo(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Le(e)!==null).length/a.length}function po(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Xt(e)!==null).length/a.length}function ki(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>a.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=re(t[i]);if(r&&Li[s].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(s==="importe"&&re(t[i]).includes("saldo"))continue;e[s]=i,o.add(i);break}}if(e.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=uo(n(r));c>i&&(i=c,s=r)}s>=0&&(e.fecha=s,o.add(s))}if(e.importe<0&&e.debe<0&&e.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||re(t[r]).includes("saldo"))continue;const c=po(n(r));c>i&&(i=c,s=r)}s>=0&&(e.importe=s,o.add(s))}if(e.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=n(r);if(po(c)>.5||uo(c)>.5)continue;const u=c.reduce((v,d)=>v+d.length,0)/Math.max(1,c.length);u>i&&(i=u,s=r)}s>=0&&(e.concepto=s)}return e}function Bi(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(v=>v.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Oi(a),o=a.map(v=>ce(v,e).length),n=Math.max(...o);let s=o.findIndex(v=>v===n);s<0&&(s=0);const i=ce(a[s],e);let r=a.slice(s+1).map(v=>ce(v,e));const c=Le(i[0]??"")!==null||i.some(v=>Xt(v)!==null&&/\d/.test(v));c&&(r=[i,...r]);const u=ki(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((v,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function mo(t,a,e){return`${t}|${a}|${re(e).replace(/\s+/g," ")}`}function Hi(t,a,e=[]){const o=new Set(e.map(s=>mo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],c=a.fecha>=0?Le(s[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${s[a.fecha]??""}»`);let u=null;if(a.importe>=0)u=Xt(s[a.importe]??""),u===null&&r.push(`importe ilegible: «${s[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const l=a.debe>=0?Xt(s[a.debe]??""):null,m=a.haber>=0?Xt(s[a.haber]??""):null;l===null&&m===null?r.push("sin importe en Debe ni en Haber"):l!==null&&l!==0?u=-Math.abs(l):m!==null&&m!==0?u=Math.abs(m):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const v=(a.concepto>=0?s[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&u!==null){const l=mo(c,u,v);d=o.has(l)||n.has(l),n.add(l)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:v,importeCts:u,errores:r,duplicada:d}})}function Gi(t,a){const e=t.filter(n=>n.errores.length===0&&(a||!n.duplicada)),o=e.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:e.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:e.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function le(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Vi=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Oe(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Hi(a.analisis,a.mapeo,e)}function Ui(t,a){const e=t.accounts().filter(n=>n.activo);if(!a.abierto)return`
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
      </div>`;const o=e.map(n=>`<option value="${g(n._id)}"${n._id===a.cuentaId?" selected":""}>${g(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${a.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${g(a.error)}</div></div>`:""}

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

      ${a.analisis&&a.mapeo?Wi(a,a.analisis,a.mapeo):Yi()}
    </div>`}function Yi(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Wi(t,a,e){const o=Gi(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,u)=>`<option value="${u}"${u===r?" selected":""}>${g(c||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${g(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${g(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Vi.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${g(r.etiqueta)}</label>
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
        <div class="stat-value" style="font-size:1.15rem">${Ct(W(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${g(o.desde)} → ${g(o.hasta??"")}`:"—"}</div>
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
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${g(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
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
                <td style="font-family:var(--font-mono);font-size:12px">${g(r.fecha??"—")}</td>
                <td style="font-size:12px">${g(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":g(E(W(r.importeCts)))}</td>
                <td style="font-size:11px;color:${v}">${g(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Ki(t,a,e,o){T(t,"[data-imp-abrir]",()=>{const s=a.accounts().filter(i=>i.activo);Object.assign(e,le(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),T(t,"[data-imp-cerrar]",()=>{Object.assign(e,le()),o()}),Y(t,"#imp-cuenta",s=>{e.cuentaId=s.value,Oe(a,e),o()}),Y(t,"#imp-duplicadas",s=>{e.incluirDuplicadas=s.checked,o()}),Y(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),Oe(a,e),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Ji(s).then(r=>{const c=Bi(r);e.nombreFichero=s.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},Oe(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),T(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const s=e.filas.filter(i=>i.errores.length===0&&(e.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)a.ledger.registrar({fecha:i.fecha,cuentaId:e.cuentaId,importe:Math.abs(W(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});j(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(e,le()),a.onDatosCambiados(),o()}})}function Ji(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}function Qi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Xi(t,a){const e=L(t),o=[];for(let n=1;n<=a;n++){const s=new Date(e.getFullYear(),e.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Zi(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function fo(t,a){const{inicio:e,fin:o}=Zi(a);return Ot([t],{start:e,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function tr(t){function a(n,s={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=V()}=s,u=t.transacciones({estimacionId:n._id}),d=u.length===0&&(((I=n.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:n.tags}):u,l=new Map;for(const $ of d){const y=$.fecha.slice(0,7);l.set(y,(l.get(y)??0)+Math.abs($.importeCts)/100)}const m=[];for(const $ of Xi(c,i)){const y=l.get($);if(y===void 0)continue;const C=U(fo(n,$));m.push({mes:$,estimado:C,real:U(y),desviacion:U(y-C),precision:Qi(C,y)})}const f=U(m.reduce(($,y)=>$+y.estimado,0)),x=U(m.reduce(($,y)=>$+y.real,0)),w=m.reduce(($,y)=>$+Math.abs(y.estimado),0),p=m.length===0?null:w>0?m.reduce(($,y)=>$+y.precision*Math.abs(y.estimado),0)/w:m.reduce(($,y)=>$+y.precision,0)/m.length,b=m.slice(-r),h=b.length>0?U(b.reduce(($,y)=>$+y.real,0)/b.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:m,estimadoTotal:f,realTotal:x,desviacionTotal:U(x-f),precision:p,mediaRealReciente:h,infraestimada:x>f}}function e(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>a(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,s.set(r,c)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:U(r.estimado),realTotal:U(r.real),desviacionTotal:U(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function er(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function ar(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function or(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function nr(t,a,e){const o=new Map(a.map(s=>[s._id,[]])),n=a.filter(s=>{var i;return!e(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const c of n){const u=(c.tags??[]).filter(v=>s.tags.includes(v)).length;u!==0&&(u>r||u===r&&i&&c._id<i._id)&&(i=c,r=u)}i&&o.get(i._id).push(s)}return o}function sr(t,a,e,o={}){const{desde:n,hasta:s}=er(e),i=t.transacciones({desde:n,hasta:s}),r=i.filter(h=>h.importeCts<0),c=i.filter(h=>h.importeCts>0),u=a.filter(h=>h.tipo==="gasto"&&h.activo!==!1),v=new Map((o.analisis??[]).map(h=>[h.estimacionId,h])),d=new Set(u.filter(h=>t.transacciones({estimacionId:h._id}).length>0).map(h=>h._id)),l=nr(r,u,h=>d.has(h)),m=new Set,f=u.map(h=>{const I=l.get(h._id)??[];for(const S of I)m.add(S._id);const $=U(I.reduce((S,A)=>S+Math.abs(A.importeCts)/100,0)),y=U(fo(h,e)),C=v.get(h._id);return{estimacionId:h._id,concepto:h.concepto,tags:h.tags??[],estimado:y,real:$,desviacion:U($-y),sinMovimiento:I.length===0,sugerencia:C?Ne(C,h.cuantia,{hoy:o.hoy}):null}}),x=new Map;for(const h of r){if(m.has(h._id))continue;const I=or(h.concepto),$=x.get(I)??{concepto:h.concepto,total:0,movimientos:0};$.total=U($.total+Math.abs(h.importeCts)/100),$.movimientos+=1,x.set(I,$)}const w=[...x.values()].sort((h,I)=>I.total-h.total),p=U(f.reduce((h,I)=>h+I.estimado,0)),b=U(r.reduce((h,I)=>h+Math.abs(I.importeCts)/100,0));return{mes:e,estimado:p,real:b,desviacion:U(b-p),ingresosReales:U(c.reduce((h,I)=>h+I.importeCts/100,0)),filas:f.sort((h,I)=>Math.abs(I.desviacion)-Math.abs(h.desviacion)),sinEstimacion:w,totalSinEstimacion:U(w.reduce((h,I)=>h+I.total,0)),vacio:i.length===0}}function go(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}function ir(){return{mes:""}}function ke(t,a){if(a.mes)return a.mes;const e=go(t.ledger),o=ar((t.hoy??V)());return e.includes(o)?o:e[0]??o}function Be(t,a){const e=(t.hoy??V)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:e});return sr(t.ledger,o,a,{analisis:n,hoy:e})}function rr(t,a){const e=ke(t,a),o=go(t.ledger);o.includes(e)||o.unshift(e);const n=Be(t,e),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(c=>`<option value="${g(c)}"${c===e?" selected":""}>${g(Pe(c))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${g(Pe(e))}. Importa el extracto del banco o
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
          <div class="stat-value" style="font-size:1.15rem">${g(E(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${g(E(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${g(E(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${g(E(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${cr(n)}
      ${lr(n)}
    </div>`}function cr(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                  ${g(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${g(E(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${g(E(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${g(E(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${g(o.estimacionId)}"
                           title="Pasar la estimación de ${g(E(s.cuantiaActual))} a ${g(E(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${g(E(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function lr(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
                <td style="font-size:12px">${g(a.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${a.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${g(E(a.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function dr(t,a,e,o){Y(t,"#cie-mes",n=>{e.mes=n.value,o()}),T(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Be(a,ke(a,e)).filas.find(c=>c.estimacionId===s);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??V)()}),j(`«${r.concepto}» ajustada a ${E(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),T(t,"[data-cie-ajustar-todas]",()=>{const s=Be(a,ke(a,e)).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(s,{hoy:(a.hoy??V)()});j(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const ur="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function pr(t){const a=t.hoy??V,e=()=>{var D;return(D=t.onDatosCambiados)==null?void 0:D.call(t)},o=new Map;let n="cuentas";const s={cuentaId:"",mes:a().slice(0,7),filtroTexto:""},i=le(),r=ir(),c=()=>t.store.get("expenses"),u=()=>t.store.get("accounts"),v={ledger:t.ledger,accounts:u,estimaciones:c,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:u,onDatosCambiados:e},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},m={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,hoy:a},f=()=>t.store.get("config"),x=D=>{var z;return((z=t.store.get("accounts").find(R=>R._id===D))==null?void 0:z.nombre)??D},w=()=>Bt(t.store.get("tramosIRPFHistorico"),f().tramos_irpf??$t)(Number(a().slice(0,4))),p=()=>Bt(t.store.get("tramosGananciasCapitalHistorico"),f().tramosGananciasCapital??Lt),b=()=>p()(Number(a().slice(0,4)));function h(){const D=f(),z=t.store.get("accounts"),R=ga({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:z,config:{dashboardStart:D.dashboardStart,dashboardEnd:D.dashboardEnd,fechaReferencia:D.dashboardStart},nominas:[],resolverTramosGanancias:p()}),O=new Map,N=k=>{let B=O.get(k);return B||(B={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},O.set(k,B)),B},H=(k,B)=>{const Q=`${B.sourceId}`,Z=k.find(Ye=>Ye.concepto===Q),at=Z??{concepto:Q,contraparte:"",total:0,ocurrencias:0};at.total+=Math.abs(B.cuantia),at.ocurrencias+=1,Z||k.push(at)};for(const k of R){if(!k.cuenta)continue;const B=N(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(B.totalAportaciones+=Math.abs(k.cuantia),H(B.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(B.totalReembolsos+=Math.abs(k.cuantia),H(B.salidas,k)):k.sourceType==="investment-tax"&&(B.retencion+=Math.abs(k.cuantia))}const K=t.store.get("expenses");for(const k of O.values())for(const[B,Q]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const Z of B){const at=K.find(Ye=>Ye._id===Z.concepto);Z.contraparte=x((at==null?void 0:at[Q])??"default"),Z.concepto=(at==null?void 0:at.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return O}function I(D){const z=n==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let R;if(n==="cuentas"){const H=t.store.get("accounts").filter(B=>st(B)!=="pension"),K=h(),k={config:f(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:w(),tramosGanancias:b(),flujos:B=>K.get(B)??vi,invModo:B=>o.get(B)??"proyeccion"};R=`${bi(H,k.tramosGanancias)}<div class="grid-3">${H.map(B=>Ii(B,k)).join("")}</div>`}else n==="movimientos"?R='<div id="acc-tx"></div>':n==="importar"?R='<div id="acc-import"></div>':R='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';D.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${z}
      </div>
      ${Fi(n)}
      ${R}`;const O=()=>I(D);if(n==="movimientos"){const N=D.querySelector("#acc-tx");N.innerHTML=Ti(v,s),zi(N,v,s,O)}else if(n==="importar"){const N=D.querySelector("#acc-import");N.innerHTML=Ui(d,i),Ki(N,d,i,O)}else if(n==="cierre"){const N=D.querySelector("#acc-cierre"),H=D.querySelector("#acc-precision");N.innerHTML=rr(l,r),H.innerHTML=qi(m),dr(N,l,r,O),Ni(H,m,O)}}const $=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),C=()=>{var D;return(D=$())==null?void 0:D.classList.add("hidden")};function S(D,z){const R=$(),O=y();return!R||!O?null:(O.innerHTML=D?`<div class="modal-title">${g(D)}</div>${z}`:z,R.classList.remove("hidden"),T(O,"[data-cancelar]",C),O)}function A(D,z){const R=D?t.store.get("accounts").find(K=>K._id===D)??null:null,O=[...(R==null?void 0:R.planAportaciones)??[]].map(K=>({...K})),N=R?_(R):null,H=S(D?"Editar cuenta / fondo":"Nueva cuenta / fondo",Si(R,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));H&&(Ai(H,O,a()),T(H,"[data-guardar-acc]",K=>{const k=K.getAttribute("data-guardar-acc")||"",{datos:B,punto:Q,error:Z}=Mi(H,O,R,N,a());if(Z)return j(Z,"err");let at=k;k?t.store.updateItem("accounts",k,B):at=t.store.addItem("accounts",B)._id,Q&&t.ledger.registrarPuntoControl(at,Q.fecha,Q.saldo,Q.nota),j(k?"Actualizada":"Cuenta / fondo creado"),e(),C(),z()}))}function _(D){const z=t.ledger.puntosControl(D._id);return z.length>0?qe(z)[0].saldo:D.saldo??null}function P(D,z){const R=t.store.get("accounts").find(H=>H._id===D);if(!R)return;const O=S("Histórico de saldos",Ei(R.nombre,D,qe(t.ledger.puntosControl(D)),R.saldoInicial||0,a()));if(!O)return;const N=()=>{z(),P(D,z)};T(O,"[data-hist-anadir]",()=>{var B,Q,Z;const H=((B=O.querySelector("#hi-fecha"))==null?void 0:B.value)??"",K=parseFloat(((Q=O.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),k=((Z=O.querySelector("#hi-nota"))==null?void 0:Z.value.trim())??"";if(!H||!Number.isFinite(K))return j("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(D,H,K,k||void 0),j("Punto añadido"),e(),N()}),T(O,"[data-hist-borrar]",H=>{const[,K]=(H.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(K),j("Eliminado"),e(),N()}),T(O,"[data-hist-inicial]",H=>{const[K,k]=(H.getAttribute("data-hist-inicial")||"").split("|"),B=t.ledger.puntosControl(K).find(Z=>Z._id===k);if(!B)return;const Q=qe([B])[0].saldo;t.store.updateItem("accounts",K,{saldoInicial:Q,fechaInicialSaldo:B.fecha}),j(`Punto inicial → ${B.fecha} (${E(Q)})`),e(),N()})}function M(D){const z=t.store.get("accounts").filter(N=>N.activo);if(z.length===0)return j("No hay cuentas activas","err");const R=a(),O=z.map(N=>`• ${N.nombre}: ${E(_(N)??N.saldoInicial??0)}`).join(`
`);if(et(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${R})?

${O}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of z)t.store.updateItem("accounts",N._id,{saldoInicial:_(N)??N.saldoInicial??0,fechaInicialSaldo:R});j("Saldo base actualizado"),e(),D()}}function F(D,z,R){T(D,"[data-cuentas-tab]",O=>{n=O.getAttribute("data-cuentas-tab")||"cuentas",z()}),T(D,"[data-nueva-acc]",()=>A(null,z)),T(D,"[data-editar-acc]",O=>A(O.getAttribute("data-editar-acc"),z)),T(D,"[data-tramos-ganancias]",()=>R.abrir()),T(D,"[data-reset-base]",()=>M(z)),T(D,"[data-hist-acc]",O=>P(O.getAttribute("data-hist-acc"),z)),T(D,"[data-principal-acc]",O=>{const N=O.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(H=>({...H,esCuentaPrincipal:H._id===N}))),j("Cuenta marcada como principal"),e(),z()}),T(D,"[data-borrar-acc]",O=>{const N=O.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return j("Debe existir al menos una cuenta","err");if(!et("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const K=t.store.get("accounts");K.length>0&&!K.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",K.map((k,B)=>B===0?{...k,esCuentaPrincipal:!0}:k)),j("Cuenta eliminada"),e(),z()}),T(D,"[data-inv-modo]",O=>{const[N,H]=(O.getAttribute("data-inv-modo")||"").split("|");o.set(N,H==="real"?"real":"proyeccion"),z()})}let q=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:ur,mount(D){const z=()=>I(D);q??(q=_i({store:t.store,onDatosCambiados:()=>{e(),z()},año:()=>Number(a().slice(0,4))})),I(D),D.dataset.wired!=="1"&&(F(D,z,q),D.dataset.wired="1")}}}function vo(t,a,e=!1){const o=Math.abs(nt(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function mr(t){function a(h){return`${h}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(h={}){var $;const I=($=h.texto)==null?void 0:$.trim().toLowerCase();return t.get("transacciones").filter(y=>!(h.cuentaId&&y.cuentaId!==h.cuentaId||h.desde&&y.fecha<h.desde||h.hasta&&y.fecha>h.hasta||h.tipo&&y.tipo!==h.tipo||h.estimacionId&&y.estimacionId!==h.estimacionId||h.tags&&h.tags.length>0&&!h.tags.some(C=>y.tags.includes(C))||I&&!y.concepto.toLowerCase().includes(I))).sort((y,C)=>y.fecha.localeCompare(C.fecha)||y._id.localeCompare(C._id))}function o(h){const I={_id:a("tx"),fecha:h.fecha,cuentaId:h.cuentaId,importeCts:vo(h.tipo,h.importe,h.negativo),concepto:h.concepto,tags:h.tags??[],estimacionId:h.estimacionId??null,tipo:h.tipo,origen:h.origen??"manual",...h.nota?{nota:h.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function n(h,I){t.set("transacciones",t.get("transacciones").map($=>{if($._id!==h)return $;const{importe:y,...C}=I,S={...$,...C};return y!==void 0&&(S.importeCts=vo(S.tipo,y,S.importeCts<0)),S}))}function s(h){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==h))}function i(h,I){n(h,{estimacionId:I})}function r(h){return t.get("puntosControl").filter(I=>!h||I.cuentaId===h).sort((I,$)=>I.fecha.localeCompare($.fecha))}function c(h,I,$,y){const C={_id:a("pc"),fecha:I,cuentaId:h,saldoCts:nt($),...y?{nota:y}:{}},S=t.get("puntosControl").filter(A=>!(A.cuentaId===h&&A.fecha===I));return t.set("puntosControl",[...S,C].sort((A,_)=>A.fecha.localeCompare(_.fecha))),v(h),C}function u(h){const I=t.get("puntosControl").find($=>$._id===h);t.set("puntosControl",t.get("puntosControl").filter($=>$._id!==h)),I&&v(I.cuentaId)}function v(h){const I=r(h),$=t.get("accounts");$.some(y=>y._id===h)&&t.set("accounts",$.map(y=>y._id===h?{...y,historicoSaldos:I.map(C=>({_id:C._id,fecha:C.fecha,saldo:W(C.saldoCts),...C.nota?{nota:C.nota}:{}}))}:y))}function d(h,I=V()){const $=r(h).filter(A=>A.fecha<=I).pop(),y=$==null?void 0:$.fecha,C=($==null?void 0:$.saldoCts)??0;return t.get("transacciones").filter(A=>A.cuentaId===h&&A.fecha<=I&&(y===void 0||A.fecha>y)).reduce((A,_)=>A+_.importeCts,C)}function l(h,I){return W(d(h,I))}function m(h=V(),I){const $=I??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return W($.reduce((y,C)=>y+d(C,h),0))}function f(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function x(){const h=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return h.length>0?h.sort().pop()??null:null}function w(h={}){return W(e(h).reduce((I,$)=>I+$.importeCts,0))}function p(h={}){const I=new Map;for(const $ of e(h)){const y=$.fecha.slice(0,7);I.set(y,(I.get(y)??0)+$.importeCts)}return new Map([...I.entries()].sort(([$],[y])=>$.localeCompare(y)).map(([$,y])=>[$,W(y)]))}function b(h={}){const I=new Map;for(const $ of e(h))for(const y of $.tags.length>0?$.tags:["sin_tag"])I.set(y,(I.get(y)??0)+$.importeCts);return new Map([...I.entries()].map(([$,y])=>[$,W(y)]))}return{transacciones:e,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:c,eliminarPuntoControl:u,saldoCuenta:l,saldoCuentaCts:d,saldoTotal:m,tieneDatos:f,ultimaFecha:x,total:w,totalPorMes:p,totalPorTag:b}}function dt(t){return t.trim().toLowerCase()}function fr(t){function a(){const u=new Map,v=(d,l)=>{const m=dt(d);if(!m)return;const f=u.get(m)??{tag:m,estimaciones:0,reales:0,total:0};f[l]+=1,f.total+=1,u.set(m,f)};for(const d of t.get("expenses"))for(const l of d.tags??[])v(l,"estimaciones");for(const d of t.get("transacciones"))for(const l of d.tags??[])v(l,"reales");return[...u.values()].sort((d,l)=>l.total-d.total||d.tag.localeCompare(l.tag))}function e(){return a().map(u=>u.tag)}function o(u){return a().filter(v=>u==="estimaciones"?v.reales===0:v.estimaciones===0).map(v=>v.tag)}function n(u,v,d){const l=dt(v),m=(u??[]).map(dt);if(!m.includes(l))return u??[];const f=m.filter(x=>x!==l);return d===null?[...new Set(f)]:[...new Set([...f,dt(d)])]}function s(u,v){const d=dt(v);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(u,d)}function i(u,v){let d=0;for(const l of u)dt(l)!==dt(v)&&(d+=c(l,dt(v)).cambiados);return{cambiados:d}}function r(u){return c(u,null)}function c(u,v){let d=0;const l=t.get("expenses").map(C=>{const S=n(C.tags,u,v);return S!==C.tags&&(d+=1),S===C.tags?C:{...C,tags:S}});t.set("expenses",l);const m=t.get("transacciones").map(C=>{const S=n(C.tags,u,v);return S!==C.tags&&(d+=1),S===C.tags?C:{...C,tags:S}});t.set("transacciones",m);const f=t.get("loans").map(C=>{const S=n(C.tags,u,v);return S!==C.tags&&(d+=1),S===C.tags?C:{...C,tags:S}});t.set("loans",f);const x=t.get("nominas").map(C=>{const S=n(C.tags,u,v);return S!==C.tags&&(d+=1),S===C.tags?C:{...C,tags:S}});t.set("nominas",x);const w=t.get("config"),p=dt(u),b=C=>{const S=(C??[]).map(dt);if(!S.includes(p))return C??[];const A=S.filter(_=>_!==p);return v===null?[...new Set(A)]:[...new Set([...A,v])]},h={},I=b(w.activeTagsFilter),$=b(w.tagCategorias),y=b(w.tagGrupos);return I!==w.activeTagsFilter&&(h.activeTagsFilter=I),$!==w.tagCategorias&&(h.tagCategorias=$),y!==w.tagGrupos&&(h.tagGrupos=y),Object.keys(h).length>0&&t.patchConfig(h),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const gr=3;function bo(t){return t<.005?0:t}function vr(t){if(t.length<2)return null;const a=t.reduce((o,n)=>o+n,0)/t.length,e=t.reduce((o,n)=>o+(n-a)**2,0)/(t.length-1);return Math.sqrt(e)}function br(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<gr)continue;const r=vr(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:bo(n),sigmaDeriva:bo(s),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function ho(t,a,e=1,o=0){if(a<=0)return 0;const n=Math.max(0,t)*Math.sqrt(a),s=Math.max(0,o)*a;return n===0&&s===0?0:U(e*Math.hypot(n,s))}function hr(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,n=e.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,u]=r.fecha.slice(0,7).split("-").map(Number),v=Math.max(0,(c-s)*12+(u-i)),d=ho(a.sigmaMensual,v,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:U(r.saldoAcum+d),abajo:U(r.saldoAcum-d)}})}function yr(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const He="financeapp_session",$r=["local","dropbox","firebase"];function xr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!$r.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Ir({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(m){const f=n();if(f)try{m?f.setItem(He,JSON.stringify(m)):f.removeItem(He)}catch{}}function i(){const m=n();if(!m)return null;try{return xr(m.getItem(He))}catch{return null}}function r(){const m=i();return m?(e()-m.ultimoUso)/6e4:null}function c(){const m=a();if(!Number.isFinite(m)||m<=0||o())return!1;const f=r();return f!==null&&f>=m}function u(){const m=i();return m?c()?(s(null),null):m:null}function v(m){const f=e(),x={modo:m.modo,...m.email?{email:m.email}:{},...m.passphrase?{passphrase:m.passphrase}:{},creadaEn:f,ultimoUso:f};return s(x),x}function d(){const m=i();m&&s({...m,ultimoUso:e()})}function l(){s(null)}return{abrir:v,leer:u,tocar:d,cerrar:l,caducada:c,inactividadMinutos:r,get activa(){return u()!==null}}}const yo=["pointerdown","keydown","visibilitychange"];function wr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const v of yo)s==null||s.addEventListener(v,r);const c=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),a())},e);function u(){if(i){i=!1,n(c);for(const v of yo)s==null||s.removeEventListener(v,r)}}return u}const Cr=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Sr="FinanceApp",Ar=new TextEncoder().encode("financeapp-bio-passphrase-v1");function $o(t){return new Uint8Array(new ArrayBuffer(t))}const Ge="financeapp_bio_credencial",Ve="financeapp_bio_secreto",Ue="financeapp_bio_ultimo_desbloqueo",xo="financeapp_bio_gracia_min",Mr=5;function Er(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function de(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ue(t){const a=atob(t),e=$o(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function _r(t){return de(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Pr(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ue(a)}function Io(t){return t.getClientExtensionResults()}function Fr(t={}){const a=t.webauthn??Er(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??($=>crypto.getRandomValues($o($)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const $=o==null?void 0:o.getItem(Ge);if(!$)return null;try{const y=JSON.parse($);return typeof y.credencialId!="string"||typeof y.salt!="string"?null:y}catch{return null}}function u(){return c()!==null}async function v($){const y=await e.importKey("raw",$,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Ar},y,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d($,y){const C=s(12),S=await e.encrypt({name:"AES-GCM",iv:C},$,new TextEncoder().encode(y));return`${de(C)}:${de(S)}`}async function l($,y){const[C,S]=y.split(":"),A=ue(C),_=ue(S),P=await e.decrypt({name:"AES-GCM",iv:A},$,_);return new TextDecoder().decode(P)}async function m($,y){var R,O;if(!$)throw new Error("No hay clave de cifrado que envolver.");const C=s(32),S=s(32),A=s(16),_=await a.create({publicKey:{challenge:S,rp:{name:Sr},user:{id:A,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:C}}},timeout:6e4}});if(!_)throw new Error("No se ha podido crear la credencial biométrica.");const P=Io(_);if(!((R=P.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((O=P.prf.results)==null?void 0:O.first)??null;if(M||(M=await f(_.rawId,C)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const F=await v(M),q=await d(F,$),D={credencialId:_r(_.rawId),salt:de(C),modo:y,creadaEn:n()},z=i();z.setItem(Ge,JSON.stringify(D)),z.setItem(Ve,q)}async function f($,y){var S,A;const C=await a.get({publicKey:{challenge:s(32),allowCredentials:[{id:$,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:y}}},timeout:6e4}});return C?((A=(S=Io(C).prf)==null?void 0:S.results)==null?void 0:A.first)??null:null}async function x(){const $=c();if(!$)throw new Error("No hay huella configurada en este dispositivo.");const y=o==null?void 0:o.getItem(Ve);if(!y)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const C=await f(Pr($.credencialId).buffer,ue($.salt));if(!C)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const S=await v(C),A=await l(S,y);return p(),A}function w(){o==null||o.removeItem(Ge),o==null||o.removeItem(Ve),o==null||o.removeItem(Ue)}function p(){o==null||o.setItem(Ue,String(n()))}function b(){const $=o==null?void 0:o.getItem(xo);if($==null)return Mr;const y=Number($);return Number.isFinite(y)&&y>0?y:0}function h($){o==null||o.setItem(xo,String(Math.max(0,Math.floor($)||0)))}function I(){if(!u())return!1;const $=b();if($<=0)return!1;const y=o==null?void 0:o.getItem(Ue),C=y?Number(y):NaN;return Number.isFinite(C)?n()-C<$*6e4:!1}return{disponible:r,registrada:u,leerCredencial:c,registrar:m,desbloquear:x,olvidar:w,marcarDesbloqueo:p,dentroDeGracia:I,graciaMinutos:b,configurarGracia:h}}function wo(){if(typeof localStorage<"u"){const y=Dn();y.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${y.join(", ")}`)}const t=Hn(),a=t.activo(),e=Ut(a),o=ja(localStorage,e),n=Nn({adapter:o}),s=Rn(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Ht})`),n.subscribe(y=>s.marcar(y));function r(){var C,S,A,_,P;const y=globalThis;(S=(C=y.FirebaseService)==null?void 0:C.isConnected)!=null&&S.call(C)&&((P=(_=(A=y.FirebaseService).uploadRegistroProyectos)==null?void 0:_.call(A))==null||P.catch(M=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",M instanceof Error?M.message:M)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(y=>y._id===a)??t.listar()[0],colecciones:xt.filter(y=>y!=="config"),crear:y=>{const C=t.crear(y);return r(),C},renombrar:(y,C)=>{t.renombrar(y,C),r()},duplicar:(y,C)=>{const S=t.duplicar(y,C);return r(),S},eliminar:y=>{t.eliminar(y),r()},cambiarA:y=>t.establecerActivo(y),fusionarRemotos:y=>t.fusionarRemotos(y),importarDesde:(y,C)=>{const S=Gn(localStorage,y,C),A=Vn(S),_=[];for(const P of C){const M=A[P];if(!Array.isArray(M)||M.length===0)continue;const F=n.get(P);n.set(P,[...F,...M]),_.push(P)}return _.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:_}}},u=Yn(n),v=Fr(),d=Ir({autoLogoutMinutos:()=>{var C,S;const y=(S=(C=globalThis.State)==null?void 0:C.get)==null?void 0:S.call(C,"config");return Number((y==null?void 0:y.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>v.dentroDeGracia()}),l=mr(n),m=fr(n),f=tr(l),x=ji(n),w=ys({isEnabled:y=>u.isEnabled(y)}),p=us({flags:u,rutasExtra:()=>w.flagPorRuta()}),b=Qn({flags:u,onChange:()=>{var y,C;w.attachToShell(),p.apply(),(C=(y=globalThis.Router)==null?void 0:y.rerender)==null||C.call(y)}}),h=ss({proyectos:c}),I=()=>{var C,S,A,_,P,M;const y=globalThis;if((S=(C=y.State)==null?void 0:C.load)==null||S.call(C),((_=(A=y.Router)==null?void 0:A.current)==null?void 0:_.call(A))==="dashboard")try{(M=(P=y.DashboardModule)==null?void 0:P.render)==null||M.call(P)}catch(F){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",F)}},$=ds({store:n,onDatosCambiados:I});return w.register(Fs({store:n,onDatosCambiados:I})),w.register(ks({store:n,onDatosCambiados:I})),w.register(mi({store:n,onDatosCambiados:I})),w.register(pr({store:n,ledger:l,tags:m,precision:f,adjuster:x,onDatosCambiados:I})),w.register(Is({store:n,onDatosCambiados:I})),{version:Ht,core:To,engine:{generarExtracto:ga,recomputarSaldoAcum:qo,saldoHoy:No,sumarPorTags:va,providers:{proyectarGastos:Ot,proyectarPrestamos:ia,proyectarTransferencias:ra,proyectarNominas:ua,proyectarInteresesCuentas:la,proyectarAportaciones:ca,proyectarRetencionesFiscales:da,proyectarInflacionGastos:pa,proyectarPerdidaAhorro:ma},analysis:ko,margins:Wo,avisos:Xo,dashboard:mn},store:n,flags:u,featureRegistry:{all:ht,porGrupo:ka},ui:{openFeatures:b.open,openProyectos:h.open,openPersonas:$.open,applyGating:p.apply,watchGating:()=>p.observar(),instalarDeshacer:()=>ms({store:n,rerender:()=>{var C,S,A,_;const y=globalThis;(S=(C=y.State)==null?void 0:C.load)==null||S.call(C),(_=(A=y.Router)==null?void 0:A.rerender)==null||_.call(A)}}),avisoGuardado:null,instalarBuscador:()=>bs({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>w.routes(),navegar:y=>{var C,S;return(S=(C=globalThis.Router)==null?void 0:C.navigate)==null?void 0:S.call(C,y)}})},app:w,session:Object.assign(d,{vigilar:y=>wr({sesion:d,onCaducada:y}),opciones:Cr}),biometria:v,cambios:s,datos:{colecciones:xt,snapshot:()=>qa(o),aplicar:(y,{sellar:C=!0}={})=>{const A=Ln(C?(_,P)=>o.set(_,P):(_,P)=>{const M=globalThis.StorageAdapter;M!=null&&M.setRestaurando?M.setRestaurando(_,P):o.set(_,P)},y);return n.load(),s.marcar("copia-restaurada"),A},faltantes:y=>On(y),esVacioOPorDefecto:()=>kn(qa(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:l,tags:m,precision:f,adjuster:x,sugerirAjuste:Ne,medirVariabilidad:br,bandaDeConfianza:hr,bandaAcumulada:ho,describirBanda:yr}}}function Dr(){try{const t=wo();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const ot=typeof window<"u"?Dr():null;if(ot){let t=!1;const a=()=>{var e,o;if(ot.app.attachToShell(),ot.ui.applyGating(),!t){t=!0,ot.ui.watchGating(),ot.ui.instalarDeshacer(),ot.ui.instalarBuscador();const n=globalThis,s=()=>{var c,u,v,d;return(u=(c=n.FirebaseService)==null?void 0:c.isConnected)!=null&&u.call(c)?n.FirebaseService:(d=(v=n.DropboxService)==null?void 0:v.isConnected)!=null&&d.call(v)?n.DropboxService:null};ot.ui.avisoGuardado=hs({cambios:ot.cambios,hayDestino:()=>s()!==null,guardar:async()=>{const c=s();if(!(c!=null&&c.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await c.uploadBackup()}});const i=document.getElementById("sidebar-proyecto-activo"),r=document.getElementById("sidebar-proyecto-activo-nombre");i&&r&&(r.textContent=ot.proyectos.activo().nombre,i.classList.remove("hidden"),i.addEventListener("click",()=>ot.ui.openProyectos())),(e=document.getElementById("btn-proyectos"))==null||e.addEventListener("click",()=>ot.ui.openProyectos()),(o=document.getElementById("btn-personas"))==null||o.addEventListener("click",()=>ot.ui.openPersonas())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return pe.bootstrap=wo,Object.defineProperty(pe,Symbol.toStringTag,{value:"Module"}),pe}({});
//# sourceMappingURL=financeapp-core.js.map
