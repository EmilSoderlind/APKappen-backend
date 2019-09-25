#Systembolaget (SB) API translation (SWE -> ENG)

## 0. **Title of attribute**
* Swe: < Swedish name used in Systembolagets API >
* Eng: < English translation >
* Desc: < Descriptive text >
* Type: < Datatype >
* Example: < Example value of attribute >

## 1. **Id**
* Swe: nr
* Eng: Id
* Desc: Number that identify unique article. (ProductNumber + last two digits is the products packaging code)
* Type: Number
* Example: 228401

## 2. **ReferenceNumber**
* Swe: Artikelid
* Eng: ReferenceNumber
* Desc: Further information is missing
* Type: Number
* Example: 942581

## 3. **ProductNumber**
* Swe: Varnummer
* Eng: ProductNumber
* Desc: Number that identify the product. A product can have different packaging with same ProductNumber. Ex: Norrlands Guld 33cl vs 50cl.
* Type: Number
* Example: 2284

## 4. **MainName**
* Swe: Namn
* Eng: MainName
* Desc: Main name.
* Type: String
* Example: "Ferrandière"

## 5. **SubName**
* Swe: Namn2
* Eng: SubName
* Desc: Sub name.
* Type: String
* Example: "Pinot Noir"

## 6. **Price**
* Swe: Prisinklmoms
* Eng: Price
* Desc: Price (SEK).
* Type: Number
* Example: 39

## 7. **Pant**
* Swe: Pant
* Eng: Pant
* Desc: Price (SEK) for pant.
* Type: Number
* Example: 1
* Example: null

## 8. **VolumeInMl**
* Swe: Volymiml
* Eng: VolumeInMl
* Desc: Volume in ml.
* Type: Number
* Example: 750

## 9. **PricePerLitre**
* Swe: PrisPerLiter
* Eng: PricePerLitre
* Desc: Price (SEK) per litre.
* Type: Number
* Example: 52

## 10. **SaleStart**
* Swe: Saljstart
* Eng: SaleStart
* Desc: Sale start.
* Type: String
* Example: "2015-06-01"

## 11. **Deleted**
* Swe: Utgått
* Eng: Deleted
* Desc: If article is deleted from assortment.
* Type: String
* Example: "0"

## 12. **Category**
* Swe: Varugrupp
* Eng: Category
* Desc: Category in Swedish.
* Type: String
* Example: "Rött vin"
* Example: All categories is attached below (Appendix A)

## 13. **Type**
* Swe: Typ
* Eng: Type
* Desc: Type in Swedish. Somewhat like a tag and/or taste.
* Type: String
* Example: "Ljus lager"
* Example: "Kryddigt & Mustigt"

## 14. **Style**
* Swe: Stil
* Eng: Style
* Desc: Style in Swedish. Somewhat like a tag and/or taste.
* Type: String
* Example: "Starkare lager"
* Example: "Internationell stil"

## 15. **Packaging**
* Swe: Forpackning
* Eng: PackagingType
* Desc: Type of packaging in Swedish.
* Type: String
* Example: "Flaska"
* Example: "Burk"
* Example: "Box"

## 16. **Sealing**
* Swe: Forslutning
* Eng: Sealing
* Desc: Type of sealing in Swedish.
* Type: String
* Example: "Tappkran skruv"
* Example: "Skruvkapsyl"

## 17. **OriginRegion**
* Swe: Ursprung
* Eng: OriginRegion
* Desc: Origin. City/region.
* Type: String
* Example: "Kastilien-La Mancha"
* Example: "Hallands län"

## 18. **OriginCountry**
* Swe: Ursprunglandnamn
* Eng: OriginCountry
* Desc: Country of origin in Swedish.
* Type: String
* Example: "Sverige"
* Example: "Sydafrika"

## 19. **Producer**
* Swe: Producent
* Eng: Producer
* Desc: Producer.
* Type: String
* Example: "Carlsberg Sverige AB"
* Example: "Casas Patronales"

## 20. **Supplier**
* Swe: Leverantor
* Eng: Supplier
* Desc: Supplier.
* Type: String
* Example: "Independent Wine Company AB"
* Example: "Åbro Bryggeri"

## 21. **Vintage**
* Swe: Argang
* Eng: Vintage
* Desc: The year in which the grapes were harvested (Wine).
* Type: Number
* Example: 2017
* Example: 1944

## 22. **TestedVintage**
* Swe: Provadargang
* Eng: TestedVintage
* Desc: No information.
* Type: Unknown
* Example: null

## 23. **Alcohol**
* Swe: Alkoholhalt
* Eng: Alcohol
* Desc: Alcohol percentage.
* Type: Float
* Example: 13.5

## 24. **AssortmentCode**
* Swe: Sortiment
* Eng: AssortmentCode
* Desc: Assortment code.
* Type: String
* Example: "BS"
* Example: "FS"
* Example: Description attached in Appendix B.

## 25. **AssortmentDesc**
* Swe: SortimentText
* Eng: AssortmentDesc
* Desc: Assortment descriptive text in Swedish.
* Type: String
* Example: "Ordinarie sortiment"
* Example: "Övrigt sortiment"
* Example: Description attached in Appendix B.

