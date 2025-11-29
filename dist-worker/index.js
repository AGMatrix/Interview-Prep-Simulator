var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/mime/Mime.js
var require_Mime = __commonJS({
  "node_modules/mime/Mime.js"(exports, module) {
    "use strict";
    function Mime() {
      this._types = /* @__PURE__ */ Object.create(null);
      this._extensions = /* @__PURE__ */ Object.create(null);
      for (let i = 0; i < arguments.length; i++) {
        this.define(arguments[i]);
      }
      this.define = this.define.bind(this);
      this.getType = this.getType.bind(this);
      this.getExtension = this.getExtension.bind(this);
    }
    __name(Mime, "Mime");
    Mime.prototype.define = function(typeMap, force) {
      for (let type in typeMap) {
        let extensions = typeMap[type].map(function(t) {
          return t.toLowerCase();
        });
        type = type.toLowerCase();
        for (let i = 0; i < extensions.length; i++) {
          const ext = extensions[i];
          if (ext[0] === "*") {
            continue;
          }
          if (!force && ext in this._types) {
            throw new Error(
              'Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".'
            );
          }
          this._types[ext] = type;
        }
        if (force || !this._extensions[type]) {
          const ext = extensions[0];
          this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
        }
      }
    };
    Mime.prototype.getType = function(path) {
      path = String(path);
      let last = path.replace(/^.*[/\\]/, "").toLowerCase();
      let ext = last.replace(/^.*\./, "").toLowerCase();
      let hasPath = last.length < path.length;
      let hasDot = ext.length < last.length - 1;
      return (hasDot || !hasPath) && this._types[ext] || null;
    };
    Mime.prototype.getExtension = function(type) {
      type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
      return type && this._extensions[type.toLowerCase()] || null;
    };
    module.exports = Mime;
  }
});

// node_modules/mime/types/standard.js
var require_standard = __commonJS({
  "node_modules/mime/types/standard.js"(exports, module) {
    module.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
  }
});

