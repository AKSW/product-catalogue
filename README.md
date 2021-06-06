# About the project

This project was developed as part of a master's thesis at the HTWK Leipzig under the supervision of Prof. Dr. Thomas Riechert and Edgard Marx.

The title of the work is "The conception and realization of an RDF knowledge base for adaptive domain-specific product search using supervised machine learning"

This included the following tasks
- Analysis and selection of data sources for product data
- comparison, mapping and evaluation of published product ontologies
- Transformation of data from JSON/CSV to Turtle
- Extraction of implicit product attributes using supervised machine learning

## Product Ontology

Various published rdf vocabularies for product data were considered, compared and evaluated. 

The following product ontologies were considered for semantic annotation of the data:
(please note that the term "ontology" is used at this point because the following projects use it for themselves. Concretely, however, it refers to a vocabulary that can be used to describe product data in order to then create a product ontology)

- Schema.org (https://schema.org)
- GoodRelations (http://www.heppnetz.de/projects/goodrelations/)
- eClassOWL (http://www.heppnetz.de/projects/eclassowl/)
- Product Types Ontology (http://www.productontology.org)
- Building Product Ontology (https://www.projekt-scope.de/ontologies/bpo/)

These are independent projects, whereas GoodRelations is largely integrated into Schema.org and eClassOWL, as well as the Product Types Ontology, can serve as extensions for other ontologies.

The following diagram shows the number of 100 % matches between the ontologies which could be detected by a semiautomatic ontology matching using AgreementMakerLight (https://github.com/AgreementMakerLight/AML-Project).

<img width="729" alt="Venn_Ontologies" src="https://user-images.githubusercontent.com/82646763/120933479-a8243180-c6fa-11eb-9ceb-7bfe6bef1061.png">

Since an evaluation showed that Schema.org is best suited for the purposes of this master thesis and provides sufficient descriptive resources to describe all product attributes, this vocabulary was used exclusively in this project.

##  Product Data

To enable a domain-specific product search, data sources for products with very specific product attributes were needed. The decision was made to use the sample data set from the Amazon Electronics Dataset 2020 (https://data.world/promptcloud/amazon-electronics-dataset-2020) and the data from the EcoTopTen database (https://www.ecotopten.de).

## Text Classification

Since it was noticed that the product category was missing in the Amazon Electronics dataset, text classification algorithms were applied to extract it. Naive Bayes Classification and Support Vector Classification were used for this purpose.

## Clustering

In order to assemble a training dataset for product classification that has the highest possible variance and no unbalanced classes, clustering was performed beforehand. For this, the KMeans algorithm was applied in several iterations - until the clusters were homogeneous enough. Then, from each cluster, random examples were inserted into the training dataset.

The algoithms achieved the following accuracies and run times: 
<img width="813" alt="results_table" src="https://user-images.githubusercontent.com/82646763/120933603-2385e300-c6fb-11eb-8691-f2a33589a3f7.png">

Since the accuracy was higher for Support Vector Classification, the model formed in this process was applied to the entire dataset to insert the product categories. 


## RDF Produktontology Serializer

To be able to build an RDF knowledge base from the JSON and CSV data, a web application was developed. The web application allows easy transformation of datasets from their original format into the RDF syntax Turtle. To do this, the user simply needs to map the dataset attributes with RDF vocabulary.

## Product Search

To enable domain-specific adaptive product search, the generated RDF data was provided via a SPARQL endpoint and the SANTé semantic search engine built by Edgard Marx (https://github.com/AKSW/sante).
