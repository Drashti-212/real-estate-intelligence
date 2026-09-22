import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, ComposedChart, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Home, TrendingUp, TrendingDown, Building2, Users, FolderKanban, FileText, Bell, Settings,
  Search, Plus, Eye, ChevronLeft, MapPin, Calendar, AlertTriangle, CheckCircle2, Clock,
  MessageCircle, Send, X,
} from "lucide-react";

/* ============================================================
   DATA — computed from the 15 uploaded project workbooks.
   Construction fields (progress, cost, certification, payment) are
   real, recalculated from each file's formulas. Sales/Pre-Sales/
   Post-Sales fields are calculated (not random) from those same
   real numbers via documented assumptions — see the SAMPLE badge
   and the chat writeup for the exact formulas.
   ============================================================ */
const DATA = {"projects":[{"id":"P01","name":"Infrastructure Project 1","location":"Al Furjan, Dubai","type":"Infrastructure","budget":16234489,"plannedPct":93.75,"actualPct":85.23,"variance":-8.5,"budgetUtilCurrent":70.7,"remainingBudget":4763217,"certifiedCum":9304451,"paidCum":7175028,"expectedCompletion":"May 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":16.03,"plannedCost":892897,"actualCost":814026,"cumActual":814026,"cumPlanned":892897,"certifiedCum":667501,"paidCum":520651},{"month":"Dec-24","plannedPct":79.17,"actualPct":25.46,"plannedCost":1055242,"actualCost":1002506,"cumActual":1816532,"cumPlanned":1948139,"certifiedCum":1487551,"paidCum":1158650},{"month":"Jan-25","plannedPct":81.25,"actualPct":34.5,"plannedCost":1217587,"actualCost":1160502,"cumActual":2977034,"cumPlanned":3165725,"certifiedCum":2434521,"paidCum":1893498},{"month":"Feb-25","plannedPct":83.33,"actualPct":43.29,"plannedCost":1379932,"actualCost":1266916,"cumActual":4243950,"cumPlanned":4545657,"certifiedCum":3465791,"paidCum":2691701},{"month":"Mar-25","plannedPct":85.42,"actualPct":51.91,"plannedCost":1461104,"actualCost":1281637,"cumActual":5525587,"cumPlanned":6006761,"certifiedCum":4506480,"paidCum":3495113},{"month":"Apr-25","plannedPct":87.5,"actualPct":60.39,"plannedCost":1623449,"actualCost":1409084,"cumActual":6934671,"cumPlanned":7630210,"certifiedCum":5647838,"paidCum":4373959},{"month":"May-25","plannedPct":89.58,"actualPct":68.76,"plannedCost":1704621,"actualCost":1532337,"cumActual":8467009,"cumPlanned":9334831,"certifiedCum":6885967,"paidCum":5324842},{"month":"Jun-25","plannedPct":91.67,"actualPct":77.04,"plannedCost":1623449,"actualCost":1528665,"cumActual":9995674,"cumPlanned":10958280,"certifiedCum":8118071,"paidCum":6268633},{"month":"Jul-25","plannedPct":93.75,"actualPct":85.23,"plannedCost":1542276,"actualCost":1475598,"cumActual":11471272,"cumPlanned":12500557,"certifiedCum":9304451,"paidCum":7175028},{"month":"Aug-25","plannedPct":95.83,"actualPct":93.35,"plannedCost":1379932,"actualCost":1283963,"cumActual":12755234,"cumPlanned":13880488,"certifiedCum":10334189,"paidCum":7959689},{"month":"Sep-25","plannedPct":97.92,"actualPct":99.92,"plannedCost":1217587,"actualCost":1079841,"cumActual":13835075,"cumPlanned":15098075,"certifiedCum":11198062,"paidCum":8616232},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":1136414,"actualCost":984231,"cumActual":14819306,"cumPlanned":16234489,"certifiedCum":11983479,"paidCum":9211578}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Tender for Construction","progress":14},{"name":"As Per Management Direction","progress":5}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"No threshold breaches detected this period","level":"Low"}]},{"id":"P02","name":"Community Facility Project 1","location":"Riyadh, KSA","type":"Community Facility","budget":390003,"plannedPct":93.75,"actualPct":71.73,"variance":-22.0,"budgetUtilCurrent":65.7,"remainingBudget":133758,"certifiedCum":207839,"paidCum":160269,"expectedCompletion":"October 2025","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":11.27,"plannedCost":21450,"actualCost":18896,"cumActual":18896,"cumPlanned":21450,"certifiedCum":15495,"paidCum":12086},{"month":"Dec-24","plannedPct":79.17,"actualPct":19.51,"plannedCost":25350,"actualCost":22404,"cumActual":41300,"cumPlanned":46800,"certifiedCum":33822,"paidCum":26344},{"month":"Jan-25","plannedPct":81.25,"actualPct":27.4,"plannedCost":29250,"actualCost":24901,"cumActual":66202,"cumPlanned":76051,"certifiedCum":54141,"paidCum":42112},{"month":"Feb-25","plannedPct":83.33,"actualPct":35.09,"plannedCost":33150,"actualCost":26963,"cumActual":93165,"cumPlanned":109201,"certifiedCum":76089,"paidCum":59100},{"month":"Mar-25","plannedPct":85.42,"actualPct":42.62,"plannedCost":35100,"actualCost":28250,"cumActual":121415,"cumPlanned":144301,"certifiedCum":99028,"paidCum":76809},{"month":"Apr-25","plannedPct":87.5,"actualPct":50.03,"plannedCost":39000,"actualCost":32509,"cumActual":153924,"cumPlanned":183301,"certifiedCum":125360,"paidCum":97084},{"month":"May-25","plannedPct":89.58,"actualPct":57.34,"plannedCost":40950,"actualCost":35755,"cumActual":189679,"cumPlanned":224252,"certifiedCum":154250,"paidCum":119272},{"month":"Jun-25","plannedPct":91.67,"actualPct":64.57,"plannedCost":39000,"actualCost":34600,"cumActual":224279,"cumPlanned":263252,"certifiedCum":182138,"paidCum":140634},{"month":"Jul-25","plannedPct":93.75,"actualPct":71.73,"plannedCost":37050,"actualCost":31966,"cumActual":256245,"cumPlanned":300302,"certifiedCum":207839,"paidCum":160269},{"month":"Aug-25","plannedPct":95.83,"actualPct":78.82,"plannedCost":33150,"actualCost":27262,"cumActual":283507,"cumPlanned":333453,"certifiedCum":229703,"paidCum":176930},{"month":"Sep-25","plannedPct":97.92,"actualPct":85.85,"plannedCost":29250,"actualCost":23491,"cumActual":306997,"cumPlanned":362703,"certifiedCum":248495,"paidCum":191212},{"month":"Oct-25","plannedPct":100,"actualPct":92.84,"plannedCost":27300,"actualCost":22459,"cumActual":329457,"cumPlanned":390003,"certifiedCum":266418,"paidCum":204797}],"health":"At Risk","sales":{"sellable":false},"topActivities":[{"name":"Tender for Construction","progress":11},{"name":"Mosque 1 (Maskan)","progress":9},{"name":"As Per Management Direction","progress":6}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -22.0 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P03","name":"Residential Project 1","location":"Riyadh, KSA","type":"Residential","budget":85816366,"plannedPct":93.75,"actualPct":65.44,"variance":-28.3,"budgetUtilCurrent":77.2,"remainingBudget":19565949,"certifiedCum":53735686,"paidCum":41437165,"expectedCompletion":"May 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":12.31,"plannedCost":4719900,"actualCost":4929753,"cumActual":4929753,"cumPlanned":4719900,"certifiedCum":4042397,"paidCum":3153070},{"month":"Dec-24","plannedPct":79.17,"actualPct":19.55,"plannedCost":5578064,"actualCost":5612030,"cumActual":10541783,"cumPlanned":10297964,"certifiedCum":8633038,"paidCum":6724588},{"month":"Jan-25","plannedPct":81.25,"actualPct":26.49,"plannedCost":6436227,"actualCost":6186735,"cumActual":16728517,"cumPlanned":16734191,"certifiedCum":13681413,"paidCum":10642128},{"month":"Feb-25","plannedPct":83.33,"actualPct":33.24,"plannedCost":7294391,"actualCost":6937986,"cumActual":23666503,"cumPlanned":24028582,"certifiedCum":19328934,"paidCum":15013308},{"month":"Mar-25","plannedPct":85.42,"actualPct":39.86,"plannedCost":7723473,"actualCost":7608259,"cumActual":31274762,"cumPlanned":31752055,"certifiedCum":25506840,"paidCum":19782652},{"month":"Apr-25","plannedPct":87.5,"actualPct":46.37,"plannedCost":8581637,"actualCost":8855029,"cumActual":40129791,"cumPlanned":40333692,"certifiedCum":32679413,"paidCum":25305533},{"month":"May-25","plannedPct":89.58,"actualPct":52.8,"plannedCost":9010718,"actualCost":9447382,"cumActual":49577173,"cumPlanned":49344410,"certifiedCum":40312898,"paidCum":31168049},{"month":"Jun-25","plannedPct":91.67,"actualPct":59.15,"plannedCost":8581637,"actualCost":8750061,"cumActual":58327234,"cumPlanned":57926047,"certifiedCum":47365447,"paidCum":36570302},{"month":"Jul-25","plannedPct":93.75,"actualPct":65.44,"plannedCost":8152555,"actualCost":7923183,"cumActual":66250417,"cumPlanned":66078602,"certifiedCum":53735686,"paidCum":41437165},{"month":"Aug-25","plannedPct":95.83,"actualPct":71.67,"plannedCost":7294391,"actualCost":6923023,"cumActual":73173439,"cumPlanned":73372993,"certifiedCum":59287950,"paidCum":45667990},{"month":"Sep-25","plannedPct":97.92,"actualPct":77.86,"plannedCost":6436227,"actualCost":6257539,"cumActual":79430979,"cumPlanned":79809220,"certifiedCum":64293982,"paidCum":49472574},{"month":"Oct-25","plannedPct":100,"actualPct":84.0,"plannedCost":6007146,"actualCost":6127458,"cumActual":85558436,"cumPlanned":85816366,"certifiedCum":69183693,"paidCum":53178975}],"health":"Delayed","sales":{"sellable":true,"gdv":138413494,"avgPrice":1450000,"totalUnits":95,"unitsSold":89,"absorption":93.9,"bookingsValue":129050000,"collectionRate":72.4,"collections":93370256,"outstanding":35679744},"topActivities":[{"name":"Schematic Design","progress":70},{"name":"Construction","progress":52},{"name":"Detailed Design","progress":49},{"name":"Concept Design","progress":35},{"name":"Design","progress":10}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -28.3 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P04","name":"Residential Project 2","location":"Riyadh, KSA","type":"Residential","budget":1303276,"plannedPct":93.75,"actualPct":69.83,"variance":-23.9,"budgetUtilCurrent":91.0,"remainingBudget":117002,"certifiedCum":962213,"paidCum":742011,"expectedCompletion":"November 2025","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":13.14,"plannedCost":71680,"actualCost":85806,"cumActual":85806,"cumPlanned":71680,"certifiedCum":70361,"paidCum":54882},{"month":"Dec-24","plannedPct":79.17,"actualPct":20.86,"plannedCost":84713,"actualCost":96887,"cumActual":182693,"cumPlanned":156393,"certifiedCum":149614,"paidCum":116541},{"month":"Jan-25","plannedPct":81.25,"actualPct":28.27,"plannedCost":97746,"actualCost":110618,"cumActual":293311,"cumPlanned":254139,"certifiedCum":239879,"paidCum":186586},{"month":"Feb-25","plannedPct":83.33,"actualPct":35.47,"plannedCost":110779,"actualCost":129841,"cumActual":423152,"cumPlanned":364917,"certifiedCum":345569,"paidCum":268390},{"month":"Mar-25","plannedPct":85.42,"actualPct":42.54,"plannedCost":117295,"actualCost":144007,"cumActual":567158,"cumPlanned":482212,"certifiedCum":462503,"paidCum":358663},{"month":"Apr-25","plannedPct":87.5,"actualPct":49.49,"plannedCost":130328,"actualCost":162582,"cumActual":729740,"cumPlanned":612540,"certifiedCum":594194,"paidCum":460065},{"month":"May-25","plannedPct":89.58,"actualPct":56.34,"plannedCost":136844,"actualCost":166016,"cumActual":895756,"cumPlanned":749384,"certifiedCum":728335,"paidCum":563085},{"month":"Jun-25","plannedPct":91.67,"actualPct":63.12,"plannedCost":130328,"actualCost":150704,"cumActual":1046461,"cumPlanned":879712,"certifiedCum":849803,"paidCum":656130},{"month":"Jul-25","plannedPct":93.75,"actualPct":69.83,"plannedCost":123811,"actualCost":139814,"cumActual":1186275,"cumPlanned":1003523,"certifiedCum":962213,"paidCum":742011},{"month":"Aug-25","plannedPct":95.83,"actualPct":76.49,"plannedCost":110779,"actualCost":128148,"cumActual":1314423,"cumPlanned":1114301,"certifiedCum":1064988,"paidCum":820326},{"month":"Sep-25","plannedPct":97.92,"actualPct":83.09,"plannedCost":97746,"actualCost":118630,"cumActual":1433052,"cumPlanned":1212047,"certifiedCum":1159891,"paidCum":892452},{"month":"Oct-25","plannedPct":100,"actualPct":89.64,"plannedCost":91229,"actualCost":113814,"cumActual":1546867,"cumPlanned":1303276,"certifiedCum":1250715,"paidCum":961297}],"health":"At Risk","sales":{"sellable":true,"gdv":2102058,"avgPrice":1450000,"totalUnits":10,"unitsSold":10,"absorption":97.0,"bookingsValue":14500000,"collectionRate":75.9,"collections":11000280,"outstanding":3499720},"topActivities":[{"name":"Concept Design","progress":74},{"name":"Schematic Design","progress":74},{"name":"Construction","progress":56},{"name":"Design","progress":11}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -23.9 points exceeds critical threshold (-20)","level":"High"},{"text":"Budget utilization at 91.0% against 69.83% physical progress","level":"Medium"},{"text":"Remaining budget below 10% of total contract value","level":"Medium"}]},{"id":"P05","name":"Infrastructure Project 2","location":"Dhahran, KSA","type":"Infrastructure","budget":1057500,"plannedPct":93.75,"actualPct":71.6,"variance":-22.2,"budgetUtilCurrent":64.7,"remainingBudget":372859,"certifiedCum":555339,"paidCum":428260,"expectedCompletion":"January 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":13.47,"plannedCost":58162,"actualCost":47506,"cumActual":47506,"cumPlanned":58162,"certifiedCum":38955,"paidCum":30385},{"month":"Dec-24","plannedPct":79.17,"actualPct":21.39,"plannedCost":68738,"actualCost":55553,"cumActual":103059,"cumPlanned":126900,"certifiedCum":84397,"paidCum":65739},{"month":"Jan-25","plannedPct":81.25,"actualPct":28.98,"plannedCost":79312,"actualCost":66387,"cumActual":169446,"cumPlanned":206212,"certifiedCum":138569,"paidCum":107776},{"month":"Feb-25","plannedPct":83.33,"actualPct":36.37,"plannedCost":89888,"actualCost":78812,"cumActual":248258,"cumPlanned":296100,"certifiedCum":202722,"paidCum":157431},{"month":"Mar-25","plannedPct":85.42,"actualPct":43.61,"plannedCost":95175,"actualCost":84790,"cumActual":333048,"cumPlanned":391275,"certifiedCum":271572,"paidCum":210583},{"month":"Apr-25","plannedPct":87.5,"actualPct":50.74,"plannedCost":105750,"actualCost":91621,"cumActual":424669,"cumPlanned":497025,"certifiedCum":345784,"paidCum":267726},{"month":"May-25","plannedPct":89.58,"actualPct":57.77,"plannedCost":111038,"actualCost":91695,"cumActual":516364,"cumPlanned":608062,"certifiedCum":419874,"paidCum":324627},{"month":"Jun-25","plannedPct":91.67,"actualPct":64.72,"plannedCost":105750,"actualCost":85282,"cumActual":601647,"cumPlanned":713812,"certifiedCum":488612,"paidCum":377280},{"month":"Jul-25","plannedPct":93.75,"actualPct":71.6,"plannedCost":100462,"actualCost":82994,"cumActual":684641,"cumPlanned":814275,"certifiedCum":555339,"paidCum":428260},{"month":"Aug-25","plannedPct":95.83,"actualPct":78.42,"plannedCost":89888,"actualCost":77908,"cumActual":762549,"cumPlanned":904162,"certifiedCum":617822,"paidCum":475872},{"month":"Sep-25","plannedPct":97.92,"actualPct":85.18,"plannedCost":79312,"actualCost":70663,"cumActual":833212,"cumPlanned":983475,"certifiedCum":674352,"paidCum":518835},{"month":"Oct-25","plannedPct":100,"actualPct":91.9,"plannedCost":74025,"actualCost":64883,"cumActual":898095,"cumPlanned":1057500,"certifiedCum":726128,"paidCum":558081}],"health":"At Risk","sales":{"sellable":false},"topActivities":[{"name":5287500,"progress":76},{"name":"Brief & Vision","progress":76},{"name":"Prelimenary MP","progress":76},{"name":"Construction","progress":57},{"name":0.1275,"progress":11}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -22.2 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P06","name":"Commercial Project 1","location":"Riyadh, KSA","type":"Commercial","budget":663101229,"plannedPct":97.5,"actualPct":76.3,"variance":-21.2,"budgetUtilCurrent":83.1,"remainingBudget":112183186,"certifiedCum":446869739,"paidCum":344610785,"expectedCompletion":"September 2026","series":[{"month":"Nov-24","plannedPct":90.83,"actualPct":13.09,"plannedCost":36470568,"actualCost":37644418,"cumActual":37644418,"cumPlanned":36470568,"certifiedCum":30868423,"paidCum":24077370},{"month":"Dec-24","plannedPct":91.67,"actualPct":21.7,"plannedCost":43101580,"actualCost":46076508,"cumActual":83720927,"cumPlanned":79572147,"certifiedCum":68559007,"paidCum":53400644},{"month":"Jan-25","plannedPct":92.5,"actualPct":29.96,"plannedCost":49732592,"actualCost":55689671,"cumActual":139410598,"cumPlanned":129304740,"certifiedCum":114001779,"paidCum":88664235},{"month":"Feb-25","plannedPct":93.33,"actualPct":37.99,"plannedCost":56363604,"actualCost":64130483,"cumActual":203541080,"cumPlanned":185668344,"certifiedCum":166203991,"paidCum":129068748},{"month":"Mar-25","plannedPct":94.17,"actualPct":45.87,"plannedCost":59679111,"actualCost":66035430,"cumActual":269576511,"cumPlanned":245347455,"certifiedCum":219824761,"paidCum":170463982},{"month":"Apr-25","plannedPct":95,"actualPct":53.61,"plannedCost":66310123,"actualCost":69935794,"cumActual":339512304,"cumPlanned":311657578,"certifiedCum":276472754,"paidCum":214082936},{"month":"May-25","plannedPct":95.83,"actualPct":61.26,"plannedCost":69625629,"actualCost":71711622,"cumActual":411223926,"cumPlanned":381283207,"certifiedCum":334415744,"paidCum":258583153},{"month":"Jun-25","plannedPct":96.67,"actualPct":68.81,"plannedCost":66310123,"actualCost":69962567,"cumActual":481186493,"cumPlanned":447593330,"certifiedCum":390805573,"paidCum":301777762},{"month":"Jul-25","plannedPct":97.5,"actualPct":76.3,"plannedCost":62994617,"actualCost":69731550,"cumActual":550918043,"cumPlanned":510587946,"certifiedCum":446869739,"paidCum":344610785},{"month":"Aug-25","plannedPct":98.33,"actualPct":83.71,"plannedCost":56363604,"actualCost":64134299,"cumActual":615052342,"cumPlanned":566951551,"certifiedCum":498305447,"paidCum":383804794},{"month":"Sep-25","plannedPct":99.17,"actualPct":91.07,"plannedCost":49732592,"actualCost":55671612,"cumActual":670723954,"cumPlanned":616684143,"certifiedCum":542842736,"paidCum":417653134},{"month":"Oct-25","plannedPct":100,"actualPct":98.37,"plannedCost":46417086,"actualCost":49599498,"cumActual":720323452,"cumPlanned":663101229,"certifiedCum":582423136,"paidCum":447655077}],"health":"On Track","sales":{"sellable":true,"gdv":1069518111,"avgPrice":2800000,"totalUnits":382,"unitsSold":371,"absorption":97.0,"bookingsValue":1038800000,"collectionRate":81.0,"collections":841843520,"outstanding":196956480},"topActivities":[{"name":"Complete Detailed Design","progress":78},{"name":"Construction","progress":59},{"name":"Design","progress":12},{"name":"Tender Design","progress":4},{"name":"Tender Cons.","progress":4}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -21.2 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P07","name":"Commercial Project 2","location":"Taif, KSA","type":"Commercial","budget":315137942,"plannedPct":93.75,"actualPct":64.38,"variance":-29.4,"budgetUtilCurrent":79.8,"remainingBudget":63609168,"certifiedCum":204018911,"paidCum":157328331,"expectedCompletion":"September 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":9.98,"plannedCost":17332587,"actualCost":17638151,"cumActual":17638151,"cumPlanned":17332587,"certifiedCum":14463284,"paidCum":11281362},{"month":"Dec-24","plannedPct":79.17,"actualPct":17.39,"plannedCost":20483966,"actualCost":21834886,"cumActual":39473037,"cumPlanned":37816553,"certifiedCum":32324221,"paidCum":25177170},{"month":"Jan-25","plannedPct":81.25,"actualPct":24.49,"plannedCost":23635346,"actualCost":25599473,"cumActual":65072510,"cumPlanned":61451899,"certifiedCum":53213390,"paidCum":41387166},{"month":"Feb-25","plannedPct":83.33,"actualPct":31.41,"plannedCost":26786725,"actualCost":28214841,"cumActual":93287350,"cumPlanned":88238624,"certifiedCum":76180271,"paidCum":59163531},{"month":"Mar-25","plannedPct":85.42,"actualPct":38.19,"plannedCost":28362415,"actualCost":28475161,"cumActual":121762512,"cumPlanned":116601039,"certifiedCum":99302101,"paidCum":77013585},{"month":"Apr-25","plannedPct":87.5,"actualPct":44.86,"plannedCost":31513794,"actualCost":30897577,"cumActual":152660088,"cumPlanned":148114833,"certifiedCum":124329139,"paidCum":96284403},{"month":"May-25","plannedPct":89.58,"actualPct":51.44,"plannedCost":33089484,"actualCost":33233739,"cumActual":185893827,"cumPlanned":181204317,"certifiedCum":151182000,"paidCum":116907401},{"month":"Jun-25","plannedPct":91.67,"actualPct":57.94,"plannedCost":31513794,"actualCost":33207019,"cumActual":219100846,"cumPlanned":212718111,"certifiedCum":177946857,"paidCum":137409281},{"month":"Jul-25","plannedPct":93.75,"actualPct":64.38,"plannedCost":29938104,"actualCost":32427928,"cumActual":251528774,"cumPlanned":242656215,"certifiedCum":204018911,"paidCum":157328331},{"month":"Aug-25","plannedPct":95.83,"actualPct":70.77,"plannedCost":26786725,"actualCost":28544052,"cumActual":280072827,"cumPlanned":269442940,"certifiedCum":226911241,"paidCum":174772286},{"month":"Sep-25","plannedPct":97.92,"actualPct":77.1,"plannedCost":23635346,"actualCost":24041673,"cumActual":304114500,"cumPlanned":293078286,"certifiedCum":246144580,"paidCum":189389623},{"month":"Oct-25","plannedPct":100,"actualPct":83.39,"plannedCost":22059656,"actualCost":21672235,"cumActual":325786735,"cumPlanned":315137942,"certifiedCum":263439023,"paidCum":202498811}],"health":"Delayed","sales":{"sellable":true,"gdv":508287003,"avgPrice":2800000,"totalUnits":182,"unitsSold":169,"absorption":92.9,"bookingsValue":473200000,"collectionRate":71.5,"collections":338356928,"outstanding":134843072},"topActivities":[{"name":"Preconcept","progress":69},{"name":"Concept Design","progress":69},{"name":"Studies","progress":41},{"name":"Design","progress":10},{"name":"Tender Package","progress":3}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -29.4 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P08","name":"Industrial Project 1","location":"Riyadh, KSA","type":"Industrial","budget":7888770,"plannedPct":93.75,"actualPct":87.58,"variance":-6.2,"budgetUtilCurrent":91.1,"remainingBudget":700058,"certifiedCum":5830737,"paidCum":4496236,"expectedCompletion":"December 2025","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":16.48,"plannedCost":433882,"actualCost":525352,"cumActual":525352,"cumPlanned":433882,"certifiedCum":430789,"paidCum":336015},{"month":"Dec-24","plannedPct":79.17,"actualPct":26.16,"plannedCost":512770,"actualCost":630861,"cumActual":1156213,"cumPlanned":946652,"certifiedCum":946833,"paidCum":737498},{"month":"Jan-25","plannedPct":81.25,"actualPct":35.45,"plannedCost":591658,"actualCost":707897,"cumActual":1864111,"cumPlanned":1538310,"certifiedCum":1524477,"paidCum":1185750},{"month":"Feb-25","plannedPct":83.33,"actualPct":44.49,"plannedCost":670545,"actualCost":764703,"cumActual":2628814,"cumPlanned":2208856,"certifiedCum":2146946,"paidCum":1667540},{"month":"Mar-25","plannedPct":85.42,"actualPct":53.35,"plannedCost":709989,"actualCost":790710,"cumActual":3419524,"cumPlanned":2918845,"certifiedCum":2789003,"paidCum":2163208},{"month":"Apr-25","plannedPct":87.5,"actualPct":62.06,"plannedCost":788877,"actualCost":899996,"cumActual":4319520,"cumPlanned":3707722,"certifiedCum":3517999,"paidCum":2724535},{"month":"May-25","plannedPct":89.58,"actualPct":70.66,"plannedCost":828321,"actualCost":991447,"cumActual":5310967,"cumPlanned":4536043,"certifiedCum":4319088,"paidCum":3339772},{"month":"Jun-25","plannedPct":91.67,"actualPct":79.17,"plannedCost":788877,"actualCost":970613,"cumActual":6281580,"cumPlanned":5324920,"certifiedCum":5101402,"paidCum":3939025},{"month":"Jul-25","plannedPct":93.75,"actualPct":87.58,"plannedCost":749433,"actualCost":907133,"cumActual":7188712,"cumPlanned":6074353,"certifiedCum":5830737,"paidCum":4496236},{"month":"Aug-25","plannedPct":95.83,"actualPct":95.92,"plannedCost":670545,"actualCost":774770,"cumActual":7963482,"cumPlanned":6744898,"certifiedCum":6452102,"paidCum":4969717},{"month":"Sep-25","plannedPct":97.92,"actualPct":99.92,"plannedCost":591658,"actualCost":660264,"cumActual":8623746,"cumPlanned":7336556,"certifiedCum":6980313,"paidCum":5371157},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":552214,"actualCost":623057,"cumActual":9246803,"cumPlanned":7888770,"certifiedCum":7477513,"paidCum":5748034}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Tender Design","progress":100},{"name":"Tender Cons.","progress":100},{"name":"Hire Design Consultant","progress":93},{"name":"Complete Warehouse Design","progress":93},{"name":"1. Obtain Building Permit 2. Tendering & Hire Contractor & Supervision Consultant","progress":93}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Budget utilization at 91.1% against 87.58% physical progress","level":"Medium"},{"text":"Remaining budget below 10% of total contract value","level":"Medium"}]},{"id":"P09","name":"Infrastructure Project 3","location":"Riyadh, KSA","type":"Infrastructure","budget":748527773,"plannedPct":95,"actualPct":70.99,"variance":-24.0,"budgetUtilCurrent":62.4,"remainingBudget":281429347,"certifiedCum":378861517,"paidCum":292149830,"expectedCompletion":"October 2026","series":[{"month":"Nov-24","plannedPct":81.67,"actualPct":11.0,"plannedCost":41169028,"actualCost":34809348,"cumActual":34809348,"cumPlanned":41169028,"certifiedCum":28543665,"paidCum":22264059},{"month":"Dec-24","plannedPct":83.33,"actualPct":19.17,"plannedCost":48654305,"actualCost":40006953,"cumActual":74816301,"cumPlanned":89823333,"certifiedCum":61269353,"paidCum":47724644},{"month":"Jan-25","plannedPct":85,"actualPct":27.0,"plannedCost":56139583,"actualCost":43999565,"cumActual":118815866,"cumPlanned":145962916,"certifiedCum":97172998,"paidCum":75585873},{"month":"Feb-25","plannedPct":86.67,"actualPct":34.63,"plannedCost":63624861,"actualCost":48697514,"cumActual":167513380,"cumPlanned":209587776,"certifiedCum":136812774,"paidCum":106267059},{"month":"Mar-25","plannedPct":88.33,"actualPct":42.1,"plannedCost":67367500,"actualCost":52819691,"cumActual":220333071,"cumPlanned":276955276,"certifiedCum":179702364,"paidCum":139377822},{"month":"Apr-25","plannedPct":90,"actualPct":49.46,"plannedCost":74852777,"actualCost":61573427,"cumActual":281906499,"cumPlanned":351808053,"certifiedCum":229576840,"paidCum":177781169},{"month":"May-25","plannedPct":91.67,"actualPct":56.71,"plannedCost":78595416,"actualCost":66458164,"cumActual":348364663,"cumPlanned":430403469,"certifiedCum":283275037,"paidCum":219021384},{"month":"Jun-25","plannedPct":93.33,"actualPct":63.88,"plannedCost":74852777,"actualCost":62267316,"cumActual":410631979,"cumPlanned":505256247,"certifiedCum":333462493,"paidCum":257464976},{"month":"Jul-25","plannedPct":95,"actualPct":70.99,"plannedCost":71110138,"actualCost":56466447,"cumActual":467098426,"cumPlanned":576366385,"certifiedCum":378861517,"paidCum":292149830},{"month":"Aug-25","plannedPct":96.67,"actualPct":78.02,"plannedCost":63624861,"actualCost":48796428,"cumActual":515894854,"cumPlanned":639991246,"certifiedCum":417996252,"paidCum":321970498},{"month":"Sep-25","plannedPct":98.33,"actualPct":85.01,"plannedCost":56139583,"actualCost":43531513,"cumActual":559426367,"cumPlanned":696130829,"certifiedCum":452821462,"paidCum":348437658},{"month":"Oct-25","plannedPct":100,"actualPct":91.94,"plannedCost":52396944,"actualCost":42530891,"cumActual":601957258,"cumPlanned":748527773,"certifiedCum":486761113,"paidCum":374163913}],"health":"At Risk","sales":{"sellable":false},"topActivities":[{"name":"Lighting","progress":75},{"name":"Power (MV)","progress":75},{"name":"1. Complete 50% of Roads Leveling     2. Complete Infra Design","progress":75},{"name":"1. Complete Roads Leveling","progress":75},{"name":"2. Obtain Infra Design Approval","progress":75}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -24.0 points exceeds critical threshold (-20)","level":"High"}]},{"id":"P10","name":"Infrastructure Project 4","location":"Riyadh, KSA","type":"Infrastructure","budget":10013653,"plannedPct":93.75,"actualPct":64.55,"variance":-29.2,"budgetUtilCurrent":90.3,"remainingBudget":967194,"certifiedCum":7337716,"paidCum":5658436,"expectedCompletion":"May 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":9.28,"plannedCost":550751,"actualCost":661564,"cumActual":661564,"cumPlanned":550751,"certifiedCum":542483,"paidCum":423137},{"month":"Dec-24","plannedPct":79.17,"actualPct":16.81,"plannedCost":650887,"actualCost":745226,"cumActual":1406790,"cumPlanned":1201638,"certifiedCum":1152077,"paidCum":897401},{"month":"Jan-25","plannedPct":81.25,"actualPct":24.03,"plannedCost":751024,"actualCost":839724,"cumActual":2246513,"cumPlanned":1952662,"certifiedCum":1837292,"paidCum":1429127},{"month":"Feb-25","plannedPct":83.33,"actualPct":31.05,"plannedCost":851161,"actualCost":974899,"cumActual":3221412,"cumPlanned":2803823,"certifiedCum":2630859,"paidCum":2043349},{"month":"Mar-25","plannedPct":85.42,"actualPct":37.94,"plannedCost":901229,"actualCost":1082987,"cumActual":4304399,"cumPlanned":3705052,"certifiedCum":3510244,"paidCum":2722234},{"month":"Apr-25","plannedPct":87.5,"actualPct":44.72,"plannedCost":1001365,"actualCost":1236933,"cumActual":5541332,"cumPlanned":4706417,"certifiedCum":4512160,"paidCum":3493709},{"month":"May-25","plannedPct":89.58,"actualPct":51.4,"plannedCost":1051434,"actualCost":1277723,"cumActual":6819055,"cumPlanned":5757850,"certifiedCum":5544561,"paidCum":4286593},{"month":"Jun-25","plannedPct":91.67,"actualPct":58.01,"plannedCost":1001365,"actualCost":1161593,"cumActual":7980649,"cumPlanned":6759216,"certifiedCum":6480805,"paidCum":5003756},{"month":"Jul-25","plannedPct":93.75,"actualPct":64.55,"plannedCost":951297,"actualCost":1065810,"cumActual":9046459,"cumPlanned":7710513,"certifiedCum":7337716,"paidCum":5658436},{"month":"Aug-25","plannedPct":95.83,"actualPct":71.04,"plannedCost":851161,"actualCost":964159,"cumActual":10010618,"cumPlanned":8561673,"certifiedCum":8110972,"paidCum":6247657},{"month":"Sep-25","plannedPct":97.92,"actualPct":77.47,"plannedCost":751024,"actualCost":890543,"cumActual":10901161,"cumPlanned":9312697,"certifiedCum":8823407,"paidCum":6789107},{"month":"Oct-25","plannedPct":100,"actualPct":83.86,"plannedCost":700956,"actualCost":862650,"cumActual":11763811,"cumPlanned":10013653,"certifiedCum":9511801,"paidCum":7310910}],"health":"Delayed","sales":{"sellable":false},"topActivities":[{"name":"Construction","progress":68},{"name":"Storm Water","progress":48},{"name":"Tender Cons.","progress":47},{"name":"Complete Infra Handover","progress":10},{"name":"Complete Infra Execution","progress":3}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -29.2 points exceeds critical threshold (-20)","level":"High"},{"text":"Budget utilization at 90.3% against 64.55% physical progress","level":"Medium"},{"text":"Remaining budget below 10% of total contract value","level":"Medium"}]},{"id":"P11","name":"Infrastructure Project 5","location":"Dhahran, KSA","type":"Infrastructure","budget":5172033,"plannedPct":93.75,"actualPct":82.18,"variance":-11.6,"budgetUtilCurrent":70.0,"remainingBudget":1549141,"certifiedCum":2938658,"paidCum":2266191,"expectedCompletion":"March 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":15.46,"plannedCost":284462,"actualCost":254098,"cumActual":254098,"cumPlanned":284462,"certifiedCum":208360,"paidCum":162521},{"month":"Dec-24","plannedPct":79.17,"actualPct":24.55,"plannedCost":336182,"actualCost":293260,"cumActual":547358,"cumPlanned":620644,"certifiedCum":448247,"paidCum":349153},{"month":"Jan-25","plannedPct":81.25,"actualPct":33.26,"plannedCost":387902,"actualCost":346630,"cumActual":893988,"cumPlanned":1008546,"certifiedCum":731097,"paidCum":568645},{"month":"Feb-25","plannedPct":83.33,"actualPct":41.74,"plannedCost":439623,"actualCost":412158,"cumActual":1306146,"cumPlanned":1448169,"certifiedCum":1066594,"paidCum":828319},{"month":"Mar-25","plannedPct":85.42,"actualPct":50.06,"plannedCost":465483,"actualCost":448594,"cumActual":1754740,"cumPlanned":1913652,"certifiedCum":1430852,"paidCum":1109526},{"month":"Apr-25","plannedPct":87.5,"actualPct":58.23,"plannedCost":517203,"actualCost":490356,"cumActual":2245096,"cumPlanned":2430856,"certifiedCum":1828041,"paidCum":1415362},{"month":"May-25","plannedPct":89.58,"actualPct":66.3,"plannedCost":543063,"actualCost":491482,"cumActual":2736578,"cumPlanned":2973919,"certifiedCum":2225158,"paidCum":1720348},{"month":"Jun-25","plannedPct":91.67,"actualPct":74.28,"plannedCost":517203,"actualCost":452086,"cumActual":3188664,"cumPlanned":3491122,"certifiedCum":2589539,"paidCum":1999464},{"month":"Jul-25","plannedPct":93.75,"actualPct":82.18,"plannedCost":491343,"actualCost":434228,"cumActual":3622892,"cumPlanned":3982466,"certifiedCum":2938658,"paidCum":2266191},{"month":"Aug-25","plannedPct":95.83,"actualPct":90.01,"plannedCost":439623,"actualCost":406703,"cumActual":4029594,"cumPlanned":4422088,"certifiedCum":3264834,"paidCum":2514737},{"month":"Sep-25","plannedPct":97.92,"actualPct":97.77,"plannedCost":387902,"actualCost":372445,"cumActual":4402039,"cumPlanned":4809991,"certifiedCum":3562790,"paidCum":2741183},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":362042,"actualCost":346347,"cumActual":4748387,"cumPlanned":5172033,"certifiedCum":3839175,"paidCum":2950683}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Complete Infra Execution","progress":88},{"name":"Complete Infra Handover","progress":88},{"name":"Tender Cons.","progress":88},{"name":"Construction","progress":88},{"name":"Telecommunication","progress":88}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -11.6 points \u2014 behind plan, monitor closely","level":"Medium"}]},{"id":"P12","name":"Infrastructure Project 6","location":"Dhahran, KSA","type":"Infrastructure","budget":6320683,"plannedPct":95,"actualPct":82.18,"variance":-12.8,"budgetUtilCurrent":76.2,"remainingBudget":1504016,"certifiedCum":3906990,"paidCum":3012950,"expectedCompletion":"March 2026","series":[{"month":"Nov-24","plannedPct":81.67,"actualPct":15.46,"plannedCost":347638,"actualCost":329116,"cumActual":329116,"cumPlanned":347638,"certifiedCum":269875,"paidCum":210502},{"month":"Dec-24","plannedPct":83.33,"actualPct":24.55,"plannedCost":410844,"actualCost":398442,"cumActual":727558,"cumPlanned":758482,"certifiedCum":595800,"paidCum":464072},{"month":"Jan-25","plannedPct":85,"actualPct":33.27,"plannedCost":474051,"actualCost":482339,"cumActual":1209897,"cumPlanned":1232533,"certifiedCum":989389,"paidCum":769497},{"month":"Feb-25","plannedPct":86.67,"actualPct":41.75,"plannedCost":537258,"actualCost":561922,"cumActual":1771819,"cumPlanned":1769791,"certifiedCum":1446794,"paidCum":1123529},{"month":"Mar-25","plannedPct":88.33,"actualPct":50.06,"plannedCost":568861,"actualCost":585330,"cumActual":2357149,"cumPlanned":2338653,"certifiedCum":1922082,"paidCum":1490451},{"month":"Apr-25","plannedPct":90,"actualPct":58.24,"plannedCost":632068,"actualCost":620819,"cumActual":2977968,"cumPlanned":2970721,"certifiedCum":2424945,"paidCum":1877656},{"month":"May-25","plannedPct":91.67,"actualPct":66.31,"plannedCost":663672,"actualCost":629588,"cumActual":3607556,"cumPlanned":3634392,"certifiedCum":2933653,"paidCum":2268343},{"month":"Jun-25","plannedPct":93.33,"actualPct":74.28,"plannedCost":632068,"actualCost":606235,"cumActual":4213791,"cumPlanned":4266461,"certifiedCum":3422278,"paidCum":2642630},{"month":"Jul-25","plannedPct":95,"actualPct":82.18,"plannedCost":600465,"actualCost":602876,"cumActual":4816667,"cumPlanned":4866926,"certifiedCum":3906990,"paidCum":3012950},{"month":"Aug-25","plannedPct":96.67,"actualPct":90.01,"plannedCost":537258,"actualCost":559843,"cumActual":5376510,"cumPlanned":5404184,"certifiedCum":4355984,"paidCum":3355084},{"month":"Sep-25","plannedPct":98.33,"actualPct":97.78,"plannedCost":474051,"actualCost":492177,"cumActual":5868688,"cumPlanned":5878235,"certifiedCum":4749726,"paidCum":3654327},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":442448,"actualCost":440725,"cumActual":6309413,"cumPlanned":6320683,"certifiedCum":5101425,"paidCum":3920915}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Complete 90% of Infra execution","progress":87},{"name":"1. Complete Infra execution","progress":87},{"name":"2. Start Handover","progress":87},{"name":"1. Complete Infra Handover","progress":87},{"name":"Complete 75% of Infra execution","progress":86}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -12.8 points \u2014 behind plan, monitor closely","level":"Medium"}]},{"id":"P13","name":"Infrastructure Project 7","location":"Taif, KSA","type":"Infrastructure","budget":6331625,"plannedPct":93.75,"actualPct":83.54,"variance":-10.2,"budgetUtilCurrent":83.4,"remainingBudget":1051843,"certifiedCum":4282549,"paidCum":3302498,"expectedCompletion":"March 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":15.72,"plannedCost":348239,"actualCost":366339,"cumActual":366339,"cumPlanned":348239,"certifiedCum":300398,"paidCum":234310},{"month":"Dec-24","plannedPct":79.17,"actualPct":24.96,"plannedCost":411556,"actualCost":454228,"cumActual":820567,"cumPlanned":759795,"certifiedCum":671956,"paidCum":523383},{"month":"Jan-25","plannedPct":81.25,"actualPct":33.82,"plannedCost":474872,"actualCost":538750,"cumActual":1359317,"cumPlanned":1234667,"certifiedCum":1111577,"paidCum":864528},{"month":"Feb-25","plannedPct":83.33,"actualPct":42.44,"plannedCost":538188,"actualCost":600684,"cumActual":1960002,"cumPlanned":1772855,"certifiedCum":1600534,"paidCum":1242981},{"month":"Mar-25","plannedPct":85.42,"actualPct":50.89,"plannedCost":569846,"actualCost":607123,"cumActual":2567124,"cumPlanned":2342701,"certifiedCum":2093517,"paidCum":1623564},{"month":"Apr-25","plannedPct":87.5,"actualPct":59.2,"plannedCost":633162,"actualCost":651533,"cumActual":3218657,"cumPlanned":2975864,"certifiedCum":2621259,"paidCum":2029925},{"month":"May-25","plannedPct":89.58,"actualPct":67.4,"plannedCost":664821,"actualCost":691670,"cumActual":3910327,"cumPlanned":3640684,"certifiedCum":3180128,"paidCum":2459137},{"month":"Jun-25","plannedPct":91.67,"actualPct":75.51,"plannedCost":633162,"actualCost":689562,"cumActual":4599890,"cumPlanned":4273847,"certifiedCum":3735916,"paidCum":2884870},{"month":"Jul-25","plannedPct":93.75,"actualPct":83.54,"plannedCost":601504,"actualCost":679892,"cumActual":5279782,"cumPlanned":4875351,"certifiedCum":4282549,"paidCum":3302498},{"month":"Aug-25","plannedPct":95.83,"actualPct":91.5,"plannedCost":538188,"actualCost":606105,"cumActual":5885887,"cumPlanned":5413539,"certifiedCum":4768646,"paidCum":3672904},{"month":"Sep-25","plannedPct":97.92,"actualPct":99.39,"plannedCost":474872,"actualCost":513098,"cumActual":6398985,"cumPlanned":5888411,"certifiedCum":5179124,"paidCum":3984867},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":443214,"actualCost":458832,"cumActual":6857817,"cumPlanned":6331625,"certifiedCum":5545272,"paidCum":4262407}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"1. Complete 50% of Roads Leveling     2. Complete Infra Design","progress":89},{"name":"1. Complete Roads Leveling","progress":89},{"name":"2. Obtain Infra Design Approval","progress":89},{"name":"Tendering to Hire Infrastructure Contractor","progress":89},{"name":"Start Project Mobilization","progress":89}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -10.2 points \u2014 behind plan, monitor closely","level":"Medium"}]},{"id":"P14","name":"Infrastructure Project 8","location":"Riyadh, KSA","type":"Infrastructure","budget":995400,"plannedPct":93.75,"actualPct":72.24,"variance":-21.5,"budgetUtilCurrent":90.6,"remainingBudget":93614,"certifiedCum":731439,"paidCum":564035,"expectedCompletion":"January 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":13.59,"plannedCost":54747,"actualCost":65188,"cumActual":65188,"cumPlanned":54747,"certifiedCum":53454,"paidCum":41694},{"month":"Dec-24","plannedPct":79.17,"actualPct":21.58,"plannedCost":64701,"actualCost":79192,"cumActual":144380,"cumPlanned":119448,"certifiedCum":118233,"paidCum":92093},{"month":"Jan-25","plannedPct":81.25,"actualPct":29.24,"plannedCost":74655,"actualCost":89894,"cumActual":234275,"cumPlanned":194103,"certifiedCum":191587,"paidCum":149015},{"month":"Feb-25","plannedPct":83.33,"actualPct":36.7,"plannedCost":84609,"actualCost":97252,"cumActual":331526,"cumPlanned":278712,"certifiedCum":270750,"paidCum":210287},{"month":"Mar-25","plannedPct":85.42,"actualPct":44.0,"plannedCost":89586,"actualCost":99454,"cumActual":430980,"cumPlanned":368298,"certifiedCum":351507,"paidCum":272631},{"month":"Apr-25","plannedPct":87.5,"actualPct":51.19,"plannedCost":99540,"actualCost":111726,"cumActual":542706,"cumPlanned":467838,"certifiedCum":442005,"paidCum":342315},{"month":"May-25","plannedPct":89.58,"actualPct":58.29,"plannedCost":104517,"actualCost":122802,"cumActual":665509,"cumPlanned":572355,"certifiedCum":541229,"paidCum":418519},{"month":"Jun-25","plannedPct":91.67,"actualPct":65.3,"plannedCost":99540,"actualCost":121384,"cumActual":786892,"cumPlanned":671895,"certifiedCum":639064,"paidCum":493461},{"month":"Jul-25","plannedPct":93.75,"actualPct":72.24,"plannedCost":94563,"actualCost":114894,"cumActual":901786,"cumPlanned":766458,"certifiedCum":731439,"paidCum":564035},{"month":"Aug-25","plannedPct":95.83,"actualPct":79.12,"plannedCost":84609,"actualCost":98628,"cumActual":1000415,"cumPlanned":851067,"certifiedCum":810539,"paidCum":624309},{"month":"Sep-25","plannedPct":97.92,"actualPct":85.95,"plannedCost":74655,"actualCost":83380,"cumActual":1083794,"cumPlanned":925722,"certifiedCum":877243,"paidCum":675004},{"month":"Oct-25","plannedPct":100,"actualPct":92.73,"plannedCost":69678,"actualCost":77580,"cumActual":1161374,"cumPlanned":995400,"certifiedCum":939152,"paidCum":721931}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Complete Infra Design & Hire Supervision Consultant","progress":77},{"name":"Complete Infra Execution","progress":77},{"name":"Hire Infrastructure Contractor","progress":54},{"name":"Complete 30% of Infra Execution","progress":54},{"name":"Power (MV)","progress":54}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Delayed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Delayed"},{"name":"Construction / Execution","target":"Jun-25","status":"Delayed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Schedule variance of -21.5 points exceeds critical threshold (-20)","level":"High"},{"text":"Budget utilization at 90.6% against 72.24% physical progress","level":"Medium"},{"text":"Remaining budget below 10% of total contract value","level":"Medium"}]},{"id":"P15","name":"Healthcare Project 1","location":"Makkah, KSA","type":"Healthcare","budget":4226570,"plannedPct":93.75,"actualPct":86.15,"variance":-7.6,"budgetUtilCurrent":88.4,"remainingBudget":491050,"certifiedCum":3029856,"paidCum":2336393,"expectedCompletion":"April 2026","series":[{"month":"Nov-24","plannedPct":77.08,"actualPct":12.38,"plannedCost":232461,"actualCost":277882,"cumActual":277882,"cumPlanned":232461,"certifiedCum":227863,"paidCum":177733},{"month":"Dec-24","plannedPct":79.17,"actualPct":22.43,"plannedCost":274727,"actualCost":323082,"cumActual":600963,"cumPlanned":507188,"certifiedCum":492144,"paidCum":383344},{"month":"Jan-25","plannedPct":81.25,"actualPct":32.07,"plannedCost":316993,"actualCost":355850,"cumActual":956813,"cumPlanned":824181,"certifiedCum":782517,"paidCum":608673},{"month":"Feb-25","plannedPct":83.33,"actualPct":41.44,"plannedCost":359258,"actualCost":389517,"cumActual":1346330,"cumPlanned":1183440,"certifiedCum":1099584,"paidCum":854083},{"month":"Mar-25","plannedPct":85.42,"actualPct":50.63,"plannedCost":380391,"actualCost":416988,"cumActual":1763319,"cumPlanned":1563831,"certifiedCum":1438179,"paidCum":1115478},{"month":"Apr-25","plannedPct":87.5,"actualPct":59.67,"plannedCost":422657,"actualCost":485004,"cumActual":2248322,"cumPlanned":1986488,"certifiedCum":1831032,"paidCum":1417975},{"month":"May-25","plannedPct":89.58,"actualPct":68.6,"plannedCost":443790,"actualCost":528539,"cumActual":2776861,"cumPlanned":2430278,"certifiedCum":2258091,"paidCum":1745957},{"month":"Jun-25","plannedPct":91.67,"actualPct":77.42,"plannedCost":422657,"actualCost":501534,"cumActual":3278396,"cumPlanned":2852935,"certifiedCum":2662328,"paidCum":2055602},{"month":"Jul-25","plannedPct":93.75,"actualPct":86.15,"plannedCost":401524,"actualCost":457124,"cumActual":3735520,"cumPlanned":3254459,"certifiedCum":3029856,"paidCum":2336393},{"month":"Aug-25","plannedPct":95.83,"actualPct":94.8,"plannedCost":359258,"actualCost":391874,"cumActual":4127393,"cumPlanned":3613717,"certifiedCum":3344138,"paidCum":2575877},{"month":"Sep-25","plannedPct":97.92,"actualPct":99.92,"plannedCost":316993,"actualCost":344699,"cumActual":4472093,"cumPlanned":3930710,"certifiedCum":3619898,"paidCum":2785454},{"month":"Oct-25","plannedPct":100,"actualPct":102,"plannedCost":295860,"actualCost":334747,"cumActual":4806840,"cumPlanned":4226570,"certifiedCum":3887026,"paidCum":2987937}],"health":"On Track","sales":{"sellable":false},"topActivities":[{"name":"Tenderin Inra contractor (design & Build)","progress":92},{"name":"Submit Infra design proposals","progress":92},{"name":"Complete Infra Design","progress":92},{"name":"Start Infra execution","progress":92},{"name":"Telecommunication","progress":92}],"milestones":[{"name":"Design / Planning","target":"Nov-24","status":"Completed"},{"name":"Tender / Procurement","target":"Jan-25","status":"Completed"},{"name":"Construction / Execution","target":"Jun-25","status":"Completed"},{"name":"Testing / Handover","target":"Oct-25","status":"Upcoming"}],"risks":[{"text":"Budget utilization at 88.4% against 86.15% physical progress","level":"Medium"}]}],"portfolio":{"totalProjects":15,"totalBookingsValue":1655550000,"totalCollections":1284570984,"totalOutstanding":370979016,"totalUnitsSold":639,"constructionProgress":71.8,"plannedProgress":95.6,"healthCounts":{"On Track":8,"At Risk":4,"Delayed":3},"funnel":[{"stage":"Leads","value":18805,"pct":100},{"stage":"Qualified","value":10907,"pct":58.0},{"stage":"Site Visits","value":4581,"pct":24.4},{"stage":"Negotiations","value":1420,"pct":7.6},{"stage":"Bookings","value":639,"pct":3.4}],"ageing":[{"bucket":"0-30 Days","value":148391606},{"bucket":"31-60 Days","value":100164334},{"bucket":"61-90 Days","value":66776223},{"bucket":"90+ Days","value":55646852}],"trend":[{"month":"Nov-24","bookingValue":796250000,"collectionValue":236664968,"collectionPct":29.7},{"month":"Dec-24","bookingValue":919750000,"collectionValue":333440832,"collectionPct":36.3},{"month":"Jan-25","bookingValue":1044700000,"collectionValue":444219048,"collectionPct":42.5},{"month":"Feb-25","bookingValue":1161250000,"collectionValue":564606196,"collectionPct":48.6},{"month":"Mar-25","bookingValue":1274900000,"collectionValue":696199904,"collectionPct":54.6},{"month":"Apr-25","bookingValue":1391450000,"collectionValue":841689908,"collectionPct":60.5},{"month":"May-25","bookingValue":1503750000,"collectionValue":996984280,"collectionPct":66.3},{"month":"Jun-25","bookingValue":1616050000,"collectionValue":1164091872,"collectionPct":72.0},{"month":"Jul-25","bookingValue":1655550000,"collectionValue":1284570984,"collectionPct":77.6},{"month":"Aug-25","bookingValue":1682300000,"collectionValue":1398071544,"collectionPct":83.1},{"month":"Sep-25","bookingValue":1682300000,"collectionValue":1491704840,"collectionPct":88.7},{"month":"Oct-25","bookingValue":1682300000,"collectionValue":1577391712,"collectionPct":93.8}],"possessions":[{"project":"Residential Project 1","location":"Riyadh, KSA","target":"May 2026"},{"project":"Residential Project 2","location":"Riyadh, KSA","target":"November 2025"},{"project":"Commercial Project 1","location":"Riyadh, KSA","target":"September 2026"},{"project":"Commercial Project 2","location":"Taif, KSA","target":"September 2026"}],"top5":[{"id":"P08","name":"Industrial Project 1","actualPct":87.58,"health":"On Track"},{"id":"P15","name":"Healthcare Project 1","actualPct":86.15,"health":"On Track"},{"id":"P01","name":"Infrastructure Project 1","actualPct":85.23,"health":"On Track"},{"id":"P13","name":"Infrastructure Project 7","actualPct":83.54,"health":"On Track"},{"id":"P11","name":"Infrastructure Project 5","actualPct":82.18,"health":"On Track"}]}};

