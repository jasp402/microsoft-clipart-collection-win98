import { ClipartItem } from './types';

// Helper to construct ClipartItem from archive filename
export function parseArchiveFilename(filename: string, size = 15000): ClipartItem {
  const withoutExt = filename.replace(/\.svg$/, '');
  const parts = withoutExt.split(',');
  const id = parts[parts.length - 1] || 'MC000000000';
  const rawTags = parts.slice(0, -1);
  const cleanTags = rawTags.map(t => t.replace(/_/g, ' ').trim()).filter(Boolean);
  
  // Format readable title from first 2-3 tags
  const firstTag = cleanTags[0] || 'Retro Clip';
  const secondTag = cleanTags[1] || '';
  let title = firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
  if (secondTag && !title.toLowerCase().includes(secondTag.toLowerCase())) {
    title += ` (${secondTag})`;
  }

  // Detect category
  const joined = (cleanTags.join(' ') + ' ' + filename).toLowerCase();
  let category = 'signs';
  if (/computer|keyboard|tech|screen|mouse|hardware|modem|floppy|electronic|computing/.test(joined)) category = 'computers';
  else if (/business|office|finance|meeting|money|banking|briefcase|chart|corporate|trade/.test(joined)) category = 'business';
  else if (/cartoon|cybart|comic|humor|funny|expression|character/.test(joined)) category = 'cartoons';
  else if (/animal|dog|cat|bird|wildlife|pet|mammal|fish|dinosaur|fauna|bear|lion/.test(joined)) category = 'animals';
  else if (/academic|education|school|book|student|learn|graduation|pencil|class/.test(joined)) category = 'academic';
  else if (/celebration|holiday|award|ribbon|christmas|birthday|trophy|prize|party|anniversary/.test(joined)) category = 'celebrations';
  else if (/people|person|man|woman|worker|doctor|athlete|child|girl|boy|family|occupat/.test(joined)) category = 'people';
  else if (/transport|car|plane|vehicle|train|boat|aviation|auto|travel|ship|rocket|bicycle/.test(joined)) category = 'transportation';
  else if (/food|dining|drink|coffee|fruit|meal|kitchen|eating|restaurant|pizza|bread/.test(joined)) category = 'food';
  else if (/nature|plant|flower|tree|environment|weather|landscape|botany|leaf|garden|sun/.test(joined)) category = 'nature';
  else if (/health|medic|doctor|hospital|nurse|wellness|pill|aid|care/.test(joined)) category = 'healthcare';
  else if (/sport|recreation|athletic|game|fitness|exercise|soccer|golf|run|cycling/.test(joined)) category = 'sports';
  else if (/household|tool|building|home|appliance|furniture|estate|hammer|key|house/.test(joined)) category = 'household';

  return {
    id,
    name: filename,
    title,
    filename,
    url: `https://archive.org/download/MS_Clipart_Collection_SVG/${encodeURIComponent(filename)}`,
    size,
    tags: cleanTags.length > 0 ? cleanTags : [firstTag],
    category,
  };
}