## 26. **Ecological**
* Swe: Ekologisk
* Eng: Ecological
* Desc: If article is ecological.
* Type: Number
* Example: 1
* Example: 2

## 27. **Ethical**
* Swe: Etiskt
* Eng: Ethical
* Desc: If article is ethical.
* Type: Number
* Example: 1
* Example: 2

## 28. **Ethical**
* Swe: Koscher
* Eng: Koscher
* Desc: No information.
* Type: Number
* Example: 0
* Example: 1

## 29. **ContentsDesc**
* Swe: RavarorBeskrivning
* Eng: IngredientsDesc
* Desc: Ingridients.
* Type: String
* Example: "Kornmalt och humle."
* Example: "Shiraz."

## 30. **URL**
* Swe: < Not available in SB API >
* Eng: URL
* Desc: Systembolagets page of the article
* Type: String
* Example: "https://www.systembolaget.se/dryck/roda-viner/ferrandiere-228401"

## 31. **APK**
* Swe: < Not available in SB API >
* Eng: APK
* Desc: APK-value. APK = ((alcohol/100)\*volume)/price.
* Type: Float
* Example: 2.5961538461538463

## 32. **APKWithPant**
* Swe: < Not available in SB API >
* Eng: APKWithPant
* Desc: APK-value with pant included. APK = ((alcohol/100)\*volume)/(price+pant).
* Type: Float
* Example: 2.589928057553957

## 33. **APKScore**
* Swe: < Not available in SB API >
* Eng: APKScore
* Desc: APK Score. Substitute to APK-value to make it easier to compare different products APK. Score = APK-of-product/Max-APK-found. Number between 1 and 100.
* Type: Float
* Example: 97

## Appendix A (Note: Not up-to-date with rest of document)
### Example JSON
{
	"nr":228401,
	"Artikelid":942581,
	"Varnummer":2284,
	"Namn":"Ferrandière",
	"Namn2":"Pinot Noir",
	"Prisinklmoms":39,
	"Pant":null,
	"Volymiml":750,
	"PrisPerLiter":52,
	"Saljstart":"2015-06-01",
	"Utgatt":"0",
	"Varugrupp":"Rött vin",
	"Typ":"Kryddigt & Mustigt",
	"Stil":null,
	"Forpackning":"Flaska",
	"Forslutning":"Skruvkapsyl",
	"Ursprung":"Languedoc-Roussillon",
	"Ursprunglandnamn":"Frankrike",
	"Producent":"Domaine de la Ferrandière",
	"Leverantor":"Domaine Wines Sweden AB",
	"Argang":2016,
	"Provadargang":null,
	"Alkoholhalt":13.5,
	"Sortiment":"BS",
	"SortimentText":"Övrigt sortiment",
	"Ekologisk":0,
	"Etiskt":0,
	"Koscher":"0",
	"RavarorBeskrivning":"Pinot noir.",
	"URL":"https://www.systembolaget.se/dryck/roda-viner/ferrandiere-228401",
	"APKMedPant":2.5961538461538463,
	"APK":2.5961538461538463
}

## Appendix A
### Available categories (38 different)

- "rött vin"
- "blanddrycker"
- "cider"
- "vitt vin"
- "glögg och glühwein"
- "öl"
- "rosévin"
- "blandlådor vin"
- "smaksatt sprit"
- "sake"
- "gin och genever"
- "whisky"
- "rom"
- "aperitif och dessert"
- "vermouth"
- "likör"
- "mousserande vin"
- "armagnac och brandy"
- "akvavit"
- "punsch"
- "anissprit"
- "akvavit och kryddat brännvin"
- "alkoholfritt"
- "cognac"
- "tequila och mezcal"
- "drinkar och cocktails"
- "calvados"
- "grappa och marc"
- "bitter"
- "vodka och brännvin"
- "frukt och druvsprit"
- "blå mousserande"
- "rosé - lägre alkoholhalt"
- "vita - lägre alkoholhalt"
- "röda - lägre alkoholhalt"
- "sprit av flera typer"
- "blå stilla"
- "presentförpackningar"
- "dryckestillbehör"

## Appendix B
### Available assortments (13 different)
Note that FS should be available in all Systembolagets stores.
- FSÖ = Fast sortiment övrigt (alkoholfritt) 						
- TS = Tillfälligt sortiment (inköpt under begränsad tid)							
- TSS = Tillfälligt sortiment säsong (säsongsartiklar, såsom glögg, påsköl)							
- TSV = Tillfälligt sortiment volym (artiklar som köps i en fast volym, såsom Beaujoais Nouveau)							
- TSLS = Tillfälligt Sortiment Lokalt och Småskaligt							
- TSE = Tillfälligt sortiment exklusivt (små partier)							
- FS = Fast sortiment							
- FSN = Fast sortiment nyhet (nyheter i butikens fasta sortiment)							 			   							
- FSÖ = Fast sortiment övrigt (alkoholfritt)							
- PA = Presentartiklar							
- BS = Beställningssortiment							 			     							
- FSB = Fast sortiment från beställningssortimentet (artiklar som gått från beställningssortiment till fast sortiment)							
- IS = Privatimport