/* ---------------- design tokens ---------------- */
const INK = "#F3F5F9";
const SLATE = "#98A2B8";
const MIST = "#6E7688";
const LINE = "#242938";
const PAPER = "#07080C";
const NAVY = "#05060A";
const NAVY2 = "#0D1017";
const BLUE = "#4C86FF";
const TEAL = "#22C3AC";
const AMBER = "#F2A93B";
const CORAL = "#FF6259";
const VIOLET = "#A98CF5";
const SAMPLE_BG = "#2A2210";
const SAMPLE_TX = "#F0B429";
const SURFACE = "#12151D";
const SURFACE2 = "#1B202C";
const TRACK = "#1E2230";

const fmtM = (n, ccy = "SAR") => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${ccy} ${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${ccy} ${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${ccy} ${(n / 1e3).toFixed(0)}K`;
  return `${ccy} ${Math.round(n)}`;
};
const fmtN = (n) => n.toLocaleString();
const healthColor = (h) => (h === "On Track" ? TEAL : h === "At Risk" ? AMBER : CORAL);

function SampleBadge({ style }) {
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, color: SAMPLE_TX, background: SAMPLE_BG,
      border: "1px solid #F3DFAE", borderRadius: 5, padding: "2px 7px", letterSpacing: 0.2, ...style,
    }}>SAMPLE DATA</span>
  );
}

function StatusPill({ status }) {
  const map = {
    "On Track": { bg: "rgba(34,195,172,0.14)", tx: "#22C3AC" },
    "At Risk": { bg: "rgba(242,169,59,0.14)", tx: "#F2A93B" },
    "Delayed": { bg: "rgba(255,98,89,0.14)", tx: "#FF6259" },
    "Completed": { bg: "rgba(34,195,172,0.14)", tx: "#22C3AC" },
    "Upcoming": { bg: "rgba(76,134,255,0.14)", tx: "#4C86FF" },
  };
  const c = map[status] || { bg: SURFACE2, tx: SLATE };
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: c.tx, background: c.bg, borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function Card({ title, right, children, style, badge }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 12, padding: "18px 20px", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: INK, letterSpacing: 0.2 }}>{title}</span>
            {badge && <SampleBadge />}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function KpiTile({ label, value, delta, deltaGood = true, accent }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 12, padding: "16px 18px", minWidth: 0 }}>
      <div style={{ fontSize: 12.5, color: SLATE, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 23, fontWeight: 700, color: accent || INK, letterSpacing: -0.3, marginBottom: 6 }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 12, color: deltaGood ? "#0F7A5C" : "#C0332B", display: "flex", alignItems: "center", gap: 3 }}>
          {deltaGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, color = BLUE, height = 6, track = TRACK }) {
  return (
    <div style={{ width: "100%", height, background: track, borderRadius: height, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", background: color, borderRadius: height }} />
    </div>
  );
}

function MiniDonut({ data, size = 84, thickness = 0.34 }) {
  return (
    <PieChart width={size} height={size}>
      <Pie data={data} dataKey="value" innerRadius={size * thickness} outerRadius={size * 0.48} paddingAngle={2} startAngle={90} endAngle={-270}>
        {data.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
      </Pie>
    </PieChart>
  );
}

const Tip = ({ active, payload, label, money }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: NAVY, color: "#fff", padding: "8px 12px", borderRadius: 7, fontSize: 12, boxShadow: "0 6px 18px rgba(0,0,0,.22)" }}>
      <div style={{ opacity: 0.65, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <span style={{ color: p.color || p.fill }}>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{money ? fmtM(p.value) : typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ================= App shell ================= */
const NAV = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "presales", label: "Pre-Sales", icon: TrendingUp },
  { key: "postsales", label: "Post-Sales", icon: Users },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "reports", label: "Reports", icon: FileText },
];

function TopBar({ page, setPage }) {
  const tabs = ["overview", "presales", "postsales", "projects"];
  const labels = { overview: "OVERVIEW", presales: "PRE-SALES", postsales: "POST-SALES", projects: "PROJECTS" };
  return (
    <div style={{ height: 56, background: NAVY, display: "flex", alignItems: "center", padding: "0 20px", gap: 28, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Building2 size={16} color="#fff" />
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14.5, letterSpacing: 0.3 }}>REAL ESTATE INTELLIGENCE</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setPage(t)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "8px 14px", fontFamily: "inherit",
            fontSize: 12.5, fontWeight: 700, letterSpacing: 0.4, color: page === t || (page === "projectDetail" && t === "projects") ? "#fff" : "#8593AD",
            borderBottom: page === t || (page === "projectDetail" && t === "projects") ? `2px solid ${BLUE}` : "2px solid transparent",
          }}>{labels[t]}</button>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C7D0E3", fontSize: 12.5, background: "#182F55", padding: "6px 12px", borderRadius: 7 }}>
          <Calendar size={13} /> Jul 2025
        </div>
        <Bell size={16} color="#C7D0E3" />
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#3A57A0", color: "#fff", fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>AH</div>
      </div>
    </div>
  );
}

function SideBar({ page, setPage }) {
  return (
    <div style={{ width: 190, background: SURFACE, borderRight: `1px solid ${LINE}`, flexShrink: 0, paddingTop: 14 }}>
      {NAV.map((n) => {
        const active = page === n.key || (page === "projectDetail" && n.key === "projects");
        const Icon = n.icon;
        return (
          <div key={n.key} onClick={() => setPage(n.key)} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 20px", cursor: "pointer",
            color: active ? BLUE : SLATE, background: active ? "rgba(76,134,255,0.12)" : "transparent",
            borderRight: active ? `2px solid ${BLUE}` : "2px solid transparent", fontSize: 13.5, fontWeight: active ? 700 : 500,
          }}>
            <Icon size={16} strokeWidth={2} /> {n.label}
          </div>
        );
      })}
      <div style={{ marginTop: 10, borderTop: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 20px", color: SLATE, fontSize: 13.5 }}>
          <Settings size={16} /> Settings
        </div>
      </div>
    </div>
  );
}

/* ================= Overview page ================= */
function SalesFunnel({ funnel }) {
  const max = funnel[0].value;
  const colors = [BLUE, "#4E86F5", "#6FA0F8", "#8FB9FA", TEAL];
  return (
    <div>
      {funnel.map((f, i) => {
        const w = 30 + (f.value / max) * 70;
        return (
          <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
            <div style={{ width: 88, fontSize: 12.5, color: SLATE }}>{f.stage}</div>
            <div style={{ flex: 1 }}>
              <div style={{ width: `${w}%`, height: 22, background: colors[i], borderRadius: 4, margin: "0 auto" }} />
            </div>
            <div style={{ width: 56, textAlign: "right", fontSize: 13, fontWeight: 700, color: INK }}>{fmtN(f.value)}</div>
            <div style={{ width: 42, textAlign: "right", fontSize: 11.5, color: MIST }}>{f.pct}%</div>
          </div>
        );
      })}
    </div>
  );
}

function OverviewPage({ DATA, openProject }) {
  const P = DATA.portfolio;
  const projects = DATA.projects;
  const healthData = [
    { name: "On Track", value: P.healthCounts["On Track"] || 0, color: TEAL },
    { name: "At Risk", value: P.healthCounts["At Risk"] || 0, color: AMBER },
    { name: "Delayed", value: P.healthCounts["Delayed"] || 0, color: CORAL },
  ];
  const atRisk = (P.healthCounts["At Risk"] || 0) + (P.healthCounts["Delayed"] || 0);

  return (
    <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Portfolio Overview</div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        <KpiTile label="Total Projects" value={P.totalProjects} delta="Active" deltaGood />
        <KpiTile label="Bookings (Value)" value={fmtM(P.totalBookingsValue)} delta="4 sellable projects" deltaGood accent={BLUE} />
        <KpiTile label="Collections" value={fmtM(P.totalCollections)} delta={`${Math.round(P.totalCollections/P.totalBookingsValue*100)}% of bookings`} deltaGood accent={TEAL} />
        <KpiTile label="Outstanding" value={fmtM(P.totalOutstanding)} delta="Across ageing buckets" deltaGood={false} accent={AMBER} />
        <KpiTile label="Construction Progress" value={`${P.constructionProgress}%`} delta={`Planned ${P.plannedProgress}%`} deltaGood={false} />
        <KpiTile label="Projects At Risk" value={atRisk} delta="At Risk + Delayed" deltaGood={false} accent={CORAL} />
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 0.9fr", gap: 16 }}>
        <Card title="Portfolio Sales Funnel (YTD)" badge>
          <SalesFunnel funnel={P.funnel} />
        </Card>
        <Card title="Booking vs Collection Trend" badge>
          <ResponsiveContainer width="100%" height={230}>
            <ComposedChart data={P.trend} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} />
              <YAxis yAxisId="l" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e6)}M`} />
              <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<Tip />} />
              <Bar yAxisId="l" dataKey="bookingValue" name="Booking Value" fill={BLUE} radius={[3, 3, 0, 0]} maxBarSize={16} />
              <Line yAxisId="r" type="monotone" dataKey="collectionPct" name="Collection %" stroke={VIOLET} strokeWidth={2.4} dot={{ r: 2.5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Project Health Summary">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <MiniDonut data={healthData} size={128} />
            <div>
              {healthData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12.5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: d.color }} />
                  <span style={{ color: SLATE, width: 66 }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: INK }}>{d.value} ({Math.round(d.value / P.totalProjects * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 16 }}>
        <Card title="Top 5 Projects by Progress">
          {P.top5.map((t) => (
            <div key={t.id} onClick={() => openProject(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${LINE}`, cursor: "pointer" }}>
              <div style={{ flex: 1, fontSize: 13, color: INK, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
              <div style={{ width: 90 }}><ProgressBar value={t.actualPct} color={healthColor(t.health)} /></div>
              <div style={{ width: 40, textAlign: "right", fontSize: 12.5, fontWeight: 700 }}>{t.actualPct}%</div>
              <StatusPill status={t.health} />
            </div>
          ))}
        </Card>
        <Card title="Outstanding Ageing (SAR)" badge>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={P.ageing} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} />
              <YAxis tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e6)}M`} />
              <Tooltip content={<Tip money />} />
              <Bar dataKey="value" name="Outstanding" radius={[4, 4, 0, 0]} maxBarSize={46}>
                {P.ageing.map((_, i) => <Cell key={i} fill={[TEAL, AMBER, "#E38B2B", CORAL][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Upcoming Possessions" badge>
          {P.possessions.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < P.possessions.length - 1 ? `1px solid ${LINE}` : "none" }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: BLUE, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, color: INK }}>{p.project}</div>
              <div style={{ fontSize: 12.5, color: SLATE }}>{p.target}</div>
            </div>
          ))}
        </Card>
      </div>

      <ProjectsDirectory DATA={DATA} openProject={openProject} compact />
    </div>
  );
}

/* ================= Projects Directory ================= */
function ProjectsDirectory({ DATA, openProject, compact }) {
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(DATA.projects[3] || DATA.projects[0]);
  const projects = DATA.projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "2.3fr 1fr" : "1fr", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>Projects Directory</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${LINE}`, borderRadius: 7, padding: "5px 10px" }}>
              <Search size={13} color={MIST} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search project..." style={{ border: "none", outline: "none", fontSize: 12.5, width: 130, fontFamily: "inherit", background: "transparent", color: INK }} />
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 5, background: BLUE, color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Plus size={13} /> Add Project
            </button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ color: MIST, textAlign: "left" }}>
                {["ID", "Project Name", "Location", "Type", "Progress", "Sales", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "7px 8px", fontWeight: 600, borderBottom: `1px solid ${LINE}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} onMouseEnter={() => setHover(p)} onClick={() => openProject(p.id)} style={{ cursor: "pointer" }}>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, color: SLATE }}>{p.id}</td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, fontWeight: 600, color: INK }}>{p.name}</td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, color: SLATE }}>{p.location}</td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, color: SLATE }}>{p.type}</td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, width: 130 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 60 }}><ProgressBar value={p.actualPct} color={healthColor(p.health)} /></div>
                      <span style={{ fontSize: 11.5, color: SLATE }}>{p.actualPct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}`, color: SLATE }}>
                    {p.sales.sellable ? `${p.sales.absorption}%` : "N/A"}
                  </td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}` }}><StatusPill status={p.health} /></td>
                  <td style={{ padding: "9px 8px", borderBottom: `1px solid ${LINE}` }}><Eye size={14} color={MIST} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {compact && hover && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ height: 130, background: "linear-gradient(135deg, #16213F, #0A0E18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={34} color="#5C7AC0" />
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: INK }}>{hover.name}</div>
            <div style={{ fontSize: 12, color: SLATE, display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
              <MapPin size={11} /> {hover.location}
            </div>
            <Row2 label="Type" value={hover.type} />
            <Row2 label="Total Budget" value={fmtM(hover.budget)} />
            <Row2 label="Expected Completion" value={hover.expectedCompletion} />
            <div style={{ marginTop: 6, marginBottom: 4, fontSize: 12, color: SLATE }}>Overall Progress</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1 }}><ProgressBar value={hover.actualPct} color={healthColor(hover.health)} height={7} /></div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{hover.actualPct}%</span>
            </div>
            <button onClick={() => openProject(hover.id)} style={{ width: "100%", background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              View Project Dashboard →
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row2({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${LINE}`, fontSize: 12.5 }}>
      <span style={{ color: SLATE }}>{label}</span>
      <span style={{ fontWeight: 600, color: INK }}>{value}</span>
    </div>
  );
}

/* ================= Project Detail page ================= */
function ProjectDetailPage({ DATA, projectId, back }) {
  const [tab, setTab] = useState("summary");
  const p = DATA.projects.find((x) => x.id === projectId) || DATA.projects[0];

  return (
    <div style={{ padding: 22 }}>
      <div onClick={back} style={{ display: "flex", alignItems: "center", gap: 6, color: SLATE, fontSize: 12.5, cursor: "pointer", marginBottom: 12 }}>
        <ChevronLeft size={14} /> Back to Projects
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, color: INK }}>{p.name}</div>
          <div style={{ fontSize: 12.5, color: SLATE, display: "flex", alignItems: "center", gap: 5 }}>
            <MapPin size={12} /> {p.location} &nbsp;&middot;&nbsp; {p.type} &nbsp;&middot;&nbsp; {p.id}
          </div>
        </div>
        <StatusPill status={p.health} />
      </div>

      <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${LINE}`, marginTop: 14, marginBottom: 18 }}>
        {[["summary", "Summary"], ["sales", "Sales (Pre-Sales)"], ["postsales", "Post-Sales"], ["reports", "Reports"]].map(([k, l]) => (
          <div key={k} onClick={() => setTab(k)} style={{
            paddingBottom: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            color: tab === k ? BLUE : SLATE, borderBottom: tab === k ? `2px solid ${BLUE}` : "2px solid transparent",
          }}>{l}</div>
        ))}
      </div>

      {tab === "summary" && <SummaryTab p={p} />}
      {tab === "sales" && <SalesTab p={p} />}
      {tab === "postsales" && <PostSalesTab p={p} />}
      {tab === "reports" && (
        <Card><div style={{ color: SLATE, fontSize: 13, padding: "30px 0", textAlign: "center" }}>Report exports coming soon.</div></Card>
      )}
    </div>
  );
}

