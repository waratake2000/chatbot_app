from langchain.vectorstores import Chroma
from langchain.document_loaders import WebBaseLoader, PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter

embdir_path = "/root/EmbeddingDB"

def add_man_embedding(url):

    embeddings = OpenAIEmbeddings()


    # loader = WebBaseLoader(url)
    loader = PyPDFLoader(url)
    document = loader.load()
    # document.metadata.update(classification="document")
    text_splitter = CharacterTextSplitter(
        separator="\n\n", chunk_size=500, chunk_overlap=50)

    docs = text_splitter.split_documents(document)

    db = Chroma.from_documents(docs, embedding=embeddings, persist_directory=f"{embdir_path}")
    db.persist()

url ="./fujiwara.pdf"
add_man_embedding(url)