// node_modules/mime/types/other.js
var require_other = __commonJS({
  "node_modules/mime/types/other.js"(exports, module) {
    module.exports = { "application/prs.cww": ["cww"], "application/vnd.1000minds.decision-model+xml": ["1km"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.keynote": ["key"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.numbers": ["numbers"], "application/vnd.apple.pages": ["pages"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.balsamiq.bmml+xml": ["bmml"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.citationstyles.style+xml": ["csl"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dbf": ["dbf"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mapbox-vector-tile": ["mvt"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["*stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.ac+xml": ["*ac"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openblox.game+xml": ["obgx"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openstreetmap.data+xml": ["osm"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.rar": ["rar"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.software602.filler.form+xml": ["fo"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.syncml.dmddf+xml": ["ddf"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": ["*dmg"], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": ["*bdoc"], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["*deb", "udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": ["*iso"], "application/x-iwork-keynote-sffkey": ["*key"], "application/x-iwork-numbers-sffnumbers": ["*numbers"], "application/x-iwork-pages-sffpages": ["*pages"], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-keepass2": ["kdbx"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": ["*exe"], "application/x-msdownload": ["*exe", "*dll", "com", "bat", "*msi"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["*wmf", "*wmz", "*emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": ["*prc", "*pdb"], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["*rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["*obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["*xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": ["*m4a"], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": ["*ra"], "audio/x-wav": ["*wav"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "image/prs.btif": ["btif"], "image/prs.pti": ["pti"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.airzip.accelerator.azv": ["azv"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": ["*sub"], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.microsoft.icon": ["ico"], "image/vnd.ms-dds": ["dds"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.pco.b16": ["b16"], "image/vnd.tencent.tap": ["tap"], "image/vnd.valve.source.texture": ["vtf"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/vnd.zbrush.pcx": ["pcx"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["*ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": ["*bmp"], "image/x-pcx": ["*pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/vnd.wfa.wsc": ["wsc"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.opengex": ["ogex"], "model/vnd.parasolid.transmit.binary": ["x_b"], "model/vnd.parasolid.transmit.text": ["x_t"], "model/vnd.sap.vds": ["vds"], "model/vnd.usdz+zip": ["usdz"], "model/vnd.valve.source.compiled-map": ["bsp"], "model/vnd.vtu": ["vtu"], "text/prs.lines.tag": ["dsc"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": ["*org"], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] };
  }
});

// node_modules/mime/index.js
var require_mime = __commonJS({
  "node_modules/mime/index.js"(exports, module) {
    "use strict";
    var Mime = require_Mime();
    module.exports = new Mime(require_standard(), require_other());
  }
});

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/utils/prompts.ts
var INTERVIEWER_PROMPT = /* @__PURE__ */ __name((interviewType, round) => `
You are a professional ${interviewType} interviewer conducting a ${round} round interview.

Your Personality:
- Professional but approachable
- Curious and engaged
- Fair and objective
- Encouraging but honest

Your Responsibilities:
1. Ask clear, relevant questions appropriate for the role and experience level
2. Listen carefully and ask intelligent follow-ups
3. Probe deeper when answers are vague or incomplete
4. Politely interrupt if the candidate goes off-track
5. Keep the conversation natural and conversational

Interview Guidelines for ${round} Round:

${round === "BEHAVIORAL" ? `
BEHAVIORAL Interview Focus:
- Ask about past experiences using STAR method
- Look for: Leadership, Collaboration, Problem-solving, Conflict resolution
- Probe for: Specific examples, outcomes, learnings, growth
- Follow up on: Vague answers, missing details, impact metrics
- Examples: "Tell me about a time when...", "How did you handle...", "Describe a situation where..."
` : ""}

${round === "TECHNICAL" ? `
TECHNICAL Interview Focus:
- Test fundamental understanding, not just memorization
- Ask about: System design principles, architecture decisions, trade-offs
- Probe for: Why certain choices, alternatives considered, scalability
- Follow up on: Surface-level answers, buzzwords without understanding
- Examples: "Explain how X works", "What are the trade-offs of...", "How would you design..."
` : ""}

${round === "CODING" ? `
CODING Interview Focus:
- Start with problem statement and clarifying questions
- Look for: Approach, edge cases, time/space complexity, code quality
- Probe for: Optimization, alternative solutions, testing strategy
- Follow up on: Incomplete solutions, missing edge cases, incorrect complexity
- Guide candidate through hints if stuck (don't give answer directly)
` : ""}

${round === "SYSTEM_DESIGN" ? `
SYSTEM DESIGN Interview Focus:
- Start with high-level requirements gathering
- Look for: Scalability, reliability, trade-offs, component design
- Probe for: Data flow, bottlenecks, failure handling, monitoring
- Follow up on: Missing components, unrealistic assumptions, lack of depth
- Guide through: Architecture choices, technology selection, capacity planning
` : ""}

Response Format:
Return ONLY valid JSON (no markdown, no code blocks, no explanations):
{
  "text": "Your question here - make it natural and conversational",
  "category": "specific topic",
  "difficulty": "easy|medium|hard",
  "followUpHints": ["hint if they struggle", "another hint"],
  "evaluationCriteria": {
    "correctness": "what makes a correct answer",
    "depth": "what depth of understanding to expect",
    "communication": "how they should explain it"
  }
}

CRITICAL:
- Return ONLY the JSON object, no code block wrapper, no extra text
- Ask ONE question at a time
- Make questions feel natural like a real conversation, not formulaic
- Adapt difficulty based on previous answers
- Never ask the same question twice
- Be culturally sensitive and inclusive
`, "INTERVIEWER_PROMPT");
var EVALUATOR_PROMPT = `
You are a STRICT and REALISTIC interview evaluator at a top tech company. Evaluate candidates like a real senior engineer would.

CRITICAL SCORING RULES:
- Most candidates score 5-7 range (average to good)
- Scores of 8-10 are RARE and only for exceptional answers
- Scores below 5 indicate serious issues
- VARY your scores based on answer quality - DO NOT give similar scores to different answers
- Be critical but fair - real interviews are tough

Evaluation Framework:

1. CORRECTNESS (0-10):
   0-2: Mostly wrong, major misconceptions
   3-4: Partially correct but significant errors
   5-6: Correct basics but missing key details
   7-8: Fully correct with good accuracy
   9-10: Perfect accuracy with nuanced understanding (RARE!)

2. DEPTH (0-10):
   0-2: Surface level, no real understanding
   3-4: Basic understanding, lacks depth
   5-6: Decent understanding of core concepts
   7-8: Strong grasp including edge cases
   9-10: Expert-level insight and nuance (RARE!)

3. CLARITY (0-10):
   0-2: Confusing, hard to follow
   3-4: Somewhat unclear, jumps around
   5-6: Clear enough but could be better structured
   7-8: Well-articulated and logical
   9-10: Exceptionally clear, could teach others (RARE!)

4. COMPLETENESS (0-10):
   0-2: Major gaps, missed most points
   3-4: Covered some but left out important parts
   5-6: Hit main points but missing details
   7-8: Comprehensive coverage
   9-10: Every aspect covered brilliantly (RARE!)

REALISTIC SCORING EXAMPLES:

Short answer (20-30 words):
- Correctness: 4-5 (too brief)
- Depth: 3-4 (no depth)
- Clarity: 6 (clear but shallow)
- Completeness: 3-4 (missing details)

Good answer with examples (80-120 words):
- Correctness: 7-8 (solid facts)
- Depth: 6-7 (good understanding)
- Clarity: 7-8 (well explained)
- Completeness: 6-7 (most points covered)

Exceptional answer (150+ words, examples, trade-offs):
- Correctness: 8-9 (perfect accuracy)
- Depth: 8-9 (deep insights)
- Clarity: 8-9 (excellent communication)
- Completeness: 8-9 (nothing missing)

Response Format - Return ONLY valid JSON:
{
  "scores": {
    "correctness": <number 0-10>,
    "depth": <number 0-10>,
    "clarity": <number 0-10>,
    "completeness": <number 0-10>
  },
  "strengths": ["be specific", "point to exact parts of answer"],
  "weaknesses": ["be honest", "what was actually missing"],
  "feedback": "Direct, honest feedback like a real interviewer. Mention specific things they said or missed. Don't sugarcoat but be professional.",
  "suggestedImprovement": "Concrete advice on what would make this answer better.",
  "needsFollowUp": true,
  "probeAreas": ["specific gaps to probe"]
}

CRITICAL INSTRUCTIONS:
- BE REALISTIC - most answers are 5-7 range
- VARY your scores - every answer is different
- BE SPECIFIC in feedback - reference actual parts of their answer
- BE HONEST - if it's mediocre, score it 5-6, not 8-9
- LOOK at answer length - short answers can't score high on depth/completeness
- CHECK for specifics - vague answers score lower
- REWARD examples and metrics with higher scores
- PENALIZE buzzwords without substance
`;

// src/services/nlp.ts
var NLPService = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "NLPService");
  }
  /**
   * Analyze answer sentiment and quality metrics
   */
  async analyzeAnswer(answer, question) {
    const words = answer.trim().split(/\s+/);
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / wordCount;
    const technicalTermsPattern = /\b(algorithm|api|database|backend|frontend|server|client|microservice|docker|kubernetes|aws|cloud|sql|nosql|redis|cache|performance|scalability|architecture|pattern|framework|library|async|promise|callback|function|class|interface|type|struct|pointer|memory|cpu|latency|throughput|optimization|refactor|deploy|ci\/cd|test|unit|integration|authentication|authorization|security|encryption|hash|token|jwt|rest|graphql|websocket|http|https|tcp|udp|dns|load balancer|proxy|nginx|apache|node|react|vue|angular|python|java|go|rust|typescript|javascript)\b/gi;
    const technicalMatches = answer.match(technicalTermsPattern) || [];
    const technicalTerms = technicalMatches.length;
    const fillerWordsPattern = /\b(um|uh|like|you know|basically|actually|literally|sort of|kind of|i think|i mean|well|so|just|really)\b/gi;
    const fillerMatches = answer.match(fillerWordsPattern) || [];
    const fillerWords = fillerMatches.length;
    const keywords = this.extractKeywords(answer);
    let confidence = 0.5;
    if (wordCount >= 50) confidence += 0.1;
    if (wordCount >= 100) confidence += 0.1;
    if (sentenceCount >= 3) confidence += 0.1;
    if (technicalTerms >= 3) confidence += 0.15;
    if (avgWordLength > 5) confidence += 0.05;
    if (wordCount < 20) confidence -= 0.2;
    if (fillerWords > 5) confidence -= 0.1;
    if (sentenceCount < 2) confidence -= 0.1;
    confidence = Math.max(0, Math.min(1, confidence));
    const sentiment = await this.detectSentiment(answer);
    const suggestions = this.generateSuggestions({
      wordCount,
      sentenceCount,
      technicalTerms,
      fillerWords
    });
    return {
      sentiment,
      confidence,
      keywords,
      metrics: {
        wordCount,
        sentenceCount,
        avgWordLength,
        technicalTerms,
        fillerWords
      },
      suggestions
    };
  }
  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    const stopWords = /* @__PURE__ */ new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "were",
      "been",
      "be",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "what",
      "which",
      "who",
      "when",
      "where",
      "why",
      "how"
    ]);
    const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w)).filter((w) => /^[a-z]+$/.test(w));
    const freq = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    return Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 5).map(([word]) => word);
  }
  /**
   * Detect sentiment using Workers AI
   */
  async detectSentiment(text) {
    try {
      const prompt = `Analyze the sentiment of this interview answer. Respond with ONLY ONE WORD: positive, neutral, or negative.

Answer: "${text}"

Sentiment:`;
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 10
      });
      const result = response.response?.toLowerCase() || "neutral";
      if (result.includes("positive")) return "positive";
      if (result.includes("negative")) return "negative";
      return "neutral";
    } catch (error) {
      console.error("Sentiment detection failed:", error);
      return "neutral";
    }
  }
  /**
   * Generate suggestions based on metrics
   */
  generateSuggestions(metrics) {
    const suggestions = [];
    if (metrics.wordCount < 30) {
      suggestions.push(
        "Try to provide more detailed answers. Aim for at least 50-100 words to fully explain your thoughts."
      );
    }
    if (metrics.sentenceCount < 2) {
      suggestions.push(
        "Break your answer into multiple sentences for better clarity and structure."
      );
    }
    if (metrics.technicalTerms < 2) {
      suggestions.push(
        "Include more technical terms and specific examples to demonstrate your expertise."
      );
    }
    if (metrics.fillerWords > 5) {
      suggestions.push(
        'Reduce filler words like "um", "like", "actually" to sound more confident and professional.'
      );
    }
    if (metrics.wordCount > 300) {
      suggestions.push(
        "Your answer is quite long. Try to be more concise while maintaining the key points."
      );
    }
    if (suggestions.length === 0) {
      suggestions.push(
        "Great answer! Keep maintaining this level of detail and technical depth."
      );
    }
    return suggestions;
  }
  /**
   * Compare answer with ideal response patterns
   */
  async compareWithIdeal(answer, question, category) {
    try {
      const prompt = `You are an expert interview coach. Compare this candidate's answer to the question and identify:
1. Match score (0-100)
2. Missing key points
3. Answer strengths

Question: ${question}
Category: ${category}
Candidate Answer: ${answer}

Respond in JSON format:
{
  "matchScore": 75,
  "missingPoints": ["point1", "point2"],
  "strengths": ["strength1", "strength2"]
}`;
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      });
      const text = response.response || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          matchScore: result.matchScore || 50,
          missingPoints: result.missingPoints || [],
          strengths: result.strengths || []
        };
      }
      return {
        matchScore: 50,
        missingPoints: [],
        strengths: []
      };
    } catch (error) {
      console.error("Comparison failed:", error);
      return {
        matchScore: 50,
        missingPoints: [],
        strengths: []
      };
    }
  }
};

// src/services/llm.ts
var LLMService = class {
  constructor(ai, env) {
    this.ai = ai;
    this.env = env;
    if (env) {
      this.nlpService = new NLPService(env);
    }
  }
  static {
    __name(this, "LLMService");
  }
  nlpService;
  async generateQuestion(session, userContext) {
    const prompt = this.buildQuestionPrompt(session, userContext);
    const response = await this.ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: INTERVIEWER_PROMPT(session.interviewType, session.currentRound)
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    return this.parseQuestionResponse(response);
  }
  async evaluateAnswer(question, answer, session) {
    const nlpAnalysisPromise = this.nlpService ? this.nlpService.analyzeAnswer(answer, question.text) : null;
    const prompt = `
Question: ${question.text}
Candidate's Answer: ${answer}
Interview Type: ${session.interviewType}
Experience Level: ${session.experienceLevel} years
Round: ${session.currentRound}

Evaluate this answer according to the criteria provided in the system prompt.
Return a JSON evaluation.
`;
    const response = await this.ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        { role: "system", content: EVALUATOR_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.3
      // Lower temperature for consistent evaluation
    });
    const evaluation = this.parseEvaluationResponse(response);
    if (nlpAnalysisPromise) {
      const nlpAnalysis = await nlpAnalysisPromise;
      const nlpInsights = `

NLP Analysis:
- Word count: ${nlpAnalysis.metrics.wordCount}
- Technical terms used: ${nlpAnalysis.metrics.technicalTerms}
- Answer confidence: ${(nlpAnalysis.confidence * 100).toFixed(0)}%
- Sentiment: ${nlpAnalysis.sentiment}
${nlpAnalysis.suggestions.length > 0 ? "\nSuggestions:\n" + nlpAnalysis.suggestions.map((s) => `- ${s}`).join("\n") : ""}`;
      evaluation.feedback += nlpInsights;
      const confidenceBoost = (nlpAnalysis.confidence - 0.5) * 0.2;
      evaluation.scores.clarity = Math.max(
        0,
        Math.min(10, evaluation.scores.clarity + confidenceBoost * 10)
      );
    }
    return evaluation;
  }
  async generateFollowUp(question, answer, evaluation) {
    const prompt = `
Original Question: ${question.text}
Candidate's Answer: ${answer}
Evaluation: ${JSON.stringify(evaluation)}

The evaluation shows these areas need probing: ${evaluation.probeAreas.join(", ")}

Generate a natural follow-up question that:
1. Feels conversational (not robotic)
2. Digs deeper into unclear areas
3. Helps the candidate clarify their thinking
4. Is appropriate for the interview context

Return JSON with the follow-up question.
`;
    const response = await this.ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: "You are conducting a follow-up during an interview. Be natural and conversational."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8
    });
    return this.parseQuestionResponse(response);
  }
  async generateFinalEvaluation(session) {
    const allEvaluations = session.evaluations;
    const averageScores = this.calculateAverageScores(allEvaluations);
    const prompt = `
Interview Summary:
- Type: ${session.interviewType}
- Experience Level: ${session.experienceLevel} years
- Rounds Completed: ${session.rounds.join(", ")}

Performance Scores:
${JSON.stringify(averageScores, null, 2)}

Individual Evaluations:
${JSON.stringify(allEvaluations, null, 2)}

Generate a comprehensive final evaluation that includes:
1. Overall performance summary
2. Top 3 strengths
3. Top 3 areas for improvement
4. Specific action items for each weak area
5. Recommended resources for improvement
6. Overall recommendation (Strong Hire / Hire / No Hire)

Return structured JSON.
`;
    const response = await this.ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer providing final candidate evaluation."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.5
    });
    return JSON.parse(response.response);
  }
  getRandomStarterTopics(round) {
    const behavioralTopics = [
      "7. For the FIRST question, choose ONE of these diverse topics: Handling production incidents, Code review practices, Technical debt decisions, Mentoring juniors, Disagreement with manager, Time management under pressure, Learning new technology quickly, API design choices, Performance optimization, Security vulnerability handling",
      "7. For the FIRST question, choose ONE of these diverse topics: Database migration experience, Microservices challenges, Legacy code refactoring, CI/CD pipeline setup, On-call rotation experience, Technical documentation, Cross-team collaboration, Architectural decisions, Scaling challenges, Debugging complex issues",
      "7. For the FIRST question, choose ONE of these diverse topics: Failed project lessons, Tight deadline management, Quality vs speed tradeoffs, Customer-facing bug handling, Team conflict resolution, Process improvement, Technical presentation, Innovation proposal, Resource constraints, Emergency deployment"
    ];
    const technicalTopics = [
      "7. For the FIRST question, choose ONE of these topics: Database indexing, Caching strategies, Message queues, Load balancing, Authentication/Authorization, Rate limiting, Circuit breakers, Event-driven architecture, GraphQL vs REST, Serverless architecture",
      "7. For the FIRST question, choose ONE of these topics: Distributed transactions, CAP theorem, Eventual consistency, Sharding strategies, Connection pooling, Async processing, Websockets, CDN usage, Container orchestration, Service mesh",
      "7. For the FIRST question, choose ONE of these topics: SQL optimization, NoSQL design, API versioning, Data encryption, Backup strategies, Monitoring/Observability, Error handling patterns, Testing strategies, Code organization, Performance profiling"
    ];
    const topics = round === "BEHAVIORAL" ? behavioralTopics : technicalTopics;
    return topics[Math.floor(Math.random() * topics.length)];
  }
  buildQuestionPrompt(session, userContext) {
    const previousQuestions = session.conversationHistory.filter((m) => m.role === "interviewer").map((m, idx) => `${idx + 1}. ${m.content}`).join("\n");
    const candidateAnswers = session.conversationHistory.filter((m) => m.role === "candidate").slice(-2).map((m) => m.content.substring(0, 200)).join(" | ");
    const isFirstQuestion = session.conversationHistory.filter((m) => m.role === "interviewer").length === 0;
    const randomTopics = isFirstQuestion ? this.getRandomStarterTopics(session.currentRound) : "";
    return `
Generate an interview question with these parameters:

Interview Context:
- Type: ${session.interviewType}
- Experience Level: ${session.experienceLevel} years
- Current Round: ${session.currentRound}
- Questions Asked So Far: ${Math.floor(session.conversationHistory.length / 2)}

Candidate Context:
- Known Skills: ${userContext.skills?.join(", ") || "Unknown"}
- Weak Areas: ${userContext.weakAreas?.join(", ") || "None identified"}
- Recent Performance: ${session.evaluations.length > 0 ? `Avg score ${(session.evaluations.slice(-3).reduce((sum, e) => sum + (e.scores.correctness + e.scores.depth + e.scores.clarity + e.scores.completeness) / 4, 0) / Math.min(3, session.evaluations.length)).toFixed(1)}/10` : "First question"}
- Target Role Requirements: ${userContext.jdRequirements || "General interview"}

ALL PREVIOUS QUESTIONS (DO NOT REPEAT ANY OF THESE):
${previousQuestions || "None yet - this is the first question"}

Recent Candidate Answers (to understand their level):
${candidateAnswers || "None yet"}

CRITICAL INSTRUCTIONS:
1. Generate a COMPLETELY DIFFERENT question from all previous ones listed above
2. Do NOT ask about the same topic/concept already covered
3. Make sure the question is appropriate for ${session.experienceLevel} years experience
4. For ${session.currentRound} round, focus on relevant skills
5. If performance is low, ask slightly easier questions; if high, increase difficulty
6. Avoid generic questions - be specific and scenario-based
${randomTopics}

Return ONLY this JSON format (no extra text):
{
  "text": "The question text - make it conversational and specific",
  "category": "specific topic/category",
  "difficulty": "easy|medium|hard",
  "followUpHints": ["hint1", "hint2"],
  "evaluationCriteria": {
    "correctness": "what to look for",
    "depth": "what level of understanding",
    "communication": "how they should explain"
  }
}
`;
  }
  parseQuestionResponse(response) {
    try {
      let parsed;
      if (typeof response.response === "object" && response.response !== null) {
        console.log("AI returned object directly:", response.response);
        parsed = response.response;
      } else if (typeof response.response === "string") {
        let responseText = response.response;
        console.log("AI returned string, parsing:", responseText);
        if (responseText.includes("```")) {
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            responseText = jsonMatch[1];
          }
        }
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }
        parsed = JSON.parse(responseText);
      } else {
        throw new Error("Unexpected response type: " + typeof response.response);
      }
      console.log("Successfully parsed question:", parsed.text);
      return {
        id: crypto.randomUUID(),
        type: parsed.type || "TECHNICAL",
        difficulty: parsed.difficulty || "medium",
        text: parsed.text || parsed,
        category: parsed.category || "general",
        expectedAnswer: parsed.expectedAnswer,
        followUpHints: parsed.followUpHints || [],
        evaluationCriteria: parsed.evaluationCriteria || {
          correctness: "Check accuracy",
          depth: "Assess understanding",
          communication: "Evaluate clarity"
        }
      };
    } catch (e) {
      console.error("Failed to parse question response:", e);
      console.error("Raw response was:", response.response);
      console.error("Response type:", typeof response.response);
      return {
        id: crypto.randomUUID(),
        type: "TECHNICAL",
        difficulty: "medium",
        text: typeof response.response === "string" ? response.response : "Tell me about a time when you had to work with a cross-functional team to resolve a complex data issue. How did you ensure effective collaboration and communication among team members with different backgrounds and expertise?",
        category: "general",
        evaluationCriteria: {
          correctness: "Check accuracy",
          depth: "Assess understanding",
          communication: "Evaluate clarity"
        }
      };
    }
  }
  parseEvaluationResponse(response) {
    try {
      let parsed;
      if (typeof response.response === "object" && response.response !== null) {
        console.log("AI returned evaluation object directly");
        parsed = response.response;
      } else if (typeof response.response === "string") {
        let responseText = response.response;
        console.log("AI returned evaluation string, parsing");
        if (responseText.includes("```")) {
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            responseText = jsonMatch[1];
          }
        }
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }
        parsed = JSON.parse(responseText);
      } else {
        throw new Error("Unexpected response type: " + typeof response.response);
      }
      console.log("Successfully parsed evaluation with scores:", parsed.scores);
      return {
        questionId: parsed.questionId || "",
        scores: parsed.scores,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        feedback: parsed.feedback,
        suggestedImprovement: parsed.suggestedImprovement,
        needsFollowUp: parsed.needsFollowUp || false,
        probeAreas: parsed.probeAreas || []
      };
    } catch (e) {
      console.error("Failed to parse evaluation:", e, "Response was:", response.response);
      return {
        questionId: "",
        scores: {
          correctness: 5,
          depth: 5,
          clarity: 5,
          completeness: 5
        },
        strengths: [],
        weaknesses: [],
        feedback: "Unable to evaluate at this time.",
        suggestedImprovement: "",
        needsFollowUp: false,
        probeAreas: []
      };
    }
  }
  calculateAverageScores(evaluations) {
    if (evaluations.length === 0) return {};
    const totals = evaluations.reduce((acc, evaluation) => {
      acc.correctness += evaluation.scores.correctness;
      acc.depth += evaluation.scores.depth;
      acc.clarity += evaluation.scores.clarity;
      acc.completeness += evaluation.scores.completeness;
      return acc;
    }, { correctness: 0, depth: 0, clarity: 0, completeness: 0 });
    const count = evaluations.length;
    return {
      correctness: (totals.correctness / count).toFixed(2),
      depth: (totals.depth / count).toFixed(2),
      clarity: (totals.clarity / count).toFixed(2),
      completeness: (totals.completeness / count).toFixed(2),
      overall: ((totals.correctness + totals.depth + totals.clarity + totals.completeness) / (count * 4)).toFixed(2)
    };
  }
};

