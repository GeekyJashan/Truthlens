from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os

router = APIRouter()

@router.post("/parse_doc")
async def parse_doc(file: UploadFile = File(...)):
    # Create a temporary file to save the uploaded PDF
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = os.path.join(temp_dir, file.filename)
        print(temp_path)
        
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