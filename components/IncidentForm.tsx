"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentSchema, type IncidentFormData } from "@/lib/schema";

const CONCERN_TYPES = [
  "Harassment or bullying",
  "Discrimination",
  "Abuse or exploitation",
  "Data/privacy issue",
  "Code of conduct concern",
  "Other",
];

const LOCATIONS = [
  "Online (platform/event/chat)",
  "In person",
  "During a For Youth, By Youth activity",
  "Other",
];

export default function IncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      concernTypes: [],
      locations: [],
      honeypot: "",
    },
  });

  const watchConcernTypes = watch("concernTypes");
  const watchLocations = watch("locations");

  const onSubmit = async (data: IncidentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-stone-900 mb-2">
          Report submitted
        </h2>
        <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
          Your concern has been sent to the safeguarding lead. No data has been
          stored on this device.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-medium text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition-colors"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Honeypot */}
      <input
        type="text"
        {...register("honeypot")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Concern Type */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-900 mb-1">
          Type of concern
        </legend>
        <p className="text-xs text-stone-400 mb-3">Select all that apply.</p>
        <div className="space-y-2">
          {CONCERN_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-stone-300 cursor-pointer transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50"
            >
              <input
                type="checkbox"
                value={type}
                {...register("concernTypes")}
                className="w-4 h-4 rounded border-stone-300"
              />
              <span className="text-sm text-stone-700">{type}</span>
            </label>
          ))}
        </div>
        {watchConcernTypes?.includes("Other") && (
          <input
            type="text"
            placeholder="Please describe..."
            {...register("otherConcernType")}
            className="mt-3 w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all placeholder:text-stone-300"
          />
        )}
        {errors.concernTypes && (
          <p className="mt-2 text-xs text-red-600">{errors.concernTypes.message}</p>
        )}
      </fieldset>

      {/* Date */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-900 mb-1">
          When did this happen?
        </legend>
        <input
          type="date"
          {...register("date")}
          className="w-full sm:w-auto text-sm px-3 py-2.5 rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all text-stone-700"
        />
        {errors.date && (
          <p className="mt-2 text-xs text-red-600">{errors.date.message}</p>
        )}
      </fieldset>

      {/* Location */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-900 mb-1">
          Where did this happen?
        </legend>
        <p className="text-xs text-stone-400 mb-3">Select all that apply.</p>
        <div className="space-y-2">
          {LOCATIONS.map((loc) => (
            <label
              key={loc}
              className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-stone-300 cursor-pointer transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50"
            >
              <input
                type="checkbox"
                value={loc}
                {...register("locations")}
                className="w-4 h-4 rounded border-stone-300"
              />
              <span className="text-sm text-stone-700">{loc}</span>
            </label>
          ))}
        </div>
        {watchLocations?.includes("Other") && (
          <input
            type="text"
            placeholder="Describe the location..."
            {...register("otherLocation")}
            className="mt-3 w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all placeholder:text-stone-300"
          />
        )}
        {errors.locations && (
          <p className="mt-2 text-xs text-red-600">{errors.locations.message}</p>
        )}
      </fieldset>

      {/* Email (Optional) */}
      <fieldset>
        <legend className="text-sm font-semibold text-stone-900 mb-1">
          Your email
          <span className="font-normal text-stone-400 ml-1">— optional</span>
        </legend>
        <p className="text-xs text-stone-400 mb-3">
          Only shared with the safeguarding lead if you choose to provide it.
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-all placeholder:text-stone-300"
        />
        {errors.email && (
          <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>
        )}
      </fieldset>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
