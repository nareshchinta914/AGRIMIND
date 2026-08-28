from fastapi import APIRouter, HTTPException
from ..schemas.chat import AssistantChatRequest, AssistantChatResponse
from ..services.assistant_service import assistant_service

router = APIRouter(tags=["Farmer AI Assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(request: AssistantChatRequest):
    """
    POST /assistant/chat
    Contextual multilingual AI advisory supporting Tamil, Telugu, Hindi, Kannada, Malayalam, Marathi, Bengali, English.
    """
    try:
        response = assistant_service.answer_query(
            message=request.message,
            language=request.language,
            context=request.farmer_context
        )

        return AssistantChatResponse(
            success=True,
            reply=response["reply"],
            language=response["language"],
            audio_text=response["audio_text"],
            suggested_actions=response["suggested_actions"],
            context_used=response["context_used"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant service error: {str(e)}")