function SummaryTab({ p }) {
  const budgetDonut = [
    { name: "Used", value: p.budgetUtilCurrent, color: TEAL },
    { name: "Remaining", value: Math.max(0, 100 - p.budgetUtilCurrent), color: SURFACE2 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
        <KpiTile label="Physical Progress" value={`${p.actualPct}%`} delta={`Planned ${p.plannedPct}% · ${p.variance}pts`} deltaGood={p.variance >= 0} />
        <KpiTile label="Total Budget" value={fmtM(p.budget)} />
        <KpiTile label="Budget Utilization" value={`${p.budgetUtilCurrent}%`} delta={fmtM(p.remainingBudget) + " left"} deltaGood />
        <KpiTile label="Certified to Date" value={fmtM(p.certifiedCum)} accent={AMBER} />
        <KpiTile label="Paid to Date" value={fmtM(p.paidCum)} accent={TEAL} />
        <KpiTile label="Expected Completion" value={p.expectedCompletion} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 1fr", gap: 16 }}>
        <Card title="S-Curve (Planned vs Actual)">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={p.series} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} interval={1} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="plannedPct" name="Planned" stroke={AMBER} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actualPct" name="Actual" stroke={TEAL} strokeWidth={2.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Monthly Cost Trend (SAR)">
          <ResponsiveContainer width="100%" height={210}>
            <ComposedChart data={p.series} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e3)}K`} />
              <Tooltip content={<Tip money />} />
              <Bar dataKey="plannedCost" name="Planned Cost" fill={SURFACE2} radius={[3, 3, 0, 0]} maxBarSize={12} />
              <Line type="monotone" dataKey="actualCost" name="Actual Cost" stroke={BLUE} strokeWidth={2.2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Budget Utilization">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <MiniDonut data={budgetDonut} size={128} thickness={0.36} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: 19, fontWeight: 700 }}>{p.budgetUtilCurrent}%</span>
                <span style={{ fontSize: 10.5, color: SLATE }}>Used</span>
              </div>
            </div>
            <div style={{ width: "100%", fontSize: 12.5 }}>
              <Row2 label="Used" value={fmtM(p.cumActual)} />
              <Row2 label="Remaining" value={fmtM(p.remainingBudget)} />
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 16 }}>
        <Card title="Key Milestones">
          {p.milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < p.milestones.length - 1 ? `1px solid ${LINE}` : "none" }}>
              <div style={{ flex: 1, fontSize: 12.5, color: INK }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: SLATE, width: 56 }}>{m.target}</div>
              <StatusPill status={m.status} />
            </div>
          ))}
        </Card>
        <Card title="Top Activities by Progress">
          {p.topActivities.map((a, i) => (
            <div key={i} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: INK }}>{a.name}</span>
                <span style={{ fontWeight: 700 }}>{a.progress}%</span>
              </div>
              <ProgressBar value={a.progress} color={TEAL} />
            </div>
          ))}
        </Card>
        <Card title="Risk Indicators" right={<span style={{ fontSize: 10.5, color: MIST }}>auto-flagged</span>}>
          {p.risks.map((r, i) => {
            const c = r.level === "High" ? CORAL : r.level === "Medium" ? AMBER : TEAL;
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: i < p.risks.length - 1 ? `1px solid ${LINE}` : "none" }}>
                <AlertTriangle size={13} color={c} style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 12, color: INK }}>{r.text}</div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: c }}>{r.level}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function SalesTab({ p }) {
  if (!p.sales.sellable) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0", color: SLATE }}>
          <Building2 size={30} color={MIST} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 4 }}>Not Applicable</div>
          <div style={{ fontSize: 12.5 }}>{p.type} assets are not individually sold — no pre-sales pipeline applies to this project.</div>
        </div>
      </Card>
    );
  }
  const s = p.sales;
  const salesSeries = p.series.map((m) => {
    const absorption = Math.min(0.97, 0.35 + (m.actualPct / 100) * 0.9);
    const unitsSold = Math.round(s.totalUnits * absorption);
    return { month: m.month, unitsSold, bookingValue: unitsSold * s.avgPrice };
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        <KpiTile label="Total Units" value={fmtN(s.totalUnits)} />
        <KpiTile label="Units Sold" value={fmtN(s.unitsSold)} delta={`${s.absorption}% absorption`} deltaGood />
        <KpiTile label="GDV (Sellable Value)" value={fmtM(s.gdv)} accent={BLUE} />
        <KpiTile label="Bookings Value" value={fmtM(s.bookingsValue)} accent={BLUE} />
        <KpiTile label="Avg Unit Price" value={fmtM(s.avgPrice)} />
      </div>
      <Card title="Units Sold & Booking Value Trend" badge>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={salesSeries} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} interval={1} />
            <YAxis yAxisId="l" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e6)}M`} />
            <Tooltip content={<Tip />} />
            <Bar yAxisId="l" dataKey="unitsSold" name="Units Sold" fill={SURFACE2} radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Line yAxisId="r" type="monotone" dataKey="bookingValue" name="Booking Value" stroke={BLUE} strokeWidth={2.3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function PostSalesTab({ p }) {
  if (!p.sales.sellable) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px 0", color: SLATE }}>
          <Users size={30} color={MIST} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 4 }}>Not Applicable</div>
          <div style={{ fontSize: 12.5 }}>No buyer base for this asset type — collections, possession and customer service do not apply.</div>
        </div>
      </Card>
    );
  }
  const s = p.sales;
  const ticketsOpen = 4 + (p.health === "Delayed" ? 9 : p.health === "At Risk" ? 5 : 0);
  const satisfaction = (4.6 - (p.health === "Delayed" ? 1.1 : p.health === "At Risk" ? 0.5 : 0)).toFixed(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiTile label="Collections to Date" value={fmtM(s.collections)} accent={TEAL} />
        <KpiTile label="Outstanding" value={fmtM(s.outstanding)} accent={AMBER} />
        <KpiTile label="Collection Rate" value={`${s.collectionRate}%`} />
        <KpiTile label="Target Possession" value={p.expectedCompletion} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <Card title="Collections vs Outstanding" badge>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "10px 0" }}>
            <MiniDonut data={[{ name: "Collected", value: s.collections, color: TEAL }, { name: "Outstanding", value: s.outstanding, color: SURFACE2 }]} size={130} />
            <div>
              <Row2 label="Bookings Value" value={fmtM(s.bookingsValue)} />
              <Row2 label="Collected" value={fmtM(s.collections)} />
              <Row2 label="Outstanding" value={fmtM(s.outstanding)} />
            </div>
          </div>
        </Card>
        <Card title="Customer Service" badge>
          <Row2 label="Open Tickets" value={ticketsOpen} />
          <Row2 label="Avg Resolution Time" value={`${p.health === "Delayed" ? 9 : p.health === "At Risk" ? 6 : 3} days`} />
          <Row2 label="Satisfaction Score" value={`${satisfaction} / 5`} />
          <Row2 label="Possession Readiness" value={p.health === "On Track" ? "Ready" : "Pending construction milestone"} />
        </Card>
      </div>
    </div>
  );
}

