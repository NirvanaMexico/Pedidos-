  /* ---------- Descargar nota (imagen) ---------- */
  var FONT='system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif';

  function wrapText(ctx,text,maxW){
    var words=String(text).split(/\s+/), lines=[], cur='';
    words.forEach(function(w){
      // partir palabras muy largas
      while(ctx.measureText(w).width>maxW && w.length>1){
        var k=w.length; while(k>1 && ctx.measureText(w.slice(0,k)).width>maxW) k--;
        if(cur){ lines.push(cur); cur=''; }
        lines.push(w.slice(0,k)); w=w.slice(k);
      }
      var test=cur?cur+' '+w:w;
      if(ctx.measureText(test).width<=maxW) cur=test;
      else { if(cur) lines.push(cur); cur=w; }
    });
    if(cur) lines.push(cur);
    return lines.length?lines:[''];
  }
  function fitText(ctx,text,maxW){
    if(ctx.measureText(text).width<=maxW) return text;
    while(text.length>1 && ctx.measureText(text+'…').width>maxW) text=text.slice(0,-1);
    return text+'…';
  }
  function rr(ctx,x,y,w,h,r){
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  }
  function fechaLarga(){
    var f=new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    return f.charAt(0).toUpperCase()+f.slice(1);
  }

  function drawNote(logo,modo){
    var W=1080, M=60, TW=W-2*M, C1=620, LH=40, PADY=22, ROWMIN=84, THEAD=76, SUMH=100;
    var c=document.createElement('canvas'), ctx=c.getContext('2d');

    // medir filas
    var rows=items.map(function(it){
      ctx.font='600 32px '+FONT; var p=wrapText(ctx,it.nombre,C1-48);
      ctx.font='700 32px '+FONT; var q=wrapText(ctx,fmt(it.cantidad)+' '+it.unidad,TW-C1-48);
      var h=Math.max(ROWMIN,Math.max(p.length,q.length)*LH+PADY*2);
      return {p:p,q:q,h:h};
    });
    var rowsH=rows.reduce(function(a,r){return a+r.h},0);
    var hasLogo=!!logo, LS=150, top=M;
    var tableTop=top+170+40;
    var H=tableTop+THEAD+rowsH+30+SUMH+M;
    c.width=W; c.height=H;

    // fondo
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H);
    ctx.textBaseline='alphabetic';

    // logo
    if(hasLogo){
      var s=Math.min(LS/logo.width,LS/logo.height), lw=logo.width*s, lh=logo.height*s;
      ctx.drawImage(logo,M+(LS-lw)/2,M+(LS-lh)/2,lw,lh);   // centrado en su recuadro
    }
    var tx=hasLogo?M+LS+36:M, tw=W-M-tx;
    ctx.textAlign='left';

    // título, destino y fecha
    ctx.fillStyle='#1f4e79'; ctx.font='800 54px '+FONT;
    ctx.fillText(fitText(ctx,'NOTA DE PEDIDO',tw),tx,top+52);
    ctx.fillStyle='#14202b'; ctx.font='700 38px '+FONT;
    var dest=$('destino').value.trim();
    ctx.fillText(fitText(ctx,'Destino: '+(dest||'—'),tw),tx,top+106);
    ctx.fillStyle='#5b6b79'; ctx.font='500 30px '+FONT;
    ctx.fillText(fitText(ctx,'Fecha: '+fechaLarga(),tw),tx,top+150);
    ctx.textAlign='left';

    // línea bajo el encabezado
    ctx.fillStyle='#d5dce3'; ctx.fillRect(M,top+170,TW,2);

    // encabezado de tabla
    var y=tableTop;
    ctx.save(); rr(ctx,M,y,TW,THEAD,0); ctx.fillStyle='#1f4e79'; ctx.fill(); ctx.restore();
    ctx.fillStyle='#ffffff'; ctx.font='700 30px '+FONT;
    ctx.fillText('Producto',M+24,y+THEAD/2+11);
    ctx.textAlign='right'; ctx.fillText('Cantidad',M+TW-24,y+THEAD/2+11); ctx.textAlign='left';
    y+=THEAD;

    // renglones
    rows.forEach(function(r,i){
      ctx.fillStyle=i%2?'#f4f6f8':'#ffffff'; ctx.fillRect(M,y,TW,r.h);
      ctx.fillStyle='#14202b'; ctx.font='600 32px '+FONT;
      r.p.forEach(function(l,k){ ctx.fillText(l,M+24,y+PADY+30+k*LH); });
      ctx.font='700 32px '+FONT; ctx.textAlign='right';
      r.q.forEach(function(l,k){ ctx.fillText(l,M+TW-24,y+PADY+30+k*LH); });
      ctx.textAlign='left';
      ctx.fillStyle='#e1e6eb'; ctx.fillRect(M,y+r.h-1,TW,1.5);
      y+=r.h;
    });

    // divisor vertical y borde exterior
    ctx.strokeStyle='#d5dce3'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(M+C1,tableTop+THEAD); ctx.lineTo(M+C1,y); ctx.stroke();
    ctx.strokeRect(M,tableTop,TW,y-tableTop);

    // resumen
    y+=30;
    rr(ctx,M,y,TW,SUMH,14); ctx.fillStyle='#e8f0f7'; ctx.fill();
    ctx.strokeStyle='#c5d5e4'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#1f4e79'; ctx.font='800 38px '+FONT; ctx.textAlign='center';
    ctx.fillText(fitText(ctx,summaryText(),TW-40),W/2,y+SUMH/2+13);
    ctx.textAlign='left';

    c.toBlob(function(b){
      if(!b){ toast('No se pudo crear la imagen'); return; }
      var d=new Date(), z=function(n){return (n<10?'0':'')+n};
      var name='nota-pedido-'+d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'.png';
      var file=null;
      try{ file=new File([b],name,{type:'image/png'}); }catch(e){}
      var data=c.toDataURL('image/png');
      if(store(K_LAST,data)) $('lastBtn').hidden=false;   // guarda la última nota para verla rápido
      var puede=false;
      try{ puede=!!(file && navigator.share && navigator.canShare && navigator.canShare({files:[file]})); }catch(e){}
      if(modo==='guardar'){
        var url=URL.createObjectURL(b), a=document.createElement('a');
        a.href=url; a.download=name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function(){ URL.revokeObjectURL(url); },60000);
        toast('Imagen guardada en Descargas');
      } else if(puede){
        navigator.share({files:[file],title:'Nota de pedido'}).catch(function(err){
          if(err && err.name==='AbortError') return;   // la persona cerró el menú
          mostrarVista(data);
        });
      } else mostrarVista(data);
    },'image/png');
  }

  function mostrarVista(data){
    $('vistaImg').src=data; $('vista').hidden=false; $('vista').scrollTop=0;
  }
  $('lastBtn').addEventListener('click',function(){
    var d=load(K_LAST);
    if(d) mostrarVista(d); else { $('lastBtn').hidden=true; toast('Aún no hay una nota guardada'); }
  });
  function cerrarVista(){ $('vista').hidden=true; $('vistaImg').removeAttribute('src'); }
  $('vistaX').addEventListener('click',cerrarVista);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') cerrarVista(); });

  function generarNota(modo){
    if(!items.length){ toast('Agrega al menos un producto'); return; }
    var src=load(K_LOGO);
    if(!src){ drawNote(null,modo); return; }
    var im=new Image();
    im.onload=function(){ drawNote(im,modo); };
    im.onerror=function(){ drawNote(null,modo); };
    im.src=src;
  }
  $('imgBtn').addEventListener('click',function(){ generarNota('compartir'); });
  $('saveBtn').addEventListener('click',function(){ generarNota('guardar'); });

  /* ---------- Limpiar ---------- */
  $('clearBtn').addEventListener('click',function(){
    if(!confirm('¿Borrar todos los productos y el destino?\nEl logotipo se conserva.')) return;
    items=[]; $('destino').value='';
    remove(K_ITEMS); remove(K_DEST);
    render(); toast('Lista limpia');
  });

  /* ---------- Inicio ---------- */
  if('serviceWorker' in navigator){ window.addEventListener('load',function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); }); }
  showLogo(load(K_LOGO));
  if(load(K_LAST)) $('lastBtn').hidden=false;
  $('destino').value=load(K_DEST)||'';
  try{ var s=JSON.parse(load(K_ITEMS)||'[]'); if(Array.isArray(s)) items=s.filter(function(x){return x&&x.nombre&&x.cantidad>0}); }catch(e){ items=[]; }
  render();