// src/workers/api.ts
var APIWorker = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "APIWorker");
  }
  async handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      let response;
      if (path.startsWith("/api/session")) {
        response = await this.handleSession(request, path);
      } else if (path.startsWith("/api/gap-analysis")) {
        response = await this.handleGapAnalysis(request);
      } else if (path.startsWith("/api/resume")) {
        response = await this.handleResume(request, path);
      } else if (path.startsWith("/api/jd")) {
        response = await this.handleJD(request, path);
      } else if (path.startsWith("/api/memory")) {
        response = await this.handleMemory(request, path);
      } else if (path.startsWith("/api/voice")) {
        response = await this.handleVoice(request, path);
      } else {
        response = new Response("Not Found", { status: 404 });
      }
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    } catch (error) {
      console.error("API Error:", error);
      return Response.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }
  }
  async handleSession(request, path) {
    if (path === "/api/session/start" && request.method === "POST") {
      return await this.startSession(request);
    } else if (path.match(/\/api\/session\/[^/]+$/) && request.method === "GET") {
      const sessionId = path.split("/").pop();
      return await this.getSession(sessionId);
    } else if (path.match(/\/api\/session\/[^/]+\/message$/) && request.method === "POST") {
      const sessionId = path.split("/")[3];
      return await this.sendMessage(request, sessionId);
    } else if (path.match(/\/api\/session\/[^/]+$/) && request.method === "DELETE") {
      const sessionId = path.split("/").pop();
      return await this.endSession(sessionId);
    }
    return new Response("Not Found", { status: 404 });
  }
  async startSession(request) {
    const body = await request.json();
    const { userId, interviewType, experienceLevel, rounds, resumeId, jdId } = body;
    if (!userId || !interviewType || experienceLevel === void 0) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const existingUser = await this.env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!existingUser) {
      await this.env.DB.prepare("INSERT INTO users (id, created_at, last_login) VALUES (?, ?, ?)").bind(userId, (/* @__PURE__ */ new Date()).toISOString(), (/* @__PURE__ */ new Date()).toISOString()).run();
    } else {
      await this.env.DB.prepare("UPDATE users SET last_login = ? WHERE id = ?").bind((/* @__PURE__ */ new Date()).toISOString(), userId).run();
    }
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      userId,
      interviewType,
      experienceLevel,
      currentRound: rounds?.[0] || "BEHAVIORAL",
      rounds: rounds || ["BEHAVIORAL", "TECHNICAL", "CODING"],
      conversationHistory: [],
      currentQuestion: null,
      evaluations: [],
      status: "active",
      startedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const userMemory = this.getUserMemoryDO(userId);
    const userContext = await (await userMemory.fetch(new Request("http://internal/memory"))).json();
    if (resumeId) {
      const resume = await this.env.DB.prepare("SELECT parsed_data FROM resumes WHERE id = ?").bind(resumeId).first();
      userContext.resume = resume ? JSON.parse(resume.parsed_data) : null;
    }
    if (jdId) {
      const jd = await this.env.DB.prepare("SELECT parsed_requirements FROM job_descriptions WHERE id = ?").bind(jdId).first();
      userContext.jdRequirements = jd ? JSON.parse(jd.parsed_requirements) : null;
    }
    const llm = new LLMService(this.env.AI, this.env);
    const firstQuestion = await llm.generateQuestion(session, userContext);
    session.currentQuestion = firstQuestion;
    const firstMessage = {
      id: crypto.randomUUID(),
      role: "interviewer",
      content: firstQuestion.text,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    session.conversationHistory.push(firstMessage);
    await this.env.DB.prepare(`
        INSERT INTO sessions (id, user_id, interview_type, experience_level, status, started_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
      sessionId,
      userId,
      interviewType,
      experienceLevel,
      "active",
      session.startedAt
    ).run();
    await this.env.SESSION_CACHE.put(
      `session:${sessionId}`,
      JSON.stringify(session),
      { expirationTtl: 3600 }
      // 1 hour
    );
    return Response.json({
      sessionId,
      firstQuestion: firstQuestion.text,
      session
    });
  }
  async sendMessage(request, sessionId) {
    const { message, audio } = await request.json();
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }
    const session = JSON.parse(sessionData);
    const userMessage = {
      id: crypto.randomUUID(),
      role: "candidate",
      content: message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      audioUrl: audio ? `audio/${sessionId}/${crypto.randomUUID()}.webm` : void 0
    };
    session.conversationHistory.push(userMessage);
    if (audio && this.env.AUDIO_BUCKET) {
      const audioBuffer = Buffer.from(audio, "base64");
      await this.env.AUDIO_BUCKET.put(userMessage.audioUrl, audioBuffer);
    }
    const llm = new LLMService(this.env.AI, this.env);
    const evaluation = await llm.evaluateAnswer(
      session.currentQuestion,
      message,
      session
    );
    session.evaluations.push(evaluation);
    await this.env.DB.prepare(`
        INSERT INTO session_messages (id, session_id, role, content, timestamp, evaluation)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
      userMessage.id,
      sessionId,
      userMessage.role,
      userMessage.content,
      userMessage.timestamp,
      JSON.stringify(evaluation)
    ).run();
    let nextQuestion = null;
    let sessionComplete = false;
    if (evaluation.needsFollowUp) {
      nextQuestion = await llm.generateFollowUp(
        session.currentQuestion,
        message,
        evaluation
      );
    } else {
      const userMemory = this.getUserMemoryDO(session.userId);
      const userContext = await (await userMemory.fetch(new Request("http://internal/memory"))).json();
      nextQuestion = await llm.generateQuestion(session, userContext);
    }
    session.currentQuestion = nextQuestion;
    const interviewerMessage = {
      id: crypto.randomUUID(),
      role: "interviewer",
      content: nextQuestion.text,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    session.conversationHistory.push(interviewerMessage);
    await this.env.SESSION_CACHE.put(
      `session:${sessionId}`,
      JSON.stringify(session),
      { expirationTtl: 3600 }
    );
    return Response.json({
      interviewerResponse: nextQuestion.text,
      evaluation: {
        scores: evaluation.scores,
        feedback: evaluation.feedback
      },
      sessionComplete
    });
  }
  async getSession(sessionId) {
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }
    return Response.json(JSON.parse(sessionData));
  }
  async endSession(sessionId) {
    const sessionData = await this.env.SESSION_CACHE.get(`session:${sessionId}`);
    if (!sessionData) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }
    const session = JSON.parse(sessionData);
    const llm = new LLMService(this.env.AI, this.env);
    const finalEvaluation = await llm.generateFinalEvaluation(session);
    session.status = "completed";
    session.endedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.env.DB.prepare(`
        UPDATE sessions 
        SET status = ?, ended_at = ?, final_score = ?
        WHERE id = ?
      `).bind("completed", session.endedAt, finalEvaluation.overallScore, sessionId).run();
    const userMemory = this.getUserMemoryDO(session.userId);
    await userMemory.fetch(new Request("http://internal/update", {
      method: "POST",
      body: JSON.stringify({
        weakAreas: finalEvaluation.weakAreas,
        sessionSummary: {
          sessionId,
          date: session.endedAt,
          score: finalEvaluation.overallScore,
          interviewType: session.interviewType
        }
      })
    }));
    await this.env.SESSION_CACHE.delete(`session:${sessionId}`);
    return Response.json({
      sessionId,
      finalEvaluation
    });
  }
  getUserMemoryDO(userId) {
    const id = this.env.USER_MEMORY.idFromName(userId);
    return this.env.USER_MEMORY.get(id);
  }
  // Resume handling - removed, not used (using paste-only in frontend)
  async handleResume(request, path) {
    return Response.json({ error: "Resume upload removed - use paste-only in frontend" }, { status: 404 });
  }
  // Job Description handling - removed, not used (using paste-only in frontend)
  async handleJD(request, path) {
    return Response.json({ error: "JD upload removed - use paste-only in frontend" }, { status: 404 });
  }
  // Memory handling
  async handleMemory(request, path) {
    const userIdMatch = path.match(/\/api\/memory\/([^/]+)/);
    if (!userIdMatch) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }
    const userId = userIdMatch[1];
    const userMemory = this.getUserMemoryDO(userId);
    const doPath = path.replace(`/api/memory/${userId}`, "");
    const doUrl = `http://internal${doPath || "/memory"}`;
    return await userMemory.fetch(new Request(doUrl, {
      method: request.method,
      body: request.body,
      headers: request.headers
    }));
  }
  // Voice handling - removed, using Web Speech API in frontend
  async handleVoice(request, path) {
    return Response.json({ error: "Voice handling removed - using Web Speech API in frontend" }, { status: 404 });
  }
  // Gap Analysis handling
  async handleGapAnalysis(request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await request.json();
    const { resume, jobDescription } = body;
    if (!resume || !jobDescription) {
      return Response.json({ error: "Both resume and jobDescription are required" }, { status: 400 });
    }
    const llm = new LLMService(this.env.AI, this.env);
    const analysisPrompt = `
You are an expert career advisor analyzing resume-job description fit.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Analyze the gap between this resume and job description. Return ONLY valid JSON:
{
  "matchingSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "matchPercentage": 75,
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ],
  "suggestedInterviewQuestions": [
    "Question about missing skill 1",
    "Question about missing skill 2"
  ]
}`;
    try {
      const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          { role: "system", content: "You are a career advisor. Return only valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });
      let parsed;
      if (typeof response.response === "object") {
        parsed = response.response;
      } else {
        const responseText = response.response;
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          parsed = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
        } else {
          parsed = JSON.parse(responseText);
        }
      }
      return Response.json(parsed);
    } catch (error) {
      console.error("Gap analysis error:", error);
      return Response.json({
        error: "Failed to analyze gap",
        matchingSkills: [],
        missingSkills: [],
        recommendations: ["Unable to analyze at this time. Please try again."]
      }, { status: 500 });
    }
  }
};

