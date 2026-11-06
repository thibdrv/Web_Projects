import sys, re, os, json, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
import ic_build  # builds data/icons.js and exposes ICONS, MONO
ICONS=ic_build.ICONS; MONO=ic_build.MONO
FE=re.compile("\uFE0F")
root=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
def uri(ch):
    k=FE.sub("",ch)
    if k=="↔":   # a double arrow, drawn here (the text arrow stays text elsewhere)
        inner='<g fill="none" stroke="#5B6472" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 H28 M10 9 L3 16 L10 23 M22 9 L29 16 L22 23"/></g>'
    else:
        inner=ICONS[k].replace("currentColor","#5B6472")
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'+inner+'</svg>'
    return 'url("data:image/svg+xml,'+urllib.parse.quote(svg, safe="/:=,;()' ")+'")'.replace(" ","%20")
def conv(path):
    t=open(path,encoding="utf-8").read(); n=0
    def rep(m):
        nonlocal n; n+=1
        return m.group(1)+"--ico:"+uri(m.group(2))
    t=re.sub(r'(\]\s*\{\s*)--ico:"([^"]+)"', rep, t)
    t=re.sub(r'(\}\s*)--ico:"([^"]+)"', rep, t)
    open(path,"w",encoding="utf-8").write(t); return n
for f in ["css/submenu.css","css/extras.css"]:
    print(f, conv(os.path.join(root,f)))
