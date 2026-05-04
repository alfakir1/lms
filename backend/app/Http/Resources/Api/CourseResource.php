<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => (float) $this->price,
            'status' => $this->status,
            'instructor_id' => $this->instructor_id,
            'parent_id' => $this->parent_id,
            'group_name' => $this->group_name,
            'duration_days' => $this->duration_days,
            'min_students' => $this->min_students,
            'max_students' => $this->max_students,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'instructor' => $this->whenLoaded('instructor', function() {
                return [
                    'id' => $this->instructor->id,
                    'name' => $this->instructor->user->name ?? 'Unknown',
                    'email' => $this->instructor->user->email ?? '',
                    'bio' => $this->instructor->bio,
                    'user' => $this->instructor->relationLoaded('user') ? [
                        'id' => $this->instructor->user->id,
                        'name' => $this->instructor->user->name,
                        'email' => $this->instructor->user->email,
                    ] : null,
                ];
            }),
            'parent' => new CourseResource($this->whenLoaded('parent')),
            'lessons_count' => $this->lessons_count ?? $this->lessons()->count(),
            'enrollments_count' => $this->enrollments_count ?? $this->enrollments()->count(),
            
            // Detailed relations (only when loaded)
            'lessons' => $this->whenLoaded('lessons'),
            'instances' => CourseResource::collection($this->whenLoaded('instances')),
            'assignments' => $this->whenLoaded('assignments'),
        ];
    }
}