// node_modules/@cloudflare/kv-asset-handler/dist/index.js
var mime = __toESM(require_mime(), 1);
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var KVError = class _KVError extends Error {
  static {
    __name(this, "_KVError");
  }
  static {
    __name2(this, "KVError");
  }
  constructor(message, status = 500) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = _KVError.name;
    this.status = status;
  }
  status;
};
var MethodNotAllowedError = class extends KVError {
  static {
    __name(this, "MethodNotAllowedError");
  }
  static {
    __name2(this, "MethodNotAllowedError");
  }
  constructor(message = `Not a valid request method`, status = 405) {
    super(message, status);
  }
};
var NotFoundError = class extends KVError {
  static {
    __name(this, "NotFoundError");
  }
  static {
    __name2(this, "NotFoundError");
  }
  constructor(message = `Not Found`, status = 404) {
    super(message, status);
  }
};
var InternalError = class extends KVError {
  static {
    __name(this, "InternalError");
  }
  static {
    __name2(this, "InternalError");
  }
  constructor(message = `Internal Error in KV Asset Handler`, status = 500) {
    super(message, status);
  }
};
var defaultCacheControl = {
  browserTTL: null,
  edgeTTL: 2 * 60 * 60 * 24,
  // 2 days
  bypassCache: false
  // do not bypass Cloudflare's cache
};
var parseStringAsObject = /* @__PURE__ */ __name2((maybeString) => typeof maybeString === "string" ? JSON.parse(maybeString) : maybeString, "parseStringAsObject");
function getAssetFromKVDefaultOptions() {
  return {
    ASSET_NAMESPACE: typeof __STATIC_CONTENT !== "undefined" ? __STATIC_CONTENT : void 0,
    ASSET_MANIFEST: typeof __STATIC_CONTENT_MANIFEST !== "undefined" ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : {},
    cacheControl: defaultCacheControl,
    defaultMimeType: "text/plain",
    defaultDocument: "index.html",
    pathIsEncoded: false,
    defaultETag: "strong"
  };
}
__name(getAssetFromKVDefaultOptions, "getAssetFromKVDefaultOptions");
__name2(getAssetFromKVDefaultOptions, "getAssetFromKVDefaultOptions");
function assignOptions(options) {
  return Object.assign({}, getAssetFromKVDefaultOptions(), options);
}
__name(assignOptions, "assignOptions");
__name2(assignOptions, "assignOptions");
var mapRequestToAsset = /* @__PURE__ */ __name2((request, options) => {
  options = assignOptions(options);
  const parsedUrl = new URL(request.url);
  let pathname = parsedUrl.pathname;
  if (pathname.endsWith("/")) {
    pathname = pathname.concat(options.defaultDocument);
  } else if (!mime.getType(pathname)) {
    pathname = pathname.concat("/" + options.defaultDocument);
  }
  parsedUrl.pathname = pathname;
  return new Request(parsedUrl.toString(), request);
}, "mapRequestToAsset");
function serveSinglePageApp(request, options) {
  options = assignOptions(options);
  request = mapRequestToAsset(request, options);
  const parsedUrl = new URL(request.url);
  if (parsedUrl.pathname.endsWith(".html")) {
    return new Request(
      `${parsedUrl.origin}/${options.defaultDocument}`,
      request
    );
  } else {
    return request;
  }
}
__name(serveSinglePageApp, "serveSinglePageApp");
__name2(serveSinglePageApp, "serveSinglePageApp");
var getAssetFromKV = /* @__PURE__ */ __name2(async (event, options) => {
  options = assignOptions(options);
  const request = event.request;
  const ASSET_NAMESPACE = options.ASSET_NAMESPACE;
  const ASSET_MANIFEST = parseStringAsObject(
    options.ASSET_MANIFEST
  );
  if (typeof ASSET_NAMESPACE === "undefined") {
    throw new InternalError(`there is no KV namespace bound to the script`);
  }
  const rawPathKey = new URL(request.url).pathname.replace(/^\/+/, "");
  let pathIsEncoded = options.pathIsEncoded;
  let requestKey;
  if (options.mapRequestToAsset) {
    requestKey = options.mapRequestToAsset(request);
  } else if (ASSET_MANIFEST[rawPathKey]) {
    requestKey = request;
  } else if (ASSET_MANIFEST[decodeURIComponent(rawPathKey)]) {
    pathIsEncoded = true;
    requestKey = request;
  } else {
    const mappedRequest = mapRequestToAsset(request);
    const mappedRawPathKey = new URL(mappedRequest.url).pathname.replace(
      /^\/+/,
      ""
    );
    if (ASSET_MANIFEST[decodeURIComponent(mappedRawPathKey)]) {
      pathIsEncoded = true;
      requestKey = mappedRequest;
    } else {
      requestKey = mapRequestToAsset(request, options);
    }
  }
  const SUPPORTED_METHODS = ["GET", "HEAD"];
  if (!SUPPORTED_METHODS.includes(requestKey.method)) {
    throw new MethodNotAllowedError(
      `${requestKey.method} is not a valid request method`
    );
  }
  const parsedUrl = new URL(requestKey.url);
  const pathname = pathIsEncoded ? decodeURIComponent(parsedUrl.pathname) : parsedUrl.pathname;
  let pathKey = pathname.replace(/^\/+/, "");
  const cache = caches.default;
  let mimeType = mime.getType(pathKey) || options.defaultMimeType;
  if (mimeType.startsWith("text") || mimeType === "application/javascript") {
    mimeType += "; charset=utf-8";
  }
  let shouldEdgeCache = false;
  if (typeof ASSET_MANIFEST !== "undefined") {
    if (ASSET_MANIFEST[pathKey]) {
      pathKey = ASSET_MANIFEST[pathKey];
      shouldEdgeCache = true;
    }
  }
  const cacheKey = new Request(`${parsedUrl.origin}/${pathKey}`, request);
  const evalCacheOpts = (() => {
    switch (typeof options.cacheControl) {
      case "function":
        return options.cacheControl(request);
      case "object":
        return options.cacheControl;
      default:
        return defaultCacheControl;
    }
  })();
  const formatETag = /* @__PURE__ */ __name2((entityId = pathKey, validatorType = options.defaultETag) => {
    if (!entityId) {
      return "";
    }
    switch (validatorType) {
      case "weak":
        if (!entityId.startsWith("W/")) {
          if (entityId.startsWith(`"`) && entityId.endsWith(`"`)) {
            return `W/${entityId}`;
          }
          return `W/"${entityId}"`;
        }
        return entityId;
      case "strong":
        if (entityId.startsWith(`W/"`)) {
          entityId = entityId.replace("W/", "");
        }
        if (!entityId.endsWith(`"`)) {
          entityId = `"${entityId}"`;
        }
        return entityId;
      default:
        return "";
    }
  }, "formatETag");
  options.cacheControl = Object.assign({}, defaultCacheControl, evalCacheOpts);
  if (options.cacheControl.bypassCache || options.cacheControl.edgeTTL === null || request.method == "HEAD") {
    shouldEdgeCache = false;
  }
  const shouldSetBrowserCache = typeof options.cacheControl.browserTTL === "number";
  let response = null;
  if (shouldEdgeCache) {
    response = await cache.match(cacheKey);
  }
  if (response) {
    if (response.status > 300 && response.status < 400) {
      if (response.body && "cancel" in Object.getPrototypeOf(response.body)) {
        response.body.cancel();
      }
      response = new Response(null, response);
    } else {
      const opts = {
        headers: new Headers(response.headers),
        status: 0,
        statusText: ""
      };
      opts.headers.set("cf-cache-status", "HIT");
      if (response.status) {
        opts.status = response.status;
        opts.statusText = response.statusText;
      } else if (opts.headers.has("Content-Range")) {
        opts.status = 206;
        opts.statusText = "Partial Content";
      } else {
        opts.status = 200;
        opts.statusText = "OK";
      }
      response = new Response(response.body, opts);
    }
  } else {
    const body = await ASSET_NAMESPACE.get(pathKey, "arrayBuffer");
    if (body === null) {
      throw new NotFoundError(
        `could not find ${pathKey} in your content namespace`
      );
    }
    response = new Response(body);
    if (shouldEdgeCache) {
      response.headers.set("Accept-Ranges", "bytes");
      response.headers.set("Content-Length", String(body.byteLength));
      if (!response.headers.has("etag")) {
        response.headers.set("etag", formatETag(pathKey));
      }
      response.headers.set(
        "Cache-Control",
        `max-age=${options.cacheControl.edgeTTL}`
      );
      event.waitUntil(cache.put(cacheKey, response.clone()));
      response.headers.set("CF-Cache-Status", "MISS");
    }
  }
  response.headers.set("Content-Type", mimeType);
  if (response.status === 304) {
    const etag = formatETag(response.headers.get("etag"));
    const ifNoneMatch = cacheKey.headers.get("if-none-match");
    const proxyCacheStatus = response.headers.get("CF-Cache-Status");
    if (etag) {
      if (ifNoneMatch && ifNoneMatch === etag && proxyCacheStatus === "MISS") {
        response.headers.set("CF-Cache-Status", "EXPIRED");
      } else {
        response.headers.set("CF-Cache-Status", "REVALIDATED");
      }
      response.headers.set("etag", formatETag(etag, "weak"));
    }
  }
  if (shouldSetBrowserCache) {
    response.headers.set(
      "Cache-Control",
      `max-age=${options.cacheControl.browserTTL}`
    );
  } else {
    response.headers.delete("Cache-Control");
  }
  return response;
}, "getAssetFromKV");

