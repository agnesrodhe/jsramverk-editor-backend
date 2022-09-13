
Använda Agnes API
-----

För att använda mitt API behöver du egentligen inte göra så mycket. Det finns en möjlighet att lägga till användarnamn och lösenord genom att installera npm install --save dotenv och sedan i en fil som heter .env lägga in: 
ATLAS_USERNAME="namn på databasen"
ATLAS_PASSWORD="lösenord"

Sedan använder du variablarna i dsn-strängen.

Routes
-------

Jag har valt att strukturera min routes enligt följande:
/documents - här visar jag alla och sparar nya dokument
/documents/init - initierar färdiga dokument
/documents/update - här uppdaterar jag befintliga dokument
/documents/delete - Här raderar jag befintliga dokument