/* ================= Pre-Sales page ================= */
function PreSalesPage({ DATA }) {
  const P = DATA.portfolio;
  const sellable = DATA.projects.filter((p) => p.sales.sellable);
  return (
    <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: INK }}>Pre-Sales</span>
        <SampleBadge />
      </div>
      <div style={{ fontSize: 12.5, color: SLATE, marginTop: -10 }}>
        Calculated from real construction progress + budget via documented assumptions (see chat write-up) — not sourced from a live CRM.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        <KpiTile label="Sellable Projects" value={sellable.length} />
        <KpiTile label="Total Units" value={fmtN(sellable.reduce((a, p) => a + p.sales.totalUnits, 0))} />
        <KpiTile label="Units Sold" value={fmtN(P.totalUnitsSold)} accent={BLUE} />
        <KpiTile label="Bookings Value" value={fmtM(P.totalBookingsValue)} accent={BLUE} />
        <KpiTile label="GDV (Total Sellable Value)" value={fmtM(sellable.reduce((a, p) => a + p.sales.gdv, 0))} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
        <Card title="Sales Funnel (YTD)"><SalesFunnel funnel={P.funnel} /></Card>
        <Card title="Booking Value Trend by Month">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={P.trend} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="bkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10.5, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} />
              <YAxis tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e6)}M`} />
              <Tooltip content={<Tip money />} />
              <Area type="monotone" dataKey="bookingValue" name="Booking Value" stroke={BLUE} strokeWidth={2.2} fill="url(#bkFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Sellable Projects — Absorption">
        {sellable.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${LINE}` }}>
            <div style={{ width: 210, fontSize: 13, fontWeight: 600, color: INK }}>{p.name}</div>
            <div style={{ flex: 1 }}><ProgressBar value={p.sales.absorption} color={BLUE} /></div>
            <div style={{ width: 50, textAlign: "right", fontSize: 12.5, fontWeight: 700 }}>{p.sales.absorption}%</div>
            <div style={{ width: 110, textAlign: "right", fontSize: 12, color: SLATE }}>{fmtN(p.sales.unitsSold)}/{fmtN(p.sales.totalUnits)} units</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ================= Post-Sales page ================= */