// src/durable-objects/user-memory.ts
import { DurableObject } from "cloudflare:workers";
var UserMemoryDO = class extends DurableObject {
  static {
    __name(this, "UserMemoryDO");
  }
  memory = null;
  constructor(state, env) {
    super(state, env);
  }
  /**
   * Main fetch handler for the Durable Object
   */
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      switch (path) {
        case "/memory":
          return await this.getMemory();
        case "/initialize":
          return await this.initialize(await request.json());
        case "/update":
          return await this.updateMemory(await request.json());
        case "/weak-areas":
          return await this.getWeakAreas();
        case "/weak-areas/update":
          return await this.updateWeakAreas(await request.json());
        case "/skills/progress":
          return await this.getSkillProgress();
        case "/skills/update":
          return await this.updateSkillProgress(await request.json());
        case "/session/add":
          return await this.addSession(await request.json());
        case "/analytics":
          return await this.getAnalytics();
        case "/recommendations":
          return await this.getRecommendations();
        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("UserMemoryDO Error:", error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
  /**
   * Load memory from storage or create new
   */
  async loadMemory() {
    if (this.memory) {
      return this.memory;
    }
    const stored = await this.state.storage.get("memory");
    if (stored) {
      this.memory = stored;
      return stored;
    }
    this.memory = {
      userId: this.state.id.toString(),
      personalInfo: {
        name: "",
        email: "",
        targetRole: null,
        experienceYears: 0
      },
      resume: null,
      weakAreas: [],
      skillProgress: /* @__PURE__ */ new Map(),
      sessionHistory: [],
      preferences: {
        voiceEnabled: true,
        selectedVoice: "professional",
        interruptionsEnabled: true,
        detailedFeedback: true,
        focusAreas: []
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await this.saveMemory();
    return this.memory;
  }
  /**
   * Save memory to persistent storage
   */
  async saveMemory() {
    if (!this.memory) return;
    this.memory.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.state.storage.put("memory", this.memory);
  }
  /**
   * Get full memory
   */
  async getMemory() {
    const memory = await this.loadMemory();
    return Response.json(memory);
  }
  /**
   * Initialize user memory
   */
  async initialize(data) {
    const memory = await this.loadMemory();
    if (data.personalInfo) {
      memory.personalInfo = { ...memory.personalInfo, ...data.personalInfo };
    }
    if (data.resume) {
      memory.resume = data.resume;
      await this.extractSkillsFromResume(data.resume);
    }
    await this.saveMemory();
    return Response.json({ success: true, memory });
  }
  /**
   * Update memory with new data
   */
  async updateMemory(data) {
    const memory = await this.loadMemory();
    if (data.resume) {
      memory.resume = data.resume;
      await this.extractSkillsFromResume(data.resume);
    }
    if (data.preferences) {
      memory.preferences = { ...memory.preferences, ...data.preferences };
    }
    await this.saveMemory();
    return Response.json({ success: true });
  }
  /**
   * Get weak areas
   */
  async getWeakAreas() {
    const memory = await this.loadMemory();
    const sortedWeakAreas = memory.weakAreas.sort((a, b) => {
      const severityWeight = { high: 3, medium: 2, low: 1 };
      const severityDiff = severityWeight[b.severity] - severityWeight[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.practiceCount - b.practiceCount;
    });
    return Response.json({ weakAreas: sortedWeakAreas });
  }
  /**
   * Update weak areas after a session
   */
  async updateWeakAreas(data) {
    const memory = await this.loadMemory();
    for (const skill of data.newWeakAreas) {
      const existing = memory.weakAreas.find((wa) => wa.skill === skill);
      if (existing) {
        existing.detectedIn.push(data.sessionId);
        existing.severity = this.calculateSeverity(existing.detectedIn.length);
        existing.trendDirection = "declining";
      } else {
        memory.weakAreas.push({
          skill,
          category: this.categorizeSkill(skill),
          severity: "low",
          detectedIn: [data.sessionId],
          improvementPlan: await this.generateImprovementPlan(skill),
          lastPracticed: null,
          practiceCount: 0,
          trendDirection: "stable"
        });
      }
    }
    for (const skill of data.improvedAreas) {
      const weakArea = memory.weakAreas.find((wa) => wa.skill === skill);
      if (weakArea) {
        weakArea.practiceCount++;
        weakArea.lastPracticed = (/* @__PURE__ */ new Date()).toISOString();
        weakArea.trendDirection = "improving";
        if (weakArea.practiceCount >= 3 && weakArea.severity === "low") {
          memory.weakAreas = memory.weakAreas.filter((wa) => wa.skill !== skill);
        }
      }
    }
    await this.saveMemory();
    return Response.json({ success: true, weakAreas: memory.weakAreas });
  }
  /**
   * Get skill progress
   */
  async getSkillProgress() {
    const memory = await this.loadMemory();
    const progressArray = Array.from(memory.skillProgress.entries()).map(([skill, progress]) => ({
      skill,
      ...progress
    }));
    return Response.json({ skills: progressArray });
  }
  /**
   * Update skill progress after evaluation
   */
  async updateSkillProgress(data) {
    const memory = await this.loadMemory();
    for (const { skill, score } of data.evaluations) {
      const existing = memory.skillProgress.get(skill);
      if (existing) {
        existing.currentScore = score;
        existing.historicalScores.push({
          date: (/* @__PURE__ */ new Date()).toISOString(),
          score
        });
        existing.practiceCount++;
        existing.lastPracticed = (/* @__PURE__ */ new Date()).toISOString();
        existing.masteryLevel = this.calculateMasteryLevel(score);
      } else {
        memory.skillProgress.set(skill, {
          skill,
          category: this.categorizeSkill(skill),
          initialScore: score,
          currentScore: score,
          historicalScores: [{ date: (/* @__PURE__ */ new Date()).toISOString(), score }],
          practiceCount: 1,
          lastPracticed: (/* @__PURE__ */ new Date()).toISOString(),
          masteryLevel: this.calculateMasteryLevel(score)
        });
      }
    }
    await this.saveMemory();
    return Response.json({ success: true });
  }
  /**
   * Add completed session to history
   */
  async addSession(data) {
    const memory = await this.loadMemory();
    memory.sessionHistory.push(data);
    if (memory.sessionHistory.length > 50) {
      memory.sessionHistory = memory.sessionHistory.slice(-50);
    }
    await this.saveMemory();
    return Response.json({ success: true });
  }
  /**
   * Get analytics and insights
   */
  async getAnalytics() {
    const memory = await this.loadMemory();
    if (memory.sessionHistory.length === 0) {
      return Response.json({
        totalSessions: 0,
        message: "No session history available"
      });
    }
    const totalSessions = memory.sessionHistory.length;
    const averageScore = memory.sessionHistory.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions;
    const recentSessions = memory.sessionHistory.slice(-5);
    const recentAverage = recentSessions.reduce((sum, s) => sum + s.overallScore, 0) / recentSessions.length;
    const trend = recentAverage > averageScore ? "improving" : "declining";
    const typeCounts = memory.sessionHistory.reduce((acc, s) => {
      acc[s.interviewType] = (acc[s.interviewType] || 0) + 1;
      return acc;
    }, {});
    const allStrengths = memory.sessionHistory.flatMap((s) => s.strengths);
    const strengthCounts = allStrengths.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const topStrengths = Object.entries(strengthCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([skill]) => skill);
    const topWeakAreas = memory.weakAreas.slice(0, 5).map((wa) => ({
      skill: wa.skill,
      severity: wa.severity,
      practiceCount: wa.practiceCount
    }));
    return Response.json({
      totalSessions,
      averageScore: averageScore.toFixed(2),
      recentAverage: recentAverage.toFixed(2),
      trend,
      interviewTypeCounts: typeCounts,
      topStrengths,
      weakAreas: topWeakAreas,
      skillProgress: Array.from(memory.skillProgress.values())
    });
  }
  /**
   * Get personalized recommendations
   */
  async getRecommendations() {
    const memory = await this.loadMemory();
    const recommendations = [];
    const highPriorityWeakAreas = memory.weakAreas.filter((wa) => wa.severity === "high");
    if (highPriorityWeakAreas.length > 0) {
      recommendations.push(
        `Focus on these critical areas: ${highPriorityWeakAreas.map((wa) => wa.skill).join(", ")}`
      );
    }
    const unpracticedAreas = memory.weakAreas.filter((wa) => wa.practiceCount === 0).slice(0, 3);
    if (unpracticedAreas.length > 0) {
      recommendations.push(
        `Start practicing: ${unpracticedAreas.map((wa) => wa.skill).join(", ")}`
      );
    }
    if (memory.sessionHistory.length >= 3) {
      const lastThree = memory.sessionHistory.slice(-3);
      const averageRecent = lastThree.reduce((sum, s) => sum + s.overallScore, 0) / 3;
      if (averageRecent < 6) {
        recommendations.push("Consider taking a mock interview with longer preparation time");
      } else if (averageRecent > 8) {
        recommendations.push("Great progress! Try more challenging interview levels");
      }
    }
    if (memory.personalInfo.targetRole && memory.resume) {
      recommendations.push(
        `For ${memory.personalInfo.targetRole}: Focus on system design and scalability questions`
      );
    }
    return Response.json({ recommendations });
  }
  // ===== Helper Methods =====
  async extractSkillsFromResume(resume) {
    const memory = await this.loadMemory();
    const allSkills = [
      ...resume.skills?.languages || [],
      ...resume.skills?.frameworks || [],
      ...resume.skills?.tools || [],
      ...resume.skills?.cloud || [],
      ...resume.skills?.databases || []
    ];
    for (const skill of allSkills) {
      if (!memory.skillProgress.has(skill)) {
        memory.skillProgress.set(skill, {
          skill,
          category: this.categorizeSkill(skill),
          initialScore: 5,
          // Neutral starting point
          currentScore: 5,
          historicalScores: [],
          practiceCount: 0,
          lastPracticed: (/* @__PURE__ */ new Date()).toISOString(),
          masteryLevel: "intermediate"
        });
      }
    }
  }
  categorizeSkill(skill) {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes("leadership") || lowerSkill.includes("communication")) {
      return "behavioral";
    }
    if (lowerSkill.includes("algorithm") || lowerSkill.includes("data structure")) {
      return "coding";
    }
    if (lowerSkill.includes("architecture") || lowerSkill.includes("scalability")) {
      return "system_design";
    }
    return "technical";
  }
  calculateSeverity(detectionCount) {
    if (detectionCount >= 3) return "high";
    if (detectionCount === 2) return "medium";
    return "low";
  }
  calculateMasteryLevel(score) {
    if (score >= 9) return "expert";
    if (score >= 7) return "advanced";
    if (score >= 5) return "intermediate";
    return "beginner";
  }
  async generateImprovementPlan(skill) {
    return [
      `Practice ${skill} fundamentals`,
      `Complete hands-on projects using ${skill}`,
      `Review common interview questions about ${skill}`
    ];
  }
};

// src/index.ts
var app = new Hono2();
app.use("/*", cors());
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.all("/api/*", async (c) => {
  const apiWorker = new APIWorker(c.env);
  return await apiWorker.handleRequest(c.req.raw);
});
app.get("/*", async (c) => {
  try {
    return await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil: /* @__PURE__ */ __name(() => {
        }, "waitUntil")
      },
      {
        ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
        ASSET_MANIFEST: c.env.__STATIC_CONTENT_MANIFEST
      }
    );
  } catch (e) {
    try {
      const indexRequest = new Request(new URL("/index.html", c.req.url));
      return await getAssetFromKV(
        {
          request: indexRequest,
          waitUntil: /* @__PURE__ */ __name(() => {
          }, "waitUntil")
        },
        {
          ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
          ASSET_MANIFEST: c.env.__STATIC_CONTENT_MANIFEST
        }
      );
    } catch (e2) {
      return c.json({ error: "Not found" }, 404);
    }
  }
});
var index_default = app;
export {
  UserMemoryDO,
  index_default as default
};
//# sourceMappingURL=index.js.map
