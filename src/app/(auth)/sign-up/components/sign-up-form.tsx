// /app/sign-up/sign-up-form.tsx
"use client";

import createUser from "@/actions/create/createUser legacy";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

// useActionStateでは、isPendingは内部で管理されるため、
// アクション関数に渡される state の型は isPending を除いた型にする必要があります。
interface FormState {
  error: string | null;
  success: boolean;
  sheetId: string | null;
  user: User | null;
  isPending: boolean;
}
type ActionState = Omit<FormState, "isPending">;

// 初期状態は ActionState の型に合わせる
const initialState: ActionState = {
  error: null,
  success: false,
  sheetId: null,
  user: null,
};

interface ButtonText {
  isPending: boolean;
  success: boolean;
}

const buttonText = ({ isPending, success }: ButtonText): string => {
  if (isPending) {
    return "登録中です";
  }
  if (success) {
    return "シートのページに移動します";
  }
  return "サインインする";
};

// アクション関数の第一引数の型を ActionState に合わせる
const createUserAction = async (
  state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  // state は使わず formData をそのまま createUser に渡す
  return createUser(formData);
};

export default function SignUpForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createUserAction, initialState);

  // createUser の返り値に sheetId が含まれていればリダイレクト
  useEffect(() => {
    if (state.sheetId) {
      router.push(`/s/${state.sheetId}`);
    }
  }, [state.sheetId, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="userName">ユーザー名</label>
      <input
        className="border p-2"
        type="text"
        id="userName"
        name="userName"
        required
      />

      <label htmlFor="sheetName">シート名</label>
      <input
        className="border p-2"
        type="text"
        id="sheetName"
        name="sheetName"
      />

      <button
        className="border p-2 bg-sky-100"
        type="submit"
        disabled={isPending}
      >
        {buttonText({ isPending, success: state.success })}
      </button>

      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-green-500">ユーザーとシートが作成されました！</p>
      )}
    </form>
  );
}