function PostSalesPage({ DATA }) {
  const P = DATA.portfolio;
  const sellable = DATA.projects.filter((p) => p.sales.sellable);
  const [sub, setSub] = useState("collections");
  return (
    <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: INK }}>Post-Sales</span>
        <SampleBadge />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[["collections", "Collections"], ["construction", "Construction"], ["possession", "Possession"], ["service", "Customer Service"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} style={{
            border: `1px solid ${sub === k ? BLUE : LINE}`, background: sub === k ? "rgba(76,134,255,0.12)" : SURFACE, color: sub === k ? BLUE : SLATE,
            borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{l}</button>
        ))}
      </div>

      {sub === "collections" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiTile label="Total Collections" value={fmtM(P.totalCollections)} accent={TEAL} />
            <KpiTile label="Outstanding" value={fmtM(P.totalOutstanding)} accent={AMBER} />
            <KpiTile label="Collection Rate" value={`${Math.round(P.totalCollections / P.totalBookingsValue * 100)}%`} />
            <KpiTile label="90+ Days Overdue" value={fmtM(P.ageing[3].value)} accent={CORAL} />
          </div>
          <Card title="Outstanding Ageing (SAR)" badge>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={P.ageing} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
                <CartesianGrid stroke={LINE} vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: SLATE }} axisLine={{ stroke: LINE }} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v/1e6)}M`} />
                <Tooltip content={<Tip money />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {P.ageing.map((_, i) => <Cell key={i} fill={[TEAL, AMBER, "#E38B2B", CORAL][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {sub === "construction" && (
        <Card title="Delivery Health (Real Data)">
          {DATA.projects.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${LINE}` }}>
              <div style={{ width: 230, fontSize: 13, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
              <div style={{ flex: 1 }}><ProgressBar value={p.actualPct} color={healthColor(p.health)} /></div>
              <div style={{ width: 50, textAlign: "right", fontSize: 12.5, fontWeight: 700 }}>{p.actualPct}%</div>
              <StatusPill status={p.health} />
            </div>
          ))}
        </Card>
      )}

      {sub === "possession" && (
        <Card title="Upcoming Possessions" badge>
          {P.possessions.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${LINE}` }}>
              <Clock size={14} color={BLUE} />
              <div style={{ flex: 1, fontSize: 13, color: INK, fontWeight: 600 }}>{p.project}</div>
              <div style={{ fontSize: 12, color: SLATE }}>{p.location}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: INK, width: 80, textAlign: "right" }}>{p.target}</div>
            </div>
          ))}
        </Card>
      )}

      {sub === "service" && (
        <Card title="Customer Service Overview" badge>
          {sellable.map((p) => {
            const ticketsOpen = 4 + (p.health === "Delayed" ? 9 : p.health === "At Risk" ? 5 : 0);
            const satisfaction = (4.6 - (p.health === "Delayed" ? 1.1 : p.health === "At Risk" ? 0.5 : 0)).toFixed(1);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: `1px solid ${LINE}` }}>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: INK }}>{p.name}</div>
                <div style={{ fontSize: 12, color: SLATE, width: 90 }}>{ticketsOpen} open tickets</div>
                <div style={{ fontSize: 12, color: SLATE, width: 110 }}>CSAT {satisfaction}/5</div>
                <StatusPill status={p.health} />
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

function buildCopilotContext(data, projectId) {
  const projects = data.projects
    .filter((project) => !projectId || project.id === projectId)
    .map((project) => ({
      id: project.id,
      name: project.name,
      location: project.location,
      type: project.type,
      health: project.health,
      plannedPct: project.plannedPct,
      actualPct: project.actualPct,
      variance: project.variance,
      budget: project.budget,
      budgetUtilCurrent: project.budgetUtilCurrent,
      remainingBudget: project.remainingBudget,
      expectedCompletion: project.expectedCompletion,
      milestones: project.milestones,
      risks: project.risks,
    }));

  return {
    dataStatus: "sample/calculated dashboard data",
    portfolio: {
      totalProjects: data.portfolio.totalProjects,
      totalBudget: data.portfolio.totalBudget,
      totalOutstanding: data.portfolio.totalOutstanding,
      health: data.portfolio.health,
    },
    projects,
  };
}

function CopilotPanel({ DATA, projectId, onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setLoading(true);
    try {
      const copilotApiUrl = import.meta.env.VITE_COPILOT_API_URL || "/api/copilot";
      const response = await fetch(copilotApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, context: buildCopilotContext(DATA, projectId) }),
      });
      const responseText = await response.text();
      let payload;
      try {
        payload = JSON.parse(responseText);
      } catch {
        const contentType = response.headers.get("content-type") || "";
        throw new Error(responseText.trimStart().startsWith("<") || contentType.includes("text/html")
          ? `Chatbot API is not connected. Configure VITE_COPILOT_API_URL to your deployed Lambda/API Gateway endpoint (HTTP ${response.status}).`
          : `Chatbot returned an invalid response (HTTP ${response.status}).`);
      }
      if (!response.ok) throw new Error(payload.error || "Copilot request failed.");
      setMessages((current) => [...current, { role: "assistant", content: payload.answer, sources: payload.sources }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "error", content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, width: 380, maxWidth: "calc(100vw - 40px)", background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 12, boxShadow: "0 14px 40px rgba(0,0,0,.35)", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: INK, fontWeight: 700, fontSize: 13.5 }}>
          <MessageCircle size={16} color={BLUE} /> Portfolio Copilot
        </div>
        <button onClick={onClose} aria-label="Close copilot" style={{ border: "none", background: "transparent", color: SLATE, cursor: "pointer" }}><X size={16} /></button>
      </div>
      <div style={{ maxHeight: 360, overflowY: "auto", padding: 14 }}>
        {messages.length === 0 && <div style={{ color: SLATE, fontSize: 12.5, lineHeight: 1.5 }}>Ask about project health, budget utilization, milestones, or risks. Answers use the dashboard&apos;s sample/calculated data.</div>}
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: 12, color: message.role === "error" ? CORAL : INK, fontSize: 12.5, lineHeight: 1.5 }}>
            <div style={{ color: message.role === "user" ? BLUE : SLATE, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{message.role === "user" ? "You" : message.role === "error" ? "Error" : "Copilot"}</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div>
            {message.sources?.length > 0 && <div style={{ color: MIST, fontSize: 10.5, marginTop: 4 }}>Sources: {message.sources.join(", ")}</div>}
          </div>
        ))}
        {loading && <div style={{ color: SLATE, fontSize: 12 }}>Thinking...</div>}
      </div>
      <form onSubmit={ask} style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${LINE}` }}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a portfolio question..." style={{ flex: 1, minWidth: 0, border: `1px solid ${LINE}`, borderRadius: 7, padding: "8px 10px", background: NAVY2, color: INK, outline: "none", fontFamily: "inherit", fontSize: 12 }} />
        <button type="submit" aria-label="Send question" disabled={loading} style={{ border: "none", borderRadius: 7, background: BLUE, color: "#fff", width: 34, cursor: loading ? "wait" : "pointer" }}><Send size={14} /></button>
      </form>
    </div>
  );
}

