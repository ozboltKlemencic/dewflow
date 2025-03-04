"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useReducer, useRef, useState, useTransition } from "react";
import { AnswerSchema } from "@/lib/validations";
import dynamic from "next/dynamic";
import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  questionId: string;
  questionContent: string;
  questionTitle: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswearing, startAnswearingTransition] = useTransition();
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnswearingTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });
      if (result.success) {
        form.reset();

        toast({
          title: "Success",
          description: "Answer posted successfully",
        });

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: "An Error occurred while posting your answer",
          description: result?.error?.message,
          variant: "destructive",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status != "authenticated") {
      return toast({
        title: "PLease log in",
        description: "YOu need to be logged in to use this feature",
        variant: "destructive",
      });
    }

    setIsAiSubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }

      const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        form.trigger("content", formattedAnswer);
      }

      toast({
        title: "Succes",
        description: "AI answer has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsAiSubmitting(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAiSubmitting}
          onClick={generateAIAnswer}
        >
          {isAiSubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate Ai answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className=" flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end ">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswearing ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" /> Posting...
                </>
              ) : (
                "Post answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AnswerForm;
