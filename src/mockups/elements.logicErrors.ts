export default `
id	title	parentIds	mdIcon	customDrawerType	customDrawData	discovered	comment
							empty line is ok, spaces will be trimmed
							no affect to gameplay by comment
nothing-to-see-here
stanalone-element	Stanalone element
long id with spacebars 4 check the UI	...	water,water,water,water
longTitle	long TITLE with spacebars 4 check the UI, again long TITLE with spacebars 4 check the UI
water	Water		water_drop				
# yep?
fire	Fire		local_fire_department				
fire_extinguisher	Fire extinguisher	"water	fire"	fire_extinguisher				
air	Air		air				
earthquake	Wave	air time	earthquake				earthquake, equalizer
time	Time						
e1	Self-hosted element	e1,time
e2
e2					
speech	Speech	air,wave,someid, some_id, some_another_id, more_character, more_character at this line, 2ndLINEpresents?,no?, ok_more_character	tooltip_2				
microbes	Microbes	time, water	bug_report				
grass	Grass	time, microbers	grass				
humans	Humans	microbes, speech	wc				
communication	Communication	humans, humans,speech	communication				
miscommunication	Miscommunication	humans, humans,speech	chat_error				
home	Home	communication, miscommunication	bungalow				bungalow, other_houses
city	City	time, home	location_city				
stingray	Stingray	microbes, gravity	unpublished				
birds	Birds	air, microbes	raven				
park	Park	city, grass	attractions				
fire_truck	Fire truck	fire,fire_extinguisher , humans	fire_truck				
fire_hydrant	Fire hydrant	water, fire, humans	fire_hydrant				
car_accident	Car accident	fire_truck , fire_hydrant	car_crash				
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