from fastapi import FastAPI, UploadFile, File
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os

app = FastAPI()

@app.post("/api/parse_doc")
async def upload_pdf(file: UploadFile = File(...)):
    # Create a temporary file to save the uploaded PDF
    with tempfile.NameporaryDirectory() as temp_dir:
        temp_path = os.path.join(temp_dir, file.filename)
        
        # Save uploaded file to temporary location
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        try:
            # Use PyPDFLoader to extract text
            loader = PyPDFLoader(temp_path)
            pages = loader.load()
            
            # Combine all pages into a single text
            text_content = "\n".join([page.page_content for page in pages])
            
            return {"content": text_content}
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")