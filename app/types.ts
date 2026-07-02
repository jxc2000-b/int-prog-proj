export type Person = {
    id: number;
    name: string;
    height: number;
    weight: number;
    skills: string[];
    createdAt: string; 
};

export type PeopleResponse = {
    people: Person[];
    count: number;
}