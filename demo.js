// JIM demo data – loaded only for ?demo=1 (screenshots / previews).
// Everything here is fictional sample data for a made-up user. No real person's stats, foods, or tokens.
// Dates are generated relative to today so the dashboard always looks current.
(function(){
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const day=n=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-n);return iso(d)};
const F=(item,brand,cal,p,c,f,servings)=>({item,brand,cal,p,c,f,servings:servings||1});
const M={
  Breakfast:[
    [F('Overnight oats','Rolled oats, almond milk',340,14,52,8),F('Banana','',105,1,27,0)],
    [F('Egg white omelet','Spinach, peppers',210,30,6,6),F('Sourdough toast','',150,5,28,1,1),F('Black coffee','',5,0,1,0)],
    [F('Greek yogurt bowl','Nonfat, mixed berries',260,24,34,3),F('Granola','',140,3,22,5,0.5)],
    [F('Protein pancakes','',380,32,44,8),F('Blueberries','',60,1,15,0)]
  ],
  Lunch:[
    [F('Chicken rice bowl','Grilled chicken, jasmine rice',610,48,72,12),F('Side salad','Light vinaigrette',90,2,8,6)],
    [F('Turkey wrap','Whole wheat',480,36,44,16),F('Apple','',95,0,25,0)],
    [F('Steak burrito bowl','Brown rice, black beans, salsa',690,46,78,18)],
    [F('Tuna salad sandwich','',520,38,46,18),F('Baby carrots','',35,1,8,0)]
  ],
  Dinner:[
    [F('Baked salmon','',360,38,0,22),F('Roasted potatoes','',220,4,38,6),F('Green beans','',45,2,9,0)],
    [F('Lean beef pasta','Marinara',640,42,78,14)],
    [F('Chicken stir-fry','Broccoli, snap peas',480,44,36,16),F('White rice','',200,4,44,0)],
    [F('Shrimp tacos','Corn tortillas, slaw',520,34,54,16)]
  ],
  Snack:[
    [F('Protein shake','Whey, water',130,25,3,2)],
    [F('Rice cakes + peanut butter','',250,8,24,14)],
    [F('String cheese','',80,7,1,6,1),F('Almonds','',160,6,6,14)],
    [F('Cottage cheese','Low fat',90,12,4,2),F('Pineapple','',80,1,21,0)]
  ]
};
const food=[];
for(let n=0;n<14;n++){
  const date=day(n);
  // Today (n=0) is mid-day: breakfast, lunch, snack logged – dinner still to come.
  const meals=n===0?['Breakfast','Lunch','Snack']:n===5?['Breakfast','Lunch','Dinner','Snack','Snack']:['Breakfast','Lunch','Dinner','Snack'];
  meals.forEach((m,j)=>{const opts=M[m],pick=opts[(n*3+j*2)%opts.length];pick.forEach(x=>food.push(Object.assign({date,meal:m},x)))});
}
// Fictional weight trend: gentle cut over ~3 weeks with normal day-to-day noise.
const wts=[186.4,186.0,186.2,185.6,185.1,185.4,184.8,184.6,184.9,184.1,183.8,184.0,183.5,183.2,183.4,182.9,182.6,182.8,182.3,182.0,181.8];
const daily=[];
wts.forEach((w,i)=>{const n=(wts.length-1-i);if(n%7===3)return;daily.push({date:day(n),weight:w,water:+(2.2+((i*7)%9)/10).toFixed(1)})});
window.JIM_DEMO={demo:true,today:day(0),goals:{calories:2400,protein:180,carbs:240,fat:75},food,daily};
})();
