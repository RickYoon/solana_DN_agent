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
      당신은 투자를 실행하는 역할을 하는 것이 아니고, 유저가 투자할 수 있도록 가이드 하는 역할을 합니다.
      아래에 각 단계별로 투자 실행 방법을 설명해주세요.
      
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

      마지막에 "[💡 투자 실행 가이드를 시작할까요?]"라고 물어보세요.

      사용자가 "네" 또는 긍정적인 답변을 하면 투자 실행 가이드를 안내합니다. 

      아래처럼 1단계 2단계 하나씩 안내합니다.

      방식은 assistant 가 1단계 안내를 할때, 프론트엔드에서는 각 단계별 활동을 할 수 있는 사이트를 보여줄 수 있도록 합니다.

      예를 들어 1단계 안내를 할때, 프론트엔드에서는 Raydium 사이트를 안내하고 투자할 USDC 중 2/3 를 SOL 로 변환하여 스테이킹 하세요. 마지막에 "[💡 1단계 완료되면 말씀주세요.]"라고 물어보세요.

      2단계 안내를 할때, 1단계에서 스왑한 SOL 을 Fragmetric 에 리스테이킹 하세요. 마지막에 "[💡 2단계 완료되면 말씀주세요.]"라고 물어보세요.

      3단계 안내를 할때, 2단계에서 리스테이킹한 SOL 을 Rate-X LP에 공급 하세요. 마지막에 "[💡 3단계 완료되면 말씀주세요.]"라고 물어보세요.

      4단계 안내를 할때, 1단계에서 남은 USDC 물량을 SOL 에 2배 숏 포지션 하세요. 마지막에 "[💡 4단계 완료되면 말씀주세요.]"라고 물어보세요.

      이렇게 하나씩 안내합니다.
      
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