/* ================= Root App ================= */
export default function App() {
  const [page, setPage] = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const openProject = (id) => { setSelectedId(id); setPage("projectDetail"); };
  const goto = (p) => { setPage(p); };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: PAPER, minHeight: "100vh", color: INK }}>
      <TopBar page={page} setPage={goto} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)", alignItems: "stretch" }}>
        <SideBar page={page} setPage={goto} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {page === "overview" && <OverviewPage DATA={DATA} openProject={openProject} />}
          {page === "presales" && <PreSalesPage DATA={DATA} />}
          {page === "postsales" && <PostSalesPage DATA={DATA} />}
          {page === "projects" && (
            <div style={{ padding: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 16 }}>All Projects</div>
              <ProjectsDirectory DATA={DATA} openProject={openProject} compact={false} />
            </div>
          )}
          {page === "projectDetail" && <ProjectDetailPage DATA={DATA} projectId={selectedId} back={() => goto("projects")} />}
        </div>
      </div>
      <button onClick={() => setCopilotOpen(true)} aria-label="Open portfolio copilot" style={{ position: "fixed", right: 20, bottom: 20, display: copilotOpen ? "none" : "flex", alignItems: "center", gap: 8, border: "none", borderRadius: 22, padding: "11px 16px", background: BLUE, color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 22px rgba(0,0,0,.3)" }}>
        <MessageCircle size={16} /> Ask Copilot
      </button>
      {copilotOpen && <CopilotPanel DATA={DATA} projectId={selectedId} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
}