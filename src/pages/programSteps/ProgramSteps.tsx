import { ActionFunctionArgs, redirect } from "react-router-dom";
import supabase from "../../supabase";
import { ZMeasurementProgramStep } from "../../types/ZodDBTypes";

export const newProgramStepAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const bodyParams = Object.fromEntries(
    new URLSearchParams(await request.text()).entries()
  );
  const stepData = ZMeasurementProgramStep.safeParse(bodyParams);

  if (!stepData.success) {
    throw new Response("", { status: 400, statusText: "Invalid programId" });
  }

  const { data: step, error } = await supabase
    .from("MeasurementProgramStep")
    .insert({
      ...stepData.data,
    })
    .select()
    .single();
  console.log(step, error);
  if (!step || error)
    throw new Response("", { status: 500, statusText: "Creation failed" });

  return redirect(`/programs/${stepData.data.programId}`);
};

export const deleteProgramStepAction = async ({
  params,
  request
}: ActionFunctionArgs) => {
  const programStepId = Number(params.programStepId);
  if (isNaN(programStepId))
    throw new Response("", { status: 400, statusText: "Wrong programStepId" });

  const bodyParams = Object.fromEntries(new URLSearchParams(await request.text()).entries());

  const { error } = await supabase
    .from("MeasurementProgramStep")
    .delete()
    .eq("id", programStepId);
  if (error) throw new Response("", { status: 500, statusText: error.message });

  return redirect(`/programs/${bodyParams.programId}`);
};
