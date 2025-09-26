// src/lib/timeline-data.ts

export interface TimelineEventData {
  year: number;
  title: string;
  description: string;
  image?: string;
  imageHint?: string;
}

interface EventTranslations {
  id: string;
  en: string;
  ar: string;
}

export interface RawEvent {
  year: EventTranslations | string;
  event: EventTranslations | string;
  image_suggestion?: string;
}

export const timelineData: { timeline: RawEvent[] } = {
  "timeline": [
    {
      "year": {
        "id": "~8000 SM",
        "en": "~8000 BC",
        "ar": "~٨٠٠٠ ق.م"
      },
      "event": {
        "id": "Kota Jericho (Ariha), yang dianggap sebagai kota tertua di dunia, telah dibangun di Palestina.",
        "en": "The city of Jericho (Ariha), considered the oldest city in the world, was built in Palestine.",
        "ar": "بُنيت مدينة أريحا، التي تُعتبر أقدم مدينة في العالم، في فلسطين."
      },
      "image_suggestion": "https://adararelief.com/wp-content/uploads/2023/10/word-image-34624-2.jpeg"
    },
    {
      "year": {
        "id": "~2500 SM",
        "en": "~2500 BC",
        "ar": "~٢٥٠٠ ق.م"
      },
      "event": {
        "id": "Bangsa Kan'an, yang datang dari Jazirah Arab, bermukim di wilayah tersebut dan menjadi penduduk pertama yang dikenal dalam sejarah. Wilayah ini kemudian dikenal sebagai 'tanah Kan'an'.",
        "en": "The Canaanites, who came from the Arabian Peninsula, settled in the region and became the first known inhabitants in history. The region later became known as the 'land of Canaan'.",
        "ar": "استقر الكنعانيون، الذين قدموا من شبه الجزيرة العربية، في المنطقة وأصبحوا أول سكان معروفين في التاريخ. عُرفت هذه المنطقة فيما بعد باسم 'أرض كنعان'."
      },
      "image_suggestion": "https://asset.kompas.com/crops/OksZxofffosn0JzOff-Y0eSjrf8=/0x75:1755x1245/1200x800/data/photo/2023/10/17/652e2b434c659.jpg"
    },
    {
      "year": {
        "id": "~1900 SM",
        "en": "~1900 BC",
        "ar": "~١٩٠٠ ق.م"
      },
      "event": {
        "id": "Nabi Ibrahim 'alaihis salam tiba di Palestina. Taurat sendiri mengakui bahwa wilayah itu sudah berpenghuni dan menyebutnya 'negeri Kan'an'.",
        "en": "Prophet Ibrahim (Abraham) 'alaihis salam arrived in Palestine. The Torah itself acknowledges that the region was already inhabited and calls it the 'land of Canaan'.",
        "ar": "وصل النبي إبراهيم عليه السلام إلى فلسطين. وتعترف التوراة نفسها بأن المنطقة كانت مأهولة بالفعل وتطلق عليها 'أرض كنعان'."
      },
      "image_suggestion": "https://harfiyahalquran.wordpress.com/wp-content/uploads/2015/05/cf80a-perjalananibrahim.jpg"
    },
    {
      "year": {
        "id": "~1250 SM",
        "en": "~1250 BC",
        "ar": "~١٢٥٠ ق.م"
      },
      "event": {
        "id": "Nabi Musa 'alaihis salam memimpin Bani Israil keluar dari perbudakan di Mesir menuju 'tanah suci' Palestina.",
        "en": "Prophet Musa (Moses) 'alaihis salam led the Children of Israel out of slavery in Egypt towards the 'holy land' of Palestine.",
        "ar": "قاد النبي موسى عليه السلام بني إسرائيل للخروج من العبودية في مصر إلى 'الأرض المقدسة' فلسطين."
      }
    },
    {
      "year": {
        "id": "1020–587 SM",
        "en": "1020–587 BC",
        "ar": "١٠٢٠–٥٨٧ ق.م"
      },
      "event": {
        "id": "Periode pemerintahan Bani Israil (Yahudi) di sebagian wilayah Palestina dimulai.",
        "en": "The period of the rule of the Children of Israel (Jews) in parts of Palestine began.",
        "ar": "بدأت فترة حكم بني إسرائيل (اليهود) في أجزاء من فلسطين."
      }
    },
    {
      "year": {
        "id": "1004–923 SM",
        "en": "1004–923 BC",
        "ar": "١٠٠٤–٩٢٣ ق.م"
      },
      "event": {
        "id": "Masa kejayaan Bani Israil di bawah kerajaan Nabi Dawud dan Nabi Sulaiman 'alaihimas salam. Nabi Sulaiman membangun Haikal (Kuil Suci) di Baitul Maqdis.",
        "en": "The golden age of the Children of Israel under the kingdoms of Prophet Dawud (David) and Prophet Sulaiman (Solomon) 'alaihimas salam. Prophet Sulaiman built the Haikal (Holy Temple) in Baitul Maqdis (Jerusalem).",
        "ar": "العصر الذهبي لبني إسرائيل تحت مملكتي النبي داود والنبي سليمان عليهما السلام. بنى النبي سليمان الهيكل (المعبد المقدس) في بيت المقدس."
      },
      "image_suggestion": "https://i.pinimg.com/1200x/ab/5e/45/ab5e45051b8cdda742c55256fe58978a.jpg"
    },
    {
      "year": {
        "id": "923 SM",
        "en": "923 BC",
        "ar": "٩٢٣ ق.م"
      },
      "event": {
        "id": "Kerajaan Bani Israil terpecah menjadi dua setelah wafatnya Nabi Sulaiman: Kerajaan Israel di utara (dengan ibu kota Samaria) dan Kerajaan Yehuda di selatan (dengan ibu kota Yerusalem).",
        "en": "The Kingdom of the Children of Israel split into two after the death of Prophet Sulaiman: the Kingdom of Israel in the north (with its capital in Samaria) and the Kingdom of Judah in the south (with its capital in Jerusalem).",
        "ar": "انقسمت مملكة بني إسرائيل إلى قسمين بعد وفاة النبي سليمان: مملكة إسرائيل في الشمال (وعاصمتها السامرة) ومملكة يهوذا في الجنوب (وعاصمتها أورشليم)."
      },
      "image_suggestion": "https://www.conformingtojesus.com/images/webpages/divided_kingdom_of_israel_and_judah1.jpg"
    },
    {
      "year": {
        "id": "722 SM",
        "en": "722 BC",
        "ar": "٧٢٢ ق.م"
      },
      "event": {
        "id": "Kerajaan Assyria menaklukkan Kerajaan Israel di utara, mengakhiri eksistensinya dan mengusir banyak penduduknya.",
        "en": "The Assyrian Empire conquered the northern Kingdom of Israel, ending its existence and expelling many of its inhabitants.",
        "ar": "غزت الإمبراطورية الآشورية مملكة إسرائيل الشمالية، وأنهت وجودها وطردت العديد من سكانها."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Assyrian_siege-engine_attacking_the_city_wall_of_Lachish%2C_part_of_the_ascending_assaulting_wave._Detail_of_a_wall_relief_dating_back_to_the_reign_of_Sennacherib%2C_700-692_BCE._From_Nineveh%2C_Iraq%2C_currently_housed_in_the_British_Museum.jpg/960px-thumbnail.jpg"
    },
    {
      "year": {
        "id": "597 SM",
        "en": "597 BC",
        "ar": "٥٩٧ ق.م"
      },
      "event": {
        "id": "Kerajaan Babilonia di bawah pimpinan Nebukadnezar II menaklukkan Kerajaan Yehuda.",
        "en": "The Babylonian Empire under Nebuchadnezzar II conquered the Kingdom of Judah.",
        "ar": "غزت الإمبراطورية البابلية تحت حكم نبوخذ نصر الثاني مملكة يهوذا."
      }
    },
    {
      "year": {
        "id": "596 SM",
        "en": "596 BC",
        "ar": "٥٩٦ ق.م"
      },
      "event": {
        "id": "Pasukan Babilonia menghancurkan Haikal Sulaiman untuk pertama kalinya. Penduduknya dibawa sebagai tawanan ke Babilonia.",
        "en": "The Babylonian army destroyed Solomon's Temple for the first time. Its inhabitants were taken as captives to Babylonia.",
        "ar": "دمر الجيش البابلي هيكل سليمان لأول مرة. وأُخذ سكانها أسرى إلى بابل."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Tissot_The_Flight_of_the_Prisoners.jpg/1280px-Tissot_The_Flight_of_the_Prisoners.jpg"
    },
    {
      "year": {
        "id": "539 SM",
        "en": "539 BC",
        "ar": "٥٣٩ ق.م"
      },
      "event": {
        "id": "Kerajaan Persia di bawah pimpinan Cyrus Agung menaklukkan Babilonia dan mengizinkan tawanan Yahudi untuk kembali ke Yerusalem.",
        "en": "The Persian Empire under Cyrus the Great conquered Babylonia and allowed Jewish captives to return to Jerusalem.",
        "ar": "غزت الإمبراطورية الفارسية تحت حكم كورش الكبير بابل وسمحت للأسرى اليهود بالعودة إلى أورشليم."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/104.Cyrus_Restores_the_Vessels_of_the_Temple.jpg/500px-104.Cyrus_Restores_the_Vessels_of_the_Temple.jpg"
    },
    {
      "year": {
        "id": "516 SM",
        "en": "516 BC",
        "ar": "٥١٦ ق.م"
      },
      "event": {
        "id": "Pembangunan kembali Haikal Sulaiman selesai pada masa pemerintahan Darius Agung dari Persia.",
        "en": "The rebuilding of Solomon's Temple was completed during the reign of Darius the Great of Persia.",
        "ar": "اكتملت إعادة بناء هيكل سليمان في عهد داريوس الكبير ملك فارس."
      },
      "image_suggestion": "https://i0.wp.com/blog.renewal.asn.au/wp-content/uploads/2020/03/rebuilding-temple.jpg?w=568&ssl=1"
    },
    {
      "year": {
        "id": "332 SM",
        "en": "332 BC",
        "ar": "٣٣٢ ق.م"
      },
      "event": {
        "id": "Alexander Agung dari Makedonia menaklukkan Persia, dan Yerusalem jatuh di bawah kekuasaan Imperium Yunani.",
        "en": "Alexander the Great of Macedon conquered Persia, and Jerusalem fell under the rule of the Greek Empire.",
        "ar": "غزا الإسكندر الأكبر المقدوني بلاد فارس، وسقطت أورشليم تحت حكم الإمبراطورية اليونانية."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Battle_of_Issus_mosaic_-_Museo_Archeologico_Nazionale_-_Naples_2013-05-16_16-25-06_BW.jpg/1280px-Battle_of_Issus_mosaic_-_Museo_Archeologico_Nazionale_-_Naples_2013-05-16_16-25-06_BW.jpg"
    },
    {
      "year": {
        "id": "63 SM",
        "en": "63 BC",
        "ar": "٦٣ ق.م"
      },
      "event": {
        "id": "Jenderal Romawi Pompeii menaklukkan Yerusalem. Palestina menjadi wilayah di bawah kendali Kekaisaran Romawi.",
        "en": "The Roman general Pompey conquered Jerusalem. Palestine became a territory under the control of the Roman Empire.",
        "ar": "غزا الجنرال الروماني بومبيوس أورشليم. وأصبحت فلسطين أرضًا تحت سيطرة الإمبراطورية الرومانية."
      }
    },
    {
      "year": {
        "id": "70 M",
        "en": "70 AD",
        "ar": "٧٠ م"
      },
      "event": {
        "id": "Jenderal Romawi, Titus, menghancurkan Haikal Sulaiman untuk kedua kalinya. Yang tersisa hanyalah sebidang tembok yang kini dikenal sebagai Tembok Ratapan.",
        "en": "The Roman general, Titus, destroyed Solomon's Temple for the second time. All that remained was a section of a wall, now known as the Wailing Wall.",
        "ar": "دمر الجنرال الروماني تيتوس هيكل سليمان للمرة الثانية. كل ما تبقى هو جزء من جدار، يُعرف الآن بحائط المبكى."
      },
      "image_suggestion": "https://nrs.hvrd.art/urn-3:HUAM:DDC253282_dynmc?width=3000&height=3000"
    },
    {
      "year": {
        "id": "132–135 M",
        "en": "132–135 AD",
        "ar": "١٣٢–١٣٥ م"
      },
      "event": {
        "id": "Pemberontakan Yahudi yang dipimpin oleh Bar Kokhba ditumpas oleh Kaisar Romawi Hadrianus. Sekitar 580.000 orang Yahudi terbunuh. Peristiwa ini menjadi titik awal diaspora (penyebaran kaum Yahudi ke seluruh dunia). Kaisar Hadrianus mengganti nama Yerusalem menjadi Aelia Capitolina dan melarang orang Yahudi memasukinya.",
        "en": "The Jewish revolt led by Bar Kokhba was crushed by the Roman Emperor Hadrian. Approximately 580,000 Jews were killed. This event marked the beginning of the diaspora (the dispersion of the Jewish people throughout the world). Emperor Hadrian renamed Jerusalem to Aelia Capitolina and forbade Jews from entering it.",
        "ar": "سحق الإمبراطور الروماني هادريان الثورة اليهودية بقيادة بار كوخبا. وقُتل ما يقرب من 580 ألف يهودي. شكل هذا الحدث بداية الشتات (تشتت الشعب اليهودي في جميع أنحاء العالم). أعاد الإمبراطور هادريان تسمية أورشليم إلى إيليا كابيتولينا ومنع اليهود من دخولها."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/d/db/Barkokhba-silver-tetradrachm.jpg"
    },
    {
      "year": {
        "id": "325 M",
        "en": "325 AD",
        "ar": "٣٢٥ م"
      },
      "event": {
        "id": "Setelah Kaisar Konstantin dari Byzantium (Romawi Timur) masuk Kristen, ia menjadikan Yerusalem sebagai kota suci bagi umat Kristen melalui Konsili Nicea.",
        "en": "After Emperor Constantine of Byzantium (Eastern Roman Empire) converted to Christianity, he made Jerusalem a holy city for Christians through the Council of Nicaea.",
        "ar": "بعد أن اعتنق الإمبراطور قسطنطين البيزنطي (الإمبراطورية الرومانية الشرقية) المسيحية، جعل أورشليم مدينة مقدسة للمسيحيين من خلال مجمع نيقية."
      }
    },
    {
      "year": {
        "id": "15 H / 636-637 M",
        "en": "15 AH / 636-637 AD",
        "ar": "١٥ هـ / ٦٣٦-٦٣٧ م"
      },
      "event": {
        "id": "Di masa Kekhalifahan Rasyidin, Khalifah Umar bin Khaththab membebaskan Palestina dari kekuasaan Byzantium. Beliau menerima kunci kota Al-Quds dan memberikan jaminan keamanan bagi penduduknya (Perjanjian 'Umariyah).",
        "en": "During the Rashidun Caliphate, Caliph Umar ibn al-Khattab liberated Palestine from Byzantine rule. He received the keys to the city of Al-Quds and provided security guarantees for its inhabitants (the 'Umariyyah Covenant).",
        "ar": "في عهد الخلافة الراشدة، حرر الخليفة عمر بن الخطاب فلسطين من الحكم البيزنطي. وتسلم مفاتيح مدينة القدس وقدم ضمانات أمنية لسكانها (العهدة العمرية)."
      },
      "image_suggestion": "https://static.republika.co.id/uploads/images/inpicture_slide/ilustrasi-ketika-umar-bin-al-khathab-menaklukkan-yerusalem-_140505113132-458.jpg"
    },
    {
      "year": {
        "id": "1099 M",
        "en": "1099 AD",
        "ar": "١٠٩٩ م"
      },
      "event": {
        "id": "Pasukan Salib dari Eropa merebut Yerusalem dan membantai sebagian besar penduduk Muslim dan Yahudi di kota itu.",
        "en": "The Crusaders from Europe captured Jerusalem and massacred most of the Muslim and Jewish inhabitants of the city.",
        "ar": "استولى الصليبيون من أوروبا على القدس وذبحوا معظم سكان المدينة من المسلمين واليهود."
      },
      "image_suggestion": "https://cdn.grid.id/crop/0x0:0x0/700x465/photo/2023/06/12/1255px-taking_of_jerusalem_by_th-20230612124113.jpg"
    },
    {
      "year": {
        "id": "1187 M",
        "en": "1187 AD",
        "ar": "١١٨٧ م"
      },
      "event": {
        "id": "Panglima Muslim, Salahuddin Al-Ayyubi, berhasil membebaskan kembali Yerusalem dari tangan Pasukan Salib.",
        "en": "The Muslim commander, Salahuddin Al-Ayyubi, successfully liberated Jerusalem from the hands of the Crusaders.",
        "ar": "نجح القائد المسلم صلاح الدين الأيوبي في تحرير القدس من أيدي الصليبيين."
      },
      "image_suggestion": "https://www.worldhistory.org/img/r/p/1500x1500/9120.jpg.webp?v=1744097652"
    },
    {
      "year": {
        "id": "1516–1918 M",
        "en": "1516–1918 AD",
        "ar": "١٥١٦–١٩١٨ م"
      },
      "event": {
        "id": "Palestina menjadi bagian dari wilayah Kekhalifahan Utsmaniyyah, di mana stabilitas wilayah terjaga selama 400 tahun.",
        "en": "Palestine became part of the territory of the Ottoman Caliphate, where regional stability was maintained for 400 years.",
        "ar": "أصبحت فلسطين جزءًا من أراضي الخلافة العثمانية، حيث تم الحفاظ على الاستقرار الإقليمي لمدة 400 عام."
      }
    },
    {
      "year": {
        "id": "1798 M",
        "en": "1798 AD",
        "ar": "١٧٩٨ م"
      },
      "event": {
        "id": "Pasukan Prancis di bawah Napoleon Bonaparte menyerang Mesir dan kemudian bergerak menuju Palestina, menandai awal intervensi modern Eropa di wilayah tersebut.",
        "en": "French forces under Napoleon Bonaparte attacked Egypt and then moved towards Palestine, marking the beginning of modern European intervention in the region.",
        "ar": "هاجمت القوات الفرنسية بقيادة نابليون بونابرت مصر ثم تحركت باتجاه فلسطين، مما يمثل بداية التدخل الأوروبي الحديث في المنطقة."
      },
      "image_suggestion": "https://static.republika.co.id/uploads/images/inpicture_slide/ukiran-antik-napoleon-bonaparte-sebelum-sphinx-berdasarkan-lukisan-jl_201026145041-909.jpg"
    },
    {
      "year": {
        "id": "1882 M",
        "en": "1882 AD",
        "ar": "١٨٨٢ م"
      },
      "event": {
        "id": "Gelombang pertama pemukiman Yahudi modern yang terorganisir dimulai di Palestina dengan dukungan finansial dari Baron Edmond de Rothschild.",
        "en": "The first wave of organized modern Jewish settlement began in Palestine with financial support from Baron Edmond de Rothschild.",
        "ar": "بدأت الموجة الأولى من الاستيطان اليهودي الحديث المنظم في فلسطين بدعم مالي من البارون إدموند دي روتشيلد."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Great_coat_of_arms_of_Rothschild_family.svg/1339px-Great_coat_of_arms_of_Rothschild_family.svg.png"
    },
    {
      "year": {
        "id": "1896 M",
        "en": "1896 AD",
        "ar": "١٨٩٦ م"
      },
      "event": {
        "id": "Theodore Herzl, seorang jurnalis Yahudi Austria-Hongaria, menerbitkan buku *Der Judenstaat* (Negara Yahudi), yang menjadi landasan ideologis gerakan Zionisme.",
        "en": "Theodore Herzl, an Austro-Hungarian Jewish journalist, published the book *Der Judenstaat* (The Jewish State), which became the ideological foundation of the Zionist movement.",
        "ar": "نشر ثيودور هرتزل، وهو صحفي يهودي نمساوي مجري، كتاب *دولة اليهود*، الذي أصبح الأساس الأيديولوجي للحركة الصهيونية."
      },
      "image_suggestion": "https://cdn.britannica.com/13/133613-050-158B766F/Theodor-Herzl.jpg?w=400&h=300&c=crop"
    },
    {
      "year": {
        "id": "1897 M",
        "en": "1897 AD",
        "ar": "١٨٩٧ م"
      },
      "event": {
        "id": "Kongres Zionis Pertama diselenggarakan di Basel, Swiss, dengan tujuan mendirikan 'tanah air bagi orang-orang Yahudi di Palestina'.",
        "en": "The First Zionist Congress was held in Basel, Switzerland, with the aim of establishing a 'homeland for the Jewish people in Palestine'.",
        "ar": "عُقد المؤتمر الصهيوني الأول في بازل بسويسرا بهدف إقامة 'وطن للشعب اليهودي في فلسطين'."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/THEODOR_HERZL_AT_THE_FIRST_ZIONIST_CONGRESS_IN_BASEL_ON_25.8.1897._%D7%AA%D7%90%D7%95%D7%93%D7%95%D7%A8_%D7%94%D7%A8%D7%A6%D7%9C_%D7%91%D7%A7%D7%95%D7%A0%D7%92%D7%A8%D7%A1_%D7%94%D7%A6%D7%99%D7%95%D7%A0%D7%99_%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F_-_1897.8.25.jpg/1280px-THEODOR_HERZL_AT_THE_FIRST_ZIONIST_CONGRESS_IN_BASEL_ON_25.8.1897._%D7%AA%D7%90%D7%95%D7%93%D7%95%D7%A8_%D7%94%D7%A8%D7%A6%D7%9C_%D7%91%D7%A7%D7%95%D7%A0%D7%92%D7%A8%D7%A1_%D7%94%D7%A6%D7%99%D7%95%D7%A0%D7%99_%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F_-_1897.8.25.jpg"
    },
    {
      "year": {
        "id": "1901 M",
        "en": "1901 AD",
        "ar": "١٩٠١ م"
      },
      "event": {
        "id": "Khalifah Utsmani, Sultan Abdul Hamid II, dengan tegas menolak tawaran Theodore Herzl untuk menjual tanah Palestina kepada Zionis dengan imbalan pembayaran utang negara.",
        "en": "The Ottoman Caliph, Sultan Abdul Hamid II, firmly rejected Theodore Herzl's offer to sell Palestinian land to the Zionists in exchange for paying off the state's debt.",
        "ar": "رفض الخليفة العثماني السلطان عبد الحميد الثاني بشدة عرض ثيودور هرتزل ببيع أراضي فلسطين للصهاينة مقابل سداد ديون الدولة."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/4/43/Sultan_Gazi_Abd%C3%BCl_Hamid_II_-_%D8%A7%D9%84%D8%B3%D9%84%D8%B7%D8%A7%D9%86_%D8%A7%D9%84%D8%BA%D8%A7%D8%B2%D9%8A_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%AD%D9%85%D9%8A%D8%AF_%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A.png"
    },
    {
      "year": {
        "id": "1916 M",
        "en": "1916 AD",
        "ar": "١٩١٦ م"
      },
      "event": {
        "id": "Inggris dan Prancis secara rahasia menandatangani Perjanjian Sykes-Picot untuk membagi-bagi wilayah Kekhalifahan Utsmaniyah di Timur Tengah.",
        "en": "Britain and France secretly signed the Sykes-Picot Agreement to divide the territories of the Ottoman Caliphate in the Middle East.",
        "ar": "وقعت بريطانيا وفرنسا سراً اتفاقية سايكس بيكو لتقسيم أراضي الخلافة العثمانية في الشرق الأوسط."
      },
      "image_suggestion": "https://eliasbejjaninews.com/wp-content/uploads/2016/05/sykes-picot-map222.jpg"
    },
    {
      "year": {
        "id": "2 Nov 1917",
        "en": "Nov 2, 1917",
        "ar": "٢ نوفمبر ١٩١٧"
      },
      "event": {
        "id": "Pemerintah Inggris mengeluarkan Deklarasi Balfour, sebuah surat yang menyatakan dukungan untuk pendirian 'tanah air nasional bagi orang-orang Yahudi' di Palestina. Ini menjadi landasan bagi mandat Inggris atas Palestina.",
        "en": "The British government issued the Balfour Declaration, a letter expressing support for the establishment of a 'national home for the Jewish people' in Palestine. This became the basis for the British Mandate for Palestine.",
        "ar": "أصدرت الحكومة البريطانية وعد بلفور، وهو رسالة تعرب عن دعمها لإنشاء 'وطن قومي للشعب اليهودي' في فلسطين. وأصبح هذا أساس الانتداب البريطاني على فلسطين."
      },
      "image_suggestion": "https://i0.wp.com/www.panjimas.com/wp-content/uploads/2018/11/Balfour-Declaration-1917.jpg?resize=720%2C375&ssl=1"
    },
    {
      "year": {
        "id": "1920–1948 M",
        "en": "1920–1948 AD",
        "ar": "١٩٢٠–١٩٤٨ م"
      },
      "event": {
        "id": "Mandat Inggris atas Palestina. Selama periode ini, Inggris memfasilitasi imigrasi besar-besaran orang Yahudi ke Palestina, yang memicu konflik dengan penduduk Arab pribumi.",
        "en": "The British Mandate for Palestine. During this period, Britain facilitated large-scale Jewish immigration to Palestine, which sparked conflict with the indigenous Arab population.",
        "ar": "الانتداب البريطاني على فلسطين. خلال هذه الفترة، سهلت بريطانيا هجرة اليهود على نطاق واسع إلى فلسطين، مما أثار الصراع مع السكان العرب الأصليين."
      },
      "image_suggestion": "https://assets.kompasiana.com/items/album/2021/05/21/exodus-1947-60a77ceb8ede48427c2c2402.jpg?t=o&v=770"
    },
    {
      "year": {
        "id": "3 Maret 1924",
        "en": "March 3, 1924",
        "ar": "٣ مارس ١٩٢٤"
      },
      "event": {
        "id": "Kekhalifahan Utsmaniyyah secara resmi dibubarkan oleh Mustafa Kemal Ataturk di Turki, menghilangkan institusi pemersatu umat Islam yang selama ini melindungi Palestina.",
        "en": "The Ottoman Caliphate was officially abolished by Mustafa Kemal Ataturk in Turkey, eliminating the unifying institution of the Muslim ummah that had protected Palestine.",
        "ar": "ألغى مصطفى كمال أتاتورك الخلافة العثمانية رسميًا في تركيا، مما أدى إلى القضاء على المؤسسة الموحدة للأمة الإسلامية التي كانت تحمي فلسطين."
      },
      "image_suggestion": "https://klikmu.co/wp-content/uploads/2021/10/mustafa-kemal-ataturk-bakal-jadi-nama-jalan-di-jakarta-ariza-bagian-dari-kerja-sama-nek-1068x711.jpg"
    },
    {
      "year": {
        "id": "1936–1939 M",
        "en": "1936–1939 AD",
        "ar": "١٩٣٦–١٩٣٩ م"
      },
      "event": {
        "id": "Revolusi Besar Arab meletus di Palestina sebagai protes terhadap imigrasi Yahudi yang masif dan kebijakan Inggris yang pro-Zionis.",
        "en": "The Great Arab Revolt erupted in Palestine in protest against massive Jewish immigration and pro-Zionist British policies.",
        "ar": "اندلعت الثورة العربية الكبرى في فلسطين احتجاجًا على الهجرة اليهودية الضخمة والسياسات البريطانية الموالية للصهيونية."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/British_military_parade%2C_Jerusalem_1936.jpg/1280px-British_military_parade%2C_Jerusalem_1936.jpg"
    },
    {
      "year": {
        "id": "29 Nov 1947",
        "en": "Nov 29, 1947",
        "ar": "٢٩ نوفمبر ١٩٤٧"
      },
      "event": {
        "id": "Majelis Umum PBB mengadopsi Resolusi 181, yang merekomendasikan pembagian Palestina menjadi negara Arab dan negara Yahudi, dengan Yerusalem sebagai entitas terpisah di bawah administrasi internasional.",
        "en": "The UN General Assembly adopted Resolution 181, which recommended the partition of Palestine into an Arab state and a Jewish state, with Jerusalem as a separate entity under international administration.",
        "ar": "تبنت الجمعية العامة للأمم المتحدة القرار 181، الذي أوصى بتقسيم فلسطين إلى دولة عربية ودولة يهودية، مع القدس ككيان منفصل تحت إدارة دولية."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/UN_Palestine_Partition_Versions_1947.jpg/800px-UN_Palestine_Partition_Versions_1947.jpg"
    },
    {
      "year": {
        "id": "1948 M",
        "en": "1948 AD",
        "ar": "١٩٤٨ م"
      },
      "event": {
        "id": "Perang Arab-Israel Pertama. Entitas Zionis memproklamasikan berdirinya negara Israel dan menguasai 77% dari wilayah Palestina. Lebih dari 726.000 warga Palestina diusir dari rumah dan tanah mereka dalam peristiwa yang dikenal sebagai *Nakba* atau 'Bencana'.",
        "en": "The First Arab-Israeli War. The Zionist entity proclaimed the establishment of the state of Israel and took control of 77% of Palestinian territory. More than 726,000 Palestinians were expelled from their homes and lands in an event known as the *Nakba* or 'Catastrophe'.",
        "ar": "الحرب العربية الإسرائيلية الأولى. أعلن الكيان الصهيوني قيام دولة إسرائيل وسيطر على 77٪ من الأراضي الفلسطينية. وطُرد أكثر من 726 ألف فلسطيني من ديارهم وأراضيهم في حدث يُعرف باسم *النكبة*."
      },
      "image_suggestion": "https://b3390993.smushcdn.com/3390993/wp-content/uploads/2017/07/Nakba-Palestina.jpg?lossy=2&strip=1&webp=1"
    },
    {
      "year": {
        "id": "14 Mei 1948",
        "en": "May 14, 1948",
        "ar": "١٤ مايو ١٩٤٨"
      },
      "event": {
        "id": "David Ben-Gurion memproklamasikan kemerdekaan Negara Israel.",
        "en": "David Ben-Gurion proclaimed the independence of the State of Israel.",
        "ar": "أعلن ديفيد بن غوريون استقلال دولة إسرائيل."
      }
    },
    {
      "year": {
        "id": "1956 M",
        "en": "1956 AD",
        "ar": "١٩٥٦ م"
      },
      "event": {
        "id": "Krisis Suez. Israel, bersekongkol dengan Inggris dan Prancis, menyerang Mesir.",
        "en": "The Suez Crisis. Israel, in collusion with Britain and France, attacked Egypt.",
        "ar": "أزمة السويس. هاجمت إسرائيل، بالتواطؤ مع بريطانيا وفرنسا، مصر."
      },
      "image_suggestion": "https://sejarahmiliter.com/wp-content/uploads/2020/01/1956_Suez_war_-_conquest_of_Sinai.jpg"
    },
    {
      "year": {
        "id": "5–10 Juni 1967",
        "en": "June 5–10, 1967",
        "ar": "٥–١٠ يونيو ١٩٦٧"
      },
      "event": {
        "id": "Perang Enam Hari. Israel melancarkan serangan dan menduduki sisa wilayah Palestina (Tepi Barat dan Jalur Gaza), serta Dataran Tinggi Golan dari Suriah dan Semenanjung Sinai dari Mesir. Ini memulai pendudukan militer yang berlangsung hingga hari ini.",
        "en": "The Six-Day War. Israel launched an attack and occupied the remaining Palestinian territories (the West Bank and the Gaza Strip), as well as the Golan Heights from Syria and the Sinai Peninsula from Egypt. This began the military occupation that continues to this day.",
        "ar": "حرب الأيام الستة. شنت إسرائيل هجومًا واحتلت ما تبقى من الأراضي الفلسطينية (الضفة الغربية وقطاع غزة)، بالإضافة إلى مرتفعات الجولان من سوريا وشبه جزيرة سيناء من مصر. وبدأ بذلك الاحتلال العسكري الذي يستمر حتى يومنا هذا."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%D7%A6%D7%A0%D7%97%D7%A0%D7%99%D7%9D_%D7%91%D7%9B%D7%95%D7%AA%D7%9C_%D7%94%D7%9E%D7%A2%D7%A8%D7%91%D7%99.jpg/800px-%D7%A6%D7%A0%D7%97%D7%A0%D7%99%D7%9D_%D7%91%D7%9B%D7%95%D7%AA%D7%9C_%D7%94%D7%9E%D7%A2%D7%A8%D7%91%D7%99.jpg"
    },
    {
      "year": {
        "id": "8 Juni 1967",
        "en": "June 8, 1967",
        "ar": "٨ يونيو ١٩٦٧"
      },
      "event": {
        "id": "Angkatan udara dan laut Israel menyerang kapal intelijen AS, USS Liberty, di perairan internasional, menewaskan 34 pelaut Amerika dan melukai 171 lainnya.",
        "en": "The Israeli air force and navy attacked the US intelligence ship, USS Liberty, in international waters, killing 34 American sailors and injuring 171 others.",
        "ar": "هاجمت القوات الجوية والبحرية الإسرائيلية سفينة المخابرات الأمريكية، يو إس إس ليبرتي، في المياه الدولية، مما أسفر عن مقتل 34 بحارًا أمريكيًا وإصابة 171 آخرين."
      }
    },
    {
      "year": {
        "id": "22 Nov 1967",
        "en": "Nov 22, 1967",
        "ar": "٢٢ نوفمبر ١٩٦٧"
      },
      "event": {
        "id": "Dewan Keamanan PBB mengeluarkan Resolusi 242, yang menyerukan penarikan Israel dari wilayah-wilayah yang diduduki dalam perang 1967 dengan imbalan perdamaian (prinsip 'tanah untuk perdamaian').",
        "en": "The UN Security Council issued Resolution 242, which called for Israel's withdrawal from territories occupied in the 1967 war in exchange for peace (the 'land for peace' principle).",
        "ar": "أصدر مجلس الأمن الدولي القرار 242، الذي دعا إلى انسحاب إسرائيل من الأراضي المحتلة في حرب 1967 مقابل السلام (مبدأ 'الأرض مقابل السلام')."
      }
    },
    {
      "year": {
        "id": "6–25 Okt 1973",
        "en": "Oct 6–25, 1973",
        "ar": "٦–٢٥ أكتوبر ١٩٧٣"
      },
      "event": {
        "id": "Perang Yom Kippur (Perang Ramadhan). Mesir dan Suriah melancarkan serangan mendadak untuk merebut kembali wilayah mereka yang diduduki Israel.",
        "en": "The Yom Kippur War (Ramadan War). Egypt and Syria launched a surprise attack to reclaim their territories occupied by Israel.",
        "ar": "حرب يوم الغفران (حرب رمضان). شنت مصر وسوريا هجومًا مفاجئًا لاستعادة أراضيهما التي تحتلها إسرائيل."
      }
    },
    {
      "year": {
        "id": "1982",
        "en": "1982",
        "ar": "١٩٨٢"
      },
      "event": {
        "id": "Israel menginvasi Lebanon dengan dalih untuk mengusir PLO. Pengepungan brutal atas Beirut dan pembantaian di kamp pengungsi Sabra dan Shatila terjadi, di mana ribuan warga sipil Palestina dibunuh oleh milisi sekutu Israel.",
        "en": "Israel invaded Lebanon under the pretext of expelling the PLO. A brutal siege of Beirut and the massacre at the Sabra and Shatila refugee camps occurred, where thousands of Palestinian civilians were killed by Israeli-allied militias.",
        "ar": "غزت إسرائيل لبنان بحجة طرد منظمة التحرير الفلسطينية. ووقع حصار وحشي لبيروت ومذبحة في مخيمي صبرا وشاتيلا للاجئين، حيث قُتل آلاف المدنيين الفلسطينيين على أيدي ميليشيات متحالفة مع إسرائيل."
      },
      "image_suggestion": "https://spiritofaqsa.or.id/wp-content/uploads/2020/09/Tragedi-Pembantaian-Sabra-dan-Shatila_4-kajian-palestina-www.aqsainstitute.org_-1.png"
    },
    {
      "year": {
        "id": "14 Des 1987",
        "en": "Dec 14, 1987",
        "ar": "١٤ ديسمبر ١٩٨٧"
      },
      "event": {
        "id": "Gerakan Perlawanan Islam, Hamas, didirikan oleh Syaikh Ahmad Yasin di tengah Intifadah (pemberontakan) pertama rakyat Palestina melawan pendudukan Israel.",
        "en": "The Islamic Resistance Movement, Hamas, was founded by Sheikh Ahmed Yassin amidst the first Intifada (uprising) of the Palestinian people against the Israeli occupation.",
        "ar": "تأسست حركة المقاومة الإسلامية، حماس، على يد الشيخ أحمد ياسين في خضم الانتفاضة الأولى للشعب الفلسطيني ضد الاحتلال الإسرائيلي."
      },
      "image_suggestion": "https://kisahikmah.com/wp-content/uploads/2019/12/Syaikh-Ahmad-Yasin.jpg"
    },
    {
      "year": {
        "id": "1991",
        "en": "1991",
        "ar": "١٩٩١"
      },
      "event": {
        "id": "Sayap militer Hamas, Batalyon Izzuddin Al-Qassam, didirikan.",
        "en": "The military wing of Hamas, the Izz ad-Din al-Qassam Brigades, was established.",
        "ar": "تأسس الجناح العسكري لحماس، كتائب عز الدين القسام."
      },
      "image_suggestion": "https://static.promediateknologi.id/crop/6x13:690x418/750x500/webp/photo/p1/04/2023/11/13/Pakar-Militer-Sebut-Brigade-Al-Qassam-Masih-Punya-Empat-Batalion-Mematikan-yang-Belum-Muncul-dalam-Perang-Darat-658359940.jpg"
    },
    {
      "year": {
        "id": "1993",
        "en": "1993",
        "ar": "١٩٩٣"
      },
      "event": {
        "id": "Perjanjian Damai Oslo ditandatangani antara Israel dan PLO, yang mengarah pada pembentukan Otoritas Palestina dengan otonomi terbatas di Tepi Barat dan Jalur Gaza.",
        "en": "The Oslo Accords were signed between Israel and the PLO, leading to the establishment of the Palestinian Authority with limited autonomy in the West Bank and Gaza Strip.",
        "ar": "تم توقيع اتفاقيات أوسلو بين إسرائيل ومنظمة التحرير الفلسطينية، مما أدى إلى إنشاء السلطة الفلسطينية بحكم ذاتي محدود في الضفة الغربية وقطاع غزة."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg/960px-Bill_Clinton%2C_Yitzhak_Rabin%2C_Yasser_Arafat_at_the_White_House_1993-09-13.jpg"
    },
    {
      "year": {
        "id": "22 Maret 2004",
        "en": "March 22, 2004",
        "ar": "٢٢ مارس ٢٠٠٤"
      },
      "event": {
        "id": "Pendiri Hamas, Syaikh Ahmad Yasin, meninggal syahid akibat serangan helikopter Israel saat ia meninggalkan masjid setelah salat Subuh.",
        "en": "The founder of Hamas, Sheikh Ahmed Yassin, was martyred in an Israeli helicopter attack as he was leaving the mosque after dawn prayers.",
        "ar": "استشهد مؤسس حماس الشيخ أحمد ياسين في هجوم بطائرة هليكوبتر إسرائيلية أثناء مغادرته المسجد بعد صلاة الفجر."
      }
    },
    {
      "year": {
        "id": "2006",
        "en": "2006",
        "ar": "٢٠٠٦"
      },
      "event": {
        "id": "Hamas memenangkan pemilihan legislatif Palestina secara mutlak dengan perolehan lebih dari 60% suara.",
        "en": "Hamas won the Palestinian legislative elections outright with more than 60% of the vote.",
        "ar": "فازت حماس في الانتخابات التشريعية الفلسطينية بأغلبية ساحقة بأكثر من 60٪ من الأصوات."
      },
      "image_suggestion": "https://theintercept.com/wp-content/uploads/2021/04/AP05012803820.jpg?w=2000"
    },
    {
      "year": {
        "id": "2008–2009",
        "en": "2008–2009",
        "ar": "٢٠٠٨–٢٠٠٩"
      },
      "event": {
        "id": "Israel melancarkan 'Operasi Cast Lead', sebuah serangan militer besar-besaran selama tiga minggu di Jalur Gaza yang menewaskan lebih dari 1.400 warga Palestina.",
        "en": "Israel launched 'Operation Cast Lead', a major three-week military offensive in the Gaza Strip that killed more than 1,400 Palestinians.",
        "ar": "شنت إسرائيل 'عملية الرصاص المصبوب'، وهي هجوم عسكري كبير استمر ثلاثة أسابيع في قطاع غزة وأسفر عن مقتل أكثر من 1400 فلسطيني."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Cast_lead_map.png/960px-Cast_lead_map.png"
    },
    {
      "year": {
        "id": "2012",
        "en": "2012",
        "ar": "٢٠١٢"
      },
      "event": {
        "id": "Pada 29 November, Majelis Umum PBB mengakui Palestina sebagai 'Negara Pengamat Non-Anggota', sebuah peningkatan status diplomatik yang signifikan.",
        "en": "On November 29, the UN General Assembly recognized Palestine as a 'Non-Member Observer State', a significant diplomatic upgrade.",
        "ar": "في 29 نوفمبر، اعترفت الجمعية العامة للأمم المتحدة بفلسطين كـ 'دولة مراقبة غير عضو'، وهو ترقية دبلوماسية مهمة."
      },
      "image_suggestion": "https://image.idntimes.com/post/20240419/palestina-4e7949ab0e9a7979adec90e17d96ceda.jpeg?tr=w-1200,f-webp,q-75&width=1200&format=webp&quality=75"
    },
    {
      "year": {
        "id": "Nov 2012",
        "en": "Nov 2012",
        "ar": "نوفمبر ٢٠١٢"
      },
      "event": {
        "id": "Israel melancarkan ‘Operation Pillar of Cloud’ di Gaza, yang dimulai dengan pembunuhan komandan militer Hamas, Ahmad Jabari.",
        "en": "Israel launched ‘Operation Pillar of Defense’ in Gaza, which began with the assassination of Hamas military commander Ahmad Jabari.",
        "ar": "شنت إسرائيل 'عملية عمود السحاب' في غزة، والتي بدأت باغتيال القائد العسكري لحماس أحمد الجعبري."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/IronDome246.jpg/576px-IronDome246.jpg"
    },
    {
      "year": {
        "id": "2014",
        "en": "2014",
        "ar": "٢٠١٤"
      },
      "event": {
        "id": "Israel melancarkan 'Operasi Protective Edge', perang selama 50 hari di Gaza yang mengakibatkan lebih dari 2.200 warga Palestina tewas, sebagian besar warga sipil.",
        "en": "Israel launched 'Operation Protective Edge', a 50-day war in Gaza that resulted in the deaths of more than 2,200 Palestinians, mostly civilians.",
        "ar": "شنت إسرائيل 'عملية الجرف الصامد'، وهي حرب استمرت 50 يومًا في غزة وأسفرت عن مقتل أكثر من 2200 فلسطيني، معظمهم من المدنيين."
      }
    },
    {
      "year": {
        "id": "2018–2019",
        "en": "2018–2019",
        "ar": "٢٠١٨–٢٠١٩"
      },
      "event": {
        "id": "Warga Palestina di Gaza memulai 'Great March of Return', serangkaian protes mingguan di sepanjang pagar perbatasan yang menuntut hak untuk kembali dan diakhirinya blokade. Pasukan Israel menewaskan lebih dari 200 pengunjuk rasa.",
        "en": "Palestinians in Gaza began the 'Great March of Return', a series of weekly protests along the border fence demanding the right of return and an end to the blockade. Israeli forces killed more than 200 protesters.",
        "ar": "بدأ الفلسطينيون في غزة 'مسيرة العودة الكبرى'، وهي سلسلة من الاحتجاجات الأسبوعية على طول السياج الحدودي للمطالبة بحق العودة وإنهاء الحصار. وقتلت القوات الإسرائيلية أكثر من 200 متظاهر."
      }
    },
    {
      "year": {
        "id": "Mei 2018",
        "en": "May 2018",
        "ar": "مايو ٢٠١٨"
      },
      "event": {
        "id": "Amerika Serikat secara resmi memindahkan kedutaan besarnya di Israel dari Tel Aviv ke Yerusalem, sebuah langkah yang memicu protes luas dan menewaskan puluhan warga Palestina di Gaza.",
        "en": "The United States officially moved its embassy in Israel from Tel Aviv to Jerusalem, a move that sparked widespread protests and resulted in the deaths of dozens of Palestinians in Gaza.",
        "ar": "نقلت الولايات المتحدة رسميًا سفارتها في إسرائيل من تل أبيب إلى القدس، وهي خطوة أثارت احتجاجات واسعة وأسفرت عن مقتل العشرات من الفلسطينيين في غزة."
      },
      "image_suggestion": "https://cdn1-production-images-kly.akamaized.net/WraN4l9ZrveQbI_WIaDz3sxRScc=/1231x710/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/2212213/original/048403900_1526288973-20180514-Yerusalem-1.jpg"
    },
    {
      "year": {
        "id": "2020",
        "en": "2020",
        "ar": "٢٠٢٠"
      },
      "event": {
        "id": "Abraham Accords ditandatangani, menormalisasi hubungan antara Israel dengan Uni Emirat Arab, Bahrain, Maroko, Sudan, yang merupakan pengkhianatan terhadap perjuangan rakyat Palestina.",
        "en": "The Abraham Accords were signed, normalizing relations between Israel and the United Arab Emirates, Bahrain, Morocco, and Sudan, which is considered a betrayal of the Palestinian people's struggle.",
        "ar": "تم توقيع اتفاقيات أبراهام، التي تطبع العلاقات بين إسرائيل والإمارات العربية المتحدة والبحرين والمغرب والسودان، والتي تعتبر خيانة لنضال الشعب الفلسطيني."
      },
      "image_suggestion": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/President_Trump_and_The_First_Lady_Participate_in_an_Abraham_Accords_Signing_Ceremony_%2850345629858%29.jpg/500px-President_Trump_and_The_First_Lady_Participate_in_an_Abraham_Accords_Signing_Ceremony_%2850345629858%29.jpg"
    },
    {
      "year": {
        "id": "Mei 2021",
        "en": "May 2021",
        "ar": "مايو ٢٠٢١"
      },
      "event": {
        "id": "Ketegangan di Yerusalem Timur, terutama di Sheikh Jarrah dan Masjid Al-Aqsa, memicu konflik 11 hari. Hamas menembakkan roket ke Israel, yang dibalas dengan serangan udara besar-besaran di Gaza, menewaskan lebih dari 250 warga Palestina.",
        "en": "Tensions in East Jerusalem, particularly in Sheikh Jarrah and the Al-Aqsa Mosque, sparked an 11-day conflict. Hamas fired rockets into Israel, which was met with a massive aerial bombardment of Gaza, killing more than 250 Palestinians.",
        "ar": "أثارت التوترات في القدس الشرقية، وخاصة في الشيخ جراح والمسجد الأقصى، صراعًا استمر 11 يومًا. أطلقت حماس صواريخ على إسرائيل، قوبلت بقصف جوي مكثف على غزة، مما أسفر عن مقتل أكثر من 250 فلسطينيًا."
      }
    },
    {
      "year": {
        "id": "7 Oktober 2023",
        "en": "October 7, 2023",
        "ar": "٧ أكتوبر ٢٠٢٣"
      },
      "event": {
        "id": "Hamas melancarkan serangan mendadak berskala besar ke Israel selatan. Sebagai tanggapan, Israel menyatakan perang dan memulai kampanye pengeboman besar-besaran serta invasi darat ke Jalur Gaza.",
        "en": "Hamas launched a large-scale surprise attack on southern Israel. In response, Israel declared war and began a massive bombing campaign and ground invasion of the Gaza Strip.",
        "ar": "شنت حماس هجومًا مفاجئًا واسع النطاق على جنوب إسرائيل. رداً على ذلك، أعلنت إسرائيل الحرب وبدأت حملة قصف واسعة النطاق وغزوًا بريًا لقطاع غزة."
      },
      "image_suggestion": "https://www.historicalmaterialism.org/wp-content/uploads/2024/05/F231007YM31-1536x1024.jpg"
    },
    {
      "year": {
        "id": "2023–2024",
        "en": "2023–2024",
        "ar": "٢٠٢٣–٢٠٢٤"
      },
      "event": {
        "id": "Perang Israel-Hamas mengakibatkan krisis kemanusiaan yang parah di Gaza. Lebih dari 30.000 warga Palestina tewas dalam beberapa bulan pertama, dengan sebagian besar wilayah hancur dan penduduk menghadapi kelaparan.",
        "en": "The Israel-Hamas war resulted in a severe humanitarian crisis in Gaza. More than 30,000 Palestinians were killed in the first few months, with large parts of the territory destroyed and the population facing starvation.",
        "ar": "أسفرت حرب إسرائيل وحماس عن أزمة إنسانية حادة في غزة. وقُتل أكثر من 30 ألف فلسطيني في الأشهر القليلة الأولى، مع تدمير أجزاء كبيرة من القطاع ومواجهة السكان للمجاعة."
      },
      "image_suggestion": "https://dims.apnews.com/dims4/default/2ff4638/2147483647/strip/true/crop/853x514+0+0/resize/1534x924!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fce%2Fc7%2Fc3590c574231b99dc4feeb778bdb%2Fmuwasi-after-crop.jpg"
    },
    {
      "year": {
        "id": "Januari 2024",
        "en": "January 2024",
        "ar": "يناير ٢٠٢٤"
      },
      "event": {
        "id": "Mahkamah Internasional (ICJ), dalam kasus yang diajukan oleh Afrika Selatan, memerintahkan Israel untuk mengambil semua tindakan untuk mencegah tindakan genosida di Gaza dan memastikan bantuan kemanusiaan sampai kepada penduduk.",
        "en": "The International Court of Justice (ICJ), in a case brought by South Africa, ordered Israel to take all measures to prevent acts of genocide in Gaza and to ensure that humanitarian aid reaches the population.",
        "ar": "أمرت محكمة العدل الدولية، في قضية رفعتها جنوب أفريقيا، إسرائيل باتخاذ جميع التدابير لمنع أعمال الإبادة الجماعية في غزة وضمان وصول المساعدات الإنسانية إلى السكان."
      }
    },
    {
      "year": {
        "id": "Agustus 2024",
        "en": "August 2024",
        "ar": "أغسطس ٢٠٢٤"
      },
      "event": {
        "id": "Aksi-aksi solidaritas internasional untuk Gaza sejak 2023 mencakup gerakan kampanye 'All Eyes on Gaza', unjuk rasa global, serta partisipasi aktivis iklim Greta Thunberg dalam gerakan 'Fridays for Future' dan misi kemanusiaan 'Freedom Flotilla' yang berlayar untuk mencoba menembus blokade. Namun, pembantaian masih terus terjadi.",
        "en": "International solidarity actions for Gaza since 2023 include the 'All Eyes on Gaza' campaign movement, global demonstrations, as well as the participation of climate activist Greta Thunberg in the 'Fridays for Future' movement and the 'Freedom Flotilla' humanitarian mission that sailed to try to break the blockade. However, the massacres are still ongoing.",
        "ar": "تشمل أعمال التضامن الدولي مع غزة منذ عام 2023 حركة حملة 'كل العيون على غزة' والمظاهرات العالمية، بالإضافة إلى مشاركة الناشطة المناخية غريتا ثونبرج في حركة 'أيام الجمعة من أجل المستقبل' وبعثة 'أسطول الحرية' الإنسانية التي أبحرت لمحاولة كسر الحصار. ومع ذلك، لا تزال المذابح مستمرة."
      },
      "image_suggestion": "https://e3.365dm.com/25/07/2048x1152/skynews-muhammad-zakariya-malnutrition_6971569.jpg?20250723111505"
    }
  ]
}