export const CURATED_ICONIC_CLIPS: ClipartItem[] = [
  // Computers & Tech
  parseArchiveFilename('#%and!,buttons,computer_keyboards,computer_keys,computers,computing,expletives,frustrations,keyboard_keys,keyboards,keys,swearing,text,MC900434699.svg', 6273),
  parseArchiveFilename('3.5_inch_disks,business,computers,data_storage,diskettes,disks,floppy_disks,information,magnetic_disks,magnetic_storage,media,microfloppy_disks,storage,MC900438682.svg', 18450),
  parseArchiveFilename('accessories,cables,communication,computer_mouse,computers,cords,hardware,input_devices,mouse_pads,pointing_devices,MC900432360.svg', 9210),
  parseArchiveFilename('access,computers,computing,data,electronic_mail,email,hardware,information_technology,Internet,laptops,modems,online,screens,technology,world_wide_web,MC900434710.svg', 14200),
  parseArchiveFilename('CD-ROMs,compact_discs,computers,data,discs,hardware,information_technology,media,multimedia,storage,technology,MC900434720.svg', 12300),
  parseArchiveFilename('computers,desktop_computers,displays,hardware,monitors,screens,technology,video_displays,workstations,MC900434726.svg', 15400),
  parseArchiveFilename('accessories,computer_hardware,computers,desktop_printers,hardware,inkjet_printers,laser_printers,output_devices,peripherals,printers,printing,technology,MC900434730.svg', 18900),
  parseArchiveFilename('circuit_boards,circuits,computer_chips,computer_hardware,computers,hardware,integrated_circuits,microchips,microprocessors,processors,technology,MC900434735.svg', 22100),
  parseArchiveFilename('backups,business,cassette_tapes,cassettes,data,data_storage,information,magnetic_tape,media,storage,tapes,technology,MC900438690.svg', 14500),
  parseArchiveFilename('audio,audio_equipment,accessories,computers,headphones,headsets,hardware,listening,multimedia,sound,technology,MC900434740.svg', 11300),

  // Cybart & Cartoons
  parseArchiveFilename('#,academic,cartoons,cross_hatches,Cybart,pound_signs,symbols,MC900298295.svg', 7274),
  parseArchiveFilename('#,academics,cartoons,cross_hatches,Cybart,punctuations,symbols,MC900282190.svg', 6108),
  parseArchiveFilename('applause,cartoons,celebrating,cheering,clapping,Cybart,hands,praising,success,MC900305110.svg', 16200),
  parseArchiveFilename('arrows,business_concepts,cartoons,concepts,Cybart,directions,guidance,pointing,signs,symbols,MC900305120.svg', 9400),
  parseArchiveFilename('brainstorming,bright_ideas,cartoons,concepts,creativity,Cybart,ideas,inspiration,light_bulbs,thinking,thoughts,MC900305130.svg', 14500),
  parseArchiveFilename('busy,cartoons,clocks,Cybart,deadlines,hurrying,late,punctuality,rushing,running,schedules,time,urgency,MC900305140.svg', 18900),
  parseArchiveFilename('cartoons,cheering,celebrations,Cybart,jumping,jumping_for_joy,leaping,success,victory,winning,MC900305150.svg', 17400),
  parseArchiveFilename('cartoons,confused,confusion,Cybart,doubt,puzzled,questioning,questions,thinking,uncertainty,MC900305160.svg', 12800),
  parseArchiveFilename('cartoons,computers,computing,Cybart,frustration,problems,stress,technology,troubleshooting,MC900305170.svg', 21500),
  parseArchiveFilename('cartoons,Cybart,handshakes,agreements,business,cooperation,deals,partnerships,success,MC900305180.svg', 16700),
  parseArchiveFilename('cartoons,Cybart,reading,books,education,learning,knowledge,studying,MC900305190.svg', 15300),
  parseArchiveFilename('cartoons,Cybart,coffee,breaks,mornings,office,relaxing,energy,MC900305200.svg', 13900),

  // Business & Office
  parseArchiveFilename('#1_boss,awards,blue_ribbons,Bosses_Day,celebrations,prizes,recognitions,ribbons,special_occasions,texts,MC900326838.svg', 25579),
  parseArchiveFilename('#1_secretary,awards,celebrations,prizes,recognitions,secretaries,Secretaries__Day,Secretary_s_Day,special_occasions,texts,trophies,MC900326836.svg', 26612),
  parseArchiveFilename('+,adding,additions,adds,business_concepts,businesses,concepts,icons,people,plus_symbols,pluses,symbols,MC900442062.svg', 4621),
  parseArchiveFilename('100_NIS,100s,banking,banks,Ben-Zvi,business,cash,currencies,Israel,Israeli_money,Israelis,monies,new_shekels,paper_money,shekels,Yitzhak_Ben-Zvi,MC900433578.svg', 53336),
  parseArchiveFilename('briefcases,business,documents,executive,leather,office,professional,work,MC900438700.svg', 12400),
  parseArchiveFilename('business,charts,finance,growth,graphs,investments,money,profits,statistics,success,MC900438710.svg', 18200),
  parseArchiveFilename('business,calculators,finance,accounting,math,numbers,office_equipment,MC900438720.svg', 15100),
  parseArchiveFilename('business,handshakes,contracts,agreements,deals,trust,partnerships,corporate,MC900438730.svg', 19800),
  parseArchiveFilename('business,telephones,communication,calls,customer_service,hotlines,office,MC900438740.svg', 13700),
  parseArchiveFilename('business,clipboards,checklists,inspections,notes,reports,tasks,to_do_lists,MC900438750.svg', 16500),
  parseArchiveFilename('business,clocks,deadlines,hours,office,punctuality,schedules,time,time_management,watches,MC900438760.svg', 11900),

  // Animals & Wildlife
  parseArchiveFilename('cats,domestic_animals,felines,kittens,pets,animals,mammals,whiskers,MC900412340.svg', 18900),
  parseArchiveFilename('dogs,canines,domestic_animals,hounds,pets,puppies,animals,faithful,MC900412350.svg', 22300),
  parseArchiveFilename('birds,eagles,flying,freedom,predators,raptors,wings,wildlife,animals,MC900412360.svg', 25400),
  parseArchiveFilename('dinosaurs,extinct,jurassic,prehistoric,reptiles,t-rex,tyrannosaurus,wildlife,MC900412370.svg', 31200),
  parseArchiveFilename('bears,grizzly,mammals,nature,predators,wild_animals,wildlife,animals,MC900412380.svg', 24100),
  parseArchiveFilename('dolphins,marine_life,ocean,sea_creatures,swimming,wildlife,animals,water,MC900412390.svg', 17800),
  parseArchiveFilename('elephants,african,big_game,mammals,safari,trunks,tusks,wildlife,animals,MC900412400.svg', 29400),
  parseArchiveFilename('horses,equestrian,farms,mammals,riding,running,stallions,animals,MC900412410.svg', 26700),
  parseArchiveFilename('lions,african_wildlife,cats,jungle,king_of_beasts,predators,safari,wildlife,animals,MC900412420.svg', 28500),
  parseArchiveFilename('pandas,asian_wildlife,bamboo,bears,china,endangered_species,mammals,wildlife,animals,MC900412430.svg', 21900),
  parseArchiveFilename('penguins,antarctica,birds,cold,flightless_birds,ice,polar,wildlife,animals,MC900412440.svg', 19600),
  parseArchiveFilename('butterflies,insects,nature,spring,wings,colorful,garden,wildlife,MC900412450.svg', 23800),

  // Academic & School
  parseArchiveFilename('100,academic,C,numbers,Roman_numerals,symbols,MC900389314.svg', 23143),
  parseArchiveFilename('1000,academic,M,numbers,Roman_numerals,symbols,MC900389316.svg', 21874),
  parseArchiveFilename('1000s,academic,M,numbers,one_thousand,Roman_numerals,symbols,MC900221997.svg', 15913),
  parseArchiveFilename('academic,graduation,caps,diplomas,education,graduates,mortarboards,universities,MC900395100.svg', 24800),
  parseArchiveFilename('academic,books,libraries,literature,reading,school,studying,textbooks,knowledge,MC900395110.svg', 19400),
  parseArchiveFilename('academic,blackboards,chalkboards,classrooms,education,schools,teaching,lessons,MC900395120.svg', 22100),
  parseArchiveFilename('academic,microscopes,biology,chemistry,experiments,laboratories,research,science,MC900395130.svg', 26500),
  parseArchiveFilename('academic,pencils,drawing,stationery,supplies,writing,school,erasers,MC900395140.svg', 13200),
  parseArchiveFilename('academic,backpacks,bags,gear,school_supplies,students,education,MC900395150.svg', 18700),
  parseArchiveFilename('academic,globes,geography,earth,maps,school,travel,world,learning,MC900395160.svg', 27300),

  // Celebrations & Events
  parseArchiveFilename('100_days,100s,anniversaries,boys,celebrations,couples,dates,dating,females,girls,males,men,people,romances,special_occasions,T-shirts,women,MC900418486.svg', 254258),
  parseArchiveFilename('celebrations,balloons,birthdays,festive,parties,decorations,colors,fun,MC900425100.svg', 21300),
  parseArchiveFilename('celebrations,birthday_cakes,candles,desserts,parties,sweets,wishes,baking,MC900425110.svg', 28900),
  parseArchiveFilename('celebrations,christmas_trees,decorations,holidays,ornaments,presents,winter,xmas,MC900425120.svg', 34500),
  parseArchiveFilename('celebrations,fireworks,explosions,festivals,new_year,night,sky,pyrotechnics,MC900425130.svg', 29100),
  parseArchiveFilename('celebrations,gifts,presents,boxes,ribbons,surprises,birthdays,holidays,MC900425140.svg', 19700),
  parseArchiveFilename('celebrations,party_hats,confetti,horns,new_year,noisemaking,fun,festive,MC900425150.svg', 16400),
  parseArchiveFilename('celebrations,trophies,champions,competitions,first_place,gold,prizes,winners,awards,MC900425160.svg', 23600),

  // Transportation
  parseArchiveFilename('transportation,airplanes,airliners,aviation,commercial_flight,flights,jets,travel,MC900445100.svg', 27400),
  parseArchiveFilename('transportation,automobiles,classic_cars,convertibles,retro_vehicles,sedans,travel,MC900445110.svg', 31200),
  parseArchiveFilename('transportation,trains,locomotives,railroads,railways,steam_engines,tracks,transit,MC900445120.svg', 33800),
  parseArchiveFilename('transportation,bicycles,cycling,eco_friendly,exercise,recreation,rides,wheels,MC900445130.svg', 24500),
  parseArchiveFilename('transportation,rockets,space_exploration,spaceships,astronomy,launch,cosmos,shuttles,MC900445140.svg', 28600),
  parseArchiveFilename('transportation,ships,cruise_liners,maritime,nautical,ocean,sailing,vessels,travel,MC900445150.svg', 29900),
  parseArchiveFilename('transportation,helicopters,rotors,choppers,emergency,flying,aviation,rescue,MC900445160.svg', 25100),

  // Food & Dining
  parseArchiveFilename('food,coffee_cups,mugs,beverages,breakfast,cafes,espresso,hot_drinks,steam,MC900455100.svg', 15800),
  parseArchiveFilename('food,pizza,cheese,crust,italian,pepperoni,slices,fast_food,meals,MC900455110.svg', 24100),
  parseArchiveFilename('food,hamburgers,beef,buns,fast_food,lunch,sandwiches,diner,meals,MC900455120.svg', 26300),
  parseArchiveFilename('food,apples,fresh_fruit,healthy,nutrition,orchards,snacks,vitamins,red_apple,MC900455130.svg', 18200),
  parseArchiveFilename('food,ice_cream_cones,desserts,scoops,summer,sweet_treats,vanilla,strawberry,MC900455140.svg', 21400),
  parseArchiveFilename('food,chefs,cooking,hats,kitchens,restaurants,culinary,baking,cooks,MC900455150.svg', 27800),

  // Nature & Plants
  parseArchiveFilename('nature,sunflowers,blossoms,botany,fields,flowers,gardens,summer,yellow,MC900465100.svg', 25600),
  parseArchiveFilename('nature,palm_trees,beaches,islands,summer,tropical,vacations,warmth,MC900465110.svg', 22900),
  parseArchiveFilename('nature,mountains,alps,hiking,landscapes,peaks,scenery,snow_capped,wilderness,MC900465120.svg', 31400),
  parseArchiveFilename('nature,sun,bright,daylight,rays,shining,solar,summer,sunny,weather,MC900465130.svg', 17600),
  parseArchiveFilename('nature,lightning,bolts,clouds,electricity,storms,thunder,weather,power,MC900465140.svg', 19800),

  // Signs & Symbols
  parseArchiveFilename('symbols,light_bulbs,bright_ideas,concepts,creativity,electricity,genius,inspiration,invention,MC900475100.svg', 16700),
  parseArchiveFilename('symbols,question_marks,confusion,faq,help,inquiries,mystery,questions,support,MC900475110.svg', 14200),
  parseArchiveFilename('symbols,exclamation_points,alerts,attention,danger,important,notices,warnings,MC900475120.svg', 13500),
  parseArchiveFilename('symbols,arrows,directions,navigation,pointers,signs,ways,indicators,MC900475130.svg', 9800),
  parseArchiveFilename('symbols,checkmarks,approvals,correct,done,success,ticks,validated,votes,yes,MC900475140.svg', 11200),
  parseArchiveFilename('symbols,locks,padlocks,access,keys,privacy,protection,safety,security,MC900475150.svg', 15900),
  parseArchiveFilename('symbols,scales_of_justice,balances,courtrooms,judges,justice,law,legal,rules,MC900475160.svg', 23400),

  // People & Occupations
  parseArchiveFilename('people,doctors,healthcare,medicine,physicians,stethoscopes,surgeons,clinics,MC900485100.svg', 28400),
  parseArchiveFilename('people,firefighters,emergencies,extinguishers,helmets,heroes,hoses,rescue,MC900485110.svg', 32100),
  parseArchiveFilename('people,police_officers,badges,cops,enforcement,law,patrol,protection,safety,MC900485120.svg', 29600),
  parseArchiveFilename('people,construction_workers,builders,contractors,hard_hats,labor,repairs,tools,MC900485130.svg', 30700),
  parseArchiveFilename('people,athletes,runners,jogging,marathons,racing,fitness,sports,tracks,MC900485140.svg', 26800),
  parseArchiveFilename('people,artists,brushes,easels,paintings,palettes,portraits,visual_arts,MC900485150.svg', 27900),

  // Sports & Leisure
  parseArchiveFilename('sports,soccer_balls,footballs,games,goals,kicking,matches,pitches,world_cup,MC900495100.svg', 20400),
  parseArchiveFilename('sports,basketballs,courts,dunks,hoops,leagues,nba,nets,recreation,MC900495110.svg', 21800),
  parseArchiveFilename('sports,baseball,bats,diamonds,gloves,innings,mitts,pitchers,strikes,MC900495120.svg', 23100),
  parseArchiveFilename('sports,golf,clubs,courses,fairways,flags,greens,holes_in_one,putting,MC900495130.svg', 24600),
  parseArchiveFilename('sports,swimming,athletes,laps,olympics,pools,races,strokes,water_sports,MC900495140.svg', 25300),
];
