// script.js

// --- Content from data.js (UNCHANGED as per your condition) ---

export const allQuizData = {
    math: { // Math questions, categorized by difficulty
        easy: [
            {"id": 1, "question": "What is 5 + 3?", "answer": "8", "options": ["7", "8", "9", "10"]},
            {"id": 2, "question": "What is 10 - 4?", "answer": "6", "options": ["4", "5", "6", "7"]},
            {"id": 3, "question": "What is 2 * 6?", "answer": "12", "options": ["8", "10", "12", "14"]},
            {"id": 4, "question": "What is 15 / 3?", "answer": "5", "options": ["3", "4", "5", "6"]},
            {"id": 5, "question": "What is 7 + 2 - 1?", "answer": "8", "options": ["6", "7", "8", "9"]},
            {"id": 6, "question": "What is 4 * 4?", "answer": "16", "options": ["12", "14", "16", "18"]},
            {"id": 7, "question": "What is 20 / 5?", "answer": "4", "options": ["3", "4", "5", "6"]},
            {"id": 8, "question": "What is 9 + 11?", "answer": "20", "options": ["18", "19", "20", "21"]},
            {"id": 9, "question": "What is 13 - 7?", "answer": "6", "options": ["5", "6", "7", "8"]},
            {"id": 10, "question": "What is 3 * 7?", "answer": "21", "options": ["18", "19", "20", "21"]},
            {"id": 11, "question": "What is 25 / 5?", "answer": "5", "options": ["4", "5", "6", "7"]},
            {"id": 12, "question": "What is 1 + 1 + 1?", "answer": "3", "options": ["2", "3", "4", "5"]},
            {"id": 13, "question": "What is 10 * 0?", "answer": "0", "options": ["0", "1", "10", "100"]},
            {"id": 14, "question": "What is 8 / 2?", "answer": "4", "options": ["2", "3", "4", "5"]},
            {"id": 15, "question": "What is 5 - 5?", "answer": "0", "options": ["0", "1", "5", "10"]},
            {"id": 16, "question": "What is 6 + 6?", "answer": "12", "options": ["10", "11", "12", "13"]},
            {"id": 17, "question": "What is 9 * 2?", "answer": "18", "options": ["16", "17", "18", "19"]},
            {"id": 18, "question": "What is 100 / 10?", "answer": "10", "options": ["5", "10", "15", "20"]},
            {"id": 19, "question": "What is 12 + 8?", "answer": "20", "options": ["18", "19", "20", "21"]},
            {"id": 20, "question": "What is 17 - 9?", "answer": "8", "options": ["6", "7", "8", "9"]}
        ],
        medium: [
            {"id": 1, "question": "What is 12 * 7?", "answer": "84", "options": ["72", "78", "84", "96"]},
            {"id": 2, "question": "What is 144 / 12?", "answer": "12", "options": ["10", "11", "12", "13"]},
            {"id": 3, "question": "What is 2^3?", "answer": "8", "options": ["4", "6", "8", "16"]},
            {"id": 4, "question": "What is the square root of 81?", "answer": "9", "options": ["7", "8", "9", "10"]},
            {"id": 5, "question": "Solve for x: x + 5 = 12", "answer": "7", "options": ["5", "6", "7", "8"]},
            {"id": 6, "question": "What is 0.5 + 0.25?", "answer": "0.75", "options": ["0.5", "0.65", "0.75", "1.0"]},
            {"id": 7, "question": "What is 3/4 as a decimal?", "answer": "0.75", "options": ["0.25", "0.5", "0.75", "1.25"]},
            {"id": 8, "question": "What is 15% of 200?", "answer": "30", "options": ["15", "20", "30", "40"]},
            {"id": 9, "question": "What is the perimeter of a square with side length 5?", "answer": "20", "options": ["10", "15", "20", "25"]},
            {"id": 10, "question": "What is the area of a rectangle with length 8 and width 3?", "answer": "24", "options": ["11", "16", "24", "32"]},
            {"id": 11, "question": "What is 20 + (5 * 2)?", "answer": "30", "options": ["25", "30", "40", "50"]},
            {"id": 12, "question": "What is 1/2 + 1/4?", "answer": "3/4", "options": ["1/4", "1/2", "3/4", "1"]},
            {"id": 13, "question": "How many sides does a hexagon have?", "answer": "6", "options": ["4", "5", "6", "7"]},
            {"id": 14, "question": "What is the next number in the sequence: 2, 4, 6, 8,...?", "answer": "10", "options": ["9", "10", "11", "12"]},
            {"id": 15, "question": "What is the value of Pi (to two decimal places)?", "answer": "3.14", "options": ["3.00", "3.10", "3.14", "3.15"]}
        ],
        hard: [ // Changed from "difficult" to "hard"
            {"id": 1, "question": "What is the derivative of x^2?", "answer": "2x", "options": ["x", "2x", "x^3/3", "2x^2"]},
            {"id": 2, "question": "What is the integral of 2x dx?", "answer": "x^2 + C", "options": ["2x^2 + C", "x^2", "x^2 + C", "x + C"]},
            {"id": 3, "question": "Solve for x: 2x + 7 = 15", "answer": "4", "options": ["2", "3", "4", "5"]},
            {"id": 4, "question": "What is the value of 5! (5 factorial)?", "answer": "120", "options": ["25", "50", "100", "120"]},
            {"id": 5, "question": "What is the sine of 90 degrees?", "answer": "1", "options": ["0", "0.5", "1", "-1"]},
            {"id": 6, "question": "What is the Pythagorean theorem?", "answer": "a^2 + b^2 = c^2", "options": ["a+b=c", "a^2+b^2=c^2", "a*b=c", "a/b=c"]},
            {"id": 7, "question": "What is the greatest common divisor of 24 and 36?", "answer": "12", "options": ["6", "12", "18", "36"]},
            {"id": 8, "question": "What is the least common multiple of 6 and 8?", "answer": "24", "options": ["12", "16", "24", "48"]},
            {"id": 9, "question": "How many permutations are there of 3 distinct items?", "answer": "6", "options": ["3", "6", "9", "12"]},
            {"id": 10, "question": "If a circle has a radius of 5, what is its circumference? (Use Pi = 3.14)", "answer": "31.4", "options": ["15.7", "25", "31.4", "50"]}
        ]
    },
    history: { // History questions, categorized by difficulty
        easy: [
            {"id": 1, "question": "Who was the first President of the United States?", "options": ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], "answer": "George Washington", "explanation": "George Washington led the Continental Army to victory during the American Revolutionary War and was the first President of the United States."},
            {"id": 2, "question": "In what year did World War II end?", "options": ["1939", "1941", "1945", "1950"], "answer": "1945", "explanation": "World War II officially ended with the surrender of Japan on September 2, 1945."},
            {"id": 3, "question": "Which ancient civilization built the pyramids?", "options": ["Roman", "Greek", "Egyptian", "Mayan"], "answer": "Egyptian", "explanation": "The ancient Egyptians built massive pyramids as tombs for their pharaohs and queens."},
            {"id": 4, "question": "Who wrote 'Romeo and Juliet'?", "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], "answer": "William Shakespeare", "explanation": "William Shakespeare is widely regarded as the greatest writer in the English language and wrote 'Romeo and Juliet'."},
            {"id": 5, "question": "The Declaration of Independence was signed in which city?", "options": ["New York", "Boston", "Philadelphia", "Washington D.C."], "answer": "Philadelphia", "explanation": "The Declaration of Independence was adopted by the Continental Congress in Philadelphia on July 4, 1776."},
            {"id": 6, "question": "Who was known as the 'Maid of Orleans'?", "options": ["Marie Antoinette", "Catherine the Great", "Joan of Arc", "Queen Elizabeth I"], "answer": "Joan of Arc", "explanation": "Joan of Arc was a French peasant girl who, believing she was acting under divine guidance, led the French army to several important victories during the Hundred Years' War."},
            {"id": 7, "question": "When did the Titanic sink?", "options": ["1905", "1912", "1918", "1923"], "answer": "1912", "explanation": "The RMS Titanic sank in the early morning hours of April 15, 1912, after striking an iceberg during its maiden voyage."},
            {"id": 8, "question": "Which explorer is credited with the first circumnavigation of the Earth?", "options": ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "James Cook"], "answer": "Ferdinand Magellan", "explanation": "Ferdinand Magellan led the first expedition to circumnavigate the Earth, though he died during the voyage."},
            {"id": 9, "question": "The French Revolution began in what year?", "options": ["1776", "1789", "1804", "1815"], "answer": "1789", "explanation": "The French Revolution was a period of far-reaching social and political upheaval in France that lasted from 1789 until 1799."},
            {"id": 10, "question": "Who invented the printing press?", "options": ["Leonardo da Vinci", "Johannes Gutenberg", "Galileo Galilei", "Isaac Newton"], "answer": "Johannes Gutenberg", "explanation": "Johannes Gutenberg is credited with inventing the movable type printing press around 1440."},
            {"id": 11, "question": "Who was the Roman emperor during the time of Jesus Christ's birth?", "options": ["Julius Caesar", "Augustus", "Nero", "Tiberius"], "answer": "Augustus", "explanation": "Augustus was the first Roman emperor, reigning from 27 BC until his death in AD 14. Jesus was born during his reign."},
            {"id": 12, "question": "Which civilization invented paper?", "options": ["Egyptians", "Greeks", "Chinese", "Romans"], "answer": "Chinese", "explanation": "Paper-making was invented in China during the Han Dynasty, around the 2nd century BCE."},
            {"id": 13, "question": "What war was fought between the North and South regions of the United States?", "options": ["World War I", "Civil War", "Revolutionary War", "Vietnam War"], "answer": "Civil War", "explanation": "The American Civil War was fought from 1861 to 1865 between the Union (North) and the Confederacy (South)."},
            {"id": 14, "question": "Who was the queen of ancient Egypt, famous for her relationships with Julius Caesar and Mark Antony?", "options": ["Nefertiti", "Hatshepsut", "Cleopatra VII", "Sobekneferu"], "answer": "Cleopatra VII", "explanation": "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt, renowned for her liaisons with Roman leaders."},
            {"id": 15, "question": "Which country gifted the Statue of Liberty to the USA?", "options": ["England", "Spain", "France", "Germany"], "answer": "France", "explanation": "The Statue of Liberty was a gift from the people of France to the United States, designed by Frédéric Auguste Bartholdi."},
            {"id": 16, "question": "What was the primary cause of the 'Black Death' in the 14th century?", "options": ["Famine", "Warfare", "Bacterial Plague", "Volcanic Eruption"], "answer": "Bacterial Plague", "explanation": "The Black Death was caused by the bacterium Yersinia pestis, spread by fleas on rats."},
            {"id": 17, "question": "Who was the leader of the Soviet Union during most of World War II?", "options": ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], "answer": "Joseph Stalin", "explanation": "Joseph Stalin ruled the Soviet Union as dictator from the mid-1920s until his death in 1953."},
            {"id": 18, "question": "The fall of the Berlin Wall occurred in what year?", "options": ["1979", "1989", "1999", "2009"], "answer": "1989", "explanation": "The Berlin Wall fell on November 9, 1989, marking a pivotal moment in the collapse of communism in Eastern Europe."},
            {"id": 19, "question": "Which ancient city was buried by the eruption of Mount Vesuvius?", "options": ["Rome", "Athens", "Pompeii", "Troy"], "answer": "Pompeii", "explanation": "Pompeii was an ancient Roman city near modern Naples in Italy, famously destroyed and buried by the eruption of Mount Vesuvius in AD 79."},
            {"id": 20, "question": "Who was a key figure in the Civil Rights Movement in the USA?", "options": ["Abraham Lincoln", "Martin Luther King Jr.", "George Washington", "Benjamin Franklin"], "answer": "Martin Luther King Jr.", "explanation": "Martin Luther King Jr. was a prominent leader in the American Civil Rights Movement, advocating for nonviolent civil disobedience."}
        ],
        medium: [
            {"id": 1, "question": "The Hundred Years' War was fought between which two countries?", "options": ["England and Spain", "France and Germany", "England and France", "Italy and Austria"], "answer": "England and France", "explanation": "The Hundred Years' War was a series of conflicts waged from 1337 to 1453 between the Kingdom of England and the Kingdom of France."},
            {"id": 2, "question": "Which ancient wonder was a colossal statue of the sun god Helios?", "options": ["Pyramid of Giza", "Hanging Gardens of Babylon", "Colossus of Rhodes", "Lighthouse of Alexandria"], "answer": "Colossus of Rhodes", "explanation": "The Colossus of Rhodes was a massive bronze statue of Helios, erected in the city of Rhodes on the Greek island of the same name in the 3rd century BC."},
            {"id": 3, "question": "Who led the Bolshevik Revolution in Russia in 1917?", "options": ["Joseph Stalin", "Leon Trotsky", "Vladimir Lenin", "Nikita Khrushchev"], "answer": "Vladimir Lenin", "explanation": "Vladimir Lenin was a Russian revolutionary and the first head of government of Soviet Russia and of the Soviet Union."},
            {"id": 4, "question": "Which dynasty ruled China for the longest period?", "options": ["Qin Dynasty", "Han Dynasty", "Ming Dynasty", "Zhou Dynasty"], "answer": "Zhou Dynasty", "explanation": "The Zhou Dynasty lasted for approximately 790 years, making it the longest-lasting dynasty in Chinese history."},
            {"id": 5, "question": "What significant event occurred on July 20, 1969?", "options": ["End of WWII", "Fall of Berlin Wall", "First Moon Landing", "Assassination of JFK"], "answer": "First Moon Landing", "explanation": "On July 20, 1969, Apollo 11's lunar module, carrying Neil Armstrong and Buzz Aldrin, landed on the Moon."},
            {"id": 6, "question": "Which Roman emperor made Christianity the state religion of the Roman Empire?", "options": ["Augustus", "Nero", "Constantine the Great", "Diocletian"], "answer": "Constantine the Great", "explanation": "Emperor Constantine I adopted Christianity and later made it the state religion of the Roman Empire in the 4th century CE."},
            {"id": 7, "question": "The Magna Carta was signed in which year?", "options": ["1066", "1215", "1492", "1776"], "answer": "1215", "explanation": "The Magna Carta was a royal charter of rights agreed to by King John of England at Runnymede, near Windsor, on 15 June 1215."},
            {"id": 8, "question": "Who was the leader of Nazi Germany during World War II?", "options": ["Benito Mussolini", "Hideki Tojo", "Adolf Hitler", "Francisco Franco"], "answer": "Adolf Hitler", "explanation": "Adolf Hitler was the dictator of Nazi Germany from 1933 to 1945."},
            {"id": 9, "question": "Which famous conqueror founded the city of Alexandria in Egypt?", "options": ["Julius Caesar", "Genghis Khan", "Alexander the Great", "Attila the Hun"], "answer": "Alexander the Great", "explanation": "Alexander the Great founded numerous cities, including Alexandria in Egypt, during his conquests."},
            {"id": 10, "question": "The Renaissance began in which country?", "options": ["France", "England", "Germany", "Italy"], "answer": "Italy", "explanation": "The Renaissance originated in Florence, Italy, in the 14th century."},
            {"id": 11, "question": "What was the Cold War primarily about?", "options": ["A territorial dispute", "An ideological conflict", "A religious war", "An economic embargo"], "answer": "An ideological conflict", "explanation": "The Cold War was a geopolitical struggle between the United States and its allies and the Soviet Union and its satellite states, primarily over ideology."},
            {"id": 12, "question": "Who was the last pharaoh of ancient Egypt?", "options": ["Hatshepsut", "Nefertiti", "Cleopatra VII", "Ramses II"], "answer": "Cleopatra VII", "explanation": "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt."},
            {"id": 13, "question": "The Treaty of Versailles formally ended which war?", "options": ["American Civil War", "World War I", "World War II", "Franco-Prussian War"], "answer": "World War I", "explanation": "The Treaty of Versailles was the most important of the peace treaties that brought World War I to an end."},
            {"id": 14, "question": "Which ancient civilization developed the concept of zero?", "options": ["Greeks", "Romans", "Mayans", "Indians"], "answer": "Indians", "explanation": "The concept of zero as a number and a placeholder originated in ancient India."},
            {"id": 15, "question": "What was the name of the ship that brought the Pilgrims to America?", "options": ["Pinta", "Santa Maria", "Mayflower", "Discovery"], "answer": "Mayflower", "explanation": "The Mayflower was the ship that transported English Puritans and Separatists, collectively known today as the Pilgrims, from Plymouth to the New World in 1620."}
        ],
        hard: [ // Changed from "difficult" to "hard"
            {"id": 1, "question": "Who wrote 'The Prince'?", "options": ["Machiavelli", "Dante", "Boccaccio", "Petrarch"], "answer": "Machiavelli", "explanation": "Niccolò Machiavelli, an Italian diplomat, philosopher, and historian, wrote 'The Prince' in the 16th century."},
            {"id": 2, "question": "The Edict of Nantes, which granted substantial rights to Calvinist Protestants in France, was revoked by whom?", "options": ["Louis XIII", "Louis XIV", "Henry IV", "Francis I"], "answer": "Louis XIV", "explanation": "Louis XIV revoked the Edict of Nantes in 1685, leading to the persecution of Huguenots."},
            {"id": 3, "question": "The 'Battle of Thermopylae' involved which two opposing forces?", "options": ["Romans and Gauls", "Greeks and Persians", "Egyptians and Hittites", "Byzantines and Ottomans"], "answer": "Greeks and Persians", "explanation": "The Battle of Thermopylae in 480 BC was fought between an alliance of Greek city-states led by King Leonidas I of Sparta and the Achaemenid Empire of Xerxes I."},
            {"id": 4, "question": "What was the main purpose of the Berlin Conference of 1884-1885?", "options": ["To divide Africa among European powers", "To establish rules for global trade", "To end World War I", "To discuss human rights"], "answer": "To divide Africa among European powers", "explanation": "The Berlin Conference regulated European colonization and trade in Africa during the New Imperialism period."},
            {"id": 5, "question": "Which philosopher is associated with the phrase 'I think, therefore I am'?", "options": ["Plato", "Aristotle", "René Descartes", "Immanuel Kant"], "answer": "René Descartes", "explanation": "René Descartes, a French philosopher, mathematician, and scientist, is famous for his philosophical statement 'Cogito, ergo sum'."},
            {"id": 6, "question": "What was the name of the first artificial satellite launched into space?", "answer": "Sputnik 1", "options": ["Apollo 1", "Explorer 1", "Sputnik 1", "Vostok 1"], "explanation": "Sputnik 1 was the first artificial Earth satellite, launched by the Soviet Union on October 4, 1957."},
            {"id": 7, "question": "The 'Glorious Revolution' in England in 1688 led to the overthrow of which monarch?", "options": ["Charles I", "James II", "William III", "Elizabeth I"], "answer": "James II", "explanation": "The Glorious Revolution saw the overthrow of King James II of England (James VII of Scotland and James II of Ireland) by a union of English Parliamentarians with the Dutch stadtholder William III of Orange-Nassau."},
            {"id": 8, "question": "What was the primary goal of the Crusades?", "answer": "Reclaiming the Holy Land", "options": ["Trade expansion", "Scientific discovery", "Reclaiming the Holy Land", "Political dominance"], "explanation": "The Crusades were a series of religious wars initiated by the Latin Church in the medieval period to reclaim the Holy Land from Islamic rule."},
            {"id": 9, "question": "Who was the founder of the Mongol Empire?", "answer": "Genghis Khan", "options": ["Kublai Khan", "Genghis Khan", "Tamerlane", "Batu Khan"], "explanation": "Genghis Khan founded and was the first Great Khan (Emperor) of the Mongol Empire, which became the largest contiguous empire in history."},
            {"id": 10, "question": "The term 'Iron Curtain' was popularized by which statesman?", "answer": "Winston Churchill", "options": ["Winston Churchill", "Franklin D. Roosevelt", "Harry S. Truman", "Joseph Stalin"], "explanation": "Winston Churchill used the phrase 'Iron Curtain' in a 1946 speech to describe the division between Western and Eastern Europe during the Cold War."}
        ]
    },
    geography: { // Geography questions, categorized by difficulty
        easy: [
            {"id": 1, "question": "What is the capital of France?", "answer": "Paris", "options": ["London", "Berlin", "Rome", "Paris"]},
            {"id": 2, "question": "Which ocean is the largest?", "answer": "Pacific Ocean", "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]},
            {"id": 3, "question": "What is the longest river in the world?", "answer": "Nile River", "options": ["Amazon River", "Yangtze River", "Nile River", "Mississippi River"]},
            {"id": 4, "question": "Which continent is home to the Amazon Rainforest?", "answer": "South America", "options": ["Africa", "Asia", "South America", "North America"]},
            {"id": 5, "question": "What is the smallest continent?", "answer": "Australia", "options": ["Europe", "Australia", "Antarctica", "Africa"]},
            {"id": 6, "question": "Which country is known as the Land of the Rising Sun?", "answer": "Japan", "options": ["China", "South Korea", "Japan", "Thailand"]},
            {"id": 7, "question": "What is the highest mountain in the world?", "answer": "Mount Everest", "options": ["K2", "Mount Everest", "Mount Kilimanjaro", "Denali"]},
            {"id": 8, "question": "Which sea is to the north of Europe?", "answer": "North Sea", "options": ["Mediterranean Sea", "Baltic Sea", "Black Sea", "North Sea"]},
            {"id": 9, "question": "What is the capital of Italy?", "answer": "Rome", "options": ["Milan", "Venice", "Rome", "Florence"]},
            {"id": 10, "question": "Which desert is the largest hot desert in the world?", "answer": "Sahara Desert", "options": ["Gobi Desert", "Kalahari Desert", "Sahara Desert", "Arabian Desert"]},
            {"id": 11, "question": "What is the capital of Spain?", "answer": "Madrid", "options": ["Barcelona", "Lisbon", "Madrid", "Seville"]},
            {"id": 12, "question": "Which country shares a border with both Canada and Mexico?", "answer": "United States", "options": ["United States", "Guatemala", "Cuba", "Brazil"]},
            {"id": 13, "question": "What is the largest island in the world?", "answer": "Greenland", "options": ["Australia", "Madagascar", "Greenland", "Borneo"]},
            {"id": 14, "question": "Which continent has the most countries?", "answer": "Africa", "options": ["Asia", "Europe", "Africa", "South America"]},
            {"id": 15, "question": "What is the capital of Germany?", "answer": "Berlin", "options": ["Munich", "Frankfurt", "Hamburg", "Berlin"]},
            {"id": 16, "question": "Which famous landmark is in Egypt?", "answer": "Pyramids of Giza", "options": ["Colosseum", "Eiffel Tower", "Pyramids of Giza", "Taj Mahal"]},
            {"id": 17, "question": "What is the name of the strait separating Spain and Morocco?", "answer": "Strait of Gibraltar", "options": ["Bosphorus Strait", "Strait of Hormuz", "Strait of Gibraltar", "Dover Strait"]},
            {"id": 18, "question": "Which continent is sometimes called the 'Old World'?", "answer": "Europe", "options": ["Asia", "Africa", "Europe", "North America"]},
            {"id": 19, "question": "What is the capital of Russia?", "answer": "Moscow", "options": ["St. Petersburg", "Kiev", "Moscow", "Warsaw"]},
            {"id": 20, "question": "Which ocean lies between Africa and Australia?", "answer": "Indian Ocean", "options": ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Southern Ocean"]}
        ],
        medium: [
            {"id": 1, "question": "What is the capital of Brazil?", "answer": "Brasília", "options": ["Rio de Janeiro", "São Paulo", "Brasília", "Buenos Aires"]},
            {"id": 2, "question": "Which mountain range separates Europe and Asia?", "answer": "Ural Mountains", "options": ["Alps", "Himalayas", "Ural Mountains", "Andes"]},
            {"id": 3, "question": "What is the longest country in South America?", "answer": "Chile", "options": ["Brazil", "Argentina", "Peru", "Chile"]},
            {"id": 4, "question": "Which European country is a peninsula known for its boots shape?", "answer": "Italy", "options": ["Greece", "Spain", "Italy", "Portugal"]},
            {"id": 5, "question": "What is the capital of Canada?", "answer": "Ottawa", "options": ["Toronto", "Montreal", "Vancouver", "Ottawa"]},
            {"id": 6, "question": "Which famous river flows through London?", "answer": "River Thames", "options": ["River Seine", "River Danube", "River Thames", "River Elbe"]},
            {"id": 7, "question": "What is the highest peak in North America?", "answer": "Denali (Mount McKinley)", "options": ["Mount Logan", "Mount Whitney", "Denali (Mount McKinley)", "Pico de Orizaba"]},
            {"id": 8, "question": "Which sea is located between the Balkan and Anatolian peninsulas?", "answer": "Aegean Sea", "options": ["Black Sea", "Marmara Sea", "Adriatic Sea", "Aegean Sea"]},
            {"id": 9, "question": "What is the capital of Australia?", "answer": "Canberra", "options": ["Sydney", "Melbourne", "Canberra", "Perth"]},
            {"id": 10, "question": "Which large island nation is located off the southeast coast of Africa?", "answer": "Madagascar", "options": ["Sri Lanka", "New Zealand", "Madagascar", "Indonesia"]},
            {"id": 11, "question": "What is the capital of Argentina?", "answer": "Buenos Aires", "options": ["Santiago", "Montevideo", "Buenos Aires", "Lima"]},
            {"id": 12, "question": "Which country is known as the 'Land of Fire and Ice'?", "answer": "Iceland", "options": ["Norway", "Sweden", "Iceland", "Finland"]},
            {"id": 13, "question": "What is the driest continent on Earth?", "answer": "Antarctica", "options": ["Africa", "Australia", "Antarctica", "Asia"]},
            {"id": 14, "question": "Which European capital city is built on 14 islands?", "answer": "Stockholm", "options": ["Copenhagen", "Amsterdam", "Helsinki", "Stockholm"]},
            {"id": 15, "question": "What is the capital of South Africa?", "answer": "Pretoria, Bloemfontein, Cape Town", "options": ["Johannesburg", "Durban", "Cape Town", "Pretoria, Bloemfontein, Cape Town"]}
        ],
        hard: [ // Changed from "difficult" to "hard"
            {"id": 1, "question": "What is the capital of Ethiopia?", "answer": "Addis Ababa", "options": ["Nairobi", "Cairo", "Addis Ababa", "Khartoum"]},
            {"id": 2, "question": "Which ocean trench is the deepest point on Earth?", "answer": "Mariana Trench", "options": ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Kurile-Kamchatka Trench"]},
            {"id": 3, "question": "What is the capital of Finland?", "answer": "Helsinki", "options": ["Oslo", "Stockholm", "Copenhagen", "Helsinki"]},
            {"id": 4, "question": "Which sea is a marginal sea of the Atlantic Ocean and contains the Sargasso Sea?", "answer": "Caribbean Sea", "options": ["Mediterranean Sea", "North Sea", "Caribbean Sea", "Baltic Sea"]},
            {"id": 5, "question": "What is the highest active volcano in Europe?", "answer": "Mount Etna", "options": ["Mount Vesuvius", "Stromboli", "Mount Etna", "Mount Teide"]},
            {"id": 6, "question": "Which country is both an island and a continent?", "answer": "Australia", "options": ["Madagascar", "Greenland", "Australia", "Japan"]},
            {"id": 7, "question": "What is the capital of New Zealand?", "answer": "Wellington", "options": ["Auckland", "Christchurch", "Wellington", "Queenstown"]},
            {"id": 8, "question": "Which desert is found in northern China and southern Mongolia?", "answer": "Gobi Desert", "options": ["Taklamakan Desert", "Arabian Desert", "Gobi Desert", "Karakum Desert"]},
            {"id": 9, "question": "What is the name of the only ocean completely within the Northern Hemisphere?", "answer": "Arctic Ocean", "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]},
            {"id": 10, "question": "Which Central American country is known for the Panama Canal?", "answer": "Panama", "options": ["Costa Rica", "Nicaragua", "Panama", "Honduras"]}
        ]
    },
    science: { // Science questions, categorized by difficulty
        easy: [
            {"id": 1, "question": "What force pulls objects towards the Earth?", "answer": "Gravity", "options": ["Magnetism", "Friction", "Gravity", "Tension"]},
            {"id": 2, "question": "What is the chemical symbol for water?", "answer": "H2O", "options": ["CO2", "O2", "H2O", "NaCl"]},
            {"id": 3, "question": "What gas do plants absorb from the atmosphere?", "answer": "Carbon Dioxide", "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"]},
            {"id": 4, "question": "What is the study of living organisms called?", "answer": "Biology", "options": ["Chemistry", "Physics", "Geology", "Biology"]},
            {"id": 5, "question": "Which planet is known as the Red Planet?", "answer": "Mars", "options": ["Earth", "Mars", "Jupiter", "Venus"]},
            {"id": 6, "question": "What is the boiling point of water in Celsius?", "answer": "100 degrees Celsius", "options": ["0 degrees Celsius", "50 degrees Celsius", "100 degrees Celsius", "212 degrees Celsius"]},
            {"id": 7, "question": "What part of a plant conducts photosynthesis?", "answer": "Leaves", "options": ["Roots", "Stem", "Flowers", "Leaves"]},
            {"id": 8, "question": "What is the smallest unit of matter?", "answer": "Atom", "options": ["Molecule", "Cell", "Proton", "Atom"]},
            {"id": 9, "question": "What type of energy does a battery store?", "answer": "Chemical energy", "options": ["Kinetic energy", "Thermal energy", "Chemical energy", "Electrical energy"]},
            {"id": 10, "question": "Which animal lays eggs?", "answer": "Chicken (or various other birds, reptiles, fish)", "options": ["Cow", "Cat", "Dog", "Chicken"]},
            {"id": 11, "question": "What is the main organ of the respiratory system?", "answer": "Lungs", "options": ["Heart", "Brain", "Stomach", "Lungs"]},
            {"id": 12, "question": "What causes day and night on Earth?", "answer": "Earth's rotation", "options": ["Earth's revolution", "Moon's orbit", "Sun's movement", "Earth's rotation"]},
            {"id": 13, "question": "What is the common name for the star that Earth orbits?", "answer": "Sun", "options": ["Moon", "Mars", "Sun", "Alpha Centauri"]},
            {"id": 14, "question": "What is used to measure temperature?", "answer": "Thermometer", "options": ["Barometer", "Ruler", "Thermometer", "Scale"]},
            {"id": 15, "question": "What is the primary color of a ripe tomato?", "answer": "Red", "options": ["Green", "Yellow", "Red", "Orange"]},
            {"id": 16, "question": "What is the process called when liquid turns into gas?", "answer": "Evaporation", "options": ["Condensation", "Melting", "Freezing", "Evaporation"]},
            {"id": 17, "question": "Which gas do humans breathe out?", "answer": "Carbon Dioxide", "options": ["Oxygen", "Nitrogen", "Hydrogen", "Carbon Dioxide"]},
            {"id": 18, "question": "What is a baby dog called?", "answer": "Puppy", "options": ["Kitten", "Calf", "Puppy", "Cub"]},
            {"id": 19, "question": "What is the hardest natural substance on Earth?", "answer": "Diamond", "options": ["Iron", "Gold", "Diamond", "Granite"]},
            {"id": 20, "question": "What keeps the planets in orbit around the Sun?", "answer": "Gravity", "options": ["Magnetism", "Wind", "Gravity", "Atmosphere"]}
        ],
        medium: [
            {"id": 1, "question": "What are the three states of matter?", "answer": "Solid, Liquid, Gas", "options": ["Solid, Plasma, Gas", "Solid, Liquid, Gas", "Solid, Liquid, Plasma", "Liquid, Gas, Plasma"]},
            {"id": 2, "question": "What is the primary function of red blood cells?", "answer": "Transport oxygen", "options": ["Fight infection", "Clot blood", "Transport oxygen", "Produce antibodies"]},
            {"id": 3, "question": "What type of rock is formed from cooled magma or lava?", "answer": "Igneous rock", "options": ["Sedimentary rock", "Metamorphic rock", "Igneous rock", "Obsidian rock"]},
            {"id": 4, "question": "What is the name of the galaxy our solar system is in?", "answer": "Milky Way", "options": ["Andromeda", "Triangulum", "Milky Way", "Whirlpool"]},
            {"id": 5, "question": "What is the unit of electrical resistance?", "answer": "Ohm", "options": ["Volt", "Ampere", "Watt", "Ohm"]},
            {"id": 6, "question": "Which scientist developed the theory of relativity?", "answer": "Albert Einstein", "options": ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"]},
            {"id": 7, "question": "What is the process by which plants make their own food?", "answer": "Photosynthesis", "options": ["Respiration", "Transpiration", "Photosynthesis", "Germination"]},
            {"id": 8, "question": "How many bones are in the adult human body?", "answer": "206", "options": ["106", "206", "306", "406"]},
            {"id": 9, "question": "What is the pH level of a neutral solution?", "answer": "7", "options": ["0", "7", "10", "14"]},
            {"id": 10, "question": "What is the largest organ in the human body?", "answer": "Skin", "options": ["Brain", "Heart", "Liver", "Skin"]},
            {"id": 11, "question": "What is the common name for the auroras seen in the sky?", "answer": "Northern/Southern Lights", "options": ["Rainbows", "Halos", "Northern/Southern Lights", "Comets"]},
            {"id": 12, "question": "What is the chemical symbol for gold?", "answer": "Au", "options": ["Ag", "Fe", "Au", "Cu"]},
            {"id": 13, "question": "Which type of lens is used to correct farsightedness?", "answer": "Convex lens", "options": ["Concave lens", "Convex lens", "Cylindrical lens", "Prism lens"]},
            {"id": 14, "question": "What is the phenomenon called when light bends as it passes from one medium to another?", "answer": "Refraction", "options": ["Reflection", "Diffraction", "Refraction", "Dispersion"]},
            {"id": 15, "question": "What is the name of the process where a caterpillar turns into a butterfly?", "answer": "Metamorphosis", "options": ["Photosynthesis", "Germination", "Pollination", "Metamorphosis"]}
        ],
        hard: [ // Changed from "difficult" to "hard"
            {"id": 1, "question": "What is the Heisenberg Uncertainty Principle?", "answer": "It states that one cannot simultaneously know the exact position and momentum of a particle.", "options": ["It states that light has both wave and particle properties.", "It states that energy cannot be created or destroyed.", "It states that one cannot simultaneously know the exact position and momentum of a particle.", "It describes the expansion of the universe."]},
            {"id": 2, "question": "What is the function of mitochondria in a cell?", "answer": "To produce energy through cellular respiration.", "options": ["Protein synthesis", "Waste removal", "To produce energy through cellular respiration.", "DNA replication"]},
            {"id": 3, "question": "What is the name of the supercontinent that existed before Pangaea?", "answer": "Rodinia", "options": ["Gondwana", "Laurasia", "Rodinia", "Columbia"]},
            {"id": 4, "question": "What is the scientific term for the fear of long words?", "answer": "Hippopotomonstrosesquippedaliophobia", "options": ["Claustrophobia", "Arachnophobia", "Hippopotomonstrosesquippedaliophobia", "Xenophobia"]},
            {"id": 5, "question": "Who is credited with discovering the structure of DNA?", "answer": "Watson, Crick, Wilkins, and Franklin", "options": ["Gregor Mendel", "Charles Darwin", "Marie Curie", "Watson, Crick, Wilkins, and Franklin"]},
            {"id": 6, "question": "What is the 'strong nuclear force' responsible for?", "answer": "Holding atomic nuclei together", "options": ["Radioactive decay", "Chemical bonding", "Holding atomic nuclei together", "Gravity between atoms"]},
            {"id": 7, "question": "What is the name of the process by which a star generates energy?", "answer": "Nuclear fusion", "options": ["Nuclear fission", "Combustion", "Nuclear fusion", "Chemical reaction"]},
            {"id": 8, "question": "Which element has the atomic number 79?", "answer": "Gold", "options": ["Silver", "Mercury", "Gold", "Lead"]},
            {"id": 9, "question": "What is the Coriolis effect?", "answer": "The deflection of moving objects when viewed from a rotating reference frame.", "options": ["The warming of the Earth's atmosphere", "The deflection of moving objects when viewed from a rotating reference frame.", "The bending of light as it passes through a gravitational field", "The phenomenon of tides in oceans."]},
            {"id": 10, "question": "What is the primary pigment responsible for the green color in plants?", "answer": "Chlorophyll", "options": ["Carotenoid", "Anthocyanin", "Chlorophyll", "Melanin"]}
        ]
    }
    // Add other subjects here (e.g., history: {... }, geography: {... })
};

export const carouselData = [
    {
        title: "Getting Started with HTML5",
        description: "Learn the basics of HTML5 and how to structure your web content effectively.",
        link: "https://www.w3schools.com/html/default.asp"
    },
    {
        title: "Mastering CSS3 for Beautiful Designs",
        description: "Dive deep into CSS3 properties and create stunning visual styles for your websites.",
        link: "https://www.w3schools.com/css/default.asp"
    },
    {
        title: "JavaScript Fundamentals for Web Interactivity",
        description: "Understand the core concepts of JavaScript to bring dynamic features to your web applications.",
        link: "https://www.javascript.com/learn"
    },
    {
        title: "Advanced Front-End Techniques",
        description: "Explore modern front-end frameworks and tools to build scalable web experiences.",
        link: "https://developer.mozilla.org/en-US/"
    }
];

// --- END Content from data.js ---

// --- Start quizApp.js content ---

// This module encapsulates all quiz application logic
const QuizApp = (function() {
    // Private variables for quiz state
    let currentSlide = 0;
    let currentQuizData = []; // Will hold the questions for the current quiz
    let currentQuestionIndex = 0; // Tracks the current question for single-question display
    let timerInterval; // Stores the setInterval ID for the timer
    let timeRemaining; // Tracks remaining time for the current question
    let quizDifficulty; // Stores the selected difficulty for timer logic
    let userAnswers = []; // NEW: To store user's selected answers

    // Define question counts by difficulty for easier management
    const QUESTION_COUNTS = {
        easy: 20,
        medium: 15,
        hard: 10,
        default: 10
    };

    // Define timer durations by difficulty
    const TIMER_DURATIONS = {
        easy: 20, // seconds
        medium: 30, // seconds
        hard: 40, // seconds
        default: 30 // seconds
    };

    /**
     * Helper function to get a DOM element by ID and log warnings/errors.
     * @param {string} id - The ID of the element to retrieve.
     * @param {boolean} isCritical - If true, logs an error; otherwise, a warning.
     * @returns {HTMLElement | null} The found element or null.
     */
    function getDomElement(id, isCritical = false) {
        const element = document.getElementById(id);
        if (!element) {
            const message = `DOM element with ID '${id}' not found.`;
            if (isCritical) {
                console.error(`Error: ${message} This is critical for the app's basic functionality.`);
            } else {
                console.warn(`Warning: ${message} Some features might be affected.`);
            }
        }
        return element;
    }

    // --- DOM Elements (UPGRADED: Using getDomElement helper) ---
    const DOM = {
        appDescriptionSection: getDomElement('app-description-section', true),
        quizSetupSection: getDomElement('quiz-setup-section', true),
        quizActiveSection: getDomElement('quiz-active-section', true),
        startSelectionButton: getDomElement('start-selection-button'),
        startQuizButton: getDomElement('start-quiz-button'),
        quizSection: getDomElement('quiz-section', true),
        submitButton: getDomElement('submit-quiz'), // This button will be dynamically shown/hidden
        quizResults: getDomElement('quiz-results'),
        explanationsAccordion: getDomElement('explanations-accordion'),
        cardCarousel: getDomElement('card-carousel'),
        carouselPrev: getDomElement('carousel-prev'),
        carouselNext: getDomElement('carousel-next'),
        themeToggle: getDomElement('theme-toggle'), // Added for dark/light mode
        restartQuizButton: getDomElement('restart-quiz-button'), // Added to go back to quiz setup
        timerDisplay: getDomElement('timer-display'), // Added to display the timer
        // NEW: Add elements for quiz navigation
        nextQuestionButton: getDomElement('next-question-btn'),
        prevQuestionButton: getDomElement('prev-question-btn'),
        quizQuestionContainer: getDomElement('quiz-question-container') // A container for single question
    };

    // --- Utility Functions ---

    /**
     * Shuffles an array and returns a NEW array (Fisher-Yates algorithm).
     * @param {Array} originalArray - The array to shuffle.
     * @returns {Array} A new shuffled array.
     */
    function shuffleArray(originalArray) {
        const newArray = [...originalArray];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Retrieves a specified number of questions for a given subject and difficulty.
     * @param {string} subject - The subject of the quiz (e.g., 'math', 'history').
     * @param {string} difficulty - The difficulty level (e.g., 'easy', 'medium', 'hard').
     * @returns {Array} An array of question objects.
     */
    function getQuestionsForQuiz(subject, difficulty) {
        if (!allQuizData[subject] ||!allQuizData[subject][difficulty]) {
            console.error(`Error: Quiz data not found for subject '${subject}' and difficulty '${difficulty}'.`);
            return [];
        }

        const questionsPool = allQuizData[subject][difficulty];
        const numQuestions = QUESTION_COUNTS[difficulty] || QUESTION_COUNTS.default;

        if (numQuestions > questionsPool.length) {
            console.warn(
                `Not enough questions available for '${subject}' on '${difficulty}' ` +
                `(${questionsPool.length} available, ${numQuestions} requested). ` +
                `Providing all available ${questionsPool.length} questions.`
            );
            return shuffleArray(questionsPool); // Return all available if not enough
        }

        return shuffleArray(questionsPool).slice(0, numQuestions);
    }

    // NEW: Timer Functions
    function getTimerDuration(difficulty) {
        return TIMER_DURATIONS[difficulty] || TIMER_DURATIONS.default;
    }

    function startQuestionTimer() {
        stopTimer(); // Clear any existing timer before starting a new one
        timeRemaining = getTimerDuration(quizDifficulty);

        if (DOM.timerDisplay) DOM.timerDisplay.textContent = `Time: ${timeRemaining}s`;

        timerInterval = setInterval(() => {
            timeRemaining--;
            if (DOM.timerDisplay) DOM.timerDisplay.textContent = `Time: ${timeRemaining}s`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                console.log(`Time's up for question ${currentQuestionIndex + 1}!`);
                userAnswers[currentQuestionIndex] = null; // Mark question as unanswered
                handleNextQuestion(); // Automatically move to the next question
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        if (DOM.timerDisplay) DOM.timerDisplay.textContent = ''; // Clear timer display
    }

    /**
     * Resets all quiz-related state variables to their initial values.
     * NEW: Centralized state reset.
     */
    function resetQuizState() {
        currentSlide = 0;
        currentQuizData = [];
        currentQuestionIndex = 0;
        userAnswers = []; // Clear stored answers
        quizDifficulty = '';
        stopTimer(); // Ensure timer is stopped
        if (DOM.quizResults) DOM.quizResults.textContent = '';
        if (DOM.explanationsAccordion) DOM.explanationsAccordion.innerHTML = '';
        if (DOM.quizQuestionContainer) DOM.quizQuestionContainer.innerHTML = ''; // Clear question display
    }

    // --- UI Rendering Functions ---

    /**
     * Renders a single quiz question into the quiz section.
     * UPGRADED: Now renders one question at a time.
     */
    function renderCurrentQuestion() {
        if (!DOM.quizQuestionContainer || currentQuizData.length === 0) {
            // Handle no questions or missing container
            if (DOM.quizQuestionContainer) DOM.quizQuestionContainer.innerHTML = '<p>No questions loaded.</p>';
            return;
        }

        if (currentQuestionIndex >= currentQuizData.length) {
            // All questions answered, proceed to submission
            handleSubmitQuiz();
            return;
        }

        // Get the current question
        const q = currentQuizData[currentQuestionIndex];
        // Ensure options exist, providing a generic fallback if not (less complex than original shuffle logic)
        const questionOptions = q.options && q.options.length > 0? shuffleArray(q.options) : shuffleArray([q.answer, "Option A", "Option B", "Option C"]);

        // Dynamically create HTML for the current question
        DOM.quizQuestionContainer.innerHTML = `
            <div class="quiz-card" data-question-index="${currentQuestionIndex}" aria-live="polite">
                <h3>${currentQuestionIndex + 1}. ${q.question}</h3>
                <div class="options">
                    ${questionOptions.map(option => `
                        <label>
                            <input type="radio" name="currentQuestion" value="${option}"
                                ${userAnswers[currentQuestionIndex] === option? 'checked' : ''}
                                aria-label="${option}"
                            >
                            ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="quiz-navigation">
                <button id="prev-question-btn" ${currentQuestionIndex === 0? 'disabled' : ''} aria-label="Previous Question">Previous</button>
                <button id="next-question-btn" aria-label="${currentQuestionIndex === currentQuizData.length - 1? 'Submit Quiz' : 'Next Question'}">
                    ${currentQuestionIndex === currentQuizData.length - 1? 'Submit Quiz' : 'Next'}
                </button>
            </div>
        `;

        // Re-attach event listeners for navigation buttons as they are re-rendered
        getDomElement('prev-question-btn')?.addEventListener('click', handlePrevQuestion);
        getDomElement('next-question-btn')?.addEventListener('click', handleNextQuestion);

        // Start timer for the new question
        startQuestionTimer();
    }

    /**
     * Renders the explanations for the quiz questions in an accordion format.
     * UPGRADED: Using named function for event listener for cleaner removal/management.
     */
    function renderExplanations() {
        if (!DOM.explanationsAccordion) return;
        DOM.explanationsAccordion.innerHTML = ''; // Clear previous explanations

        if (currentQuizData.length === 0) {
            DOM.explanationsAccordion.innerHTML = '<p>No quiz questions were loaded, so no explanations are available.</p>';
            return;
        }

        currentQuizData.forEach((q, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');
            const explanationText = q.explanation || "No specific explanation provided for this question.";

            accordionItem.innerHTML = `
                <div class="accordion-header" role="button" tabindex="0" aria-expanded="false" aria-controls="accordion-content-${index}">
                    <span>Explanation for Question ${index + 1}</span>
                    <i class="fas fa-chevron-down icon"></i>
                </div>
                <div id="accordion-content-${index}" class="accordion-content" role="region" aria-hidden="true">
                    <p><strong>Question:</strong> ${q.question}</p>
                    <p><strong>Correct Answer:</strong> ${q.answer}</p>
                    <p><strong>Your Answer:</strong> ${userAnswers[index] === null? 'Not Answered' : userAnswers[index]}</p>
                    <p><strong>Explanation:</strong> ${explanationText}</p>
                </div>
            `;
            DOM.explanationsAccordion.appendChild(accordionItem);
        });

        // Attach event listeners to new accordion headers using a named function
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', toggleAccordion);
            header.addEventListener('keydown', (event) => { // Accessibility: keyboard control
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleAccordion(event);
                }
            });
        });
    }

    /**
     * Toggles the visibility of an accordion content.
     * NEW: Named function for accordion toggling.
     * @param {Event} event - The event object.
     */
    function toggleAccordion(event) {
        const header = event.currentTarget;
        const accordionContent = header.nextElementSibling;
        const isExpanded = header.classList.toggle('active');

        header.setAttribute('aria-expanded', isExpanded);
        accordionContent.setAttribute('aria-hidden',!isExpanded);

        if (accordionContent.style.display === "block") {
            accordionContent.style.display = "none";
        } else {
            document.querySelectorAll('.accordion-content').forEach(content => {
                if (content!== accordionContent) {
                    content.style.display = "none";
                    content.previousElementSibling.classList.remove('active');
                    content.previousElementSibling.setAttribute('aria-expanded', false);
                    content.setAttribute('aria-hidden', true);
                }
            });
            accordionContent.style.display = "block";
        }
    }

    /**
     * Renders the carousel slides from the carouselData.
     * No major changes needed here, as it's separate from quiz logic.
     */
    function renderCarousel() {
        if (!DOM.cardCarousel) return;
        DOM.cardCarousel.innerHTML = '';

        carouselData.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color: #48f; text-decoration: none; font-weight: bold;">Read More</a>
            `;
            DOM.cardCarousel.appendChild(slide);
        });
    }

    /**
     * Displays a specific slide in the carousel.
     */
    function showCarouselSlide(index) {
        if (!DOM.cardCarousel) return;
        const slides = DOM.cardCarousel.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        }
        DOM.cardCarousel.style.transform = `translateX(${-currentSlide * 100}%)`;
    }

    // --- Event Handlers ---

    function handleStartSelection() {
        if (DOM.appDescriptionSection) DOM.appDescriptionSection.style.display = 'none';
        if (DOM.quizSetupSection) DOM.quizSetupSection.style.display = 'block';
    }

    function handleStartQuiz() {
        const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
        const selectedSubject = document.querySelector('input[name="subject"]:checked')?.value;

        if (!selectedDifficulty ||!selectedSubject) {
            // UPGRADED: Better user feedback than simple alert
            if (DOM.quizSetupSection) {
                let feedbackDiv = getDomElement('quiz-setup-feedback');
                if (!feedbackDiv) {
                    feedbackDiv = document.createElement('div');
                    feedbackDiv.id = 'quiz-setup-feedback';
                    feedbackDiv.style.color = 'red';
                    feedbackDiv.style.marginTop = '10px';
                    DOM.quizSetupSection.appendChild(feedbackDiv);
                }
                feedbackDiv.textContent = "Please select both a difficulty and a subject to start the quiz.";
                feedbackDiv.setAttribute('role', 'alert'); // Accessibility
            }
            return;
        } else {
            // Clear any previous feedback
            const feedbackDiv = getDomElement('quiz-setup-feedback');
            if (feedbackDiv) feedbackDiv.textContent = '';
        }

        quizDifficulty = selectedDifficulty; // Store selected difficulty for timer
        currentQuizData = getQuestionsForQuiz(selectedSubject, quizDifficulty);
        userAnswers = new Array(currentQuizData.length).fill(null); // Initialize user answers array

        if (DOM.quizSetupSection) DOM.quizSetupSection.style.display = 'none';
        if (DOM.quizActiveSection) DOM.quizActiveSection.style.display = 'block';

        renderCurrentQuestion(); // Render the first question
    }

    /**
     * Handles moving to the next question or submitting the quiz.
     * UPGRADED: Stores answer before moving, manages question index.
     */
    function handleNextQuestion() {
        // Save the answer for the current question
        const currentQuestionInputs = document.querySelectorAll(`input[name="currentQuestion"]`);
        let selectedOption = null;
        currentQuestionInputs.forEach(input => {
            if (input.checked) {
                selectedOption = input.value;
            }
        });
        userAnswers[currentQuestionIndex] = selectedOption;

        currentQuestionIndex++;
        renderCurrentQuestion(); // Renders the next question or submits
    }

    /**
     * Handles moving to the previous question.
     * NEW: Allows users to go back and change answers.
     */
    function handlePrevQuestion() {
        // Save the answer for the current question before going back
        const currentQuestionInputs = document.querySelectorAll(`input[name="currentQuestion"]`);
        let selectedOption = null;
        currentQuestionInputs.forEach(input => {
            if (input.checked) {
                selectedOption = input.value;
            }
        });
        userAnswers[currentQuestionIndex] = selectedOption;

        currentQuestionIndex--;
        if (currentQuestionIndex < 0) {
            currentQuestionIndex = 0; // Should not happen with disabled button
        }
        renderCurrentQuestion();
    }

    function handleSubmitQuiz() {
        stopTimer(); // Stop the timer when quiz is submitted

        // Calculate score from stored userAnswers
        let score = 0;
        currentQuizData.forEach((q, index) => {
            if (userAnswers[index] === q.answer) {
                score++;
            }
        });

        if (DOM.quizResults) {
            DOM.quizResults.textContent = `You scored ${score} out of ${currentQuizData.length}!`;
            DOM.quizResults.setAttribute('aria-live', 'polite'); // Accessibility: announce score
        }
        renderExplanations(); // Load explanations after submitting the quiz

        // Hide navigation buttons after submission
        if (DOM.nextQuestionButton) DOM.nextQuestionButton.style.display = 'none';
        if (DOM.prevQuestionButton) DOM.prevQuestionButton.style.display = 'none';
    }

    function handleCarouselPrev() {
        currentSlide--;
        showCarouselSlide(currentSlide);
    }

    function handleCarouselNext() {
        currentSlide++;
        showCarouselSlide(currentSlide);
    }

    // NEW: Handle theme toggle
    function handleThemeToggle() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode? 'dark' : 'light');
        if (DOM.themeToggle) {
            DOM.themeToggle.textContent = isDarkMode? 'Light Mode' : 'Dark Mode';
            DOM.themeToggle.setAttribute('aria-label', `Switch to ${isDarkMode? 'Light' : 'Dark'} Mode`); // Accessibility
        }
    }

    // NEW: Handle restart quiz
    function handleRestartQuiz() {
        resetQuizState(); // Reset all quiz state
        if (DOM.quizActiveSection) DOM.quizActiveSection.style.display = 'none';
        if (DOM.quizSetupSection) DOM.quizSetupSection.style.display = 'block';

        // Ensure navigation buttons are reset for next quiz
        if (DOM.nextQuestionButton) DOM.nextQuestionButton.style.display = 'inline-block';
        if (DOM.prevQuestionButton) DOM.prevQuestionButton.style.display = 'inline-block';
    }

    // --- Initialization ---

    /**
     * Initializes the application: attaches event listeners and sets initial UI states.
     * UPGRADED: Module pattern, theme loading, and more robust event attachment.
     */
    function initializeApp() {
        // Attach event listeners only if the DOM element exists
        DOM.startSelectionButton?.addEventListener('click', handleStartSelection);
        DOM.startQuizButton?.addEventListener('click', handleStartQuiz);
        // submitButton is now handled by renderCurrentQuestion's dynamic buttons
        DOM.carouselPrev?.addEventListener('click', handleCarouselPrev);
        DOM.carouselNext?.addEventListener('click', handleCarouselNext);
        DOM.themeToggle?.addEventListener('click', handleThemeToggle);
        DOM.restartQuizButton?.addEventListener('click', handleRestartQuiz);

        // Set initial display states
        if (DOM.appDescriptionSection) DOM.appDescriptionSection.style.display = 'block';
        if (DOM.quizSetupSection) DOM.quizSetupSection.style.display = 'none';
        if (DOM.quizActiveSection) DOM.quizActiveSection.style.display = 'none';

        // Apply saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (DOM.themeToggle) DOM.themeToggle.textContent = 'Light Mode';
        } else {
            document.body.classList.remove('dark-mode');
            if (DOM.themeToggle) DOM.themeToggle.textContent = 'Dark Mode';
        }
        DOM.themeToggle?.setAttribute('aria-label', `Switch to ${document.body.classList.contains('dark-mode')? 'Light' : 'Dark'} Mode`);

        renderCarousel(); // Render initial carousel
        showCarouselSlide(currentSlide);
    }

    // Expose only the init method to the global scope
    return {
        init: initializeApp
    };
})();

// Ensure the app initializes once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', QuizApp.init);

// --- END quizApp.js content ---