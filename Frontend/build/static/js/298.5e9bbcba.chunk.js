"use strict";(self.webpackChunkchat=self.webpackChunkchat||[]).push([[298],{6393:(e,t,n)=>{n.d(t,{Z:()=>o});var i=n(1134),r=n(7391),s=n(184);function o(e){let{name:t,helperText:n,...o}=e;const{control:a}=(0,i.Gc)();return(0,s.jsx)(i.Qr,{name:t,control:a,render:e=>{let{field:t,fieldState:{error:i}}=e;return(0,s.jsx)(r.Z,{...t,fullWidth:!0,value:"number"===typeof t.value&&0===t.value?"":t.value,error:!!i,helperText:i?null===i||void 0===i?void 0:i.message:n,...o})}})}},1298:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Fe});var i=n(3967),r=n(3767),s=n(4554),o=n(890),a=n(3400),l=n(4721),c=n(533),d=n(703),u=n(7320),x=n(2791),p=n(6934),h=n(2065);const g=(0,p.ZP)("div")((e=>{let{theme:t}=e;return{position:"relative",borderRadius:20,backgroundColor:(0,h.Fq)(t.palette.background.paper,1),marginRight:t.spacing(2),marginLeft:0,width:"100%"}})),m=(0,p.ZP)("div")((e=>{let{theme:t}=e;return{padding:t.spacing(0,2),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}));var j=n(4834);const Z=(0,p.ZP)(j.ZP)((e=>{let{theme:t}=e;return{color:"inherit","& .MuiInputBase-input":{padding:t.spacing(1,1,1,0),paddingLeft:"calc(1em + ".concat(t.spacing(4),")"),width:"100%"}}}));var f=n(9434),v=n(6026),b=n(184);const w=e=>{let{id:t,title:n,time:a,msg:l}=e;const c=(0,i.Z)(),d=(0,f.I0)(),u="light"===c.palette.mode?"#fff":c.palette.background.paper;return(0,b.jsx)(s.Z,{onClick:()=>{d((0,v.Fq)({room_id:t}))},sx:{width:"100%",borderRadius:1,backgroundColor:u},p:2,children:(0,b.jsxs)(r.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",children:[(0,b.jsx)(o.Z,{variant:"subtitle2",children:n}),(0,b.jsx)(o.Z,{sx:{fontWeight:600},variant:"caption",children:a})]})})};var C=n(5931),k=n(6362),y=n(4925),_=n(9321),I=n(1918),R=n(4387),S=n(6151),F=n(5289),P=n(5661),T=n(9157),W=n(1134),E=n(1724),A=n(4695),z=n(6393),G=n(8250);const N=x.forwardRef((function(e,t){return(0,b.jsx)(C.Z,{direction:"up",ref:t,...e})})),V=e=>{let{handleClose:t,socket:n}=e;const i=E.Ry().shape({title:E.Z_().required("Title is required"),friends:E.IX().min(2,"Must have at least 2 members")}),s=(0,W.cI)({resolver:(0,A.X)(i),defaultValues:{title:"",friends:[]}}),{friends:o}=(0,f.v9)((e=>e.app)),a=e=>()=>{console.log("Form submitted with data:",e),n.emit("start_group_conversation",e),console.log("Form Data:",e)};return(0,b.jsx)(W.RV,{...s,children:(0,b.jsxs)(r.Z,{spacing:3,children:[(0,b.jsx)(z.Z,{name:"title",label:"Group Title"}),(0,b.jsxs)(k.Z,{variant:"outlined",fullWidth:!0,children:[(0,b.jsx)(y.Z,{id:"friends-label",children:"Friends List"}),(0,b.jsx)(_.Z,{name:"friends",labelId:"friends-label",label:"Friends",multiple:!0,value:s.watch("friends")||[],onChange:e=>{s.setValue("friends",e.target.value)},renderValue:e=>(0,b.jsx)("div",{children:e.map((e=>(0,b.jsx)(I.Z,{sx:{marginRight:"5px"},label:e},e)))}),error:!!s.formState.errors.friends,helperText:s.formState.errors.friends&&s.formState.errors.friends.message,children:o.map(((e,t)=>(0,b.jsxs)(R.Z,{value:e.firstName+" "+e.lastName,children:[e.firstName," ",e.lastName]},t)))})]}),(0,b.jsxs)(r.Z,{spacing:2,direction:"row",alignItems:"center",justifyContent:"end",children:[(0,b.jsx)(S.Z,{variant:"outlined",onClick:t,children:"Cancel"}),(0,b.jsx)(S.Z,{type:"button",variant:"contained",onClick:()=>{a(s.getValues())(),t()},children:"Create"})]})]})})},M=e=>{let{open:t,handleClose:n}=e;return(0,b.jsxs)(F.Z,{fullWidth:!0,maxWidth:"xs",open:t,TransitionComponent:N,keepMounted:!0,onClose:n,"aria-describedby":"alert-dialog-slide-description",sx:{p:4},children:[(0,b.jsx)(P.Z,{sx:{mb:3},children:"Create New Group"}),(0,b.jsx)(T.Z,{sx:{mt:5},children:(0,b.jsx)(V,{handleClose:n,socket:G.W})})]})};var q=n(8462),D=n(4984),O=n(3044),L=n(9165),B=n(4059),H=n(9865),X=n(5670);const Y=e=>{let{toggleContact:t,toggleRoomId:n}=e;const c=(0,i.Z)(),{current_conversations:u}=(0,f.v9)((e=>e.conversation.group_chat));return console.log("group convo",u),(0,b.jsx)(s.Z,{p:2,sx:{height:100,width:"100%",backgroundColor:"light"===c.palette.mode?"#f8faff":c.palette.background.default,boxShadow:"0px 0px 2px rgba(0,0,0,0.25)"},children:(0,b.jsxs)(r.Z,{alignItems:"center",direction:"row",justifyContent:"space-between",sx:{width:"100%",height:"100%"},children:[(0,b.jsxs)(r.Z,{direction:"row",spacing:2,children:[(0,b.jsx)(s.Z,{onClick:t,children:(0,b.jsx)(X.Z,{overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},variant:"dot",children:(0,b.jsx)(O.Z,{alt:null===u||void 0===u?void 0:u.title})})}),(0,b.jsxs)(r.Z,{spacing:.2,children:[(0,b.jsx)(o.Z,{variant:"subtitle2",children:null===u||void 0===u?void 0:u.title}),(0,b.jsx)(o.Z,{variant:"caption",children:"Online"})]})]}),(0,b.jsxs)(r.Z,{direction:"row",alignItems:"center",spacing:3,children:[(0,b.jsx)(a.Z,{children:(0,b.jsx)(L.Z,{})}),(0,b.jsx)(a.Z,{children:(0,b.jsx)(B.Z,{})}),(0,b.jsx)(a.Z,{children:(0,b.jsx)(d.Z,{})}),(0,b.jsx)(l.Z,{orientation:"vertical",flexItem:!0}),(0,b.jsx)(a.Z,{children:(0,b.jsx)(H.Z,{onClick:()=>n(!0)})})]})]})})};var $=n(7391),J=n(6520),Q=n(9877),U=n(3466),K=n(6526),ee=n(6206),te=n(2413),ne=n(6880),ie=n(9134),re=n(5355),se=n(9585),oe=n(4306),ae=n(6638),le=n(4122);const ce=(0,p.ZP)($.Z)((e=>{let{theme:t}=e;return{"& .MuiInputBase-input":{paddingBottom:"12px",paddingTop:"12px"}}})),de=[{color:"#4da5fe",icon:(0,b.jsx)(K.Z,{size:24}),y:102,title:"Photo/Video"},{color:"#1b8cfe",icon:(0,b.jsx)(ee.Z,{size:24}),y:172,title:"Stickers"},{color:"#0172e4",icon:(0,b.jsx)(te.Z,{size:24}),y:242,title:"Image"},{color:"#0159b2",icon:(0,b.jsx)(ne.Z,{size:24}),y:312,title:"Document"},{color:"#013f7f",icon:(0,b.jsx)(ie.Z,{size:24}),y:382,title:"Contact"}],ue=e=>{let{openPicker:t,setOpenPicker:n,setValue:i,value:s,inputRef:o}=e;const[l,c]=x.useState(!1);return(0,b.jsx)(ce,{inputRef:o,value:s,onChange:e=>{i(e.target.value)},fullWidth:!0,placeholder:"Write a message...",variant:"filled",InputProps:{disableUnderline:!0,startAdornment:(0,b.jsxs)(r.Z,{sx:{width:"max-content"},children:[(0,b.jsx)(r.Z,{sx:{position:"relative",display:l?"inline-block":"none"},children:de.map(((e,t)=>(0,b.jsx)(J.Z,{placement:"right",title:e.title,children:(0,b.jsx)(Q.Z,{onClick:()=>{c(!l)},sx:{position:"absolute",top:-e.y,backgroundColor:e.color},"aria-label":"add",children:e.icon})},t)))}),(0,b.jsx)(U.Z,{position:"end",children:(0,b.jsx)(a.Z,{onClick:()=>{c((e=>!e))},children:(0,b.jsx)(re.Z,{})})})]}),endAdornment:(0,b.jsx)(U.Z,{position:"end",children:(0,b.jsx)(a.Z,{onClick:()=>{n((e=>!e))},children:(0,b.jsx)(se.Z,{})})})}})};const xe=()=>{const e=(0,f.I0)(),t=(0,i.Z)(),[n,o]=x.useState(!1),l=window.localStorage.getItem("user_id"),{current_conversation:c}=(0,f.v9)((e=>e.conversation.group_chat)),[d,u]=(0,x.useState)(""),p=(0,x.useRef)(null),{room_id:h}=(0,f.v9)((e=>e.app));const[g,m]=(0,x.useState)(!1),{group_conversations:j}=(0,f.v9)((e=>e.conversation.group_chat));return(0,x.useEffect)((()=>{const t=j.find((e=>(null===e||void 0===e?void 0:e.id)===h));G.W.emit("get_messages",{group_conversations_id:null===t||void 0===t?void 0:t.id},(n=>{e((0,D.R$)({messages:n})),e((0,D.Aq)(t))}))}),[g,e,j,h]),(0,b.jsx)(s.Z,{p:2,sx:{width:"100%",backgroundColor:"light"===t.palette.mode?"#f8faff":t.palette.background.default,boxShadow:"0px 0px 2px rgba(0,0,0,0.25)"},children:(0,b.jsxs)(r.Z,{direction:"row",alignItems:"center",spacing:3,children:[(0,b.jsxs)(r.Z,{sx:{width:"100%"},children:[(0,b.jsx)(s.Z,{sx:{display:n?"inline":"none",zIndex:10,position:"fixed",bottom:81,right:100},children:(0,b.jsx)(le.Z,{theme:t.palette.mode,data:ae,onEmojiSelect:e=>{!function(e){const t=p.current;if(t){const n=t.selectionStart,i=t.selectionEnd;u(d.substring(0,n)+e+d.substring(i)),t.selectionStart=t.selectionEnd=n+1}}(e.native)}})}),(0,b.jsx)(ue,{inputRef:p,value:d,setValue:u,openPicker:n,setOpenPicker:o})]}),(0,b.jsx)(s.Z,{sx:{height:48,width:48,backgroundColor:t.palette.primary.main,borderRadius:1.5},children:(0,b.jsx)(r.Z,{sx:{height:"100%",width:"100%"},alignItems:"center",justifyContent:"center",children:(0,b.jsx)(a.Z,{onClick:()=>{var e;G.W.emit("text_message",{message:d,conversation_id:h,from:l,to:c.user_id,type:(e=d,/(https?:\/\/[^\s]+)/g.test(e)?"Link":"Text")},(e=>m(!g)))},children:(0,b.jsx)(oe.Z,{color:"white"})})})})]})})};var pe=n(5422),he=n(7501),ge=n(7863),me=n(7078);const je=e=>{let{el:t,menu:n}=e;const l=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",justifyContent:t.incoming?"start":"end",children:[(0,b.jsx)(s.Z,{p:1.5,sx:{backgroundColor:t.incoming?l.palette.background.default:l.palette.primary.main,borderRadius:1.5,width:"max-content"},children:(0,b.jsxs)(r.Z,{spacing:2,children:[(0,b.jsxs)(r.Z,{p:2,direction:"row",spacing:3,alignItems:"center",sx:{backgroundColor:l.palette.background.paper,borderRadius:1},children:[(0,b.jsx)(K.Z,{size:48}),(0,b.jsx)(o.Z,{variant:"caption",children:"Abstract.png"}),(0,b.jsx)(a.Z,{children:(0,b.jsx)(he.Z,{})})]}),(0,b.jsx)(o.Z,{variant:"body2",color:t.incoming?l.palette.text:"#fff",children:t.message})]})}),n&&(0,b.jsx)(Ce,{})]})},Ze=e=>{let{el:t,menu:n}=e;const a=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",justifyContent:t.incoming?"start":"end",children:[(0,b.jsx)(s.Z,{p:1.5,sx:{backgroundColor:t.incoming?a.palette.background.default:a.palette.primary.main,borderRadius:1.5,width:"max-content"},children:(0,b.jsx)(r.Z,{spacing:2,children:(0,b.jsxs)(r.Z,{p:2,spacing:3,direction:"column",sx:{backgroundColor:a.palette.background.paper,borderRadius:1},children:[(0,b.jsx)("img",{src:t.preview,alt:t.message,style:{maxHeight:210,borderRadius:"10px"}}),(0,b.jsxs)(r.Z,{spacing:2,children:[(0,b.jsx)(o.Z,{variant:"subtitle2",color:t.incoming?a.palette.text:"white",children:"Creating chat app"}),(0,b.jsx)(o.Z,{variant:"subtitle2",color:a.palette.primary.main,component:c.Z,to:"//https://www.youtube.com",children:"www.youtube.com"})]}),(0,b.jsx)(o.Z,{variant:"body2",color:t.incoming?a.palette.text:"white",children:t.message})]})})}),n&&(0,b.jsx)(Ce,{})]})},fe=e=>{let{el:t,menu:n}=e;const a=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",justifyContent:t.incoming?"start":"end",children:[(0,b.jsx)(s.Z,{p:1.5,sx:{backgroundColor:t.incoming?a.palette.background.default:a.palette.primary.main,borderRadius:1.5,width:"max-content"},children:(0,b.jsxs)(r.Z,{spacing:2,children:[(0,b.jsx)(r.Z,{p:2,direction:"column",spacing:3,alignItems:3,sx:{backgroundColor:a.palette.background.paper,borderRadius:1},children:(0,b.jsx)(o.Z,{variant:"body2",color:a.palette.text,children:t.message})}),(0,b.jsx)(o.Z,{variant:"caption",color:t.incoming?a.palette.text:"white",children:t.reply})]})}),n&&(0,b.jsx)(Ce,{})]})},ve=e=>{let{el:t,menu:n}=e;const a=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",justifyContent:t.incoming?"start":"end",children:[(0,b.jsx)(s.Z,{p:1.5,sx:{backgroundColor:t.incoming?a.palette.background.default:a.palette.primary.main,borderRadius:1.5,width:"max-content"},children:(0,b.jsxs)(r.Z,{spacing:1,children:[(0,b.jsx)("img",{src:t.img,alt:t.message,style:{maxHeight:210,borderRadius:"10px"}}),(0,b.jsx)(o.Z,{variant:"body2",color:t.incoming?a.palette.text:"white",children:t.message})]})}),n&&(0,b.jsx)(Ce,{})]})},be=e=>{let{id:t,el:n,menu:a}=e;const l=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",justifyContent:n.incoming?"start":"end",children:[(0,b.jsx)(s.Z,{p:1.5,sx:{backgroundColor:n.incoming?l.palette.background.default:l.palette.primary.main,borderRadius:1.5,width:"max-content"},children:(0,b.jsx)(o.Z,{variant:"body2",color:n.incoming?l.palette.text:"white",children:n.message})}),a&&(0,b.jsx)(Ce,{messageId:n.id})]})},we=e=>{let{el:t}=e;const n=(0,i.Z)();return(0,b.jsxs)(r.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",children:[(0,b.jsx)(l.Z,{width:"46%"}),(0,b.jsx)(o.Z,{variant:"caption",sx:{color:n.palette.text},children:t.text}),(0,b.jsx)(l.Z,{width:"46%"})]})},Ce=e=>{let{messageId:t}=e;const n=(0,f.I0)(),[i,s]=(0,x.useState)(null),[a]=(0,x.useState)(!1),[l,c]=(0,x.useState)(!1),{conversations:d}=(0,f.v9)((e=>e.conversation.direct_chat)),{room_id:u}=(0,f.v9)((e=>e.app)),p=Boolean(i),h=()=>{s(null)};(0,x.useEffect)((()=>{const e=d.find((e=>(null===e||void 0===e?void 0:e.id)===u));G.W.emit("get_messages",{conversation_id:null===e||void 0===e?void 0:e.id},(t=>{n((0,D.R$)({messages:t})),n((0,D.Aq)(e))}))}),[l,n,d,u]);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(ge.Z,{size:20,id:"basic-button","aria-controls":p?"basic-menu":void 0,"aria-haspopup":"true","aria-expanded":p?"true":void 0,onClick:e=>{s(e.currentTarget)}}),(0,b.jsx)(pe.Z,{id:"basic-menu",anchorEl:i,open:p,onClose:h,MenuListProps:{"aria-labelledby":"basic-button"},children:(0,b.jsx)(r.Z,{spacing:1,px:1,children:me.GF.map(((e,n)=>(0,b.jsx)(R.Z,{onClick:h,children:"Delete Message"===e.title?(0,b.jsx)(o.Z,{sx:{cursor:"pointer",color:"#ff0000"},onClick:e=>{e.stopPropagation(),G.W.emit("delete_message",t,(e=>{e&&e.success?(console.log("Message with ID ".concat(t," has been deleted")),a(!0)):console.error("Error deleting message with ID ".concat(t,":"),e&&e.error)})),h(),c(!l)},children:e.title}):(0,b.jsx)(o.Z,{sx:{cursor:"pointer",color:"#fff"},children:e.title})},n)))})})]})},ke=e=>{const t=(0,f.I0)(),{group_conversations:n}=(0,f.v9)((e=>e.conversation.group_chat)),{room_id:i}=(0,f.v9)((e=>e.app));return(0,x.useEffect)((()=>{const e=n.find((e=>(null===e||void 0===e?void 0:e.id)===i));G.W.emit("get_group_conversations",{group_conversations_id:null===e||void 0===e?void 0:e.id},(e=>{t((0,D.jF)({messages:e}))})),t((0,D.PJ)(e))}),[t,n,i]),(0,b.jsx)(b.Fragment,{children:(0,b.jsx)(s.Z,{p:3,children:(0,b.jsx)(r.Z,{spacing:3,children:n.map(((t,n)=>{switch(t.type){case"divider":return(0,b.jsx)(we,{el:t},n);case"msg":switch(t.subtype){case"img":return(0,b.jsx)(ve,{el:t,menu:e},n);case"doc":return(0,b.jsx)(je,{el:t,menu:e},n);case"link":return(0,b.jsx)(Ze,{el:t,menu:e},n);case"reply":return(0,b.jsx)(fe,{el:t,menu:e},n);default:return(0,b.jsx)(be,{el:t,menu:e},n)}default:return(0,b.jsx)(b.Fragment,{})}}))})})})},ye=e=>{let{toggleContact:t,toggleRoomId:n}=e;const o=(0,i.Z)(),{current_messages:a}=(0,f.v9)((e=>e.conversation.group_chat)),l=(0,x.useRef)(null);return(0,x.useEffect)((()=>{l.current.scrollTop=l.current.scrollHeight}),[a]),(0,b.jsxs)(r.Z,{sx:{height:"100%",width:"100%",backgroundColor:"light"===o.palette.mode?"#f0f4fa":o.palette.background.paper},children:[(0,b.jsx)(Y,{toggleContact:t,toggleRoomId:n}),(0,b.jsx)(s.Z,{ref:l,width:"100%",sx:{flexGrow:1,height:"100%",overflow:"scroll",backgroundColor:"light"===o.palette.mode?"#F0F4FA":o.palette.background,boxShadow:"0px 0px 2px rgba(0, 0, 0, 0.25)"},children:(0,b.jsx)(ke,{menu:!0})}),(0,b.jsx)(xe,{})]})};var _e=n(3201),Ie=n(1036),Re=n(9998);const Se=localStorage.getItem("user_id"),Fe=()=>{const e=(0,Re.Z)("up","md"),{room_id:t,chat_type:n}=(0,f.v9)((e=>e.app)),[p,h]=(0,x.useState)(!1),[j]=(0,x.useState)("CONTACT"),C=()=>{h(!p)},k=(0,i.Z)(),y=(0,f.I0)(),[_,I]=(0,x.useState)(!1),{group_conversations:R}=(0,f.v9)((e=>e.conversation.group_chat));console.log("group convo",R),(0,x.useEffect)((()=>{G.W.emit("get_group_conversations",{user_id:Se},(e=>{y((0,D.SF)({group_conversations:e}))}))}),[y]);return(0,b.jsx)(b.Fragment,{children:(0,b.jsxs)(r.Z,{direction:"row",sx:{width:"100%"},children:[(0,b.jsxs)(s.Z,{sx:{overflowY:"scroll",height:"100vh",width:320,backgroundColor:e=>"light"===e.palette.mode?"#F8FAFF":e.palette.background.default,boxShadow:"0px 0px 2px rgba(0, 0, 0, 0.25)"},children:[!e&&(0,b.jsx)(Ie.Z,{}),(0,b.jsxs)(r.Z,{p:3,spacing:2,sx:{maxHeight:"100vh"},children:[(0,b.jsx)(r.Z,{alignItems:"center",justifyContent:"space-between",direction:"row",children:(0,b.jsx)(o.Z,{variant:"h5",children:"Groups"})}),(0,b.jsx)(r.Z,{sx:{width:"100%"},children:(0,b.jsxs)(g,{children:[(0,b.jsx)(m,{children:(0,b.jsx)(d.Z,{color:"#709CE6"})}),(0,b.jsx)(Z,{placeholder:"Search\u2026",inputProps:{"aria-label":"search"}})]})}),(0,b.jsxs)(r.Z,{justifyContent:"space-between",alignItems:"center",direction:"row",children:[(0,b.jsx)(o.Z,{variant:"subtitle2",sx:{color:"#3263C4"},children:"Create New Group"}),(0,b.jsx)(a.Z,{onClick:()=>{I(!0)},children:(0,b.jsx)(u.Z,{style:{color:k.palette.primary.main}})})]}),(0,b.jsx)(l.Z,{}),(0,b.jsx)(r.Z,{spacing:3,sx:{flexGrow:1,overflowY:"scroll",height:"100%"},children:(0,b.jsxs)(r.Z,{spacing:2.5,children:[(0,b.jsx)(o.Z,{variant:"subtitle2",sx:{color:"#676667"},children:"All Groups"}),R.map(((e,t)=>(0,b.jsx)(w,{...e},e.id)))]})})]})]}),_&&(0,b.jsx)(M,{open:_,handleClose:()=>{I(!1)}}),"group"===n&&null!==t?(0,b.jsx)(ye,{toggleContact:C,toggleRoomId:function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e&&y((0,v.AS)({room_id:null}))}}):(0,b.jsxs)(r.Z,{spacing:2,sx:{height:"100%",width:"100%",backgroundColor:"light"===k.palette.mode?"#f8faff":k.palette.background.paper},alignItems:"center",justifyContent:"center",children:[(0,b.jsx)(q.Z,{}),(0,b.jsxs)(o.Z,{variant:"subtitle2",children:["Select a conversation or start a"," ",(0,b.jsx)(c.Z,{style:{color:k.palette.primary.main,textDecoration:"none"},to:"/",children:"new one"})]})]}),p&&(()=>{if("CONTACT"===j)return(0,b.jsx)(_e.Z,{toggleContact:C})})()]})})}}}]);
//# sourceMappingURL=298.5e9bbcba.chunk.js.map