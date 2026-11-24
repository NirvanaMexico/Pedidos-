  var K_LOGO='lp_logo', K_DEST='lp_destino', K_ITEMS='lp_items', K_LAST='lp_ultima';
  var $=function(id){return document.getElementById(id)};
  var items=[];
  var toastTimer;

  function store(k,v){ try{ localStorage.setItem(k,v); return true; }catch(e){ return false; } }
  function load(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function remove(k){ try{ localStorage.removeItem(k); }catch(e){} }

  function toast(msg){
    var t=$('toast'); t.textContent=msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer=setTimeout(function(){t.classList.remove('on')},2200);
  }
  function fmt(n){ return String(Math.round(n*1000)/1000).replace('.',','); }

  /* ---------- Logo ---------- */
  function showLogo(src){
    var b=$('logoBtn');
    if(src){ b.innerHTML=''; var im=new Image(); im.src=src; im.alt='Logotipo'; b.appendChild(im); b.classList.add('has'); }
    else { b.textContent='Toca para subir logo'; b.classList.remove('has'); }
    $('logoBadge').hidden=!src; $('logoDel').hidden=!src;
  }
  $('logoBtn').addEventListener('click',function(){ $('logoFile').click(); });
  $('logoFile').addEventListener('change',function(e){
    var f=e.target.files && e.target.files[0]; if(!f) return;
    if(f.type && !/^image\//.test(f.type)){ toast('Elige una imagen (PNG o JPG)'); return; }
    var r=new FileReader();
    r.onload=function(){
      var img=new Image();
      img.onload=function(){
        var max=400, w=img.width, h=img.height, s=Math.min(1,max/Math.max(w,h));
        var c=document.createElement('canvas'); c.width=Math.round(w*s); c.height=Math.round(h*s);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        var jpg=f.type==='image/jpeg';
        var data=c.toDataURL(jpg?'image/jpeg':'image/png',0.92);
        if(store(K_LOGO,data)){ showLogo(data); toast('Logotipo guardado'); }
        else { showLogo(data); toast('No se pudo guardar el logo'); }
      };
      img.onerror=function(){ toast('No se pudo leer la imagen'); };
      img.src=r.result;
    };
    r.readAsDataURL(f);
    e.target.value='';
  });

  $('logoDel').addEventListener('click',function(){
    if(!confirm('¿Quitar el logotipo?')) return;
    remove(K_LOGO); showLogo(null); toast('Logotipo quitado');
  });

  /* ---------- Destino ---------- */
  $('destino').addEventListener('input',function(){ store(K_DEST,this.value); });

  /* ---------- Unidad ---------- */
  $('unidad').addEventListener('change',function(){
    var on=this.value==='__otro';
    $('otraWrap').classList.toggle('on',on);
    if(on) $('otra').focus();
  });

  /* ---------- Lista ---------- */
  function save(){ store(K_ITEMS,JSON.stringify(items)); }

  var TRASH='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 10v6M14 10v6"/></svg>';

  function render(){
    var box=$('lista'); box.innerHTML='';
    if(!items.length){
      var e=document.createElement('div'); e.className='empty';
      e.textContent='Aún no hay productos. Agrega el primero arriba.'; box.appendChild(e);
    }
    items.forEach(function(it,i){
      var row=document.createElement('div'); row.className='item';
      var n=document.createElement('div'); n.className='pname'; n.textContent=it.nombre;
      var q=document.createElement('div'); q.className='qty';

      var minus=document.createElement('button'); minus.type='button'; minus.className='mini'; minus.textContent='−'; minus.setAttribute('aria-label','Restar uno a '+it.nombre);
      minus.onclick=function(){ it.cantidad=Math.max(1,Math.round((it.cantidad-1)*1000)/1000); save(); render(); };
      var t=document.createElement('div'); t.className='qtxt';
      t.appendChild(document.createTextNode(fmt(it.cantidad)));
      var u=document.createElement('small'); u.textContent=it.unidad; t.appendChild(u);
      var plus=document.createElement('button'); plus.type='button'; plus.className='mini'; plus.textContent='+'; plus.setAttribute('aria-label','Sumar uno a '+it.nombre);
      plus.onclick=function(){ it.cantidad=Math.round((it.cantidad+1)*1000)/1000; save(); render(); };
      var del=document.createElement('button'); del.type='button'; del.className='mini del'; del.innerHTML=TRASH; del.setAttribute('aria-label','Eliminar '+it.nombre);
      del.onclick=function(){ items.splice(i,1); save(); render(); };

      q.appendChild(minus); q.appendChild(t); q.appendChild(plus); q.appendChild(del);
      row.appendChild(n); row.appendChild(q); box.appendChild(row);
    });

    var rs=$('resumen');
    if(items.length){
      rs.classList.remove('off');
      rs.textContent=summaryText();
    } else rs.classList.add('off');
  }

  function summaryText(){
    var total=items.reduce(function(a,b){return a+b.cantidad},0);
    return 'Total: '+items.length+(items.length===1?' producto':' productos')+' | '+fmt(total)+(total===1?' unidad':' unidades');
  }

  function add(){
    var nombre=$('prod').value.trim();
    var cant=parseFloat($('cant').value);
    var unidad=$('unidad').value;
    if(unidad==='__otro') unidad=$('otra').value.trim();
    if(!nombre){ toast('Escribe el nombre del producto'); $('prod').focus(); return; }
    if(!(cant>0)){ toast('Escribe una cantidad mayor a 0'); $('cant').focus(); return; }
    if(!unidad){ toast('Escribe la unidad'); $('otra').focus(); return; }
    items.push({nombre:nombre,cantidad:cant,unidad:unidad});
    save(); render();
    $('prod').value=''; $('cant').value='';
    $('prod').focus();
  }
  $('addBtn').addEventListener('click',add);
  $('prod').addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); $('cant').focus(); } });
  $('cant').addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); add(); } });

  /* ---------- Copiar para WhatsApp ---------- */
  function buildText(){
    var d=new Date();
    var fecha=d.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    fecha=fecha.charAt(0).toUpperCase()+fecha.slice(1);
    var dest=$('destino').value.trim();
    var lines=[];
    lines.push('*'+(dest||'Pedido')+'*');
    lines.push(fecha);
    lines.push('');
    items.forEach(function(it){ lines.push('• '+it.nombre+': '+fmt(it.cantidad)+' '+it.unidad); });
    lines.push('');
    lines.push(summaryText());
    return lines.join('\n');
  }
  function fallbackCopy(text){
    var ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0,text.length);
    var ok=false; try{ ok=document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); return ok;
  }
  $('copyBtn').addEventListener('click',function(){
    if(!items.length){ toast('Agrega al menos un producto'); return; }
    var text=buildText();
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(function(){ toast('Copiado. Pégalo en WhatsApp'); },
        function(){ toast(fallbackCopy(text)?'Copiado. Pégalo en WhatsApp':'No se pudo copiar'); });
    } else {
      toast(fallbackCopy(text)?'Copiado. Pégalo en WhatsApp':'No se pudo copiar');
    }
  });
