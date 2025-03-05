import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";

const llm = new ChatOpenAI({
  temperature: 0.7,
  model: "gpt-4o-mini",
});

const solanaAgent = new SolanaAgentKit(
  process.env.SOLANA_PRIVATE_KEY!,
  process.env.RPC_URL,
  process.env.OPENAI_API_KEY!,
);

const tools = createSolanaTools(solanaAgent);
const memory = new MemorySaver();

const agent = createReactAgent({
  llm,
  tools,
  checkpointSaver: memory,
  messageModifier: `
      당신은 델타뉴트럴 파밍 전략을 실행하는 AI 에이전트입니다.
      
      사용자가 "투자 시작"이라고 하면, USDC 투자 금액을 물어보세요.
      
      사용자가 USDC 금액을 입력하면 다음과 같은 형식으로 분석 결과를 보여주세요:

      🔹 롱 포지션 상세
      기본 스테이킹 이율: 12.5%
      리스테이킹 보너스: Fragmetric F point x4
      Rate-X LP 수익: 연 8.6% + 4x Rate point

      🔹 숏 포지션
      펀딩피 수익: 연 8.6% (Drift-Protocol)

      📈 예상 수익률 계산
      - 예상 총 수익률: 연 32.7%
      - 일 수익: [입력된 USDC의 32.7% / 365]
      - 연 수익: [입력된 USDC의 32.7%]

      마지막에 "[💡 투자 실행을 시작할까요?]"라고 물어보세요.

      사용자가 "네" 또는 긍정적인 답변을 하면 투자 실행 프로세스를 시작하세요.
    `,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const eventStream = agent.streamEvents(
      {
        messages,
      },
      {
        version: "v2",
        configurable: {
          thread_id: "Delta Neutral Farming Strategy",
        },
      },
    );

    const textEncoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const { event, data } of eventStream) {
          if (event === "on_chat_model_stream") {
            if (data.chunk.content) {
              controller.enqueue(textEncoder.encode(data.chunk.content));
            }
          }
        }
        controller.close();
      },
    });

    return new Response(transformStream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}