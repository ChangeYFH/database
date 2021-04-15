const config = {
  endpoint: "https://yanfenghua.documents.azure.com:443/",
  key: "Q9Ur56CysYWlWRWHPAnGi09wDcAsU79FtKr5FKw22lb9sEYPvuFNPoVbugm27OKLsBPkPlzto8i5iAI6LcChbg==",
  databaseId: "Tasks",
  containerId: "Items",
  partitionKey: { kind: "Hash", paths: ["/category"] }
};

module.exports = config;