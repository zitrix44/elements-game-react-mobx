export default `
id	title	parentIds	mdIcon	customDrawerType	customDrawData	discovered	comment
# comment line starts with #							
"# for edit CSV file, use some ""LibreOffice Calc"", or Excel "							
# comment line starts with quote before # means the comment line have the quote char in own content							
# known columns: id,title,parentIds,mdIcon,customDrawerType,customDrawData,discovered,comment.							
"# unknown columns: ID, iD, Id, "" id"", ""id "", ""id;"" (and etc.)"							
# each line define one element							
"# - element should have (of course) its own name (""title"" column), e.g. ""Fire extinguisher""; you can use spacebars, comma, and any characters (max lenght is 30)"							
"# - element should have an icon, e.g. ""fire_extinguisher""; find your icon at https://fonts.google.com/icons , click on icon, find ""Icon name"" block, put icon name to ""mdIcon"" column"							
"#   you may duplicate title and mdIcon, e.g. it's ok to have five ""Fire extinguisher"" (for testing?) (with different ids)... but it will be weird Elements game"							
"# - element should have the uniq id (""id"" column), e.g. ""fire_extinguisher""; sorry, but please fill it in; only a-z, 0-9, and underscope (_) are allowed "							
"#   no way to define two ""fire_extinguisher"" (by id)"							
# parents							
"# - root element has an empty ""parentIds"" column, e.g. no way to open the Time element"							
"# - regular element has parents, e.g. ""Orange"" discovered by combine ""Red"", and ""Yellow"", e.g. speech = air + wave"							
"# - parents is defined in ""parentIds"" column; e.g. ""yellow, red"""							
# - four parents is maximum (but two parents shiuld be enought)							
"# - ""parentIds"" column contains ids (not titles)"							
"# - ids separated by spacebar ("" ""), or comma ("",""), spacebar after comma is valid ("" ,  "")"							
"# - correct: ""air,time"", ""air time"", ""air, time"",  ""  air  ,  time  "", ""air;time"", ""  air  ;  time  "" "							
"# - invalid: ""air,,time"" (empty id inside "",,""), ""air,;time"", ("";time"" is wrong id) ""air  time"" (empty id inside "" "")"							
# - root elements will placed at level 0, child of two root elements will placed at level 1 (el@1 is child of el@0 and el@0), el@17 is child of el@16 and el@5							
# comment							
"# - up to you (no affect to gameplay by ""comment"" column)"							
"# - use ""#"" symbol in the middle of the line means nothing"							
"# - it's it's ok to define (by title) ""Speech"" and ""Sp##ch"" elements, as well as ""#peech"""							
# discovered (runtime data)							
# - used for save/load the game 							
# - leave blank while you define rules							
# - root elements will be opened automatically							
"# - TODO: if you want to open the element automatically: set to ""+"" (remove quotes)"							
"# - TODO: if you want to mark element as opened by player/user: set to JS date as number (no quotes for numbers); e.g. ""946684800000"" for Date.UTC(2000, 0, 1, 0, 0, 0, 0), ""946684801000"" for Date.UTC(2000, 11, 31, 0, 0, 0, 0), ""978220800000"" "							
# other columns							
# - TODO: customDrawerType							
# - TODO: customDrawData							
# blank space							
"# - spaces will be trimmed; e.g. id ""water "" means ""water"" "							
"# - + water	Water+ may parsed as id=++ (empty id is error), title=+water+ (not +Water+), parentIds=+Water+"							
#  to throw out the error: replace all + to quotes in text editor, open changed file in spreadsheet editor							
#  for programmers: never ever use regular expression for parse a CSV							
# - empty lines is allowed							
# - empty line at start of the document/file is allowed							
# - empty line at end of the document/file is allowed							
water	Water		water_drop 				
fire	Fire		local_fire_department 				
fire_extinguisher 	Fire extinguisher 	water, fire	fire_extinguisher 				
air 	Air		air 				
wave	Wave	air, time	earthquake				earthquake, equalizer 
time	Time		hourglass_bottom				
speech	Speech	air,wave	tooltip_2 				
microbes	Microbes	time, water	bug_report 				
grass	Grass	time, microbes	grass				
humans	Humans	microbes, speech	wc				
communication 	Communication	humans, humans,speech	communication 				
miscommunication	Miscommunication	humans, humans,speech	chat_error				
home	Home	communication, miscommunication	bungalow				bungalow, other_houses
city	City	time, home	location_city				
stingray	Stingray	microbes, gravity	hide_source				
birds	Birds	air, microbes	raven 				
park	Park	city, grass	attractions				
fire_truck 	Fire truck	fire,fire_extinguisher , humans	fire_truck 				
fire_hydrant 	Fire hydrant 	water, fire, humans	fire_hydrant 				
car_accident	Car accident	fire_truck , fire_hydrant 	car_crash 				
gravity	Gravity		keyboard_double_arrow_down 				
river	River	gravity, water	ssid_chart				
jump	Jump	gravity, gravity	unfold_more_double 				
rocket_jump	Rocket jump	jump, fire	move_down				
jump2	Double jump	jump, jump	sync 				
eureka	Eureka	jump, jump, jump	sync_problem 				
cyclone	Cyclone	air,air	cyclone 				
atmosphere	Atmosphere	air,air	heat				
cloud	Cloud	atmosphere, wave	filter_drama				
rain	Rain	cloud, gravity	rainy				
summer_weather	Summer weather	rain, time	cloud_off				
rocket	Rocket	summer_weather, fire	rocket_launch				
pool	Pool	humans, water	pool 				
faucet	Faucet	humans, water	faucet				
sauna	Sauna	pool, fire	sauna				
force_majeure	Force majeure	cyclone, humans	flood				
kayaking	Kayaking	river, humans	kayaking				
sail	Sail	kayaking, air	sailing				
globe	Globe	sail, time	public				
`;